'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Menu,
  Sun,
  Moon,
  User,
  ChevronDown,
  BarChart3,
  Activity,
  Globe,
  Clock,
  X,
  Filter,
  Building,
  Coins,
  DollarSign,
  Zap,
  Flame,
  ArrowUp,
  ArrowDown,
  Calendar,
  Target,
  ShoppingCart,
  TrendingUp as LineChart,
  Info,
  Star,
  Shield,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketData } from '@/services/liveMarketService';
import { toast } from 'react-hot-toast';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface MarketData {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  assetType: 'stock' | 'crypto' | 'forex' | 'commodity' | 'option' | 'future';
  marketCap: 'large' | 'mid' | 'small';
  sector: string;
  description?: string;
  searchScore?: number;
  // Live market data
  volume?: string;
  marketCapValue?: string;
  avgVolume?: string;
  // Investment insights
  peRatio?: string;
  eps?: string;
  dividendYield?: string;
  analystRating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  priceTarget?: string;
  // Technical analysis
  rsi?: string;
  macd?: string;
  movingAvg50?: string;
  movingAvg200?: string;
  support?: string;
  resistance?: string;
  // Options data (for options)
  strikePrice?: string;
  expirationDate?: string;
  optionType?: 'call' | 'put';
  delta?: string;
  gamma?: string;
  theta?: string;
  vega?: string;
  impliedVolatility?: string;
  // Futures data (for futures)
  contractSize?: string;
  expirationMonth?: string;
  marginRequirement?: string;
  settlementType?: 'physical' | 'cash';
  // Trading data
  tradeable?: boolean;
  minOrderSize?: string;
  commission?: string;
}

// Enhanced market data hook for better real-time search
function useLiveMarketDataForHeader(): MarketData[] {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { 
      symbol: 'AAPL', price: '185.92', change: '+1.25', changePercent: '+0.68%', isPositive: true, 
      assetType: 'stock', marketCap: 'large', sector: 'Technology', description: 'Apple Inc.',
      volume: '52.3M', marketCapValue: '$2.89T', avgVolume: '48.2M',
      peRatio: '28.5', eps: '6.52', dividendYield: '0.52%', analystRating: 'Buy', priceTarget: '$195.00',
      rsi: '58.2', macd: '+0.85', movingAvg50: '$182.45', movingAvg200: '$175.30', support: '$180.00', resistance: '$190.00',
      tradeable: true, minOrderSize: '1', commission: '$0.00'
    },
    { 
      symbol: 'TSLA', price: '248.50', change: '-3.20', changePercent: '-1.27%', isPositive: false, 
      assetType: 'stock', marketCap: 'large', sector: 'Automotive', description: 'Tesla Inc.',
      volume: '89.7M', marketCapValue: '$789.2B', avgVolume: '75.4M',
      peRatio: '65.8', eps: '3.78', dividendYield: '0.00%', analystRating: 'Hold', priceTarget: '$260.00',
      rsi: '42.1', macd: '-1.25', movingAvg50: '$255.80', movingAvg200: '$245.60', support: '$240.00', resistance: '$265.00',
      tradeable: true, minOrderSize: '1', commission: '$0.00'
    },
    { 
      symbol: 'NVDA', price: '875.30', change: '+12.45', changePercent: '+1.44%', isPositive: true, 
      assetType: 'stock', marketCap: 'large', sector: 'Technology', description: 'NVIDIA Corporation',
      volume: '45.2M', marketCapValue: '$2.15T', avgVolume: '42.8M',
      peRatio: '72.4', eps: '12.08', dividendYield: '0.03%', analystRating: 'Strong Buy', priceTarget: '$950.00',
      rsi: '68.5', macd: '+2.15', movingAvg50: '$845.20', movingAvg200: '$785.40', support: '$850.00', resistance: '$900.00',
      tradeable: true, minOrderSize: '1', commission: '$0.00'
    },
    { 
      symbol: 'AAPL240315C00190000', price: '8.50', change: '+0.75', changePercent: '+9.68%', isPositive: true, 
      assetType: 'option', marketCap: 'large', sector: 'Technology', description: 'Apple $190 Call Mar 15',
      strikePrice: '$190.00', expirationDate: '2024-03-15', optionType: 'call',
      delta: '0.65', gamma: '0.025', theta: '-0.08', vega: '0.15', impliedVolatility: '28.5%',
      tradeable: true, minOrderSize: '1', commission: '$0.65'
    },
    { 
      symbol: 'ES', price: '4,285.50', change: '+15.25', changePercent: '+0.36%', isPositive: true, 
      assetType: 'future', marketCap: 'large', sector: 'Index', description: 'E-mini S&P 500 Future',
      contractSize: '$50 x Index', expirationMonth: 'Mar 2024', marginRequirement: '$13,200',
      settlementType: 'cash', tradeable: true, minOrderSize: '1', commission: '$2.25'
    },
    { 
      symbol: 'BTC-USD', price: '43,250', change: '+850', changePercent: '+2.01%', isPositive: true, 
      assetType: 'crypto', marketCap: 'large', sector: 'Cryptocurrency', description: 'Bitcoin',
      volume: '28.5B', marketCapValue: '$847.2B', avgVolume: '25.8B',
      rsi: '72.3', macd: '+1,250', support: '$41,000', resistance: '$45,000',
      tradeable: true, minOrderSize: '0.001', commission: '0.25%'
    },
    { 
      symbol: 'ETH-USD', price: '2,580', change: '+45', changePercent: '+1.77%', isPositive: true, 
      assetType: 'crypto', marketCap: 'large', sector: 'Cryptocurrency', description: 'Ethereum',
      volume: '12.8B', marketCapValue: '$310.2B', avgVolume: '11.5B',
      rsi: '65.8', macd: '+85', support: '$2,450', resistance: '$2,700',
      tradeable: true, minOrderSize: '0.01', commission: '0.25%'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => {
        // More realistic price movements based on asset type
        let volatility = 0.5; // Default volatility percentage
        if (item.assetType === 'crypto') volatility = 2.0;
        if (item.assetType === 'forex') volatility = 0.1;
        if (item.assetType === 'commodity') volatility = 1.0;
        if (item.assetType === 'option') volatility = 5.0;
        if (item.assetType === 'future') volatility = 1.5;
        
        const currentPrice = parseFloat(item.price.replace(/[^0-9.-]/g, ''));
        const changePercent = (Math.random() - 0.5) * volatility;
        const newPrice = Math.max(0.01, currentPrice * (1 + changePercent / 100));
        const priceChange = newPrice - currentPrice;
        const isPositive = priceChange >= 0;
        
        // Update volume with realistic fluctuations
        const currentVolume = item.volume ? parseFloat(item.volume.replace(/[^0-9.]/g, '')) : 1;
        const volumeChange = (Math.random() - 0.5) * 0.3;
        const newVolume = Math.max(0.1, currentVolume * (1 + volumeChange));
        
        // Update RSI with realistic bounds
        const currentRSI = item.rsi ? parseFloat(item.rsi) : 50;
        const rsiChange = (Math.random() - 0.5) * 3;
        const newRSI = Math.max(0, Math.min(100, currentRSI + rsiChange));
        
        return {
          ...item,
          price: item.assetType === 'crypto' ? newPrice.toFixed(0) : `$${newPrice.toFixed(2)}`,
          change: `${isPositive ? '+' : ''}${priceChange.toFixed(2)}`,
          changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
          isPositive,
          volume: `${newVolume.toFixed(1)}${item.assetType === 'crypto' ? 'B' : 'M'}`,
          rsi: newRSI.toFixed(1),
          macd: `${(Math.random() - 0.5 > 0 ? '+' : '')}${(Math.random() - 0.5).toFixed(3)}`,
          lastUpdated: new Date().toISOString()
        };
      }));
    }, 2000); // Update every 2 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  return marketData;
}

export default function LandingHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<MarketData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketData | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [riskAmount, setRiskAmount] = useState<number>(1000);
  const [activeFilters, setActiveFilters] = useState({
    assetType: 'all' as 'all' | 'stock' | 'crypto' | 'forex' | 'commodity',
    marketCap: 'all' as 'all' | 'large' | 'mid' | 'small',
    sector: 'all'
  });
  const [searchAnalytics, setSearchAnalytics] = useState({
    totalSearches: 0,
    popularSearches: [] as { term: string; count: number }[],
    recentSearches: [] as { term: string; timestamp: number }[]
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const marketData = useLiveMarketDataForHeader();

  // Enhanced search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to search history
      addToSearchHistory(searchQuery.trim());
      // Filter market data based on search query
      const results = marketData.filter(item => 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
      
      if (results.length === 0) {
        toast.error(`No results found for "${searchQuery}"`);
      } else {
        toast.success(`Found ${results.length} result(s) for "${searchQuery}"`);
      }
    }
  };

  const addToSearchHistory = (query: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      const newHistory = [query, ...filtered].slice(0, 5); // Keep only 5 recent searches
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const trackSearchAnalytics = (query: string, resultCount: number = 0) => {
    const newAnalytics = {
      totalSearches: searchAnalytics.totalSearches + 1,
      popularSearches: updatePopularSearches(query),
      recentSearches: [{ term: query, timestamp: Date.now() }, ...searchAnalytics.recentSearches.slice(0, 19)]
    };
    setSearchAnalytics(newAnalytics);
    localStorage.setItem('searchAnalytics', JSON.stringify(newAnalytics));
    
    // Track search performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        result_count: resultCount
      });
    }
  };

  const updatePopularSearches = (query: string) => {
    const existing = searchAnalytics.popularSearches.find(item => item.term === query);
    if (existing) {
      return searchAnalytics.popularSearches.map(item => 
        item.term === query ? { ...item, count: item.count + 1 } : item
      ).sort((a, b) => b.count - a.count).slice(0, 10);
    } else {
      return [{ term: query, count: 1 }, ...searchAnalytics.popularSearches]
        .sort((a, b) => b.count - a.count).slice(0, 10);
    }
  };

  const getPopularSearchSuggestions = () => {
    return searchAnalytics.popularSearches.slice(0, 5).map(item => item.term);
  };

  const applyFilters = (data: MarketData[]) => {
    return data.filter(item => {
      const assetTypeMatch = activeFilters.assetType === 'all' || item.assetType === activeFilters.assetType;
      const marketCapMatch = activeFilters.marketCap === 'all' || item.marketCap === activeFilters.marketCap;
      const sectorMatch = activeFilters.sector === 'all' || item.sector === activeFilters.sector;
      
      return assetTypeMatch && marketCapMatch && sectorMatch;
    }).map(item => ({ ...item, searchScore: item.searchScore || 50 }));
  };

  // Fuzzy search function with scoring
  const fuzzySearch = (query: string, items: MarketData[]) => {
    const searchTerm = query.toLowerCase();
    
    return items.map(item => {
      let score = 0;
      const symbol = item.symbol.toLowerCase();
      const description = (item.description || '').toLowerCase();
      const sector = item.sector.toLowerCase();
      
      // Exact symbol match gets highest score
      if (symbol === searchTerm) score += 100;
      // Symbol starts with query gets high score
      else if (symbol.startsWith(searchTerm)) score += 80;
      // Symbol contains query gets medium score
      else if (symbol.includes(searchTerm)) score += 60;
      
      // Description matches
      if (description.includes(searchTerm)) score += 40;
      if (description.startsWith(searchTerm)) score += 50;
      
      // Sector matches
      if (sector.includes(searchTerm)) score += 30;
      
      // Fuzzy matching for typos (simple implementation)
      if (score === 0) {
        const symbolDistance = getLevenshteinDistance(searchTerm, symbol);
        const descDistance = getLevenshteinDistance(searchTerm, description);
        
        if (symbolDistance <= 2 && symbolDistance < symbol.length / 2) score += 20;
        if (descDistance <= 3 && descDistance < description.length / 3) score += 15;
      }
      
      return { ...item, searchScore: score };
    })
    .filter(item => item.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 8); // Limit to top 8 results
  };
  
  // Simple Levenshtein distance for fuzzy matching
  const getLevenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // Enhanced fuzzy search with scoring
      let results = fuzzySearch(value.trim(), marketData);
      
      // Apply active filters
      results = applyFilters(results);
      
      setSearchResults(results);
      setShowSearchResults(true);
      setShowSearchHistory(false);
      
      // Track search analytics with debouncing
      setTimeout(() => {
        trackSearchAnalytics(value.trim(), results.length);
      }, 1000);
    } else {
      setShowSearchResults(false);
      setShowSearchHistory(searchHistory.length > 0);
    }
  };

  const updateFilter = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
    
    // Re-apply search with new filters if there's a query
    if (searchQuery.trim()) {
      let results = marketData.filter(item => 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      const newFilters = { ...activeFilters, [filterType]: value };
      results = results.filter(item => {
        const assetTypeMatch = newFilters.assetType === 'all' || item.assetType === newFilters.assetType;
        const marketCapMatch = newFilters.marketCap === 'all' || item.marketCap === newFilters.marketCap;
        const sectorMatch = newFilters.sector === 'all' || item.sector === newFilters.sector;
        return assetTypeMatch && marketCapMatch && sectorMatch;
      });
      
      setSearchResults(results);
    }
  };

  const handleSearchFocus = () => {
    if (!searchQuery.trim() && searchHistory.length > 0) {
      setShowSearchHistory(true);
    }
  };

  const selectFromHistory = (query: string) => {
    setSearchQuery(query);
    setShowSearchHistory(false);
    addToSearchHistory(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    setShowSearchHistory(false);
    localStorage.removeItem('searchHistory');
    toast.success('Search history cleared');
  };

  const handleQuickSearch = (type: 'trending' | 'gainers' | 'losers') => {
    let filteredData: MarketData[] = [];
    let searchTerm = '';
    
    switch (type) {
      case 'trending':
        // Show most popular/high volume stocks
        filteredData = marketData.filter(item => 
          ['AAPL', 'TSLA', 'NVDA', 'BTC-USD', 'ETH-USD'].includes(item.symbol)
        ).map(item => ({ ...item, searchScore: 100 }));
        searchTerm = 'trending';
        break;
      case 'gainers':
        // Show stocks with positive performance
        filteredData = marketData.filter(item => item.isPositive).slice(0, 6)
          .map(item => ({ ...item, searchScore: 90 }));
        searchTerm = 'gainers';
        break;
      case 'losers':
        // Show stocks with negative performance
        filteredData = marketData.filter(item => !item.isPositive).slice(0, 6)
          .map(item => ({ ...item, searchScore: 90 }));
        searchTerm = 'losers';
        break;
    }
    
    setSearchQuery(searchTerm);
    setSearchResults(filteredData);
    setShowSearchResults(true);
    setShowSearchHistory(false);
    setShowFilters(false);
    addToSearchHistory(searchTerm);
    trackSearchAnalytics(searchTerm, filteredData.length);
    toast.success(`Showing ${type}`);
    
    // Track quick action usage
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quick_search_action', {
        action_type: type,
        result_count: filteredData.length
      });
    }
  };

  const selectSearchResult = (symbol: string) => {
    setSearchQuery(symbol);
    setShowSearchResults(false);
    setShowSearchHistory(false);
    addToSearchHistory(symbol);
    trackSearchAnalytics(symbol, 1);
    toast.success(`Selected ${symbol}`);
    
    // Track result click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search_result_click', {
        search_term: searchQuery,
        selected_symbol: symbol
      });
    }
  };

  // Risk management calculations
  const calculatePositionSize = (asset: MarketData, riskAmount: number, stopLossPercent: number = 2) => {
    const currentPrice = parseFloat(asset.price.replace(/[$,]/g, ''));
    const stopLoss = currentPrice * (1 - stopLossPercent / 100);
    const riskPerShare = currentPrice - stopLoss;
    const maxShares = Math.floor(riskAmount / riskPerShare);
    return {
      maxShares,
      riskPerShare: riskPerShare.toFixed(2),
      totalValue: (maxShares * currentPrice).toFixed(2),
      stopLossPrice: stopLoss.toFixed(2)
    };
  };

  const handleTradeClick = (asset: MarketData, type: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeType(type);
    setShowRiskModal(true);
    const currentPrice = parseFloat(asset.price.replace(/[$,]/g, ''));
    setLimitPrice(currentPrice.toFixed(2));
    setStopPrice((currentPrice * 0.98).toFixed(2));
  };

  const executeTrade = () => {
    if (!selectedAsset) return;
    
    const positionSize = calculatePositionSize(selectedAsset, riskAmount);
    const currentPrice = parseFloat(selectedAsset.price.replace(/[$,]/g, ''));
    const totalValue = orderQuantity * currentPrice;
    
    toast.success(
      `${tradeType.toUpperCase()} order placed: ${orderQuantity} shares of ${selectedAsset.symbol} at ${orderType === 'market' ? 'market price' : `$${limitPrice}`}. Total: $${totalValue.toFixed(2)}`
    );
    
    setShowRiskModal(false);
    setSelectedAsset(null);
  };

  // Load search history and analytics from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
    
    const savedAnalytics = localStorage.getItem('searchAnalytics');
    if (savedAnalytics) {
      try {
        setSearchAnalytics(JSON.parse(savedAnalytics));
      } catch (error) {
        console.error('Error loading search analytics:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
      setShowSearchHistory(false);
      setShowFilters(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard shortcuts for search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      
      // Forward slash (/) to focus search (when not typing in an input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      
      // Escape to blur search and close results
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setShowSearchResults(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section - Logo and Market Ticker */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">KAIRO</span>
          </div>
          
          {/* Enhanced Market Ticker */}
          <div className="hidden lg:flex items-center space-x-4 ml-6">
            {marketData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center space-x-1 text-sm">
                <span className="font-medium">{item.symbol}</span>
                <span className="text-muted-foreground">{item.price}</span>
                <span className={`flex items-center ${
                  item.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  <span>{item.changePercent}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="flex-1 max-w-md mx-4 relative">
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search markets, symbols..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </form>
            
            {/* Filter Toggle Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 ${showFilters ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          


           {/* Advanced Filters */}
           {showFilters && (
             <div className="absolute top-full mt-12 w-full bg-card border border-border rounded-md shadow-lg z-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 {/* Asset Type Filter */}
                 <div>
                   <label className="text-xs font-medium text-muted-foreground mb-2 block">Asset Type</label>
                   <select
                     value={activeFilters.assetType}
                     onChange={(e) => updateFilter('assetType', e.target.value)}
                     className="w-full px-2 py-1 text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                   >
                     <option value="all">All Assets</option>
                     <option value="stock">Stocks</option>
                     <option value="crypto">Crypto</option>
                     <option value="forex">Forex</option>
                     <option value="commodity">Commodities</option>
                   </select>
                 </div>
                 
                 {/* Market Cap Filter */}
                 <div>
                   <label className="text-xs font-medium text-muted-foreground mb-2 block">Market Cap</label>
                   <select
                     value={activeFilters.marketCap}
                     onChange={(e) => updateFilter('marketCap', e.target.value)}
                     className="w-full px-2 py-1 text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                   >
                     <option value="all">All Sizes</option>
                     <option value="large">Large Cap</option>
                     <option value="mid">Mid Cap</option>
                     <option value="small">Small Cap</option>
                   </select>
                 </div>
                 
                 {/* Sector Filter */}
                 <div>
                   <label className="text-xs font-medium text-muted-foreground mb-2 block">Sector</label>
                   <select
                     value={activeFilters.sector}
                     onChange={(e) => updateFilter('sector', e.target.value)}
                     className="w-full px-2 py-1 text-sm bg-input border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                   >
                     <option value="all">All Sectors</option>
                     <option value="Technology">Technology</option>
                     <option value="Automotive">Automotive</option>
                     <option value="E-commerce">E-commerce</option>
                     <option value="Cryptocurrency">Cryptocurrency</option>
                     <option value="ETF">ETF</option>
                     <option value="Currency">Currency</option>
                     <option value="Precious Metals">Precious Metals</option>
                   </select>
                 </div>
               </div>
               
               {/* Clear Filters Button */}
               <div className="mt-3 flex justify-end">
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   onClick={() => {
                     setActiveFilters({ assetType: 'all', marketCap: 'all', sector: 'all' });
                     if (searchQuery.trim()) {
                       const results = applyFilters(marketData.filter(item => 
                         item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                       ));
                       setSearchResults(results);
                     }
                   }}
                   className="text-xs"
                 >
                   Clear Filters
                 </Button>
               </div>
             </div>
           )}
          
          {/* Enhanced Investment Research & Trading Results */}
           {showSearchResults && searchResults.length > 0 && (
             <div className="absolute top-full mt-12 w-full bg-card border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
               {/* Live Data Indicator */}
               <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border">
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-xs text-muted-foreground">Live Market Data</span>
                 </div>
                 <span className="text-xs text-muted-foreground">
                   {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                 </span>
               </div>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="border-b border-border last:border-b-0 p-4 hover:bg-accent/50 transition-colors"
                >
                  {/* Header with Symbol, Price, and Trading Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {result.assetType === 'stock' && <Building className="w-5 h-5 text-blue-500" />}
                      {result.assetType === 'crypto' && <Coins className="w-5 h-5 text-orange-500" />}
                      {result.assetType === 'forex' && <DollarSign className="w-5 h-5 text-green-500" />}
                      {result.assetType === 'commodity' && <Zap className="w-5 h-5 text-yellow-500" />}
                      {result.assetType === 'option' && <Calendar className="w-5 h-5 text-purple-500" />}
                      {result.assetType === 'future' && <Target className="w-5 h-5 text-indigo-500" />}
                      <div>
                        <div className="font-semibold text-base">{result.symbol}</div>
                        <div className="text-sm text-muted-foreground">{result.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{result.price}</div>
                      <div className={`text-sm font-medium flex items-center ${
                        result.isPositive ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {result.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {result.change} ({result.changePercent})
                      </div>
                    </div>
                  </div>

                  {/* Live Market Data */}
                  {(result.volume || result.marketCapValue) && (
                    <div className="grid grid-cols-3 gap-4 mb-3 p-2 bg-muted/30 rounded">
                      {result.volume && (
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Volume</div>
                          <div className="text-sm font-medium">{result.volume}</div>
                        </div>
                      )}
                      {result.marketCapValue && (
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Market Cap</div>
                          <div className="text-sm font-medium">{result.marketCapValue}</div>
                        </div>
                      )}
                      {result.avgVolume && (
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Avg Volume</div>
                          <div className="text-sm font-medium">{result.avgVolume}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Investment Insights for Stocks */}
                  {result.assetType === 'stock' && (result.peRatio || result.eps) && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Investment Insights</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        {result.peRatio && (
                          <div>
                            <div className="text-muted-foreground">P/E Ratio</div>
                            <div className="font-medium">{result.peRatio}</div>
                          </div>
                        )}
                        {result.eps && (
                          <div>
                            <div className="text-muted-foreground">EPS</div>
                            <div className="font-medium">{result.eps}</div>
                          </div>
                        )}
                        {result.dividendYield && (
                          <div>
                            <div className="text-muted-foreground">Dividend</div>
                            <div className="font-medium">{result.dividendYield}</div>
                          </div>
                        )}
                        {result.analystRating && (
                          <div>
                            <div className="text-muted-foreground">Rating</div>
                            <div className={`font-medium ${
                              result.analystRating === 'Strong Buy' ? 'text-green-600' :
                              result.analystRating === 'Buy' ? 'text-green-500' :
                              result.analystRating === 'Hold' ? 'text-yellow-500' :
                              result.analystRating === 'Sell' ? 'text-red-500' : 'text-red-600'
                            }`}>{result.analystRating}</div>
                          </div>
                        )}
                      </div>
                      {result.priceTarget && (
                        <div className="mt-2 text-xs">
                          <span className="text-muted-foreground">Price Target: </span>
                          <span className="font-medium text-blue-600">{result.priceTarget}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Technical Analysis */}
                  {(result.rsi || result.macd) && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <LineChart className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Technical Analysis</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        {result.rsi && (
                          <div>
                            <div className="text-muted-foreground">RSI</div>
                            <div className={`font-medium ${
                              parseFloat(result.rsi) > 70 ? 'text-red-500' :
                              parseFloat(result.rsi) < 30 ? 'text-green-500' : 'text-yellow-500'
                            }`}>{result.rsi}</div>
                          </div>
                        )}
                        {result.macd && (
                          <div>
                            <div className="text-muted-foreground">MACD</div>
                            <div className={`font-medium ${
                              result.macd.startsWith('+') ? 'text-green-500' : 'text-red-500'
                            }`}>{result.macd}</div>
                          </div>
                        )}
                        {result.support && (
                          <div>
                            <div className="text-muted-foreground">Support</div>
                            <div className="font-medium">{result.support}</div>
                          </div>
                        )}
                      </div>
                      {result.resistance && (
                        <div className="mt-2 text-xs">
                          <span className="text-muted-foreground">Resistance: </span>
                          <span className="font-medium">{result.resistance}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Options Data */}
                  {result.assetType === 'option' && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Options Data</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        {result.strikePrice && (
                          <div>
                            <div className="text-muted-foreground">Strike</div>
                            <div className="font-medium">{result.strikePrice}</div>
                          </div>
                        )}
                        {result.expirationDate && (
                          <div>
                            <div className="text-muted-foreground">Expiry</div>
                            <div className="font-medium">{result.expirationDate}</div>
                          </div>
                        )}
                        {result.delta && (
                          <div>
                            <div className="text-muted-foreground">Delta</div>
                            <div className="font-medium">{result.delta}</div>
                          </div>
                        )}
                        {result.impliedVolatility && (
                          <div>
                            <div className="text-muted-foreground">IV</div>
                            <div className="font-medium">{result.impliedVolatility}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Futures Data */}
                  {result.assetType === 'future' && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-1 mb-2">
                        <Target className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium">Futures Data</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        {result.contractSize && (
                          <div>
                            <div className="text-muted-foreground">Contract Size</div>
                            <div className="font-medium">{result.contractSize}</div>
                          </div>
                        )}
                        {result.expirationMonth && (
                          <div>
                            <div className="text-muted-foreground">Expiry</div>
                            <div className="font-medium">{result.expirationMonth}</div>
                          </div>
                        )}
                        {result.marginRequirement && (
                          <div>
                            <div className="text-muted-foreground">Margin</div>
                            <div className="font-medium">{result.marginRequirement}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trading Interface */}
                  {result.tradeable && (
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Min: {result.minOrderSize}</span>
                        <span>Fee: {result.commission}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                           size="sm"
                           variant="outline"
                           className="text-xs px-3 py-1 h-7 border-green-200 text-green-600 hover:bg-green-50"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleTradeClick(result, 'buy');
                           }}
                         >
                           <ShoppingCart className="w-3 h-3 mr-1" />
                           Buy
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           className="text-xs px-3 py-1 h-7 border-red-200 text-red-600 hover:bg-red-50"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleTradeClick(result, 'sell');
                           }}
                         >
                           <ShoppingCart className="w-3 h-3 mr-1" />
                           Sell
                         </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs px-2 py-1 h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectSearchResult(result.symbol);
                          }}
                        >
                          <Info className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Search History and Analytics Dropdown */}
           {showSearchHistory && (
             <div className="absolute top-full mt-12 w-full bg-card border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {/* Popular Searches Section */}
              {searchAnalytics.popularSearches.length > 0 && (
                <div className="border-b border-border">
                  <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>Popular searches</span>
                    </span>
                  </div>
                  {searchAnalytics.popularSearches.slice(0, 3).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => selectFromHistory(item.term)}
                      className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm">{item.term}</span>
                      <span className="text-xs text-muted-foreground">{item.count} searches</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Recent Searches Section */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Recent searches</span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearchHistory}
                      className="text-xs p-1 h-auto"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => selectFromHistory(term)}
                      className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center space-x-2"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Search Analytics Summary */}
              {searchAnalytics.totalSearches > 0 && (
                <div className="px-4 py-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Total searches: {searchAnalytics.totalSearches}
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {searchHistory.length === 0 && searchAnalytics.popularSearches.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Start searching to see your history and popular searches
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section - User Controls (No Alert Features) */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 p-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Navigation Menu */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Menu</span>
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                      router.push('/pricing');
                      setIsMenuOpen(false);
                    }}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Plans
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                      router.push('/demo');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Try Demo
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                      router.push('/register');
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-3"
              onClick={() => router.push('/login')}
            >
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Demo</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Risk Management Modal */}
      {showRiskModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                Trade {selectedAsset.symbol}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRiskModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Asset Info */}
              <div className="p-3 bg-muted/30 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedAsset.symbol}</span>
                  <span className="text-lg font-bold">{selectedAsset.price}</span>
                </div>
                <div className="text-sm text-muted-foreground">{selectedAsset.description}</div>
              </div>

              {/* Trade Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Trade Type</label>
                <div className="flex space-x-2">
                  <Button
                    variant={tradeType === 'buy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTradeType('buy')}
                    className="flex-1"
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTradeType('sell')}
                    className="flex-1"
                  >
                    Sell
                  </Button>
                </div>
              </div>

              {/* Order Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
                  className="w-full px-3 py-2 bg-input border border-border rounded text-sm"
                >
                  <option value="market">Market Order</option>
                  <option value="limit">Limit Order</option>
                  <option value="stop">Stop Order</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 bg-input border border-border rounded text-sm"
                />
              </div>

              {/* Limit Price (if limit order) */}
              {orderType === 'limit' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Limit Price</label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    step="0.01"
                    className="w-full px-3 py-2 bg-input border border-border rounded text-sm"
                  />
                </div>
              )}

              {/* Stop Price (if stop order) */}
              {orderType === 'stop' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Stop Price</label>
                  <input
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    step="0.01"
                    className="w-full px-3 py-2 bg-input border border-border rounded text-sm"
                  />
                </div>
              )}

              {/* Risk Management */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-yellow-600" />
                  <span className="text-sm font-medium">Risk Management</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Position Value:</span>
                    <span className="font-medium">
                      ${(orderQuantity * parseFloat(selectedAsset.price.replace(/[$,]/g, ''))).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission:</span>
                    <span className="font-medium">{selectedAsset.commission}</span>
                  </div>
                  {(() => {
                    const positionSize = calculatePositionSize(selectedAsset, riskAmount);
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Suggested Max Shares:</span>
                          <span className="font-medium text-blue-600">{positionSize.maxShares}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stop Loss (2%):</span>
                          <span className="font-medium text-red-600">${positionSize.stopLossPrice}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRiskModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeTrade}
                  className={`flex-1 ${
                    tradeType === 'buy' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {tradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}