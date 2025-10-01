'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  LineChart,
  Activity,
  Search,
  Filter,
  Star,
  Clock,
  Volume2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  RefreshCw,
  Eye,
  Settings,
  Zap,
  Code,
  Target,
  ArrowRight,
  Bot,
  Shield,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { tradingService, CreateTradeRequest } from '@/services/tradingService';
import { toast } from 'react-hot-toast';
import BrokerAccountSelector from '@/components/BrokerAccountSelector';
import { useBrokerAccount } from '@/contexts/BrokerAccountContext';
import { liveMarketService, useMarketData } from '@/services/liveMarketService';
import LiveChart from '@/components/trading/LiveChart';
import TradingPanel from '@/components/trading/TradingPanel';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  sector: string;
  type: 'stock' | 'crypto' | 'forex' | 'commodity';
}

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  status: 'pending' | 'filled' | 'cancelled';
}

function TradingContent() {
  const { user } = useAuth();
  const { selectedAccount: selectedBrokerAccount, setSelectedAccount: setSelectedBrokerAccount } = useBrokerAccount();
  const { workflowState, executeWorkflow, receiveFromDashboard, updateWorkflowStatus, handleDeepLink, navigateToDashboard } = useWorkflow();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'market' | 'watchlist' | 'orders' | 'chart'>('market');
  const [selectedAsset, setSelectedAsset] = useState<string>('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isLiveDataEnabled, setIsLiveDataEnabled] = useState(false);
  const [workflowNotification, setWorkflowNotification] = useState<string | null>(null);
  const [isTradingPanelOpen, setIsTradingPanelOpen] = useState(false);
  
  // Get live market data
  const liveMarketData = useMarketData();

  // Initialize market data (will be updated with live data)
  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.80,
      change: 2.45,
      changePercent: 1.41,
      volume: 45678900,
      marketCap: 2800000000000,
      high24h: 177.20,
      low24h: 173.50,
      sector: 'Technology',
      type: 'stock'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 245.30,
      change: -3.20,
      changePercent: -1.29,
      volume: 32456780,
      marketCap: 780000000000,
      high24h: 250.80,
      low24h: 243.10,
      sector: 'Automotive',
      type: 'stock'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 52000.00,
      change: 1200.00,
      changePercent: 2.36,
      volume: 28000000000,
      marketCap: 1020000000000,
      high24h: 53500.00,
      low24h: 50800.00,
      sector: 'Cryptocurrency',
      type: 'crypto'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3200.50,
      change: 85.30,
      changePercent: 2.74,
      volume: 15000000000,
      marketCap: 385000000000,
      high24h: 3250.00,
      low24h: 3100.00,
      sector: 'Cryptocurrency',
      type: 'crypto'
    },
    {
      symbol: 'EURUSD',
      name: 'Euro/US Dollar',
      price: 1.0875,
      change: 0.0025,
      changePercent: 0.23,
      volume: 125000000,
      marketCap: 0,
      high24h: 1.0890,
      low24h: 1.0850,
      sector: 'Forex',
      type: 'forex'
    }
  ]);

  // Mock order book data
  const [orderBook, setOrderBook] = useState({
    bids: [
      { price: 175.75, quantity: 1500, total: 263625 },
      { price: 175.70, quantity: 2300, total: 404110 },
      { price: 175.65, quantity: 1800, total: 316170 },
      { price: 175.60, quantity: 2100, total: 368760 },
      { price: 175.55, quantity: 1200, total: 210660 }
    ],
    asks: [
      { price: 175.85, quantity: 1200, total: 211020 },
      { price: 175.90, quantity: 1800, total: 316620 },
      { price: 175.95, quantity: 2200, total: 387090 },
      { price: 176.00, quantity: 1500, total: 264000 },
      { price: 176.05, quantity: 1900, total: 334495 }
    ]
  });

  // Mock recent trades
  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 100,
      price: 175.80,
      timestamp: '2024-03-15T10:30:00Z',
      status: 'filled'
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'sell',
      quantity: 50,
      price: 245.30,
      timestamp: '2024-03-15T10:25:00Z',
      status: 'filled'
    },
    {
      id: '3',
      symbol: 'BTC',
      type: 'buy',
      quantity: 0.1,
      price: 52000.00,
      timestamp: '2024-03-15T10:20:00Z',
      status: 'pending'
    }
  ]);

  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'TSLA', 'BTC']);

  useEffect(() => {
    if (user) {
      setLoading(false);
      // In a real app, you'd fetch the user's portfolio ID
      setPortfolioId('default-portfolio');
      
      // Enable live market data
      setIsLiveDataEnabled(true);
      
      // Ensure live market service is connected
      if (!liveMarketService.isConnectedToMarket()) {
        liveMarketService.connect();
      }
    }
    
    return () => {
      // Cleanup handled by liveMarketService internally
      if (isLiveDataEnabled) {
        liveMarketService.disconnect();
      }
    };
  }, [user]);

  // Handle workflow automation from dashboard
  useEffect(() => {
    if (!workflowState?.workflows) return;
    
    const workflowId = searchParams.get('workflow');
    const trigger = searchParams.get('trigger');
    
    if (workflowId && trigger === 'dashboard') {
      const workflow = workflowState.workflows.find((w: any) => w.id === workflowId);
      if (workflow) {
        setWorkflowNotification(`Workflow "${workflow.name}" activated from dashboard`);
        
        // Auto-configure trading parameters based on workflow
        if (workflow.id === 'auto-stop-loss') {
          setOrderType('stop');
          setOrderSide('sell');
          setWorkflowNotification('Auto Stop Loss workflow activated - Configure your stop loss parameters');
        } else if (workflow.id === 'profit-taking') {
          setOrderType('limit');
          setOrderSide('sell');
          setWorkflowNotification('Profit Taking workflow activated - Set your target profit price');
        }
        
        // Update workflow status
        updateWorkflowStatus(workflowId, 'active');
        
        // Clear notification after 5 seconds
        setTimeout(() => setWorkflowNotification(null), 5000);
      }
    }
  }, [searchParams, workflowState?.workflows, updateWorkflowStatus]);

  // Get selected asset data with fallback
  const selectedAssetData = marketData.find(asset => asset.symbol === selectedAsset) || 
    // Fallback to ensure we always have data for the selected asset
    {
      symbol: selectedAsset,
      name: selectedAsset,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0,
      high24h: 0,
      low24h: 0,
      sector: 'Unknown',
      type: 'stock' as const
    };

  // Listen for workflow triggers from dashboard
  useEffect(() => {
    if (!workflowState?.workflows) return;
    
    const handleWorkflowTrigger = (event: any) => {
      if (event.source === 'dashboard') {
        const workflow = workflowState.workflows.find((w: any) => w.id === event.workflowId);
        if (workflow) {
          receiveFromDashboard(event.workflowId, event.data);
          setWorkflowNotification(`Executing workflow: ${workflow.name}`);
          
          // Auto-execute workflow if configured
          if ((workflow as any).config?.autoExecute) {
            executeWorkflow(event.workflowId, {
              symbol: selectedAsset,
              price: selectedAssetData.price,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
    };

    // Listen for workflow events
    window.addEventListener('workflow-trigger', handleWorkflowTrigger);
    
    return () => {
      window.removeEventListener('workflow-trigger', handleWorkflowTrigger);
    };
  }, [workflowState?.workflows, receiveFromDashboard, executeWorkflow, selectedAsset, selectedAssetData?.price]);
  
  // Handle deep linking from dashboard
  useEffect(() => {
    handleDeepLink(searchParams);
  }, [searchParams, handleDeepLink]);
  
  // Update market data with live data
  useEffect(() => {
    if (liveMarketData && Array.isArray(liveMarketData)) {
      const getAssetName = (symbol: string) => {
        const assetNames: { [key: string]: string } = {
          'AAPL': 'Apple Inc.',
          'TSLA': 'Tesla Inc.',
          'BTC': 'Bitcoin',
          'ETH': 'Ethereum',
          'EURUSD': 'Euro/US Dollar'
        };
        return assetNames[symbol] || symbol;
      };
      
      const getAssetSector = (symbol: string) => {
        const sectors: { [key: string]: string } = {
          'AAPL': 'Technology',
          'TSLA': 'Automotive',
          'BTC': 'Cryptocurrency',
          'ETH': 'Cryptocurrency',
          'EURUSD': 'Forex'
        };
        return sectors[symbol] || 'Unknown';
      };
      
      const getAssetType = (symbol: string): 'stock' | 'crypto' | 'forex' | 'commodity' => {
        if (['BTC', 'ETH'].includes(symbol)) return 'crypto';
        if (['EURUSD'].includes(symbol)) return 'forex';
        return 'stock';
      };
      
      const updatedMarketData = liveMarketData.map(ticker => ({
        symbol: ticker.symbol,
        name: getAssetName(ticker.symbol),
        price: ticker.price,
        change: ticker.change,
        changePercent: ticker.changePercent,
        volume: ticker.volume,
        marketCap: ticker.marketCap || 0,
        high24h: ticker.high24h,
        low24h: ticker.low24h,
        sector: getAssetSector(ticker.symbol),
        type: getAssetType(ticker.symbol)
      }));
      setMarketData(updatedMarketData);
    }
  }, [liveMarketData]);

  const filteredMarketData = marketData.filter(asset => 
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
  };

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  const handlePlaceOrder = async () => {
    if (!selectedAsset || !orderQuantity || !portfolioId || !selectedBrokerAccount) {
      toast.error('Please fill in all required fields including broker account');
      return;
    }

    const tradeData: CreateTradeRequest = {
      portfolioId,
      symbol: selectedAsset,
      marketType: 'STOCKS', // Default to stocks, can be enhanced to detect market type
      side: orderSide.toUpperCase() as 'BUY' | 'SELL',
      quantity: parseFloat(orderQuantity),
      price: orderType === 'market' ? 0 : parseFloat(orderPrice || '0'),
      orderType: orderType.toUpperCase() as 'MARKET' | 'LIMIT',
      brokerAccountId: selectedBrokerAccount?.id,
      brokerConnectionId: selectedBrokerAccount?.brokerConnection?.id
    };

    // Validate trade data
    const validation = tradingService.validateTradeData(tradeData);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setIsPlacingOrder(true);
    try {
      await tradingService.createTrade(tradeData);
      
      // Reset form on success
      setOrderQuantity('');
      setOrderPrice('');
      setPortfolioId('');
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Trading
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Trade stocks, crypto, forex, and commodities
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Features Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/trading/pine-editor"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Pine Editor</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Script strategies</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
              
              <Link
                href="/trading/profit-targets"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Profit Targets</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Daily goals</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
              
              <Link
                href="/trading/market-updates"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Market Updates</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Live data</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
              
              <Link
                href="/trading/futures"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Futures</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Contracts</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
            </div>
            
            <div className="mt-4">
              <Link
                href="/trading/options"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-colors group border border-purple-200 dark:border-purple-700"
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Options Trading</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Advanced strategies with Greeks calculation</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Market Data / Watchlist */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('market')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'market'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setActiveTab('watchlist')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'watchlist'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Watchlist
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Asset List */}
              <div className="max-h-96 overflow-y-auto">
                {(activeTab === 'market' ? filteredMarketData : marketData.filter(asset => watchlist.includes(asset.symbol))).map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset.symbol)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedAsset === asset.symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{asset.symbol}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (watchlist.includes(asset.symbol)) {
                              handleRemoveFromWatchlist(asset.symbol);
                            } else {
                              handleAddToWatchlist(asset.symbol);
                            }
                          }}
                          className={`p-1 rounded ${
                            watchlist.includes(asset.symbol)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star className={`h-3 w-3 ${watchlist.includes(asset.symbol) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <span className={`text-sm font-medium ${
                        asset.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(asset.price, asset.type === 'forex' ? 4 : 2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart and Trading Interface */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedAssetData?.symbol} - {selectedAssetData?.name}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedAssetData && formatCurrency(selectedAssetData.price, selectedAssetData.type === 'forex' ? 4 : 2)}
                        </span>
                        <span className={`flex items-center text-sm font-medium ${
                          selectedAssetData && selectedAssetData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {selectedAssetData && selectedAssetData.change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                          {selectedAssetData && formatCurrency(Math.abs(selectedAssetData.change), 2)} ({selectedAssetData && selectedAssetData.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedTimeframe(period)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            selectedTimeframe === period
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Live Chart */}
                   <div className="h-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                     {selectedAssetData ? (
                       <LiveChart 
                         symbol={selectedAsset}
                         timeframe={selectedTimeframe}
                         data={selectedAssetData}
                         isLive={isLiveDataEnabled}
                       />
                     ) : (
                       <div className="h-full flex items-center justify-center">
                         <div className="text-center">
                           <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                           <p className="text-gray-500 dark:text-gray-400">
                             {isLiveDataEnabled && liveMarketService.isConnectedToMarket() 
                               ? 'Loading market data for selected asset...' 
                               : 'Connecting to live market data...'}
                           </p>
                           <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                             Real-time price data and technical indicators
                           </p>
                         </div>
                       </div>
                     )}
                   </div>

                  {/* Asset Stats */}
                  {selectedAssetData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">24h High</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(selectedAssetData.high24h, selectedAssetData.type === 'forex' ? 4 : 2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">24h Low</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(selectedAssetData.low24h, selectedAssetData.type === 'forex' ? 4 : 2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatNumber(selectedAssetData.volume)}
                        </p>
                      </div>
                      {selectedAssetData.marketCap > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatNumber(selectedAssetData.marketCap)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Trading Interface */}
              <div className="xl:col-span-1">
                <div className="space-y-6">
                  {/* New Trade Button */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <button
                      onClick={() => {
                        setIsTradingPanelOpen(true);
                        toast.success('Opening advanced trading panel...');
                      }}
                      className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Trade
                    </button>
                  </div>
                  
                  {/* Workflow Automation Panel */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Automation</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {(workflowState?.activeWorkflows?.length || 0) > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {workflowState?.activeWorkflows?.length || 0} Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Workflow Notification */}
                    {workflowNotification && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-blue-500" />
                          <p className="text-sm text-blue-700 dark:text-blue-300">{workflowNotification}</p>
                        </div>
                      </div>
                    )}

                    {/* Active Workflows */}
                    {(workflowState?.activeWorkflows?.length || 0) > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Workflows</h4>
                        <div className="space-y-2">
                          {workflowState?.activeWorkflows?.map((workflow: any) => (
                            <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  {workflow.type === 'auto-stop-loss' && <Shield className="w-4 h-4 text-red-500" />}
                                  {workflow.type === 'profit-taking' && <Target className="w-4 h-4 text-green-500" />}
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {workflow.name}
                                  </span>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  workflow.status === 'active' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : workflow.status === 'paused'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                  {workflow.status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    updateWorkflowStatus(workflow.id, workflow.status === 'active' ? 'paused' : 'active');
                                    toast.success(`Workflow ${workflow.status === 'active' ? 'paused' : 'resumed'}`);
                                  }}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                  {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => {
                                    updateWorkflowStatus(workflow.id, 'stopped');
                                    toast.success('Workflow stopped');
                                  }}
                                  className="p-1 text-red-500 hover:text-red-700"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Workflow Actions */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            executeWorkflow('auto-stop-loss', {
                              symbol: selectedAsset,
                              stopLossPercentage: 5,
                              autoExecute: true
                            });
                            toast.success('Auto Stop Loss activated');
                          }}
                          className="flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">Stop Loss</span>
                        </button>
                        <button
                          onClick={() => {
                            executeWorkflow('profit-taking', {
                              symbol: selectedAsset,
                              profitPercentage: 10,
                              autoExecute: true
                            });
                            toast.success('Profit Taking activated');
                          }}
                          className="flex items-center justify-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <Target className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">Take Profit</span>
                        </button>
                      </div>
                    </div>

                    {/* Workflow Status */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-600 dark:text-gray-400">Automation Status</span>
                        <span className={`font-medium ${
                          (workflowState?.activeWorkflows?.length || 0) > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {(workflowState?.activeWorkflows?.length || 0) > 0 ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Dashboard Navigation */}
                      <button
                        onClick={() => navigateToDashboard(undefined, {
                          source: 'trading',
                          currentAsset: selectedAsset,
                          timestamp: Date.now()
                        })}
                        className="w-full flex items-center justify-center space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <Bot className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Manage Workflows</span>
                        <ArrowRight className="w-4 h-4 text-purple-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Order Form */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Place Order</h3>
                    
                    {/* Order Type */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order Type
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {[
                          { value: 'market', label: 'Market', icon: '⚡' },
                          { value: 'limit', label: 'Limit', icon: '🎯' },
                          { value: 'stop', label: 'Stop', icon: '🛑' }
                        ].map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setOrderType(type.value as any)}
                            className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center ${
                              orderType === type.value
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="mr-1">{type.icon}</span>
                            {type.label}
                          </button>
                        ))}
                      </div>
                      {orderType === 'market' && selectedAssetData && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          Market Price: {formatCurrency(selectedAssetData.price, selectedAssetData.type === 'forex' ? 4 : 2)}
                        </div>
                      )}
                    </div>

                    {/* Buy/Sell Toggle */}
                    <div className="flex space-x-1 mb-4">
                      <button
                        onClick={() => setOrderSide('buy')}
                        className={`flex-1 py-3 px-3 font-medium rounded transition-colors flex items-center justify-center ${
                          orderSide === 'buy'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Buy
                      </button>
                      <button
                        onClick={() => setOrderSide('sell')}
                        className={`flex-1 py-3 px-3 font-medium rounded transition-colors flex items-center justify-center ${
                          orderSide === 'sell'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Sell
                      </button>
                    </div>

                    {/* Broker Account */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Broker Account
                      </label>
                      <BrokerAccountSelector
                        selectedAccount={selectedBrokerAccount}
                        onAccountSelect={setSelectedBrokerAccount}
                        placeholder="Select a broker account for trading"
                      />
                    </div>

                    {/* Portfolio */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Portfolio
                      </label>
                      <select
                        value={portfolioId}
                        onChange={(e) => setPortfolioId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select portfolio</option>
                        <option value="portfolio-1">Main Portfolio</option>
                        <option value="portfolio-2">Growth Portfolio</option>
                        <option value="portfolio-3">Conservative Portfolio</option>
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      />
                      {/* Quick Quantity Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 10, 50, 100].map((qty) => (
                          <button
                            key={qty}
                            onClick={() => setOrderQuantity(qty.toString())}
                            className="py-1 px-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price (for limit orders) */}
                    {orderType !== 'market' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          value={orderPrice}
                          onChange={(e) => setOrderPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Order Total */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Estimated Total:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {orderQuantity && selectedAssetData ? 
                            formatCurrency(parseFloat(orderQuantity) * (orderType === 'market' ? selectedAssetData.price : parseFloat(orderPrice || '0')))
                            : '$0.00'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!orderQuantity || !portfolioId || !selectedBrokerAccount || (orderType !== 'market' && !orderPrice) || isPlacingOrder}
                      className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center ${
                        orderSide === 'buy'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-400 text-white shadow-lg'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:bg-gray-400 text-white shadow-lg'
                      }`}
                    >
                      {isPlacingOrder ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          {orderSide === 'buy' ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
                          {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedAsset}
                        </>
                      )}
                    </button>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        onClick={() => {
                          setOrderQuantity('');
                           setOrderPrice('');
                           toast.success('Order form cleared');
                        }}
                        className="py-2 px-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 mr-1" />
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          if (selectedAssetData) {
                             setOrderPrice(selectedAssetData.price.toString());
                             toast.success('Price set to market price');
                           }
                        }}
                        className="py-2 px-3 text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center"
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Market
                      </button>
                    </div>
                  </div>

                  {/* Order Book */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Book</h3>
                    
                    {/* Asks */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Asks</h4>
                      <div className="space-y-1">
                        {orderBook.asks.slice().reverse().map((ask, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-red-600 dark:text-red-400">{formatCurrency(ask.price, 2)}</span>
                            <span className="text-gray-600 dark:text-gray-400">{ask.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spread */}
                    <div className="py-2 border-y border-gray-200 dark:border-gray-700 mb-4">
                      <div className="text-center text-sm font-medium text-gray-900 dark:text-white">
                        Spread: {formatCurrency(orderBook.asks[0].price - orderBook.bids[0].price, 2)}
                      </div>
                    </div>

                    {/* Bids */}
                    <div>
                      <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Bids</h4>
                      <div className="space-y-1">
                        {orderBook.bids.map((bid, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-green-600 dark:text-green-400">{formatCurrency(bid.price, 2)}</span>
                            <span className="text-gray-600 dark:text-gray-400">{bid.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Trades</h3>
                    <div className="space-y-3">
                      {recentTrades.map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${
                              trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {trade.symbol}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              trade.status === 'filled' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                              trade.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                              'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}>
                              {trade.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(trade.price, 2)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {trade.quantity} shares
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Trading Panel Modal */}
      <TradingPanel 
        isOpen={isTradingPanelOpen}
        onClose={() => setIsTradingPanelOpen(false)}
        defaultSymbol={selectedAsset}
        isModal={true}
      />
    </AppLayout>
  );
}

export default function TradingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <TradingContent />
    </Suspense>
  );
}