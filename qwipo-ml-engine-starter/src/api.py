# src/api.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import pandas as pd

from .features import load_data, build_id_maps, build_item_user_matrix
from .cf_model import CFModel
from .cb_model import CBModel
from .hybrid import HybridRecommender
from .llm_utils import build_explain_prompt, call_gemini

# --- Config ---
PRODUCTS_CSV = os.getenv("PRODUCTS_CSV", "data/sample_products.csv")
TRANSACTIONS_CSV = os.getenv("TRANSACTIONS_CSV", "data/sample_transactions.csv")

app = FastAPI(title="Qwipo Hybrid Recommender API (with search)")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load data and models ---
products_df, transactions_df = load_data(PRODUCTS_CSV, TRANSACTIONS_CSV)
u2idx, i2idx = build_id_maps(transactions_df)
item_user = build_item_user_matrix(transactions_df, u2idx, i2idx)
user_items_csr = item_user.T.tocsr()

cf = CFModel()
try:
    cf.fit(item_user)
except Exception:
    pass

cb = CBModel()
try:
    cb.build_embeddings(products_df)
except Exception:
    pass

p_index_map = {pid: idx for idx, pid in enumerate(products_df['product_id'].tolist())}
hybrid = HybridRecommender(cf, cb, i2idx, p_index_map)

# --- Pydantic models ---
class ProductOut(BaseModel):
    product_id: int
    title: str
    category: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None

class ExplanationItem(BaseModel):
    product_id: int
    title: str
    text: str

class ExplanationOut(BaseModel):
    items: List[ExplanationItem]
    tip: Optional[str]

class RecommendResponse(BaseModel):
    retailer_id: int
    recommendations: List[dict]
    explanation: ExplanationOut

# --- Endpoints ---
@app.get("/products", response_model=List[ProductOut])
def list_products(limit: int = 200, offset: int = 0):
    df = products_df.iloc[offset: offset + limit]
    out = []
    for pid, row in df.set_index('product_id').iterrows():
        out.append({
            "product_id": int(pid),
            "title": str(row.get('title', '')),
            "category": str(row.get('category', '')) if 'category' in row else None,
            "price": float(row.get('price')) if 'price' in row and not pd.isna(row.get('price')) else None,
            "description": str(row.get('description', '')) if 'description' in row else None
        })
    return out

@app.get("/product/{product_id}", response_model=ProductOut)
def get_product(product_id: int):
    if product_id not in products_df['product_id'].values:
        raise HTTPException(status_code=404, detail="Product not found")
    row = products_df[products_df['product_id'] == product_id].iloc[0]
    return {
        "product_id": int(row['product_id']),
        "title": str(row.get('title', '')),
        "category": str(row.get('category', '')) if 'category' in row else None,
        "price": float(row.get('price')) if 'price' in row and not pd.isna(row.get('price')) else None,
        "description": str(row.get('description', '')) if 'description' in row else None
    }

@app.get("/search", response_model=List[ProductOut])
def search_products(q: str = Query(..., min_length=1), limit: int = 20):
    ql = q.lower()
    matches = products_df[
        products_df.fillna("").apply(
            lambda r: ql in str(r.get('title','')).lower() or
                      ql in str(r.get('category','')).lower() or
                      ql in str(r.get('description','')).lower(), axis=1
        )
    ].head(limit)
    out = []
    for _, row in matches.iterrows():
        out.append({
            "product_id": int(row['product_id']),
            "title": str(row.get('title','')),
            "category": str(row.get('category','')) if 'category' in row else None,
            "price": float(row.get('price')) if 'price' in row and not pd.isna(row.get('price')) else None,
            "description": str(row.get('description','')) if 'description' in row else None
        })
    return out

@app.get("/recommend/{retailer_id}", response_model=RecommendResponse)
def recommend(retailer_id: int, top_k: int = 5, include_trending: bool = False):
    if retailer_id not in u2idx:
        raise HTTPException(status_code=404, detail="Retailer not found")

    user_idx = u2idx[retailer_id]

    # --- Hybrid recommendations ---
    recs = hybrid.recommend(user_idx, user_items_csr, top_k=top_k)
    results = []
    for idx, score in recs:
        product_id = next((pid for pid, pidx in i2idx.items() if pidx == idx), None)
        title = products_df.loc[products_df['product_id'] == product_id, 'title'].values[0]
        results.append({'product_id': int(product_id), 'title': str(title), 'score': float(score)})

    # --- Optional trending ---
    if include_trending:
        trending = products_df.sample(3)
        for _, row in trending.iterrows():
            results.append({
                'product_id': int(row['product_id']),
                'title': row['title'],
                'score': 0.0,
                'trending': True
            })

    # --- Build Gemini prompt ---
    prompt = build_explain_prompt(f"retailer_id={retailer_id}", results)
    gemini_output = call_gemini(prompt)  # returns dict with items + tip

    # --- Build ExplanationOut model ---
    explanation_items = []
    if isinstance(gemini_output, dict):
        for item in gemini_output.get("items", []):
            explanation_items.append(ExplanationItem(
                product_id=item.get("product_id", 0),
                title=item.get("title", ""),
                text=item.get("text", "")
            ))
        explanation = ExplanationOut(
            items=explanation_items,
            tip=gemini_output.get("tip", "")
        )
    else:
        # fallback: just return string in single item
        explanation = ExplanationOut(
            items=[ExplanationItem(product_id=0, title="", text=str(gemini_output))],
            tip=""
        )

    return {
        "retailer_id": retailer_id,
        "recommendations": results,
        "explanation": explanation
    }
