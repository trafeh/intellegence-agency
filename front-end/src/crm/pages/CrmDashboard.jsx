import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCrm } from '../context/CrmContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import {
  TrendingUp,
  DollarSign,
  Target,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
  PhoneCall,
  Video,
  FileText,
  BarChart3,
  Building2,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Download,
  Flame,
  Zap,
  Info
} from 'lucide-react'

import { formatCompactMAD } from '../data/crmMockData'

export default function CrmDashboard() {
  const { currentUser, role } = useAuth()
  const { deals, leads, quotes, activities, stages, executeFollowUp, approveQuoteDiscount } = useCrm()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [revenueChartMode, setRevenueChartMode] = useState('monthly') // 'monthly' | 'cumulative'
  const [successToast, setSuccessToast] = useState(null)

  // Format MAD currency helper
  const formatMAD = (amount) => {
    return formatCompactMAD(amount, lang)
  }

  const formatFullMAD = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // ==========================================
  // 1. CLIENT PORTAL DASHBOARD VIEW
  // ==========================================
  if (role === 'client') {
    const clientCompany = currentUser?.company || 'MaroCraft Industries'
    const clientQuotes = quotes.filter(q =>
      q.accountName?.toLowerCase().includes('marocraft') ||
      q.client_company?.toLowerCase().includes('marocraft') ||
      q.client_email === currentUser?.email
    )
    const pendingQuotes = clientQuotes.filter(q => q.status !== 'Accepted')
    const acceptedQuotes = clientQuotes.filter(q => q.status === 'Accepted')
    const totalValidatedInvestment = acceptedQuotes.reduce((sum, q) => sum + (q.totalTTC || q.total_amount || 0), 0)

    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-brand-500/10 via-brand-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {lang === 'ar'
                  ? `فضاء الزبون — ${clientCompany}`
                  : `Client Space — ${clientCompany}`}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-brand-500/10 text-brand-600 border border-brand-500/20">
                {lang === 'ar' ? 'حساب شريك استراتيجي' : 'Strategic Partner Account'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ar'
                ? `مرحباً بك ${currentUser?.name || 'عمر القباج'}. تتبع عروض الأسعار، العقود المعتمدة، وتفاصيل المشاريع المشتركة.`
                : `Welcome, ${currentUser?.name || 'Omar Kabbaj'}. Review your commercial proposals, active contracts, and project milestones.`}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => navigate('/portal/quote/marocraft-token-2026')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              <span>{lang === 'ar' ? 'فحص والتوقيع على العرض' : 'Review & Sign Offer'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards for Client */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Pending Proposals */}
          <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'عروض الأسعار قيد المراجعة' : 'Proposals Awaiting Review'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {pendingQuotes.length > 0 ? `${pendingQuotes.length} Offre en attente` : '0'}
            </div>
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Quote Q-2026-001 (125,000 MAD) valid until Nov 2026</span>
            </p>
          </div>

          {/* Card 2: Validated Investment */}
          <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'الاستثمار المعتمد' : 'Validated Investment (TTC)'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {totalValidatedInvestment > 0 ? formatFullMAD(totalValidatedInvestment) : '125 000 MAD'}
            </div>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Enterprise Service Level Agreement (SLA)</span>
            </p>
          </div>

          {/* Card 3: Project Status */}
          <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'حالة التنفيذ والمواكبة' : 'Deployment & Implementation'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Phase 1 : On Track
            </div>
            <p className="mt-2 text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Kickoff meeting completed with Technical Director</span>
            </p>
          </div>
        </div>

        {/* Two Columns: Actionable Quotations Table + Dedicated Account Exec Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left (2 cols): Client Proposals & E-Signing Table */}
          <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-600" />
                  <span>{lang === 'ar' ? 'عروض الأسعار والاتفاقيات الخاصة بكم' : 'Your Proposals & Commercial Offers'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'يمكنك فحص البنود وتوقيع العقود إلكترونياً بصفة آمنة' : 'Direct digital review with legally-binding electronic signature'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {clientQuotes.map(quote => (
                <div
                  key={quote.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400">
                        {quote.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        quote.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {quote.status === 'Accepted' ? 'Validé & Signé' : 'En attente de signature'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Intelligence Sales Solution — Déploiement Corporate
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      TVA Maroc (20%) incluse • Validité 30 jours
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right rtl:text-left">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {formatFullMAD(quote.totalTTC || quote.total_amount || 125000)}
                      </div>
                      <span className="text-[10px] text-slate-400">Montant TTC</span>
                    </div>

                    <button
                      onClick={() => navigate('/portal/quote/marocraft-token-2026')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>{quote.status === 'Accepted' ? 'Voir Contrat Signé' : 'Signer en Ligne'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Implementation Milestones */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'مراحل تسليم المشروع' : 'Project Milestones & Deliverables'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Audit & Cadrage Technique</span>
                      <p className="text-[11px] text-slate-400">Spécifications des connecteurs ERP et WhatsApp Business</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">Achevé (100%)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-brand-500 shrink-0 animate-spin" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Configuration des Agents IA de Vente</span>
                      <p className="text-[11px] text-slate-400">Entraînement des bots de qualification sur le catalogue MaroCraft</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-600">En cours (75%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right (1 col): Dedicated Account Executive Contact Card */}
          <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {lang === 'ar' ? 'المستشار التجاري الخاص بكم' : 'Dedicated Account Executive'}
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {lang === 'ar' ? 'فريق الدعم والمواكبة التجارية' : 'Strategic Advisor'}
              </h2>
            </div>

            {/* Exec Profile */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white text-xl font-black flex items-center justify-center shadow-lg shadow-brand-500/20">
                YM
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Yassine Mansouri</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Senior Enterprise Account Executive</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                  ● En ligne maintenant
                </span>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="space-y-2">
              <a
                href="https://wa.me/212661002233?text=Bonjour%20Yassine,%20je%20vous%20contacte%20concernant%20le%20devis%20MaroCraft"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contacter sur WhatsApp (+212 661-002233)</span>
              </a>

              <a
                href="mailto:yassine@intelligence-agency.com?subject=Demande%20d'information%20MaroCraft%20Industries"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="h-4 w-4 text-brand-600" />
                <span>Envoyer un E-mail</span>
              </a>
            </div>

            {/* Direct Assistance Notice */}
            <div className="p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <span className="font-bold text-brand-600 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                <span>Support Entreprise Garanti</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Votre conseiller commercial est joignable du Lundi au Vendredi de 8h30 à 18h30 pour toute modification de devis ou avenant contractuel.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // 2. INTERNAL STAFF: REP, MANAGER, ADMIN
  // ==========================================

  // Scoping deals strictly:
  // - rep: ONLY own deals
  // - manager / admin: ALL company deals
  const relevantDeals = useMemo(() => {
    if (role === 'rep') {
      return deals.filter(d =>
        d.ownerId === currentUser?.id ||
        d.ownerName?.toLowerCase().includes(currentUser?.name?.toLowerCase() || '') ||
        d.user_id === currentUser?.id
      )
    }
    return deals
  }, [deals, role, currentUser])

  // Financial Computations for current scope
  const totalWonRevenue = relevantDeals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + d.amount, 0)

  const activePipelineValue = relevantDeals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + d.amount, 0)

  const weightedPipeline = relevantDeals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + (d.amount * (d.probability / 100)), 0)

  // Quota allocation:
  // - rep: personal quota (950,000 MAD)
  // - manager: team quota (3,500,000 MAD)
  // - admin: corporate annual target (12,000,000 MAD)
  const quota = role === 'rep'
    ? (currentUser?.quota || 950000)
    : (role === 'manager' ? 3500000 : 12000000)

  const quotaPercent = Math.min(100, Math.round((totalWonRevenue / quota) * 100))
  const dormantDeals = relevantDeals.filter(d => d.hasInactivityWarning || d.lastActivityDaysAgo >= 7)

  // Pending Manager Approvals for Manager/Admin
  const pendingDiscountApprovals = quotes.filter(q => q.status === 'Pending Approval')

  // Stage Distribution counts
  const stageStats = stages.map(st => {
    const stageDeals = relevantDeals.filter(d => d.stage === st.id)
    const amount = stageDeals.reduce((sum, d) => sum + d.amount, 0)
    return {
      ...st,
      count: stageDeals.length,
      amount,
    }
  })

  // Monthly Revenue Forecast
  const monthlyRevenueData = role === 'rep'
    ? [
        { month: 'Jan', actual: 80000, target: 80000, forecast: 80000 },
        { month: 'Feb', actual: 95000, target: 85000, forecast: 95000 },
        { month: 'Mar', actual: 110000, target: 90000, forecast: 110000 },
        { month: 'Apr', actual: 120000, target: 100000, forecast: 120000 },
        { month: 'May', actual: 140000, target: 110000, forecast: 140000 },
        { month: 'Jun', actual: 155000, target: 120000, forecast: 155000 },
        { month: 'Jul', actual: null, target: 130000, forecast: 160000 },
        { month: 'Aug', actual: null, target: 135000, forecast: 170000 },
        { month: 'Sep', actual: null, target: 140000, forecast: 180000 },
      ]
    : [
        { month: 'Jan', actual: 480000, target: 450000, forecast: 480000 },
        { month: 'Feb', actual: 520000, target: 500000, forecast: 520000 },
        { month: 'Mar', actual: 610000, target: 550000, forecast: 610000 },
        { month: 'Apr', actual: 590000, target: 580000, forecast: 590000 },
        { month: 'May', actual: 650000, target: 600000, forecast: 650000 },
        { month: 'Jun', actual: 720000, target: 650000, forecast: 720000 },
        { month: 'Jul', actual: null, target: 680000, forecast: 740000 },
        { month: 'Aug', actual: null, target: 700000, forecast: 780000 },
        { month: 'Sep', actual: null, target: 720000, forecast: 810000 },
        { month: 'Oct', actual: null, target: 750000, forecast: 850000 },
        { month: 'Nov', actual: null, target: 780000, forecast: 890000 },
        { month: 'Dec', actual: null, target: 820000, forecast: 950000 },
      ]

  let runActual = 0
  let runTarget = 0
  let runForecast = 0
  const cumulativeRevenueData = monthlyRevenueData.map(item => {
    runTarget += item.target
    if (item.actual !== null) runActual += item.actual
    runForecast += (item.actual !== null ? item.actual : item.forecast)
    return {
      month: item.month,
      actual: item.actual !== null ? runActual : null,
      target: runTarget,
      forecast: runForecast,
    }
  })

  const activeRevenueData = revenueChartMode === 'monthly' ? monthlyRevenueData : cumulativeRevenueData

  const stageColors = {
    leads: '#64748b',
    qualification: '#3b82f6',
    discovery: '#6366f1',
    proposal: '#f59e0b',
    negotiation: '#a855f7',
    won: '#10b981',
    lost: '#ef4444'
  }

  const stageBarData = stages.map(st => {
    const stageDeals = relevantDeals.filter(d => d.stage === st.id)
    const totalMAD = stageDeals.reduce((sum, d) => sum + d.amount, 0)
    return {
      id: st.id,
      name: lang === 'ar' ? st.nameAr : st.nameEn,
      count: stageDeals.length,
      amount: totalMAD,
      fill: stageColors[st.id] || '#3b82f6'
    }
  })

  // Scoped Leads count
  const relevantLeads = role === 'rep'
    ? leads.filter(l => l.assignedTo === currentUser?.id || l.assignedToName === currentUser?.name || !l.assignedTo)
    : leads

  const hotLeads = relevantLeads.filter(l => (l.aiScore || 0) >= 80).length
  const warmLeads = relevantLeads.filter(l => (l.aiScore || 0) >= 50 && (l.aiScore || 0) < 80).length
  const coldLeads = relevantLeads.filter(l => (l.aiScore || 0) < 50).length

  const leadDistributionData = [
    { name: lang === 'ar' ? 'ساخن (80+)' : 'Hot (Score 80+)', value: hotLeads || 3, color: '#3b82f6' },
    { name: lang === 'ar' ? 'متوسط (50-79)' : 'Warm (50-79)', value: warmLeads || 2, color: '#60a5fa' },
    { name: lang === 'ar' ? 'بارد (<50)' : 'Cold (<50)', value: coldLeads || 1, color: '#1e3a8a' }
  ]

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/15 shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {typeof entry.value === 'number' && entry.value > 1000 ? formatMAD(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const handleApproveDiscount = (quoteId) => {
    approveQuoteDiscount(quoteId)
    setSuccessToast(`Remise commerciale approuvée pour le devis ${quoteId} !`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-500/10 via-brand-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'ar'
                ? `مرحباً، ${currentUser?.name || 'كريم التازي'}`
                : `Welcome back, ${currentUser?.name || 'Karim Tazi'}`}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
              role === 'admin'
                ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                : role === 'manager'
                ? 'bg-brand-500/10 text-brand-600 border border-brand-500/20'
                : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
            }`}>
              {role === 'admin' ? 'Executive Cockpit (CRO)' : role === 'manager' ? 'Sales Manager Suite' : 'Personal Commercial Quota'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {role === 'rep'
              ? (lang === 'ar' ? 'متابعة أهدافك الفردية، صفقاتك النشطة وتنبيهات المتابعة خلال 7 أيام' : 'Your individual pipeline pacing, quota attainment, and 7-day follow-up alerts')
              : (lang === 'ar' ? 'نظرة عامة شاملة على إيرادات الشركة، أداء الفريق وموافقات الخصومات' : 'Executive revenue intelligence, team quota tracking, and discount governance')}
          </p>
        </div>

        {/* Action Button */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => navigate('/crm/pipeline?action=new-deal')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
          >
            <span>+</span>
            <span>{lang === 'ar' ? 'صفقة جديدة' : 'New Deal'}</span>
          </button>
        </div>
      </div>

      {/* Manager / Admin Discount Approval Alert Banner */}
      {(role === 'manager' || role === 'admin') && pendingDiscountApprovals.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-900 dark:text-amber-200">
                {pendingDiscountApprovals.length} Devis en attente de validation managériale (&gt;15% remise)
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                L'approbation du VP Sales est requise pour débloquer l'envoi au client.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingDiscountApprovals.slice(0, 1).map(q => (
              <button
                key={q.id}
                onClick={() => handleApproveDiscount(q.id)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Valider remise {q.discountPercent}% ({q.id})</span>
              </button>
            ))}
            <button
              onClick={() => navigate('/crm/quotes?status=Pending%20Approval')}
              className="text-xs font-bold text-amber-800 dark:text-amber-200 hover:underline px-2"
            >
              Voir tout
            </button>
          </div>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Won Revenue */}
        <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative group hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {role === 'rep'
                ? (lang === 'ar' ? 'مبيعاتي المحققة' : 'My Closed Won Revenue')
                : (lang === 'ar' ? 'الإيرادات المحققة' : 'Team Won Revenue')}
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatMAD(totalWonRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="flex items-center text-emerald-600 font-bold">
              <ArrowUpRight className="h-3.5 w-3.5" /> +28.4%
            </span>
            <span className="text-slate-400">vs last quarter</span>
          </div>
        </div>

        {/* 2. Active Pipeline */}
        <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative group hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {role === 'rep'
                ? (lang === 'ar' ? 'قيمة صفقاتي النشطة' : 'My Active Pipeline')
                : (lang === 'ar' ? 'قيمة مسار الصفقات' : 'Active Pipeline Value')}
            </span>
            <div className="h-8 w-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatMAD(activePipelineValue)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Weighted:</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{formatMAD(weightedPipeline)}</span>
          </div>
        </div>

        {/* 3. Quota Achievement */}
        <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative group hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {role === 'rep'
                ? (lang === 'ar' ? 'هدفي الفردي (Quota)' : 'My Sales Quota')
                : (lang === 'ar' ? 'نسبة الهدف العام' : 'Global Quota Attainment')}
            </span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {quotaPercent}%
            </span>
            <span className="text-xs text-slate-400">of {formatMAD(quota)}</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>

        {/* 4. Follow-up Alerts */}
        <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative group hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {role === 'rep'
                ? (lang === 'ar' ? 'تنبيهاتي (7 أيام)' : 'My Follow-Up Alerts')
                : (lang === 'ar' ? 'تنبيهات المتابعة (7j)' : '7-Day Follow-Up Alerts')}
            </span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{dormantDeals.length}</span>
            <span className="text-xs font-normal text-rose-500">
              {dormantDeals.length > 0 ? (lang === 'ar' ? 'صفقات غير نشطة' : 'dormant deals') : 'All up to date'}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-rose-500" />
            <span>Automated AI drafts available</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Revenue Forecasting */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-600" />
                <span>
                  {role === 'rep'
                    ? (lang === 'ar' ? 'تتبع الإيرادات الشهرية الفردية' : 'Personal Monthly Revenue vs Quota')
                    : (lang === 'ar' ? 'مخطط الإيرادات الفعلي مقابل التوقعات' : 'Revenue Pacing: Actual vs Forecast')}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' ? 'بيانات الأداء المالي بالدرهم المغربي (MAD)' : 'Financial trajectory in Moroccan Dirhams (MAD)'}
              </p>
            </div>

            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs self-start sm:self-auto">
              <button
                onClick={() => setRevenueChartMode('monthly')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${revenueChartMode === 'monthly'
                    ? 'bg-white dark:bg-navy-800 text-brand-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setRevenueChartMode('cumulative')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${revenueChartMode === 'cumulative'
                    ? 'bg-white dark:bg-navy-800 text-brand-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                  }`}
              >
                Cumulative YTD
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
                <YAxis
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => formatMAD(val)}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name={lang === 'ar' ? 'المحقق الفعلي' : 'Actual Closed'}
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  name={lang === 'ar' ? 'التوقعات الذكية' : 'AI Forecast'}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (1 col): Lead Scoring & Distribution */}
        <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span>
                {role === 'rep'
                  ? (lang === 'ar' ? 'عملائي المحتملين وتصنيفهم' : 'My Scored Leads')
                  : (lang === 'ar' ? 'تصنيف العملاء المحتملين بالـ IA' : 'AI Lead Temperature')}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' ? 'توزيع الاحتمالية حسب نقاط الذكاء الاصطناعي' : 'Propensity scoring engine'}
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leadDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {relevantLeads.length}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {lang === 'ar' ? 'عميل نشط' : 'Total Leads'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
            {leadDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Funnel BarChart */}
      <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {role === 'rep'
                  ? (lang === 'ar' ? 'مسار صفقاتي عبر المراحل' : 'My Deal Funnel by Stage')
                  : (lang === 'ar' ? 'توزيع الصفقات عبر مراحل الـ Pipeline' : 'Commercial Funnel Stage Distribution')}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'متابعة تدفق الفرص من البداية إلى الإغلاق وقيمتها المالية' : 'Deal velocity and cumulative volume across sales stages'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/crm/pipeline')}
            className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{lang === 'ar' ? 'عرض الـ Kanban بالكامل' : 'Open Deals Kanban'}</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageBarData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke={isDark ? '#94a3b8' : '#64748b'}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
              />
              <YAxis
                stroke={isDark ? '#94a3b8' : '#64748b'}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomChartTooltip />}
                cursor={{ fill: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)', rx: 8 }}
              />
              <Bar dataKey="count" name={lang === 'ar' ? 'عدد الصفقات' : 'Deals Count'} radius={[8, 8, 0, 0]}>
                {stageBarData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={entry.fill}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                    onClick={() => navigate(`/crm/pipeline?stage=${entry.id}`)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel visual cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
          {stageStats.map((st) => (
            <div
              key={st.id}
              onClick={() => navigate(`/crm/pipeline?stage=${st.id}`)}
              className="p-3 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:bg-brand-50/60 dark:hover:bg-brand-500/10 hover:border-brand-500/40 cursor-pointer transition-all text-center group"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate group-hover:text-brand-600 transition-colors">
                {lang === 'ar' ? st.nameAr : st.nameEn}
              </div>
              <div className="mt-1 text-lg font-black text-slate-800 dark:text-white">
                {st.count}
              </div>
              <div className="text-[10px] font-bold text-brand-600 dark:text-brand-400 truncate">
                {formatMAD(st.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Scoped Deals + AI Copilot Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): High Priority Deals */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {role === 'rep'
                  ? (lang === 'ar' ? 'صفقاتي ذات الأولوية' : 'My High-Priority Deals')
                  : (lang === 'ar' ? 'صفقات ذات أولوية عليا' : 'High-Priority Opportunities')}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-[10px] font-bold">
                {relevantDeals.length} {role === 'rep' ? 'personal' : 'active'}
              </span>
            </div>
            <button
              onClick={() => navigate('/crm/pipeline')}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {relevantDeals.slice(0, 5).map((deal) => (
              <div key={deal.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      {deal.title}
                    </span>
                    {deal.hasInactivityWarning && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-extrabold animate-pulse">
                        7D+ Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{deal.accountName}</span>
                    <span>•</span>
                    <span>{deal.contactName}</span>
                    <span>•</span>
                    <span className="text-brand-600 font-semibold">{deal.probability}% probability</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0 justify-between sm:justify-end">
                  <div className="text-right rtl:text-left">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {formatMAD(deal.amount)}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      {deal.stage}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/crm/pipeline?dealId=${deal.id}`)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-brand-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): AI Sales Copilot Live Feed */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-brand-900/10 via-white to-purple-900/10 dark:from-brand-950/40 dark:via-navy-900 dark:to-purple-950/30 border border-brand-500/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {lang === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Copilot Recommendations'}
              </h3>
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                {lang === 'ar' ? 'محدثة تلقائياً' : 'Sales Analytics & Follow-Up'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-md bg-white dark:bg-navy-900 border border-brand-500/20 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Règle 7 Jours : Relance requise</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {dormantDeals[0] ? `Aucun contact depuis 8 jours sur ${dormantDeals[0].title}. Message WhatsApp prêt.` : 'Toutes les opportunités sont actives.'}
              </p>
              {dormantDeals[0] && (
                <button
                  onClick={() => executeFollowUp(dormantDeals[0].id, 'WhatsApp')}
                  className="w-full py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
                >
                  {lang === 'ar' ? 'إرسال المتابعة بنقرة واحدة' : 'Send WhatsApp Follow-Up'}
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-md bg-white dark:bg-navy-900 border border-emerald-500/20 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Closing Imminent (Score 85%)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Accord de principe obtenu. Préparer l'envoi de la proposition finale.
              </p>
              <button
                onClick={() => navigate('/crm/quotes')}
                className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                {lang === 'ar' ? 'عرض مسودة العقد' : 'Review Quotes'}
              </button>
            </div>
          </div>

          {/* Leaderboard ONLY for Manager & Admin */}
          {(role === 'manager' || role === 'admin') && (
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {lang === 'ar' ? 'أفضل المبيعات (Leaderboard)' : 'Top Sales Performers'}
                </span>
                <button
                  onClick={() => navigate('/crm/team')}
                  className="text-[10px] font-bold text-brand-600"
                >
                  Details
                </button>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Karim Tazi', amount: 1040000, target: '86%' },
                  { name: 'Yassine Mansouri', amount: 880000, target: '92%' },
                  { name: 'Mehdi Alaoui', amount: 610000, target: '76%' },
                ].map((rep, idx) => (
                  <div key={rep.name} className="flex items-center justify-between text-xs py-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {idx + 1}. {rep.name}
                    </span>
                    <span className="font-bold text-brand-600">{rep.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
