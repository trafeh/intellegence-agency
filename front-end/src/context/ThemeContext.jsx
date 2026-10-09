import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Explicitly default to 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('intelligence_theme')
    return saved === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('intelligence_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Allow setting directly to light or dark
  const setLightMode = () => setTheme('light')
  const setDarkMode = () => setTheme('dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLightMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
