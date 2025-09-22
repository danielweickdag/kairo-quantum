import { EventEmitter } from 'events';
import { TradingSignal, MarketData, TradeResult, PerformanceMetrics } from './types';
import { PortfolioSnapshot, Position } from './portfolioTracker';
import { Alert, AlertMetrics } from './advancedAlertSystem';

export interface DashboardMetrics {
  portfolio: {
    totalValue: number;
    dailyPnL: number;
    dailyPnLPercent: number;
    totalPnL: number;
    totalPnLPercent: number;
    drawdown: number;
    maxDrawdown: number;
    positions: Position[];
    cash: number;
    marginUsed: number;
    marginAvailable: number;
  };
  trading: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    averageHoldTime: number;
    tradingFrequency: number;
  };
  signals: {
    totalSignals: number;
    signalsToday: number;
    averageConfidence: number;
    signalsByMarket: { [market: string]: number };
    signalsByType: { [type: string]: number };
    topPerformingSignals: SignalPerformance[];
  };
  risk: {
    currentRisk: number;
    maxRisk: number;
    riskAdjustedReturn: number;
    volatility: number;
    beta: number;
    var95: number; // Value at Risk 95%
    expectedShortfall: number;
    correlationMatrix: { [symbol: string]: { [symbol: string]: number } };
  };
  alerts: AlertMetrics;
  system: {
    uptime: number;
    lastUpdate: Date;
    activeConnections: number;
    systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    memoryUsage: number;
    cpuUsage: number;
    latency: number;
  };
}

export interface SignalPerformance {
  signalId: string;
  symbol: string;
  signal: string;
  confidence: number;
  timestamp: Date;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED' | 'EXPIRED';
  holdTime?: number;
}

export interface ChartData {
  timestamp: Date;
  value: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

export interface DashboardChart {
  id: string;
  title: string;
  type: 'LINE' | 'CANDLESTICK' | 'BAR' | 'AREA' | 'SCATTER' | 'PIE' | 'HEATMAP';
  data: ChartData[];
  config: {
    timeframe: string;
    indicators?: string[];
    colors?: string[];
    yAxis?: {
      min?: number;
      max?: number;
      format?: string;
    };
    xAxis?: {
      format?: string;
    };
  };
  lastUpdated: Date;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'METRIC' | 'CHART' | 'TABLE' | 'ALERT' | 'NEWS' | 'WATCHLIST' | 'ORDERS';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: {
    [key: string]: any;
  };
  data: any;
  refreshInterval: number; // seconds
  lastRefresh: Date;
  enabled: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: Date;
  lastModified: Date;
}

export interface MarketOverview {
  symbol: string;
  market: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap?: number;
  high24h: number;
  low24h: number;
  signals: number;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  technicalRating: number; // 0-100
  lastUpdated: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: Date;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  relevantSymbols: string[];
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface WatchlistItem {
  symbol: string;
  market: string;
  addedAt: Date;
  alerts: {
    priceAbove?: number;
    priceBelow?: number;
    volumeSpike?: boolean;
    signalGenerated?: boolean;
  };
  notes?: string;
}

export class PerformanceDashboard extends EventEmitter {
  private metrics: DashboardMetrics;
  private charts: Map<string, DashboardChart> = new Map();
  private layouts: Map<string, DashboardLayout> = new Map();
  private marketOverview: Map<string, MarketOverview> = new Map();
  private news: NewsItem[] = [];
  private watchlist: WatchlistItem[] = [];
  private signalPerformance: Map<string, SignalPerformance> = new Map();
  
  private isRunning: boolean = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private startTime: Date = new Date();
  private lastUpdateTime: Date = new Date();
  
  constructor() {
    super();
    
    this.metrics = this.initializeMetrics();
    this.initializeDefaultCharts();
    this.initializeDefaultLayouts();
    
    console.log('Performance Dashboard initialized');
  }

  /**
   * Initialize default metrics structure
   */
  private initializeMetrics(): DashboardMetrics {
    return {
      portfolio: {
        totalValue: 100000,
        dailyPnL: 0,
        dailyPnLPercent: 0,
        totalPnL: 0,
        totalPnLPercent: 0,
        drawdown: 0,
        maxDrawdown: 0,
        positions: [],
        cash: 100000,
        marginUsed: 0,
        marginAvailable: 100000
      },
      trading: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        averageWin: 0,
        averageLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        averageHoldTime: 0,
        tradingFrequency: 0
      },
      signals: {
        totalSignals: 0,
        signalsToday: 0,
        averageConfidence: 0,
        signalsByMarket: {},
        signalsByType: {},
        topPerformingSignals: []
      },
      risk: {
        currentRisk: 0,
        maxRisk: 10,
        riskAdjustedReturn: 0,
        volatility: 0,
        beta: 1,
        var95: 0,
        expectedShortfall: 0,
        correlationMatrix: {}
      },
      alerts: {
        totalAlerts: 0,
        alertsByPriority: {},
        alertsByChannel: {},
        deliveryRate: 0,
        averageDeliveryTime: 0,
        failedDeliveries: 0,
        acknowledgedAlerts: 0,
        topTriggeredRules: [],
        recentAlerts: []
      },
      system: {
        uptime: 0,
        lastUpdate: new Date(),
        activeConnections: 0,
        systemHealth: 'HEALTHY',
        memoryUsage: 0,
        cpuUsage: 0,
        latency: 0
      }
    };
  }

  /**
   * Initialize default charts
   */
  private initializeDefaultCharts(): void {
    // Portfolio value chart
    this.addChart({
      id: 'portfolio_value',
      title: 'Portfolio Value',
      type: 'LINE',
      data: [],
      config: {
        timeframe: '1d',
        colors: ['#00ff88'],
        yAxis: {
          format: '$,.0f'
        },
        xAxis: {
          format: 'HH:mm'
        }
      },
      lastUpdated: new Date()
    });
    
    // Daily P&L chart
    this.addChart({
      id: 'daily_pnl',
      title: 'Daily P&L',
      type: 'BAR',
      data: [],
      config: {
        timeframe: '30d',
        colors: ['#00ff88', '#ff4444'],
        yAxis: {
          format: '$,.0f'
        }
      },
      lastUpdated: new Date()
    });
    
    // Win rate chart
    this.addChart({
      id: 'win_rate',
      title: 'Win Rate Trend',
      type: 'LINE',
      data: [],
      config: {
        timeframe: '7d',
        colors: ['#4488ff'],
        yAxis: {
          min: 0,
          max: 100,
          format: '.1%'
        }
      },
      lastUpdated: new Date()
    });
    
    // Drawdown chart
    this.addChart({
      id: 'drawdown',
      title: 'Drawdown',
      type: 'AREA',
      data: [],
      config: {
        timeframe: '30d',
        colors: ['#ff4444'],
        yAxis: {
          max: 0,
          format: '.1%'
        }
      },
      lastUpdated: new Date()
    });
    
    // Signal confidence distribution
    this.addChart({
      id: 'signal_confidence',
      title: 'Signal Confidence Distribution',
      type: 'BAR',
      data: [],
      config: {
        timeframe: '7d',
        colors: ['#ffaa00']
      },
      lastUpdated: new Date()
    });
    
    // Market correlation heatmap
    this.addChart({
      id: 'correlation_heatmap',
      title: 'Asset Correlation Matrix',
      type: 'HEATMAP',
      data: [],
      config: {
        timeframe: '30d',
        colors: ['#ff4444', '#ffffff', '#00ff88']
      },
      lastUpdated: new Date()
    });
    
    console.log(`Initialized ${this.charts.size} default charts`);
  }

  /**
   * Initialize default dashboard layouts
   */
  private initializeDefaultLayouts(): void {
    // Trading overview layout
    const tradingLayout: DashboardLayout = {
      id: 'trading_overview',
      name: 'Trading Overview',
      description: 'Main trading dashboard with key metrics and charts',
      isDefault: true,
      createdAt: new Date(),
      lastModified: new Date(),
      widgets: [
        {
          id: 'portfolio_summary',
          title: 'Portfolio Summary',
          type: 'METRIC',
          position: { x: 0, y: 0, width: 4, height: 2 },
          config: {
            metrics: ['totalValue', 'dailyPnL', 'totalPnL', 'drawdown']
          },
          data: {},
          refreshInterval: 5,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'trading_stats',
          title: 'Trading Statistics',
          type: 'METRIC',
          position: { x: 4, y: 0, width: 4, height: 2 },
          config: {
            metrics: ['winRate', 'profitFactor', 'totalTrades', 'sharpeRatio']
          },
          data: {},
          refreshInterval: 10,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'portfolio_chart',
          title: 'Portfolio Value',
          type: 'CHART',
          position: { x: 0, y: 2, width: 8, height: 4 },
          config: {
            chartId: 'portfolio_value'
          },
          data: {},
          refreshInterval: 30,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'recent_signals',
          title: 'Recent Signals',
          type: 'TABLE',
          position: { x: 8, y: 0, width: 4, height: 6 },
          config: {
            columns: ['symbol', 'signal', 'confidence', 'timestamp'],
            maxRows: 10
          },
          data: [],
          refreshInterval: 15,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'active_positions',
          title: 'Active Positions',
          type: 'TABLE',
          position: { x: 0, y: 6, width: 6, height: 3 },
          config: {
            columns: ['symbol', 'side', 'quantity', 'entryPrice', 'currentPrice', 'pnl'],
            maxRows: 8
          },
          data: [],
          refreshInterval: 10,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'recent_alerts',
          title: 'Recent Alerts',
          type: 'ALERT',
          position: { x: 6, y: 6, width: 6, height: 3 },
          config: {
            maxAlerts: 5,
            showPriority: true
          },
          data: [],
          refreshInterval: 5,
          lastRefresh: new Date(),
          enabled: true
        }
      ]
    };
    
    // Analytics layout
    const analyticsLayout: DashboardLayout = {
      id: 'analytics',
      name: 'Analytics',
      description: 'Detailed analytics and performance metrics',
      isDefault: false,
      createdAt: new Date(),
      lastModified: new Date(),
      widgets: [
        {
          id: 'performance_metrics',
          title: 'Performance Metrics',
          type: 'METRIC',
          position: { x: 0, y: 0, width: 12, height: 2 },
          config: {
            metrics: ['sharpeRatio', 'profitFactor', 'winRate', 'averageWin', 'averageLoss', 'maxDrawdown']
          },
          data: {},
          refreshInterval: 30,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'pnl_chart',
          title: 'Daily P&L',
          type: 'CHART',
          position: { x: 0, y: 2, width: 6, height: 4 },
          config: {
            chartId: 'daily_pnl'
          },
          data: {},
          refreshInterval: 60,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'drawdown_chart',
          title: 'Drawdown Analysis',
          type: 'CHART',
          position: { x: 6, y: 2, width: 6, height: 4 },
          config: {
            chartId: 'drawdown'
          },
          data: {},
          refreshInterval: 60,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'correlation_matrix',
          title: 'Correlation Matrix',
          type: 'CHART',
          position: { x: 0, y: 6, width: 6, height: 4 },
          config: {
            chartId: 'correlation_heatmap'
          },
          data: {},
          refreshInterval: 300,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'signal_analysis',
          title: 'Signal Analysis',
          type: 'CHART',
          position: { x: 6, y: 6, width: 6, height: 4 },
          config: {
            chartId: 'signal_confidence'
          },
          data: {},
          refreshInterval: 120,
          lastRefresh: new Date(),
          enabled: true
        }
      ]
    };
    
    // Risk management layout
    const riskLayout: DashboardLayout = {
      id: 'risk_management',
      name: 'Risk Management',
      description: 'Risk metrics and monitoring dashboard',
      isDefault: false,
      createdAt: new Date(),
      lastModified: new Date(),
      widgets: [
        {
          id: 'risk_metrics',
          title: 'Risk Metrics',
          type: 'METRIC',
          position: { x: 0, y: 0, width: 8, height: 2 },
          config: {
            metrics: ['currentRisk', 'var95', 'expectedShortfall', 'volatility', 'beta']
          },
          data: {},
          refreshInterval: 30,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'margin_info',
          title: 'Margin Information',
          type: 'METRIC',
          position: { x: 8, y: 0, width: 4, height: 2 },
          config: {
            metrics: ['marginUsed', 'marginAvailable']
          },
          data: {},
          refreshInterval: 10,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'position_sizes',
          title: 'Position Sizes',
          type: 'CHART',
          position: { x: 0, y: 2, width: 6, height: 4 },
          config: {
            chartId: 'position_sizes',
            type: 'PIE'
          },
          data: {},
          refreshInterval: 60,
          lastRefresh: new Date(),
          enabled: true
        },
        {
          id: 'risk_alerts',
          title: 'Risk Alerts',
          type: 'ALERT',
          position: { x: 6, y: 2, width: 6, height: 4 },
          config: {
            filterByPriority: ['HIGH', 'CRITICAL'],
            filterByTags: ['risk', 'drawdown', 'margin']
          },
          data: [],
          refreshInterval: 5,
          lastRefresh: new Date(),
          enabled: true
        }
      ]
    };
    
    this.layouts.set(tradingLayout.id, tradingLayout);
    this.layouts.set(analyticsLayout.id, analyticsLayout);
    this.layouts.set(riskLayout.id, riskLayout);
    
    console.log(`Initialized ${this.layouts.size} dashboard layouts`);
  }

  /**
   * Start the dashboard
   */
  start(): void {
    if (this.isRunning) {
      console.log('Performance Dashboard already running');
      return;
    }
    
    this.isRunning = true;
    this.startTime = new Date();
    console.log('📊 Performance Dashboard started');
    
    // Start update loop
    this.startUpdateLoop();
    
    this.emit('dashboardStarted', { timestamp: new Date() });
  }

  /**
   * Stop the dashboard
   */
  stop(): void {
    this.isRunning = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('⏹️ Performance Dashboard stopped');
    this.emit('dashboardStopped', { timestamp: new Date() });
  }

  /**
   * Start update loop
   */
  private startUpdateLoop(): void {
    this.updateInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      this.updateSystemMetrics();
      this.updateChartData();
      this.lastUpdateTime = new Date();
      
      this.emit('metricsUpdated', { metrics: this.metrics, timestamp: new Date() });
    }, 5000); // Update every 5 seconds
  }

  /**
   * Update system metrics
   */
  private updateSystemMetrics(): void {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startTime.getTime();
    
    this.metrics.system.uptime = Math.floor(uptimeMs / 1000);
    this.metrics.system.lastUpdate = now;
    
    // Mock system health metrics
    this.metrics.system.memoryUsage = Math.random() * 80 + 10; // 10-90%
    this.metrics.system.cpuUsage = Math.random() * 60 + 5; // 5-65%
    this.metrics.system.latency = Math.random() * 50 + 10; // 10-60ms
    
    // Determine system health
    if (this.metrics.system.memoryUsage > 85 || this.metrics.system.cpuUsage > 80) {
      this.metrics.system.systemHealth = 'CRITICAL';
    } else if (this.metrics.system.memoryUsage > 70 || this.metrics.system.cpuUsage > 60) {
      this.metrics.system.systemHealth = 'WARNING';
    } else {
      this.metrics.system.systemHealth = 'HEALTHY';
    }
  }

  /**
   * Update chart data
   */
  private updateChartData(): void {
    const now = new Date();
    
    // Update portfolio value chart
    const portfolioChart = this.charts.get('portfolio_value');
    if (portfolioChart) {
      portfolioChart.data.push({
        timestamp: now,
        value: this.metrics.portfolio.totalValue
      });
      
      // Keep only last 24 hours of data
      const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      portfolioChart.data = portfolioChart.data.filter(d => d.timestamp > cutoff);
      portfolioChart.lastUpdated = now;
    }
    
    // Update other charts similarly...
    this.updateWinRateChart();
    this.updateDrawdownChart();
    this.updateSignalConfidenceChart();
  }

  /**
   * Update win rate chart
   */
  private updateWinRateChart(): void {
    const chart = this.charts.get('win_rate');
    if (!chart) return;
    
    const now = new Date();
    chart.data.push({
      timestamp: now,
      value: this.metrics.trading.winRate
    });
    
    // Keep only last 7 days
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    chart.data = chart.data.filter(d => d.timestamp > cutoff);
    chart.lastUpdated = now;
  }

  /**
   * Update drawdown chart
   */
  private updateDrawdownChart(): void {
    const chart = this.charts.get('drawdown');
    if (!chart) return;
    
    const now = new Date();
    chart.data.push({
      timestamp: now,
      value: -this.metrics.portfolio.drawdown // Negative for drawdown
    });
    
    // Keep only last 30 days
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    chart.data = chart.data.filter(d => d.timestamp > cutoff);
    chart.lastUpdated = now;
  }

  /**
   * Update signal confidence chart
   */
  private updateSignalConfidenceChart(): void {
    const chart = this.charts.get('signal_confidence');
    if (!chart) return;
    
    // Create confidence distribution data
    const confidenceBuckets = {
      '0-20%': 0,
      '20-40%': 0,
      '40-60%': 0,
      '60-80%': 0,
      '80-100%': 0
    };
    
    // Count signals in each bucket (mock data)
    const signals = Array.from(this.signalPerformance.values());
    signals.forEach(signal => {
      const confidence = signal.confidence * 100;
      if (confidence < 20) confidenceBuckets['0-20%']++;
      else if (confidence < 40) confidenceBuckets['20-40%']++;
      else if (confidence < 60) confidenceBuckets['40-60%']++;
      else if (confidence < 80) confidenceBuckets['60-80%']++;
      else confidenceBuckets['80-100%']++;
    });
    
    chart.data = Object.entries(confidenceBuckets).map(([range, count]) => ({
      timestamp: new Date(),
      value: count
    }));
    
    chart.lastUpdated = new Date();
  }

  /**
   * Update portfolio metrics
   */
  updatePortfolioMetrics(snapshot: PortfolioSnapshot): void {
    this.metrics.portfolio = {
      totalValue: snapshot.totalValue,
      dailyPnL: snapshot.dailyPnL,
      dailyPnLPercent: (snapshot.dailyPnL / snapshot.totalValue) * 100,
      totalPnL: snapshot.totalPnL,
      totalPnLPercent: snapshot.totalPnLPercent,
      drawdown: snapshot.drawdown,
      maxDrawdown: snapshot.drawdown,
      positions: snapshot.positions,
      cash: snapshot.totalValue - snapshot.positions.reduce((sum, p) => sum + p.value, 0),
      marginUsed: snapshot.marginUsed || 0,
      marginAvailable: snapshot.marginAvailable || (snapshot.totalValue - snapshot.positions.reduce((sum, p) => sum + p.value, 0))
    };
    
    this.emit('portfolioUpdated', { portfolio: this.metrics.portfolio });
  }

  /**
   * Update trading metrics
   */
  updateTradingMetrics(trades: TradeResult[]): void {
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0);
    const losingTrades = trades.filter(t => (t.pnl || 0) < 0);
    
    const totalWin = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    
    this.metrics.trading = {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
      profitFactor: totalLoss > 0 ? totalWin / totalLoss : 0,
      sharpeRatio: this.calculateSharpeRatio(trades),
      averageWin: winningTrades.length > 0 ? totalWin / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl || 0)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl || 0)) : 0,
      averageHoldTime: this.calculateAverageHoldTime(trades),
      tradingFrequency: this.calculateTradingFrequency(trades)
    };
    
    this.emit('tradingMetricsUpdated', { trading: this.metrics.trading });
  }

  /**
   * Update signal metrics
   */
  updateSignalMetrics(signals: TradingSignal[]): void {
    const today = new Date().toDateString();
    const signalsToday = signals.filter(s => s.timestamp.toDateString() === today);
    
    const signalsByMarket: { [market: string]: number } = {};
    const signalsByType: { [type: string]: number } = {};
    
    signals.forEach(signal => {
      signalsByMarket[signal.market] = (signalsByMarket[signal.market] || 0) + 1;
      signalsByType[signal.signal] = (signalsByType[signal.signal] || 0) + 1;
    });
    
    const totalConfidence = signals.reduce((sum, s) => sum + s.confidence, 0);
    
    this.metrics.signals = {
      totalSignals: signals.length,
      signalsToday: signalsToday.length,
      averageConfidence: signals.length > 0 ? (totalConfidence / signals.length) * 100 : 0,
      signalsByMarket,
      signalsByType,
      topPerformingSignals: Array.from(this.signalPerformance.values())
        .sort((a, b) => b.pnlPercent - a.pnlPercent)
        .slice(0, 10)
    };
    
    this.emit('signalMetricsUpdated', { signals: this.metrics.signals });
  }

  /**
   * Update alert metrics
   */
  updateAlertMetrics(alertMetrics: AlertMetrics): void {
    this.metrics.alerts = alertMetrics;
    this.emit('alertMetricsUpdated', { alerts: this.metrics.alerts });
  }

  /**
   * Add signal performance tracking
   */
  trackSignalPerformance(signal: TradingSignal, currentPrice: number): void {
    const performance: SignalPerformance = {
      signalId: signal.id,
      symbol: signal.symbol,
      signal: signal.signal,
      confidence: signal.confidence,
      timestamp: signal.timestamp,
      entryPrice: signal.entryPrice,
      currentPrice,
      pnl: currentPrice - signal.entryPrice,
      pnlPercent: ((currentPrice - signal.entryPrice) / signal.entryPrice) * 100,
      status: 'OPEN'
    };
    
    this.signalPerformance.set(signal.id, performance);
    this.emit('signalPerformanceUpdated', { performance });
  }

  /**
   * Update market overview
   */
  updateMarketOverview(symbol: string, data: Partial<MarketOverview>): void {
    const existing = this.marketOverview.get(symbol);
    const updated: MarketOverview = {
      symbol,
      market: data.market || 'UNKNOWN',
      price: data.price || 0,
      change24h: data.change24h || 0,
      changePercent24h: data.changePercent24h || 0,
      volume24h: data.volume24h || 0,
      marketCap: data.marketCap,
      high24h: data.high24h || 0,
      low24h: data.low24h || 0,
      signals: data.signals || 0,
      sentiment: data.sentiment || 'NEUTRAL',
      technicalRating: data.technicalRating || 50,
      lastUpdated: new Date(),
      ...existing
    };
    
    this.marketOverview.set(symbol, updated);
    this.emit('marketOverviewUpdated', { symbol, data: updated });
  }

  /**
   * Add news item
   */
  addNews(newsItem: NewsItem): void {
    this.news.unshift(newsItem);
    
    // Keep only last 100 news items
    if (this.news.length > 100) {
      this.news = this.news.slice(0, 100);
    }
    
    this.emit('newsAdded', { newsItem });
  }

  /**
   * Add to watchlist
   */
  addToWatchlist(item: WatchlistItem): void {
    // Remove existing if present
    this.watchlist = this.watchlist.filter(w => w.symbol !== item.symbol);
    
    // Add new item
    this.watchlist.push(item);
    
    this.emit('watchlistUpdated', { watchlist: this.watchlist });
  }

  /**
   * Remove from watchlist
   */
  removeFromWatchlist(symbol: string): boolean {
    const initialLength = this.watchlist.length;
    this.watchlist = this.watchlist.filter(w => w.symbol !== symbol);
    
    const removed = this.watchlist.length < initialLength;
    if (removed) {
      this.emit('watchlistUpdated', { watchlist: this.watchlist });
    }
    
    return removed;
  }

  /**
   * Calculate Sharpe ratio
   */
  private calculateSharpeRatio(trades: TradeResult[]): number {
    if (trades.length < 2) return 0;
    
    const returns = trades.map(t => t.pnl || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  /**
   * Calculate average hold time
   */
  private calculateAverageHoldTime(trades: TradeResult[]): number {
    if (trades.length === 0) return 0;
    
    const holdTimes = trades
      .filter(t => t.exitTime)
      .map(t => t.exitTime!.getTime() - t.entryTime.getTime());
    
    if (holdTimes.length === 0) return 0;
    
    const avgMs = holdTimes.reduce((sum, time) => sum + time, 0) / holdTimes.length;
    return avgMs / (1000 * 60 * 60); // Convert to hours
  }

  /**
   * Calculate trading frequency
   */
  private calculateTradingFrequency(trades: TradeResult[]): number {
    if (trades.length === 0) return 0;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentTrades = trades.filter(t => t.entryTime > thirtyDaysAgo);
    return recentTrades.length / 30; // Trades per day
  }

  // Public API methods

  /**
   * Get current metrics
   */
  getMetrics(): DashboardMetrics {
    return { ...this.metrics };
  }

  /**
   * Get chart data
   */
  getChart(chartId: string): DashboardChart | undefined {
    return this.charts.get(chartId);
  }

  /**
   * Get all charts
   */
  getCharts(): DashboardChart[] {
    return Array.from(this.charts.values());
  }

  /**
   * Add chart
   */
  addChart(chart: DashboardChart): void {
    this.charts.set(chart.id, chart);
    this.emit('chartAdded', { chart });
  }

  /**
   * Remove chart
   */
  removeChart(chartId: string): boolean {
    const removed = this.charts.delete(chartId);
    if (removed) {
      this.emit('chartRemoved', { chartId });
    }
    return removed;
  }

  /**
   * Get dashboard layout
   */
  getLayout(layoutId: string): DashboardLayout | undefined {
    return this.layouts.get(layoutId);
  }

  /**
   * Get all layouts
   */
  getLayouts(): DashboardLayout[] {
    return Array.from(this.layouts.values());
  }

  /**
   * Add layout
   */
  addLayout(layout: DashboardLayout): void {
    this.layouts.set(layout.id, layout);
    this.emit('layoutAdded', { layout });
  }

  /**
   * Update layout
   */
  updateLayout(layoutId: string, updates: Partial<DashboardLayout>): boolean {
    const layout = this.layouts.get(layoutId);
    if (!layout) return false;
    
    Object.assign(layout, updates);
    layout.lastModified = new Date();
    
    this.emit('layoutUpdated', { layout });
    return true;
  }

  /**
   * Remove layout
   */
  removeLayout(layoutId: string): boolean {
    const layout = this.layouts.get(layoutId);
    if (!layout || layout.isDefault) return false;
    
    const removed = this.layouts.delete(layoutId);
    if (removed) {
      this.emit('layoutRemoved', { layoutId });
    }
    return removed;
  }

  /**
   * Get market overview
   */
  getMarketOverview(): MarketOverview[] {
    return Array.from(this.marketOverview.values())
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  /**
   * Get news
   */
  getNews(limit?: number): NewsItem[] {
    return limit ? this.news.slice(0, limit) : [...this.news];
  }

  /**
   * Get watchlist
   */
  getWatchlist(): WatchlistItem[] {
    return [...this.watchlist];
  }

  /**
   * Get signal performance
   */
  getSignalPerformance(): SignalPerformance[] {
    return Array.from(this.signalPerformance.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Export dashboard data
   */
  exportData() {
    return {
      metrics: this.metrics,
      charts: Array.from(this.charts.values()),
      layouts: Array.from(this.layouts.values()),
      marketOverview: Array.from(this.marketOverview.values()),
      news: this.news,
      watchlist: this.watchlist,
      signalPerformance: Array.from(this.signalPerformance.values()),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Get dashboard status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      uptime: this.metrics.system.uptime,
      lastUpdate: this.lastUpdateTime,
      chartsCount: this.charts.size,
      layoutsCount: this.layouts.size,
      watchlistCount: this.watchlist.length,
      newsCount: this.news.length,
      signalPerformanceCount: this.signalPerformance.size,
      systemHealth: this.metrics.system.systemHealth
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
    this.charts.clear();
    this.layouts.clear();
    this.marketOverview.clear();
    this.news = [];
    this.watchlist = [];
    this.signalPerformance.clear();
    this.removeAllListeners();
    console.log('Performance Dashboard destroyed');
  }
}