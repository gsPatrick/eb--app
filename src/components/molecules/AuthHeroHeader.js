import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EBText from '../atoms/Text';
import { colors, spacing } from '../../theme/variables';

export default function AuthHeroHeader({ title, subtitle }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.hero}>
      <Image
        source={require('../../../assets/auth-hero.png')}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.1)', 'transparent']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(255,255,255,0.14)', 'transparent', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0.15 }}
        end={{ x: 1, y: 0.75 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['transparent', 'rgba(4, 26, 69, 0.45)', 'rgba(4, 26, 69, 0.88)']}
        locations={[0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['#041A45', colors.primary, '#0A2D6E']}
        style={[styles.logoHeader, { paddingTop: insets.top + spacing.md }]}
      >
        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.messageOverlay}>
        <EBText variant="display" color="inverse" style={styles.title}>
          {title}
        </EBText>
        <EBText variant="body" color="inverse" style={styles.subtitle}>
          {subtitle}
        </EBText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  logoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  logo: {
    width: 240,
    height: 76,
  },
  messageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: spacing.md,
    lineHeight: 24,
    opacity: 0.92,
  },
});
