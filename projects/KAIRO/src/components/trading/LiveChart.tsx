'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { liveMarketService } from '@/services/liveMarketService';

interface LiveChartProps {
  symbol: string;
  timeframe: string;
  data: {
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
  };
  isLive: boolean;
}

interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function LiveChart({ symbol, timeframe, data, isLive }: LiveChartProps) {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [livePrice, setLivePrice] = useState(data.price);
  const [priceChange, setPriceChange] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPriceRef = useRef(data.price);

  const formatCurrency = (value: number, decimals: number = 2) => {
    if (data.type === 'crypto') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    } else if (data.type === 'forex') {
      return value.toFixed(4);
    } else {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    }
  };

  // Subscribe to live price updates
  useEffect(() => {
    if (!isLive) return;

    const unsubscribe = liveMarketService.subscribe(symbol, (ticker) => {
      const newPrice = ticker.price;
      const change = newPrice - lastPriceRef.current;
      
      setLivePrice(newPrice);
      setPriceChange(change);
      lastPriceRef.current = newPrice;
      
      // Update the latest candlestick with new price
      setChartData(prevData => {
        if (prevData.length === 0) return prevData;
        
        const updatedData = [...prevData];
        const lastCandle = updatedData[updatedData.length - 1];
        
        updatedData[updatedData.length - 1] = {
          ...lastCandle,
          close: newPrice,
          high: Math.max(lastCandle.high, newPrice),
          low: Math.min(lastCandle.low, newPrice)
        };
        
        return updatedData;
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [symbol, isLive]);

  // Generate mock candlestick data
  useEffect(() => {
    const generateMockData = () => {
      const now = Date.now();
      const intervals = {
        '1D': 24 * 60 * 60 * 1000, // 1 day
        '1W': 7 * 24 * 60 * 60 * 1000, // 1 week
        '1M': 30 * 24 * 60 * 60 * 1000, // 1 month
        '3M': 90 * 24 * 60 * 60 * 1000, // 3 months
        '1Y': 365 * 24 * 60 * 60 * 1000, // 1 year
      };
      
      const interval = intervals[timeframe as keyof typeof intervals] || intervals['1D'];
      const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
      const stepSize = interval / points;
      
      const mockData: CandlestickData[] = [];
      let currentPrice = data.price;
      
      for (let i = points; i >= 0; i--) {
        const timestamp = now - (i * stepSize);
        const volatility = 0.02; // 2% volatility
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        
        const open = currentPrice;
        const close = currentPrice + change;
        const high = Math.max(open, close) + Math.random() * 0.01 * currentPrice;
        const low = Math.min(open, close) - Math.random() * 0.01 * currentPrice;
        const volume = Math.random() * 1000000;
        
        mockData.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        });
        
        currentPrice = close;
      }
      
      return mockData;
    };

    setIsLoading(true);
    const timer = setTimeout(() => {
      setChartData(generateMockData());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [symbol, timeframe, data.price]);

  // Draw simple candlestick chart
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    const candleWidth = chartWidth / chartData.length * 0.8;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }

    // Draw candlesticks
    chartData.forEach((candle, index) => {
      const x = padding + (chartWidth / chartData.length) * index + candleWidth / 4;
      const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      const isGreen = candle.close > candle.open;
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight || 1);
    });

    // Draw price labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(formatCurrency(price), padding - 10, y + 4);
    }
  }, [chartData, data.type]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            <h3 className="font-semibold text-gray-900 dark:text-white">{symbol}</h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{data.name}</span>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold transition-colors duration-200 ${
            isLive && priceChange !== 0 
              ? priceChange > 0 
                ? 'text-green-600' 
                : 'text-red-600'
              : 'text-gray-900 dark:text-white'
          }`}>
            {formatCurrency(isLive ? livePrice : data.price, data.type === 'forex' ? 4 : 2)}
            {isLive && priceChange !== 0 && (
              <span className={`ml-2 text-sm ${
                priceChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ({priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)})
              </span>
            )}
          </div>
          <div className={`flex items-center text-sm ${
            data.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Chart Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {data.volume.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">24h High:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(data.high24h, data.type === 'forex' ? 4 : 2)}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">24h Low:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(data.low24h, data.type === 'forex' ? 4 : 2)}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Market Cap:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {data.marketCap > 0 ? `$${(data.marketCap / 1e9).toFixed(1)}B` : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}