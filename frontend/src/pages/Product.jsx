import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import ProductCard from './components/ProductCard';
import CartBar from './components/CartBar';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import './components/css/Dashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { items: cart, add, updateQty, remove, checkout, busy } = useCart();
  const { show } = useToast();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/api/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { limit: 50 },
        });
        // Backend returns { products, pagination, filters }
        setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );
  }, [products, query]);

  // cart actions and checkout provided by context

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Products</h4>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary"><i className="bi bi-download me-2"></i>Export</button>
                <button className="btn btn-warning text-dark"><i className="bi bi-plus-circle me-2"></i>Add Product</button>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body d-flex flex-wrap gap-2 align-items-center">
                <div className="input-group" style={{ maxWidth: 400 }}>
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input
                    className="form-control"
                    placeholder="Search by name, SKU, brand"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
                {loading && <span className="text-muted ms-2">Loading...</span>}
                {error && <span className="text-danger ms-2">{error}</span>}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                {!loading && filtered.length === 0 && (
                  <div className="text-center py-4 text-muted">No products found</div>
                )}
                <div className="row g-3">
                  {filtered.map(p => (
                    <div className="col-6 col-md-4 col-lg-3" key={p._id || p.id || p.sku}>
                      <ProductCard product={p} onAdd={() => add(p)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CartBar
        items={cart}
        onQty={updateQty}
        onRemove={remove}
        onCheckout={async () => {
          const res = await checkout();
          if (res?.ok) show('Order placed successfully', { variant: 'success' });
          else if (res?.error) show(res.error, { variant: 'danger' });
        }}
        busy={busy}
      />
    </div>
  );
}

export default Product;
