// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './components/MainPage';
import Footer from './components/Footer';
import UserSignupForm from './components/UserSignupForm';
import AdminSignupForm from './components/AdminSignupForm';
import UserLoginForm from './components/UserLoginForm';
import AdminLoginForm from './components/AdminLoginForm';
import UserDashboard from './components/UserDashboard.jsx';
import CreateDoctor from './components/CreateDoctor.jsx';
import UserProfile from './components/UserProfile';
import ManageAppointments from './components/ManageAppointments';
import Settings from './components/Settings';
import Bookmarks from './components/Bookmarks';
import Logout from './components/Logout';
import AdminDashboard from './components/AdminDashboard.jsx';
import Users from './components/UsersList.jsx';
import ManageAdminAppointments from './components/ManageAdminAppointments.jsx';
import Doctors from './components/DoctorsList.jsx';
import ManageDoctors from './components/ManageDoctors.jsx';
import AdminSettings from './components/AdminSettings.jsx';
import AdminBookmarks from './components/AdminBookmarks.jsx';
import AdminProfile from './components/AdminProfile.jsx';

import { AuthProvider } from './context/AuthContext'; // ✅ import context provider
import './App.css';

// Footer component
const FooterComponent = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>MedCare Hospital</h3>
        <p>Providing quality healthcare services since 2010.</p>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-linkedin"></i>
        </div>
      </div>
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/#features">Features</a></li>
          <li><a href="/#blog">Blog</a></li>
          <li><a href="/#faq">FAQs</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Contact Us</h3>
        <p><i className="fas fa-map-marker-alt"></i> 123 Medical Street, Healthcare City</p>
        <p><i className="fas fa-phone"></i> +1 234 567 8900</p>
        <p><i className="fas fa-envelope"></i> contact@medcare.com</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 MedCare Hospital Management System. All rights reserved.</p>
    </div>
  </footer>
);

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap everything inside AuthProvider */}
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/user-signup" element={<UserSignupForm />} />
            <Route path="/admin-signup" element={<AdminSignupForm />} />
            <Route path="/userloginform" element={<UserLoginForm />} />
            <Route path="/adminloginform" element={<AdminLoginForm />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-doctor" element={<CreateDoctor />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/appointments" element={<ManageAppointments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/manage-appointments" element={<ManageAdminAppointments />} />
            <Route path="/manage-doctors" element={<ManageDoctors />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/admin-bookmarks" element={<AdminBookmarks />} />
          </Routes>
          <FooterComponent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
