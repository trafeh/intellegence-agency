import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('intelligence_sales_lang')
    if (!saved || saved === 'fr') {
      localStorage.setItem('intelligence_sales_lang', 'en')
      return 'en'
    }
    return saved
  })

  useEffect(() => {
    localStorage.setItem('intelligence_sales_lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const toggleLang = () => {
    setLang(prev => {
      if (prev === 'en') return 'fr'
      if (prev === 'fr') return 'ar'
      return 'en'
    })
  }

  const changeLang = (newLang) => {
    if (['en', 'fr', 'ar'].includes(newLang)) {
      setLang(newLang)
    }
  }

  const t = translations[lang] || translations.en

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, toggleLang, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
