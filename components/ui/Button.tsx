import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'text' ? styles.textVariant : styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.textBase,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? colors.text.light : colors.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.m,
    gap: spacing.s,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textVariant: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    minHeight: 48,
  },
  large: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  disabled: {
    backgroundColor: colors.text.secondary,
    opacity: 0.5,
  },
  textBase: {
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.text.light,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  textText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.fontSize.s,
  },
  mediumText: {
    fontSize: typography.fontSize.m,
  },
  largeText: {
    fontSize: typography.fontSize.l,
  },
  disabledText: {
    color: colors.text.light,
  },
});