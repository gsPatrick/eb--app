import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ClipboardList, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme/variables';

const FEATURES = [
  { icon: MapPin, key: 'auth.intro.feature1' },
  { icon: Camera, key: 'auth.intro.feature2' },
  { icon: ClipboardList, key: 'auth.intro.feature3' },
];

export default function AuthIntroScreen({ navigation }) {
  const { t } = useTranslation();
  const { completeOnboarding } = useAuth();

  const handleContinue = async () => {
    await completeOnboarding();
    navigation.replace('AuthChoice');
  };

  return (
    <LinearGradient colors={['#041A45', colors.primary, '#0A2D6E']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.logoWrap}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <EBText variant="display" color="inverse" style={styles.title}>
              {t('auth.intro.title')}
            </EBText>
            <EBText variant="body" color="inverse" style={styles.subtitle}>
              {t('auth.intro.subtitle')}
            </EBText>
          </View>

          <View style={styles.features}>
            {FEATURES.map(({ icon: Icon, key }) => (
              <View key={key} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Icon size={20} color={colors.textInverse} strokeWidth={1.8} />
                </View>
                <EBText variant="body" color="inverse" style={styles.featureText}>
                  {t(key)}
                </EBText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button fullWidth size="lg" variant="secondary" onPress={handleContinue} style={styles.continueBtn}>
            {t('auth.intro.continue')}
          </Button>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoWrap: {
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 220,
    height: 70,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: spacing.lg,
    textAlign: 'center',
    opacity: 0.88,
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
  features: {
    gap: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    lineHeight: 22,
    opacity: 0.95,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  continueBtn: {
    borderRadius: 999,
    minHeight: 56,
    backgroundColor: colors.bgElevated,
    borderWidth: 0,
  },
});
