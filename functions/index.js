const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true }); // Handle CORS

// Define the Deepseek API URL
const DEEPSEEK_API_URL = "https://api.deepseek.com/generate";

// Function to handle POST request to Deepseek API
const proxyDeepseekRequest = async (req, res) => {
  try {
    // Forward the request to the Deepseek API
    const response = await axios.post(DEEPSEEK_API_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Send the API response back to the client
    res.status(200).send(response.data);
  } catch (error) {
    // Handle errors and send error response
    console.error("Error calling Deepseek API:", error);
    res.status(500).send({ error: "An error occurred while processing your request" });
  }
};

// Main Firebase function
exports.proxyDeepseek = functions.https.onRequest((req, res) => {
  // Enable CORS
  cors(req, res, () => {
    // Check if the request method is POST
    if (req.method === "POST") {
      proxyDeepseekRequest(req, res); // Call the handler function
    } else {
      res.status(405).send({ error: "Method Not Allowed" });
    }
  });
});
