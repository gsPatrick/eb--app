export const LOCALES = ['pt', 'en', 'es', 'fr', 'de'];

export const LOCALE_LABELS = {
  pt: { name: 'Português', flag: '🇧🇷', intl: 'pt-BR' },
  en: { name: 'English', flag: '🇺🇸', intl: 'en-US' },
  es: { name: 'Español', flag: '🇪🇸', intl: 'es-ES' },
  fr: { name: 'Français', flag: '🇫🇷', intl: 'fr-FR' },
  de: { name: 'Deutsch', flag: '🇩🇪', intl: 'de-DE' },
};

export const LOCALE_FLAG_IMAGES = {
  pt: require('../../assets/flags/br.png'),
  en: require('../../assets/flags/us.png'),
  es: require('../../assets/flags/es.png'),
  fr: require('../../assets/flags/fr.png'),
  de: require('../../assets/flags/de.png'),
};

export const DEFAULT_LOCALE = 'pt';
export const LOCALE_STORAGE_KEY = 'eb_locale';
