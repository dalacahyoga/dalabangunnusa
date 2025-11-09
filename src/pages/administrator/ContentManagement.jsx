import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'
import './ContentManagement.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const ContentManagement = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState(null)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    console.log('ContentManagement component mounted')
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      setLoading(true)
      console.log('Loading content from:', `${API_URL}/content`)
      const response = await fetch(`${API_URL}/content`)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Content loaded:', data)
        setContent(data)
      } else {
        const errorText = await response.text()
        console.error('API error:', errorText)
        // Set default content structure if API fails
        setContent({
          home: {},
          portfolio: {},
          about: {},
          contact: {}
        })
        setMessage({ type: 'error', text: 'Failed to load content from API. Using default structure.' })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      // Set default content structure if API fails
      setContent({
        home: {},
        portfolio: {},
        about: {},
        contact: {}
      })
      setMessage({ type: 'error', text: `Failed to connect to API: ${error.message}. Please ensure the server is running at ${API_URL}` })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (page) => {
    setEditingPage(page)
    setMessage({ type: '', text: '' })
    
    // Always fetch latest data from API to ensure we have all fields including defaults
    try {
      const response = await fetch(`${API_URL}/content/${page}`)
      if (response.ok) {
        const pageData = await response.json()
        setEditData(pageData || {})
        // Update content state with fetched data
        setContent({ ...content, [page]: pageData })
      } else {
        // If API fails, use existing content or empty object
        setEditData({ ...(content?.[page] || {}) })
      }
    } catch (error) {
      console.error('Error fetching page content:', error)
      // If API fails, use existing content or empty object
      setEditData({ ...(content?.[page] || {}) })
    }
  }

  const handleCancel = () => {
    setEditingPage(null)
    setEditData({})
    setMessage({ type: '', text: '' })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const response = await fetch(`${API_URL}/content/${editingPage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const result = await response.json()
        setContent({ ...content, [editingPage]: result.content })
        setMessage({ type: 'success', text: `Content for "${editingPage}" updated successfully!` })
        setEditingPage(null)
        setEditData({})
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
        
        // Reload after 2 seconds
        setTimeout(() => {
          loadContent()
        }, 2000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save content' })
      }
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (page) => {
    if (!window.confirm(`Are you sure you want to reset content for "${page}" to default?`)) {
      return
    }

    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const response = await fetch(`${API_URL}/content/${page}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        // Update content state dengan default content yang dikembalikan dari server
        if (result.content) {
          setContent({ ...content, [page]: result.content })
          setMessage({ type: 'success', text: result.message || `Content for "${page}" reset to default!` })
        } else {
          // Jika server tidak mengembalikan content, reload dari server
          await loadContent()
          setMessage({ type: 'success', text: `Content for "${page}" reset to default!` })
        }
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to reset content' })
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      setMessage({ type: 'error', text: 'Failed to reset content' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value })
  }


  const renderEditForm = (page) => {
    if (editingPage !== page) return null

    const fields = {
      home: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'portfolioButtonText', label: 'Portfolio Button Text', type: 'text' },
        { key: 'portfolioDescription', label: 'Portfolio Description', type: 'textarea' },
        { key: 'clientsTitle', label: 'Clients Title', type: 'text' },
        { key: 'clientsDescription', label: 'Clients Description', type: 'textarea' },
      ],
      portfolio: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
      about: [
        { key: 'principalTitle', label: 'Principal Title', type: 'text' },
        { key: 'principalName', label: 'Principal Name', type: 'text' },
        { key: 'principalImage', label: 'Principal Image URL', type: 'text' },
        { key: 'principalDescription', label: 'Principal Description', type: 'textarea' },
        { key: 'principalFacebook', label: 'Principal Facebook URL', type: 'text' },
        { key: 'principalInstagram', label: 'Principal Instagram URL', type: 'text' },
        { key: 'organizationTitle', label: 'Organization Title', type: 'text' },
        { key: 'organizationDescription', label: 'Organization Description', type: 'textarea' },
        { key: 'organizationImage', label: 'Organization Image URL', type: 'text' },
        { key: 'philosophyTitle', label: 'Philosophy Title', type: 'text' },
        { key: 'philosophySubtitle', label: 'Philosophy Subtitle', type: 'text' },
        { key: 'philosophyDescription', label: 'Philosophy Description', type: 'textarea' },
        { key: 'philosophyImage', label: 'Philosophy Image URL', type: 'text' },
      ],
      contact: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'facebook', label: 'Facebook URL', type: 'url' },
        { key: 'instagram', label: 'Instagram URL', type: 'url' },
        { key: 'mapUrl', label: 'Map URL', type: 'url' },
      ],
    }

    return (
      <div className="content-edit-form">
        <h3>Edit {page.charAt(0).toUpperCase() + page.slice(1)} Content</h3>
        {fields[page]?.map((field) => (
          <div key={field.key} className="form-group">
            <label>{field.label}:</label>
            {field.type === 'textarea' ? (
              <textarea
                value={editData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                rows={4}
                className="form-control"
              />
            ) : (
              <input
                type={field.type}
                value={editData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="form-control"
              />
            )}
          </div>
        ))}
        <div className="form-actions">
          <button onClick={handleSave} disabled={saving} className="btn-save">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleCancel} disabled={saving} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="content-management-container">
        <div className="loading">Loading content...</div>
      </div>
    )
  }

  // Ensure content is not null before rendering
  if (!content) {
    return (
      <div className="content-management-container">
        <div className="loading">Initializing content...</div>
      </div>
    )
  }

  return (
    <div className="content-management-container">
      <AdminNavbar />
      
      <div className="content-management-header">
        <div className="header-content">
          <div>
            <h1>Content Management</h1>
          </div>
        </div>
      </div>

      {message.text && message.type !== 'success' && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="content-pages">
        {['home', 'portfolio', 'about', 'contact'].map((page) => (
          <div 
            key={page} 
            className={`content-page-card ${editingPage && editingPage !== page ? 'hidden' : ''}`}
          >
            <div className="page-header">
              <h2>{page.charAt(0).toUpperCase() + page.slice(1)}</h2>
              <div className="page-actions">
                {editingPage !== page && (
                  <>
                    <button onClick={() => handleEdit(page)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(page)} className="btn-delete" disabled={saving}>
                      Reset to Default
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingPage === page ? (
              renderEditForm(page)
            ) : (
              <div className="page-preview">
                <pre>{JSON.stringify(content?.[page] || {}, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Toast Message */}
      {message.type === 'success' && message.text && (
        <div className="toast toast-success">
          {message.text}
        </div>
      )}
    </div>
  )
}

export default ContentManagement

