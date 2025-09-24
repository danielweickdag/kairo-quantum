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
  const [executingStrategy, setExecutingStrategy] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionContract | null>(null);
  const [orderForm, setOrderForm] = useState({
    side: 'BUY' as 'BUY' | 'SELL',
    quantity: 1,
    orderType: 'MARKET' as 'MARKET' | 'LIMIT',
    price: 0
  });

  // Custom strategy builder state
  const [showStrategyBuilder, setShowStrategyBuilder] = useState(false);
  const [customStrategy, setCustomStrategy] = useState({
    name: '',
    description: '',
    legs: [] as { type: 'CALL' | 'PUT'; side: 'BUY' | 'SELL'; strike: number; quantity: number }[]
  });

  // Strategy templates
  const [strategyTemplates, setStrategyTemplates] = useState<StrategyTemplate[]>([
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
  ]);

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

  // Calculate portfolio risk metrics
  const calculatePortfolioRisk = () => {
    const portfolioValue = positions.reduce((sum, pos) => sum + Math.abs(pos.unrealizedPnL), 0);
    const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);
    const portfolioGreeks = calculatePortfolioGreeks();
    
    return {
      totalValue: portfolioValue,
      totalPnL: totalPnL,
      pnlPercentage: portfolioValue > 0 ? (totalPnL / portfolioValue) * 100 : 0,
      maxRisk: Math.abs(portfolioGreeks.delta * 10) + Math.abs(portfolioGreeks.gamma * 100),
      riskPercentage: accountBalance > 0 ? (Math.abs(portfolioGreeks.delta * 10) + Math.abs(portfolioGreeks.gamma * 100)) / accountBalance * 100 : 0
    };
  };

  // Format number with appropriate decimals
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  // Handle individual option order
  const handleOptionOrder = (option: OptionContract, side: 'BUY' | 'SELL') => {
    setSelectedOption(option);
    setOrderForm({
      side,
      quantity: 1,
      orderType: 'MARKET',
      price: side === 'BUY' ? option.ask : option.bid
    });
    setShowOrderModal(true);
  };

  // Execute individual option order
  const executeOptionOrder = () => {
    if (!selectedOption) return;

    const orderPrice = orderForm.orderType === 'MARKET' 
      ? (orderForm.side === 'BUY' ? selectedOption.ask : selectedOption.bid)
      : orderForm.price;

    const orderCost = orderPrice * orderForm.quantity * 100;
    
    // Risk management checks
    const portfolioRisk = calculatePortfolioRisk();
    const positionRisk = Math.abs(selectedOption.delta * orderForm.quantity * 100 * 10);
    const newTotalRisk = portfolioRisk.maxRisk + positionRisk;
    const riskLimit = accountBalance * 0.2; // 20% risk limit

    if (orderForm.side === 'BUY' && orderCost > accountBalance) {
      alert('Insufficient funds for this order');
      return;
    }

    if (newTotalRisk > riskLimit) {
      alert(`Order exceeds risk limit. Current risk: $${portfolioRisk.maxRisk.toFixed(2)}, New risk: $${newTotalRisk.toFixed(2)}, Limit: $${riskLimit.toFixed(2)}`);
      return;
    }

    // Position sizing recommendation
    const maxQuantity = Math.floor(riskLimit / positionRisk);
    if (orderForm.quantity > maxQuantity && maxQuantity > 0) {
      if (!confirm(`Recommended max quantity: ${maxQuantity}. Continue with ${orderForm.quantity}?`)) {
        return;
      }
    }

    // Create new position
    const newPosition: OptionPosition = {
      id: `pos-${Date.now()}`,
      contractId: selectedOption.id,
      symbol: selectedOption.symbol,
      underlying: selectedOption.underlying,
      strike: selectedOption.strike,
      expiry: selectedOption.expiry,
      type: selectedOption.type,
      side: orderForm.side,
      quantity: orderForm.quantity,
      entryPrice: orderPrice,
      currentPrice: selectedOption.lastPrice,
      unrealizedPnL: orderForm.side === 'BUY' 
        ? (selectedOption.lastPrice - orderPrice) * orderForm.quantity * 100
        : (orderPrice - selectedOption.lastPrice) * orderForm.quantity * 100,
      delta: selectedOption.delta,
      gamma: selectedOption.gamma,
      theta: selectedOption.theta,
      vega: selectedOption.vega,
      openTime: new Date().toISOString()
    };

    setPositions(prev => [...prev, newPosition]);
    
    // Update account balance
    if (orderForm.side === 'BUY') {
      setAccountBalance(prev => prev - orderCost);
    } else {
      setAccountBalance(prev => prev + orderCost);
    }

    // Close modal and reset form
    setShowOrderModal(false);
    setSelectedOption(null);
    setOrderForm({
      side: 'BUY',
      quantity: 1,
      orderType: 'MARKET',
      price: 0
    });

    alert(`Order executed: ${orderForm.side} ${orderForm.quantity} ${selectedOption.symbol} @ $${orderPrice.toFixed(2)}`);
  };

  // Close position function
  const closePosition = (position: OptionPosition) => {
    // Calculate closing cost (opposite side of original position)
    const closingSide = position.side === 'BUY' ? 'SELL' : 'BUY';
    const closingPrice = position.currentPrice;
    const closingCost = closingPrice * position.quantity * 100;
    
    // Calculate realized P&L
    const realizedPnL = position.side === 'BUY' 
      ? (closingPrice - position.entryPrice) * position.quantity * 100
      : (position.entryPrice - closingPrice) * position.quantity * 100;
    
    // Update account balance with realized P&L
    setAccountBalance(prev => prev + realizedPnL + (position.side === 'BUY' ? closingCost : -closingCost));
    
    // Remove position from positions array
    setPositions(prev => prev.filter(pos => pos.id !== position.id));
    
    alert(`Position closed: ${realizedPnL >= 0 ? 'Profit' : 'Loss'} of $${Math.abs(realizedPnL).toFixed(2)}`);
   };

  // Custom strategy builder functions
  const addStrategyLeg = () => {
    setCustomStrategy(prev => ({
      ...prev,
      legs: [...prev.legs, { type: 'CALL', side: 'BUY', strike: underlyingPrice, quantity: 1 }]
    }));
  };

  const removeStrategyLeg = (index: number) => {
    setCustomStrategy(prev => ({
      ...prev,
      legs: prev.legs.filter((_, i) => i !== index)
    }));
  };

  const updateStrategyLeg = (index: number, field: string, value: any) => {
    setCustomStrategy(prev => ({
      ...prev,
      legs: prev.legs.map((leg, i) => i === index ? { ...leg, [field]: value } : leg)
    }));
  };

  const saveCustomStrategy = () => {
    if (!customStrategy.name || customStrategy.legs.length === 0) {
      alert('Please provide a strategy name and at least one leg');
      return;
    }

    const newStrategy: StrategyTemplate = {
      id: `custom_${Date.now()}`,
      name: customStrategy.name,
      description: customStrategy.description,
      legs: customStrategy.legs,
      maxProfit: null, // Could be calculated based on strategy type
      maxLoss: null,   // Could be calculated based on strategy type
      breakeven: []    // Could be calculated based on strategy type
    };

    setStrategyTemplates((prev: StrategyTemplate[]) => [...prev, newStrategy]);
    setShowStrategyBuilder(false);
    setCustomStrategy({ name: '', description: '', legs: [] });
    alert('Custom strategy saved successfully!');
  };

  const executeStrategy = async (strategy: StrategyTemplate) => {
    setExecutingStrategy(strategy.id);
    
    try {
      // Simulate strategy execution
      const newPositions: OptionPosition[] = strategy.legs.map((leg, index) => {
        const contractId = `${selectedUnderlying}-${leg.strike}-${leg.type}-${selectedExpiry}`;
        const currentPrice = leg.type === 'CALL' 
          ? Math.max(0, underlyingPrice - leg.strike) + (Math.random() * 2 + 1)
          : Math.max(0, leg.strike - underlyingPrice) + (Math.random() * 2 + 1);
        
        const entryPrice = currentPrice + (leg.side === 'BUY' ? 0.05 : -0.05);
        const unrealizedPnL = leg.side === 'BUY' 
          ? (currentPrice - entryPrice) * leg.quantity * 100
          : (entryPrice - currentPrice) * leg.quantity * 100;

        return {
          id: `pos-${Date.now()}-${index}`,
          contractId,
          symbol: `${selectedUnderlying} ${new Date(selectedExpiry).toLocaleDateString()} ${leg.strike} ${leg.type}`,
          underlying: selectedUnderlying,
          strike: leg.strike,
          expiry: selectedExpiry,
          type: leg.type,
          side: leg.side,
          quantity: leg.quantity,
          entryPrice,
          currentPrice,
          unrealizedPnL,
          delta: leg.type === 'CALL' ? 0.5 + Math.random() * 0.3 : -0.5 - Math.random() * 0.3,
          gamma: Math.random() * 0.1,
          theta: -Math.random() * 0.05,
          vega: Math.random() * 0.2,
          openTime: new Date().toISOString()
        };
      });

      // Add positions to the portfolio
      setPositions(prev => [...prev, ...newPositions]);
      
      // Update account balance (simulate cost)
      const totalCost = newPositions.reduce((sum, pos) => {
        return sum + (pos.side === 'BUY' ? pos.entryPrice * pos.quantity * 100 : 0);
      }, 0);
      
      setAccountBalance(prev => prev - totalCost);
      
      // Switch to positions tab to show the executed strategy
      setSelectedTab('positions');
      
      // Show success message (you could add a toast notification here)
      console.log(`Successfully executed ${strategy.name} strategy`);
      
    } catch (error) {
      console.error('Error executing strategy:', error);
    } finally {
      setExecutingStrategy(null);
    }
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
                  <th colSpan={showGreeks ? 9 : 5} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                    Calls
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Strike
                  </th>
                  <th colSpan={showGreeks ? 9 : 5} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-l border-gray-200 dark:border-gray-600">
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
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">ν</th>
                      <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">Action</th>
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
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Action</th>
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
                              <td className="px-2 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(callOption.vega, 3)}</td>
                            </>
                          )}
                          <td className="px-2 py-2 border-r border-gray-200 dark:border-gray-600">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleOptionOrder(callOption, 'BUY')}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Buy
                              </button>
                              <button
                                onClick={() => handleOptionOrder(callOption, 'SELL')}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Sell
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td colSpan={showGreeks ? 9 : 5} className="px-2 py-2 border-r border-gray-200 dark:border-gray-600"></td>
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
                          <td className="px-2 py-2">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleOptionOrder(putOption, 'BUY')}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Buy
                              </button>
                              <button
                                onClick={() => handleOptionOrder(putOption, 'SELL')}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Sell
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td colSpan={showGreeks ? 9 : 5} className="px-2 py-2 border-l border-gray-200 dark:border-gray-600"></td>
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

      {/* Portfolio Risk Metrics */}
      {selectedTab === 'positions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Portfolio Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Account Balance</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${formatNumber(accountBalance)}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total P&L</div>
              <div className={`text-2xl font-bold ${
                positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ${formatNumber(positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0))}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Open Positions</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {positions.length}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Portfolio Delta</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(calculatePortfolioGreeks().delta, 2)}
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center">
              <Shield className="mr-2" size={18} />
              Risk Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Portfolio Risk</div>
                <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                  ${formatNumber(calculatePortfolioRisk().maxRisk)}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  {formatNumber(calculatePortfolioRisk().riskPercentage, 1)}% of account
                </div>
              </div>
              <div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Risk Limit</div>
                <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                  ${formatNumber(accountBalance * 0.2)}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  20% of account balance
                </div>
              </div>
              <div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Available Risk</div>
                <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                  ${formatNumber(Math.max(0, (accountBalance * 0.2) - calculatePortfolioRisk().maxRisk))}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Remaining capacity
                </div>
              </div>
            </div>
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
                      <button 
                        onClick={() => closePosition(position)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
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
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Strategy Templates</h2>
            <button
              onClick={() => setShowStrategyBuilder(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Strategy
            </button>
          </div>
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
              
              <button 
                onClick={() => executeStrategy(strategy)}
                disabled={executingStrategy === strategy.id}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
              >
                {executingStrategy === strategy.id ? 'Executing...' : 'Execute Strategy'}
              </button>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {orderForm.side} {selectedOption.symbol}
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Strike:</span>
                  <div className="font-medium">${selectedOption.strike}</div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Expiry:</span>
                  <div className="font-medium">{new Date(selectedOption.expiry).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Bid:</span>
                  <div className="font-medium">${formatNumber(selectedOption.bid)}</div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Ask:</span>
                  <div className="font-medium">${formatNumber(selectedOption.ask)}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Side
                </label>
                <select
                  value={orderForm.side}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, side: e.target.value as 'BUY' | 'SELL' }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Type
                </label>
                <select
                  value={orderForm.orderType}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value as 'MARKET' | 'LIMIT' }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="MARKET">Market</option>
                  <option value="LIMIT">Limit</option>
                </select>
              </div>
              
              {orderForm.orderType === 'LIMIT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Limit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Summary</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {orderForm.side} {orderForm.quantity} contracts
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Est. Cost: ${formatNumber(
                    (orderForm.orderType === 'MARKET' 
                      ? (orderForm.side === 'BUY' ? selectedOption.ask : selectedOption.bid)
                      : orderForm.price
                    ) * orderForm.quantity * 100
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={executeOptionOrder}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Strategy Builder Modal */}
      {showStrategyBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Strategy Builder</h3>
              <button
                onClick={() => setShowStrategyBuilder(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={customStrategy.name}
                  onChange={(e) => setCustomStrategy(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter strategy name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={customStrategy.description}
                  onChange={(e) => setCustomStrategy(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Describe your strategy"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Strategy Legs
                  </label>
                  <button
                    onClick={addStrategyLeg}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Leg
                  </button>
                </div>

                <div className="space-y-3">
                  {customStrategy.legs.map((leg, index) => (
                    <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-md p-3">
                      <div className="grid grid-cols-5 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                             value={leg.type}
                             onChange={(e) => updateStrategyLeg(index, 'type', e.target.value)}
                             className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                           >
                             <option value="call">Call</option>
                             <option value="put">Put</option>
                           </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Side
                          </label>
                          <select
                             value={leg.side}
                             onChange={(e) => updateStrategyLeg(index, 'side', e.target.value)}
                             className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                           >
                             <option value="buy">Buy</option>
                             <option value="sell">Sell</option>
                           </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Strike
                          </label>
                          <input
                            type="number"
                            value={leg.strike}
                            onChange={(e) => updateStrategyLeg(index, 'strike', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Strike"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={leg.quantity}
                            onChange={(e) => updateStrategyLeg(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Qty"
                            min="1"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={() => removeStrategyLeg(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm w-full"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowStrategyBuilder(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCustomStrategy}
                  disabled={!customStrategy.name || customStrategy.legs.length === 0}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md"
                >
                  Save Strategy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsTrading;