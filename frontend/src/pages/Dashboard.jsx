import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import './components/css/Dashboard.css';

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, trend }) => (
  <div className="card stat-card h-100">
    <div className="card-body d-flex align-items-center">
      <div className="icon-wrap me-3">
        <i className={`bi ${icon} fs-3`}></i>
      </div>
      <div>
        <div className="text-muted small text-uppercase fw-semibold">{label}</div>
        <div className="d-flex align-items-baseline gap-2">
          <div className="fs-4 fw-bold">{value}</div>
          {trend !== undefined && (
            <span className={`badge rounded-pill ${trend > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function Dashboard() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setOrders(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount ? totalRevenue / orderCount : 0;
    const couponSavings = orders.reduce((sum, o) => sum + (Number(o.discount) || 0), 0);
    return { totalRevenue, orderCount, avgOrderValue, couponSavings };
  }, [orders]);

  const recent = useMemo(() => {
    return [...orders]
      .sort((a,b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
      .reverse()
      .slice(0, 8);
  }, [orders]);

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex">
      <Sidebar />
      <div className="dashboard-main flex-grow-1 d-flex flex-column">
        <TopNav />
        <main className="dashboard-content flex-grow-1 p-4">
          {/* Header */}
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
            <h4 className="mb-0">Dashboard</h4>
            <div className="text-muted small">{loading ? 'Loading...' : `${orders.length} orders loaded`}{error && <span className="text-danger ms-2">{error}</span>}</div>
          </div>

          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-currency-rupee" label="Revenue" value={`₹${Number(metrics.totalRevenue||0).toLocaleString()}`} /></div>
            <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-bag-check" label="Orders" value={`${metrics.orderCount}`} /></div>
            <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-basket" label="Avg. Order Value" value={`₹${Number(metrics.avgOrderValue||0).toFixed(0).toLocaleString?.() || Number(metrics.avgOrderValue||0).toFixed(0)}`} /></div>
            <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-ticket-perforated" label="Coupon Savings" value={`₹${Number(metrics.couponSavings||0).toLocaleString()}`} /></div>
          </div>

          {/* Recent Orders Table */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Recent Orders</h6>
              <Link to="/orders" className="btn btn-sm btn-outline-secondary">View All</Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th className="text-end">Items</th>
                    <th className="text-end">Total</th>
                    <th>Coupon</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(o => (
                    <tr key={o._id}>
                      <td className="text-break" style={{maxWidth: 200}}>{o._id}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                      <td className="text-end">{Array.isArray(o.products) ? o.products.reduce((c, l) => c + (Number(l.quantity)||0), 0) : 0}</td>
                      <td className="text-end">₹{Number(o.totalAmount||0).toLocaleString()}</td>
                      <td>{o.couponCode || '-'}</td>
                      <td><span className="badge bg-primary-subtle text-primary">{o.status}</span></td>
                      <td className="text-end">
                        <Link className="btn btn-sm btn-outline-primary" to={`/order/${o._id}/confirmation`}><i className="bi bi-receipt me-1"/>Invoice</Link>
                      </td>
                    </tr>
                  ))}
                  {!loading && recent.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted p-4">No recent orders</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer small text-muted">Showing latest {recent.length} orders</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
