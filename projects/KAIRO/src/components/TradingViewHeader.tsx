'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
  User,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  LogOut,
  BarChart3,
  Activity,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketData {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

const mockMarketData: MarketData[] = [
  { symbol: 'SPY', price: '428.50', change: '+2.15', changePercent: '+0.50%', isPositive: true },
  { symbol: 'QQQ', price: '365.20', change: '-1.80', changePercent: '-0.49%', isPositive: false },
  { symbol: 'BTC', price: '43,250', change: '+850', changePercent: '+2.01%', isPositive: true },
  { symbol: 'ETH', price: '2,580', change: '+45', changePercent: '+1.77%', isPositive: true },
  { symbol: 'TSLA', price: '248.50', change: '-3.20', changePercent: '-1.27%', isPositive: false },
];

export default function TradingViewHeader() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/trading?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="tradingview-header h-14 px-4 flex items-center justify-between">
      {/* Left Section - Logo and Market Data */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-md">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">KAIRO</span>
        </div>

        {/* Market Data Ticker */}
        <div className="hidden lg:flex items-center space-x-4">
          {mockMarketData.map((item) => (
            <div key={item.symbol} className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground font-medium">{item.symbol}</span>
              <span className="text-foreground font-semibold">{item.price}</span>
              <span className={`flex items-center space-x-1 ${
                item.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{item.changePercent}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search markets, symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </form>
      </div>

      {/* Right Section - User Controls */}
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

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
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
                    router.push('/dashboard');
                    setIsMenuOpen(false);
                  }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                  onClick={() => {
                    router.push('/trading');
                    setIsMenuOpen(false);
                  }}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Trading
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                  onClick={() => {
                    router.push('/portfolio');
                    setIsMenuOpen(false);
                  }}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Portfolio
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                  onClick={() => {
                    router.push('/social');
                    setIsMenuOpen(false);
                  }}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Social
                </button>
                <div className="border-t border-border my-1"></div>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                  onClick={() => {
                       router.push('/settings');
                       setShowUserMenu(false);
                     }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <Button 
               variant="ghost" 
               size="sm" 
               className="h-9 px-3"
               onClick={() => setShowUserMenu(!showUserMenu)}
             >
               <User className="h-4 w-4 mr-2" />
               <span className="hidden sm:inline">{user.firstName}</span>
               <ChevronDown className="h-3 w-3 ml-1" />
             </Button>
             
             {showUserMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                       router.push('/user-dashboard');
                       setShowUserMenu(false);
                     }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                      router.push('/settings');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                       handleLogout();
                       setShowUserMenu(false);
                     }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/login')}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              onClick={() => router.push('/register')}
            >
              Get started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}