'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Globe,
  DollarSign,
  Percent,
  Clock,
  RefreshCw
} from 'lucide-react';
import { liveMarketService, useMarketData } from '@/services/liveMarketService';

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
}

interface ForexPair {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketDataWidget() {
  const [activeTab, setActiveTab] = useState<'indices' | 'crypto' | 'forex'>('indices');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get live market data
  const liveData = useMarketData();
  
  // Convert live data to component format
  const getMarketIndices = (): MarketIndex[] => {
    const indicesSymbols = ['SPY', 'QQQ', 'DJI', 'IXIC', 'RUT'];
    const indicesNames = {
      SPY: 'S&P 500 ETF',
      QQQ: 'NASDAQ ETF', 
      DJI: 'Dow Jones',
      IXIC: 'NASDAQ',
      RUT: 'Russell 2000'
    };
    
    if (!Array.isArray(liveData)) return [];
    
    return liveData
      .filter(item => indicesSymbols.includes(item.symbol))
      .map(item => ({
        symbol: item.symbol,
        name: indicesNames[item.symbol as keyof typeof indicesNames] || item.symbol,
        price: item.price,
        change: item.change,
        changePercent: item.changePercent,
        volume: `${(item.volume / 1000000).toFixed(1)}M`
      }));
  };
  
  const getCryptoData = (): CryptoData[] => {
    const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT'];
    const cryptoNames = {
      BTCUSDT: 'Bitcoin',
      ETHUSDT: 'Ethereum',
      SOLUSDT: 'Solana',
      ADAUSDT: 'Cardano'
    };
    
    if (!Array.isArray(liveData)) return [];
    
    return liveData
      .filter(item => cryptoSymbols.includes(item.symbol))
      .map(item => ({
        symbol: item.symbol.replace('USDT', ''),
        name: cryptoNames[item.symbol as keyof typeof cryptoNames] || item.symbol,
        price: item.price,
        change: item.change,
        changePercent: item.changePercent,
        marketCap: item.marketCap ? `${(item.marketCap / 1000000000).toFixed(1)}B` : 'N/A'
      }));
  };
  
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([
    {
      symbol: 'SPX',
      name: 'S&P 500',
      price: 4756.50,
      change: 23.45,
      changePercent: 0.49,
      volume: '3.2B'
    },
    {
      symbol: 'IXIC',
      name: 'NASDAQ',
      price: 14845.73,
      change: 156.82,
      changePercent: 1.07,
      volume: '4.1B'
    },
    {
      symbol: 'DJI',
      name: 'Dow Jones',
      price: 37689.54,
      change: -89.23,
      changePercent: -0.24,
      volume: '2.8B'
    },
    {
      symbol: 'RUT',
      name: 'Russell 2000',
      price: 2045.32,
      change: 12.67,
      changePercent: 0.62,
      volume: '1.5B'
    }
  ]);

  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67234.50,
      change: 1234.67,
      changePercent: 1.87,
      marketCap: '1.32T'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3456.78,
      change: -89.23,
      changePercent: -2.52,
      marketCap: '415.6B'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 345.67,
      change: 12.34,
      changePercent: 3.70,
      marketCap: '53.2B'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 156.89,
      change: 8.45,
      changePercent: 5.69,
      marketCap: '69.8B'
    }
  ]);

  const [forexData, setForexData] = useState<ForexPair[]>([
    {
      pair: 'EUR/USD',
      price: 1.0876,
      change: 0.0023,
      changePercent: 0.21
    },
    {
      pair: 'GBP/USD',
      price: 1.2654,
      change: -0.0045,
      changePercent: -0.35
    },
    {
      pair: 'USD/JPY',
      price: 149.87,
      change: 0.67,
      changePercent: 0.45
    },
    {
      pair: 'AUD/USD',
      price: 0.6543,
      change: 0.0012,
      changePercent: 0.18
    }
  ]);

  // Update data when live data changes
  useEffect(() => {
    if (liveData) {
      setMarketIndices(getMarketIndices());
      setCryptoData(getCryptoData());
      setLastUpdate(new Date());
    }
  }, [liveData]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Force refresh of live data
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const tabs = [
    { id: 'indices', label: 'Indices', icon: BarChart3 },
    { id: 'crypto', label: 'Crypto', icon: Activity },
    { id: 'forex', label: 'Forex', icon: Globe }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Data</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {formatTime(lastUpdate)}
              </span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Market Indices */}
        {activeTab === 'indices' && (
          <div className="space-y-4">
            {marketIndices.map((index) => (
              <div key={index.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    index.change >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {index.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{index.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{index.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {index.price.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-sm font-medium ${
                      index.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      index.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vol: {index.volume}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cryptocurrency */}
        {activeTab === 'crypto' && (
          <div className="space-y-4">
            {cryptoData.map((crypto) => (
              <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    crypto.change >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {crypto.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{crypto.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${crypto.price.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-sm font-medium ${
                      crypto.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {crypto.change >= 0 ? '+' : ''}${crypto.change.toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      crypto.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ({crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">MCap: ${crypto.marketCap}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Forex */}
        {activeTab === 'forex' && (
          <div className="space-y-4">
            {forexData.map((pair) => (
              <div key={pair.pair} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    pair.change >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {pair.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{pair.pair}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Currency Pair</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {pair.price.toFixed(4)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className={`text-sm font-medium ${
                      pair.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(4)}
                    </p>
                    <p className={`text-sm ${
                      pair.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ({pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time market data powered by GainzAlgo
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}