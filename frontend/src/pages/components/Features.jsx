import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/Features.css';

function Features() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  const features = [
    {
      icon: "bi-graph-up-arrow",
      title: "Profit Maximization",
      description: "Increase your average order value and profit margins by up to 40% with AI-powered product recommendations.",
      color: "primary",
      delay: 200
    },
    {
      icon: "bi-box-seam-fill",
      title: "Smart Inventory",
      description: "Optimize your stock levels with predictive analytics. Never run out of bestsellers or overstock slow movers.",
      color: "success",
      delay: 400
    },
    {
      icon: "bi-lightbulb-fill",
      title: "Product Discovery",
      description: "Discover trending products before your competitors. Our AI analyzes market patterns and consumer behavior.",
      color: "warning",
      delay: 600
    },
    {
      icon: "bi-speedometer2",
      title: "Real-time Analytics",
      description: "Get instant insights into your sales performance with comprehensive dashboards and reports.",
      color: "info",
      delay: 800
    },
    {
      icon: "bi-shield-check-fill",
      title: "Risk Management",
      description: "Minimize inventory risks with advanced forecasting and demand prediction algorithms.",
      color: "danger",
      delay: 1000
    },
    {
      icon: "bi-people-fill",
      title: "Customer Insights",
      description: "Understand your customers better with detailed behavioral analysis and preference mapping.",
      color: "secondary",
      delay: 1200
    }
  ];

  return (
    <section id="features" className="features-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-badge mb-3" data-aos="fade-up">
            <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
              <i className="bi bi-stars me-2"></i>Features
            </span>
          </div>
          <h2 className="features-title mb-4" data-aos="fade-up" data-aos-delay="200">
            Powerful Features. <span className="text-primary">Tangible Results.</span>
          </h2>
          <p className="features-subtitle" data-aos="fade-up" data-aos-delay="400">
            Everything you need to transform your business with intelligent recommendations
          </p>
        </div>
        
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={feature.delay}>
              <div className="feature-card h-100">
                <div className="feature-icon-wrapper">
                  <div className={`feature-icon bg-${feature.color}`}>
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                </div>
                <div className="feature-content">
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-link">
                    <span>Learn more <i className="bi bi-arrow-right ms-1"></i></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="1400">
          <a href="#howitworks" className="btn btn-primary btn-lg px-5 py-3">
            <i className="bi bi-play-circle me-2"></i>
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

export default Features;