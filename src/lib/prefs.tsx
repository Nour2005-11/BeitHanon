import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, type Dict, type Lang } from "./i18n";

type Theme = "light" | "dark";
type PreferencesContext = {
  lang: Lang;
  theme: Theme;
  t: Dict;
  setLang: (lang: Lang) => void;
  toggleTheme: () => void;
};

const PreferencesContext = createContext<PreferencesContext | null>(null);

export const prefsBootScript = `(function(){try{var language=localStorage.getItem('bh-lang')||'ar';var theme=localStorage.getItem('bh-theme')||'light';var root=document.documentElement;root.lang=language;root.dir=language==='ar'?'rtl':'ltr';root.classList.toggle('dark',theme==='dark');}catch(e){}})();`;

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("bh-lang");
    const savedTheme = localStorage.getItem("bh-theme");
    if (savedLanguage === "ar" || savedLanguage === "en") setLangState(savedLanguage);
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setLang = useCallback((nextLanguage: Lang) => {
    setLangState(nextLanguage);
    localStorage.setItem("bh-lang", nextLanguage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("bh-theme", nextTheme);
      return nextTheme;
    });
  }, []);

  return (
    <PreferencesContext.Provider value={{ lang, theme, t: dict[lang], setLang, toggleTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePrefs() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePrefs must be used inside PrefsProvider");
  return context;
}
