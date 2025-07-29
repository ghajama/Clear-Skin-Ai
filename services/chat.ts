import { Message } from '@/types';
import { api } from '@/lib/api';
import { generateId } from '@/lib/utils';

export const chatService = {
  async sendMessage(
    message: string, 
    chatHistory: Message[], 
    userContext?: {
      skinScore?: any;
      quizAnswers?: any;
    }
  ): Promise<Message> {
    const systemMessage = {
      role: 'system' as const,
      content: `You are a helpful AI skincare assistant. You provide personalized skincare advice, answer questions about skincare routines, ingredients, and skin concerns. Be friendly, knowledgeable, and always recommend consulting with a dermatologist for serious skin issues.
      
      ${userContext ? `User context: ${JSON.stringify(userContext)}` : ''}`,
    };

    const messages = [
      systemMessage,
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    try {
      const response = await api.generateText(messages);
      
      return {
        id: generateId(),
        text: response.completion,
        sender: 'assistant',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        id: generateId(),
        text: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        sender: 'assistant',
        timestamp: Date.now(),
      };
    }
  },

  async generateQuickPrompts(userContext?: any): Promise<string[]> {
    const defaultPrompts = [
      "What's the best morning skincare routine?",
      "How do I deal with dry skin?",
      "What ingredients should I avoid?",
      "How often should I exfoliate?",
      "What's causing my breakouts?",
    ];

    // In a real app, you could generate personalized prompts based on user context
    return defaultPrompts;
  },
};