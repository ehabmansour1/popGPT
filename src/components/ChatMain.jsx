import React, { useEffect, useRef } from "react";
import Message from "./Message";
import InputContainer from "./InputContainer";

const ChatMain = ({ conversationHistory, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  return (
    <div className="chat-main">
      <div className="message-container">
        {conversationHistory.map((msg, index) => (
          <Message
            key={index}
            type={msg.role}
            content={msg.content}
            isImage={msg.isImage}
          />
        ))}
        {isLoading && <div className="message ai">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <InputContainer onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatMain;
