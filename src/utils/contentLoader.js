// Content Loader Utility
// Mengambil konten dari API server

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/**
 * Mengambil konten untuk page tertentu
 * @param {string} page - Nama page (home, portfolio, about, contact)
 * @returns {Promise<Object|null>} - Konten untuk page tersebut atau null jika error
 */
export const getPageContent = async (page) => {
  try {
    const response = await fetch(`${API_URL}/content/${page}`)
    if (response.ok) {
      return await response.json()
    }
    console.warn(`Failed to load content for ${page}, using fallback`)
    return null
  } catch (error) {
    console.warn(`Error loading content for ${page}:`, error)
    return null
  }
}

/**
 * Mengambil semua konten
 * @returns {Promise<Object|null>} - Semua konten atau null jika error
 */
export const getAllContent = async () => {
  try {
    const response = await fetch(`${API_URL}/content`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.warn('Error loading all content:', error)
    return null
  }
}

