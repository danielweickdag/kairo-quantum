'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const popularAssets: MarketData[] = [
  { symbol: 'AAPL', price: 185.25, change: 2.85, changePercent: 1.56 },
  { symbol: 'TSLA', price: 245.80, change: -5.25, changePercent: -2.09 },
  { symbol: 'MSFT', price: 378.90, change: 4.20, changePercent: 1.12 },
  { symbol: 'NVDA', price: 875.30, change: 15.60, changePercent: 1.81 },
  { symbol: 'BTC', price: 43250.00, change: 850.00, changePercent: 2.01 },
  { symbol: 'ETH', price: 2580.50, change: -45.20, changePercent: -1.72 }
];

export default function QuickTradeModal({ isOpen, onClose }: QuickTradeModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedMarketData = popularAssets.find(asset => asset.symbol === selectedAsset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !amount) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message or handle response
      console.log('Trade executed:', {
        symbol: selectedAsset,
        type: tradeType,
        orderType,
        amount: parseFloat(amount),
        price: orderType === 'limit' ? parseFloat(price) : selectedMarketData?.price
      });
      
      // Reset form and close modal
      setSelectedAsset('');
      setAmount('');
      setPrice('');
      onClose();
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!amount || !selectedMarketData) return 0;
    const qty = parseFloat(amount);
    const assetPrice = orderType === 'limit' && price ? parseFloat(price) : selectedMarketData.price;
    return qty * assetPrice;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Trade</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset">Select Asset</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {popularAssets.map((asset) => (
                  <Card
                    key={asset.symbol}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedAsset === asset.symbol
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setSelectedAsset(asset.symbol)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{asset.symbol}</span>
                        <Badge
                          variant={asset.change >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="text-lg font-bold">
                        ${asset.price.toLocaleString()}
                      </div>
                      <div className={cn(
                        "text-sm flex items-center",
                        asset.change >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {asset.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Form */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Buy/Sell Toggle */}
              <div>
                <Label>Order Side</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={tradeType === 'buy' ? 'default' : 'outline'}
                    onClick={() => setTradeType('buy')}
                    className={cn(
                      "w-full",
                      tradeType === 'buy' && "bg-green-600 hover:bg-green-700 text-white"
                    )}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Buy
                  </Button>
                  <Button
                    type="button"
                    variant={tradeType === 'sell' ? 'default' : 'outline'}
                    onClick={() => setTradeType('sell')}
                    className={cn(
                      "w-full",
                      tradeType === 'sell' && "bg-red-600 hover:bg-red-700 text-white"
                    )}
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Sell
                  </Button>
                </div>
              </div>

              {/* Order Type */}
              <div>
                <Label htmlFor="orderType">Order Type</Label>
                <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter quantity"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Price (for limit orders) */}
              {orderType === 'limit' && (
                <div>
                  <Label htmlFor="price">Limit Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter limit price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              )}

              {/* Order Summary */}
              {selectedAsset && amount && (
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Asset:</span>
                        <span className="font-medium">{selectedAsset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium capitalize">{tradeType} {orderType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{amount}</span>
                      </div>
                      {orderType === 'market' && selectedMarketData && (
                        <div className="flex justify-between">
                          <span>Market Price:</span>
                          <span className="font-medium">${selectedMarketData.price.toLocaleString()}</span>
                        </div>
                      )}
                      {orderType === 'limit' && price && (
                        <div className="flex justify-between">
                          <span>Limit Price:</span>
                          <span className="font-medium">${parseFloat(price).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total:</span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedAsset || !amount || isLoading || (orderType === 'limit' && !price)}
                  className={cn(
                    "flex-1",
                    tradeType === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {tradeType === 'buy' ? (
                        <TrendingUp className="h-4 w-4 mr-2" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-2" />
                      )}
                      {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}