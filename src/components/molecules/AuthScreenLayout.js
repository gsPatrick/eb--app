import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import EBText from '../atoms/Text';
import AuthBrandHeader from './AuthBrandHeader';
import AuthLanguageBar from './AuthLanguageBar';
import { colors, radius, shadows, spacing } from '../../theme/variables';

export default function AuthScreenLayout({ title, subtitle, children, footer }) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthBrandHeader />

          <View style={styles.card}>
            <EBText variant="title" color="brand">
              {title}
            </EBText>
            {subtitle ? (
              <EBText variant="caption" color="secondary" style={styles.subtitle}>
                {subtitle}
              </EBText>
            ) : null}

            {children}
          </View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}

          <AuthLanguageBar />

          <EBText variant="caption" color="muted" style={styles.providerNote}>
            {t('auth.providerOnlyNote')}
          </EBText>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthSwitchLink({ prompt, actionLabel, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.switchRow}>
      <EBText variant="caption" color="secondary">
        {prompt}{' '}
      </EBText>
      <EBText variant="caption" color="brand" style={styles.switchAction}>
        {actionLabel}
      </EBText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  switchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchAction: {
    fontWeight: '700',
  },
  providerNote: {
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
});
