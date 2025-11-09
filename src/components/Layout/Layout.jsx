import { Outlet, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton'
import { logVisitor } from '../../utils/visitorLogger'

const Layout = () => {
  const location = useLocation()
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen)
  }

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false)
  }

  // Close offcanvas when route changes
  useEffect(() => {
    closeOffcanvas()
  }, [location])

  // Log visitor on route change
  useEffect(() => {
    // Skip logging for the visitor log page itself
    if (location.pathname !== '/dcg-visitor' && location.pathname !== '/dcg-content') {
      const pageName = location.pathname === '/' ? 'Home' : location.pathname
      logVisitor(pageName)
    }
  }, [location])

  // Toggle body class for offcanvas
  useEffect(() => {
    if (isOffcanvasOpen) {
      document.body.classList.add('offcanvas')
    } else {
      document.body.classList.remove('offcanvas')
    }

    return () => {
      document.body.classList.remove('offcanvas')
    }
  }, [isOffcanvasOpen])

  return (
    <div id="page">
      <WhatsAppButton />
      
      {/* Mobile Menu Toggle Button */}
      <a
        href="#"
        className={`js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white ${
          isOffcanvasOpen ? 'active' : ''
        }`}
        onClick={(e) => {
          e.preventDefault()
          toggleOffcanvas()
        }}
      >
        <i></i>
      </a>

      {/* Offcanvas Mobile Menu */}
      <div id="fh5co-offcanvas">
        <ul>
          <li className={isActive('/') ? 'active' : ''}>
            <Link to="/" onClick={closeOffcanvas}>
              Home
            </Link>
          </li>
          <li className={isActive('/portfolio') ? 'active' : ''}>
            <Link to="/portfolio" onClick={closeOffcanvas}>
              Portfolio
            </Link>
          </li>
          <li className={isActive('/about') ? 'active' : ''}>
            <Link to="/about" onClick={closeOffcanvas}>
              About
            </Link>
          </li>
          <li className={isActive('/contact') ? 'active' : ''}>
            <Link to="/contact" onClick={closeOffcanvas}>
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <Navbar closeOffcanvas={closeOffcanvas} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

