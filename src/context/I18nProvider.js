import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { DEFAULT_LOCALE, LOCALE_LABELS, LOCALES } from '../i18n/config';
import { initI18n } from '../i18n';
import { getLocale, saveLocale } from '../utils/offlineQueue';
import { isLocaleOnboardingDone, setLocaleOnboardingDone } from '../api/storage';
import { colors } from '../theme/variables';

const LocaleContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [localeOnboardingDone, setLocaleOnboardingDoneState] = useState(false);
  const [ready, setReady] = useState(false);
  const i18n = useMemo(() => initI18n(DEFAULT_LOCALE), []);

  useEffect(() => {
    (async () => {
      const [stored, localeDone] = await Promise.all([getLocale(), isLocaleOnboardingDone()]);
      const next = stored && LOCALES.includes(stored) ? stored : DEFAULT_LOCALE;
      await i18n.changeLanguage(next);
      setLocaleState(next);
      setLocaleOnboardingDoneState(localeDone);
      setReady(true);
    })();
  }, [i18n]);

  const setLocale = useCallback(
    async (next) => {
      if (!LOCALES.includes(next)) return;
      await saveLocale(next);
      await i18n.changeLanguage(next);
      setLocaleState(next);
    },
    [i18n]
  );

  const completeLocaleOnboarding = useCallback(
    async (next) => {
      if (!LOCALES.includes(next)) return;
      await saveLocale(next);
      await i18n.changeLanguage(next);
      setLocaleState(next);
      await setLocaleOnboardingDone();
      setLocaleOnboardingDoneState(true);
    },
    [i18n]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      localeOnboardingDone,
      completeLocaleOnboarding,
      ready,
      intlLocale: LOCALE_LABELS[locale]?.intl || 'pt-BR',
    }),
    [locale, setLocale, localeOnboardingDone, completeLocaleOnboarding, ready]
  );

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <LocaleContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within I18nProvider');
  return ctx;
}
