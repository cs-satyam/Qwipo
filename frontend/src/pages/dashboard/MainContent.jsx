import React from 'react';
import HomeContent from './Home';
import ProductContent from './Product';
import OrdersContent from './Orders';
import RecommendationsContent from './Recommendations';
import OffersContent from './Offers';
import InsightsContent from './Insights';
import SupportContent from './Support';

// A utility Card component to wrap content, simplifying styling
const Card = ({ title, children, bgColor = 'bg-white', className = '' }) => (
    <div className={`card ${className} ${bgColor} border-0 shadow-sm transition-shadow`} 
         style={{ borderRadius: '1rem', transition: 'box-shadow 0.3s', cursor: 'default' }}> 
      <div className="card-body p-4">
        <h5 className="card-title h5 fw-semibold text-dark border-bottom pb-2 mb-3">
          {title}
        </h5>
        <div className="text-secondary">
          {children}
        </div>
      </div>
    </div>
);

const MainContent = ({ activeTab, handleSelectItem }) => {
  switch (activeTab) {
    case 'Home':
      return <HomeContent handleSelectItem={handleSelectItem} />;
    case 'Products':
      return <ProductContent handleSelectItem={handleSelectItem} />;
    case 'Orders':
      return <OrdersContent handleSelectItem={handleSelectItem} />;
    case 'Recommendations':
      return <RecommendationsContent handleSelectItem={handleSelectItem} />;
    case 'Offers & Discounts':
      return <OffersContent handleSelectItem={handleSelectItem} />;
    case 'Insights':
      return <InsightsContent handleSelectItem={handleSelectItem} />;
    case 'Support':
      return <SupportContent handleSelectItem={handleSelectItem} />;
    default:
      return <div className="text-center p-5 text-muted">Select a tab to view content.</div>;
  }
};

export { Card }; // Export Card component for use in other files
export default MainContent;