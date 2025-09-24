'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Save, Download, Upload, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useErrorHandler } from '@/lib/errorHandler';

interface PineScriptEditorProps {
  onSave?: (script: string) => void;
  onRun?: (script: string) => void;
  initialScript?: string;
}

interface ValidationError {
  line: number;
  message: string;
  type: 'error' | 'warning';
}

// Default Pine Script template
const defaultPineScript = `//@version=5
strategy("My Strategy", overlay=true, margin_long=100, margin_short=100)

// Input parameters
length = input.int(14, title="Length")
source = input(close, title="Source")

// Calculate indicators
rsiValue = ta.rsi(source, length)
smaValue = ta.sma(source, length)

// Entry conditions
longCondition = ta.crossover(rsiValue, 30)
shortCondition = ta.crossunder(rsiValue, 70)

// Strategy entries
if (longCondition)
    strategy.entry("Long", strategy.long)

if (shortCondition)
    strategy.entry("Short", strategy.short)

// Plot indicators
plot(smaValue, color=color.blue, title="SMA")
hline(70, "Overbought", color=color.red)
hline(30, "Oversold", color=color.green)

// Plot RSI in separate pane
rsiPlot = plot(rsiValue, title="RSI", color=color.purple)
hline(50, "Midline", color=color.gray)`;

const PineScriptEditor: React.FC<PineScriptEditorProps> = ({
  onSave,
  onRun,
  initialScript = ''
}) => {
  const [script, setScript] = useState(initialScript || defaultPineScript);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { handleCompilationError } = useErrorHandler();
  const [savedScripts, setSavedScripts] = useState<{name: string, script: string}[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pine Script keywords for syntax highlighting
  const pineKeywords = [
    'strategy', 'study', 'indicator', 'var', 'varip', 'if', 'else', 'for', 'while',
    'true', 'false', 'na', 'close', 'open', 'high', 'low', 'volume', 'time',
    'sma', 'ema', 'rsi', 'macd', 'bollinger', 'stoch', 'atr', 'adx',
    'plot', 'plotshape', 'plotchar', 'hline', 'fill', 'bgcolor',
    'strategy.entry', 'strategy.exit', 'strategy.close', 'strategy.cancel',
    'input', 'input.int', 'input.float', 'input.bool', 'input.string',
    'math.abs', 'math.max', 'math.min', 'math.round', 'math.floor', 'math.ceil'
  ];

  // Syntax highlighting state
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
  const [autoComplete, setAutoComplete] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>([]);
  const [autoCompletePosition, setAutoCompletePosition] = useState({ top: 0, left: 0 });
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);

  // Apply syntax highlighting
  const applySyntaxHighlighting = (code: string) => {
    if (!syntaxHighlighting) return code;
    
    let highlightedCode = code;
    
    // Highlight comments
    highlightedCode = highlightedCode.replace(
      /(\/\/.*$)/gm,
      '<span style="color: #6a9955; font-style: italic;">$1</span>'
    );
    
    // Highlight strings
    highlightedCode = highlightedCode.replace(
      /(["'])((?:(?!\1)[^\\]|\\.)*)\1/g,
      '<span style="color: #ce9178;">$&</span>'
    );
    
    // Highlight numbers
    highlightedCode = highlightedCode.replace(
      /\b\d+(\.\d+)?\b/g,
      '<span style="color: #b5cea8;">$&</span>'
    );
    
    // Highlight Pine Script keywords
    pineKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace('.', '\\.')}\\b`, 'g');
      highlightedCode = highlightedCode.replace(
        regex,
        `<span style="color: #569cd6; font-weight: bold;">${keyword}</span>`
      );
    });
    
    return highlightedCode;
  };



  // Validate Pine Script syntax
  const validateScript = (scriptText: string) => {
    setIsValidating(true);
    const errors: ValidationError[] = [];
    const lines = scriptText.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // Check for common syntax errors
      if (trimmedLine && !trimmedLine.startsWith('//')) {
        // Check for missing version declaration
        if (lineNum === 1 && !trimmedLine.includes('@version')) {
          errors.push({
            line: lineNum,
            message: 'Missing @version declaration at the beginning',
            type: 'error'
          });
        }

        // Check for unmatched parentheses
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
          errors.push({
            line: lineNum,
            message: 'Unmatched parentheses',
            type: 'error'
          });
        }

        // Check for undefined variables (basic check)
        const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
        const usagePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        
        // Warning for deprecated functions
        if (line.includes('security(') && !line.includes('request.security(')) {
          errors.push({
            line: lineNum,
            message: 'security() is deprecated, use request.security() instead',
            type: 'warning'
          });
        }
      }
    });

    // Log validation errors using centralized handler
    errors.forEach(error => {
      handleCompilationError(error.line, error.message, error.type);
    });
    
    setValidationErrors(errors);
   setIsValidating(false);
  };

  // Handle script changes
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newScript = e.target.value;
    setScript(newScript);
    validateScript(newScript);
    
    // Auto-complete logic
    if (autoComplete) {
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = newScript.substring(0, cursorPosition);
      const words = textBeforeCursor.split(/\s+/);
      const currentWord = words[words.length - 1];
      
      if (currentWord.length > 1) {
        const suggestions = pineKeywords.filter(keyword => 
          keyword.toLowerCase().startsWith(currentWord.toLowerCase())
        );
        
        if (suggestions.length > 0) {
          setAutoCompleteOptions(suggestions);
          setSelectedSuggestion(0);
          setShowAutoComplete(true);
          
          // Calculate position for auto-complete dropdown
          const textarea = e.target;
          const rect = textarea.getBoundingClientRect();
          setAutoCompletePosition({
            top: rect.top + 20,
            left: rect.left + 10
          });
        } else {
          setShowAutoComplete(false);
        }
      } else {
        setShowAutoComplete(false);
      }
    }
  };
  
  // Handle keyboard events for auto-complete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAutoComplete && autoCompleteOptions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < autoCompleteOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : autoCompleteOptions.length - 1
          );
          break;
        case 'Tab':
        case 'Enter':
          e.preventDefault();
          insertAutoComplete(autoCompleteOptions[selectedSuggestion]);
          break;
        case 'Escape':
          setShowAutoComplete(false);
          break;
      }
    }
  };
  
  // Insert auto-complete suggestion
  const insertAutoComplete = (suggestion: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = script.substring(0, cursorPosition);
    const textAfterCursor = script.substring(cursorPosition);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1];
    
    const newText = textBeforeCursor.substring(0, textBeforeCursor.length - currentWord.length) + 
                   suggestion + textAfterCursor;
    
    setScript(newText);
    setShowAutoComplete(false);
    
    // Set cursor position after the inserted suggestion
    setTimeout(() => {
      const newCursorPosition = cursorPosition - currentWord.length + suggestion.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  // Save script
  const handleSave = () => {
    const name = prompt('Enter script name:');
    if (name) {
      const newScript = { name, script };
      setSavedScripts(prev => [...prev, newScript]);
      onSave?.(script);
    }
  };

  // Load script
  const handleLoad = (savedScript: {name: string, script: string}) => {
    setScript(savedScript.script);
    validateScript(savedScript.script);
  };

  // Export script
  const handleExport = () => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pine_script.pine';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import script
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setScript(content);
        validateScript(content);
      };
      reader.readAsText(file);
    }
  };

  // Run script
  const handleRun = () => {
    if (validationErrors.filter(e => e.type === 'error').length === 0) {
      onRun?.(script);
    } else {
      alert('Please fix all errors before running the script.');
    }
  };

  // Add line numbers
  const getLineNumbers = () => {
    const lines = script.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="text-gray-500 text-sm pr-2 text-right select-none">
        {index + 1}
      </div>
    ));
  };

  useEffect(() => {
    validateScript(script);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pine Script Editor
          </h2>
          <div className="flex items-center space-x-1">
            {validationErrors.filter(e => e.type === 'error').length === 0 ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {validationErrors.filter(e => e.type === 'error').length} errors,{' '}
              {validationErrors.filter(e => e.type === 'warning').length} warnings
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            disabled={validationErrors.filter(e => e.type === 'error').length > 0}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Upload className="h-4 w-4 mr-1" />
            Import
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex">
          {/* Line numbers */}
          <div className="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-4 px-2">
            {getLineNumbers()}
          </div>
          
          {/* Code editor */}
          <div className="flex-1 relative">
            {/* Syntax highlighting overlay */}
            {syntaxHighlighting && (
              <div 
                className="absolute inset-0 p-4 font-mono text-sm pointer-events-none overflow-hidden whitespace-pre-wrap break-words"
                style={{
                  color: 'transparent',
                  zIndex: 1,
                  wordWrap: wordWrap ? 'break-word' : 'normal'
                }}
                dangerouslySetInnerHTML={{
                  __html: applySyntaxHighlighting(script)
                }}
              />
            )}
            <textarea
              ref={textareaRef}
              value={script}
              onChange={handleScriptChange}
              onKeyDown={handleKeyDown}
              className={`w-full h-full p-4 font-mono text-sm border-none outline-none resize-none relative z-10 ${
                syntaxHighlighting 
                  ? 'bg-transparent text-transparent caret-gray-900 dark:caret-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
              }`}
              style={{
                wordWrap: wordWrap ? 'break-word' : 'normal',
                whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
              }}
              placeholder="Enter your Pine Script code here..."
              spellCheck={false}
            />
            
            {/* Auto-complete dropdown */}
            {showAutoComplete && autoCompleteOptions.length > 0 && (
              <div 
                className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
                style={{
                  top: autoCompletePosition.top,
                  left: autoCompletePosition.left,
                  minWidth: '200px'
                }}
              >
                {autoCompleteOptions.map((option, index) => (
                  <div
                    key={option}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      index === selectedSuggestion
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => insertAutoComplete(option)}
                  >
                    <span className="font-mono">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {showSettings && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Settings & Saved Scripts
              </h3>
              
              {/* Saved Scripts */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saved Scripts
                </h4>
                <div className="space-y-2">
                  {savedScripts.map((savedScript, index) => (
                    <button
                      key={index}
                      onClick={() => handleLoad(savedScript)}
                      className="w-full text-left p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {savedScript.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {savedScript.script.substring(0, 50)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Editor Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Editor Settings
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Auto-validation
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Line numbers
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={syntaxHighlighting}
                      onChange={(e) => setSyntaxHighlighting(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Syntax highlighting
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={autoComplete}
                      onChange={(e) => setAutoComplete(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Auto-complete
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={wordWrap}
                      onChange={(e) => setWordWrap(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Word wrap
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error panel */}
      {validationErrors.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-40 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Validation Results
            </h4>
            <div className="space-y-1">
              {validationErrors.map((error, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${
                    error.type === 'error'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}
                >
                  <span className="font-medium">Line {error.line}:</span> {error.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pine,.txt"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};

export default PineScriptEditor;