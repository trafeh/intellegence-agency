/**
 * Intelligence Sales CRM - API Client Service
 * Connects React Front-end to Laravel 11 REST API
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'intelligence_sales_token'
const apiUrl = (endpoint) => `${API_BASE_URL}/api${endpoint}`

// Helper for standard HTTP requests
async function request(endpoint, options = {}) {
  if (!API_BASE_URL) throw new Error('API is not configured. Set VITE_API_BASE_URL.')
  const token = localStorage.getItem(TOKEN_KEY)

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const res = await fetch(apiUrl(endpoint), {
      ...options,
      headers,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const errorMsg = res.status >= 500
        ? 'The server could not complete the request. Try again later.'
        : res.status === 401
          ? 'Your session is invalid or expired. Sign in again.'
          : res.status === 403
            ? 'You do not have permission to perform this action.'
            : res.status === 404
              ? 'The requested record was not found.'
              : data?.message || `Request failed with status ${res.status}`
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        window.dispatchEvent(new Event('crm:unauthorized'))
      }
      throw new Error(errorMsg)
    }

    return data
  } catch (error) {
    throw error
  }
}

export const crmApi = {
  // --- Auth ---
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (res?.token) {
      if (res?.token) localStorage.setItem(TOKEN_KEY, res.token)
    }
    return res
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  async getMe() {
    return request('/auth/me')
  },

  clearToken() { localStorage.removeItem(TOKEN_KEY) },

  async getUsers() {
    return request('/users')
  },

  // --- Deals (Pipeline) ---
  async getDeals() {
    return request('/deals')
  },

  async getDeal(id) {
    return request(`/deals/${id}`)
  },

  async createDeal(dealData) {
    return request('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    })
  },

  async updateDeal(id, dealData) {
    return request(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    })
  },

  async updateDealStage(id, stage, lostReason = null, idempotencyKey) {
    return request(`/deals/${id}/stage`, {
      method: 'PUT',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ stage, lost_reason: lostReason }),
    })
  },

  async deleteDeal(id) {
    return request(`/deals/${id}`, {
      method: 'DELETE',
    })
  },

  // --- Leads ---
  async getLeads() {
    return request('/leads')
  },

  async getLead(id) {
    return request(`/leads/${id}`)
  },

  async createLead(leadData) {
    return request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    })
  },

  async updateLead(id, leadData) {
    return request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    })
  },

  async deleteLead(id) {
    return request(`/leads/${id}`, {
      method: 'DELETE',
    })
  },

  async convertLead(id, dealAmount, dealTitle = null) {
    return request(`/leads/${id}/convert`, {
      method: 'POST',
      body: JSON.stringify({ deal_amount: dealAmount, deal_title: dealTitle }),
    })
  },

  // --- Accounts ---
  async getAccounts() {
    return request('/accounts')
  },

  async getAccount(id) {
    return request(`/accounts/${id}`)
  },

  async createAccount(accountData) {
    return request('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    })
  },

  async updateAccount(id, accountData) {
    return request(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    })
  },

  async deleteAccount(id) {
    return request(`/accounts/${id}`, {
      method: 'DELETE',
    })
  },

  // --- Quotes (Devis) ---
  async getQuotes() {
    return request('/quotes')
  },

  async getQuote(id) {
    return request(`/quotes/${id}`)
  },

  async createQuote(quoteData) {
    return request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    })
  },

  async updateQuote(id, quoteData) {
    return request(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quoteData),
    })
  },

  async approveQuoteDiscount(id) {
    return request(`/quotes/${id}/approve-discount`, {
      method: 'POST',
    })
  },

  async sendQuote(id) {
    return request(`/quotes/${id}/send`, {
      method: 'POST',
    })
  },

  async revokePublicToken(id) {
    return request(`/quotes/${id}/revoke-public-token`, {
      method: 'POST',
    })
  },

  async recordQuoteAcceptance(id, { signerName, poNumber, notes }) {
    return request(`/quotes/${id}/record-acceptance`, {
      method: 'POST',
      body: JSON.stringify({
        client_signer_name: signerName,
        client_po_number: poNumber,
        notes,
      }),
    })
  },

  async deleteQuote(id) {
    return request(`/quotes/${id}`, {
      method: 'DELETE',
    })
  },

  // --- Activities & Follow-ups ---
  async getActivities() {
    return request('/activities')
  },

  async createActivity(activityData, idempotencyKey) {
    return request('/activities', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(activityData),
    })
  },

  async completeActivity(id) {
    return request(`/activities/${id}/complete`, {
      method: 'POST',
    })
  },

  // --- Public Client Portal (No Auth Required) ---
  async getPublicQuote(token) {
    return request(`/public/quotes/${token}`)
  },

  async acceptPublicQuote(token, { signerName, poNumber, comment }) {
    return request(`/public/quotes/${token}/accept`, {
      method: 'POST',
      body: JSON.stringify({
        signer_name: signerName,
        po_number: poNumber,
        comment,
      }),
    })
  },

  async submitPublicProposal(proposalData) {
    return request('/public/proposals', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    })
  },

  // --- Analytics KPIs ---
  async getAnalyticsKpis() {
    return request('/analytics/kpis')
  },
}
