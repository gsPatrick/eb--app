import React from 'react';
import { StyleSheet, View } from 'react-native';
import EBText from './Text';
import { colors, radius, spacing } from '../../theme/variables';

const variantStyles = {
  default: { bg: colors.bgMuted, text: colors.textSecondary },
  success: { bg: colors.accentSoft, text: colors.success },
  warning: { bg: colors.warningSoft, text: colors.warning },
  error: { bg: colors.errorSoft, text: colors.error },
  info: { bg: colors.primarySoft, text: colors.primary },
};

export default function Badge({ children, variant = 'default', style }) {
  const v = variantStyles[variant] || variantStyles.default;
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, style]}>
      <EBText variant="caption" style={{ color: v.text, fontWeight: '600', fontSize: 11 }}>
        {children}
      </EBText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
});
