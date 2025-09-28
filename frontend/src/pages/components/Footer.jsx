import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section text-white pt-5">
      <Container>
        <Row className="g-4 align-items-start">
          <Col md={4}>
            <div className="brand-block mb-3">
              <h5 className="fw-bold mb-1"><i className="bi bi-lightning-charge-fill text-warning me-2"></i>Qwipo <span className="text-warning">Recommends</span></h5>
              <p className="text-muted small mb-0">Empowering B2B retailers with intelligent product discovery and optimized purchasing.</p>
            </div>
          </Col>
          <Col md={4}>
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="#home" className="footer-link p-0 mb-2">Home</Nav.Link>
              <Nav.Link href="#about" className="footer-link p-0 mb-2">About Us</Nav.Link>
              <Nav.Link href="#features" className="footer-link p-0 mb-2">Features</Nav.Link>
              <Nav.Link href="#howitworks" className="footer-link p-0 mb-2">How It Works</Nav.Link>
              <Nav.Link href="#testimonials" className="footer-link p-0 mb-2">Testimonials</Nav.Link>
              <Nav.Link href="#contact" className="footer-link p-0">Contact</Nav.Link>
            </Nav>
          </Col>
          <Col md={4}>
            <h5 className="fw-bold mb-3">Connect With Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start social-row">
              <a href="#" className="social-link me-3"><i className="bi bi-facebook fs-4"></i></a>
              <a href="#" className="social-link me-3"><i className="bi bi-twitter fs-4"></i></a>
              <a href="#" className="social-link me-3"><i className="bi bi-linkedin fs-4"></i></a>
              <a href="#" className="social-link"><i className="bi bi-instagram fs-4"></i></a>
            </div>
            <p className="text-muted mt-3 mb-0 small">Email: info@qwipo.com</p>
          </Col>
        </Row>
        <hr className="my-4 border-secondary opacity-25" />
        <Row className="pb-3">
          <Col className="text-center text-muted small">
            <p className="mb-0">&copy; {new Date().getFullYear()} Qwipo. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
} 

export default Footer;