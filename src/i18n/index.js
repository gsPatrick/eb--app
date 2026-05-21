import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE } from './config';
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
};

export function initI18n(initialLocale = DEFAULT_LOCALE) {
  if (i18n.isInitialized) {
    return i18n;
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: initialLocale,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
    react: { useSuspense: false },
  });

  return i18n;
}

export default i18n;
