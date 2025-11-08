// Netlify Serverless Function untuk Visitor Log API
// Alternative jika tidak menggunakan separate server
// Note: Netlify functions use /tmp for file storage (ephemeral)

const fs = require('fs')
const path = require('path')

// Use /tmp for Netlify functions (ephemeral storage)
// For persistent storage, consider using Netlify's KV store or external database
const LOG_FILE = path.join('/tmp', 'visitor_logs.json')
const MAX_LOGS = 10000

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

const writeLogs = (logs) => {
  try {
    const limitedLogs = logs.slice(0, MAX_LOGS)
    fs.writeFileSync(LOG_FILE, JSON.stringify(limitedLogs, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing logs:', error)
    return false
  }
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    // POST /api/log-visitor
    if (event.httpMethod === 'POST' && event.path.includes('/log-visitor')) {
      const visitorInfo = JSON.parse(event.body)

      if (!visitorInfo || !visitorInfo.timestamp) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid visitor data' }),
        }
      }

      const existingLogs = readLogs()
      const newLogs = [visitorInfo, ...existingLogs]
      writeLogs(newLogs)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Log saved successfully' }),
      }
    }

    // GET /api/visitor-logs
    if (event.httpMethod === 'GET' && event.path.includes('/visitor-logs')) {
      const logs = readLogs()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(logs),
      }
    }

    // DELETE /api/visitor-logs
    if (event.httpMethod === 'DELETE' && event.path.includes('/visitor-logs')) {
      writeLogs([])
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'All logs cleared' }),
      }
    }

    // GET /api/visitor-stats
    if (event.httpMethod === 'GET' && event.path.includes('/visitor-stats')) {
      const logs = readLogs()

      if (logs.length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            total: 0,
            uniquePages: 0,
            uniqueReferrers: 0,
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
          }),
        }
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          total: logs.length,
          uniquePages,
          uniqueReferrers,
          today: todayCount,
          thisWeek: weekCount,
          thisMonth: monthCount,
        }),
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

