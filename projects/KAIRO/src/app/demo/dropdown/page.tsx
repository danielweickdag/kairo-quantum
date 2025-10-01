'use client';

import React from 'react';
import TradingDropdown, { MainNavigationDropdown, UserAccountDropdown } from '@/components/ui/TradingDropdown';
import {
  BarChart3,
  Activity,
  TrendingUp,
  Globe,
  Settings,
  DollarSign,
  Bot,
  Target,
  Zap,
  Shield,
  Users,
  BookOpen,
  Bell,
  User,
  LogOut,
  Star,
  Heart,
  Download,
  Share,
  Filter,
  Search
} from 'lucide-react';

export default function DropdownDemoPage() {
  // Custom dropdown sections for demo
  const marketSections = [
    {
      title: "Popular Markets",
      items: [
        {
          id: 'btc-usdt',
          label: 'BTC/USDT',
          icon: <DollarSign className="h-4 w-4" />,
          description: '$67,234.50 (+2.34%)',
          badge: 'Hot'
        },
        {
          id: 'eth-usdt',
          label: 'ETH/USDT',
          icon: <DollarSign className="h-4 w-4" />,
          description: '$3,456.78 (+1.87%)',
        },
        {
          id: 'bnb-usdt',
          label: 'BNB/USDT',
          icon: <DollarSign className="h-4 w-4" />,
          description: '$612.45 (-0.56%)',
        }
      ]
    },
    {
      title: "Forex Pairs",
      items: [
        {
          id: 'eur-usd',
          label: 'EUR/USD',
          icon: <Globe className="h-4 w-4" />,
          description: '1.0876 (+0.12%)',
        },
        {
          id: 'gbp-usd',
          label: 'GBP/USD',
          icon: <Globe className="h-4 w-4" />,
          description: '1.2654 (-0.08%)',
        },
        {
          id: 'usd-jpy',
          label: 'USD/JPY',
          icon: <Globe className="h-4 w-4" />,
          description: '149.87 (+0.34%)',
        }
      ]
    },
    {
      title: "Actions",
      items: [
        {
          id: 'watchlist',
          label: 'Add to Watchlist',
          icon: <Star className="h-4 w-4" />,
          onClick: () => alert('Added to watchlist!')
        },
        {
          id: 'alerts',
          label: 'Set Price Alert',
          icon: <Bell className="h-4 w-4" />,
          onClick: () => alert('Price alert created!')
        }
      ]
    }
  ];

  const toolsSections = [
    {
      title: "Analysis Tools",
      items: [
        {
          id: 'technical-analysis',
          label: 'Technical Analysis',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'Charts and indicators',
          href: '/tools/technical-analysis'
        },
        {
          id: 'market-scanner',
          label: 'Market Scanner',
          icon: <Search className="h-4 w-4" />,
          description: 'Find trading opportunities',
          badge: 'Pro'
        },
        {
          id: 'screener',
          label: 'Stock Screener',
          icon: <Filter className="h-4 w-4" />,
          description: 'Filter stocks by criteria'
        }
      ]
    },
    {
      title: "Trading Tools",
      items: [
        {
          id: 'position-calculator',
          label: 'Position Calculator',
          icon: <Target className="h-4 w-4" />,
          description: 'Calculate position sizes'
        },
        {
          id: 'risk-calculator',
          label: 'Risk Calculator',
          icon: <Shield className="h-4 w-4" />,
          description: 'Assess trade risk'
        },
        {
          id: 'profit-calculator',
          label: 'Profit Calculator',
          icon: <TrendingUp className="h-4 w-4" />,
          description: 'Calculate potential profits'
        }
      ]
    },
    {
      items: [
        {
          id: 'export-data',
          label: 'Export Data',
          icon: <Download className="h-4 w-4" />,
          onClick: () => alert('Exporting data...')
        },
        {
          id: 'share-analysis',
          label: 'Share Analysis',
          icon: <Share className="h-4 w-4" />,
          onClick: () => alert('Sharing analysis...')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trading Dropdown Components
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Modern dropdown menus inspired by BTCC&apos;s design with trading-specific functionality
          </p>
        </div>

        {/* Demo Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Navigation Bar Example
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-xl font-bold text-blue-600">KAIRO</div>
              <MainNavigationDropdown />
              <TradingDropdown
                trigger={
                  <>
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">Markets</span>
                  </>
                }
                sections={marketSections}
                width="w-72"
                align="left"
              />
              <TradingDropdown
                trigger={
                  <>
                    <Target className="h-5 w-5" />
                    <span className="font-medium">Tools</span>
                  </>
                }
                sections={toolsSections}
                width="w-80"
                align="left"
              />
            </div>
            <div className="flex items-center space-x-4">
              <UserAccountDropdown user={{ name: 'John Doe', email: 'john@example.com' }} />
            </div>
          </div>
        </div>

        {/* Component Variations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Aligned Dropdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Left Aligned Dropdown
            </h3>
            <div className="flex justify-start">
              <TradingDropdown
                trigger={
                  <>
                    <Activity className="h-5 w-5" />
                    <span className="font-medium">Trading Panel</span>
                  </>
                }
                sections={[
                  {
                    title: "Quick Actions",
                    items: [
                      {
                        id: 'buy',
                        label: 'Buy Order',
                        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
                        description: 'Place a buy order',
                        onClick: () => alert('Buy order initiated')
                      },
                      {
                        id: 'sell',
                        label: 'Sell Order',
                        icon: <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />,
                        description: 'Place a sell order',
                        onClick: () => alert('Sell order initiated')
                      }
                    ]
                  }
                ]}
                width="w-64"
                align="left"
              />
            </div>
          </div>

          {/* Right Aligned Dropdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Right Aligned Dropdown
            </h3>
            <div className="flex justify-end">
              <TradingDropdown
                trigger={
                  <>
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Account</span>
                  </>
                }
                sections={[
                  {
                    items: [
                      {
                        id: 'profile',
                        label: 'Profile Settings',
                        icon: <User className="h-4 w-4" />,
                        href: '/profile'
                      },
                      {
                        id: 'security',
                        label: 'Security',
                        icon: <Shield className="h-4 w-4" />,
                        href: '/security',
                        badge: '2FA'
                      },
                      {
                        id: 'logout',
                        label: 'Sign Out',
                        icon: <LogOut className="h-4 w-4" />,
                        onClick: () => alert('Signing out...')
                      }
                    ]
                  }
                ]}
                width="w-56"
                align="right"
              />
            </div>
          </div>
        </div>

        {/* Center Aligned Dropdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Center Aligned Dropdown
          </h3>
          <div className="flex justify-center">
            <TradingDropdown
              trigger={
                <>
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">AI Assistant</span>
                </>
              }
              sections={[
                {
                  title: "AI Features",
                  items: [
                    {
                      id: 'signals',
                      label: 'Trading Signals',
                      icon: <Zap className="h-4 w-4" />,
                      description: 'AI-powered market signals',
                      badge: 'New'
                    },
                    {
                      id: 'analysis',
                      label: 'Market Analysis',
                      icon: <BarChart3 className="h-4 w-4" />,
                      description: 'Automated market insights'
                    },
                    {
                      id: 'portfolio-optimization',
                      label: 'Portfolio Optimization',
                      icon: <Target className="h-4 w-4" />,
                      description: 'AI-driven portfolio suggestions',
                      badge: 'Pro'
                    }
                  ]
                }
              ]}
              width="w-80"
              align="center"
            />
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Component Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Responsive Design</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adapts to different screen sizes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatic theme switching</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Keyboard Navigation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">ESC to close, arrow keys to navigate</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Custom Alignment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Left, right, or center positioning</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Badge Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Show notifications and status</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Section Grouping</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Organize items with separators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}