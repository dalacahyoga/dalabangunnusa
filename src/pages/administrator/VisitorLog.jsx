import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVisitorLogs, clearVisitorLogs, getVisitorStats } from '../../utils/visitorLogger'
import './VisitorLog.css'

const VisitorLog = () => {
  const navigate = useNavigate()
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLogs()
    loadStats()
  }, [])

  const loadLogs = async () => {
    const allLogs = await getVisitorLogs()
    setLogs(allLogs)
  }

  const loadStats = async () => {
    const statistics = await getVisitorStats()
    setStats(statistics)
  }

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all visitor logs?')) {
      await clearVisitorLogs()
      await loadLogs()
      await loadStats()
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dcg_authenticated')
    sessionStorage.removeItem('dcg_username')
    navigate('/dcg-login', { replace: true })
  }

  const filteredLogs = logs.filter((log) => {
    // Filter by date
    if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const logDate = new Date(log.timestamp)
      logDate.setHours(0, 0, 0, 0)
      if (logDate.getTime() !== today.getTime()) return false
    } else if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const logDate = new Date(log.timestamp)
      if (logDate < weekAgo) return false
    } else if (filter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      const logDate = new Date(log.timestamp)
      if (logDate < monthAgo) return false
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        log.path.toLowerCase().includes(search) ||
        log.referrer.toLowerCase().includes(search) ||
        log.userAgent.toLowerCase().includes(search) ||
        log.date.toLowerCase().includes(search)
      )
    }

    return true
  })

  const formatUserAgent = (userAgent) => {
    // Extract browser and OS info
    let browser = 'Unknown'
    let os = 'Unknown'

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome'
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox'
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari'
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge'
    }

    if (userAgent.includes('Windows')) {
      os = 'Windows'
    } else if (userAgent.includes('Mac')) {
      os = 'macOS'
    } else if (userAgent.includes('Linux')) {
      os = 'Linux'
    } else if (userAgent.includes('Android')) {
      os = 'Android'
    } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      os = 'iOS'
    }

    return `${browser} on ${os}`
  }

  return (
    <div className="visitor-log-container">
      <div className="visitor-log-header">
        <div className="header-content">
          <div>
            <h1>Administrator</h1>
            <p className="visitor-log-subtitle">Access Log for PT. DaLa Bangun Nusa Website</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {stats && (
        <div className="visitor-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Visits</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.uniquePages}</div>
            <div className="stat-label">Unique Pages</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.uniqueReferrers}</div>
            <div className="stat-label">Referrers</div>
          </div>
        </div>
      )}

      <div className="visitor-log-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn-clear" onClick={handleClear}>
          Clear All Logs
        </button>
      </div>

      <div className="visitor-log-table-container">
        <table className="visitor-log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date & Time</th>
              <th>Page</th>
              <th>Referrer</th>
              <th>Device</th>
              <th>Screen</th>
              <th>Language</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No visitor logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{log.date}</td>
                  <td>
                    <code>{log.path}</code>
                  </td>
                  <td>
                    {log.referrer === 'Direct' ? (
                      <span className="direct">Direct</span>
                    ) : (
                      <a href={log.referrer} target="_blank" rel="noreferrer" className="referrer-link">
                        {log.referrer.length > 50 ? `${log.referrer.substring(0, 50)}...` : log.referrer}
                      </a>
                    )}
                  </td>
                  <td>{formatUserAgent(log.userAgent)}</td>
                  <td>
                    {log.viewportWidth} × {log.viewportHeight}
                  </td>
                  <td>{log.language}</td>
                  <td>
                    {log.location ? (
                      <a
                        href={`https://www.google.com/maps?q=${log.location.latitude},${log.location.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="location-link"
                        title={`Accuracy: ±${log.location.accuracy}m`}
                      >
                        {log.locationFormatted || `${log.location.latitude.toFixed(6)}, ${log.location.longitude.toFixed(6)}`}
                      </a>
                    ) : (
                      <span className="no-location">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="visitor-log-footer">
        <p>Showing {filteredLogs.length} of {logs.length} total logs</p>
      </div>
    </div>
  )
}

export default VisitorLog

