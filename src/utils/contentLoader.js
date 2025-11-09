// Content Loader Utility
// Mengambil konten dari API server

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
// Config: Set to 'true' to use API, 'false' to use static/default data only
const USE_API = import.meta.env.VITE_USE_API !== 'false' // Default: true (use API)

// Default content data (fallback when API is unavailable)
const getDefaultContent = () => {
  return {
    home: {
      title: 'Best showcase for architecture',
      description: 'PT. DaLa Bangun Nusa, an experienced architecture and construction company since 2015, formerly an individual contractor by I Wayan Selamet, S.T. since 1991. We specialize in designing and building temples, villas, pool bars, and restaurants. Let us bring your vision to life with expert craftsmanship and lasting results.',
      tagline: 'Inspired by Bali, Designed for the Sacred.',
      portfolioButtonText: 'View More Our Portfolio',
      portfolioDescription: 'Explore our collection of projects, where design and craftsmanship create lasting impact.',
      clientsTitle: 'Our Clients',
      clientsDescription: 'We are proud to have collaborated with leading businesses, delivering architectural solutions that exceed expectations and create lasting value.'
    },
    portfolio: {
      title: 'Our Portfolio',
      description: 'Explore our collection of projects, where design and craftsmanship create lasting impact.'
    },
    about: {
      principalTitle: 'About Principal',
      principalName: 'I Wayan Selamet, S.T.',
      principalImage: '/images/principal.jpg',
      principalDescription: 'I Wayan Selamet, S.T. founded DaLa Bangun Nusa in 2015. Previously active as an individual contractor since 1991, he took a career in architecture to help people find their perfect living environments. DaLa Bangun Nusa, based in Bali, now employs around 50+ professionals and has completed projects in Bali, Jakarta, Semarang, Surabaya, Yogyakarta, and Banten. DaLa Bangun Nusa is known for blending traditional Balinese aesthetics with modern functionality.',
      principalFacebook: 'https://www.facebook.com/dalastore',
      principalInstagram: 'https://www.instagram.com/iwayanselamet/',
      organizationTitle: 'Company Organization',
      organizationDescription: 'Below is the organizational structure of our company, outlining the key roles and responsibilities within our team. This structure is designed to ensure efficient communication, collaboration, and growth across all departments.',
      organizationImage: '/images/ComproOrganiztion.png',
      philosophyTitle: 'Our Philosophy',
      philosophySubtitle: 'Spatial and Sacred Planning',
      philosophyDescription: 'Balinese architecture is guided by a cosmological order, where the design and orientation of buildings are considered sacred. An Undagi must understand how the layout of a space aligns with the universe and the divine world. For instance: The north is considered sacred, associated with the gods, and many important temples or shrines are oriented towards the north. Buildings should respect the cardinal directions and natural forces, ensuring that the site is in harmony with the surrounding environment, including the wind, water, and sun.',
      philosophyImage: '/images/philosophy.jpg'
    },
    contact: {
      title: 'Contact Information',
      address: 'Jl. Raya Bilukan No.95, Sebatu, Kec. Tegallalang, Kabupaten Gianyar, Bali 80561',
      phone: '+62 8133 8506 799',
      email: 'dalabangunnusa@gmail.com',
      facebook: 'https://www.facebook.com/profile.php?id=61568370484842',
      instagram: 'https://www.instagram.com/dalabangunnusa/',
      mapUrl: 'https://www.google.com/maps?q=Jl.+Raya+Bilukan+No.95,+Sebatu,+Kec.+Tegallalang,+Kabupaten+Gianyar,+Bali+80561&output=embed'
    }
  }
}

/**
 * Mengambil konten untuk page tertentu
 * @param {string} page - Nama page (home, portfolio, about, contact)
 * @returns {Promise<Object|null>} - Konten untuk page tersebut atau null jika error
 */
export const getPageContent = async (page) => {
  // If USE_API is false, directly return default data without fetching
  if (!USE_API) {
    console.log('Using static content data (API disabled)')
    const defaultContent = getDefaultContent()
    return defaultContent[page] || null
  }

  try {
    // Try to fetch from API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/content/${page}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return await response.json()
    } else {
      // API returned error, use default data
      console.warn(`API returned error for ${page}, using default content`)
      const defaultContent = getDefaultContent()
      return defaultContent[page] || null
    }
  } catch (error) {
    // Network error, timeout, or API unavailable - use default data
    console.warn(`API unavailable for ${page}, using default content:`, error.message)
    const defaultContent = getDefaultContent()
    return defaultContent[page] || null
  }
}

/**
 * Mengambil semua konten
 * @returns {Promise<Object|null>} - Semua konten atau null jika error
 */
export const getAllContent = async () => {
  // If USE_API is false, directly return default data without fetching
  if (!USE_API) {
    console.log('Using static content data (API disabled)')
    return getDefaultContent()
  }

  try {
    // Try to fetch from API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/content`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return await response.json()
    } else {
      // API returned error, use default data
      console.warn('API returned error, using default content')
      return getDefaultContent()
    }
  } catch (error) {
    // Network error, timeout, or API unavailable - use default data
    console.warn('API unavailable, using default content:', error.message)
    return getDefaultContent()
  }
}

