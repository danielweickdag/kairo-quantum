'use client'

import { useState, useEffect } from 'react'
import balanceTrackingService, { BalanceData } from '@/services/BalanceTrackingService'

/**
 * Custom hook for real-time balance tracking
 */
export function useBalance() {
  const [balance, setBalance] = useState<BalanceData>(balanceTrackingService.getCurrentBalance())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Subscribe to balance updates
    const unsubscribe = balanceTrackingService.subscribe((newBalance) => {
      setBalance(newBalance)
      setIsLoading(false)
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  /**
   * Manually refresh balance
   */
  const refreshBalance = () => {
    setIsLoading(true)
    setBalance(balanceTrackingService.getCurrentBalance())
    setIsLoading(false)
  }

  /**
   * Get formatted balance values
   */
  const formattedBalance = balanceTrackingService.getBalanceSummary()

  return {
    balance,
    formattedBalance,
    isLoading,
    refreshBalance,
    formatCurrency: balanceTrackingService.formatCurrency.bind(balanceTrackingService)
  }
}

/**
 * Hook for balance change notifications
 */
export function useBalanceNotifications() {
  const [lastChange, setLastChange] = useState<{
    type: 'deposit' | 'withdrawal' | 'profit' | 'loss'
    amount: number
    timestamp: Date
  } | null>(null)

  useEffect(() => {
    let previousBalance = balanceTrackingService.getCurrentBalance().totalBalance

    const unsubscribe = balanceTrackingService.subscribe((newBalance) => {
      const difference = newBalance.totalBalance - previousBalance
      
      if (Math.abs(difference) > 0.01) { // Ignore very small changes
        setLastChange({
          type: difference > 0 ? 'deposit' : 'withdrawal',
          amount: Math.abs(difference),
          timestamp: newBalance.lastUpdated
        })
      }
      
      previousBalance = newBalance.totalBalance
    })

    return unsubscribe
  }, [])

  return { lastChange }
}

export default useBalance