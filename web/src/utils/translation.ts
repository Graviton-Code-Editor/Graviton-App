import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  /*
   * These translations should be imported from another package where all languages are defined
   */
  resources: {
    en: {
      translation: {
        "Open Folder": "Open Folder",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});
