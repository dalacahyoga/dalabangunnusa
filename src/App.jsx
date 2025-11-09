import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import VisitorLog from './pages/administrator/VisitorLog'
import ContentManagement from './pages/administrator/ContentManagement'
import PortfolioManagement from './pages/administrator/PortfolioManagement'
import Login from './pages/administrator/Login'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import PortfolioDetailPage from './pages/PortfolioDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="contact" element={<Contact />} />
        <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
      </Route>
      {/* Login page for visitor log access */}
      <Route path="/dcg-login" element={<Login />} />
      {/* Hidden visitor log page - protected route, no layout */}
      <Route
        path="/dcg-visitor"
        element={
          <ProtectedRoute>
            <VisitorLog />
          </ProtectedRoute>
        }
      />
      {/* Content management page - protected route, no layout */}
      <Route
        path="/dcg-content"
        element={
          <ProtectedRoute>
            <ContentManagement />
          </ProtectedRoute>
        }
      />
      {/* Portfolio management page - protected route, no layout */}
      <Route
        path="/dcg-portfolio"
        element={
          <ProtectedRoute>
            <PortfolioManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App

