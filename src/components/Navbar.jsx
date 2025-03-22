import React from "react";
import { useAuth } from "../contexts/AuthContext";

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
      <div className="logo">POP Assistant</div>
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(17, 26, 33, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 1rem;
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
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .logout-button:hover {
          background: var(--hover-bg);
          border-color: var(--main-color);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
