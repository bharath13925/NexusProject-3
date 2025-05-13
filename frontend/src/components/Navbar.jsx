// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-hospital"></i> MedCare
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/#features" className="nav-link" onClick={() => scrollToSection('features')}>
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/#blog" className="nav-link" onClick={() => scrollToSection('blog')}>
              Blog
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/#faq" className="nav-link" onClick={() => scrollToSection('faq')}>
              FAQs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/#login-section" className="nav-link register-btn" onClick={() => scrollToSection('login-section')}>
              Register Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;