import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { formatCompactMAD } from '../data/crmMockData'
import {
  Kanban,
  ListFilter,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  Sparkles,
  ChevronRight,
  FileText,
  Info,
  X
} from 'lucide-react'

export default function CrmPipeline() {
  const { deals, stages, accounts, quotes, users, moveDealStage, addDeal, updateDeal, executeFollowUp, mutationError } = useCrm()
  const { currentUser, role } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'table'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRep, setSelectedRep] = useState('all')
  const [inactivityFilter, setInactivityFilter] = useState(false)

  // Modals state
  const [isNewDealOpen, setIsNewDealOpen] = useState(searchParams.get('action') === 'new-deal')
  const [selectedDeal, setSelectedDeal] = useState(null)

  // Dynamic Sales Reps list
  const salesReps = useMemo(() => {
    const list = (users || []).filter(u => u.role === 'rep' || u.role === 'manager' || u.role === 'admin')
    if (list.length > 0) return list
    return [
      { id: '1', name: 'Karim Tazi', role: 'admin', title: 'CRO / Admin' },
      { id: '2', name: 'Sofia Benali', role: 'manager', title: 'VP Regional Sales' },
      { id: '3', name: 'Yassine Mansouri', role: 'rep', title: 'Senior Account Executive' },
      { id: '4', name: 'Mehdi Alaoui', role: 'rep', title: 'Commercial B2B' },
    ]
  }, [users])

  // New deal form
  const [newDealForm, setNewDealForm] = useState({
    title: '',
    accountId: accounts[0]?.id || '',
    amount: '',
    stage: 'qualification',
    probability: 40,
    expectedClose: '2026-11-30',
    priority: 'high',
    userId: currentUser?.id || '3',
  })

  // Format currency
  const formatMAD = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filtered deals strictly scoped by role
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // 1. Role-based scoping
      if (role === 'rep') {
        const isOwner =
          deal.ownerId === currentUser?.id ||
          deal.ownerName?.toLowerCase().includes(currentUser?.name?.toLowerCase() || '') ||
          deal.user_id === currentUser?.id
        if (!isOwner) return false
      } else if (role === 'client') {
        const clientCompany = currentUser?.accountName || currentUser?.account?.name || ''
        const isClientDeal =
          (currentUser?.accountId && (String(deal.accountId) === String(currentUser.accountId) || String(deal.account_id) === String(currentUser.accountId))) ||
          (clientCompany && deal.accountName?.toLowerCase().includes(clientCompany.toLowerCase()))
        if (!isClientDeal) return false
      }

      // 2. Search query filter
      const matchSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(searchQuery.toLowerCase())

      // 3. Rep filter (managers and admins only)
      const matchRep = (role === 'rep' || role === 'client')
        ? true
        : (selectedRep === 'all' || deal.ownerId === selectedRep || deal.ownerName === selectedRep)

      const matchInactivity = !inactivityFilter || (deal.hasInactivityWarning || deal.lastActivityDaysAgo >= 7)

      return matchSearch && matchRep && matchInactivity
    })
  }, [deals, searchQuery, selectedRep, inactivityFilter, role, currentUser])

  const handleCreateDeal = async (e) => {
    e.preventDefault()
    if (!newDealForm.title || !newDealForm.amount) return

    const acc = accounts.find(a => a.id === newDealForm.accountId) || accounts[0]
    const created = await addDeal({
      title: newDealForm.title,
      accountId: acc.id,
      accountName: acc.name,
      contactName: acc.contactName,
      amount: Number(newDealForm.amount),
      stage: newDealForm.stage,
      probability: Number(newDealForm.probability),
      expectedClose: newDealForm.expectedClose,
      priority: newDealForm.priority,
      userId: newDealForm.userId || undefined,
    })
    if (!created) return

    setIsNewDealOpen(false)
    setNewDealForm({
      title: '',
      accountId: accounts[0]?.id || '',
      amount: '',
      stage: 'qualification',
      probability: 40,
      expectedClose: '2026-11-30',
      priority: 'high',
      userId: currentUser?.id || '3',
    })
  }

  // Get next stage for fast forward
  const getNextStageId = (currentStageId) => {
    const idx = stages.findIndex(s => s.id === currentStageId)
    if (idx === -1) return null
    const next = stages[idx + 1]
    if (!next || next.id === 'won' || next.id === 'lost') {
      return null
    }
    return next.id
  }

  // Client Guard: Internal sales pipeline & stages are hidden from clients
  if (role === 'client') {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm mt-8">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? 'فضاء الزبون — العروض والاتفاقيات' : 'Client Dedicated Space'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {lang === 'ar'
            ? 'مسار الصفقات والـ Kanban الداخلي مخصص لفريق المبيعات. يمكنك فحص وتوقيع عروض الأسعار الخاصة بكم مباشرة من قسم العروض.'
            : 'Internal sales stage progression is reserved for agency sales representatives. Your customized proposals and signed contracts are accessible in your dedicated Client Portal.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/crm/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition-all"
          >
            {lang === 'ar' ? 'الرئيسية (فضاء الزبون)' : 'Client Space'}
          </button>
          <button
            onClick={() => navigate('/crm/quotes')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
          >
            {lang === 'ar' ? 'عروض الأسعار والاتفاقيات' : 'My Quotations & Offers'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Header & Pipeline Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'مسار الصفقات التجارية' : 'Deals Pipeline & Opportunities'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-xs font-bold border border-brand-500/20">
              {filteredDeals.length} deals
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'إدارة مراحل البيع، تقدم المفاوضات، وتطبيق قواعد الذكاء الاصطناعي'
              : 'Visual management of the end-to-end sales cycle from lead qualification to closed won'}
          </p>
        </div>

        {/* New deal CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewDealOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'ar' ? 'صفقة جديدة' : 'New Opportunity'}</span>
          </button>
        </div>
      </div>

      {/* Role Scoping Banner */}
      {role === 'rep' && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            {lang === 'ar'
              ? `وضع المندوب التجاري: تشاهد فقط صفقاتك الخاصة المسندة إليك (${filteredDeals.length} صفقة لـ ${currentUser?.name || 'حسابك'}).`
              : `Commercial Portfolio: Viewing your ${filteredDeals.length} assigned deals (${currentUser?.name || 'Your Account'}).`}
          </span>
        </div>
      )}

      {role === 'client' && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <Building2 className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            {lang === 'ar'
              ? `فضاء الزبون: تشاهد فقط مشاريع وصفقات شركة ${currentUser?.accountName || currentUser?.account?.name || 'حسابكم'}.`
              : `Client Space: Viewing active opportunities and projects for ${currentUser?.accountName || currentUser?.account?.name || 'Your Company'}.`}
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-900 p-3.5 rounded-lg border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث عن صفقة، شركة، أو مسؤول...' : 'Search by opportunity, company, or contact...'}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-brand-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Rep filter (Only for Admin & Manager) */}
          {(role === 'admin' || role === 'manager' || role === 'director') && (
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">{lang === 'ar' ? 'جميع البائعين' : 'All Sales Reps'}</option>
              {salesReps.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.name}
                </option>
              ))}
            </select>
          )}

          {/* Inactivity 7-Day Filter Button */}
          <button
            onClick={() => setInactivityFilter(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              inactivityFilter
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            <AlertTriangle className={`h-3.5 w-3.5 ${inactivityFilter ? 'animate-pulse' : 'text-rose-500'}`} />
            <span>{lang === 'ar' ? 'عالقون 7 أيام' : 'Inactive > 7 Days'}</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW - 4x4 Responsive Grid */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
          {stages.map((st) => {
            const stageDeals = filteredDeals.filter(d => d.stage === st.id)
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0)
            const isWonStage = st.id === 'won'
            const isLostStage = st.id === 'lost'

            return (
              <div
                key={st.id}
                className="w-full flex flex-col bg-slate-100/80 dark:bg-navy-900/80 rounded-lg border border-slate-200/80 dark:border-white/10 p-3.5"
              >
                {/* Stage Header */}
                <div className="p-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                      {lang === 'ar' ? st.nameAr : st.nameEn}
                    </span>
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-200 text-[10px] font-extrabold flex items-center justify-center border border-slate-200 dark:border-white/10">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400">
                    {formatCompactMAD(stageTotal, lang)}
                  </span>
                </div>

                {/* Stage Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                  {stageDeals.map((deal) => {
                    const nextStage = getNextStageId(deal.stage)
                    return (
                      <div
                        key={deal.id}
                        className={`p-4 rounded-lg border shadow-sm transition-all hover:shadow-md cursor-pointer group ${
                          deal.hasInactivityWarning
                            ? 'bg-white dark:bg-navy-900 border-rose-300 dark:border-rose-800/80 ring-1 ring-rose-500/20'
                            : isWonStage
                              ? 'bg-white dark:bg-navy-900 hover:bg-slate-50/90 dark:hover:bg-navy-800/90 border-emerald-300 dark:border-emerald-500/30'
                              : isLostStage
                                ? 'bg-white dark:bg-navy-900 hover:bg-slate-50/90 dark:hover:bg-navy-800/90 border-slate-200 dark:border-white/10 opacity-80'
                                : 'bg-white dark:bg-navy-900 hover:bg-slate-50/90 dark:hover:bg-navy-800/90 border-slate-200 dark:border-white/10 hover:border-brand-500/50'
                        }`}
                        onClick={() => setSelectedDeal(deal)}
                      >
                        {/* 7-Day Inactivity Warning Badge (From PDF) */}
                        {deal.hasInactivityWarning && (
                          <div className="mb-2 p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-bold">
                              <AlertTriangle className="h-3 w-3 animate-pulse shrink-0" />
                              <span>Inactive 8d (Follow-up needed)</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                executeFollowUp(deal.id, 'WhatsApp')
                              }}
                              className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold hover:bg-rose-500"
                            >
                              Follow-Up IA
                            </button>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {deal.accountName}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 transition-colors">
                            {deal.title}
                          </h4>
                        </div>

                        {/* Amount & Probability */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <div className="text-sm font-black text-slate-900 dark:text-white">
                            {formatCompactMAD(deal.amount, lang)}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <span>{deal.probability}%</span>
                          </div>
                        </div>

                        {/* Owner & Quick Actions */}
                        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                          <span className="truncate max-w-[120px] font-medium text-slate-500 dark:text-slate-400">
                            {deal.ownerName}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Create Quote Shortcut */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/crm/quotes?action=new-quote&dealId=${deal.id}&accountId=${deal.accountId}`)
                              }}
                              className="p-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-amber-500 hover:text-white text-slate-500 dark:text-slate-400 transition-colors"
                              title={lang === 'ar' ? 'إنشاء عرض سعر (Devis)' : 'Generate Quote / Devis'}
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>

                            {/* Quick Advance Button (Manager and Admin only) */}
                            {nextStage && (role === 'admin' || role === 'manager' || role === 'director') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveDealStage(deal.id, nextStage)
                                }}
                                className="p-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-brand-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                                title={lang === 'ar' ? 'التقدم للمرحلة التالية (المدير والمشرف فقط)' : 'Advance to next sales stage (Admin & Manager only)'}
                              >
                                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                              </button>
                            )}
                            {!nextStage && isWonStage && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {stageDeals.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-lg">
                      {lang === 'ar' ? 'لا توجد صفقات هنا' : 'No opportunities in this stage'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* TABLE LIST VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Client Enterprise</th>
                  <th className="py-3 px-4">Value (MAD)</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Probability</th>
                  <th className="py-3 px-4">Sales Rep</th>
                  <th className="py-3 px-4">Expected Close</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {deal.title}
                        {deal.hasInactivityWarning && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold">
                            7D+
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {deal.accountName}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                      {formatMAD(deal.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-brand-50 dark:bg-brand-600/10 text-brand-600">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      {deal.probability}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {deal.ownerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {deal.expectedClose}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDeal(deal)
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEAL DETAIL MODAL / DRAWER */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                  {selectedDeal.accountName}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedDeal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Commercial Representative Assignment Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {lang === 'ar' ? 'المندوب التجاري المسؤول' : 'Assigned Commercial Representative'}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {selectedDeal.ownerName || 'Unassigned'}
                    </span>
                  </div>
                </div>

                {/* Manager / Admin Reassignment Control */}
                {(role === 'admin' || role === 'manager' || role === 'director') ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {lang === 'ar' ? 'إسناد لـ:' : 'Assign to:'}
                    </span>
                    <select
                      value={selectedDeal.ownerId || ''}
                      onChange={async (e) => {
                        const newRepId = e.target.value
                        if (!newRepId || newRepId === selectedDeal.ownerId) return
                        const updated = await updateDeal(selectedDeal.id, { userId: newRepId })
                        if (updated) {
                          setSelectedDeal(updated)
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500 shadow-sm"
                    >
                      {salesReps.map((r) => (
                        <option key={r.id} value={String(r.id)}>
                          {r.name} ({r.title || r.role})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    Portfolio: {selectedDeal.ownerName}
                  </span>
                )}
              </div>

              {/* Financial & Stage Bar */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Deal Value</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {formatMAD(selectedDeal.amount)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Probability</span>
                  <div className="text-lg font-black text-emerald-600">
                    {selectedDeal.probability}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Close Date</span>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">
                    {selectedDeal.expectedClose}
                  </div>
                </div>
              </div>

              {/* Stage Progression Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Active Sales Stage
                  </label>
                  {selectedDeal.stage === 'won' && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Locked (Closed Won)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {stages.map((st) => {
                    const isCurrent = selectedDeal.stage === st.id
                    const isWonBtn = st.id === 'won'
                    const isDealWon = selectedDeal.stage === 'won'
                    const isRep = role === 'rep'
                    const isDisabled = isDealWon || (isWonBtn && !isCurrent) || (isRep && !isCurrent)

                    return (
                      <button
                        key={st.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={async () => {
                          if (isDisabled || isCurrent) return
                          const confirmed = await moveDealStage(selectedDeal.id, st.id)
                          if (confirmed) {
                            setSelectedDeal(confirmed)
                          }
                        }}
                        title={
                          isWonBtn && !isCurrent
                            ? 'Deals can only be marked Won by accepting an eligible quote'
                            : isDealWon
                              ? 'Won deals are locked and cannot change stage'
                              : isRep
                                ? 'Only Managers and Admins can change deal stages'
                                : ''
                        }
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          isCurrent
                            ? st.id === 'won'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : isDisabled
                              ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-brand-500'
                        }`}
                      >
                        {lang === 'ar' ? st.nameAr : st.nameEn}
                      </button>
                    )
                  })}
                </div>

                {/* Explanatory note */}
                {role === 'rep' && (
                  <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span>
                      {lang === 'ar'
                        ? 'تغيير مراحل الصفقات مخصص للإدارة (المدير والمشرف). كل تدخلاتك التجارية مسجلة في سجل الأنشطة.'
                        : 'Stage progression is managed exclusively by Sales Managers & Admins. All commercial interactions are recorded in the audit log.'}
                    </span>
                  </p>
                )}
                {role !== 'rep' && selectedDeal.stage === 'won' ? (
                  <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {lang === 'ar'
                        ? 'هذه الصفقة رابحة ومغلقة رسمياً عبر توقيع عرض السعر.'
                        : 'This deal was won via signed quote acceptance and is locked.'}
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    <span>
                      {lang === 'ar'
                        ? 'التحويل إلى صفقة رابحة (Won) يتم تلقائياً فقط عند اعتماد وتوقيع عرض سعر رسمي مرتبط بها.'
                        : 'Deals can only be won by accepting an eligible quote. Generate or accept an official quote below to close.'}
                    </span>
                  </p>
                )}

                {mutationError && (
                  <div className="mt-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{mutationError}</span>
                  </div>
                )}
              </div>

              {/* AI Recommendation Engine Box (PDF requirement) */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/20 border border-brand-500/20 space-y-2">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold">
                  <Sparkles className="h-4 w-4" />
                  <span>Sales AI Agent Diagnostic & Advice</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedDeal.aiRecommendation || 'No commercial blockers detected on this account.'}
                </p>
                {selectedDeal.hasInactivityWarning && (
                  <button
                    onClick={() => {
                      executeFollowUp(selectedDeal.id, 'WhatsApp')
                      setSelectedDeal(prev => ({ ...prev, hasInactivityWarning: false }))
                    }}
                    className="mt-2 w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Trigger Automated WhatsApp Follow-Up
                  </button>
                )}
              </div>

              {/* Products Attached */}
              <div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Attached Products & Solutions
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDeal.products?.map((prod, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-medium"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Associated Quotes / Offers */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-brand-500" />
                    <span>{lang === 'ar' ? 'عروض الأسعار المرتبطة' : 'Official Quotes & Proposals'}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {quotes.filter(q => q.dealId === selectedDeal.id).length} {lang === 'ar' ? 'عرض' : 'quote(s)'}
                  </span>
                </div>
                {quotes.filter(q => q.dealId === selectedDeal.id).length > 0 ? (
                  <div className="space-y-1.5">
                    {quotes.filter(q => q.dealId === selectedDeal.id).map(q => (
                      <div
                        key={q.id}
                        onClick={() => navigate('/crm/quotes')}
                        className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-600 dark:text-brand-400">{q.id}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium">({formatMAD(q.totalTTC)})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          q.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                          q.status === 'Sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    {lang === 'ar' ? 'لا يوجد عرض سعر رسمي بعد لهذه الصفقة' : 'No formal quote generated yet for this opportunity.'}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 bg-slate-50 dark:bg-white/5">
              <button
                onClick={() => {
                  navigate(`/crm/quotes?action=new-quote&dealId=${selectedDeal.id}&accountId=${selectedDeal.accountId}`)
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>{lang === 'ar' ? 'إنشاء عرض سعر (Devis)' : 'Generate Official Quote'}</span>
              </button>

              <button
                onClick={() => setSelectedDeal(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW DEAL MODAL */}
      {isNewDealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'إنشاء فرصة تجارية جديدة' : 'New Sales Opportunity'}
              </h3>
              <button
                onClick={() => setIsNewDealOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDealForm.title}
                  onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                  placeholder="e.g., Enterprise Deployment - Intelligence Sales"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Client Enterprise *
                  </label>
                  <select
                    value={newDealForm.accountId}
                    onChange={(e) => setNewDealForm({ ...newDealForm, accountId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Estimated Amount (MAD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newDealForm.amount}
                    onChange={(e) => setNewDealForm({ ...newDealForm, amount: e.target.value })}
                    placeholder="250000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={newDealForm.stage}
                    onChange={(e) => setNewDealForm({ ...newDealForm, stage: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {stages.map(st => (
                      <option key={st.id} value={st.id}>{st.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Target Close Date
                  </label>
                  <input
                    type="date"
                    value={newDealForm.expectedClose}
                    onChange={(e) => setNewDealForm({ ...newDealForm, expectedClose: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {(role === 'admin' || role === 'manager' || role === 'director') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'المندوب التجاري المسند إليه *' : 'Assign Sales Representative *'}
                  </label>
                  <select
                    value={newDealForm.userId}
                    onChange={(e) => setNewDealForm({ ...newDealForm, userId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    {salesReps.map(r => (
                      <option key={r.id} value={String(r.id)}>
                        {r.name} ({r.title || r.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewDealOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
                >
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
