import { SkinScore, QuizAnswers } from '@/types';
import { api } from '@/lib/api';

export const skincareService = {
  async analyzeSkin(quizAnswers: QuizAnswers): Promise<SkinScore> {
    // Mock analysis - in a real app, this would use AI
    const mockScore: SkinScore = {
      overall: Math.floor(Math.random() * 30) + 70, // 70-100
      acne: Math.floor(Math.random() * 40) + 60, // 60-100
      hydration: Math.floor(Math.random() * 40) + 60, // 60-100
      sunDamage: Math.floor(Math.random() * 35) + 65, // 65-100
      dryness: Math.floor(Math.random() * 25) + 75, // 75-100
      recommendations: [
        'Use a gentle cleanser twice daily',
        'Apply moisturizer while skin is damp',
        'Use SPF 30+ sunscreen daily'
      ],
      issues: []
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return mockScore;
  },

  async generatePersonalizedRoutine(skinScore: SkinScore, quizAnswers: QuizAnswers) {
    const messages = [
      {
        role: 'system' as const,
        content: 'You are a professional skincare expert. Generate a personalized skincare routine based on the user\'s skin analysis and quiz answers. Provide specific product recommendations and usage instructions.',
      },
      {
        role: 'user' as const,
        content: `Based on my skin analysis (Overall: ${skinScore.overall}, Acne: ${skinScore.acne}, Hydration: ${skinScore.hydration}, Sun Damage: ${skinScore.sunDamage}, Dryness: ${skinScore.dryness}) and my quiz answers: ${JSON.stringify(quizAnswers)}, please create a personalized skincare routine.`,
      },
    ];

    try {
      const response = await api.generateText(messages);
      return response.completion;
    } catch (error) {
      console.error('Failed to generate routine:', error);
      return 'Unable to generate personalized routine at this time. Please try again later.';
    }
  },

  async getSkincareTips(skinScore: SkinScore): Promise<string[]> {
    const tips: string[] = [];

    if (skinScore.hydration < 70) {
      tips.push('Use a hydrating serum with hyaluronic acid');
      tips.push('Apply moisturizer while skin is still damp');
    }

    if (skinScore.acne > 30) {
      tips.push('Consider gentle exfoliation 2-3 times per week');
      tips.push('Use products with salicylic acid for acne control');
    }

    if (skinScore.sunDamage > 30) {
      tips.push('Use vitamin C serum in the morning');
      tips.push('Always apply SPF 30+ sunscreen');
    }

    if (skinScore.dryness > 30) {
      tips.push('Choose fragrance-free products');
      tips.push('Use a rich moisturizer with ceramides');
    }

    return tips.length > 0 ? tips : [
      'Your skin looks great! Maintain your current routine',
      'Don\'t forget daily sunscreen application',
      'Stay hydrated and get enough sleep',
    ];
  },
};