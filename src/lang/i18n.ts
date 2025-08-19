import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import th from './dictionaries/th'
import en from './dictionaries/en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      th: th,
      en: en
    },
    lng: 'th',
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
