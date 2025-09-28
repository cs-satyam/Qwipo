# Qwipo Smart Recommendations — Predict-to-Stock & Smart Baskets

> Intelligent product recommendation & inventory prediction platform for B2B retailers and distributors.  
> Provides personalized recommendations, one-click smart baskets, and predictive restock alerts to increase AOV and repeat purchases.

---

## 🚀 Project Overview
This repository contains a prototype for a recommendation system built for a B2B marketplace (retailers & distributors).  
Key features:
- Personalized product recommendations (per retailer)
- **Smart Baskets** (pre-built AI-curated combos)
- **Predict-to-Stock**: predictive restock alerts and demand forecasts
- Separate dashboards:
  - Retailer Dashboard: recommendations, restock alerts, quick reorder, insights
  - Distributor Dashboard: inventory, retailer demand insights, promotions, analytics

Primary goals:
- Increase Average Order Value (AOV) by 15–20%
- Improve repeat-purchase behavior by ~25%
- Provide actionable inventory and local-demand alerts for retailers & distributors

---

## 🧭 Tech Stack (recommended)
- **Backend**: Python (FastAPI) or Node.js (Express/Fastify) — FastAPI recommended
- **Database**: PostgreSQL (transactions) / MongoDB (optional)
- **Cache / Online features**: Redis
- **Stream / Event**: Kafka or Redis Streams (prototype can use simple queue)
- **ML**: scikit-learn, implicit (ALS), gensim / PyTorch for embeddings
- **Serving**: REST APIs (FastAPI)
- **Frontend**: React or EJS + minimal CSS (dashboard prototypes)
- **Orchestration**: Docker / docker-compose (K8s for production)
- **Storage**: S3 / local file for embeddings & batch files

---
