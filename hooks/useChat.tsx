import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback } from 'react';
import { Message, QuickPrompt } from '@/types';
import { quickPrompts } from '@/constants/mockData';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { chatService } from '@/services/chat';
import { generateId } from '@/lib/utils';
import { useAuth } from './useAuth';
import { useSkincare } from './useSkincare';

export const [ChatProvider, useChat] = createContextHook(() => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { skinScore, quizAnswers } = useSkincare();

  // Load messages from storage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await storage.getItem<Message[]>(STORAGE_KEYS.CHAT_HISTORY);
        if (storedMessages && storedMessages.length > 0) {
          setMessages(storedMessages);
        } else {
          // Add welcome message if no messages exist
          const welcomeMessage: Message = {
            id: '1',
            text: "Hello! I'm your AI skincare assistant. How can I help you today?",
            sender: 'assistant',
            timestamp: Date.now(),
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, []);

  // Save messages to storage when they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await storage.setItem(STORAGE_KEYS.CHAT_HISTORY, messages);
      } catch (error) {
        console.error('Failed to save messages:', error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Use real chat service instead of mock
      const response = await chatService.sendMessage(text, {
        skinScore,
        quizAnswers,
        user: user || undefined,
      });

      const aiResponse: Message = {
        id: generateId(),
        text: response,
        sender: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Fallback to mock response if API fails
      const fallbackResponse: Message = {
        id: generateId(),
        text: generateMockResponse(text),
        sender: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setLoading(false);
    }
  }, [skinScore, quizAnswers, user]);

  const clearChat = useCallback(async () => {
    try {
      await storage.removeItem(STORAGE_KEYS.CHAT_HISTORY);

      // Add welcome message with proper ID
      const welcomeMessage: Message = {
        id: generateId(),
        text: "Hello! I'm your AI skincare assistant. How can I help you today?",
        sender: 'assistant',
        timestamp: Date.now(),
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  }, []);

  // Simple mock response generator as fallback
  const generateMockResponse = useCallback((query: string): string => {
    const responses = [
      "Based on your skin type, I recommend using a gentle cleanser twice daily.",
      "Hydration is key! Make sure to drink plenty of water and use a moisturizer suitable for your skin type.",
      "For hyperpigmentation, ingredients like vitamin C, niacinamide, and alpha arbutin can be effective.",
      "Retinol is great for anti-aging, but start with a low concentration and use it only 2-3 times a week.",
      "SPF is non-negotiable! Use at least SPF 30 daily, even on cloudy days.",
      "For acne-prone skin, look for non-comedogenic products and ingredients like salicylic acid.",
      "Your skin barrier might need repair. Focus on gentle, fragrance-free products with ceramides.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }, []);

  const sendQuickPrompt = useCallback(async (prompt: QuickPrompt) => {
    await sendMessage(prompt.text);
  }, [sendMessage]);

  return {
    messages,
    loading,
    sendMessage,
    sendQuickPrompt,
    clearChat,
    availablePrompts: quickPrompts,
  };
});