import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Auto-redirect if already logged in
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('dcg_authenticated') === 'true'
    if (isAuthenticated) {
      navigate('/dcg-visitor', { replace: true })
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Credentials
    const validUsername = 'dcgnrg'
    const validPassword = 'dcgnrg'

    if (username === validUsername && password === validPassword) {
      // Set authentication
      sessionStorage.setItem('dcg_authenticated', 'true')
      sessionStorage.setItem('dcg_username', username)
      
      // Redirect to intended page or /dcg-visitor
      const from = location.state?.from?.pathname || '/dcg-visitor'
      navigate(from, { replace: true })
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Administrator</h2>
        <p className="login-subtitle">Please login to access administrator panel</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

