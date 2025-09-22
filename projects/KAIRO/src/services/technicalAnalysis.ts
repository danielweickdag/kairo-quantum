import { MarketData } from './multiMarketTradingEngine';

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  ema: {
    ema20: number;
    ema50: number;
    ema200: number;
  };
  sma: {
    sma20: number;
    sma50: number;
    sma200: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  atr: number;
  adx: number;
  williams: number;
  momentum: number;
  cci: number;
}

export interface PriceAction {
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  strength: number; // 0-100
  support: number;
  resistance: number;
  volatility: number;
  volume_profile: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class TechnicalAnalysis {
  private readonly RSI_PERIOD = 14;
  private readonly MACD_FAST = 12;
  private readonly MACD_SLOW = 26;
  private readonly MACD_SIGNAL = 9;
  private readonly BB_PERIOD = 20;
  private readonly BB_DEVIATION = 2;
  private readonly ATR_PERIOD = 14;
  private readonly ADX_PERIOD = 14;
  private readonly STOCH_K = 14;
  private readonly STOCH_D = 3;

  constructor() {
    console.log('Technical Analysis engine initialized');
  }

  /**
   * Perform comprehensive technical analysis on market data
   */
  async analyze(marketData: MarketData): Promise<TechnicalIndicators & { priceAction: PriceAction }> {
    const prices = marketData.ohlcv.map(candle => candle.close);
    const highs = marketData.ohlcv.map(candle => candle.high);
    const lows = marketData.ohlcv.map(candle => candle.low);
    const volumes = marketData.ohlcv.map(candle => candle.volume);

    if (prices.length < 200) {
      throw new Error('Insufficient data for technical analysis (minimum 200 periods required)');
    }

    const indicators: TechnicalIndicators = {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      bollinger: this.calculateBollingerBands(prices),
      ema: {
        ema20: this.calculateEMA(prices, 20),
        ema50: this.calculateEMA(prices, 50),
        ema200: this.calculateEMA(prices, 200)
      },
      sma: {
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        sma200: this.calculateSMA(prices, 200)
      },
      stochastic: this.calculateStochastic(highs, lows, prices),
      atr: this.calculateATR(highs, lows, prices),
      adx: this.calculateADX(highs, lows, prices),
      williams: this.calculateWilliamsR(highs, lows, prices),
      momentum: this.calculateMomentum(prices),
      cci: this.calculateCCI(highs, lows, prices)
    };

    const priceAction = this.analyzePriceAction(marketData, indicators);

    return { ...indicators, priceAction };
  }

  /**
   * Calculate Relative Strength Index (RSI)
   */
  private calculateRSI(prices: number[]): number {
    if (prices.length < this.RSI_PERIOD + 1) return 50;

    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const avgGain = gains.slice(-this.RSI_PERIOD).reduce((a, b) => a + b, 0) / this.RSI_PERIOD;
    const avgLoss = losses.slice(-this.RSI_PERIOD).reduce((a, b) => a + b, 0) / this.RSI_PERIOD;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  private calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const emaFast = this.calculateEMA(prices, this.MACD_FAST);
    const emaSlow = this.calculateEMA(prices, this.MACD_SLOW);
    const macd = emaFast - emaSlow;

    // Calculate signal line (EMA of MACD)
    const macdValues = [];
    for (let i = this.MACD_SLOW - 1; i < prices.length; i++) {
      const fastEma = this.calculateEMA(prices.slice(0, i + 1), this.MACD_FAST);
      const slowEma = this.calculateEMA(prices.slice(0, i + 1), this.MACD_SLOW);
      macdValues.push(fastEma - slowEma);
    }

    const signal = this.calculateEMA(macdValues, this.MACD_SIGNAL);
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  /**
   * Calculate Bollinger Bands
   */
  private calculateBollingerBands(prices: number[]): { upper: number; middle: number; lower: number } {
    const middle = this.calculateSMA(prices, this.BB_PERIOD);
    const stdDev = this.calculateStandardDeviation(prices.slice(-this.BB_PERIOD));
    
    return {
      upper: middle + (stdDev * this.BB_DEVIATION),
      middle,
      lower: middle - (stdDev * this.BB_DEVIATION)
    };
  }

  /**
   * Calculate Exponential Moving Average (EMA)
   */
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  }

  /**
   * Calculate Simple Moving Average (SMA)
   */
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return 0;
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  /**
   * Calculate Stochastic Oscillator
   */
  private calculateStochastic(highs: number[], lows: number[], closes: number[]): { k: number; d: number } {
    if (highs.length < this.STOCH_K) return { k: 50, d: 50 };

    const recentHighs = highs.slice(-this.STOCH_K);
    const recentLows = lows.slice(-this.STOCH_K);
    const currentClose = closes[closes.length - 1];

    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);

    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    
    // Calculate %D (SMA of %K)
    const kValues = [];
    for (let i = this.STOCH_K - 1; i < closes.length; i++) {
      const periodHighs = highs.slice(i - this.STOCH_K + 1, i + 1);
      const periodLows = lows.slice(i - this.STOCH_K + 1, i + 1);
      const periodHigh = Math.max(...periodHighs);
      const periodLow = Math.min(...periodLows);
      kValues.push(((closes[i] - periodLow) / (periodHigh - periodLow)) * 100);
    }

    const d = kValues.slice(-this.STOCH_D).reduce((a, b) => a + b, 0) / this.STOCH_D;

    return { k, d };
  }

  /**
   * Calculate Average True Range (ATR)
   */
  private calculateATR(highs: number[], lows: number[], closes: number[]): number {
    if (highs.length < this.ATR_PERIOD + 1) return 0;

    const trueRanges = [];
    for (let i = 1; i < highs.length; i++) {
      const tr1 = highs[i] - lows[i];
      const tr2 = Math.abs(highs[i] - closes[i - 1]);
      const tr3 = Math.abs(lows[i] - closes[i - 1]);
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }

    return this.calculateSMA(trueRanges, this.ATR_PERIOD);
  }

  /**
   * Calculate Average Directional Index (ADX)
   */
  private calculateADX(highs: number[], lows: number[], closes: number[]): number {
    if (highs.length < this.ADX_PERIOD + 1) return 0;

    // Simplified ADX calculation
    const dmPlus = [];
    const dmMinus = [];

    for (let i = 1; i < highs.length; i++) {
      const upMove = highs[i] - highs[i - 1];
      const downMove = lows[i - 1] - lows[i];

      dmPlus.push(upMove > downMove && upMove > 0 ? upMove : 0);
      dmMinus.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }

    const avgDmPlus = this.calculateSMA(dmPlus, this.ADX_PERIOD);
    const avgDmMinus = this.calculateSMA(dmMinus, this.ADX_PERIOD);
    const atr = this.calculateATR(highs, lows, closes);

    if (atr === 0) return 0;

    const diPlus = (avgDmPlus / atr) * 100;
    const diMinus = (avgDmMinus / atr) * 100;
    const dx = Math.abs(diPlus - diMinus) / (diPlus + diMinus) * 100;

    return dx;
  }

  /**
   * Calculate Williams %R
   */
  private calculateWilliamsR(highs: number[], lows: number[], closes: number[]): number {
    if (highs.length < 14) return -50;

    const recentHighs = highs.slice(-14);
    const recentLows = lows.slice(-14);
    const currentClose = closes[closes.length - 1];

    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);

    return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
  }

  /**
   * Calculate Momentum
   */
  private calculateMomentum(prices: number[]): number {
    if (prices.length < 10) return 0;
    const current = prices[prices.length - 1];
    const past = prices[prices.length - 10];
    return ((current - past) / past) * 100;
  }

  /**
   * Calculate Commodity Channel Index (CCI)
   */
  private calculateCCI(highs: number[], lows: number[], closes: number[]): number {
    if (highs.length < 20) return 0;

    const typicalPrices = [];
    for (let i = 0; i < highs.length; i++) {
      typicalPrices.push((highs[i] + lows[i] + closes[i]) / 3);
    }

    const sma = this.calculateSMA(typicalPrices, 20);
    const meanDeviation = typicalPrices.slice(-20)
      .reduce((sum, price) => sum + Math.abs(price - sma), 0) / 20;

    const currentTypicalPrice = typicalPrices[typicalPrices.length - 1];
    return (currentTypicalPrice - sma) / (0.015 * meanDeviation);
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Analyze price action and market structure
   */
  private analyzePriceAction(marketData: MarketData, indicators: TechnicalIndicators): PriceAction {
    const prices = marketData.ohlcv.map(candle => candle.close);
    const volumes = marketData.ohlcv.map(candle => candle.volume);
    const currentPrice = prices[prices.length - 1];

    // Determine trend
    let trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' = 'SIDEWAYS';
    if (indicators.ema.ema20 > indicators.ema.ema50 && indicators.ema.ema50 > indicators.ema.ema200) {
      trend = 'BULLISH';
    } else if (indicators.ema.ema20 < indicators.ema.ema50 && indicators.ema.ema50 < indicators.ema.ema200) {
      trend = 'BEARISH';
    }

    // Calculate trend strength
    const adxStrength = Math.min(indicators.adx, 100);
    const rsiStrength = indicators.rsi > 50 ? indicators.rsi - 50 : 50 - indicators.rsi;
    const strength = (adxStrength + rsiStrength) / 2;

    // Find support and resistance levels
    const recentPrices = prices.slice(-50);
    const support = Math.min(...recentPrices);
    const resistance = Math.max(...recentPrices);

    // Calculate volatility using ATR
    const volatility = (indicators.atr / currentPrice) * 100;

    // Analyze volume profile
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const currentVolume = volumes[volumes.length - 1];
    let volume_profile: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    
    if (currentVolume > avgVolume * 1.5) {
      volume_profile = 'HIGH';
    } else if (currentVolume < avgVolume * 0.5) {
      volume_profile = 'LOW';
    }

    return {
      trend,
      strength,
      support,
      resistance,
      volatility,
      volume_profile
    };
  }

  /**
   * Get signal strength based on multiple indicators
   */
  getSignalStrength(indicators: TechnicalIndicators): {
    bullish: number;
    bearish: number;
    overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  } {
    let bullishSignals = 0;
    let bearishSignals = 0;
    const totalSignals = 8;

    // RSI signals
    if (indicators.rsi < 30) bullishSignals++;
    if (indicators.rsi > 70) bearishSignals++;

    // MACD signals
    if (indicators.macd.histogram > 0) bullishSignals++;
    if (indicators.macd.histogram < 0) bearishSignals++;

    // EMA signals
    if (indicators.ema.ema20 > indicators.ema.ema50) bullishSignals++;
    if (indicators.ema.ema20 < indicators.ema.ema50) bearishSignals++;

    // Bollinger Bands signals
    if (indicators.bollinger.lower > 0) bullishSignals++; // Price near lower band
    if (indicators.bollinger.upper > 0) bearishSignals++; // Price near upper band

    // Stochastic signals
    if (indicators.stochastic.k < 20) bullishSignals++;
    if (indicators.stochastic.k > 80) bearishSignals++;

    // Williams %R signals
    if (indicators.williams < -80) bullishSignals++;
    if (indicators.williams > -20) bearishSignals++;

    // Momentum signals
    if (indicators.momentum > 0) bullishSignals++;
    if (indicators.momentum < 0) bearishSignals++;

    // CCI signals
    if (indicators.cci < -100) bullishSignals++;
    if (indicators.cci > 100) bearishSignals++;

    const bullishPercentage = (bullishSignals / totalSignals) * 100;
    const bearishPercentage = (bearishSignals / totalSignals) * 100;

    let overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    if (bullishPercentage > bearishPercentage + 20) {
      overall = 'BULLISH';
    } else if (bearishPercentage > bullishPercentage + 20) {
      overall = 'BEARISH';
    }

    return {
      bullish: bullishPercentage,
      bearish: bearishPercentage,
      overall
    };
  }
}

export default TechnicalAnalysis;