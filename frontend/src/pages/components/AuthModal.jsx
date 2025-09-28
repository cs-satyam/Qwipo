import React from 'react';
import { Modal } from 'react-bootstrap';
import './css/Hero.css';
import './css/Auth.css';

function AuthModal({ show, mode = 'login', onClose, onSwitchMode }) {
  const isLogin = mode === 'login';

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      className="auth-modal"
      dialogClassName="auth-modal-dialog"
    >
      <div className="auth-modal-wrapper text-white" style={{ minHeight: 'auto', background: 'transparent' }}>
        {/* Keep additional subtle effects only, no gradient or particles so landing shows through */}
        <div className="auth-animated-shapes"></div>
        <div className="auth-glow"></div>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="auth-card shadow-lg p-4 p-md-5">
                <div className="text-center mb-3 auth-badge">
                  <span className="badge px-3 py-2 rounded-pill">
                    {isLogin ? (
                      <>
                        <i className="bi bi-shield-lock-fill me-2"></i>Secure Login
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus-fill me-2"></i>Create Account
                      </>
                    )}
                  </span>
                </div>

                <h2 className="auth-title text-center mb-2">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                <p className="auth-subtitle text-center mb-4">{isLogin ? 'Sign in to continue' : "It's quick and easy"}</p>

                {/* Form */}
                <form className="auth-form">
                  {!isLogin && (
                    <div className="mb-3 auth-input-group input-group">
                      <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                      <input type="text" className="form-control" id="modalName" placeholder="John Doe" required />
                    </div>
                  )}

                  <div className="mb-3 auth-input-group input-group">
                    <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                    <input type="email" className="form-control" id="modalEmail" placeholder="you@example.com" required />
                  </div>

                  <div className="mb-2 auth-input-group input-group">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <input type="password" className="form-control" id="modalPassword" placeholder={isLogin ? '••••••••' : 'Create a strong password'} required />
                  </div>

                  {isLogin && (
                    <div className="d-flex justify-content-end">
                      <a href="#" className="auth-footer-link small">Forgot password?</a>
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button type="submit" className="btn btn-hero-primary btn-lg">{isLogin ? 'Login' : 'Create account'}</button>
                  </div>
                </form>

                <div className="auth-divider"><span>or {isLogin ? 'continue' : 'sign up'} with</span></div>
                <div className="auth-social d-flex gap-2 mt-3">
                  <button type="button" className="btn w-100"><i className="bi bi-google me-2"></i>Google</button>
                  <button type="button" className="btn w-100"><i className="bi bi-facebook me-2"></i>Facebook</button>
                </div>

                <div className="text-center mt-4">
                  {isLogin ? (
                    <>
                      <span className="text-white-50">Don't have an account? </span>
                      <button className="auth-footer-link btn btn-link p-0" onClick={() => onSwitchMode && onSwitchMode('register')}>Create one</button>
                    </>
                  ) : (
                    <>
                      <span className="text-white-50">Already have an account? </span>
                      <button className="auth-footer-link btn btn-link p-0" onClick={() => onSwitchMode && onSwitchMode('login')}>Log in</button>
                    </>
                  )}
                </div>

                <div className="text-center mt-3">
                  <button className="btn btn-sm btn-outline-light" onClick={onClose}><i className="bi bi-x-lg me-1"></i>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AuthModal;
