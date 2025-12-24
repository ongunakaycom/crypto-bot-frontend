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
    console.log('🔍 Sending request to:', url, 'with message:', message);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const requestBody = { request: message };
    console.log('🔍 Request body:', requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('🔍 Response status:', response.status, 'ok:', response.ok);

    if (!response.ok) {
      let errorText = 'No error body';
      try {
        errorText = await response.text();
      } catch (e) {
        console.warn('Could not read error response body');
      }
      
      console.error('❌ Backend error:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: errorText
      });
      
      if (response.status === 404) {
        return "❌ Trading analysis service is currently unavailable. The service endpoint was not found.";
      } else if (response.status >= 500) {
        return "❌ Trading analysis server is experiencing technical difficulties. Please try again in a few minutes.";
      }
      
      return `❌ Service error (${response.status}): ${response.statusText || 'Please try again later.'}`;
    }

    const text = await response.text();
    console.log('🔍 Raw response text:', text);

    if (!text || text.trim() === '') {
      return "⚠️ Received empty response from trading analysis service. The service might be overloaded.";
    }

    let data;
    try {
      data = JSON.parse(text);
      console.log('🔍 Parsed JSON data:', data);
    } catch (jsonErr) {
      console.warn('⚠️ Response is not JSON, returning as plain text');
      return text;
    }

    if (data.error) {
      return `❌ Analysis error: ${data.error}`;
    }
    if (data.data?.analysis?.error) {
      return `❌ Analysis error: ${data.data.analysis.error}`;
    }

if (data.data?.ai_analysis && data.data?.metrics) {
  const m = data.data.metrics;

  let message = `📊 **BTC/USD Market Update**\n\n`;
  message += `💰 **Price**: $${m.price?.toLocaleString()}\n`;
  message += `📈 **RSI**: ${m.rsi}\n`;
  message += `📉 **Trend**: ${m.trend.toUpperCase()}\n`;
  message += `🎯 **Signal**: ${m.signal}\n\n`;
  message += `🧠 **AI Insight**: ${data.data.ai_analysis}\n\n`;
  message += `*This is an automated technical analysis. Always manage risk.*`;

  return message;
}


if (data.message) {
  return data.message;
}

    return "⚠️ Trading analysis service responded but no specific advice was generated. Please try rephrasing your question.";

  } catch (error) {
    console.error('💥 sendMessageToChatbot catch error:', error);
    
    if (error.name === 'AbortError') {
      return "⏰ Request timeout. The trading analysis service is taking too long to respond.";
    }
    
    if (error.message.includes('Failed to fetch')) {
      return "🌐 Network connection issue. Please check your internet connection and try again.";
    }
    
    return `❌ Unable to connect to trading analysis service. Please try again later.`;
  }
};