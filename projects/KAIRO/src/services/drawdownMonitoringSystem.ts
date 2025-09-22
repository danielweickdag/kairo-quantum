import { TradeEntry } from './tradeLoggingSystem';
import { ProfitFactorMetrics } from './profitFactorTrackingSystem';
import { AlertsNotificationSystem, AlertMessage } from './alertsNotificationSystem';

export interface DrawdownMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  maxDrawdownDate: Date;
  drawdownDuration: number; // in days
  recoveryTime: number; // in days
  peakValue: number;
  currentValue: number;
  drawdownSeries: DrawdownPoint[];
  underwaterCurve: number[];
  recoveryFactor: number;
  calmarRatio: number;
  sterlingRatio: number;
  burkeRatio: number;
  lastUpdated: Date;
}

export interface DrawdownPoint {
  timestamp: Date;
  value: number;
  drawdown: number;
  isNewPeak: boolean;
  isRecovery: boolean;
}

export interface RiskLimits {
  maxDrawdownPercent: number;
  maxDailyLoss: number;
  maxWeeklyLoss: number;
  maxMonthlyLoss: number;
  maxConsecutiveLosses: number;
  maxPositionSize: number;
  maxLeverage: number;
  stopTradingThreshold: number;
  emergencyStopThreshold: number;
}

export interface RiskEvent {
  id: string;
  userId: string;
  type: 'DRAWDOWN_WARNING' | 'DRAWDOWN_CRITICAL' | 'DAILY_LOSS_LIMIT' | 'WEEKLY_LOSS_LIMIT' | 'MONTHLY_LOSS_LIMIT' | 'CONSECUTIVE_LOSSES' | 'POSITION_SIZE_LIMIT' | 'EMERGENCY_STOP';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  currentValue: number;
  threshold: number;
  timestamp: Date;
  actionTaken: string;
  acknowledged: boolean;
}

export interface PositionRisk {
  symbol: string;
  currentSize: number;
  maxAllowedSize: number;
  riskPercentage: number;
  correlationRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
  volatilityRisk: number;
}

export interface PortfolioRisk {
  totalExposure: number;
  netExposure: number;
  grossExposure: number;
  leverage: number;
  var95: number; // Value at Risk 95%
  var99: number; // Value at Risk 99%
  expectedShortfall: number;
  correlationMatrix: Record<string, Record<string, number>>;
  concentrationByMarket: Record<string, number>;
  concentrationBySymbol: Record<string, number>;
  liquidityScore: number;
  stressTestResults: StressTestResult[];
}

export interface StressTestResult {
  scenario: string;
  description: string;
  portfolioImpact: number;
  worstCaseDrawdown: number;
  recoveryTime: number;
  probability: number;
}

export interface RiskControlAction {
  type: 'REDUCE_POSITION' | 'CLOSE_POSITION' | 'STOP_TRADING' | 'EMERGENCY_STOP' | 'ALERT_ONLY';
  symbol?: string;
  reductionPercentage?: number;
  reason: string;
  timestamp: Date;
  executed: boolean;
}

export class DrawdownMonitoringSystem {
  private userDrawdownMetrics: Map<string, DrawdownMetrics> = new Map();
  private userRiskLimits: Map<string, RiskLimits> = new Map();
  private riskEvents: Map<string, RiskEvent[]> = new Map();
  private positionRisks: Map<string, Map<string, PositionRisk>> = new Map();
  private portfolioRisks: Map<string, PortfolioRisk> = new Map();
  private riskControlActions: Map<string, RiskControlAction[]> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private tradingHalted: Set<string> = new Set();

  constructor(
    private alertsSystem: AlertsNotificationSystem,
    private defaultRiskLimits: RiskLimits = {
      maxDrawdownPercent: 5.0,
      maxDailyLoss: 2.0,
      maxWeeklyLoss: 5.0,
      maxMonthlyLoss: 10.0,
      maxConsecutiveLosses: 5,
      maxPositionSize: 10.0,
      maxLeverage: 3.0,
      stopTradingThreshold: 4.0,
      emergencyStopThreshold: 8.0
    }
  ) {
    this.startMonitoring();
  }

  /**
   * Start continuous monitoring
   */
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.updateAllDrawdownMetrics();
      this.checkRiskLimits();
      this.updatePortfolioRisks();
      this.executeRiskControls();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Update drawdown metrics for a user
   */
  updateDrawdownMetrics(userId: string, trades: TradeEntry[]): void {
    const closedTrades = trades
      .filter(trade => trade.status === 'CLOSED' && trade.exitTime && trade.pnl !== undefined)
      .sort((a, b) => a.exitTime!.getTime() - b.exitTime!.getTime());

    if (closedTrades.length === 0) {
      return;
    }

    const drawdownMetrics = this.calculateDrawdownMetrics(closedTrades);
    this.userDrawdownMetrics.set(userId, drawdownMetrics);

    // Check for risk events
    this.checkDrawdownRiskEvents(userId, drawdownMetrics);
  }

  /**
   * Calculate comprehensive drawdown metrics
   */
  private calculateDrawdownMetrics(trades: TradeEntry[]): DrawdownMetrics {
    let runningBalance = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownDate = new Date();
    let currentDrawdown = 0;
    let drawdownStart: Date | null = null;
    let drawdownDuration = 0;
    let recoveryTime = 0;
    let lastRecoveryDate: Date | null = null;

    const drawdownSeries: DrawdownPoint[] = [];
    const underwaterCurve: number[] = [];
    const balanceSeries: number[] = [];

    for (const trade of trades) {
      runningBalance += trade.pnl!;
      balanceSeries.push(runningBalance);
      
      let isNewPeak = false;
      let isRecovery = false;

      if (runningBalance > peak) {
        peak = runningBalance;
        isNewPeak = true;
        
        if (drawdownStart && currentDrawdown > 0) {
          // Recovery completed
          isRecovery = true;
          recoveryTime = this.calculateDaysBetween(drawdownStart, trade.exitTime!);
          lastRecoveryDate = trade.exitTime!;
          drawdownStart = null;
        }
        
        currentDrawdown = 0;
      } else {
        currentDrawdown = peak > 0 ? ((peak - runningBalance) / peak) * 100 : 0;
        
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
          maxDrawdownDate = trade.exitTime!;
        }
        
        if (!drawdownStart && currentDrawdown > 0) {
          drawdownStart = trade.exitTime!;
        }
      }

      drawdownSeries.push({
        timestamp: trade.exitTime!,
        value: runningBalance,
        drawdown: currentDrawdown,
        isNewPeak,
        isRecovery
      });

      underwaterCurve.push(currentDrawdown);
    }

    // Calculate current drawdown duration
    if (drawdownStart) {
      drawdownDuration = this.calculateDaysBetween(drawdownStart, new Date());
    }

    // Calculate recovery factor
    const totalReturn = runningBalance;
    const recoveryFactor = maxDrawdown > 0 ? totalReturn / (maxDrawdown / 100) : 0;

    // Calculate Calmar Ratio (annualized return / max drawdown)
    const tradingDays = this.calculateDaysBetween(trades[0].exitTime!, trades[trades.length - 1].exitTime!);
    const annualizedReturn = tradingDays > 0 ? (totalReturn / tradingDays) * 252 : 0;
    const calmarRatio = maxDrawdown > 0 ? annualizedReturn / (maxDrawdown / 100) : 0;

    // Calculate Sterling Ratio (similar to Calmar but uses average drawdown)
    const averageDrawdown = underwaterCurve.reduce((sum, dd) => sum + dd, 0) / underwaterCurve.length;
    const sterlingRatio = averageDrawdown > 0 ? annualizedReturn / (averageDrawdown / 100) : 0;

    // Calculate Burke Ratio (return / sqrt(sum of squared drawdowns))
    const sumSquaredDrawdowns = underwaterCurve.reduce((sum, dd) => sum + Math.pow(dd / 100, 2), 0);
    const burkeRatio = sumSquaredDrawdowns > 0 ? annualizedReturn / Math.sqrt(sumSquaredDrawdowns) : 0;

    return {
      currentDrawdown,
      maxDrawdown,
      maxDrawdownDate,
      drawdownDuration,
      recoveryTime,
      peakValue: peak,
      currentValue: runningBalance,
      drawdownSeries,
      underwaterCurve,
      recoveryFactor,
      calmarRatio,
      sterlingRatio,
      burkeRatio,
      lastUpdated: new Date()
    };
  }

  /**
   * Calculate days between two dates
   */
  private calculateDaysBetween(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Check for drawdown-related risk events
   */
  private checkDrawdownRiskEvents(userId: string, metrics: DrawdownMetrics): void {
    const riskLimits = this.userRiskLimits.get(userId) || this.defaultRiskLimits;
    const events: RiskEvent[] = [];

    // Check current drawdown against limits
    if (metrics.currentDrawdown >= riskLimits.emergencyStopThreshold) {
      events.push({
        id: `emergency_${userId}_${Date.now()}`,
        userId,
        type: 'EMERGENCY_STOP',
        severity: 'CRITICAL',
        message: `EMERGENCY STOP: Drawdown (${metrics.currentDrawdown.toFixed(2)}%) exceeded emergency threshold (${riskLimits.emergencyStopThreshold}%)`,
        currentValue: metrics.currentDrawdown,
        threshold: riskLimits.emergencyStopThreshold,
        timestamp: new Date(),
        actionTaken: 'EMERGENCY_STOP_INITIATED',
        acknowledged: false
      });
      
      this.initiateEmergencyStop(userId);
    } else if (metrics.currentDrawdown >= riskLimits.stopTradingThreshold) {
      events.push({
        id: `stop_${userId}_${Date.now()}`,
        userId,
        type: 'DRAWDOWN_CRITICAL',
        severity: 'CRITICAL',
        message: `CRITICAL: Drawdown (${metrics.currentDrawdown.toFixed(2)}%) exceeded stop trading threshold (${riskLimits.stopTradingThreshold}%)`,
        currentValue: metrics.currentDrawdown,
        threshold: riskLimits.stopTradingThreshold,
        timestamp: new Date(),
        actionTaken: 'TRADING_HALTED',
        acknowledged: false
      });
      
      this.haltTrading(userId);
    } else if (metrics.currentDrawdown >= riskLimits.maxDrawdownPercent * 0.8) {
      events.push({
        id: `warning_${userId}_${Date.now()}`,
        userId,
        type: 'DRAWDOWN_WARNING',
        severity: 'HIGH',
        message: `WARNING: Drawdown (${metrics.currentDrawdown.toFixed(2)}%) approaching limit (${riskLimits.maxDrawdownPercent}%)`,
        currentValue: metrics.currentDrawdown,
        threshold: riskLimits.maxDrawdownPercent,
        timestamp: new Date(),
        actionTaken: 'ALERT_SENT',
        acknowledged: false
      });
    }

    if (events.length > 0) {
      const existingEvents = this.riskEvents.get(userId) || [];
      this.riskEvents.set(userId, [...existingEvents, ...events]);
      
      // Send alerts
      this.sendRiskAlerts(userId, events);
    }
  }

  /**
   * Update position risks for a user
   */
  updatePositionRisk(userId: string, symbol: string, positionSize: number, marketValue: number): void {
    const riskLimits = this.userRiskLimits.get(userId) || this.defaultRiskLimits;
    const userPositions = this.positionRisks.get(userId) || new Map();
    
    const riskPercentage = marketValue > 0 ? (Math.abs(positionSize * marketValue) / this.getTotalPortfolioValue(userId)) * 100 : 0;
    
    const positionRisk: PositionRisk = {
      symbol,
      currentSize: positionSize,
      maxAllowedSize: riskLimits.maxPositionSize,
      riskPercentage,
      correlationRisk: this.calculateCorrelationRisk(userId, symbol),
      concentrationRisk: this.calculateConcentrationRisk(userId, symbol),
      liquidityRisk: this.calculateLiquidityRisk(symbol),
      volatilityRisk: this.calculateVolatilityRisk(symbol)
    };
    
    userPositions.set(symbol, positionRisk);
    this.positionRisks.set(userId, userPositions);
    
    // Check position size limits
    this.checkPositionRiskLimits(userId, positionRisk);
  }

  /**
   * Calculate correlation risk
   */
  private calculateCorrelationRisk(userId: string, symbol: string): number {
    // Simplified correlation risk calculation
    // In a real implementation, this would use historical correlation data
    const userPositions = this.positionRisks.get(userId);
    if (!userPositions || userPositions.size <= 1) return 0;
    
    // Assume higher correlation for same market instruments
    const market = this.getMarketFromSymbol(symbol);
    let correlatedExposure = 0;
    
    Array.from(userPositions.entries()).forEach(([otherSymbol, position]) => {
      if (otherSymbol !== symbol && this.getMarketFromSymbol(otherSymbol) === market) {
        correlatedExposure += position.riskPercentage;
      }
    });
    
    return Math.min(correlatedExposure, 100);
  }

  /**
   * Calculate concentration risk
   */
  private calculateConcentrationRisk(userId: string, symbol: string): number {
    const userPositions = this.positionRisks.get(userId);
    if (!userPositions) return 0;
    
    const position = userPositions.get(symbol);
    if (!position) return 0;
    
    // Concentration risk increases exponentially with position size
    return Math.pow(position.riskPercentage / 10, 2);
  }

  /**
   * Calculate liquidity risk (simplified)
   */
  private calculateLiquidityRisk(symbol: string): number {
    // Simplified liquidity scoring
    // Major pairs/stocks = low risk, exotic pairs = high risk
    const majorSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AAPL', 'GOOGL', 'MSFT', 'BTCUSD', 'ETHUSD'];
    return majorSymbols.includes(symbol) ? 1 : 5;
  }

  /**
   * Calculate volatility risk (simplified)
   */
  private calculateVolatilityRisk(symbol: string): number {
    // Simplified volatility scoring
    // This would typically use historical volatility data
    const highVolSymbols = ['BTCUSD', 'ETHUSD', 'XAUUSD'];
    return highVolSymbols.includes(symbol) ? 8 : 3;
  }

  /**
   * Get market from symbol
   */
  private getMarketFromSymbol(symbol: string): string {
    if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) return 'FOREX';
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 'CRYPTO';
    return 'STOCKS';
  }

  /**
   * Get total portfolio value for a user
   */
  private getTotalPortfolioValue(userId: string): number {
    // This would typically come from a portfolio service
    // For now, return a default value
    return 100000; // $100,000 default
  }

  /**
   * Check position risk limits
   */
  private checkPositionRiskLimits(userId: string, positionRisk: PositionRisk): void {
    const riskLimits = this.userRiskLimits.get(userId) || this.defaultRiskLimits;
    
    if (positionRisk.riskPercentage > riskLimits.maxPositionSize) {
      const event: RiskEvent = {
        id: `position_${userId}_${positionRisk.symbol}_${Date.now()}`,
        userId,
        type: 'POSITION_SIZE_LIMIT',
        severity: 'HIGH',
        message: `Position size for ${positionRisk.symbol} (${positionRisk.riskPercentage.toFixed(2)}%) exceeds limit (${riskLimits.maxPositionSize}%)`,
        currentValue: positionRisk.riskPercentage,
        threshold: riskLimits.maxPositionSize,
        timestamp: new Date(),
        actionTaken: 'POSITION_REDUCTION_RECOMMENDED',
        acknowledged: false
      };
      
      const existingEvents = this.riskEvents.get(userId) || [];
      this.riskEvents.set(userId, [...existingEvents, event]);
      
      this.sendRiskAlerts(userId, [event]);
    }
  }

  /**
   * Update all drawdown metrics
   */
  private updateAllDrawdownMetrics(): void {
    // This would typically get trade data from the trade logging system
    // For now, we'll just update existing metrics timestamps
    Array.from(this.userDrawdownMetrics.entries()).forEach(([userId, metrics]) => {
      metrics.lastUpdated = new Date();
    });
  }

  /**
   * Check all risk limits
   */
  private checkRiskLimits(): void {
    Array.from(this.userDrawdownMetrics.keys()).forEach(userId => {
      this.checkDailyLossLimits(userId);
      this.checkWeeklyLossLimits(userId);
      this.checkMonthlyLossLimits(userId);
    });
  }

  /**
   * Check daily loss limits
   */
  private checkDailyLossLimits(userId: string): void {
    const riskLimits = this.userRiskLimits.get(userId) || this.defaultRiskLimits;
    const dailyLoss = this.calculateDailyLoss(userId);
    
    if (Math.abs(dailyLoss) > riskLimits.maxDailyLoss) {
      const event: RiskEvent = {
        id: `daily_${userId}_${Date.now()}`,
        userId,
        type: 'DAILY_LOSS_LIMIT',
        severity: 'HIGH',
        message: `Daily loss (${Math.abs(dailyLoss).toFixed(2)}%) exceeded limit (${riskLimits.maxDailyLoss}%)`,
        currentValue: Math.abs(dailyLoss),
        threshold: riskLimits.maxDailyLoss,
        timestamp: new Date(),
        actionTaken: 'TRADING_RESTRICTED',
        acknowledged: false
      };
      
      const existingEvents = this.riskEvents.get(userId) || [];
      this.riskEvents.set(userId, [...existingEvents, event]);
      
      this.sendRiskAlerts(userId, [event]);
    }
  }

  /**
   * Check weekly loss limits
   */
  private checkWeeklyLossLimits(userId: string): void {
    const riskLimits = this.userRiskLimits.get(userId) || this.defaultRiskLimits;
    const weeklyLoss = this.calculateWeeklyLoss(userId);
    
    if (Math.abs(weeklyLoss) > riskLimits.maxWeeklyLoss) {
      const event: RiskEvent = {
        id: `weekly_${userId}_${Date.now()}`,
        userId,
        type: 'WEEKLY_LOSS_LIMIT',
        severity: 'HIGH',
        message: `Weekly loss (${Math.abs(weeklyLoss).toFixed(2)}%) exceeded limit (${riskLimits.maxWeeklyLoss}%)`,
        currentValue: Math.abs(weeklyLoss),
        threshold: riskLimits.maxWeeklyLoss,
        timestamp: new Date(),
        actionTaken: 'TRADING_RESTRICTED',
        acknowledged: false
      };
      
      const existingEvents = this.riskEvents.get(userId) || [];
      this.riskEvents.set(userId, [...existingEvents, event]);
      
      this.sendRiskAlerts(userId, [event]);
    }
  }

  /**
   * Check monthly loss limits
   */
  private checkMonthlyLossLimits(userId: string): void {
    const riskLimits = this.userRiskLimits.get(userId) || this.defaultRiskLimits;
    const monthlyLoss = this.calculateMonthlyLoss(userId);
    
    if (Math.abs(monthlyLoss) > riskLimits.maxMonthlyLoss) {
      const event: RiskEvent = {
        id: `monthly_${userId}_${Date.now()}`,
        userId,
        type: 'MONTHLY_LOSS_LIMIT',
        severity: 'CRITICAL',
        message: `Monthly loss (${Math.abs(monthlyLoss).toFixed(2)}%) exceeded limit (${riskLimits.maxMonthlyLoss}%)`,
        currentValue: Math.abs(monthlyLoss),
        threshold: riskLimits.maxMonthlyLoss,
        timestamp: new Date(),
        actionTaken: 'TRADING_SUSPENDED',
        acknowledged: false
      };
      
      const existingEvents = this.riskEvents.get(userId) || [];
      this.riskEvents.set(userId, [...existingEvents, event]);
      
      this.sendRiskAlerts(userId, [event]);
      this.haltTrading(userId);
    }
  }

  /**
   * Calculate daily loss percentage
   */
  private calculateDailyLoss(userId: string): number {
    // This would calculate actual daily P&L from trades
    // For now, return 0 as placeholder
    return 0;
  }

  /**
   * Calculate weekly loss percentage
   */
  private calculateWeeklyLoss(userId: string): number {
    // This would calculate actual weekly P&L from trades
    // For now, return 0 as placeholder
    return 0;
  }

  /**
   * Calculate monthly loss percentage
   */
  private calculateMonthlyLoss(userId: string): number {
    // This would calculate actual monthly P&L from trades
    // For now, return 0 as placeholder
    return 0;
  }

  /**
   * Update portfolio risks
   */
  private updatePortfolioRisks(): void {
    Array.from(this.positionRisks.keys()).forEach(userId => {
      this.calculatePortfolioRisk(userId);
    });
  }

  /**
   * Calculate comprehensive portfolio risk
   */
  private calculatePortfolioRisk(userId: string): void {
    const userPositions = this.positionRisks.get(userId);
    if (!userPositions || userPositions.size === 0) return;
    
    const positions = Array.from(userPositions.values());
    const totalExposure = positions.reduce((sum, pos) => sum + Math.abs(pos.currentSize), 0);
    const netExposure = positions.reduce((sum, pos) => sum + pos.currentSize, 0);
    const grossExposure = positions.reduce((sum, pos) => sum + Math.abs(pos.currentSize), 0);
    
    const portfolioValue = this.getTotalPortfolioValue(userId);
    const leverage = portfolioValue > 0 ? grossExposure / portfolioValue : 0;
    
    // Calculate VaR (simplified)
    const valueAtRisk95 = this.calculateVaR(positions, 0.95);
    const valueAtRisk99 = this.calculateVaR(positions, 0.99);
    const expectedShortfall = this.calculateExpectedShortfall(positions, 0.95);
    
    // Calculate concentration metrics
    const concentrationByMarket = this.calculateMarketConcentration(positions);
    const concentrationBySymbol = this.calculateSymbolConcentration(positions);
    
    // Calculate liquidity score
    const liquidityScore = this.calculatePortfolioLiquidityScore(positions);
    
    // Run stress tests
    const stressTestResults = this.runStressTests(positions);
    
    const portfolioRisk: PortfolioRisk = {
      totalExposure,
      netExposure,
      grossExposure,
      leverage,
      var95: valueAtRisk95,
      var99: valueAtRisk99,
      expectedShortfall,
      correlationMatrix: this.calculateCorrelationMatrix(positions),
      concentrationByMarket,
      concentrationBySymbol,
      liquidityScore,
      stressTestResults
    };
    
    this.portfolioRisks.set(userId, portfolioRisk);
  }

  /**
   * Calculate Value at Risk (simplified)
   */
  private calculateVaR(positions: PositionRisk[], confidence: number): number {
    // Simplified VaR calculation
    // In practice, this would use historical simulation or Monte Carlo
    const totalRisk = positions.reduce((sum, pos) => sum + pos.riskPercentage, 0);
    const confidenceMultiplier = confidence === 0.95 ? 1.645 : 2.326; // Z-scores
    return totalRisk * confidenceMultiplier * 0.01; // Convert to decimal
  }

  /**
   * Calculate Expected Shortfall (Conditional VaR)
   */
  private calculateExpectedShortfall(positions: PositionRisk[], confidence: number): number {
    const valueAtRisk = this.calculateVaR(positions, confidence);
    return valueAtRisk * 1.2; // Simplified: ES is typically 20% higher than VaR
  }

  /**
   * Calculate market concentration
   */
  private calculateMarketConcentration(positions: PositionRisk[]): Record<string, number> {
    const concentration: Record<string, number> = {};
    
    for (const position of positions) {
      const market = this.getMarketFromSymbol(position.symbol);
      concentration[market] = (concentration[market] || 0) + position.riskPercentage;
    }
    
    return concentration;
  }

  /**
   * Calculate symbol concentration
   */
  private calculateSymbolConcentration(positions: PositionRisk[]): Record<string, number> {
    const concentration: Record<string, number> = {};
    
    for (const position of positions) {
      concentration[position.symbol] = position.riskPercentage;
    }
    
    return concentration;
  }

  /**
   * Calculate portfolio liquidity score
   */
  private calculatePortfolioLiquidityScore(positions: PositionRisk[]): number {
    if (positions.length === 0) return 10;
    
    const avgLiquidityRisk = positions.reduce((sum, pos) => sum + pos.liquidityRisk, 0) / positions.length;
    return Math.max(1, 10 - avgLiquidityRisk);
  }

  /**
   * Calculate correlation matrix (simplified)
   */
  private calculateCorrelationMatrix(positions: PositionRisk[]): Record<string, Record<string, number>> {
    const matrix: Record<string, Record<string, number>> = {};
    
    for (const pos1 of positions) {
      matrix[pos1.symbol] = {};
      for (const pos2 of positions) {
        if (pos1.symbol === pos2.symbol) {
          matrix[pos1.symbol][pos2.symbol] = 1.0;
        } else {
          // Simplified correlation based on market
          const market1 = this.getMarketFromSymbol(pos1.symbol);
          const market2 = this.getMarketFromSymbol(pos2.symbol);
          matrix[pos1.symbol][pos2.symbol] = market1 === market2 ? 0.7 : 0.3;
        }
      }
    }
    
    return matrix;
  }

  /**
   * Run stress tests
   */
  private runStressTests(positions: PositionRisk[]): StressTestResult[] {
    const results: StressTestResult[] = [];
    
    // Market crash scenario
    results.push({
      scenario: 'MARKET_CRASH',
      description: '30% market decline across all assets',
      portfolioImpact: -30,
      worstCaseDrawdown: 35,
      recoveryTime: 180,
      probability: 0.05
    });
    
    // High volatility scenario
    results.push({
      scenario: 'HIGH_VOLATILITY',
      description: 'Volatility spike to 2x normal levels',
      portfolioImpact: -15,
      worstCaseDrawdown: 20,
      recoveryTime: 90,
      probability: 0.15
    });
    
    // Liquidity crisis
    results.push({
      scenario: 'LIQUIDITY_CRISIS',
      description: 'Severe liquidity constraints',
      portfolioImpact: -25,
      worstCaseDrawdown: 30,
      recoveryTime: 120,
      probability: 0.08
    });
    
    return results;
  }

  /**
   * Execute risk control actions
   */
  private executeRiskControls(): void {
    Array.from(this.riskEvents.keys()).forEach(userId => {
      const events = this.riskEvents.get(userId) || [];
      const unacknowledgedEvents = events.filter(e => !e.acknowledged);
      
      for (const event of unacknowledgedEvents) {
        this.executeRiskControlAction(userId, event);
      }
    });
  }

  /**
   * Execute specific risk control action
   */
  private executeRiskControlAction(userId: string, event: RiskEvent): void {
    const actions: RiskControlAction[] = [];
    
    switch (event.type) {
      case 'EMERGENCY_STOP':
        actions.push({
          type: 'EMERGENCY_STOP',
          reason: 'Emergency drawdown threshold exceeded',
          timestamp: new Date(),
          executed: false
        });
        break;
        
      case 'DRAWDOWN_CRITICAL':
        actions.push({
          type: 'STOP_TRADING',
          reason: 'Critical drawdown threshold exceeded',
          timestamp: new Date(),
          executed: false
        });
        break;
        
      case 'POSITION_SIZE_LIMIT':
        const symbolMatch = event.message.match(/for (\w+)/);
        if (symbolMatch) {
          actions.push({
            type: 'REDUCE_POSITION',
            symbol: symbolMatch[1],
            reductionPercentage: 50,
            reason: 'Position size limit exceeded',
            timestamp: new Date(),
            executed: false
          });
        }
        break;
        
      default:
        actions.push({
          type: 'ALERT_ONLY',
          reason: event.message,
          timestamp: new Date(),
          executed: true
        });
    }
    
    const existingActions = this.riskControlActions.get(userId) || [];
    this.riskControlActions.set(userId, [...existingActions, ...actions]);
  }

  /**
   * Send risk alerts
   */
  private async sendRiskAlerts(userId: string, events: RiskEvent[]): Promise<void> {
    for (const event of events) {
      let riskType: 'HIGH_DRAWDOWN' | 'POSITION_SIZE' | 'MARKET_VOLATILITY' | 'STOP_LOSS_HIT';
      
      switch (event.type) {
        case 'DRAWDOWN_WARNING':
        case 'DRAWDOWN_CRITICAL':
        case 'EMERGENCY_STOP':
          riskType = 'HIGH_DRAWDOWN';
          break;
        case 'POSITION_SIZE_LIMIT':
          riskType = 'POSITION_SIZE';
          break;
        default:
          riskType = 'MARKET_VOLATILITY';
      }
      
      const details = {
        currentValue: event.currentValue,
        threshold: event.threshold,
        actionTaken: event.actionTaken,
        severity: event.severity,
        eventId: event.id
      };
      
      await this.alertsSystem.sendRiskWarning(userId, riskType, details);
    }
  }

  /**
   * Halt trading for a user
   */
  private haltTrading(userId: string): void {
    this.tradingHalted.add(userId);
    console.log(`Trading halted for user ${userId}`);
  }

  /**
   * Initiate emergency stop
   */
  private initiateEmergencyStop(userId: string): void {
    this.tradingHalted.add(userId);
    // In a real system, this would close all positions immediately
    console.log(`EMERGENCY STOP initiated for user ${userId}`);
  }

  /**
   * Resume trading for a user
   */
  resumeTrading(userId: string): void {
    this.tradingHalted.delete(userId);
    console.log(`Trading resumed for user ${userId}`);
  }

  /**
   * Check if trading is halted for a user
   */
  isTradingHalted(userId: string): boolean {
    return this.tradingHalted.has(userId);
  }

  /**
   * Set risk limits for a user
   */
  setRiskLimits(userId: string, limits: RiskLimits): void {
    this.userRiskLimits.set(userId, limits);
    console.log(`Risk limits updated for user ${userId}`);
  }

  /**
   * Get drawdown metrics for a user
   */
  getDrawdownMetrics(userId: string): DrawdownMetrics | null {
    return this.userDrawdownMetrics.get(userId) || null;
  }

  /**
   * Get risk events for a user
   */
  getRiskEvents(userId: string): RiskEvent[] {
    return this.riskEvents.get(userId) || [];
  }

  /**
   * Get portfolio risk for a user
   */
  getPortfolioRisk(userId: string): PortfolioRisk | null {
    return this.portfolioRisks.get(userId) || null;
  }

  /**
   * Get risk control actions for a user
   */
  getRiskControlActions(userId: string): RiskControlAction[] {
    return this.riskControlActions.get(userId) || [];
  }

  /**
   * Acknowledge risk event
   */
  acknowledgeRiskEvent(userId: string, eventId: string): void {
    const events = this.riskEvents.get(userId) || [];
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.acknowledged = true;
      console.log(`Risk event ${eventId} acknowledged for user ${userId}`);
    }
  }

  /**
   * Get system-wide risk statistics
   */
  getSystemRiskStats(): {
    totalUsersMonitored: number;
    usersWithActiveAlerts: number;
    usersWithTradingHalted: number;
    averageDrawdown: number;
    highestDrawdown: number;
    totalRiskEvents: number;
  } {
    const totalUsersMonitored = this.userDrawdownMetrics.size;
    const usersWithActiveAlerts = Array.from(this.riskEvents.values())
      .filter(events => events.some(e => !e.acknowledged)).length;
    const usersWithTradingHalted = this.tradingHalted.size;
    
    const allMetrics = Array.from(this.userDrawdownMetrics.values());
    const averageDrawdown = allMetrics.length > 0 ? 
      allMetrics.reduce((sum, m) => sum + m.currentDrawdown, 0) / allMetrics.length : 0;
    const highestDrawdown = allMetrics.length > 0 ? 
      Math.max(...allMetrics.map(m => m.currentDrawdown)) : 0;
    
    const totalRiskEvents = Array.from(this.riskEvents.values())
      .reduce((sum, events) => sum + events.length, 0);
    
    return {
      totalUsersMonitored,
      usersWithActiveAlerts,
      usersWithTradingHalted,
      averageDrawdown,
      highestDrawdown,
      totalRiskEvents
    };
  }

  /**
   * Stop the monitoring system
   */
  stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Drawdown monitoring system stopped');
  }
}

export default DrawdownMonitoringSystem;