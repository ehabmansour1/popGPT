import React, { useState } from "react";
import { marked } from "marked";

const Message = ({
  type,
  content,
  isImage,
  id,
  onEdit,
  onDelete,
  isEditing,
  isLastUserMessage,
}) => {
  const [editContent, setEditContent] = useState(content);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(id, editContent);
  };

  const renderContent = () => {
    if (isImage) {
      return (
        <img
          src={content}
          alt="AI generated or uploaded"
          style={{
            maxWidth: "512px",
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            display: "block",
          }}
          loading="lazy"
        />
      );
    }

    return <div dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />;
  };

  return (
    <div className={`message ${type === "user" ? "user" : "ai"}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-textarea"
            autoFocus
          />
          <div className="edit-buttons">
            <button type="submit" className="save-button">
              Save
            </button>
            <button
              type="button"
              onClick={() => onEdit(null)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="message-content">
          {renderContent()}
          {type === "user" && isLastUserMessage && !isImage && (
            <div className="message-actions">
              <button
                onClick={() => onEdit(id)}
                className="action-button edit-button"
                title="Edit message"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="action-button delete-button"
                title="Delete message"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`
        .message {
          position: relative;
          padding-right: ${
            type === "user" && isLastUserMessage ? "60px" : "20px"
          };
        }

        .message-content {
          position: relative;
        }

        .message-actions {
          position: absolute;
          top: 50%;
          right: -36px;
          transform: translateY(-50%);
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .message:hover .message-actions {
          opacity: 1;
          transform: translateY(-50%) translateX(-8px);
        }

        .action-button {
          background: var(--card-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          width: 24px;
          height: 24px;
          padding: 4px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: var(--hover-bg);
          color: var(--main-color);
          border-color: var(--main-color);
          transform: translateY(-1px);
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .edit-textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          border: 1px solid var(--main-color);
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--text-color);
          font-family: inherit;
          font-size: inherit;
          resize: vertical;
          line-height: 1.5;
        }

        .edit-textarea:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 169, 122, 0.2);
        }

        .edit-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .save-button, .cancel-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .save-button {
          background: var(--main-color);
          color: var(--back-color);
        }

        .save-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(255, 169, 122, 0.3);
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
      `}</style>
    </div>
  );
};

export default Message;
