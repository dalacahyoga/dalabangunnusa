// Simple Express server untuk menyimpan visitor logs ke file
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const LOG_FILE = path.join(__dirname, 'visitor_logs.json')
const MAX_LOGS = 10000 // Maksimal 10000 log entries

// Middleware
app.use(cors())
app.use(express.json())

// Fungsi untuk membaca log dari file
const readLogs = () => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading logs:', error)
    return []
  }
}

// Fungsi untuk menulis log ke file
const writeLogs = (logs) => {
  try {
    // Batasi jumlah log
    const limitedLogs = logs.slice(0, MAX_LOGS)
    fs.writeFileSync(LOG_FILE, JSON.stringify(limitedLogs, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing logs:', error)
    return false
  }
}

// Endpoint untuk menyimpan log
app.post('/api/log-visitor', (req, res) => {
  try {
    const visitorInfo = req.body
    
    // Validasi data
    if (!visitorInfo || !visitorInfo.timestamp) {
      return res.status(400).json({ error: 'Invalid visitor data' })
    }

    // Baca log yang sudah ada
    const existingLogs = readLogs()

    // Tambahkan log baru di awal array
    const newLogs = [visitorInfo, ...existingLogs]

    // Tulis ke file
    writeLogs(newLogs)

    res.json({ success: true, message: 'Log saved successfully' })
  } catch (error) {
    console.error('Error saving log:', error)
    res.status(500).json({ error: 'Failed to save log' })
  }
})

// Endpoint untuk mendapatkan semua log
app.get('/api/visitor-logs', (req, res) => {
  try {
    const logs = readLogs()
    res.json(logs)
  } catch (error) {
    console.error('Error reading logs:', error)
    res.status(500).json({ error: 'Failed to read logs' })
  }
})

// Endpoint untuk menghapus semua log
app.delete('/api/visitor-logs', (req, res) => {
  try {
    writeLogs([])
    res.json({ success: true, message: 'All logs cleared' })
  } catch (error) {
    console.error('Error clearing logs:', error)
    res.status(500).json({ error: 'Failed to clear logs' })
  }
})

// Endpoint untuk mendapatkan statistik
app.get('/api/visitor-stats', (req, res) => {
  try {
    const logs = readLogs()
    
    if (logs.length === 0) {
      return res.json({
        total: 0,
        uniquePages: 0,
        uniqueReferrers: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      })
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const uniquePages = new Set(logs.map((log) => log.path)).size
    const uniqueReferrers = new Set(logs.map((log) => log.referrer)).size

    const todayCount = logs.filter((log) => {
      const logDate = new Date(log.timestamp)
      return logDate >= today
    }).length

    const weekCount = logs.filter((log) => {
      const logDate = new Date(log.timestamp)
      return logDate >= thisWeek
    }).length

    const monthCount = logs.filter((log) => {
      const logDate = new Date(log.timestamp)
      return logDate >= thisMonth
    }).length

    res.json({
      total: logs.length,
      uniquePages,
      uniqueReferrers,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Visitor Log API server running on http://localhost:${PORT}`)
  console.log(`Log file: ${LOG_FILE}`)
})

