import { DEV_CONFIG } from '@/constants/app';

// Logger levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Logger configuration
const LOGGER_CONFIG = {
  level: __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR,
  enableColors: __DEV__,
  enableTimestamp: true,
  enableStackTrace: __DEV__,
};

// Color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Format timestamp
const formatTimestamp = (): string => {
  const now = new Date();
  return now.toISOString();
};

// Format log message
const formatMessage = (
  level: LogLevel,
  message: string,
  context?: string,
  data?: any
): string => {
  let formattedMessage = '';

  // Add timestamp
  if (LOGGER_CONFIG.enableTimestamp) {
    formattedMessage += `[${formatTimestamp()}] `;
  }

  // Add level
  const levelName = LogLevel[level];
  if (LOGGER_CONFIG.enableColors) {
    const color = getColorForLevel(level);
    formattedMessage += `${color}[${levelName}]${COLORS.reset} `;
  } else {
    formattedMessage += `[${levelName}] `;
  }

  // Add context
  if (context) {
    formattedMessage += `[${context}] `;
  }

  // Add message
  formattedMessage += message;

  // Add data if provided
  if (data !== undefined) {
    formattedMessage += ` ${JSON.stringify(data, null, 2)}`;
  }

  return formattedMessage;
};

// Get color for log level
const getColorForLevel = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.DEBUG:
      return COLORS.cyan;
    case LogLevel.INFO:
      return COLORS.green;
    case LogLevel.WARN:
      return COLORS.yellow;
    case LogLevel.ERROR:
      return COLORS.red;
    default:
      return COLORS.white;
  }
};

// Logger class
class Logger {
  private shouldLog(level: LogLevel): boolean {
    return level >= LOGGER_CONFIG.level;
  }

  debug(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(formatMessage(LogLevel.DEBUG, message, context, data));
    }
  }

  info(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(formatMessage(LogLevel.INFO, message, context, data));
    }
  }

  warn(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(formatMessage(LogLevel.WARN, message, context, data));
    }
  }

  error(message: string, context?: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(formatMessage(LogLevel.ERROR, message, context, data));
      
      // Add stack trace in development
      if (LOGGER_CONFIG.enableStackTrace && data instanceof Error) {
        console.error(data.stack);
      }
    }
  }

  // Performance logging
  time(label: string): void {
    if (DEV_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (DEV_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
      console.timeEnd(label);
    }
  }

  // Group logging
  group(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions for common use cases
export const logAuth = (message: string, data?: any) => 
  logger.info(message, 'Auth', data);

export const logSkincare = (message: string, data?: any) => 
  logger.info(message, 'Skincare', data);

export const logChat = (message: string, data?: any) => 
  logger.info(message, 'Chat', data);

export const logStorage = (message: string, data?: any) => 
  logger.info(message, 'Storage', data);

export const logNetwork = (message: string, data?: any) => 
  logger.info(message, 'Network', data);

export const logPerformance = (message: string, data?: any) => 
  logger.debug(message, 'Performance', data);

// Override console methods in production to prevent logging
if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical issues
}
