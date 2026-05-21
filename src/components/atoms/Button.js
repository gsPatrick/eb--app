import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../theme/variables';

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.primary} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    minHeight: 48,
    paddingHorizontal: spacing.xl,
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.55 },
  primary: { backgroundColor: colors.primary, ...shadows.glow },
  secondary: { backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  md: { minHeight: 48 },
  lg: { minHeight: 52, paddingHorizontal: spacing.xxl },
  sm: { minHeight: 40, paddingHorizontal: spacing.lg },
  label: { ...typography.bodyMedium },
  primaryLabel: { color: colors.textInverse },
  secondaryLabel: { color: colors.primary },
  ghostLabel: { color: colors.textSecondary },
  mdLabel: { fontSize: 15 },
  lgLabel: { fontSize: 16, fontWeight: '600' },
  smLabel: { fontSize: 14 },
});
