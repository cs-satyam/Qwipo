import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './components/css/Hero.css';
import './components/css/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Save token and user for ProtectedRoute and role-based UI
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('token', res.data.token);
      if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data?.user?.role === 'retailer') navigate('/retailer');
      else navigate('/mymarket');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero-section text-white">
      <div className="hero-bg-overlay"></div>
      <div className="hero-particles"></div>
      <div className="auth-animated-shapes"></div>
      <div className="auth-glow"></div>
      <div className="container auth-wrapper">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-md-10 col-lg-6" data-aos="fade-up">
            <div className="auth-card shadow-lg p-4 p-md-5">
              <div className="text-center mb-4 auth-badge" data-aos="fade-down">
                <span className="badge px-3 py-2 rounded-pill">
                  <i className="bi bi-shield-lock-fill me-2"></i>Secure Login
                </span>
              </div>
              <h2 className="auth-title text-center mb-2">Welcome back</h2>
              <p className="auth-subtitle text-center mb-4">Sign in to continue</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="mb-3 auth-input-group input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2 auth-input-group input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-hero-primary btn-lg" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <span className="text-white-50">Don't have an account? </span>
                <Link to="/register" className="auth-footer-link">
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
