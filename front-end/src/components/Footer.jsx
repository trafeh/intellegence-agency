import { useLanguage } from '../context/LanguageContext'
import { TrendingUp, ArrowRight, Globe } from 'lucide-react'
import logoLight from '../assets/logolight.png'
import logoDark from '../assets/logodark.png'

export default function Footer({ onOpenPartnerModal }) {
  const { t, lang, toggleLang } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="pt-20 pb-12 px-6 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-white/10 relative overflow-hidden">
      {/* Subtle grid & top gradient border */}
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-30" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Global Expansion Journey Callout */}
        <div className="mb-16 p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-2">
              {t.ambition.eyebrow}
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.ambition.titleBefore}
              <span className="text-gradient">{t.ambition.titleHighlight}</span>
            </h3>
          </div>

          {/* Journey Steps Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {t.ambition.journey.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200">
                  {step}
                </span>
                {idx < t.ambition.journey.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brand & Ecosystem Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-200/80 dark:border-white/10">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoLight}
                alt="Intelligence Sales"
                className="h-8 w-auto block dark:hidden object-contain"
              />
              <img
                src={logoDark}
                alt="Intelligence Sales"
                className="h-8 w-auto hidden dark:block object-contain"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-[0.2em] text-slate-800 dark:text-white leading-none">
                  {t.nav.brandSub}
                </span>
                <span className="text-sm font-extrabold tracking-tight text-brand-600 dark:text-brand-400 leading-tight">
                  {t.nav.brandMain}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              B2B Sales Management, CRM, and Sales Automation SaaS engineered by Intelligence Agency. The Commercial Operating System of modern business.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#platform" className="hover:text-brand-500 transition-colors">Core CRM & Leads</a></li>
              <li><a href="#platform" className="hover:text-brand-500 transition-colors">Visual Kanban Deals</a></li>
              <li><a href="#follow-up" className="hover:text-brand-500 transition-colors">Automated Follow-Up</a></li>
              <li><a href="#ai-agents" className="hover:text-brand-500 transition-colors">7 Sales AI Agents</a></li>
              <li><a href="#analytics" className="hover:text-brand-500 transition-colors">Executive Analytics</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Ecosystem Products
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#about" className="hover:text-brand-500 transition-colors">Intelligence ERP (Core)</a></li>
              <li><a href="#about" className="hover:text-brand-500 transition-colors">Intelligence Logistique</a></li>
              <li><a href="#about" className="hover:text-brand-500 transition-colors">Intelligence Finance</a></li>
              <li><a href="#about" className="hover:text-brand-500 transition-colors">Intelligence RH</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Language Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>{t.ambition.footerRights.replace('{year}', year)}</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {t.ambition.footerTag}
          </span>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 hover:text-brand-500 transition-colors uppercase font-bold"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Language: {lang}</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
