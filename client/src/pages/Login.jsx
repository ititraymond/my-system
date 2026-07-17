import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
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
