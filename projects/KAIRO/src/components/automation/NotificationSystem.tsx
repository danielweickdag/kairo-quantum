'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea'; // Component not available
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Settings,
  Volume2,
  VolumeX,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Users,
  Activity,
  Clock,
  Send,
  Filter,
  Archive,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'webhook' | 'telegram' | 'discord';
  enabled: boolean;
  config: {
    endpoint?: string;
    token?: string;
    email?: string;
    phone?: string;
    chatId?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastUsed?: string;
  deliveryRate: number;
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  eventType: 'trade_executed' | 'profit_target' | 'stop_loss' | 'risk_alert' | 'system_status' | 'market_update' | 'portfolio_change';
  enabled: boolean;
  conditions: {
    minAmount?: number;
    profitThreshold?: number;
    lossThreshold?: number;
    symbols?: string[];
    traders?: string[];
  };
  channels: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'instant' | 'batched' | 'daily' | 'weekly';
  createdAt: string;
  triggeredCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  eventType: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  channels: string[];
  metadata?: {
    symbol?: string;
    amount?: number;
    trader?: string;
    pnl?: number;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  eventType: string;
  subject: string;
  body: string;
  variables: string[];
  channels: string[];
}

const mockChannels: NotificationChannel[] = [
  {
    id: '1',
    name: 'Primary Email',
    type: 'email',
    enabled: true,
    config: { email: 'trader@example.com' },
    priority: 'high',
    lastUsed: '2024-01-15T10:30:00Z',
    deliveryRate: 98.5
  },
  {
    id: '2',
    name: 'SMS Alerts',
    type: 'sms',
    enabled: true,
    config: { phone: '+1234567890' },
    priority: 'critical',
    lastUsed: '2024-01-15T10:25:00Z',
    deliveryRate: 99.2
  },
  {
    id: '3',
    name: 'Push Notifications',
    type: 'push',
    enabled: true,
    config: {},
    priority: 'medium',
    lastUsed: '2024-01-15T10:32:00Z',
    deliveryRate: 95.8
  },
  {
    id: '4',
    name: 'Trading Webhook',
    type: 'webhook',
    enabled: false,
    config: { endpoint: 'https://api.example.com/webhook' },
    priority: 'low',
    deliveryRate: 87.3
  },
  {
    id: '5',
    name: 'Telegram Bot',
    type: 'telegram',
    enabled: true,
    config: { token: 'bot123456:ABC-DEF', chatId: '123456789' },
    priority: 'medium',
    lastUsed: '2024-01-15T10:28:00Z',
    deliveryRate: 96.7
  }
];

const mockRules: NotificationRule[] = [
  {
    id: '1',
    name: 'Large Trade Alerts',
    description: 'Notify when trades exceed $1000',
    eventType: 'trade_executed',
    enabled: true,
    conditions: { minAmount: 1000 },
    channels: ['1', '2', '3'],
    priority: 'high',
    frequency: 'instant',
    createdAt: '2024-01-10T00:00:00Z',
    triggeredCount: 23
  },
  {
    id: '2',
    name: 'Profit Targets Hit',
    description: 'Alert when profit targets are reached',
    eventType: 'profit_target',
    enabled: true,
    conditions: { profitThreshold: 5 },
    channels: ['1', '3', '5'],
    priority: 'medium',
    frequency: 'instant',
    createdAt: '2024-01-10T00:00:00Z',
    triggeredCount: 15
  },
  {
    id: '3',
    name: 'Stop Loss Triggered',
    description: 'Critical alert for stop loss events',
    eventType: 'stop_loss',
    enabled: true,
    conditions: { lossThreshold: -3 },
    channels: ['1', '2'],
    priority: 'critical',
    frequency: 'instant',
    createdAt: '2024-01-10T00:00:00Z',
    triggeredCount: 8
  },
  {
    id: '4',
    name: 'Risk Management Alerts',
    description: 'Notifications for risk threshold breaches',
    eventType: 'risk_alert',
    enabled: true,
    conditions: {},
    channels: ['1', '2', '3'],
    priority: 'high',
    frequency: 'instant',
    createdAt: '2024-01-10T00:00:00Z',
    triggeredCount: 12
  },
  {
    id: '5',
    name: 'Daily Portfolio Summary',
    description: 'Daily summary of portfolio performance',
    eventType: 'portfolio_change',
    enabled: true,
    conditions: {},
    channels: ['1'],
    priority: 'low',
    frequency: 'daily',
    createdAt: '2024-01-10T00:00:00Z',
    triggeredCount: 5
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Large Trade Executed',
    message: 'BTCUSDT buy order for $2,500 executed by CryptoKing_Pro',
    type: 'success',
    priority: 'high',
    eventType: 'trade_executed',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    starred: true,
    channels: ['1', '2', '3'],
    metadata: {
      symbol: 'BTCUSDT',
      amount: 2500,
      trader: 'CryptoKing_Pro'
    }
  },
  {
    id: '2',
    title: 'Stop Loss Triggered',
    message: 'ETHUSDT position closed with -4.2% loss',
    type: 'error',
    priority: 'critical',
    eventType: 'stop_loss',
    timestamp: '2024-01-15T10:25:00Z',
    read: false,
    starred: false,
    channels: ['1', '2'],
    metadata: {
      symbol: 'ETHUSDT',
      pnl: -108.50
    }
  },
  {
    id: '3',
    title: 'Profit Target Reached',
    message: 'ADAUSDT position closed with +8.7% profit',
    type: 'success',
    priority: 'medium',
    eventType: 'profit_target',
    timestamp: '2024-01-15T10:15:00Z',
    read: true,
    starred: false,
    channels: ['1', '3', '5'],
    metadata: {
      symbol: 'ADAUSDT',
      pnl: 156.30
    }
  },
  {
    id: '4',
    title: 'Risk Alert',
    message: 'Portfolio drawdown exceeded -8% threshold',
    type: 'warning',
    priority: 'high',
    eventType: 'risk_alert',
    timestamp: '2024-01-15T09:45:00Z',
    read: true,
    starred: false,
    channels: ['1', '2', '3']
  },
  {
    id: '5',
    title: 'New Trader Followed',
    message: 'Started copying trades from SafeTrader_AI',
    type: 'info',
    priority: 'low',
    eventType: 'system_status',
    timestamp: '2024-01-15T09:30:00Z',
    read: true,
    starred: false,
    channels: ['1']
  }
];

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Trade Execution',
    eventType: 'trade_executed',
    subject: 'Trade Executed: {{symbol}}',
    body: 'A {{side}} order for {{amount}} {{symbol}} has been executed by {{trader}} at ${{price}}.',
    variables: ['symbol', 'side', 'amount', 'trader', 'price'],
    channels: ['email', 'push']
  },
  {
    id: '2',
    name: 'Stop Loss Alert',
    eventType: 'stop_loss',
    subject: 'URGENT: Stop Loss Triggered - {{symbol}}',
    body: 'Your {{symbol}} position has been closed due to stop loss. Loss: {{pnl}}%',
    variables: ['symbol', 'pnl'],
    channels: ['email', 'sms', 'push']
  }
];

export default function NotificationSystem() {
  const [channels, setChannels] = useState<NotificationChannel[]>(mockChannels);
  const [rules, setRules] = useState<NotificationRule[]>(mockRules);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
    ));
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const toggleStar = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, starred: !notification.starred } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      case 'webhook': return <Activity className="h-4 w-4" />;
      case 'telegram': return <Send className="h-4 w-4" />;
      case 'discord': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'starred') return notification.starred;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const enabledChannels = channels.filter(c => c.enabled).length;
  const activeRules = rules.filter(r => r.enabled).length;
  const criticalAlerts = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Notification System</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated alerts and communication management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Sound</span>
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-green-500" onClick={() => setSoundEnabled(false)} />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" onClick={() => setSoundEnabled(true)} />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Do Not Disturb</span>
            <Switch checked={doNotDisturb} onCheckedChange={setDoNotDisturb} />
          </div>
          <Button onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs value="notifications" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-500">{criticalAlerts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Channels</p>
                    <p className="text-2xl font-bold">{enabledChannels}/{channels.length}</p>
                  </div>
                  <Send className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Rules</p>
                    <p className="text-2xl font-bold">{activeRules}/{rules.length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notification Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button 
                size="sm" 
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button 
                size="sm" 
                variant={filter === 'starred' ? 'default' : 'outline'}
                onClick={() => setFilter('starred')}
              >
                Starred ({notifications.filter(n => n.starred).length})
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest alerts and system messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-bold ${!notification.read ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                              {notification.title}
                            </h3>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority.toUpperCase()}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{new Date(notification.timestamp).toLocaleString()}</span>
                            {notification.metadata?.symbol && (
                              <span>• {notification.metadata.symbol}</span>
                            )}
                            {notification.metadata?.amount && (
                              <span>• ${notification.metadata.amount.toLocaleString()}</span>
                            )}
                            {notification.metadata?.pnl && (
                              <span className={notification.metadata.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                                • {notification.metadata.pnl >= 0 ? '+' : ''}${notification.metadata.pnl.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleStar(notification.id)}
                        >
                          <Star className={`h-4 w-4 ${notification.starred ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {channels.map(channel => (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(channel.type)}
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <CardDescription>{channel.type.toUpperCase()}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(channel.priority)}>
                        {channel.priority.toUpperCase()}
                      </Badge>
                      <Switch 
                        checked={channel.enabled} 
                        onCheckedChange={() => toggleChannel(channel.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Delivery Rate</Label>
                      <p className="font-bold text-lg">{channel.deliveryRate}%</p>
                    </div>
                    <div>
                      <Label>Last Used</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {channel.lastUsed ? new Date(channel.lastUsed).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  {channel.config.email && (
                    <div>
                      <Label>Email</Label>
                      <Input value={channel.config.email} readOnly />
                    </div>
                  )}
                  
                  {channel.config.phone && (
                    <div>
                      <Label>Phone</Label>
                      <Input value={channel.config.phone} readOnly />
                    </div>
                  )}
                  
                  {channel.config.endpoint && (
                    <div>
                      <Label>Webhook URL</Label>
                      <Input value={channel.config.endpoint} readOnly />
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rules.map(rule => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority.toUpperCase()}
                      </Badge>
                      <Switch 
                        checked={rule.enabled} 
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Event Type</Label>
                      <p className="font-medium">{rule.eventType.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <Label>Frequency</Label>
                      <p className="font-medium">{rule.frequency.toUpperCase()}</p>
                    </div>
                    <div>
                      <Label>Triggered</Label>
                      <p className="font-bold text-lg">{rule.triggeredCount} times</p>
                    </div>
                    <div>
                      <Label>Channels</Label>
                      <p className="font-medium">{rule.channels.length} active</p>
                    </div>
                  </div>
                  
                  {Object.keys(rule.conditions).length > 0 && (
                    <div>
                      <Label>Conditions</Label>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {rule.conditions.minAmount && (
                          <p>• Minimum amount: ${rule.conditions.minAmount.toLocaleString()}</p>
                        )}
                        {rule.conditions.profitThreshold && (
                          <p>• Profit threshold: {rule.conditions.profitThreshold}%</p>
                        )}
                        {rule.conditions.lossThreshold && (
                          <p>• Loss threshold: {rule.conditions.lossThreshold}%</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Edit Rule
                    </Button>
                    <Button size="sm" variant="outline">
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.eventType.replace('_', ' ').toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject Template</Label>
                    <Input value={template.subject} readOnly />
                  </div>
                  
                  <div>
                    <Label>Message Template</Label>
                    <textarea 
                              value={template.body} 
                              readOnly 
                              rows={3}
                              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                            />
                  </div>
                  
                  <div>
                    <Label>Available Variables</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map(variable => (
                        <Badge key={variable} variant="outline">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Edit Template
                    </Button>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}