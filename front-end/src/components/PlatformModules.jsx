import { useLanguage } from '../context/LanguageContext'
import { 
  Users, 
  Kanban, 
  BellRing, 
  FileCheck2, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function PlatformModules() {
  const { t } = useLanguage()

  const moduleIcons = {
    crm: Users,
    pipeline: Kanban,
    followup: BellRing,
    quotes: FileCheck2
  }

  return (
    <section id="platform" className="py-24 px-6 bg-white dark:bg-navy-950 relative border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.modules.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.modules.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.modules.description}
          </p>
        </div>

        {/* 4 Bento Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.modules.items.map((mod, i) => {
            const Icon = moduleIcons[mod.id] || Users
            return (
              <div
                key={mod.id}
                className="group p-8 rounded-3xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-600/15 border border-brand-200 dark:border-brand-400/20 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Module 0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {mod.desc}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200/60 dark:border-white/5">
                    {mod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Module Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
