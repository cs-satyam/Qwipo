import React from 'react';

const Header = ({ selectedItem }) => {
  // Custom style for the indigo color, as Bootstrap doesn't provide this specific shade by default
  const indigoStyle = {
    color: '#4338CA', // A dark indigo hex color
    fontWeight: '800'
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow sticky-top border-bottom" style={{ zIndex: 10 }}>
      {/* NOTE: For these classes to work, Bootstrap 5 CSS and JS must be loaded. */}
      
      {/* Left Side: AI-Powered Store Title */}
      <div className="d-flex align-items-center">
        {/* Mobile hamburger to open offcanvas sidebar */}
        <button
          className="btn btn-outline-secondary d-inline-flex d-md-none me-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#appSidebar"
          aria-controls="appSidebar"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <span className="fs-4 me-3" style={indigoStyle}>
          🤖 AI-Powered Store
        </span>
      </div>
      
      {/* Right Side: Need Help Button & Profile */}
      <div className="d-flex align-items-center gap-3">
      
        
        
        {/* User Profile Dropdown */}
        <div className="dropdown">
          {/* Dropdown Toggle Button with an icon */}
          <a className="btn btn-outline-secondary rounded-pill d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
          </a>
        
          {/* Dropdown Menu */}
          <ul className="dropdown-menu dropdown-menu-end shadow">
            <li className="dropdown-header">Logged in as **Store Owner**</li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Edit Profile</a></li>
            <li><a className="dropdown-item" href="#">Logout</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;