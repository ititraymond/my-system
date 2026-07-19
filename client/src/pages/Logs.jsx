import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

const ACTION_ICONS = {
  login: '🔑', login_failed: '❌', register: '📝',
  change_password: '🔒', logout: '🚪',
}

export default function Logs() {
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API}/logs`, { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => { setLogs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📋 活動記錄</h1>
        <button onClick={() => navigate('/dashboard')} className="logout-btn">← 返回</button>
      </header>
      <main className="dashboard-main" style={{maxWidth: 800, margin: '0 auto'}}>
        {loading ? (
          <p style={{color:'#888',textAlign:'center'}}>載入中...</p>
        ) : logs.length === 0 ? (
          <p style={{color:'#888',textAlign:'center'}}>暫無記錄</p>
        ) : (
          <div className="log-list">
            {logs.map(log => (
              <div key={log.id} className="log-item">
                <span className="log-icon">{ACTION_ICONS[log.action] || '📌'}</span>
                <div className="log-body">
                  <span className="log-details">{log.details}</span>
                  <span className="log-time">
                    {new Date(log.created_at).toLocaleString('zh-HK')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
