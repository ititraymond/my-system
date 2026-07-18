import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api.login({ username, password })
      if (data.must_change_password) {
        localStorage.setItem('tempToken', data.tempToken)
        navigate('/change-password')
      } else {
        localStorage.setItem('token', data.token)
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1>🔐 登入</h1>
        {error && <div className="error">{error}</div>}
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">登入</button>
        <p className="switch">未有帳戶？<Link to="/register">註冊</Link></p>
      </form>
    </div>
  )
}
