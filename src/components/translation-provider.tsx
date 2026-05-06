"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, Language, TranslationKey } from "@/lib/translations";

interface TranslationContextType {
  t: (key: TranslationKey) => string;
  language: Language;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/tutor/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.language) setLanguage(data.language);
      }
    };
    fetchProfile();
  }, []);

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
