'use client';

import React, { useEffect, useRef, memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Maximize2, Settings, TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { useMarketData, useMarketConnection } from '@/services/marketDataService';
import { cn } from '@/lib/utils';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: number;
  width?: string;
  autosize?: boolean;
  timezone?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
  studies?: string[];
  show_popup_button?: boolean;
  popup_width?: string;
  popup_height?: string;
  enableLiveData?: boolean;
  onReady?: () => void;
}

interface TradingViewWidget {
  new (config: any): any;
}

declare global {
  interface Window {
    TradingView: {
      widget: TradingViewWidget;
    };
  }
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'BINANCE:BTCUSDT',
  interval = '15',
  theme = 'dark',
  height = 500,
  width = '100%',
  autosize = true,
  timezone = 'Etc/UTC',
  locale = 'en',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  container_id,
  studies = ['RSI', 'MACD'],
  show_popup_button = false,
  popup_width = '1000',
  popup_height = '650',
  enableLiveData = true,
  onReady
}) => {
  const [isLiveDataEnabled, setIsLiveDataEnabled] = useState(enableLiveData);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Get live market data
  const marketData = useMarketData(symbol.replace('BINANCE:', '').replace('NASDAQ:', ''));
  const { isConnected, connect, disconnect } = useMarketConnection();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerId = container_id || `tradingview_${Math.random().toString(36).substr(2, 9)}`;

  // Create datafeed for live data
  const createDatafeed = () => {
    return {
      onReady: (callback: any) => {
        setTimeout(() => callback({
          supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
          supports_marks: false,
          supports_timescale_marks: false,
        }), 0);
      },
      searchSymbols: (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: any) => {
        onResultReadyCallback([]);
      },
      resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
        const symbolInfo = {
          name: symbolName,
          ticker: symbolName,
          description: symbolName,
          type: 'crypto',
          session: '24x7',
          timezone: 'Etc/UTC',
          exchange: 'BINANCE',
          minmov: 1,
          pricescale: 100,
          has_intraday: true,
          supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
          volume_precision: 2,
          data_status: 'streaming',
        };
        setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
      },
      getBars: (symbolInfo: any, resolution: string, periodParams: any, onHistoryCallback: any, onErrorCallback: any) => {
        // Generate mock historical data
        const bars = [];
        const now = Date.now();
        const interval = resolution === '1D' ? 24 * 60 * 60 * 1000 : parseInt(resolution) * 60 * 1000;
        
        for (let i = 100; i >= 0; i--) {
           const time = now - (i * interval);
           const basePrice = marketData?.data?.price || 43000;
           const randomChange = (Math.random() - 0.5) * 0.02;
           const price = basePrice * (1 + randomChange);
          
          bars.push({
            time: time,
            low: price * 0.995,
            high: price * 1.005,
            open: price,
            close: price,
            volume: Math.random() * 1000000
          });
        }
        
        onHistoryCallback(bars, { noData: false });
      },
      subscribeBars: (symbolInfo: any, resolution: string, onRealtimeCallback: any, subscriberUID: string, onResetCacheNeededCallback: any) => {
        // Subscribe to real-time updates
        const interval = setInterval(() => {
           if (marketData?.data && isLiveDataEnabled) {
             const now = Date.now();
             const price = marketData.data.price;
             const bar = {
              time: now,
              low: price * 0.999,
              high: price * 1.001,
              open: price,
              close: price,
              volume: Math.random() * 100000
            };
            onRealtimeCallback(bar);
            setLastUpdate(new Date());
          }
        }, 1000);
        
        return () => clearInterval(interval);
      },
      unsubscribeBars: (subscriberUID: string) => {
        // Cleanup subscription
      }
    };
  };

  // Toggle live data
  const toggleLiveData = () => {
    setIsLiveDataEnabled(!isLiveDataEnabled);
    if (!isLiveDataEnabled && !isConnected) {
      connect();
    } else if (isLiveDataEnabled && isConnected) {
      disconnect();
    }
  };

  // Connect to market data when live data is enabled
  useEffect(() => {
    if (isLiveDataEnabled && !isConnected) {
      connect();
    }
  }, [isLiveDataEnabled, isConnected, connect]);

  // Convert symbol to TradingView format
  const formatSymbol = (sym: string): string => {
    // Handle different symbol formats
    if (sym.includes('USDT')) {
      return `BINANCE:${sym}`;
    }
    if (sym.includes('-PERP')) {
      const base = sym.replace('-PERP', '');
      return `BINANCE:${base}USDT`;
    }
    if (sym.includes('-C-') || sym.includes('-P-')) {
      // Options - use underlying
      const underlying = sym.split('-')[0];
      return `NASDAQ:${underlying}`;
    }
    // Futures
    const futuresMap: { [key: string]: string } = {
      'ES': 'CME_MINI:ES1!',
      'NQ': 'CME_MINI:NQ1!',
      'YM': 'CBOT_MINI:YM1!',
      'RTY': 'CME_MINI:RTY1!',
      'CL': 'NYMEX:CL1!',
      'GC': 'COMEX:GC1!',
      'SI': 'COMEX:SI1!',
      'NG': 'NYMEX:NG1!',
      'ZB': 'CBOT:ZB1!',
      'ZN': 'CBOT:ZN1!',
      'ZF': 'CBOT:ZF1!',
      'ZT': 'CBOT:ZT1!'
    };
    
    if (futuresMap[sym]) {
      return futuresMap[sym];
    }
    
    // Default to NASDAQ for stocks
    return `NASDAQ:${sym}`;
  };

  const loadTradingViewScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.TradingView) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load TradingView script'));
      
      document.head.appendChild(script);
      scriptRef.current = script;
    });
  };

  const createWidget = () => {
    // Check if container exists and is mounted
    if (!containerRef.current) {
      console.warn('Container not ready, skipping widget creation');
      return;
    }

    // Cleanup existing widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        console.warn('Error removing existing widget:', e);
      }
    }

    // Clear container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    try {
      const widgetConfig = {
        autosize,
        symbol: formatSymbol(symbol),
        interval,
        timezone,
        theme,
        style: '1', // Candlestick
        locale,
        toolbar_bg,
        enable_publishing,
        allow_symbol_change,
        container: containerRef.current,
        width,
        height,
        studies,
        show_popup_button,
        popup_width,
        popup_height,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        calendar: false,
        hotlist: false,
        news: [],
        details: false,
        withdateranges: true,
        range: '3M',
        hide_volume: false,
        support_host: 'https://www.tradingview.com',
        // Enable real-time data
        datafeed: isLiveDataEnabled ? createDatafeed() : undefined,
        library_path: '/charting_library/',
        custom_css_url: '/charting_library/custom.css'
      };

      widgetRef.current = new window.TradingView.widget(widgetConfig);
      
      if (onReady) {
        widgetRef.current.onChartReady(() => {
          onReady();
        });
      }
    } catch (error) {
      console.error('Error creating TradingView widget:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeWidget = async () => {
      try {
        await loadTradingViewScript();
        if (mounted && containerRef.current && window.TradingView) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            if (mounted && containerRef.current) {
              createWidget();
            }
          }, 100);
        }
      } catch (error) {
        console.error('Failed to initialize TradingView widget:', error);
      }
    };

    initializeWidget();

    return () => {
      mounted = false;
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up widget:', e);
        }
      }
    };
  }, []);

  // Update widget when symbol or interval changes
  useEffect(() => {
    if (widgetRef.current && window.TradingView && containerRef.current) {
      createWidget();
    }
  }, [symbol, interval, theme]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Advanced Chart
            <Badge variant="outline" className="ml-2">
              {formatSymbol(symbol).replace(':', ' ')}
            </Badge>
            {isLiveDataEnabled && (
              <Badge 
                variant={isConnected ? "default" : "secondary"} 
                className={cn(
                  "ml-2 flex items-center gap-1",
                  isConnected ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"
                )}
              >
                {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdate && isLiveDataEnabled && (
              <span className="text-xs text-gray-500">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <Button 
              variant={isLiveDataEnabled ? "default" : "outline"} 
              size="sm"
              onClick={toggleLiveData}
              className={cn(
                isLiveDataEnabled && "bg-green-500 hover:bg-green-600"
              )}
            >
              {isLiveDataEnabled ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isLiveDataEnabled ? 'Live' : 'Static'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isLiveDataEnabled && marketData?.data && (
           <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
             <span>Price: <span className="font-medium">${marketData.data.price.toLocaleString()}</span></span>
             <span className={cn(
               "flex items-center gap-1",
               marketData.data.changePercent >= 0 ? "text-green-500" : "text-red-500"
             )}>
               {marketData.data.changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
               {marketData.data.changePercent.toFixed(2)}%
             </span>
             <span>Volume: <span className="font-medium">{marketData.data.volume.toLocaleString()}</span></span>
           </div>
         )}
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          id={containerId}
          className="w-full"
          style={{ height: autosize ? '100%' : `${height}px`, minHeight: '400px' }}
        />
      </CardContent>
    </Card>
  );
};

export default memo(TradingViewChart);