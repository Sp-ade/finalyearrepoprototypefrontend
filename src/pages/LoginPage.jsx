import React, { useState } from 'react';
import logo from '../assets/Nile-University-of-Nigeria.jpg';
import './LoginPage.css';

const PageLogin = () => {
  const [role, setRole] = useState('student'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Initialized to empty string (no error)

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example: Trigger error if fields are empty or invalid
    if (!email.includes('@')) {
      setError('Incorrect Email');
    } else {
      setError('');
      console.log(`Logging in as ${role}:`, { email, password });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <img src={logo} alt="Nile University Logo" className="university-logo" />
          <h1 className="project-title">Nile Project Archive</h1>
          <p className="project-subtitle">Secure Access to Final Year Projects</p>
        </header>

        <div className="role-toggle">
          <button 
            type="button"
            className={role === 'student' ? 'active' : ''} 
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button 
            type="button"
            className={role === 'supervisor' ? 'active' : ''} 
            onClick={() => setRole('supervisor')}
          >
            Supervisor
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">School Email</label>
            <input 
              id="email"
              type="email" 
              className={error ? 'input-error' : ''}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if(error) setError(''); // Clear error while user is typing
              }}
              placeholder="202104038@gmail.com"
              required
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/reset-password" className="forgot-link">Forgot Password</a>
          </div>

          <button type="submit" className="sign-in-btn">Sign in</button>
        </form>

        <div className="footer-links">
          <a href="/register" className="create-account-link">Create a New Account</a>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;