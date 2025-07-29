import { colors, spacing, borderRadius } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Body } from '@/components/ui/Typography';
import { QuizOption } from '@/types';

interface QuizCardProps {
  option: QuizOption;
  selected: boolean;
  onSelect: (optionId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  option,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onSelect(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Body style={[styles.text, selected && styles.selectedText]}>
          {option.text}
        </Body>
      </View>
      <View style={[styles.checkbox, selected && styles.selectedCheckbox]}>
        {selected && <View style={styles.checkboxInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  content: {
    flex: 1,
  },
  text: {
    color: colors.text.primary,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '500' as const,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginLeft: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckbox: {
    borderColor: colors.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});