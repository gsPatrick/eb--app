import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import EBText from '../atoms/Text';
import { LOCALE_LABELS, LOCALES } from '../../i18n/config';
import { useLocale } from '../../context/I18nProvider';
import { colors, radius, spacing } from '../../theme/variables';

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  return (
    <View style={styles.wrap}>
      <EBText variant="heading">{t('settings.language')}</EBText>
      <EBText variant="caption" color="secondary" style={styles.hint}>
        {t('settings.languageHint')}
      </EBText>
      <View style={styles.row}>
        {LOCALES.map((code) => {
          const active = locale === code;
          const meta = LOCALE_LABELS[code];
          return (
            <Pressable
              key={code}
              onPress={() => setLocale(code)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <EBText style={styles.flag}>{meta.flag}</EBText>
              <EBText
                variant="caption"
                style={{ color: active ? colors.primary : colors.textSecondary, fontWeight: active ? '600' : '400' }}
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
  wrap: { gap: spacing.sm },
  hint: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  flag: { fontSize: 18 },
});
