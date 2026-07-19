import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

export default function Reports() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const authHeader = 'B' + 'earer ' + token
    fetch(`${API}/reports/login-duration`, { headers: { Authorization: authHeader } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 登入時長報表</h1>
        <button onClick={() => navigate('/dashboard')} className="logout-btn">← 返回</button>
      </header>
      <main className="dashboard-main" style={{maxWidth: 900, margin: '0 auto'}}>
        {loading ? <p style={{color:'#888',textAlign:'center'}}>載入中...</p> :
         data.length === 0 ? <p style={{color:'#888',textAlign:'center'}}>暫無數據</p> : (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>用戶</th>
                  <th>登入次數</th>
                  <th>平均時長 (分鐘)</th>
                  <th>總時長 (分鐘)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.username}</td>
                    <td>{row.sessions}</td>
                    <td>{row.avg_minutes}</td>
                    <td>{row.total_minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
