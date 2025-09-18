'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Play,
  Pause,
  Save,
  FolderOpen,
  Download,
  Upload,
  Settings,
  Bug,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Code,
  FileText,
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Zap,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useErrorHandler } from '@/lib/errorHandler'

interface PineScript {
  id: string
  name: string
  content: string
  lastModified: Date
  isRunning: boolean
  hasErrors: boolean
}

interface BacktestResult {
  totalReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  totalTrades: number
  profitFactor: number
  avgTrade: number
}

interface CompileError {
  line: number
  column: number
  message: string
  type: 'error' | 'warning' | 'info'
}

const PineEditor: React.FC = () => {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [activeTab, setActiveTab] = useState('editor')
  const [scripts, setScripts] = useState<PineScript[]>([])
  const [activeScript, setActiveScript] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [compileErrors, setCompileErrors] = useState<CompileError[]>([])
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('light')
  const { handleCompilationError } = useErrorHandler()

  // Pine Script template
  const defaultPineScript = `//@version=5
strategy("My Strategy", overlay=true, margin_long=100, margin_short=100)

// Input parameters
length = input.int(14, title="Length")
source = input(close, title="Source")

// Calculate indicator
ma = ta.sma(source, length)

// Entry conditions
longCondition = ta.crossover(source, ma)
shortCondition = ta.crossunder(source, ma)

// Execute trades
if longCondition
    strategy.entry("Long", strategy.long)
if shortCondition
    strategy.entry("Short", strategy.short)

// Plot indicator
plot(ma, color=color.blue, title="Moving Average")

// Plot signals
plotshape(longCondition, title="Long Signal", location=location.belowbar, color=color.green, style=shape.triangleup, size=size.small)
plotshape(shortCondition, title="Short Signal", location=location.abovebar, color=color.red, style=shape.triangledown, size=size.small)`

  const pineKeywords = [
    'strategy', 'indicator', 'library', 'input', 'plot', 'plotshape', 'plotchar',
    'hline', 'fill', 'bgcolor', 'barcolor', 'if', 'else', 'for', 'while',
    'var', 'varip', 'true', 'false', 'na', 'close', 'open', 'high', 'low',
    'volume', 'time', 'bar_index', 'ta.sma', 'ta.ema', 'ta.rsi', 'ta.macd',
    'ta.crossover', 'ta.crossunder', 'math.max', 'math.min', 'math.abs',
    'color.red', 'color.green', 'color.blue', 'color.yellow', 'color.white',
    'location.top', 'location.bottom', 'location.belowbar', 'location.abovebar'
  ]

  useEffect(() => {
    // Initialize with default script
    const defaultScript: PineScript = {
      id: 'default',
      name: 'My Strategy',
      content: defaultPineScript,
      lastModified: new Date(),
      isRunning: false,
      hasErrors: false
    }
    
    setScripts([defaultScript])
    setActiveScript('default')
    setCode(defaultPineScript)
  }, [defaultPineScript])

  const handleCodeChange = (value: string) => {
    setCode(value)
    // Update active script
    if (activeScript) {
      setScripts(prev => prev.map(script => 
        script.id === activeScript 
          ? { ...script, content: value, lastModified: new Date() }
          : script
      ))
    }
  }

  const compileScript = () => {
    // Mock compilation with syntax checking
    const errors: CompileError[] = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      // Simple syntax validation
      if (line.includes('strategy.entry') && !line.includes('"')) {
        const error = {
          line: index + 1,
          column: 1,
          message: 'Strategy entry requires a string identifier',
          type: 'error' as const
        }
        errors.push(error)
        handleCompilationError(error.line, error.message, error.type)
      }
      
      if (line.includes('plot(') && !line.includes('title=')) {
        const error = {
          line: index + 1,
          column: 1,
          message: 'Plot function should include a title parameter',
          type: 'warning' as const
        }
        errors.push(error)
        handleCompilationError(error.line, error.message, error.type)
      }
    })
    
    setCompileErrors(errors)
    
    if (errors.filter(e => e.type === 'error').length === 0) {
      // Mock successful compilation
      console.log('Script compiled successfully')
      return true
    }
    
    return false
  }

  const runBacktest = () => {
    if (!compileScript()) {
      return
    }
    
    setIsRunning(true)
    
    // Mock backtest execution
    setTimeout(() => {
      const mockResults: BacktestResult = {
        totalReturn: Math.random() * 200 - 50, // -50% to 150%
        sharpeRatio: Math.random() * 3,
        maxDrawdown: Math.random() * -30,
        winRate: Math.random() * 100,
        totalTrades: Math.floor(Math.random() * 500) + 50,
        profitFactor: Math.random() * 3 + 0.5,
        avgTrade: (Math.random() - 0.5) * 1000
      }
      
      setBacktestResults(mockResults)
      setIsRunning(false)
    }, 3000)
  }

  const saveScript = () => {
    console.log('Saving script...')
    // Implementation for saving script
  }

  const loadScript = () => {
    console.log('Loading script...')
    // Implementation for loading script
  }

  const exportScript = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeScript || 'script'}.pine`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCode = () => {
    // Simple code formatting
    const formatted = code
      .split('\n')
      .map(line => line.trim())
      .join('\n')
    setCode(formatted)
  }

  const insertSnippet = (snippet: string) => {
    if (editorRef.current) {
      const textarea = editorRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newCode = code.substring(0, start) + snippet + code.substring(end)
      setCode(newCode)
      
      // Set cursor position after snippet
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + snippet.length, start + snippet.length)
      }, 0)
    }
  }

  const codeSnippets = [
    { name: 'SMA', code: 'ta.sma(close, 20)' },
    { name: 'EMA', code: 'ta.ema(close, 21)' },
    { name: 'RSI', code: 'ta.rsi(close, 14)' },
    { name: 'MACD', code: 'ta.macd(close, 12, 26, 9)' },
    { name: 'Bollinger Bands', code: 'ta.bb(close, 20, 2)' },
    { name: 'Long Entry', code: 'strategy.entry("Long", strategy.long)' },
    { name: 'Short Entry', code: 'strategy.entry("Short", strategy.short)' },
    { name: 'Plot Line', code: 'plot(close, title="Price", color=color.blue)' }
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Pine Script Editor</h2>
          <Badge variant="outline">v5</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={saveScript}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={loadScript}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Load
          </Button>
          <Button variant="outline" size="sm" onClick={exportScript}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={runBacktest}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Backtest
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="results">Backtest Results</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card className="h-[600px]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Script Editor</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={formatCode}>
                        <Code className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={compileScript}>
                        <Bug className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    {/* Line Numbers */}
                    {showLineNumbers && (
                      <div className="absolute left-0 top-0 w-12 h-full bg-gray-50 border-r text-xs text-gray-500 p-2 font-mono">
                        {code.split('\n').map((_, index) => (
                          <div key={index} className="leading-6">
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Code Editor */}
                    <textarea
                      ref={editorRef}
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className={cn(
                        "w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none",
                        showLineNumbers && "pl-16"
                      )}
                      style={{ fontSize: `${fontSize}px` }}
                      placeholder="Write your Pine Script here..."
                      spellCheck={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="text-sm">Backtest Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {isRunning ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Activity className="w-8 h-8 mx-auto mb-4 animate-pulse" />
                        <p>Running backtest...</p>
                      </div>
                    </div>
                  ) : backtestResults ? (
                    <div className="space-y-6">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded">
                          <div className="text-2xl font-bold text-green-600">
                            {backtestResults.totalReturn.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-600">Total Return</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded">
                          <div className="text-2xl font-bold">
                            {backtestResults.sharpeRatio.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">Sharpe Ratio</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded">
                          <div className="text-2xl font-bold text-red-600">
                            {backtestResults.maxDrawdown.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-600">Max Drawdown</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded">
                          <div className="text-2xl font-bold">
                            {backtestResults.winRate.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Win Rate</div>
                        </div>
                      </div>
                      
                      {/* Additional Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <BarChart3 className="w-4 h-4" />
                            <span className="font-medium">Total Trades</span>
                          </div>
                          <div className="text-xl font-bold">{backtestResults.totalTrades}</div>
                        </div>
                        <div className="p-4 border rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">Profit Factor</span>
                          </div>
                          <div className="text-xl font-bold">{backtestResults.profitFactor.toFixed(2)}</div>
                        </div>
                        <div className="p-4 border rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">Avg Trade</span>
                          </div>
                          <div className="text-xl font-bold">${backtestResults.avgTrade.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {/* Chart Placeholder */}
                      <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                          <p>Equity Curve Chart</p>
                          <p className="text-sm">Performance visualization would appear here</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto mb-4" />
                        <p>Run a backtest to see results</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="console">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="text-sm">Console Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {compileErrors.length > 0 ? (
                      compileErrors.map((error, index) => (
                        <Alert key={index} variant={error.type === 'error' ? 'destructive' : 'default'}>
                          <div className="flex items-center space-x-2">
                            {error.type === 'error' && <XCircle className="w-4 h-4" />}
                            {error.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                            {error.type === 'info' && <CheckCircle className="w-4 h-4" />}
                            <span className="font-mono text-sm">
                              Line {error.line}: {error.message}
                            </span>
                          </div>
                        </Alert>
                      ))
                    ) : (
                      <Alert>
                        <CheckCircle className="w-4 h-4" />
                        <AlertDescription>
                          No compilation errors found. Script is ready to run.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Code Snippets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Code Snippets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {codeSnippets.map((snippet) => (
                <Button
                  key={snippet.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => insertSnippet(snippet.code)}
                >
                  <Zap className="w-3 h-3 mr-2" />
                  {snippet.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Editor Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Editor Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Line Numbers</Label>
                <Switch 
                  checked={showLineNumbers}
                  onCheckedChange={setShowLineNumbers}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <Input 
                  type="number" 
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min="10"
                  max="24"
                  className="h-8"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Theme</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm" 
                    className="flex-1"
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Pine Script v5 Docs
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Strategy Examples
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Code className="w-4 h-4 mr-2" />
                Built-in Functions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PineEditor