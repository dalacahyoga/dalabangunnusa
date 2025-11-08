import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = sessionStorage.getItem('dcg_authenticated') === 'true'

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/dcg-login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

