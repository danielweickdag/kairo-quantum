'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Activity,
  TrendingUp,
  MessageSquare,
  Bot,
  Code,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Edit,
  Save,
  Camera,
  Upload,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Key,
  Smartphone,
  Globe,
  Zap,
  FileText,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'
import PineEditor from '../trading/PineEditor'
import PerformanceAnalytics from '../trading/PerformanceAnalytics'
import TraderInbox from '../trading/TraderInbox'
import AutoTrading from '../trading/AutoTrading'

interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  location?: string
  timezone: string
  joinDate: Date
  lastLogin: Date
  isVerified: boolean
  accountType: 'basic' | 'pro' | 'premium'
  tradingLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface AccountSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    trading: boolean
    news: boolean
    social: boolean
  }
  privacy: {
    profileVisible: boolean
    tradingStatsVisible: boolean
    portfolioVisible: boolean
    allowMessages: boolean
  }
  trading: {
    confirmOrders: boolean
    riskWarnings: boolean
    autoSave: boolean
    paperTrading: boolean
  }
  security: {
    twoFactorEnabled: boolean
    loginAlerts: boolean
    sessionTimeout: number
    ipWhitelist: string[]
  }
}

interface Subscription {
  plan: 'basic' | 'pro' | 'premium'
  status: 'active' | 'cancelled' | 'expired'
  nextBilling: Date
  amount: number
  features: string[]
}

const UserAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user123',
    username: 'trader_pro',
    email: 'trader@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: undefined,
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    timezone: 'America/New_York',
    joinDate: new Date('2023-06-15'),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isVerified: true,
    accountType: 'pro',
    tradingLevel: 'advanced'
  })

  const [settings, setSettings] = useState<AccountSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      trading: true,
      news: true,
      social: false
    },
    privacy: {
      profileVisible: true,
      tradingStatsVisible: false,
      portfolioVisible: false,
      allowMessages: true
    },
    trading: {
      confirmOrders: true,
      riskWarnings: true,
      autoSave: true,
      paperTrading: false
    },
    security: {
      twoFactorEnabled: true,
      loginAlerts: true,
      sessionTimeout: 30,
      ipWhitelist: []
    }
  })

  const [subscription] = useState<Subscription>({
    plan: 'pro',
    status: 'active',
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    amount: 49.99,
    features: [
      'Advanced Charting Tools',
      'Real-time Market Data',
      'Portfolio Analytics',
      'Pine Script Editor',
      'Auto-trading Bots',
      'Priority Support',
      'API Access'
    ]
  })

  const updateSetting = (category: keyof AccountSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-gray-100 text-gray-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTradingLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-orange-100 text-orange-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-600">@{profile.username}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={cn('text-xs', getAccountTypeColor(profile.accountType))}>
                {profile.accountType.toUpperCase()}
              </Badge>
              <Badge className={cn('text-xs', getTradingLevelColor(profile.tradingLevel))}>
                {profile.tradingLevel}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pine-editor">Pine Editor</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="autotrade">AutoTrade</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined:</span>
                    <span>{profile.joinDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Login:</span>
                    <span>{profile.lastLogin.toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Trades:</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium text-green-600">68.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total P&L:</span>
                    <span className="font-medium text-green-600">+$24,580</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Bots:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scripts Created:</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <Badge className={cn('text-xs', getAccountTypeColor(subscription.plan))}>
                      {subscription.plan.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                      {subscription.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing:</span>
                    <span>{subscription.nextBilling.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(subscription.amount)}/month</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('pine-editor')}>
                  <Code className="w-6 h-6" />
                  <span className="text-xs">Pine Editor</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('performance')}>
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-xs">Performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('inbox')}>
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-xs">Inbox</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => setActiveTab('autotrade')}>
                  <Bot className="w-6 h-6" />
                  <span className="text-xs">AutoTrade</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 border rounded">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Profitable trade executed</div>
                    <div className="text-xs text-gray-600">BTC/USD • +$125.50 • 2 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border rounded">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Trading bot activated</div>
                    <div className="text-xs text-gray-600">Momentum Scalper • 4 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border rounded">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Code className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pine script saved</div>
                    <div className="text-xs text-gray-600">RSI Divergence Strategy • 6 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 border rounded">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New message received</div>
                    <div className="text-xs text-gray-600">From @crypto_analyst • 8 hours ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pine-editor">
          <PineEditor />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="inbox">
          <TraderInbox />
        </TabsContent>

        <TabsContent value="autotrade">
          <AutoTrading />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Email Notifications</Label>
                    <Switch 
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Push Notifications</Label>
                    <Switch 
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">SMS Notifications</Label>
                    <Switch 
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Trading Alerts</Label>
                    <Switch 
                      checked={settings.notifications.trading}
                      onCheckedChange={(checked) => updateSetting('notifications', 'trading', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Market News</Label>
                    <Switch 
                      checked={settings.notifications.news}
                      onCheckedChange={(checked) => updateSetting('notifications', 'news', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Social Updates</Label>
                    <Switch 
                      checked={settings.notifications.social}
                      onCheckedChange={(checked) => updateSetting('notifications', 'social', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Profile Visible</Label>
                    <Switch 
                      checked={settings.privacy.profileVisible}
                      onCheckedChange={(checked) => updateSetting('privacy', 'profileVisible', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Trading Stats Visible</Label>
                    <Switch 
                      checked={settings.privacy.tradingStatsVisible}
                      onCheckedChange={(checked) => updateSetting('privacy', 'tradingStatsVisible', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Portfolio Visible</Label>
                    <Switch 
                      checked={settings.privacy.portfolioVisible}
                      onCheckedChange={(checked) => updateSetting('privacy', 'portfolioVisible', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Allow Messages</Label>
                    <Switch 
                      checked={settings.privacy.allowMessages}
                      onCheckedChange={(checked) => updateSetting('privacy', 'allowMessages', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trading Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Confirm Orders</Label>
                    <Switch 
                      checked={settings.trading.confirmOrders}
                      onCheckedChange={(checked) => updateSetting('trading', 'confirmOrders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Risk Warnings</Label>
                    <Switch 
                      checked={settings.trading.riskWarnings}
                      onCheckedChange={(checked) => updateSetting('trading', 'riskWarnings', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto Save</Label>
                    <Switch 
                      checked={settings.trading.autoSave}
                      onCheckedChange={(checked) => updateSetting('trading', 'autoSave', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Paper Trading</Label>
                    <Switch 
                      checked={settings.trading.paperTrading}
                      onCheckedChange={(checked) => updateSetting('trading', 'paperTrading', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Login Alerts</Label>
                    <p className="text-xs text-gray-600">Get notified of new logins</p>
                  </div>
                  <Switch 
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Session Timeout (minutes)</Label>
                  <Input 
                    type="number" 
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" size="sm">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Manage Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{subscription.plan.toUpperCase()} Plan</h3>
                  <p className="text-sm text-gray-600">{formatCurrency(subscription.amount)}/month</p>
                </div>
                <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                  {subscription.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Included Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
                <Button variant="outline" size="sm">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">Pro Plan - March 2024</div>
                    <div className="text-xs text-gray-600">Paid on Mar 1, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(49.99)}</div>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Download className="w-3 h-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">Pro Plan - February 2024</div>
                    <div className="text-xs text-gray-600">Paid on Feb 1, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(49.99)}</div>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Download className="w-3 h-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">Pro Plan - January 2024</div>
                    <div className="text-xs text-gray-600">Paid on Jan 1, 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(49.99)}</div>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Download className="w-3 h-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">•••• •••• •••• 4242</div>
                      <div className="text-xs text-gray-600">Expires 12/25</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">Default</Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserAccount