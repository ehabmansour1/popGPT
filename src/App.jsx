import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ChatSidebar from "./components/ChatSidebar";
import ChatMain from "./components/ChatMain";
import "./App.css";

const App = () => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const [chats, setChats] = useState({});
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
    setChats(savedChats);
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = { role: "user", content: message };
    const updatedHistory = [...conversationHistory, newMessage].slice(-10);

    setConversationHistory(updatedHistory);
    setIsLoading(true); // Start loading

    try {
      const response = await fetchAI(selectedModel, updatedHistory);
      const aiMessage = { role: "assistant", content: response };

      setConversationHistory([...updatedHistory, aiMessage]);
      saveChat([...updatedHistory, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchAI = async (model, messages) => {
    // Define the request data for each model
    const requestData = {
      "gpt-4o-mini": {
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: {
          model: model,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...messages,
          ],
        },
      },
      deepseek: {
        url: "https://openrouter.ai/api/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        },
        body: {
          model: "deepseek/deepseek-r1:free",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...messages,
          ],
          extra_body: {},
        },
      },
      gemini: {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          contents: [
            {
              parts: [
                {
                  text: messages
                    .map((msg) => `${msg.role}: ${msg.content}`)
                    .join("\n"),
                },
              ],
            },
          ],
        },
      },
    };

    // Get the request data based on the selected model
    const { url, headers, body } = requestData[model];

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (model === "gemini") {
      return data.candidates[0].content.parts[0].text; // Gemini response format
    }
    return data.choices[0].message.content; // OpenAI/DeepSeek response format
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
          isLoading={isLoading} // Pass loading state to ChatMain
        />
      </div>
    </div>
  );
};

export default App;
