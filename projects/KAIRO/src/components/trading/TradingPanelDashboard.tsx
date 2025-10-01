'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Search,
  Star,
  Volume2,
  RefreshCw,
  Settings,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Clock,
  Target,
  Bot,
  Users,
  Shield,
  Play,
  Pause,
  TrendingUpIcon,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import TradingViewChart from './TradingViewChart';
import { 
  useMarketData, 
  useOrderBook, 
  useTrades, 
  useMarketConnection,
  MarketData,
  OrderBookEntry,
  Trade,
  MARKET_SYMBOLS
} from '@/services/marketDataService';

// Types
interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  leverage: number;
}

interface TradingPanelDashboardProps {
  initialParams?: {
    symbol?: string;
    orderType?: 'market' | 'limit' | 'stop';
    orderSide?: 'buy' | 'sell';
    quantity?: string;
    price?: string;
  };
}

const TradingPanelDashboard: React.FC<TradingPanelDashboardProps> = ({ initialParams }) => {
  // State - Initialize with URL parameters if provided
  const [selectedSymbol, setSelectedSymbol] = useState(initialParams?.symbol || 'LINKUSDT');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>(initialParams?.orderType || 'limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>(initialParams?.orderSide || 'buy');
  const [orderQuantity, setOrderQuantity] = useState(initialParams?.quantity || '');
  const [orderPrice, setOrderPrice] = useState(initialParams?.price || '');
  const [leverage, setLeverage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('spot');
  const [rightPanelTab, setRightPanelTab] = useState('orderbook');
  
  // GainzAlgo V2 Pro state
  const [gainzAlgoEnabled, setGainzAlgoEnabled] = useState(false);
  const [gainzAlgoStrategy, setGainzAlgoStrategy] = useState('momentum');
  const [gainzAlgoRiskLevel, setGainzAlgoRiskLevel] = useState('medium');
  const [gainzAlgoCapital, setGainzAlgoCapital] = useState('1000');
  
  // Copy Trading state
  const [copyTradingEnabled, setCopyTradingEnabled] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState('');
  const [copyRatio, setCopyRatio] = useState(100);
  
  // Risk Management state
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [stopLossPercent, setStopLossPercent] = useState('5');
  const [takeProfitPercent, setTakeProfitPercent] = useState('10');
  const [maxDailyLoss, setMaxDailyLoss] = useState('500');
  
  // Real market data hooks
  const { isConnected } = useMarketConnection();
  const { data: marketData, isLoading: marketDataLoading } = useMarketData(selectedSymbol);
  const { orderBook, isLoading: orderBookLoading } = useOrderBook(selectedSymbol);
  const { trades: recentTrades, isLoading: tradesLoading } = useTrades(selectedSymbol);

  // Get all available symbols for the dropdown
  const allSymbols = [
    ...MARKET_SYMBOLS.crypto,
    ...MARKET_SYMBOLS.stocks,
    ...MARKET_SYMBOLS.forex
  ];

  // Mock positions - in real app, this would come from user's portfolio API
  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'LINKUSDT',
      side: 'long',
      size: 500,
      entryPrice: 21.250,
      markPrice: 21.575,
      pnl: 162.5,
      pnlPercent: 1.53,
      margin: 1062.5,
      leverage: 10
    }
  ]);

  // Update order price when market data changes
  useEffect(() => {
    if (marketData && orderType === 'limit' && !orderPrice) {
      setOrderPrice(marketData.price.toString());
    }
  }, [marketData, orderType, orderPrice]);

  const handlePlaceOrder = useCallback(async () => {
    if (!orderQuantity || (!orderPrice && orderType !== 'market')) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${orderSide.toUpperCase()} order placed successfully`);
      setOrderQuantity('');
      setOrderPrice('');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsLoading(false);
    }
  }, [orderQuantity, orderPrice, orderType, orderSide]);

  const formatNumber = (num: number, decimals: number = 3) => {
    return num.toFixed(decimals);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketData?.symbol || selectedSymbol}
                </h1>
                <Badge variant="secondary">{marketData?.name || 'Loading...'}</Badge>
              </div>
              
              {/* Symbol Selector */}
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">Crypto</div>
                  {MARKET_SYMBOLS.crypto.map((symbolData) => (
                    <SelectItem key={symbolData.symbol} value={symbolData.symbol}>
                      {symbolData.name} ({symbolData.symbol})
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Stocks</div>
                  {MARKET_SYMBOLS.stocks.map((symbolData) => (
                    <SelectItem key={symbolData.symbol} value={symbolData.symbol}>
                      {symbolData.name} ({symbolData.symbol})
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">Forex</div>
                  {MARKET_SYMBOLS.forex.map((symbolData) => (
                    <SelectItem key={symbolData.symbol} value={symbolData.symbol}>
                      {symbolData.name} ({symbolData.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4">
              {marketDataLoading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : marketData ? (
                <>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${formatNumber(marketData.price)}
                  </div>
                  <div className={cn(
                    "flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium",
                    marketData.change >= 0 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  )}>
                    {marketData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{formatNumber(marketData.change, 3)} ({formatNumber(marketData.changePercent, 2)}%)</span>
                  </div>
                </>
              ) : (
                <div className="text-red-500">Failed to load market data</div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Watchlist
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Market Stats */}
        {marketData && (
          <div className="flex items-center space-x-8 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">24h High:</span>
              <span className="ml-2">${formatNumber(marketData.high24h)}</span>
            </div>
            <div>
              <span className="font-medium">24h Low:</span>
              <span className="ml-2">${formatNumber(marketData.low24h)}</span>
            </div>
            <div>
              <span className="font-medium">24h Volume:</span>
              <span className="ml-2">{marketData.volume.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Spread:</span>
              <span className="ml-2">{formatNumber(marketData.spread, 4)}</span>
            </div>
            <div className={cn(
              "flex items-center space-x-1",
              isConnected ? "text-green-500" : "text-red-500"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chart */}
        <div className="flex-1 flex flex-col">
          {/* Chart Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="spot">Spot</TabsTrigger>
                  <TabsTrigger value="futures">Futures</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">1m</Button>
                <Button variant="outline" size="sm">5m</Button>
                <Button variant="outline" size="sm">15m</Button>
                <Button variant="outline" size="sm">1h</Button>
                <Button variant="outline" size="sm">4h</Button>
                <Button variant="default" size="sm">1D</Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 overflow-hidden">
            <TradingViewChart
              symbol={`BINANCE:${selectedSymbol}`}
              interval="15"
              theme="dark"
              height={600}
              autosize={true}
              allow_symbol_change={true}
              studies={['RSI', 'MACD', 'BB']}
              enableLiveData={true}
            />
          </div>
        </div>

        {/* Right Panel - Order Book & Trading */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Trading Form */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-4">
              {/* Order Type Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setOrderSide('buy')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    orderSide === 'buy'
                      ? "bg-green-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderSide('sell')}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    orderSide === 'sell'
                      ? "bg-red-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  Sell
                </button>
              </div>

              {/* Order Type */}
              <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Input */}
              {orderType !== 'market' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (USDT)
                  </label>
                  <Input
                    type="number"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.001"
                  />
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity (LINK)
                </label>
                <Input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  placeholder="0.00"
                  step="0.1"
                />
              </div>

              {/* Leverage Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Leverage: {leverage}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Est. Cost:</span>
                  <span className="font-medium">
                    {orderQuantity && orderPrice 
                      ? formatCurrency(Number(orderQuantity) * Number(orderPrice))
                      : '$0.00'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Margin:</span>
                  <span className="font-medium">
                    {orderQuantity && orderPrice 
                      ? formatCurrency((Number(orderQuantity) * Number(orderPrice)) / leverage)
                      : '$0.00'
                    }
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className={cn(
                  "w-full",
                  orderSide === 'buy' 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-red-500 hover:bg-red-600"
                )}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
              </Button>
            </div>
          </div>

          {/* Order Book */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6 mx-4 mt-4 text-xs">
                <TabsTrigger value="orderbook">Book</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="gainzalgo">GainzAlgo</TabsTrigger>
                <TabsTrigger value="copytrading">Copy</TabsTrigger>
                <TabsTrigger value="riskmanagement">Risk</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orderbook" className="flex-1 overflow-hidden mt-4">
                {orderBookLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : orderBook ? (
                  <div className="h-full flex flex-col">
                    {/* Asks */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-4 pb-2">
                        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          <span>Price (USDT)</span>
                          <span className="text-right">Quantity</span>
                          <span className="text-right">Total</span>
                        </div>
                        {orderBook.asks.slice().reverse().map((ask, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer">
                            <span className="text-red-500 font-mono">{formatNumber(ask.price)}</span>
                            <span className="text-right font-mono">{formatNumber(ask.quantity, 1)}</span>
                            <span className="text-right font-mono text-gray-600 dark:text-gray-400">{formatNumber(ask.total, 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Current Price */}
                    <div className="px-4 py-2 border-y border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        {marketData && (
                          <>
                            <div className={cn(
                              "text-lg font-bold",
                              marketData.change >= 0 ? "text-green-500" : "text-red-500"
                            )}>
                              ${formatNumber(marketData.price)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ${formatNumber(marketData.price)} ≈ ${formatNumber(marketData.price)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Bids */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-4 pt-2">
                        {orderBook.bids.map((bid, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer">
                            <span className="text-green-500 font-mono">{formatNumber(bid.price)}</span>
                            <span className="text-right font-mono">{formatNumber(bid.quantity, 1)}</span>
                            <span className="text-right font-mono text-gray-600 dark:text-gray-400">{formatNumber(bid.total, 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-red-500">
                    Failed to load order book
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="trades" className="flex-1 overflow-hidden mt-4">
                {tradesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : recentTrades && recentTrades.length > 0 ? (
                  <div className="h-full overflow-y-auto px-4">
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <span>Price (USDT)</span>
                      <span className="text-right">Quantity</span>
                      <span className="text-right">Time</span>
                    </div>
                    {recentTrades.map((trade, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1">
                        <span className={cn(
                          "font-mono",
                          trade.side === 'buy' ? "text-green-500" : "text-red-500"
                        )}>
                          {formatNumber(trade.price)}
                        </span>
                        <span className="text-right font-mono">{formatNumber(trade.quantity, 1)}</span>
                        <span className="text-right text-gray-600 dark:text-gray-400">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No recent trades
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="positions" className="flex-1 overflow-hidden mt-4">
                <div className="h-full overflow-y-auto px-4">
                  {positions.length > 0 ? (
                    positions.map((position, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{position.symbol}</span>
                            <Badge variant={position.side === 'long' ? 'default' : 'destructive'}>
                              {position.side.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Size:</span>
                              <span>{position.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Entry:</span>
                              <span>${formatNumber(position.entryPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Mark:</span>
                              <span>${formatNumber(position.markPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">PnL:</span>
                              <span className={cn(
                                position.pnl >= 0 ? "text-green-500" : "text-red-500"
                              )}>
                                {formatCurrency(position.pnl)} ({formatNumber(position.pnlPercent, 2)}%)
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                      <Target className="h-8 w-8 mx-auto mb-2" />
                      <p>No open positions</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* GainzAlgo V2 Pro Tab */}
              <TabsContent value="gainzalgo" className="flex-1 overflow-hidden mt-4">
                <div className="h-full overflow-y-auto px-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">GainzAlgo V2 Pro</h3>
                    </div>
                    <Button
                      onClick={() => setGainzAlgoEnabled(!gainzAlgoEnabled)}
                      variant={gainzAlgoEnabled ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        gainzAlgoEnabled && "bg-green-500 hover:bg-green-600"
                      )}
                    >
                      {gainzAlgoEnabled ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                      {gainzAlgoEnabled ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Strategy</label>
                        <Select value={gainzAlgoStrategy} onValueChange={setGainzAlgoStrategy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="momentum">Momentum Trading</SelectItem>
                            <SelectItem value="meanreversion">Mean Reversion</SelectItem>
                            <SelectItem value="breakout">Breakout Strategy</SelectItem>
                            <SelectItem value="scalping">Scalping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Risk Level</label>
                        <Select value={gainzAlgoRiskLevel} onValueChange={setGainzAlgoRiskLevel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Capital Allocation (USDT)</label>
                        <Input
                          type="number"
                          value={gainzAlgoCapital}
                          onChange={(e) => setGainzAlgoCapital(e.target.value)}
                          placeholder="1000"
                        />
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Performance</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">24h P&L:</span>
                            <span className="text-green-500">+$127.50 (+2.34%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                            <span>68.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Active Trades:</span>
                            <span>3</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
               </TabsContent>
               
               {/* Copy Trading Tab */}
               <TabsContent value="copytrading" className="flex-1 overflow-hidden mt-4">
                 <div className="h-full overflow-y-auto px-4 space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <Users className="h-5 w-5 text-purple-500" />
                       <h3 className="font-semibold">Copy Trading</h3>
                     </div>
                     <Button
                       onClick={() => setCopyTradingEnabled(!copyTradingEnabled)}
                       variant={copyTradingEnabled ? "default" : "outline"}
                       size="sm"
                       className={cn(
                         copyTradingEnabled && "bg-purple-500 hover:bg-purple-600"
                       )}
                     >
                       {copyTradingEnabled ? 'Disconnect' : 'Connect'}
                     </Button>
                   </div>
                   
                   <Card>
                     <CardContent className="p-4 space-y-4">
                       <div>
                         <label className="block text-sm font-medium mb-2">Select Trader</label>
                         <Select value={selectedTrader} onValueChange={setSelectedTrader}>
                           <SelectTrigger>
                             <SelectValue placeholder="Choose a trader to copy" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="trader1">CryptoKing_2024 (ROI: +245%)</SelectItem>
                             <SelectItem value="trader2">AlgoMaster (ROI: +189%)</SelectItem>
                             <SelectItem value="trader3">TradingPro (ROI: +156%)</SelectItem>
                             <SelectItem value="trader4">QuantWizard (ROI: +134%)</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium mb-2">Copy Ratio: {copyRatio}%</label>
                         <input
                           type="range"
                           min="10"
                           max="100"
                           value={copyRatio}
                           onChange={(e) => setCopyRatio(Number(e.target.value))}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                         />
                         <div className="flex justify-between text-xs text-gray-500 mt-1">
                           <span>10%</span>
                           <span>100%</span>
                         </div>
                       </div>
                       
                       {selectedTrader && (
                         <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                           <div className="flex items-center space-x-2 mb-2">
                             <Users className="h-4 w-4 text-purple-500" />
                             <span className="text-sm font-medium">Trader Stats</span>
                           </div>
                           <div className="space-y-1 text-sm">
                             <div className="flex justify-between">
                               <span className="text-gray-600 dark:text-gray-400">Total ROI:</span>
                               <span className="text-green-500">+245%</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                               <span>72.3%</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600 dark:text-gray-400">Followers:</span>
                               <span>1,247</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600 dark:text-gray-400">Risk Score:</span>
                               <span className="text-yellow-500">Medium</span>
                             </div>
                           </div>
                         </div>
                       )}
                       
                       <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                         <div className="text-sm space-y-1">
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Your Investment:</span>
                             <span className="font-medium">$1,000</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Copy Amount:</span>
                             <span className="font-medium">${(1000 * copyRatio / 100).toFixed(0)}</span>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </TabsContent>
               
               {/* Risk Management Tab */}
               <TabsContent value="riskmanagement" className="flex-1 overflow-hidden mt-4">
                 <div className="h-full overflow-y-auto px-4 space-y-4">
                   <div className="flex items-center space-x-2">
                     <Shield className="h-5 w-5 text-orange-500" />
                     <h3 className="font-semibold">Risk Management</h3>
                   </div>
                   
                   <Card>
                     <CardContent className="p-4 space-y-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <label className="block text-sm font-medium">Stop Loss</label>
                           <p className="text-xs text-gray-500">Automatically close losing positions</p>
                         </div>
                         <Button
                           onClick={() => setStopLossEnabled(!stopLossEnabled)}
                           variant={stopLossEnabled ? "default" : "outline"}
                           size="sm"
                         >
                           {stopLossEnabled ? 'ON' : 'OFF'}
                         </Button>
                       </div>
                       
                       {stopLossEnabled && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Stop Loss Percentage</label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={stopLossPercent}
                                onChange={(e) => setStopLossPercent(e.target.value)}
                                placeholder="5"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                            </div>
                          </div>
                        )}
                       
                       <div className="flex items-center justify-between">
                         <div>
                           <label className="block text-sm font-medium">Take Profit</label>
                           <p className="text-xs text-gray-500">Automatically close winning positions</p>
                         </div>
                         <Button
                           onClick={() => setTakeProfitEnabled(!takeProfitEnabled)}
                           variant={takeProfitEnabled ? "default" : "outline"}
                           size="sm"
                         >
                           {takeProfitEnabled ? 'ON' : 'OFF'}
                         </Button>
                       </div>
                       
                       {takeProfitEnabled && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Take Profit Percentage</label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={takeProfitPercent}
                                onChange={(e) => setTakeProfitPercent(e.target.value)}
                                placeholder="10"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                            </div>
                          </div>
                        )}
                       
                       <div>
                         <label className="block text-sm font-medium mb-2">Max Daily Loss (USDT)</label>
                         <Input
                           type="number"
                           value={maxDailyLoss}
                           onChange={(e) => setMaxDailyLoss(e.target.value)}
                           placeholder="500"
                         />
                       </div>
                       
                       <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                         <div className="flex items-center space-x-2 mb-2">
                           <AlertTriangle className="h-4 w-4 text-orange-500" />
                           <span className="text-sm font-medium">Risk Summary</span>
                         </div>
                         <div className="space-y-1 text-sm">
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Daily Loss:</span>
                             <span className="text-red-500">-$45.20 / $500</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
                             <span className="text-green-500">Low</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Active Protections:</span>
                             <span>{[stopLossEnabled && 'SL', takeProfitEnabled && 'TP'].filter(Boolean).join(', ') || 'None'}</span>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </TabsContent>
             </Tabs>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPanelDashboard;