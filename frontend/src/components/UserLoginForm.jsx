import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase config
import '../styles/UserLoginForm.css';

const UserLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/user-dashboard'); // Redirect to user dashboard after successful login
    } catch (error) {
      console.error(error.message);
      setError('Invalid email or password');
    }
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/user-dashboard'); // Redirect to user dashboard after successful Google login
    } catch (error) {
      console.error(error.message);
      setError('Google login failed');
    }
  };

  return (
    <div className="user-login-container">
      <h2 className="form-title">User Login</h2>
      <form onSubmit={handleSubmit}>
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
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="submit-btn">Login</button>
      </form>
      
      <div className="google-login-container">
        <button onClick={handleGoogleLogin} className="google-login-btn">
          Continue with Google
        </button>
      </div>
      
      <a href="/usersignupform" className="signup-link">Don't have an account? Sign Up</a>
    </div>
  );
};

export default UserLoginForm;
