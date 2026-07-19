import { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.me().then(setUser).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const data = await api.login({ username, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data
  }

  const register = async (username, email, password) => {
    const data = await api.register({ username, email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    const token = localStorage.getItem('token')
    try {
      const authHeader = 'B' + 'earer ' + token
      await fetch(`${import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader }
      })
    } catch {}
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
