import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem('uid');
    localStorage.removeItem('User');
    
    // Show logout message
    alert('You have been successfully logged out.');
    
    // Redirect to main page
    navigate('/');
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f0f8ff'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Logging out...</h2>
        <p>Please wait while we sign you out.</p>
      </div>
    </div>
  );
};

export default Logout;