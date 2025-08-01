import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export interface AppError {
  id: string;
  message: string;
  type: 'network' | 'auth' | 'validation' | 'unknown';
  timestamp: number;
  details?: any;
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const handleError = useCallback((error: Error | string, type: AppError['type'] = 'unknown', details?: any) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    const appError: AppError = {
      id: Date.now().toString(),
      message: errorMessage,
      type,
      timestamp: Date.now(),
      details,
    };

    setErrors(prev => [...prev, appError]);

    // Log error for debugging
    console.error(`[${type.toUpperCase()}] Error:`, errorMessage, details);

    // Show user-friendly error message
    const userMessage = getUserFriendlyMessage(errorMessage, type);
    
    Alert.alert(
      'Error',
      userMessage,
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    handleError,
    clearError,
    clearAllErrors,
  };
};

const getUserFriendlyMessage = (errorMessage: string, type: AppError['type']): string => {
  switch (type) {
    case 'network':
      return 'Network connection issue. Please check your internet connection and try again.';
    case 'auth':
      if (errorMessage.includes('Invalid login credentials')) {
        return 'Invalid email or password. Please check your credentials.';
      }
      if (errorMessage.includes('Email not confirmed')) {
        return 'Please check your email and confirm your account.';
      }
      return 'Authentication error. Please try signing in again.';
    case 'validation':
      return errorMessage; // Validation messages are usually user-friendly
    default:
      return 'Something went wrong. Please try again.';
  }
};

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandler = (handleError: (error: Error | string, type: AppError['type'], details?: any) => void) => {
  // Handle unhandled promise rejections
  const originalHandler = global.ErrorUtils?.setGlobalHandler;
  
  if (originalHandler) {
    global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      handleError(error, 'unknown', { isFatal });
      
      // Call original handler if it exists
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
};
