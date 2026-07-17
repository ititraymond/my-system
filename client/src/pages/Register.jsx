import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(username, email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1>📝 註冊</h1>
        {error && <div className="error">{error}</div>}
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">註冊</button>
        <p className="switch">已有帳戶？<Link to="/login">登入</Link></p>
      </form>
    </div>
  )
}
