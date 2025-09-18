'use client';

import { errorHandler, ErrorSeverity } from './errorHandler';

// Chunk loading error handler
export class ChunkLoadErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1 second

  static handleChunkError(error: any, chunkId?: string): Promise<void> {
    const errorMessage = error?.message || 'Unknown chunk loading error';
    const isChunkError = errorMessage.includes('ChunkLoadError') || 
                        errorMessage.includes('Loading chunk') ||
                        errorMessage.includes('Loading CSS chunk');

    if (!isChunkError) {
      // Not a chunk error, handle normally
      errorHandler.handle(error, 'ChunkErrorHandler');
      return Promise.reject(error);
    }

    const key = chunkId || errorMessage;
    const attempts = this.retryAttempts.get(key) || 0;

    if (attempts >= this.maxRetries) {
      // Max retries reached, log error and reload page
      errorHandler.handle(error, 'ChunkErrorHandler - Max Retries Reached');

      // Clear retry attempts for this chunk
      this.retryAttempts.delete(key);
      
      // Reload the page as last resort
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      
      return Promise.reject(error);
    }

    // Increment retry count
    this.retryAttempts.set(key, attempts + 1);

    // Log retry attempt
    errorHandler.handle(error, 'ChunkErrorHandler - Retry Attempt');

    // Return a promise that resolves after retry delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Try to reload the failed chunk
        if (typeof window !== 'undefined' && chunkId) {
          // Clear any cached modules for this chunk
          this.clearChunkCache(chunkId);
        }
        resolve();
      }, this.retryDelay * (attempts + 1)); // Exponential backoff
    });
  }

  private static clearChunkCache(chunkId: string): void {
    try {
      // Clear webpack chunk cache if available
      if (typeof window !== 'undefined' && (window as any).__webpack_require__) {
        const webpackRequire = (window as any).__webpack_require__;
        
        // Clear chunk from cache
        if (webpackRequire.cache) {
          Object.keys(webpackRequire.cache).forEach(key => {
            if (key.includes(chunkId)) {
              delete webpackRequire.cache[key];
            }
          });
        }

        // Clear installed chunks
        if (webpackRequire.installedChunks) {
          delete webpackRequire.installedChunks[chunkId];
        }
      }
    } catch (cacheError) {
      // Ignore cache clearing errors
      console.warn('Failed to clear chunk cache:', cacheError);
    }
  }

  static resetRetryCount(chunkId?: string): void {
    if (chunkId) {
      this.retryAttempts.delete(chunkId);
    } else {
      this.retryAttempts.clear();
    }
  }

  static getRetryCount(chunkId: string): number {
    return this.retryAttempts.get(chunkId) || 0;
  }
}

// Global error handler for unhandled chunk loading errors
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections (common for chunk loading errors)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (error && (error.name === 'ChunkLoadError' || 
                  (error.message && error.message.includes('Loading chunk')))) {
      event.preventDefault(); // Prevent default browser error handling
      ChunkLoadErrorHandler.handleChunkError(error);
    }
  });

  // Handle general errors that might be chunk-related
  window.addEventListener('error', (event) => {
    const error = event.error;
    if (error && (error.name === 'ChunkLoadError' || 
                  (error.message && error.message.includes('Loading chunk')))) {
      event.preventDefault();
      ChunkLoadErrorHandler.handleChunkError(error);
    }
  });
}

// React error boundary integration
export function withChunkErrorHandling<T extends (...args: any[]) => any>(
  fn: T
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      
      // Handle promises that might reject with chunk errors
      if (result && typeof result.catch === 'function') {
        return result.catch((error: any) => {
          if (error && (error.name === 'ChunkLoadError' || 
                       (error.message && error.message.includes('Loading chunk')))) {
            return ChunkLoadErrorHandler.handleChunkError(error);
          }
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      if (error && ((error as any).name === 'ChunkLoadError' || 
                   ((error as any).message && (error as any).message.includes('Loading chunk')))) {
        ChunkLoadErrorHandler.handleChunkError(error);
        return;
      }
      throw error;
    }
  }) as T;
}

// Hook for React components
export function useChunkErrorHandler() {
  return {
    handleChunkError: ChunkLoadErrorHandler.handleChunkError,
    resetRetryCount: ChunkLoadErrorHandler.resetRetryCount,
    getRetryCount: ChunkLoadErrorHandler.getRetryCount
  };
}

export default ChunkLoadErrorHandler;