'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, Clock, RefreshCw, AlertCircle, BarChart3, Calendar, Filter } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  url?: string;
}

interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  actual?: string;
  forecast?: string;
  previous?: string;
}

const MarketUpdates: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mock market data
  const mockMarketData: MarketData[] = [
    {
      symbol: 'BTC/USD',
      price: 43250.50,
      change: 1250.30,
      changePercent: 2.98,
      volume: 28500000000,
      high24h: 44100.00,
      low24h: 41800.00,
      marketCap: 847000000000
    },
    {
      symbol: 'ETH/USD',
      price: 2650.75,
      change: -85.25,
      changePercent: -3.11,
      volume: 15200000000,
      high24h: 2780.00,
      low24h: 2620.00,
      marketCap: 318000000000
    },
    {
      symbol: 'SPY',
      price: 485.20,
      change: 3.45,
      changePercent: 0.72,
      volume: 85000000,
      high24h: 487.50,
      low24h: 481.30
    },
    {
      symbol: 'AAPL',
      price: 192.85,
      change: -2.15,
      changePercent: -1.10,
      volume: 45000000,
      high24h: 195.20,
      low24h: 191.50
    },
    {
      symbol: 'TSLA',
      price: 248.50,
      change: 8.75,
      changePercent: 3.65,
      volume: 125000000,
      high24h: 252.00,
      low24h: 238.20
    },
    {
      symbol: 'EUR/USD',
      price: 1.0875,
      change: 0.0025,
      changePercent: 0.23,
      volume: 1200000000,
      high24h: 1.0895,
      low24h: 1.0845
    }
  ];

  // Mock news data
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Federal Reserve Signals Potential Rate Cut in Q2 2024',
      summary: 'Fed officials hint at possible monetary policy easing amid cooling inflation data and economic uncertainty.',
      source: 'Reuters',
      timestamp: '2024-01-15T14:30:00Z',
      impact: 'HIGH',
      category: 'monetary-policy'
    },
    {
      id: '2',
      title: 'Bitcoin ETF Approval Drives Institutional Adoption',
      summary: 'Major financial institutions increase cryptocurrency allocations following regulatory clarity.',
      source: 'Bloomberg',
      timestamp: '2024-01-15T13:45:00Z',
      impact: 'HIGH',
      category: 'cryptocurrency'
    },
    {
      id: '3',
      title: 'Tech Earnings Season Shows Mixed Results',
      summary: 'Major technology companies report varied quarterly performance amid AI investment surge.',
      source: 'CNBC',
      timestamp: '2024-01-15T12:20:00Z',
      impact: 'MEDIUM',
      category: 'earnings'
    },
    {
      id: '4',
      title: 'Oil Prices Surge on Middle East Tensions',
      summary: 'Crude oil futures jump 3% as geopolitical concerns affect global supply chains.',
      source: 'MarketWatch',
      timestamp: '2024-01-15T11:15:00Z',
      impact: 'MEDIUM',
      category: 'commodities'
    },
    {
      id: '5',
      title: 'European Markets Rally on ECB Policy Outlook',
      summary: 'European indices gain as ECB maintains accommodative stance amid economic recovery.',
      source: 'Financial Times',
      timestamp: '2024-01-15T10:30:00Z',
      impact: 'MEDIUM',
      category: 'markets'
    }
  ];

  // Mock economic events
  const mockEconomicEvents: EconomicEvent[] = [
    {
      id: '1',
      title: 'US Consumer Price Index (CPI)',
      country: 'US',
      impact: 'HIGH',
      time: '15:30',
      forecast: '3.2%',
      previous: '3.4%',
      actual: '3.1%'
    },
    {
      id: '2',
      title: 'Federal Reserve Interest Rate Decision',
      country: 'US',
      impact: 'HIGH',
      time: '19:00',
      forecast: '5.25%',
      previous: '5.25%'
    },
    {
      id: '3',
      title: 'European Central Bank Press Conference',
      country: 'EU',
      impact: 'HIGH',
      time: '13:45',
      forecast: '-',
      previous: '-'
    },
    {
      id: '4',
      title: 'UK GDP Growth Rate',
      country: 'UK',
      impact: 'MEDIUM',
      time: '09:30',
      forecast: '0.2%',
      previous: '0.1%',
      actual: '0.3%'
    }
  ];

  // Simulate real-time data updates
  const updateMarketData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMarketData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * item.price * 0.02,
          change: item.change + (Math.random() - 0.5) * 10,
          changePercent: item.changePercent + (Math.random() - 0.5) * 2
        }))
      );
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Initialize data
  useEffect(() => {
    setMarketData(mockMarketData);
    setNews(mockNews);
    setEconomicEvents(mockEconomicEvents);
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(updateMarketData, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Format number with appropriate suffix
  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(decimals);
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'LOW': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Filter news by category
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Market Updates
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Auto-refresh</span>
          </label>
          
          <button
            onClick={updateMarketData}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.map((item) => (
          <div key={item.symbol} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.symbol}
              </h3>
              {item.change >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${item.price.toFixed(2)}
              </div>
              
              <div className={`text-sm font-medium ${
                item.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change >= 0 ? '+' : ''}${item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div>High: ${item.high24h.toFixed(2)}</div>
                <div>Low: ${item.low24h.toFixed(2)}</div>
                <div>Volume: {formatNumber(item.volume)}</div>
                {item.marketCap && (
                  <div>MCap: {formatNumber(item.marketCap)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Economic Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Economic Events
              </h2>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {economicEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {event.time}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Forecast:</span>
                    <div className="font-medium text-gray-900 dark:text-white">{event.forecast}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Previous:</span>
                    <div className="font-medium text-gray-900 dark:text-white">{event.previous}</div>
                  </div>
                  {event.actual && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                      <div className="font-medium text-green-600">{event.actual}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market News */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Market News
                </h2>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="monetary-policy">Monetary Policy</option>
                <option value="cryptocurrency">Cryptocurrency</option>
                <option value="earnings">Earnings</option>
                <option value="commodities">Commodities</option>
                <option value="markets">Markets</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {filteredNews.map((item) => (
              <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact)}`}>
                    {item.impact}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.source}</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Sentiment Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Market Sentiment
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">72</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Fear & Greed Index</div>
            <div className="text-xs text-green-600">Greed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+1.2%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Market Performance</div>
            <div className="text-xs text-blue-600">Today</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">18.5</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">VIX Index</div>
            <div className="text-xs text-yellow-600">Moderate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">$2.1T</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Volume</div>
            <div className="text-xs text-purple-600">24h</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketUpdates;