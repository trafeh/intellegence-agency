import { useLanguage } from '../context/LanguageContext'
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Layers, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

export default function Differentiation() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 bg-white dark:bg-navy-950 relative border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.differentiation.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.differentiation.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.differentiation.description}
          </p>
        </div>

        {/* 5-Step Evolutionary Progression Ladder */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {t.differentiation.steps.map((step, idx) => {
            const isHighest = step.active
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isHighest
                    ? 'bg-gradient-to-b from-brand-600/15 to-transparent border-brand-500 shadow-xl shadow-brand-500/10 scale-105 z-10'
                    : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest ${
                      isHighest ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
                    }`}>
                      Gen 0{idx + 1}
                    </span>
                    {isHighest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                        Next-Gen
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-bold mb-2 ${
                    isHighest ? 'text-brand-600 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {step.stage}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-bold">
                  {isHighest ? (
                    <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> Intelligence Sales
                    </span>
                  ) : (
                    <span className="text-slate-400">Legacy Tier</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
