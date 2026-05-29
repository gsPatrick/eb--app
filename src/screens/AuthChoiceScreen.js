import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../components/atoms/Button';
import EBText from '../components/atoms/Text';
import AuthHeroHeader from '../components/molecules/AuthHeroHeader';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme/variables';

export default function AuthChoiceScreen({ navigation }) {
  const { t } = useTranslation();
  const { authIntentRole, chooseAuthRole } = useAuth();

  const selectRole = async (role) => {
    await chooseAuthRole(role);
  };

  const goLogin = async (role) => {
    await selectRole(role);
    navigation.navigate('Login');
  };

  const goRegister = async (role) => {
    await selectRole(role);
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <AuthHeroHeader title={t('auth.choice.title')} subtitle={t('auth.choice.subtitle')} />

      <View style={styles.actions}>
        <View style={styles.roleRow}>
          <Button
            fullWidth
            variant={authIntentRole === 'client' ? 'primary' : 'secondary'}
            onPress={() => selectRole('client')}
            style={styles.roleBtn}
          >
            {t('auth.choice.clientRole')}
          </Button>
          <Button
            fullWidth
            variant={authIntentRole === 'provider' ? 'primary' : 'secondary'}
            onPress={() => selectRole('provider')}
            style={styles.roleBtn}
          >
            {t('auth.choice.providerRole')}
          </Button>
        </View>

        <Button
          fullWidth
          size="lg"
          disabled={!authIntentRole}
          onPress={() => goRegister(authIntentRole)}
          style={styles.primaryBtn}
        >
          {t('auth.choice.createAccount')}
        </Button>

        <Button
          fullWidth
          size="lg"
          variant="secondary"
          disabled={!authIntentRole}
          onPress={() => goLogin(authIntentRole)}
          style={styles.secondaryBtn}
        >
          {t('auth.choice.hasAccount')}
        </Button>

        <EBText variant="caption" color="muted" style={styles.note}>
          {t('auth.dualRoleNote')}
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
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  roleBtn: { flex: 1 },
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
