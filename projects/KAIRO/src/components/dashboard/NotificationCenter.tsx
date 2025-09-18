'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, TrendingUp, TrendingDown, Settings, Filter } from 'lucide-react';

interface Notification {
  id: string;
  type: 'trade' | 'alert' | 'system' | 'strategy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  data?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'trade',
      priority: 'high',
      title: 'Trade Executed',
      message: 'BUY order for AAPL filled at $185.50 - Quantity: 100 shares',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionable: true,
      data: { symbol: 'AAPL', price: 185.50, quantity: 100, side: 'buy' }
    },
    {
      id: '2',
      type: 'alert',
      priority: 'critical',
      title: 'Price Alert Triggered',
      message: 'TSLA has reached your target price of $250.00',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionable: true,
      data: { symbol: 'TSLA', price: 250.00, type: 'target' }
    },
    {
      id: '3',
      type: 'strategy',
      priority: 'medium',
      title: 'Strategy Performance',
      message: 'Scalping Pro strategy achieved 15% profit this week',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      actionable: false,
      data: { strategy: 'Scalping Pro', profit: 15 }
    },
    {
      id: '4',
      type: 'system',
      priority: 'low',
      title: 'Market Update',
      message: 'US markets will close early today due to holiday',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      actionable: false
    },
    {
      id: '5',
      type: 'trade',
      priority: 'high',
      title: 'Stop Loss Triggered',
      message: 'SELL order for NVDA executed at $420.00 - Loss: -$150.00',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      read: false,
      actionable: true,
      data: { symbol: 'NVDA', price: 420.00, loss: -150.00, side: 'sell' }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'trade' | 'alert' | 'strategy' | 'system'>('all');
  const [showSettings, setShowSettings] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['trade', 'alert', 'strategy', 'system'][Math.floor(Math.random() * 4)] as any,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        title: 'New Market Update',
        message: 'Real-time market data updated',
        timestamp: new Date(),
        read: false,
        actionable: Math.random() > 0.5
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep only 20 notifications
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-5 h-5 ${
      priority === 'critical' ? 'text-red-500' :
      priority === 'high' ? 'text-orange-500' :
      priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
    }`;

    switch (type) {
      case 'trade':
        return <TrendingUp className={iconClass} />;
      case 'alert':
        return <AlertTriangle className={iconClass} />;
      case 'strategy':
        return <TrendingDown className={iconClass} />;
      case 'system':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-16 pr-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'trade', 'alert', 'strategy', 'system'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'font-medium' : 'opacity-75'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        {notification.actionable && (
                          <div className="flex space-x-2 mt-2">
                            <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                              View Details
                            </button>
                            {notification.type === 'alert' && (
                              <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800">
                                Trade Now
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-gray-200 dark:border-gray-600 p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Notification Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Trade executions</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Price alerts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Strategy updates</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">System notifications</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;