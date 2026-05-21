import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import OtpInput from '../components/molecules/OtpInput';
import NubankAuthLayout from '../components/molecules/NubankAuthLayout';
import * as authApi from '../api/auth';
import { colors, radius, spacing } from '../theme/variables';

export default function ForgotPasswordOtpScreen({ navigation, route }) {
  const { t } = useTranslation();
  const email = route.params?.email || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const validate = () => {
    if (code.length !== 5) {
      setError(t('auth.forgotPassword.otpRequired'));
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
      await authApi.verifyPasswordResetOtp({ email, code });
      navigation.navigate('ResetPassword', { email, code });
    } catch (err) {
      if (err.code === 'INVALID_OTP') {
        setFormError(t('auth.forgotPassword.otpFailed'));
      } else {
        setFormError(err.message || t('auth.forgotPassword.otpFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setFormError('');
    try {
      await authApi.requestPasswordReset(email);
    } catch (err) {
      setFormError(err.message || t('auth.forgotPassword.failed'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <NubankAuthLayout
      title={t('auth.forgotPassword.otpTitle')}
      subtitle={t('auth.forgotPassword.otpSubtitle', { email })}
      onBack={() => navigation.goBack()}
      submitLabel={t('auth.forgotPassword.otpSubmit')}
      onSubmit={handleSubmit}
      submitLoading={loading}
      submitDisabled={code.length !== 5}
    >
      {formError ? (
        <View style={styles.errorBanner}>
          <EBText variant="caption" color="error">
            {formError}
          </EBText>
        </View>
      ) : null}

      <OtpInput
        value={code}
        onChange={(value) => {
          setCode(value);
          setError('');
        }}
        error={error}
      />

      <Pressable onPress={handleResend} disabled={resendLoading} style={styles.resend}>
        <EBText variant="body" color="brand" style={styles.resendText}>
          {resendLoading ? t('common.loading') : t('auth.forgotPassword.resendCode')}
        </EBText>
      </Pressable>
    </NubankAuthLayout>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: colors.errorSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  resend: {
    marginTop: spacing.xxl,
    alignSelf: 'center',
  },
  resendText: {
    fontWeight: '600',
  },
});
