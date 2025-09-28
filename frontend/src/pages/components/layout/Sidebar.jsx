import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  let isRetailer = false;
  try {
    const raw = localStorage.getItem('user');
    const u = raw ? JSON.parse(raw) : null;
    isRetailer = u?.role === 'retailer';
  } catch {}
  return (
    <aside className="dashboard-sidebar bg-body-tertiary border-end">
      <div className="p-3">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-sliders2-vertical me-2 text-primary"></i>
          <span className="fw-semibold text-uppercase small text-muted">Navigation</span>
        </div>
        <Nav defaultActiveKey="/mymarket" className="flex-column gap-1">
          <Nav.Link as={Link} to="/mymarket" className="sidebar-link">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Nav.Link>
          {isRetailer && (
            <Nav.Link as={Link} to="/retailer" className="sidebar-link">
              <i className="bi bi-shop-window me-2"></i> Retailer Dashboard
            </Nav.Link>
          )}
          <Nav.Link as={Link} to="/product" className="sidebar-link">
            <i className="bi bi-box-seam me-2"></i> Products
          </Nav.Link>
          <Nav.Link as={Link} to="/orders" className="sidebar-link">
            <i className="bi bi-bag-check me-2"></i> Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/order-items" className="sidebar-link">
            <i className="bi bi-list-check me-2"></i> Order Items
          </Nav.Link>
          <Nav.Link as={Link} to="/customers" className="sidebar-link">
            <i className="bi bi-people me-2"></i> Customers
          </Nav.Link>
          <Nav.Link as={Link} to="/analytics" className="sidebar-link">
            <i className="bi bi-bar-chart-line me-2"></i> Analytics
          </Nav.Link>
          <Nav.Link as={Link} to="#" disabled className="sidebar-link">
            <i className="bi bi-currency-rupee me-2"></i> Payments
          </Nav.Link>
          <Nav.Link as={Link} to="/settings" className="sidebar-link">
            <i className="bi bi-gear me-2"></i> Settings
          </Nav.Link>
        </Nav>
      </div>
    </aside>
  );
};

export default Sidebar;

