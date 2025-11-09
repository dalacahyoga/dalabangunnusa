import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import AnimateBox from '../components/AnimateBox/AnimateBox'
import { getPageContent } from '../utils/contentLoader'

const Home = () => {
  const clientsContainerRef = useRef(null)
  const [content, setContent] = useState(null)

  // Load content from API
  useEffect(() => {
    const loadContent = async () => {
      const pageContent = await getPageContent('home')
      if (pageContent) {
        setContent(pageContent)
      } else {
        // Fallback to default content
        setContent({
          title: 'Best showcase for architecture',
          description: 'PT. DaLa Bangun Nusa, an experienced architecture and construction company since 2015, formerly an individual contractor by I Wayan Selamet, S.T. since 1991. We specialize in designing and building temples, villas, pool bars, and restaurants. Let us bring your vision to life with expert craftsmanship and lasting results.',
          tagline: 'Inspired by Bali, Designed for the Sacred.',
          portfolioButtonText: 'View More Our Portfolio',
          portfolioDescription: 'Explore our collection of projects, where design and craftsmanship create lasting impact.',
          clientsTitle: 'Our Clients',
          clientsDescription: 'We are proud to have collaborated with leading businesses, delivering architectural solutions that exceed expectations and create lasting value.'
        })
      }
    }
    loadContent()
  }, [])

  // Load portfolios from API
  const [portfolios, setPortfolios] = useState([])

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${apiUrl}/portfolios`)
        if (response.ok) {
          const data = await response.json()
          // Transform data to match the expected format
          const formattedPortfolios = data.map((p) => ({
            id: p.id,
            title: p.title,
            location: `${p.location}${p.year ? ` (${p.year})` : ''}`,
            image: p.thumbnail || '/images/portfolio/thumbnail/default.jpg',
            link: `/portfolio/${p.slug}`,
          }))
          setPortfolios(formattedPortfolios)
        }
      } catch (error) {
        console.error('Error loading portfolios:', error)
        // Fallback to empty array if API fails
        setPortfolios([])
      }
    }
    loadPortfolios()
  }, [])

  // Desktop: Split by even/odd index (alternating columns)
  // Mobile: Will show in order (no change needed)
  const leftPortfolios = portfolios.filter((_, index) => index % 2 === 0) // Even indices: 0, 2, 4, 6...
  const rightPortfolios = portfolios.filter((_, index) => index % 2 === 1) // Odd indices: 1, 3, 5...

  // Logo clients data
  const clientLogos = [
    { id: 1, src: '/images/clients/Kuber.png', alt: 'Kuber Bali Adventure' },
    { id: 2, src: '/images/clients/Cretya.png', alt: 'Cretya Ubud' },
    { id: 3, src: '/images/clients/WKC.png', alt: 'WKC' },
    { id: 4, src: '/images/clients/Dhananjaya.png', alt: 'Dhananjaya' },
  ]

  // Auto scroll untuk logo clients
  useEffect(() => {
    const container = clientsContainerRef.current
    if (!container) return

    let scrollPosition = 0
    let isScrolling = true
    let animationFrameId = null
    let userScrolled = false
    let resumeTimeout = null
    let resetTimeout = null
    let isResetting = false

    const autoScroll = () => {
      if (!isScrolling || userScrolled) {
        animationFrameId = requestAnimationFrame(autoScroll)
        return
      }

      const maxScroll = container.scrollWidth - container.clientWidth

      if (maxScroll <= 0) {
        animationFrameId = requestAnimationFrame(autoScroll)
        return
      }

      // Hitung posisi dalam loop (setelah duplikasi, ada 2 set logo)
      const singleSetWidth = container.scrollWidth / 2
      
      if (scrollPosition >= singleSetWidth) {
        // Jump ke posisi awal tanpa animasi (seamless loop)
        scrollPosition = scrollPosition - singleSetWidth
        container.scrollLeft = scrollPosition
      } else {
        // Scroll pelan-pelan dan smooth (0.3px per frame = sangat pelan)
        scrollPosition += 0.3
        container.scrollLeft = scrollPosition
      }

      animationFrameId = requestAnimationFrame(autoScroll)
    }

    // Pause saat user scroll manual dan handle reset ke awal saat mentok
    const handleScroll = () => {
      const currentScroll = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      const diff = Math.abs(currentScroll - scrollPosition)
      
      // Cek jika sudah melewati set pertama - jump ke awal tanpa animasi (seamless loop)
      const singleSetWidth = container.scrollWidth / 2
      if (singleSetWidth > 0 && currentScroll >= singleSetWidth - 5 && !isResetting) {
        // Jump ke posisi awal tanpa animasi (seamless loop)
        const newPosition = currentScroll - singleSetWidth
        container.scrollLeft = newPosition
        scrollPosition = newPosition
      }
      
      if (diff > 2) {
        // User sedang scroll manual
        userScrolled = true
        scrollPosition = currentScroll
        
        // Clear timeout sebelumnya
        if (resumeTimeout) {
          clearTimeout(resumeTimeout)
        }
        
        // Resume setelah 3 detik tidak ada scroll manual
        resumeTimeout = setTimeout(() => {
          userScrolled = false
        }, 3000)
      }
    }

    // Pause saat mouse hover (desktop)
    const handleMouseEnter = () => {
      userScrolled = true
    }

    const handleMouseLeave = () => {
      // Resume setelah 1 detik setelah mouse leave
      setTimeout(() => {
        userScrolled = false
      }, 1000)
    }

    // Start auto scroll
    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    autoScroll()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout)
      }
      if (resetTimeout) {
        clearTimeout(resetTimeout)
      }
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="container">
      <div id="fh5co-intro">
        <AnimateBox>
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-md-pull-2">
              <h2>
                {content?.title || 'Best showcase for architecture'} <span></span>
              </h2>
              <p>
                {content?.description || 'PT. DaLa Bangun Nusa, an experienced architecture and construction since 2015. Specialize in designing and building temples, villas, pool bars, and restaurants. Let us bring your vision to life with expert craftsmanship and lasting results.'}
                <br />
                <br />
                <strong>&quot;{content?.tagline || 'Inspired by Bali, Designed for the Sacred.'}&quot;</strong>
              </p>
            </div>
          </div>
        </AnimateBox>
      </div>

      <div id="fh5co-portfolio">
        <div className="row nopadding">
          {/* Mobile: Single column - show all portfolios in order */}
          <div className="col-xs-12 col-sm-12 col-md-6 padding-right portfolio-mobile">
            <div className="row">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="col-md-12">
                  <AnimateBox>
                    <Link to={portfolio.link} className="portfolio-grid">
                      <img
                        src={portfolio.image}
                        className="img-responsive"
                        alt={portfolio.title}
                      />
                      <div className="hover-text">Open Portfolio</div>
                      <div className="desc">
                        <h3>{portfolio.title}</h3>
                        <span>{portfolio.location}</span>
                      </div>
                    </Link>
                  </AnimateBox>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Two columns - Left Portfolio (even indices) */}
          <div className="col-md-6 padding-right portfolio-desktop-left">
            <div className="row">
              {leftPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="col-md-12">
                  <AnimateBox>
                    <Link to={portfolio.link} className="portfolio-grid">
                      <img
                        src={portfolio.image}
                        className="img-responsive"
                        alt={portfolio.title}
                      />
                      <div className="hover-text">Open Portfolio</div>
                      <div className="desc">
                        <h3>{portfolio.title}</h3>
                        <span>{portfolio.location}</span>
                      </div>
                    </Link>
                  </AnimateBox>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Two columns - Right Portfolio (odd indices) */}
          <div className="col-md-6 padding-left portfolio-desktop-right">
            <div className="row">
              {rightPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="col-md-12">
                  <AnimateBox>
                    <Link to={portfolio.link} className="portfolio-grid">
                      <img
                        src={portfolio.image}
                        className="img-responsive"
                        alt={portfolio.title}
                      />
                      <div className="hover-text">Open Portfolio</div>
                      <div className="desc">
                        <h3>{portfolio.title}</h3>
                        <span>{portfolio.location}</span>
                      </div>
                    </Link>
                  </AnimateBox>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 text-center">
        <p>
          <Link to="/portfolio" className="btn btn-primary btn-demo">
            {content?.portfolioButtonText || 'View More Our Portfolio'}
          </Link>
        </p>
        <p>
          {content?.portfolioDescription || 'Explore our collection of projects, where design and craftsmanship create lasting impact.'}
        </p>
      </div>

      {/* Our Clients Section */}
      <div id="fh5co-clients">
        <AnimateBox>
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <h2>
                {content?.clientsTitle || 'Our Clients'} <span></span>
              </h2>
              <p>
                {content?.clientsDescription || 'We are proud to have collaborated with leading businesses, delivering architectural solutions that exceed expectations and create lasting value.'}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="clients-logo-container" ref={clientsContainerRef}>
                {/* Duplikasi logo untuk infinite scroll seamless */}
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <div key={`${logo.id}-${index}`} className="client-logo-item">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="client-logo"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateBox>
      </div>
    </div>
  )
}

export default Home

