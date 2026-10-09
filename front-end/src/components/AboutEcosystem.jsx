import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  Building2, 
  TrendingUp, 
  Truck, 
  CreditCard, 
  Users2, 
  Boxes,
  ArrowRight,
  Workflow,
  Check
} from 'lucide-react'

export default function AboutEcosystem() {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState('sales')

  const icons = {
    sales: TrendingUp,
    logistique: Truck,
    finance: CreditCard,
    rh: Users2,
    erp: Boxes,
  }

  const flows = [
    {
      from: 'Intelligence Sales',
      to: 'Intelligence Finance',
      description: 'Accepted quotations instantly generate automated sales orders and down-payment invoices.',
    },
    {
      from: 'Intelligence Sales',
      to: 'Intelligence Logistique',
      description: 'Won commercial deals trigger stock allocations, warehouse picking, and delivery routes.',
    },
    {
      from: 'Intelligence Sales',
      to: 'Intelligence RH',
      description: 'Closed revenue updates rep commission tallies, quota achievement, and territory performance.',
    },
    {
      from: 'All 4 SaaS Products',
      to: 'Intelligence ERP',
      description: 'Unified commercial, financial, logistical, and people intelligence in an executive cockpit.',
    }
  ]

  return (
    <section id="about" className="py-24 px-6 bg-slate-50/50 dark:bg-navy-900/40 relative border-t border-slate-200/80 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.about.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.about.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about.description}
          </p>
        </div>

        {/* 5 Product Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
          {t.about.ecosystem.map((prod) => {
            const Icon = icons[prod.id] || Building2
            const isSelected = selectedProduct === prod.id
            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod.id)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-white/10 border-brand-500 shadow-lg shadow-brand-500/10 scale-[1.02]'
                    : 'bg-white/60 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                      prod.active 
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' 
                        : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {prod.active && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-400/30">
                        Current
                      </span>
                    )}
                    {prod.isHub && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30">
                        Unified Hub
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {prod.name}
                  </h3>
                  <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2">
                    {prod.tag}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <Check className="h-3.5 w-3.5 text-brand-500" />
                  <span>Interconnected</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Data Cross-Flow Showcase */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Workflow className="h-5 w-5 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Autonomous Cross-Product Data Workflows
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flows.map((flow, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white mb-2">
                  <span className="text-brand-600 dark:text-brand-400">{flow.from}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{flow.to}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {flow.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
