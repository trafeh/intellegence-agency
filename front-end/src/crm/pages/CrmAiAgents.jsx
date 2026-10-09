import { useState } from 'react'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  BrainCircuit,
  Sparkles,
  Target,
  RefreshCw,
  Database,
  TrendingUp,
  FileText,
  Zap,
  Send,
  CheckCircle2,
  ShieldCheck,
  Bot,
  MessageSquare,
  ArrowRight
} from 'lucide-react'

export default function CrmAiAgents() {
  const { aiAgents } = useCrm()
  const { lang } = useLanguage()

  const [selectedAgentId, setSelectedAgentId] = useState('sales_assistant')
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState([
    {
      sender: 'agent',
      agentId: 'sales_assistant',
      text: "Hello! I am your Intelligence Sales Copilot. What would you like to prepare today? (Handling client objections, account analysis, closing pitches, or meeting debrief summaries?)"
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const selectedAgent = aiAgents.find(a => a.id === selectedAgentId) || aiAgents[0]

  const agentIcons = {
    sales_assistant: BrainCircuit,
    lead_intelligence: Target,
    follow_up: RefreshCw,
    crm_data: Database,
    sales_analytics: TrendingUp,
    document_agent: FileText,
    automation_agent: Zap,
  }

  const samplePrompts = {
    sales_assistant: [
      "How should I address Atlas Distribution when they push back on pricing?",
      "Prepare a 2-minute executive pitch for the CEO of Dislog Group.",
      "Summarize the key differentiators of Intelligence Sales Enterprise."
    ],
    lead_intelligence: [
      "Analyze the Cosumar Distribution lead and justify its 94/100 score.",
      "What qualification criteria are still missing for Bimo & Mondelez?"
    ],
    follow_up: [
      "Draft a warm WhatsApp re-engagement message in English for Meryem Tazi.",
      "Draft a formal follow-up message in Arabic for a procurement director in Casablanca."
    ],
    sales_analytics: [
      "What is our weighted pipeline revenue forecast for the end of the quarter?",
      "What is the primary bottleneck for deals currently stalled in 'Proposal' stage?"
    ],
    document_agent: [
      "Check if a 20% discount complies with our target gross margin threshold.",
      "Generate an executive summary of contractual terms for Afriquia Gaz."
    ]
  }

  const handleSendPrompt = (promptText) => {
    const textToSend = promptText || chatInput
    if (!textToSend.trim()) return

    // Add user message
    const userMsg = { sender: 'user', text: textToSend }
    setChatLog(prev => [...prev, userMsg])
    setChatInput('')
    setIsTyping(true)

    // Simulate AI Agent reasoning & response
    setTimeout(() => {
      let responseText = ""

      if (textToSend.includes("pricing") || textToSend.includes("objection") || textToSend.includes("expensive")) {
        responseText = "To diffuse the price objection with Atlas Distribution, anchor on ROI rather than upfront licensing costs:\n1. Demonstrate that the automated follow-up engine eliminates 100% of dormant leads, recovering an estimated 380,000 MAD in revenue during Q1 alone.\n2. Offer the first year of ERP integration support at zero additional charge to offset perceived transition overhead."
      } else if (textToSend.includes("Arabic") || textToSend.includes("arabe") || textToSend.includes("العربية")) {
        responseText = "Here is the drafted WhatsApp follow-up in professional Arabic:\n\n'السلام عليكم ورحمة الله، أتمنى أن تكونوا بخير أستاذي الكريم. متابعةً لاجتماعنا الأخير بخصوص نظام Intelligence Sales، هل أتيحت لكم الفرصة للاطلاع على عرض السعر المقترح؟ نحن رهن إشارتكم لتحديد موعد إلكتروني سريع للإجابة عن استفساراتكم التقنية.'"
      } else if (textToSend.includes("WhatsApp") || textToSend.includes("Dislog") || textToSend.includes("Meryem")) {
        responseText = "Here is the WhatsApp follow-up drafted for Meryem Tazi (Dislog Group):\n\n'Dear Meryem, I hope you are having a productive week. Following up on our discussion regarding the Intelligence Sales framework, have you had a chance to review quote # DEV-2026-088? We are available to organize a technical alignment demo with your team at your convenience.'"
      } else if (textToSend.includes("Cosumar") || textToSend.includes("score")) {
        responseText = "Lead Intelligence Agent confirms the 94/100 score for Cosumar Distribution:\n• High-intent inbound channel: Direct WhatsApp Business\n• Verified decision maker: Regional Commercial Director\n• 30-day closing potential estimated at 340,000 MAD\n• Strategic recommendation: Move directly to 'Proposal' stage."
      } else if (textToSend.includes("discount") || textToSend.includes("20%")) {
        responseText = "Document & Margins Agent diagnostic:\n• Requested discount: 20% (> standard 15% rep authorization threshold)\n• Residual gross margin: 52% (well above corporate floor of 45%)\n• Action: Automated notification dispatched to Sales Director for 1-click approval."
      } else {
        responseText = `[${selectedAgent.name}]: I have analyzed your query against current pipeline data and historical interactions. Recommendation: Lock in the technical stakeholder demo this week to protect your targeted month-end closing date.`
      }

      setChatLog(prev => [...prev, {
        sender: 'agent',
        agentId: selectedAgentId,
        text: responseText
      }])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'مركز قيادة الوكلاء الذكاء الاصطناعي (7 Agents)' : '7 Sales AI Agents Command Center'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 text-xs font-bold border border-brand-500/20">
              Multi-Agent Orchestration
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'طبقة الذكاء الاصطناعي المتخصصة المحددة في دفتر الشروط لتمكين وتوجيه فريق المبيعات'
              : 'Specialized multi-agent intelligence layer defined in the Business Plan specification'}
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="h-4 w-4" />
          <span>Human-in-the-Loop Governance Active</span>
        </div>
      </div>

      {/* Main 2-Column Interface: Agent Grid on Left, Live Workbench on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7 Agents Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Specialized Sales Agents
          </span>

          <div className="space-y-2">
            {aiAgents.map((agent) => {
              const Icon = agentIcons[agent.id] || BrainCircuit
              const isSelected = selectedAgentId === agent.id

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 shadow-sm'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {agent.name}
                        </h4>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Live Interactive Workbench (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Header of Active Agent */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedAgent.name}
                </h3>
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                  {selectedAgent.titleEn} • Active Online
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
              Governed AI Model
            </span>
          </div>

          {/* Quick Prompts Suggestions */}
          {samplePrompts[selectedAgentId] && (
            <div className="p-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 self-center mr-1">Suggestions:</span>
              {samplePrompts[selectedAgentId].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(p)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatLog.map((msg, idx) => {
              const isAgent = msg.sender === 'agent'
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
                >
                  {isAgent ? (
                    <div className="h-7 w-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 text-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      You
                    </div>
                  )}

                  <div className={`p-3.5 rounded-lg text-xs max-w-[85%] leading-relaxed whitespace-pre-line ${
                    isAgent
                      ? 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-white/5'
                      : 'bg-brand-600 text-white shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Sparkles className="h-3.5 w-3.5 text-brand-600 animate-spin" />
                <span>{selectedAgent.name} is evaluating pipeline context and generating response...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendPrompt()
            }}
            className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask ${selectedAgent.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
