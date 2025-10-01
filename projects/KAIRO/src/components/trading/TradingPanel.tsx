'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Note: Select, ScrollArea, and Separator components not available - using alternatives
import { Progress } from '@/components/ui/progress';
import TradingViewChart from './TradingViewChart';
import RiskManagementDashboard from './RiskManagementDashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Target, 
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Zap,
  Eye,
  EyeOff,
  X,
  Maximize2,
  Minimize2,
  Shield
} from 'lucide-react';
import { 
  liveMarketService, 
  useMarketData, 
  useCandlestickData, 
  useOrderBook, 
  useRecentTrades,
  type MarketTicker,
  type CandlestickData,
  type OrderBook,
  type Trade
} from '@/services/liveMarketService';
import { useLiveTrading, OrderRequest } from '@/services/liveTradingService';
import { useTradingMode } from '@/contexts/TradingModeContext';
import DemoModeIndicator from '@/components/ui/DemoModeIndicator';

// Using types from live trading service
import type { TradingPosition, TradingOrder } from '@/services/liveTradingService';

// Local fallback interfaces for when not connected to live trading
interface LocalPosition {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface LocalOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  size: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: number;
}

interface TradingPanelProps {
  className?: string;
  defaultSymbol?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ 
  className = '',
  defaultSymbol = 'BTCUSDT',
  isOpen = true,
  onClose,
  isModal = false
}) => {
  const { isPaperTrading } = useTradingMode();
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderSize, setOrderSize] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  // Live trading integration
  const { 
    account, 
    positions, 
    orders, 
    signals, 
    isConnected, 
    placeOrder: placeLiveOrder, 
    closePosition: closeLivePosition, 
    modifyPosition 
  } = useLiveTrading();
  
  const [localPositions, setLocalPositions] = useState<LocalPosition[]>([]);
  const [localOrders, setLocalOrders] = useState<LocalOrder[]>([]);
  const [balance, setBalance] = useState(10000);
  const [isTrading, setIsTrading] = useState(false);
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [chartTimeframe, setChartTimeframe] = useState('1m');
  const [activeTab, setActiveTab] = useState('trading');
  
  // Market data hooks
  const marketData = useMarketData(selectedSymbol) as MarketTicker;
  const candlestickData = useCandlestickData(selectedSymbol, 100);
  const orderBook = useOrderBook(selectedSymbol);
  const recentTrades = useRecentTrades(selectedSymbol, 20);
  const allMarketData = useMarketData() as MarketTicker[];

  // Get supported symbols
  const supportedSymbols = liveMarketService.getSupportedSymbols();

  // Update positions with current prices
  useEffect(() => {
    if (marketData && localPositions.length > 0) {
      setLocalPositions(prev => prev.map(position => {
        if (position.symbol === selectedSymbol) {
          const currentPrice = marketData.price;
          const pnl = position.side === 'long' 
            ? (currentPrice - position.entryPrice) * position.size
            : (position.entryPrice - currentPrice) * position.size;
          const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100;
          
          return {
            ...position,
            currentPrice,
            pnl,
            pnlPercent
          };
        }
        return position;
      }));
    }
  }, [marketData, selectedSymbol, localPositions]);

  // Use live positions if connected, otherwise use local positions
  const displayPositions = isConnected && positions ? positions : localPositions;
  const displayOrders = isConnected && orders ? orders : localOrders;
  const displayBalance = isConnected && account ? account.balance : balance;

  // Place order function
  const placeOrder = useCallback(async () => {
    if (!orderSize || !marketData) return;
    
    const size = parseFloat(orderSize);
    const price = orderType === 'market' ? marketData.price : parseFloat(orderPrice);
    
    if (isNaN(size) || size <= 0) {
      alert('Please enter a valid order size');
      return;
    }
    
    if (orderType !== 'market' && (isNaN(price) || price <= 0)) {
      alert('Please enter a valid order price');
      return;
    }

    if (isConnected && placeLiveOrder) {
      // Use live trading service
      const orderRequest: OrderRequest = {
        symbol: selectedSymbol,
        type: orderType,
        side: orderSide,
        size,
        price: orderType === 'market' ? undefined : price,
        leverage: leverage
      };

      const result = await placeLiveOrder(orderRequest);
      
      if (result.success) {
        // Reset form
        setOrderSize('');
        setOrderPrice('');
        alert(`${orderSide.toUpperCase()} order placed successfully for ${size} ${selectedSymbol}`);
      } else {
        alert(`Order failed: ${result.error}`);
      }
    } else {
      // Fallback to local simulation
      const orderValue = size * price;
      const requiredMargin = orderValue / leverage;
      
      if (requiredMargin > balance) {
        alert('Insufficient balance');
        return;
      }
      
      const newOrder: LocalOrder = {
        id: `order_${Date.now()}`,
        symbol: selectedSymbol,
        side: orderSide,
        type: orderType,
        size,
        price: orderType === 'market' ? undefined : price,
        status: orderType === 'market' ? 'filled' : 'pending',
        timestamp: Date.now()
      };
      
      setLocalOrders(prev => [newOrder, ...prev]);
      
      // If market order, create position immediately
      if (orderType === 'market') {
        const newPosition: LocalPosition = {
          id: `pos_${Date.now()}`,
          symbol: selectedSymbol,
          side: orderSide === 'buy' ? 'long' : 'short',
          size,
          entryPrice: price,
          currentPrice: price,
          pnl: 0,
          pnlPercent: 0,
          timestamp: Date.now()
        };
        
        setLocalPositions(prev => [newPosition, ...prev]);
        setBalance(prev => prev - requiredMargin);
      }
      
      // Reset form
      setOrderSize('');
      setOrderPrice('');
    }
  }, [orderSize, orderPrice, orderType, orderSide, selectedSymbol, marketData, leverage, balance, isConnected, placeLiveOrder]);

  // Close position function
  const closePosition = useCallback(async (positionId: string) => {
    if (isConnected && closeLivePosition) {
      // Use live trading service
      const result = await closeLivePosition(positionId);
      
      if (result.success) {
        alert('Position closed successfully');
      } else {
        alert(`Failed to close position: ${result.error}`);
      }
    } else {
      // Fallback to local simulation
      setLocalPositions(prev => {
        const position = prev.find(p => p.id === positionId);
        if (position) {
          const returnAmount = (position.entryPrice * position.size / leverage) + position.pnl;
          setBalance(prevBalance => prevBalance + returnAmount);
        }
        return prev.filter(p => p.id !== positionId);
      });
    }
  }, [leverage, isConnected, closeLivePosition]);

  // Format price function
  const formatPrice = (price: number, decimals = 2) => {
    return price.toFixed(decimals);
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Chart data is now handled by TradingViewChart component

  // Don't render if modal is closed
  if (isModal && !isOpen) {
    return null;
  }

  const content = (
    <div className={`w-full space-y-2 sm:space-y-4 ${className}`}>
      {/* Demo Mode Banner */}
      {isPaperTrading && (
        <DemoModeIndicator variant="banner" />
      )}
      
      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trading" className="space-y-2 sm:space-y-4">
          {/* Header with Symbol Selector and Market Stats */}
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <select 
                  value={selectedSymbol} 
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-32 sm:w-40 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Select trading symbol"
                >
                  {supportedSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
                <Badge variant={marketData?.changePercent >= 0 ? 'default' : 'destructive'} className="text-xs sm:text-sm">
                  {marketData?.changePercent >= 0 ? '+' : ''}{marketData?.changePercent.toFixed(2)}%
                </Badge>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTrading(!isTrading)}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  {isTrading ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                  <span className="hidden sm:inline ml-1">{isTrading ? 'Pause' : 'Start'}</span>
                </Button>
                <Button variant="outline" size="sm" className="px-2 sm:px-3">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-6">
            {marketData && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Price</p>
                  <p className="text-lg sm:text-2xl font-bold">${formatPrice(marketData.price)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">24h Change</p>
                  <p className={`text-sm sm:text-lg font-semibold ${
                    marketData.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.change >= 0 ? '+' : ''}${formatPrice(marketData.change)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">24h High</p>
                  <p className="text-sm sm:text-lg font-semibold">${formatPrice(marketData.high24h)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">24h Low</p>
                  <p className="text-sm sm:text-lg font-semibold">${formatPrice(marketData.low24h)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Account Balance */}
        <Card className="lg:w-80">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-6">
            <div className="space-y-2 sm:space-y-3">
              <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-lg sm:text-2xl font-bold">{formatCurrency(displayBalance)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground">Total PnL</p>
                    <p className={`font-semibold ${
                      displayPositions.reduce((sum, p) => sum + p.pnl, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(displayPositions.reduce((sum, p) => sum + p.pnl, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Open Positions</p>
                    <p className="font-semibold">{displayPositions.length}</p>
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-green-600">Connected to Live Trading</span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Price Chart
              </CardTitle>
              <div className="flex items-center gap-2">
                <select 
                  value={chartTimeframe} 
                  onChange={(e) => setChartTimeframe(e.target.value)}
                  className="w-16 sm:w-20 px-1 sm:px-2 py-1 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 text-xs sm:text-sm"
                >
                  <option value="1m">1m</option>
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                  <option value="1h">1h</option>
                  <option value="4h">4h</option>
                  <option value="1d">1d</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TradingViewChart 
              symbol={selectedSymbol}
              interval={chartTimeframe}
              height={320}
              theme="dark"
              autosize={false}
            />
          </CardContent>
        </Card>

        {/* Order Entry & Market Data */}
        <div className="space-y-2 sm:space-y-4">
          {/* Order Entry */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                Place Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 pt-2 sm:pt-6">
              <Tabs value={orderSide} onValueChange={(value) => setOrderSide(value as 'buy' | 'sell')}>
                <TabsList className="grid w-full grid-cols-2 h-8 sm:h-10" role="tablist" aria-label="Order side selection">
                  <TabsTrigger value="buy" className="text-green-600 text-xs sm:text-sm" aria-label="Buy order">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600 text-xs sm:text-sm" aria-label="Sell order">Sell</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <label htmlFor="order-type" className="text-xs sm:text-sm font-medium">Order Type</label>
                    <select 
                    id="order-type"
                    value={orderType} 
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-describedby="order-type-help"
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                  </select>
                  <div id="order-type-help" className="sr-only">Select the type of order to place</div>
                </div>
                
                {orderType !== 'market' && (
                  <div>
                    <label htmlFor="order-price" className="text-xs sm:text-sm font-medium">Price</label>
                    <Input
                      id="order-price"
                      type="number"
                      placeholder="0.00"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      className="h-8 sm:h-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-describedby="order-price-help"
                      aria-label="Order price in USD"
                    />
                    <div id="order-price-help" className="sr-only">Enter the price for your {orderType} order</div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="order-size" className="text-xs sm:text-sm font-medium">Size</label>
                  <Input
                    id="order-size"
                    type="number"
                    placeholder="0.00"
                    value={orderSize}
                    onChange={(e) => setOrderSize(e.target.value)}
                    className="h-8 sm:h-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-describedby="order-size-help"
                    aria-label={`Order size in ${selectedSymbol}`}
                  />
                  <div id="order-size-help" className="sr-only">Enter the amount of {selectedSymbol} to {orderSide}</div>
                </div>
                
                <div>
                  <label htmlFor="leverage" className="text-xs sm:text-sm font-medium">Leverage</label>
                    <select 
                    id="leverage"
                    value={leverage.toString()} 
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-describedby="leverage-help"
                  >
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                    <option value="5">5x</option>
                    <option value="10">10x</option>
                    <option value="20">20x</option>
                  </select>
                  <div id="leverage-help" className="sr-only">Select leverage multiplier for your position</div>
                </div>
                
                <Button 
                  onClick={placeOrder}
                  className={`w-full h-8 sm:h-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    orderSide === 'buy' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                  disabled={!isTrading}
                  aria-describedby="place-order-help"
                  aria-label={`Place ${orderType} ${orderSide} order for ${orderSize || '0'} ${selectedSymbol}${orderType !== 'market' ? ` at $${orderPrice || '0'}` : ''}`}
                >
                  {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
                </Button>
                <div id="place-order-help" className="sr-only">
                  {!isTrading ? 'Trading is currently disabled' : `Place a ${orderType} ${orderSide} order`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Book */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  Order Book
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderBook(!showOrderBook)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label={showOrderBook ? 'Hide order book' : 'Show order book'}
                  aria-expanded={showOrderBook}
                  aria-controls="order-book-content"
                >
                  {showOrderBook ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />}
                </Button>
              </div>
            </CardHeader>
            {showOrderBook && orderBook && (
              <CardContent id="order-book-content" className="pt-2 sm:pt-6">
                <div className="space-y-1 sm:space-y-2" role="table" aria-label="Order book data">
                  <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1 sm:gap-2" role="row">
                    <span role="columnheader">Price</span>
                    <span className="text-right" role="columnheader">Size</span>
                    <span className="text-right" role="columnheader">Total</span>
                  </div>
                  
                  {/* Asks (Sell orders) */}
                  <div className="h-20 sm:h-32 overflow-y-auto">
                    <div className="space-y-0.5 sm:space-y-1">
                      {orderBook.asks.slice(0, 10).reverse().map((ask, index) => (
                        <div key={index} className="text-xs grid grid-cols-3 gap-1 sm:gap-2 text-red-600">
                          <span>{formatPrice(ask.price)}</span>
                          <span className="text-right">{ask.size.toFixed(4)}</span>
                          <span className="text-right">{formatPrice(ask.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                  
                  {/* Current Price */}
                  <div className="text-center py-1">
                    <span className="text-sm sm:text-lg font-bold">
                      ${marketData ? formatPrice(marketData.price) : '0.00'}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                  
                  {/* Bids (Buy orders) */}
                  <div className="h-20 sm:h-32 overflow-y-auto">
                    <div className="space-y-0.5 sm:space-y-1">
                      {orderBook.bids.slice(0, 10).map((bid, index) => (
                        <div key={index} className="text-xs grid grid-cols-3 gap-1 sm:gap-2 text-green-600">
                          <span>{formatPrice(bid.price)}</span>
                          <span className="text-right">{bid.size.toFixed(4)}</span>
                          <span className="text-right">{formatPrice(bid.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Positions and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
        {/* Open Positions */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Open Positions ({displayPositions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-6">
            {displayPositions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 sm:py-8 text-sm">No open positions</p>
            ) : (
              <div className="h-48 sm:h-64 overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {displayPositions.map(position => (
                    <div key={position.id} className="border rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Badge variant={position.side === 'long' ? 'default' : 'destructive'} className="text-xs">
                            {position.side.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-sm sm:text-base">{position.symbol}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => closePosition(position.id)}
                          className="h-6 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                        >
                          Close
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">{position.size}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Entry Price</p>
                          <p className="font-medium">${formatPrice(position.entryPrice)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Price</p>
                          <p className="font-medium">${formatPrice(position.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">PnL</p>
                          <p className={`font-medium ${
                            position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(position.pnl)} ({position.pnlPercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Orders ({displayOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-6">
            {displayOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 sm:py-8 text-sm">No recent orders</p>
            ) : (
              <div className="h-48 sm:h-64 overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {displayOrders.slice(0, 10).map(order => (
                    <div key={order.id} className="border rounded-lg p-2 sm:p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Badge variant={order.side === 'buy' ? 'default' : 'destructive'} className="text-xs">
                            {order.side.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-sm sm:text-base">{order.symbol}</span>
                        </div>
                        <Badge variant={order.status === 'filled' ? 'default' : 'secondary'} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">{order.type.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">{order.size}</p>
                        </div>
                        {order.price && (
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium">${formatPrice(order.price)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Time</p>
                          <p className="font-medium">
                            {new Date(typeof order.timestamp === 'number' ? order.timestamp : order.timestamp.getTime()).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            Recent Market Trades
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-6">
          {recentTrades && recentTrades.length > 0 ? (
            <div className="h-32 sm:h-48 overflow-y-auto">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-xs text-muted-foreground grid grid-cols-4 gap-1 sm:gap-2 pb-1 sm:pb-2">
                  <span>Time</span>
                  <span>Side</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Size</span>
                </div>
                {recentTrades.map(trade => (
                  <div key={trade.id} className="text-xs grid grid-cols-4 gap-1 sm:gap-2 py-0.5 sm:py-1">
                    <span className="text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}>
                      {trade.side.toUpperCase()}
                    </span>
                    <span className="text-right font-medium">
                      ${formatPrice(trade.price)}
                    </span>
                    <span className="text-right">
                      {trade.size.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 sm:py-8 text-sm">No recent trades</p>
          )}
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-2 sm:space-y-4">
          <RiskManagementDashboard 
            accountBalance={balance}
            positions={displayPositions.map(pos => ({
              symbol: pos.symbol,
              quantity: pos.size,
              side: pos.side,
              entryPrice: pos.entryPrice,
              currentPrice: pos.currentPrice,
              unrealizedPnL: pos.pnl
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  // Return modal wrapper if isModal is true
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Trading Panel</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Modal Content */}
          <div className="flex-1 overflow-auto p-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default TradingPanel;