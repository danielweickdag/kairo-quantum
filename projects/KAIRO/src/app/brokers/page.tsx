'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import AppLayout from '@/components/layouts/AppLayout';
import {
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

interface BrokerConnection {
  id: string;
  brokerType: string;
  accountName: string;
  isActive: boolean;
  isConnected: boolean;
  lastSyncAt: string | null;
  environment: 'sandbox' | 'production';
  createdAt: string;
  updatedAt: string;
}

interface SupportedBroker {
  type: string;
  name: string;
  description: string;
  logoUrl: string;
  isEnabled: boolean;
  capabilities: {
    supportsStocks: boolean;
    supportsOptions: boolean;
    supportsCrypto: boolean;
    supportsForex: boolean;
    supportsFractionalShares: boolean;
    supportsMarginTrading: boolean;
    supportsShortSelling: boolean;
    supportsRealTimeData: boolean;
    supportsHistoricalData: boolean;
    supportsOrderTypes: string[];
    commissionStructure: {
      stocks: number;
      crypto: number;
    };
  };
  authConfig: {
    requiresApiKey: boolean;
    requiresApiSecret: boolean;
    requiresAccessToken: boolean;
    supportsSandbox: boolean;
    documentationUrl: string;
  };
}

export default function BrokersPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<BrokerConnection[]>([]);
  const [supportedBrokers, setSupportedBrokers] = useState<SupportedBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<SupportedBroker | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [syncingConnection, setSyncingConnection] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
    fetchSupportedBrokers();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/brokers/connections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnections(data.data);
      } else {
        toast.error('Failed to fetch broker connections');
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to fetch broker connections');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportedBrokers = async () => {
    try {
      const response = await fetch('/api/brokers/supported');
      
      if (response.ok) {
        const data = await response.json();
        setSupportedBrokers(data.data);
      }
    } catch (error) {
      console.error('Error fetching supported brokers:', error);
    }
  };

  const testConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);
    try {
      const response = await fetch(`/api/brokers/connections/${connectionId}/test`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Connection test successful!');
        fetchConnections(); // Refresh to get updated status
      } else {
        toast.error(data.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Failed to test connection');
    } finally {
      setTestingConnection(null);
    }
  };

  const syncAccount = async (connectionId: string) => {
    setSyncingConnection(connectionId);
    try {
      const response = await fetch(`/api/brokers/connections/${connectionId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Account data synced successfully!');
        fetchConnections(); // Refresh to get updated status
      } else {
        toast.error(data.error || 'Failed to sync account data');
      }
    } catch (error) {
      console.error('Error syncing account:', error);
      toast.error('Failed to sync account data');
    } finally {
      setSyncingConnection(null);
    }
  };

  const toggleConnectionStatus = async (connectionId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/brokers/connections/${connectionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Connection ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchConnections();
      } else {
        toast.error(data.error || 'Failed to update connection status');
      }
    } catch (error) {
      console.error('Error updating connection status:', error);
      toast.error('Failed to update connection status');
    }
  };

  const deleteConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to delete this broker connection? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/brokers/connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Broker connection deleted successfully');
        fetchConnections();
      } else {
        toast.error(data.error || 'Failed to delete connection');
      }
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast.error('Failed to delete connection');
    }
  };

  const getStatusIcon = (connection: BrokerConnection) => {
    if (!connection.isActive) {
      return <XCircle className="h-5 w-5 text-gray-400" />;
    }
    if (connection.isConnected) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = (connection: BrokerConnection) => {
    if (!connection.isActive) return 'Inactive';
    if (connection.isConnected) return 'Connected';
    return 'Disconnected';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Broker Connections
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Connect your brokerage accounts to enable live trading and portfolio sync
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </button>
          </div>
        </div>

        {/* Connections Grid */}
        {connections.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No broker connections
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Connect your first brokerage account to start live trading
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(connection)}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {connection.accountName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {connection.brokerType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => testConnection(connection.id)}
                      disabled={testingConnection === connection.id}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Test Connection"
                    >
                      {testingConnection === connection.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteConnection(connection.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete Connection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`font-medium ${
                      connection.isActive && connection.isConnected
                        ? 'text-green-600 dark:text-green-400'
                        : connection.isActive
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {getStatusText(connection)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Environment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      connection.environment === 'production'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {connection.environment}
                    </span>
                  </div>
                  {connection.lastSyncAt && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500 dark:text-gray-400">Last Sync:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(connection.lastSyncAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => toggleConnectionStatus(connection.id, !connection.isActive)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                      connection.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                    }`}
                  >
                    {connection.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => syncAccount(connection.id)}
                    disabled={!connection.isActive || syncingConnection === connection.id}
                    className="flex-1 px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {syncingConnection === connection.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      'Sync'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Connection Modal */}
        {showAddModal && (
          <AddConnectionModal
            supportedBrokers={supportedBrokers}
            onClose={() => {
              setShowAddModal(false);
              setSelectedBroker(null);
            }}
            onSuccess={() => {
              setShowAddModal(false);
              setSelectedBroker(null);
              fetchConnections();
            }}
          />
        )}
        </div>
      </div>
    </AppLayout>
  );
}

// Add Connection Modal Component
interface AddConnectionModalProps {
  supportedBrokers: SupportedBroker[];
  onClose: () => void;
  onSuccess: () => void;
}

function AddConnectionModal({ supportedBrokers, onClose, onSuccess }: AddConnectionModalProps) {
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedBroker, setSelectedBroker] = useState<SupportedBroker | null>(null);
  const [formData, setFormData] = useState({
    accountName: '',
    apiKey: '',
    apiSecret: '',
    environment: 'sandbox' as 'sandbox' | 'production',
    accountId: '',
    accessToken: '',
    refreshToken: ''
  });
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBrokerSelect = (broker: SupportedBroker) => {
    setSelectedBroker(broker);
    setStep('configure');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBroker) return;

    setLoading(true);
    try {
      const response = await fetch('/api/brokers/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          brokerType: selectedBroker.type,
          accountName: formData.accountName,
          credentials: {
            apiKey: formData.apiKey,
            apiSecret: formData.apiSecret,
            environment: formData.environment,
            accountId: formData.accountId || undefined,
            accessToken: formData.accessToken || undefined,
            refreshToken: formData.refreshToken || undefined
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Broker connection created successfully!');
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to create broker connection');
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Failed to create broker connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 'select' ? 'Select Broker' : `Configure ${selectedBroker?.name}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {step === 'select' ? (
            <div className="space-y-4">
              {supportedBrokers.map((broker) => (
                <div
                  key={broker.type}
                  onClick={() => handleBrokerSelect(broker)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                          {broker.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {broker.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {broker.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {broker.isEnabled ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-full text-xs font-medium">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {broker.capabilities.supportsStocks && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                        Stocks
                      </span>
                    )}
                    {broker.capabilities.supportsCrypto && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">
                        Crypto
                      </span>
                    )}
                    {broker.capabilities.supportsOptions && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded text-xs">
                        Options
                      </span>
                    )}
                    {broker.capabilities.supportsForex && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                        Forex
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="My Trading Account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Environment
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value as 'sandbox' | 'production' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="sandbox">Sandbox (Paper Trading)</option>
                  <option value="production">Production (Live Trading)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your API Key"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Secret
                </label>
                <div className="relative">
                  <input
                    type={showApiSecret ? 'text' : 'password'}
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your API Secret"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showApiSecret ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {selectedBroker?.authConfig.requiresAccessToken && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Token (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.accessToken}
                    onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your Access Token"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your Account ID"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExternalLink className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Need API credentials?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>
                        Visit the{' '}
                        <a
                          href={selectedBroker?.authConfig.documentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-600 dark:hover:text-blue-200"
                        >
                          {selectedBroker?.name} documentation
                        </a>{' '}
                        to learn how to generate your API credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Connection'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}