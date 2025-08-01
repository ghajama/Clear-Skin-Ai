// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// Form types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  submitError?: string;
}

// Event types
export interface BaseEvent {
  id: string;
  timestamp: number;
  type: string;
}

export interface UserEvent extends BaseEvent {
  userId: string;
  sessionId: string;
}

// Storage types
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface StorageOptions {
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
}

// Image types
export interface ImageData {
  uri: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
  shouldMirror?: boolean;
  timestamp?: number;
}

export interface ImageUploadOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

// Navigation types
export interface NavigationParams {
  [key: string]: any;
}

export interface RouteInfo {
  name: string;
  params?: NavigationParams;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

// Component props types
export interface BaseComponentProps {
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface TouchableComponentProps extends BaseComponentProps {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Error types
export interface AppError {
  id: string;
  message: string;
  type: 'network' | 'auth' | 'validation' | 'unknown';
  timestamp: number;
  details?: any;
  stack?: string;
}

// Performance types
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  networkRequests?: number;
  errorCount?: number;
}

// Feature flag types
export interface FeatureFlags {
  [key: string]: boolean;
}

// Configuration types
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildNumber: string;
  features: FeatureFlags;
}

// Utility types for better type safety
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type NonEmptyArray<T> = [T, ...T[]];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
