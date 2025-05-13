import React, { useEffect, useState } from 'react';
import SidebarComponent from '../components/Sidebar';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="sidebar-container">
          <SidebarComponent />
        </div>
        <div className="main-content">
          <div className="loading">Loading user profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
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
    <div className="profile-container">
      <div className="sidebar-container">
        <SidebarComponent />
      </div>
      <div className="main-content">
        <div className="user-profile-card">
          <h2>User Profile</h2>
          <div className="profile-details">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div className="profile-info">
              <p><span className="info-label">Name:</span> {user?.name || "Not available"}</p>
              <p><span className="info-label">Email:</span> {user?.email || "Not available"}</p>
              <p><span className="info-label">Phone Number:</span> {user?.phoneNumber || "Not available"}</p>
              <p><span className="info-label">Location:</span> {user?.location || "Not available"}</p>
            </div>
          </div>
          <div className="profile-bio">
            <h3>About Me</h3>
            <p>Healthcare management made easy. Manage your appointments, track your medical history, and stay connected with your doctors.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;