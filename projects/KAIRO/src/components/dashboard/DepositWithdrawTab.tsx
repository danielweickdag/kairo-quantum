'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react'
import DepositInterface from './DepositInterface'
import WithdrawalInterface from './WithdrawalInterface'
import { cn } from '@/lib/utils'
import { useBalance } from '@/hooks/useBalance'

interface DepositWithdrawTabProps {
  className?: string
}

const DepositWithdrawTab: React.FC<DepositWithdrawTabProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('deposit')
  const { balance, formattedBalance, isLoading: balanceLoading } = useBalance()

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-blue-500" />
            Wallet Management
          </h2>
          <p className="text-muted-foreground">
            Manage your deposits and withdrawals
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <p className="text-lg font-bold">
              {formattedBalance.available}
              {balanceLoading && <span className="ml-1 text-xs text-gray-400">...</span>}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-lg font-bold">
              {formattedBalance.total}
              {balanceLoading && <span className="ml-1 text-xs text-gray-400">...</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Fund Management</span>
              </CardTitle>
              <CardDescription>
                Deposit funds to start trading or withdraw your profits
              </CardDescription>
            </div>
            
            {/* Status Indicators */}
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                Deposits Active
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <TrendingDown className="w-3 h-3 mr-1" />
                Withdrawals Available
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="deposit" 
                className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Deposit Funds</span>
              </TabsTrigger>
              <TabsTrigger 
                value="withdraw" 
                className="flex items-center space-x-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-700"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Withdraw Funds</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <div className="border rounded-lg p-1">
                <DepositInterface />
              </div>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div className="border rounded-lg p-1">
                <WithdrawalInterface />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default DepositWithdrawTab