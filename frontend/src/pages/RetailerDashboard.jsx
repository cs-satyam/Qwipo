import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function useAuthHeaders() {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Confetti({ trigger }) {
  useEffect(() => {
    if (!trigger) return;
    // Lightweight emoji confetti
    const emojis = ['🌱','🌿','🌾','🌻','✨'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = 0; container.style.top = 0;
    container.style.width = '100%'; container.style.height = '0';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
    const pieces = Array.from({ length: 40 }).map((_, i) => {
      const span = document.createElement('span');
      span.textContent = emojis[i % emojis.length];
      span.style.position = 'fixed';
      span.style.left = Math.random() * 100 + 'vw';
      span.style.top = '-5vh';
      span.style.fontSize = 18 + Math.random() * 18 + 'px';
      span.style.transition = 'transform 2.2s ease, opacity 2.2s ease';
      container.appendChild(span);
      requestAnimationFrame(() => {
        span.style.transform = `translateY(${100 + Math.random() * 40}vh) rotate(${(Math.random()*360)|0}deg)`;
        span.style.opacity = '0';
      });
      return span;
    });
    const t = setTimeout(() => { pieces.forEach(p => p.remove()); container.remove(); }, 2400);
    return () => { clearTimeout(t); try { container.remove(); } catch {} };
  }, [trigger]);
  return null;
}

export default function RetailerDashboard() {
  const headers = useAuthHeaders();

  const [tab, setTab] = useState('products');
  const [days, setDays] = useState(7);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', category: 'Seeds', price: '', stock: '', image: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true); setError('');
      const res = await axios.get(`${API_BASE}/api/products/mine/list`, { headers });
      setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  const loadSales = async () => {
    try {
      setLoading(true); setError('');
      const res = await axios.get(`${API_BASE}/api/orders/retailer/sales`, { headers });
      setSales(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { if (tab === 'orders') loadSales(); }, [tab]);

  const analytics = useMemo(() => {
    // Compute revenue and counts using only retailer lines in aggregated sales
    const cutoff = (() => { const d = new Date(); d.setDate(d.getDate() - (Number(days)||7) + 1); d.setHours(0,0,0,0); return d; })();
    const filteredOrders = sales.filter(o => o.createdAt && new Date(o.createdAt) >= cutoff);
    const lines = filteredOrders.flatMap(o => Array.isArray(o.products) ? o.products.map(l => ({...l, createdAt: o.createdAt})) : []);
    const revenue = lines.reduce((s, l) => s + (Number(l.price)||0) * (Number(l.quantity)||0), 0);
    const ordersCount = filteredOrders.length;
    const aov = ordersCount ? revenue / ordersCount : 0;
    const lowStock = products.filter(p => (Number(p.stock)||0) <= 5).sort((a,b)=> (a.stock||0)-(b.stock||0)).slice(0,5);

    // Revenue by day (last 7 days)
    const dayKey = d => new Date(d).toISOString().slice(0,10);
    const now = new Date();
    const bucketCount = Number(days)||7;
    const dayKeys = Array.from({length: bucketCount}).map((_,i)=>{
      const d = new Date(now); d.setDate(now.getDate() - (bucketCount - 1 - i));
      return d.toISOString().slice(0,10);
    });
    const revenueByDayMap = new Map(dayKeys.map(k => [k, 0]));
    for (const l of lines) {
      if (!l.createdAt) continue;
      const key = dayKey(l.createdAt);
      if (revenueByDayMap.has(key)) {
        const amt = (Number(l.price)||0) * (Number(l.quantity)||0);
        revenueByDayMap.set(key, revenueByDayMap.get(key) + amt);
      }
    }
    const revenueByDay = dayKeys.map(k => ({ date: k, amount: revenueByDayMap.get(k) || 0 }));

    // Top products by revenue
    const revMap = new Map();
    for (const l of lines) {
      const id = l.product?.toString?.() || l.product;
      const amt = (Number(l.price)||0) * (Number(l.quantity)||0);
      revMap.set(id, (revMap.get(id)||0) + amt);
    }
    const topProductsByRevenue = Array.from(revMap.entries())
      .map(([id, amt]) => {
        const p = products.find(pp => (pp._id?.toString?.()||pp._id) === id);
        return { id, name: p?.name || id, amount: amt };
      })
      .sort((a,b)=> b.amount - a.amount)
      .slice(0,5);

    return { revenue, ordersCount, aov, lowStock, topProductsByRevenue, revenueByDay };
  }, [sales, products, days]);

  // CSV Exports
  const exportSalesCsv = () => {
    const hdrs = ['Order ID','Date','Product ID','Product Name','Quantity','Price','Amount'];
    const cutoff = (() => { const d = new Date(); d.setDate(d.getDate() - (Number(days)||7) + 1); d.setHours(0,0,0,0); return d; })();
    const rows = [];
    for (const o of sales) {
      if (!o.createdAt || new Date(o.createdAt) < cutoff) continue;
      const date = new Date(o.createdAt).toISOString();
      for (const l of (o.products||[])) {
        const id = l.product?.toString?.() || l.product;
        const p = products.find(pp => (pp._id?.toString?.()||pp._id) === id);
        const qty = Number(l.quantity)||0;
        const price = Number(l.price)||0;
        const amt = qty*price;
        rows.push([o._id, date, id, (p?.name||''), qty, price, amt]);
      }
    }
    const csv = [hdrs, ...rows].map(r => r.map(v => typeof v==='string' && v.includes(',') ? `"${v}"` : v).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `sales_${days}d.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportTopProductsCsv = () => {
    const hdrs = ['Product ID','Product Name','Revenue'];
    const rows = (analytics.topProductsByRevenue||[]).map(p => [p.id, p.name, p.amount]);
    const csv = [hdrs, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `top_products_${days}d.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const progress = useMemo(() => {
    // Onboarding checklist progress
    let steps = 4; let done = 0;
    // 1. Has at least one product
    if (products.length > 0) done++;
    // 2. Any product has image
    if (products.some(p => p.image || p.thumbnail)) done++;
    // 3. Any product has stock > 0
    if (products.some(p => (p.stock||0) > 0)) done++;
    // 4. Any product has price > 0
    if (products.some(p => (p.price||0) > 0)) done++;
    return { done, steps, pct: Math.round((done/steps)*100) };
  }, [products]);

  const resetForm = () => { setForm({ name: '', category: 'Seeds', price: '', stock: '', image: '', description: '' }); setEditing(null); };

  const submitProduct = async (e) => {
    e?.preventDefault?.();
    try {
      setLoading(true); setError('');
      const body = {
        name: form.name,
        category: form.category || 'Seeds',
        price: Number(form.price||0),
        stock: Number(form.stock||0),
        image: form.image,
        description: form.description,
      };
      if (editing) {
        await axios.put(`${API_BASE}/api/products/${editing}`, body, { headers });
      } else {
        await axios.post(`${API_BASE}/api/products`, body, { headers });
      }
      await loadProducts();
      if (!editing) { setCelebrate(true); setTimeout(()=>setCelebrate(false), 1000); }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  const onEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name || '',
      category: p.category || 'Seeds',
      price: p.price ?? '',
      stock: p.stock ?? '',
      image: p.image || '',
      description: p.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { setLoading(true); setError(''); await axios.delete(`${API_BASE}/api/products/${id}`, { headers }); await loadProducts(); }
    catch (err) { setError(err.response?.data?.message || err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="mb-0">Retailer Dashboard</h4>
              <div className="text-muted small">{loading ? 'Loading...' : ''} {error && <span className="text-danger">{error}</span>}</div>
            </div>

            {/* Onboarding & badges */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <div className="fw-semibold">Onboarding Progress</div>
                    <div className="progress mt-2" style={{height: 8, width: 260}}>
                      <div className="progress-bar" style={{width: `${progress.pct}%`}}></div>
                    </div>
                    <div className="small text-muted mt-1">{progress.done}/{progress.steps} completed</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {products.length > 0 && <span className="badge bg-success-subtle text-success">First Listing 🏅</span>}
                    {products.length >= 5 && <span className="badge bg-primary-subtle text-primary">5 Products ⭐</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-3">
              <li className="nav-item"><button className={`nav-link ${tab==='products'?'active':''}`} onClick={()=>setTab('products')}>Products</button></li>
              <li className="nav-item"><button className={`nav-link ${tab==='orders'?'active':''}`} onClick={()=>setTab('orders')}>Orders</button></li>
              <li className="nav-item"><button className={`nav-link ${tab==='analytics'?'active':''}`} onClick={()=>setTab('analytics')}>Analytics</button></li>
            </ul>

            {/* Products Tab */}
            {tab==='products' && (
              <div className="row g-3">
                <div className="col-12 col-lg-4">
                  <div className="card">
                    <div className="card-header fw-semibold">{editing ? 'Edit Product' : 'Add Product'}</div>
                    <div className="card-body">
                      <form onSubmit={submitProduct}>
                        <div className="mb-2">
                          <label className="form-label">Name</label>
                          <input className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
                        </div>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="form-label">Price</label>
                            <input type="number" className="form-control" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} min={0} step="0.01" required />
                          </div>
                          <div className="col-6">
                            <label className="form-label">Stock</label>
                            <input type="number" className="form-control" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} min={0} required />
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Image URL</label>
                          <input className="form-control" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
                          <div className="form-text">Tip: Use bright, clear images. Recommended 800x800.</div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-primary" disabled={loading}>{editing ? 'Save Changes' : 'Create Product'}</button>
                          {editing && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-8">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Your Products</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={loadProducts}><i className="bi bi-arrow-clockwise me-1"/>Refresh</button>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Product</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Stock</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.length === 0 && <tr><td colSpan={4} className="text-center text-muted py-4">No products yet</td></tr>}
                          {products.map(p => (
                            <tr key={p._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {p.image && <img src={p.image} alt="" style={{width:44,height:44,objectFit:'cover'}} className="rounded me-2"/>}
                                  <div>
                                    <div className="fw-semibold">{p.name}</div>
                                    <div className="text-muted small">{p.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-end">₹{Number(p.price||0).toLocaleString()}</td>
                              <td className="text-end">{p.stock}</td>
                              <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onEdit(p)}><i className="bi bi-pencil"/></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>onDelete(p._id)}><i className="bi bi-trash"/></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {tab==='orders' && (
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Orders including your products</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={loadSales}><i className="bi bi-arrow-clockwise me-1"/>Refresh</button>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th className="text-end">Items</th>
                        <th className="text-end">Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">No sales yet</td></tr>}
                      {sales.map(o => (
                        <tr key={o._id}>
                          <td className="text-break" style={{maxWidth:220}}>{o._id}</td>
                          <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                          <td className="text-end">{Array.isArray(o.products)?o.products.reduce((c,l)=>c+(Number(l.quantity)||0),0):0}</td>
                          <td className="text-end">₹{Number(o.totalAmount||0).toLocaleString()}</td>
                          <td><span className="badge bg-primary-subtle text-primary">{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {tab==='analytics' && (
              <div className="row g-3">
                <div className="col-12 d-flex align-items-center justify-content-between">
                  <div className="btn-group" role="group" aria-label="Date range">
                    <button className={`btn btn-sm ${days===7?'btn-primary':'btn-outline-primary'}`} onClick={()=>setDays(7)}>7d</button>
                    <button className={`btn btn-sm ${days===30?'btn-primary':'btn-outline-primary'}`} onClick={()=>setDays(30)}>30d</button>
                    <button className={`btn btn-sm ${days===90?'btn-primary':'btn-outline-primary'}`} onClick={()=>setDays(90)}>90d</button>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={exportSalesCsv}><i className="bi bi-download me-1"/>Export Sales CSV</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={exportTopProductsCsv}><i className="bi bi-download me-1"/>Export Top Products CSV</button>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <div className="card h-100"><div className="card-body">
                        <div className="text-muted small">Revenue (your products)</div>
                        <div className="h4 mb-0">₹{Number(analytics.revenue||0).toLocaleString()}</div>
                      </div></div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="card h-100"><div className="card-body">
                        <div className="text-muted small">Orders Containing Your Items</div>
                        <div className="h4 mb-0">{analytics.ordersCount}</div>
                      </div></div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="card h-100"><div className="card-body">
                        <div className="text-muted small">Avg Order Value (your items)</div>
                        <div className="h4 mb-0">₹{Number(analytics.aov||0).toFixed(0)}</div>
                      </div></div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Low Stock Alerts</span>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light">
                          <tr><th>Product</th><th className="text-end">Stock</th></tr>
                        </thead>
                        <tbody>
                          {analytics.lowStock.length===0 && <tr><td colSpan={2} className="text-center text-muted py-3">No low stock items</td></tr>}
                          {analytics.lowStock.map(p => (
                            <tr key={p._id}><td>{p.name}</td><td className="text-end">{p.stock}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Top Products by Revenue</span>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light">
                          <tr><th>Product</th><th className="text-end">Revenue</th></tr>
                        </thead>
                        <tbody>
                          {(!analytics.topProductsByRevenue || analytics.topProductsByRevenue.length===0) && <tr><td colSpan={2} className="text-center text-muted py-3">No sales yet</td></tr>}
                          {analytics.topProductsByRevenue?.map(p => (
                            <tr key={p.id}><td>{p.name}</td><td className="text-end">₹{Number(p.amount||0).toLocaleString()}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Revenue by Day (last 7)</span>
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light"><tr><th>Date</th><th className="text-end">Revenue</th></tr></thead>
                        <tbody>
                          {analytics.revenueByDay?.map(r => (
                            <tr key={r.date}><td>{new Date(r.date+'T00:00:00').toLocaleDateString()}</td><td className="text-end">₹{Number(r.amount||0).toLocaleString()}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Confetti trigger={celebrate} />
    </div>
  );
}
