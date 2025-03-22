const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
const API_URL = "https://vision.googleapis.com/v1/images:annotate";

export const analyzeImage = async (imageData) => {
  try {
    const base64Image = imageData.split(",")[1];

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            { type: "LABEL_DETECTION" },
            { type: "TEXT_DETECTION" },
            { type: "OBJECT_LOCALIZATION" },
          ],
        },
      ],
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Vision API request failed");
    }

    const data = await response.json();
    return data.responses[0];
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
