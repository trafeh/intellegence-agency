import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import {
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
    amount: d.amount == null ? 0 : Number(d.amount),
    currency: 'MAD',
    stage: d.stage || 'leads',
    probability: d.probability == null ? 0 : Number(d.probability),
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
    numericId: l.id,
    companyName: l.company,
    contactName: l.name,
    title: 'Director',
    phone: l.phone || '+212 600 00 00 00',
    email: l.email || '',
    source: l.source || 'Website',
    city: 'Casablanca',
    score: l.ai_score ?? 75,
    aiScore: l.ai_score ?? 75,
    temperature: (l.ai_score ?? 75) > 80 ? 'Hot' : 'Warm',
    status: l.status || 'New',
    estimatedValue: 120000,
    aiNotes: l.score_reason || 'AI scored lead.',
    createdAt: l.created_at ? l.created_at.split('T')[0] : '2026-10-16',
    userId: l.user_id ? String(l.user_id) : null,
    user_id: l.user_id ?? null,
    assignedTo: l.user_id ? String(l.user_id) : null,
    assignedToId: l.user_id ? String(l.user_id) : null,
    assignedToName: l.user?.name || null,
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
    revenueLifetime: a.annual_revenue || '0 MAD',
    contactName: a.primary_contact || 'Director',
    contactEmail: a.email || '',
    contactPhone: a.phone || '',
    status: a.status || 'Active',
    tier: a.tier || 'Tier B',
    ice: a.ice || '',
    ifNumber: a.if_number || '',
    rcNumber: a.rc_number || '',
    patente: a.patente || '',
    dealsCount: a.deals_count ?? 0,
  }
}

function mapBackendActivity(act) {
  return {
    id: String(act.id),
    type: act.type || 'note',
    title: act.title,
    dealId: act.deal_id ? String(act.deal_id) : '',
    dealTitle: act.deal?.title || 'Opportunité',
    contactName: act.account?.primary_contact || act.lead?.name || 'Contact',
    date: act.scheduled_at ? act.scheduled_at.split('T')[0] : new Date().toISOString().split('T')[0],
    time: act.scheduled_at ? (act.scheduled_at.split('T')[1]?.slice(0, 5) || '12:00') : '12:00',
    status: act.completed ? 'completed' : 'pending',
    notes: act.description || '',
    repName: act.user?.name || 'Commercial',
    repId: act.user_id ? String(act.user_id) : '',
    repRole: act.user?.role || 'rep',
    accountName: act.account?.name || act.deal?.account?.name || '',
    leadName: act.lead?.name || '',
    leadCompany: act.lead?.company || '',
    createdAt: act.created_at || act.scheduled_at || new Date().toISOString(),
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
    items: Array.isArray(q.items) ? q.items.map(it => ({
      description: it.description,
      qty: it.qty,
      unitPrice: it.unit_price,
      total: it.total
    })) : [],
    subtotal: q.subtotal == null ? 0 : Number(q.subtotal),
    discountAmount: Number(q.discount_amount) || 0,
    totalHT: Number(q.subtotal || 0) - Number(q.discount_amount || 0),
    tvaAmount: q.tax_amount == null ? 0 : Number(q.tax_amount),
    totalTTC: q.total_amount == null ? 0 : Number(q.total_amount),
    ownerName: q.user?.name || 'Karim Tazi',
    publicToken: q.public_token || '',
    publicTokenRevokedAt: q.public_token_revoked_at || null,
    isRevoked: Boolean(q.public_token_revoked_at),
    clientSignedAt: q.client_signed_at,
    clientSignerName: q.client_signer_name,
    clientPoNumber: q.client_po_number,
  }
}

function reconcileQuote(q, previous = {}) {
  const mapped = mapBackendQuote(q)
  return { ...previous, ...mapped, items: Array.isArray(q.items) ? mapped.items : (previous.items || []) }
}

export function CrmProvider({ children }) {
  const { currentUser } = useAuth()
  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const [pendingMutations, setPendingMutations] = useState({})
  const pendingRef = useRef(new Set())
  const idempotencyKeysRef = useRef(new Map())
  const idempotencyKeyFor = (operation, payload) => {
    const fingerprint = `${operation}:${JSON.stringify(payload)}`
    let key = idempotencyKeysRef.current.get(fingerprint)
    if (!key) {
      key = globalThis.crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
        const random = Math.floor(Math.random() * 16)
        return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16)
      })
      idempotencyKeysRef.current.set(fingerprint, key)
    }
    return {
      key,
      complete: () => idempotencyKeysRef.current.delete(fingerprint),
    }
  }
  const mutate = async (key, operation) => {
    if (pendingRef.current.has(key)) return null
    pendingRef.current.add(key)
    setPendingMutations(value => ({ ...value, [key]: true }))
    setMutationError('')
    try {
      const result = await operation()
      return result
    } catch (error) {
      setMutationError(error?.message || 'The request failed. Please try again.')
      return null
    } finally {
      pendingRef.current.delete(key)
      setPendingMutations(value => ({ ...value, [key]: false }))
    }
  }
  const backendId = value => /^\d+$/.test(String(value ?? '')) && Number(value) > 0 ? Number(value) : null

  // Deals state
  const [deals, setDeals] = useState([])

  // Leads state
  const [leads, setLeads] = useState([])

  // Accounts state
  const [accounts, setAccounts] = useState([])

  // Quotes state
  const [quotes, setQuotes] = useState([])

  // Users / Reps state
  const [users, setUsers] = useState([])

  // Activities state
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter mode for Rep: 'mine' or 'all'
  const [viewScope, setViewScope] = useState('all')

  // --- Sync with Laravel Backend API ---
  const refreshData = useCallback(async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const isStaffManager = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'director'
      const [dealsRes, leadsRes, accountsRes, quotesRes, activitiesRes, usersRes] = await Promise.all([
        crmApi.getDeals(),
        crmApi.getLeads(),
        crmApi.getAccounts(),
        crmApi.getQuotes(),
        crmApi.getActivities(),
        isStaffManager ? crmApi.getUsers().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ])

      setDeals((dealsRes?.data || []).map(mapBackendDeal))
      setLeads((leadsRes?.data || []).map(mapBackendLead))
      setAccounts((accountsRes?.data || []).map(mapBackendAccount))
      setQuotes((quotesRes?.data || []).map(mapBackendQuote))
      setActivities((activitiesRes?.data || []).map(mapBackendActivity))
      setUsers(usersRes?.data || [])
      setIsBackendConnected(true)
      setMutationError('')
    } catch (err) {
      setIsBackendConnected(false)
      setDeals([]); setLeads([]); setAccounts([]); setQuotes([]); setActivities([]); setUsers([])
      setMutationError('CRM records could not be loaded from the server. Check your connection and access, then refresh.')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  useEffect(() => {
    if (!currentUser) { setDeals([]); setLeads([]); setAccounts([]); setQuotes([]); setActivities([]); setUsers([]); setIsBackendConnected(false) }
  }, [currentUser])

  // Move deal stage (e.g. in Kanban Drag & Drop)
  const moveDealStage = (dealId, newStage, lostReason = null) => mutate(`deal-stage-${dealId}`, async () => {
    const id = backendId(dealId)
    if (!id) throw new Error('This deal has no server ID and cannot be updated.')
    const operation = idempotencyKeyFor('deal-stage', { id, newStage, lostReason })
    const response = await crmApi.updateDealStage(id, newStage, lostReason, operation.key)
    if (!response?.data?.id) throw new Error('The server did not confirm the deal update.')
    operation.complete()
    const confirmed = mapBackendDeal(response.data)
    setDeals(previous => previous.map(deal => deal.id === String(dealId) ? confirmed : deal))
    try {
      const activitiesResponse = await crmApi.getActivities()
      setActivities((activitiesResponse?.data || []).map(mapBackendActivity))
    } catch {
      setMutationError('Deal stage updated, but the activity list could not refresh. Reload CRM data to see the latest activity.')
    }
    return confirmed
  })

  // Create new deal
  const addDeal = dealData => mutate('create-deal', async () => {
    const accountId = backendId(dealData.accountId)
    if (!accountId) throw new Error('Select a valid server account before creating a deal.')
    const payload = {
      title: dealData.title,
      account_id: accountId,
      amount: Number(dealData.amount),
      stage: dealData.stage,
      probability: Number(dealData.probability),
      expected_close_date: dealData.expectedClose,
      products: dealData.products,
    }
    if (dealData.userId) {
      payload.user_id = backendId(dealData.userId)
    }
    const response = await crmApi.createDeal(payload)
    if (!response?.data?.id) throw new Error('The server did not confirm deal creation.')
    const confirmed = mapBackendDeal(response.data)
    setDeals(previous => [confirmed, ...previous])
    try {
      const activitiesResponse = await crmApi.getActivities()
      setActivities((activitiesResponse?.data || []).map(mapBackendActivity))
    } catch {
      // ignore
    }
    return confirmed
  })

  // Update deal (e.g. reassign rep, edit deal info)
  const updateDeal = (dealId, dealData) => mutate(`update-deal-${dealId}`, async () => {
    const id = backendId(dealId)
    if (!id) throw new Error('This deal has no server ID and cannot be updated.')
    const payload = {}
    if (dealData.title !== undefined) payload.title = dealData.title
    if (dealData.amount !== undefined) payload.amount = Number(dealData.amount)
    if (dealData.accountId !== undefined) payload.account_id = backendId(dealData.accountId)
    if (dealData.probability !== undefined) payload.probability = Number(dealData.probability)
    if (dealData.expectedClose !== undefined) payload.expected_close_date = dealData.expectedClose
    if (dealData.products !== undefined) payload.products = dealData.products
    if (dealData.userId !== undefined) payload.user_id = dealData.userId ? backendId(dealData.userId) : null
    if (dealData.aiRecommendation !== undefined) payload.ai_recommendation = dealData.aiRecommendation

    const response = await crmApi.updateDeal(id, payload)
    if (!response?.data?.id) throw new Error('The server did not confirm the deal update.')
    const confirmed = mapBackendDeal(response.data)
    setDeals(previous => previous.map(deal => deal.id === String(dealId) ? confirmed : deal))
    try {
      const activitiesResponse = await crmApi.getActivities()
      setActivities((activitiesResponse?.data || []).map(mapBackendActivity))
    } catch {
      // ignore
    }
    return confirmed
  })

  // Convert Lead to Deal & Account
  const convertLeadToDeal = leadId => mutate(`convert-lead-${leadId}`, async () => {
    const id = backendId(leadId)
    const lead = leads.find(item => item.id === String(leadId))
    if (!id || !lead) throw new Error('This lead cannot be converted because it has no server ID.')
    const response = await crmApi.convertLead(id, lead.estimatedValue || 150000, `Commercial Opportunity - ${lead.companyName}`)
    if (!response?.data?.account?.id || !response?.data?.deal?.id || !response?.data?.lead) throw new Error('The server did not confirm lead conversion.')
    const account = mapBackendAccount(response.data.account)
    const deal = mapBackendDeal(response.data.deal)
    setAccounts(previous => [account, ...previous.filter(item => item.id !== account.id)])
    setDeals(previous => [deal, ...previous.filter(item => item.id !== deal.id)])
    setLeads(previous => previous.map(item => item.id === String(leadId) ? mapBackendLead(response.data.lead) : item))
    return { account, deal }
  })

  // Add Lead
  const addLead = leadData => mutate('create-lead', async () => {
    const response = await crmApi.createLead({ name: leadData.contactName, company: leadData.companyName, email: leadData.email, phone: leadData.phone, source: leadData.source, ai_score: Number(leadData.score) || undefined })
    if (!response?.data?.id) throw new Error('The server did not confirm lead creation.')
    const confirmed = mapBackendLead(response.data)
    setLeads(previous => [confirmed, ...previous])
    return confirmed
  })

  // Create Quote
  const addQuote = quoteData => mutate('create-quote', async () => {
    const accountId = backendId(quoteData.accountId)
    const dealId = quoteData.dealId ? backendId(quoteData.dealId) : null
    if (!accountId || (quoteData.dealId && !dealId)) throw new Error('Select valid server records for this quote.')
    const response = await crmApi.createQuote({ account_id: accountId, deal_id: dealId, discount_percent: Number(quoteData.discountPercent) || 0, expiry_date: quoteData.validUntil, items: (quoteData.items || []).map(item => ({ description: item.description, qty: Number(item.qty) || 1, unit_price: Number(item.unitPrice) || 0 })) })
    if (!response?.data?.id) throw new Error('The server did not confirm quote creation.')
    const confirmed = mapBackendQuote(response.data)
    setQuotes(previous => [confirmed, ...previous])
    if (response.data.deal?.id) setDeals(previous => previous.map(deal => deal.id === String(response.data.deal.id) ? mapBackendDeal(response.data.deal) : deal))
    else if (dealId) {
      try {
        const dealResponse = await crmApi.getDeal(dealId)
        if (dealResponse?.data?.id) setDeals(previous => previous.map(deal => deal.id === String(dealId) ? mapBackendDeal(dealResponse.data) : deal))
      } catch {
        setMutationError('Quote saved, but the linked deal could not refresh. Reload CRM data to see its current stage.')
      }
    }
    try {
      if (response.data.activities) setActivities(response.data.activities.map(mapBackendActivity))
      else { const activitiesResponse = await crmApi.getActivities(); setActivities((activitiesResponse?.data || []).map(mapBackendActivity)) }
    } catch {
      setMutationError('Quote saved, but the activity list could not refresh. Reload CRM data to see the latest activity.')
    }
    return confirmed
  })

  // Director Approves Discount
  const approveQuoteDiscount = quoteId => mutate(`approve-quote-${quoteId}`, async () => {
    const quote = quotes.find(item => item.id === quoteId)
    const id = backendId(quote?.numericId)
    if (!id) throw new Error('This quote has no server ID and cannot be approved.')
    const response = await crmApi.approveQuoteDiscount(id)
    if (!response?.data?.id) throw new Error('The server did not confirm quote approval.')
    const confirmed = mapBackendQuote(response.data)
    setQuotes(previous => previous.map(item => item.numericId === id ? confirmed : item))
    try {
      const activitiesResponse = await crmApi.getActivities()
      setActivities((activitiesResponse?.data || []).map(mapBackendActivity))
    } catch {
      setMutationError('Approval confirmed, but the activity list could not refresh. Reload CRM data to see the latest activity.')
    }
    return confirmed
  })

  const sendQuote = quoteId => mutate(`send-quote-${quoteId}`, async () => {
    const quote = quotes.find(item => item.id === quoteId)
    const id = backendId(quote?.numericId)
    if (!id) throw new Error('This quote has no server ID and cannot be sent.')
    const response = await crmApi.sendQuote(id)
    if (!response?.data?.id) throw new Error('The server did not confirm the quote status change.')
    let quoteData = response.data
    try { const fullResponse = await crmApi.getQuote(id); if (fullResponse?.data?.id) quoteData = fullResponse.data } catch { /* use the confirmed send response */ }
    const confirmed = reconcileQuote(quoteData, quote)
    setQuotes(previous => previous.map(item => item.numericId === id ? confirmed : item))
    return confirmed
  })

  // Revoke Public Token
  const revokePublicToken = quoteId => mutate(`revoke-token-${quoteId}`, async () => {
    const quote = quotes.find(item => item.id === quoteId)
    const id = backendId(quote?.numericId)
    if (!id) throw new Error('This quote has no server ID and its public token cannot be revoked.')
    const response = await crmApi.revokePublicToken(id)
    if (!response?.success) throw new Error(response?.message || 'The server could not revoke the public token.')
    let quoteData = response.data
    if (!quoteData) {
      try {
        const fullResponse = await crmApi.getQuote(id)
        if (fullResponse?.data?.id) quoteData = fullResponse.data
      } catch { /* use confirmed fallback */ }
    }
    const confirmed = quoteData
      ? reconcileQuote(quoteData, quote)
      : { ...quote, publicTokenRevokedAt: new Date().toISOString(), isRevoked: true }
    setQuotes(previous => previous.map(item => item.numericId === id ? confirmed : item))
    return confirmed
  })

  // Accept Quote -> Triggers post-sale workflow and marks Deal as Won
  const acceptQuote = (quoteId, signerInfo = {}) => mutate(`accept-quote-${quoteId}`, async () => {
    const quote = quotes.find(item => item.id === quoteId)
    const id = backendId(quote?.numericId)
    if (!id) throw new Error('This quote has no server ID and cannot be accepted.')
    const response = await crmApi.recordQuoteAcceptance(id, { signerName: signerInfo.signerName || quote.contactName, poNumber: signerInfo.poNumber || '', notes: signerInfo.notes || 'Accepted via CRM interface' })
    if (!response?.data?.id || response.data.status !== 'Accepted') throw new Error('The server did not confirm quote acceptance.')
    const confirmed = reconcileQuote(response.data, quote)
    setQuotes(previous => previous.map(item => item.numericId === id ? confirmed : item))
    if (response.data.deal?.id) setDeals(previous => previous.map(item => item.id === String(response.data.deal.id) ? mapBackendDeal(response.data.deal) : item))
    else if (response.data.deal_id) {
      try {
        const dealResponse = await crmApi.getDeal(response.data.deal_id)
        if (dealResponse?.data?.id) setDeals(previous => previous.map(item => item.id === String(dealResponse.data.id) ? mapBackendDeal(dealResponse.data) : item))
      } catch {
        setMutationError('Acceptance confirmed, but the linked deal could not refresh. Reload CRM data to see its current stage.')
      }
    }
    try {
      const activitiesResponse = await crmApi.getActivities()
      setActivities((activitiesResponse?.data || []).map(mapBackendActivity))
    } catch {
      setMutationError('Acceptance confirmed, but the activity list could not refresh. Reload CRM data to see the latest activity.')
    }
    return confirmed
  })

  // Execute AI Autonomous Follow-Up Action
  const executeFollowUp = (dealId, actionType) => mutate(`followup-${dealId}`, async () => {
    const deal = deals.find(d => d.id === dealId)
    const id = backendId(dealId)
    if (!id || !deal) throw new Error('This deal has no server ID; the follow-up was not recorded.')

    const newActivity = {
      type: actionType,
      title: `Follow-up request logged (${actionType}): ${deal.title}`,
      dealId: deal.id,
      dealTitle: deal.title,
      contactName: deal.contactName,
      status: 'completed',
      notes: 'Recorded in the CRM activity timeline. External message delivery is not connected.',
      repName: 'Autonomous AI Engine',
    }
    const activityPayload = {
      type: newActivity.type,
      title: newActivity.title,
      description: newActivity.notes,
      deal_id: id,
      completed: true,
    }
    const operation = idempotencyKeyFor('activity-create', activityPayload)
    const response = await crmApi.createActivity(activityPayload, operation.key)
    if (!response?.data?.id) throw new Error('The server did not confirm the follow-up.')
    operation.complete()
    setActivities(previous => [mapBackendActivity(response.data), ...previous.filter(item => item.id !== String(response.data.id))])
    return mapBackendActivity(response.data)
  })

  // Add custom activity
  const addActivity = actData => mutate('create-activity', async () => {
    const newAct = {
      id: undefined,
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
    const dealId = newAct.dealId ? backendId(newAct.dealId) : null
    if (newAct.dealId && !dealId) throw new Error('The selected deal has no server ID.')
    const activityPayload = {
      type: newAct.type,
      title: newAct.title,
      description: newAct.notes,
      deal_id: dealId,
      scheduled_at: `${newAct.date} 12:00:00`,
      completed: newAct.status === 'completed',
    }
    const operation = idempotencyKeyFor('activity-create', activityPayload)
    const response = await crmApi.createActivity(activityPayload, operation.key)
    if (!response?.data?.id) throw new Error('The server did not confirm activity creation.')
    operation.complete()
    const confirmed = mapBackendActivity(response.data)
    setActivities(previous => [confirmed, ...previous])
    return confirmed
  })

  // Add new enterprise account
  const addAccount = accData => mutate('create-account', async () => {
    const response = await crmApi.createAccount({
      name: accData.name,
      industry: accData.industry,
      annual_revenue: accData.annual_revenue,
      city: accData.city,
      phone: accData.phone,
      email: accData.email,
      website: accData.website,
      status: accData.status,
      tier: accData.tier,
      primary_contact: accData.primary_contact,
      ice: accData.ice,
      if_number: accData.if_number,
      rc_number: accData.rc_number,
      patente: accData.patente,
      notes: accData.notes,
    })
    if (!response?.data?.id) throw new Error('The server did not confirm account creation.')
    const confirmed = mapBackendAccount(response.data)
    setAccounts(previous => [confirmed, ...previous])
    return confirmed
  })

  // Delete Deal
  const deleteDeal = dealId => mutate(`delete-deal-${dealId}`, async () => {
    const id = backendId(dealId); if (!id) throw new Error('This deal has no server ID.')
    await crmApi.deleteDeal(id); setDeals(previous => previous.filter(item => item.id !== String(dealId))); return true
  })

  // Delete Quote
  const deleteQuote = quoteId => mutate(`delete-quote-${quoteId}`, async () => {
    const quote = quotes.find(item => item.id === quoteId); const id = backendId(quote?.numericId)
    if (!id) throw new Error('This quote has no server ID.')
    await crmApi.deleteQuote(id); setQuotes(previous => previous.filter(item => item.numericId !== id)); return true
  })

  // Delete Lead
  const deleteLead = leadId => mutate(`delete-lead-${leadId}`, async () => {
    const id = backendId(leadId); if (!id) throw new Error('This lead has no server ID.')
    await crmApi.deleteLead(id); setLeads(previous => previous.filter(item => item.id !== String(leadId))); return true
  })

  // Delete Account
  const deleteAccount = accountId => mutate(`delete-account-${accountId}`, async () => {
    const id = backendId(accountId); if (!id) throw new Error('This account has no server ID.')
    await crmApi.deleteAccount(id); setAccounts(previous => previous.filter(item => item.id !== String(accountId))); return true
  })

  // Reset to initial mock data
  const resetData = () => mutate('refresh-crm-data', async () => {
    const isStaffManager = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'director'
    const [dealResponse, leadResponse, accountResponse, quoteResponse, activityResponse, userResponse] = await Promise.all([
      crmApi.getDeals(),
      crmApi.getLeads(),
      crmApi.getAccounts(),
      crmApi.getQuotes(),
      crmApi.getActivities(),
      isStaffManager ? crmApi.getUsers().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
    ])
    setDeals((dealResponse?.data || []).map(mapBackendDeal))
    setLeads((leadResponse?.data || []).map(mapBackendLead))
    setAccounts((accountResponse?.data || []).map(mapBackendAccount))
    setQuotes((quoteResponse?.data || []).map(mapBackendQuote))
    setActivities((activityResponse?.data || []).map(mapBackendActivity))
    setUsers(userResponse?.data || [])
    return true
  })

  return (
    <CrmContext.Provider
      value={{
        deals,
        leads,
        accounts,
        quotes,
        activities,
        users,
        stages: PIPELINE_STAGES,
        aiAgents: AI_AGENTS_DEFINITIONS,
        viewScope,
        setViewScope,
        loading,
        isLoading: loading,
        isBackendConnected,
        mutationError,
        clearMutationError: () => setMutationError(''),
        pendingMutations,
        moveDealStage,
        addDeal,
        updateDeal,
        deleteDeal,
        convertLeadToDeal,
        addLead,
        deleteLead,
        addQuote,
        deleteQuote,
        addAccount,
        deleteAccount,
        approveQuoteDiscount,
        sendQuote,
        revokePublicToken,
        acceptQuote,
        executeFollowUp,
        addActivity,
        refreshData,
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
