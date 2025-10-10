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

    // Check for raw_response first (if backend provides formatted text)
    if (data.data?.analysis?.raw_response) {
      return data.data.analysis.raw_response;
    }
    if (data.analysis?.raw_response) {
      return data.analysis.raw_response;
    }

    // If we have trading data but no raw_response, format it ourselves
    if (data.data?.analysis && data.data?.signals) {
      const analysis = data.data.analysis;
      const signals = data.data.signals;
      
      // Format the trading analysis inline
      let message = `📊 **BTC/USD Trading Analysis**\n\n`;
      
      // Price and basic info
      message += `💰 **Current Price**: $${analysis.current_price?.toLocaleString() || 'N/A'}\n`;
      message += `📈 **Price Change**: ${analysis.price_change?.toFixed(2)}%\n`;
      message += `🎯 **Signal Direction**: ${analysis.signal_direction || signals.mathematical_signal}\n\n`;
      
      // Confidence and momentum
      message += `📊 **Confidence Level**: ${analysis.confidence_level?.toFixed(1)}%\n`;
      message += `⚡ **Momentum**: ${analysis.momentum_status?.toUpperCase()}\n`;
      message += `📉 **Recent Trend**: ${signals.recent_trend}\n\n`;
      
      // Technical indicators
      message += `🔧 **Technical Summary**: ${analysis.technical_summary}\n`;
      message += `🔄 **Market Pattern**: ${signals.synthetic_pattern}\n\n`;
      
      // Detailed indicators
      if (signals.indicators) {
        message += `**Key Indicators:**\n`;
        message += `• RSI: ${signals.indicators.rsi?.toFixed(1)} (${signals.indicators.rsi > 70 ? 'Overbought' : signals.indicators.rsi < 30 ? 'Oversold' : 'Neutral'})\n`;
        message += `• Support: $${signals.indicators.support_level?.toLocaleString()}\n`;
        message += `• Resistance: $${signals.indicators.resistance_level?.toLocaleString()}\n`;
        message += `• Buy/Sell Ratio: ${(signals.indicators.buy_sell_ratio * 100)?.toFixed(1)}%\n`;
      }
      
      // Trading advice based on signals
      message += `\n**Trading Advice:**\n`;
      if (analysis.signal_direction === 'DOWN' || signals.mathematical_signal === 'DOWN') {
        message += `Consider waiting for better entry points or setting limit orders below current price.`;
      } else if (analysis.signal_direction === 'UP' || signals.mathematical_signal === 'UP') {
        message += `Potential buying opportunity, but monitor key resistance levels.`;
      } else {
        message += `Market is consolidating. Consider range-bound trading strategies.`;
      }
      
      message += `\n\n*Always use proper risk management and consider multiple timeframes.*`;
      
      return message;
    }

    if (data.message) {
      return data.message;
    }

    if (data.data || data.analysis) {
      return "📊 Market analysis completed. Review the current market conditions and consider your risk tolerance before trading.";
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