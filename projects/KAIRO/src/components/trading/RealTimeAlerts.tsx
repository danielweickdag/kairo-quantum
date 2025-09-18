'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  BellRing, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Settings, 
  Volume2, 
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { tradingService, TradingSignal, MarketType, SignalType } from '@/services/tradingService';
import { toast } from 'react-hot-toast';

interface AlertSettings {
  enabled: boolean;
  sound: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
  minConfidence: number;
  markets: MarketType[];
}

interface AlertNotification {
  id: string;
  signal: TradingSignal;
  timestamp: string;
  read: boolean;
  type: 'ENTRY' | 'EXIT' | 'UPDATE';
}

export default function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [settings, setSettings] = useState<AlertSettings>({
    enabled: true,
    sound: true,
    push: true,
    email: false,
    sms: false,
    minConfidence: 70,
    markets: ['STOCKS', 'CRYPTO', 'FOREX']
  });
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time connection
  useEffect(() => {
    const connectToAlerts = () => {
      setIsConnected(true);
      // Simulate receiving alerts
      const interval = setInterval(() => {
        if (settings.enabled && Math.random() > 0.7) {
          generateMockAlert();
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    };

    const cleanup = connectToAlerts();
    return cleanup;
  }, [settings.enabled]);

  const generateMockAlert = useCallback(() => {
    const symbols = ['AAPL', 'BTCUSD', 'EURUSD', 'TSLA', 'ETHUSD', 'GBPUSD'];
    const markets: MarketType[] = ['STOCKS', 'CRYPTO', 'FOREX'];
    const signalTypes: SignalType[] = ['BUY', 'SELL'];
    
    const mockSignal: TradingSignal = {
      id: `signal_${Date.now()}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      marketType: markets[Math.floor(Math.random() * markets.length)],
      signalType: signalTypes[Math.floor(Math.random() * signalTypes.length)],
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      entryPrice: Math.random() * 1000 + 100,
      stopLoss: 0,
      takeProfit: 0,
      timeFrame: '1h',
      timestamp: new Date().toISOString(),
      riskRewardRatio: Math.random() * 2 + 1
    };

    // Calculate SL/TP
    const { stopLoss, takeProfit } = tradingService.calculateSLTP(
      mockSignal.entryPrice, 
      mockSignal.signalType
    );
    mockSignal.stopLoss = stopLoss;
    mockSignal.takeProfit = takeProfit;

    if (mockSignal.confidence >= settings.minConfidence && 
        settings.markets.includes(mockSignal.marketType)) {
      addAlert(mockSignal);
    }
  }, [settings]);

  const addAlert = (signal: TradingSignal) => {
    const newAlert: AlertNotification = {
      id: `alert_${Date.now()}`,
      signal,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'ENTRY'
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 49)]); // Keep last 50 alerts
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    const signalIcon = signal.signalType === 'BUY' ? '📈' : '📉';
    toast.success(
      `${signalIcon} ${signal.signalType} Signal: ${signal.symbol} (${signal.confidence}% confidence)`,
      {
        duration: 5000,
        position: 'top-right'
      }
    );

    // Play sound if enabled
    if (settings.sound) {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    // Create audio context for notification sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Audio notification not available');
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  const getSignalIcon = (signalType: SignalType) => {
    return signalType === 'BUY' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-green-500">High</Badge>;
    if (confidence >= 80) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              {isConnected ? (
                <BellRing className="h-5 w-5 text-green-500" />
              ) : (
                <Bell className="h-5 w-5 text-muted-foreground" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            Real-Time Trading Alerts
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {/* Settings Panel */}
        {showSettings && (
          <CardContent className="border-t pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Alerts Enabled</label>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    {settings.sound ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                    Sound
                  </label>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, sound: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    Push
                  </label>
                  <Switch
                    checked={settings.push}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </label>
                  <Switch
                    checked={settings.email}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Signals ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No alerts yet. Waiting for trading signals...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  className={`cursor-pointer transition-colors ${
                    alert.read ? 'opacity-60' : 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start gap-3">
                      {getSignalIcon(alert.signal.signalType)}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {alert.signal.signalType} {alert.signal.symbol}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {alert.signal.marketType}
                          </Badge>
                          {getConfidenceBadge(alert.signal.confidence)}
                        </div>
                        <AlertDescription className="text-sm">
                          Entry: ${alert.signal.entryPrice.toFixed(2)} | 
                          SL: ${alert.signal.stopLoss.toFixed(2)} | 
                          TP: ${alert.signal.takeProfit.toFixed(2)}
                        </AlertDescription>
                        <div className="text-xs text-muted-foreground">
                          Confidence: {alert.signal.confidence}% | 
                          R:R {alert.signal.riskRewardRatio.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}