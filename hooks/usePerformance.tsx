import { useCallback, useEffect, useRef, useMemo } from 'react';

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
};

// Memoized selector hook for complex state selections
export const useSelector = <T, R>(
  state: T,
  selector: (state: T) => R,
  deps?: React.DependencyList
): R => {
  return useMemo(() => selector(state), deps ? [state, ...deps] : [state]);
};

// Previous value hook for comparison
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Stable callback hook that doesn't change reference unless dependencies change
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;
    
    if (__DEV__) {
      console.log(`[Performance] ${componentName} - Render #${renderCount.current} took ${renderTime}ms`);
    }
    
    startTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<any>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting);
      },
      options
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
};

// Memory usage monitoring (development only)
export const useMemoryMonitor = (componentName: string) => {
  useEffect(() => {
    if (__DEV__ && (performance as any).memory) {
      const memory = (performance as any).memory;
      console.log(`[Memory] ${componentName} - Used: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
    }
  });
};
