import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCrm } from './context/CrmContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import {
  TrendingUp,
  LayoutDashboard,
  Kanban,
  Target,
  Building2,
  FileText,
  RefreshCw,
  BrainCircuit,
  Users,
  User,
  Settings,
  Bell,
  Search,
  Plus,
  Sun,
  Moon,
  Languages,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import logoLight from '../assets/logolight.png'
import logoDark from '../assets/logodark.png'

export default function CrmLayout() {
  const { currentUser, role, switchRole, logout } = useAuth()
  const { deals, leads, quotes, activities } = useCrm()
  const { lang, setLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notifRef = useRef(null)
  const langRef = useRef(null)
  const quickRef = useRef(null)
  const userRef = useRef(null)

  // Count dormant deals (>7 days)
  const dormantDealsCount = deals.filter(d => d.hasInactivityWarning || d.lastActivityDaysAgo >= 7).length
  const pendingQuotesCount = quotes.filter(q => q.status === 'Pending Approval').length
  const newLeadsCount = leads.filter(l => l.status === 'New').length

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotificationsOpen(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangMenuOpen(false)
      if (quickRef.current && !quickRef.current.contains(e.target)) setQuickCreateOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Auto close mobile sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  const navItems = [
    {
      to: '/crm/dashboard',
      labelEn: 'Dashboard',
      labelFr: 'Tableau de bord',
      labelAr: 'لوحة التحكم',
      icon: LayoutDashboard,
    },
    {
      to: '/crm/pipeline',
      labelEn: 'Deals Pipeline',
      labelFr: 'Pipeline & Kanban',
      labelAr: 'مسار الصفقات',
      icon: Kanban,
      badge: deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length,
    },
    {
      to: '/crm/leads',
      labelEn: 'Leads & Scoring',
      labelFr: 'Prospects (Scoring IA)',
      labelAr: 'العملاء المحتملون',
      icon: Target,
      badge: newLeadsCount > 0 ? newLeadsCount : null,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      to: '/crm/accounts',
      labelEn: 'Accounts & Contacts',
      labelFr: 'Comptes & Entreprises',
      labelAr: 'الشركات والعملاء',
      icon: Building2,
    },
    {
      to: '/crm/quotes',
      labelEn: 'Quotations & Offers',
      labelFr: 'Devis & Propositions',
      labelAr: 'عروض الأسعار',
      icon: FileText,
      badge: pendingQuotesCount > 0 ? pendingQuotesCount : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
    },
    {
      to: '/crm/activities',
      labelEn: 'Follow-Up Engine',
      labelFr: 'Moteur de Relance (7j)',
      labelAr: 'محرك المتابعة (7 أيام)',
      icon: RefreshCw,
      badge: dormantDealsCount > 0 ? `${dormantDealsCount} alerte${dormantDealsCount > 1 ? 's' : ''}` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      to: '/crm/ai-agents',
      labelEn: '7 Sales AI Agents',
      labelFr: '7 Agents IA de Vente',
      labelAr: '7 وكلاء ذكاء اصطناعي',
      icon: BrainCircuit,
      badge: 'PRO',
      badgeColor: 'bg-brand-600 text-white',
    },
    ...(role === 'director' ? [
      {
        to: '/crm/team',
        labelEn: 'Sales Team & Quotas',
        labelFr: 'Équipe & Objectifs',
        labelAr: 'الفريق والأهداف',
        icon: Users,
      }
    ] : [])
  ]

  const getLabel = (item) => {
    if (lang === 'ar') return item.labelAr
    if (lang === 'fr') return item.labelFr
    return item.labelEn
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-brand-600 selection:text-white">
      {/* Top Application Bar */}
      <header className="h-16 shrink-0 sticky top-0 z-40 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand / Route */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <NavLink to="/" className="flex items-center gap-2 group">
            <img
              src={logoLight}
              alt="Intelligence Sales"
              className="h-8 w-auto block dark:hidden group-hover:scale-105 transition-transform object-contain"
            />
            <img
              src={logoDark}
              alt="Intelligence Sales"
              className="h-8 w-auto hidden dark:block group-hover:scale-105 transition-transform object-contain"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold tracking-widest text-slate-900 dark:text-white leading-none">
                  INTELLIGENCE
                </span>
                <span className="text-[10px] font-black text-brand-600 dark:text-brand-400">
                  SALES
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-300 text-[9px] font-bold border border-brand-500/20">
                  CRM
                </span>
              </div>
              <span className="text-[9px] text-slate-400 hidden sm:inline">The Commercial Operating System</span>
            </div>
          </NavLink>
        </div>

        {/* Right Controls: Quick Add, Notifications, Lang, Theme, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Dropdown */}
          <div className="relative" ref={quickRef}>
            <button
              onClick={() => setQuickCreateOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/25 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {lang === 'ar' ? 'إضافة جديد' : lang === 'fr' ? 'Créer' : 'New'}
              </span>
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 p-1.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {lang === 'ar' ? 'إجراء سريع' : lang === 'fr' ? 'Création rapide' : 'Quick Actions'}
                </div>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false)
                    navigate('/crm/pipeline?action=new-deal')
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-600/15 hover:text-brand-600 transition-colors"
                >
                  <Kanban className="h-4 w-4 text-brand-600" />
                  <span>{lang === 'ar' ? 'صفقة جديدة' : lang === 'fr' ? 'Nouvelle Opportunité' : 'New Deal'}</span>
                </button>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false)
                    navigate('/crm/leads?action=new-lead')
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-600/15 hover:text-brand-600 transition-colors"
                >
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'عميل محتمل جديد' : lang === 'fr' ? 'Nouveau Lead' : 'New Lead'}</span>
                </button>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false)
                    navigate('/crm/quotes?action=new-quote')
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-600/15 hover:text-brand-600 transition-colors"
                >
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'عرض سعر جديد' : lang === 'fr' ? 'Nouveau Devis' : 'New Quotation'}</span>
                </button>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false)
                    navigate('/crm/activities?action=new-activity')
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-600/15 hover:text-brand-600 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 text-purple-600" />
                  <span>{lang === 'ar' ? 'تسجيل نشاط / مكالمة' : lang === 'fr' ? 'Enregistrer une activité' : 'Log Activity'}</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Notifications Alert Center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(prev => !prev)}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {(dormantDealsCount > 0 || pendingQuotesCount > 0) && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    {lang === 'ar' ? 'إشعارات وتنبيهات الذكاء الاصطناعي' : lang === 'fr' ? 'Alertes & IA' : 'AI Notifications'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 text-[10px] font-bold">
                    {dormantDealsCount + pendingQuotesCount} {lang === 'ar' ? 'تنبيه' : 'urgents'}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto">
                  {dormantDealsCount > 0 && (
                    <div
                      onClick={() => {
                        setNotificationsOpen(false)
                        navigate('/crm/activities')
                      }}
                      className="p-3 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            {lang === 'ar' ? 'تنبيه ركود الصفقات (7 أيام)' : lang === 'fr' ? 'Règle des 7 Jours Déclenchée' : '7-Day Inactivity Warning'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {dormantDealsCount} {lang === 'ar' ? 'صفقات بدون متابعة. جهزنا رسائل المتابعة.' : lang === 'fr' ? 'opportunités sans activité. Brouillons prêts.' : 'deals need follow-up. Drafts ready.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {pendingQuotesCount > 0 && (
                    <div
                      onClick={() => {
                        setNotificationsOpen(false)
                        navigate('/crm/quotes')
                      }}
                      className="p-3 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <FileText className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                            {lang === 'ar' ? 'موافقة مطلوبة على خصم' : lang === 'fr' ? 'Approbation Remise Requise' : 'Discount Approval Needed'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {pendingQuotesCount} {lang === 'ar' ? 'عرض سعر بخصم يتجاوز 15%' : lang === 'fr' ? 'devis dépasse le seuil de 15% de remise.' : 'quotes exceed 15% discount threshold.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {lang === 'ar' ? 'الوكيل الذكي نشط' : lang === 'fr' ? 'Agent Lead Intelligence actif' : 'Lead Intelligence Active'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {leads.length} {lang === 'ar' ? 'عملاء تم تقييمهم تلقائياً' : 'leads qualifiés avec scores récents.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold"
              aria-label="Language"
            >
              <Languages className="h-4 w-4 text-brand-600" />
              <span className="uppercase text-[11px]">{lang}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 p-1.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-xl z-50">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'fr', label: 'Français' },
                  { code: 'ar', label: 'العربية' }
                ].map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLang(opt.code)
                      setLangMenuOpen(false)
                    }}
                    className={`w-full text-left rtl:text-right px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${lang === opt.code
                        ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-600 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Shortcut Button */}
          <button
            onClick={() => navigate('/crm/settings')}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            title={lang === 'ar' ? 'الإعدادات' : 'Settings'}
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-brand-600" />}
          </button>

          {/* User Profile & Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <div className="text-right rtl:text-left hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {currentUser?.name || 'Amine Benzekri'}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {role === 'director' ? 'Sales Director' : 'Account Exec'}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 font-bold text-xs flex items-center justify-center border border-brand-500/30">
                <User className="h-4 w-4" />
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400">{currentUser?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${role === 'director' ? 'bg-brand-500/10 text-brand-600' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                      {role === 'director' ? '👑 Executive Director' : '🎯 Commercial Rep'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Condition
                  </div>
                  <button
                    onClick={() => {
                      switchRole('director')
                      setUserMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${role === 'director'
                        ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-600 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <span>👑 {lang === 'ar' ? 'وضع الإدارة / المدير' : 'Sales Director View'}</span>
                    {role === 'director' && <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('rep')
                      setUserMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${role === 'rep'
                        ? 'bg-emerald-50 dark:bg-emerald-600/15 text-emerald-600 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                  >
                    <span>🎯 {lang === 'ar' ? 'وضع البائع / المندوب' : 'Sales Rep View'}</span>
                    {role === 'rep' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                  <NavLink
                    to="/"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{lang === 'ar' ? 'العودة للصفحة الرئيسية' : 'Visit Landing Page'}</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Application Body (Sidebar + Content Outlet) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Desktop Sidebar - 100% Fixed */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 h-full bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-white/10 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Top Collapse Toggle Row */}
          <div className="p-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
            {!sidebarCollapsed && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                {lang === 'ar' ? 'القائمة الرئيسية' : 'Navigation'}
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title={sidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Items - Spacious & Readable */}
          <nav className="flex-1 px-3 py-4 space-y-2.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const label = getLabel(item)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center ${
                      sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3.5 px-3.5 py-3'
                    } rounded-2xl text-[13px] font-bold tracking-tight transition-all group ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                  title={sidebarCollapsed ? label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate">{label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold leading-tight ${item.badgeColor || 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Dormant Deals 7-Day Alert Card (As requested in PDF) */}
          {!sidebarCollapsed && dormantDealsCount > 0 && (
            <div className="p-3 mx-3 mb-3 rounded-lg bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 border border-rose-200 dark:border-rose-800/40">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
                  {lang === 'ar' ? 'تنبيه المتابعة (7 أيام)' : '7-Day Inactivity Rule'}
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                {dormantDealsCount} {lang === 'ar' ? 'صفقات تتطلب تدخلاً فورياً' : 'deals require urgent re-engagement'}.
              </p>
              <button
                onClick={() => navigate('/crm/activities')}
                className="mt-2 w-full py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-colors"
              >
                {lang === 'ar' ? 'تفعيل Relances IA' : 'Launch AI Follow-Up'}
              </button>
            </div>
          )}

          {/* Collapse Toggle */}
          <div className="p-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
              {!sidebarCollapsed && <span>{lang === 'ar' ? 'طي القائمة' : 'Collapse Sidebar'}</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-white/10 flex flex-col z-10">
              <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-white">INTELLIGENCE SALES</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="p-3 border-b border-slate-100 dark:border-white/5 flex gap-2">
                <button
                  onClick={() => switchRole('director')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold ${role === 'director' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600'
                    }`}
                >
                  👑 Director
                </button>
                <button
                  onClick={() => switchRole('rep')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold ${role === 'rep' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600'
                    }`}
                >
                  🎯 Sales Rep
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-2.5 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const label = getLabel(item)
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold tracking-tight transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1 truncate">{label}</span>
                      {item.badge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${item.badgeColor || 'bg-slate-200 dark:bg-white/10'}`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-slate-100 dark:border-white/5 shrink-0">
                <NavLink
                  to="/"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'الرجوع للموقع' : 'Return to Website'}</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet View - 100% independent scroll */}
        <main className="flex-1 overflow-y-auto h-full min-h-0 bg-slate-50/60 dark:bg-navy-950/60 p-4 sm:p-5 lg:p-6">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
