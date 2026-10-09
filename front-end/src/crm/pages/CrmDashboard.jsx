import { useState } from 'react'
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
  PieChart as PieChartIcon
} from 'lucide-react'

import { formatCompactMAD } from '../data/crmMockData'

export default function CrmDashboard() {
  const { currentUser, role } = useAuth()
  const { deals, leads, quotes, activities, stages, executeFollowUp } = useCrm()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  // Filter deals based on role or view
  const [personalOnly, setPersonalOnly] = useState(role === 'rep')
  const [revenueChartMode, setRevenueChartMode] = useState('monthly') // 'monthly' | 'cumulative'

  const relevantDeals = personalOnly
    ? deals.filter(d => d.ownerId === currentUser?.id || d.ownerName === currentUser?.name)
    : deals

  // Financial Computations
  const totalWonRevenue = relevantDeals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + d.amount, 0)

  const activePipelineValue = relevantDeals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + d.amount, 0)

  const weightedPipeline = relevantDeals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + (d.amount * (d.probability / 100)), 0)

  const quota = personalOnly ? (currentUser?.quota || 1200000) : 3500000
  const quotaPercent = Math.min(100, Math.round((totalWonRevenue / quota) * 100))

  const dormantDeals = relevantDeals.filter(d => d.hasInactivityWarning || d.lastActivityDaysAgo >= 7)

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

  // Format MAD currency (Abbreviated with K, M, B if large)
  const formatMAD = (amount) => {
    return formatCompactMAD(amount, lang)
  }

  // 1. Revenue Forecast & Pacing Data
  const monthlyRevenueData = [
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

  // Cumulative YTD
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

  // 2. Stage Funnel Data for BarChart
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

  // 3. Lead Temperature & Scoring Breakdown
  const hotLeads = leads.filter(l => (l.aiScore || 0) >= 80).length
  const warmLeads = leads.filter(l => (l.aiScore || 0) >= 50 && (l.aiScore || 0) < 80).length
  const coldLeads = leads.filter(l => (l.aiScore || 0) < 50).length

  const leadDistributionData = [
    { name: lang === 'ar' ? 'ساخن (80+)' : 'Hot (Score 80+)', value: hotLeads || 4, color: '#3b82f6' },
    { name: lang === 'ar' ? 'متوسط (50-79)' : 'Warm (50-79)', value: warmLeads || 3, color: '#60a5fa' },
    { name: lang === 'ar' ? 'بارد (<50)' : 'Cold (<50)', value: coldLeads || 1, color: '#1e3a8a' }
  ]

  // 4. Rep Leaderboard Bar Data (Director Mode)
  const repsData = [
    { name: 'Karim T.', achieved: 1040000, quota: 1200000, rate: 86 },
    { name: 'Yasmine A.', achieved: 880000, quota: 950000, rate: 92 },
    { name: 'Omar M.', achieved: 610000, quota: 800000, rate: 76 },
    { name: 'Sofia B.', achieved: 590000, quota: 750000, rate: 78 },
  ]

  // Custom Recharts Tooltip
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

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-500/10 via-brand-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'ar'
                ? `مرحباً، ${currentUser?.name || 'أمين'}`
                : `Welcome back, ${currentUser?.name || 'Amine'}`}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${role === 'director' ? 'bg-brand-500/10 text-brand-600 border border-brand-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              }`}>
              {role === 'director' ? 'Executive Cockpit' : 'Sales Rep Portal'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'ar'
              ? 'نظرة عامة على الإيرادات، مسار الصفقات، وتنبيهات محرك المتابعة الذكي'
              : 'Real-time revenue monitoring, deal pipeline, and automated follow-up intelligence'}
          </p>
        </div>

        {/* View toggle if Rep */}
        <div className="relative z-10 flex items-center gap-3">
          {role === 'rep' && (
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={() => setPersonalOnly(true)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${personalOnly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                {lang === 'ar' ? 'صفقاتي فقط' : 'My Deals'}
              </button>
              <button
                onClick={() => setPersonalOnly(false)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${!personalOnly
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                {lang === 'ar' ? 'جميع الفريق' : 'Team Overview'}
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/crm/pipeline?action=new-deal')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all"
          >
            <span>+</span>
            <span>{lang === 'ar' ? 'صفقة جديدة' : 'New Deal'}</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Won Revenue */}
        <div className="p-5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm relative group hover:border-brand-500/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lang === 'ar' ? 'الإيرادات المحققة' : 'Closed Won Revenue'}
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
              {lang === 'ar' ? 'قيمة مسار الصفقات' : 'Active Pipeline'}
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
              {lang === 'ar' ? 'نسبة الهدف (Quota)' : 'Sales Quota Attainment'}
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
          <div className="mt-3 w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>

        {/* 4. Dormant Deals / Inactivity Engine (PDF Spec) */}
        <div
          onClick={() => navigate('/crm/activities')}
          className={`p-5 rounded-lg border shadow-sm cursor-pointer transition-all ${dormantDeals.length > 0
              ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/40 hover:border-rose-500'
              : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10'
            }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              {lang === 'ar' ? 'تنبيهات ركود 7 أيام' : '7-Day Inactivity Rule'}
            </span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className={`h-4 w-4 ${dormantDeals.length > 0 ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 tracking-tight">
            {dormantDeals.length} {lang === 'ar' ? 'صفقات معلقة' : 'dormant'}
          </div>
          <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
            <span>{lang === 'ar' ? 'توليد رسائل المتابعة بالذكاء الاصطناعي' : 'AI Follow-Ups Ready'}</span>
            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </div>
        </div>
      </div>

      {/* Visual Charts Section: Revenue AreaChart + Lead Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Revenue Forecasting & Quota Pacing AreaChart */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'توقعات وتيرة الإيرادات (2026)' : 'Revenue Velocity & AI Forecast'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'مقارنة الإيرادات الفعلية بالهدف والتوقعات الذكية' : 'Closed Actuals vs Quota Target vs AI Predictive Trajectory (MAD)'}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs self-start sm:self-auto">
              <button
                onClick={() => setRevenueChartMode('monthly')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${revenueChartMode === 'monthly'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                {lang === 'ar' ? 'شهري' : 'Monthly'}
              </button>
              <button
                onClick={() => setRevenueChartMode('cumulative')}
                className={`px-3 py-1 rounded-md font-bold transition-all ${revenueChartMode === 'cumulative'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                {lang === 'ar' ? 'تراكمي (YTD)' : 'YTD Cumulative'}
              </button>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
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
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'}`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name={lang === 'ar' ? 'المحقق فعلياً' : 'Actual Won'}
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  name={lang === 'ar' ? 'توقعات الذكاء الاصطناعي' : 'AI Forecast'}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  name={lang === 'ar' ? 'الهدف المالي (Quota)' : 'Target Quota'}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  fillOpacity={0}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (1 col): Lead Quality & Temperature Donut Chart */}
        <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <PieChartIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'جودة وتصنيف العملاء' : 'Lead Quality Health'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'بناءً على التقييم الذكي' : 'Predictive AI Lead Scoring'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/crm/leads')}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                {lang === 'ar' ? 'تفاصيل' : 'View'}
              </button>
            </div>

            {/* Donut Chart */}
            <div className="h-48 w-full relative flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
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
                  {leads.length}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {lang === 'ar' ? 'عميل نشط' : 'Total Leads'}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
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

      {/* Stage Funnel BarChart & Stage Breakdown */}
      <div className="p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {lang === 'ar' ? 'توزيع الصفقات عبر مراحل الـ Pipeline' : 'Commercial Funnel Stage Distribution'}
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

        {/* Interactive Funnel Bar Chart */}
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

        {/* Funnel visual cards below the chart */}
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

      {/* Two Column Layout: Top Deals + AI Copilot Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Deals Needing Attention / Top Opportunities */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {lang === 'ar' ? 'صفقات ذات أولوية عليا' : 'High-Priority Opportunities'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-600/10 text-brand-600 text-[10px] font-bold">
                {relevantDeals.length} active
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
                <span>7-Day Inactivity Rule: Dislog Group</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                No touchpoint recorded for 8 days on the 450,000 MAD contract. Personalized WhatsApp follow-up drafted.
              </p>
              <button
                onClick={() => executeFollowUp('deal_2', 'WhatsApp')}
                className="w-full py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
              >
                {lang === 'ar' ? 'إرسال المتابعة بنقرة واحدة' : 'Send WhatsApp Follow-Up'}
              </button>
            </div>

            <div className="p-3.5 rounded-md bg-white dark:bg-navy-900 border border-emerald-500/20 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Imminent Closing: Atlas Distribution</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Calculated win probability: 85%. Recommendation: Finalize SLA terms before Friday.
              </p>
              <button
                onClick={() => navigate('/crm/quotes')}
                className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                {lang === 'ar' ? 'عرض مسودة العقد' : 'Review Quote DEV-2026-001'}
              </button>
            </div>
          </div>

          {/* Leaderboard preview if Director */}
          {role === 'director' && (
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
                  { name: 'Yasmine Alami', amount: 880000, target: '92%' },
                  { name: 'Omar Mansouri', amount: 610000, target: '76%' },
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
