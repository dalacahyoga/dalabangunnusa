import { useEffect, useState, useRef } from 'react'
import './ImageLightbox.css'

const ImageLightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const imageRef = useRef(null)
  const containerRef = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  // Check if fullscreen API is available
  const isFullscreenAPIAvailable = () => {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
  }

  const enterFullscreen = () => {
    const element = containerRef.current
    if (!element) return

    // Try native fullscreen API first
    if (isFullscreenAPIAvailable()) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
          console.log('Fullscreen error:', err)
          // Fallback to CSS fullscreen
          setIsFullscreen(true)
        })
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    } else {
      // Mobile fallback: Use CSS fullscreen
      setIsFullscreen(true)
    }
  }

  const exitFullscreen = () => {
    if (isFullscreenAPIAvailable()) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
    setIsFullscreen(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen()
    } else {
      exitFullscreen()
    }
  }

  useEffect(() => {
    // Disable body scroll when lightbox is open
    document.body.style.overflow = 'hidden'
    // Prevent scrolling on mobile
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen()
        } else {
          onClose()
        }
      }
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onNext, onPrev, isFullscreen])

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false)
  }, [currentIndex])

  // Touch swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchStartY.current) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchStartX.current - touchEndX
    const diffY = touchStartY.current - touchEndY

    // Only handle horizontal swipes (ignore if vertical swipe is larger)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next image
        onNext()
      } else {
        // Swipe right - previous image
        onPrev()
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenActive = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(isFullscreenActive)
    }

    if (isFullscreenAPIAvailable()) {
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.addEventListener('mozfullscreenchange', handleFullscreenChange)
      document.addEventListener('msfullscreenchange', handleFullscreenChange)
    }

    return () => {
      if (isFullscreenAPIAvailable()) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
        document.removeEventListener('msfullscreenchange', handleFullscreenChange)
      }
    }
  }, [])

  if (currentIndex === null) return null

  return (
    <div 
      className={`lightbox-overlay ${isFullscreen ? 'fullscreen-active' : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`lightbox-container ${isFullscreen ? 'fullscreen-active' : ''}`}
        ref={containerRef} 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <i className="icon-close"></i>
          <span>×</span>
        </button>

        {/* Fullscreen Button */}
        <button
          className="lightbox-fullscreen"
          onClick={(e) => {
            e.stopPropagation()
            toggleFullscreen()
          }}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <i className="icon-fullscreen"></i>
          <span>⤢</span>
        </button>

        {/* Zoom Button */}
        <button
          className="lightbox-zoom"
          onClick={(e) => {
            e.stopPropagation()
            toggleZoom()
          }}
          aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
        >
          <i className="icon-search"></i>
          <span>{isZoomed ? '−' : '+'}</span>
        </button>

        {/* Previous Button */}
        <button
          className="lightbox-nav lightbox-prev"
          onClick={onPrev}
          aria-label="Previous"
        >
          <i className="icon-chevron-left"></i>
          <span>‹</span>
        </button>

        {/* Main Image */}
        <div className="lightbox-content">
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Gallery ${currentIndex + 1}`}
            className={`lightbox-image ${isZoomed ? 'zoomed' : ''}`}
          />
          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Next Button */}
        <button
          className="lightbox-nav lightbox-next"
          onClick={onNext}
          aria-label="Next"
        >
          <i className="icon-chevron-right"></i>
          <span>›</span>
        </button>

        {/* Thumbnail Navigation */}
        <div className="lightbox-thumbnails">
          <div className="lightbox-thumbnails-wrapper">
            {images.map((image, index) => (
              <div
                key={index}
                className={`lightbox-thumbnail ${
                  index === currentIndex ? 'active' : ''
                }`}
                onClick={() => {
                  const diff = index - currentIndex
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext()
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) onPrev()
                  }
                }}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox

