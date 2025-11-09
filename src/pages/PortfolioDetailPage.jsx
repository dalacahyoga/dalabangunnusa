import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PortfolioDetail from '../components/PortfolioDetail/PortfolioDetail'

const PortfolioDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
        const response = await fetch(`${apiUrl}/portfolios/slug/${slug}`)
        
        if (response.ok) {
          const data = await response.json()
          setPortfolio(data)
          setError(null)
        } else if (response.status === 404) {
          setError('Portfolio not found')
          // Redirect to portfolio page after 2 seconds
          setTimeout(() => {
            navigate('/portfolio')
          }, 2000)
        } else {
          setError('Failed to load portfolio')
        }
      } catch (error) {
        console.error('Error loading portfolio:', error)
        setError('Failed to load portfolio')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadPortfolio()
    }
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>{error}</p>
          {error === 'Portfolio not found' && <p>Redirecting to portfolio page...</p>}
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return null
  }

  return (
    <PortfolioDetail
      title={portfolio.title}
      year={portfolio.year || ''}
      location={portfolio.location || ''}
      description={portfolio.description || ''}
      images={portfolio.images || []}
    />
  )
}

export default PortfolioDetailPage

