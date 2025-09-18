'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  BarChart3,
  TrendingUp,
  Settings,
  Maximize,
  Download,
  Palette,
  MousePointer,
  Minus,
  Square,
  Triangle,
  Circle,
  Type,
  Ruler,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChartData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Indicator {
  id: string
  name: string
  type: 'overlay' | 'oscillator'
  enabled: boolean
  color: string
  parameters: Record<string, number>
}

interface DrawingTool {
  id: string
  name: string
  icon: React.ReactNode
  active: boolean
}

interface TimeFrame {
  label: string
  value: string
  minutes: number
}

const AdvancedChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [symbol, setSymbol] = useState('BTC/USD')
  const [timeframe, setTimeframe] = useState('1h')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [drawingTools, setDrawingTools] = useState<DrawingTool[]>([])
  const [activeTab, setActiveTab] = useState('chart')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [chartType, setChartType] = useState('candlestick')
  const [showVolume, setShowVolume] = useState(true)
  const [showGrid, setShowGrid] = useState(true)

  const timeframes: TimeFrame[] = [
    { label: '1m', value: '1m', minutes: 1 },
    { label: '5m', value: '5m', minutes: 5 },
    { label: '15m', value: '15m', minutes: 15 },
    { label: '1h', value: '1h', minutes: 60 },
    { label: '4h', value: '4h', minutes: 240 },
    { label: '1D', value: '1D', minutes: 1440 },
    { label: '1W', value: '1W', minutes: 10080 }
  ]

  const chartTypes = [
    { label: 'Candlestick', value: 'candlestick' },
    { label: 'Line', value: 'line' },
    { label: 'Area', value: 'area' },
    { label: 'OHLC', value: 'ohlc' },
    { label: 'Heikin Ashi', value: 'heikin' }
  ]

  useEffect(() => {
    // Initialize indicators
    const defaultIndicators: Indicator[] = [
      {
        id: 'sma20',
        name: 'SMA (20)',
        type: 'overlay',
        enabled: false,
        color: '#3B82F6',
        parameters: { period: 20 }
      },
      {
        id: 'sma50',
        name: 'SMA (50)',
        type: 'overlay',
        enabled: false,
        color: '#EF4444',
        parameters: { period: 50 }
      },
      {
        id: 'ema21',
        name: 'EMA (21)',
        type: 'overlay',
        enabled: false,
        color: '#10B981',
        parameters: { period: 21 }
      },
      {
        id: 'bb',
        name: 'Bollinger Bands',
        type: 'overlay',
        enabled: false,
        color: '#8B5CF6',
        parameters: { period: 20, deviation: 2 }
      },
      {
        id: 'rsi',
        name: 'RSI (14)',
        type: 'oscillator',
        enabled: false,
        color: '#F59E0B',
        parameters: { period: 14 }
      },
      {
        id: 'macd',
        name: 'MACD',
        type: 'oscillator',
        enabled: false,
        color: '#06B6D4',
        parameters: { fast: 12, slow: 26, signal: 9 }
      },
      {
        id: 'stoch',
        name: 'Stochastic',
        type: 'oscillator',
        enabled: false,
        color: '#EC4899',
        parameters: { k: 14, d: 3 }
      }
    ]

    // Initialize drawing tools
    const defaultDrawingTools: DrawingTool[] = [
      { id: 'cursor', name: 'Cursor', icon: <MousePointer className="w-4 h-4" />, active: true },
      { id: 'line', name: 'Trend Line', icon: <Minus className="w-4 h-4" />, active: false },
      { id: 'rectangle', name: 'Rectangle', icon: <Square className="w-4 h-4" />, active: false },
      { id: 'triangle', name: 'Triangle', icon: <Triangle className="w-4 h-4" />, active: false },
      { id: 'circle', name: 'Circle', icon: <Circle className="w-4 h-4" />, active: false },
      { id: 'text', name: 'Text', icon: <Type className="w-4 h-4" />, active: false },
      { id: 'ruler', name: 'Ruler', icon: <Ruler className="w-4 h-4" />, active: false }
    ]

    // Generate mock chart data
    const generateMockData = () => {
      const data: ChartData[] = []
      let basePrice = 43000
      const now = Date.now()
      
      for (let i = 100; i >= 0; i--) {
        const timestamp = now - (i * 60 * 60 * 1000) // 1 hour intervals
        const volatility = 0.02
        const change = (Math.random() - 0.5) * volatility
        
        const open = basePrice
        const close = open * (1 + change)
        const high = Math.max(open, close) * (1 + Math.random() * 0.01)
        const low = Math.min(open, close) * (1 - Math.random() * 0.01)
        const volume = Math.random() * 1000000 + 500000
        
        data.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        })
        
        basePrice = close
      }
      
      return data
    }

    setIndicators(defaultIndicators)
    setDrawingTools(defaultDrawingTools)
    setChartData(generateMockData())
  }, [])

  const toggleIndicator = (id: string) => {
    setIndicators(prev => prev.map(indicator => 
      indicator.id === id ? { ...indicator, enabled: !indicator.enabled } : indicator
    ))
  }

  const selectDrawingTool = (id: string) => {
    setDrawingTools(prev => prev.map(tool => 
      ({ ...tool, active: tool.id === id })
    ))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const exportChart = () => {
    // Export chart functionality
    console.log('Exporting chart...')
  }

  const resetChart = () => {
    // Reset chart zoom and drawings
    console.log('Resetting chart...')
  }

  return (
    <div className={cn(
      "space-y-4",
      isFullscreen && "fixed inset-0 z-50 bg-white p-4"
    )}>
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Advanced Chart</h2>
          <div className="flex items-center space-x-2">
            <Input 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value)}
              className="w-32"
              placeholder="Symbol"
            />
            <Badge variant="outline">{symbol}</Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={togglePlayback}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={resetChart}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportChart}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2">
        <Label>Timeframe:</Label>
        {timeframes.map((tf) => (
          <Button
            key={tf.value}
            variant={timeframe === tf.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe(tf.value)}
          >
            {tf.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Chart Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              {/* Chart Toolbar */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Label>Chart Type:</Label>
                  {chartTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={chartType === type.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={showVolume} onCheckedChange={setShowVolume} />
                    <Label>Volume</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    <Label>Grid</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Chart Canvas */}
              <div className="relative h-full p-4">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full border rounded"
                  style={{ background: showGrid ? 'url("data:image/svg+xml,%3csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3e%3cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="%23e5e7eb" stroke-width="1"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23grid)" /%3e%3c/svg%3e")' : '#ffffff' }}
                />
                
                {/* Chart Placeholder */}
                <div className="absolute inset-4 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Chart Visualization</p>
                    <p className="text-sm">Real-time {symbol} {timeframe} chart would render here</p>
                    <p className="text-xs mt-2">Integration with TradingView, Chart.js, or custom WebGL renderer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="indicators">Indicators</TabsTrigger>
              <TabsTrigger value="drawing">Drawing</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="indicators" className="space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Technical Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {indicators.map((indicator) => (
                    <div key={indicator.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={indicator.enabled}
                          onCheckedChange={() => toggleIndicator(indicator.id)}
                        />
                        <div>
                          <div className="text-sm font-medium">{indicator.name}</div>
                          <div className="text-xs text-gray-600">{indicator.type}</div>
                        </div>
                      </div>
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: indicator.color }}
                      />
                    </div>
                  ))}
                  
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Add Indicator
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drawing" className="space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Drawing Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {drawingTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={tool.active ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => selectDrawingTool(tool.id)}
                    >
                      {tool.icon}
                      <span className="ml-2">{tool.name}</span>
                    </Button>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Line Color</Label>
                      <Button variant="outline" size="sm">
                        <Palette className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Line Width</Label>
                      <Input type="number" defaultValue="2" className="w-16 h-8" />
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="destructive" size="sm">
                    Clear All Drawings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Chart Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Price Scale</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">Auto</Button>
                      <Button variant="outline" size="sm" className="flex-1">Log</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Theme</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">Light</Button>
                      <Button variant="outline" size="sm" className="flex-1">Dark</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Crosshair</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Price Line</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Time Scale</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Candle Colors</Label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Bull</Label>
                        <div className="w-full h-6 bg-green-500 rounded border"></div>
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs text-gray-600">Bear</Label>
                        <div className="w-full h-6 bg-red-500 rounded border"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Chart Info Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Open</div>
              <div className="font-medium">$43,125.50</div>
            </div>
            <div>
              <div className="text-gray-600">High</div>
              <div className="font-medium text-green-600">$43,890.25</div>
            </div>
            <div>
              <div className="text-gray-600">Low</div>
              <div className="font-medium text-red-600">$42,850.75</div>
            </div>
            <div>
              <div className="text-gray-600">Close</div>
              <div className="font-medium">$43,250.50</div>
            </div>
            <div>
              <div className="text-gray-600">Volume</div>
              <div className="font-medium">1.2M</div>
            </div>
            <div>
              <div className="text-gray-600">Change</div>
              <div className="font-medium text-green-600">+2.89%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedChart