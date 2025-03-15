const axios = require("axios");

const AYA_API_URL = "https://api.deepseek.com"; // DeepSeek API Endpoint
const MODEL_NAME = "deepseek/deepseek-r1:free"; // Fixed to the free model

// Commented out the backend URL since we're only testing DeepSeek
// const ayaBackendLink = "http://127.0.0.1:5000/api/signals/"; 

// eslint-disable-next-line no-unused-vars
const systemInstructions = `
You are crypto trade bot BTC USDT analyser.
`;

// 🧠 Aya AI Logic
export const AyaForUser = async (userId) => {
    // Removed chatHistory and related functions for now
    const hello = async (displayName) => {
        let responseText = `Hello ${displayName}`;
        const userPrompt = `My name is ${displayName}`;
        const { text } = await getAIResponse(userPrompt);
        responseText = text || "Hey there! How are you today?";
        return responseText;
    };

    const getAIResponse = async (userPrompt) => {
        try {
            const payload = {
                model: MODEL_NAME,
                messages: [{ role: "user", content: userPrompt }],
            };

            const response = await axios.post(`${AYA_API_URL}/generate`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                },
            });

            const responseText = response.data.choices?.[0]?.message?.content || "I didn't quite get that.";
            // Removed call to update history since we are not using it for now
            return { text: responseText };
        } catch (error) {
            console.error("❌ AI Response Error:", error.message);
            return { text: "Sorry, I couldn't generate a response at the moment." };
        }
    };

    return { getAIResponse, hello };
};
