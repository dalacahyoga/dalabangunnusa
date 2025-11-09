import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './AdminNavbar.css'

const AdminNavbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem('dcg_authenticated')
    sessionStorage.removeItem('dcg_username')
    navigate('/dcg-login', { replace: true })
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <h1>Administrator</h1>
        </div>

        {/* Desktop Menu - Right Side */}
        <div className="admin-navbar-menu">
          <button
            className={`admin-navbar-item ${isActive('/dcg-visitor') ? 'active' : ''}`}
            onClick={() => navigate('/dcg-visitor')}
          >
            Visitor Log
          </button>
          <button
            className={`admin-navbar-item ${isActive('/dcg-content') ? 'active' : ''}`}
            onClick={() => navigate('/dcg-content')}
          >
            Content Management
          </button>
          <button
            className={`admin-navbar-item ${isActive('/dcg-portfolio') ? 'active' : ''}`}
            onClick={() => navigate('/dcg-portfolio')}
          >
            Portfolio Management
          </button>
          <button className="admin-navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="admin-navbar-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={isMobileMenuOpen ? 'open' : ''}></span>
          <span className={isMobileMenuOpen ? 'open' : ''}></span>
          <span className={isMobileMenuOpen ? 'open' : ''}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`admin-navbar-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <button
          className={`admin-navbar-mobile-item ${isActive('/dcg-visitor') ? 'active' : ''}`}
          onClick={() => {
            navigate('/dcg-visitor')
            setIsMobileMenuOpen(false)
          }}
        >
          Visitor Log
        </button>
        <button
          className={`admin-navbar-mobile-item ${isActive('/dcg-content') ? 'active' : ''}`}
          onClick={() => {
            navigate('/dcg-content')
            setIsMobileMenuOpen(false)
          }}
        >
          Content Management
        </button>
        <button
          className={`admin-navbar-mobile-item ${isActive('/dcg-portfolio') ? 'active' : ''}`}
          onClick={() => {
            navigate('/dcg-portfolio')
            setIsMobileMenuOpen(false)
          }}
        >
          Portfolio Management
        </button>
        <button
          className="admin-navbar-mobile-logout"
          onClick={() => {
            handleLogout()
            setIsMobileMenuOpen(false)
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default AdminNavbar

