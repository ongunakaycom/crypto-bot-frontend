const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true }); // Handle CORS

// This is the Firebase Function
exports.proxyDeepseek = functions.https.onRequest((req, res) => {
  // Enable CORS
  cors(req, res, async () => {
    try {
      // You might want to validate the method (POST, GET, etc.)
      if (req.method === "POST") {
        // Forward the request to the Deepseek API
        const response = await axios.post("https://api.deepseek.com/generate", req.body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Send the API response back to the client
        res.status(200).send(response.data);
      } else {
        res.status(405).send({ error: "Method Not Allowed" });
      }
    } catch (error) {
      // Handle errors and send error response
      console.error(error);
      res.status(500).send({ error: "An error occurred while processing your request" });
    }
  });
});
