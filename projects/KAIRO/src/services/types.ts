export interface MarketType {
  STOCKS: 'stocks';
  CRYPTO: 'crypto';
  FOREX: 'forex';
  OPTIONS: 'options';
  FUTURES: 'futures';
  COMMODITIES: 'commodities';
}

export interface MarketData {
  symbol: string;
  market: keyof MarketType;
  price: number;
  volume: number;
  high24h: number;
  low24h: number;
  change24h: number;
  timestamp: Date;
  ohlcv: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export interface TradingSignal {
  id: string;
  symbol: string;
  market: keyof MarketType;
  timeframe: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: Date;
  indicators: {
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
  };
  riskReward: number;
  winProbability: number;
  // GainzAlgo V2 Enhanced Features
  gainzAlgoFeatures: {
    winRateScore: number; // Target 75%+
    profitFactor: number; // Target 1.6+
    drawdownRisk: number; // Keep below 5%
    signalStrength: 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';
    marketCondition: 'TRENDING' | 'RANGING' | 'VOLATILE' | 'STABLE';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    expectedDuration: number; // in minutes
    patternDetected: string; // GainzAlgo pattern name or 'NONE'
    noRepaintConfirmed?: boolean; // Whether signal has been confirmed as immutable (no repaint)
  };
  metadata?: {
    metrics?: any;
    riskParameters?: any;
    gainzAlgoMetrics?: {
      algorithmVersion: string;
      backtestResults: {
        winRate: number;
        profitFactor: number;
        maxDrawdown: number;
        totalTrades: number;
      };
    };
  };
}

// GainzAlgo V2 Performance Tracking Interfaces
export interface PerformanceMetrics {
  winRate: number; // Target 75%+
  profitFactor: number; // Target 1.6+
  maxDrawdown: number; // Keep below 5%
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  sharpeRatio: number;
  calmarRatio: number;
  recoveryFactor: number;
  profitabilityIndex: number;
  // Enhanced profit factor metrics
  totalSignals?: number;
  highConfidenceSignals?: number;
  averageConfidence?: number;
  marketsCovered?: number;
  uptime?: number;
  lastSignalTime?: number;
  expectancy?: number;
  isTargetMet?: boolean;
}

export interface AlertConfiguration {
  id: string;
  userId: string;
  enabled: boolean;
  alertTypes: {
    entrySignals: boolean;
    exitSignals: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
    drawdownWarning: boolean;
    profitFactorAlert: boolean;
    winRateAlert: boolean;
  };
  deliveryMethods: {
    push: boolean;
    email: boolean;
    sms: boolean;
    webhook?: string;
  };
  thresholds: {
    minConfidence: number;
    maxDrawdown: number;
    minProfitFactor: number;
    minWinRate: number;
  };
}

export interface RiskManagementConfig {
  maxPositionSize: number; // as percentage of portfolio
  maxDailyLoss: number; // as percentage
  maxDrawdown: number; // as percentage (default 5%)
  riskPerTrade: number; // as percentage
  maxConcurrentTrades: number;
  stopLossMultiplier: number;
  takeProfitMultiplier: number;
  trailingStopEnabled: boolean;
  trailingStopDistance: number;
  emergencyStopEnabled: boolean;
  emergencyStopThreshold: number;
}

export interface MarketScanConfig {
  enabled: boolean;
  markets: (keyof MarketType)[];
  timeframes: string[];
  scanInterval: number; // in seconds
  minVolume: number;
  minPrice: number;
  maxPrice: number;
  volatilityThreshold: number;
  trendStrengthThreshold: number;
}

export interface BacktestResult {
  id: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  metrics: PerformanceMetrics;
  trades: TradeResult[];
  equityCurve: { date: Date; equity: number }[];
  drawdownCurve: { date: Date; drawdown: number }[];
}

export interface TradeResult {
  id: string;
  signal: TradingSignal;
  entryTime: Date;
  exitTime?: Date;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercentage?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  exitReason?: 'TAKE_PROFIT' | 'STOP_LOSS' | 'MANUAL' | 'TIMEOUT';
  commission: number;
  slippage: number;
}

export interface OptimizationResult {
  parameters: { [key: string]: any };
  performance: PerformanceMetrics;
  score: number;
  rank: number;
}

export interface GainzAlgoEngineConfig {
  version: string;
  riskManagement: RiskManagementConfig;
  alertConfig: AlertConfiguration;
  marketScan: MarketScanConfig;
  optimization: {
    enabled: boolean;
    targetMetric: 'winRate' | 'profitFactor' | 'sharpeRatio';
    optimizationPeriod: number; // in days
  };
  realTimeProcessing: {
    enabled: boolean;
    maxLatency: number; // in milliseconds
    bufferSize: number;
  };
}