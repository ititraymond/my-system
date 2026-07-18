const API = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

async function request(path, options = {}) {
  // Use tempToken for change-password, regular token otherwise
  const token = localStorage.getItem('tempToken') || localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  changePassword: (body) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
}
