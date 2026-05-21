import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import Input from '../components/atoms/Input';
import NubankAuthLayout from '../components/molecules/NubankAuthLayout';
import * as authApi from '../api/auth';
import { colors, radius, spacing } from '../theme/variables';

export default function ForgotPasswordScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError(t('auth.forgotPassword.emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.forgotPassword.emailInvalid'));
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      await authApi.requestPasswordReset(email.trim());
      navigation.navigate('ForgotPasswordOtp', { email: email.trim() });
    } catch (err) {
      setFormError(err.message || t('auth.forgotPassword.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <NubankAuthLayout
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
      onBack={() => navigation.goBack()}
      submitLabel={t('auth.forgotPassword.submit')}
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
        label={t('auth.forgotPassword.email')}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={error}
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
