// Import the Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you load your API key from environment variables
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

// Initialize the Generative AI instance
const genAI = new GoogleGenerativeAI(apiKey);

// Configure the model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

// Define the generation configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

// Function to get AI response using Google Generative AI
export const getAIResponse = async (userPrompt) => {
  try {
    const parts = [
      { text: "You're an AI here to offer relationship advice. You can talk with users to get to know them better and help them find people who might be a good match for them based on their values and relationship goals." },
      { text: `input: ${userPrompt}` },
      { text: "output: " },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    if (error.message.includes('SAFETY')) {
      console.error("Response was blocked due to safety settings. Consider revising the prompt or checking API guidelines.");
    } else {
      console.error("An unexpected error occurred. Please try again later.");
    }
    throw new Error('Failed to fetch AI response');
  }
};