import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase config
import '../styles/UserSignupForm.css';

const UserSignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error messages
    setLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Firebase Authentication: Create a user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Firebase user created with UID:", user.uid);
      
      // Store UID in localStorage immediately after successful firebase signup
      localStorage.setItem('uid', user.uid);

      const userData = {
        uid: user.uid,
        name,
        email,
        phoneNumber,
        location
      };

      // Send user data to your backend
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      // Check if backend returned a successful response
      if (response.ok) {
        console.log("User registered successfully in backend");
        
        // Confirm that uid was saved in localStorage
        console.log("UID in localStorage:", localStorage.getItem('uid'));
        
        // You can either redirect to login page or directly to dashboard
        navigate('/userloginform'); // Redirect to user login form
      } else {
        const errorData = await response.json(); // Get the error details from the response
        setError(errorData.message || 'Signup failed. Please try again.');
        // Remove UID from localStorage if backend registration fails
        localStorage.removeItem('uid');
      }
    } catch (error) {
      // Firebase or network errors
      console.error('Error during signup:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try a different one.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Signup failed. Please try again. ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-signup-container">
      <h2 className="form-title">User Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="text" 
            id="name"
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <input 
            type="email" 
            id="email"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <input 
            type="password" 
            id="password"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <input 
            type="password" 
            id="confirmPassword"
            placeholder="Re-enter Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <input 
            type="text" 
            id="phoneNumber"
            placeholder="Phone Number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <input 
            type="text" 
            id="location"
            placeholder="Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
      <a href="/userloginform" className="login-link">Already have an account? Log in</a>
    </div>
  );
};

export default UserSignupForm;