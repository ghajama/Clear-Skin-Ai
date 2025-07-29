import { colors, typography } from '@/constants/theme';
import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface TypographyProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export const H1: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.h1, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const H2: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.h2, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const H3: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.h3, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const H4: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.h4, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const Body: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.body, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const BodySmall: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.bodySmall, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

export const Caption: React.FC<TypographyProps> = ({ children, style, numberOfLines }) => (
  <Text style={[styles.caption, style]} numberOfLines={numberOfLines}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  h1: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xxxl,
    lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
    color: colors.text.primary,
    fontWeight: '700' as const,
  },
  h2: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.fontSize.xxl * typography.lineHeight.tight,
    color: colors.text.primary,
    fontWeight: '600' as const,
  },
  h3: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
    color: colors.text.primary,
    fontWeight: '600' as const,
  },
  h4: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.l,
    lineHeight: typography.fontSize.l * typography.lineHeight.normal,
    color: colors.text.primary,
    fontWeight: '500' as const,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.m,
    lineHeight: typography.fontSize.m * typography.lineHeight.normal,
    color: colors.text.primary,
  },
  bodySmall: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.s,
    lineHeight: typography.fontSize.s * typography.lineHeight.normal,
    color: colors.text.primary,
  },
  caption: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    color: colors.text.secondary,
  },
});