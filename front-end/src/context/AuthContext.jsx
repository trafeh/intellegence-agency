import { createContext, useContext, useEffect, useState } from 'react'
import { crmApi } from '../services/crmApi'

const AuthContext = createContext(null)

function normalizeUser(user) {
  if (!user) return null
  const accountId = user.account_id ?? user.account?.id ?? null
  const accountName = user.account?.name || null
  return {
    ...user,
    account_id: accountId,
    accountId,
    accountName,
    company: accountName,
    initials: user.name?.split(' ').map(part => part[0]).join('').slice(0, 2) || '',
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let active = true
    const onUnauthorized = () => { setCurrentUser(null); crmApi.clearToken() }
    window.addEventListener('crm:unauthorized', onUnauthorized)
    const token = localStorage.getItem('intelligence_sales_token')
    if (!token) setAuthLoading(false)
    else crmApi.getMe().then(res => {
      if (active) setCurrentUser(normalizeUser(res?.user || res?.data?.user || res?.data || null))
    }).catch(() => {
      crmApi.clearToken()
      if (active) setCurrentUser(null)
    }).finally(() => { if (active) setAuthLoading(false) })
    return () => { active = false; window.removeEventListener('crm:unauthorized', onUnauthorized) }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await crmApi.login(email, password)
      const user = normalizeUser(response?.user || response?.data?.user)
      if (!response?.token || !user) throw new Error('The server did not return a valid session.')
      setCurrentUser(user)
      return { success: true, user }
    } catch (error) {
      crmApi.clearToken()
      setCurrentUser(null)
      return { success: false, message: error.message || 'Unable to sign in.' }
    }
  }

  const logout = async () => {
    try { await crmApi.logout() } catch { crmApi.clearToken() }
    setCurrentUser(null)
  }

  const role = currentUser?.role || null
  return <AuthContext.Provider value={{ currentUser, authLoading, isAuthenticated: Boolean(currentUser), role, login, logout, users: [] }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
