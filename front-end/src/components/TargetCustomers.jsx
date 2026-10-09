import { useLanguage } from '../context/LanguageContext'
import { 
  Building, 
  Briefcase, 
  Factory, 
  Users2, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

export default function TargetCustomers() {
  const { t } = useLanguage()

  const customerIcons = [Building, Factory, Briefcase, Users2]

  return (
    <section className="py-24 px-6 bg-slate-50/50 dark:bg-navy-900/30 relative border-t border-slate-200/80 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.targetCustomers.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.targetCustomers.title}
          </h2>
        </div>

        {/* 4 Customer Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.targetCustomers.segments.map((seg, i) => {
            const Icon = customerIcons[i] || Building
            return (
              <div
                key={i}
                className="p-7 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-brand-400 dark:hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-600/15 border border-brand-200 dark:border-brand-400/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1 block">
                    {seg.scope}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {seg.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {seg.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Tailored Workflows</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
