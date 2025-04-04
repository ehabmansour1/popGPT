import { analyzeImage as analyzeImageWithVision } from "../utils/visionAPI";
import reminderAgent from "./reminderAgent";

const API_ENDPOINTS = {
  "gpt-4o-mini": "https://api.openai.com/v1/chat/completions",
  deepseek: "https://openrouter.ai/api/v1/chat/completions",
  gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
    import.meta.env.VITE_GEMINI_API_KEY
  }`,
  "gemini-vision": "https://openrouter.ai/api/v1/chat/completions",
  "reminder-agent": "local", // Local reminder agent
};

const getHeaders = (model) => {
  const headers = {
    "Content-Type": "application/json",
  };

  switch (model) {
    case "gpt-4o-mini":
      headers.Authorization = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`;
      break;
    case "deepseek":
      headers.Authorization = `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`;
      break;
    case "gemini-vision":
      headers.Authorization = `Bearer ${
        import.meta.env.VITE_OPENROUTER_API_KEY
      }`;
      break;
    default:
      break;
  }

  return headers;
};

const getRequestBody = (model, messages, isImage = false, stream = false) => {
  let formattedMessages;
  let lastMessage;

  switch (model) {
    case "reminder-agent":
      // For reminder agent, we'll process the last message
      lastMessage = messages[messages.length - 1].content;
      return {
        message: lastMessage,
        isReminderRequest: true,
      };

    case "gpt-4o-mini":
      return {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream,
      };

    case "deepseek":
      return {
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages,
        ],
        stream,
        extra_body: {},
      };

    case "gemini":
      formattedMessages = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      return {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

    case "gemini-vision":
      return {
        model: "google/gemini-2.0-flash-thinking-exp-1219:free",
        messages: [
          {
            role: "user",
            content: isImage
              ? [
                  { type: "text", text: "What is in this image?" },
                  {
                    type: "image_url",
                    image_url: { url: messages[0].content },
                  },
                ]
              : messages.map((msg) => ({
                  type: "text",
                  text: msg.content,
                })),
          },
        ],
      };

    default:
      throw new Error(`Unsupported model: ${model}`);
  }
};

export const fetchAIStream = async (
  model,
  messages,
  onChunk,
  isImage = false
) => {
  const endpoint = API_ENDPOINTS[model];
  if (!endpoint) {
    throw new Error(`No endpoint found for model: ${model}`);
  }

  if (model === "image-gen" || isImage) {
    // For image generation and analysis, use non-streaming version
    const response = await fetchAI(model, messages, isImage);
    onChunk(response);
    return;
  }

  const headers = getHeaders(model);
  const body = getRequestBody(model, messages, isImage, true);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.trim() === "data: [DONE]") continue;

        try {
          const data = JSON.parse(line.replace(/^data: /, ""));
          if (model === "gemini") {
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              onChunk(data.candidates[0].content.parts[0].text);
            }
          } else {
            const content = data.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          }
        } catch (e) {
          console.warn("Error parsing streaming response:", e);
        }
      }
    }
  } catch (error) {
    console.error(`Error in ${model} API stream:`, error);
    throw error;
  }
};

export const fetchAI = async (model, messages, isImage = false) => {
  if (model === "reminder-agent") {
    const body = getRequestBody(model, messages, isImage);
    if (body.isReminderRequest) {
      const result = await reminderAgent.processReminderRequest(body.message);

      // Check if this is a reminder notification
      if (result.isReminderNotification) {
        return result.message;
      }

      return result.message;
    }
  }

  if (model === "image-gen") {
    const encodedPrompt = encodeURIComponent(
      messages[messages.length - 1].content
    );
    return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  }

  const endpoint = API_ENDPOINTS[model];
  if (!endpoint) {
    throw new Error(`No endpoint found for model: ${model}`);
  }

  const headers = getHeaders(model);
  const body = getRequestBody(model, messages, isImage);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();

    if (model === "gemini") {
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error("Invalid Gemini response format");
    }

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error(`Error in ${model} API call:`, error);
    throw error;
  }
};

export const analyzeImage = async (imageData) => {
  try {
    // First try with Gemini Vision API
    const response = await fetchAI(
      "gemini-vision",
      [{ role: "user", content: imageData }],
      true
    );
    return response;
  } catch (error) {
    console.error(
      "Gemini Vision API failed, falling back to Google Cloud Vision:",
      error
    );
    // Fallback to Google Cloud Vision API
    return await analyzeImageWithVision(imageData);
  }
};
