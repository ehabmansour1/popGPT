import React from "react";

const MarkdownParser = ({ content }) => {
  // Split content into lines
  const lines = content.split("\n");

  // Map each line to a React component
  const parsedContent = lines.map((line, index) => {
    // Handle headings
    if (line.startsWith("# ")) {
      return <h1 key={index}>{line.replace("# ", "")}</h1>;
    }
    if (line.startsWith("## ")) {
      return <h2 key={index}>{line.replace("## ", "")}</h2>;
    }
    if (line.startsWith("### ")) {
      return <h3 key={index}>{line.replace("### ", "")}</h3>;
    }

    // Handle bold and italics
    line = line.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Handle links
    line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Handle images
    line = line.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

    // Handle unordered lists
    if (line.startsWith("* ")) {
      return <li key={index}>{line.replace("* ", "")}</li>;
    }

    // Handle ordered lists
    if (/^\d+\. /.test(line)) {
      return <li key={index}>{line.replace(/^\d+\. /, "")}</li>;
    }

    // Handle code blocks
    if (line.startsWith("```")) {
      return <pre key={index}>{line.replace("```", "")}</pre>;
    }

    // Handle inline code
    line = line.replace(/`(.*?)`/g, "<code>$1</code>");

    // Handle blockquotes
    if (line.startsWith("> ")) {
      return <blockquote key={index}>{line.replace("> ", "")}</blockquote>;
    }

    // Handle horizontal rules
    if (line.trim() === "---") {
      return <hr key={index} />;
    }

    // Handle paragraphs
    return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
  });

  return <div>{parsedContent}</div>;
};

export default MarkdownParser;
