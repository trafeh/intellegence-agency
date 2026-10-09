import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_USERS } from '../crm/data/crmMockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('intelligence_sales_user')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    // Default to Director so user gets full experience out of the box or starts logged out
    return null
  })

  const isAuthenticated = Boolean(currentUser)
  const role = currentUser?.role || 'director'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('intelligence_sales_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('intelligence_sales_user')
    }
  }, [currentUser])

  // Quick Demo Login
  const quickDemoLogin = (targetRole = 'director') => {
    const user = INITIAL_USERS.find(u => u.role === targetRole) || INITIAL_USERS[0]
    setCurrentUser(user)
    return user
  }

  // Regular login
  const login = (email, password) => {
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (matched) {
      setCurrentUser(matched)
      return { success: true, user: matched }
    }
    // If not matched by exact email, allow any demo password and assign by role inference
    const isDir = email.toLowerCase().includes('admin') || email.toLowerCase().includes('director') || email.toLowerCase().includes('manager')
    const fallbackUser = isDir ? INITIAL_USERS[0] : INITIAL_USERS[1]
    const customUser = {
      ...fallbackUser,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }
    setCurrentUser(customUser)
    return { success: true, user: customUser }
  }

  // Switch Role inside CRM (Director ⇄ Rep)
  const switchRole = (newRole) => {
    if (newRole === role) return
    const user = INITIAL_USERS.find(u => u.role === newRole)
    if (user) {
      setCurrentUser(user)
    }
  }

  const logout = () => {
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
