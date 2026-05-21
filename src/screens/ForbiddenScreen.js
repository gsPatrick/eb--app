import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ShieldX } from 'lucide-react-native';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import { goBack } from '../navigation/navigationRef';
import { colors, radius, spacing } from '../theme/variables';

export default function ForbiddenScreen({ navigation }) {
  const { t } = useTranslation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[colors.primary, '#061D4D']} style={styles.hero}>
        <View style={styles.iconWrap}>
          <ShieldX size={40} color={colors.textInverse} strokeWidth={1.5} />
        </View>
        <EBText variant="display" color="inverse" style={styles.code}>
          403
        </EBText>
        <EBText variant="title" color="inverse" style={styles.title}>
          {t('forbidden.title')}
        </EBText>
        <EBText variant="body" color="inverse" style={styles.subtitle}>
          {t('forbidden.subtitle')}
        </EBText>
      </LinearGradient>

      <View style={styles.body}>
        <EBText variant="body" color="secondary" style={styles.message}>
          {t('forbidden.message')}
        </EBText>
        <Button fullWidth onPress={handleBack}>
          {t('forbidden.goBack')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  code: { fontSize: 48, letterSpacing: 4, marginBottom: spacing.sm },
  title: { textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { textAlign: 'center', opacity: 0.88, lineHeight: 22 },
  body: { padding: spacing.xxxl },
  message: { textAlign: 'center', lineHeight: 22, marginBottom: spacing.xxl },
});
