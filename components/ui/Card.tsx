import { colors, shadows, spacing, borderRadius } from '@/constants/theme';
import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle, 
  StyleProp, 
  TouchableOpacity 
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: 'none' | 'light' | 'medium' | 'strong';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 'light',
}) => {
  const cardStyles = [
    styles.card,
    elevation !== 'none' && shadows[elevation],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyles} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
});