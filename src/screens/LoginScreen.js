import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../components/atoms/Text';
import Input from '../components/atoms/Input';
import NubankAuthLayout from '../components/molecules/NubankAuthLayout';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme/variables';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const { signIn, permissionsGranted } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = t('auth.login.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = t('auth.login.emailInvalid');
    if (!password) next.password = t('auth.login.passwordRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      const loggedUser = await signIn({ email: email.trim(), password });
      const needsPermissions = loggedUser.role === 'provider' && !permissionsGranted;
      navigation.replace(needsPermissions ? 'Permissions' : 'Main');
    } catch (err) {
      if (err.code === 'UNSUPPORTED_ROLE') {
        setFormError(t('auth.login.unsupportedRole'));
      } else {
        setFormError(err.message || t('auth.login.failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <NubankAuthLayout
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      onBack={() => navigation.goBack()}
      submitLabel={t('auth.login.submit')}
      onSubmit={handleSubmit}
      submitLoading={loading}
      footerLink={{
        prompt: t('auth.login.noAccount'),
        actionLabel: t('auth.login.registerLink'),
        onPress: () => navigation.replace('Register'),
      }}
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
        label={t('auth.login.email')}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
        style={styles.field}
      />

      <Input
        variant="plain"
        label={t('auth.login.password')}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((prev) => ({ ...prev, password: '' }));
        }}
        secureTextEntry
        autoComplete="password"
        error={errors.password}
        style={styles.field}
      />

      <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink}>
        <EBText variant="body" color="brand" style={styles.forgotText}>
          {t('auth.login.forgotPassword')}
        </EBText>
      </Pressable>
    </NubankAuthLayout>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.xl },
  forgotLink: {
    alignSelf: 'flex-start',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: colors.errorSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
});
