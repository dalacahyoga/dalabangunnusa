// Portfolio Loader Utility
// Load portfolio data from API with fallback to default data

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
// Config: Set to 'true' to use API, 'false' to use static/default data only
const USE_API = import.meta.env.VITE_USE_API !== 'false' // Default: true (use API)

// Default portfolio data (fallback when API is unavailable)
export const getDefaultPortfolios = () => {
  return [
    {
      id: 1,
      title: 'ABIANTAKSU VILLA',
      location: 'Gianyar, Bali',
      year: '2017',
      thumbnail: '/images/portfolio/thumbnail/1.abiantaksu.jpg',
      slug: 'abiantaksu',
      description: 'This villa is located in a prime area of Bali, offering modern comfort with stunning views of nature. Designed with elegant touches, it features luxurious amenities, a private swimming pool, and spacious open areas. The perfect retreat for relaxation and an exclusive getaway.',
      images: [
        '/images/portfolio/1.villaabiantaksu/1.jpeg',
        '/images/portfolio/1.villaabiantaksu/2.jpeg',
        '/images/portfolio/1.villaabiantaksu/3.jpeg',
        '/images/portfolio/1.villaabiantaksu/4.jpeg',
        '/images/portfolio/1.villaabiantaksu/5.jpeg',
        '/images/portfolio/1.villaabiantaksu/6.jpeg',
        '/images/portfolio/1.villaabiantaksu/7.jpeg',
        '/images/portfolio/1.villaabiantaksu/8.jpeg',
        '/images/portfolio/1.villaabiantaksu/9.jpeg',
        '/images/portfolio/1.villaabiantaksu/10.jpeg'
      ],
      order: 1
    },
    {
      id: 2,
      title: 'ABIANSILA',
      location: 'Gianyar, Bali',
      year: '2018',
      thumbnail: '/images/portfolio/thumbnail/2.abiansilla.jpg',
      slug: 'abiansilla',
      description: 'We specialize in designing and building one-of-a-kind adventure-themed spaces combined with stylish pool bars. Our projects create exciting, immersive environments where guests can enjoy both thrilling activities and relaxing moments by the pool. With a focus on high-quality materials and innovative design, we deliver dynamic, functional spaces that enhance both adventure and leisure.',
      images: [
        '/images/portfolio/2.abiansilla/1.jpeg',
        '/images/portfolio/2.abiansilla/2.jpeg',
        '/images/portfolio/2.abiansilla/3.jpeg',
        '/images/portfolio/2.abiansilla/4.jpeg',
        '/images/portfolio/2.abiansilla/5.jpeg'
      ],
      order: 2
    },
    {
      id: 3,
      title: 'CRETYA UBUD BALI',
      location: 'Gianyar, Bali',
      year: '2018',
      thumbnail: '/images/portfolio/thumbnail/3.cretya.jpeg',
      slug: 'cretyaubud',
      description: 'A beautiful resort that combines traditional Balinese architecture with modern luxury. Located in the heart of Ubud, this property offers guests an immersive experience in nature and culture, featuring stunning rice field views, premium amenities, and spaces designed for ultimate relaxation.',
      images: [
        '/images/portfolio/3.cretya/1.jpeg',
        '/images/portfolio/3.cretya/2.jpeg',
        '/images/portfolio/3.cretya/3.jpeg',
        '/images/portfolio/3.cretya/4.jpeg',
        '/images/portfolio/3.cretya/5.jpeg',
        '/images/portfolio/3.cretya/6.jpeg',
        '/images/portfolio/3.cretya/7.jpeg'
      ],
      order: 3
    },
    {
      id: 4,
      title: 'KINI SEBATU VILLA',
      location: 'Gianyar, Bali',
      year: '2023',
      thumbnail: '/images/portfolio/thumbnail/5.kinivilla.jpg',
      slug: 'kinisebatu',
      description: 'A luxurious villa designed with contemporary Balinese architecture, featuring spacious living areas, modern amenities, and breathtaking natural surroundings.',
      images: [
        '/images/portfolio/5.kinivilla/1.jpg',
        '/images/portfolio/5.kinivilla/2.jpg',
        '/images/portfolio/5.kinivilla/3.jpg',
        '/images/portfolio/5.kinivilla/4.jpg',
        '/images/portfolio/5.kinivilla/5.jpg'
      ],
      order: 4
    },
    {
      id: 5,
      title: 'HOSTEL FILOW IN UBUD',
      location: 'Gianyar, Bali',
      year: '2015',
      thumbnail: '/images/portfolio/thumbnail/4.fillowubud.jpg',
      slug: 'filowubud',
      description: 'A modern hostel designed for travelers seeking comfort and community, featuring shared spaces, private rooms, and a vibrant atmosphere.',
      images: [
        '/images/portfolio/4.filowubud/1.jpeg',
        '/images/portfolio/4.filowubud/2.jpeg',
        '/images/portfolio/4.filowubud/3.jpeg',
        '/images/portfolio/4.filowubud/4.jpeg',
        '/images/portfolio/4.filowubud/5.jpeg'
      ],
      order: 5
    },
    {
      id: 6,
      title: 'KUBER DAY CLUB',
      location: 'Gianyar, Bali',
      year: '2024',
      thumbnail: '/images/portfolio/thumbnail/6.kuberdayclub.jpg',
      slug: 'kuberdayclub',
      description: 'An exclusive day club featuring stunning pool areas, premium dining, and entertainment facilities designed for the ultimate day experience.',
      images: [
        '/images/portfolio/6.kuberdayclub/1.PNG',
        '/images/portfolio/6.kuberdayclub/2.PNG',
        '/images/portfolio/6.kuberdayclub/3.PNG',
        '/images/portfolio/6.kuberdayclub/4.PNG',
        '/images/portfolio/6.kuberdayclub/5.PNG',
        '/images/portfolio/6.kuberdayclub/6.PNG',
        '/images/portfolio/6.kuberdayclub/7.PNG',
        '/images/portfolio/6.kuberdayclub/8.PNG'
      ],
      order: 6
    },
    {
      id: 7,
      title: 'SAM POO KONG',
      location: 'Semarang, Central Java',
      year: '2003',
      thumbnail: '/images/portfolio/thumbnail/7.sampookong.jpg',
      slug: 'sampookong',
      description: 'A magnificent temple complex designed with traditional Chinese architecture, featuring intricate details, spacious courtyards, and sacred spaces for worship and cultural activities.',
      images: [
        '/images/portfolio/7.sampookong/1.jpg',
        '/images/portfolio/7.sampookong/2.jpg',
        '/images/portfolio/7.sampookong/3.jpg',
        '/images/portfolio/7.sampookong/4.jpg',
        '/images/portfolio/7.sampookong/5.jpg',
        '/images/portfolio/7.sampookong/6.jpg',
        '/images/portfolio/7.sampookong/7.jpg',
        '/images/portfolio/7.sampookong/8.jpg',
        '/images/portfolio/7.sampookong/9.jpg',
        '/images/portfolio/7.sampookong/10.JPG',
        '/images/portfolio/7.sampookong/11.jpg',
        '/images/portfolio/7.sampookong/12.jpg',
        '/images/portfolio/7.sampookong/13.jpg',
        '/images/portfolio/7.sampookong/14.JPG'
      ],
      order: 7
    }
  ]
}

/**
 * Load portfolios from API with fallback to default data
 * @returns {Promise<Array>} Array of portfolio objects
 */
export const loadPortfolios = async () => {
  // If USE_API is false, directly return default data without fetching
  if (!USE_API) {
    console.log('Using static portfolio data (API disabled)')
    return getDefaultPortfolios()
  }

  try {
    // Try to fetch from API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/portfolios`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      // Sort by order if available
      if (data.length > 0 && data[0].order !== undefined) {
        return data.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
      return data
    } else {
      // API returned error, use default data
      console.warn('API returned error, using default portfolio data')
      return getDefaultPortfolios()
    }
  } catch (error) {
    // Network error, timeout, or API unavailable - use default data
    console.warn('API unavailable, using default portfolio data:', error.message)
    return getDefaultPortfolios()
  }
}

/**
 * Format portfolio data for display (Home/Portfolio pages)
 * @param {Array} portfolios - Raw portfolio data
 * @returns {Array} Formatted portfolio data
 */
export const formatPortfoliosForDisplay = (portfolios) => {
  return portfolios.map((p) => ({
    id: p.id,
    title: p.title,
    location: `${p.location}${p.year ? ` (${p.year})` : ''}`,
    image: p.thumbnail || '/images/portfolio/thumbnail/default.jpg',
    link: `/portfolio/${p.slug}`,
  }))
}

/**
 * Get portfolio by slug with fallback to default data
 * @param {string} slug - Portfolio slug
 * @returns {Promise<Object|null>} Portfolio object or null if not found
 */
export const getPortfolioBySlug = async (slug) => {
  // If USE_API is false, directly search in default data
  if (!USE_API) {
    console.log('Using static portfolio data (API disabled)')
    const defaultPortfolios = getDefaultPortfolios()
    const portfolio = defaultPortfolios.find((p) => p.slug === slug)
    return portfolio || null
  }

  try {
    // Try to fetch from API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_URL}/portfolios/slug/${slug}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return await response.json()
    } else if (response.status === 404) {
      // Not found in API, try default data
      const defaultPortfolios = getDefaultPortfolios()
      const portfolio = defaultPortfolios.find((p) => p.slug === slug)
      return portfolio || null
    } else {
      // API error, try default data
      const defaultPortfolios = getDefaultPortfolios()
      const portfolio = defaultPortfolios.find((p) => p.slug === slug)
      return portfolio || null
    }
  } catch (error) {
    // Network error, timeout, or API unavailable - try default data
    console.warn('API unavailable, trying default portfolio data:', error.message)
    const defaultPortfolios = getDefaultPortfolios()
    const portfolio = defaultPortfolios.find((p) => p.slug === slug)
    return portfolio || null
  }
}

