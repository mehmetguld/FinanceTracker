'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tr, TranslationDictionary } from '@/locales/tr';
import { en } from '@/locales/en';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const dictionaries: Record<Language, TranslationDictionary> = {
  tr,
  en,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (path: string) => path,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('finance_tracker_lang') as Language;
    if (saved && (saved === 'tr' || saved === 'en')) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = 'tr';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('finance_tracker_lang', lang);
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    const next = language === 'tr' ? 'en' : 'tr';
    setLanguage(next);
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const dict = dictionaries[language] || dictionaries.tr;
    const parts = path.split('.');
    let current: any = dict;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to Turkish if key is missing in active language
        let fallback: any = dictionaries.tr;
        for (const p of parts) {
          if (fallback && typeof fallback === 'object' && p in fallback) {
            fallback = fallback[p];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return path;
    }

    if (params) {
      return Object.entries(params).reduce((str, [key, val]) => {
        return str.replace(new RegExp(`%\\{${key}\\}`, 'g'), String(val));
      }, current);
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
