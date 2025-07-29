import { SkinScore, QuizAnswers } from '@/types';
import { api } from '@/lib/api';

export const skincareService = {
  async analyzeSkin(quizAnswers: QuizAnswers): Promise<SkinScore> {
    // Mock analysis - in a real app, this would use AI
    const mockScore: SkinScore = {
      overall: Math.floor(Math.random() * 30) + 70, // 70-100
      hydration: Math.floor(Math.random() * 40) + 60, // 60-100
      texture: Math.floor(Math.random() * 35) + 65, // 65-100
      pigmentation: Math.floor(Math.random() * 25) + 75, // 75-100
      sensitivity: Math.floor(Math.random() * 20) + 80, // 80-100
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
        content: `Based on my skin analysis (Overall: ${skinScore.overall}, Hydration: ${skinScore.hydration}, Texture: ${skinScore.texture}, Pigmentation: ${skinScore.pigmentation}, Sensitivity: ${skinScore.sensitivity}) and my quiz answers: ${JSON.stringify(quizAnswers)}, please create a personalized skincare routine.`,
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

    if (skinScore.texture < 75) {
      tips.push('Consider gentle exfoliation 2-3 times per week');
      tips.push('Use products with niacinamide to improve texture');
    }

    if (skinScore.pigmentation < 80) {
      tips.push('Use vitamin C serum in the morning');
      tips.push('Always apply SPF 30+ sunscreen');
    }

    if (skinScore.sensitivity > 90) {
      tips.push('Choose fragrance-free products');
      tips.push('Patch test new products before full application');
    }

    return tips.length > 0 ? tips : [
      'Your skin looks great! Maintain your current routine',
      'Don\'t forget daily sunscreen application',
      'Stay hydrated and get enough sleep',
    ];
  },
};