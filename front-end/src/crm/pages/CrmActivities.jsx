import { useState, useMemo } from 'react'
import { useCrm } from '../context/CrmContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Phone,
  Video,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  MessageSquare,
  ChevronRight,
  X,
  ShieldCheck,
  FileText
} from 'lucide-react'

export default function CrmActivities() {
  const { activities, deals, executeFollowUp, addActivity, loading, mutationError } = useCrm()
  const { currentUser, role } = useAuth()
  const { lang } = useLanguage()

  const [activeTab, setActiveTab] = useState(role === 'client' ? 'all' : 'dormant') // 'dormant' | 'all'
  const [isLogOpen, setIsLogOpen] = useState(false)
  const [successToast, setSuccessToast] = useState(null)
  const [activityForm, setActivityForm] = useState({ type: 'call', title: '', dealId: '', contactName: '', date: new Date().toISOString().split('T')[0], time: '14:30', notes: '' })
  const [generatedDrafts] = useState({
    deal_2: "Dear Meryem, I hope this message finds you well. Following up on our discussion regarding the Intelligence Sales framework, have you had an opportunity to review quote # DEV-2026-088? We are available to organize a technical alignment demo at your convenience.",
    deal_3: "Dear Mr. Bennani, I am following up regarding the 50 field licenses deployment scoping at LabelVie. Would you be available for a brief coordination session this Thursday at 11:00 AM?",
  })

  // 1. CLIENT TIMELINE VIEW
  if (role === 'client') {
    const clientAccountName = currentUser?.accountName || currentUser?.account?.name || 'Client Account'

    return (
      <div className="space-y-6 w-full max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brand-600" />
              <span>{lang === 'ar' ? 'سجل مراحل وتفاعلات المشروع' : 'Project Timeline & Engagement History'}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'التاريخ الزمني لجميع الاجتماعات، العروض، ومحطات تسليم المشروع'
                : 'Auditable timeline of scoping meetings, proposals, deliverables, and milestone sign-offs'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{clientAccountName}</span>
            </span>
          </div>
        </div>

        {mutationError && (
          <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{mutationError}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm p-12 text-center text-slate-500 text-xs space-y-2">
            <Clock className="h-6 w-6 text-brand-500 animate-spin mx-auto" />
            <p>{lang === 'ar' ? 'جاري تحميل الأنشطة...' : 'Loading engagement history...'}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm p-12 text-center text-slate-500 text-xs space-y-2">
            <FileText className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'ar' ? 'لا توجد أنشطة مسجلة حالياً' : 'No recorded activities found'}
            </p>
            <p className="text-slate-400">
              {lang === 'ar'
                ? 'لم يتم تسجيل أي اجتماعات أو مكالمات لحسابكم حتى الآن.'
                : 'No meetings, calls, or milestones have been logged for your account yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm p-6 space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {activities.map((act) => (
                <div key={act.id} className="py-4 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {act.title}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        {act.date} {act.time ? `à ${act.time}` : ''}
                      </span>
                    </div>
                    {act.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {act.notes}
                      </p>
                    )}
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-2">
                      <span>{lang === 'ar' ? 'المسؤول :' : 'Representative:'}</span>
                      <strong className="text-brand-600 font-semibold">{act.repName}</strong>
                      {act.dealTitle && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-slate-500">{act.dealTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 2. INTERNAL STAFF: Scope deals by role
  const relevantDeals = role === 'rep'
    ? deals.filter(d =>
        d.ownerId === currentUser?.id ||
        d.ownerName?.toLowerCase().includes(currentUser?.name?.toLowerCase() || '') ||
        d.user_id === currentUser?.id
      )
    : deals

  // Follow-up generator state for scoped dormant deals
  const dormantDeals = relevantDeals.filter(d => d.hasInactivityWarning || d.lastActivityDaysAgo >= 7)

  // Form for new activity
  // Sample drafted message templates
  const handleSendFollowUp = async (dealId, channel) => {
    const saved = await executeFollowUp(dealId, channel)
    if (!saved) return
    setSuccessToast(`${channel} follow-up activity logged. External delivery is not connected.`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  const handleCreateActivity = async (e) => {
    e.preventDefault()
    if (!activityForm.title) return

    const deal = relevantDeals.find(d => d.id === activityForm.dealId) || deals.find(d => d.id === activityForm.dealId)
    const saved = await addActivity({
      type: activityForm.type,
      title: activityForm.title,
      dealId: deal?.id || '',
      dealTitle: deal?.title || 'Opportunity',
      contactName: activityForm.contactName || deal?.contactName || 'Contact',
      date: activityForm.date,
      time: activityForm.time,
      notes: activityForm.notes,
    })
    if (!saved) return

    setIsLogOpen(false)
    setActivityForm({
      type: 'call',
      title: '',
      dealId: relevantDeals[0]?.id || '',
      contactName: '',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      notes: '',
    })
    setSuccessToast('Activity logged successfully.')
    setTimeout(() => setSuccessToast(null), 3000)
  }

  return (
    <div className="space-y-6 w-full">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-brand-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>
              {role === 'rep'
                ? 'My Follow-Up Engine & Activities'
                : (lang === 'ar' ? 'محرك المتابعة والأنشطة التجارية' : 'Follow-Up Engine & Activities')}
            </span>
            {dormantDeals.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold border border-rose-500/30 animate-pulse">
                {dormantDeals.length} {lang === 'ar' ? 'تنبيه ركود (7 أيام)' : '7d alerts'}
              </span>
            )}
            {role === 'rep' && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-600/10 text-blue-600 text-[10px] font-bold border border-blue-500/20">
                Personal Pipeline Scope
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {role === 'rep'
              ? 'Enforcing the 7-day rule for your assigned opportunities: AI pre-drafted WhatsApp relances'
              : (lang === 'ar'
                ? 'تطبيق قاعدة الـ 7 أيام الصارمة: لا صفقات منسية بعد اليوم مع صياغة الرسائل آلياً'
                : 'Strict enforcement of the 7-day dormancy rule: zero forgotten deals and automated re-engagement')}
          </p>
        </div>

        <button
          onClick={() => setIsLogOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'ar' ? 'تسجيل نشاط جديد' : 'Log New Activity'}</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 max-w-fit">
        <button
          onClick={() => setActiveTab('dormant')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dormant'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{lang === 'ar' ? 'المتابعات العاجلة (قاعدة 7 أيام)' : 'Urgent Follow-Ups (7-Day Rule)'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
            {dormantDeals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>{lang === 'ar' ? 'سجل الأنشطة والمواعيد' : 'Activity Timeline & Schedule'}</span>
        </button>
      </div>

      {/* DORMANT DEALS (7-DAY INACTIVITY WORKBENCH) */}
      {activeTab === 'dormant' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                AI Governance & 7-Day Inactivity Rule (Human-in-the-Loop)
              </span>
              The Follow-Up Agent detected opportunities with no touchpoint recorded for 7+ days. Tailored re-engagement messages are drafted below. Your human approval is required before delivery.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dormantDeals.map((deal) => {
              const draft = generatedDrafts[deal.id] || `Dear ${deal.contactName}, following up regarding our proposal on ${deal.title}. We remain at your disposal to schedule our next alignment call.`
              return (
                <div
                  key={deal.id}
                  className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-rose-300 dark:border-rose-900/50 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                            {deal.lastActivityDaysAgo} days inactive
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{deal.accountName}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {deal.title}
                        </h3>
                      </div>
                      <span className="text-sm font-black text-brand-600">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(deal.amount)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>Contact: <strong className="text-slate-700 dark:text-slate-200">{deal.contactName}</strong></span>
                      <span>•</span>
                      <span>Owner: <strong>{deal.ownerName}</strong></span>
                    </div>

                    {/* AI Generated Message Draft */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-brand-600 dark:text-brand-400">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>AI Suggested Follow-Up Message</span>
                        </span>
                        <span className="text-slate-400 text-[10px]">Recommended Channel: WhatsApp</span>
                      </div>
                      <div className="p-3.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{draft}"
                      </div>
                    </div>
                  </div>

                  {/* Execution Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">Human approval required</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendFollowUp(deal.id, 'Email')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        Send Email
                      </button>
                      <button
                        onClick={() => handleSendFollowUp(deal.id, 'WhatsApp')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Send WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {dormantDeals.length === 0 && (
              <div className="col-span-2 p-12 text-center rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {lang === 'ar' ? 'لا توجد أي صفقات راكدة !' : 'Zero Dormant Deals!'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All active opportunities have been contacted within the last 7 days. Your pipeline is operating with optimal velocity.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALL ACTIVITIES / TIMELINE */}
      {activeTab === 'all' && (
        <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm p-6 space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {activities.map((act) => {
              const isCall = act.type === 'call'
              const isMeeting = act.type === 'meeting'
              const isAi = act.type === 'ai_alert'

              return (
                <div key={act.id} className="py-4 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isAi
                      ? 'bg-rose-500/10 text-rose-600'
                      : isMeeting
                      ? 'bg-purple-500/10 text-purple-600'
                      : 'bg-brand-500/10 text-brand-600'
                  }`}>
                    {isAi ? <AlertTriangle className="h-5 w-5" /> : isMeeting ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {act.date} at {act.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {act.notes}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span>Contact: <strong>{act.contactName}</strong></span>
                      <span>•</span>
                      <span>Sales Rep: <strong>{act.repName}</strong></span>
                      {act.dealTitle && (
                        <>
                          <span>•</span>
                          <span className="text-brand-600 font-semibold">{act.dealTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* LOG ACTIVITY MODAL */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'تسجيل نشاط تجاري جديد' : 'Log Commercial Interaction'}
              </h3>
              <button
                onClick={() => setIsLogOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Activity Type
                  </label>
                  <select
                    value={activityForm.type}
                    onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="call">Phone Call</option>
                    <option value="meeting">Video Demo / Meeting</option>
                    <option value="email">Summary Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Associated Deal
                  </label>
                  <select
                    value={activityForm.dealId}
                    onChange={(e) => setActivityForm({ ...activityForm, dealId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {relevantDeals.map(d => (
                      <option key={d.id} value={d.id}>{d.title} ({d.accountName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Subject / Title *
                </label>
                <input
                  type="text"
                  required
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="e.g., Technical scoping call for ERP integration"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Debrief & Next Actions
                </label>
                <textarea
                  rows={3}
                  value={activityForm.notes}
                  onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
                  placeholder="Notes from interaction, client feedback, action items..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
