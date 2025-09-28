import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import './components/css/Dashboard.css';

function Settings() {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const navigate = useNavigate();
  const { show } = useToast();
  const [upgrading, setUpgrading] = useState(false);
  let isRetailer = false;
  try {
    const raw = localStorage.getItem('user');
    const u = raw ? JSON.parse(raw) : null;
    isRetailer = u?.role === 'retailer';
  } catch { }

  const initialProfile = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : {};
      return {
        storeName: u.address || 'My Market', // Assuming address maps to storeName
        ownerName: u.name || 'Owner',
        email: u.email || '',
        phone: u.phone || '',
        description: u.description || '', // Added description field
      };
    } catch {
      return { storeName: 'My Market', ownerName: 'Owner', email: '', phone: '', description: '' };
    }
  }, []);

  const [profile, setProfile] = useState(initialProfile);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [prefs, setPrefs] = useState({
    lowStockAlert: (() => { try { return JSON.parse(localStorage.getItem('prefs') || '{}').lowStockAlert ?? true; } catch { return true; } })(),
    newsletter: (() => { try { return JSON.parse(localStorage.getItem('prefs') || '{}').newsletter ?? false; } catch { return false; } })(),
    theme: (() => { try { return JSON.parse(localStorage.getItem('prefs') || '{}').theme ?? 'light'; } catch { return 'light'; } })(),
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const handleProfile = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handlePrefs = (e) => {
    const { name, checked, type, value } = e.target;
    setPrefs((p) => {
      const next = { ...p, [name]: type === 'checkbox' ? checked : value };
      try { localStorage.setItem('prefs', JSON.stringify(next)); } catch { }
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return show('Please login first', { variant: 'danger' });

      if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
        return show('Please enter a valid email address', { variant: 'warning' });
      }

      const body = {
        name: profile.ownerName,
        email: profile.email,
        phone: profile.phone,
        address: profile.storeName,
        description: profile.description, // Sending description
      };
      const res = await axios.put(`${API_BASE}/api/users/profile`, body, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.user) {
        const merged = { ...(JSON.parse(localStorage.getItem('user') || '{}')), ...res.data.user };
        localStorage.setItem('user', JSON.stringify(merged));
      }
      show('Settings saved', { variant: 'success' });
    } catch (err) {
      show(err.response?.data?.message || err.message || 'Failed to save', { variant: 'danger' });
    }
  };

  const handleBecomeRetailer = async () => {
    try {
      setUpgrading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return show('Please login first', { variant: 'danger' });
      const res = await axios.post(`${API_BASE}/api/users/upgrade-retailer`, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        try {
          const raw = localStorage.getItem('user');
          const u = raw ? JSON.parse(raw) : {};
          u.role = 'retailer';
          localStorage.setItem('user', JSON.stringify(u));
        } catch { }
      }
      show('You are now a retailer! Redirecting to your dashboard...', { variant: 'success' });
      navigate('/retailer');
    } catch (err) {
      show(err.response?.data?.message || err.message || 'Upgrade failed', { variant: 'danger' });
    } finally {
      setUpgrading(false);
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setAvatarPreview('');
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwd.currentPassword || !pwd.newPassword) return show('Please fill all password fields', { variant: 'warning' });
    if (pwd.newPassword !== pwd.confirm) return show('New password and confirm do not match', { variant: 'warning' });
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return show('Please login first', { variant: 'danger' });
      await axios.put(`${API_BASE}/api/users/change-password`, { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      show('Password changed successfully', { variant: 'success' });
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      show(err.response?.data?.message || err.message || 'Failed to change password', { variant: 'danger' });
    }
  };

  // FIX: Added handler for the Reset button
  const handleReset = () => {
    setProfile(initialProfile);
    setAvatarPreview('');
    show('Form has been reset to the last saved state.', { variant: 'info' });
  };

  // FIX: Added handler for the Delete Account button
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      return;
    }
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return show('Authentication error. Please log in again.', { variant: 'danger' });

      await axios.delete(`${API_BASE}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } });

      show('Account deleted successfully. Logging you out.', { variant: 'success' });
      localStorage.clear(); // Clear all local storage for this app
      navigate('/login');
    } catch (err) {
      show(err.response?.data?.message || err.message || 'Failed to delete account.', { variant: 'danger' });
    }
  };

  return (
    <div className="dashboard-wrapper min-vh-100 d-flex flex-column">
      <TopNav />
      <div className="dashboard-body d-flex flex-grow-1">
        <Sidebar />
        <main className="dashboard-content flex-grow-1">
          <div className="container-fluid py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
              <h4 className="mb-2 mb-sm-0">Settings</h4>
              <div className="d-flex gap-2">
                {!isRetailer && (
                  <button className="btn btn-warning text-dark" onClick={handleBecomeRetailer} disabled={upgrading}>
                    <i className="bi bi-shop-window me-2"></i>{upgrading ? 'Upgrading...' : 'Become a Retailer'}
                  </button>
                )}
                <button className="btn btn-outline-secondary" onClick={handleReset}><i className="bi bi-arrow-clockwise me-2"></i>Reset</button>
                <button form="settingsForm" type="submit" className="btn btn-success"><i className="bi bi-check2-circle me-2"></i>Save</button>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <div className="card h-100">
                  <div className="card-header d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">Store Profile</h6>
                    {isRetailer && <span className="badge bg-success-subtle text-success">Retailer</span>}
                  </div>
                  <div className="card-body">
                    <form id="settingsForm" onSubmit={handleSave} className="row g-3">
                      <div className="col-12 d-flex align-items-center gap-3">
                        <div className="position-relative">
                          <div className="rounded-circle bg-body-secondary d-flex align-items-center justify-content-center" style={{ width: 72, height: 72, overflow: 'hidden' }}>
                            {avatarPreview ? (
                              <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <i className="bi bi-person fs-2 text-secondary"></i>
                            )}
                          </div>
                          <label className="btn btn-sm btn-outline-secondary position-absolute" style={{ bottom: -6, right: -6 }}>
                            <i className="bi bi-camera"></i>
                            <input type="file" accept="image/*" hidden onChange={handleAvatar} />
                          </label>
                        </div>
                        <div className="flex-grow-1">
                          <div className="form-floating mb-2">
                            <input className="form-control" id="storeName" placeholder="Store Name" name="storeName" value={profile.storeName} onChange={handleProfile} />
                            <label htmlFor="storeName">Store Name</label>
                          </div>
                          <div className="form-floating">
                            <input className="form-control" id="ownerName" placeholder="Owner Name" name="ownerName" value={profile.ownerName} onChange={handleProfile} />
                            <label htmlFor="ownerName">Owner Name</label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input type="email" className="form-control" id="email" placeholder="Email" name="email" value={profile.email} onChange={handleProfile} />
                          <label htmlFor="email">Email</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input className="form-control" id="phone" placeholder="Phone" name="phone" value={profile.phone} onChange={handleProfile} />
                          <label htmlFor="phone">Phone</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          {/* FIX: Connected textarea to state */}
                          <textarea
                            className="form-control"
                            id="desc"
                            name="description"
                            style={{ height: 100 }}
                            placeholder="Store description"
                            value={profile.description}
                            onChange={handleProfile}
                          ></textarea>
                          <label htmlFor="desc">Store Description</label>
                        </div>
                        <div className="form-text">Tip: Share what makes your products or store special.</div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-4">
                <div className="card h-100">
                  <div className="card-header"><h6 className="mb-0">Preferences</h6></div>
                  <div className="card-body">
                    <div className="form-check form-switch mb-3">
                      <input id="lowStockAlert" name="lowStockAlert" className="form-check-input" type="checkbox" checked={prefs.lowStockAlert} onChange={handlePrefs} />
                      <label className="form-check-label" htmlFor="lowStockAlert">Low stock alerts</label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input id="newsletter" name="newsletter" className="form-check-input" type="checkbox" checked={prefs.newsletter} onChange={handlePrefs} />
                      <label className="form-check-label" htmlFor="newsletter">Send newsletter</label>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Theme</label>
                      <select name="theme" className="form-select" value={prefs.theme} onChange={handlePrefs}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div className="alert alert-info d-flex align-items-center" role="alert">
                      <i className="bi bi-info-circle me-2"></i>
                      Preferences are saved locally in this demo.
                    </div>
                  </div>
                </div>
                <div className="card mt-3">
                  <div className="card-header"><h6 className="mb-0">Change Password</h6></div>
                  <div className="card-body">
                    <form onSubmit={handleChangePassword} className="row g-2">
                      <div className="col-12">
                        <div className="form-floating">
                          <input type="password" className="form-control" id="currentPwd" placeholder="Current Password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} required />
                          <label htmlFor="currentPwd">Current Password</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-floating">
                          <input type="password" className="form-control" id="newPwd" placeholder="New Password" value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} required />
                          <label htmlFor="newPwd">New Password</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-floating">
                          <input type="password" className="form-control" id="confirmPwd" placeholder="Confirm Password" value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} required />
                          <label htmlFor="confirmPwd">Confirm Password</label>
                        </div>
                      </div>
                      <div className="col-12 d-grid">
                        <button className="btn btn-outline-primary" type="submit"><i className="bi bi-key me-2" />Update Password</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card mt-3 border-danger">
                  <div className="card-header bg-danger-subtle text-danger"><h6 className="mb-0">Danger Zone</h6></div>
                  <div className="card-body">
                    <p className="mb-3">Deleting your account is permanent and cannot be undone.</p>
                    <button className="btn btn-outline-danger" onClick={handleDeleteAccount}><i className="bi bi-trash me-2" />Delete Account</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;