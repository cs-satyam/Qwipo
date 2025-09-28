import numpy as np
from .utils import normalize_scores

class HybridRecommender:
    def __init__(self, cf_model, cb_model, i2idx_map, p_index_map):
        self.cf = cf_model
        self.cb = cb_model
        self.i2idx_map = i2idx_map
        self.p_index_map = p_index_map

    def recommend(self, user_index, user_items_matrix, top_k=10, alpha=0.7):
        cf_raw = np.zeros(len(self.p_index_map), dtype=float)
        cf_recs = self.cf.recommend_for_user(user_index, user_items_matrix, N=500)
        for idx, score in cf_recs:
            cf_raw[idx] = score

        cb_raw = np.zeros(len(self.p_index_map), dtype=float)
        # Optional: integrate CB model based on user purchase history

        cf_norm = normalize_scores(cf_raw)
        cb_norm = normalize_scores(cb_raw)
        hybrid = alpha * cf_norm + (1 - alpha) * cb_norm
        topk_idx = hybrid.argsort()[-top_k:][::-1]
        return list(zip(topk_idx, hybrid[topk_idx]))
