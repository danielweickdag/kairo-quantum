'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Loader2, CreditCard, Shield, CheckCircle, AlertCircle, Banknote, Plus, Trash2 } from 'lucide-react';
import { bankAccountIntegrationService, BankAccount, PlaidLinkResult } from '../../services/BankAccountIntegrationService';
import { automatedDepositWithdrawService, AutomatedWorkflowConfig } from '../../services/AutomatedDepositWithdrawService';
import { logger } from '../../lib/logger';

interface BankAccountConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'deposit' | 'withdrawal';
  onSuccess?: (account: BankAccount, workflow?: AutomatedWorkflowConfig) => void;
  defaultAmount?: number;
}

interface PlaidLinkProps {
  linkToken: string;
  onSuccess: (publicToken: string, metadata: PlaidLinkResult['metadata']) => void;
  onExit: () => void;
}

// Mock Plaid Link component (replace with actual Plaid Link in production)
const PlaidLink: React.FC<PlaidLinkProps> = ({ linkToken, onSuccess, onExit }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate Plaid Link flow
    setTimeout(() => {
      const mockResult = {
        publicToken: 'public-sandbox-' + Math.random().toString(36).substr(2, 9),
        metadata: {
          institution: {
            name: 'Chase Bank',
            institution_id: 'ins_3'
          },
          accounts: [
            {
              id: 'acc_' + Math.random().toString(36).substr(2, 9),
              name: 'Chase Checking',
              type: 'depository',
              subtype: 'checking',
              mask: '0000'
            }
          ]
        }
      };
      onSuccess(mockResult.publicToken, mockResult.metadata);
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <Banknote className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Connect Your Bank Account</h3>
        <p className="text-gray-600 text-center mb-6">
          Securely connect your bank account using our encrypted connection
        </p>
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Connect Bank Account
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const BankAccountConnectionModal: React.FC<BankAccountConnectionModalProps> = ({
  isOpen,
  onClose,
  actionType,
  onSuccess,
  defaultAmount = 500
}) => {
  const [step, setStep] = useState<'select' | 'connect' | 'configure' | 'success'>('select');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [linkToken, setLinkToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Workflow configuration
  const [amount, setAmount] = useState(defaultAmount);
  const [createWorkflow, setCreateWorkflow] = useState(false);
  const [workflowFrequency, setWorkflowFrequency] = useState<'manual' | 'daily' | 'weekly' | 'monthly'>('manual');
  const [workflowConditions, setWorkflowConditions] = useState({
    minBalance: '',
    maxBalance: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadBankAccounts();
    }
  }, [isOpen]);

  const loadBankAccounts = async () => {
    try {
      setIsLoading(true);
      const accounts = await bankAccountIntegrationService.getBankAccounts();
      setBankAccounts(accounts);
      
      if (accounts.length === 0) {
        setStep('connect');
        await initializePlaidLink();
      } else {
        setStep('select');
      }
    } catch (error) {
      logger.error('Error loading bank accounts:', error);
      setError('Failed to load bank accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const initializePlaidLink = async () => {
    try {
      const { linkToken } = await bankAccountIntegrationService.initializePlaidLink();
      setLinkToken(linkToken);
    } catch (error) {
      logger.error('Error initializing Plaid Link:', error);
      setError('Failed to initialize bank connection');
    }
  };

  const handlePlaidSuccess = async (publicToken: string, metadata: PlaidLinkResult['metadata']) => {
    try {
      setIsLoading(true);
      const newAccounts = await bankAccountIntegrationService.connectBankAccount(publicToken, metadata);
      setBankAccounts(prev => [...prev, ...newAccounts]);
      setSelectedAccount(newAccounts[0]);
      setStep('configure');
    } catch (error) {
      logger.error('Error connecting bank account:', error);
      setError('Failed to connect bank account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = (account: BankAccount) => {
    setSelectedAccount(account);
    setStep('configure');
  };

  const handleExecuteAction = async () => {
    if (!selectedAccount) return;

    try {
      setIsLoading(true);
      
      let workflow: AutomatedWorkflowConfig | undefined;
      
      if (createWorkflow) {
        workflow = await automatedDepositWithdrawService.createAutomatedWorkflow({
          type: actionType,
          bankAccountId: selectedAccount.id,
          amount,
          frequency: workflowFrequency,
          conditions: {
            minBalance: workflowConditions.minBalance ? parseFloat(workflowConditions.minBalance) : undefined,
            maxBalance: workflowConditions.maxBalance ? parseFloat(workflowConditions.maxBalance) : undefined
          }
        });
      }

      const request = {
        type: actionType,
        amount,
        bankAccountId: selectedAccount.id,
        saveAsWorkflow: createWorkflow,
        workflowConfig: workflow
      };

      if (actionType === 'deposit') {
        await automatedDepositWithdrawService.handleQuickDeposit(request);
      } else {
        await automatedDepositWithdrawService.handleQuickWithdraw(request);
      }

      setStep('success');
      onSuccess?.(selectedAccount, workflow);
    } catch (error) {
      logger.error(`Error executing ${actionType}:`, error);
      setError(`Failed to execute ${actionType}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      await bankAccountIntegrationService.removeBankAccount(accountId);
      setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (error) {
      logger.error('Error removing bank account:', error);
      setError('Failed to remove bank account');
    }
  };

  const renderSelectStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Select Bank Account for {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
        </h3>
        <p className="text-gray-600">
          Choose which bank account to use for this transaction
        </p>
      </div>

      <div className="space-y-3">
        {bankAccounts.map((account) => (
          <Card 
            key={account.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAccount?.id === account.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleAccountSelect(account)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{account.institutionName}</p>
                  <p className="text-sm text-gray-600">
                    {account.accountName} ••••{account.mask}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {account.isVerified ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAccount(account.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => {
          setStep('connect');
          initializePlaidLink();
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Bank Account
      </Button>
    </div>
  );

  const renderConnectStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Secure Bank Connection</h3>
        <p className="text-gray-600">
          Your bank credentials are encrypted and never stored on our servers
        </p>
      </div>

      {linkToken && (
        <PlaidLink
          linkToken={linkToken}
          onSuccess={handlePlaidSuccess}
          onExit={() => setStep('select')}
        />
      )}

      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          256-bit SSL
        </div>
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          Bank-level Security
        </div>
      </div>
    </div>
  );

  const renderConfigureStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Configure {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
        </h3>
        <p className="text-gray-600">
          Set up your transaction details and automation preferences
        </p>
      </div>

      {selectedAccount && (
        <Card>
          <CardContent className="flex items-center space-x-3 p-4">
            <CreditCard className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">{selectedAccount.institutionName}</p>
              <p className="text-sm text-gray-600">
                {selectedAccount.accountName} ••••{selectedAccount.mask}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="1"
            step="0.01"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="create-workflow"
            checked={createWorkflow}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateWorkflow(e.target.checked)}
          />
          <Label htmlFor="create-workflow">
            Create automated workflow for future transactions
          </Label>
        </div>

        {createWorkflow && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={workflowFrequency} onValueChange={(value: any) => setWorkflowFrequency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-balance">Min Balance Trigger ($)</Label>
                <Input
                  id="min-balance"
                  type="number"
                  value={workflowConditions.minBalance}
                  onChange={(e) => setWorkflowConditions(prev => ({ ...prev, minBalance: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="max-balance">Max Balance Trigger ($)</Label>
                <Input
                  id="max-balance"
                  type="number"
                  value={workflowConditions.maxBalance}
                  onChange={(e) => setWorkflowConditions(prev => ({ ...prev, maxBalance: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
          Back
        </Button>
        <Button onClick={handleExecuteAction} disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Execute ${actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}`
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-lg font-semibold">
        {actionType === 'deposit' ? 'Deposit' : 'Withdrawal'} Initiated Successfully!
      </h3>
      <p className="text-gray-600">
        Your transaction has been submitted and will be processed within 1-3 business days.
      </p>
      {createWorkflow && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Automated workflow has been created and will execute based on your configured schedule.
          </AlertDescription>
        </Alert>
      )}
      <Button onClick={onClose} className="w-full">
        Done
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Select Bank Account'}
            {step === 'connect' && 'Connect Bank Account'}
            {step === 'configure' && `Configure ${actionType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
            {step === 'success' && 'Transaction Initiated'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Choose an existing bank account or add a new one'}
            {step === 'connect' && 'Securely connect your bank account using our encrypted service'}
            {step === 'configure' && 'Set up your transaction details and automation preferences'}
            {step === 'success' && 'Your transaction has been successfully initiated'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && step !== 'configure' && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {!isLoading && (
          <>
            {step === 'select' && renderSelectStep()}
            {step === 'connect' && renderConnectStep()}
            {step === 'configure' && renderConfigureStep()}
            {step === 'success' && renderSuccessStep()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BankAccountConnectionModal;