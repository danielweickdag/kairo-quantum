'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Play,
  Save,
  Trash2,
  Settings,
  Zap,
  Target,
  Shield,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ArrowRight,
  ArrowDown,
  Copy,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Bot,
  Database,
  BarChart3,
  Workflow
} from 'lucide-react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { WorkflowStep } from '../../../lib/services/workflowAutomationService';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  name: string;
  description: string;
  icon: React.ReactNode;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  isPopular?: boolean;
}

const triggerTypes = [
  {
    id: 'price_change',
    name: 'Price Change',
    description: 'Trigger when asset price changes',
    icon: <TrendingUp className="h-4 w-4" />,
    config: {
      asset: '',
      changeType: 'percentage',
      threshold: 5,
      direction: 'up'
    }
  },
  {
    id: 'time_based',
    name: 'Time Based',
    description: 'Trigger at specific times',
    icon: <Clock className="h-4 w-4" />,
    config: {
      schedule: 'daily',
      time: '09:00',
      timezone: 'UTC'
    }
  },
  {
    id: 'portfolio_value',
    name: 'Portfolio Value',
    description: 'Trigger based on portfolio value',
    icon: <DollarSign className="h-4 w-4" />,
    config: {
      threshold: 10000,
      comparison: 'above'
    }
  },
  {
    id: 'technical_indicator',
    name: 'Technical Indicator',
    description: 'Trigger on technical analysis signals',
    icon: <BarChart3 className="h-4 w-4" />,
    config: {
      indicator: 'rsi',
      value: 70,
      comparison: 'above'
    }
  }
];

const actionTypes = [
  {
    id: 'place_order',
    name: 'Place Order',
    description: 'Execute buy/sell orders',
    icon: <Target className="h-4 w-4" />,
    config: {
      orderType: 'market',
      side: 'buy',
      amount: 100,
      asset: ''
    }
  },
  {
    id: 'send_notification',
    name: 'Send Notification',
    description: 'Send alerts and notifications',
    icon: <Bell className="h-4 w-4" />,
    config: {
      type: 'email',
      message: '',
      recipients: []
    }
  },
  {
    id: 'adjust_risk',
    name: 'Adjust Risk',
    description: 'Modify risk parameters',
    icon: <Shield className="h-4 w-4" />,
    config: {
      riskLevel: 'medium',
      stopLoss: 5,
      takeProfit: 10
    }
  },
  {
    id: 'rebalance_portfolio',
    name: 'Rebalance Portfolio',
    description: 'Automatically rebalance portfolio',
    icon: <Activity className="h-4 w-4" />,
    config: {
      strategy: 'equal_weight',
      threshold: 5
    }
  }
];

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'stop_loss_template',
    name: 'Automatic Stop Loss',
    description: 'Automatically place stop loss orders when positions are opened',
    category: 'Risk Management',
    isPopular: true,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        name: 'Position Opened',
        description: 'Triggers when a new position is opened',
        icon: <Zap className="h-4 w-4" />,
        config: { eventType: 'position:opened' },
        position: { x: 100, y: 100 },
        connections: ['action-1']
      },
      {
        id: 'action-1',
        type: 'action',
        name: 'Place Stop Loss',
        description: 'Places a stop loss order',
        icon: <Shield className="h-4 w-4" />,
        config: { orderType: 'stop_loss', riskPercentage: 2 },
        position: { x: 300, y: 100 },
        connections: []
      }
    ]
  },
  {
    id: 'profit_taking_template',
    name: 'Profit Taking',
    description: 'Take profits at predefined levels',
    category: 'Trading',
    isPopular: true,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        name: 'Profit Target',
        description: 'Triggers when profit target is reached',
        icon: <TrendingUp className="h-4 w-4" />,
        config: { profitPercentage: 10 },
        position: { x: 100, y: 100 },
        connections: ['action-1']
      },
      {
        id: 'action-1',
        type: 'action',
        name: 'Partial Close',
        description: 'Close part of the position',
        icon: <Target className="h-4 w-4" />,
        config: { closePercentage: 50 },
        position: { x: 300, y: 100 },
        connections: []
      }
    ]
  },
  {
    id: 'rebalancing_template',
    name: 'Portfolio Rebalancing',
    description: 'Automatically rebalance portfolio weekly',
    category: 'Portfolio Management',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        name: 'Weekly Schedule',
        description: 'Triggers every Monday at 9 AM',
        icon: <Clock className="h-4 w-4" />,
        config: { schedule: 'weekly', day: 'monday', time: '09:00' },
        position: { x: 100, y: 100 },
        connections: ['action-1']
      },
      {
        id: 'action-1',
        type: 'action',
        name: 'Rebalance',
        description: 'Rebalance portfolio to target allocation',
        icon: <Activity className="h-4 w-4" />,
        config: { strategy: 'target_allocation' },
        position: { x: 300, y: 100 },
        connections: []
      }
    ]
  }
];

export default function WorkflowBuilder() {
  const { createWorkflow, workflowState } = useWorkflow();
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'templates'>('templates');
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback((type: 'trigger' | 'condition' | 'action', template: any) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      name: template.name,
      description: template.description,
      icon: template.icon,
      config: { ...template.config },
      position: { x: 200, y: 200 },
      connections: []
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, config: { ...node.config, ...config } } : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const loadTemplate = useCallback((template: WorkflowTemplate) => {
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    setNodes(template.nodes);
    setActiveTab('builder');
  }, []);

  const saveWorkflow = useCallback(async () => {
    if (!workflowName.trim() || nodes.length === 0) {
      alert('Please provide a workflow name and add at least one node.');
      return;
    }

    const steps: WorkflowStep[] = nodes.map(node => ({
      id: node.id,
      type: node.type,
      name: node.name,
      config: node.config,
      status: 'pending'
    }));

    try {
      await createWorkflow({
        name: workflowName,
        description: workflowDescription,
        isActive: false,
        steps
      });
      
      // Reset form
      setWorkflowName('');
      setWorkflowDescription('');
      setNodes([]);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow. Please try again.');
    }
  }, [workflowName, workflowDescription, nodes, createWorkflow]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap className="h-4 w-4" />;
      case 'condition': return <AlertTriangle className="h-4 w-4" />;
      case 'action': return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'condition': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'action': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Builder</h2>
          <p className="text-gray-600 dark:text-gray-400">Create custom automation workflows with drag-and-drop</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'templates' ? 'default' : 'outline'}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </Button>
          <Button
            variant={activeTab === 'builder' ? 'default' : 'outline'}
            onClick={() => setActiveTab('builder')}
          >
            Builder
          </Button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Template Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Workflow className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    {template.isPopular && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Steps:</span>
                      <span className="font-medium">{template.nodes.length}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => loadTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbox */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Triggers</CardTitle>
                <CardDescription>Start your workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {triggerTypes.map(trigger => (
                  <Button
                    key={trigger.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addNode('trigger', trigger)}
                  >
                    {trigger.icon}
                    <span className="ml-2">{trigger.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
                <CardDescription>What to do</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionTypes.map(action => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addNode('action', action)}
                  >
                    {action.icon}
                    <span className="ml-2">{action.name}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3 space-y-4">
            {/* Workflow Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="Enter workflow name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflow-description">Description</Label>
                    <Input
                      id="workflow-description"
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={saveWorkflow} disabled={!workflowName.trim() || nodes.length === 0}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Workflow
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setWorkflowName('');
                    setWorkflowDescription('');
                    setNodes([]);
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Area */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Canvas</CardTitle>
                <CardDescription>
                  {nodes.length === 0 ? 'Add nodes from the toolbox to start building your workflow' : `${nodes.length} nodes added`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasRef}
                  className="min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 relative bg-gray-50 dark:bg-gray-800"
                >
                  {nodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Drag and drop nodes here to build your workflow</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {nodes.map((node, index) => (
                        <div key={node.id} className="flex items-center space-x-4">
                          <div className={`p-4 rounded-lg border-2 ${getNodeColor(node.type)} min-w-[200px]`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getNodeIcon(node.type)}
                                <span className="font-medium">{node.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedNode(node);
                                    setIsConfigDialogOpen(true);
                                  }}
                                >
                                  <Settings className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNode(node.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs opacity-75">{node.description}</p>
                          </div>
                          {index < nodes.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Node Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedNode?.name}</DialogTitle>
            <DialogDescription>
              Customize the settings for this workflow step
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <div className="space-y-4">
              {Object.entries(selectedNode.config).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  {typeof value === 'boolean' ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          updateNodeConfig(selectedNode.id, { [key]: checked })
                        }
                      />
                      <span className="text-sm">{value ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  ) : typeof value === 'number' ? (
                    <Input
                      id={key}
                      type="number"
                      value={value}
                      onChange={(e) => 
                        updateNodeConfig(selectedNode.id, { [key]: parseFloat(e.target.value) || 0 })
                      }
                    />
                  ) : (
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => 
                        updateNodeConfig(selectedNode.id, { [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsConfigDialogOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}