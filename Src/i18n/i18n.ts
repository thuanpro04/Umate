import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import en from './locales/en/translation.json';
import vi from './locales/vi/translation.json';
// Load file JSON theo đường dẫn mới
const resources = {
  vi: {translation: vi},
  en: {translation: en},
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {escapeValue: false},
});

export default i18next;
 