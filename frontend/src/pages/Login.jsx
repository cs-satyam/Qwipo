import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './components/css/Hero.css';
import './components/css/Auth.css';

function Login() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
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

              <form className="auth-form">
                <div className="mb-3 auth-input-group input-group">
                  <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                  <input type="email" className="form-control" id="loginEmail" placeholder="you@example.com" required />
                </div>

                <div className="mb-2 auth-input-group input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                  <input type="password" className="form-control" id="loginPassword" placeholder="••••••••" required />
                </div>

                <div className="d-flex justify-content-end">
                  <a href="#" className="auth-footer-link small">Forgot password?</a>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-hero-primary btn-lg">Login</button>
                </div>
              </form>

              <div className="auth-divider"><span>or continue with</span></div>
              <div className="auth-social d-flex gap-2 mt-3">
                <button type="button" className="btn w-100"><i className="bi bi-google me-2"></i>Google</button>
                <button type="button" className="btn w-100"><i className="bi bi-facebook me-2"></i>Facebook</button>
              </div>

              <div className="text-center mt-4">
                <span className="text-white-50">Don't have an account? </span>
                <Link to="/register" className="auth-footer-link">Create one</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
