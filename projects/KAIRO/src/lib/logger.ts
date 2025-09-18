'use client';

import { errorHandler, ErrorType, ErrorSeverity } from './errorHandler';

// Logger utility to replace console usage with proper error handling
export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static isProduction = process.env.NODE_ENV === 'production';

  // Error logging
  static error(message: string, error?: Error | any, context?: string): void {
    if (error instanceof Error) {
      errorHandler.handle(error, context || 'Logger');
    } else {
      errorHandler.handle(new Error(message), context || 'Logger');
    }

    // Still log to console in development for debugging
    if (this.isDevelopment) {
      console.error(`[${context || 'Logger'}] ${message}`, error);
    }
  }

  // Warning logging
  static warn(message: string, context?: string, details?: any): void {
    const warningError = new Error(message);
    errorHandler.handle(warningError, context || 'Logger');

    if (this.isDevelopment) {
      console.warn(`[${context || 'Logger'}] ${message}`, details);
    }
  }

  // Info logging (for important events)
  static info(message: string, context?: string, details?: any): void {
    // Only log to console in development, or to external service in production
    if (this.isDevelopment) {
      console.log(`[${context || 'Logger'}] ${message}`, details);
    } else if (this.isProduction) {
      // In production, you might want to log to an external service
      // For now, we'll just store it internally
      this.logToService('info', message, context, details);
    }
  }

  // Debug logging (only in development)
  static debug(message: string, context?: string, details?: any): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG][${context || 'Logger'}] ${message}`, details);
    }
  }

  // Trading-specific logging
  static trading(message: string, details?: any, context?: string): void {
    const tradingError = new Error(message);
    errorHandler.handle(tradingError, context || 'Trading');

    if (this.isDevelopment) {
      console.log(`[TRADING][${context || 'Trading'}] ${message}`, details);
    }
  }

  // Performance logging
  static performance(operation: string, duration: number, context?: string): void {
    const message = `${operation} completed in ${duration}ms`;
    
    if (duration > 1000) {
      // Log slow operations as warnings
      this.warn(`Slow operation: ${message}`, context || 'Performance');
    } else {
      this.info(message, context || 'Performance');
    }
  }

  // User action logging
  static userAction(action: string, userId?: string, details?: any): void {
    const context = userId ? `User-${userId}` : 'User';
    this.info(`User action: ${action}`, context, details);
  }

  // API call logging
  static apiCall(method: string, url: string, status: number, duration: number): void {
    const message = `${method} ${url} - ${status} (${duration}ms)`;
    
    if (status >= 400) {
      this.error(`API Error: ${message}`, undefined, 'API');
    } else if (duration > 2000) {
      this.warn(`Slow API call: ${message}`, 'API');
    } else {
      this.debug(message, 'API');
    }
  }

  // Private method to log to external service (placeholder)
  private static logToService(level: string, message: string, context?: string, details?: any): void {
    // In a real application, you would send this to your logging service
    // For now, we'll just store it in memory or localStorage
    try {
      const logEntry = {
        level,
        message,
        context,
        details,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server'
      };

      // Store in localStorage for now (in production, send to logging service)
      if (typeof window !== 'undefined' && window.localStorage) {
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 logs to prevent storage overflow
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('app_logs', JSON.stringify(logs));
      }
    } catch (error) {
      // Fallback to console if logging service fails
      if (this.isDevelopment) {
        console.error('Failed to log to service:', error);
      }
    }
  }

  // Method to retrieve logs (useful for debugging)
  static getLogs(): any[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(localStorage.getItem('app_logs') || '[]');
      }
    } catch (error) {
      this.error('Failed to retrieve logs', error as Error, 'Logger');
    }
    return [];
  }

  // Method to clear logs
  static clearLogs(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('app_logs');
      }
    } catch (error) {
      this.error('Failed to clear logs', error as Error, 'Logger');
    }
  }
}

// Convenience exports
export const logger = Logger;
export default Logger;

// Hook for React components
export function useLogger() {
  return {
    error: Logger.error,
    warn: Logger.warn,
    info: Logger.info,
    debug: Logger.debug,
    trading: Logger.trading,
    performance: Logger.performance,
    userAction: Logger.userAction,
    apiCall: Logger.apiCall,
    getLogs: Logger.getLogs,
    clearLogs: Logger.clearLogs
  };
}