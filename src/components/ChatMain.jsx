import React, { useEffect, useRef } from "react";
import Message from "./Message";
import InputContainer from "./InputContainer";

const ChatMain = ({
  conversationHistory,
  onSendMessage,
  onEditMessage,
  onDeleteLastPrompt,
  startEditing,
  editingMessageId,
  isLoading,
  selectedModel,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  // Find the last user message index
  const lastUserMessageIndex = [...conversationHistory]
    .reverse()
    .findIndex((msg) => msg.role === "user");
  const lastUserMessageId =
    lastUserMessageIndex !== -1
      ? conversationHistory[
          conversationHistory.length - 1 - lastUserMessageIndex
        ].id
      : null;

  return (
    <div className="chat-main">
      <div className="message-container">
        {conversationHistory.map((msg, index) => (
          <Message
            key={msg.id || index}
            id={msg.id}
            type={msg.role}
            content={msg.content}
            isImage={msg.isImage}
            isEditing={msg.id === editingMessageId}
            isLastUserMessage={msg.id === lastUserMessageId}
            onEdit={(id, newContent) => {
              if (newContent) {
                onEditMessage(id, newContent);
              } else {
                startEditing(id);
              }
            }}
            onDelete={
              msg.id === lastUserMessageId ? onDeleteLastPrompt : undefined
            }
          />
        ))}
        {isLoading && <div className="message ai">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <InputContainer
        onSendMessage={onSendMessage}
        selectedModel={selectedModel}
      />
    </div>
  );
};

export default ChatMain;
