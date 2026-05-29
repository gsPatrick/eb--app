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
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Button from '../atoms/Button';
import EBText from '../atoms/Text';
import { colors, spacing } from '../../theme/variables';

export default function NubankAuthLayout({
  title,
  subtitle,
  onBack,
  children,
  submitLabel,
  onSubmit,
  submitLoading = false,
  submitDisabled = false,
  footerLink,
  scrollable = true,
}) {
  const { t } = useTranslation();
  const content = (
    <>
      <View style={styles.header}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12} accessibilityRole="button">
            <ChevronLeft size={28} color={colors.primary} strokeWidth={2} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      <View style={styles.titleBlock}>
        <EBText variant="display" color="brand" style={styles.title}>
          {title}
        </EBText>
        {subtitle ? (
          <EBText variant="body" color="secondary" style={styles.subtitle}>
            {subtitle}
          </EBText>
        ) : null}
      </View>

      <View style={styles.form}>{children}</View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={styles.scroll}>{content}</View>
        )}

        <View style={styles.bottom}>
          {footerLink ? (
            <Pressable onPress={footerLink.onPress} style={styles.footerLink}>
              <EBText variant="body" color="secondary">
                {footerLink.prompt}{' '}
              </EBText>
              <EBText variant="body" color="brand" style={styles.footerLinkAction}>
                {footerLink.actionLabel}
              </EBText>
            </Pressable>
          ) : null}

          <Button
            fullWidth
            size="lg"
            loading={submitLoading}
            disabled={submitDisabled}
            onPress={onSubmit}
            style={styles.submit}
          >
            {submitLabel}
          </Button>

          <EBText variant="caption" color="muted" style={styles.providerNote}>
            {t('auth.dualRoleNote')}
          </EBText>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgElevated },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  header: {
    paddingTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backPlaceholder: {
    height: 44,
  },
  titleBlock: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: spacing.md,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  bottom: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  footerLink: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  footerLinkAction: {
    fontWeight: '700',
  },
  submit: {
    borderRadius: 999,
    minHeight: 56,
  },
  providerNote: {
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
});
