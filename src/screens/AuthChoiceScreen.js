import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import AuthHeroHeader from '../components/molecules/AuthHeroHeader';
import { colors, spacing } from '../theme/variables';

export default function AuthChoiceScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <AuthHeroHeader title={t('auth.choice.title')} subtitle={t('auth.choice.subtitle')} />

      <View style={styles.actions}>
        <Button
          fullWidth
          size="lg"
          onPress={() => navigation.navigate('Register')}
          style={styles.primaryBtn}
        >
          {t('auth.choice.createAccount')}
        </Button>

        <Button
          fullWidth
          size="lg"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
          style={styles.secondaryBtn}
        >
          {t('auth.choice.hasAccount')}
        </Button>

        <EBText variant="caption" color="muted" style={styles.note}>
          {t('auth.providerOnlyNote')}
        </EBText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgElevated,
  },
  actions: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
  },
  primaryBtn: {
    borderRadius: 999,
    minHeight: 56,
  },
  secondaryBtn: {
    borderRadius: 999,
    minHeight: 56,
  },
  note: {
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
