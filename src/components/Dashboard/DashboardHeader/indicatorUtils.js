// === Extract indicators and order book ===
export const extractIndicatorsFromNewSchema = (data) => {
  const priceData = data?.market_data?.price;
  const ta = data?.technical_analysis;
  const orderBook = data?.market_data?.order_book;

  if (!priceData || !ta || !orderBook) return null;

  const { close: price, vwap = 0, volume = 0 } = priceData;
  const avgVolume = data.market_data.volume?.average || 1;
  const volumeRatio = avgVolume > 0 ? volume / avgVolume : 0;

  return {
    price,
    vwap,
    volume,
    avgVolume,
    volumeRatio,
    candlestickPattern: ta.patterns?.candlestick,
    trendSummary: ta.summary,
    priceData,
    bids: orderBook.bids || [],
    asks: orderBook.asks || []
  };
};

// === Check for frozen price data ===
export const isPriceDataFrozen = (priceData) => {
  if (!priceData) return true;
  const { open, high, low, close, volume } = priceData;
  return open === high && high === low && low === close && volume === 0;
};

// === Helper: Sum filtered volume ===
const sumVolume = (orders, threshold = 0) =>
  orders
    .filter(([_, size]) => parseFloat(size) > threshold)
    .reduce((sum, [_, size]) => sum + parseFloat(size), 0);

// === Analyze order book ===
export const analyzeOrderBook = (bids, asks) => {
  const whaleThreshold = 100;

  const totalBidVolume = sumVolume(bids);
  const totalAskVolume = sumVolume(asks);
  const whaleBidVolume = sumVolume(bids, whaleThreshold);
  const whaleAskVolume = sumVolume(asks, whaleThreshold);

  const bidAskDiffRatio = Math.abs(totalBidVolume - totalAskVolume) / Math.max(totalBidVolume, totalAskVolume || 1);
  const whaleDiffRatio = Math.abs(whaleBidVolume - whaleAskVolume) / Math.max(whaleBidVolume, whaleAskVolume || 1);

  const marketPressure =
    bidAskDiffRatio < 0.05 ? 'Neutral_Market' :
    totalBidVolume > totalAskVolume ? 'Buying_Pressure' :
    'Selling_Pressure';

  const whaleSide =
    whaleBidVolume === 0 && whaleAskVolume === 0 ? 'Whale_Neutral' :
    whaleDiffRatio < 0.1 ? 'Whale_Neutral' :
    whaleBidVolume > whaleAskVolume ? 'Whale_Buying' :
    'Whale_Selling';

  return {
    totalBidVolume,
    totalAskVolume,
    whaleBidVolume,
    whaleAskVolume,
    marketPressure,
    whaleSide
  };
};

// === Analyze combined market conditions ===
export const analyzeMarketConditions = (indicators) => {
  const orderBookAnalysis = analyzeOrderBook(indicators.bids, indicators.asks);

  return {
    ...orderBookAnalysis,
    volumePump: indicators.volumeRatio > 1.5,
    aboveVWAP: indicators.vwap > 0 && indicators.price > indicators.vwap,
    validVolume: indicators.volume > 0
  };
};

// === Determine if a BUY signal should trigger ===
export const shouldTriggerBuySignal = (indicators, market) => {
  const isBullishPattern = indicators.candlestickPattern?.toLowerCase() === 'bullish_engulfing';
  const isOversold = indicators.trendSummary === 'Oversold';

  return (
    isOversold &&
    isBullishPattern &&
    market.marketPressure === 'Buying_Pressure' &&
    market.whaleSide === 'Whale_Buying' &&
    market.volumePump
  );
};
