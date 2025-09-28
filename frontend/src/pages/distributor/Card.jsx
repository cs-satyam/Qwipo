import React from 'react';

const Card = ({ title, children, className = '', headerRight = null }) => (
  <div className={`card border-0 shadow-sm ${className}`} style={{ borderRadius: '1rem' }}>
    <div className="card-body p-4">
      {title && (
        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
          <h5 className="card-title h5 fw-semibold mb-0">{title}</h5>
          <div>{headerRight}</div>
        </div>
      )}
      {children}
    </div>
  </div>
);

export default Card;
