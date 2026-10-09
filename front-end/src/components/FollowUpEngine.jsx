import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  Bell, 
  Bot, 
  FileEdit, 
  Check, 
  Send, 
  Clock, 
  Sparkles,
  AlertCircle,
  ThumbsUp,
  UserCheck
} from 'lucide-react'

export default function FollowUpEngine() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(2) // Default on draft
  const [approved, setApproved] = useState(false)

  const stepIcons = [Clock, Bot, FileEdit, UserCheck, Send]

  return (
    <section id="follow-up" className="py-24 px-6 bg-slate-50/60 dark:bg-navy-900/40 relative border-t border-slate-200/80 dark:border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-3">
            {t.followUpFlow.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.followUpFlow.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.followUpFlow.description}
          </p>
        </div>

        {/* 5-Step Horizontal Flow Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-12">
          {t.followUpFlow.steps.map((step, idx) => {
            const Icon = stepIcons[idx] || Bell
            const isSelected = activeStep === idx
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-white/10 border-brand-500 shadow-md ring-2 ring-brand-400/20'
                    : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                    {step.num}
                  </span>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Live Simulation Card: Dormant Deal Rescue */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Inactivity Alert Triggered · 7 Days Dormant
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Acme Industrial Solutions — Enterprise License
                </h3>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
              Stage: Proposal Sent
            </span>
          </div>

          {/* AI Generated Recommendation Box */}
          <div className="my-6 p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-600/10 border border-brand-200 dark:border-brand-500/20">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span>Follow-Up Agent Recommended Touchpoint</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-2 bg-white/70 dark:bg-navy-900/60 p-4 rounded-xl border border-brand-100 dark:border-white/5 font-mono text-left">
              <p className="font-semibold text-slate-900 dark:text-white">Subject: Follow-up on ERP Integration timeline for Acme Industrial</p>
              <p>Hello Marcus,</p>
              <p>Following up on our discovery meeting last Tuesday regarding Acme's warehouse synchronization. I wanted to share our deployment architecture diagram addressing Sarah's questions about PostgreSQL multi-tenancy.</p>
              <p>Would Thursday at 14:00 work for a brief 15-minute walkthrough of the quotation line items?</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              <span>Human Approval Gate active — no message sent without salesperson consent</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setApproved(!approved)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  approved 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20'
                }`}
              >
                {approved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Approved & Dispatched</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4" />
                    <span>Approve & Send (1-Click)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
