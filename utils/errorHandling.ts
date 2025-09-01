// Utility functions for error handling and logging

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
  userId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    return `[${entry.timestamp.toISOString()}] ${entry.level.toUpperCase()}: ${entry.message}`;
  }

  info(message: string, data?: unknown, userId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: 'info',
      message,
      data,
      userId
    };
    
    if (this.isDevelopment) {
      console.info(this.formatMessage(entry), data);
    }
  }

  warn(message: string, data?: unknown, userId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: 'warn',
      message,
      data,
      userId
    };
    
    console.warn(this.formatMessage(entry), data);
  }

  error(message: string, error?: Error, data?: unknown, userId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: 'error',
      message,
      data: { error: error?.message, stack: error?.stack, ...(data as object) },
      userId
    };
    
    console.error(this.formatMessage(entry), entry.data);
  }

  debug(message: string, data?: unknown, userId?: string): void {
    if (!this.isDevelopment) return;
    
    const entry: LogEntry = {
      timestamp: new Date(),
      level: 'debug',
      message,
      data,
      userId
    };
    
    console.debug(this.formatMessage(entry), data);
  }
}

// Create a singleton logger instance
export const logger = new Logger();

// Error handling utility functions
export const handleAsyncError = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(
        'Async operation failed',
        error instanceof Error ? error : new Error(String(error))
      );
      return null;
    }
  };
};

export const safeParseJSON = <T = unknown>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    logger.warn('Failed to parse JSON', { jsonString, error });
    return null;
  }
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`Attempt ${attempt}/${maxRetries} failed`, lastError);
      
      if (attempt === maxRetries) {
        logger.error('All retry attempts failed', lastError);
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

// Type-safe error checking
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// Network error handling
export const handleNetworkError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const networkError = error as {
      response?: {
        status?: number;
        data?: { message?: string };
      };
    };
    
    if (networkError.response?.status === 401) {
      return 'Authentication required. Please sign in.';
    } else if (networkError.response?.status === 403) {
      return 'Access denied. You don\'t have permission to perform this action.';
    } else if (networkError.response?.status === 404) {
      return 'The requested resource was not found.';
    } else if (networkError.response?.status && networkError.response.status >= 500) {
      return 'Server error. Please try again later.';
    } else if (networkError.response?.data?.message) {
      return networkError.response.data.message;
    }
  }
  
  if (isError(error)) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Environment variable validation
export const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === '') {
    const error = new Error(`Environment variable ${name} is not defined or empty`);
    logger.error('Environment variable validation failed', error);
    throw error;
  }
  return value;
};

// API response validation
export const validateApiResponse = <T>(response: unknown): T => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format');
  }
  
  const validatedResponse = response as { success?: boolean; data?: T; message?: string };
  
  if (validatedResponse.success === false) {
    throw new Error(validatedResponse.message || 'API request failed');
  }
  
  return response as T;
};