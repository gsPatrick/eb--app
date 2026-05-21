import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import Input from '../components/atoms/Input';
import NubankAuthLayout from '../components/molecules/NubankAuthLayout';
import * as authApi from '../api/auth';
import { colors, radius, spacing } from '../theme/variables';

export default function ResetPasswordScreen({ navigation, route }) {
  const { t } = useTranslation();
  const email = route.params?.email || '';
  const code = route.params?.code || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!password) next.password = t('auth.forgotPassword.passwordRequired');
    else if (password.length < 8) next.password = t('auth.forgotPassword.passwordMinLength');
    if (password !== confirmPassword) {
      next.confirmPassword = t('auth.forgotPassword.confirmPasswordMismatch');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      await authApi.resetPassword({ email, code, password });
      Alert.alert(t('auth.forgotPassword.successTitle'), t('auth.forgotPassword.successMessage'), [
        {
          text: t('auth.login.submit'),
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          },
        },
      ]);
    } catch (err) {
      setFormError(err.message || t('auth.forgotPassword.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <NubankAuthLayout
      title={t('auth.forgotPassword.resetTitle')}
      subtitle={t('auth.forgotPassword.resetSubtitle')}
      onBack={() => navigation.goBack()}
      submitLabel={t('auth.forgotPassword.resetSubmit')}
      onSubmit={handleSubmit}
      submitLoading={loading}
    >
      {formError ? (
        <View style={styles.errorBanner}>
          <EBText variant="caption" color="error">
            {formError}
          </EBText>
        </View>
      ) : null}

      <Input
        variant="plain"
        label={t('auth.forgotPassword.newPassword')}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((prev) => ({ ...prev, password: '' }));
        }}
        secureTextEntry
        autoComplete="new-password"
        error={errors.password}
        style={styles.field}
      />

      <Input
        variant="plain"
        label={t('auth.forgotPassword.confirmPassword')}
        value={confirmPassword}
        onChangeText={(value) => {
          setConfirmPassword(value);
          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }}
        secureTextEntry
        autoComplete="new-password"
        error={errors.confirmPassword}
        style={styles.field}
      />
    </NubankAuthLayout>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.xl },
  errorBanner: {
    backgroundColor: colors.errorSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
});
