export const handleSoftSignalAlert = (softSignalResults, indicators, price, createAlert, tradeState) => {
  if (!Array.isArray(softSignalResults) || softSignalResults.length === 0) return;

  for (const result of softSignalResults) {
    const { type, details } = result;

    switch (type) {
      case 'soft-downtrend':
        if (tradeState.signalType !== 'SELL') {
          createAlert('info', '📉 Possible downtrend forming (early signal)', price, [
            `Price: $${price.toFixed(2)}`,
            `Price < Bollinger Band: ${details.priceBelowLowerBand ? 'Yes' : 'No'}`,
            `Trend: ${indicators.trendSummary || 'N/A'}`,
            `Market Pressure: ${details.marketPressure}`,
            `ATR: ${details.atr}`,
          ]);
        }
        break;

      case 'quantum-anomaly':
        createAlert('warning', '🧠 Quantum Anomaly Detected', price, [
          `Predicted: $${details.predicted}`,
          `Actual: $${details.actual}`,
          `Deviation: $${details.delta} (${details.deltaPercent})`,
          `Confidence: ${details.confidence}`,
          `Market Regime: ${details.regime}`,
        ]);
        break;

      case 'neutral':
        createAlert('neutral', '⚖️ Market Appears Neutral', price, [
          `Trend: ${details.trend}`,
          `Pressure: ${details.marketPressure}`,
          `Volume: ${details.volume}`,
          `Reason: ${details.reason}`,
        ]);
        break;

      default:
        console.warn('Unhandled soft signal type:', type);
        break;
    }
  }
};

export const checkTradeProgress = (tradeState, currentPrice, createAlert, resetTradeState) => {
  const { active, signalType, entryPrice, takeProfit, stopLoss } = tradeState;
  if (!active || entryPrice === null) return;

  const isProfit = currentPrice >= takeProfit;
  const isLoss = currentPrice <= stopLoss;

  if (signalType === 'BUY' && (isProfit || isLoss)) {
    const type = isProfit ? 'success' : 'danger';
    const outcome = isProfit ? '🎯 Take Profit Reached' : '🚨 Stop Loss Triggered';
    const value = Math.abs(currentPrice - entryPrice);

    createAlert(type, outcome, currentPrice, [
      `${signalType} Trade Closed`,
      `Entry: $${entryPrice.toFixed(2)}`,
      `Exit: $${currentPrice.toFixed(2)}`,
      `${isProfit ? 'Profit' : 'Loss'}: $${value.toFixed(2)}`
    ]);

    resetTradeState();
  }
};

export const createTradeSignal = (signalType, price, indicators, setTradeState, createAlert) => {
  const OFFSET = 1109; // Consider making this dynamic or configurable
  const takeProfit = signalType === 'BUY' ? price + OFFSET : null;
  const stopLoss = signalType === 'BUY' ? price - OFFSET : null;

  setTradeState({ active: true, signalType, entryPrice: price, takeProfit, stopLoss });

  createAlert(
    signalType === 'BUY' ? 'bullish' : 'bearish',
    `BTC ${signalType} SIGNAL`,
    price,
    [
      `Entry Price: $${price.toFixed(2)}`,
      `Take Profit: $${takeProfit?.toFixed(2) || 'N/A'}`,
      `Stop Loss: $${stopLoss?.toFixed(2) || 'N/A'}`,
      `RSI: ${indicators.RSI?.toFixed(2) || 'N/A'}`, // Corrected indicator path
      `MACD Crossover: ${indicators.MACD?.crossover || 'N/A'}`, // Corrected indicator path
      `Volume Ratio: ${indicators.volumeRatio?.toFixed(4) || 'N/A'}`
    ]
  );
};

// Placeholder function - implement actual market analysis logic
export const analyzeMarketConditions = (indicators) => {
  // Analyze indicators (e.g., price, volume, trend, RSI, MACD, order book imbalance)
  // and return a summary of market conditions.
  // Example placeholder logic:
  const marketPressure = (indicators?.coinbase?.volumeBuy1h ?? 0) > (indicators?.coinbase?.volumeSell1h ?? 0) ? 'Buying' : 'Selling';
  const trendSummary = indicators?.trendSummary ?? 'Unknown';
  const regime = indicators?.regime ?? 'Unknown';

  return {
    marketPressure, // e.g., 'Buying', 'Selling', 'Balanced'
    trendSummary,   // e.g., 'Uptrend', 'Downtrend', 'Sideways'
    regime,         // e.g., 'Trending', 'Ranging'
    // Add other relevant market state indicators
  };
};

export const shouldTriggerBuySignal = (indicators, market) => {
  const isOversoldTrend = indicators?.trend === 'Oversold';
  const isBullishEngulfing = indicators?.candlestickPattern === 'bullish_engulfing';
  const whaleThreshold = 50000;
  const hasWhaleBuy = indicators?.bids?.some(bid => bid[1] >= whaleThreshold);

  const shouldBuy = isOversoldTrend && isBullishEngulfing && hasWhaleBuy;

  if (!shouldBuy) {
    console.log('Buy Signal Skipped:', {
      isOversoldTrend,
      isBullishEngulfing,
      hasWhaleBuy,
    });
  }

  return shouldBuy;
};
