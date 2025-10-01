'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Activity,
  TrendingUp,
  Globe,
  Settings,
  ChevronDown,
  DollarSign,
  Bot,
  Target,
  Zap,
  Shield,
  Users,
  BookOpen,
  Bell,
  User,
  LogOut
} from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string;
  description?: string;
  disabled?: boolean;
}

interface DropdownSection {
  title?: string;
  items: DropdownItem[];
}

interface TradingDropdownProps {
  trigger: React.ReactNode;
  sections: DropdownSection[];
  align?: 'left' | 'right' | 'center';
  width?: string;
  className?: string;
}

export default function TradingDropdown({
  trigger,
  sections,
  align = 'left',
  width = 'w-64',
  className = ''
}: TradingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
    
    setIsOpen(false);
  };

  const getAlignmentClasses = () => {
    switch (align) {
      case 'right':
        return 'right-0';
      case 'center':
        return 'left-1/2 transform -translate-x-1/2';
      default:
        return 'left-0';
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {trigger}
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full mt-2 ${width} ${getAlignmentClasses()} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden`}>
          <div className="py-2">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    {section.title}
                  </div>
                )}
                
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-all duration-150 ${
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
                
                {sectionIndex < sections.length - 1 && (
                  <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured dropdown for main navigation
export function MainNavigationDropdown() {
  const sections: DropdownSection[] = [
    {
      title: "Trading",
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <BarChart3 className="h-4 w-4" />,
          href: '/dashboard',
          description: 'Overview and analytics'
        },
        {
          id: 'trading',
          label: 'Trading Panel',
          icon: <Activity className="h-4 w-4" />,
          href: '/trading',
          description: 'Execute trades and manage positions'
        },
        {
          id: 'portfolio',
          label: 'Portfolio',
          icon: <TrendingUp className="h-4 w-4" />,
          href: '/portfolio',
          description: 'Track performance and holdings'
        },
        {
          id: 'automation',
          label: 'Automation',
          icon: <Bot className="h-4 w-4" />,
          href: '/automation',
          badge: 'Pro',
          description: 'Automated trading strategies'
        }
      ]
    },
    {
      title: "Markets",
      items: [
        {
          id: 'crypto',
          label: 'Cryptocurrency',
          icon: <DollarSign className="h-4 w-4" />,
          href: '/markets/crypto',
          description: 'Bitcoin, Ethereum, and altcoins'
        },
        {
          id: 'forex',
          label: 'Forex',
          icon: <Globe className="h-4 w-4" />,
          href: '/markets/forex',
          description: 'Currency pairs and FX trading'
        },
        {
          id: 'stocks',
          label: 'Stocks',
          icon: <TrendingUp className="h-4 w-4" />,
          href: '/markets/stocks',
          description: 'Equities and stock markets'
        }
      ]
    },
    {
      title: "Tools",
      items: [
        {
          id: 'signals',
          label: 'AI Signals',
          icon: <Zap className="h-4 w-4" />,
          href: '/signals',
          badge: 'New',
          description: 'AI-powered trading signals'
        },
        {
          id: 'risk-management',
          label: 'Risk Management',
          icon: <Shield className="h-4 w-4" />,
          href: '/risk-management',
          description: 'Portfolio protection tools'
        },
        {
          id: 'copy-trading',
          label: 'Copy Trading',
          icon: <Users className="h-4 w-4" />,
          href: '/copy-trade',
          description: 'Follow successful traders'
        }
      ]
    },
    {
      items: [
        {
          id: 'education',
          label: 'Education',
          icon: <BookOpen className="h-4 w-4" />,
          href: '/education',
          description: 'Learn trading strategies'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="h-4 w-4" />,
          href: '/settings',
          description: 'Account and preferences'
        }
      ]
    }
  ];

  return (
    <TradingDropdown
      trigger={
        <>
          <BarChart3 className="h-5 w-5" />
          <span className="font-medium">Markets</span>
        </>
      }
      sections={sections}
      width="w-80"
      align="left"
    />
  );
}

// User account dropdown
export function UserAccountDropdown({ user }: { user?: { name: string; email: string; avatar?: string } }) {
  const sections: DropdownSection[] = [
    {
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: <User className="h-4 w-4" />,
          href: '/profile',
          description: user?.email || 'Manage your account'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <Bell className="h-4 w-4" />,
          href: '/notifications',
          badge: '3',
          description: 'Alerts and updates'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="h-4 w-4" />,
          href: '/settings',
          description: 'Preferences and security'
        }
      ]
    },
    {
      items: [
        {
          id: 'logout',
          label: 'Sign Out',
          icon: <LogOut className="h-4 w-4" />,
          onClick: () => {
            // Handle logout
            console.log('Logging out...');
          },
          description: 'Sign out of your account'
        }
      ]
    }
  ];

  return (
    <TradingDropdown
      trigger={
        <>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="font-medium">{user?.name || 'User'}</span>
        </>
      }
      sections={sections}
      width="w-64"
      align="right"
    />
  );
}