'use client';

import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Zap, Settings, Filter } from 'lucide-react';

interface Signal {
  id: string;
  type: 'buy' | 'sell' | 'alert' | 'news';
  symbol: string;
  price: number;
  confidence: number;
  source: 'AI' | 'Technical' | 'Fundamental' | 'Copy Trading';
  timestamp: Date;
  message: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'executed' | 'expired';
}

interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  minConfidence: number;
  priorityFilter: string[];
  sourceFilter: string[];
}

const SignalDeliverySystem: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePush: true,
    enableEmail: false,
    enableSMS: false,
    minConfidence: 70,
    priorityFilter: ['high', 'medium'],
    sourceFilter: ['AI', 'Technical']
  });
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isConnected, setIsConnected] = useState(true);

  // Mock real-time signal generation
  useEffect(() => {
    const generateMockSignal = () => {
      const symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'GOOGL', 'EUR/USD'];
      const types: Signal['type'][] = ['buy', 'sell', 'alert', 'news'];
      const sources: Signal['source'][] = ['AI', 'Technical', 'Fundamental', 'Copy Trading'];
      const priorities: Signal['priority'][] = ['high', 'medium', 'low'];
      
      const newSignal: Signal = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        price: Math.random() * 50000 + 1000,
        confidence: Math.floor(Math.random() * 40) + 60,
        source: sources[Math.floor(Math.random() * sources.length)],
        timestamp: new Date(),
        message: generateSignalMessage(),
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: 'new'
      };
      
      setSignals(prev => [newSignal, ...prev.slice(0, 49)]); // Keep last 50 signals
    };

    const generateSignalMessage = () => {
      const messages = [
        'Strong bullish momentum detected',
        'Resistance level breakthrough imminent',
        'Support level holding strong',
        'Volume spike indicates potential breakout',
        'RSI oversold condition - potential reversal',
        'Moving average crossover signal',
        'High volatility expected in next session',
        'Institutional buying pressure detected'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    // Generate initial signals
    for (let i = 0; i < 10; i++) {
      setTimeout(() => generateMockSignal(), i * 1000);
    }

    // Continue generating signals every 15-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to generate signal
        generateMockSignal();
      }
    }, Math.random() * 15000 + 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    if (filter === 'unread') return signal.status === 'new';
    if (filter === 'high-priority') return signal.priority === 'high';
    return signal.type === filter;
  });

  const acknowledgeSignal = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId ? { ...signal, status: 'acknowledged' } : signal
    ));
  };

  const executeSignal = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId ? { ...signal, status: 'executed' } : signal
    ));
  };

  const getSignalIcon = (type: Signal['type']) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'news': return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Signal['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
    }
  };

  const getStatusBadge = (status: Signal['status']) => {
    switch (status) {
      case 'new': return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>;
      case 'acknowledged': return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Acknowledged</span>;
      case 'executed': return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Executed</span>;
      case 'expired': return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Expired</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Signal Delivery</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time trading signals and notifications</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Delivery Methods</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enablePush}
                    onChange={(e) => setSettings(prev => ({ ...prev, enablePush: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableEmail: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email Alerts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableSMS}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableSMS: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Filters</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Confidence: {settings.minConfidence}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={settings.minConfidence}
                    onChange={(e) => setSettings(prev => ({ ...prev, minConfidence: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All Signals' },
          { key: 'unread', label: 'Unread' },
          { key: 'high-priority', label: 'High Priority' },
          { key: 'buy', label: 'Buy Signals' },
          { key: 'sell', label: 'Sell Signals' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Signals List */}
      <div className="space-y-3">
        {filteredSignals.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No signals match your current filter</p>
          </div>
        ) : (
          filteredSignals.map(signal => (
            <div
              key={signal.id}
              className={`border-l-4 rounded-lg p-4 ${getPriorityColor(signal.priority)} border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getSignalIcon(signal.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{signal.symbol}</span>
                      <span className="text-sm text-gray-500">${signal.price.toFixed(2)}</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {signal.confidence}% confidence
                      </span>
                      {getStatusBadge(signal.status)}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{signal.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{signal.timestamp.toLocaleTimeString()}</span>
                      </span>
                      <span>Source: {signal.source}</span>
                      <span className={`capitalize ${signal.priority === 'high' ? 'text-red-600' : signal.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {signal.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {signal.status === 'new' && (
                    <>
                      <button
                        onClick={() => acknowledgeSignal(signal.id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        Acknowledge
                      </button>
                      {(signal.type === 'buy' || signal.type === 'sell') && (
                        <button
                          onClick={() => executeSignal(signal.id)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                        >
                          Execute
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{signals.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Signals</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-green-600">
            {signals.filter(s => s.status === 'executed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Executed</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {signals.filter(s => s.status === 'new').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length || 0)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</div>
        </div>
      </div>
    </div>
  );
};

export default SignalDeliverySystem;