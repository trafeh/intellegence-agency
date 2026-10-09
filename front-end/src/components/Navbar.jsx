import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { 
  TrendingUp, 
  Sun, 
  Moon, 
  Languages, 
  ChevronDown,
  Check,
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react'
import logoLight from '../assets/logolight.png'
import logoDark from '../assets/logodark.png'

export default function Navbar({ onOpenPartnerModal }) {
  const { lang, setLang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langRef = useRef(null)

  const languageOptions = [
    { code: 'en', label: 'English', sub: 'International' },
    { code: 'fr', label: 'Français', sub: 'French' },
    { code: 'ar', label: 'العربية', sub: 'Arabic' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm' 
          : 'bg-white/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src={logoLight}
            alt="Intelligence Sales"
            className="h-8 w-auto block dark:hidden group-hover:scale-105 transition-transform object-contain"
          />
          <img
            src={logoDark}
            alt="Intelligence Sales"
            className="h-8 w-auto hidden dark:block group-hover:scale-105 transition-transform object-contain"
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-800 dark:text-white leading-none">
              {t.nav.brandSub}
            </span>
            <span className="text-sm font-extrabold tracking-tight text-brand-600 dark:text-brand-400 leading-tight">
              {t.nav.brandMain}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {t.nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold tracking-wide uppercase text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* International Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-200"
              aria-label="Select language"
              aria-expanded={langDropdownOpen}
            >
              {/* International Translation Icon */}
              <Languages className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold uppercase">{lang}</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu with the 3 Languages */}
            {langDropdownOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 p-1.5 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-white/5 mb-1">
                  Select Language
                </div>
                {languageOptions.map((opt) => {
                  const isSelected = lang === opt.code
                  return (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLang(opt.code)
                        setLangDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-600 dark:text-brand-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex flex-col text-left rtl:text-right">
                        <span className="text-xs font-bold leading-tight">{opt.label}</span>
                        <span className="text-[10px] text-slate-400">{opt.sub}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-brand-600" />
            )}
          </button>

          {/* Sign In CTA */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold tracking-wide uppercase transition-all shadow-md shadow-brand-600/30 hover:shadow-brand-600/50"
          >
            <span>{t.nav.login || (lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In')}</span>
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Button */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-200"
              aria-label="Toggle language menu"
            >
              <Languages className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span className="uppercase text-[11px]">{lang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 p-1.5 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 shadow-2xl z-50">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLang(opt.code)
                      setLangDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                      lang === opt.code
                        ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-600 dark:text-brand-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {lang === opt.code && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-brand-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-6 py-5 flex flex-col gap-4 shadow-xl">
          {t.nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 py-1 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold tracking-wide uppercase transition-colors"
            >
              {t.nav.login || (lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
