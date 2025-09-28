import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/api/orders/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Order Confirmation</h4>
              <div className="d-flex gap-2">
                <Link to="/orders" className="btn btn-outline-secondary">Back to Orders</Link>
                <button className="btn btn-primary" onClick={() => window.print()}><i className="bi bi-printer me-2"></i>Print Invoice</button>
              </div>
            </div>

            {loading && <div className="text-muted">Loading...</div>}
            {error && <div className="text-danger">{error}</div>}
            {order && (
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Order #{order._id}</h5>
                      <div className="text-muted">Status: <span className="badge bg-primary-subtle text-primary">{order.status}</span></div>
                      <div className="text-muted">Date: {new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <h6>Shipping</h6>
                      <div className="text-muted">{order.shipping?.name || '-'}</div>
                      <div className="text-muted">{order.shipping?.phone || ''}</div>
                      <div className="text-muted">{order.shipping?.address || '-'}</div>
                      <div className="text-muted">{[order.shipping?.city, order.shipping?.state, order.shipping?.zip].filter(Boolean).join(', ')}</div>
                    </div>
                  </div>
                  <hr/>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((l) => (
                        <tr key={l._id || l.product}>
                          <td>{l.product?.name || l.product}</td>
                          <td>{l.quantity}</td>
                          <td className="text-end">₹{Number(l.price).toLocaleString()}</td>
                          <td className="text-end">₹{Number(l.price * l.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex flex-column align-items-end">
                    {order.discount > 0 && (
                      <div>Discount: <strong className="text-success">-₹{Number(order.discount).toLocaleString()}</strong> {order.couponCode ? `(${order.couponCode})` : ''}</div>
                    )}
                    <div>Total: <strong>₹{Number(order.totalAmount).toLocaleString()}</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderConfirmation;
