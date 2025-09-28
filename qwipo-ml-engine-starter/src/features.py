import pandas as pd
import scipy.sparse as sps

def load_data(products_csv='data/sample_products.csv', transactions_csv='data/sample_transactions.csv'):
    products = pd.read_csv(products_csv)
    transactions = pd.read_csv(transactions_csv)
    return products, transactions

def build_id_maps(transactions):
    retailers = transactions['retailer_id'].unique().tolist()
    products = transactions['product_id'].unique().tolist()
    u2idx = {u: i for i, u in enumerate(retailers)}
    i2idx = {p: i for i, p in enumerate(products)}
    return u2idx, i2idx

def build_item_user_matrix(transactions, u2idx, i2idx):
    rows = transactions['product_id'].map(i2idx).values
    cols = transactions['retailer_id'].map(u2idx).values
    data = transactions['quantity'].values
    m = sps.csr_matrix((data, (rows, cols)), shape=(len(i2idx), len(u2idx)))
    return m
