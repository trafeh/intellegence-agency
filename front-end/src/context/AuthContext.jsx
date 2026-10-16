import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_USERS } from '../crm/data/crmMockData'
import { crmApi } from '../services/crmApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('intelligence_sales_user')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    // Default to Admin so the app is immediately usable
    return INITIAL_USERS[0]
  })

  const isAuthenticated = Boolean(currentUser)
  const role = currentUser?.role || 'admin'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('intelligence_sales_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('intelligence_sales_user')
    }
  }, [currentUser])

  // Quick Demo Login (admin, manager, rep, client)
  const quickDemoLogin = (targetRole = 'admin') => {
    const user = INITIAL_USERS.find(u => u.role === targetRole) || INITIAL_USERS[0]
    setCurrentUser(user)
    return user
  }

  // Regular login with API support + local fallback
  const login = async (email, password) => {
    // Try live Laravel API first
    try {
      const apiRes = await crmApi.login(email, password)
      if (apiRes?.user) {
        const fullUser = {
          ...apiRes.user,
          initials: apiRes.user.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        }
        setCurrentUser(fullUser)
        return { success: true, user: fullUser }
      }
    } catch {
      // Fallback to local user matching
    }

    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (matched) {
      setCurrentUser(matched)
      return { success: true, user: matched }
    }

    // Role inference fallback
    const isClient = email.toLowerCase().includes('client') || email.toLowerCase().includes('marocraft')
    const isRep = email.toLowerCase().includes('rep') || email.toLowerCase().includes('commercial')
    const isManager = email.toLowerCase().includes('manager')

    let fallbackUser = INITIAL_USERS[0]
    if (isClient) fallbackUser = INITIAL_USERS[4]
    else if (isRep) fallbackUser = INITIAL_USERS[2]
    else if (isManager) fallbackUser = INITIAL_USERS[1]

    const customUser = {
      ...fallbackUser,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }
    setCurrentUser(customUser)
    return { success: true, user: customUser }
  }

  // Switch Role inside CRM (Admin ⇄ Manager ⇄ Rep ⇄ Client)
  const switchRole = (newRole) => {
    const user = INITIAL_USERS.find(u => u.role === newRole)
    if (user) {
      setCurrentUser(user)
    }
  }

  const logout = () => {
    crmApi.logout().catch(() => {})
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role,
        login,
        quickDemoLogin,
        switchRole,
        logout,
        users: INITIAL_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
