'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bell,
  BellRing,
  Settings,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
  Info
} from 'lucide-react';
import { alertService, AlertPreferences, Alert, AlertTemplate, AlertCategory } from '@/services/alertService';
import { toast } from 'react-hot-toast';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
}

export default function AlertSettingsModal({ isOpen, onClose, trigger }: AlertSettingsModalProps) {
  const [preferences, setPreferences] = useState<AlertPreferences | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [templates, setTemplates] = useState<AlertTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('preferences');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newAlertSymbol, setNewAlertSymbol] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const prefs = alertService.getPreferences();
    const userAlerts = alertService.getAlerts();
    const alertTemplates = alertService.getTemplates();
    
    setPreferences(prefs);
    setAlerts(userAlerts);
    setTemplates(alertTemplates);
  };

  const updatePreference = (key: keyof AlertPreferences, value: any) => {
    if (preferences) {
      const updated = { ...preferences, [key]: value };
      setPreferences(updated);
      alertService.updatePreferences({ [key]: value });
    }
  };

  const updateQuietHours = (field: 'enabled' | 'startTime' | 'endTime', value: any) => {
    if (preferences) {
      const updated = {
        ...preferences,
        quietHours: {
          ...preferences.quietHours,
          [field]: value
        }
      };
      setPreferences(updated);
      alertService.updatePreferences({ quietHours: updated.quietHours });
    }
  };

  const createAlertFromTemplate = () => {
    if (!selectedTemplate || !newAlertSymbol) {
      toast.error('Please select a template and enter a symbol');
      return;
    }

    const alert = alertService.createAlertFromTemplate(selectedTemplate, newAlertSymbol, {});
    if (alert) {
      setAlerts(prev => [...prev, alert]);
      setNewAlertSymbol('');
      setSelectedTemplate('');
      toast.success('Alert created successfully!');
    } else {
      toast.error('Failed to create alert');
    }
  };

  const deleteAlert = (alertId: string) => {
    alertService.deleteAlert(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alert deleted');
  };

  const toggleAlert = (alertId: string) => {
    alertService.toggleAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price': return <TrendingUp className="h-4 w-4" />;
      case 'portfolio': return <DollarSign className="h-4 w-4" />;
      case 'trading': return <TrendingDown className="h-4 w-4" />;
      case 'risk': return <Shield className="h-4 w-4" />;
      case 'news': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!preferences) return null;

  const modalContent = (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Alert Settings</span>
        </DialogTitle>
        <DialogDescription>
          Configure your notification preferences and manage your alerts
        </DialogDescription>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="alerts">My Alerts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Channels</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <div>
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-gray-500">Browser notifications</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => updatePreference('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-green-500" />
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-gray-500">Email alerts</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <div>
                    <Label className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-xs text-gray-500">Text message alerts</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => updatePreference('smsNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
              <CardDescription>
                Configure which types of alerts you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Trading Alerts</Label>
                  <Switch
                    checked={preferences.tradingAlerts}
                    onCheckedChange={(checked) => updatePreference('tradingAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Price Alerts</Label>
                  <Switch
                    checked={preferences.priceAlerts}
                    onCheckedChange={(checked) => updatePreference('priceAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Portfolio Alerts</Label>
                  <Switch
                    checked={preferences.portfolioAlerts}
                    onCheckedChange={(checked) => updatePreference('portfolioAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">News Alerts</Label>
                  <Switch
                    checked={preferences.newsAlerts}
                    onCheckedChange={(checked) => updatePreference('newsAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">System Alerts</Label>
                  <Switch
                    checked={preferences.systemAlerts}
                    onCheckedChange={(checked) => updatePreference('systemAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Sound Enabled</Label>
                  <Switch
                    checked={preferences.soundEnabled}
                    onCheckedChange={(checked) => updatePreference('soundEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Timing Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Alert Frequency</Label>
                <Select
                  value={preferences.alertFrequency}
                  onValueChange={(value: 'immediate' | 'hourly' | 'daily') => updatePreference('alertFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Summary</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Quiet Hours</Label>
                  <Switch
                    checked={preferences.quietHours.enabled}
                    onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
                  />
                </div>
                {preferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Start Time</Label>
                      <Input
                        type="time"
                        value={preferences.quietHours.startTime}
                        onChange={(e) => updateQuietHours('startTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Time</Label>
                      <Input
                        type="time"
                        value={preferences.quietHours.endTime}
                        onChange={(e) => updateQuietHours('endTime', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts ({alerts.filter(a => a.isActive).length})</CardTitle>
              <CardDescription>
                Manage your personal alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as AlertCategory | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="price">Price Alerts</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="technical">Technical Analysis</option>
                  <option value="trading">Trading</option>
                  <option value="risk">Risk Management</option>
                  <option value="news">News</option>
                </select>
              </div>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No alerts configured yet</p>
                  <p className="text-sm text-gray-400">Create your first alert using templates</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.filter(alert => {
                     const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       alert.message.toLowerCase().includes(searchTerm.toLowerCase());
                     const matchesCategory = selectedCategory === 'all' || alert.category === selectedCategory;
                     return matchesSearch && matchesCategory;
                   }).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${alert.isActive ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getPriorityColor(alert.priority)}>
                                {alert.priority}
                              </Badge>
                              <Badge variant="outline">{alert.type}</Badge>
                              {alert.symbol && (
                                <Badge variant="secondary">{alert.symbol}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={() => toggleAlert(alert.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>
                Use pre-built templates to quickly create alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Input
                    placeholder="e.g., AAPL, BTC"
                    value={newAlertSymbol}
                    onChange={(e) => setNewAlertSymbol(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <Button onClick={createAlertFromTemplate} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as AlertCategory | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="price">Price Alerts</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="technical">Technical Analysis</option>
                  <option value="trading">Trading</option>
                  <option value="risk">Risk Management</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div className="grid gap-4">
                {templates.filter(template => {
                   const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     template.description.toLowerCase().includes(searchTerm.toLowerCase());
                   const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
                   return matchesSearch && matchesCategory;
                 }).map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <Badge variant="outline" className="mt-1">{template.type}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {modalContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {modalContent}
    </Dialog>
  );
}