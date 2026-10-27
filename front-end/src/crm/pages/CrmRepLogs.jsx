import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  ClipboardList,
  Search,
  Filter,
  User,
  Building2,
  Calendar,
  Clock,
  ArrowRightCircle,
  FileText,
  Phone,
  Video,
  Mail,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Inbox
} from 'lucide-react'

export default function CrmRepLogs() {
  const { activities, loading, mutationError, resetData } = useCrm()
  const { currentUser, role } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const [selectedRep, setSelectedRep] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [dateFilter, setDateFilter] = useState('all') // 'all' | 'today' | '7days'
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Guard: Accessible only by Admin & Manager
  if (role === 'rep' || role === 'client') {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm mt-8">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? 'فضاء خاص بالإدارة والمشرفين' : 'Manager & Admin Access Only'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {lang === 'ar'
            ? 'سجل أنشطة وتدخلات البائعين متاح فقط لمدير المبيعات والإدارة العامة لمراقبة الأداء والتدقيق التجاري.'
            : 'The sales representative activity audit log is restricted to sales managers and executive administrators for governance and performance oversight.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/crm/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md"
          >
            {lang === 'ar' ? 'العودة للوحة التحكم' : 'Return to Dashboard'}
          </button>
        </div>
      </div>
    )
  }

  // Extract unique reps from activities
  const repsList = useMemo(() => {
    const map = new Map()
    activities.forEach(act => {
      if (act.repName) {
        map.set(act.repName, {
          name: act.repName,
          id: act.repId || act.repName,
        })
      }
    })
    return Array.from(map.values())
  }, [activities])

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    return activities.filter(act => {
      // 1. Rep filter
      if (selectedRep !== 'all' && act.repName !== selectedRep && act.repId !== selectedRep) {
        return false
      }

      // 2. Action Type filter
      if (selectedType !== 'all') {
        const t = (act.type || '').toLowerCase()
        if (selectedType === 'stage' && !t.includes('stage') && !act.title.toLowerCase().includes('phase')) return false
        if (selectedType === 'deal' && !t.includes('deal')) return false
        if (selectedType === 'lead' && !t.includes('lead')) return false
        if (selectedType === 'quote' && !t.includes('quote') && !act.title.toLowerCase().includes('devis')) return false
        if (selectedType === 'interaction' && !['call', 'meeting', 'email', 'note'].includes(t)) return false
        if (selectedType === 'followup' && !t.includes('whatsapp') && !t.includes('ai') && !t.includes('follow')) return false
      }

      // 3. Date filter
      if (dateFilter === 'today' && act.date !== todayStr) return false
      if (dateFilter === '7days' && act.date < sevenDaysAgo) return false

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (act.title || '').toLowerCase().includes(q)
        const matchNotes = (act.notes || '').toLowerCase().includes(q)
        const matchRep = (act.repName || '').toLowerCase().includes(q)
        const matchDeal = (act.dealTitle || '').toLowerCase().includes(q)
        const matchContact = (act.contactName || '').toLowerCase().includes(q)
        const matchAccount = (act.accountName || '').toLowerCase().includes(q)
        if (!matchTitle && !matchNotes && !matchRep && !matchDeal && !matchContact && !matchAccount) {
          return false
        }
      }

      return true
    })
  }, [activities, selectedRep, selectedType, dateFilter, searchQuery])

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = activities.length
    const uniqueReps = new Set(activities.map(a => a.repName).filter(Boolean)).size
    const stageMoves = activities.filter(a => (a.type || '').includes('stage') || (a.title || '').toLowerCase().includes('phase')).length
    const clientEngagements = activities.filter(a => ['call', 'meeting', 'email', 'whatsapp'].includes(a.type) || (a.title || '').toLowerCase().includes('follow-up')).length

    return { total, uniqueReps, stageMoves, clientEngagements }
  }, [activities])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      if (resetData) await resetData()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Helper badge & icon selector
  const getTypeBadge = (act) => {
    const t = (act.type || '').toLowerCase()
    const title = (act.title || '').toLowerCase()

    if (t.includes('stage') || title.includes('phase')) {
      return {
        label: lang === 'ar' ? 'تغيير مرحلة' : 'Stage Move',
        color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: ArrowRightCircle,
      }
    }
    if (t.includes('deal_created') || title.includes('opportunité')) {
      return {
        label: lang === 'ar' ? 'إنشاء صفقة' : 'Deal Created',
        color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        icon: PlusCircle,
      }
    }
    if (t.includes('lead') || title.includes('prospect')) {
      return {
        label: lang === 'ar' ? 'عميل محتمل' : 'Lead Action',
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: TrendingUp,
      }
    }
    if (t.includes('quote') || title.includes('devis')) {
      return {
        label: lang === 'ar' ? 'عرض سعر' : 'Quote / Devis',
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: FileText,
      }
    }
    if (t === 'call') {
      return {
        label: lang === 'ar' ? 'مكالمة' : 'Call Logged',
        color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        icon: Phone,
      }
    }
    if (t === 'meeting') {
      return {
        label: lang === 'ar' ? 'اجتماع' : 'Meeting Held',
        color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        icon: Video,
      }
    }
    if (t === 'email') {
      return {
        label: lang === 'ar' ? 'بريد' : 'Email Sent',
        color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        icon: Mail,
      }
    }
    if (t.includes('whatsapp') || t.includes('ai') || title.includes('follow-up')) {
      return {
        label: lang === 'ar' ? 'متابعة ذكية' : 'AI Follow-Up',
        color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Sparkles,
      }
    }
    if (t.includes('inbound')) {
      return {
        label: lang === 'ar' ? 'طلب وارد' : 'Inbound Request',
        color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: Inbox,
      }
    }

    return {
      label: lang === 'ar' ? 'ملاحظة' : 'Note / Action',
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      icon: MessageSquare,
    }
  }

  return (
    <div className="space-y-6 max-w-full pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{lang === 'ar' ? 'سجل نشاط وتدخلات البائعين' : 'Sales Rep Activity Audit Log'}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-xs font-bold border border-brand-500/20">
                {filteredActivities.length} {lang === 'ar' ? 'سجل' : 'events'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'مراقبة فورية وتدقيق شامل لكل حركة يقوم بها المندوبون: تغيير المراحل، إنشاء الصفقات، العروض، والاتصالات'
              : 'Real-time executive oversight: track every step sales reps take across deal pipelines, client contacts, quotes, and AI automations.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-white/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
            <span>{lang === 'ar' ? 'تحديث السجل' : 'Refresh Feed'}</span>
          </button>
        </div>
      </div>

      {mutationError && (
        <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{mutationError}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'إجمالي الأنشطة المسجلة' : 'Total Rep Actions'}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Audit trail active</span>
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'البائعون النشطون' : 'Monitored Reps'}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.uniqueReps}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Field & Account Execs
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'تقدم مراحل الصفقات' : 'Pipeline Progressions'}
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {metrics.stageMoves}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Stage changes logged
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'التواصل المباشر مع العملاء' : 'Client Touchpoints'}
          </span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {metrics.clientEngagements}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Calls, Emails & WhatsApp
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-navy-900 p-4 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث عن بائع، صفقة، شركة، أو نوع الإجراء...' : 'Search by rep name, opportunity, client, or action...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-brand-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Rep Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{lang === 'ar' ? 'جميع البائعين' : 'All Sales Reps'}</option>
              {repsList.map((r, i) => (
                <option key={i} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Action Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{lang === 'ar' ? 'كل أنواع الإجراءات' : 'All Action Types'}</option>
              <option value="stage">{lang === 'ar' ? 'تغييرات مراحل الصفقات' : 'Pipeline Stage Moves'}</option>
              <option value="deal">{lang === 'ar' ? 'إنشاء وتعديل الصفقات' : 'Deal Creation & Updates'}</option>
              <option value="lead">{lang === 'ar' ? 'العملاء المحتملين والتحويل' : 'Lead Conversions & Adds'}</option>
              <option value="quote">{lang === 'ar' ? 'عروض الأسعار (Devis)' : 'Quotes & Proposals'}</option>
              <option value="interaction">{lang === 'ar' ? 'المكالمات والاجتماعات' : 'Calls, Meetings & Notes'}</option>
              <option value="followup">{lang === 'ar' ? 'متابعات واتساب والذكاء الاصطناعي' : 'Follow-Up Engine & AI'}</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'all'
                  ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'today'
                  ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'اليوم' : 'Today'}
            </button>
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === '7days'
                  ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? '7 أيام' : '7 Days'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Activity Timeline Table */}
      <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Clock className="h-7 w-7 text-brand-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">{lang === 'ar' ? 'جاري تحميل سجل النشاطات...' : 'Loading rep activity records...'}</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ClipboardList className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === 'ar' ? 'لم يتم العثور على أي نشاط مطابق' : 'No matching activities found'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {lang === 'ar'
                ? 'جرب تغيير فلاتر البحث أو اختيار بائع آخر لرؤية الأنشطة المسجلة.'
                : 'Try adjusting your filters or search criteria to view recorded rep interactions.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredActivities.map((act) => {
              const badge = getTypeBadge(act)
              const BadgeIcon = badge.icon
              const repInitials = (act.repName || 'CO')
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              return (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Rep Info + Action Details */}
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Rep Initials Avatar */}
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {repInitials}
                    </div>

                    <div className="space-y-1 flex-1">
                      {/* Rep Name & Action Tag Header */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {act.repName || 'Sales Commercial'}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                          <BadgeIcon className="h-3 w-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          ID: #{act.id}
                        </span>
                      </div>

                      {/* Action Title */}
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {act.title}
                      </h4>

                      {/* Detailed Description */}
                      {act.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                          {act.notes}
                        </p>
                      )}

                      {/* Associated Opportunity / Account Link */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {act.dealTitle && (
                          <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                            <TrendingUp className="h-3 w-3 shrink-0" />
                            <span>{act.dealTitle}</span>
                          </span>
                        )}
                        {(act.contactName || act.accountName) && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                            <span>{act.accountName || act.contactName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Timestamp & Audit Status */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 text-right">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{act.date}</span>
                      <span className="text-slate-400">à</span>
                      <span>{act.time}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Audited</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
