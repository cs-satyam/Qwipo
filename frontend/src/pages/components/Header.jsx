import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './css/Header.css';
import { Link } from 'react-router-dom';

const Header = ({ onOpenAuth }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      className={`custom-navbar py-3 sticky-top ${scrolled ? 'scrolled' : ''}`}
      variant="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="bi bi-lightning-charge-fill me-2"></i>
          <span className="brand-text">Qwipo</span>
          <span className="brand-accent">Recommends</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="#features" className="nav-link-custom mx-2">
              <i className="bi bi-star-fill me-1"></i>Features
            </Nav.Link>
            <Nav.Link href="#howitworks" className="nav-link-custom mx-2">
              <i className="bi bi-gear-fill me-1"></i>How it Works
            </Nav.Link>
            <Nav.Link href="#about" className="nav-link-custom mx-2">
              <i className="bi bi-info-circle-fill me-1"></i>About
            </Nav.Link>
            <Nav.Link href="#testimonials" className="nav-link-custom mx-2">
              <i className="bi bi-chat-quote-fill me-1"></i>Testimonials
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/login"
              className="btn btn-warning login-btn text-dark fw-bold ms-lg-3 my-2 my-lg-0 px-4"
            >
              <i className="bi bi-person-fill me-2"></i> Get Started
            </Nav.Link>


            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;