'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Note: Select, ScrollArea, and Separator components not available - using alternatives
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
  EyeOff
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
}

const TradingPanel: React.FC<TradingPanelProps> = ({ 
  className = '',
  defaultSymbol = 'BTCUSDT'
}) => {
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

  // Prepare chart data
  const chartData = candlestickData.map(candle => ({
    time: new Date(candle.time).toLocaleTimeString(),
    price: candle.close,
    volume: candle.volume
  }));

  return (
    <div className={`w-full space-y-2 sm:space-y-4 ${className}`}>
      {/* Header with Symbol Selector and Market Stats */}
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <select 
                  value={selectedSymbol} 
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-32 sm:w-40 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
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
          <CardContent className="pt-2 sm:pt-6">
            <div className="h-48 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
                <TabsList className="grid w-full grid-cols-2 h-8 sm:h-10">
                  <TabsTrigger value="buy" className="text-green-600 text-xs sm:text-sm">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600 text-xs sm:text-sm">Sell</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium">Order Type</label>
                    <select 
                    value={orderType} 
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                  </select>
                </div>
                
                {orderType !== 'market' && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium">Price</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      className="h-8 sm:h-10 text-sm sm:text-base"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-xs sm:text-sm font-medium">Size</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={orderSize}
                    onChange={(e) => setOrderSize(e.target.value)}
                    className="h-8 sm:h-10 text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium">Leverage</label>
                    <select 
                    value={leverage.toString()} 
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                    <option value="5">5x</option>
                    <option value="10">10x</option>
                    <option value="20">20x</option>
                  </select>
                </div>
                
                <Button 
                  onClick={placeOrder}
                  className={`w-full h-8 sm:h-10 text-sm sm:text-base ${
                    orderSide === 'buy' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={!isTrading}
                >
                  {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
                </Button>
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
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                >
                  {showOrderBook ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
              </div>
            </CardHeader>
            {showOrderBook && orderBook && (
              <CardContent className="pt-2 sm:pt-6">
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1 sm:gap-2">
                    <span>Price</span>
                    <span className="text-right">Size</span>
                    <span className="text-right">Total</span>
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
    </div>
  );
};

export default TradingPanel;