import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/Hero.css';
import { Link } from 'react-router-dom';

function Hero({ onOpenAuth }) {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  // Count-up animation logic
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setStatsInView(true);
            observer.disconnect(); // trigger once
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const useCountUp = (end, durationMs = 1500, decimals = 0) => {
    const [value, setValue] = useState(0);
    const rafRef = useRef(0);
    const startRef = useRef(0);

    useEffect(() => {
      if (!statsInView) return;
      const start = performance.now();
      startRef.current = start;

      const animate = now => {
        const elapsed = now - startRef.current;
        const progress = Math.min(elapsed / durationMs, 1);
        const current = end * progress;
        setValue(current);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }, [statsInView, end, durationMs]);

    const formatted = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString();
    return formatted;
  };

  const users = useCountUp(10000, 1600, 0); // 10K+
  const profit = useCountUp(40, 1400, 0);   // 40%
  const accuracy = useCountUp(99.9, 1800, 1); // 99.9%

  return (
    <section id="home" className="hero-section text-white text-center">
      <div className="hero-bg-overlay"></div>
      <div className="hero-particles"></div>
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-10">
            <div className="hero-badge mb-4" data-aos="fade-down">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                <i className="bi bi-stars me-2"></i>AI-Powered Recommendations
              </span>
            </div>
            <h1 className="hero-title" data-aos="fade-up" data-aos-duration="1500">
              Discover Your Next <span className="text-warning">Best-Seller</span>. Instantly.
            </h1>
            <p className="hero-subtitle mt-4 mb-5" data-aos="fade-up" data-aos-delay="300">
              Qwipo's intelligent recommendation engine helps you find the right products,
              optimize your inventory, and <strong>boost your profits by up to 40%</strong>.
            </p>
            <div className="hero-buttons" data-aos="zoom-in" data-aos-delay="600">
              {onOpenAuth ? (
                <button type="button" onClick={() => onOpenAuth('login')} className="btn btn-warning hero-btn me-3 mb-3">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Get Started Free
                </button>
              ) : (
                <Link to="/login" className="btn btn-warning hero-btn me-3 mb-3">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Get Started Free
                </Link>
              )}
              <a href="#howitworks" className="btn btn-outline-light hero-btn-secondary mb-3">
                <i className="bi bi-play-circle me-2"></i>
                Watch Demo
              </a>
            </div>
            <div ref={statsRef} className="hero-stats mt-5" data-aos="fade-up" data-aos-delay="800">
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="stat-item">
                    <h3 className="stat-number text-warning">{statsInView ? `${users}+ `: '0'}</h3>
                    <p className="stat-label">Active Users</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-item">
                    <h3 className="stat-number text-warning">{statsInView ?` ${profit}% `: '0%'}</h3>
                    <p className="stat-label">Profit Increase</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-item">
                    <h3 className="stat-number text-warning">{statsInView ? `${accuracy}% `: '0%'}</h3>
                    <p className="stat-label">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <a href="#features" className="scroll-down">
          <i className="bi bi-chevron-down"></i>
        </a>
      </div>
    </section>
  );
}

export default Hero;