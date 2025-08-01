// Re-export common types
export * from './common';

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  text: string;
  value: string;
};

export type QuizAnswers = {
  [questionId: string]: string;
};



export type SkinScore = {
  overall: number;
  acne: number;
  hydration: number;
  sunDamage: number;
  dryness: number;
  recommendations: string[];
  issues: string[];
};

export type RoutineStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  time: 'morning' | 'evening' | 'both';
  completed?: boolean;
};

export type DailyTip = {
  id: string;
  text: string;
};

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
};

export type QuickPrompt = {
  id: string;
  text: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  skinScore?: SkinScore;
  quizCompleted: boolean;
  subscribed: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  age: number;
  quote: string;
  concern: string;
  duration: string;
  beforeImage: string;
  afterImage: string;
  improvement: number;
};

// Scan types
export interface ScanImage {
  uri: string;
  shouldMirror?: boolean;
  timestamp?: number;
}

export interface ScanResults {
  front?: ScanImage;
  right?: ScanImage;
  left?: ScanImage;
}

// Product types
export interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  ingredients: string[];
  price?: number;
  rating?: number;
}

// User types (unified)
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  quizCompleted?: boolean;
  skinScore?: SkinScore;
  subscribed?: boolean;
}