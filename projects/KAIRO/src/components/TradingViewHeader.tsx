'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Bell,
  BellRing,
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
import { useMarketData } from '@/services/liveMarketService';
import { alertService } from '@/services/alertService';
import { toast } from 'react-hot-toast';
import AlertSettingsModal from '@/components/modals/AlertSettingsModal';

interface MarketData {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

// Get live market data and convert to header format
function useLiveMarketDataForHeader(): MarketData[] {
  const liveData = useMarketData();
  
  return useMemo(() => {
    if (!Array.isArray(liveData)) return [];
    
    const headerSymbols = ['SPY', 'QQQ', 'BTCUSDT', 'ETHUSDT'];
    const symbolMap = {
      'BTCUSDT': 'BTC',
      'ETHUSDT': 'ETH'
    };
    
    return liveData
      .filter(item => headerSymbols.includes(item.symbol))
      .map(item => ({
        symbol: symbolMap[item.symbol as keyof typeof symbolMap] || item.symbol,
        price: item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: (item.change >= 0 ? '+' : '') + item.change.toFixed(2),
        changePercent: (item.changePercent >= 0 ? '+' : '') + item.changePercent.toFixed(2) + '%',
        isPositive: item.change >= 0
      }));
  }, [liveData]);
}

export default function TradingViewHeader() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const liveMarketData = useLiveMarketDataForHeader();
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  // Update market data when live data changes
  useEffect(() => {
    if (liveMarketData.length > 0) {
      setMarketData(liveMarketData);
    }
  }, [liveMarketData]);

  // Initialize alert service and check preferences
  useEffect(() => {
    const preferences = alertService.getPreferences();
    if (preferences?.pushNotifications) {
      setAlertsEnabled(true);
    }

    // Subscribe to alert updates
    const unsubscribe = alertService.subscribe((alerts) => {
      const unreadAlerts = alerts.filter(alert => !alert.triggeredAt);
      setHasUnreadAlerts(unreadAlerts.length > 0);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEnableAlerts = async () => {
    if (!alertsEnabled) {
      try {
        const success = await alertService.enableAlerts();
        if (success) {
          setAlertsEnabled(true);
          toast.success('Alerts enabled successfully!');
        } else {
          toast.error('Failed to enable alerts. Please check your browser settings.');
        }
      } catch (error) {
        toast.error('Failed to enable alerts. Please check your browser settings.');
      }
    } else {
      // If alerts are already enabled, show settings
      setShowAlertSettings(true);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAlertSettings(true);
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
          {marketData.map((item) => (
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 relative"
          onClick={handleEnableAlerts}
          onContextMenu={handleRightClick}
          title={alertsEnabled ? 'Alerts enabled - Right click for settings' : 'Click to enable alerts'}
        >
          {alertsEnabled ? (
            <BellRing className="h-4 w-4 text-green-500" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {hasUnreadAlerts && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
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
      
      {/* Alert Settings Modal */}
      <AlertSettingsModal 
        isOpen={showAlertSettings}
        onClose={() => setShowAlertSettings(false)}
      />
    </header>
  );
}