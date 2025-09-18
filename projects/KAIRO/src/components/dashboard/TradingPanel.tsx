'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Bot,
  Settings,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Layers,
  Shield
} from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
}

interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  timestamp: Date;
  filled: number;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  pnl: number;
  drawdown: number;
}

interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: Date;
  status: 'active' | 'executed' | 'expired';
}

export default function TradingPanel() {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto' | 'signals' | 'orders'>('manual');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [riskAmount, setRiskAmount] = useState('100');
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);

  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: 'AAPL',
      price: 185.25,
      change: 2.85,
      changePercent: 1.56,
      volume: 45678900,
      high24h: 187.50,
      low24h: 182.10
    },
    {
      symbol: 'TSLA',
      price: 245.80,
      change: -5.25,
      changePercent: -2.09,
      volume: 32456700,
      high24h: 252.30,
      low24h: 243.50
    },
    {
      symbol: 'BTC',
      price: 43250.00,
      change: 850.00,
      changePercent: 2.01,
      volume: 28945600,
      high24h: 44100.00,
      low24h: 42100.00
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      orderType: 'limit',
      quantity: 100,
      price: 180.00,
      status: 'pending',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      filled: 0
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'sell',
      orderType: 'market',
      quantity: 50,
      status: 'filled',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      filled: 50
    }
  ]);

  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'GainzAlgo V2 Pro',
      description: 'High-frequency momentum strategy with 78% win rate',
      status: 'active',
      winRate: 78.5,
      profitFactor: 1.85,
      totalTrades: 247,
      pnl: 12450.75,
      drawdown: 3.2
    },
    {
      id: '2',
      name: 'Crypto Scalper',
      description: 'Short-term crypto trading with automated risk management',
      status: 'paused',
      winRate: 72.3,
      profitFactor: 1.62,
      totalTrades: 189,
      pnl: 8920.50,
      drawdown: 5.8
    }
  ]);

  const [signals, setSignals] = useState<Signal[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      confidence: 85,
      entry: 184.50,
      stopLoss: 180.00,
      takeProfit: 192.00,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      symbol: 'BTC',
      type: 'sell',
      confidence: 78,
      entry: 43100.00,
      stopLoss: 44500.00,
      takeProfit: 41200.00,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'active'
    }
  ]);

  const currentMarketData = marketData.find(data => data.symbol === selectedSymbol);

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      type: tradeType,
      orderType,
      quantity: parseFloat(quantity),
      price: orderType !== 'market' ? parseFloat(price) : undefined,
      status: 'pending',
      timestamp: new Date(),
      filled: 0
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // Reset form
    setQuantity('');
    setPrice('');
  };

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: strategy.status === 'active' ? 'paused' : 'active' }
        : strategy
    ));
  };

  const executeSignal = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, status: 'executed' }
        : signal
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'paused': return 'text-yellow-600 dark:text-yellow-400';
      case 'stopped': return 'text-red-600 dark:text-red-400';
      case 'pending': return 'text-blue-600 dark:text-blue-400';
      case 'filled': return 'text-green-600 dark:text-green-400';
      case 'cancelled': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'stopped': return <Square className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'filled': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trading Panel</h2>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              autoTradingEnabled 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              <Bot className="h-4 w-4" />
              <span>Auto Trading {autoTradingEnabled ? 'ON' : 'OFF'}</span>
            </div>
            <button
              onClick={() => setAutoTradingEnabled(!autoTradingEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoTradingEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoTradingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'manual', label: 'Manual Trading', icon: Target },
            { id: 'auto', label: 'Auto Strategies', icon: Bot },
            { id: 'signals', label: 'Signals', icon: Zap },
            { id: 'orders', label: 'Orders', icon: Layers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'manual' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Place Order</h3>
                
                {/* Symbol Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symbol
                  </label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {marketData.map((data) => (
                      <option key={data.symbol} value={data.symbol}>
                        {data.symbol} - {formatCurrency(data.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trade Type */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tradeType === 'buy'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        tradeType === 'sell'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Order Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Type
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price (for limit/stop orders) */}
                {orderType !== 'market' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Risk Management */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stop Loss
                    </label>
                    <input
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      placeholder="Stop loss"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Take Profit
                    </label>
                    <input
                      type="number"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      placeholder="Take profit"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!quantity || (orderType !== 'market' && !price)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'buy'
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                      : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                  } text-white disabled:cursor-not-allowed`}
                >
                  Place {tradeType.toUpperCase()} Order
                </button>
              </div>
            </div>

            {/* Market Data */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Data</h3>
              {currentMarketData && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentMarketData.symbol}
                    </h4>
                    <div className={`flex items-center space-x-1 ${
                      currentMarketData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {currentMarketData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium">{formatPercent(currentMarketData.changePercent)}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {formatCurrency(currentMarketData.price)}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">24h High</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(currentMarketData.high24h)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">24h Low</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(currentMarketData.low24h)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Volume</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {currentMarketData.volume.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Change</p>
                      <p className={`font-medium ${
                        currentMarketData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(currentMarketData.change)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'auto' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Automated Strategies</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Add Strategy
              </button>
            </div>
            
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{strategy.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{strategy.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center space-x-1 text-sm font-medium ${getStatusColor(strategy.status)}`}>
                        {getStatusIcon(strategy.status)}
                        <span className="capitalize">{strategy.status}</span>
                      </span>
                      <button
                        onClick={() => toggleStrategy(strategy.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          strategy.status === 'active'
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/40'
                        }`}
                      >
                        {strategy.status === 'active' ? 'Pause' : 'Start'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {strategy.winRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {strategy.profitFactor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {strategy.totalTrades}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">P&L</p>
                      <p className={`text-lg font-semibold ${
                        strategy.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(strategy.pnl)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Drawdown</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        -{strategy.drawdown}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trading Signals</h3>
            
            <div className="space-y-4">
              {signals.map((signal) => (
                <div key={signal.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        signal.type === 'buy' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {signal.type === 'buy' ? (
                          <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {signal.type.toUpperCase()} {signal.symbol}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Confidence: {signal.confidence}% • {signal.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    {signal.status === 'active' && (
                      <button
                        onClick={() => executeSignal(signal.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          signal.type === 'buy'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        Execute
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Entry Price</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(signal.entry)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Stop Loss</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(signal.stopLoss)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Take Profit</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(signal.takeProfit)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Management</h3>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        order.type === 'buy' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {order.type === 'buy' ? (
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {order.type.toUpperCase()} {order.symbol}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.orderType.toUpperCase()} • {order.quantity} shares
                          {order.price && ` @ ${formatCurrency(order.price)}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {order.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                      {order.status === 'partial' && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Filled: {order.filled}/{order.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}