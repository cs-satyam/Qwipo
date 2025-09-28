import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" style={{ zIndex: 10 }}>
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-primary">📦 Distributor Hub</span>
        
        {/* User Profile Dropdown on the right */}
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <a className="btn btn-outline-primary rounded-pill d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li className="dropdown-header">Logged in as **Distributor**</li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">Edit Profile</a></li>
              <li><a className="dropdown-item" href="#">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;