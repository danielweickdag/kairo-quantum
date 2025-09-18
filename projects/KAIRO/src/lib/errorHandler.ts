'use client';

import { toast } from 'react-hot-toast';

// Error types for better categorization
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  TRADING = 'trading',
  COMPILATION = 'compilation',
  SYSTEM = 'system',
  USER_INPUT = 'user_input'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Standardized error interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: string;
}

// Error handler configuration
interface ErrorHandlerConfig {
  showToast: boolean;
  logToConsole: boolean;
  logToService: boolean;
  retryable: boolean;
}

// Default configurations for different error types
const DEFAULT_CONFIGS: Record<ErrorType, ErrorHandlerConfig> = {
  [ErrorType.VALIDATION]: {
    showToast: true,
    logToConsole: false,
    logToService: false,
    retryable: false
  },
  [ErrorType.NETWORK]: {
    showToast: true,
    logToConsole: true,
    logToService: true,
    retryable: true
  },
  [ErrorType.AUTHENTICATION]: {
    showToast: true,
    logToConsole: true,
    logToService: true,
    retryable: false
  },
  [ErrorType.TRADING]: {
    showToast: true,
    logToConsole: true,
    logToService: true,
    retryable: true
  },
  [ErrorType.COMPILATION]: {
    showToast: false,
    logToConsole: true,
    logToService: false,
    retryable: false
  },
  [ErrorType.SYSTEM]: {
    showToast: true,
    logToConsole: true,
    logToService: true,
    retryable: false
  },
  [ErrorType.USER_INPUT]: {
    showToast: true,
    logToConsole: false,
    logToService: false,
    retryable: false
  }
};

// Centralized error handler class
class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private maxQueueSize = 100;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Main error handling method
  handle(error: Error | AppError | string, context?: string, config?: Partial<ErrorHandlerConfig>): AppError {
    const appError = this.normalizeError(error, context);
    const finalConfig = { ...DEFAULT_CONFIGS[appError.type], ...config };

    // Add to error queue
    this.addToQueue(appError);

    // Handle based on configuration
    if (finalConfig.showToast) {
      this.showToast(appError);
    }

    if (finalConfig.logToConsole) {
      this.logToConsole(appError);
    }

    if (finalConfig.logToService) {
      this.logToService(appError);
    }

    return appError;
  }

  // Normalize different error types to AppError
  private normalizeError(error: Error | AppError | string, context?: string): AppError {
    if (typeof error === 'string') {
      return {
        type: ErrorType.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        message: error,
        timestamp: new Date(),
        context
      };
    }

    if (error instanceof Error) {
      return {
        type: this.inferErrorType(error),
        severity: this.inferSeverity(error),
        message: error.message,
        details: {
          name: error.name,
          stack: error.stack
        },
        timestamp: new Date(),
        context
      };
    }

    // Already an AppError
    return {
      ...error,
      context: context || error.context
    };
  }

  // Infer error type from Error object
  private inferErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (message.includes('validation') || message.includes('required') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    if (message.includes('network') || message.includes('fetch') || name.includes('network')) {
      return ErrorType.NETWORK;
    }
    if (message.includes('auth') || message.includes('token') || message.includes('unauthorized')) {
      return ErrorType.AUTHENTICATION;
    }
    if (message.includes('trade') || message.includes('order') || message.includes('position')) {
      return ErrorType.TRADING;
    }
    if (message.includes('compile') || message.includes('syntax') || message.includes('parse')) {
      return ErrorType.COMPILATION;
    }

    return ErrorType.SYSTEM;
  }

  // Infer severity from Error object
  private inferSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();

    if (message.includes('critical') || message.includes('fatal')) {
      return ErrorSeverity.CRITICAL;
    }
    if (message.includes('failed') || message.includes('error')) {
      return ErrorSeverity.HIGH;
    }
    if (message.includes('warning') || message.includes('deprecated')) {
      return ErrorSeverity.MEDIUM;
    }

    return ErrorSeverity.LOW;
  }

  // Show appropriate toast based on error severity
  private showToast(error: AppError): void {
    const message = this.formatUserMessage(error);

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        toast.error(message, { duration: 8000 });
        break;
      case ErrorSeverity.HIGH:
        toast.error(message, { duration: 6000 });
        break;
      case ErrorSeverity.MEDIUM:
        toast(message, { icon: '⚠️', duration: 4000 });
        break;
      case ErrorSeverity.LOW:
        toast(message, { icon: 'ℹ️', duration: 3000 });
        break;
    }
  }

  // Format user-friendly error messages
  private formatUserMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Authentication failed. Please log in again.';
      case ErrorType.TRADING:
        return `Trading error: ${error.message}`;
      case ErrorType.COMPILATION:
        return `Compilation error: ${error.message}`;
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Log to console with proper formatting
  private logToConsole(error: AppError): void {
    const logMethod = error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH 
      ? console.error 
      : console.warn;

    logMethod(`[${error.type.toUpperCase()}] ${error.message}`, {
      severity: error.severity,
      timestamp: error.timestamp,
      context: error.context,
      details: error.details
    });
  }

  // Log to external service (placeholder for future implementation)
  private logToService(error: AppError): void {
    // In production, this would send to error tracking service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
      console.log('Would log to external service:', error);
    }
  }

  // Add error to queue for analysis
  private addToQueue(error: AppError): void {
    this.errorQueue.push(error);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  // Get recent errors for debugging
  getRecentErrors(count: number = 10): AppError[] {
    return this.errorQueue.slice(-count);
  }

  // Clear error queue
  clearErrors(): void {
    this.errorQueue = [];
  }

  // Get error statistics
  getErrorStats(): { total: number; byType: Record<ErrorType, number>; bySeverity: Record<ErrorSeverity, number> } {
    const stats = {
      total: this.errorQueue.length,
      byType: {} as Record<ErrorType, number>,
      bySeverity: {} as Record<ErrorSeverity, number>
    };

    // Initialize counters
    Object.values(ErrorType).forEach(type => {
      stats.byType[type] = 0;
    });
    Object.values(ErrorSeverity).forEach(severity => {
      stats.bySeverity[severity] = 0;
    });

    // Count errors
    this.errorQueue.forEach(error => {
      stats.byType[error.type]++;
      stats.bySeverity[error.severity]++;
    });

    return stats;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions for common error types
export const handleValidationError = (message: string, context?: string) => {
  return errorHandler.handle({
    type: ErrorType.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    message,
    timestamp: new Date()
  }, context);
};

export const handleNetworkError = (error: Error, context?: string) => {
  return errorHandler.handle(error, context, {
    showToast: true,
    logToConsole: true,
    logToService: true
  });
};

export const handleTradingError = (message: string, details?: any, context?: string) => {
  return errorHandler.handle({
    type: ErrorType.TRADING,
    severity: ErrorSeverity.HIGH,
    message,
    details,
    timestamp: new Date()
  }, context);
};

export const handleCompilationError = (line: number, message: string, type: 'error' | 'warning' = 'error') => {
  return errorHandler.handle({
    type: ErrorType.COMPILATION,
    severity: type === 'error' ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
    message: `Line ${line}: ${message}`,
    details: { line, type },
    timestamp: new Date()
  }, 'Pine Script Compilation');
};

// React hook for error handling
export const useErrorHandler = () => {
  return {
    handleError: (error: Error | string, context?: string) => errorHandler.handle(error, context),
    handleValidationError,
    handleNetworkError,
    handleTradingError,
    handleCompilationError,
    getRecentErrors: () => errorHandler.getRecentErrors(),
    getErrorStats: () => errorHandler.getErrorStats(),
    clearErrors: () => errorHandler.clearErrors()
  };
};

export default errorHandler;