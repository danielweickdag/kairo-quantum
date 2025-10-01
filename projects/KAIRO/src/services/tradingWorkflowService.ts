'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MARKET_SYMBOLS } from './marketDataService';

// Trading workflow automation service
class TradingWorkflowService {
  private static instance: TradingWorkflowService;
  private router: any = null;

  private constructor() {}

  static getInstance(): TradingWorkflowService {
    if (!TradingWorkflowService.instance) {
      TradingWorkflowService.instance = new TradingWorkflowService();
    }
    return TradingWorkflowService.instance;
  }

  setRouter(router: any) {
    this.router = router;
  }

  // Navigate to trading panel with specific symbol
  navigateToTradingPanel(symbol: string, options?: {
    orderType?: 'market' | 'limit' | 'stop';
    orderSide?: 'buy' | 'sell';
    quantity?: string;
    price?: string;
  }) {
    if (!this.router) {
      console.error('Router not initialized. Call setRouter() first.');
      return;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.set('symbol', symbol);
    
    if (options?.orderType) params.set('orderType', options.orderType);
    if (options?.orderSide) params.set('orderSide', options.orderSide);
    if (options?.quantity) params.set('quantity', options.quantity);
    if (options?.price) params.set('price', options.price);

    const url = `/trading/panel?${params.toString()}`;
    this.router.push(url);
  }

  // Quick buy workflow
  quickBuy(symbol: string, quantity?: string) {
    this.navigateToTradingPanel(symbol, {
      orderType: 'market',
      orderSide: 'buy',
      quantity
    });
  }

  // Quick sell workflow
  quickSell(symbol: string, quantity?: string) {
    this.navigateToTradingPanel(symbol, {
      orderType: 'market',
      orderSide: 'sell',
      quantity
    });
  }

  // Set limit order workflow
  setLimitOrder(symbol: string, side: 'buy' | 'sell', price: string, quantity?: string) {
    this.navigateToTradingPanel(symbol, {
      orderType: 'limit',
      orderSide: side,
      price,
      quantity
    });
  }

  // Get all tradeable symbols
  getAllSymbols() {
    return [
      ...MARKET_SYMBOLS.crypto,
      ...MARKET_SYMBOLS.stocks,
      ...MARKET_SYMBOLS.forex
    ];
  }

  // Search symbols by name or symbol
  searchSymbols(query: string) {
    const allSymbols = this.getAllSymbols();
    const lowerQuery = query.toLowerCase();
    
    return allSymbols.filter(symbolData => 
      symbolData.symbol.toLowerCase().includes(lowerQuery) ||
      symbolData.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Get symbol info
  getSymbolInfo(symbol: string) {
    const allSymbols = this.getAllSymbols();
    return allSymbols.find(s => s.symbol === symbol);
  }

  // Generate trading link for any symbol
  generateTradingLink(symbol: string, options?: {
    orderType?: 'market' | 'limit' | 'stop';
    orderSide?: 'buy' | 'sell';
    quantity?: string;
    price?: string;
  }) {
    const params = new URLSearchParams();
    params.set('symbol', symbol);
    
    if (options?.orderType) params.set('orderType', options.orderType);
    if (options?.orderSide) params.set('orderSide', options.orderSide);
    if (options?.quantity) params.set('quantity', options.quantity);
    if (options?.price) params.set('price', options.price);

    return `/trading/panel?${params.toString()}`;
  }

  // Auto-link stocks from portfolio or watchlist
  createStockLinks(stocks: string[]) {
    return stocks.map(symbol => ({
      symbol,
      info: this.getSymbolInfo(symbol),
      tradingLink: this.generateTradingLink(symbol),
      quickBuyLink: this.generateTradingLink(symbol, { orderType: 'market', orderSide: 'buy' }),
      quickSellLink: this.generateTradingLink(symbol, { orderType: 'market', orderSide: 'sell' })
    }));
  }
}

// React hooks for trading workflow
export const useTradingWorkflow = () => {
  const router = useRouter();
  const workflowService = TradingWorkflowService.getInstance();
  
  // Initialize router
  workflowService.setRouter(router);

  const navigateToTradingPanel = useCallback((symbol: string, options?: {
    orderType?: 'market' | 'limit' | 'stop';
    orderSide?: 'buy' | 'sell';
    quantity?: string;
    price?: string;
  }) => {
    workflowService.navigateToTradingPanel(symbol, options);
  }, [workflowService]);

  const quickBuy = useCallback((symbol: string, quantity?: string) => {
    workflowService.quickBuy(symbol, quantity);
  }, [workflowService]);

  const quickSell = useCallback((symbol: string, quantity?: string) => {
    workflowService.quickSell(symbol, quantity);
  }, [workflowService]);

  const setLimitOrder = useCallback((symbol: string, side: 'buy' | 'sell', price: string, quantity?: string) => {
    workflowService.setLimitOrder(symbol, side, price, quantity);
  }, [workflowService]);

  const generateTradingLink = useCallback((symbol: string, options?: {
    orderType?: 'market' | 'limit' | 'stop';
    orderSide?: 'buy' | 'sell';
    quantity?: string;
    price?: string;
  }) => {
    return workflowService.generateTradingLink(symbol, options);
  }, [workflowService]);

  const searchSymbols = useCallback((query: string) => {
    return workflowService.searchSymbols(query);
  }, [workflowService]);

  const createStockLinks = useCallback((stocks: string[]) => {
    return workflowService.createStockLinks(stocks);
  }, [workflowService]);

  return {
    navigateToTradingPanel,
    quickBuy,
    quickSell,
    setLimitOrder,
    generateTradingLink,
    searchSymbols,
    createStockLinks,
    getAllSymbols: workflowService.getAllSymbols.bind(workflowService),
    getSymbolInfo: workflowService.getSymbolInfo.bind(workflowService)
  };
};

// Component for creating trading action buttons
export const TradingActionButton: React.FC<{
  symbol: string;
  action: 'buy' | 'sell' | 'trade';
  quantity?: string;
  price?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ symbol, action, quantity, price, className, children }) => {
  const { quickBuy, quickSell, navigateToTradingPanel } = useTradingWorkflow();
  
  const handleClick = () => {
    switch (action) {
      case 'buy':
        quickBuy(symbol, quantity);
        break;
      case 'sell':
        quickSell(symbol, quantity);
        break;
      case 'trade':
        navigateToTradingPanel(symbol, { price, quantity });
        break;
    }
  };

  return React.createElement('button', {
    onClick: handleClick,
    className: className
  }, children || `${action.toUpperCase()} ${symbol}`);
};

// Component for creating trading links
export const TradingLink: React.FC<{
  symbol: string;
  orderType?: 'market' | 'limit' | 'stop';
  orderSide?: 'buy' | 'sell';
  quantity?: string;
  price?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ symbol, orderType, orderSide, quantity, price, className, children }) => {
  const { generateTradingLink } = useTradingWorkflow();
  
  const href = generateTradingLink(symbol, {
    orderType,
    orderSide,
    quantity,
    price
  });

  return React.createElement('a', {
    href: href,
    className: className
  }, children || `Trade ${symbol}`);
};

export default TradingWorkflowService;