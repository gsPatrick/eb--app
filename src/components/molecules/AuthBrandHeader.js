import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import EBText from '../atoms/Text';
import { colors, radius, spacing } from '../../theme/variables';

export default function AuthBrandHeader() {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#061D4D', colors.primary, '#0A2D6E']} style={styles.logoBox}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <EBText variant="caption" color="brand" style={styles.badgeText}>
          {t('auth.brandBadge')}
        </EBText>
      </View>

      <EBText variant="caption" color="secondary" style={styles.tagline}>
        {t('auth.brandTagline')}
      </EBText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  logoBox: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: 0,
  },
  logo: {
    width: 280,
    height: 88,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: 'rgba(8, 37, 103, 0.1)',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tagline: {
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xxl,
  },
});
