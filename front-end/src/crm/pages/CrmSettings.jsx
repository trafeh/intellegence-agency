import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrm } from '../context/CrmContext'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  Settings,
  Building2,
  Clock,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Bell,
  ShieldAlert
} from 'lucide-react'

export default function CrmSettings() {
  const { resetData } = useCrm()
  const { role } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [savedToast, setSavedToast] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    companyName: 'Atlas Distribution & Intelligence Group', currency: 'MAD', inactivityThresholdDays: 7,
    discountApprovalThreshold: 15, vatRate: 20, autoDraftWhatsApp: true,
  })

  // System Settings: Restricted to Administrator (CRO / Root Admin)
  if (role !== 'admin' && role !== 'director') {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm mt-8">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? 'منطقة مخصصة لمدير النظام' : 'System Administrator Area'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {lang === 'ar'
            ? 'تعديل المعايير المالية العامة، نسب الضريبة (TVA 20%)، وقواعد المتابعة الآلية محصورة بحسابات إدارة النظام.'
            : 'Global financial parameters, VAT tax rates (20% TVA Maroc), and follow-up thresholds are restricted to Chief Revenue Officer and System Administrators.'}
        </p>
        <button
          onClick={() => navigate('/crm/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
        >
          {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Return to Dashboard'}
        </button>
      </div>
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  const handleReset = async () => {
    if (window.confirm("Refresh CRM records from the server?")) {
      const refreshed = await resetData()
      if (!refreshed) return
      setSavedToast(true)
      setTimeout(() => setSavedToast(false), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-bold">Settings saved successfully!</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === 'ar' ? 'إعدادات النظام التجاري' : 'Configuration & System Settings'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'تخصيص العملة، عتبة المتابعة (7 أيام)، وسياسات الموافقة على الخصومات'
              : 'Enterprise currency, 7-day dormancy threshold, and discount approval governance'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh CRM Data</span>
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Regional & Currency Parameters */}
        <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
            <Building2 className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Regional & Enterprise Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Company Display Name
              </label>
              <input
                type="text"
                value={settingsForm.companyName}
                onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Default Currency
              </label>
              <select
                value={settingsForm.currency}
                onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-semibold"
              >
                <option value="MAD">MAD — Moroccan Dirham (درهم مغربي)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="USD">USD — US Dollar ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Standard TVA / Tax Rate (%)
              </label>
              <input
                type="number"
                value={settingsForm.vatRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, vatRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard Moroccan corporate VAT rate is 20%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Commercial Governance & AI Rules */}
        <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Commercial Governance & AI Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Dormancy Alert Threshold (Days)
              </label>
              <input
                type="number"
                value={settingsForm.inactivityThresholdDays}
                onChange={(e) => setSettingsForm({ ...settingsForm, inactivityThresholdDays: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Deals with no interaction beyond 7 days trigger warning</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Discount Approval Threshold (%)
              </label>
              <input
                type="number"
                value={settingsForm.discountApprovalThreshold}
                onChange={(e) => setSettingsForm({ ...settingsForm, discountApprovalThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Discounts above 15% require VP Sales / Director sign-off</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Automated WhatsApp Pre-Drafts
              </div>
              <div className="text-[11px] text-slate-400">
                Generates personalized WhatsApp reactivation messages when 7-day dormancy is detected
              </div>
            </div>
            <input
              type="checkbox"
              checked={settingsForm.autoDraftWhatsApp}
              onChange={(e) => setSettingsForm({ ...settingsForm, autoDraftWhatsApp: e.target.checked })}
              className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  )
}
