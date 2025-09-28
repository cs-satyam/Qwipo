import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.jsx';

const TopNav = () => {
  const navigate = useNavigate();
  const { totals } = useCart ? useCart() : { totals: { count: 0 } };
  const [notifications] = useState([
    { id: 1, text: 'New order ORD-1012 placed', read: false },
    { id: 2, text: 'Stock low: Smartwatch Pro', read: false },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4 px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/mymarket" className="fw-bold">
          <i className="bi bi-shop-window me-2"></i>My Market
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="topnav" />
        <Navbar.Collapse id="topnav">
          <Form className="d-flex ms-auto me-3" role="search">
            <FormControl
              type="search"
              placeholder="Search..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary">Search</Button>
          </Form>

          <Nav className="align-items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="btn btn-light position-relative">
              <i className="bi bi-cart3"></i>
              {totals.count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {totals.count}
                </span>
              )}
            </Link>
            {/* Notifications */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="position-relative">
                <i className="bi bi-bell"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadCount}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notifications.length === 0 ? (
                  <Dropdown.ItemText>No notifications</Dropdown.ItemText>
                ) : (
                  notifications.map(n => (
                    <Dropdown.Item key={n.id}>{n.text}</Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Profile */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light">
                <i className="bi bi-person-circle"></i> Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
