'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle, Clock, Zap, Settings, Plus, Trash2, Edit, Activity, Webhook, CreditCard, RefreshCw, Bell, Workflow } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Interfaces
interface WebhookLog {
  id: string;
  provider: 'stripe' | 'paypal';
  eventType: string;
  eventId: string;
  status: 'received' | 'processed' | 'failed';
  timestamp: Date;
  payload: any;
  error?: string;
  automationRulesTriggered: string[];
}

interface AutomationRule {
  id: string;
  name?: string;
  eventType: string;
  conditions: Record<string, any>;
  actions: {
    type: 'retry_payment' | 'send_notification' | 'update_subscription' | 'trigger_workflow';
    parameters: Record<string, any>;
  }[];
  isActive: boolean;
}

interface WebhookStats {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  automationRulesTriggered: number;
  lastEventTime?: string;
}

const WebhookAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [stats, setStats] = useState<WebhookStats>({
    totalEvents: 0,
    successfulEvents: 0,
    failedEvents: 0,
    automationRulesTriggered: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    eventType: '',
    conditions: {},
    actions: [],
    isActive: true
  });

  // Fetch webhook logs
  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedProvider !== 'all') params.append('provider', selectedProvider);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      params.append('limit', '100');
      
      const response = await fetch(`/api/webhooks/logs?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
        
        // Calculate stats
        const totalEvents = data.data.length;
        const successfulEvents = data.data.filter((log: any) => log.status === 'processed').length;
        const failedEvents = data.data.filter((log: any) => log.status === 'failed').length;
        const automationRulesTriggered = data.data.reduce((sum: number, log: any) => 
          sum + (log.automationRulesTriggered?.length || 0), 0
        );
        const lastEventTime = data.data[0]?.timestamp;
        
        setStats({
          totalEvents,
          successfulEvents,
          failedEvents,
          automationRulesTriggered,
          lastEventTime
        });
      }
    } catch (error) {
      console.error('Error fetching webhook logs:', error);
      toast.error('Failed to fetch webhook logs');
    }
  };

  // Fetch automation rules
  const fetchAutomationRules = async () => {
    try {
      const response = await fetch('/api/webhooks/automation-rules');
      const data = await response.json();
      
      if (data.success) {
        setAutomationRules(data.data);
      }
    } catch (error) {
      console.error('Error fetching automation rules:', error);
      toast.error('Failed to fetch automation rules');
    }
  };

  // Create automation rule
  const createAutomationRule = async () => {
    try {
      const response = await fetch('/api/webhooks/automation-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAutomationRules([...automationRules, data.data]);
        setNewRule({ eventType: '', conditions: {}, actions: [], isActive: true });
        setIsCreateRuleOpen(false);
        toast.success('Automation rule created successfully');
      } else {
        toast.error('Failed to create automation rule');
      }
    } catch (error) {
      console.error('Error creating automation rule:', error);
      toast.error('Failed to create automation rule');
    }
  };

  // Update automation rule
  const updateAutomationRule = async (ruleId: string, updates: Partial<AutomationRule>) => {
    try {
      const response = await fetch(`/api/webhooks/automation-rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAutomationRules(automationRules.map(rule => 
          rule.id === ruleId ? data.data : rule
        ));
        toast.success('Automation rule updated successfully');
      } else {
        toast.error('Failed to update automation rule');
      }
    } catch (error) {
      console.error('Error updating automation rule:', error);
      toast.error('Failed to update automation rule');
    }
  };

  // Delete automation rule
  const deleteAutomationRule = async (ruleId: string) => {
    try {
      const response = await fetch(`/api/webhooks/automation-rules/${ruleId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAutomationRules(automationRules.filter(rule => rule.id !== ruleId));
        toast.success('Automation rule deleted successfully');
      } else {
        toast.error('Failed to delete automation rule');
      }
    } catch (error) {
      console.error('Error deleting automation rule:', error);
      toast.error('Failed to delete automation rule');
    }
  };

  // Toggle rule active status
  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    await updateAutomationRule(ruleId, { isActive });
  };

  // Add action to new rule
  const addActionToNewRule = () => {
    setNewRule({
      ...newRule,
      actions: [
        ...(newRule.actions || []),
        { type: 'send_notification', parameters: {} }
      ]
    });
  };

  // Remove action from new rule
  const removeActionFromNewRule = (index: number) => {
    const actions = [...(newRule.actions || [])];
    actions.splice(index, 1);
    setNewRule({ ...newRule, actions });
  };

  // Update action in new rule
  const updateActionInNewRule = (index: number, updates: any) => {
    const actions = [...(newRule.actions || [])];
    actions[index] = { ...actions[index], ...updates };
    setNewRule({ ...newRule, actions });
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLogs(), fetchAutomationRules()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [selectedProvider, selectedStatus]);

  // Auto-refresh logs every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [selectedProvider, selectedStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'received': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'stripe': return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'paypal': return <Webhook className="h-4 w-4 text-blue-600" />;
      default: return <Webhook className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'retry_payment': return <RefreshCw className="h-4 w-4" />;
      case 'send_notification': return <Bell className="h-4 w-4" />;
      case 'update_subscription': return <Settings className="h-4 w-4" />;
      case 'trigger_workflow': return <Workflow className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhook Automation</h1>
          <p className="text-muted-foreground">Automate payment events and subscription management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Automation Rule</DialogTitle>
                <DialogDescription>
                  Create a new automation rule to handle webhook events automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={newRule.eventType} onValueChange={(value) => setNewRule({ ...newRule, eventType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice.payment_failed">Payment Failed</SelectItem>
                      <SelectItem value="invoice.payment_succeeded">Payment Succeeded</SelectItem>
                      <SelectItem value="customer.subscription.created">Subscription Created</SelectItem>
                      <SelectItem value="customer.subscription.updated">Subscription Updated</SelectItem>
                      <SelectItem value="customer.subscription.deleted">Subscription Cancelled</SelectItem>
                      <SelectItem value="invoice.created">Invoice Created</SelectItem>
                      <SelectItem value="charge.dispute.created">Chargeback Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="conditions">Conditions (JSON)</Label>
                  <Textarea
                    placeholder='{"attempt_count": {"$lt": 3}}'
                    value={JSON.stringify(newRule.conditions, null, 2)}
                    onChange={(e) => {
                      try {
                        const conditions = JSON.parse(e.target.value || '{}');
                        setNewRule({ ...newRule, conditions });
                      } catch (error) {
                        // Invalid JSON, keep the text for editing
                      }
                    }}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Actions</Label>
                    <Button type="button" onClick={addActionToNewRule} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Action
                    </Button>
                  </div>
                  
                  {newRule.actions?.map((action, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Select 
                          value={action.type} 
                          onValueChange={(value) => updateActionInNewRule(index, { type: value })}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retry_payment">Retry Payment</SelectItem>
                            <SelectItem value="send_notification">Send Notification</SelectItem>
                            <SelectItem value="update_subscription">Update Subscription</SelectItem>
                            <SelectItem value="trigger_workflow">Trigger Workflow</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={() => removeActionFromNewRule(index)} 
                          size="sm" 
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Textarea
                        placeholder='{"delay_hours": 24, "max_retries": 3}'
                        value={JSON.stringify(action.parameters, null, 2)}
                        onChange={(e) => {
                          try {
                            const parameters = JSON.parse(e.target.value || '{}');
                            updateActionInNewRule(index, { parameters });
                          } catch (error) {
                            // Invalid JSON, keep the text for editing
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={newRule.isActive} 
                    onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateRuleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createAutomationRule}>
                    Create Rule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-500">{stats.successfulEvents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-500">{stats.failedEvents}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Automations</p>
                <p className="text-2xl font-bold text-purple-500">{stats.automationRulesTriggered}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Event Logs</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Webhook Events</CardTitle>
              <CardDescription>
                Monitor incoming webhook events and their processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No webhook events found
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getProviderIcon(log.provider)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{log.eventType}</span>
                            {getStatusIcon(log.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.eventId} • {log.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {log.automationRulesTriggered.length > 0 && (
                          <Badge variant="secondary">
                            {log.automationRulesTriggered.length} rules triggered
                          </Badge>
                        )}
                        
                        <Badge variant={log.status === 'processed' ? 'default' : log.status === 'failed' ? 'destructive' : 'secondary'}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Configure automated responses to webhook events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No automation rules configured
                  </div>
                ) : (
                  automationRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{rule.name || rule.eventType}</span>
                            <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Event: {rule.eventType}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={rule.isActive} 
                            onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingRule(rule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteAutomationRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Actions:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {rule.actions.map((action, index) => (
                              <div key={index} className="flex items-center space-x-1 bg-muted rounded px-2 py-1">
                                {getActionIcon(action.type)}
                                <span className="text-sm">{action.type.replace('_', ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {Object.keys(rule.conditions).length > 0 && (
                          <div>
                            <span className="text-sm font-medium">Conditions:</span>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(rule.conditions, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure webhook endpoints and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Stripe Configuration</h3>
                  <div>
                    <Label htmlFor="stripeWebhookUrl">Webhook URL</Label>
                    <Input 
                      id="stripeWebhookUrl" 
                      value="https://api.kairo.com/webhooks/stripe" 
                      readOnly 
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeWebhookSecret">Webhook Secret</Label>
                    <Input 
                      id="stripeWebhookSecret" 
                      type="password" 
                      placeholder="whsec_..." 
                      value="••••••••••••••••"
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Configure this URL in your Stripe dashboard to receive webhook events.
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">PayPal Configuration</h3>
                  <div>
                    <Label htmlFor="paypalWebhookUrl">Webhook URL</Label>
                    <Input 
                      id="paypalWebhookUrl" 
                      value="https://api.kairo.com/webhooks/paypal" 
                      readOnly 
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paypalWebhookId">Webhook ID</Label>
                    <Input 
                      id="paypalWebhookId" 
                      placeholder="WH-..." 
                      value="••••••••••••••••"
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Configure this URL in your PayPal developer dashboard.
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Supported Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Stripe Events</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• invoice.payment_failed</li>
                      <li>• invoice.payment_succeeded</li>
                      <li>• customer.subscription.created</li>
                      <li>• customer.subscription.updated</li>
                      <li>• customer.subscription.deleted</li>
                      <li>• charge.dispute.created</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">PayPal Events</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• PAYMENT.SALE.COMPLETED</li>
                      <li>• PAYMENT.SALE.DENIED</li>
                      <li>• BILLING.SUBSCRIPTION.CREATED</li>
                      <li>• BILLING.SUBSCRIPTION.CANCELLED</li>
                      <li>• CUSTOMER.DISPUTE.CREATED</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhookAutomation;