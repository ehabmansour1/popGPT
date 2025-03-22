import React, { useState } from "react";
import AlertDialog from "./AlertDialog";

const ChatSidebar = ({
  chats,
  onCreateNewChat,
  onLoadChat,
  onDeleteChat,
  onRenameChat,
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatName, setNewChatName] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    chatId: null,
  });

  const handleRename = (chatId, currentPreview) => {
    if (editingChatId === chatId) {
      onRenameChat(chatId, newChatName);
      setEditingChatId(null);
      setNewChatName("");
    } else {
      setEditingChatId(chatId);
      setNewChatName(currentPreview);
    }
  };

  const handleDeleteClick = (chatId) => {
    setDeleteDialog({ isOpen: true, chatId });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.chatId) {
      onDeleteChat(deleteDialog.chatId);
    }
    setDeleteDialog({ isOpen: false, chatId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, chatId: null });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Sort chats by timestamp (most recent first)
  const sortedChats = Object.entries(chats)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .map(([id, chat]) => ({ id, ...chat }));

  return (
    <div className="chat-sidebar">
      <button className="new-chat-btn" onClick={onCreateNewChat}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Conversation
      </button>
      <div className="chat-history">
        {sortedChats.map((chat) => (
          <div key={chat.id} className="chat-history-item">
            <div
              className="chat-item-content"
              onClick={() => onLoadChat(chat.id)}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRename(chat.id, chat.preview);
                    }
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="chat-info">
                  <span className="chat-preview">{chat.preview}</span>
                  <span className="chat-timestamp">
                    {formatDate(chat.timestamp)}
                  </span>
                </div>
              )}
            </div>
            <div className="chat-actions">
              <button
                className="action-btn rename-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(chat.id, chat.preview);
                }}
                title={editingChatId === chat.id ? "Save" : "Rename"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {editingChatId === chat.id ? (
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  ) : (
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  )}
                  {!editingChatId === chat.id && (
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  )}
                </svg>
              </button>
              <button
                className="action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(chat.id);
                }}
                title="Delete"
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
          </div>
        ))}
      </div>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
      />

      <style jsx>{`
        .chat-history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          margin-bottom: 0.5rem;
          background: var(--card-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-history-item:hover {
          background: var(--hover-bg);
          border-color: var(--main-color);
        }

        .chat-item-content {
          flex: 1;
          margin-right: 1rem;
          overflow: hidden;
        }

        .chat-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .chat-preview {
          color: var(--text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chat-timestamp {
          color: var(--text-secondary);
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .chat-history-item:hover .chat-actions {
          opacity: 1;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--text-secondary);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: var(--card-bg);
          color: var(--main-color);
        }

        input {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-color);
          font-size: inherit;
          padding: 0;
        }

        input:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ChatSidebar;
