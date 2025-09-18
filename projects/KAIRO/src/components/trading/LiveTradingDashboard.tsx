'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  Play,
  Pause,
  Square,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import LiveTradingControls from './LiveTradingControls';

// Types
interface LivePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  weight: number;
}

interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  totalPnL: number;
  dayPnL: number;
  totalReturn: number;
  dayReturn: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: string;
  quantity: number;
  price?: number;
  status: string;
  filledQuantity: number;
  createdAt: string;
}

interface LiveTradingStatus {
  liveTradingEnabled: boolean;
  websocketEnabled: boolean;
  connected: boolean;
}

const LiveTradingDashboard: React.FC = () => {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [liveTradingStatus, setLiveTradingStatus] = useState<LiveTradingStatus>({
    liveTradingEnabled: false,
    websocketEnabled: false,
    connected: false
  });
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [marketData, setMarketData] = useState<LivePrice[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showSensitiveData, setShowSensitiveData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPortfolio({
        id: 'portfolio-1',
        name: 'Main Trading Portfolio',
        totalValue: 125750.50,
        cashBalance: 25750.50,
        investedValue: 100000.00,
        totalPnL: 5750.50,
        dayPnL: 1250.75,
        totalReturn: 5.75,
        dayReturn: 1.01
      });

      setPositions([
        {
          symbol: 'AAPL',
          quantity: 100,
          averagePrice: 175.80,
          currentPrice: 178.25,
          marketValue: 17825.00,
          unrealizedPnL: 245.00,
          unrealizedPnLPercent: 1.39,
          dayPnL: 125.00,
          dayPnLPercent: 0.71,
          weight: 14.17
        },
        {
          symbol: 'TSLA',
          quantity: 50,
          averagePrice: 245.30,
          currentPrice: 248.90,
          marketValue: 12445.00,
          unrealizedPnL: 180.00,
          unrealizedPnLPercent: 1.47,
          dayPnL: -85.50,
          dayPnLPercent: -0.68,
          weight: 9.89
        },
        {
          symbol: 'MSFT',
          quantity: 75,
          averagePrice: 420.50,
          currentPrice: 425.80,
          marketValue: 31935.00,
          unrealizedPnL: 397.50,
          unrealizedPnLPercent: 1.26,
          dayPnL: 225.00,
          dayPnLPercent: 0.71,
          weight: 25.40
        }
      ]);

      setOrders([
        {
          id: 'ORD_001',
          symbol: 'GOOGL',
          side: 'buy',
          type: 'limit',
          quantity: 10,
          price: 2800.00,
          status: 'pending',
          filledQuantity: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ORD_002',
          symbol: 'AAPL',
          side: 'sell',
          type: 'limit',
          quantity: 25,
          price: 180.00,
          status: 'partially_filled',
          filledQuantity: 10,
          createdAt: new Date(Date.now() - 300000).toISOString()
        }
      ]);

      setMarketData([
        { symbol: 'AAPL', price: 178.25, change: 2.45, changePercent: 1.39, volume: 45678900, timestamp: Date.now() },
        { symbol: 'TSLA', price: 248.90, change: -1.70, changePercent: -0.68, volume: 23456789, timestamp: Date.now() },
        { symbol: 'MSFT', price: 425.80, change: 5.30, changePercent: 1.26, volume: 34567890, timestamp: Date.now() }
      ]);

      setIsConnected(true);
      setLiveTradingStatus({
        liveTradingEnabled: true,
        websocketEnabled: true,
        connected: true
      });
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 2,
        change: item.change + (Math.random() - 0.5) * 0.5,
        changePercent: item.changePercent + (Math.random() - 0.5) * 0.2,
        timestamp: Date.now()
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleLiveTrading = useCallback(async () => {
    try {
      const newStatus = !liveTradingStatus.liveTradingEnabled;
      // In real implementation, make API call here
      setLiveTradingStatus(prev => ({ ...prev, liveTradingEnabled: newStatus }));
    } catch (error) {
      logger.error('Failed to toggle live trading', error, 'LiveTradingDashboard');
    }
  }, [liveTradingStatus.liveTradingEnabled]);

  const handleEmergencyStop = useCallback(async () => {
    try {
      // In real implementation, make API call here
      setLiveTradingStatus(prev => ({ ...prev, liveTradingEnabled: false }));
      // Cancel all pending orders
      setOrders(prev => prev.map(order => 
        order.status === 'pending' ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      logger.error('Failed to execute emergency stop', error, 'LiveTradingDashboard');
    }
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading live trading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            )} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <Badge variant={liveTradingStatus.liveTradingEnabled ? 'default' : 'secondary'}>
            {liveTradingStatus.liveTradingEnabled ? 'Live Trading ON' : 'Live Trading OFF'}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
          >
            {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={liveTradingStatus.liveTradingEnabled ? 'destructive' : 'default'}
            size="sm"
            onClick={handleToggleLiveTrading}
          >
            {liveTradingStatus.liveTradingEnabled ? (
              <><Pause className="h-4 w-4 mr-2" />Disable</>
            ) : (
              <><Play className="h-4 w-4 mr-2" />Enable</>
            )}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEmergencyStop}
            disabled={!liveTradingStatus.liveTradingEnabled}
          >
            <Square className="h-4 w-4 mr-2" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showSensitiveData ? formatCurrency(portfolio.totalValue) : '••••••'}
              </div>
              <p className="text-xs text-muted-foreground">
                Cash: {showSensitiveData ? formatCurrency(portfolio.cashBalance) : '••••••'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                portfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {showSensitiveData ? formatCurrency(portfolio.totalPnL) : '••••••'}
              </div>
              <p className={cn(
                "text-xs",
                portfolio.totalReturn >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {showSensitiveData ? formatPercent(portfolio.totalReturn) : '••••••'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Day P&L</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                portfolio.dayPnL >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {showSensitiveData ? formatCurrency(portfolio.dayPnL) : '••••••'}
              </div>
              <p className={cn(
                "text-xs",
                portfolio.dayReturn >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {showSensitiveData ? formatPercent(portfolio.dayReturn) : '••••••'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{positions.length}</div>
              <p className="text-xs text-muted-foreground">
                Invested: {showSensitiveData ? formatCurrency(portfolio.investedValue) : '••••••'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="market">Market Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Top Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.slice(0, 5).map((position) => (
                    <div key={position.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.quantity} shares
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "font-medium",
                          position.unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {showSensitiveData ? formatCurrency(position.unrealizedPnL) : '••••••'}
                        </div>
                        <div className={cn(
                          "text-sm",
                          position.unrealizedPnLPercent >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {showSensitiveData ? formatPercent(position.unrealizedPnLPercent) : '••••••'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                          {order.side.toUpperCase()}
                        </Badge>
                        <div>
                          <div className="font-medium">{order.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.quantity} @ {order.price ? formatCurrency(order.price) : 'Market'}
                          </div>
                        </div>
                      </div>
                      <Badge variant={order.status === 'filled' ? 'default' : 
                                   order.status === 'cancelled' ? 'destructive' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-right p-2">Quantity</th>
                      <th className="text-right p-2">Avg Price</th>
                      <th className="text-right p-2">Current Price</th>
                      <th className="text-right p-2">Market Value</th>
                      <th className="text-right p-2">P&L</th>
                      <th className="text-right p-2">Day P&L</th>
                      <th className="text-right p-2">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.symbol} className="border-b">
                        <td className="p-2 font-medium">{position.symbol}</td>
                        <td className="p-2 text-right">{position.quantity}</td>
                        <td className="p-2 text-right">
                          {showSensitiveData ? formatCurrency(position.averagePrice) : '••••••'}
                        </td>
                        <td className="p-2 text-right">
                          {showSensitiveData ? formatCurrency(position.currentPrice) : '••••••'}
                        </td>
                        <td className="p-2 text-right">
                          {showSensitiveData ? formatCurrency(position.marketValue) : '••••••'}
                        </td>
                        <td className={cn(
                          "p-2 text-right",
                          position.unrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {showSensitiveData ? (
                            <>
                              {formatCurrency(position.unrealizedPnL)}<br />
                              <span className="text-sm">{formatPercent(position.unrealizedPnLPercent)}</span>
                            </>
                          ) : '••••••'}
                        </td>
                        <td className={cn(
                          "p-2 text-right",
                          position.dayPnL >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {showSensitiveData ? (
                            <>
                              {formatCurrency(position.dayPnL)}<br />
                              <span className="text-sm">{formatPercent(position.dayPnLPercent)}</span>
                            </>
                          ) : '••••••'}
                        </td>
                        <td className="p-2 text-right">
                          {showSensitiveData ? `${position.weight.toFixed(1)}%` : '••••••'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Order ID</th>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Side</th>
                      <th className="text-right p-2">Quantity</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Filled</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="p-2 font-mono text-sm">{order.id}</td>
                        <td className="p-2 font-medium">{order.symbol}</td>
                        <td className="p-2">
                          <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                            {order.side.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">{order.quantity}</td>
                        <td className="p-2 text-right">
                          {order.price ? formatCurrency(order.price) : 'Market'}
                        </td>
                        <td className="p-2 text-right">{order.filledQuantity}</td>
                        <td className="p-2">
                          <Badge variant={order.status === 'filled' ? 'default' : 
                                       order.status === 'cancelled' ? 'destructive' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <LiveTradingControls />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketData.map((item) => (
                  <Card key={item.symbol}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{item.symbol}</h3>
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          "bg-green-500"
                        )} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">
                          {formatCurrency(item.price)}
                        </div>
                        <div className={cn(
                          "flex items-center space-x-1",
                          item.change >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {item.change >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{formatCurrency(Math.abs(item.change))}</span>
                          <span>({formatPercent(item.changePercent)})</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Volume: {item.volume.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveTradingDashboard;