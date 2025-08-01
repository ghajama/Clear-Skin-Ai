// Suppress React Native Web warnings on web platform
if (typeof window !== 'undefined') {
  // Override console.warn to filter out React Native Web deprecation warnings
  const originalWarn = console.warn;
  const originalError = console.error;

  // Immediately override to catch early warnings
  (window as any).__SUPPRESS_WARNINGS__ = true;
  
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress specific React Native Web warnings
      if (message.includes('"shadow*" style props are deprecated')) return;
      if (message.includes('props.pointerEvents is deprecated')) return;
      if (message.includes('fetchPriority')) return;
      if (message.includes('useNativeDriver')) return;
      if (message.includes('shadow')) return; // Catch all shadow-related warnings
      if (message.includes('pointerEvents')) return; // Catch all pointerEvents warnings
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress React fetchPriority warnings
      if (message.includes('React does not recognize the `fetchPriority` prop')) return;
      if (message.includes('fetchpriority')) return;
    }
    originalError.apply(console, args);
  };
  
  // Also suppress React warnings about unknown props
  const originalReactWarn = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot;
  if (originalReactWarn) {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = (...args: any[]) => {
      try {
        return originalReactWarn.apply(this, args);
      } catch (error) {
        // Suppress React DevTools errors
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as Error).message;
          if (message.includes('fetchPriority') || message.includes('shadow')) {
            return;
          }
        }
        throw error;
      }
    };
  }
}

export {};
