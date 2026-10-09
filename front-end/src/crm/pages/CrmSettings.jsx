import { useState } from 'react'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  Settings,
  Building2,
  Clock,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Bell
} from 'lucide-react'

export default function CrmSettings() {
  const { resetData } = useCrm()
  const { lang } = useLanguage()
  const [savedToast, setSavedToast] = useState(false)

  const [settingsForm, setSettingsForm] = useState({
    companyName: 'Atlas Distribution & Intelligence Group',
    currency: 'MAD',
    inactivityThresholdDays: 7,
    discountApprovalThreshold: 15,
    vatRate: 20,
    autoDraftWhatsApp: true,
  })

  const handleSave = (e) => {
    e.preventDefault()
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  const handleReset = () => {
    if (window.confirm("Reset all CRM demo data to default English dataset?")) {
      resetData()
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
              : 'Automated follow-up rules, default currency, and discount governance'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-rose-300 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings */}
        <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-600" />
            <span>Organization & Default Currency</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={settingsForm.companyName}
                onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Default Currency
              </label>
              <select
                value={settingsForm.currency}
                onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="MAD">Moroccan Dirham (MAD)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI & Inactivity Rules */}
        <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-500" />
            <span>Inactivity Rule & Automated Follow-Up (PDF Blueprint)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Inactivity Alert Threshold (Days)
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={settingsForm.inactivityThresholdDays}
                onChange={(e) => setSettingsForm({ ...settingsForm, inactivityThresholdDays: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standardized to 7 days per Intelligence Sales blueprint.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Discount Approval Threshold (%)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={settingsForm.discountApprovalThreshold}
                onChange={(e) => setSettingsForm({ ...settingsForm, discountApprovalThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Any discount above this threshold requires Sales Director sign-off.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
