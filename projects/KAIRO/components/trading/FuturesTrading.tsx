'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, BarChart3, Settings, Plus, Minus, Target, Shield, Clock, Zap, ArrowUp, ArrowDown, X } from 'lucide-react';

interface FuturesContract {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  expiryDate: string;
  tickSize: number;
  contractSize: number;
  marginRequired: number;
  sector: string;
}

interface Position {
  id: string;
  contractId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  margin: number;
  liquidationPrice: number;
  openTime: string;
  leverage: number;
}

interface OrderForm {
  contractId: string;
  side: 'LONG' | 'SHORT';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price?: number;
  stopPrice?: number;
  leverage: number;
  reduceOnly: boolean;
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;
  autoClose?: boolean;
}

const FuturesTrading: React.FC = () => {
  const [contracts, setContracts] = useState<FuturesContract[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedContract, setSelectedContract] = useState<FuturesContract | null>(null);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    contractId: '',
    side: 'LONG',
    orderType: 'MARKET',
    quantity: 1,
    leverage: 1,
    reduceOnly: false,
    stopLoss: undefined,
    takeProfit: undefined,
    trailingStop: undefined,
    autoClose: false
  });
  const [accountBalance, setAccountBalance] = useState(50000);
  const [totalMargin, setTotalMargin] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(50000);
  const [selectedTab, setSelectedTab] = useState<'contracts' | 'positions' | 'orders'>('contracts');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [quickTradeMode, setQuickTradeMode] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Mock futures contracts data
  const mockContracts: FuturesContract[] = [
    // Equity Index Futures
    {
      id: '1',
      symbol: 'ES',
      name: 'E-mini S&P 500',
      price: 4850.25,
      change: 12.50,
      changePercent: 0.26,
      volume: 2500000,
      openInterest: 3200000,
      expiryDate: '2024-03-15',
      tickSize: 0.25,
      contractSize: 50,
      marginRequired: 12000,
      sector: 'equity'
    },
    {
      id: '2',
      symbol: 'NQ',
      name: 'E-mini NASDAQ-100',
      price: 16750.50,
      change: -45.25,
      changePercent: -0.27,
      volume: 1800000,
      openInterest: 2100000,
      expiryDate: '2024-03-15',
      tickSize: 0.25,
      contractSize: 20,
      marginRequired: 16500,
      sector: 'equity'
    },
    {
      id: '7',
      symbol: 'YM',
      name: 'E-mini Dow Jones',
      price: 38450.00,
      change: 125.00,
      changePercent: 0.33,
      volume: 180000,
      openInterest: 250000,
      expiryDate: '2024-03-15',
      tickSize: 1.00,
      contractSize: 5,
      marginRequired: 9500,
      sector: 'equity'
    },
    {
      id: '8',
      symbol: 'RTY',
      name: 'E-mini Russell 2000',
      price: 2045.30,
      change: -8.70,
      changePercent: -0.42,
      volume: 320000,
      openInterest: 450000,
      expiryDate: '2024-03-15',
      tickSize: 0.10,
      contractSize: 50,
      marginRequired: 7200,
      sector: 'equity'
    },
    // Energy Futures
    {
      id: '3',
      symbol: 'CL',
      name: 'Crude Oil',
      price: 78.45,
      change: 1.85,
      changePercent: 2.42,
      volume: 450000,
      openInterest: 680000,
      expiryDate: '2024-02-20',
      tickSize: 0.01,
      contractSize: 1000,
      marginRequired: 4200,
      sector: 'energy'
    },
    {
      id: '9',
      symbol: 'NG',
      name: 'Natural Gas',
      price: 2.85,
      change: 0.12,
      changePercent: 4.40,
      volume: 280000,
      openInterest: 420000,
      expiryDate: '2024-02-28',
      tickSize: 0.001,
      contractSize: 10000,
      marginRequired: 2800,
      sector: 'energy'
    },
    {
      id: '10',
      symbol: 'RB',
      name: 'RBOB Gasoline',
      price: 2.45,
      change: 0.08,
      changePercent: 3.37,
      volume: 95000,
      openInterest: 140000,
      expiryDate: '2024-02-29',
      tickSize: 0.0001,
      contractSize: 42000,
      marginRequired: 3500,
      sector: 'energy'
    },
    // Metals Futures
    {
      id: '4',
      symbol: 'GC',
      name: 'Gold',
      price: 2045.60,
      change: -8.40,
      changePercent: -0.41,
      volume: 280000,
      openInterest: 520000,
      expiryDate: '2024-04-26',
      tickSize: 0.10,
      contractSize: 100,
      marginRequired: 8500,
      sector: 'metals'
    },
    {
      id: '11',
      symbol: 'SI',
      name: 'Silver',
      price: 24.85,
      change: 0.45,
      changePercent: 1.84,
      volume: 120000,
      openInterest: 180000,
      expiryDate: '2024-03-26',
      tickSize: 0.005,
      contractSize: 5000,
      marginRequired: 6200,
      sector: 'metals'
    },
    {
      id: '12',
      symbol: 'HG',
      name: 'Copper',
      price: 3.85,
      change: 0.02,
      changePercent: 0.52,
      volume: 85000,
      openInterest: 125000,
      expiryDate: '2024-03-26',
      tickSize: 0.0005,
      contractSize: 25000,
      marginRequired: 4800,
      sector: 'metals'
    },
    // Bond Futures
    {
      id: '5',
      symbol: 'ZN',
      name: '10-Year Treasury Note',
      price: 110.125,
      change: 0.375,
      changePercent: 0.34,
      volume: 750000,
      openInterest: 1200000,
      expiryDate: '2024-03-20',
      tickSize: 0.015625,
      contractSize: 100000,
      marginRequired: 1800,
      sector: 'bonds'
    },
    {
      id: '13',
      symbol: 'ZB',
      name: '30-Year Treasury Bond',
      price: 125.50,
      change: 0.25,
      changePercent: 0.20,
      volume: 320000,
      openInterest: 480000,
      expiryDate: '2024-03-20',
      tickSize: 0.03125,
      contractSize: 100000,
      marginRequired: 3200,
      sector: 'bonds'
    },
    {
      id: '14',
      symbol: 'ZF',
      name: '5-Year Treasury Note',
      price: 107.75,
      change: 0.125,
      changePercent: 0.12,
      volume: 420000,
      openInterest: 650000,
      expiryDate: '2024-03-29',
      tickSize: 0.0078125,
      contractSize: 100000,
      marginRequired: 1200,
      sector: 'bonds'
    },
    // Cryptocurrency Futures
    {
      id: '6',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.00,
      change: 1250.00,
      changePercent: 2.98,
      volume: 15000,
      openInterest: 25000,
      expiryDate: '2024-03-29',
      tickSize: 5.00,
      contractSize: 5,
      marginRequired: 25000,
      sector: 'crypto'
    },
    {
      id: '15',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.00,
      change: 85.00,
      changePercent: 3.32,
      volume: 8500,
      openInterest: 12000,
      expiryDate: '2024-03-29',
      tickSize: 0.05,
      contractSize: 50,
      marginRequired: 15000,
      sector: 'crypto'
    },
    // Agricultural Futures
    {
      id: '16',
      symbol: 'ZC',
      name: 'Corn',
      price: 485.25,
      change: 8.50,
      changePercent: 1.78,
      volume: 180000,
      openInterest: 320000,
      expiryDate: '2024-05-14',
      tickSize: 0.25,
      contractSize: 5000,
      marginRequired: 2200,
      sector: 'agriculture'
    },
    {
      id: '17',
      symbol: 'ZS',
      name: 'Soybeans',
      price: 1245.50,
      change: -12.25,
      changePercent: -0.97,
      volume: 95000,
      openInterest: 180000,
      expiryDate: '2024-05-14',
      tickSize: 0.25,
      contractSize: 5000,
      marginRequired: 4500,
      sector: 'agriculture'
    },
    {
      id: '18',
      symbol: 'ZW',
      name: 'Wheat',
      price: 625.75,
      change: 5.25,
      changePercent: 0.85,
      volume: 65000,
      openInterest: 120000,
      expiryDate: '2024-05-14',
      tickSize: 0.25,
      contractSize: 5000,
      marginRequired: 2800,
      sector: 'agriculture'
    }
  ];

  // Mock positions data
  const mockPositions: Position[] = [
    {
      id: '1',
      contractId: '1',
      symbol: 'ES',
      side: 'LONG',
      quantity: 2,
      entryPrice: 4825.50,
      currentPrice: 4850.25,
      unrealizedPnL: 2475.00,
      realizedPnL: 0,
      margin: 24000,
      liquidationPrice: 4585.30,
      openTime: '2024-01-15T09:30:00Z',
      leverage: 10
    },
    {
      id: '2',
      contractId: '3',
      symbol: 'CL',
      side: 'SHORT',
      quantity: 1,
      entryPrice: 79.20,
      currentPrice: 78.45,
      unrealizedPnL: 750.00,
      realizedPnL: 0,
      margin: 4200,
      liquidationPrice: 83.45,
      openTime: '2024-01-15T11:15:00Z',
      leverage: 5
    }
  ];

  // Initialize data
  useEffect(() => {
    setContracts(mockContracts);
    setPositions(mockPositions);
    
    // Calculate total margin
    const margin = mockPositions.reduce((sum, pos) => sum + pos.margin, 0);
    setTotalMargin(margin);
    setAvailableBalance(accountBalance - margin);
  }, [accountBalance]);

  // Update selected contract when form changes
  useEffect(() => {
    if (orderForm.contractId) {
      const contract = contracts.find(c => c.id === orderForm.contractId);
      setSelectedContract(contract || null);
    }
  }, [orderForm.contractId, contracts]);

  // Auto-refresh market data
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate price updates
      setContracts(prev => prev.map(contract => ({
        ...contract,
        price: contract.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
        change: contract.price * (Math.random() - 0.5) * 0.02,
        changePercent: (Math.random() - 0.5) * 2
      })));
      
      // Update position P&L
      setPositions(prev => prev.map(position => {
        const contract = contracts.find(c => c.id === position.contractId);
        if (!contract) return position;
        
        const priceDiff = contract.price - position.entryPrice;
        const unrealizedPnL = position.side === 'LONG' 
          ? priceDiff * position.quantity * contract.contractSize
          : -priceDiff * position.quantity * contract.contractSize;
        
        return {
          ...position,
          currentPrice: contract.price,
          unrealizedPnL
        };
      }));
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, contracts]);

  // Position monitoring and alerts
  useEffect(() => {
    positions.forEach(position => {
      const pnlPercent = (position.unrealizedPnL / position.margin) * 100;
      
      // Alert for significant losses
      if (pnlPercent < -50) {
        console.warn(`⚠️ Position ${position.symbol} is down ${pnlPercent.toFixed(1)}%`);
      }
      
      // Alert for significant gains
      if (pnlPercent > 100) {
        console.log(`🎉 Position ${position.symbol} is up ${pnlPercent.toFixed(1)}%`);
      }
      
      // Alert for approaching liquidation
      const liquidationDistance = Math.abs(position.currentPrice - position.liquidationPrice) / position.currentPrice;
      if (liquidationDistance < 0.1) { // Within 10% of liquidation
        console.error(`🚨 Position ${position.symbol} approaching liquidation!`);
      }
    });
  }, [positions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setSelectedTab('contracts');
            break;
          case '2':
            e.preventDefault();
            setSelectedTab('positions');
            break;
          case '3':
            e.preventDefault();
            setSelectedTab('orders');
            break;
          case 'q':
            e.preventDefault();
            setQuickTradeMode(!quickTradeMode);
            break;
          case 'r':
            e.preventDefault();
            setAutoRefresh(!autoRefresh);
            break;
          case 'Enter':
            e.preventDefault();
            if (selectedContract) {
              handleSubmitOrder();
            }
            break;
        }
      }
      
      // Quick trade shortcuts (when quick trade mode is enabled)
      if (quickTradeMode && selectedContract) {
        switch (e.key) {
          case 'b':
          case 'B':
            e.preventDefault();
            setOrderForm(prev => ({ ...prev, side: 'LONG' }));
            break;
          case 's':
          case 'S':
            e.preventDefault();
            setOrderForm(prev => ({ ...prev, side: 'SHORT' }));
            break;
          case '+':
          case '=':
            e.preventDefault();
            setOrderForm(prev => ({ ...prev, quantity: prev.quantity + 1 }));
            break;
          case '-':
            e.preventDefault();
            setOrderForm(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [quickTradeMode, selectedContract, autoRefresh]);

  // Calculate order value and margin
  const calculateOrderValue = () => {
    if (!selectedContract) return { value: 0, margin: 0 };
    
    const value = selectedContract.price * selectedContract.contractSize * orderForm.quantity;
    const margin = (selectedContract.marginRequired * orderForm.quantity) / orderForm.leverage;
    
    return { value, margin };
  };

  // Handle order submission
  const handleSubmitOrder = () => {
    if (!selectedContract) return;
    
    const { margin } = calculateOrderValue();
    
    if (margin > availableBalance) {
      alert('Insufficient margin available');
      return;
    }
    
    // Simulate order execution
    const newPosition: Position = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contractId: selectedContract.id,
      symbol: selectedContract.symbol,
      side: orderForm.side,
      quantity: orderForm.quantity,
      entryPrice: selectedContract.price,
      currentPrice: selectedContract.price,
      unrealizedPnL: 0,
      realizedPnL: 0,
      margin: margin,
      liquidationPrice: orderForm.side === 'LONG' 
        ? selectedContract.price * 0.8 
        : selectedContract.price * 1.2,
      openTime: new Date().toISOString(),
      leverage: orderForm.leverage
    };
    
    setPositions(prev => [...prev, newPosition]);
    setTotalMargin(prev => prev + margin);
    setAvailableBalance(prev => prev - margin);
    
    // Reset form only if not in quick trade mode
     if (!quickTradeMode) {
       setOrderForm({
         contractId: '',
         side: 'LONG',
         orderType: 'MARKET',
         quantity: 1,
         leverage: 1,
         reduceOnly: false,
         stopLoss: undefined,
         takeProfit: undefined,
         trailingStop: undefined,
         autoClose: false
       });
     }
    
    alert('Order executed successfully!');
  };

  // Quick trade function for one-click trading
  const handleQuickTrade = (contract: FuturesContract, side: 'LONG' | 'SHORT', quantity: number = 1) => {
    const margin = (contract.marginRequired * quantity) / orderForm.leverage;
    
    if (margin > availableBalance) {
      alert('Insufficient margin available');
      return;
    }
    
    const newPosition: Position = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contractId: contract.id,
      symbol: contract.symbol,
      side: side,
      quantity: quantity,
      entryPrice: contract.price,
      currentPrice: contract.price,
      unrealizedPnL: 0,
      realizedPnL: 0,
      margin: margin,
      liquidationPrice: side === 'LONG' 
        ? contract.price * 0.8 
        : contract.price * 1.2,
      openTime: new Date().toISOString(),
      leverage: orderForm.leverage
    };
    
    setPositions(prev => [...prev, newPosition]);
    setTotalMargin(prev => prev + margin);
    setAvailableBalance(prev => prev - margin);
    
    alert(`Quick ${side} order executed for ${contract.symbol}!`);
  };

  // Close position
  const closePosition = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;
    
    setPositions(prev => prev.filter(p => p.id !== positionId));
    setTotalMargin(prev => prev - position.margin);
    setAvailableBalance(prev => prev + position.margin + position.unrealizedPnL);
    
    alert(`Position closed. P&L: $${position.unrealizedPnL.toFixed(2)}`);
  };

  // Format number with commas
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  // Get sector color
  const getSectorColor = (sector: string) => {
    const colors = {
      equity: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      energy: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      metals: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      bonds: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      crypto: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      agriculture: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
    };
    return colors[sector as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  // Filter contracts by sector
  const filteredContracts = filterSector === 'all' 
    ? contracts 
    : contracts.filter(c => c.sector === filterSector);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Futures Trading
          </h1>
          {quickTradeMode && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium">
              Quick Trade Mode
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuickTradeMode(!quickTradeMode)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                quickTradeMode
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              title="Toggle Quick Trade Mode (Ctrl+Q)"
            >
              <Zap className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                autoRefresh
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              title="Toggle Auto Refresh (Ctrl+R)"
            >
              <Clock className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div>Account Balance: <span className="font-semibold text-gray-900 dark:text-white">${formatNumber(accountBalance)}</span></div>
            <div>Available: <span className="font-semibold text-green-600">${formatNumber(availableBalance)}</span></div>
            <div>Used Margin: <span className="font-semibold text-orange-600">${formatNumber(totalMargin)}</span></div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="text-sm text-blue-800 dark:text-blue-400">
          <strong>Keyboard Shortcuts:</strong> Ctrl+1/2/3 (Switch tabs) | Ctrl+Q (Quick trade) | Ctrl+R (Auto refresh) | Ctrl+Enter (Submit order)
          {quickTradeMode && " | B (Buy/Long) | S (Sell/Short) | +/- (Adjust quantity)"}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex justify-between items-center">
          <div className="flex space-x-8">
            {[
              { id: 'contracts', label: 'Contracts', icon: Target, count: filteredContracts.length },
              { id: 'positions', label: 'Positions', icon: Shield, count: positions.length },
              { id: 'orders', label: 'Orders', icon: Clock, count: 0 }
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id as any)}
                className={`flex items-center space-x-2 py-2 px-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                  selectedTab === id
                    ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
                }`}
                title={`Switch to ${label} (Ctrl+${id === 'contracts' ? '1' : id === 'positions' ? '2' : '3'})`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedTab === id
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Quick Navigation */}
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {selectedTab === 'contracts' && `${filteredContracts.length} contracts`}
              {selectedTab === 'positions' && `${positions.length} open positions`}
              {selectedTab === 'orders' && '0 pending orders'}
            </div>
            {selectedContract && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                <span className="text-xs text-gray-600 dark:text-gray-300">Selected:</span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">{selectedContract.symbol}</span>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  title="Clear selection"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedTab === 'contracts' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Futures Contracts
                  </h2>
                  <select
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Sectors</option>
                    <option value="equity">Equity</option>
                    <option value="energy">Energy</option>
                    <option value="metals">Metals</option>
                    <option value="bonds">Bonds</option>
                    <option value="crypto">Crypto</option>
                    <option value="agriculture">Agriculture</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contract
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {contract.symbol}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(contract.sector)}`}>
                                {contract.sector}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {contract.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          ${formatNumber(contract.price)}
                        </td>
                        <td className="px-4 py-4">
                          <div className={`text-sm font-medium ${
                            contract.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {contract.change >= 0 ? '+' : ''}${formatNumber(contract.change)}
                            <div className="text-xs">
                              ({contract.changePercent >= 0 ? '+' : ''}{contract.changePercent.toFixed(2)}%)
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {formatNumber(contract.volume, 0)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {new Date(contract.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setOrderForm(prev => ({ ...prev, contractId: contract.id }))}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Trade
                            </button>
                            {quickTradeMode && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleQuickTrade(contract, 'LONG')}
                                  className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/40"
                                  title="Quick Buy"
                                >
                                  B
                                </button>
                                <button
                                  onClick={() => handleQuickTrade(contract, 'SHORT')}
                                  className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/40"
                                  title="Quick Sell"
                                >
                                  S
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'positions' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Open Positions
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
                        Side
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Entry Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        P&L
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {positions.map((position) => (
                      <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {position.symbol}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            position.side === 'LONG' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => closePosition(position.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40"
                              title="Close Position"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const contract = contracts.find(c => c.id === position.contractId);
                                if (contract) {
                                  const oppositeSide = position.side === 'LONG' ? 'SHORT' : 'LONG';
                                  handleQuickTrade(contract, oppositeSide, position.quantity);
                                }
                              }}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/40"
                              title="Hedge Position"
                            >
                              ⚖️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Place Order
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contract
              </label>
              <select
                value={orderForm.contractId}
                onChange={(e) => setOrderForm(prev => ({ ...prev, contractId: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Contract</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.symbol} - {contract.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Side
                </label>
                <select
                  value={orderForm.side}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, side: e.target.value as 'LONG' | 'SHORT' }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="LONG">Long</option>
                  <option value="SHORT">Short</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Type
                </label>
                <select
                  value={orderForm.orderType}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value as any }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="MARKET">Market</option>
                  <option value="LIMIT">Limit</option>
                  <option value="STOP">Stop</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
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
                  Leverage
                </label>
                <select
                  value={orderForm.leverage}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, leverage: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {[1, 2, 3, 5, 10, 20, 50].map(lev => (
                    <option key={lev} value={lev}>{lev}x</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Risk Management */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Risk Management</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stop Loss ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.stopLoss || ''}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, stopLoss: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Auto-close at loss"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Take Profit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.takeProfit || ''}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, takeProfit: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Auto-close at profit"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trailing Stop (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={orderForm.trailingStop || ''}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, trailingStop: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Dynamic stop loss"
                />
              </div>
              
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={orderForm.autoClose}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, autoClose: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Auto-close at market close
                  </span>
                </label>
              </div>
            </div>
            
            {selectedContract && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Contract Value:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${formatNumber(calculateOrderValue().value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Required Margin:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${formatNumber(calculateOrderValue().margin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
                    <span className={`font-medium ${
                      availableBalance >= calculateOrderValue().margin 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      ${formatNumber(availableBalance)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubmitOrder}
                disabled={!selectedContract || availableBalance < calculateOrderValue().margin}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Place Order {quickTradeMode && '(Ctrl+Enter)'}
              </button>
              {orderForm.quantity > 1 && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setOrderForm(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                    className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Decrease quantity (-)"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setOrderForm(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Increase quantity (+)"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturesTrading;