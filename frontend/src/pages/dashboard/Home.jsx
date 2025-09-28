import React from 'react';
import { Card } from './MainContent'; // Assuming Card is imported from MainContent

// --- Sub-Component: Restock Alerts (Improved Contrast and Urgency) ---
const RestockAlerts = ({ handleSelectItem }) => (
    // Using d-grid and gap-3 for consistent vertical spacing between alert cards
    <div className="d-grid gap-3">
      {/* Urgent Action Card: Enhanced to look like a critical alert area */}
      <Card title="🚨 Restock Alerts - Urgent Action" className="bg-danger-subtle border border-danger shadow-sm">
        <p className="fs-5 text-danger fw-bolder d-flex align-items-center mb-0">
          <span className="me-3">⚠️</span> Low Stock: Basmati Rice (5kg bags)
          <span className="badge text-bg-danger ms-2 rounded-pill fs-6">4 units left</span>
          
          <button 
            onClick={() => handleSelectItem('Basmati Rice')} 
            className="btn btn-danger btn-sm rounded-pill fw-semibold ms-auto px-3 py-1"
          >
            Order 50 Units
          </button>
        </p>
      </Card>

      {/* Predictive Warning Card: Enhanced to look like a medium-priority warning */}
      <Card title="⏳ Predictive Stock-Out Warning" className="bg-warning-subtle border border-warning shadow-sm">
        <p className="fs-6 text-warning-emphasis fw-bold mb-0 d-flex align-items-center">
          Cooking Oil (1L bottles) will finish in ~5 days based on sales velocity.
        </p>
      </Card>
    </div>
);

// --- Sub-Component: Recommendations (Clearer list items) ---
const Recommendations = ({ handleSelectItem }) => (
    <div className="my-4">
      <Card title="💡 Smart Recommendations">
        <p className="small fst-italic text-muted">Based on your past 10 orders and market trends.</p>
        
        {/* List items with improved spacing and visual feedback */}
        <ul className="list-unstyled mt-3 d-grid gap-2">
          <li className="text-primary fw-semibold fs-6">⭐ New Protein Bars (10% off)</li>
          <li className="text-primary fw-semibold fs-6">📦 Bulk Organic Flour (Ready to order)</li>
          <li className="text-primary fw-semibold fs-6">📈 Trending: Artisanal Coffee Beans</li>
        </ul>
        
        <button 
          onClick={() => handleSelectItem('Protein Bars')} 
          className="btn btn-primary btn-sm fw-semibold rounded-pill mt-3 px-4"
        >
          Explore All Recommendations
        </button>
      </Card>
    </div>
);

// --- Main Component: HomeContent ---
const HomeContent = ({ handleSelectItem }) => (
  <div className="row g-4">
    {/* Left Column (8 units on MD+, 12 units on XS) */}
    <div className="col-12 col-md-8">
      <h2 className="fs-3 fw-bolder text-dark mb-4">👋 Welcome Back! Your Quick Overview</h2>
      
      {/* Alerts Section */}
      <div className="mb-5">
        <RestockAlerts handleSelectItem={handleSelectItem} />
      </div>
      
      {/* Recommendations Section */}
      <Recommendations handleSelectItem={handleSelectItem} />
    </div>
    
    {/* Right Column (4 units on MD+, 12 units on XS) */}
    <div className="col-12 col-md-4">
      <h2 className="fs-4 fw-bold text-transparent mb-4 invisible">Snapshot</h2>
      
      {/* Quick Business Snapshot Card: Enhanced with bold typography */}
      <Card title="📊 Quick Business Snapshot" className="bg-primary-subtle border border-primary shadow-lg h-100">
        <p className="small text-muted mb-2">Weekly Inventory Spend:</p>
        <p className="display-4 fw-extrabold text-primary mb-4">₹1,50,000</p>
        
        <p className="fs-6 fw-semibold text-dark mb-1">Top Selling Item (Predicted):</p>
        <p className="fs-5 fw-bold text-success mb-3">Milk (Full Cream)</p>

        <p className="small text-muted mb-1">Urgent Inventory Status:</p>
        <p className="fs-6 fw-bold text-danger mb-0">Basmati Rice (4 units left)</p>
        
      </Card>
    </div>
  </div>
);

export default HomeContent;