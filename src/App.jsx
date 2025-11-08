import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import VisitorLog from './pages/administrator/VisitorLog'
import Login from './pages/administrator/Login'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AbianTaksu from './pages/portfolio/AbianTaksu'
import AbianSilla from './pages/portfolio/AbianSilla'
import CretyaUbud from './pages/portfolio/CretyaUbud'
import FilowUbud from './pages/portfolio/FilowUbud'
import KiniSebatu from './pages/portfolio/KiniSebatu'
import KuberDayClub from './pages/portfolio/KuberDayClub'
import SampooKong from './pages/portfolio/SampooKong'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="contact" element={<Contact />} />
        <Route path="portfolio/abiantaksu" element={<AbianTaksu />} />
        <Route path="portfolio/abiansilla" element={<AbianSilla />} />
        <Route path="portfolio/cretyaubud" element={<CretyaUbud />} />
        <Route path="portfolio/filowubud" element={<FilowUbud />} />
        <Route path="portfolio/kinisebatu" element={<KiniSebatu />} />
        <Route path="portfolio/kuberdayclub" element={<KuberDayClub />} />
        <Route path="portfolio/sampookong" element={<SampooKong />} />
      </Route>
      {/* Login page for visitor log access */}
      <Route path="/dcg-login" element={<Login />} />
      {/* Hidden visitor log page - protected route, no layout */}
      <Route
        path="/dcg"
        element={
          <ProtectedRoute>
            <VisitorLog />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App

