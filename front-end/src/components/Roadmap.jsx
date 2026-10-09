import { useLanguage } from '../context/LanguageContext'
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Boxes,
  ArrowRight
} from 'lucide-react'

export default function Roadmap() {
  const { t } = useLanguage()

  return (
    <section id="roadmap" className="py-24 px-6 bg-white dark:bg-navy-950 relative border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.roadmap.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.roadmap.title}
          </h2>
        </div>

        {/* 4 Phases Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.roadmap.phases.map((phase, idx) => {
            const isCurrent = idx === 0
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-brand-50/60 dark:bg-brand-600/10 border-brand-400 dark:border-brand-500/40 shadow-lg shadow-brand-500/10'
                    : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      isCurrent
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}>
                      {phase.phase}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {phase.timeline}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {phase.scope}
                  </h3>

                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-200/60 dark:border-white/5">
                    {phase.details.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${isCurrent ? 'text-brand-500' : 'text-slate-400'}`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5 text-[11px] font-bold text-brand-600 dark:text-brand-400">
                  {isCurrent ? 'In Active Development' : 'Scheduled Milestone'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
