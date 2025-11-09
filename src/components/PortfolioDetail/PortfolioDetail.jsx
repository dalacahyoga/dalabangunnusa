import { Link } from 'react-router-dom'
import { useState } from 'react'
import ImageLightbox from '../ImageLightbox/ImageLightbox'
import './PortfolioDetail.css'

const PortfolioDetail = ({ title, year, location, description, images }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (index) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goToNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/portfolio">Portfolio /</Link>&nbsp;
        <Link to="#">{title}</Link>&nbsp;
      </div>

      {/* Portfolio Content */}
      <div className="container mt-5">
        {/* Project Info */}
        <div className="room-description">
          <h2 className="room-title">{title}</h2>
          <h4>{location} <span className="portfolio-year">({year})</span></h4>
          <p className="room-details">{description}</p>
        </div>

        {/* Image Gallery Preview - Tiket.com Style */}
        <div className="portfolio-gallery-preview">
          <div className="portfolio-gallery">
            {/* Desktop: Show first 4 images (1 large + 3 small) */}
            {/* Mobile: Show first 4 images (1 large + 3 small in row) */}
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="portfolio-gallery-item"
                onClick={() => openLightbox(index)}
              >
                <img src={image} alt={`${title} - ${index + 1}`} />
                <div className="gallery-overlay"></div>
                {/* View All Button on 4th image (both desktop and mobile) */}
                {index === 3 && images.length > 4 && (
                  <div className="view-all-overlay">
                    <span>see all photo</span>
                    <span className="photo-count">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrev={goToPrev}
        />
      )}
    </div>
  )
}

export default PortfolioDetail

