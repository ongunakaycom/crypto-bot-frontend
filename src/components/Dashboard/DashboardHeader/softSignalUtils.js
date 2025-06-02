// === Shared Utilities ---
const isValidData = (indicators, market) =>
  indicators && market && indicators.price != null;

// === Main Detection Function ---
export const detectSoftSignals = (indicators, market, quantum) => {
  const results = [];

  if (!isValidData(indicators, market)) {
    console.log('[SoftSignals] Invalid input data:', { indicators, market });
    return results;
  }

  const { price, trend, volume } = indicators;
  const pressure = (market.marketPressure || 'Neutral').replace(/_Market$/, '');
  const bollLower = indicators?.BollingerBands?.lower ?? null;
  const atr = indicators?.ATR ?? null;
  const priceBelowLowerBand = bollLower !== null && price < bollLower;

  // === Quantum Prediction Anomaly
  const predictedPrice = quantum?.prediction?.value;
  const predictionConfidence = quantum?.prediction?.confidence;

  if (predictedPrice && predictionConfidence >= 0.75 && price != null) {
    const deviation = Math.abs(predictedPrice - price);
    const deviationRatio = deviation / price;

    if (deviationRatio >= 0.0015 ) {
      results.push({
        type: 'quantum-anomaly',
        price,
        details: {
          predicted: predictedPrice.toFixed(2),
          actual: price.toFixed(2),
          delta: deviation.toFixed(2),
          deltaPercent: (deviationRatio * 100).toFixed(2) + '%',
          confidence: (predictionConfidence * 100).toFixed(1) + '%',
          regime: quantum?.market_regime?.description ?? 'Unknown',
        },
      });
    }
  }

  // === Relaxed Soft Downtrend
  const isSoftDowntrend =
    ['Downtrend', 'Sideways'].includes(trend) &&
    ['Selling_Pressure', 'Neutral', 'Mixed'].includes(pressure) &&
    volume >= 0 &&
    priceBelowLowerBand;

  if (isSoftDowntrend) {
    results.push({
      type: 'soft-downtrend',
      price,
      details: {
        priceBelowLowerBand,
        marketPressure: pressure,
        volume,
        atr: atr?.toFixed(2) || 'N/A',
      },
    });
  }

  // === Relaxed Neutral Condition
  const isRelaxedNeutral =
    ['Sideways', 'Uptrend', 'Downtrend'].includes(trend) &&
    ['Neutral', 'Mixed', 'Low', 'Balanced', 'Buying', 'Selling'].includes(pressure);

  if (isRelaxedNeutral) {
    results.push({
      type: 'neutral',
      price,
      details: {
        reason: 'Price trend is sideways or unclear with low market aggression',
        trend,
        marketPressure: pressure,
        volume,
      },
    });
  }

  return results;
};
