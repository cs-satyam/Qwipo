import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const Cart = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const { items, totals, updateQty, remove, checkout, busy } = useCart();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null); // { code, discount, finalAmount }
  const [shipping, setShipping] = useState({ name: '', phone: '', address: '', city: '', state: '', zip: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <h4 className="mb-3 d-flex align-items-center">Cart <span className="badge bg-secondary-subtle text-secondary ms-2">{items.length}</span></h4>
            {items.length === 0 ? (
              <div className="card"><div className="card-body text-center text-muted py-5">Your cart is empty.</div></div>
            ) : (
              <div className="row g-3">
                <div className="col-12 col-lg-8">
                  <div className="card">
                    <div className="list-group list-group-flush">
                      {items.map(it => (
                        <div key={it.id} className="list-group-item d-flex align-items-center gap-3">
                          <img src={it.image || 'https://via.placeholder.com/56'} alt={it.name} width={56} height={56} style={{objectFit:'cover', borderRadius:8}} />
                          <div className="flex-grow-1">
                            <div className="fw-semibold">{it.name}</div>
                            <div className="text-muted small">₹{Number(it.price||0).toLocaleString()}</div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-sm btn-outline-secondary" disabled={busy || it.qty<=1} onClick={() => updateQty(it.id, Math.max(1, it.qty-1))}>-</button>
                            <input className="form-control form-control-sm text-center" style={{width:60}} value={it.qty} onChange={(e)=> updateQty(it.id, Math.max(1, Number(e.target.value)||1))} />
                            <button className="btn btn-sm btn-outline-secondary" disabled={busy} onClick={() => updateQty(it.id, it.qty+1)}>+</button>
                          </div>
                          <button className="btn btn-sm btn-outline-danger" disabled={busy} onClick={()=> remove(it.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-3">Order Summary</h6>
                      <div className="d-flex justify-content-between"><span>Items</span><strong>{totals.count}</strong></div>
                      <div className="d-flex justify-content-between"><span>Subtotal</span><strong>₹{totals.subtotal.toLocaleString()}</strong></div>
                      <div className="mt-3">
                        <label className="form-label small text-muted">Coupon code</label>
                        <div className="input-group">
                          <input className="form-control" value={coupon} onChange={(e)=> setCoupon(e.target.value)} placeholder="ENTER CODE" />
                          <button className="btn btn-outline-primary" disabled={!coupon || busy} onClick={async ()=>{
                            try {
                              const res = await axios.get(`${API_BASE}/api/coupons/validate`, { params: { code: coupon, amount: totals.subtotal }, headers: token ? { Authorization: `Bearer ${token}` } : {} });
                              setApplied({ code: res.data.code, discount: res.data.discount, finalAmount: res.data.finalAmount });
                              show(`Coupon ${res.data.code} applied: -₹${res.data.discount.toLocaleString()}`, { variant: 'success' });
                            } catch (err) {
                              setApplied(null);
                              show(err.response?.data?.message || err.message || 'Invalid coupon', { variant: 'danger' });
                            }
                          }}>Apply</button>
                        </div>
                        {applied && (
                          <div className="small text-success mt-1">Applied {applied.code}: -₹{Number(applied.discount||0).toLocaleString()}</div>
                        )}
                      </div>
                      {applied && (
                        <div className="d-flex justify-content-between mt-2"><span>Discount</span><strong className="text-success">-₹{Number(applied.discount||0).toLocaleString()}</strong></div>
                      )}
                      <div className="d-flex justify-content-between mt-2"><span>Grand Total</span><strong>₹{Number((applied?.finalAmount ?? totals.subtotal)).toLocaleString()}</strong></div>

                      <hr/>
                      <h6 className="mb-2">Shipping Details</h6>
                      <div className="mb-2">
                        <label className="form-label small">Full Name</label>
                        <input className="form-control" value={shipping.name} onChange={(e)=> setShipping(s => ({...s, name: e.target.value}))} placeholder="Name" />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Phone</label>
                        <input className="form-control" value={shipping.phone} onChange={(e)=> setShipping(s => ({...s, phone: e.target.value}))} placeholder="Phone" />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Address</label>
                        <textarea className="form-control" rows={2} value={shipping.address} onChange={(e)=> setShipping(s => ({...s, address: e.target.value}))} placeholder="Address" />
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label small">City</label>
                          <input className="form-control" value={shipping.city} onChange={(e)=> setShipping(s => ({...s, city: e.target.value}))} placeholder="City" />
                        </div>
                        <div className="col-3">
                          <label className="form-label small">State</label>
                          <input className="form-control" value={shipping.state} onChange={(e)=> setShipping(s => ({...s, state: e.target.value}))} placeholder="State" />
                        </div>
                        <div className="col-3">
                          <label className="form-label small">PIN</label>
                          <input className="form-control" value={shipping.zip} onChange={(e)=> setShipping(s => ({...s, zip: e.target.value}))} placeholder="PIN" />
                        </div>
                      </div>
                      <hr/>
                      <button className="btn btn-primary w-100" disabled={busy} onClick={async ()=>{
                        if (!shipping.name || !shipping.address) {
                          show('Please enter shipping name and address', { variant: 'danger' });
                          return;
                        }
                        const res = await checkout(applied?.code, shipping);
                        if (res?.ok) {
                          show('Order placed successfully', { variant: 'success' });
                          if (res.order?._id) navigate(`/order/${res.order._id}/confirmation`);
                        } else if (res?.error) {
                          show(res.error, { variant: 'danger' });
                        }
                      }}>{busy ? 'Placing...' : 'Place Order'}</button>
                    </div>
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

export default Cart;
