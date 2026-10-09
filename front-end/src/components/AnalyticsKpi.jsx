import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react'

export default function AnalyticsKpi() {
  const { t } = useLanguage()
  const [selectedFunnelIndex, setSelectedFunnelIndex] = useState(3)

  return (
    <section id="analytics" className="py-24 px-6 bg-slate-50/50 dark:bg-navy-900/40 relative border-t border-slate-200/80 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.analytics.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.analytics.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.analytics.description}
          </p>
        </div>

        {/* 4 Primary Executive KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center lg:grid-cols-3 mx-30 gap-4 mb-12">
          {t.analytics.metrics.map((metric, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {metric.label}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  <ArrowUpRight className="h-3 w-3" />
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive 6-Stage Sales Funnel Visualization */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 mb-8">
            <div className="flex items-center gap-2.5">
              <Filter className="h-5 w-5 text-brand-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Full-Funnel Commercial Conversion Matrix
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Live Velocity Diagnostics
            </span>
          </div>

          {/* Funnel Bars */}
          <div className="space-y-4">
            {t.analytics.funnel.map((item, idx) => {
              const isSelected = selectedFunnelIndex === idx
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFunnelIndex(idx)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-50/70 dark:bg-brand-600/15 border-brand-400 dark:border-brand-500/40 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-white/[0.01] border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-500" />
                      {item.stage}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 dark:text-slate-400">{item.count}</span>
                      <span className="text-brand-600 dark:text-brand-400">{item.value}</span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-3 w-full bg-slate-200/70 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      style={{ width: item.width }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 5 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                          : 'bg-gradient-to-r from-brand-600 to-brand-400'
                      }`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
