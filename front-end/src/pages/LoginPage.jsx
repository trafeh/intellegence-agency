import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  TrendingUp,
  Mail,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const { lang, setLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegularLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const res = await login(email, password)
    if (res.success) navigate('/crm/dashboard')
    else setError(res.message || 'Invalid credentials.')
    setIsLoading(false)
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-600 selection:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <header className="h-16 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold tracking-widest text-slate-900 dark:text-white leading-none">
              INTELLIGENCE
            </span>
            <span className="text-xs font-black text-brand-600 dark:text-brand-400">
              SALES
            </span>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Back to site */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
            <span>{lang === 'ar' ? 'الرجوع للموقع' : 'Back to website'}</span>
          </Link>

          {/* Lang Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold">
            {['en', 'fr', 'ar'].map(c => (
              <button
                key={c}
                onClick={() => setLang(c)}
                className={`px-2 py-0.5 rounded-lg uppercase text-[10px] transition-colors ${
                  lang === c ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-brand-600" />}
          </button>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-1 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-extrabold uppercase tracking-wider border border-brand-500/20">
              <Sparkles className="h-3 w-3" />
              <span>Commercial Operating System</span>
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              {lang === 'ar' ? 'تسجيل الدخول إلى الـ CRM' : 'Sign in to CRM'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ar'
                ? 'اختر أحد الحسابات التجريبية أو سجّل بحسابك الخاص'
                : 'Sign in with your server account'}
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            <span className="bg-white dark:bg-navy-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
              {lang === 'ar' ? 'الدخول بحساب' : 'Sign in with your server account'}
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleRegularLogin} className="space-y-4 relative z-10">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <span className="text-[10px] text-brand-600 cursor-pointer hover:underline">
                  {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </span>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-brand-600"
                />
                <span>{lang === 'ar' ? 'تذكرني' : 'Remember me'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing in...' : lang === 'ar' ? 'دخول إلى النظام' : 'Sign in to CRM'}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secured by Intelligence Agency • 256-bit Encryption</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-slate-400">
        © 2026 Intelligence Agency. All rights reserved.
      </footer>
    </div>
  )
}
