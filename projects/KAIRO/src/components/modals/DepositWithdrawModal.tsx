'use client';

import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, ArrowUpRight, ArrowDownLeft, DollarSign, Clock, Shield, CheckCircle } from 'lucide-react';
import automatedWorkflowService from '@/services/AutomatedWorkflowService';

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'deposit' | 'withdraw';
  currentBalance?: number;
  onSuccess?: (amount: number, method: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  processingTime: string;
  fees: string;
  minAmount: number;
  maxAmount: number;
}

const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentBalance = 0,
  onSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<'method' | 'amount' | 'confirmation' | 'processing' | 'success'>('method');
  const [isProcessing, setIsProcessing] = useState(false);

  const depositMethods: PaymentMethod[] = [
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: <Banknote className="h-6 w-6" />,
      description: 'Direct transfer from your bank account',
      processingTime: '1-3 business days',
      fees: 'Free',
      minAmount: 10,
      maxAmount: 50000
    },
    {
      id: 'debit-card',
      name: 'Debit Card',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Instant deposit with your debit card',
      processingTime: 'Instant',
      fees: '2.9% + $0.30',
      minAmount: 1,
      maxAmount: 10000
    },
    {
      id: 'mobile-payment',
      name: 'Mobile Payment',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Apple Pay, Google Pay, Samsung Pay',
      processingTime: 'Instant',
      fees: '2.9% + $0.30',
      minAmount: 1,
      maxAmount: 5000
    }
  ];

  const withdrawMethods: PaymentMethod[] = [
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: <Banknote className="h-6 w-6" />,
      description: 'Transfer to your linked bank account',
      processingTime: '1-3 business days',
      fees: 'Free',
      minAmount: 10,
      maxAmount: currentBalance
    },
    {
      id: 'instant-withdrawal',
      name: 'Instant Withdrawal',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Instant transfer to your debit card',
      processingTime: 'Instant',
      fees: '1.5%',
      minAmount: 1,
      maxAmount: Math.min(currentBalance, 25000)
    }
  ];

  const methods = mode === 'deposit' ? depositMethods : withdrawMethods;
  const selectedMethodData = methods.find(m => m.id === selectedMethod);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('amount');
  };

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) < (selectedMethodData?.minAmount || 0)) return;
    setStep('confirmation');
  };

  const handleConfirm = async () => {
    setStep('processing');
    setIsProcessing(true);
    
    try {
      const amountValue = parseFloat(amount);
      const methodName = selectedMethodData?.name || '';
      
      if (mode === 'deposit') {
        await automatedWorkflowService.manualDeposit(amountValue, methodName);
      } else {
        await automatedWorkflowService.manualWithdraw(amountValue, methodName);
      }
      
      setIsProcessing(false);
      setStep('success');
      onSuccess?.(amountValue, methodName);
    } catch (error) {
      setIsProcessing(false);
      // Handle error - could add error step or show error message
      console.error('Transaction failed:', error);
    }
  };

  const resetModal = () => {
    setSelectedMethod('');
    setAmount('');
    setStep('method');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {mode === 'deposit' ? (
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            ) : (
              <ArrowDownLeft className="h-6 w-6 text-blue-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mode === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {mode === 'deposit' 
                    ? 'Choose how you\'d like to add funds to your account'
                    : `Available balance: $${currentBalance.toFixed(2)}`
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                {methods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 dark:text-blue-400 mt-1">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {method.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {method.processingTime}
                          </span>
                          <span>Fee: {method.fees}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'amount' && selectedMethodData && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('method')}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                ← Back to payment methods
              </button>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {selectedMethodData.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMethodData.description}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min={selectedMethodData.minAmount}
                      max={selectedMethodData.maxAmount}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Min: ${selectedMethodData.minAmount} • Max: ${selectedMethodData.maxAmount.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Processing time:</span>
                    <span className="text-gray-900 dark:text-white">{selectedMethodData.processingTime}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Fee:</span>
                    <span className="text-gray-900 dark:text-white">{selectedMethodData.fees}</span>
                  </div>
                </div>

                <button
                  onClick={handleAmountSubmit}
                  disabled={!amount || parseFloat(amount) < selectedMethodData.minAmount || parseFloat(amount) > selectedMethodData.maxAmount}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 'confirmation' && selectedMethodData && (
            <div className="space-y-6">
              <button
                onClick={() => setStep('amount')}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                ← Back to amount
              </button>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Confirm {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </h3>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method:</span>
                  <span className="text-gray-900 dark:text-white">{selectedMethodData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Processing time:</span>
                  <span className="text-gray-900 dark:text-white">{selectedMethodData.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fee:</span>
                  <span className="text-gray-900 dark:text-white">{selectedMethodData.fees}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Secure Transaction
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    Your transaction is protected by bank-level encryption and security measures.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Confirm {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Processing {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we process your transaction...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {mode === 'deposit' ? 'Deposit' : 'Withdrawal'} Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                ${parseFloat(amount).toFixed(2)} has been {mode === 'deposit' ? 'added to' : 'withdrawn from'} your account.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositWithdrawModal;