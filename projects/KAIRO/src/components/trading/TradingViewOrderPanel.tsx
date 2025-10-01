'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Shield,
  Zap,
  BarChart3,
  Activity,
  Settings,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Bot
} from 'lucide-react';
import { MultiAssetTradingService, AssetType, OrderType, OrderSide, TimeInForce, MarketData, TradingOrder, Position } from '@/services/multiAssetTradingService';
import { WorkflowIntegrationService, AutomationWorkflow, WorkflowMetrics } from '@/services/workflowIntegrationService';
import { alertService } from '@/services/alertService';

interface OrderPanelProps {
  symbol?: string;
  currentPrice?: number;
  onOrderSubmit?: (order: any) => void;
  className?: string;
}

// Using types from MultiAssetTradingService

const TradingViewOrderPanel: React.FC<OrderPanelProps> = ({
  symbol = 'AAPL',
  currentPrice = 150.25,
  onOrderSubmit,
  className = ''
}) => {
  // Trading service instance
  const tradingService = useRef<MultiAssetTradingService | null>(null);
  const workflowService = useRef<WorkflowIntegrationService | null>(null);
  
  // State management
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [assetType, setAssetType] = useState<AssetType>('stock');
  const [quantity, setQuantity] = useState<string>('100');
  const [price, setPrice] = useState<string>(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState<string>('');
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('');
  const [stopLossPrice, setStopLossPrice] = useState<string>('');
  const [timeInForce, setTimeInForce] = useState<TimeInForce>('day');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [riskAmount, setRiskAmount] = useState<string>('1000');
  const [riskPercent, setRiskPercent] = useState<string>('2');
  const [trailingAmount, setTrailingAmount] = useState<string>('5.00');
  const [isAutomated, setIsAutomated] = useState(false);
  const [showPositions, setShowPositions] = useState(true);
  
  // Real-time data state
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<TradingOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  
  // Workflow automation state
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetrics | null>(null);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  
  // Risk Management State
  const [riskSettings, setRiskSettings] = useState({
    maxRiskPerTrade: 2, // percentage
    maxDailyLoss: 5, // percentage
    maxPositionSize: 10000, // dollar amount
    maxPortfolioExposure: 80, // percentage
    requireConfirmation: true
  });
  const [riskValidation, setRiskValidation] = useState({
    isValid: true,
    warnings: [] as string[],
    errors: [] as string[]
  });
  
  // Portfolio tracking state
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  const [dailyPnL, setDailyPnL] = useState(0);
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalValue: 0,
    cashBalance: 50000,
    totalPnL: 0,
    dailyPnL: 0,
    winRate: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    totalTrades: 0
  });
  
  // Initialize trading service
  useEffect(() => {
    if (!tradingService.current) {
      tradingService.current = new MultiAssetTradingService();
      setIsConnected(true);
      
      // Initialize workflow service
      workflowService.current = new WorkflowIntegrationService(tradingService.current);
      const wfService = workflowService.current;
      
      // Set up trading service event listeners
      tradingService.current.on('marketData', (data: { symbol: string; data: MarketData }) => {
        if (data.symbol === selectedSymbol) {
          setMarketData(data.data);
        }
      });
      
      // Subscribe to market data for the selected symbol
      // This will trigger the market data feed to start sending data for this symbol
      const currentMarketData = tradingService.current.getMarketData(selectedSymbol);
      if (currentMarketData) {
        setMarketData(currentMarketData);
      }
      
      tradingService.current.on('orderFilled', (order: TradingOrder) => {
        setOrders(prev => prev.map(o => o.id === order.id ? order : o));
        // Update positions
        const accountPositions = tradingService.current?.getPositions('default') || [];
        setPositions(accountPositions);
      });
      
      tradingService.current.on('orderPlaced', (order: TradingOrder) => {
        setOrders(prev => [...prev, order]);
      });
      
      // Set up workflow service event listeners
      wfService.on('workflow_executed', (data: { workflow: AutomationWorkflow }) => {
        console.log('Workflow executed:', data.workflow.name);
        setWorkflows(wfService.getAllWorkflows());
        setWorkflowMetrics(wfService.getWorkflowMetrics());
      });
      
      wfService.on('notification', (data: { message: string; timestamp: Date }) => {
        // Show notification to user
        alert(`Automation Alert: ${data.message}`);
        
        // Trigger alert through alert service
        alertService.createAlert({
          type: 'trading',
          category: 'trading',
          priority: 'medium',
          title: 'Automation Alert',
          message: data.message,
          userId: 'current-user',
          conditions: []
        });
      });
      
      // Initialize workflows and metrics
       setWorkflows(wfService.getAllWorkflows());
       setWorkflowMetrics(wfService.getWorkflowMetrics());
       
       // Update portfolio metrics when positions change
       const updatePortfolioMetrics = () => {
         const currentPositions = tradingService.current?.getPositions('default') || [];
         let totalValue = portfolioMetrics.cashBalance;
         let totalUnrealizedPnL = 0;
         
         currentPositions.forEach(position => {
           const currentPrice = getCurrentPrice();
           const positionValue = position.quantity * currentPrice;
           const unrealizedPnL = positionValue - (position.quantity * position.avgPrice);
           
           totalValue += positionValue;
           totalUnrealizedPnL += unrealizedPnL;
         });
         
         setPortfolioValue(totalValue);
         setTotalPnL(totalUnrealizedPnL);
         setPortfolioMetrics(prev => ({
           ...prev,
           totalValue,
           totalPnL: totalUnrealizedPnL,
           totalTrades: currentPositions.length
         }));
       };
       
       // Update metrics initially and on position changes
       updatePortfolioMetrics();
       
       // Set up interval to update portfolio metrics
       const metricsInterval = setInterval(updatePortfolioMetrics, 1000);
       
       // Set up interval to update market data
       const marketDataInterval = setInterval(() => {
         const latestMarketData = tradingService.current?.getMarketData(selectedSymbol);
         if (latestMarketData) {
           setMarketData(latestMarketData);
         }
       }, 1000);
       
       return () => {
         clearInterval(metricsInterval);
         clearInterval(marketDataInterval);
       };
    }
    
    return () => {
      // Cleanup event listeners
      if (tradingService.current) {
        tradingService.current.off('marketData', () => {});
        tradingService.current.off('orderFilled', () => {});
        tradingService.current.off('orderPlaced', () => {});
      }
      if (workflowService.current) {
        workflowService.current.destroy();
      }
    };
  }, [selectedSymbol]);
  
  // Update price when market data changes
  useEffect(() => {
    if (marketData && orderType === 'market') {
      setPrice(marketData.price.toString());
    }
  }, [marketData, orderType]);

  // Validate risk whenever order parameters change
  useEffect(() => {
    validateRisk();
  }, [quantity, price, stopLossPrice, orderSide, orderType, selectedSymbol, portfolioMetrics]);

  // Get current price from market data or fallback to prop
  const getCurrentPrice = () => {
    return marketData?.price || currentPrice || 150.25;
  };

  // Risk Management Validation
  const validateRisk = () => {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    const orderValue = calculateOrderValue();
    const currentPrice = getCurrentPrice();
    const qty = parseFloat(quantity) || 0;
    
    // Position size validation
    if (orderValue > riskSettings.maxPositionSize) {
      errors.push(`Order value ($${orderValue.toFixed(2)}) exceeds maximum position size ($${riskSettings.maxPositionSize.toLocaleString()})`);
    }
    
    // Risk per trade validation
    if (stopLossPrice) {
      const riskAmount = Math.abs(parseFloat(stopLossPrice) - currentPrice) * qty;
      const riskPercentage = (riskAmount / portfolioMetrics.totalValue) * 100;
      if (riskPercentage > riskSettings.maxRiskPerTrade) {
        errors.push(`Risk per trade (${riskPercentage.toFixed(2)}%) exceeds maximum (${riskSettings.maxRiskPerTrade}%)`);
      }
    }
    
    // Daily loss validation
    if (portfolioMetrics.dailyPnL < 0 && Math.abs(portfolioMetrics.dailyPnL / portfolioMetrics.totalValue * 100) > riskSettings.maxDailyLoss) {
      warnings.push(`Daily loss limit (${riskSettings.maxDailyLoss}%) already reached`);
    }
    
    // Portfolio exposure validation
    const totalExposure = positions.reduce((sum, pos) => sum + (pos.quantity * currentPrice), 0);
    const exposurePercentage = (totalExposure / portfolioMetrics.totalValue) * 100;
    if (exposurePercentage > riskSettings.maxPortfolioExposure) {
      warnings.push(`Portfolio exposure (${exposurePercentage.toFixed(2)}%) exceeds recommended maximum (${riskSettings.maxPortfolioExposure}%)`);
    }
    
    // Cash balance validation
    if (orderSide === 'buy' && orderValue > portfolioMetrics.cashBalance) {
      errors.push(`Insufficient cash balance. Required: $${orderValue.toFixed(2)}, Available: $${portfolioMetrics.cashBalance.toFixed(2)}`);
    }
    
    setRiskValidation({
      isValid: errors.length === 0,
      warnings,
      errors
    });
    
    return errors.length === 0;
  };

  const calculateOrderValue = () => {
    const qty = parseFloat(quantity) || 0;
    const orderPrice = orderType === 'market' ? getCurrentPrice() : parseFloat(price) || 0;
    return qty * orderPrice;
  };

  const calculateRiskReward = () => {
    if (!stopLossPrice || !takeProfitPrice) return null;
    const entryPrice = orderType === 'market' ? getCurrentPrice() : parseFloat(price) || 0;
    const stopLoss = parseFloat(stopLossPrice);
    const takeProfit = parseFloat(takeProfitPrice);
    
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);
    
    return risk > 0 ? (reward / risk).toFixed(2) : '0';
  };

  const handleSubmitOrder = async () => {
    if (!tradingService.current) {
      alert('Trading service not initialized');
      return;
    }
    
    try {
      // Validate risk before placing order
      if (!validateRisk()) {
        alert(`Order blocked by risk management:\n${riskValidation.errors.join('\n')}`);
        return;
      }
      
      // Show confirmation dialog for high-risk trades
      if (riskSettings.requireConfirmation && riskValidation.warnings.length > 0) {
        const confirmed = window.confirm(
          `Risk Warning:\n${riskValidation.warnings.join('\n')}\n\nDo you want to proceed?`
        );
        if (!confirmed) return;
      }
      
      const orderData = {
        symbol: selectedSymbol,
        assetType,
        side: orderSide,
        type: orderType,
        quantity: parseFloat(quantity),
        price: orderType !== 'market' ? parseFloat(price) : undefined,
        stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
        trailingAmount: orderType === 'trailing-stop' && trailingAmount ? parseFloat(trailingAmount) : undefined,
        timeInForce,
        takeProfitPrice: takeProfitPrice ? parseFloat(takeProfitPrice) : undefined,
        stopLossPrice: stopLossPrice ? parseFloat(stopLossPrice) : undefined,
        metadata: {
          accountId: 'default',
          isAutomated,
          riskAmount: parseFloat(riskAmount),
          riskPercent: parseFloat(riskPercent)
        }
      };
      
      const order = await tradingService.current.placeOrder(orderData);
      
      // Call parent callback
      onOrderSubmit?.(order);
      
      // Show success notification
      alert(`${orderSide.toUpperCase()} order submitted for ${quantity} ${assetType === 'stock' ? 'shares' : 'units'} of ${selectedSymbol}`);
      
      // Reset form for next order
      if (!isAutomated) {
        setQuantity('100');
        setStopPrice('');
        setTakeProfitPrice('');
        setStopLossPrice('');
      }
      
      // Reset risk validation
      setRiskValidation({ isValid: true, warnings: [], errors: [] });
      
    } catch (error) {
      console.error('Order submission failed:', error);
      alert(`Order failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Trading Panel
              </h2>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Live</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAutomated(!isAutomated)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isAutomated
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {isAutomated ? <Play className="h-3 w-3 mr-1 inline" /> : <Pause className="h-3 w-3 mr-1 inline" />}
              {isAutomated ? 'Auto' : 'Manual'}
            </button>
            <button
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Symbol and Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSymbol}</h3>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                isConnected ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${
                marketData && marketData.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${getCurrentPrice().toFixed(2)}
              </span>
              {marketData && (
                <div className={`flex items-center space-x-1 ${
                  marketData.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right space-y-2">
            <div>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-32"
              >
                <option value="AAPL">AAPL</option>
                <option value="TSLA">TSLA</option>
                <option value="NVDA">NVDA</option>
                <option value="BTC-USD">BTC-USD</option>
                <option value="ETH-USD">ETH-USD</option>
                <option value="EUR/USD">EUR/USD</option>
                <option value="ES">ES (S&P 500)</option>
              </select>
            </div>
            <div>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-32"
              >
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
                <option value="forex">Forex</option>
                <option value="futures">Futures</option>
                <option value="options">Options</option>
                <option value="etf">ETF</option>
                <option value="bond">Bond</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Side Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setOrderSide('buy')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              orderSide === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setOrderSide('sell')}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              orderSide === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            SELL
          </button>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order Type
          </label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Order</option>
            <option value="stop-limit">Stop-Limit Order</option>
            <option value="trailing-stop">Trailing Stop</option>
            <option value="oco">OCO (One-Cancels-Other)</option>
            <option value="bracket">Bracket Order</option>
          </select>
        </div>

        {/* Quantity and Price */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="100"
            />
          </div>
          
          {/* Price inputs based on order type */}
          {orderType === 'limit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Limit Price
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder={getCurrentPrice().toString()}
              />
            </div>
          )}
          
          {(orderType === 'stop' || orderType === 'trailing-stop') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stop Price
              </label>
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder={getCurrentPrice().toString()}
              />
            </div>
          )}
          
          {orderType === 'stop-limit' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stop Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={getCurrentPrice().toString()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Limit Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={getCurrentPrice().toString()}
                />
              </div>
            </div>
          )}
          
          {(orderType === 'oco' || orderType === 'bracket') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={getCurrentPrice().toString()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={getCurrentPrice().toString()}
                />
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        {isAdvancedMode && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white">Advanced Options</h4>
            
            {/* Stop Loss and Take Profit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stop Loss
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="145.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Take Profit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="155.00"
                />
              </div>
            </div>

            {/* Time in Force */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time in Force
              </label>
              <select
                value={timeInForce}
                onChange={(e) => setTimeInForce(e.target.value as TimeInForce)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="day">Day Order</option>
                <option value="gtc">Good Till Cancelled</option>
                <option value="ioc">Immediate or Cancel</option>
                <option value="fok">Fill or Kill</option>
                <option value="gtd">Good Till Date</option>
              </select>
            </div>
            
            {/* Trailing Amount for Trailing Stop */}
            {orderType === 'trailing-stop' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trailing Amount ($)
                </label>
                <input
                   type="number"
                   step="0.01"
                   value={trailingAmount}
                   onChange={(e) => setTrailingAmount(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                   placeholder="5.00"
                 />
              </div>
            )}

            {/* Risk Management */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Amount ($)
                </label>
                <input
                  type="number"
                  value={riskAmount}
                  onChange={(e) => setRiskAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Risk Percent (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="2.0"
                />
              </div>
            </div>

            {/* Time in Force */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time in Force
              </label>
              <select
                value={timeInForce}
                onChange={(e) => setTimeInForce(e.target.value as TimeInForce)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="day">Day Order</option>
                <option value="gtc">Good Till Canceled</option>
                <option value="ioc">Immediate or Cancel</option>
                <option value="fok">Fill or Kill</option>
              </select>
            </div>

            {/* Risk/Reward Ratio */}
            {calculateRiskReward() && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Risk/Reward Ratio:
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  1:{calculateRiskReward()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Order Value:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${calculateOrderValue().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estimated Fee:</span>
              <span className="font-medium text-gray-900 dark:text-white">$0.65</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                ${(calculateOrderValue() + 0.65).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Management Status */}
        {(riskValidation.errors.length > 0 || riskValidation.warnings.length > 0) && (
          <div className="space-y-2">
            {riskValidation.errors.map((error, index) => (
              <div key={index} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
              </div>
            ))}
            {riskValidation.warnings.map((warning, index) => (
              <div key={index} className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-yellow-700 dark:text-yellow-400">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitOrder}
          disabled={!riskValidation.isValid}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            !riskValidation.isValid
              ? 'bg-gray-400 cursor-not-allowed'
              : orderSide === 'buy'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {!riskValidation.isValid ? 'Risk Check Failed' : (orderSide === 'buy' ? 'Place Buy Order' : 'Place Sell Order')}
        </button>

        {/* Risk Management Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Risk Management
          </h4>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Risk/Trade (%)</label>
                <input
                  type="number"
                  value={riskSettings.maxRiskPerTrade}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxRiskPerTrade: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Daily Loss (%)</label>
                <input
                  type="number"
                  value={riskSettings.maxDailyLoss}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDailyLoss: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  max="20"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Position ($)</label>
                <input
                  type="number"
                  value={riskSettings.maxPositionSize}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxPositionSize: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  step="100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Max Exposure (%)</label>
                <input
                  type="number"
                  value={riskSettings.maxPortfolioExposure}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxPortfolioExposure: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Require Confirmation</span>
              <button
                onClick={() => setRiskSettings(prev => ({ ...prev, requireConfirmation: !prev.requireConfirmation }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  riskSettings.requireConfirmation ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    riskSettings.requireConfirmation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Automation Controls */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Bot className="h-4 w-4 mr-2" />
            Workflow Automation
          </h4>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            {/* Automation Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Automation</span>
                <p className="text-xs text-gray-600 dark:text-gray-400">Activate workflow-based trading automation</p>
              </div>
              <button
                onClick={() => setAutomationEnabled(!automationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  automationEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    automationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* Workflow Metrics */}
            {workflowMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {workflowMetrics.activeWorkflows}/{workflowMetrics.totalWorkflows}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active Workflows</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {workflowMetrics.successRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
              </div>
            )}
            
            {/* Active Workflows */}
            {automationEnabled && workflows.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Active Workflows</h5>
                {workflows.filter(w => w.isActive).slice(0, 3).map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{workflow.name}</span>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {workflow.executionCount} executions
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      workflow.successRate > 90 ? 'bg-green-500' : 
                      workflow.successRate > 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Portfolio Overview
          </h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Value</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${portfolioMetrics.totalValue.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total P&L</div>
              <div className={`text-lg font-bold ${
                portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${portfolioMetrics.totalPnL >= 0 ? '+' : ''}${portfolioMetrics.totalPnL.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cash Balance</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${portfolioMetrics.cashBalance.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Open Positions</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {positions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Positions */}
        {showPositions && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Open Positions ({positions.length})
              </h4>
              <button
                onClick={() => setShowPositions(!showPositions)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPositions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            {positions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No open positions</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {positions.map((position, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">{position.symbol}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                         position.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {position.quantity > 0 ? 'LONG' : 'SHORT'}
                       </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {position.quantity} shares @ ${position.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(position.quantity * getCurrentPrice()).toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                         position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                       }`}>
                         ${position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                         ({((position.unrealizedPnL / (position.quantity * position.avgPrice)) * 100).toFixed(2)}%)
                       </div>
                    </div>
                    <div className="ml-3 flex space-x-1">
                      <button
                        onClick={() => {
                           // Close half position
                           setQuantity(Math.floor(Math.abs(position.quantity) / 2).toString());
                           setOrderSide(position.quantity > 0 ? 'sell' : 'buy');
                           setSelectedSymbol(position.symbol);
                         }}
                        className="p-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        title="Close 50%"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => {
                           // Close full position
                           setQuantity(Math.abs(position.quantity).toString());
                           setOrderSide(position.quantity > 0 ? 'sell' : 'buy');
                           setSelectedSymbol(position.symbol);
                         }}
                        className="p-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        title="Close All"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingViewOrderPanel;