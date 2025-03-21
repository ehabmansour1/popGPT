import React from "react";
import { marked } from "marked"; // Correct import for marked

const Message = ({ type, content }) => {
  const htmlContent = marked.parse(content);

  return (
    <div className={`message ${type === "user" ? "user" : "ai"}`}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default Message;
