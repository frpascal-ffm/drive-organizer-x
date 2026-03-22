import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import de from './locales/de.json';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ur from './locales/ur.json';

export const languages = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ur', label: 'اردو / हिन्दी', flag: '🇵🇰' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      tr: { translation: tr },
      ur: { translation: ur },
    },
    fallbackLng: 'de',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'app-language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
