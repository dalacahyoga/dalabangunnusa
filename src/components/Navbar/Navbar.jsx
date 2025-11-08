import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ closeOffcanvas }) => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fh5co-nav" role="navigation">
      <div className="container">
        <div className="top-menu">
          <div className="row">
            <div className="col-sm-3">
              <div id="fh5co-logo">
                <Link to="/">PT. DaLa Bangun Nusa</Link>
              </div>
            </div>
            <div className="col-sm-9 text-right menu-1">
              <ul>
                <li className={isActive('/') ? 'active' : ''}>
                  <Link to="/">Home</Link>
                </li>
                <li className={isActive('/portfolio') ? 'active' : ''}>
                  <Link to="/portfolio">Portfolio</Link>
                </li>
                <li className={isActive('/about') ? 'active' : ''}>
                  <Link to="/about">About</Link>
                </li>
                <li className={isActive('/contact') ? 'active' : ''}>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

