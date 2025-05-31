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
  const OFFSET = 1109;
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
      `RSI: ${indicators.rsi?.toFixed(2) || 'N/A'}`,
      `MACD Crossover: ${indicators.macdCrossover || 'N/A'}`,
      `Volume Ratio: ${indicators.volumeRatio?.toFixed(4) || 'N/A'}`
    ]
  );
};