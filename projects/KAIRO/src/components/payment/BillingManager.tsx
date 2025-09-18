'use client';

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Receipt,
  Shield,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Star,
  Award,
  Crown,
  Zap,
  Target,
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Settings,
  Bell,
  Info,
  HelpCircle,
  FileText,
  Archive,
  Filter,
  Search,
  SortDesc,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
  bankName?: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  planName: string;
  billingPeriod: string;
  downloadUrl?: string;
}

interface BillingAddress {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  cost: number;
}

const BillingManager: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-2024-001',
      date: '2024-01-01',
      dueDate: '2024-01-01',
      amount: 49.00,
      status: 'paid',
      planName: 'Pro Trader',
      billingPeriod: 'Monthly',
      downloadUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: '2',
      number: 'INV-2024-002',
      date: '2024-02-01',
      dueDate: '2024-02-01',
      amount: 49.00,
      status: 'paid',
      planName: 'Pro Trader',
      billingPeriod: 'Monthly',
      downloadUrl: '/invoices/INV-2024-002.pdf'
    },
    {
      id: '3',
      number: 'INV-2024-003',
      date: '2024-03-01',
      dueDate: '2024-03-01',
      amount: 49.00,
      status: 'pending',
      planName: 'Pro Trader',
      billingPeriod: 'Monthly'
    }
  ]);

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'ACME Trading LLC',
    address1: '123 Trading Street',
    address2: 'Suite 456',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States'
  });

  const [usageMetrics] = useState<UsageMetric[]>([
    { name: 'Copy Trades', current: 15, limit: 25, unit: 'trades', cost: 0 },
    { name: 'AI Analysis', current: 45, limit: -1, unit: 'requests', cost: 0 },
    { name: 'API Calls', current: 2500, limit: 10000, unit: 'calls', cost: 0 },
    { name: 'Data Storage', current: 2.5, limit: 10, unit: 'GB', cost: 0 }
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAddPaymentMethod = async (method: Partial<PaymentMethod>) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        isDefault: paymentMethods.length === 0,
        ...method
      } as PaymentMethod;
      
      setPaymentMethods(prev => [...prev, newMethod]);
      setShowAddPayment(false);
    } catch (error) {
      logger.error('Failed to add payment method', error, 'BillingManager');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetDefaultPayment = async (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Simulate download
    logger.info(`Downloading invoice: ${invoice.number}`, 'BillingManager');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return CreditCard;
      case 'bank': return Building;
      case 'paypal': return Globe;
      default: return CreditCard;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Billing Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="text-xl font-bold">Pro Trader</p>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Monthly Cost</p>
                  <p className="text-xl font-bold">$49.00</p>
                  <p className="text-sm text-gray-600">Next billing: Mar 1, 2024</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">•••• 4242</span>
                  </div>
                  <p className="text-sm text-gray-600">Visa expires 12/25</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usageMetrics.map((metric, index) => {
                  const percentage = metric.limit === -1 ? 0 : (metric.current / metric.limit) * 100;
                  const isUnlimited = metric.limit === -1;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-sm text-gray-600">
                          {metric.current} {isUnlimited ? '' : `/ ${metric.limit}`} {metric.unit}
                        </span>
                      </div>
                      {!isUnlimited && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all",
                              percentage < 70 ? "bg-green-500" : 
                              percentage < 90 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      )}
                      {isUnlimited && (
                        <Badge variant="outline" className="text-xs">
                          Unlimited
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Recent Invoices
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-gray-600">{formatDate(invoice.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                        <Badge className={cn('text-white text-xs', getStatusColor(invoice.status))}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </div>
                      {invoice.downloadUrl && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button onClick={() => setShowAddPayment(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = getPaymentMethodIcon(method.type);
                  
                  return (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          {method.type === 'card' && (
                            <>
                              <p className="font-medium">
                                {method.brand} •••• {method.last4}
                              </p>
                              <p className="text-sm text-gray-600">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </>
                          )}
                          {method.type === 'paypal' && (
                            <>
                              <p className="font-medium">PayPal</p>
                              <p className="text-sm text-gray-600">{method.email}</p>
                            </>
                          )}
                          {method.type === 'bank' && (
                            <>
                              <p className="font-medium">{method.bankName}</p>
                              <p className="text-sm text-gray-600">•••• {method.last4}</p>
                            </>
                          )}
                        </div>
                        {method.isDefault && (
                          <Badge className="bg-blue-500">Default</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSetDefaultPayment(method.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          disabled={method.isDefault && paymentMethods.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Billing History</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Receipt className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-gray-600">
                          {invoice.planName} - {invoice.billingPeriod}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                        <Badge className={cn('text-white text-xs', getStatusColor(invoice.status))}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {invoice.downloadUrl && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Billing Address */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Billing Address</CardTitle>
                <Button variant="outline" onClick={() => setShowEditAddress(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{billingAddress.name}</p>
                  {billingAddress.company && (
                    <p className="text-sm text-gray-600">{billingAddress.company}</p>
                  )}
                  <p className="text-sm text-gray-600">{billingAddress.email}</p>
                  {billingAddress.phone && (
                    <p className="text-sm text-gray-600">{billingAddress.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{billingAddress.address1}</p>
                  {billingAddress.address2 && (
                    <p className="text-sm text-gray-600">{billingAddress.address2}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">{billingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Invoices</p>
                  <p className="text-sm text-gray-600">Receive invoices via email</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-pay</p>
                  <p className="text-sm text-gray-600">Automatically pay invoices</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Usage Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when approaching limits</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input placeholder="John Doe" />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => handleAddPaymentMethod({
                    type: 'card',
                    last4: '3456',
                    brand: 'Mastercard',
                    expiryMonth: 12,
                    expiryYear: 2026
                  })}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing && <RefreshCw className="h-4 w-4 animate-spin mr-2" />}
                  Add Card
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BillingManager;
export type { PaymentMethod, Invoice, BillingAddress, UsageMetric };