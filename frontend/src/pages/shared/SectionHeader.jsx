import React from 'react';

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="d-flex align-items-center mb-3">
    {icon && <i className={`bi ${icon} text-warning me-2`}></i>}
    <div>
      <h5 className="mb-0">{title}</h5>
      {subtitle && <small className="text-muted">{subtitle}</small>}
    </div>
  </div>
);

export default SectionHeader;
