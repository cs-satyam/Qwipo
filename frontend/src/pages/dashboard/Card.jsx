import React from 'react';

const Card = ({ title, children, bgColor = 'bg-white', className = '' }) => (
  // Bootstrap equivalent of the Tailwind Card styles:
  // p-4: Padding
  // shadow: Shadow effect (less strong than shadow-lg but available)
  // rounded-3: Rounded corners (replaces rounded-xl)
  // bg-white: Default background
  // className is added for custom overrides or background colors (e.g., bg-light, bg-danger-subtle)
  <div className={`card ${className} ${bgColor} border-0 shadow-sm transition-shadow`} 
       // Inline style to mimic the hover effect in the absence of a direct Bootstrap utility
       style={{ borderRadius: '1rem', transition: 'box-shadow 0.3s', cursor: 'default' }}> 
    
    <div className="card-body p-4">
      {/* Title: h5 for size, fw-semibold for font weight, mb-3 for margin bottom, border-bottom for the line */}
      <h5 className="card-title h5 fw-semibold text-dark border-bottom pb-2 mb-3">
        {title}
      </h5>
      {/* Content: text-muted for gray text */}
      <div className="text-secondary">
        {children}
      </div>
    </div>
  </div>
);

export default Card;
