/**
 * Intelligence Sales CRM - API Client Service
 * Connects React Front-end to Laravel 11 REST API
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Helper for standard HTTP requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('intelligence_sales_token')

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`
      throw new Error(errorMsg)
    }

    return data
  } catch (error) {
    console.warn(`[crmApi] Error on ${endpoint}:`, error.message)
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
      localStorage.setItem('intelligence_sales_token', res.token)
    }
    return res
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('intelligence_sales_token')
    }
  },

  async getMe() {
    return request('/auth/me')
  },

  async getUsers() {
    return request('/users')
  },

  // --- Deals (Pipeline) ---
  async getDeals() {
    return request('/deals')
  },

  async createDeal(dealData) {
    return request('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    })
  },

  async updateDealStage(id, stage, lostReason = null) {
    return request(`/deals/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, lost_reason: lostReason }),
    })
  },

  async getDeal(id) {
    return request(`/deals/${id}`)
  },

  // --- Leads ---
  async getLeads() {
    return request('/leads')
  },

  async createLead(leadData) {
    return request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
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

  async createAccount(accountData) {
    return request('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    })
  },

  // --- Quotes (Devis) ---
  async getQuotes() {
    return request('/quotes')
  },

  async createQuote(quoteData) {
    return request('/quotes', {
      method: 'POST',
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

  // --- Analytics KPIs ---
  async getAnalyticsKpis() {
    return request('/analytics/kpis')
  },
}
