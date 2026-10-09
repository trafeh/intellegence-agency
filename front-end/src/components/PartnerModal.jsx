import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { X, CheckCircle2, Send, Building2, User, Mail, Briefcase } from 'lucide-react'

export default function PartnerModal({ isOpen, onClose }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    teamSize: '15-50',
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated submission for early access
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Thank you for connecting with Intelligence Agency. Our commercial enterprise team will reach out within 24 hours to schedule your pilot onboarding.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                onClose()
              }}
              className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs tracking-wider uppercase"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-1">
                Strategic Access Program
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Request Early Access & Partnership
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Join selected B2B enterprises shaping the Commercial Operating System.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="jean@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sales Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="1-15">1 – 15 Reps</option>
                    <option value="15-50">15 – 50 Reps</option>
                    <option value="50-250">50 – 250 Reps</option>
                    <option value="250+">250+ Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Objectives / Integration Needs (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Need WhatsApp lead capture, 7-day follow-up automation, and ERP sales order sync..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-600/30"
              >
                <Send className="h-4 w-4" />
                <span>Submit Partnership Request</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
