import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function OrderItems() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setOrders(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const lines = useMemo(() => {
    const out = [];
    for (const o of orders) {
      for (const l of (o.products || [])) {
        out.push({
          key: `${o._id}-${l._id || l.product}`,
          orderId: o._id,
          date: o.createdAt,
          status: o.status,
          couponCode: o.couponCode,
          discount: o.discount || 0,
          productName: l.product?.name || String(l.product),
          quantity: l.quantity,
          price: l.price,
          lineTotal: (Number(l.price) || 0) * (Number(l.quantity) || 0),
        });
      }
    }
    return out;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lines.filter((r) => {
      const d = r.date ? new Date(r.date).toISOString().slice(0,10) : '';
      const matchesQuery = `${r.orderId} ${r.productName}`.toLowerCase().includes(q);
      const matchesDate = (dateRange.start === '' || d >= dateRange.start) && (dateRange.end === '' || d <= dateRange.end);
      return matchesQuery && matchesDate;
    }).sort((a, b) => {
      const get = (row, key) => {
        if (key === 'date') return row.date || '';
        if (key === 'order') return row.orderId;
        if (key === 'name') return row.productName;
        if (key === 'total') return row.lineTotal;
        return row[key];
      };
      const av = get(a, sort.key);
      const bv = get(b, sort.key);
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [lines, query, dateRange, sort]);

  const requestSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
              <h4 className="mb-0">My Order Items</h4>
              <div className="d-flex gap-2">
                <Link to="/orders" className="btn btn-outline-secondary">Back to Orders</Link>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-header d-flex flex-wrap gap-3 align-items-center">
                <div className="input-group" style={{ maxWidth: 320 }}>
                  <span className="input-group-text"><i className="bi bi-search"/></span>
                  <input className="form-control" placeholder="Search by product or order id" value={query} onChange={(e)=> setQuery(e.target.value)} />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="text-muted small">From</label>
                  <input type="date" className="form-control" value={dateRange.start} onChange={(e)=> setDateRange(s=>({...s, start: e.target.value}))} />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="text-muted small">To</label>
                  <input type="date" className="form-control" value={dateRange.end} onChange={(e)=> setDateRange(s=>({...s, end: e.target.value}))} />
                </div>
                <div className="ms-auto text-muted small">
                  {loading ? 'Loading...' : `${filtered.length} items`}
                  {error && <span className="text-danger ms-2">{error}</span>}
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th onClick={()=>requestSort('date')} className="sortable">Date</th>
                      <th onClick={()=>requestSort('order')} className="sortable">Order ID</th>
                      <th onClick={()=>requestSort('name')} className="sortable">Product</th>
                      <th className="text-end">Qty</th>
                      <th className="text-end" onClick={()=>requestSort('price')}>Price</th>
                      <th className="text-end" onClick={()=>requestSort('total')}>Line Total</th>
                      <th>Status</th>
                      <th>Coupon</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.key}>
                        <td>{r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                        <td className="text-break" style={{maxWidth: 160}}>{r.orderId}</td>
                        <td>{r.productName}</td>
                        <td className="text-end">{r.quantity}</td>
                        <td className="text-end">₹{Number(r.price).toLocaleString()}</td>
                        <td className="text-end">₹{Number(r.lineTotal).toLocaleString()}</td>
                        <td><span className={`badge bg-primary-subtle text-primary`}>{r.status}</span></td>
                        <td>{r.couponCode || '-'}</td>
                        <td className="text-end">
                          <Link className="btn btn-sm btn-outline-primary" to={`/order/${r.orderId}/confirmation`}><i className="bi bi-receipt me-1"/>Invoice</Link>
                        </td>
                      </tr>
                    ))}
                    {!loading && filtered.length === 0 && (
                      <tr><td colSpan={9} className="text-center text-muted p-4">No order items found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
