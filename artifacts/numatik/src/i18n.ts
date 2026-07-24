import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import id from "./locales/id.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const STORAGE_KEY = "numatik_language";

const savedLang = localStorage.getItem(STORAGE_KEY) || "en";
const validLangs = ["id", "en", "ja"];
const resolvedLang = validLangs.includes(savedLang) ? savedLang : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: resolvedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
