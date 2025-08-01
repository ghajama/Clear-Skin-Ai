import { DailyTip, QuickPrompt, QuizQuestion, RoutineStep, SkinScore, Testimonial } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'How would you describe your skin type?',
    options: [
      { id: '1a', text: 'Dry', value: 'dry' },
      { id: '1b', text: 'Oily', value: 'oily' },
      { id: '1c', text: 'Combination', value: 'combination' },
      { id: '1d', text: 'Normal', value: 'normal' },
    ],
  },
  {
    id: '2',
    question: 'What skin concerns do you have?',
    options: [
      { id: '2a', text: 'Acne', value: 'acne' },
      { id: '2b', text: 'Aging', value: 'aging' },
      { id: '2c', text: 'Hyperpigmentation', value: 'hyperpigmentation' },
      { id: '2d', text: 'Sensitivity', value: 'sensitivity' },
    ],
  },
  {
    id: '3',
    question: 'How often do you experience breakouts?',
    options: [
      { id: '3a', text: 'Rarely', value: 'rarely' },
      { id: '3b', text: 'Occasionally', value: 'occasionally' },
      { id: '3c', text: 'Frequently', value: 'frequently' },
      { id: '3d', text: 'Constantly', value: 'constantly' },
    ],
  },
  {
    id: '4',
    question: 'How does your skin feel after cleansing?',
    options: [
      { id: '4a', text: 'Tight and dry', value: 'tight' },
      { id: '4b', text: 'Comfortable', value: 'comfortable' },
      { id: '4c', text: 'Still oily', value: 'oily' },
      { id: '4d', text: 'Irritated', value: 'irritated' },
    ],
  },
  {
    id: '5',
    question: 'What is your current skincare routine like?',
    options: [
      { id: '5a', text: 'Minimal (1-2 products)', value: 'minimal' },
      { id: '5b', text: 'Basic (3-4 products)', value: 'basic' },
      { id: '5c', text: 'Extensive (5+ products)', value: 'extensive' },
      { id: '5d', text: 'None', value: 'none' },
    ],
  },
];

export const mockSkinScore: SkinScore = {
  overall: 72,
  acne: 68,
  hydration: 65,
  sunDamage: 75,
  dryness: 70,
  recommendations: [
    'Use a gentle cleanser twice daily',
    'Apply moisturizer while skin is damp',
    'Use SPF 30+ sunscreen daily'
  ],
  issues: []
};

export const mockRoutineSteps: RoutineStep[] = [
  {
    id: '1',
    title: 'Gentle Cleanser',
    description: 'Wash face with lukewarm water and a gentle cleanser to remove impurities without stripping natural oils.',
    icon: 'droplet',
    time: 'both',
  },
  {
    id: '2',
    title: 'Hydrating Toner',
    description: 'Apply toner to balance pH levels and prepare skin for better absorption of following products.',
    icon: 'spray-can',
    time: 'both',
  },
  {
    id: '3',
    title: 'Vitamin C Serum',
    description: 'Apply vitamin C serum to brighten skin and protect against environmental damage.',
    icon: 'sun',
    time: 'morning',
  },
  {
    id: '4',
    title: 'Moisturizer',
    description: 'Apply moisturizer to hydrate and lock in moisture.',
    icon: 'droplets',
    time: 'both',
  },
  {
    id: '5',
    title: 'Sunscreen',
    description: 'Apply broad-spectrum SPF 30+ sunscreen to protect against UV damage.',
    icon: 'shield',
    time: 'morning',
  },
  {
    id: '6',
    title: 'Retinol Serum',
    description: 'Apply retinol serum to promote cell turnover and reduce signs of aging.',
    icon: 'moon',
    time: 'evening',
  },
];

export const dailyTips: DailyTip[] = [
  { id: '1', text: 'Stay hydrated! Drinking water helps maintain skin elasticity.' },
  { id: '2', text: 'Always remove makeup before bed to let your skin breathe overnight.' },
  { id: '3', text: 'Apply products from thinnest to thickest consistency for best absorption.' },
  { id: '4', text: "Don't forget your neck when applying skincare products!" },
  { id: '5', text: 'Exfoliate 1-2 times a week, not daily, to avoid irritation.' },
];

export const quickPrompts: QuickPrompt[] = [
  { id: '1', text: 'Why is my skin dull?' },
  { id: '2', text: 'How to reduce redness?' },
  { id: '3', text: 'Best ingredients for acne?' },
  { id: '4', text: 'How often should I exfoliate?' },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah J.',
    age: 28,
    quote: "After 4 weeks, my skin is clearer than it's been in years!",
    concern: 'Acne & Breakouts',
    duration: '4 weeks',
    beforeImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400',
    afterImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400',
    improvement: 85,
  },
  {
    id: '2',
    name: 'Michael T.',
    age: 35,
    quote: 'The personalized routine finally helped me tackle my dry patches.',
    concern: 'Dryness & Texture',
    duration: '6 weeks',
    beforeImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    afterImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    improvement: 78,
  },
  {
    id: '3',
    name: 'Aisha K.',
    age: 32,
    quote: 'My hyperpigmentation has faded dramatically in just 2 months!',
    concern: 'Dark Spots & Pigmentation',
    duration: '8 weeks',
    beforeImage: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=400',
    afterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    improvement: 92,
  },
];