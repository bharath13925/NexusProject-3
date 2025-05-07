// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>MediCare Hospital</h3>
          <p>Providing compassionate care since 1985</p>
          <p>123 Healing Street, Wellness City</p>
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@medicarehospital.com</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/patients">Patient Portal</a></li>
            <li><a href="/appointments">Book Appointment</a></li>
            <li><a href="/emergency">Emergency Services</a></li>
            <li><a href="/departments">Departments</a></li>
            <li><a href="/doctors">Find a Doctor</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><a href="/services/cardiology">Cardiology</a></li>
            <li><a href="/services/neurology">Neurology</a></li>
            <li><a href="/services/pediatrics">Pediatrics</a></li>
            <li><a href="/services/orthopedics">Orthopedics</a></li>
            <li><a href="/services/psychiatry">Psychiatry</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <div className="newsletter">
            <h4>Subscribe to our Newsletter</h4>
            <form>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} MediCare Hospital. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/accessibility">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;