// Simple Express server untuk menyimpan visitor logs ke file
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import multer from 'multer'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const DATA_DIR = path.join(__dirname, 'data')
const LOG_FILE = path.join(DATA_DIR, 'visitor_logs.json')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolios.json')
const MAX_LOGS = 10000 // Maksimal 10000 log entries

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// CORS configuration - allow multiple origins for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001']

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all origins in development, restrict in production
    }
  },
  credentials: true
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on query parameter
    const uploadType = req.query.type || 'gallery' // 'thumbnail' or 'gallery'
    const portfolioSlug = req.query.slug || 'temp'
    
    let uploadPath
    if (uploadType === 'thumbnail') {
      uploadPath = path.join(__dirname, 'public', 'images', 'portfolio', 'thumbnail')
    } else {
      // Create portfolio-specific folder for gallery images
      uploadPath = path.join(__dirname, 'public', 'images', 'portfolio', portfolioSlug)
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, `${name}-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp|PNG|JPG|JPEG/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

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

// ============================================
// CONTENT MANAGEMENT API
// ============================================

// Fungsi untuk mendapatkan default content structure
const getDefaultContentStructure = () => {
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

// Fungsi untuk membaca konten dari file
const readContent = () => {
  try {
    const defaultContent = getDefaultContentStructure()
    let savedContent = {}
    
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf8')
      savedContent = JSON.parse(data)
    }
    
    // Merge dengan default content
    // Jika konten untuk page ada di file dan BUKAN objek kosong, gunakan konten dari file
    // Jika tidak ada atau objek kosong, gunakan konten default
    const mergedContent = {}
    for (const page in defaultContent) {
      // Cek jika konten ada di file dan bukan objek kosong
      if (savedContent[page] && Object.keys(savedContent[page]).length > 0) {
        mergedContent[page] = savedContent[page]
      } else {
        // Gunakan default content jika tidak ada atau objek kosong
        mergedContent[page] = defaultContent[page]
      }
    }
    
    return mergedContent
  } catch (error) {
    console.error('Error reading content:', error)
    return getDefaultContentStructure()
  }
}

// Fungsi untuk menulis konten ke file
const writeContent = (content) => {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing content:', error)
    return false
  }
}

// Fungsi untuk mendapatkan default content untuk page tertentu
const getDefaultContentForPage = (page) => {
  const defaultContent = getDefaultContentStructure()
  return defaultContent[page] || null
}

// GET - Mendapatkan semua konten (harus didefinisikan SEBELUM route dengan parameter)
app.get('/api/content', (req, res) => {
  try {
    const content = readContent()
    if (!content) {
      return res.status(500).json({ error: 'Failed to read content' })
    }
    res.json(content)
  } catch (error) {
    console.error('Error getting all content:', error)
    res.status(500).json({ error: 'Failed to get content' })
  }
})

// GET - Mendapatkan konten berdasarkan page (harus didefinisikan SETELAH route exact)
app.get('/api/content/:page', (req, res) => {
  try {
    const { page } = req.params
    const content = readContent()
    
    if (!content) {
      return res.status(500).json({ error: 'Failed to read content' })
    }

    // Jika page ada di content, return content tersebut
    // Jika tidak ada, return default content untuk page tersebut
    if (content[page]) {
      res.json(content[page])
    } else {
      const defaultContent = getDefaultContentForPage(page)
      if (defaultContent) {
        res.json(defaultContent)
      } else {
        res.status(404).json({ error: `Content for page "${page}" not found` })
      }
    }
  } catch (error) {
    console.error('Error getting content:', error)
    res.status(500).json({ error: 'Failed to get content' })
  }
})

// PUT - Update konten untuk page tertentu
app.put('/api/content/:page', (req, res) => {
  try {
    const { page } = req.params
    const newContent = req.body

    if (!newContent) {
      return res.status(400).json({ error: 'Content data is required' })
    }

    const allContent = readContent()
    if (!allContent) {
      return res.status(500).json({ error: 'Failed to read existing content' })
    }

    // Update konten untuk page tertentu
    allContent[page] = { ...allContent[page], ...newContent }

    // Simpan ke file
    if (writeContent(allContent)) {
      res.json({ success: true, message: `Content for "${page}" updated successfully`, content: allContent[page] })
    } else {
      res.status(500).json({ error: 'Failed to save content' })
    }
  } catch (error) {
    console.error('Error updating content:', error)
    res.status(500).json({ error: 'Failed to update content' })
  }
})


// DELETE - Reset konten untuk page tertentu ke default
app.delete('/api/content/:page', (req, res) => {
  try {
    const { page } = req.params
    
    // Baca konten yang tersimpan di file (tanpa merge dengan default)
    let savedContent = {}
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf8')
      savedContent = JSON.parse(data)
    }
    
    // Hapus konten untuk page tertentu dari file
    delete savedContent[page]
    
    // Simpan ke file (hanya konten yang tersimpan, tanpa default)
    if (writeContent(savedContent)) {
      // Kembalikan default content untuk page tersebut
      const defaultContent = getDefaultContentForPage(page)
      if (defaultContent) {
        res.json({ 
          success: true, 
          message: `Content for "${page}" reset to default`,
          content: defaultContent
        })
      } else {
        res.json({ 
          success: true, 
          message: `Content for "${page}" reset to default`,
          content: {}
        })
      }
    } else {
      res.status(500).json({ error: 'Failed to reset content' })
    }
  } catch (error) {
    console.error('Error deleting content:', error)
    res.status(500).json({ error: 'Failed to delete content' })
  }
})

// ============================================
// PORTFOLIO MANAGEMENT API
// ============================================

// Fungsi untuk membaca portfolio dari file
const readPortfolios = () => {
  try {
    if (fs.existsSync(PORTFOLIO_FILE)) {
      const data = fs.readFileSync(PORTFOLIO_FILE, 'utf8')
      return JSON.parse(data)
    }
    // Return default portfolios
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
          '/images/portfolio/1.villaabiantaksu/10.jpeg',
        ]
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
          '/images/portfolio/2.abiansilla/5.jpeg',
        ]
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
          '/images/portfolio/3.cretya/7.jpeg',
        ]
      },
      {
        id: 4,
        title: 'KINI SEBATU VILLA',
        location: 'Gianyar, Bali',
        year: '2019',
        thumbnail: '/images/portfolio/thumbnail/5.kinivilla.jpg',
        slug: 'kinisebatu',
        description: 'A luxurious villa designed with contemporary Balinese architecture, featuring spacious living areas, modern amenities, and breathtaking natural surroundings.',
        images: [
          '/images/portfolio/5.kinivilla/1.jpg',
          '/images/portfolio/5.kinivilla/2.jpg',
          '/images/portfolio/5.kinivilla/3.jpg',
          '/images/portfolio/5.kinivilla/4.jpg',
          '/images/portfolio/5.kinivilla/5.jpg',
        ]
      },
      {
        id: 5,
        title: 'HOSTEL FILOW IN UBUD',
        location: 'Gianyar, Bali',
        year: '2019',
        thumbnail: '/images/portfolio/thumbnail/4.fillowubud.jpg',
        slug: 'filowubud',
        description: 'A modern hostel designed for travelers seeking comfort and community, featuring shared spaces, private rooms, and a vibrant atmosphere.',
        images: [
          '/images/portfolio/4.filowubud/1.jpeg',
          '/images/portfolio/4.filowubud/2.jpeg',
          '/images/portfolio/4.filowubud/3.jpeg',
          '/images/portfolio/4.filowubud/4.jpeg',
          '/images/portfolio/4.filowubud/5.jpeg',
        ]
      },
      {
        id: 6,
        title: 'KUBER DAY CLUB',
        location: 'Gianyar, Bali',
        year: '2020',
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
          '/images/portfolio/6.kuberdayclub/8.PNG',
        ]
      },
      {
        id: 7,
        title: 'SAM POO KONG',
        location: 'Semarang, Central Java',
        year: '2021',
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
          '/images/portfolio/7.sampookong/14.JPG',
        ]
      }
    ]
  } catch (error) {
    console.error('Error reading portfolios:', error)
    return []
  }
}

// Fungsi untuk menulis portfolio ke file
const writePortfolios = (portfolios) => {
  try {
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(portfolios, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing portfolios:', error)
    return false
  }
}

// Helper function untuk menghapus direktori dan semua isinya secara recursive
const deleteDirectory = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
      
      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          // Recursively delete subdirectories
          deleteDirectory(filePath)
        } else {
          // Delete file
          fs.unlinkSync(filePath)
        }
      }
      
      // Delete the directory itself
      fs.rmdirSync(dirPath)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting directory:', error)
    return false
  }
}

// Helper function untuk membuat direktori portfolio
const createPortfolioDirectory = (slug) => {
  try {
    const portfolioDir = path.join(__dirname, 'public', 'images', 'portfolio', slug)
    if (!fs.existsSync(portfolioDir)) {
      fs.mkdirSync(portfolioDir, { recursive: true })
      return true
    }
    return true // Directory already exists
  } catch (error) {
    console.error('Error creating portfolio directory:', error)
    return false
  }
}

// Helper function untuk mendapatkan path direktori portfolio
const getPortfolioDirectory = (slug) => {
  return path.join(__dirname, 'public', 'images', 'portfolio', slug)
}

// Helper function untuk mendapatkan ukuran thumbnail standar
// Membaca dari thumbnail yang sudah ada, atau menggunakan default
const getThumbnailSize = async () => {
  try {
    const thumbnailDir = path.join(__dirname, 'public', 'images', 'portfolio', 'thumbnail')
    
    if (fs.existsSync(thumbnailDir)) {
      const files = fs.readdirSync(thumbnailDir)
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      )
      
      if (imageFiles.length > 0) {
        // Baca metadata dari thumbnail pertama yang ada
        const firstThumbnail = path.join(thumbnailDir, imageFiles[0])
        const metadata = await sharp(firstThumbnail).metadata()
        
        if (metadata.width && metadata.height) {
          return { width: metadata.width, height: metadata.height }
        }
      }
    }
    
    // Default size jika tidak ada thumbnail yang bisa dibaca
    return { width: 1200, height: 800 }
  } catch (error) {
    console.error('Error getting thumbnail size:', error)
    // Default size jika error
    return { width: 1200, height: 800 }
  }
}

// Helper function untuk resize thumbnail image
const resizeThumbnail = async (inputPath, outputPath) => {
  try {
    const { width, height } = await getThumbnailSize()
    
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'cover', // Crop to cover, maintain aspect ratio
        position: 'center' // Center the image when cropping
      })
      .jpeg({ quality: 85 }) // Convert to JPEG with quality 85
      .toFile(outputPath)
    
    return true
  } catch (error) {
    console.error('Error resizing thumbnail:', error)
    return false
  }
}

// GET - Mendapatkan semua portfolio
app.get('/api/portfolios', (req, res) => {
  try {
    const portfolios = readPortfolios()
    // Sort by order field if exists, otherwise by id
    const sortedPortfolios = portfolios.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : a.id
      const orderB = b.order !== undefined ? b.order : b.id
      return orderA - orderB
    })
    res.json(sortedPortfolios)
  } catch (error) {
    console.error('Error getting portfolios:', error)
    res.status(500).json({ error: 'Failed to get portfolios' })
  }
})

// GET - Mendapatkan portfolio berdasarkan ID
app.get('/api/portfolios/:id', (req, res) => {
  try {
    const { id } = req.params
    const portfolios = readPortfolios()
    const portfolio = portfolios.find(p => p.id === parseInt(id))
    
    if (portfolio) {
      res.json(portfolio)
    } else {
      res.status(404).json({ error: 'Portfolio not found' })
    }
  } catch (error) {
    console.error('Error getting portfolio:', error)
    res.status(500).json({ error: 'Failed to get portfolio' })
  }
})

// GET - Mendapatkan portfolio berdasarkan slug
app.get('/api/portfolios/slug/:slug', (req, res) => {
  try {
    const { slug } = req.params
    const portfolios = readPortfolios()
    const portfolio = portfolios.find(p => p.slug === slug)
    
    if (portfolio) {
      res.json(portfolio)
    } else {
      res.status(404).json({ error: 'Portfolio not found' })
    }
  } catch (error) {
    console.error('Error getting portfolio by slug:', error)
    res.status(500).json({ error: 'Failed to get portfolio' })
  }
})

// PUT - Update order of portfolios (MUST be before /api/portfolios/:id)
app.put('/api/portfolios/order', (req, res) => {
  try {
    const { portfolioOrders } = req.body // Array of { id, order }
    
    if (!Array.isArray(portfolioOrders)) {
      return res.status(400).json({ error: 'portfolioOrders must be an array' })
    }
    
    const portfolios = readPortfolios()
    
    // Update order for each portfolio
    portfolioOrders.forEach(({ id, order }) => {
      const portfolio = portfolios.find(p => p.id === parseInt(id))
      if (portfolio) {
        portfolio.order = order
      }
    })
    
    if (writePortfolios(portfolios)) {
      res.json({ success: true, message: 'Portfolio order updated successfully' })
    } else {
      res.status(500).json({ error: 'Failed to update portfolio order' })
    }
  } catch (error) {
    console.error('Error updating portfolio order:', error)
    res.status(500).json({ error: 'Failed to update portfolio order' })
  }
})

// POST - Menambahkan portfolio baru
app.post('/api/portfolios', (req, res) => {
  try {
    const newPortfolio = req.body
    
    if (!newPortfolio.title || !newPortfolio.slug) {
      return res.status(400).json({ error: 'Title and slug are required' })
    }

    const portfolios = readPortfolios()
    
    // Generate ID baru
    const maxId = portfolios.length > 0 ? Math.max(...portfolios.map(p => p.id)) : 0
    newPortfolio.id = maxId + 1
    
    // Set default values
    if (!newPortfolio.images) newPortfolio.images = []
    if (!newPortfolio.year) newPortfolio.year = new Date().getFullYear().toString()
    if (!newPortfolio.location) newPortfolio.location = ''
    if (!newPortfolio.description) newPortfolio.description = ''
    if (!newPortfolio.thumbnail) newPortfolio.thumbnail = newPortfolio.images[0] || ''
    
    // Set order to be last (highest order number)
    const maxOrder = portfolios.length > 0 
      ? Math.max(...portfolios.map(p => (p.order !== undefined ? p.order : p.id)))
      : 0
    newPortfolio.order = maxOrder + 1
    
    // Create directory for new portfolio based on slug
    if (!createPortfolioDirectory(newPortfolio.slug)) {
      return res.status(500).json({ error: 'Failed to create portfolio directory' })
    }
    
    portfolios.push(newPortfolio)
    
    if (writePortfolios(portfolios)) {
      res.json({ success: true, message: 'Portfolio created successfully', portfolio: newPortfolio })
    } else {
      res.status(500).json({ error: 'Failed to save portfolio' })
    }
  } catch (error) {
    console.error('Error creating portfolio:', error)
    res.status(500).json({ error: 'Failed to create portfolio' })
  }
})

// PUT - Update portfolio
app.put('/api/portfolios/:id', (req, res) => {
  try {
    const { id } = req.params
    const updatedData = req.body
    
    const portfolios = readPortfolios()
    const index = portfolios.findIndex(p => p.id === parseInt(id))
    
    if (index === -1) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    
    const oldPortfolio = portfolios[index]
    const oldSlug = oldPortfolio.slug
    const newSlug = updatedData.slug || oldSlug
    
    // If slug changed, rename directory
    if (oldSlug !== newSlug && oldSlug) {
      const oldDir = getPortfolioDirectory(oldSlug)
      const newDir = getPortfolioDirectory(newSlug)
      
      // Create new directory if it doesn't exist
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true })
      }
      
      // Move files from old directory to new directory if old directory exists
      if (fs.existsSync(oldDir)) {
        const files = fs.readdirSync(oldDir)
        files.forEach(file => {
          const oldFilePath = path.join(oldDir, file)
          const newFilePath = path.join(newDir, file)
          if (fs.statSync(oldFilePath).isFile()) {
            fs.copyFileSync(oldFilePath, newFilePath)
            fs.unlinkSync(oldFilePath)
          }
        })
        
        // Remove old directory if empty
        try {
          fs.rmdirSync(oldDir)
        } catch (err) {
          // Directory might not be empty, ignore
        }
      }
    } else {
      // Ensure directory exists for existing portfolio (don't create new, just ensure it exists)
      const portfolioDir = getPortfolioDirectory(newSlug)
      if (!fs.existsSync(portfolioDir)) {
        fs.mkdirSync(portfolioDir, { recursive: true })
      }
    }
    
    // Update portfolio
    portfolios[index] = { ...portfolios[index], ...updatedData }
    
    if (writePortfolios(portfolios)) {
      res.json({ success: true, message: 'Portfolio updated successfully', portfolio: portfolios[index] })
    } else {
      res.status(500).json({ error: 'Failed to save portfolio' })
    }
  } catch (error) {
    console.error('Error updating portfolio:', error)
    res.status(500).json({ error: 'Failed to update portfolio' })
  }
})

// DELETE - Menghapus portfolio
app.delete('/api/portfolios/:id', (req, res) => {
  try {
    const { id } = req.params
    const portfolios = readPortfolios()
    const portfolioToDelete = portfolios.find(p => p.id === parseInt(id))
    
    if (!portfolioToDelete) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    
    // Delete portfolio directory and all its images
    const portfolioDir = getPortfolioDirectory(portfolioToDelete.slug)
    if (fs.existsSync(portfolioDir)) {
      if (!deleteDirectory(portfolioDir)) {
        console.warn(`Warning: Failed to delete directory ${portfolioDir}, but continuing with portfolio deletion`)
      }
    }
    
    // Also delete thumbnail if it exists in thumbnail folder
    if (portfolioToDelete.thumbnail) {
      const thumbnailPath = path.join(__dirname, 'public', portfolioToDelete.thumbnail)
      if (fs.existsSync(thumbnailPath) && portfolioToDelete.thumbnail.includes('thumbnail')) {
        try {
          fs.unlinkSync(thumbnailPath)
        } catch (err) {
          console.warn(`Warning: Failed to delete thumbnail ${thumbnailPath}`)
        // Continue even if thumbnail deletion fails
        }
      }
    }
    
    // Remove portfolio from array
    const filteredPortfolios = portfolios.filter(p => p.id !== parseInt(id))
    
    if (writePortfolios(filteredPortfolios)) {
      res.json({ success: true, message: 'Portfolio and all associated images deleted successfully' })
    } else {
      res.status(500).json({ error: 'Failed to delete portfolio' })
    }
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    res.status(500).json({ error: 'Failed to delete portfolio' })
  }
})

// POST - Upload image file
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    // Get upload type and slug from query
    const uploadType = req.query.type || 'gallery'
    const portfolioSlug = req.query.slug || 'temp'
    
    let filePath
    
    if (uploadType === 'thumbnail') {
      // Resize thumbnail to standard size (in-place resize)
      // File sudah tersimpan di thumbnail directory oleh multer
      const tempPath = req.file.path
      const resizedPath = tempPath + '.resized'
      
      // Resize the uploaded image
      const resizeSuccess = await resizeThumbnail(tempPath, resizedPath)
      
      if (!resizeSuccess) {
        // If resize fails, delete original and return error
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath)
        }
        return res.status(500).json({ error: 'Failed to resize thumbnail' })
      }
      
      // Replace original with resized version
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
      fs.renameSync(resizedPath, tempPath)
      
      filePath = `/images/portfolio/thumbnail/${req.file.filename}`
    } else {
      filePath = `/images/portfolio/${portfolioSlug}/${req.file.filename}`
    }
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      path: filePath,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    // Clean up uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError)
      }
    }
    res.status(500).json({ error: error.message || 'Failed to upload file' })
  }
})

// POST - Upload multiple image files
app.post('/api/upload/multiple', upload.array('images', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }
    
    const portfolioSlug = req.query.slug || 'temp'
    
    // Generate the public URL paths
    const filePaths = req.files.map(file => {
      return `/images/portfolio/${portfolioSlug}/${file.filename}`
    })
    
    res.json({
      success: true,
      message: `${req.files.length} file(s) uploaded successfully`,
      paths: filePaths,
      files: req.files.map(file => ({
        filename: file.filename,
        path: `/images/portfolio/${portfolioSlug}/${file.filename}`
      }))
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    res.status(500).json({ error: error.message || 'Failed to upload files' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Visitor Log API server running on http://localhost:${PORT}`)
  console.log(`Log file: ${LOG_FILE}`)
  console.log(`Content file: ${CONTENT_FILE}`)
  console.log(`Portfolio file: ${PORTFOLIO_FILE}`)
})

