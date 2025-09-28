import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/About.css';
import aboutImg from '../../assets/image.png';

function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section id="about" className="about-section py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Text side */}
          <div className="col-lg-6" data-aos="fade-right">
            <div className="section-badge mb-3">
              <span className="badge bg-dark-subtle text-dark px-3 py-2 rounded-pill">
                <i className="bi bi-bullseye me-2"></i>About Qwipo Recommends
              </span>
            </div>
            <h2 className="about-title mb-3">The Challenge: Repetitive Buying & Missed Opportunities</h2>
            <p className="about-text mb-4">
              Retailers on Qwipo's marketplace often get stuck in a loop of repetitive buying, missing out on new, relevant products that could significantly boost their sales. This leads to suboptimal business outcomes for both retailers and distributors.
            </p>
            <ul className="about-list list-unstyled mb-4">
              <li className="d-flex align-items-start mb-2"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i><span>Break the habit loop with AI-curated product suggestions</span></li>
              <li className="d-flex align-items-start mb-2"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i><span>Discover high-margin, high-demand items before competitors</span></li>
              <li className="d-flex align-items-start"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i><span>Optimize inventory with data-backed decisions</span></li>
            </ul>
            <div className="row g-3 kpi-row">
              <div className="col-6">
                <div className="kpi-card">
                  <h3 className="kpi-number text-primary">40%</h3>
                  <p className="kpi-label">Avg. Profit Boost</p>
                </div>
              </div>
              <div className="col-6">
                <div className="kpi-card">
                  <h3 className="kpi-number text-primary">10K+</h3>
                  <p className="kpi-label">Active Users</p>
                </div>
              </div>
            </div>
          </div>
          {/* Image side */}
          <div className="col-lg-6" data-aos="fade-left">
            <div className="about-image-wrapper">
              <div className="about-image-blob"></div>
              <img
                src={aboutImg}
                alt="Empowering B2B retail with intelligent product recommendations"
                className="about-image img-fluid"
                loading="lazy"
              />
              <div className="about-image-ring"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;