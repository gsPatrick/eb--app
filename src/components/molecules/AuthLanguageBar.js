import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../atoms/Text';
import { LOCALE_LABELS, LOCALES } from '../../i18n/config';
import { useLocale } from '../../context/I18nProvider';
import { colors, radius, spacing } from '../../theme/variables';

export default function AuthLanguageBar({ compact = false, dark = false }) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact, dark && styles.wrapDark]}>
      {!compact ? (
        <EBText variant="label" color={dark ? 'inverse' : 'muted'} style={[styles.label, dark && styles.labelDark]}>
          {t('auth.languageLabel')}
        </EBText>
      ) : null}
      <View style={styles.row}>
        {LOCALES.map((code) => {
          const active = locale === code;
          const meta = LOCALE_LABELS[code];
          return (
            <Pressable
              key={code}
              onPress={() => setLocale(code)}
              style={[
                styles.chip,
                dark && styles.chipDark,
                active && styles.chipActive,
                dark && active && styles.chipActiveDark,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={meta.name}
            >
              <EBText style={styles.flag}>{meta.flag}</EBText>
              <EBText
                variant="caption"
                style={{
                  color: dark
                    ? active
                      ? colors.textInverse
                      : 'rgba(252,252,252,0.65)'
                    : active
                      ? colors.primary
                      : colors.textMuted,
                  fontWeight: active ? '700' : '500',
                }}
              >
                {code.toUpperCase()}
              </EBText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  wrapCompact: {
    paddingTop: spacing.md,
    paddingBottom: 0,
  },
  wrapDark: {
    paddingBottom: spacing.sm,
  },
  labelDark: {
    opacity: 0.75,
  },
  label: {
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipDark: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chipActiveDark: {
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  flag: {
    fontSize: 16,
  },
});
