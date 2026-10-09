import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  Target,
  Plus,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Flame,
  Zap,
  Snowflake,
  MessageSquare,
  Globe,
  Users,
  X
} from 'lucide-react'

export default function CrmLeads() {
  const { leads, addLead, convertLeadToDeal } = useCrm()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [selectedTemperature, setSelectedTemperature] = useState('all')
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [successToast, setSuccessToast] = useState(null)

  const [newLeadForm, setNewLeadForm] = useState({
    companyName: '',
    contactName: '',
    title: 'Commercial Director',
    phone: '',
    email: '',
    source: 'WhatsApp Inbound',
    city: 'Casablanca',
    estimatedValue: '',
  })

  // Format MAD currency
  const formatMAD = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredLeads = leads.filter(l => {
    const matchSearch =
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchChannel = selectedChannel === 'all' || l.source.includes(selectedChannel)
    const matchTemp = selectedTemperature === 'all' || l.temperature === selectedTemperature
    return matchSearch && matchChannel && matchTemp
  })

  const handleCreateLead = (e) => {
    e.preventDefault()
    if (!newLeadForm.companyName || !newLeadForm.contactName) return

    addLead(newLeadForm)
    setIsAddLeadOpen(false)
    setNewLeadForm({
      companyName: '',
      contactName: '',
      title: 'Commercial Director',
      phone: '',
      email: '',
      source: 'WhatsApp Inbound',
      city: 'Casablanca',
      estimatedValue: '',
    })
    setSuccessToast('New Lead created and qualified by AI Agent!')
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const handleConvert = (leadId) => {
    const res = convertLeadToDeal(leadId)
    if (res) {
      setSuccessToast(`Lead successfully converted into Opportunity (${res.account.name})!`)
      setTimeout(() => setSuccessToast(null), 4000)
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'العملاء المحتملون والتأهيل الذكي' : 'Leads & Inbound Intelligence'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
              {filteredLeads.length} leads
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'تقييم جودة العملاء وتوقع إمكانية الإغلاق بواسطة خوارزميات الذكاء الاصطناعي'
              : 'Predictive qualification scoring across multi-channel inbound leads with 1-click conversion'}
          </p>
        </div>

        <button
          onClick={() => setIsAddLeadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'ar' ? 'إضافة عميل محتمل' : 'New Inbound Lead'}</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-900 p-3.5 rounded-lg border border-slate-200 dark:border-white/10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث باسم الشركة أو المدينة...' : 'Search by company name, contact, or city...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="WhatsApp">WhatsApp Inbound</option>
            <option value="Web">Website Form</option>
            <option value="Referral">Client Referral</option>
            <option value="Campaign">Marketing Campaign</option>
          </select>

          <select
            value={selectedTemperature}
            onChange={(e) => setSelectedTemperature(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Temperatures</option>
            <option value="Hot">Hot (&gt;80%)</option>
            <option value="Warm">Warm (60-79%)</option>
            <option value="Cold">Cold (&lt;60%)</option>
          </select>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => {
          const isHot = lead.temperature === 'Hot'
          const isConverted = lead.status === 'Converted'

          return (
            <div
              key={lead.id}
              className={`p-5 rounded-lg bg-white dark:bg-navy-900 border shadow-sm transition-all hover:shadow-md flex flex-col justify-between gap-4 ${
                isConverted
                  ? 'border-slate-200 dark:border-white/5 opacity-80'
                  : isHot
                  ? 'border-emerald-300 dark:border-emerald-800/40 ring-1 ring-emerald-500/10'
                  : 'border-slate-200 dark:border-white/10'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Company & AI Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {lead.city} • Source: {lead.source}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      {lead.companyName}
                    </h3>
                  </div>

                  {/* AI Qualification Score */}
                  <div className={`p-2 rounded-md flex items-center gap-1.5 shrink-0 ${
                    isHot
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                      : lead.temperature === 'Warm'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'
                  }`}>
                    {isHot ? <Flame className="h-4 w-4" /> : lead.temperature === 'Warm' ? <Zap className="h-4 w-4" /> : <Snowflake className="h-4 w-4" />}
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-black leading-none">{lead.score}/100</span>
                      <span className="text-[8px] font-bold uppercase">{lead.temperature}</span>
                    </div>
                  </div>
                </div>

                {/* Contact information */}
                <div className="p-3 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Users className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span>{lead.contactName}</span>
                    <span className="text-slate-400 font-normal">({lead.title})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {lead.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {lead.email}
                    </span>
                  </div>
                </div>

                {/* AI Rationale & Advice */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 text-xs text-slate-600 dark:text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-snug">{lead.aiNotes}</p>
                </div>
              </div>

              {/* Bottom Actions: Estimated Value & 1-Click Convert */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Budget</span>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {formatMAD(lead.estimatedValue)}
                  </div>
                </div>

                {isConverted ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Converted to Deal</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleConvert(lead.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
                  >
                    <span>Convert to Deal</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ADD LEAD MODAL */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'إدخال عميل محتمل جديد' : 'New Inbound Lead'}
              </h3>
              <button
                onClick={() => setIsAddLeadOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.companyName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                  placeholder="e.g., Marjane Holding"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.contactName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contactName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.title}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, title: e.target.value })}
                    placeholder="Procurement Director"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Phone (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+212 600 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="contact@enterprise.ma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Acquisition Channel
                  </label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="WhatsApp Inbound">WhatsApp Inbound</option>
                    <option value="Web Form">Website Contact Form</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Campaign LinkedIn">LinkedIn Campaign</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Estimated Budget (MAD)
                  </label>
                  <input
                    type="number"
                    value={newLeadForm.estimatedValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimatedValue: e.target.value })}
                    placeholder="150000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
                >
                  Save & Score Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
