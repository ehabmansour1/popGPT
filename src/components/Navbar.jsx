import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = ({ selectedModel, setSelectedModel }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        PopGPT
      </Link>
      <div className="controls">
        <select
          className="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="gpt-4o-mini">GPT-4o-mini</option>
          <option value="deepseek">DeepSeek</option>
          <option value="gemini">Gemini</option>
          <option value="image-gen">Image Generator</option>
          <option value="reminder-agent">Reminder Agent</option>
        </select>
        <div className="user-controls">
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <style jsx>{`
        .navbar {
          background: rgba(17, 26, 33, 0.8);
          backdrop-filter: blur(20px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          color: var(--main-color);
          font-size: 1.5rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .model-select {
          background: var(--card-bg);
          color: var(--text-color);
          border: 1px solid rgba(255, 169, 122, 0.3);
          padding: 0.6rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .model-select:hover {
          border-color: var(--main-color);
          background: var(--hover-bg);
        }

        .user-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-email {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .logout-button {
          background: var(--card-bg);
          color: var(--text-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.6rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .logout-button:hover {
          background: var(--hover-bg);
          border-color: var(--main-color);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .user-email {
            display: none;
          }

          .model-select {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
