import { useLanguage } from '../context/LanguageContext'
import { 
  AlertTriangle, 
  TrendingDown, 
  FileSpreadsheet, 
  Clock, 
  UserX, 
  MessageSquareOff,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'

export default function ProblemSolution() {
  const { t } = useLanguage()

  const problemIcons = [
    FileSpreadsheet,
    MessageSquareOff,
    Clock,
    UserX
  ]

  return (
    <section className="py-24 px-6 relative bg-white dark:bg-navy-950 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-rose-500 mb-3">
            {t.challenge.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.challenge.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.challenge.description}
          </p>
        </div>

        {/* 2-Column Split: Problems on Left, Business Impact on Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 4 Pain Points */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {t.challenge.problems.map((prob, i) => {
              const Icon = problemIcons[i] || AlertTriangle
              return (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {prob.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {prob.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Business Impact Card */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50/40 dark:from-rose-950/20 dark:to-slate-900/40 border border-rose-200 dark:border-rose-500/20 p-8 flex flex-col justify-between shadow-md shadow-rose-100/40 dark:shadow-none">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldAlert className="h-4 w-4" />
                <span>{t.challenge.resultTitle}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                The Quiet Drain on Company Valuation
              </h3>

              <div className="space-y-4">
                {t.challenge.results.map((res, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-rose-200/60 dark:border-white/5 shadow-xs">
                    <TrendingDown className="h-5 w-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {res.label}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                        {res.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-200 dark:border-rose-500/20 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
              <span>Solution: Intelligent Commercial OS</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
