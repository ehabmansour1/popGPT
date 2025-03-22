import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar landing-navbar">
      <Link to="/" className="logo">
        PopGPT
      </Link>

      <div className="auth-buttons">
        {user ? (
          <>
            <Link
              to="/chat"
              className={`nav-button ${isActive("/chat") ? "active" : ""}`}
            >
              Chat
            </Link>
            <button onClick={logout} className="nav-button logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`nav-button ${isActive("/login") ? "active" : ""}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`nav-button primary ${
                isActive("/register") ? "active" : ""
              }`}
            >
              Register
            </Link>
          </>
        )}
      </div>
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 8%;
          background: var(--card-bg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--main-color);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: var(--text-color);
        }

        .auth-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-button {
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          font-size: 0.9rem;
          border: 1px solid transparent;
        }

        .nav-button.primary {
          background: var(--main-color);
          color: var(--back-color);
        }

        .nav-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(255, 169, 122, 0.3);
        }

        .nav-button:not(.primary) {
          color: var(--text-color);
        }

        .nav-button:not(.primary):hover {
          border-color: var(--main-color);
        }

        .nav-button.active {
          border-color: var(--main-color);
          color: var(--main-color);
        }

        .nav-button.logout {
          background: none;
          color: var(--text-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-button.logout:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .auth-buttons {
            gap: 0.5rem;
          }

          .nav-button {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;
