'use client';

import { useState, useEffect, useCallback } from 'react';

// User statistics interfaces
export interface UserStats {
  userId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  maxDrawdown: number;
  currentDrawdown: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  totalTradingDays: number;
  averageTradesPerDay: number;
  sharpeRatio: number;
  calmarRatio: number;
  recoveryFactor: number;
  expectancy: number;
  accountBalance: number;
  accountEquity: number;
  initialBalance: number;
  totalReturn: number;
  totalReturnPercent: number;
  monthlyReturn: number;
  yearlyReturn: number;
  volatility: number;
  lastUpdated: Date;
}

export interface TradingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  tradesCount: number;
  profit: number;
  winRate: number;
  symbols: string[];
  markets: string[];
  timeframes: string[];
  notes?: string;
}

export interface PerformanceMetric {
  date: Date;
  balance: number;
  equity: number;
  profit: number;
  drawdown: number;
  trades: number;
  winRate: number;
  profitFactor: number;
}

export interface TradingGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: Date;
  achieved: boolean;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'trading' | 'profit' | 'consistency' | 'risk' | 'milestone';
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface RiskMetrics {
  valueAtRisk: number; // VaR at 95% confidence
  expectedShortfall: number; // CVaR
  maxDrawdownPercent: number;
  currentDrawdownPercent: number;
  riskRewardRatio: number;
  kellyPercentage: number;
  positionSizing: number;
  leverageUsed: number;
  marginUtilization: number;
  correlationRisk: number;
}

export interface MarketAnalysis {
  symbol: string;
  market: string;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  averageProfit: number;
  bestTimeframe: string;
  preferredSessions: string[];
  volatilityPreference: 'low' | 'medium' | 'high';
  successRate: number;
}

class UserStatsService {
  private stats: UserStats;
  private sessions: TradingSession[] = [];
  private performanceHistory: PerformanceMetric[] = [];
  private goals: TradingGoal[] = [];
  private achievements: Achievement[] = [];
  private riskMetrics: RiskMetrics;
  private marketAnalysis: MarketAnalysis[] = [];
  private subscribers: Set<() => void> = new Set();
  private currentSession: TradingSession | null = null;

  constructor() {
    // Initialize user stats
    this.stats = {
      userId: 'user-001',
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      maxDrawdown: 0,
      currentDrawdown: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      totalTradingDays: 0,
      averageTradesPerDay: 0,
      sharpeRatio: 0,
      calmarRatio: 0,
      recoveryFactor: 0,
      expectancy: 0,
      accountBalance: 10000,
      accountEquity: 10000,
      initialBalance: 10000,
      totalReturn: 0,
      totalReturnPercent: 0,
      monthlyReturn: 0,
      yearlyReturn: 0,
      volatility: 0,
      lastUpdated: new Date()
    };

    // Initialize risk metrics
    this.riskMetrics = {
      valueAtRisk: 0,
      expectedShortfall: 0,
      maxDrawdownPercent: 0,
      currentDrawdownPercent: 0,
      riskRewardRatio: 0,
      kellyPercentage: 0,
      positionSizing: 0,
      leverageUsed: 1,
      marginUtilization: 0,
      correlationRisk: 0
    };

    this.initializeData();
    this.startPerformanceTracking();
  }

  private initializeData() {
    // Initialize with some demo data
    this.generateDemoStats();
    this.generateDemoGoals();
    this.generateDemoAchievements();
    this.generateDemoMarketAnalysis();
  }

  private generateDemoStats() {
    // Generate realistic demo trading statistics
    const trades = 150 + Math.floor(Math.random() * 100);
    const winRate = 0.65 + Math.random() * 0.15; // 65-80% win rate
    const winningTrades = Math.floor(trades * winRate);
    const losingTrades = trades - winningTrades;
    
    const averageWin = 250 + Math.random() * 200;
    const averageLoss = 120 + Math.random() * 80;
    const totalProfit = winningTrades * averageWin;
    const totalLoss = losingTrades * averageLoss;
    const netProfit = totalProfit - totalLoss;
    
    this.stats = {
      ...this.stats,
      totalTrades: trades,
      winningTrades,
      losingTrades,
      winRate: winRate * 100,
      totalProfit,
      totalLoss,
      netProfit,
      profitFactor: totalProfit / totalLoss,
      averageWin,
      averageLoss,
      largestWin: averageWin * (2 + Math.random() * 2),
      largestLoss: averageLoss * (1.5 + Math.random()),
      maxDrawdown: 500 + Math.random() * 1000,
      currentDrawdown: Math.random() * 200,
      consecutiveWins: Math.floor(Math.random() * 8) + 1,
      consecutiveLosses: Math.floor(Math.random() * 3),
      maxConsecutiveWins: Math.floor(Math.random() * 12) + 5,
      maxConsecutiveLosses: Math.floor(Math.random() * 5) + 2,
      totalTradingDays: 45 + Math.floor(Math.random() * 30),
      averageTradesPerDay: trades / (45 + Math.floor(Math.random() * 30)),
      sharpeRatio: 1.2 + Math.random() * 0.8,
      calmarRatio: 0.8 + Math.random() * 0.6,
      recoveryFactor: 2.5 + Math.random() * 1.5,
      expectancy: (winRate * averageWin) - ((1 - winRate) * averageLoss),
      accountBalance: 10000 + netProfit,
      accountEquity: 10000 + netProfit,
      totalReturn: netProfit,
      totalReturnPercent: (netProfit / 10000) * 100,
      monthlyReturn: (netProfit / 10000) * 100 / 3, // Assuming 3 months
      yearlyReturn: (netProfit / 10000) * 100 * 4, // Annualized
      volatility: 15 + Math.random() * 10
    };

    // Generate performance history
    this.generatePerformanceHistory();
  }

  private generatePerformanceHistory() {
    const days = 90;
    let balance = this.stats.initialBalance;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Simulate daily performance
      const dailyReturn = (Math.random() - 0.4) * 0.02; // Slight positive bias
      const dailyProfit = balance * dailyReturn;
      balance += dailyProfit;
      
      const drawdown = Math.max(0, (Math.max(...this.performanceHistory.map(p => p.balance), balance) - balance) / Math.max(...this.performanceHistory.map(p => p.balance), balance) * 100);
      
      this.performanceHistory.push({
        date,
        balance,
        equity: balance,
        profit: dailyProfit,
        drawdown,
        trades: Math.floor(Math.random() * 5),
        winRate: 60 + Math.random() * 25,
        profitFactor: 1 + Math.random() * 1.5
      });
    }
  }

  private generateDemoGoals() {
    this.goals = [
      {
        id: 'goal-1',
        title: 'Reach 75% Win Rate',
        description: 'Maintain a consistent win rate of 75% or higher',
        targetValue: 75,
        currentValue: this.stats.winRate,
        unit: '%',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        achieved: this.stats.winRate >= 75,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'goal-2',
        title: 'Achieve $5,000 Profit',
        description: 'Reach a total net profit of $5,000',
        targetValue: 5000,
        currentValue: this.stats.netProfit,
        unit: '$',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        achieved: this.stats.netProfit >= 5000,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'goal-3',
        title: 'Complete 200 Trades',
        description: 'Execute 200 successful trades',
        targetValue: 200,
        currentValue: this.stats.totalTrades,
        unit: 'trades',
        achieved: this.stats.totalTrades >= 200,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  private generateDemoAchievements() {
    this.achievements = [
      {
        id: 'ach-1',
        title: 'First Trade',
        description: 'Execute your first trade',
        icon: '🎯',
        category: 'milestone',
        unlockedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        progress: 1,
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'ach-2',
        title: 'Profit Master',
        description: 'Achieve 10 consecutive winning trades',
        icon: '💰',
        category: 'trading',
        unlockedAt: this.stats.maxConsecutiveWins >= 10 ? new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) : undefined,
        progress: Math.min(this.stats.maxConsecutiveWins, 10),
        maxProgress: 10,
        rarity: 'rare'
      },
      {
        id: 'ach-3',
        title: 'Risk Manager',
        description: 'Keep maximum drawdown below 5%',
        icon: '🛡️',
        category: 'risk',
        unlockedAt: this.stats.maxDrawdown / this.stats.initialBalance * 100 < 5 ? new Date() : undefined,
        progress: Math.max(0, 5 - (this.stats.maxDrawdown / this.stats.initialBalance * 100)),
        maxProgress: 5,
        rarity: 'epic'
      },
      {
        id: 'ach-4',
        title: 'Consistency King',
        description: 'Maintain 70%+ win rate for 30 days',
        icon: '👑',
        category: 'consistency',
        progress: this.stats.winRate >= 70 ? 30 : 0,
        maxProgress: 30,
        rarity: 'legendary'
      }
    ];
  }

  private generateDemoMarketAnalysis() {
    const markets = [
      { symbol: 'BTCUSD', market: 'crypto' },
      { symbol: 'ETHUSD', market: 'crypto' },
      { symbol: 'EURUSD', market: 'forex' },
      { symbol: 'GBPUSD', market: 'forex' },
      { symbol: 'AAPL', market: 'stocks' }
    ];

    this.marketAnalysis = markets.map(market => ({
      symbol: market.symbol,
      market: market.market,
      totalTrades: Math.floor(Math.random() * 50) + 10,
      winRate: 60 + Math.random() * 25,
      profitFactor: 1 + Math.random() * 1.5,
      averageProfit: 100 + Math.random() * 200,
      bestTimeframe: ['1m', '5m', '15m', '1h', '4h'][Math.floor(Math.random() * 5)],
      preferredSessions: ['London', 'New York', 'Tokyo', 'Sydney'].slice(0, Math.floor(Math.random() * 3) + 1),
      volatilityPreference: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      successRate: 70 + Math.random() * 20
    }));
  }

  private startPerformanceTracking() {
    // Update performance metrics every minute
    setInterval(() => {
      this.updateRealTimeMetrics();
      this.checkAchievements();
      this.notifySubscribers();
    }, 60000);
  }

  private updateRealTimeMetrics() {
    // Simulate real-time updates
    const now = new Date();
    const lastMetric = this.performanceHistory[this.performanceHistory.length - 1];
    
    if (lastMetric && now.getDate() !== lastMetric.date.getDate()) {
      // New day, add new performance metric
      const dailyReturn = (Math.random() - 0.4) * 0.02;
      const newBalance = lastMetric.balance * (1 + dailyReturn);
      
      this.performanceHistory.push({
        date: now,
        balance: newBalance,
        equity: newBalance,
        profit: newBalance - lastMetric.balance,
        drawdown: Math.max(0, (Math.max(...this.performanceHistory.map(p => p.balance)) - newBalance) / Math.max(...this.performanceHistory.map(p => p.balance)) * 100),
        trades: Math.floor(Math.random() * 5),
        winRate: 60 + Math.random() * 25,
        profitFactor: 1 + Math.random() * 1.5
      });
      
      // Keep only last 90 days
      if (this.performanceHistory.length > 90) {
        this.performanceHistory = this.performanceHistory.slice(-90);
      }
    }
  }

  private checkAchievements() {
    this.achievements.forEach(achievement => {
      if (!achievement.unlockedAt) {
        // Check if achievement should be unlocked
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'ach-2':
            shouldUnlock = this.stats.maxConsecutiveWins >= 10;
            break;
          case 'ach-3':
            shouldUnlock = (this.stats.maxDrawdown / this.stats.initialBalance * 100) < 5;
            break;
          case 'ach-4':
            shouldUnlock = this.stats.winRate >= 70;
            break;
        }
        
        if (shouldUnlock) {
          achievement.unlockedAt = new Date();
        }
      }
    });
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  // Public API methods
  recordTrade(profit: number, symbol: string, market: string) {
    this.stats.totalTrades++;
    
    if (profit > 0) {
      this.stats.winningTrades++;
      this.stats.totalProfit += profit;
      this.stats.consecutiveWins++;
      this.stats.consecutiveLosses = 0;
      this.stats.maxConsecutiveWins = Math.max(this.stats.maxConsecutiveWins, this.stats.consecutiveWins);
      this.stats.largestWin = Math.max(this.stats.largestWin, profit);
    } else {
      this.stats.losingTrades++;
      this.stats.totalLoss += Math.abs(profit);
      this.stats.consecutiveLosses++;
      this.stats.consecutiveWins = 0;
      this.stats.maxConsecutiveLosses = Math.max(this.stats.maxConsecutiveLosses, this.stats.consecutiveLosses);
      this.stats.largestLoss = Math.max(this.stats.largestLoss, Math.abs(profit));
    }
    
    // Recalculate derived metrics
    this.stats.winRate = (this.stats.winningTrades / this.stats.totalTrades) * 100;
    this.stats.profitFactor = this.stats.totalLoss > 0 ? this.stats.totalProfit / this.stats.totalLoss : 0;
    this.stats.averageWin = this.stats.winningTrades > 0 ? this.stats.totalProfit / this.stats.winningTrades : 0;
    this.stats.averageLoss = this.stats.losingTrades > 0 ? this.stats.totalLoss / this.stats.losingTrades : 0;
    this.stats.netProfit = this.stats.totalProfit - this.stats.totalLoss;
    this.stats.expectancy = (this.stats.winRate / 100 * this.stats.averageWin) - ((1 - this.stats.winRate / 100) * this.stats.averageLoss);
    this.stats.lastUpdated = new Date();
    
    // Update market analysis
    let marketData = this.marketAnalysis.find(m => m.symbol === symbol);
    if (!marketData) {
      marketData = {
        symbol,
        market,
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        averageProfit: 0,
        bestTimeframe: '1h',
        preferredSessions: ['New York'],
        volatilityPreference: 'medium',
        successRate: 0
      };
      this.marketAnalysis.push(marketData);
    }
    
    marketData.totalTrades++;
    // Update market-specific metrics...
    
    this.notifySubscribers();
  }

  startTradingSession(): string {
    const sessionId = `session-${Date.now()}`;
    this.currentSession = {
      id: sessionId,
      startTime: new Date(),
      tradesCount: 0,
      profit: 0,
      winRate: 0,
      symbols: [],
      markets: [],
      timeframes: []
    };
    return sessionId;
  }

  endTradingSession(notes?: string): TradingSession | null {
    if (!this.currentSession) return null;
    
    this.currentSession.endTime = new Date();
    this.currentSession.duration = Math.floor((this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()) / 60000);
    this.currentSession.notes = notes;
    
    this.sessions.unshift(this.currentSession);
    const completedSession = this.currentSession;
    this.currentSession = null;
    
    // Keep only last 50 sessions
    if (this.sessions.length > 50) {
      this.sessions = this.sessions.slice(0, 50);
    }
    
    this.notifySubscribers();
    return completedSession;
  }

  addGoal(goal: Omit<TradingGoal, 'id' | 'createdAt'>): string {
    const goalId = `goal-${Date.now()}`;
    this.goals.push({
      ...goal,
      id: goalId,
      createdAt: new Date()
    });
    this.notifySubscribers();
    return goalId;
  }

  updateGoalProgress(goalId: string, currentValue: number) {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.currentValue = currentValue;
      goal.achieved = currentValue >= goal.targetValue;
      this.notifySubscribers();
    }
  }

  // Getters
  getStats(): UserStats {
    return { ...this.stats };
  }

  getSessions(): TradingSession[] {
    return [...this.sessions];
  }

  getPerformanceHistory(): PerformanceMetric[] {
    return [...this.performanceHistory];
  }

  getGoals(): TradingGoal[] {
    return [...this.goals];
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getRiskMetrics(): RiskMetrics {
    return { ...this.riskMetrics };
  }

  getMarketAnalysis(): MarketAnalysis[] {
    return [...this.marketAnalysis];
  }

  getCurrentSession(): TradingSession | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  // Subscription
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
}

// Singleton instance
const userStatsService = new UserStatsService();
export default userStatsService;

// React hooks
export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(userStatsService.getStats());
  const [sessions, setSessions] = useState<TradingSession[]>(userStatsService.getSessions());
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceMetric[]>(userStatsService.getPerformanceHistory());
  const [goals, setGoals] = useState<TradingGoal[]>(userStatsService.getGoals());
  const [achievements, setAchievements] = useState<Achievement[]>(userStatsService.getAchievements());
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(userStatsService.getRiskMetrics());
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>(userStatsService.getMarketAnalysis());
  const [currentSession, setCurrentSession] = useState<TradingSession | null>(userStatsService.getCurrentSession());

  useEffect(() => {
    const unsubscribe = userStatsService.subscribe(() => {
      setStats(userStatsService.getStats());
      setSessions(userStatsService.getSessions());
      setPerformanceHistory(userStatsService.getPerformanceHistory());
      setGoals(userStatsService.getGoals());
      setAchievements(userStatsService.getAchievements());
      setRiskMetrics(userStatsService.getRiskMetrics());
      setMarketAnalysis(userStatsService.getMarketAnalysis());
      setCurrentSession(userStatsService.getCurrentSession());
    });

    return unsubscribe;
  }, []);

  const recordTrade = useCallback((profit: number, symbol: string, market: string) => {
    userStatsService.recordTrade(profit, symbol, market);
  }, []);

  const startSession = useCallback(() => {
    return userStatsService.startTradingSession();
  }, []);

  const endSession = useCallback((notes?: string) => {
    return userStatsService.endTradingSession(notes);
  }, []);

  const addGoal = useCallback((goal: Omit<TradingGoal, 'id' | 'createdAt'>) => {
    return userStatsService.addGoal(goal);
  }, []);

  const updateGoalProgress = useCallback((goalId: string, currentValue: number) => {
    userStatsService.updateGoalProgress(goalId, currentValue);
  }, []);

  return {
    stats,
    sessions,
    performanceHistory,
    goals,
    achievements,
    riskMetrics,
    marketAnalysis,
    currentSession,
    recordTrade,
    startSession,
    endSession,
    addGoal,
    updateGoalProgress
  };
}