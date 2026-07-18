import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirm) return setError('密碼不一致')
    if (newPassword.length < 6) return setError('密碼至少6個字元')
    try {
      const data = await api.changePassword({ newPassword })
      localStorage.removeItem('tempToken')
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1>🔒 首次登入</h1>
        <p style={{color:'#888',textAlign:'center'}}>請設定新密碼</p>
        {error && <div className="error">{error}</div>}
        <input placeholder="新密碼" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <input placeholder="確認新密碼" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        <button type="submit">設定密碼</button>
      </form>
    </div>
  )
}
