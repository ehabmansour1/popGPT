import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ChatSidebar from "./components/ChatSidebar";
import ChatMain from "./components/ChatMain";
import { fetchAI, analyzeImage } from "./services/api";
import "./App.css";

const App = () => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const [chats, setChats] = useState({});
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
    setChats(savedChats);
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const handleSendMessage = async (message, isImage = false) => {
    if (!message.trim() && !isImage) return;

    const newMessage = { role: "user", content: message, isImage };
    setConversationHistory((prevHistory) => [...prevHistory, newMessage]);

    setIsLoading(true);

    try {
      let response;
      if (isImage) {
        response = await analyzeImage(message);
      } else {
        response = await fetchAI(selectedModel, [
          ...conversationHistory,
          newMessage,
        ]);
      }

      const aiMessage = {
        role: "assistant",
        content: response,
        isImage: false,
      };

      setConversationHistory((prevHistory) => [...prevHistory, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        isImage: false,
      };
      setConversationHistory((prevHistory) => [...prevHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChat = (history) => {
    if (history.length === 0) return;

    const firstMessage = history[0].content;
    const preview =
      firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "");

    const updatedChats = {
      ...chats,
      [currentChatId]: { messages: history, preview },
    };

    setChats(updatedChats);
  };

  const createNewChat = () => {
    if (conversationHistory.length > 0) {
      saveChat(conversationHistory);
    }

    setCurrentChatId(Date.now());
    setConversationHistory([]);
  };

  const loadChat = (chatId) => {
    if (chats[chatId]) {
      setCurrentChatId(chatId);
      setConversationHistory(chats[chatId].messages);
    }
  };

  return (
    <div className="App">
      <Navbar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <div className="chat-container">
        <ChatSidebar
          chats={chats}
          onCreateNewChat={createNewChat}
          onLoadChat={loadChat}
        />
        <ChatMain
          conversationHistory={conversationHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default App;
