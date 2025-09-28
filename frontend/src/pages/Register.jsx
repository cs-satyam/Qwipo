import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import "./components/css/Hero.css";
import "./components/css/Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRetailer, setIsRetailer] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role: isRetailer ? 'retailer' : 'buyer' },
        { headers: { "Content-Type": "application/json" } }
      );

      // Save JWT + user info (store both token keys for compatibility)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Success popup
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "You have successfully registered.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect after short delay
      setTimeout(() => {
        if (res.data?.user?.role === 'retailer') navigate('/retailer');
        else navigate('/mymarket');
      }, 2000);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Registration failed",
      });
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
                  <i className="bi bi-person-plus-fill me-2"></i>Create Account
                </span>
              </div>
              <h2 className="auth-title text-center mb-2">Create your account</h2>
              <p className="auth-subtitle text-center mb-4">It's quick and easy</p>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="mb-3 auth-input-group input-group">
                  <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    id="registerName"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 auth-input-group input-group">
                  <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    id="registerEmail"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2 auth-input-group input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-check mt-2">
                  <input className="form-check-input" type="checkbox" id="registerRetailer" checked={isRetailer} onChange={(e) => setIsRetailer(e.target.checked)} />
                  <label className="form-check-label" htmlFor="registerRetailer">I am a retailer</label>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-hero-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </div>
              </form>

              <div className="auth-divider"><span>or sign up with</span></div>
              <div className="auth-social d-flex gap-2 mt-3">
                <button type="button" className="btn w-100"><i className="bi bi-google me-2"></i>Google</button>
                <button type="button" className="btn w-100"><i className="bi bi-facebook me-2"></i>Facebook</button>
              </div>

              <div className="text-center mt-4">
                <span className="text-white-50">Already have an account? </span>
                <Link to="/login" className="auth-footer-link">Log in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
