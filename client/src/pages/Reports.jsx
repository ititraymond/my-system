import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

export default function Reports() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [loginData, setLoginData] = useState([])
  const [emailData, setEmailData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const authHeader = 'B' + 'earer ' + token
    Promise.all([
      fetch(`${API}/reports/login-duration`, { headers: { Authorization: authHeader } }).then(r => r.json()),
      fetch(`${API}/email/history`, { headers: { Authorization: authHeader } }).then(r => r.json()),
    ]).then(([login, email]) => {
      setLoginData(login)
      setEmailData(email)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 報表</h1>
        <button onClick={() => navigate('/dashboard')} className="logout-btn">← 返回</button>
      </header>
      <main className="dashboard-main" style={{maxWidth: 900, margin: '0 auto'}}>
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          <button onClick={() => setTab('login')} className="logout-btn" style={tab==='login'?{background:'rgba(108,60,224,0.2)',borderColor:'#6c3ce0',color:'#a855f7'}:{}}>
            🔐 登入時長
          </button>
          <button onClick={() => setTab('email')} className="logout-btn" style={tab==='email'?{background:'rgba(108,60,224,0.2)',borderColor:'#6c3ce0',color:'#a855f7'}:{}}>
            📧 電郵記錄
          </button>
        </div>

        {loading ? <p style={{color:'#888',textAlign:'center'}}>載入中...</p> :
         tab === 'login' ? (
          loginData.length === 0 ? <p style={{color:'#888',textAlign:'center'}}>暫無登入數據</p> : (
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead><tr>
                  <th>日期</th><th>用戶</th><th>登入次數</th><th>平均時長 (分鐘)</th><th>總時長 (分鐘)</th>
                </tr></thead>
                <tbody>
                  {loginData.map((row, i) => (
                    <tr key={i}><td>{row.date}</td><td>{row.username}</td><td>{row.sessions}</td><td>{row.avg_minutes}</td><td>{row.total_minutes}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          emailData.length === 0 ? <p style={{color:'#888',textAlign:'center'}}>暫無電郵記錄</p> : (
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead><tr>
                  <th>時間</th><th>發送者</th><th>收件人</th><th>主旨</th><th>Message ID</th>
                </tr></thead>
                <tbody>
                  {emailData.map((row, i) => (
                    <tr key={i}><td>{new Date(row.sent_at).toLocaleString('zh-HK')}</td><td>{row.username}</td><td>{row.to}</td><td>{row.subject}</td><td style={{fontSize:'0.75rem',color:'#666'}}>{row.message_id?.slice(0,20)}...</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  )
}
