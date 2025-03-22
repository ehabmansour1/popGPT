import React from "react";
import { marked } from "marked";

const Message = ({ type, content, isImage }) => {
  return (
    <div className={`message ${type === "user" ? "user" : "ai"}`}>
      {isImage ? (
        <img
          src={content}
          alt="Uploaded"
          style={{ maxWidth: "100%", borderRadius: "8px", display: "block" }}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
      )}
    </div>
  );
};

export default Message;
