from sklearn.decomposition import TruncatedSVD

class CFModel:
    def __init__(self, n_factors=10):
        self.n_factors = n_factors
        self.model = None
        self.item_factors = None

    def fit(self, item_user_matrix):
        n_factors = min(self.n_factors, min(item_user_matrix.shape))
        self.model = TruncatedSVD(n_components=n_factors)
        self.item_factors = self.model.fit_transform(item_user_matrix.T)  # items x factors

    def recommend_for_user(self, user_index, user_items_matrix, N=500):
        user_vector = self.model.transform(user_items_matrix[user_index])  # 1 x n_factors
        scores = self.item_factors @ user_vector.T  # (num_items x n_factors) @ (n_factors x 1)
        top_idx = scores.ravel().argsort()[::-1][:N]
        return [(i, scores[i, 0]) for i in top_idx]
