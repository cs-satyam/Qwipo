import React from 'react';

const CardList = ({ items, renderItem, cols = 'col-12 col-md-6 col-lg-4' }) => (
  <div className="row g-3">
    {items.map((item, idx) => (
      <div key={idx} className={cols}>
        {renderItem(item)}
      </div>
    ))}
  </div>
);

export default CardList;
