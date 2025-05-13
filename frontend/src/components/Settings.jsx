import React, { useState, useEffect } from 'react';
import SidebarComponent from '../components/Sidebar';
import '../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Get user ID from localStorage
    const uid = localStorage.getItem('uid');
    
    if (!uid) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Fetch user data
    fetch(`http://localhost:5000/api/users/${uid}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          password: '',
          confirmPassword: '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    // Here you would normally make an API call to update the profile
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
    setMessage({ type: 'success', text: 'Password updated successfully!' });
    // Here you would normally make an API call to update the password
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    setFormData({
      ...formData,
      password: '',
      confirmPassword: '',
    });
  };

  const handleNotificationUpdate = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Notification preferences updated!' });
    // Here you would normally make an API call to update notification preferences
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="sidebar-container">
          <SidebarComponent />
        </div>
        <div className="main-content">
          <div className="loading">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-container">
        <div className="sidebar-container">
          <SidebarComponent />
        </div>
        <div className="main-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <h2>Settings</h2>
        
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="settings-form">
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </div>
        )}
        
        {activeTab === 'password' && (
          <div className="settings-form">
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="save-btn">Update Password</button>
            </form>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="settings-form">
            <form onSubmit={handleNotificationUpdate}>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="appointmentReminders" 
                  name="appointmentReminders" 
                  checked={notifications.appointmentReminders} 
                  onChange={handleNotificationChange}
                />
                <label htmlFor="appointmentReminders">Appointment Reminders</label>
              </div>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="emailNotifications" 
                  name="emailNotifications" 
                  checked={notifications.emailNotifications} 
                  onChange={handleNotificationChange}
                />
                <label htmlFor="emailNotifications">Email Notifications</label>
              </div>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="smsNotifications" 
                  name="smsNotifications" 
                  checked={notifications.smsNotifications} 
                  onChange={handleNotificationChange}
                />
                <label htmlFor="smsNotifications">SMS Notifications</label>
              </div>
              
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="marketingEmails" 
                  name="marketingEmails" 
                  checked={notifications.marketingEmails} 
                  onChange={handleNotificationChange}
                />
                <label htmlFor="marketingEmails">Marketing Emails</label>
              </div>
              
              <button type="submit" className="save-btn">Save Preferences</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;