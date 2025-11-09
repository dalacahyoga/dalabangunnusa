import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'
import './PortfolioManagement.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const PortfolioManagement = () => {
  const navigate = useNavigate()
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    year: '',
    slug: '',
    description: '',
    thumbnail: '',
    images: []
  })
  const [imageInput, setImageInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [loadingFormData, setLoadingFormData] = useState(false)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadPortfolios()
  }, [])

  // Debug: Log formData changes
  useEffect(() => {
    console.log('formData updated:', formData)
  }, [formData])

  // Debug: Log editingId changes
  useEffect(() => {
    console.log('editingId updated:', editingId)
  }, [editingId])

  const loadPortfolios = async () => {
    try {
      setLoading(true)
      console.log('Loading portfolios from:', `${API_URL}/portfolios`)
      const response = await fetch(`${API_URL}/portfolios`)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Portfolios loaded:', data)
        setPortfolios(data)
      } else {
        setMessage({ type: 'error', text: 'Failed to load portfolios' })
      }
    } catch (error) {
      console.error('Error loading portfolios:', error)
      setMessage({ type: 'error', text: `Failed to connect to API: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setShowAddForm(true)
    setEditingId(null)
    setFormData({
      title: '',
      location: '',
      year: new Date().getFullYear().toString(),
      slug: '',
      description: '',
      thumbnail: '',
      images: []
    })
    setImageInput('')
    setMessage({ type: '', text: '' })
  }

  const handleEdit = async (portfolio) => {
    console.log('handleEdit called with portfolio:', portfolio)
    
    // Set formData immediately from portfolio (synchronous) so form renders with data
    const initialFormData = {
      title: portfolio.title || '',
      location: portfolio.location || '',
      year: portfolio.year || '',
      slug: portfolio.slug || '',
      description: portfolio.description || '',
      thumbnail: portfolio.thumbnail || '',
      images: Array.isArray(portfolio.images) ? [...portfolio.images] : []
    }
    console.log('Setting initial formData from portfolio:', initialFormData)
    setFormData(initialFormData)
    
    setEditingId(portfolio.id)
    setShowAddForm(false)
    setMessage({ type: '', text: '' })
    setLoadingFormData(false) // Don't show loading since we already have data
    setImageInput('')
    
    // Then fetch latest data from API in background to ensure we have all fields
    try {
      console.log('Fetching portfolio from API:', `${API_URL}/portfolios/${portfolio.id}`)
      const response = await fetch(`${API_URL}/portfolios/${portfolio.id}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const portfolioData = await response.json()
        console.log('Portfolio data from API:', portfolioData)
        
        const newFormData = {
          title: portfolioData.title || '',
          location: portfolioData.location || '',
          year: portfolioData.year || '',
          slug: portfolioData.slug || '',
          description: portfolioData.description || '',
          thumbnail: portfolioData.thumbnail || '',
          images: Array.isArray(portfolioData.images) ? [...portfolioData.images] : []
        }
        
        console.log('Updating formData with API data:', newFormData)
        setFormData(newFormData)
      } else {
        console.warn('API response not OK:', response.status)
        // Keep using initial formData from portfolio
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
      // Keep using initial formData from portfolio
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setLoadingFormData(false)
    setFormData({
      title: '',
      location: '',
      year: new Date().getFullYear().toString(),
      slug: '',
      description: '',
      thumbnail: '',
      images: []
    })
    setImageInput('')
    setMessage({ type: '', text: '' })
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      })
      setImageInput('')
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleUploadThumbnail = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      setUploadProgress('Uploading thumbnail...')
      
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)
      
      const slug = formData.slug || 'temp'
      const response = await fetch(`${API_URL}/upload?type=thumbnail&slug=${slug}`, {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const result = await response.json()
        handleInputChange('thumbnail', result.path)
        setUploadProgress('Thumbnail uploaded successfully!')
        setTimeout(() => setUploadProgress(''), 2000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to upload thumbnail' })
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      setMessage({ type: 'error', text: 'Failed to upload thumbnail' })
    } finally {
      setUploading(false)
      setUploadProgress('')
      // Reset file input
      e.target.value = ''
    }
  }

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      setUploading(true)
      setUploadProgress(`Uploading ${files.length} image(s)...`)
      
      const uploadFormData = new FormData()
      files.forEach(file => {
        uploadFormData.append('images', file)
      })
      
      const slug = formData.slug || 'temp'
      const response = await fetch(`${API_URL}/upload/multiple?slug=${slug}`, {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const result = await response.json()
        // Add all uploaded images to the images array
        setFormData({
          ...formData,
          images: [...formData.images, ...result.paths]
        })
        setUploadProgress(`${result.files.length} image(s) uploaded successfully!`)
        setTimeout(() => setUploadProgress(''), 2000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to upload images' })
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setMessage({ type: 'error', text: 'Failed to upload images' })
    } finally {
      setUploading(false)
      setUploadProgress('')
      // Reset file input
      e.target.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      // Validasi
      if (!formData.title || !formData.slug) {
        setMessage({ type: 'error', text: 'Title and slug are required' })
        return
      }

      // Generate slug dari title jika slug kosong
      if (!formData.slug && formData.title) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }

      // Set thumbnail dari images pertama jika thumbnail kosong
      if (!formData.thumbnail && formData.images.length > 0) {
        formData.thumbnail = formData.images[0]
      }

      let response
      if (editingId) {
        // Update existing
        response = await fetch(`${API_URL}/portfolios/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new
        response = await fetch(`${API_URL}/portfolios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
      }

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: result.message || 'Portfolio saved successfully!' })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
        setEditingId(null)
        setShowAddForm(false)
        setFormData({
          title: '',
          location: '',
          year: '',
          slug: '',
          description: '',
          thumbnail: '',
          images: []
        })
        setTimeout(() => {
          loadPortfolios()
        }, 1000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save portfolio' })
      }
    } catch (error) {
      console.error('Error saving portfolio:', error)
      setMessage({ type: 'error', text: 'Failed to save portfolio' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) {
      return
    }

    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const response = await fetch(`${API_URL}/portfolios/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Portfolio deleted successfully!' })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
        setTimeout(() => {
          loadPortfolios()
        }, 1000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to delete portfolio' })
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      setMessage({ type: 'error', text: 'Failed to delete portfolio' })
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = portfolios.findIndex((p) => p.id === active.id)
    const newIndex = portfolios.findIndex((p) => p.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Update local state immediately for better UX
    const newPortfolios = arrayMove(portfolios, oldIndex, newIndex)
    setPortfolios(newPortfolios)

    // Update order in server
    try {
      const portfolioOrders = newPortfolios.map((portfolio, index) => ({
        id: portfolio.id,
        order: index + 1,
      }))

      const response = await fetch(`${API_URL}/portfolios/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolioOrders }),
      })

      if (!response.ok) {
        // Revert on error
        loadPortfolios()
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to update order' })
      } else {
        setMessage({ type: 'success', text: 'Order updated successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      console.error('Error updating order:', error)
      // Revert on error
      loadPortfolios()
      setMessage({ type: 'error', text: 'Failed to update order' })
    }
  }

  // Sortable Portfolio Card Component
  const SortablePortfolioCard = ({ portfolio, isHidden = false, currentFormData, currentEditingId, onEdit, onDelete, onInputChange, onSave, onCancel, saving, imageInput, setImageInput, handleAddImage, handleRemoveImage, handleUploadThumbnail, handleUploadImages, uploading, uploadProgress }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: portfolio.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    }

    const isEditing = currentEditingId === portfolio.id
    
    console.log('SortablePortfolioCard render:', {
      portfolioId: portfolio.id,
      currentEditingId,
      isEditing,
      hasFormData: !!currentFormData,
      formDataTitle: currentFormData?.title
    })

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`portfolio-card ${isHidden ? 'hidden' : ''}`}
      >
        <div className="portfolio-card-header">
          <div className="portfolio-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div
              {...attributes}
              {...listeners}
              style={{
                cursor: 'grab',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#666',
                userSelect: 'none',
              }}
              title="Drag to reorder"
            >
              ⋮⋮
            </div>
            {portfolio.thumbnail && (
              <img src={portfolio.thumbnail} alt={portfolio.title} className="portfolio-thumbnail" />
            )}
            <div>
              <h3>{portfolio.title}</h3>
              <p className="portfolio-meta">
                {portfolio.location} {portfolio.year && `(${portfolio.year})`}
              </p>
              <p className="portfolio-slug">Slug: {portfolio.slug}</p>
            </div>
          </div>
          <div className="portfolio-actions">
            {!isEditing && (
              <>
                <button onClick={() => onEdit(portfolio)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => onDelete(portfolio.id)} className="btn-delete" disabled={saving}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        {console.log('Checking edit form condition:', { isEditing, hasFormData: !!currentFormData, willRender: isEditing && currentFormData })}
        {isEditing && currentFormData && (
          <div className="portfolio-edit-form" key={`edit-form-${portfolio.id}-${JSON.stringify(currentFormData).substring(0, 50)}`}>
            {console.log('Rendering edit form for portfolio:', portfolio.id, 'isEditing:', isEditing, 'currentFormData:', currentFormData)}
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={currentFormData.title || ''}
                onChange={(e) => onInputChange('title', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={currentFormData.location || ''}
                  onChange={(e) => onInputChange('location', e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={currentFormData.year || ''}
                  onChange={(e) => onInputChange('year', e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                value={currentFormData.slug || ''}
                onChange={(e) => onInputChange('slug', e.target.value)}
                className="form-control"
              />
              <small>Will be used in URL: /portfolio/{currentFormData.slug || 'slug'}</small>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={currentFormData.description || ''}
                onChange={(e) => onInputChange('description', e.target.value)}
                rows={4}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Thumbnail Image</label>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadThumbnail}
                  disabled={uploading}
                  style={{ marginBottom: '10px' }}
                />
                <small style={{ display: 'block', color: '#666' }}>
                  Atau masukkan URL manual:
                </small>
              </div>
              <input
                type="text"
                value={currentFormData.thumbnail || ''}
                onChange={(e) => onInputChange('thumbnail', e.target.value)}
                className="form-control"
                style={{ marginTop: '5px' }}
              />
              {uploadProgress && uploadProgress.includes('thumbnail') && (
                <div style={{ marginTop: '5px', color: '#007bff' }}>{uploadProgress}</div>
              )}
              {currentFormData.thumbnail && (
                <img src={currentFormData.thumbnail} alt="Thumbnail preview" className="image-preview" />
              )}
            </div>
            <div className="form-group">
              <label>Images</label>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadImages}
                  disabled={uploading}
                  style={{ marginBottom: '10px' }}
                />
                <small style={{ display: 'block', color: '#666' }}>
                  Atau masukkan URL manual:
                </small>
              </div>
              {uploadProgress && uploadProgress.includes('image') && (
                <div style={{ marginBottom: '10px', color: '#007bff' }}>{uploadProgress}</div>
              )}
              <div className="image-input-group">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="form-control"
                  placeholder="/images/portfolio/1.villaabiantaksu/1.jpeg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddImage()
                    }
                  }}
                />
                <button type="button" onClick={handleAddImage} className="btn-add-image">
                  Add
                </button>
              </div>
              <div className="images-list">
                {currentFormData.images && currentFormData.images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Image ${index + 1}`} className="image-preview-small" />
                    <span className="image-url">{image}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="btn-remove-image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button onClick={onSave} disabled={saving} className="btn-save">
                {saving ? 'Saving...' : 'Update Portfolio'}
              </button>
              <button onClick={onCancel} disabled={saving} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="portfolio-management-container">
        <AdminNavbar />
        <div className="loading">Loading portfolios...</div>
      </div>
    )
  }

  return (
    <div className="portfolio-management-container">
      <AdminNavbar />
      
      <div className="portfolio-management-header">
        <div className="header-content">
          <div>
            <h1>Portfolio Management</h1>
          </div>
          <button className="btn-add" onClick={handleAdd} disabled={showAddForm || editingId}>
            + Add Portfolio
          </button>
        </div>
      </div>

      {message.text && message.type !== 'success' && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {/* Toast Message */}
      {message.type === 'success' && message.text && (
        <div className="toast toast-success">
          {message.text}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && !editingId && (
        <div className="portfolio-form-card">
          <h2>Add New Portfolio</h2>
          
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="form-control"
              placeholder="e.g., ABIANTAKSU VILLA"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="form-control"
                placeholder="e.g., Gianyar, Bali"
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="form-control"
                placeholder="e.g., 2017"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Slug * (URL-friendly name)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className="form-control"
              placeholder="e.g., abiantaksu"
            />
            <small>Will be used in URL: /portfolio/{formData.slug || 'slug'}</small>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="form-control"
              placeholder="Portfolio description..."
            />
          </div>

          <div className="form-group">
            <label>Thumbnail Image</label>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadThumbnail}
                disabled={uploading}
                style={{ marginBottom: '10px' }}
              />
              <small style={{ display: 'block', color: '#666' }}>
                Atau masukkan URL manual:
              </small>
            </div>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => handleInputChange('thumbnail', e.target.value)}
              className="form-control"
              placeholder="/images/portfolio/thumbnail/1.abiantaksu.jpg"
              style={{ marginTop: '5px' }}
            />
            {uploadProgress && uploadProgress.includes('thumbnail') && (
              <div style={{ marginTop: '5px', color: '#007bff' }}>{uploadProgress}</div>
            )}
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Thumbnail preview" className="image-preview" />
            )}
          </div>

          <div className="form-group">
            <label>Images</label>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUploadImages}
                disabled={uploading}
                style={{ marginBottom: '10px' }}
              />
              <small style={{ display: 'block', color: '#666' }}>
                Atau masukkan URL manual:
              </small>
            </div>
            {uploadProgress && uploadProgress.includes('image') && (
              <div style={{ marginBottom: '10px', color: '#007bff' }}>{uploadProgress}</div>
            )}
            <div className="image-input-group">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="form-control"
                placeholder="/images/portfolio/1.villaabiantaksu/1.jpeg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddImage()
                  }
                }}
              />
              <button type="button" onClick={handleAddImage} className="btn-add-image">
                Add
              </button>
            </div>
            <div className="images-list">
              {formData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Image ${index + 1}`} className="image-preview-small" />
                  <span className="image-url">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="btn-remove-image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSave} disabled={saving} className="btn-save">
              {saving ? 'Saving...' : editingId ? 'Update Portfolio' : 'Create Portfolio'}
            </button>
            <button onClick={handleCancel} disabled={saving} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Portfolio List - Hide only when adding, not when editing */}
      {!showAddForm && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={portfolios.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="portfolios-list">
              {portfolios.length === 0 ? (
                <div className="no-portfolios">
                  <p>No portfolios found. Click "Add Portfolio" to create one.</p>
                </div>
              ) : (
                portfolios.map((portfolio) => (
                  <SortablePortfolioCard 
                    key={portfolio.id} 
                    portfolio={portfolio}
                    isHidden={editingId !== null && editingId !== portfolio.id}
                    currentFormData={formData}
                    currentEditingId={editingId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    saving={saving}
                    imageInput={imageInput}
                    setImageInput={setImageInput}
                    handleAddImage={handleAddImage}
                    handleRemoveImage={handleRemoveImage}
                    handleUploadThumbnail={handleUploadThumbnail}
                    handleUploadImages={handleUploadImages}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

export default PortfolioManagement

