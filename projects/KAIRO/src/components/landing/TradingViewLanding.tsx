'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Globe,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Star,
  Award,
  Target,
  Brain,
  Layers,
  LineChart,
  PieChart,
  DollarSign
} from 'lucide-react';
import TradingViewHeader from '../TradingViewHeader';

interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  volume?: string;
}

interface CryptoData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  marketCap?: string;
}

const majorIndices: MarketData[] = [
  { symbol: 'SPY', name: 'SPDR S&P 500', price: '428.50', change: '+2.15', changePercent: '+0.50%', isPositive: true, volume: '45.2M' },
  { symbol: 'QQQ', name: 'Invesco QQQ', price: '365.20', change: '-1.80', changePercent: '-0.49%', isPositive: false, volume: '32.1M' },
  { symbol: 'IWM', name: 'iShares Russell 2000', price: '198.75', change: '+0.95', changePercent: '+0.48%', isPositive: true, volume: '18.7M' },
  { symbol: 'VTI', name: 'Vanguard Total Stock', price: '245.30', change: '+1.20', changePercent: '+0.49%', isPositive: true, volume: '12.3M' },
];

const cryptoData: CryptoData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '43,250', change: '+850', changePercent: '+2.01%', isPositive: true, marketCap: '847B' },
  { symbol: 'ETH', name: 'Ethereum', price: '2,580', change: '+45', changePercent: '+1.77%', isPositive: true, marketCap: '310B' },
  { symbol: 'BNB', name: 'BNB', price: '315.20', change: '-8.50', changePercent: '-2.62%', isPositive: false, marketCap: '47B' },
  { symbol: 'SOL', name: 'Solana', price: '98.45', change: '+3.20', changePercent: '+3.36%', isPositive: true, marketCap: '42B' },
];

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Analytics",
    description: "Advanced machine learning algorithms analyze market patterns and provide intelligent trading insights."
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Real-Time Data",
    description: "Live market data, charts, and analytics updated in real-time for informed decision making."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Trading",
    description: "Bank-level security with multi-factor authentication and encrypted data transmission."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Social Trading",
    description: "Follow successful traders, copy their strategies, and learn from the community."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Risk Management",
    description: "Advanced risk management tools including stop-loss, take-profit, and position sizing."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Ultra-low latency execution with direct market access and optimized order routing."
  }
];

export default function TradingViewLanding() {
  const router = useRouter();
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    trades: 0,
    volume: 0,
    success: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        users: 250000,
        trades: 15000000,
        volume: 2500000000,
        success: 94
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/register');
  };

  const handleWatchDemo = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TradingViewHeader />
      
      {/* Hero Section */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Advanced Trading Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional-grade trading tools, real-time market data, and AI-powered analytics. 
            Trade smarter with KAIRO's comprehensive trading ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleWatchDemo} className="text-lg px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {animatedStats.users.toLocaleString()}+
            </div>
            <div className="text-muted-foreground">Active Traders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {animatedStats.trades.toLocaleString()}+
            </div>
            <div className="text-muted-foreground">Trades Executed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              ${(animatedStats.volume / 1000000000).toFixed(1)}B+
            </div>
            <div className="text-muted-foreground">Trading Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {animatedStats.success}%
            </div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="px-4 py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Market Overview</h2>
          
          {/* Major Indices */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Major Indices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {majorIndices.map((item) => (
                <Card key={item.symbol} className="market-widget">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">{item.symbol}</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        item.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.changePercent}
                      </div>
                    </div>
                    <div className="text-lg font-bold">{item.price}</div>
                    <div className={`text-sm flex items-center ${
                      item.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {item.change}
                    </div>
                    {item.volume && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Vol: {item.volume}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cryptocurrency */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Cryptocurrency
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cryptoData.map((item) => (
                <Card key={item.symbol} className="market-widget">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">{item.symbol}</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        item.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.changePercent}
                      </div>
                    </div>
                    <div className="text-lg font-bold">${item.price}</div>
                    <div className={`text-sm flex items-center ${
                      item.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {item.change}
                    </div>
                    {item.marketCap && (
                      <div className="text-xs text-muted-foreground mt-1">
                        MCap: ${item.marketCap}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose KAIRO?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional trading tools designed for both beginners and experienced traders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="tradingview-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of traders who trust KAIRO for their trading needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/pricing')} className="text-lg px-8 py-3">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}