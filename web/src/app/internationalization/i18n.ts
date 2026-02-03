import { en, th, defaultLanguage, supportedLanguages } from './locales';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { en, th },
        fallbackLng: defaultLanguage,
        supportedLngs: supportedLanguages,
        debug: import.meta.env.DEV,
        interpolation: { escapeValue: false },
        detection: {
            order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
            lookupQuerystring: 'lng',
            caches: ['localStorage'],
        },
    });

export default i18n;