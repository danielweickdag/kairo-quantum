'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calculator, Calendar, Target, Shield, BarChart3, Settings, Plus, Minus, AlertCircle, Info } from 'lucide-react';

interface OptionContract {
  id: string;
  symbol: string;
  underlying: string;
  strike: number;
  expiry: string;
  type: 'CALL' | 'PUT';
  bid: number;
  ask: number;
  lastPrice: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  intrinsicValue: number;
  timeValue: number;
}

interface OptionPosition {
  id: string;
  contractId: string;
  symbol: string;
  underlying: string;
  strike: number;
  expiry: string;
  type: 'CALL' | 'PUT';
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  openTime: string;
}

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  legs: {
    type: 'CALL' | 'PUT';
    side: 'BUY' | 'SELL';
    strike: number;
    quantity: number;
  }[];
  maxProfit: number | null;
  maxLoss: number | null;
  breakeven: number[];
}

const OptionsTrading: React.FC = () => {
  const [optionChain, setOptionChain] = useState<OptionContract[]>([]);
  const [positions, setPositions] = useState<OptionPosition[]>([]);
  const [selectedUnderlying, setSelectedUnderlying] = useState('AAPL');
  const [selectedExpiry, setSelectedExpiry] = useState('2024-02-16');
  const [selectedTab, setSelectedTab] = useState<'chain' | 'positions' | 'strategies'>('chain');
  const [underlyingPrice, setUnderlyingPrice] = useState(192.85);
  const [accountBalance, setAccountBalance] = useState(50000);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [showGreeks, setShowGreeks] = useState(true);

  // Strategy templates
  const strategyTemplates: StrategyTemplate[] = [
    {
      id: 'long-call',
      name: 'Long Call',
      description: 'Bullish strategy with unlimited upside potential',
      legs: [{ type: 'CALL', side: 'BUY', strike: 195, quantity: 1 }],
      maxProfit: null,
      maxLoss: 500,
      breakeven: [195.5]
    },
    {
      id: 'long-put',
      name: 'Long Put',
      description: 'Bearish strategy with high profit potential',
      legs: [{ type: 'PUT', side: 'BUY', strike: 190, quantity: 1 }],
      maxProfit: 18500,
      maxLoss: 450,
      breakeven: [185.5]
    },
    {
      id: 'covered-call',
      name: 'Covered Call',
      description: 'Generate income from stock holdings',
      legs: [{ type: 'CALL', side: 'SELL', strike: 200, quantity: 1 }],
      maxProfit: 1200,
      maxLoss: null,
      breakeven: [191.8]
    },
    {
      id: 'bull-call-spread',
      name: 'Bull Call Spread',
      description: 'Limited risk, limited reward bullish strategy',
      legs: [
        { type: 'CALL', side: 'BUY', strike: 190, quantity: 1 },
        { type: 'CALL', side: 'SELL', strike: 200, quantity: 1 }
      ],
      maxProfit: 800,
      maxLoss: 200,
      breakeven: [192]
    },
    {
      id: 'iron-condor',
      name: 'Iron Condor',
      description: 'Neutral strategy for range-bound markets',
      legs: [
        { type: 'PUT', side: 'SELL', strike: 185, quantity: 1 },
        { type: 'PUT', side: 'BUY', strike: 180, quantity: 1 },
        { type: 'CALL', side: 'SELL', strike: 200, quantity: 1 },
        { type: 'CALL', side: 'BUY', strike: 205, quantity: 1 }
      ],
      maxProfit: 300,
      maxLoss: 200,
      breakeven: [187, 198]
    },
    {
      id: 'straddle',
      name: 'Long Straddle',
      description: 'Profit from high volatility in either direction',
      legs: [
        { type: 'CALL', side: 'BUY', strike: 195, quantity: 1 },
        { type: 'PUT', side: 'BUY', strike: 195, quantity: 1 }
      ],
      maxProfit: null,
      maxLoss: 950,
      breakeven: [185.5, 204.5]
    }
  ];

  // Mock option chain data
  const generateOptionChain = (underlying: string, underlyingPrice: number, expiry: string): OptionContract[] => {
    const strikes = [];
    const baseStrike = Math.round(underlyingPrice / 5) * 5;
    
    for (let i = -10; i <= 10; i++) {
      strikes.push(baseStrike + (i * 5));
    }
    
    const options: OptionContract[] = [];
    const daysToExpiry = Math.max(1, Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const timeToExpiry = daysToExpiry / 365;
    
    strikes.forEach((strike, index) => {
      // Calculate basic Greeks and pricing (simplified Black-Scholes approximation)
      const moneyness = underlyingPrice / strike;
      const isITM = (type: 'CALL' | 'PUT') => 
        type === 'CALL' ? underlyingPrice > strike : underlyingPrice < strike;
      
      // Call option
      const callIntrinsic = Math.max(0, underlyingPrice - strike);
      const callTimeValue = Math.max(0.05, Math.sqrt(timeToExpiry) * Math.abs(underlyingPrice - strike) * 0.2);
      const callPrice = callIntrinsic + callTimeValue;
      const callDelta = moneyness > 1 ? 0.7 - (moneyness - 1) * 0.3 : 0.3 + (moneyness - 0.8) * 0.4;
      
      options.push({
        id: `${underlying}-${strike}-${expiry}-CALL`,
        symbol: `${underlying}${expiry.replace(/-/g, '')}C${strike}`,
        underlying,
        strike,
        expiry,
        type: 'CALL',
        bid: callPrice - 0.05,
        ask: callPrice + 0.05,
        lastPrice: callPrice,
        volume: Math.floor(Math.random() * 1000) + 100,
        openInterest: Math.floor(Math.random() * 5000) + 500,
        impliedVolatility: 0.15 + Math.random() * 0.3,
        delta: Math.max(0.01, Math.min(0.99, callDelta)),
        gamma: 0.01 + Math.random() * 0.05,
        theta: -(0.01 + Math.random() * 0.05),
        vega: 0.05 + Math.random() * 0.15,
        rho: 0.01 + Math.random() * 0.03,
        intrinsicValue: callIntrinsic,
        timeValue: callTimeValue
      });
      
      // Put option
      const putIntrinsic = Math.max(0, strike - underlyingPrice);
      const putTimeValue = Math.max(0.05, Math.sqrt(timeToExpiry) * Math.abs(strike - underlyingPrice) * 0.2);
      const putPrice = putIntrinsic + putTimeValue;
      const putDelta = -(1 - Math.max(0.01, Math.min(0.99, callDelta)));
      
      options.push({
        id: `${underlying}-${strike}-${expiry}-PUT`,
        symbol: `${underlying}${expiry.replace(/-/g, '')}P${strike}`,
        underlying,
        strike,
        expiry,
        type: 'PUT',
        bid: putPrice - 0.05,
        ask: putPrice + 0.05,
        lastPrice: putPrice,
        volume: Math.floor(Math.random() * 1000) + 100,
        openInterest: Math.floor(Math.random() * 5000) + 500,
        impliedVolatility: 0.15 + Math.random() * 0.3,
        delta: putDelta,
        gamma: 0.01 + Math.random() * 0.05,
        theta: -(0.01 + Math.random() * 0.05),
        vega: 0.05 + Math.random() * 0.15,
        rho: -(0.01 + Math.random() * 0.03),
        intrinsicValue: putIntrinsic,
        timeValue: putTimeValue
      });
    });
    
    return options;
  };

  // Mock positions
  const mockPositions: OptionPosition[] = [
    {
      id: '1',
      contractId: 'AAPL-195-2024-02-16-CALL',
      symbol: 'AAPL240216C195',
      underlying: 'AAPL',
      strike: 195,
      expiry: '2024-02-16',
      type: 'CALL',
      side: 'BUY',
      quantity: 2,
      entryPrice: 4.50,
      currentPrice: 5.20,
      unrealizedPnL: 140,
      delta: 0.65,
      gamma: 0.03,
      theta: -0.02,
      vega: 0.08,
      openTime: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      contractId: 'AAPL-190-2024-02-16-PUT',
      symbol: 'AAPL240216P190',
      underlying: 'AAPL',
      strike: 190,
      expiry: '2024-02-16',
      type: 'PUT',
      side: 'SELL',
      quantity: 1,
      entryPrice: 3.20,
      currentPrice: 2.80,
      unrealizedPnL: 40,
      delta: -0.35,
      gamma: 0.02,
      theta: 0.015,
      vega: -0.06,
      openTime: '2024-01-15T14:20:00Z'
    }
  ];

  // Initialize data
  useEffect(() => {
    const chain = generateOptionChain(selectedUnderlying, underlyingPrice, selectedExpiry);
    setOptionChain(chain);
    setPositions(mockPositions);
  }, [selectedUnderlying, selectedExpiry, underlyingPrice]);

  // Calculate portfolio Greeks
  const calculatePortfolioGreeks = () => {
    return positions.reduce(
      (acc, pos) => {
        const multiplier = pos.side === 'BUY' ? pos.quantity : -pos.quantity;
        return {
          delta: acc.delta + pos.delta * multiplier * 100,
          gamma: acc.gamma + pos.gamma * multiplier * 100,
          theta: acc.theta + pos.theta * multiplier * 100,
          vega: acc.vega + pos.vega * multiplier * 100
        };
      },
      { delta: 0, gamma: 0, theta: 0, vega: 0 }
    );
  };

  // Format number with appropriate decimals
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  // Get moneyness color
  const getMoneynessColor = (option: OptionContract) => {
    const isITM = option.type === 'CALL' 
      ? underlyingPrice > option.strike 
      : underlyingPrice < option.strike;
    
    if (isITM) return 'bg-green-50 dark:bg-green-900/20';
    if (Math.abs(underlyingPrice - option.strike) <= 5) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-gray-50 dark:bg-gray-900/20';
  };

  // Group options by strike
  const groupedOptions = optionChain.reduce((acc, option) => {
    if (!acc[option.strike]) {
      acc[option.strike] = { calls: [], puts: [] };
    }
    if (option.type === 'CALL') {
      acc[option.strike].calls.push(option);
    } else {
      acc[option.strike].puts.push(option);
    }
    return acc;
  }, {} as Record<number, { calls: OptionContract[], puts: OptionContract[] }>);

  const strikes = Object.keys(groupedOptions).map(Number).sort((a, b) => a - b);
  const portfolioGreeks = calculatePortfolioGreeks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Options Trading
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div>Account Balance: <span className="font-semibold text-gray-900 dark:text-white">${formatNumber(accountBalance)}</span></div>
            <div>{selectedUnderlying}: <span className="font-semibold text-gray-900 dark:text-white">${formatNumber(underlyingPrice)}</span></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Underlying
            </label>
            <select
              value={selectedUnderlying}
              onChange={(e) => setSelectedUnderlying(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="AAPL">AAPL</option>
              <option value="TSLA">TSLA</option>
              <option value="MSFT">MSFT</option>
              <option value="GOOGL">GOOGL</option>
              <option value="AMZN">AMZN</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiration
            </label>
            <select
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="2024-02-16">Feb 16, 2024</option>
              <option value="2024-03-15">Mar 15, 2024</option>
              <option value="2024-04-19">Apr 19, 2024</option>
              <option value="2024-06-21">Jun 21, 2024</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showGreeks}
              onChange={(e) => setShowGreeks(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Greeks</span>
          </label>
        </div>
      </div>

      {/* Portfolio Greeks Summary */}
      {positions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Portfolio Greeks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(portfolioGreeks.delta)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Delta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatNumber(portfolioGreeks.gamma)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Gamma</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatNumber(portfolioGreeks.theta)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Theta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(portfolioGreeks.vega)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Vega</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'chain', label: 'Option Chain', icon: BarChart3 },
            { id: 'positions', label: 'Positions', icon: Shield },
            { id: 'strategies', label: 'Strategies', icon: Target }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Option Chain */}
      {selectedTab === 'chain' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th colSpan={showGreeks ? 8 : 4} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                    Calls
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Strike
                  </th>
                  <th colSpan={showGreeks ? 8 : 4} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">
                    Puts
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Bid</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Ask</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Last</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Vol</th>
                  {showGreeks && (
                    <>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Δ</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Γ</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Θ</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">ν</th>
                    </>
                  )}
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Strike</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-600">Bid</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Ask</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Last</th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Vol</th>
                  {showGreeks && (
                    <>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Δ</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Γ</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Θ</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">ν</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {strikes.map((strike) => {
                  const callOption = groupedOptions[strike]?.calls[0];
                  const putOption = groupedOptions[strike]?.puts[0];
                  const isATM = Math.abs(underlyingPrice - strike) <= 2.5;
                  
                  return (
                    <tr key={strike} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isATM ? 'bg-blue-50 dark:bg-blue-900/20' : getMoneynessColor(callOption || putOption!)
                    }`}>
                      {/* Call Option */}
                      {callOption ? (
                        <>
                          <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(callOption.bid)}</td>
                          <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(callOption.ask)}</td>
                          <td className="px-2 py-2 text-sm font-medium text-gray-900 dark:text-white">{formatNumber(callOption.lastPrice)}</td>
                          <td className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">{callOption.volume}</td>
                          {showGreeks && (
                            <>
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(callOption.delta, 3)}</td>
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(callOption.gamma, 3)}</td>
                              <td className="px-2 py-2 text-sm text-red-600">{formatNumber(callOption.theta, 3)}</td>
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">{formatNumber(callOption.vega, 3)}</td>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <td colSpan={showGreeks ? 8 : 4} className="px-2 py-2"></td>
                        </>
                      )}
                      
                      {/* Strike Price */}
                      <td className={`px-4 py-2 text-sm font-bold text-center ${
                        isATM ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                      }`}>
                        {strike}
                      </td>
                      
                      {/* Put Option */}
                      {putOption ? (
                        <>
                          <td className="px-2 py-2 text-sm text-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-600">{formatNumber(putOption.bid)}</td>
                          <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(putOption.ask)}</td>
                          <td className="px-2 py-2 text-sm font-medium text-gray-900 dark:text-white">{formatNumber(putOption.lastPrice)}</td>
                          <td className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">{putOption.volume}</td>
                          {showGreeks && (
                            <>
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(putOption.delta, 3)}</td>
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(putOption.gamma, 3)}</td>
                              <td className="px-2 py-2 text-sm text-red-600">{formatNumber(putOption.theta, 3)}</td>
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(putOption.vega, 3)}</td>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <td colSpan={showGreeks ? 8 : 4} className="px-2 py-2 border-l border-gray-200 dark:border-gray-600"></td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Positions */}
      {selectedTab === 'positions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Option Positions
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Side
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Entry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Greeks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {positions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {position.symbol}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ${position.strike} {new Date(position.expiry).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        position.type === 'CALL' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {position.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        position.side === 'BUY' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                      }`}>
                        {position.side}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {position.quantity}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      ${formatNumber(position.entryPrice)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      ${formatNumber(position.currentPrice)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-medium ${
                        position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${formatNumber(position.unrealizedPnL)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                      <div>Δ: {formatNumber(position.delta, 3)}</div>
                      <div>Θ: {formatNumber(position.theta, 3)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strategies */}
      {selectedTab === 'strategies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategyTemplates.map((strategy) => (
            <div key={strategy.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {strategy.name}
                </h3>
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {strategy.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Strategy Legs:</div>
                {strategy.legs.map((leg, index) => (
                  <div key={index} className="text-xs bg-gray-50 dark:bg-gray-700 rounded p-2">
                    {leg.side} {leg.quantity} {leg.type} @ ${leg.strike}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Max Profit:</span>
                  <div className="font-medium text-green-600">
                    {strategy.maxProfit ? `$${formatNumber(strategy.maxProfit)}` : 'Unlimited'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Max Loss:</span>
                  <div className="font-medium text-red-600">
                    {strategy.maxLoss ? `$${formatNumber(strategy.maxLoss)}` : 'Unlimited'}
                  </div>
                </div>
              </div>
              
              <div className="text-xs mb-4">
                <span className="text-gray-500 dark:text-gray-400">Breakeven:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {strategy.breakeven.map(be => `$${formatNumber(be)}`).join(', ')}
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
                Execute Strategy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionsTrading;