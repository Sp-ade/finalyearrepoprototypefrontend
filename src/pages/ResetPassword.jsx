import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="reset-container">

      <div className="reset-card">
        {/* Icon and Header */}
        <div className="reset-header">
          <div className="lock-circle">
            <span className="lock-icon">🔒</span>
          </div>
          <h2>Reset your Password</h2>
          <p>Enter your registered school email to receive recovery instructions</p>
        </div>

        <hr className="divider" />

        {/* Form */}
        <form className="reset-form">
          <div className="input-group">
            <label htmlFor="email">Registered Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="e.g. 202104038@nileuniversity.edu.ng"
              required
            />
          </div>

          <button type="submit" className="send-link-btn">
            Send Recovery Link
          </button>

          <button type="button" className="back-to-login-btn"
            onClick={() => navigate('/login')}
          >
            <span className="arrow">←</span> Return to Log in
          </button>

          
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;