import React from 'react';
import { Card } from './MainContent';

const OffersContent = ({ handleSelectItem }) => (
    <div className="row g-4">
      <div className="col-12">
        <Card title="Personalized Discounts" className="bg-primary-subtle border border-primary-subtle">
          <p className="fs-4 fw-bold text-primary">Extra 10% off on your frequently bought category: DAIRY</p>
          <p className="small mt-1">Valid until this weekend. Use code: DAIRY10</p>
          <button onClick={() => handleSelectItem('Dairy Offer')} className="btn btn-primary fw-bold rounded-3 mt-3">View Products</button>
        </Card>
      </div>
      <div className="col-12">
        <Card title="Loyalty Points Tracker" className="bg-warning-subtle border border-warning-subtle">
          <p className="display-4 fw-extrabold text-warning">3,450</p>
          <p className="small mt-1">Points earned so far. Redeemable value: <strong>₹345</strong></p>
        </Card>
      </div>
    </div>
);

export default OffersContent;