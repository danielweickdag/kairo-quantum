'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Calendar, Settings, AlertTriangle, CheckCircle, Edit3, RotateCcw, Plus, Minus, Activity } from 'lucide-react';
import ProfitFactorTrackingSystem from '../../src/services/profitFactorTrackingSystem';

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

interface ProfitTargetSettingsProps {
  onTargetUpdate?: (target: ProfitTarget) => void;
  onTargetAchieved?: (target: ProfitTarget) => void;
}

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
      id: Date.now().toString(),
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
    createDailyTarget();
  };

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
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [dailyTarget, targets, isManualMode, autoCalculationEnabled, lastAutoUpdate, currentProfit]);

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
    </div>
  );
};

export default ProfitTargetSettings;