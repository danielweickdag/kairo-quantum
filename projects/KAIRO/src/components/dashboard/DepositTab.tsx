'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUpRight, 
  DollarSign,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DepositTabProps {
  className?: string
}

const DepositTab: React.FC<DepositTabProps> = ({ className }) => {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDeposit = async () => {
    if (!amount || !paymentMethod) return
    
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      // Reset form or show success message
    }, 2000)
  }

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.9%' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: 'Free' },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet, fee: '1.5%' }
  ]

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>Deposit Funds</span>
          </CardTitle>
          <CardDescription>
            Add funds to your trading account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Deposit Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg font-semibold"
                min="10"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum deposit: $10.00</p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['100', '500', '1000', '5000'].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount)}
                className="text-xs"
              >
                ${quickAmount}
              </Button>
            ))}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <div
                    key={method.id}
                    className={cn(
                      'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors',
                      paymentMethod === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-gray-500">Fee: {method.fee}</p>
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Secure Transaction</p>
              <p>Your payment information is encrypted and secure. Deposits typically process within 1-3 business days.</p>
            </div>
          </div>

          {/* Deposit Button */}
          <Button
            onClick={handleDeposit}
            disabled={!amount || !paymentMethod || isProcessing}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Deposit ${amount || '0.00'}</span>
              </div>
            )}
          </Button>

          {/* Status Badges */}
          <div className="flex justify-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Instant Processing
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Bank Grade Security
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DepositTab