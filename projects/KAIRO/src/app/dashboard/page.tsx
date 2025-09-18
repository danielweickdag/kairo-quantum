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
  const [activeView, setActiveView] = useState<'overview' | 'trading' | 'automation' | 'strategies' | 'ai-signals' | 'templates' | 'signals' | 'backtesting' | 'performance-analytics'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
            <button className="bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Activate Strategy
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
            <button className="bg-white text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Explore Traders
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
            <button className="bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Configure Limits
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