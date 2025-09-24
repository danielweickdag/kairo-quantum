'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTradingMode } from '@/contexts/TradingModeContext';
import DemoModeIndicator from '@/components/ui/DemoModeIndicator';
import { toast } from 'react-hot-toast';
import {
  Menu,
  X,
  Home,
  TrendingUp,
  BarChart3,
  Users,
  Copy,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
  ChevronDown,
  Search,
  Wallet,
  Activity,
  Shield,
  HelpCircle,
  Zap,
  Radio,
  CreditCard,
  Crown,
  Award,
  Bot,
  Link
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and portfolio summary'
  },
  {
    name: 'User Dashboard',
    href: '/user-dashboard',
    icon: User,
    description: 'Personal account and subscription management'
  },
  {
    name: 'Trading',
    href: '/trading',
    icon: TrendingUp,
    description: 'Execute trades and view market data'
  },
  {
    name: 'Live Trading',
    href: '/trading/live',
    icon: Radio,
    description: 'Real-time trading dashboard'
  },
  {
    name: 'Futures Trading',
    href: '/trading/futures',
    icon: TrendingUp,
    description: 'Futures contracts trading'
  },
  {
    name: 'Options Trading',
    href: '/trading/options',
    icon: BarChart3,
    description: 'Options contracts trading'
  },
  {
    name: 'Market Updates',
    href: '/trading/market-updates',
    icon: Bell,
    description: 'Real-time market news and updates'
  },
  {
    name: 'Pine Editor',
    href: '/trading/pine-editor',
    icon: Settings,
    description: 'Pine Script editor for custom indicators'
  },
  {
    name: 'Profit Targets',
    href: '/trading/profit-targets',
    icon: Award,
    description: 'Set and manage profit targets'
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: BarChart3,
    description: 'Manage your investments'
  },
  {
    name: 'Copy Trade',
    href: '/copy-trade',
    icon: Copy,
    description: 'Follow and copy successful traders'
  },
  {
    name: 'Creators',
    href: '/creators',
    icon: Award,
    description: 'Discover top trading creators and investors'
  },
  {
    name: 'Social',
    href: '/social',
    icon: Users,
    badge: 3,
    description: 'Connect with the trading community'
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: Crown,
    description: 'View subscription plans and pricing'
  },
  {
    name: 'Payment',
    href: '/payment',
    icon: CreditCard,
    description: 'Manage payment methods and billing'
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    description: 'Security settings and compliance'
  },
  {
    name: 'Automation',
    href: '/automation',
    icon: Bot,
    description: 'Automated trading and system management'
  },
  {
    name: 'Trading Bot',
    href: '/automation/trading-bot',
    icon: Bot,
    description: 'Configure and manage trading bots'
  },
  {
    name: 'Copy Trading Auto',
    href: '/automation/copy-trading',
    icon: Copy,
    description: 'Automated copy trading settings'
  },
  {
    name: 'Risk Management',
    href: '/automation/risk-management',
    icon: Shield,
    description: 'Automated risk management rules'
  },
  {
    name: 'Data Pipeline',
    href: '/automation/data-pipeline',
    icon: Activity,
    description: 'Automated data processing and analysis'
  },
  {
    name: 'Auto Notifications',
    href: '/automation/notifications',
    icon: Bell,
    description: 'Automated notification settings'
  },
  {
    name: 'Auto Payments',
    href: '/automation/payments',
    icon: CreditCard,
    description: 'Automated payment processing'
  },
  {
    name: 'Auto Reporting',
    href: '/automation/reporting',
    icon: BarChart3,
    description: 'Automated report generation'
  },
  {
    name: 'Auto Onboarding',
    href: '/automation/onboarding',
    icon: User,
    description: 'Automated user onboarding process'
  },
  {
    name: 'Brokers',
    href: '/brokers',
    icon: Link,
    description: 'Connect and manage broker accounts'
  },
  {
    name: 'Demo',
    href: '/demo',
    icon: Activity,
    description: 'Practice trading with demo account'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application settings and preferences'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Manage your profile and account details'
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
    description: 'Get help and support'
  }
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isPaperTrading } = useTradingMode();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleNavigationKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedItemIndex(prev => (prev + 1) % navigationItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedItemIndex(prev => prev <= 0 ? navigationItems.length - 1 : prev - 1);
    } else if (event.key === 'Enter' && focusedItemIndex >= 0) {
      event.preventDefault();
      router.push(navigationItems[focusedItemIndex].href);
    } else if (event.key === 'Escape') {
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:bg-white lg:dark:bg-gray-800 lg:shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">KAIRO</span>
            </div>
            {isPaperTrading && <DemoModeIndicator className="text-xs" />}
          </div>
        </div>

        {/* Simplified Navigation - Only Logo Area */}
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">Navigation Menu</p>
            <p className="text-xs mt-1">Available in Profile</p>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              aria-label="User profile menu"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || 'U' : 'U'}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Profile Dropdown with Navigation Menu */}
            {isProfileMenuOpen && (
              <div 
                className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto"
                role="menu"
                aria-label="User profile and navigation menu"
              >
                {/* Navigation Items */}
                <div className="px-2 py-2">
                  <p className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Navigation</p>
                  <div onKeyDown={handleNavigationKeyDown}>
                    {navigationItems.map((item, index) => {
                      const active = isActive(item.href);
                      const isFocused = focusedItemIndex === index;
                      return (
                        <button
                          key={item.href}
                          onClick={() => {
                            router.push(item.href);
                            setIsProfileMenuOpen(false);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, () => {
                            router.push(item.href);
                            setIsProfileMenuOpen(false);
                          })}
                          className={`w-full flex items-center space-x-3 px-3 py-2 mb-1 rounded-lg transition-all duration-200 group text-sm ${
                            active
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          } ${
                            isFocused ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                          }`}
                          aria-current={active ? 'page' : undefined}
                          title={item.description}
                        >
                          <item.icon className={`h-4 w-4 transition-colors ${
                            active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                          }`} aria-hidden="true" />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badge && (
                            <span className={`ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full ${
                              active 
                                ? 'bg-white/20 text-white' 
                                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            }`} aria-label={`${item.badge} notifications`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Profile Actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <p className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</p>
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    aria-label="Go to profile page"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center" role="img" aria-label="KAIRO logo">
                <Zap className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">KAIRO</span>
            </div>
            {isPaperTrading && <DemoModeIndicator className="text-xs" />}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
              aria-label="Notifications"
              title="View notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || 'U' : 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="px-4 py-6 space-y-2" onKeyDown={handleNavigationKeyDown} role="navigation" aria-label="Mobile navigation menu">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const isFocused = focusedItemIndex === index;
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, () => {
                        router.push(item.href);
                        setIsMobileMenuOpen(false);
                      })}
                      className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      } ${
                        isFocused ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                      }`}
                      aria-current={active ? 'page' : undefined}
                      aria-describedby={item.description ? `${item.href}-mobile-desc` : undefined}
                      title={item.description}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        active ? 'text-white' : 'text-gray-400'
                      }`} aria-hidden="true" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className={`text-xs mt-1 ${
                            active ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                          }`} id={`${item.href}-mobile-desc`}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.badge && (
                        <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                          active 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        }`} aria-label={`${item.badge} notifications`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Menu Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    router.push('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <User className="h-5 w-5 text-gray-400" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/help');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <HelpCircle className="h-5 w-5 text-gray-400" />
                  <span>Help & Support</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {/* Show only the 5 most important navigation items in bottom bar */}
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}