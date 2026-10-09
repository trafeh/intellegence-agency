import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CrmProvider } from './crm/context/CrmContext'

// Landing Page Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutEcosystem from './components/AboutEcosystem'
import ProblemSolution from './components/ProblemSolution'
import VisionOperatingSystem from './components/VisionOperatingSystem'
import PlatformModules from './components/PlatformModules'
import FollowUpEngine from './components/FollowUpEngine'
import AiAgentsOrchestrator from './components/AiAgentsOrchestrator'
import GovernanceSecurity from './components/GovernanceSecurity'
import Architecture from './components/Architecture'
import AnalyticsKpi from './components/AnalyticsKpi'
import Differentiation from './components/Differentiation'
import TargetCustomers from './components/TargetCustomers'
import Roadmap from './components/Roadmap'
import PartnershipCta from './components/PartnershipCta'
import PartnerModal from './components/PartnerModal'
import Footer from './components/Footer'

// Auth & CRM Pages
import LoginPage from './pages/LoginPage'
import CrmLayout from './crm/CrmLayout'
import CrmDashboard from './crm/pages/CrmDashboard'
import CrmPipeline from './crm/pages/CrmPipeline'
import CrmLeads from './crm/pages/CrmLeads'
import CrmAccounts from './crm/pages/CrmAccounts'
import CrmQuotes from './crm/pages/CrmQuotes'
import CrmActivities from './crm/pages/CrmActivities'
import CrmAiAgents from './crm/pages/CrmAiAgents'
import CrmTeam from './crm/pages/CrmTeam'
import CrmSettings from './crm/pages/CrmSettings'

function LandingPage() {
  const [partnerModalOpen, setPartnerModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white  dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors  duration-300 selection:bg-brand-600 selection:text-white">
      {/* Navbar with Sticky blur */}
      <Navbar onOpenPartnerModal={() => setPartnerModalOpen(true)} />

      {/* Main Landing Sections */}
      <main>
        {/* 1. Hero with Deal Radar */}
        <Hero onOpenPartnerModal={() => setPartnerModalOpen(true)} />

        {/* 2. About Intelligence Agency & Ecosystem */}
        <AboutEcosystem />

        {/* 3. The Commercial Challenge & Impact */}
        <ProblemSolution />

        {/* 4. Vision: Commercial OS Orbit */}
        <VisionOperatingSystem />

        {/* 5. Core Platform Modules */}
        <PlatformModules />

        {/* 6. Follow-Up Engine Simulation */}
        <FollowUpEngine />

        {/* 7. 7 Sales AI Agents Orchestration */}
        <AiAgentsOrchestrator />

        {/* 8. Enterprise Governance & Security */}
        <GovernanceSecurity />

        {/* 9. Layered Technology Architecture */}
        {/* <Architecture /> */}

        {/* 10. Executive Analytics & Funnel */}
        <AnalyticsKpi />

        {/* 11. Competitive Differentiation */}
        <Differentiation />

        {/* 12. Target Customers Segments */}
        <TargetCustomers />

        {/* 13. Phased Roadmap */}
        {/* <Roadmap /> */}

        {/* 14. Strategic Partnership CTA */}
        {/* <PartnershipCta onOpenModal={() => setPartnerModalOpen(true)} /> */}
      </main>

      {/* Footer & Global Ambition */}
      <Footer onOpenPartnerModal={() => setPartnerModalOpen(true)} />

      {/* Interactive Early Access Modal */}
      {/* <PartnerModal
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
      /> */}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CrmProvider>
              <Routes>
                {/* 1. Official Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Authentication Page (with 1-Click Demo Logins) */}
                <Route path="/login" element={<LoginPage />} />

                {/* 3. The CRM Application Suite */}
                <Route path="/crm" element={<CrmLayout />}>
                  <Route index element={<Navigate to="/crm/dashboard" replace />} />
                  <Route path="dashboard" element={<CrmDashboard />} />
                  <Route path="pipeline" element={<CrmPipeline />} />
                  <Route path="leads" element={<CrmLeads />} />
                  <Route path="accounts" element={<CrmAccounts />} />
                  <Route path="quotes" element={<CrmQuotes />} />
                  <Route path="activities" element={<CrmActivities />} />
                  <Route path="ai-agents" element={<CrmAiAgents />} />
                  <Route path="team" element={<CrmTeam />} />
                  <Route path="settings" element={<CrmSettings />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CrmProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
