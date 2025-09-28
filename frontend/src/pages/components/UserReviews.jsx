import React from 'react';
import './css/UserReviews.css';

const sampleReviews = [
  {
    name: 'Kavya R.',
    role: 'Retail Owner',
    rating: 5,
    text: 'Fantastic insights! The recommendations matched our customer preferences perfectly.',
    avatar: 'https://i.pravatar.cc/80?img=5'
  },
  {
    name: 'Anil Kumar',
    role: 'Wholesale Partner',
    rating: 4,
    text: 'Helped us identify fast-selling SKUs. Inventory turns improved within a month.',
    avatar: 'https://i.pravatar.cc/80?img=20'
  },
  {
    name: 'Neha S.',
    role: 'Category Manager',
    rating: 5,
    text: 'The dashboard is clean and actionable. We discovered new high-margin products quickly.',
    avatar: 'https://i.pravatar.cc/80?img=15'
  }
];

function Stars({ count }) {
  return (
    <div className="stars" aria-label={`${count} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`bi ${i < count ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
      ))}
    </div>
  );
}

function UserReviews() {
  return (
    <section id="reviews" className="reviews-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-badge mb-3">
            <span className="badge bg-info text-dark px-3 py-2 rounded-pill">
              <i className="bi bi-people-fill me-2"></i>User Reviews
            </span>
          </div>
          <h2 className="reviews-title">Loved by modern retailers</h2>
          <p className="reviews-subtitle">What users say after adopting Qwipo recommendations</p>
        </div>

        <div className="row g-4">
          {sampleReviews.map((r, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div className="review-card h-100">
                <div className="d-flex align-items-center mb-3">
                  <img className="avatar me-3" src={r.avatar} alt={r.name} />
                  <div>
                    <h6 className="mb-0">{r.name}</h6>
                    <small className="text-muted">{r.role}</small>
                  </div>
                </div>
                <Stars count={r.rating} />
                <p className="review-text mt-2 mb-0">“{r.text}”</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UserReviews;
