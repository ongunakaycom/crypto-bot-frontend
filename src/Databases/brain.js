const API_URL = "https://deep-seek-chat-bot-python.onrender.com";

/**
 * Send user message to chatbot backend for given market/coin.
 * Defaults to coinbase/btcusd if not specified.
 * 
 * @param {string} message - user input message
 * @param {string} [market='coinbase']
 * @param {string} [coin='btcusd']
 * @returns {Promise<string>} chatbot response text
 */
export const sendMessageToChatbot = async (message, market = 'coinbase', coin = 'btcusd') => {
  try {
    const url = `${API_URL}/${market}/${coin}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request: message }),
    });

    const text = await response.text(); // get raw text first

    if (!response.ok) {
      console.error('Backend error:', response.status, text);
      throw new Error(`Backend responded with status ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error('JSON parse error:', jsonErr, 'Response text:', text);
      throw new Error('Failed to parse backend JSON');
    }

    // Check for error fields anywhere expected
    if (data.error) {
      return data.error;
    }
    if (data.data?.analysis?.error) {
      return data.data.analysis.error;
    }

    // Try different response formats
    if (data.data?.analysis?.raw_response) {
      return data.data.analysis.raw_response;
    }

    // Check if analysis object exists and format it
    if (data.data?.analysis) {
      const analysis = data.data.analysis;
      return `📊 **BTC Analysis**

    🎯 **Signal:** ${analysis.signal_direction || 'N/A'}
    📈 **Current Price:** $${analysis.current_price?.toLocaleString() || 'N/A'}
    📊 **Price Change:** ${analysis.price_change || 'N/A'}%
    🔥 **Confidence:** ${analysis.confidence_level || 'N/A'}%
    📋 **Summary:** ${analysis.technical_summary || 'N/A'}
    🚀 **Next Move:** ${analysis.probable_next_move || 'N/A'}
    ⚡ **Momentum:** ${analysis.momentum_status || 'N/A'}`;
    }

    // Fallback to signals data if analysis is missing
    if (data.data?.signals) {
      const signals = data.data.signals;
      return `📊 **BTC Technical Data**

    💰 **Current Price:** $${signals.current_price?.toLocaleString() || 'N/A'}
    📈 **Change:** ${signals.price_change_percent?.toFixed(2) || 'N/A'}%
    🎯 **Signal:** ${signals.mathematical_signal || 'N/A'}
    📊 **Confidence:** ${signals.signal_confidence?.toFixed(1) || 'N/A'}%
    📋 **Pattern:** ${signals.synthetic_pattern || 'N/A'}`;
    }

    return "⚠️ No analysis response from server.";
      } catch (error) {
        console.error('sendMessageToChatbot catch error:', error);
        return `Sorry, something went wrong. Please try again later.\nDetails: ${error.message}`;
      }
    };

// For debug/testing
export const AyaForUser = (userInput) => {
  sendMessageToChatbot(userInput)
    .then(response => console.log("AyaForUser response:", response))
    .catch(error => console.error("AyaForUser error:", error));
};
