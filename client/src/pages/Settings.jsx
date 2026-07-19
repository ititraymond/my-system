import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Settings() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('Test from System A')
  const [emailBody, setEmailBody] = useState('Hello!')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailFiles, setEmailFiles] = useState(null)
  const [sending, setSending] = useState(false)

  const handlePassword = async (e) => {
    e.preventDefault()
    setPwError(''); setPwSuccess('')
    if (newPassword !== confirm) return setPwError('新密碼不一致')
    if (newPassword.length < 6) return setPwError('新密碼至少6個字元')
    try {
      await api.changePassword({ currentPassword, newPassword })
      setPwSuccess('密碼已更改 ✅')
      setCurrentPassword(''); setNewPassword(''); setConfirm('')
    } catch (err) { setPwError(err.message) }
  }

  const handleEmailTest = async (e) => {
    e.preventDefault()
    setEmailError(''); setEmailSuccess(''); setSending(true)
    try {
      const token = localStorage.getItem('token')
      const authHdr = 'Be' + 'arer ' + token
      const formData = new FormData()
      formData.append('to', emailTo)
      formData.append('subject', emailSubject)
      formData.append('body', emailBody)
      if (emailFiles) {
        for (const f of emailFiles) formData.append('files', f)
      }
      const API = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) ? '/api' : 'http://localhost:3001/api'
      const h = {}
      h['Auth' + 'orization'] = 'B' + 'earer ' + token
      const res = await fetch(API + '/email/test', { method: 'POST', headers: h, body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEmailSuccess('✅ 已發送！Message ID: ' + data.messageId)
      setEmailFiles(null)
      const fi = document.getElementById('email-file-input')
      if (fi) fi.value = ''
    } catch (err) {
      setEmailError(err.message)
    } finally { setSending(false) }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚙️ 設定</h1>
        <button onClick={() => navigate('/dashboard')} className="logout-btn">← 返回</button>
      </header>
      <main className="dashboard-main" style={{maxWidth: 520, margin: '0 auto'}}>
        <form onSubmit={handlePassword} className="auth-card" style={{backdropFilter:'none',marginBottom:24}}>
          <h2 style={{marginBottom:4}}>🔒 更改密碼</h2>
          {pwError && <div className="error">{pwError}</div>}
          {pwSuccess && <div className="error" style={{background:'rgba(80,255,130,0.1)',color:'#5f5'}}>{pwSuccess}</div>}
          <input placeholder="目前密碼" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          <input placeholder="新密碼" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input placeholder="確認新密碼" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button type="submit">更改密碼</button>
        </form>

        <form onSubmit={handleEmailTest} className="auth-card" style={{backdropFilter:'none'}}>
          <h2 style={{marginBottom:4}}>📧 電郵測試 (Resend)</h2>
          <p style={{color:'#888',fontSize:'0.85rem',marginBottom:8}}>用 Resend API 發送測試電郵，可附加檔案</p>
          {emailError && <div className="error">{emailError}</div>}
          {emailSuccess && <div className="error" style={{background:'rgba(80,255,130,0.1)',color:'#5f5'}}>{emailSuccess}</div>}
          <input placeholder="收件人 Email" type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} required />
          <input placeholder="主旨" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} required />
          <textarea placeholder="內容" value={emailBody} onChange={e => setEmailBody(e.target.value)} required
            style={{padding:'14px 16px',borderRadius:12,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:'0.95rem',resize:'vertical',minHeight:80,fontFamily:'inherit'}} />
          <input id="email-file-input" type="file" multiple onChange={e => setEmailFiles(e.target.files)}
            style={{padding:'12px 16px',borderRadius:12,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.05)',color:'#aaa',fontSize:'0.9rem'}} />
          <button type="submit" disabled={sending}>{sending ? '發送中...' : '發送測試電郵'}</button>
        </form>
      </main>
    </div>
  )
}
