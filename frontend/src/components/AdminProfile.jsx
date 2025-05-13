import React, { useEffect, useState } from 'react';
import SidebarComponent from '../components/AdminSidebar';
import '../styles/AdminProfile.css'; // Reusing the same CSS

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      setError("Admin ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/admins/${uid}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch admin data');
        return res.json();
      })
      .then(data => {
        setAdmin(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data. Please try again later.");
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
          <div className="loading">Loading admin profile...</div>
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
          <h2>Admin Profile</h2>
          <div className="profile-details">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {admin?.name?.charAt(0) || "A"}
              </div>
            </div>
            <div className="profile-info">
              <p><span className="info-label">Name:</span> {admin?.name || "Not available"}</p>
              <p><span className="info-label">Email:</span> {admin?.email || "Not available"}</p>
              <p><span className="info-label">Phone Number:</span> {admin?.phoneNumber || "Not available"}</p>
              <p><span className="info-label">Location:</span> {admin?.location || "Not available"}</p>
              <p><span className="info-label">Role:</span> {admin?.role || "Not available"}</p>
            </div>
          </div>
          <div className="profile-bio">
            <h3>About Me</h3>
            <p>Administrator dashboard for managing users, appointments, and healthcare system analytics efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
