// Visitor Logger Utility
// Menyimpan log pengunjung ke localStorage

const STORAGE_KEY = 'visitor_logs'
const MAX_LOGS = 1000 // Maksimal 1000 log entries
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/**
 * Mendapatkan lokasi secara pasif (hanya jika sudah diizinkan)
 * TIDAK akan meminta permission ke user
 */
const getLocationPassive = async () => {
  // Cek apakah geolocation tersedia
  if (!navigator.geolocation) {
    return null
  }

  // Cek permission status menggunakan Permissions API jika tersedia
  // Ini untuk memastikan kita tidak meminta permission
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })
      // Jika permission belum granted atau prompt, skip (jangan ambil lokasi)
      if (permissionStatus.state !== 'granted') {
        return null
      }
    } catch (error) {
      // Permissions API tidak tersedia atau error - lanjutkan dengan cara lain
    }
  }

  // Jika permission sudah granted, ambil lokasi
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null)
    }, 1000) // Timeout 1 detik

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout)
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      () => {
        // Error atau permission denied - tidak apa-apa, skip saja
        clearTimeout(timeout)
        resolve(null)
      },
      {
        enableHighAccuracy: false,
        timeout: 1000,
        maximumAge: 60000, // Gunakan cache jika ada (1 menit)
      }
    )
  })
}

/**
 * Mendapatkan informasi pengunjung
 */
const getVisitorInfo = async () => {
  const baseInfo = {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer || 'Direct',
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
  }

  // Coba ambil lokasi secara pasif (hanya jika sudah diizinkan)
  const location = await getLocationPassive()
  if (location) {
    baseInfo.location = {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: Math.round(location.accuracy), // dalam meter
    }
    // Format koordinat untuk display
    baseInfo.locationFormatted = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
  }

  return baseInfo
}

/**
 * Menyimpan log pengunjung ke server (file) dan localStorage (backup)
 */
export const logVisitor = async (page = 'Unknown') => {
  try {
    const visitorInfo = await getVisitorInfo()
    visitorInfo.page = page

    // Kirim ke server (file storage)
    try {
      const response = await fetch(`${API_URL}/log-visitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorInfo),
      })
      
      if (!response.ok) {
        console.warn('Failed to save log to server, using localStorage only')
      }
    } catch (error) {
      // Jika server tidak tersedia, tetap simpan ke localStorage
      console.warn('Server not available, saving to localStorage only:', error)
    }

    // Simpan juga ke localStorage sebagai backup
    const existingLogs = getVisitorLogsSync()
    const newLogs = [visitorInfo, ...existingLogs]
    const limitedLogs = newLogs.slice(0, MAX_LOGS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedLogs))
  } catch (error) {
    console.error('Error logging visitor:', error)
  }
}

/**
 * Mendapatkan semua log pengunjung (dari server, fallback ke localStorage)
 */
export const getVisitorLogs = async () => {
  try {
    // Coba ambil dari server dulu
    const response = await fetch(`${API_URL}/visitor-logs`)
    if (response.ok) {
      const logs = await response.json()
      return logs
    }
  } catch (error) {
    // Jika server tidak tersedia, ambil dari localStorage
    console.warn('Server not available, using localStorage:', error)
  }

  // Fallback ke localStorage
  try {
    const logs = localStorage.getItem(STORAGE_KEY)
    return logs ? JSON.parse(logs) : []
  } catch (error) {
    console.error('Error getting visitor logs:', error)
    return []
  }
}

/**
 * Mendapatkan semua log pengunjung (synchronous - dari localStorage saja)
 * Untuk backward compatibility
 */
export const getVisitorLogsSync = () => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY)
    return logs ? JSON.parse(logs) : []
  } catch (error) {
    console.error('Error getting visitor logs:', error)
    return []
  }
}

/**
 * Menghapus semua log (dari server dan localStorage)
 */
export const clearVisitorLogs = async () => {
  try {
    // Hapus dari server
    try {
      const response = await fetch(`${API_URL}/visitor-logs`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        console.warn('Failed to clear logs from server')
      }
    } catch (error) {
      console.warn('Server not available:', error)
    }

    // Hapus dari localStorage
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing visitor logs:', error)
    return false
  }
}

/**
 * Mendapatkan statistik pengunjung (dari server, fallback ke localStorage)
 */
export const getVisitorStats = async () => {
  try {
    // Coba ambil dari server dulu
    const response = await fetch(`${API_URL}/visitor-stats`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.warn('Server not available, calculating from localStorage:', error)
  }

  // Fallback: hitung dari localStorage
  const logs = getVisitorLogsSync()
  
  if (logs.length === 0) {
    return {
      total: 0,
      uniquePages: 0,
      uniqueReferrers: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
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
    total: logs.length,
    uniquePages,
    uniqueReferrers,
    today: todayCount,
    thisWeek: weekCount,
    thisMonth: monthCount,
  }
}

