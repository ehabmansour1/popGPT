import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Register = ({ onToggleAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await signup(email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Create your POPGPT Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p className="auth-toggle">
        Already have an account?{' '}
        <button onClick={onToggleAuth} className="toggle-button">
          Login
        </button>
      </p>
      <style jsx>{`
        .auth-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background: var(--card-bg);
          border-radius: var(--border-radius);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: var(--main-color);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        input {
          padding: 0.75rem;
          border-radius: var(--border-radius);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-color);
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: var(--main-color);
        }

        .auth-button {
          background: var(--main-color);
          color: var(--back-color);
          border: none;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(255, 169, 122, 0.3);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
        }

        .auth-toggle {
          text-align: center;
          margin-top: 1rem;
          color: var(--text-secondary);
        }

        .toggle-button {
          background: none;
          border: none;
          color: var(--main-color);
          cursor: pointer;
          font-size: inherit;
          padding: 0;
          margin: 0;
          text-decoration: underline;
        }

        .toggle-button:hover {
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
};

export default Register;