import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import { colors, spacing } from '../theme/variables';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function SplashScreenView({ onFinish }) {
  const { t } = useTranslation();

  useEffect(() => {
    let timer;
    (async () => {
      await SplashScreen.hideAsync();
      timer = setTimeout(onFinish, 1800);
    })();
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient colors={[colors.primary, '#061D4D']} style={styles.container}>
      <View style={styles.logoWrap}>
        <EBText variant="display" color="inverse" style={styles.logo}>
          EB
        </EBText>
        <EBText variant="caption" color="inverse" style={styles.tagline}>
          {t('splash.tagline')}
        </EBText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center' },
  logo: { fontSize: 56, letterSpacing: 4 },
  tagline: { marginTop: spacing.sm, opacity: 0.85, letterSpacing: 2 },
});
