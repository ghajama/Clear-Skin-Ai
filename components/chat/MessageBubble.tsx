import { colors, spacing, borderRadius } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Body, Caption } from '@/components/ui/Typography';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Body style={isUser ? styles.userText : styles.aiText}>{message.text}</Body>
      </View>
      <Caption style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
        {formattedTime}
      </Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: borderRadius.m,
    padding: spacing.m,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  aiBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userText: {
    color: colors.text.light,
  },
  aiText: {
    color: colors.text.primary,
  },
  timestamp: {
    marginTop: spacing.xs,
  },
  userTimestamp: {
    alignSelf: 'flex-end',
  },
  aiTimestamp: {
    alignSelf: 'flex-start',
  },
});