import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from '../../Locales/uk.json';
import es from '../../Locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'en': { translation: uk },  // Use en-GB for British English
      es: { translation: es },
    },
    lng: 'en', // Set British English as default
    fallbackLng: 'en', // Use 'en' for fallback if needed
  });

export default i18n;