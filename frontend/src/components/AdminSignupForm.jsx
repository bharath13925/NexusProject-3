import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase config
import '../styles/AdminSignupForm.css';

const AdminSignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Firebase user created with UID:", user.uid);

      localStorage.setItem('uid', user.uid);

      const adminData = {
        uid: user.uid,
        name,
        email,
        phoneNumber,
        role,
        location
      };


      // Send admin data to your backend
      const response = await fetch('http://localhost:5000/api/admins/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });

      if (response.ok) {
        navigate('/adminloginform'); // Redirect to admin login form
      } else {
        setError('Signup failed');
      }
      console.log("UID in localStorage:", localStorage.getItem('uid'));
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="admin-signup-container">
      <h2 className="admin-form-title">Admin Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <input 
            type="text" 
            id="name"
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="admin-form-group">
          <input 
            type="email" 
            id="email"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="admin-form-group">
          <input 
            type="password" 
            id="password"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="admin-form-group">
          <input 
            type="password" 
            id="confirmPassword"
            placeholder="Re-enter Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="admin-form-group">
          <input 
            type="text" 
            id="role"
            placeholder="Role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
          />
        </div>
        
        <div className="admin-form-group">
          <input 
            type="text" 
            id="phoneNumber"
            placeholder="Phone Number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
        </div>
        
        <div className="admin-form-group">
          <input 
            type="text" 
            id="location"
            placeholder="Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        
        {error && <div className="admin-error-message">{error}</div>}
        
        <button type="submit" className="admin-submit-btn">Sign Up</button>
      </form>
      
      <a href="/adminloginform" className="admin-login-link">Already have an account? Log in</a>
    </div>
  );
};

export default AdminSignupForm;