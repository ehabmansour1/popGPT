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
                className="action-button"
                onClick={() => onEdit(id)}
                title="Edit message"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className="action-button"
                onClick={onDelete}
                title="Delete message"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
