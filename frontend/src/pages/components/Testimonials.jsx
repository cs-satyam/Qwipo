import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/Testimonials.css';

function Testimonials() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section id="testimonials" className="testimonials-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-badge mb-3" data-aos="fade-up">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
              <i className="bi bi-chat-quote-fill me-2"></i>Testimonials
            </span>
          </div>
          <h2 className="testimonials-title" data-aos="fade-up" data-aos-delay="200">What Our Retailers Say</h2>
          <p className="testimonials-subtitle" data-aos="fade-up" data-aos-delay="350">Real results from businesses like yours</p>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="testimonial-card h-100">
              <div className="d-flex align-items-center mb-3">
                <img className="avatar me-3" alt="Rahul Sharma" src="https://i.pravatar.cc/80?img=12" />
                <div>
                  <h6 className="mb-0">Rahul Sharma</h6>
                  <small className="text-muted">Retailer</small>
                </div>
              </div>
              <div className="rating mb-2" aria-label="5 out of 5 stars">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
              </div>
              <p className="testimonial-text">“The recommendations from Qwipo helped me discover products I'd never considered. My sales went up by 15% in the first quarter!”</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="350">
            <div className="testimonial-card h-100">
              <div className="d-flex align-items-center mb-3">
                <img className="avatar me-3" alt="Priya K." src="https://i.pravatar.cc/80?img=32" />
                <div>
                  <h6 className="mb-0">Priya K.</h6>
                  <small className="text-muted">B2B Supplier</small>
                </div>
              </div>
              <div className="rating mb-2" aria-label="4 out of 5 stars">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star text-warning"></i>
              </div>
              <p className="testimonial-text">“It's like having a business consultant telling me exactly what to stock. My inventory is more efficient and my customers are happier.”</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
            <div className="testimonial-card h-100">
              <div className="d-flex align-items-center mb-3">
                <img className="avatar me-3" alt="Imran S." src="https://i.pravatar.cc/80?img=8" />
                <div>
                  <h6 className="mb-0">Imran S.</h6>
                  <small className="text-muted">Distributor</small>
                </div>
              </div>
              <div className="rating mb-2" aria-label="5 out of 5 stars">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
              </div>
              <p className="testimonial-text">“We identified new high-margin products in days. Qwipo made our recommendations truly personalized.”</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;