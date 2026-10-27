import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import { crmApi } from '../../services/crmApi'
import {
  Users,
  Phone,
  Mail,
  User,
  ShieldAlert,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { formatCompactMAD } from '../data/crmMockData'

export default function CrmTeam() {
  const { role } = useAuth()
  const { deals } = useCrm()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const [teamUsers, setTeamUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = () => {
    if (role !== 'manager' && role !== 'admin') {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    crmApi.getUsers()
      .then(res => {
        setTeamUsers(res?.data || [])
      })
      .catch(err => {
        setError(err?.message || 'Unable to load team members.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [role])

  // Guard: Sales Team management is restricted to Manager, Admin, Director
  if (role === 'rep' || role === 'client') {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm mt-8">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? 'منطقة مخصصة لإدارة المبيعات' : 'Sales Management Area'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {lang === 'ar'
            ? 'الاطلاع على أهداف الفريق، نسب الإنجاز، وهياكل العمولات مخصص لمدير المبيعات والإدارة العامة.'
            : 'Access to sales team quotas, individual attainment comparisons, and commission structures is restricted to Sales Managers and Executive Administrators.'}
        </p>
        <button
          onClick={() => navigate('/crm/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
        >
          {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Return to My Dashboard'}
        </button>
      </div>
    )
  }

  const salesReps = teamUsers.filter(u => u.role === 'rep')
  const totalQuota = salesReps.reduce((sum, u) => sum + (Number(u.quota) || 0), 0)
  const totalWon = deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  const collectivePct = totalQuota > 0 ? Math.min(100, Math.round((totalWon / totalQuota) * 100)) : 0
  const remainingQuota = Math.max(0, totalQuota - totalWon)

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'فريق المبيعات والأهداف الفردية' : 'Sales Team & Quotas'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-xs font-bold border border-brand-500/20">
              {lang === 'ar' ? 'إدارة المبيعات' : 'Executive Overview'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'متابعة أداء كل بائع، نسب تحقيق الأهداف، وحساب العمولات الآلية'
              : 'Tracking individual performances, quota attainment rates, and automated commission calculations'}
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{lang === 'ar' ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500 text-xs shrink-0"
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* Global Quota Overview Card */}
      <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'الهدف الكلي للربع' : 'Collective Team Target'}
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {formatCompactMAD(totalQuota, lang)}
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'المحقق حتى اليوم (Won)' : 'Achieved To Date (Won)'}
            </span>
            <div className="text-3xl font-black text-brand-600 dark:text-brand-400 tracking-tight mt-1">
              {formatCompactMAD(totalWon, lang)}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>
              {lang === 'ar' ? `التقدم الإجمالي: ${collectivePct}%` : `Collective Progress: ${collectivePct}%`}
            </span>
            <span>
              {lang === 'ar' ? 'المتبقي للإنجاز:' : 'Remaining:'}{' '}
              <strong className="text-slate-900 dark:text-white">{formatCompactMAD(remainingQuota, lang)}</strong>
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${collectivePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Reps Cards Grid / States */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm text-slate-500 text-xs">
          <RefreshCw className="h-6 w-6 text-brand-500 animate-spin mx-auto mb-2" />
          <p>{lang === 'ar' ? 'جاري تحميل أعضاء الفريق...' : 'Loading sales team members...'}</p>
        </div>
      ) : salesReps.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm text-slate-500 text-xs space-y-2">
          <Users className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {lang === 'ar' ? 'لا يوجد مندوبو مبيعات مسجلون' : 'No sales representatives found'}
          </p>
          <p className="text-slate-400">
            {lang === 'ar'
              ? 'لم يتم العثور على مستخدمين بدور مندوب مبيعات (rep) في قاعدة البيانات.'
              : 'No users with the sales representative role (rep) exist in the system.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salesReps.map((rep) => {
            const repDeals = deals.filter(d => String(d.ownerId) === String(rep.id) || d.ownerName?.toLowerCase() === rep.name?.toLowerCase())
            const wonDeals = repDeals.filter(d => d.stage === 'won')
            const repWon = wonDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
            const quota = Number(rep.quota) || 0
            const pct = quota > 0 ? Math.min(100, Math.round((repWon / quota) * 100)) : 0
            const commission = Math.round(repWon * 0.05) // 5% commission on won deals
            const totalDeals = repDeals.length
            const closingRate = totalDeals > 0 ? Math.round((wonDeals.length / totalDeals) * 100) : 0

            return (
              <div
                key={rep.id}
                className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4"
              >
                {/* Profile Bar */}
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20 shadow-sm shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {rep.name}
                      </h3>
                      <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                        {pct}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {rep.title || 'Sales Representative'}
                    </p>
                  </div>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Quota: {formatCompactMAD(quota, lang)}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'المحقق:' : 'Closed (Won):'} {formatCompactMAD(repWon, lang)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 dark:bg-brand-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Commission & Deals Stats */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">
                      {lang === 'ar' ? 'العمولة (5%)' : 'Commissions (5%)'}
                    </span>
                    <span className="font-black text-brand-600 dark:text-brand-400">
                      {formatCompactMAD(commission, lang)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">
                      {lang === 'ar' ? 'صفقات نشطة' : 'Active Deals'}
                    </span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {totalDeals}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">
                      {lang === 'ar' ? 'نسبة الإغلاق' : 'Closing Rate'}
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {closingRate}%
                    </span>
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 truncate">
                    <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{rep.phone || '—'}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{rep.email}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

