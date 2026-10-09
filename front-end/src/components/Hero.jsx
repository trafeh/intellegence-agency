import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Bot, 
  Clock, 
  Zap, 
  CheckCircle2,
  DollarSign,
  ChevronRight
} from 'lucide-react'

export default function Hero({ onOpenPartnerModal }) {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  const stages = [
    { name: 'Lead Inbound', value: '85K MAD', status: 'Enriched via AI', activeColor: 'text-blue-400' },
    { name: 'Qualification', value: '62K MAD', status: 'Score: 92/100', activeColor: 'text-indigo-400' },
    { name: 'Discovery Demo', value: '110K MAD', status: 'Brief Generated', activeColor: 'text-violet-400' },
    { name: 'Proposal Sent', value: '45K MAD', status: 'Follow-Up in 2d', activeColor: 'text-amber-400' },
    { name: 'Negotiation', value: '95K MAD', status: 'Discount Approved', activeColor: 'text-orange-400' },
    { name: 'Closed Won', value: '135K MAD', status: 'Order Sent to ERP', activeColor: 'text-emerald-400' },
  ]

  // Auto-advance simulated pipeline activity
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [stages.length])

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 grid-fade opacity-60 dark:opacity-40" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-brand-500/15 dark:bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-[36rem] w-[36rem] rounded-full bg-brand-400/10 dark:bg-brand-500/15 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-brand-50 dark:bg-white/5 border border-brand-200 dark:border-white/10 text-brand-700 dark:text-brand-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
            <span className="flex h-2 w-2 rounded-full bg-brand-500 -ml-4" />
            <span>{t.hero.eyebrow}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
            {t.hero.headingBefore}
            <span className="text-gradient block sm:inline">
              {t.hero.headingHighlight}
            </span>
            {t.hero.headingAfter}
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg font-semibold text-brand-600 dark:text-brand-400 mb-3">
            {t.hero.tagline}
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
            {t.hero.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a
              href="#platform"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.02]"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={onOpenPartnerModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white font-semibold text-xs tracking-wider uppercase transition-all"
            >
              <Sparkles className="h-4 w-4 text-brand-500 dark:text-brand-400" />
              <span>{t.hero.ctaSecondary}</span>
            </button>
          </div>

          {/* Real-Time Stats Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
            {t.hero.stats.map((s, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {s.value}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Deal Pipeline Radar */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto aspect-square w-full max-w-md p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl flex flex-col justify-between">
            {/* Top header badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Live Commercial Cycle
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-400/20">
                {t.hero.chips.velocity}
              </span>
            </div>

            {/* Central Animated Pipeline Stages */}
            <div className="my-auto space-y-2.5 py-2">
              {stages.map((stage, idx) => {
                const isCurrent = activeStep === idx
                return (
                  <div
                    key={stage.name}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
                      isCurrent
                        ? 'bg-brand-50 dark:bg-brand-600/15 border-brand-300 dark:border-brand-500/40 shadow-sm scale-[1.02]'
                        : 'bg-slate-50/80 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                          isCurrent
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                          {stage.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {stage.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-brand-600 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'}`}>
                        {stage.value}
                      </span>
                      {isCurrent && <ChevronRight className="h-3.5 w-3.5 text-brand-500" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom floating micro badges */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="truncate">{t.hero.chips.followUp}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                <Bot className="h-4 w-4 text-brand-500 shrink-0" />
                <span className="truncate">{t.hero.chips.agents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
