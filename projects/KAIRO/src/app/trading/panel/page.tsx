'use client';

import React, { Suspense } from 'react';
import TradingPanelDashboard from '@/components/trading/TradingPanelDashboard';
import AppLayout from '@/components/layouts/AppLayout';
import { useSearchParams } from 'next/navigation';

function TradingPanelContent() {
  const searchParams = useSearchParams();
  
  // Extract URL parameters for automated workflow
  const urlParams = {
    symbol: searchParams.get('symbol') || 'LINKUSDT',
    orderType: searchParams.get('orderType') as 'market' | 'limit' | 'stop' || 'limit',
    orderSide: searchParams.get('orderSide') as 'buy' | 'sell' || 'buy',
    quantity: searchParams.get('quantity') || '',
    price: searchParams.get('price') || ''
  };

  return (
    <AppLayout>
      <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <TradingPanelDashboard initialParams={urlParams} />
      </div>
    </AppLayout>
  );
}

const TradingPanelPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradingPanelContent />
    </Suspense>
  );
};

export default TradingPanelPage;