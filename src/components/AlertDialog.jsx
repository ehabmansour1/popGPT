import React from "react";

const AlertDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="alert-dialog-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
      <style jsx>{`
        .alert-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
          backdrop-filter: blur(15px);
        }

        .alert-dialog {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideIn 0.2s ease-out;
        }

        .alert-dialog h3 {
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
          font-size: 1.2rem;
        }

        .alert-dialog p {
          margin: 0 0 1.5rem 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .alert-dialog-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .cancel-button,
        .confirm-button {
          padding: 0.6rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-button {
          background: var(--card-bg);
          color: var(--text-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cancel-button:hover {
          background: var(--hover-bg);
          transform: translateY(-1px);
        }

        .confirm-button {
          background: #dc3545;
          color: white;
          border: none;
        }

        .confirm-button:hover {
          background: #bd2130;
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AlertDialog;
