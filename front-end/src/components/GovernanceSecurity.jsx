import { useLanguage } from '../context/LanguageContext'
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  FileText, 
  KeyRound,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function GovernanceSecurity() {
  const { t } = useLanguage()

  const pillarIcons = [
    UserCheck,
    Lock,
    KeyRound,
    FileText
  ]

  return (
    <section className="py-24 px-6 bg-slate-50/60 dark:bg-navy-900/30 relative border-t border-slate-200/80 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-3">
            {t.governance.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.governance.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.governance.description}
          </p>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.governance.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i] || ShieldCheck
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Enforced at API Layer</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Core Principle Callout */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-500/20 bg-brand-50/50 dark:bg-brand-600/10 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Foundational Security Principle
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                An AI agent must never automatically inherit the permissions of a human administrator. Sensitive commercial actions always require human verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
