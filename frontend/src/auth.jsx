import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiGet, setAuthToken, clearAuthToken, getAuthToken, apiPost } from './apiClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) { setLoading(false); return }
    apiGet('/auth/me').then((u) => setUser(u)).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    async login(email, password) {
      const r = await apiPost('/auth/login', { email, password })
      if (r?.token) {
        setAuthToken(r.token)
        const u = await apiGet('/auth/me').catch(() => null)
        setUser(u)
        return true
      }
      return false
    },
    async register(email, password, role = 'customer') {
      await apiPost('/auth/register', { email, password, role })
      return await this.login(email, password)
    },
    logout() {
      clearAuthToken(); setUser(null)
    }
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '2rem' }}>Loading…</div>
  if (!user) return <div style={{ padding: '2rem' }}>Please login to access this page.</div>
  return children
}


