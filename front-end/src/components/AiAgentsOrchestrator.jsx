import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  Bot, 
  Target, 
  Users, 
  CalendarClock, 
  BarChart3, 
  FileSearch, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Terminal,
  Zap
} from 'lucide-react'

export default function AiAgentsOrchestrator() {
  const { t } = useLanguage()
  const [selectedAgent, setSelectedAgent] = useState(0)

  const agentIcons = [
    Bot,
    Target,
    Users,
    CalendarClock,
    BarChart3,
    FileSearch,
    Cpu
  ]

  const agentOutputs = [
    {
      trigger: 'Meeting in 15 mins with VP of Procurement',
      output: 'Executive Brief generated: Key pain point is inventory sync latency with legacy SAP. Suggest addressing PostgreSQL REST API webhooks. Avoid opening with pricing until deployment phase is validated.'
    },
    {
      trigger: 'New inbound lead from web form (300 employees)',
      output: 'Lead Qualified (ICP Score: 94/100). Verified domain, 3 branch offices, estimated annual logistics budget $1.2M. Assigned priority: HIGH. Handed over to Senior Account Exec.'
    },
    {
      trigger: 'Weekly CRM database scan',
      output: 'Deduplicated 14 contact records across 3 subsidiaries. Enriched missing job titles for 27 stakeholders via verified corporate registries. CRM health score: 99.2%.'
    },
    {
      trigger: 'Dormant deal detected (No touch for 7 days)',
      output: 'Drafted tailored re-engagement email referencing the proposal sent on the 14th. Created follow-up task due tomorrow 10:00 AM with 1-click salesperson approval gate.'
    },
    {
      trigger: 'End of month pipeline diagnosis',
      output: 'Pipeline velocity increased by 14% in Discovery stage. Bottleneck detected at Proposal Review (avg 9.2 days). Recommended coaching: Standardize quotation approval SLA.'
    },
    {
      trigger: 'Client uploaded 38-page tender RFP document',
      output: 'Extracted 14 mandatory product requirements, delivery timeline constraints, and payment terms (Net 60). Pre-populated quotation draft with matching SKU items.'
    },
    {
      trigger: 'Opportunity moved to Closed Won ($120,000)',
      output: 'Automated workflow activated: Generated official Sales Order #SO-8821, notified Intelligence Finance for deposit invoice, and triggered Intelligence Logistique fulfillment ticket.'
    }
  ]

  const activeAgent = t.aiAgents.agents[selectedAgent]
  const currentIcon = agentIcons[selectedAgent] || Bot
  const currentOutput = agentOutputs[selectedAgent]

  return (
    <section id="ai-agents" className="py-24 px-6 bg-white dark:bg-navy-950 relative border-t border-slate-200 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.aiAgents.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.aiAgents.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.aiAgents.description}
          </p>
        </div>

        {/* Central Orchestrator & Satellites Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left Column: 7 Agents List */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
              Select an Agent to Inspect
            </div>
            {t.aiAgents.agents.map((agent, i) => {
              const Icon = agentIcons[i] || Bot
              const isSelected = selectedAgent === i
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(i)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-600/15 border-brand-400 dark:border-brand-500/40 shadow-sm scale-[1.02]'
                      : 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                        {agent.category}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">
                    Agent 0{i + 1}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Right Column: Active Agent Deep Dive Inspector */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/60 dark:border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30">
                    {/* Active Icon */}
                    {activeAgent && (() => {
                      const Icon = currentIcon
                      return <Icon className="h-6 w-6" />
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                      {activeAgent.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeAgent.name}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <Zap className="h-3 w-3" /> Active
                </span>
              </div>

              {/* Agent Mission Statement */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Operational Mission
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {activeAgent.mission}
                </p>
              </div>

              {/* Live Simulated Prompt & Response */}
              <div className="rounded-2xl bg-slate-50 dark:bg-navy-950 p-5 border border-slate-200 dark:border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold">
                  <Terminal className="h-4 w-4" />
                  <span>Real-Time Trigger Event:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pl-6 border-l-2 border-brand-500">
                  {currentOutput.trigger}
                </p>

                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold pt-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Agent Output & Recommendation:</span>
                </div>
                <p className="text-slate-900 dark:text-slate-200 pl-6 border-l-2 border-emerald-500 leading-relaxed">
                  {currentOutput.output}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Human Approval Required Before External Send
              </span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                Governed AI Layer
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
