import React, { useState } from 'react';
import './css/ContactUs.css';

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Mock submit
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 900);
  };

  return (
    <section id="contact" className="contact-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-badge mb-3">
            <span className="badge bg-success text-white px-3 py-2 rounded-pill">
              <i className="bi bi-envelope-paper-heart me-2"></i>Contact Us
            </span>
          </div>
          <h2 className="contact-title">Let's build something great together</h2>
          <p className="contact-subtitle">Have questions or need a custom demo? Send us a message.</p>
        </div>

        <div className="row g-4 align-items-stretch">
          <div className="col-lg-6">
            <div className="contact-card h-100 p-4 p-md-5">
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input id="name" name="name" value={form.name} onChange={onChange} required className="form-control form-control-lg" placeholder="Your full name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input id="email" type="email" name="email" value={form.email} onChange={onChange} required className="form-control form-control-lg" placeholder="you@example.com" />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" rows="5" value={form.message} onChange={onChange} required className="form-control form-control-lg" placeholder="Tell us about your needs..." />
                </div>
                <button type="submit" className="btn btn-success btn-lg px-5" disabled={status==='sending'}>
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent ✓' : 'Send Message'}
                </button>
                {status === 'sent' && (
                  <p className="text-success mt-3 mb-0"><i className="bi bi-check-circle me-2"></i>We received your message. We'll get back soon!</p>
                )}
              </form>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="contact-aside h-100 p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle bg-success-subtle text-success me-3"><i className="bi bi-geo-alt-fill"></i></div>
                <div>
                  <h6 className="mb-1">Office</h6>
                  <p className="mb-0 text-muted">Qwipo HQ, Hyderabad, India</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle bg-success-subtle text-success me-3"><i className="bi bi-envelope-fill"></i></div>
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="mb-0 text-muted">support@qwipo.com</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="icon-circle bg-success-subtle text-success me-3"><i className="bi bi-telephone-fill"></i></div>
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="mb-0 text-muted">+91 98765 43210</p>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <a href="#" className="me-3 text-success"><i className="bi bi-whatsapp fs-3"></i></a>
                <a href="#" className="me-3 text-success"><i className="bi bi-linkedin fs-3"></i></a>
                <a href="#" className="text-success"><i className="bi bi-twitter-x fs-3"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
