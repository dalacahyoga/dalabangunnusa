import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AnimateBox from '../components/AnimateBox/AnimateBox'
import { getPageContent } from '../utils/contentLoader'

const Portfolio = () => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      const pageContent = await getPageContent('portfolio')
      if (pageContent) {
        setContent(pageContent)
      } else {
        setContent({
          title: 'Our Portfolio',
          description: 'Explore our collection of projects, where design and craftsmanship create lasting impact.'
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

  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/portfolio">Portfolio</Link>&nbsp;
      </div>
      <div id="fh5co-intro" className="portfolio-page-top">
        <AnimateBox>
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-md-pull-2">
              <h2>
                {content?.title || 'Our Portfolio'}<span></span>
              </h2>
              <p>
                {content?.description || 'Explore our collection of projects, where design and craftsmanship create lasting impact.'}
              </p>
            </div>
          </div>
        </AnimateBox>
      </div>

      {/* Portfolio */}
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
    </div>
  )
}

export default Portfolio

