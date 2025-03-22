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
  const [editingMessageId, setEditingMessageId] = useState(null);

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

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      isImage,
    };
    setConversationHistory((prevHistory) => [...prevHistory, newMessage]);

    setIsLoading(true);

    try {
      let response;
      let responseIsImage = false;

      if (isImage) {
        response = await analyzeImage(message);
      } else if (selectedModel === "image-gen") {
        response = await fetchAI(selectedModel, [
          ...conversationHistory,
          newMessage,
        ]);
        responseIsImage = true;
      } else {
        response = await fetchAI(selectedModel, [
          ...conversationHistory,
          newMessage,
        ]);
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        isImage: responseIsImage,
      };

      setConversationHistory((prevHistory) => [...prevHistory, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
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

  const handleEditMessage = async (messageId, newContent) => {
    setConversationHistory((prevHistory) => {
      const messageIndex = prevHistory.findIndex((msg) => msg.id === messageId);
      if (messageIndex === -1 || prevHistory[messageIndex].role !== "user")
        return prevHistory;

      // Create new array with edited message
      const newHistory = [...prevHistory.slice(0, messageIndex + 1)];
      newHistory[messageIndex] = {
        ...newHistory[messageIndex],
        content: newContent,
      };

      return newHistory;
    });
    setEditingMessageId(null);

    // Generate new response after editing
    setIsLoading(true);
    try {
      const response = await fetchAI(selectedModel, [
        ...conversationHistory.slice(
          0,
          conversationHistory.findIndex((msg) => msg.id === messageId)
        ),
        { role: "user", content: newContent },
      ]);

      const aiMessage = {
        id: Date.now(),
        role: "assistant",
        content: response,
        isImage: false,
      };

      setConversationHistory((prevHistory) => {
        const messageIndex = prevHistory.findIndex(
          (msg) => msg.id === messageId
        );
        return [...prevHistory.slice(0, messageIndex + 1), aiMessage];
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now(),
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        isImage: false,
      };
      setConversationHistory((prevHistory) => {
        const messageIndex = prevHistory.findIndex(
          (msg) => msg.id === messageId
        );
        return [...prevHistory.slice(0, messageIndex + 1), errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLastPrompt = () => {
    setConversationHistory((prevHistory) => {
      // Find the last user message
      for (let i = prevHistory.length - 1; i >= 0; i--) {
        if (prevHistory[i].role === "user") {
          // Remove this message and all subsequent messages
          return prevHistory.slice(0, i);
        }
      }
      return prevHistory;
    });
  };

  const startEditing = (messageId) => {
    setEditingMessageId(messageId);
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
          onEditMessage={handleEditMessage}
          onDeleteLastPrompt={handleDeleteLastPrompt}
          startEditing={startEditing}
          editingMessageId={editingMessageId}
          isLoading={isLoading}
          selectedModel={selectedModel}
        />
      </div>
    </div>
  );
};

export default App;
