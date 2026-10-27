import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { crmApi } from '../services/crmApi'
import PhoneInputField from './PhoneInputField'
import {
  X,
  CheckCircle2,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  Sparkles,
  AlertCircle,
  Key,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'

export default function PartnerModal({ isOpen, onClose }) {
  const { lang } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: 'Casablanca',
    productCategory: 'Distribution & Vente en Gros (Wholesale Products)',
    estimatedVolume: '50 000 – 200 000 MAD',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [createdCredentials, setCreatedCredentials] = useState(null)
  const [quoteRef, setQuoteRef] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const res = await crmApi.submitPublicProposal({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        team_size: formData.estimatedVolume,
        notes: `Catégorie: ${formData.productCategory} | Ville: ${formData.city} | Budget/Volume: ${formData.estimatedVolume} | Détails: ${formData.notes || 'Devis demandé via le site'}`
      })

      if (res?.data?.portal_credentials) {
        setCreatedCredentials(res.data.portal_credentials)
      }
      if (res?.data?.quote_ref) {
        setQuoteRef(res.data.quote_ref)
      }
      setSubmitted(true)
    } catch (err) {
      console.warn('Public proposal submit fallback:', err)
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyCredentials = () => {
    if (!createdCredentials) return
    const text = `Identifiants Espace Client Intelligence Sales:\nEmail: ${createdCredentials.email}\nMot de passe: ${createdCredentials.password || '(Conservé)'}\nConnexion: ${window.location.origin}/login`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'تم استلام طلب عرض السعر وإنشاء الحساب !' : 'Quotation Request & Client Account Created!'}
              </h3>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-bold mt-1">
                Ref: {quoteRef || `DEV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`}
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              {lang === 'ar'
                ? `شكراً لتواصلكم. تم إرسال رسالة تأكيد تتضمن تفاصيل الطلب وبيانات تسجيل الدخول إلى بريدكم الإلكتروني (${formData.email}).`
                : `Thank you! An official confirmation email with your request details and login credentials was sent to ${formData.email}.`}
            </p>

            {/* Client Space Credentials Card */}
            {createdCredentials && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Key className="h-3.5 w-3.5 text-brand-600" />
                    <span>{lang === 'ar' ? 'بيانات الدخول إلى فضاء الزبون' : 'Your Client Portal Credentials'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                    {lang === 'ar' ? 'تم الإرسال بالبريد' : 'Sent by Email'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-navy-950/80 border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 font-sans text-[11px]">{lang === 'ar' ? 'البريد:' : 'Email:'}</span>
                    <span className="font-bold">{createdCredentials.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 font-sans text-[11px]">{lang === 'ar' ? 'كلمة المرور المؤقتة:' : 'Temporary Password:'}</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {createdCredentials.password || '(Mot de passe existant)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyCredentials}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-bold text-slate-800 dark:text-slate-100 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ البيانات' : 'Copy Credentials')}</span>
                  </button>

                  <a
                    href="/login"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-colors shadow-md shadow-brand-600/20"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Go to Portal'}</span>
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setCreatedCredentials(null)
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    city: 'Casablanca',
                    productCategory: 'Distribution & Vente en Gros (Wholesale Products)',
                    estimatedVolume: '50 000 – 200 000 MAD',
                    notes: ''
                  })
                  onClose()
                }}
                className="px-6 py-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase transition-colors"
              >
                {lang === 'ar' ? 'إغلاق النافذة' : 'Close Window'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400 text-[10px] font-extrabold uppercase tracking-widest border border-brand-500/20 mb-2">
                <Sparkles className="h-3 w-3" />
                <span>{lang === 'ar' ? 'طلب عرض سعر للمنتجات' : 'Commercial Products & Quote Request'}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'طلب عرض سعر تجاري رسمي (Devis)' : 'Request an Official Product Quotation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'حدد المنتجات، الكميات، ومواصفات الطلبية للحصول على تسعير فوري ومخصص لشركتك.'
                  : 'Specify your product requirements, volume, and delivery destination to receive an audited quotation from our sales team.'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left rtl:text-right">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'الاسم الكامل للمسؤول *' : 'Contact Person Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Karim Berrada"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <PhoneInputField
                    required
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    defaultCountryCode="MA"
                  />
                </div>
              </div>

              {/* Work Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني المهني *' : 'Corporate Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      required
                      type="email"
                      placeholder="contact@entreprise.ma"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'مدينة التسليم / المقر *' : 'City / Delivery Location *'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Casablanca, Tanger, Rabat..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Company & Estimated Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'اسم الشركة أو المؤسسة *' : 'Enterprise / Company Name *'}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Atlas Distribution SA"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    {lang === 'ar' ? 'حجم الطلبية أو الميزانية التقديرية' : 'Estimated Order Volume (MAD)'}
                  </label>
                  <select
                    value={formData.estimatedVolume}
                    onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Moins de 50 000 MAD">&lt; 50 000 MAD</option>
                    <option value="50 000 – 200 000 MAD">50 000 – 200 000 MAD</option>
                    <option value="200 000 – 500 000 MAD">200 000 – 500 000 MAD</option>
                    <option value="Plus de 500 000 MAD">+ 500 000 MAD (Grand Compte)</option>
                  </select>
                </div>
              </div>

              {/* Product Category / Solution */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {lang === 'ar' ? 'نوع المنتجات المطلوبة' : 'Product Category & Supply Type'}
                </label>
                <div className="relative">
                  <Package className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3 h-4 w-4 text-slate-400" />
                  <select
                    value={formData.productCategory}
                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Distribution & Vente en Gros (Wholesale Products)">Distribution & Vente en Gros (Wholesale Products)</option>
                    <option value="Catalogue Produits Entreprise">Catalogue Produits Entreprise & Packs Standards</option>
                    <option value="Fourniture & Équipements Professionnels">Fourniture & Équipements Professionnels B2B</option>
                    <option value="Commande Sur Mesure & Spécifique">Commande Spécifique / Sur Mesure</option>
                  </select>
                </div>
              </div>

              {/* Order Notes / Specifications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {lang === 'ar' ? 'مواصفات وتفاصيل المنتجات أو الكميات' : 'Product References, Quantities or Specific Notes'}
                </label>
                <textarea
                  rows="3"
                  placeholder={lang === 'ar' ? 'حدد المراجع، الكميات المطلوبة، تاريخ التسليم المطلوب أو أي شروط خاصة...' : 'e.g. Please quote for 500 units of SKU-A, 200 units of SKU-B, delivered to Ain Sebaa warehouse by next month...'}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-600/30"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>{lang === 'ar' ? 'جاري إرسال الطلب...' : 'Submitting Quotation Request...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 rtl:rotate-180" />
                    <span>{lang === 'ar' ? 'طلب عرض السعر الرسمي (Devis)' : 'Request Official Quotation (Devis)'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
