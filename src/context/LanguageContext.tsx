import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  type LanguageCode,
  type LanguageOption,
  type TranslationStrings,
} from '../i18n/translations';

interface LanguageContextValue {
  lang: LanguageCode;
  currentLanguage: LanguageOption;
  t: TranslationStrings;
  setLanguage: (code: LanguageCode) => void;
  showWelcomePicker: boolean;
  dismissWelcomePicker: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_LANG_KEY = 'nileway_lang';
const STORAGE_CHOSEN_KEY = 'nileway_lang_chosen';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return 'en';
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang') as LanguageCode | null;
    if (paramLang && TRANSLATIONS[paramLang]) return paramLang;
    const saved = window.localStorage.getItem(STORAGE_LANG_KEY) as LanguageCode | null;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  const [showWelcomePicker, setShowWelcomePicker] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.has('skipLang') || params.has('lang')) return false;
    return !window.localStorage.getItem(STORAGE_CHOSEN_KEY);
  });

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.dir;
    document.title = TRANSLATIONS[lang].pageTitle;
  }, [currentLanguage, lang]);

  const setLanguage = (code: LanguageCode) => {
    setLangState(code);
    window.localStorage.setItem(STORAGE_LANG_KEY, code);
    window.localStorage.setItem(STORAGE_CHOSEN_KEY, '1');
    setShowWelcomePicker(false);
  };

  const dismissWelcomePicker = () => {
    window.localStorage.setItem(STORAGE_CHOSEN_KEY, '1');
    setShowWelcomePicker(false);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        currentLanguage,
        t: TRANSLATIONS[lang],
        setLanguage,
        showWelcomePicker,
        dismissWelcomePicker,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
