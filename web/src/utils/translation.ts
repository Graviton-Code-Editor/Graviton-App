import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//@ts-ignore
import EnglishLanguage from "@gveditor/languages/english";
//@ts-ignore
import IndonesianLanguage from "@gveditor/languages/indonesian";

i18n.use(initReactI18next).init({
  resources: {
    [EnglishLanguage.code]: EnglishLanguage,
    [IndonesianLanguage.code]: IndonesianLanguage,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
