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
import { crmApi } from '../../services/crmApi'

const CrmContext = createContext(null)

const CRM_STORAGE_VERSION = 'v3_api_connected'

// Helper Mappers between Laravel API schema and React frontend UI models
function mapBackendDeal(d) {
  return {
    id: String(d.id),
    title: d.title,
    accountId: String(d.account_id || d.account?.id || ''),
    accountName: d.account?.name || 'Enterprise Client',
    contactName: d.account?.primary_contact || 'Decision Maker',
    amount: Number(d.amount) || 100000,
    currency: 'MAD',
    stage: d.stage || 'leads',
    probability: Number(d.probability) || 20,
    expectedClose: d.expected_close_date ? d.expected_close_date.split('T')[0] : '2026-11-30',
    ownerId: String(d.user_id || ''),
    ownerName: d.user?.name || 'Karim Tazi',
    priority: d.amount > 150000 ? 'high' : 'medium',
    lastActivityDaysAgo: 0,
    hasInactivityWarning: false,
    aiRecommendation: d.ai_recommendation || 'Next step: engage client.',
    products: d.products || ['Intelligence Sales Solution'],
  }
}

function mapBackendLead(l) {
  return {
    id: String(l.id),
    companyName: l.company,
    contactName: l.name,
    title: 'Director',
    phone: l.phone || '+212 600 00 00 00',
    email: l.email || '',
    source: l.source || 'Website',
    city: 'Casablanca',
    score: l.ai_score || 75,
    temperature: (l.ai_score || 75) > 80 ? 'Hot' : 'Warm',
    status: l.status || 'New',
    estimatedValue: 120000,
    aiNotes: l.score_reason || 'AI scored lead.',
    createdAt: l.created_at ? l.created_at.split('T')[0] : '2026-10-16',
  }
}

function mapBackendAccount(a) {
  return {
    id: String(a.id),
    name: a.name,
    industry: a.industry || 'B2B Enterprise',
    city: a.city || 'Casablanca',
    country: 'Morocco',
    creditLimit: 250000,
    revenueLifetime: a.annual_revenue || '45,000,000 MAD',
    contactName: a.primary_contact || 'Director',
    contactEmail: a.email || '',
    contactPhone: a.phone || '',
    status: a.status || 'Active',
    dealsCount: a.deals_count || 1,
  }
}

function mapBackendQuote(q) {
  return {
    id: q.quote_number || `Q-${q.id}`,
    numericId: q.id,
    dealId: q.deal_id ? String(q.deal_id) : '',
    accountId: String(q.account_id || ''),
    accountName: q.client_company || q.account?.name || 'Enterprise Client',
    contactName: q.client_name || q.account?.primary_contact || 'Decision Maker',
    date: q.created_at ? q.created_at.split('T')[0] : '2026-10-16',
    validUntil: q.expiry_date ? q.expiry_date.split('T')[0] : '2026-11-30',
    status: q.status || 'Draft',
    discountPercent: Number(q.discount_percent) || 0,
    requiresDirectorApproval: Number(q.discount_percent) > 15 && !q.discount_approved,
    items: q.items && q.items.length > 0 ? q.items.map(it => ({
      description: it.description,
      qty: it.qty,
      unitPrice: it.unit_price,
      total: it.total
    })) : [
      { description: 'Licence Intelligence Sales', qty: 1, unitPrice: q.subtotal, total: q.subtotal }
    ],
    subtotal: Number(q.subtotal) || 100000,
    discountAmount: Number(q.discount_amount) || 0,
    totalHT: Number(q.subtotal - q.discount_amount) || 100000,
    tvaAmount: Number(q.tax_amount) || 20000,
    totalTTC: Number(q.total_amount) || 120000,
    ownerName: q.user?.name || 'Karim Tazi',
    publicToken: q.public_token || 'token-marocraft-001',
    clientSignedAt: q.client_signed_at,
    clientSignerName: q.client_signer_name,
    clientPoNumber: q.client_po_number,
  }
}

export function CrmProvider({ children }) {
  const { currentUser, role } = useAuth()
  const [isBackendConnected, setIsBackendConnected] = useState(false)

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

  // --- Sync with Laravel Backend API on Mount ---
  useEffect(() => {
    let isMounted = true

    async function syncData() {
      try {
        const [dealsRes, leadsRes, accountsRes, quotesRes] = await Promise.all([
          crmApi.getDeals().catch(() => null),
          crmApi.getLeads().catch(() => null),
          crmApi.getAccounts().catch(() => null),
          crmApi.getQuotes().catch(() => null),
        ])

        if (!isMounted) return

        if (dealsRes?.data && dealsRes.data.length > 0) {
          setDeals(dealsRes.data.map(mapBackendDeal))
          setIsBackendConnected(true)
        }
        if (leadsRes?.data && leadsRes.data.length > 0) {
          setLeads(leadsRes.data.map(mapBackendLead))
        }
        if (accountsRes?.data && accountsRes.data.length > 0) {
          setAccounts(accountsRes.data.map(mapBackendAccount))
        }
        if (quotesRes?.data && quotesRes.data.length > 0) {
          setQuotes(quotesRes.data.map(mapBackendQuote))
        }
      } catch (err) {
        console.warn('Backend sync error:', err.message)
      }
    }

    syncData()
    return () => { isMounted = false }
  }, [])

  // Save to localStorage as resilient offline cache
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

  // Move deal stage (e.g. in Kanban Drag & Drop)
  const moveDealStage = (dealId, newStage, lostReason = null) => {
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

    // Call Laravel API in background
    crmApi.updateDealStage(dealId, newStage, lostReason).catch(err => {
      console.warn('Failed to update stage on API:', err.message)
    })
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
      ownerId: currentUser?.id || '1',
      ownerName: currentUser?.name || 'Karim Tazi',
      priority: dealData.priority || 'medium',
      lastActivityDaysAgo: 0,
      hasInactivityWarning: false,
      aiRecommendation: 'Deal created. Schedule initial discovery call.',
      products: dealData.products || ['Intelligence Sales Standard'],
    }
    setDeals(prev => [newDeal, ...prev])

    // Call Laravel API
    crmApi.createDeal({
      title: newDeal.title,
      account_id: isNaN(newDeal.accountId) ? 1 : Number(newDeal.accountId),
      amount: newDeal.amount,
      stage: newDeal.stage,
      probability: newDeal.probability,
      expected_close_date: newDeal.expectedClose,
      products: newDeal.products,
    }).catch(err => console.warn('createDeal API error:', err.message))

    return newDeal
  }

  // Convert Lead to Deal & Account
  const convertLeadToDeal = (leadId) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

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
      ownerId: currentUser?.id || '1',
      ownerName: currentUser?.name || 'Karim Tazi',
      priority: lead.temperature === 'Hot' ? 'high' : 'medium',
      lastActivityDaysAgo: 0,
      hasInactivityWarning: false,
      aiRecommendation: `Qualified lead with score of ${lead.score}/100. Submit formal proposal within 5 days.`,
      products: ['Intelligence Sales Advanced'],
    }
    setDeals(prev => [newDeal, ...prev])

    setLeads(prev =>
      prev.map(l => l.id === leadId ? { ...l, status: 'Converted' } : l)
    )

    // Call API conversion
    if (!isNaN(leadId)) {
      crmApi.convertLead(leadId, newDeal.amount, newDeal.title).catch(err => console.warn(err.message))
    }

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
      score: Math.floor(Math.random() * 30) + 70,
      temperature: 'Hot',
      status: 'New',
      estimatedValue: Number(leadData.estimatedValue) || 120000,
      aiNotes: leadData.aiNotes || 'Lead generated via commercial operating system.',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLeads(prev => [newLead, ...prev])

    // Call API
    crmApi.createLead({
      name: newLead.contactName,
      company: newLead.companyName,
      email: newLead.email,
      phone: newLead.phone,
      source: newLead.source,
      ai_score: newLead.score,
    }).catch(err => console.warn('createLead API error:', err.message))

    return newLead
  }

  // Create Quote
  const addQuote = (quoteData) => {
    const newQuote = {
      id: `Q-2026-${String(quotes.length + 1).padStart(3, '0')}`,
      dealId: quoteData.dealId || '',
      accountId: quoteData.accountId || '1',
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
      publicToken: `token-${Date.now()}`,
    }
    setQuotes(prev => [newQuote, ...prev])

    // Automatically transition Deal to 'proposal' stage
    if (quoteData.dealId) {
      setDeals(prevDeals =>
        prevDeals.map(d => {
          if (d.id === quoteData.dealId && (d.stage === 'leads' || d.stage === 'qualification' || d.stage === 'discovery')) {
            return {
              ...d,
              stage: 'proposal',
              probability: Math.max(d.probability, 60),
              lastActivityDaysAgo: 0,
              aiRecommendation: `Formal quote ${newQuote.id} generated. Follow up with client within 3 days.`
            }
          }
          return d
        })
      )
    }

    // Call Laravel API
    crmApi.createQuote({
      account_id: isNaN(quoteData.accountId) ? 1 : Number(quoteData.accountId),
      deal_id: isNaN(quoteData.dealId) ? null : Number(quoteData.dealId),
      discount_percent: Number(quoteData.discountPercent) || 0,
      expiry_date: quoteData.validUntil || '2026-11-30',
      items: (quoteData.items || []).map(it => ({
        description: it.description,
        qty: Number(it.qty) || 1,
        unit_price: Number(it.unitPrice) || 50000,
      }))
    }).catch(err => console.warn('createQuote API error:', err.message))

    return newQuote
  }

  // Director Approves Discount
  const approveQuoteDiscount = (quoteId) => {
    setQuotes(prev =>
      prev.map(q => q.id === quoteId ? { ...q, status: 'Sent', requiresDirectorApproval: false } : q)
    )

    const targetQuote = quotes.find(q => q.id === quoteId)
    if (targetQuote?.numericId) {
      crmApi.approveQuoteDiscount(targetQuote.numericId).catch(err => console.warn(err.message))
    }
  }

  // Accept Quote -> Triggers post-sale workflow and marks Deal as Won
  const acceptQuote = (quoteId, signerInfo = {}) => {
    const quote = quotes.find(q => q.id === quoteId)
    if (!quote) return

    setQuotes(prev =>
      prev.map(q => q.id === quoteId ? {
        ...q,
        status: 'Accepted',
        clientSignerName: signerInfo.signerName || quote.contactName,
        clientPoNumber: signerInfo.poNumber || `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`
      } : q)
    )

    if (quote.dealId) {
      moveDealStage(quote.dealId, 'won')
    }

    // Log Activity
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

    // Call Laravel API
    if (quote.numericId) {
      crmApi.recordQuoteAcceptance(quote.numericId, {
        signerName: signerInfo.signerName || quote.contactName,
        poNumber: signerInfo.poNumber || `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: signerInfo.notes || 'Accepted via CRM interface',
      }).catch(err => console.warn(err.message))
    }
  }

  // Execute AI Autonomous Follow-Up Action
  const executeFollowUp = (dealId, actionType) => {
    const deal = deals.find(d => d.id === dealId)
    if (!deal) return

    const newActivity = {
      id: `act_${Date.now()}`,
      type: actionType,
      title: `Autonomous ${actionType.toUpperCase()}: ${deal.title}`,
      dealId: deal.id,
      dealTitle: deal.title,
      contactName: deal.contactName,
      date: new Date().toISOString().split('T')[0],
      time: 'Now',
      status: 'completed',
      notes: `Autonomous AI trigger successfully dispatched. Response tracking initialized.`,
      repName: 'Autonomous AI Engine',
    }
    setActivities(prev => [newActivity, ...prev])

    setDeals(prev =>
      prev.map(d =>
        d.id === dealId
          ? {
              ...d,
              lastActivityDaysAgo: 0,
              hasInactivityWarning: false,
              probability: Math.min(d.probability + 5, 95),
            }
          : d
      )
    )
  }

  // Add custom activity
  const addActivity = (actData) => {
    const newAct = {
      id: `act_${Date.now()}`,
      type: actData.type || 'call',
      title: actData.title,
      dealId: actData.dealId || '',
      dealTitle: actData.dealTitle || 'Opportunity',
      contactName: actData.contactName || 'Lead',
      date: actData.date || new Date().toISOString().split('T')[0],
      time: actData.time || '10:00',
      status: actData.status || 'pending',
      notes: actData.notes || '',
      repName: currentUser?.name || 'Commercial',
    }
    setActivities(prev => [newAct, ...prev])
    return newAct
  }

  // Reset to initial mock data
  const resetData = () => {
    setDeals(INITIAL_DEALS)
    setLeads(INITIAL_LEADS)
    setAccounts(INITIAL_ACCOUNTS)
    setQuotes(INITIAL_QUOTES)
    setActivities(INITIAL_ACTIVITIES)
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
        isBackendConnected,
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
