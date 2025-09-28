import React from 'react';
import { Card } from './MainContent';

const RecommendationsContent = ({ handleSelectItem }) => (
  <div className="row g-4">
    <div className="col-12">
      <Card title="Recommended for You">
        <p className="small fst-italic">Based on your last 10 orders (e.g., increased demand for seasonal drinks).</p>
        <ul className="list-unstyled mt-2 text-primary fw-medium">
          <li>New Protein Bars (10% off)</li>
          <li>Bulk Organic Flour</li>
          <li>Winter Citrus Fruits</li>
        </ul>
        <button onClick={() => handleSelectItem('Protein Bars')} className="btn btn-primary btn-sm fw-semibold rounded-pill mt-3">Add to Cart</button>
      </Card>
    </div>
    
    <div className="col-12">
      <Card title="Smart Basket: Monthly Essentials (AI Combo Pack)">
        <p className="small fw-semibold text-success">Estimated Savings: ₹500</p>
        <p className="small mt-1">Includes Rice (50kg), Cooking Oil (20L), Sugar (25kg).</p>
        <button onClick={() => handleSelectItem('Smart Basket')} className="btn btn-success fw-bold rounded-3 mt-3">Buy Smart Basket Now</button>
      </Card>
    </div>

    <div className="col-12">
      <Card title="Trending Products in Your Local Area">
        <div className="d-flex justify-content-around text-center mt-2">
            <div><p className="display-6 fw-bold text-danger">#1</p><p>Cold Brew Coffee</p></div>
            <div><p className="display-6 fw-bold text-danger">#2</p><p>Oat Milk</p></div>
            <div><p className="display-6 fw-bold text-danger">#3</p><p>Artisan Bread</p></div>
        </div>
      </Card>
    </div>
  </div>
);

export default RecommendationsContent;