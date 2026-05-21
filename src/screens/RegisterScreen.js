import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import EBText from '../components/atoms/Text';
import Input from '../components/atoms/Input';
import NubankAuthLayout from '../components/molecules/NubankAuthLayout';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/I18nProvider';
import { colors, radius, spacing } from '../theme/variables';

export default function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const { locale } = useLocale();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const updateField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = t('auth.register.nameRequired');
    if (!form.email.trim()) next.email = t('auth.register.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = t('auth.register.emailInvalid');
    if (!form.password) next.password = t('auth.register.passwordRequired');
    else if (form.password.length < 8) next.password = t('auth.register.passwordMinLength');
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = t('auth.register.confirmPasswordMismatch');
    }
    if (!form.terms) next.terms = t('auth.register.termsRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFormError('');
    try {
      await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        locale,
      });

      Alert.alert(t('auth.register.successTitle'), t('auth.register.successMessage'), [
        { text: t('auth.login.submit'), onPress: () => navigation.replace('Login') },
      ]);
    } catch (err) {
      setFormError(err.message || t('auth.register.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <NubankAuthLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      onBack={() => navigation.goBack()}
      submitLabel={t('auth.register.submit')}
      onSubmit={handleSubmit}
      submitLoading={loading}
      scrollable
      footerLink={{
        prompt: t('auth.register.hasAccount'),
        actionLabel: t('auth.register.loginLink'),
        onPress: () => navigation.replace('Login'),
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
        label={t('auth.register.fullName')}
        value={form.name}
        onChangeText={updateField('name')}
        autoComplete="name"
        error={errors.name}
        style={styles.field}
      />

      <Input
        variant="plain"
        label={t('auth.register.email')}
        value={form.email}
        onChangeText={updateField('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
        style={styles.field}
      />

      <Input
        variant="plain"
        label={`${t('auth.register.phone')} (${t('auth.register.phoneOptional')})`}
        value={form.phone}
        onChangeText={updateField('phone')}
        keyboardType="phone-pad"
        autoComplete="tel"
        style={styles.field}
      />

      <Input
        variant="plain"
        label={t('auth.register.password')}
        value={form.password}
        onChangeText={updateField('password')}
        secureTextEntry
        autoComplete="new-password"
        error={errors.password}
        style={styles.field}
      />

      <Input
        variant="plain"
        label={t('auth.register.confirmPassword')}
        value={form.confirmPassword}
        onChangeText={updateField('confirmPassword')}
        secureTextEntry
        autoComplete="new-password"
        error={errors.confirmPassword}
        style={styles.field}
      />

      <Pressable
        onPress={() => updateField('terms')(!form.terms)}
        style={styles.termsRow}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: form.terms }}
      >
        <View style={[styles.checkbox, form.terms && styles.checkboxChecked]}>
          {form.terms ? <Check size={14} color={colors.textInverse} strokeWidth={3} /> : null}
        </View>
        <EBText variant="caption" color="secondary" style={styles.termsText}>
          {t('auth.register.terms')}
        </EBText>
      </Pressable>
      {errors.terms ? (
        <EBText variant="caption" color="error" style={styles.termsError}>
          {errors.terms}
        </EBText>
      ) : null}
    </NubankAuthLayout>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.xl },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: colors.bgElevated,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  termsError: {
    marginBottom: spacing.md,
  },
  errorBanner: {
    backgroundColor: colors.errorSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
});
