import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Inventory', icon: '📦' },
    { name: 'Sales', icon: '📊' },
    { name: 'Retailers', icon: '🧑‍🤝‍🧑' },
    { name: 'Promotions', icon: '🏷️' },
    { name: 'Reports', icon: '📄' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="p-4 bg-dark h-100 d-flex flex-column" style={{ width: '16rem' }}>
      <div className="text-white h5 fw-bold mb-4 border-bottom border-secondary-subtle pb-3">
        📦 Distributor Nav
      </div>
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveTab(item.name)}
          className={`
            btn btn-dark text-start d-flex align-items-center px-4 py-3 rounded-3
            ${activeTab === item.name
              ? 'bg-primary text-white shadow'
              : 'text-light bg-opacity-75'
            }
          `}
        >
          <span className="fs-5 me-3">{item.icon}</span>
          {item.name}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
