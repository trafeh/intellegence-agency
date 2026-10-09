import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  Users,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
  User
} from 'lucide-react'
import { formatCompactMAD } from '../data/crmMockData'

export default function CrmTeam() {
  const { users } = useAuth()
  const { deals } = useCrm()
  const { lang } = useLanguage()

  // Format currency
  const formatMAD = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const salesReps = users.filter(u => u.role === 'rep')

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'فريق المبيعات والأهداف الفردية' : 'Sales Team & Quotas'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-xs font-bold border border-brand-500/20">
              👑 {lang === 'ar' ? 'إدارة المبيعات' : 'Executive Overview'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'متابعة أداء كل بائع، نسب تحقيق الأهداف، وحساب العمولات الآلية'
              : 'Tracking individual performances, quota attainment rates, and automated commission calculations'}
          </p>
        </div>
      </div>

      {/* Global Quota Overview Card - Clean theme style without loud gradient */}
      <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'الهدف الكلي للربع (Q4 2026)' : 'Global Quarterly Target (Q4 2026)'}
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {formatCompactMAD(3500000, lang)}
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'ar' ? 'المحقق حتى اليوم' : 'Achieved To Date'}
            </span>
            <div className="text-3xl font-black text-brand-600 dark:text-brand-400 tracking-tight mt-1">
              {formatCompactMAD(2850000, lang)}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{lang === 'ar' ? 'التقدم الإجمالي: 81.4%' : 'Collective Progress: 81.4%'}</span>
            <span>{lang === 'ar' ? 'المتبقي للإنجاز:' : 'Remaining:'} <strong className="text-slate-900 dark:text-white">{formatCompactMAD(650000, lang)}</strong></span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-brand-600 dark:bg-brand-500 rounded-full" style={{ width: '81.4%' }} />
          </div>
        </div>
      </div>

      {/* Reps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salesReps.map((rep, idx) => {
          const repDeals = deals.filter(d => d.ownerId === rep.id || d.ownerName === rep.name)
          const repWon = repDeals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.amount, 0)
          const pct = Math.min(100, Math.round((rep.achieved / rep.quota) * 100))
          const commission = Math.round(rep.achieved * 0.05) // 5% commission

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
                    {rep.title}
                  </p>
                </div>
              </div>

              {/* Quota Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Quota: {formatCompactMAD(rep.quota, lang)}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lang === 'ar' ? 'الموقع:' : 'Closed:'} {formatCompactMAD(rep.achieved, lang)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 dark:bg-brand-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Commission & Deals Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'العمولة (5%)' : 'Commissions (5%)'}</span>
                  <span className="font-black text-brand-600 dark:text-brand-400">{formatCompactMAD(commission, lang)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'صفقات نشطة' : 'Active Deals'}</span>
                  <span className="font-black text-slate-900 dark:text-white">{repDeals.length}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'نسبة الإغلاق' : 'Closing Rate'}</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">74%</span>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{rep.phone}</span>
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
    </div>
  )
}

