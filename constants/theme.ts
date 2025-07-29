import { Platform } from 'react-native';

export const colors = {
  primary: '#00D4AA', // Brilliant turquoise
  secondary: '#FFF8F0', // Cream texture
  accent: '#26E0C7', // Bright turquoise accent
  background: '#FFF8F0',
  card: '#FFFFFF',
  text: {
    primary: '#2C3E50',
    secondary: '#5A6C7D',
    light: '#FFFFFF',
  },
  border: '#E8F4F8',
  success: '#00D4AA',
  error: '#FF6B6B',
  warning: '#FFD93D',
  info: '#3498DB',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
};

export const typography = {
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    bold: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-medium',
    heading: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  fontSize: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
};