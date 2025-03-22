import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import ChatMain from "../components/ChatMain";
import { fetchAI, analyzeImage } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const Chat = () => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const [chats, setChats] = useState({});
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const { user } = useAuth();

  // Load chat history from Firestore on mount and when user changes
  useEffect(() => {
    const loadUserChats = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setChats(userDoc.data().chats || {});
        } else {
          // Create new user document if it doesn't exist
          await setDoc(userDocRef, { chats: {} });
          setChats({});
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    loadUserChats();
  }, [user]);

  const saveChat = async (history) => {
    if (!user || history.length === 0) return;

    const firstMessage = history[0].content;
    const preview =
      firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "");

    const updatedChats = {
      ...chats,
      [currentChatId]: {
        messages: history,
        preview,
        timestamp: Date.now(),
        lastUpdated: Date.now(),
      },
    };

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { chats: updatedChats });
      setChats(updatedChats);
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

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

      setConversationHistory((prevHistory) => {
        const newHistory = [...prevHistory, aiMessage];
        saveChat(newHistory);
        return newHistory;
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        isImage: false,
      };
      setConversationHistory((prevHistory) => {
        const newHistory = [...prevHistory, errorMessage];
        saveChat(newHistory);
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    setConversationHistory((prevHistory) => {
      const messageIndex = prevHistory.findIndex((msg) => msg.id === messageId);
      if (messageIndex === -1 || prevHistory[messageIndex].role !== "user")
        return prevHistory;

      const newHistory = [...prevHistory.slice(0, messageIndex + 1)];
      newHistory[messageIndex] = {
        ...newHistory[messageIndex],
        content: newContent,
      };

      saveChat(newHistory);
      return newHistory;
    });
    setEditingMessageId(null);

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
        const newHistory = [
          ...prevHistory.slice(0, messageIndex + 1),
          aiMessage,
        ];
        saveChat(newHistory);
        return newHistory;
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
        const newHistory = [
          ...prevHistory.slice(0, messageIndex + 1),
          errorMessage,
        ];
        saveChat(newHistory);
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLastPrompt = () => {
    setConversationHistory((prevHistory) => {
      for (let i = prevHistory.length - 1; i >= 0; i--) {
        if (prevHistory[i].role === "user") {
          const newHistory = prevHistory.slice(0, i);
          saveChat(newHistory);
          return newHistory;
        }
      }
      return prevHistory;
    });
  };

  const startEditing = (messageId) => {
    setEditingMessageId(messageId);
  };

  const createNewChat = () => {
    if (conversationHistory.length > 0) {
      saveChat(conversationHistory);
    }

    const newChatId = Date.now();
    setCurrentChatId(newChatId);
    setConversationHistory([]);

    const updatedChats = {
      ...chats,
      [newChatId]: {
        messages: [],
        preview: "New Chat",
        timestamp: newChatId,
        lastUpdated: newChatId,
      },
    };

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      updateDoc(userDocRef, { chats: updatedChats })
        .then(() => {
          setChats(updatedChats);
        })
        .catch((error) => {
          console.error("Error creating new chat:", error);
        });
    }
  };

  const loadChat = (chatId) => {
    if (chats[chatId]) {
      setCurrentChatId(chatId);
      setConversationHistory(chats[chatId].messages);
    }
  };

  const handleDeleteChat = async (chatId) => {
    const updatedChats = { ...chats };
    delete updatedChats[chatId];

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { chats: updatedChats });
      setChats(updatedChats);

      if (chatId === currentChatId) {
        setCurrentChatId(Date.now());
        setConversationHistory([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleRenameChat = async (chatId, newName) => {
    const updatedChats = { ...chats };
    if (updatedChats[chatId]) {
      updatedChats[chatId] = {
        ...updatedChats[chatId],
        preview: newName,
        lastUpdated: Date.now(),
      };

      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { chats: updatedChats });
        setChats(updatedChats);
      } catch (error) {
        console.error("Error renaming chat:", error);
      }
    }
  };

  return (
    <div className="App">
      <Navbar
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        user={user}
      />
      <div className="chat-container">
        <ChatSidebar
          chats={chats}
          onCreateNewChat={createNewChat}
          onLoadChat={loadChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
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

export default Chat;
