import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../../theme/variables';

const variants = {
  display: typography.display,
  title: typography.title,
  heading: typography.heading,
  body: typography.body,
  caption: typography.caption,
  label: typography.label,
};

const colorsMap = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  inverse: colors.textInverse,
  brand: colors.primary,
  accent: colors.accent,
  error: colors.error,
};

export default function EBText({ variant = 'body', color = 'primary', style, children, ...props }) {
  return (
    <Text style={[variants[variant], { color: colorsMap[color] || color }, style]} {...props}>
      {children}
    </Text>
  );
}

const _styles = StyleSheet.create({});
