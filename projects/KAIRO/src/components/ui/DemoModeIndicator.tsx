'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Play } from 'lucide-react'
import { useTradingMode } from '@/contexts/TradingModeContext'
import { cn } from '@/lib/utils'

interface DemoModeIndicatorProps {
  className?: string
  variant?: 'badge' | 'banner'
}

export function DemoModeIndicator({ className, variant = 'badge' }: DemoModeIndicatorProps) {
  const { isPaperTrading, tradingMode } = useTradingMode()

  if (!isPaperTrading) {
    return null
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        'bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4',
        className
      )}>
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
            Demo Mode Active
          </span>
          <span className="text-xs text-orange-600 dark:text-orange-400">
            • All trades are simulated • No real money involved
          </span>
        </div>
      </div>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-medium',
        className
      )}
    >
      <Play className="h-3 w-3 mr-1" />
      Demo Mode
    </Badge>
  )
}

export default DemoModeIndicator