import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Home from './Home';
import Inventory from './Inventory';
import Sales from './Sales';
import Retailers from './Retailers';
import Promotions from './Promotions';
import Reports from './Reports';
import Settings from './Settings';

const DistributorDashboard = () => {
  const [active, setActive] = useState('Home');

  const renderContent = () => {
    switch (active) {
      case 'Home':
        return <Home />;
      case 'Inventory':
        return <Inventory />;
      case 'Sales':
        return <Sales />;
      case 'Retailers':
        return <Retailers />;
      case 'Promotions':
        return <Promotions />;
      case 'Reports':
        return <Reports />;
      case 'Settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar active={active} onChange={setActive} />
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="d-none d-md-block flex-shrink-0" style={{ width: '16rem' }}>
          <Sidebar activeTab={active} setActiveTab={setActive} />
        </div>
        {/* Main Content */}
        <main className="flex-grow-1 overflow-auto p-4 p-md-5">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DistributorDashboard;
