import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>👋 歡迎, {user?.username}！</h1>
        <button onClick={logout} className="logout-btn">登出</button>
      </header>
      <main className="dashboard-main">
        <div className="card-grid">
          <div className="dash-card">
            <div className="icon">📋</div>
            <h3>任務管理</h3>
            <p>即將推出</p>
          </div>
          <div className="dash-card">
            <div className="icon">📊</div>
            <h3>統計報表</h3>
            <p>即將推出</p>
          </div>
          <div className="dash-card">
            <div className="icon">📝</div>
            <h3>筆記</h3>
            <p>即將推出</p>
          </div>
          <div className="dash-card clickable" onClick={() => navigate('/settings')}>
            <div className="icon">⚙️</div>
            <h3>設定</h3>
            <p>帳戶管理</p>
          </div>
        </div>
      </main>
    </div>
  )
}
