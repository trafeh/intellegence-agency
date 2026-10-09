import { useLanguage } from '../context/LanguageContext'
import { 
  Layers, 
  Server, 
  Cpu, 
  Database, 
  Globe2, 
  Webhook, 
  ShieldCheck,
  ArrowDown
} from 'lucide-react'

export default function Architecture() {
  const { t } = useLanguage()

  const layerIcons = [Globe2, Server, Cpu]

  return (
    <section className="py-24 px-6 bg-white dark:bg-navy-950 relative border-t border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.architecture.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.architecture.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.architecture.description}
          </p>
        </div>

        {/* 3-Tier Layered Architecture Diagram */}
        <div className="max-w-4xl mx-auto space-y-4">
          {t.architecture.layers.map((layer, i) => {
            const Icon = layerIcons[i] || Layers
            return (
              <div key={i} className="relative">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-600/15 border border-brand-200 dark:border-brand-400/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-0.5">
                        Tier 0{i + 1}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {layer.tier}
                      </h3>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        {layer.tech}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 max-w-sm sm:text-right leading-relaxed font-medium">
                    {layer.details}
                  </div>
                </div>

                {/* Connecting arrow indicator between layers */}
                {i < 2 && (
                  <div className="flex justify-center my-1.5">
                    <ArrowDown className="h-4 w-4 text-brand-400 animate-bounce" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Integration protocols grid */}
        <div className="max-w-4xl mx-auto mt-10 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">REST API & JSON</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Webhooks Sync</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">PostgreSQL Multi-Tenant</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Intelligence ERP Bus</span>
          </div>
        </div>
      </div>
    </section>
  )
}
