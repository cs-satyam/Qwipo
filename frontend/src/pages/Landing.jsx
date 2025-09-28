import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Hero from './components/Hero'; // Renamed the old Header component to Hero for clarity
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials'; // Add a Testimonials component
import Footer from './components/Footer';
import About from './components/About';
import ContactUs from './components/ContactUs';
import UserReviews from './components/UserReviews';

import 'animate.css/animate.min.css';
import AuthModal from './components/AuthModal';

function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuth = () => setShowAuth(false);

  return (
    <div>
      <Header onOpenAuth={() => openAuth('login')} />
      <div id="home">
        <Hero onOpenAuth={() => openAuth('login')} />
      <div id="about">
        <About />
      </div>
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="howitworks">
        <HowItWorks />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="reviews">
        <UserReviews />
      </div>
      <div id="contact">
        <ContactUs />
      </div>
      <Footer />
      <AuthModal show={showAuth} mode={authMode} onClose={closeAuth} onSwitchMode={setAuthMode} />
    </div>
  );
}

export default Landing;