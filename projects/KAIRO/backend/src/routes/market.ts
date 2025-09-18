import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

// Mock market data - In a real app, this would come from a market data provider
const mockMarketData = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45678900,
    marketCap: 2800000000000,
    high52Week: 198.23,
    low52Week: 124.17,
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2847.63,
    change: -15.42,
    changePercent: -0.54,
    volume: 1234567,
    marketCap: 1900000000000,
    high52Week: 3030.93,
    low52Week: 2193.62,
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.23,
    changePercent: 1.13,
    volume: 23456789,
    marketCap: 2850000000000,
    high52Week: 384.30,
    low52Week: 213.43,
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: -8.73,
    changePercent: -3.39,
    volume: 87654321,
    marketCap: 790000000000,
    high52Week: 414.50,
    low52Week: 101.81,
  },
  'AMZN': {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 3127.45,
    change: 18.92,
    changePercent: 0.61,
    volume: 3456789,
    marketCap: 1600000000000,
    high52Week: 3773.08,
    low52Week: 2025.20,
  },
};

// @desc    Get market overview
// @route   GET /api/market/overview
// @access  Public
router.get('/overview', asyncHandler(async (req: any, res: any) => {
  const marketOverview = {
    indices: {
      sp500: {
        name: 'S&P 500',
        value: 4567.89,
        change: 23.45,
        changePercent: 0.52,
      },
      nasdaq: {
        name: 'NASDAQ',
        value: 14234.56,
        change: -45.67,
        changePercent: -0.32,
      },
      dow: {
        name: 'Dow Jones',
        value: 34567.12,
        change: 123.45,
        changePercent: 0.36,
      },
    },
    topGainers: Object.values(mockMarketData)
      .filter(stock => stock.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5),
    topLosers: Object.values(mockMarketData)
      .filter(stock => stock.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5),
    mostActive: Object.values(mockMarketData)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5),
  };

  res.json({
    success: true,
    data: marketOverview,
  });
}));

// @desc    Search stocks
// @route   GET /api/market/search
// @access  Public
router.get('/search', asyncHandler(async (req: any, res: any) => {
  const { q: query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const results = Object.values(mockMarketData).filter(
    stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
  );

  res.json({
    success: true,
    data: { results },
  });
}));

// @desc    Get stock quote
// @route   GET /api/market/quote/:symbol
// @access  Public
router.get('/quote/:symbol', asyncHandler(async (req: any, res: any) => {
  const { symbol } = req.params;
  const stock = mockMarketData[symbol.toUpperCase() as keyof typeof mockMarketData];

  if (!stock) {
    return res.status(404).json({
      success: false,
      message: 'Stock not found',
    });
  }

  res.json({
    success: true,
    data: { stock },
  });
}));

// @desc    Get stock historical data
// @route   GET /api/market/history/:symbol
// @access  Public
router.get('/history/:symbol', asyncHandler(async (req: any, res: any) => {
  const { symbol } = req.params;
  const { period = '1M' } = req.query;

  const stock = mockMarketData[symbol.toUpperCase() as keyof typeof mockMarketData];

  if (!stock) {
    return res.status(404).json({
      success: false,
      message: 'Stock not found',
    });
  }

  // Generate mock historical data
  const generateHistoricalData = (days: number) => {
    const data = [];
    const basePrice = stock.price;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomChange = (Math.random() - 0.5) * 0.1; // ±5% random change
      const price = basePrice * (1 + randomChange);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: price * (1 + (Math.random() - 0.5) * 0.02),
        high: price * (1 + Math.random() * 0.03),
        low: price * (1 - Math.random() * 0.03),
        close: price,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }
    
    return data;
  };

  let days = 30;
  switch (period) {
    case '1D':
      days = 1;
      break;
    case '1W':
      days = 7;
      break;
    case '1M':
      days = 30;
      break;
    case '3M':
      days = 90;
      break;
    case '1Y':
      days = 365;
      break;
    default:
      days = 30;
  }

  const historicalData = generateHistoricalData(days);

  res.json({
    success: true,
    data: {
      symbol: stock.symbol,
      period,
      data: historicalData,
    },
  });
}));

// @desc    Get watchlist stocks
// @route   GET /api/market/watchlist
// @access  Private
router.get('/watchlist', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const watchlistWithData = watchlist.flatMap(item => 
    item.symbols.map(symbol => {
      const stock = mockMarketData[symbol as keyof typeof mockMarketData];
      return stock ? { ...stock, watchlistId: item.id } : null;
    }).filter(Boolean)
  );

  res.json({
    success: true,
    data: { watchlist: watchlistWithData },
  });
}));

// @desc    Add stock to watchlist
// @route   POST /api/market/watchlist
// @access  Private
router.post('/watchlist', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  const { symbol } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!symbol) {
    return res.status(400).json({
      success: false,
      message: 'Symbol is required',
    });
  }

  const stock = mockMarketData[symbol.toUpperCase() as keyof typeof mockMarketData];

  if (!stock) {
    return res.status(404).json({
      success: false,
      message: 'Stock not found',
    });
  }

  // Check if already in watchlist
  const existing = await prisma.watchlist.findFirst({
    where: {
      userId,
      symbols: {
        has: symbol.toUpperCase(),
      },
    },
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Stock already in watchlist',
    });
  }

  const watchlistItem = await prisma.watchlist.create({
    data: {
      userId,
      name: `Watchlist ${symbol.toUpperCase()}`,
      symbols: [symbol.toUpperCase()],
    },
  });

  res.status(201).json({
    success: true,
    data: {
      watchlistItem: {
        ...watchlistItem,
        ...stock,
      },
    },
  });
}));

// @desc    Remove stock from watchlist
// @route   DELETE /api/market/watchlist/:symbol
// @access  Private
router.delete('/watchlist/:symbol', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  const { symbol } = req.params;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const watchlistItem = await prisma.watchlist.findFirst({
    where: {
      userId,
      symbols: {
        has: symbol.toUpperCase(),
      },
    },
  });

  if (!watchlistItem) {
    return res.status(404).json({
      success: false,
      message: 'Stock not found in watchlist',
    });
  }

  // Remove symbol from the array
  const updatedSymbols = watchlistItem.symbols.filter(s => s !== symbol.toUpperCase());
  
  if (updatedSymbols.length === 0) {
    // Delete the entire watchlist if no symbols left
    await prisma.watchlist.delete({
      where: { id: watchlistItem.id },
    });
  } else {
    // Update the watchlist with remaining symbols
    await prisma.watchlist.update({
      where: { id: watchlistItem.id },
      data: { symbols: updatedSymbols },
    });
  }



  res.json({
    success: true,
    message: 'Stock removed from watchlist',
  });
}));

export default router;