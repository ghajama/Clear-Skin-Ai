import { colors, spacing, borderRadius } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BodySmall } from '@/components/ui/Typography';
import { QuickPrompt as QuickPromptType } from '@/types';

interface QuickPromptProps {
  prompt: QuickPromptType;
  onPress: (text: string) => void;
}

export const QuickPrompt: React.FC<QuickPromptProps> = ({ prompt, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(prompt.text)}
    >
      <BodySmall style={styles.text}>{prompt.text}</BodySmall>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    marginRight: spacing.s,
    marginBottom: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.text.primary,
  },
});