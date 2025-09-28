import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import TopStats from './TopStats';
import OffcanvasSidebar from './OffcanvasSidebar';

// Main Landing Component that orchestrates the dashboard layout
const Dashboard = () => {
  // State to track the currently active navigation tab
  const [activeTab, setActiveTab] = useState('Home');
  // State for a selected item (placeholder functionality)
  const [selectedItem, setSelectedItem] = useState('None');

  // Utility function to set selected item
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column font-sans">
      {/* NOTE: Bootstrap CSS must be included in your main HTML file for these styles to work. */}
      {/* Example: <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"> */}
      
      {/* Header component, passed state as props */}
      <Header selectedItem={selectedItem} handleSelectItem={handleSelectItem} />
      
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar component, passed state as props */}
        <div className="d-none d-md-block flex-shrink-0" style={{ width: '16rem' }}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main content area, passed state as props */}
        <main className="flex-grow-1 overflow-auto p-4 p-md-5">
          {/* Top stats row */}
          <div className="container-fluid mb-4">
            <TopStats />
          </div>
          
          {/* Main dynamic tab content */}
          <div className="container-fluid">
            <MainContent activeTab={activeTab} handleSelectItem={handleSelectItem} />
          </div>
        </main>
      </div>
      {/* Offcanvas sidebar for mobile */}
      <OffcanvasSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Dashboard;