import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/CallToAction.css';

function CallToAction() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section id="cta" className="cta-section text-center py-5" data-aos="fade-up">
      <div className="container">
        <h2 className="cta-title mb-4">Ready to Transform Your Business?</h2>
        <a href="#contact" className="btn btn-warning cta-btn">
          Start Your Free Trial
        </a>
      </div>
    </section>
  );
}

export default CallToAction;