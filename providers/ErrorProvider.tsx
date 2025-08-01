import React, { createContext, useContext, useEffect } from 'react';
import { useErrorHandler, setupGlobalErrorHandler } from '@/hooks/useErrorHandler';

const ErrorContext = createContext<ReturnType<typeof useErrorHandler> | null>(null);

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const errorHandler = useErrorHandler();

  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandler(errorHandler.handleError);
  }, [errorHandler.handleError]);

  return (
    <ErrorContext.Provider value={errorHandler}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useGlobalErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useGlobalErrorHandler must be used within an ErrorProvider');
  }
  return context;
};
