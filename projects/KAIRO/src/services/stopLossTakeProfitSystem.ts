import { TradingSignal, MarketData } from './multiMarketTradingEngine';
import { TechnicalIndicators } from './technicalAnalysis';

export interface SLTPLevels {
  stopLoss: {
    price: number;
    percentage: number;
    type: 'FIXED' | 'ATR' | 'SUPPORT_RESISTANCE' | 'TRAILING';
    reason: string;
  };
  takeProfit: {
    price: number;
    percentage: number;
    type: 'FIXED' | 'FIBONACCI' | 'RESISTANCE' | 'RISK_REWARD';
    reason: string;
    targets: TakeProfitTarget[];
  };
  riskRewardRatio: number;
  positionSize: number;
  maxRisk: number; // in currency units
  maxRiskPercentage: number; // percentage of account
}

export interface TakeProfitTarget {
  level: number;
  price: number;
  percentage: number;
  quantity: number; // percentage of position to close
  type: 'PARTIAL' | 'FULL';
  reason: string;
}

export interface RiskParameters {
  maxRiskPerTrade: number; // percentage of account
  minRiskRewardRatio: number;
  maxPositionSize: number; // percentage of account
  useTrailingStop: boolean;
  trailingStopDistance: number; // in ATR multiples
  partialTakeProfits: boolean;
  fibonacciLevels: number[]; // [0.382, 0.618, 1.0, 1.618]
  atrMultiplier: {
    stopLoss: number;
    takeProfit: number;
  };
  autoOptimization: {
    enabled: boolean;
    targetWinRate: number;
    adaptiveRiskReward: boolean;
    marketVolatilityAdjustment: boolean;
    timeOfDayAdjustment: boolean;
  };
  dynamicSizing: {
    enabled: boolean;
    volatilityFactor: number;
    confidenceMultiplier: number;
    drawdownReduction: boolean;
  };
}

export interface ChartLevel {
  id: string;
  type: 'STOP_LOSS' | 'TAKE_PROFIT' | 'SUPPORT' | 'RESISTANCE' | 'ENTRY';
  price: number;
  symbol: string;
  market: string;
  strength: number; // 1-10 scale
  timeframe: string;
  color: string;
  style: 'SOLID' | 'DASHED' | 'DOTTED';
  label: string;
  active: boolean;
  createdAt: Date;
  lastTested?: Date;
  testCount: number;
}

export interface TrailingStopData {
  tradeId: string;
  symbol: string;
  initialStopLoss: number;
  currentStopLoss: number;
  highestPrice: number; // for long positions
  lowestPrice: number; // for short positions
  trailingDistance: number;
  lastUpdate: Date;
  triggered: boolean;
}

export class StopLossTakeProfitSystem {
  private chartLevels: Map<string, ChartLevel[]> = new Map();
  private trailingStops: Map<string, TrailingStopData> = new Map();
  private supportResistanceLevels: Map<string, number[]> = new Map();
  private fibonacciLevels: number[] = [0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.272, 1.618, 2.618];
  private performanceHistory: Map<string, { winRate: number; avgRR: number; trades: number }> = new Map();
  private volatilityCache: Map<string, { atr: number; timestamp: number }> = new Map();
  private optimizationMetrics: {
    totalTrades: number;
    winningTrades: number;
    avgRiskReward: number;
    lastOptimization: Date;
  } = {
    totalTrades: 0,
    winningTrades: 0,
    avgRiskReward: 0,
    lastOptimization: new Date()
  };

  constructor(private defaultRiskParams: RiskParameters) {
    this.initializeSystem();
  }

  /**
   * Initialize the SL/TP system
   */
  private initializeSystem(): void {
    console.log('Stop Loss / Take Profit system initialized');
  }

  /**
   * Calculate optimal SL/TP levels for a trading signal with automatic optimization
   */
  calculateSLTPLevels(
    signal: TradingSignal,
    marketData: MarketData,
    technicalIndicators: TechnicalIndicators,
    accountBalance: number,
    riskParams?: Partial<RiskParameters>
  ): SLTPLevels {
    // Apply automatic optimization if enabled
    const optimizedParams = this.applyAutoOptimization(signal, { ...this.defaultRiskParams, ...riskParams });
    
    // Get or calculate market volatility
    const volatility = this.getMarketVolatility(signal.symbol, marketData);
    
    // Apply dynamic adjustments based on market conditions
    const adjustedParams = this.applyDynamicAdjustments(optimizedParams, signal, volatility);
    const params = adjustedParams;
    const currentPrice = signal.entryPrice;
    const isLong = signal.signal === 'BUY';
    
    // Calculate ATR for dynamic levels
    const atr = this.calculateATR(marketData.ohlcv);
    
    // Calculate support/resistance levels
    const supportResistance = this.calculateSupportResistance(marketData.ohlcv);
    
    // Calculate stop loss
    const stopLoss = this.calculateStopLoss(
      signal,
      currentPrice,
      atr,
      supportResistance,
      params,
      isLong
    );
    
    // Calculate position size based on risk
    const positionSize = this.calculatePositionSize(
      currentPrice,
      stopLoss.price,
      accountBalance,
      params.maxRiskPerTrade
    );
    
    // Calculate take profit levels
    const takeProfit = this.calculateTakeProfit(
      signal,
      currentPrice,
      stopLoss.price,
      atr,
      supportResistance,
      params,
      isLong
    );
    
    // Calculate risk/reward ratio
    const riskRewardRatio = this.calculateRiskRewardRatio(
      currentPrice,
      stopLoss.price,
      takeProfit.price,
      isLong
    );
    
    // Calculate maximum risk
    const maxRisk = Math.abs(currentPrice - stopLoss.price) * positionSize;
    const maxRiskPercentage = (maxRisk / accountBalance) * 100;
    
    const levels: SLTPLevels = {
      stopLoss,
      takeProfit,
      riskRewardRatio,
      positionSize,
      maxRisk,
      maxRiskPercentage
    };
    
    // Create chart levels for visualization
    this.createChartLevels(signal.symbol, signal.market, levels);
    
    return levels;
  }

  /**
   * Calculate stop loss level
   */
  private calculateStopLoss(
    signal: TradingSignal,
    currentPrice: number,
    atr: number,
    supportResistance: { support: number[]; resistance: number[] },
    params: RiskParameters,
    isLong: boolean
  ): SLTPLevels['stopLoss'] {
    const atrStopDistance = atr * params.atrMultiplier.stopLoss;
    
    if (isLong) {
      // For long positions, stop loss below current price
      const atrStopPrice = currentPrice - atrStopDistance;
      
      // Find nearest support level
      const nearestSupport = this.findNearestLevel(
        supportResistance.support,
        currentPrice,
        'below'
      );
      
      let stopLossPrice: number;
      let type: SLTPLevels['stopLoss']['type'];
      let reason: string;
      
      if (nearestSupport && nearestSupport > atrStopPrice && 
          (currentPrice - nearestSupport) / currentPrice <= 0.05) {
        // Use support level if it's reasonable (within 5%)
        stopLossPrice = nearestSupport * 0.995; // Slightly below support
        type = 'SUPPORT_RESISTANCE';
        reason = `Support level at ${nearestSupport.toFixed(4)}`;
      } else {
        // Use ATR-based stop loss
        stopLossPrice = atrStopPrice;
        type = 'ATR';
        reason = `${params.atrMultiplier.stopLoss}x ATR (${atr.toFixed(4)})`;
      }
      
      const percentage = ((currentPrice - stopLossPrice) / currentPrice) * 100;
      
      return {
        price: stopLossPrice,
        percentage,
        type,
        reason
      };
    } else {
      // For short positions, stop loss above current price
      const atrStopPrice = currentPrice + atrStopDistance;
      
      // Find nearest resistance level
      const nearestResistance = this.findNearestLevel(
        supportResistance.resistance,
        currentPrice,
        'above'
      );
      
      let stopLossPrice: number;
      let type: SLTPLevels['stopLoss']['type'];
      let reason: string;
      
      if (nearestResistance && nearestResistance < atrStopPrice && 
          (nearestResistance - currentPrice) / currentPrice <= 0.05) {
        // Use resistance level if it's reasonable (within 5%)
        stopLossPrice = nearestResistance * 1.005; // Slightly above resistance
        type = 'SUPPORT_RESISTANCE';
        reason = `Resistance level at ${nearestResistance.toFixed(4)}`;
      } else {
        // Use ATR-based stop loss
        stopLossPrice = atrStopPrice;
        type = 'ATR';
        reason = `${params.atrMultiplier.stopLoss}x ATR (${atr.toFixed(4)})`;
      }
      
      const percentage = ((stopLossPrice - currentPrice) / currentPrice) * 100;
      
      return {
        price: stopLossPrice,
        percentage,
        type,
        reason
      };
    }
  }

  /**
   * Calculate take profit levels
   */
  private calculateTakeProfit(
    signal: TradingSignal,
    currentPrice: number,
    stopLossPrice: number,
    atr: number,
    supportResistance: { support: number[]; resistance: number[] },
    params: RiskParameters,
    isLong: boolean
  ): SLTPLevels['takeProfit'] {
    const riskDistance = Math.abs(currentPrice - stopLossPrice);
    const minTakeProfitDistance = riskDistance * params.minRiskRewardRatio;
    
    let targets: TakeProfitTarget[] = [];
    let mainTakeProfitPrice: number;
    let type: SLTPLevels['takeProfit']['type'];
    let reason: string;
    
    if (isLong) {
      // For long positions, take profit above current price
      const minTakeProfitPrice = currentPrice + minTakeProfitDistance;
      
      // Find resistance levels for take profit
      const resistanceLevels = supportResistance.resistance
        .filter(level => level > minTakeProfitPrice)
        .sort((a, b) => a - b)
        .slice(0, 3); // Take first 3 resistance levels
      
      if (resistanceLevels.length > 0) {
        // Use resistance-based take profit
        mainTakeProfitPrice = resistanceLevels[0];
        type = 'RESISTANCE';
        reason = `Resistance level at ${mainTakeProfitPrice.toFixed(4)}`;
        
        // Create multiple targets if partial take profits enabled
        if (params.partialTakeProfits && resistanceLevels.length > 1) {
          targets = resistanceLevels.map((level, index) => ({
            level: index + 1,
            price: level,
            percentage: ((level - currentPrice) / currentPrice) * 100,
            quantity: index === 0 ? 50 : index === 1 ? 30 : 20, // 50%, 30%, 20%
            type: index === resistanceLevels.length - 1 ? 'FULL' : 'PARTIAL' as 'PARTIAL' | 'FULL',
            reason: `Resistance level ${index + 1}`
          }));
        }
      } else {
        // Use Fibonacci or risk-reward based take profit
        const fibLevel = this.fibonacciLevels.find(level => 
          currentPrice + (riskDistance * level) > minTakeProfitPrice
        ) || 1.618;
        
        mainTakeProfitPrice = currentPrice + (riskDistance * fibLevel);
        type = 'FIBONACCI';
        reason = `${fibLevel} Fibonacci extension`;
        
        // Create Fibonacci-based targets
        if (params.partialTakeProfits) {
          const fibTargets = [1.0, 1.618, 2.618].filter(level => 
            currentPrice + (riskDistance * level) > minTakeProfitPrice
          );
          
          targets = fibTargets.map((level, index) => ({
            level: index + 1,
            price: currentPrice + (riskDistance * level),
            percentage: ((riskDistance * level) / currentPrice) * 100,
            quantity: index === 0 ? 50 : index === 1 ? 30 : 20,
            type: index === fibTargets.length - 1 ? 'FULL' : 'PARTIAL' as 'PARTIAL' | 'FULL',
            reason: `${level} Fibonacci extension`
          }));
        }
      }
    } else {
      // For short positions, take profit below current price
      const minTakeProfitPrice = currentPrice - minTakeProfitDistance;
      
      // Find support levels for take profit
      const supportLevels = supportResistance.support
        .filter(level => level < minTakeProfitPrice)
        .sort((a, b) => b - a)
        .slice(0, 3); // Take first 3 support levels
      
      if (supportLevels.length > 0) {
        // Use support-based take profit
        mainTakeProfitPrice = supportLevels[0];
        type = 'RESISTANCE'; // Support acts as resistance for short
        reason = `Support level at ${mainTakeProfitPrice.toFixed(4)}`;
        
        // Create multiple targets if partial take profits enabled
        if (params.partialTakeProfits && supportLevels.length > 1) {
          targets = supportLevels.map((level, index) => ({
            level: index + 1,
            price: level,
            percentage: ((currentPrice - level) / currentPrice) * 100,
            quantity: index === 0 ? 50 : index === 1 ? 30 : 20,
            type: index === supportLevels.length - 1 ? 'FULL' : 'PARTIAL' as 'PARTIAL' | 'FULL',
            reason: `Support level ${index + 1}`
          }));
        }
      } else {
        // Use Fibonacci or risk-reward based take profit
        const fibLevel = this.fibonacciLevels.find(level => 
          currentPrice - (riskDistance * level) < minTakeProfitPrice
        ) || 1.618;
        
        mainTakeProfitPrice = currentPrice - (riskDistance * fibLevel);
        type = 'FIBONACCI';
        reason = `${fibLevel} Fibonacci extension`;
        
        // Create Fibonacci-based targets
        if (params.partialTakeProfits) {
          const fibTargets = [1.0, 1.618, 2.618].filter(level => 
            currentPrice - (riskDistance * level) < minTakeProfitPrice
          );
          
          targets = fibTargets.map((level, index) => ({
            level: index + 1,
            price: currentPrice - (riskDistance * level),
            percentage: ((riskDistance * level) / currentPrice) * 100,
            quantity: index === 0 ? 50 : index === 1 ? 30 : 20,
            type: index === fibTargets.length - 1 ? 'FULL' : 'PARTIAL' as 'PARTIAL' | 'FULL',
            reason: `${level} Fibonacci extension`
          }));
        }
      }
    }
    
    // If no targets created, create a single target
    if (targets.length === 0) {
      targets = [{
        level: 1,
        price: mainTakeProfitPrice,
        percentage: ((Math.abs(mainTakeProfitPrice - currentPrice)) / currentPrice) * 100,
        quantity: 100,
        type: 'FULL',
        reason
      }];
    }
    
    const percentage = ((Math.abs(mainTakeProfitPrice - currentPrice)) / currentPrice) * 100;
    
    return {
      price: mainTakeProfitPrice,
      percentage,
      type,
      reason,
      targets
    };
  }

  /**
   * Calculate position size based on risk
   */
  private calculatePositionSize(
    entryPrice: number,
    stopLossPrice: number,
    accountBalance: number,
    maxRiskPerTrade: number
  ): number {
    const riskPerShare = Math.abs(entryPrice - stopLossPrice);
    const maxRiskAmount = accountBalance * (maxRiskPerTrade / 100);
    const positionSize = maxRiskAmount / riskPerShare;
    
    return Math.floor(positionSize * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate risk/reward ratio
   */
  private calculateRiskRewardRatio(
    entryPrice: number,
    stopLossPrice: number,
    takeProfitPrice: number,
    isLong: boolean
  ): number {
    const risk = Math.abs(entryPrice - stopLossPrice);
    const reward = Math.abs(takeProfitPrice - entryPrice);
    
    return reward / risk;
  }

  /**
   * Calculate ATR (Average True Range)
   */
  private calculateATR(ohlcv: MarketData['ohlcv'], period: number = 14): number {
    if (ohlcv.length < period + 1) {
      return 0;
    }
    
    const trueRanges: number[] = [];
    
    for (let i = 1; i < ohlcv.length; i++) {
      const current = ohlcv[i];
      const previous = ohlcv[i - 1];
      
      const tr1 = current.high - current.low;
      const tr2 = Math.abs(current.high - previous.close);
      const tr3 = Math.abs(current.low - previous.close);
      
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }
    
    // Calculate ATR as simple moving average of true ranges
    const recentTrueRanges = trueRanges.slice(-period);
    return recentTrueRanges.reduce((sum, tr) => sum + tr, 0) / recentTrueRanges.length;
  }

  /**
   * Calculate support and resistance levels
   */
  private calculateSupportResistance(
    ohlcv: MarketData['ohlcv'],
    lookback: number = 50
  ): { support: number[]; resistance: number[] } {
    if (ohlcv.length < lookback) {
      return { support: [], resistance: [] };
    }
    
    const recentData = ohlcv.slice(-lookback);
    const support: number[] = [];
    const resistance: number[] = [];
    
    // Find pivot points
    for (let i = 2; i < recentData.length - 2; i++) {
      const current = recentData[i];
      const prev2 = recentData[i - 2];
      const prev1 = recentData[i - 1];
      const next1 = recentData[i + 1];
      const next2 = recentData[i + 2];
      
      // Pivot high (resistance)
      if (current.high > prev2.high && current.high > prev1.high && 
          current.high > next1.high && current.high > next2.high) {
        resistance.push(current.high);
      }
      
      // Pivot low (support)
      if (current.low < prev2.low && current.low < prev1.low && 
          current.low < next1.low && current.low < next2.low) {
        support.push(current.low);
      }
    }
    
    // Remove duplicates and sort
    const uniqueSupport = Array.from(new Set(support)).sort((a, b) => b - a);
    const uniqueResistance = Array.from(new Set(resistance)).sort((a, b) => a - b);
    
    return {
      support: uniqueSupport.slice(0, 5), // Top 5 support levels
      resistance: uniqueResistance.slice(0, 5) // Top 5 resistance levels
    };
  }

  /**
   * Find nearest level above or below current price
   */
  private findNearestLevel(
    levels: number[],
    currentPrice: number,
    direction: 'above' | 'below'
  ): number | null {
    const filteredLevels = direction === 'above' 
      ? levels.filter(level => level > currentPrice)
      : levels.filter(level => level < currentPrice);
    
    if (filteredLevels.length === 0) {
      return null;
    }
    
    return direction === 'above'
      ? Math.min(...filteredLevels)
      : Math.max(...filteredLevels);
  }

  /**
   * Create chart levels for visualization
   */
  private createChartLevels(
    symbol: string,
    market: string,
    levels: SLTPLevels
  ): void {
    const chartLevels: ChartLevel[] = [];
    const timestamp = new Date();
    
    // Stop Loss level
    chartLevels.push({
      id: `sl_${symbol}_${timestamp.getTime()}`,
      type: 'STOP_LOSS',
      price: levels.stopLoss.price,
      symbol,
      market,
      strength: 8,
      timeframe: '1H',
      color: '#FF4444',
      style: 'SOLID',
      label: `SL: ${levels.stopLoss.price.toFixed(4)} (${levels.stopLoss.reason})`,
      active: true,
      createdAt: timestamp,
      testCount: 0
    });
    
    // Take Profit levels
    levels.takeProfit.targets.forEach((target, index) => {
      chartLevels.push({
        id: `tp${target.level}_${symbol}_${timestamp.getTime()}`,
        type: 'TAKE_PROFIT',
        price: target.price,
        symbol,
        market,
        strength: 7 - index, // Decreasing strength for higher targets
        timeframe: '1H',
        color: '#44FF44',
        style: target.type === 'PARTIAL' ? 'DASHED' : 'SOLID',
        label: `TP${target.level}: ${target.price.toFixed(4)} (${target.quantity}% - ${target.reason})`,
        active: true,
        createdAt: timestamp,
        testCount: 0
      });
    });
    
    // Store chart levels
    const existingLevels = this.chartLevels.get(symbol) || [];
    this.chartLevels.set(symbol, [...existingLevels, ...chartLevels]);
    
    console.log(`Created ${chartLevels.length} chart levels for ${symbol}`);
  }

  /**
   * Initialize trailing stop for a trade
   */
  initializeTrailingStop(
    tradeId: string,
    symbol: string,
    entryPrice: number,
    stopLossPrice: number,
    isLong: boolean,
    trailingDistance?: number
  ): void {
    const distance = trailingDistance || this.defaultRiskParams.trailingStopDistance;
    
    const trailingStop: TrailingStopData = {
      tradeId,
      symbol,
      initialStopLoss: stopLossPrice,
      currentStopLoss: stopLossPrice,
      highestPrice: isLong ? entryPrice : 0,
      lowestPrice: isLong ? 0 : entryPrice,
      trailingDistance: distance,
      lastUpdate: new Date(),
      triggered: false
    };
    
    this.trailingStops.set(tradeId, trailingStop);
    console.log(`Trailing stop initialized for trade ${tradeId}`);
  }

  /**
   * Update trailing stop based on current price
   */
  updateTrailingStop(
    tradeId: string,
    currentPrice: number,
    atr: number,
    isLong: boolean
  ): { updated: boolean; newStopLoss?: number; triggered?: boolean } {
    const trailingStop = this.trailingStops.get(tradeId);
    if (!trailingStop) {
      return { updated: false };
    }
    
    const trailingDistance = atr * trailingStop.trailingDistance;
    let updated = false;
    
    if (isLong) {
      // For long positions, trail stop loss up
      if (currentPrice > trailingStop.highestPrice) {
        trailingStop.highestPrice = currentPrice;
        const newStopLoss = currentPrice - trailingDistance;
        
        if (newStopLoss > trailingStop.currentStopLoss) {
          trailingStop.currentStopLoss = newStopLoss;
          trailingStop.lastUpdate = new Date();
          updated = true;
        }
      }
      
      // Check if stop loss is triggered
      if (currentPrice <= trailingStop.currentStopLoss) {
        trailingStop.triggered = true;
        return { updated: true, triggered: true, newStopLoss: trailingStop.currentStopLoss };
      }
    } else {
      // For short positions, trail stop loss down
      if (currentPrice < trailingStop.lowestPrice || trailingStop.lowestPrice === 0) {
        trailingStop.lowestPrice = currentPrice;
        const newStopLoss = currentPrice + trailingDistance;
        
        if (newStopLoss < trailingStop.currentStopLoss || trailingStop.currentStopLoss === trailingStop.initialStopLoss) {
          trailingStop.currentStopLoss = newStopLoss;
          trailingStop.lastUpdate = new Date();
          updated = true;
        }
      }
      
      // Check if stop loss is triggered
      if (currentPrice >= trailingStop.currentStopLoss) {
        trailingStop.triggered = true;
        return { updated: true, triggered: true, newStopLoss: trailingStop.currentStopLoss };
      }
    }
    
    return { 
      updated, 
      newStopLoss: updated ? trailingStop.currentStopLoss : undefined 
    };
  }

  /**
   * Get chart levels for a symbol
   */
  getChartLevels(symbol: string): ChartLevel[] {
    return this.chartLevels.get(symbol) || [];
  }

  /**
   * Get active chart levels for visualization
   */
  getActiveChartLevels(symbol: string): ChartLevel[] {
    const levels = this.chartLevels.get(symbol) || [];
    return levels.filter(level => level.active);
  }

  /**
   * Update chart level when price tests it
   */
  updateChartLevelTest(levelId: string, currentPrice: number): void {
    Array.from(this.chartLevels.entries()).forEach(([symbol, levels]) => {
      const level = levels.find(l => l.id === levelId);
      if (level) {
        const priceDistance = Math.abs(currentPrice - level.price) / level.price;
        
        // Consider it a test if price comes within 0.1% of the level
        if (priceDistance <= 0.001) {
          level.testCount++;
          level.lastTested = new Date();
          
          // Increase strength if level holds
          if (level.testCount > 1) {
            level.strength = Math.min(10, level.strength + 1);
          }
          
          console.log(`Level ${levelId} tested. Test count: ${level.testCount}`);
        }
        return; // Exit early when level is found
      }
    });
  }

  /**
   * Remove chart level when broken
   */
  removeChartLevel(levelId: string): void {
    Array.from(this.chartLevels.entries()).forEach(([symbol, levels]) => {
      const levelIndex = levels.findIndex(l => l.id === levelId);
      if (levelIndex !== -1) {
        levels[levelIndex].active = false;
        console.log(`Chart level ${levelId} deactivated`);
        return; // Exit early when level is found
      }
    });
  }

  /**
   * Get trailing stop data
   */
  getTrailingStop(tradeId: string): TrailingStopData | null {
    return this.trailingStops.get(tradeId) || null;
  }

  /**
   * Remove trailing stop
   */
  removeTrailingStop(tradeId: string): void {
    this.trailingStops.delete(tradeId);
    console.log(`Trailing stop removed for trade ${tradeId}`);
  }

  /**
   * Get system statistics
   */
  getSystemStats(): {
    totalChartLevels: number;
    activeTrailingStops: number;
    levelsByType: Record<string, number>;
    averageLevelStrength: number;
  } {
    let totalLevels = 0;
    const levelsByType: Record<string, number> = {};
    let totalStrength = 0;
    
    Array.from(this.chartLevels.values()).forEach(levels => {
      for (const level of levels) {
        if (level.active) {
          totalLevels++;
          levelsByType[level.type] = (levelsByType[level.type] || 0) + 1;
          totalStrength += level.strength;
        }
      }
    });
    
    return {
      totalChartLevels: totalLevels,
      activeTrailingStops: this.trailingStops.size,
      levelsByType,
      averageLevelStrength: totalLevels > 0 ? totalStrength / totalLevels : 0
    };
  }

  /**
   * Clean up old chart levels
   */
  cleanupOldLevels(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    
    Array.from(this.chartLevels.entries()).forEach(([symbol, levels]) => {
      const activeLevels = levels.filter(level => 
        level.active && level.createdAt > cutoff
      );
      
      if (activeLevels.length !== levels.length) {
        this.chartLevels.set(symbol, activeLevels);
      }
    });
    
    console.log('Old chart levels cleaned up');
  }

  /**
   * Apply automatic optimization based on historical performance
   */
  private applyAutoOptimization(signal: TradingSignal, params: RiskParameters): RiskParameters {
    if (!params.autoOptimization.enabled) {
      return params;
    }

    const symbolPerf = this.performanceHistory.get(signal.symbol);
    const optimizedParams = { ...params };

    if (symbolPerf && symbolPerf.trades >= 10) {
      // Adjust risk-reward ratio based on win rate
      if (params.autoOptimization.adaptiveRiskReward) {
        if (symbolPerf.winRate < params.autoOptimization.targetWinRate) {
          // Lower win rate - increase risk-reward ratio
          optimizedParams.minRiskRewardRatio = Math.max(
            params.minRiskRewardRatio * 1.2,
            symbolPerf.avgRR * 1.1
          );
        } else {
          // Higher win rate - can accept lower risk-reward
          optimizedParams.minRiskRewardRatio = Math.max(
            params.minRiskRewardRatio * 0.9,
            1.5
          );
        }
      }

      // Adjust position sizing based on performance
      if (symbolPerf.winRate > params.autoOptimization.targetWinRate + 0.1) {
        optimizedParams.maxPositionSize = Math.min(
          params.maxPositionSize * 1.1,
          0.1 // Max 10% of account
        );
      } else if (symbolPerf.winRate < params.autoOptimization.targetWinRate - 0.1) {
        optimizedParams.maxPositionSize = params.maxPositionSize * 0.8;
      }
    }

    return optimizedParams;
  }

  /**
   * Get or calculate market volatility for a symbol
   */
  private getMarketVolatility(symbol: string, marketData: MarketData): number {
    const cached = this.volatilityCache.get(symbol);
    const now = Date.now();

    // Use cached value if less than 5 minutes old
    if (cached && (now - cached.timestamp) < 5 * 60 * 1000) {
      return cached.atr;
    }

    const atr = this.calculateATR(marketData.ohlcv);
    this.volatilityCache.set(symbol, { atr, timestamp: now });
    
    return atr;
  }

  /**
   * Apply dynamic adjustments based on market conditions
   */
  private applyDynamicAdjustments(
    params: RiskParameters,
    signal: TradingSignal,
    volatility: number
  ): RiskParameters {
    const adjustedParams = { ...params };

    if (params.dynamicSizing.enabled) {
      // Adjust for market volatility
      if (params.autoOptimization.marketVolatilityAdjustment) {
        const volatilityMultiplier = Math.max(0.5, Math.min(2.0, volatility * params.dynamicSizing.volatilityFactor));
        adjustedParams.atrMultiplier.stopLoss *= volatilityMultiplier;
        adjustedParams.atrMultiplier.takeProfit *= volatilityMultiplier;
      }

      // Adjust for signal confidence
      if (signal.confidence && params.dynamicSizing.confidenceMultiplier > 0) {
        const confidenceAdjustment = 0.5 + (signal.confidence * params.dynamicSizing.confidenceMultiplier);
        adjustedParams.maxPositionSize *= confidenceAdjustment;
        adjustedParams.maxRiskPerTrade *= confidenceAdjustment;
      }

      // Time-of-day adjustments
      if (params.autoOptimization.timeOfDayAdjustment) {
        const hour = new Date().getHours();
        // Reduce risk during low-liquidity hours (typically 22:00-06:00 UTC)
        if (hour >= 22 || hour <= 6) {
          adjustedParams.maxRiskPerTrade *= 0.7;
          adjustedParams.maxPositionSize *= 0.7;
        }
      }
    }

    return adjustedParams;
  }

  /**
   * Record trade result for optimization
   */
  recordTradeResult(
    symbol: string,
    isWin: boolean,
    riskRewardRatio: number
  ): void {
    const current = this.performanceHistory.get(symbol) || {
      winRate: 0,
      avgRR: 0,
      trades: 0
    };

    const newTrades = current.trades + 1;
    const newWins = isWin ? (current.winRate * current.trades + 1) : (current.winRate * current.trades);
    const newWinRate = newWins / newTrades;
    const newAvgRR = ((current.avgRR * current.trades) + riskRewardRatio) / newTrades;

    this.performanceHistory.set(symbol, {
      winRate: newWinRate,
      avgRR: newAvgRR,
      trades: newTrades
    });

    // Update global metrics
    this.optimizationMetrics.totalTrades++;
    if (isWin) this.optimizationMetrics.winningTrades++;
    this.optimizationMetrics.avgRiskReward = 
      ((this.optimizationMetrics.avgRiskReward * (this.optimizationMetrics.totalTrades - 1)) + riskRewardRatio) / 
      this.optimizationMetrics.totalTrades;
  }

  /**
   * Get optimization statistics
   */
  getOptimizationStats(): {
    globalWinRate: number;
    globalAvgRR: number;
    totalTrades: number;
    symbolPerformance: Map<string, { winRate: number; avgRR: number; trades: number }>;
    lastOptimization: Date;
  } {
    return {
      globalWinRate: this.optimizationMetrics.totalTrades > 0 ? 
        this.optimizationMetrics.winningTrades / this.optimizationMetrics.totalTrades : 0,
      globalAvgRR: this.optimizationMetrics.avgRiskReward,
      totalTrades: this.optimizationMetrics.totalTrades,
      symbolPerformance: new Map(this.performanceHistory),
      lastOptimization: this.optimizationMetrics.lastOptimization
    };
  }
}

export default StopLossTakeProfitSystem;