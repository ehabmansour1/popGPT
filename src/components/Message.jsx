import React from "react";
import ReactMarkdown from "react-markdown";

const Message = ({ type, content }) => {
  return (
    <div className={`message ${type === "user" ? "user" : "ai"}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default Message;
