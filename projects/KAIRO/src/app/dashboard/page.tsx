'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import TradingPanel from '@/components/dashboard/TradingPanel';
import AutomatedStrategies from '@/components/dashboard/AutomatedStrategies';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import AISignalGenerator from '@/components/dashboard/AISignalGenerator';
import StrategyTemplates from '@/components/dashboard/StrategyTemplates';
import SignalDeliverySystem from '@/components/dashboard/SignalDeliverySystem';
import BacktestingEngine from '@/components/dashboard/BacktestingEngine';
import PerformanceAnalytics from '@/components/dashboard/PerformanceAnalytics';
import BrokerAccountSelector from '@/components/BrokerAccountSelector';
import { useBrokerAccount } from '@/contexts/BrokerAccountContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bot,
  Target,
  Zap,
  BarChart3,
  Activity,
  Bell,
  Star,
  Shield,
  Brain,
  BookOpen
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { selectedAccount, setSelectedAccount } = useBrokerAccount();
  const [activeView, setActiveView] = useState<'overview' | 'trading' | 'automation' | 'strategies' | 'ai-signals' | 'templates' | 'signals' | 'backtesting' | 'performance-analytics'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gainzAlgoActive, setGainzAlgoActive] = useState(false);
  const [copyTradingActive, setCopyTradingActive] = useState(false);
  const [riskManagementActive, setRiskManagementActive] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('idle'); // idle, partial, active, optimized

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Workflow automation effects
  useEffect(() => {
    if (gainzAlgoActive) {
      alert('🚀 GainzAlgo V2 Pro Strategy Activated!\n\n✅ High-frequency momentum trading enabled\n✅ 78% win rate target active\n✅ 1.85x profit factor optimization\n✅ Real-time signal generation started');
    }
  }, [gainzAlgoActive]);

  useEffect(() => {
    if (copyTradingActive) {
      alert('👥 Copy Trading Enabled!\n\n✅ Following top traders\n✅ Automatic trade copying active\n✅ Portfolio synchronization started\n✅ Risk management applied to copied trades');
    }
  }, [copyTradingActive]);

  useEffect(() => {
    if (riskManagementActive) {
      alert('🛡️ Risk Management Controls Activated!\n\n✅ Automated stop-loss enabled\n✅ Position sizing optimization\n✅ Drawdown protection active\n✅ Real-time risk monitoring started');
    }
  }, [riskManagementActive]);

  // Workflow coordination - automatically update status based on active features
  useEffect(() => {
    const activeFeatures = [gainzAlgoActive, copyTradingActive, riskManagementActive].filter(Boolean).length;
    
    if (activeFeatures === 0) {
      setWorkflowStatus('idle');
    } else if (activeFeatures === 1) {
      setWorkflowStatus('partial');
    } else if (activeFeatures === 2) {
      setWorkflowStatus('active');
    } else if (activeFeatures === 3) {
      setWorkflowStatus('optimized');
      // Show comprehensive workflow activation message
      setTimeout(() => {
        alert('🎯 Complete Trading Workflow Activated!\n\n🚀 GainzAlgo V2 Pro: High-frequency momentum trading\n👥 Copy Trading: Following top performers\n🛡️ Risk Management: Advanced protection\n\n✨ All systems are now working together seamlessly!\n📈 Maximum profit potential with optimal risk control');
      }, 500);
    }
  }, [gainzAlgoActive, copyTradingActive, riskManagementActive]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.firstName}! 🚀
              </h1>
              <p className="text-blue-100">
                Your trading performance is looking strong today. Ready to make some moves?
              </p>
              {/* Broker Account Selector */}
              <div className="mt-4 max-w-md">
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Active Broker Account
                </label>
                <BrokerAccountSelector
                  selectedAccount={selectedAccount}
                  onAccountSelect={setSelectedAccount}
                  placeholder="Select your trading account"
                  className="text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">78.5%</p>
                  <p className="text-sm text-blue-100">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">1.85x</p>
                  <p className="text-sm text-blue-100">Profit Factor</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">#12</p>
                  <p className="text-sm text-blue-100">Global Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Status Indicator */}
        <div className={`rounded-lg p-4 border-2 transition-all duration-300 ${
          workflowStatus === 'idle' ? 'bg-gray-50 border-gray-200' :
          workflowStatus === 'partial' ? 'bg-yellow-50 border-yellow-300' :
          workflowStatus === 'active' ? 'bg-blue-50 border-blue-300' :
          'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                workflowStatus === 'idle' ? 'bg-gray-400' :
                workflowStatus === 'partial' ? 'bg-yellow-500 animate-pulse' :
                workflowStatus === 'active' ? 'bg-blue-500 animate-pulse' :
                'bg-green-500 animate-pulse'
              }`}></div>
              <div>
                <h3 className={`font-semibold ${
                  workflowStatus === 'idle' ? 'text-gray-700' :
                  workflowStatus === 'partial' ? 'text-yellow-700' :
                  workflowStatus === 'active' ? 'text-blue-700' :
                  'text-green-700'
                }`}>
                  Trading Workflow Status: {
                    workflowStatus === 'idle' ? 'Standby' :
                    workflowStatus === 'partial' ? 'Partially Active' :
                    workflowStatus === 'active' ? 'Active' :
                    'Fully Optimized'
                  }
                </h3>
                <p className={`text-sm ${
                  workflowStatus === 'idle' ? 'text-gray-600' :
                  workflowStatus === 'partial' ? 'text-yellow-600' :
                  workflowStatus === 'active' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {
                    workflowStatus === 'idle' ? 'Enable features below to start automated trading' :
                    workflowStatus === 'partial' ? 'Some automation features are active' :
                    workflowStatus === 'active' ? 'Multiple systems working together' :
                    'All automation systems fully integrated and optimized'
                  }
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {gainzAlgoActive && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">GainzAlgo</span>}
              {copyTradingActive && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Copy Trading</span>}
              {riskManagementActive && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Risk Control</span>}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Strategies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-sm text-green-600 dark:text-green-400">2 profitable</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Positions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">8 in profit</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Signals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">High confidence</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Copiers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">+8 today</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Portfolio Overview</span>
            </button>
            <button
              onClick={() => setActiveView('trading')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'trading'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Target className="h-5 w-5" />
              <span>Trading Panel</span>
            </button>
            <button
              onClick={() => setActiveView('strategies')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'strategies'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span>Strategies</span>
            </button>
            <button
              onClick={() => setActiveView('automation')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'automation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span>Automation Hub</span>
            </button>
            <button
              onClick={() => setActiveView('ai-signals')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'ai-signals'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Brain className="h-5 w-5" />
              <span>AI Signals</span>
            </button>
            <button
               onClick={() => setActiveView('templates')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'templates'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <BookOpen className="h-5 w-5" />
               <span>Templates</span>
             </button>
             <button
               onClick={() => setActiveView('signals')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'signals'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <Zap className="h-5 w-5" />
               <span>Signals</span>
             </button>
             <button
               onClick={() => setActiveView('backtesting')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'backtesting'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <BarChart3 className="h-5 w-5" />
               <span>Backtesting</span>
             </button>
             <button
               onClick={() => setActiveView('performance-analytics')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'performance-analytics'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <Activity className="h-5 w-5" />
               <span>Performance</span>
             </button>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'overview' && <PortfolioOverview />}
        {activeView === 'trading' && <TradingPanel />}
        {activeView === 'strategies' && <AutomatedStrategies />}
        {activeView === 'ai-signals' && <AISignalGenerator />}
         {activeView === 'templates' && <StrategyTemplates />}
         {activeView === 'signals' && <SignalDeliverySystem />}
         {activeView === 'backtesting' && <BacktestingEngine />}
         {activeView === 'performance-analytics' && <PerformanceAnalytics />}
        {activeView === 'automation' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Automation Hub Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Advanced automation features including strategy builders, copy trading management, and AI-powered signals are being developed.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Join Waitlist
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-6 w-6" />
              <h3 className="text-lg font-semibold">GainzAlgo V2 Pro</h3>
            </div>
            <p className="text-green-100 text-sm mb-4">
              High-frequency momentum strategy with 78% win rate and 1.85x profit factor
            </p>
            <button 
              onClick={() => setGainzAlgoActive(!gainzAlgoActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                gainzAlgoActive 
                  ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                  : 'bg-white text-green-600 hover:bg-gray-100'
              }`}
            >
              {gainzAlgoActive ? 'Deactivate Strategy' : 'Activate Strategy'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Copy Trading</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Follow top traders and automatically copy their winning strategies
            </p>
            <button 
              onClick={() => setCopyTradingActive(!copyTradingActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                copyTradingActive 
                  ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' 
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {copyTradingActive ? 'Disable Copy Trading' : 'Enable Copy Trading'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Risk Management</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Advanced risk controls with automated stop-loss and position sizing
            </p>
            <button 
              onClick={() => setRiskManagementActive(!riskManagementActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                riskManagementActive 
                  ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              {riskManagementActive ? 'Risk Controls Active' : 'Enable Risk Controls'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </DashboardLayout>
  );
}