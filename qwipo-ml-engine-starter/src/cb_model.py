from sentence_transformers import SentenceTransformer
import numpy as np
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

class CBModel:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.embeddings = None
        self.product_index = None

    def build_embeddings(self, products_df, save_path=None):
        texts = (products_df['title'].fillna('') + ' ' +
                 products_df['category'].fillna('') + ' ' +
                 products_df['description'].fillna('')).tolist()
        emb = self.model.encode(texts, show_progress_bar=True)
        self.embeddings = np.array(emb)
        self.product_index = products_df['product_id'].tolist()
        if save_path:
            Path(save_path).parent.mkdir(parents=True, exist_ok=True)
            np.save(save_path, self.embeddings)
        return self.embeddings

    def load_embeddings(self, path):
        self.embeddings = np.load(path)
        return self.embeddings

    def recommend_similar(self, product_indices, top_k=20):
        if self.embeddings is None:
            raise ValueError('Embeddings not built')
        vec = self.embeddings[product_indices].mean(axis=0)
        sims = cosine_similarity([vec], self.embeddings)[0]
        topk = sims.argsort()[-top_k:][::-1]
        return list(zip(topk, sims[topk]))
