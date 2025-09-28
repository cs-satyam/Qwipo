import React from 'react';
import Sidebar from './Sidebar';

const OffcanvasSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="offcanvas offcanvas-start bg-dark text-white shadow-lg"
      tabIndex="-1"
      id="appSidebar"
      aria-labelledby="appSidebarLabel"
      style={{ width: '16rem' }}
    >
      <div className="offcanvas-header border-bottom border-secondary-subtle py-3">
        <h5 className="offcanvas-title text-light fw-bold" id="appSidebarLabel">
          🛒 Retailer Nav
        </h5>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          data-bs-dismiss="offcanvas" 
          aria-label="Close"
        />
      </div>
      <div className="offcanvas-body">
        {/*
          We wrap the Sidebar component in a div to add proper padding.
          The original code had p-0 on the offcanvas-body which is not ideal for nav buttons.
        */}
        <div className="py-2">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => { 
              setActiveTab(tab); 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default OffcanvasSidebar;