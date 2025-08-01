import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants/app';

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!VALIDATION_RULES.EMAIL.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long` 
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long` 
    };
  }

  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be no more than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters long` 
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
};

// Age validation
export const validateAge = (age: number): ValidationResult => {
  if (!age) {
    return { isValid: false, error: 'Age is required' };
  }

  if (age < 13) {
    return { isValid: false, error: 'You must be at least 13 years old to use this app' };
  }

  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid age' };
  }

  return { isValid: true };
};

// Phone number validation (basic)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// Image validation
export const validateImage = (imageUri: string, maxSizeBytes?: number): ValidationResult => {
  if (!imageUri) {
    return { isValid: false, error: 'Image is required' };
  }

  // Check if it's a valid URI format
  if (!imageUri.startsWith('file://') && !imageUri.startsWith('http://') && !imageUri.startsWith('https://')) {
    return { isValid: false, error: 'Invalid image format' };
  }

  // Additional size validation would require loading the image
  // This is a basic format check
  return { isValid: true };
};

// Quiz answer validation
export const validateQuizAnswer = (answer: any): ValidationResult => {
  if (answer === null || answer === undefined || answer === '') {
    return { isValid: false, error: 'Please select an answer' };
  }

  return { isValid: true };
};

// Message validation
export const validateMessage = (message: string): ValidationResult => {
  if (!message || !message.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 1000) {
    return { isValid: false, error: 'Message is too long (maximum 1000 characters)' };
  }

  return { isValid: true };
};

// Generic form validation
export const validateForm = (
  fields: Record<string, any>,
  validators: Record<string, (value: any) => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, value] of Object.entries(fields)) {
    const validator = validators[fieldName];
    if (validator) {
      const result = validator(value);
      if (!result.isValid) {
        errors[fieldName] = result.error || 'Invalid value';
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize input
export const validateAndSanitize = (
  input: string,
  validator: (value: string) => ValidationResult
): { isValid: boolean; value: string; error?: string } => {
  const validation = validator(input);
  
  if (!validation.isValid) {
    return {
      isValid: false,
      value: input,
      error: validation.error,
    };
  }

  return {
    isValid: true,
    value: sanitizeInput(input),
  };
};
