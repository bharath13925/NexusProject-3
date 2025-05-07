import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import '../styles/AdminSettings.css';

const AdminSettings = () => {
  const [adminDetails, setAdminDetails] = useState({
    email: '',
    displayName: '',
    lastLogin: null
  });

  const [notification, setNotification] = useState({
    emailNotifications: true,
    appointmentAlerts: true,
    systemUpdates: false,
    dailyReport: true
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    compactView: false
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    fetch(`http://localhost:5000/api/admin/settings/${uid}`)
      .then(res => res.json())
      .then(data => {
        if (data.notification && data.appearance) {
          setNotification(data.notification);
          setAppearance(data.appearance);
          document.body.className = data.appearance.theme;
        } else {
          console.error('Invalid data format');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings', err);
        setLoading(false);
      });

    const currentUser = auth.currentUser;
    if (currentUser) {
      setAdminDetails({
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'Admin User',
        lastLogin: currentUser.metadata.lastSignInTime
      });
    }
  }, [uid]);

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotification({ ...notification, [name]: checked });
  };

  const handleAppearanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setAppearance({ ...appearance, [name]: newValue });
    if (name === 'theme') document.body.className = newValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      uid,
      notification,
      appearance
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to update settings');

      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Error updating settings.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-settings-container">
      <h2>Admin Settings</h2>
      <p>Email: {adminDetails.email}</p>
      <p>Name: {adminDetails.displayName}</p>
      <p>Last Login: {adminDetails.lastLogin}</p>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <h3>Notifications</h3>
        {notification && Object.keys(notification).map(key => (
          <div key={key} className="checkbox-group">
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={notification[key]}
              onChange={handleNotificationChange}
            />
            <label htmlFor={key}>{key}</label>
          </div>
        ))}

        <h3>Appearance</h3>
        <label>Theme</label>
        <select name="theme" value={appearance.theme} onChange={handleAppearanceChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <label>Font Size</label>
        <select name="fontSize" value={appearance.fontSize} onChange={handleAppearanceChange}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="compactView"
            name="compactView"
            checked={appearance.compactView}
            onChange={handleAppearanceChange}
          />
          <label htmlFor="compactView">Compact View</label>
        </div>

        <button type="submit" className="save-btn">Save Settings</button>
      </form>
    </div>
  );
};

export default AdminSettings;
