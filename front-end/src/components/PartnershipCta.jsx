import { useLanguage } from '../context/LanguageContext'
import { 
  Handshake, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react'

export default function PartnershipCta({ onOpenModal }) {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 bg-slate-50/60 dark:bg-navy-900/40 relative border-t border-slate-200/80 dark:border-white/5">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="rounded-3xl border border-brand-200 dark:border-white/10 bg-white dark:bg-navy-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-400/20 mb-4">
                <Handshake className="h-4 w-4" />
                <span>{t.partnership.eyebrow}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                {t.partnership.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {t.partnership.description}
              </p>

              <div className="space-y-2.5 mb-8">
                {t.partnership.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 italic">
                "{t.partnership.quote}"
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <button
                onClick={onOpenModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-600/30 hover:scale-105"
              >
                <span>{t.partnership.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
