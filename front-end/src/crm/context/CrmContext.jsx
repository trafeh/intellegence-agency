import { createContext, useContext, useState, useEffect } from 'react'
import {
  INITIAL_DEALS,
  INITIAL_LEADS,
  INITIAL_ACCOUNTS,
  INITIAL_QUOTES,
  INITIAL_ACTIVITIES,
  PIPELINE_STAGES,
  AI_AGENTS_DEFINITIONS
} from '../data/crmMockData'
import { useAuth } from '../../context/AuthContext'

const CrmContext = createContext(null)

const CRM_STORAGE_VERSION = 'v2_en_2026_clean'

// Auto-migrate stale storage from prior sessions to ensure clean English datasets
if (typeof window !== 'undefined') {
  try {
    const currentVersion = localStorage.getItem('isales_storage_version')
    if (currentVersion !== CRM_STORAGE_VERSION) {
      localStorage.removeItem('isales_deals')
      localStorage.removeItem('isales_leads')
      localStorage.removeItem('isales_accounts')
      localStorage.removeItem('isales_quotes')
      localStorage.removeItem('isales_activities')
      localStorage.setItem('isales_storage_version', CRM_STORAGE_VERSION)
      localStorage.setItem('intelligence_sales_lang', 'en')
    }
  } catch (err) {
    console.warn('Storage migration error:', err)
  }
}

export function CrmProvider({ children }) {
  const { currentUser, role } = useAuth()

  // Deals state
  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem('isales_deals')
      return saved ? JSON.parse(saved) : INITIAL_DEALS
    } catch {
      return INITIAL_DEALS
    }
  })

  // Leads state
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('isales_leads')
      return saved ? JSON.parse(saved) : INITIAL_LEADS
    } catch {
      return INITIAL_LEADS
    }
  })

  // Accounts state
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('isales_accounts')
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS
    } catch {
      return INITIAL_ACCOUNTS
    }
  })

  // Quotes state
  const [quotes, setQuotes] = useState(() => {
    try {
      const saved = localStorage.getItem('isales_quotes')
      return saved ? JSON.parse(saved) : INITIAL_QUOTES
    } catch {
      return INITIAL_QUOTES
    }
  })

  // Activities state
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('isales_activities')
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES
    } catch {
      return INITIAL_ACTIVITIES
    }
  })

  // Filter mode for Rep: 'mine' or 'all'
  const [viewScope, setViewScope] = useState('all')

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('isales_deals', JSON.stringify(deals))
  }, [deals])

  useEffect(() => {
    localStorage.setItem('isales_leads', JSON.stringify(leads))
  }, [leads])

  useEffect(() => {
    localStorage.setItem('isales_accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem('isales_quotes', JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    localStorage.setItem('isales_activities', JSON.stringify(activities))
  }, [activities])

  // Move deal stage (e.g. in Kanban)
  const moveDealStage = (dealId, newStage) => {
    setDeals(prev =>
      prev.map(deal => {
        if (deal.id === dealId) {
          const isWon = newStage === 'won'
          const isLost = newStage === 'lost'
          return {
            ...deal,
            stage: newStage,
            probability: isWon ? 100 : isLost ? 0 : deal.probability,
            lastActivityDaysAgo: 0,
            hasInactivityWarning: false,
          }
        }
        return deal
      })
    )
  }

  // Create new deal
  const addDeal = (dealData) => {
    const newDeal = {
      id: `deal_${Date.now()}`,
      title: dealData.title,
      accountId: dealData.accountId || 'acc_1',
      accountName: dealData.accountName || 'Partner Enterprise',
      contactName: dealData.contactName || 'Procurement Director',
      amount: Number(dealData.amount) || 100000,
      currency: dealData.currency || 'MAD',
      stage: dealData.stage || 'leads',
      probability: Number(dealData.probability) || 20,
      expectedClose: dealData.expectedClose || '2026-11-30',
      ownerId: currentUser?.id || 'usr_rep1',
      ownerName: currentUser?.name || 'Karim Tazi',
      priority: dealData.priority || 'medium',
      lastActivityDaysAgo: 0,
      hasInactivityWarning: false,
      aiRecommendation: 'Deal created. Schedule initial discovery call.',
      products: dealData.products || ['Intelligence Sales Standard'],
    }
    setDeals(prev => [newDeal, ...prev])
    return newDeal
  }

  // Convert Lead to Deal & Account (1-Click Workflow)
  const convertLeadToDeal = (leadId) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    // 1. Create or find Account
    const newAccount = {
      id: `acc_${Date.now()}`,
      name: lead.companyName,
      industry: 'B2B Sector',
      tier: lead.score > 80 ? 'Tier A' : 'Tier B',
      city: lead.city,
      country: 'Morocco',
      creditLimit: 250000,
      revenueLifetime: 0,
      contactName: lead.contactName,
      contactTitle: lead.title,
      contactEmail: lead.email,
      contactPhone: lead.phone,
      status: 'Qualified Prospect Converted',
      dealsCount: 1,
    }
    setAccounts(prev => [newAccount, ...prev])

    // 2. Create Deal
    const newDeal = {
      id: `deal_${Date.now()}`,
      title: `Commercial Opportunity - ${lead.companyName}`,
      accountId: newAccount.id,
      accountName: newAccount.name,
      contactName: newAccount.contactName,
      amount: lead.estimatedValue || 150000,
      currency: 'MAD',
      stage: 'qualification',
      probability: 45,
      expectedClose: '2026-11-20',
      ownerId: currentUser?.id || 'usr_rep1',
      ownerName: currentUser?.name || 'Karim Tazi',
      priority: lead.temperature === 'Hot' ? 'high' : 'medium',
      lastActivityDaysAgo: 0,
      hasInactivityWarning: false,
      aiRecommendation: `Qualified lead with score of ${lead.score}/100. Submit formal proposal within 5 days.`,
      products: ['Intelligence Sales Advanced'],
    }
    setDeals(prev => [newDeal, ...prev])

    // 3. Mark Lead as Converted
    setLeads(prev =>
      prev.map(l => l.id === leadId ? { ...l, status: 'Converted' } : l)
    )

    // 4. Log Activity
    const newActivity = {
      id: `act_${Date.now()}`,
      type: 'meeting',
      title: `Lead Converted: ${lead.companyName}`,
      dealId: newDeal.id,
      dealTitle: newDeal.title,
      contactName: lead.contactName,
      date: new Date().toISOString().split('T')[0],
      time: '11:00',
      status: 'completed',
      notes: `Lead converted by ${currentUser?.name || 'Sales Rep'}. Opportunity injected into pipeline.`,
      repName: currentUser?.name || 'Sales Rep',
    }
    setActivities(prev => [newActivity, ...prev])

    return { account: newAccount, deal: newDeal }
  }

  // Add Lead
  const addLead = (leadData) => {
    const newLead = {
      id: `lead_${Date.now()}`,
      companyName: leadData.companyName,
      contactName: leadData.contactName,
      title: leadData.title || 'Procurement Director',
      phone: leadData.phone || '+212 600 00 00 00',
      email: leadData.email || 'contact@prospect.ma',
      source: leadData.source || 'Web Form',
      city: leadData.city || 'Casablanca',
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      temperature: 'Hot',
      status: 'New',
      estimatedValue: Number(leadData.estimatedValue) || 120000,
      aiNotes: leadData.aiNotes || 'Lead generated via commercial operating system.',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLeads(prev => [newLead, ...prev])
    return newLead
  }

  // Create Quote
  const addQuote = (quoteData) => {
    const newQuote = {
      id: `DEV-2026-${String(quotes.length + 1).padStart(3, '0')}`,
      dealId: quoteData.dealId || 'deal_1',
      accountId: quoteData.accountId || 'acc_1',
      accountName: quoteData.accountName || 'Enterprise Client',
      contactName: quoteData.contactName || 'Decision Maker',
      date: new Date().toISOString().split('T')[0],
      validUntil: quoteData.validUntil || '2026-11-15',
      status: Number(quoteData.discountPercent) > 15 ? 'Pending Approval' : 'Sent',
      discountPercent: Number(quoteData.discountPercent) || 0,
      requiresDirectorApproval: Number(quoteData.discountPercent) > 15,
      items: quoteData.items || [
        { description: 'Intelligence Sales Suite License', qty: 1, unitPrice: 150000, total: 150000 }
      ],
      subtotal: quoteData.subtotal || 150000,
      discountAmount: quoteData.discountAmount || 0,
      totalHT: quoteData.totalHT || 150000,
      tvaAmount: quoteData.tvaAmount || 30000,
      totalTTC: quoteData.totalTTC || 180000,
      ownerName: currentUser?.name || 'Karim Tazi',
    }
    setQuotes(prev => [newQuote, ...prev])
    return newQuote
  }

  // Director Approves Discount
  const approveQuoteDiscount = (quoteId) => {
    setQuotes(prev =>
      prev.map(q => q.id === quoteId ? { ...q, status: 'Sent', requiresDirectorApproval: false } : q)
    )
  }

  // Accept Quote -> Triggers post-sale workflow and marks Deal as Won!
  const acceptQuote = (quoteId) => {
    const quote = quotes.find(q => q.id === quoteId)
    if (!quote) return

    setQuotes(prev =>
      prev.map(q => q.id === quoteId ? { ...q, status: 'Accepted' } : q)
    )

    // Also update associated deal if exists
    if (quote.dealId) {
      moveDealStage(quote.dealId, 'won')
    }

    // Log Activity for post-sale trigger
    const newAct = {
      id: `act_${Date.now()}`,
      type: 'ai_alert',
      title: `Quote ${quote.id} Accepted! ERP Order Triggered`,
      dealId: quote.dealId || '',
      dealTitle: `Signed Proposal for ${quote.accountName}`,
      contactName: quote.contactName,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      status: 'completed',
      notes: `Quote accepted. Downstream post-sale event triggered for Logistics & Finance modules.`,
      repName: currentUser?.name || 'System',
    }
    setActivities(prev => [newAct, ...prev])
  }

  // Execute AI Follow-up (Resets 7-day inactivity)
  const executeFollowUp = (dealId, channel = 'WhatsApp') => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id === dealId) {
          return {
            ...d,
            lastActivityDaysAgo: 0,
            hasInactivityWarning: false,
            aiRecommendation: `${channel} follow-up sent successfully. Next check-in in 5 days.`,
          }
        }
        return d
      })
    )

    // Add activity
    const deal = deals.find(d => d.id === dealId)
    const newAct = {
      id: `act_${Date.now()}`,
      type: channel === 'WhatsApp' ? 'call' : 'email',
      title: `Automated ${channel} Follow-Up (7-Day Rule)`,
      dealId: deal?.id || '',
      dealTitle: deal?.title || 'Opportunity',
      contactName: deal?.contactName || 'Contact',
      date: new Date().toISOString().split('T')[0],
      time: 'Just now',
      status: 'completed',
      notes: `Follow-up message sent with human-in-the-loop approval. Deal reactivated.`,
      repName: currentUser?.name || 'Sales Rep',
    }
    setActivities(prev => [newAct, ...prev])
  }

  // Log new activity
  const addActivity = (actData) => {
    const newAct = {
      id: `act_${Date.now()}`,
      type: actData.type || 'call',
      title: actData.title,
      dealId: actData.dealId || '',
      dealTitle: actData.dealTitle || '',
      contactName: actData.contactName || '',
      date: actData.date || new Date().toISOString().split('T')[0],
      time: actData.time || '10:00',
      status: 'upcoming',
      notes: actData.notes || '',
      repName: currentUser?.name || 'Commercial',
    }
    setActivities(prev => [newAct, ...prev])
    return newAct
  }

  // Reset to initial mock data (English)
  const resetData = () => {
    setDeals(INITIAL_DEALS)
    setLeads(INITIAL_LEADS)
    setAccounts(INITIAL_ACCOUNTS)
    setQuotes(INITIAL_QUOTES)
    setActivities(INITIAL_ACTIVITIES)
    try {
      localStorage.setItem('isales_deals', JSON.stringify(INITIAL_DEALS))
      localStorage.setItem('isales_leads', JSON.stringify(INITIAL_LEADS))
      localStorage.setItem('isales_accounts', JSON.stringify(INITIAL_ACCOUNTS))
      localStorage.setItem('isales_quotes', JSON.stringify(INITIAL_QUOTES))
      localStorage.setItem('isales_activities', JSON.stringify(INITIAL_ACTIVITIES))
      localStorage.setItem('isales_storage_version', CRM_STORAGE_VERSION)
      localStorage.setItem('intelligence_sales_lang', 'en')
    } catch (e) {
      console.warn('resetData error', e)
    }
  }

  return (
    <CrmContext.Provider
      value={{
        deals,
        leads,
        accounts,
        quotes,
        activities,
        stages: PIPELINE_STAGES,
        aiAgents: AI_AGENTS_DEFINITIONS,
        viewScope,
        setViewScope,
        moveDealStage,
        addDeal,
        convertLeadToDeal,
        addLead,
        addQuote,
        approveQuoteDiscount,
        acceptQuote,
        executeFollowUp,
        addActivity,
        resetData,
      }}
    >
      {children}
    </CrmContext.Provider>
  )
}

export function useCrm() {
  const context = useContext(CrmContext)
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider')
  }
  return context
}
