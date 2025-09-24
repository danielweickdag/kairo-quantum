'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTradingMode } from '@/contexts/TradingModeContext';
import AppLayout from '@/components/layouts/AppLayout';
import {
  Settings,
  User,
  Shield,
  Bell,
  CreditCard,
  Key,
  Globe,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NotificationSettings {
  email: {
    trades: boolean;
    portfolio: boolean;
    news: boolean;
    social: boolean;
    security: boolean;
  };
  push: {
    trades: boolean;
    portfolio: boolean;
    news: boolean;
    social: boolean;
    security: boolean;
  };
  sms: {
    trades: boolean;
    security: boolean;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  trustedDevices: string[];
}

interface TradingSettings {
  defaultOrderType: 'market' | 'limit' | 'stop';
  confirmationRequired: boolean;
  riskWarnings: boolean;
  autoLogout: number;
  paperTradingMode: boolean;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isPaperTrading, toggleTradingMode } = useTradingMode();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      trades: true,
      portfolio: true,
      news: false,
      social: true,
      security: true
    },
    push: {
      trades: true,
      portfolio: true,
      news: false,
      social: false,
      security: true
    },
    sms: {
      trades: false,
      security: true
    }
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    trustedDevices: []
  });
  const [trading, setTrading] = useState<TradingSettings>({
    defaultOrderType: 'market',
    confirmationRequired: true,
    riskWarnings: true,
    autoLogout: 15,
    paperTradingMode: isPaperTrading
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sync local trading state with global trading mode context
  useEffect(() => {
    setTrading(prev => ({ ...prev, paperTradingMode: isPaperTrading }));
  }, [isPaperTrading]);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'trading', label: 'Trading', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // In a real app, this would be API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      // In a real app, this would generate and download user data
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data export initiated. You will receive an email when ready.');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Account deletion initiated');
        logout();
      } catch (error) {
        toast.error('Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security settings</p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appearance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Theme
                      </label>
                      <div className="flex space-x-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor }
                        ].map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => setTheme(option.value as any)}
                              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                                theme === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (Central European Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  {Object.entries(notifications).map(([type, settings]) => (
                    <div key={type}>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 capitalize flex items-center">
                        {type === 'email' && <Mail className="h-4 w-4 mr-2" />}
                        {type === 'push' && <Smartphone className="h-4 w-4 mr-2" />}
                        {type === 'sms' && <Bell className="h-4 w-4 mr-2" />}
                        {type} Notifications
                      </h4>
                      <div className="space-y-3 ml-6">
                        {Object.entries(settings).map(([setting, enabled]) => (
                          <div key={setting} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {setting.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={enabled as boolean}
                                onChange={(e) => {
                                  setNotifications(prev => ({
                                    ...prev,
                                    [type]: {
                                      ...prev[type as keyof NotificationSettings],
                                      [setting]: e.target.checked
                                    }
                                  }));
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Password & Authentication</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.twoFactorEnabled}
                          onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Login Alerts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified of new login attempts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.loginAlerts}
                          onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Trading Preferences</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Order Type
                      </label>
                      <select
                        value={trading.defaultOrderType}
                        onChange={(e) => setTrading({ ...trading, defaultOrderType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="market">Market Order</option>
                        <option value="limit">Limit Order</option>
                        <option value="stop">Stop Order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Auto Logout (minutes)
                      </label>
                      <select
                        value={trading.autoLogout}
                        onChange={(e) => setTrading({ ...trading, autoLogout: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Order Confirmation</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Require confirmation before executing trades</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trading.confirmationRequired}
                          onChange={(e) => setTrading({ ...trading, confirmationRequired: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Risk Warnings</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Show risk warnings for high-risk trades</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trading.riskWarnings}
                          onChange={(e) => setTrading({ ...trading, riskWarnings: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Paper Trading Mode</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Practice trading with virtual money</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPaperTrading}
                          onChange={(e) => {
                            toggleTradingMode();
                            setTrading({ ...trading, paperTradingMode: !isPaperTrading });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Trading Activity</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show your trading activity to followers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Portfolio Performance</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Share your portfolio performance publicly</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Data Export</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download a copy of your data including profile information, trading history, and account settings.
                    </p>
                    <button
                      onClick={handleExportData}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? 'Preparing Export...' : 'Export My Data'}
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-lg text-red-700 dark:text-red-300 bg-white dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}