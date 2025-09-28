import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/HowItWorks.css';

function HowItWorks() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section id="how-it-works" className="how-it-works-section py-5">
      <div className="container">
        <h2 className="how-it-works-title mb-5 text-center" data-aos="fade-up">A Simple Path to Better Business</h2>
        <div className="row g-4 justify-content-center">
          {/* Step 1 */}
          <div className="col-lg-3 col-md-6 text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="step-number mb-3">1</div>
            <h5 className="step-title fw-bold mb-2">Data Analysis</h5>
            <p className="step-text">Our system securely analyzes your purchasing patterns and business profile.</p>
          </div>
          {/* Step 2 */}
          <div className="col-lg-3 col-md-6 text-center" data-aos="fade-up" data-aos-delay="400">
            <div className="step-number mb-3">2</div>
            <h5 className="step-title fw-bold mb-2">Intelligent Matching</h5>
            <p className="step-text">We match your needs with a vast catalog of products using advanced AI algorithms.</p>
          </div>
          {/* Step 3 */}
          <div className="col-lg-3 col-md-6 text-center" data-aos="fade-up" data-aos-delay="600">
            <div className="step-number mb-3">3</div>
            <h5 className="step-title fw-bold mb-2">Instant Recommendations</h5>
            <p className="step-text">Receive a personalized list of products, ready to be added to your order.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;