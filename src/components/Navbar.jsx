import React from "react";

const Navbar = ({ selectedModel, setSelectedModel }) => {
  return (
    <nav className="navbar">
      <div className="logo">POP Assistant</div>
      <select
        className="model-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="gpt-4o-mini">GPT-4o-mini</option>
        <option value="deepseek">DeepSeek</option>
      </select>
    </nav>
  );
};

export default Navbar;
