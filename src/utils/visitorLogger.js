// Visitor Logger Utility
// Menyimpan log pengunjung ke server (centralized storage)
// Semua device menyimpan ke server yang sama, sehingga log terpusat

const STORAGE_KEY = 'visitor_logs' // Hanya untuk backward compatibility, tidak digunakan lagi
const MAX_LOGS = 1000 // Maksimal 1000 log entries (dikelola di server)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/**
 * Mendapatkan lokasi secara pasif (hanya jika sudah diizinkan)
 * TIDAK akan meminta permission ke user - benar-benar optional
 */
const getLocationPassive = async () => {
  // Cek apakah geolocation tersedia
  if (!navigator.geolocation) {
    return null
  }

  // Cek permission status menggunakan Permissions API jika tersedia
  // Ini untuk memastikan kita tidak meminta permission
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })
      // Hanya ambil lokasi jika permission sudah granted
      // Skip jika prompt atau denied (untuk menghindari permission popup)
      if (permissionStatus.state !== 'granted') {
        return null
      }
    } else {
      // Permissions API tidak tersedia - skip untuk menghindari permission popup
      // Lebih aman untuk tidak meminta permission sama sekali
      return null
    }
  } catch (error) {
    // Permissions API error atau tidak tersedia - skip untuk menghindari permission popup
    return null
  }

  // Hanya jika permission sudah granted, ambil lokasi dengan timeout sangat singkat
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null) // Timeout - skip lokasi
    }, 500) // Timeout sangat singkat (500ms) untuk tidak blocking

    try {
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
          timeout: 500, // Timeout sangat singkat
          maximumAge: 300000, // Gunakan cache lama (5 menit) untuk menghindari request baru
        }
      )
    } catch (error) {
      // Error saat memanggil geolocation - skip
      clearTimeout(timeout)
      resolve(null)
    }
  })
}

/**
 * Mendapatkan informasi pengunjung
 * Semua permission request adalah optional - tidak akan blocking
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

  // Coba ambil lokasi secara pasif (hanya jika sudah diizinkan sebelumnya)
  // Gunakan Promise.race untuk memastikan tidak blocking terlalu lama
  try {
    const location = await Promise.race([
      getLocationPassive(),
      new Promise((resolve) => setTimeout(() => resolve(null), 500)) // Max 500ms wait
    ])
    if (location) {
      baseInfo.location = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: Math.round(location.accuracy), // dalam meter
      }
      // Format koordinat untuk display
      baseInfo.locationFormatted = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
    }
  } catch (error) {
    // Error saat mengambil lokasi - skip, tidak apa-apa
    // Lokasi adalah optional, website tetap berfungsi normal
  }

  return baseInfo
}

/**
 * Menyimpan log pengunjung ke server (centralized storage)
 * Fire-and-forget: tidak blocking, semua permission optional
 * Hanya menyimpan ke server, tidak ke localStorage (untuk centralized logging)
 */
export const logVisitor = async (page = 'Unknown') => {
  // Fire-and-forget: tidak await, tidak blocking
  // Semua permission request adalah optional
  (async () => {
    try {
      const visitorInfo = await getVisitorInfo()
      visitorInfo.page = page

      // Kirim ke server (centralized storage) - tidak blocking
      // Hanya simpan ke server, tidak ke localStorage
      // Semua device akan menyimpan ke server yang sama, sehingga log terpusat
      fetch(`${API_URL}/log-visitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorInfo),
      }).catch(() => {
        // Error tidak apa-apa, tidak blocking website
        // Visitor logging adalah optional feature
      })
    } catch (error) {
      // Error logging - tidak apa-apa, tidak blocking website
      // Visitor logging adalah optional feature
    }
  })()
}

/**
 * Mendapatkan semua log pengunjung dari server (centralized)
 * Hanya mengambil dari server, tidak dari localStorage
 * Semua device akan melihat log yang sama dari server
 */
export const getVisitorLogs = async () => {
  try {
    // Ambil dari server (centralized storage)
    const response = await fetch(`${API_URL}/visitor-logs`)
    if (response.ok) {
      const logs = await response.json()
      return logs
    }
    // Jika response tidak OK, return empty array
    return []
  } catch (error) {
    // Jika server tidak tersedia, return empty array
    // Tidak fallback ke localStorage karena kita ingin centralized logging
    console.warn('Server not available, returning empty logs:', error)
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
 * Menghapus semua log dari server (centralized)
 * Hanya menghapus dari server, tidak dari localStorage
 */
export const clearVisitorLogs = async () => {
  try {
    // Hapus dari server (centralized storage)
    const response = await fetch(`${API_URL}/visitor-logs`, {
      method: 'DELETE',
    })
    if (response.ok) {
      return true
    }
    console.warn('Failed to clear logs from server')
    return false
  } catch (error) {
    console.error('Error clearing visitor logs:', error)
    return false
  }
}

/**
 * Mendapatkan statistik pengunjung dari server (centralized)
 * Hanya mengambil dari server, tidak dari localStorage
 * Semua device akan melihat statistik yang sama dari server
 */
export const getVisitorStats = async () => {
  try {
    // Ambil dari server (centralized storage)
    const response = await fetch(`${API_URL}/visitor-stats`)
    if (response.ok) {
      return await response.json()
    }
    // Jika response tidak OK, return default stats
    return {
      total: 0,
      uniquePages: 0,
      uniqueReferrers: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    }
  } catch (error) {
    // Jika server tidak tersedia, return default stats
    // Tidak fallback ke localStorage karena kita ingin centralized logging
    console.warn('Server not available, returning default stats:', error)
    return {
      total: 0,
      uniquePages: 0,
      uniqueReferrers: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    }
  }
}

