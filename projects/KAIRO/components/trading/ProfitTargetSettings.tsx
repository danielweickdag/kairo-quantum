'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Calendar, Settings, AlertTriangle, CheckCircle, Edit3, RotateCcw, Plus, Minus, Activity, Copy, Users, Shield, Play, Pause, Bot, Percent, Clock, BarChart3, RefreshCw, Zap, Search, ArrowDownLeft } from 'lucide-react';
import ProfitFactorTrackingSystem from '../../src/services/profitFactorTrackingSystem';
import automatedWorkflowService from '../../src/services/AutomatedWorkflowService';

interface ProfitTarget {
  id: string;
  date: string;
  targetAmount: number;
  currentProfit: number;
  isActive: boolean;
  strategy?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  stopLoss?: number;
}

enum TraderCategory {
  FRIENDS = 'friends',
  POLITICIANS = 'politicians',
  HEDGE_FUNDS = 'hedge_funds',
  CELEBRITIES = 'celebrities',
  INFLUENCERS = 'influencers',
  PROFESSIONALS = 'professionals'
}

interface TraderCategoryInfo {
  id: TraderCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}

interface CopyTrader {
  id: string;
  name: string;
  avatar: string;
  performance: {
    totalReturn: number;
    winRate: number;
    monthlyReturn: number;
    maxDrawdown: number;
  };
  followers: number;
  riskLevel: 'low' | 'medium' | 'high';
  minCopyAmount: number;
  status: 'active' | 'paused';
  category: TraderCategory;
  title?: string;
  verified: boolean;
  totalTrades: number;
  avgReturn: number;
}

interface AutoTradingConfig {
  enabled: boolean;
  dailyGainLimit: number;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  stopOnTarget: boolean;
  maxTradesPerDay: number;
  allowedSymbols: string[];
  stopLossPercentage: number;
  takeProfitPercentage: number;
}

interface ProfitTargetSettingsProps {
  onTargetUpdate?: (target: ProfitTarget) => void;
  onTargetAchieved?: (target: ProfitTarget) => void;
}

// Trader categories configuration
const traderCategories: TraderCategoryInfo[] = [
  {
    id: TraderCategory.FRIENDS,
    label: 'Friends',
    icon: '👥',
    description: 'Trade with your trusted friends',
    color: 'bg-blue-500'
  },
  {
    id: TraderCategory.POLITICIANS,
    label: 'Politicians',
    icon: '🏛️',
    description: 'Follow political figures trading',
    color: 'bg-purple-500'
  },
  {
    id: TraderCategory.HEDGE_FUNDS,
    label: 'Hedge Funds',
    icon: '🏦',
    description: 'Professional fund managers',
    color: 'bg-green-500'
  },
  {
    id: TraderCategory.CELEBRITIES,
    label: 'Celebrities',
    icon: '⭐',
    description: 'Celebrity traders and influencers',
    color: 'bg-yellow-500'
  },
  {
    id: TraderCategory.INFLUENCERS,
    label: 'Influencers',
    icon: '📱',
    description: 'Social media trading influencers',
    color: 'bg-pink-500'
  },
  {
    id: TraderCategory.PROFESSIONALS,
    label: 'Professionals',
    icon: '💼',
    description: 'Certified trading professionals',
    color: 'bg-indigo-500'
  }
];

// Mock data for available copy traders
const availableCopyTraders: CopyTrader[] = [
  // Friends
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'AC',
    performance: {
      totalReturn: 156.8,
      winRate: 78.5,
      monthlyReturn: 18.2,
      maxDrawdown: -12.3
    },
    followers: 1250,
    riskLevel: 'medium',
    minCopyAmount: 100,
    status: 'active',
    category: TraderCategory.FRIENDS,
    verified: true,
    totalTrades: 245,
    avgReturn: 12.3
  },
  {
    id: '2',
    name: 'Sarah Williams',
    avatar: 'SW',
    performance: {
      totalReturn: 89.4,
      winRate: 82.1,
      monthlyReturn: 12.5,
      maxDrawdown: -8.7
    },
    followers: 890,
    riskLevel: 'low',
    minCopyAmount: 250,
    status: 'active',
    category: TraderCategory.FRIENDS,
    verified: true,
    totalTrades: 156,
    avgReturn: 8.9
  },
  {
    id: '11',
    name: 'Michael Rodriguez',
    avatar: 'MR',
    performance: {
      totalReturn: 203.5,
      winRate: 74.2,
      monthlyReturn: 16.8,
      maxDrawdown: -14.1
    },
    followers: 2100,
    riskLevel: 'high',
    minCopyAmount: 500,
    status: 'active',
    category: TraderCategory.FRIENDS,
    title: 'Day Trading Specialist',
    verified: true,
    totalTrades: 412,
    avgReturn: 16.8
  },
  {
    id: '12',
    name: 'Emma Thompson',
    avatar: 'ET',
    performance: {
      totalReturn: 127.3,
      winRate: 79.6,
      monthlyReturn: 10.2,
      maxDrawdown: -7.8
    },
    followers: 1680,
    riskLevel: 'low',
    minCopyAmount: 200,
    status: 'active',
    category: TraderCategory.FRIENDS,
    title: 'Conservative Growth Expert',
    verified: true,
    totalTrades: 298,
    avgReturn: 10.2
  },
  // Politicians
  {
    id: '3',
    name: 'Nancy Pelosi',
    avatar: 'NP',
    performance: {
      totalReturn: 234.7,
      winRate: 65.3,
      monthlyReturn: 25.8,
      maxDrawdown: -18.9
    },
    followers: 25000,
    riskLevel: 'high',
    minCopyAmount: 1000,
    status: 'active',
    category: TraderCategory.POLITICIANS,
    title: 'Former Speaker of the House',
    verified: true,
    totalTrades: 89,
    avgReturn: 24.7
  },
  {
    id: '4',
    name: 'Richard Burr',
    avatar: 'RB',
    performance: {
      totalReturn: 119.4,
      winRate: 71.2,
      monthlyReturn: 15.8,
      maxDrawdown: -11.3
    },
    followers: 8500,
    riskLevel: 'medium',
    minCopyAmount: 500,
    status: 'active',
    category: TraderCategory.POLITICIANS,
    title: 'Former Senator',
    verified: true,
    totalTrades: 67,
    avgReturn: 15.8
  },
  {
    id: '13',
    name: 'Alexandria Ocasio-Cortez',
    avatar: 'AOC',
    performance: {
      totalReturn: 178.9,
      winRate: 68.4,
      monthlyReturn: 14.9,
      maxDrawdown: -16.2
    },
    followers: 18500,
    riskLevel: 'medium',
    minCopyAmount: 750,
    status: 'active',
    category: TraderCategory.POLITICIANS,
    title: 'Representative',
    verified: true,
    totalTrades: 124,
    avgReturn: 14.9
  },
  {
    id: '14',
    name: 'Mitt Romney',
    avatar: 'MR2',
    performance: {
      totalReturn: 145.6,
      winRate: 72.8,
      monthlyReturn: 12.1,
      maxDrawdown: -9.7
    },
    followers: 12000,
    riskLevel: 'low',
    minCopyAmount: 1000,
    status: 'active',
    category: TraderCategory.POLITICIANS,
    title: 'Senator',
    verified: true,
    totalTrades: 156,
    avgReturn: 12.1
  },
  // Hedge Funds
  {
    id: '5',
    name: 'Bridgewater Associates',
    avatar: 'BA',
    performance: {
      totalReturn: 115.7,
      winRate: 68.8,
      monthlyReturn: 11.2,
      maxDrawdown: -9.4
    },
    followers: 45000,
    riskLevel: 'low',
    minCopyAmount: 5000,
    status: 'active',
    category: TraderCategory.HEDGE_FUNDS,
    title: 'World\'s Largest Hedge Fund',
    verified: true,
    totalTrades: 1250,
    avgReturn: 11.2
  },
  {
    id: '6',
    name: 'Renaissance Technologies',
    avatar: 'RT',
    performance: {
      totalReturn: 328.9,
      winRate: 73.4,
      monthlyReturn: 22.1,
      maxDrawdown: -15.7
    },
    followers: 38000,
    riskLevel: 'high',
    minCopyAmount: 10000,
    status: 'active',
    category: TraderCategory.HEDGE_FUNDS,
    title: 'Quantitative Trading Pioneer',
    verified: true,
    totalTrades: 2100,
    avgReturn: 22.1
  },
  {
    id: '15',
    name: 'Citadel Securities',
    avatar: 'CS',
    performance: {
      totalReturn: 198.4,
      winRate: 71.9,
      monthlyReturn: 16.5,
      maxDrawdown: -12.8
    },
    followers: 32000,
    riskLevel: 'medium',
    minCopyAmount: 7500,
    status: 'active',
    category: TraderCategory.HEDGE_FUNDS,
    title: 'Market Making Giant',
    verified: true,
    totalTrades: 1890,
    avgReturn: 16.5
  },
  {
    id: '16',
    name: 'Two Sigma',
    avatar: 'TS',
    performance: {
      totalReturn: 267.3,
      winRate: 69.7,
      monthlyReturn: 19.8,
      maxDrawdown: -14.3
    },
    followers: 28000,
    riskLevel: 'high',
    minCopyAmount: 8000,
    status: 'active',
    category: TraderCategory.HEDGE_FUNDS,
    title: 'AI-Driven Trading',
    verified: true,
    totalTrades: 1567,
    avgReturn: 19.8
  },
  // Celebrities
  {
    id: '7',
    name: 'Elon Musk',
    avatar: 'EM',
    performance: {
      totalReturn: 442.3,
      winRate: 69.2,
      monthlyReturn: 35.7,
      maxDrawdown: -28.4
    },
    followers: 150000,
    riskLevel: 'high',
    minCopyAmount: 1000,
    status: 'active',
    category: TraderCategory.CELEBRITIES,
    title: 'CEO of Tesla & SpaceX',
    verified: true,
    totalTrades: 78,
    avgReturn: 35.7
  },
  {
    id: '8',
    name: 'Mark Cuban',
    avatar: 'MC',
    performance: {
      totalReturn: 221.6,
      winRate: 64.9,
      monthlyReturn: 18.3,
      maxDrawdown: -14.2
    },
    followers: 75000,
    riskLevel: 'medium',
    minCopyAmount: 2500,
    status: 'active',
    category: TraderCategory.CELEBRITIES,
    title: 'Entrepreneur & Investor',
    verified: true,
    totalTrades: 134,
    avgReturn: 18.3
  },
  {
    id: '17',
    name: 'Kevin O\'Leary',
    avatar: 'KO',
    performance: {
      totalReturn: 189.7,
      winRate: 66.8,
      monthlyReturn: 15.8,
      maxDrawdown: -13.5
    },
    followers: 85000,
    riskLevel: 'medium',
    minCopyAmount: 1500,
    status: 'active',
    category: TraderCategory.CELEBRITIES,
    title: 'Shark Tank Investor',
    verified: true,
    totalTrades: 203,
    avgReturn: 15.8
  },
  {
    id: '18',
    name: 'Robert Kiyosaki',
    avatar: 'RK',
    performance: {
      totalReturn: 156.2,
      winRate: 63.4,
      monthlyReturn: 13.0,
      maxDrawdown: -11.8
    },
    followers: 92000,
    riskLevel: 'low',
    minCopyAmount: 1000,
    status: 'active',
    category: TraderCategory.CELEBRITIES,
    title: 'Rich Dad Poor Dad Author',
    verified: true,
    totalTrades: 167,
    avgReturn: 13.0
  },
  // Influencers
  {
    id: '9',
    name: 'Graham Stephan',
    avatar: 'GS',
    performance: {
      totalReturn: 116.8,
      winRate: 71.6,
      monthlyReturn: 13.4,
      maxDrawdown: -8.9
    },
    followers: 95000,
    riskLevel: 'low',
    minCopyAmount: 100,
    status: 'active',
    category: TraderCategory.INFLUENCERS,
    title: 'YouTube Finance Creator',
    verified: true,
    totalTrades: 289,
    avgReturn: 13.4
  },
  {
    id: '19',
    name: 'Andrei Jikh',
    avatar: 'AJ',
    performance: {
      totalReturn: 143.7,
      winRate: 75.3,
      monthlyReturn: 11.9,
      maxDrawdown: -9.2
    },
    followers: 78000,
    riskLevel: 'low',
    minCopyAmount: 150,
    status: 'active',
    category: TraderCategory.INFLUENCERS,
    title: 'Personal Finance YouTuber',
    verified: true,
    totalTrades: 234,
    avgReturn: 11.9
  },
  {
    id: '20',
    name: 'Meet Kevin',
    avatar: 'MK',
    performance: {
      totalReturn: 198.5,
      winRate: 68.9,
      monthlyReturn: 16.5,
      maxDrawdown: -15.4
    },
    followers: 112000,
    riskLevel: 'medium',
    minCopyAmount: 300,
    status: 'active',
    category: TraderCategory.INFLUENCERS,
    title: 'Real Estate & Stock Investor',
    verified: true,
    totalTrades: 345,
    avgReturn: 16.5
  },
  // Professionals
  {
    id: '10',
    name: 'Cathie Wood',
    avatar: 'CW',
    performance: {
      totalReturn: 225.4,
      winRate: 66.7,
      monthlyReturn: 19.8,
      maxDrawdown: -16.3
    },
    followers: 120000,
    riskLevel: 'high',
    minCopyAmount: 2000,
    status: 'active',
    category: TraderCategory.PROFESSIONALS,
    title: 'ARK Invest CEO',
    verified: true,
    totalTrades: 456,
    avgReturn: 19.8
  },
  {
    id: '21',
    name: 'Ray Dalio',
    avatar: 'RD',
    performance: {
      totalReturn: 187.9,
      winRate: 70.4,
      monthlyReturn: 15.7,
      maxDrawdown: -11.6
    },
    followers: 98000,
    riskLevel: 'medium',
    minCopyAmount: 3000,
    status: 'active',
    category: TraderCategory.PROFESSIONALS,
    title: 'Bridgewater Founder',
    verified: true,
    totalTrades: 567,
    avgReturn: 15.7
  },
  {
    id: '22',
    name: 'Warren Buffett',
    avatar: 'WB',
    performance: {
      totalReturn: 134.6,
      winRate: 81.2,
      monthlyReturn: 11.2,
      maxDrawdown: -6.8
    },
    followers: 250000,
    riskLevel: 'low',
    minCopyAmount: 5000,
    status: 'active',
    category: TraderCategory.PROFESSIONALS,
    title: 'Berkshire Hathaway CEO',
    verified: true,
    totalTrades: 89,
    avgReturn: 11.2
  }
];

const ProfitTargetSettings: React.FC<ProfitTargetSettingsProps> = ({
  onTargetUpdate,
  onTargetAchieved
}) => {
  const [dailyTarget, setDailyTarget] = useState<number>(1000);
  const [currentProfit, setCurrentProfit] = useState<number>(0);
  const [targets, setTargets] = useState<ProfitTarget[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoStopEnabled, setAutoStopEnabled] = useState(true);
  const [maxDailyLoss, setMaxDailyLoss] = useState<number>(500);
  const [currentLoss, setCurrentLoss] = useState<number>(0);
  const [notifications, setNotifications] = useState(true);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  
  // New states for manual/automatic functionality
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [manualProfitInput, setManualProfitInput] = useState<string>('');
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(50);
  const [profitHistory, setProfitHistory] = useState<Array<{timestamp: Date, amount: number, type: 'manual' | 'automatic', action: string}>>([]);
  const [autoCalculationEnabled, setAutoCalculationEnabled] = useState<boolean>(true);
  const [lastAutoUpdate, setLastAutoUpdate] = useState<Date | null>(null);
  const [profitTracker] = useState(() => new ProfitFactorTrackingSystem());
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  
  // Copy Trading & Auto Trading States
  const [copyTradingEnabled, setCopyTradingEnabled] = useState(false);
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);
  const [dailyGainLimit, setDailyGainLimit] = useState(500);
  const [dailyGainAchieved, setDailyGainAchieved] = useState(0);
  const [selectedCopyTraders, setSelectedCopyTraders] = useState<string[]>([]);
  const [autoTradingRiskLevel, setAutoTradingRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [copyTradingAllocation, setCopyTradingAllocation] = useState(1000);
  const [autoStopOnTarget, setAutoStopOnTarget] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TraderCategory | 'all'>('all');
  const [filteredTraders, setFilteredTraders] = useState<CopyTrader[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Copy confirmation modal states
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedTraderToCopy, setSelectedTraderToCopy] = useState<CopyTrader | null>(null);
  const [copyAmount, setCopyAmount] = useState<number>(0);
  const [hoveredTrader, setHoveredTrader] = useState<string | null>(null);

  // Calculate progress percentage
  const progressPercentage = Math.min((currentProfit / dailyTarget) * 100, 100);
  const lossPercentage = Math.min((Math.abs(currentLoss) / maxDailyLoss) * 100, 100);

  // Check if target is achieved
  const isTargetAchieved = currentProfit >= dailyTarget;
  const isMaxLossReached = Math.abs(currentLoss) >= maxDailyLoss;

  // Create new daily target
  const createDailyTarget = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTarget: ProfitTarget = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: today,
      targetAmount: dailyTarget,
      currentProfit: 0,
      isActive: true,
      riskLevel,
      stopLoss: maxDailyLoss
    };
    
    setTargets(prev => {
      // Deactivate previous targets
      const updated = prev.map(t => ({ ...t, isActive: false }));
      return [...updated, newTarget];
    });
    
    onTargetUpdate?.(newTarget);
  };

  // Update current profit (enhanced with tracking)
  const updateProfit = (amount: number, type: 'manual' | 'automatic' = 'automatic', action: string = 'update') => {
    setCurrentProfit(prev => {
      const newProfit = prev + amount;
      
      // Add to history
      setProfitHistory(prevHistory => [
        ...prevHistory,
        {
          timestamp: new Date(),
          amount,
          type,
          action
        }
      ]);
      
      // Update active target
      setTargets(prevTargets => 
        prevTargets.map(target => 
          target.isActive 
            ? { ...target, currentProfit: newProfit }
            : target
        )
      );
      
      // Check if target achieved
      if (newProfit >= dailyTarget && !isTargetAchieved) {
        const activeTarget = targets.find(t => t.isActive);
        if (activeTarget) {
          onTargetAchieved?.(activeTarget);
        }
      }
      
      return newProfit;
    });
  };

  // Update current loss
  const updateLoss = (amount: number) => {
    setCurrentLoss(prev => prev + amount);
  };

  // Manual profit entry
  const handleManualProfitEntry = () => {
    const amount = parseFloat(manualProfitInput);
    if (!isNaN(amount) && amount !== 0) {
      updateProfit(amount, 'manual', 'manual_entry');
      setManualProfitInput('');
    }
  };

  // Quick profit adjustments
  const adjustProfit = (amount: number) => {
    updateProfit(amount, 'manual', amount > 0 ? 'quick_add' : 'quick_subtract');
  };

  // Set profit to specific amount
  const setProfitAmount = (amount: number) => {
    const difference = amount - currentProfit;
    updateProfit(difference, 'manual', 'set_amount');
  };

  // Reset daily tracking
  const resetDaily = () => {
    setCurrentProfit(0);
    setCurrentLoss(0);
    setProfitHistory([]);
    setDailyGainAchieved(0);
    createDailyTarget();
  };

  // Copy Trading Functions
  const toggleCopyTrader = (traderId: string) => {
    setSelectedCopyTraders(prev => {
      if (prev.includes(traderId)) {
        return prev.filter(id => id !== traderId);
      } else {
        return [...prev, traderId];
      }
    });
  };

  const handleCopyTradingToggle = (enabled: boolean) => {
    setCopyTradingEnabled(enabled);
    if (!enabled) {
      setSelectedCopyTraders([]);
    }
  };

  // Auto Trading Functions
  const handleAutoTradingToggle = (enabled: boolean) => {
    setAutoTradingEnabled(enabled);
    if (enabled && dailyGainAchieved >= dailyGainLimit && autoStopOnTarget) {
      setAutoTradingEnabled(false);
      console.log('Auto trading stopped: Daily gain limit reached');
    }
  };

  // One-click copy functionality
  const handleQuickCopy = (trader: CopyTrader, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card selection
    setSelectedTraderToCopy(trader);
    setCopyAmount(trader.minCopyAmount);
    setShowCopyModal(true);
  };

  const confirmCopy = () => {
    if (selectedTraderToCopy) {
      // Add trader to selected list if not already selected
      if (!selectedCopyTraders.includes(selectedTraderToCopy.id)) {
        setSelectedCopyTraders(prev => [...prev, selectedTraderToCopy.id]);
      }
      
      // Enable copy trading if not already enabled
      if (!copyTradingEnabled) {
        setCopyTradingEnabled(true);
      }
      
      console.log(`Started copying ${selectedTraderToCopy.name} with $${copyAmount}`);
      
      // Close modal and reset
      setShowCopyModal(false);
      setSelectedTraderToCopy(null);
      setCopyAmount(0);
    }
  };

  const cancelCopy = () => {
    setShowCopyModal(false);
    setSelectedTraderToCopy(null);
    setCopyAmount(0);
  };

  const updateDailyGain = (amount: number) => {
    const newGainAchieved = dailyGainAchieved + amount;
    setDailyGainAchieved(newGainAchieved);
    
    // Auto-stop if daily limit reached
    if (autoTradingEnabled && newGainAchieved >= dailyGainLimit && autoStopOnTarget) {
      setAutoTradingEnabled(false);
      console.log('Auto trading stopped: Daily gain limit reached');
    }
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleCategoryChange = (category: TraderCategory | 'all') => {
    setSelectedCategory(category);
  };

  const getCategoryIcon = (category: TraderCategory) => {
    const categoryInfo = traderCategories.find(cat => cat.id === category);
    return categoryInfo?.icon || '👤';
  };

  const getTrendingTraders = () => {
    return availableCopyTraders
      .sort((a, b) => b.performance.totalReturn - a.performance.totalReturn)
      .slice(0, 3);
  };

  const getCategoryColor = (category: TraderCategory) => {
    const categoryInfo = traderCategories.find(cat => cat.id === category);
    return categoryInfo?.color || 'bg-gray-500';
  };

  // Filter traders based on selected category and search query
  React.useEffect(() => {
    let filtered = availableCopyTraders;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(trader => trader.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trader => 
        trader.name.toLowerCase().includes(query) ||
        trader.title?.toLowerCase().includes(query) ||
        traderCategories.find(cat => cat.id === trader.category)?.label.toLowerCase().includes(query)
      );
    }
    
    setFilteredTraders(filtered);
  }, [selectedCategory, searchQuery]);

  // Get status color
  const getStatusColor = () => {
    if (isMaxLossReached) return 'text-red-600';
    if (isTargetAchieved) return 'text-green-600';
    if (currentProfit > 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  // Get progress bar color
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-green-500';
    if (progressPercentage >= 75) return 'bg-blue-500';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  // Initialize with today's target
  useEffect(() => {
    createDailyTarget();
  }, []);

  // Auto-calculate profit from trading performance
  const calculateAutomaticProfit = () => {
    if (!autoCalculationEnabled || isManualMode) return;
    
    try {
      // Get current user's trading metrics (using 'user1' as example)
      const metrics = profitTracker.getProfitFactorMetrics('user1');
      
      if (metrics && metrics.lastUpdated > (lastAutoUpdate || new Date(0))) {
        // Calculate daily profit based on net profit and recent performance
        const dailyProfitEstimate = metrics.grossProfit - metrics.grossLoss;
        const profitChange = dailyProfitEstimate - currentProfit;
        
        if (Math.abs(profitChange) > 0.01) { // Only update if change is significant
          updateProfit(profitChange, 'automatic', 'performance_sync');
          setLastAutoUpdate(new Date());
          setRealTimeMetrics(metrics);
        }
      }
    } catch (error) {
      console.warn('Auto profit calculation failed:', error);
    }
  };

  // Simulate real-time profit updates (for demo) - only in automatic mode
  useEffect(() => {
    if (!isManualMode) {
      const interval = setInterval(() => {
        if (autoCalculationEnabled) {
          // Try to get real trading data first
          calculateAutomaticProfit();
        } else {
          // Fallback to simulation
          const change = (Math.random() - 0.5) * 20; // Random change between -10 and +10
          if (change > 0) {
            updateProfit(change, 'automatic', 'auto_update');
          } else {
            updateLoss(change);
          }
        }
        
        // Auto trading simulation
        if (autoTradingEnabled && dailyGainAchieved < dailyGainLimit) {
          const autoGain = Math.random() * 20 - 5; // Random between -5 and 15
          if (autoGain > 0) {
            updateDailyGain(autoGain);
            updateProfit(autoGain, 'automatic', 'auto_trading');
          }
        }
        
        // Copy trading simulation
        if (copyTradingEnabled && selectedCopyTraders.length > 0) {
          const copyGain = Math.random() * 15 - 3; // Random between -3 and 12
          if (copyGain > 0) {
            updateProfit(copyGain, 'automatic', 'copy_trading');
            updateDailyGain(copyGain * 0.5); // 50% contributes to daily gain
          }
        }
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [dailyTarget, targets, isManualMode, autoCalculationEnabled, lastAutoUpdate, currentProfit, autoTradingEnabled, copyTradingEnabled, selectedCopyTraders, dailyGainAchieved, dailyGainLimit]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Daily Profit Target
          </h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Mode Toggle and Manual Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profit Tracking Mode
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${!isManualMode ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Automatic
            </span>
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isManualMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isManualMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isManualMode ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Manual
            </span>
          </div>
        </div>

        {/* Manual Controls */}
        {isManualMode && (
          <div className="space-y-4">
            {/* Manual Profit Entry */}
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Add/Subtract Profit Amount ($)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={manualProfitInput}
                    onChange={(e) => setManualProfitInput(e.target.value)}
                    placeholder="Enter amount (+ or -)..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleManualProfitEntry}
                    disabled={!manualProfitInput || isNaN(parseFloat(manualProfitInput))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Adjustment Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Set Adjustment Amount
              </label>
              <div className="mb-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
                {/* Preset Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAdjustmentAmount(amount)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
              
              {filteredTraders.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No traders found</p>
                    <p className="text-sm">Try selecting a different category to see available traders.</p>
                  </div>
                </div>
              )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustProfit(-adjustmentAmount)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-1 text-sm"
                >
                  <Minus className="h-3 w-3" />
                  <span>-${adjustmentAmount}</span>
                </button>
                <button
                  onClick={() => adjustProfit(adjustmentAmount)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1 text-sm"
                >
                  <Plus className="h-3 w-3" />
                  <span>+${adjustmentAmount}</span>
                </button>
                <button
                  onClick={() => setProfitAmount(0)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-1 text-sm"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to $0</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Metrics Display */}
        {!isManualMode && autoCalculationEnabled && realTimeMetrics && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Live Trading Performance
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Profit Factor:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {realTimeMetrics.profitFactor.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {realTimeMetrics.winRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {realTimeMetrics.totalTrades}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {lastAutoUpdate?.toLocaleTimeString() || 'Never'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Description */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {isManualMode 
            ? "Manual mode: You control profit updates manually. Automatic updates are disabled."
            : autoCalculationEnabled
              ? "Automatic mode: Profit updates from real trading performance data when available, with simulation fallback."
              : "Automatic mode: Profit updates using simulated trading data for demonstration."
          }
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Profit Progress */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Daily Target
            </span>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ${currentProfit.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Target: ${dailyTarget.toFixed(2)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {progressPercentage.toFixed(1)}% achieved
          </div>
          
          {/* Withdrawal Options */}
          {currentProfit > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={async () => {
                  try {
                    await automatedWorkflowService.manualWithdraw(currentProfit, 'bank');
                  } catch (error) {
                    console.error('Withdrawal failed:', error);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                <ArrowDownLeft className="h-4 w-4" />
                Withdraw Profits
              </button>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Available: ${currentProfit.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Loss Tracking */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Daily Loss
            </span>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600 mb-2">
            ${Math.abs(currentLoss).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Max Loss: ${maxDailyLoss.toFixed(2)}
          </div>
          
          {/* Loss Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.min(lossPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {lossPercentage.toFixed(1)}% of max loss
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Status
            </span>
            {isTargetAchieved ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : isMaxLossReached ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <div className={`text-lg font-bold ${getStatusColor()}`}>
            {isMaxLossReached ? 'Max Loss Reached' :
             isTargetAchieved ? 'Target Achieved!' :
             currentProfit > 0 ? 'In Profit' :
             currentProfit < 0 ? 'In Loss' : 'Neutral'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Net P&L: ${(currentProfit + currentLoss).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Target Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Target Amount ($)
              </label>
              <input
                type="number"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Max Daily Loss */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Daily Loss ($)
              </label>
              <input
                type="number"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>
            </div>

            {/* Auto Stop */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoStop"
                checked={autoStopEnabled}
                onChange={(e) => setAutoStopEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="autoStop" className="text-sm text-gray-700 dark:text-gray-300">
                Auto-stop trading when target/loss reached
              </label>
            </div>

            {/* Auto Calculation */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoCalculation"
                checked={autoCalculationEnabled}
                onChange={(e) => setAutoCalculationEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="autoCalculation" className="text-sm text-gray-700 dark:text-gray-300">
                Auto-calculate from trading performance
              </label>
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="text-sm text-gray-700 dark:text-gray-300">
                Enable notifications
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={resetDaily}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Daily Target</span>
            </button>
            {!isManualMode && (
              <>
                <button
                  onClick={() => updateProfit(100, 'automatic', 'demo_gain')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Demo +$100</span>
                </button>
                <button
                  onClick={() => updateLoss(-50)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
                >
                  <Minus className="h-4 w-4" />
                  <span>Demo -$50</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Profit History */}
      {profitHistory.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profit Update History
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {profitHistory.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <div className="flex items-center space-x-2">
                  {entry.type === 'manual' ? (
                    <Edit3 className="h-3 w-3 text-blue-600" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  )}
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    entry.type === 'manual' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {entry.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    entry.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.amount > 0 ? '+' : ''}${entry.amount.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({entry.action.replace('_', ' ')})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy Trading Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Copy className="h-5 w-5 text-blue-600" />
            <span>Copy Trading</span>
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${!copyTradingEnabled ? 'text-gray-500' : 'text-gray-400'}`}>
              Disabled
            </span>
            <button
              onClick={() => handleCopyTradingToggle(!copyTradingEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                copyTradingEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  copyTradingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${copyTradingEnabled ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Enabled
            </span>
          </div>
        </div>

        {copyTradingEnabled && (
          <div className="space-y-4">
            {/* Copy Trading Allocation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Total Allocation
                </span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  ${copyTradingAllocation.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={copyTradingAllocation}
                onChange={(e) => setCopyTradingAllocation(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mt-1">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Trending Traders Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔥 Trending Traders
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">Top Performers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getTrendingTraders().map((trader) => (
                  <div
                    key={trader.id}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                    onClick={(e) => handleQuickCopy(trader, e)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {trader.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {trader.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {getCategoryIcon(trader.category)} {trader.title || traderCategories.find(cat => cat.id === trader.category)?.label}
                          </div>
                        </div>
                      </div>
                      {trader.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Total Return</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          +{trader.performance.totalReturn.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Win Rate</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {trader.performance.winRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Followers</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {trader.followers.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button className="w-full mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
                      Quick Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Selection Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trader Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as TraderCategory | 'all')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">🌟 All Categories</option>
                {traderCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              {selectedCategory !== 'all' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {traderCategories.find(cat => cat.id === selectedCategory)?.description}
                </p>
              )}
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Traders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, title, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  🌟 All
                </button>
                <button
                  onClick={() => handleCategoryChange(TraderCategory.CELEBRITIES)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === TraderCategory.CELEBRITIES
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                  }`}
                >
                  ⭐ Celebrities
                </button>
                <button
                  onClick={() => handleCategoryChange(TraderCategory.HEDGE_FUNDS)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === TraderCategory.HEDGE_FUNDS
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
                  }`}
                >
                  🏦 Hedge Funds
                </button>
                <button
                  onClick={() => handleCategoryChange(TraderCategory.POLITICIANS)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === TraderCategory.POLITICIANS
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  🏛️ Politicians
                </button>
                <button
                  onClick={() => handleCategoryChange(TraderCategory.PROFESSIONALS)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === TraderCategory.PROFESSIONALS
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  💼 Professionals
                </button>
              </div>
            </div>

            {/* Available Copy Traders */}
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available Traders
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredTraders.length} trader{filteredTraders.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTraders.map((trader) => (
                <div
                  key={trader.id}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCopyTraders.includes(trader.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => toggleCopyTrader(trader.id)}
                  onMouseEnter={() => setHoveredTrader(trader.id)}
                  onMouseLeave={() => setHoveredTrader(null)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {trader.avatar}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs ${getCategoryColor(trader.category)}`}>
                        {getCategoryIcon(trader.category)}
                      </div>
                      {trader.verified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {trader.name}
                        </div>
                        {trader.verified && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </div>
                      {trader.title && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {trader.title}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Users className="h-3 w-3" />
                        <span>{trader.followers.toLocaleString()}</span>
                        <span className={`px-1 py-0.5 rounded text-xs ${
                          trader.riskLevel === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          trader.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {trader.riskLevel}
                        </span>
                      </div>
                    </div>
                    {selectedCopyTraders.includes(trader.id) && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Total Return:</span>
                      <div className="font-medium text-green-600">+{trader.performance.totalReturn}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Win Rate:</span>
                      <div className="font-medium text-gray-900 dark:text-white">{trader.performance.winRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Monthly:</span>
                      <div className="font-medium text-blue-600">+{trader.performance.monthlyReturn}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Max DD:</span>
                      <div className="font-medium text-red-600">{trader.performance.maxDrawdown}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Min. Copy: ${trader.minCopyAmount}
                      </div>
                      <button
                        onClick={(e) => handleQuickCopy(trader, e)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors flex items-center space-x-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover Tooltip */}
                  {hoveredTrader === trader.id && (
                    <div className="absolute top-0 left-full ml-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {trader.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{trader.name}</div>
                          {trader.title && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">{trader.title}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Total Trades</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{trader.totalTrades}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Avg Return</div>
                          <div className="font-semibold text-green-600">+{trader.avgReturn}%</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Followers</div>
                          <div className="font-semibold text-gray-900 dark:text-white">{trader.followers.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Status</div>
                          <div className={`font-semibold capitalize ${
                            trader.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                          }`}>{trader.status}</div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Performance Metrics</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Total Return:</span>
                            <span className="text-xs font-medium text-green-600">+{trader.performance.totalReturn}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Win Rate:</span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">{trader.performance.winRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Monthly Return:</span>
                            <span className="text-xs font-medium text-blue-600">+{trader.performance.monthlyReturn}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Max Drawdown:</span>
                            <span className="text-xs font-medium text-red-600">{trader.performance.maxDrawdown}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auto Trading Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <span>Auto Trading</span>
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${!autoTradingEnabled ? 'text-gray-500' : 'text-gray-400'}`}>
              Disabled
            </span>
            <button
              onClick={() => handleAutoTradingToggle(!autoTradingEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoTradingEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoTradingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${autoTradingEnabled ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
              Enabled
            </span>
          </div>
        </div>

        {autoTradingEnabled && (
          <div className="space-y-4">
            {/* Daily Gain Progress */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Daily Gain Progress
                </span>
                <span className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  ${dailyGainAchieved.toFixed(2)} / ${dailyGainLimit.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${Math.min((dailyGainAchieved / dailyGainLimit) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {((dailyGainAchieved / dailyGainLimit) * 100).toFixed(1)}% of daily limit achieved
              </div>
            </div>

            {/* Auto Trading Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Gain Limit ($)
                </label>
                <input
                  type="number"
                  value={dailyGainLimit}
                  onChange={(e) => setDailyGainLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  step="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Level
                </label>
                <select
                  value={autoTradingRiskLevel}
                  onChange={(e) => setAutoTradingRiskLevel(e.target.value as 'conservative' | 'moderate' | 'aggressive')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>

            {/* Auto Stop Settings */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoStopOnTarget"
                checked={autoStopOnTarget}
                onChange={(e) => setAutoStopOnTarget(e.target.checked)}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded"
              />
              <label htmlFor="autoStopOnTarget" className="text-sm text-gray-700 dark:text-gray-300">
                Auto-stop when daily gain limit is reached
              </label>
            </div>

            {/* Auto Trading Status */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Trading Status
                </span>
                <div className="flex items-center space-x-2">
                  {autoTradingEnabled ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-500">Inactive</span>
                    </>
                  )}
                </div>
              </div>
              {dailyGainAchieved >= dailyGainLimit && autoStopOnTarget && (
                <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                  ⚠️ Auto trading will stop when daily limit is reached
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Targets History */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Targets
        </h3>
        <div className="space-y-3">
          {targets.slice(-5).reverse().map((target) => (
            <div key={target.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {target.date}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Target: ${target.targetAmount}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  target.currentProfit >= target.targetAmount ? 'text-green-600' :
                  target.currentProfit > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  ${target.currentProfit.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {target.isActive ? 'Active' : 'Completed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Trader Confirmation Modal */}
      {showCopyModal && selectedTraderToCopy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Copy Trader
              </h3>
              <button
                onClick={cancelCopy}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedTraderToCopy.avatar}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {selectedTraderToCopy.name}
                  </h4>
                  {selectedTraderToCopy.title && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedTraderToCopy.title}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total Return:</span>
                  <div className="font-medium text-green-600">
                    +{selectedTraderToCopy.performance.totalReturn}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Win Rate:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedTraderToCopy.performance.winRate}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
                  <div className={`font-medium capitalize ${
                    selectedTraderToCopy.riskLevel === 'low' ? 'text-green-600' :
                    selectedTraderToCopy.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {selectedTraderToCopy.riskLevel}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Min Amount:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${selectedTraderToCopy.minCopyAmount}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Copy Amount ($)
              </label>
              <input
                type="number"
                value={copyAmount}
                onChange={(e) => setCopyAmount(Number(e.target.value))}
                min={selectedTraderToCopy.minCopyAmount}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={`Min: $${selectedTraderToCopy.minCopyAmount}`}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelCopy}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCopy}
                disabled={copyAmount < selectedTraderToCopy.minCopyAmount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitTargetSettings;