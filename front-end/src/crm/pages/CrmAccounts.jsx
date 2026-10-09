import { useState } from 'react'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  Building2,
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  TrendingUp,
  FileText,
  DollarSign,
  ChevronRight,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'

export default function CrmAccounts() {
  const { accounts, deals, quotes } = useCrm()
  const { lang } = useLanguage()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)

  // Format currency
  const formatMAD = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredAccounts = accounts.filter(acc => {
    const matchSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.contactName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchTier = selectedTier === 'all' || acc.tier === selectedTier
    return matchSearch && matchTier
  })

  return (
    <div className="space-y-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'ar' ? 'الشركات والعملاء B2B' : 'B2B Client Accounts & Companies'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-xs font-bold border border-brand-500/20">
              {filteredAccounts.length} accounts
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'دليل العملاء، خطوط الائتمان، أصحاب القرار وتاريخ التعاملات'
              : 'Strategic account directory, credit limits, decision-maker registries, and deal history'}
          </p>
        </div>

        <button
          onClick={() => setIsAddAccountOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'ar' ? 'إضافة شركة' : 'New Account'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-navy-900 p-3.5 rounded-lg border border-slate-200 dark:border-white/10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث عن شركة، قطاع، أو مسؤول...' : 'Search by company name, industry, or contact...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="Tier A">Tier A (Strategic Enterprise)</option>
            <option value="Tier B">Tier B (Mid-Market / Regional)</option>
            <option value="Tier C">Tier C (Standard Accounts)</option>
          </select>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => {
          const accountDeals = deals.filter(d => d.accountId === account.id)
          const isTierA = account.tier === 'Tier A'

          return (
            <div
              key={account.id}
              onClick={() => setSelectedAccount(account)}
              className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm hover:border-brand-500/50 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {account.industry}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      {account.name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                    isTierA
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  }`}>
                    {account.tier}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{account.city}</span>
                </div>

                {/* Primary Decision Maker */}
                <div className="p-3 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Primary Decision Maker</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {account.contactName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {account.contactTitle}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">Lifetime Revenue</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatMAD(account.revenueLifetime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">Credit Line Limit</span>
                    <span className="font-bold text-emerald-600">
                      {formatMAD(account.creditLimit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-600/10 text-brand-600 font-bold text-[10px]">
                  {accountDeals.length} linked opportunities
                </span>
                <span className="text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Profile</span>
                  <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ACCOUNT DETAIL MODAL */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedAccount.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedAccount.industry} • {selectedAccount.city}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Financial & Compliance Card */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Client Tier</span>
                  <div className="text-base font-black text-brand-600 mt-0.5">
                    {selectedAccount.tier}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Authorized Credit Limit</span>
                  <div className="text-base font-black text-emerald-600 mt-0.5">
                    {formatMAD(selectedAccount.creditLimit)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lifetime Invoiced Value</span>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    {formatMAD(selectedAccount.revenueLifetime)}
                  </div>
                </div>
              </div>

              {/* Decision Maker Contact Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Key Decision Makers & Stakeholders
                </h4>
                <div className="p-4 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedAccount.contactName}
                    </div>
                    <div className="text-xs text-brand-600 font-semibold">
                      {selectedAccount.contactTitle}
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {selectedAccount.contactPhone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {selectedAccount.contactEmail}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedAccount.contactPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-brand-600 hover:text-white text-xs font-bold transition-colors"
                    >
                      Call
                    </a>
                    <a
                      href={`mailto:${selectedAccount.contactEmail}`}
                      className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Deals for this Account */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Linked Deals & Opportunities
                </h4>
                <div className="space-y-2">
                  {deals.filter(d => d.accountId === selectedAccount.id).map(deal => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-md bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{deal.title}</div>
                        <span className="text-[10px] text-slate-400">Stage: {deal.stage} • Probability: {deal.probability}%</span>
                      </div>
                      <span className="text-xs font-black text-brand-600">{formatMAD(deal.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-white/5 flex justify-end bg-slate-50 dark:bg-white/5">
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
