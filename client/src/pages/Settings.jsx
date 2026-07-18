import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Settings() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword !== confirm) return setError('新密碼不一致')
    if (newPassword.length < 6) return setError('新密碼至少6個字元')
    try {
      await api.changePassword({ currentPassword, newPassword })
      setSuccess('密碼已更改 ✅')
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚙️ 設定</h1>
        <button onClick={() => navigate('/dashboard')} className="logout-btn">← 返回</button>
      </header>
      <main className="dashboard-main" style={{maxWidth: 480, margin: '0 auto'}}>
        <form onSubmit={handleSubmit} className="auth-card" style={{backdropFilter:'none'}}>
          <h2 style={{marginBottom:4}}>🔒 更改密碼</h2>
          {error && <div className="error">{error}</div>}
          {success && <div className="error" style={{background:'rgba(80,255,130,0.1)',color:'#5f5'}}>{success}</div>}
          <input placeholder="目前密碼" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          <input placeholder="新密碼" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input placeholder="確認新密碼" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button type="submit">更改密碼</button>
        </form>
      </main>
    </div>
  )
}
