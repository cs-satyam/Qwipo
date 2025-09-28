import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import './components/css/Dashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function Customers() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/api/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Aggregate customers by shipping name + phone as key
  const customers = useMemo(() => {
    const map = new Map();
    for (const o of orders) {
      const name = o.shipping?.name?.trim() || 'Unknown';
      const phone = o.shipping?.phone?.trim() || '';
      const key = `${name}|${phone}`;
      const rec = map.get(key) || {
        id: key,
        name,
        phone,
        email: '',
        orders: 0,
        spend: 0,
        joined: null,
        last: null,
        active: true,
      };
      rec.orders += 1;
      rec.spend += Number(o.totalAmount) || 0;
      const d = o.createdAt ? new Date(o.createdAt) : null;
      if (d) {
        if (!rec.joined || d < rec.joined) rec.joined = d;
        if (!rec.last || d > rec.last) rec.last = d;
      }
      map.set(key, rec);
    }
    return Array.from(map.values()).map(c => ({
      ...c,
      joined: c.joined ? c.joined.toISOString().slice(0,10) : '-',
      last: c.last ? c.last.toISOString().slice(0,10) : '-',
      active: true,
    }));
  }, [orders]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchQuery = `${c.name} ${c.phone} ${c.id}`.toLowerCase().includes(q);
      const matchActive = onlyActive ? c.active : true;
      return matchQuery && matchActive;
    });
  }, [customers, query, onlyActive]);

  const activeCount = customers.filter(c => c.active).length;
  const totalSpend = customers.reduce((sum, c) => sum + (Number(c.spend)||0), 0);

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-4">
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="icon-circle me-3 bg-success-subtle text-success"><i className="bi bi-people"></i></div>
                    <div>
                      <div className="text-muted small">Active Customers</div>
                      <div className="h4 mb-0">{activeCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="icon-circle me-3 bg-primary-subtle text-primary"><i className="bi bi-bag"></i></div>
                    <div>
                      <div className="text-muted small">Total Orders</div>
                      <div className="h4 mb-0">{customers.reduce((s,c)=>s+(c.orders||0),0)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="icon-circle me-3 bg-warning-subtle text-warning"><i className="bi bi-currency-rupee"></i></div>
                    <div>
                      <div className="text-muted small">Total Spend</div>
                      <div className="h4 mb-0">₹{Number(totalSpend||0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body d-flex flex-wrap gap-2 align-items-center">
                <div className="input-group" style={{ maxWidth: 420 }}>
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input
                    className="form-control"
                    placeholder="Search by name, email or id"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="form-check ms-auto">
                  <input id="onlyActive" className="form-check-input" type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
                  <label htmlFor="onlyActive" className="form-check-label">Only Active</label>
                </div>
                <div className="text-muted small ms-2">{loading ? 'Loading...' : `${customers.length} customers`}{error && <span className="text-danger ms-2">{error}</span>}</div>
              </div>
            </div>

            <div className="card">
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Orders</th>
                      <th>Spend</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">No customers</td>
                      </tr>
                    )}
                    {filtered.map((c) => (
                      <tr key={c.id}>
                        <td className="fw-semibold">{c.name} <span className="text-muted small d-block">{c.id}</span></td>
                        <td>{c.phone || '-'}</td>
                        <td>{c.orders}</td>
                        <td className="text-nowrap">₹{Number(c.spend||0).toLocaleString()}</td>
                        <td><span className={`badge ${c.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                        <td>{c.joined}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-secondary me-2"><i className="bi bi-envelope"></i></button>
                          <button className="btn btn-sm btn-outline-danger"><i className="bi bi-person-x"></i></button>
                        </td>
                      </tr>
                    ))}
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

export default Customers;
