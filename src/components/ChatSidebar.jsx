import React from "react";

const ChatSidebar = ({ chats, onCreateNewChat, onLoadChat }) => {
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
        {Object.entries(chats).map(([id, chat]) => (
          <div
            key={id}
            className="chat-history-item"
            onClick={() => onLoadChat(id)}
          >
            {chat.preview}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
