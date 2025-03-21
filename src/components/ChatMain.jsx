import React, { useEffect, useRef } from "react";
import Message from "./Message";
import InputContainer from "./InputContainer";

const ChatMain = ({ conversationHistory, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef(null); // Ref for the last message

  // Scroll to the last message when conversationHistory updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);

  return (
    <div className="chat-main">
      <div className="message-container">
        {conversationHistory.map((msg, index) => (
          <Message key={index} type={msg.role} content={msg.content} />
        ))}
        {isLoading && <div className="message ai">Typing...</div>}
        <div ref={messagesEndRef} />{" "}
        {/* Empty div to act as the last message */}
      </div>
      <InputContainer onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatMain;
