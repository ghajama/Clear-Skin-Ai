// App-wide constants
export const APP_CONFIG = {
  NAME: 'Clear Skin AI',
  VERSION: '1.0.0',
  BUNDLE_ID: 'app.rork.ai-skincare-companion-1ahyfo8',
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Storage Configuration
export const STORAGE_CONFIG = {
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CACHE_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  AUTO_SAVE_DELAY: 1000, // 1 second
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  COMPRESS_FORMAT: 'jpeg' as const,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_BATCH_SIZE: 50,
} as const;

// Quiz Configuration
export const QUIZ_CONFIG = {
  MIN_ANSWERS_REQUIRED: 5,
  MAX_RETRIES: 3,
} as const;

// Routine Configuration
export const ROUTINE_CONFIG = {
  DEFAULT_STEPS: 6,
  REMINDER_INTERVALS: [
    { label: 'Morning', time: '08:00' },
    { label: 'Evening', time: '20:00' },
  ] as const,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network connection issue. Please check your internet connection.',
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials.',
  AUTH_EMAIL_NOT_CONFIRMED: 'Please check your email and confirm your account.',
  AUTH_GENERIC: 'Authentication error. Please try signing in again.',
  VALIDATION_GENERIC: 'Please check your input and try again.',
  GENERIC: 'Something went wrong. Please try again.',
  IMAGE_UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  CAMERA_PERMISSION: 'Camera permission is required to take photos.',
  STORAGE_PERMISSION: 'Storage permission is required to save images.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  IMAGE_UPLOADED: 'Image uploaded successfully!',
  QUIZ_COMPLETED: 'Quiz completed successfully!',
  ROUTINE_UPDATED: 'Routine updated successfully!',
  LOGOUT: 'Logged out successfully!',
} as const;

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_PERFORMANCE_MONITORING: __DEV__,
  ENABLE_MEMORY_MONITORING: __DEV__,
  ENABLE_DETAILED_LOGGING: __DEV__,
  MOCK_API_DELAY: 1000, // 1 second for mock responses
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_BIOMETRIC_AUTH: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false, // Disabled for privacy
  ENABLE_CRASH_REPORTING: false, // Disabled for privacy
  ENABLE_OFFLINE_MODE: true,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;
