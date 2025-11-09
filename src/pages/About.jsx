import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AnimateBox from '../components/AnimateBox/AnimateBox'
import { getPageContent } from '../utils/contentLoader'

const About = () => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      const pageContent = await getPageContent('about')
      if (pageContent) {
        setContent(pageContent)
      } else {
        setContent({
          principalTitle: 'About Principal',
          principalName: 'I Wayan Selamet, S.T.',
          principalImage: '/images/principal.jpg',
          principalDescription: 'I Wayan Selamet, S.T. founded DaLa Bangun Nusa in 2015. Previously active as an individual contractor since 1991, he took a career in architecture to help people find their perfect living environments. DaLa Bangun Nusa, based in Bali, now employs around 50+ professionals and has completed projects in Bali, Jakarta, Semarang, Surabaya, Yogyakarta, and Banten. DaLa Bangun Nusa is known for blending traditional Balinese aesthetics with modern functionality.',
          principalFacebook: 'https://www.facebook.com/dalastore',
          principalInstagram: 'https://www.instagram.com/iwayanselamet/',
          organizationTitle: 'Company Organization',
          organizationDescription: 'Below is the organizational structure of our company, outlining the key roles and responsibilities within our team. This structure is designed to ensure efficient communication, collaboration, and growth across all departments.',
          organizationImage: '/images/ComproOrganiztion.png',
          philosophyTitle: 'Our Philosophy',
          philosophySubtitle: 'Spatial and Sacred Planning',
          philosophyDescription: 'Balinese architecture is guided by a cosmological order, where the design and orientation of buildings are considered sacred. An Undagi must understand how the layout of a space aligns with the universe and the divine world. For instance: The north is considered sacred, associated with the gods, and many important temples or shrines are oriented towards the north. Buildings should respect the cardinal directions and natural forces, ensuring that the site is in harmony with the surrounding environment, including the wind, water, and sun.',
          philosophyImage: '/images/philosophy.jpg'
        })
      }
    }
    loadContent()
  }, [])

  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/about">About</Link>&nbsp;
      </div>
      <div id="fh5co-contact">
        {/* About Principal */}
        <div className="row principal-section" style={{ marginBottom: '60px' }}>
          <AnimateBox className="col-md-3 principal-image">
            <div className="image-item">
              <img
                src={content?.principalImage || '/images/principal.jpg'}
                className="img-responsive"
                alt={content?.principalName || 'I Wayan Selamet'}
                style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
              />
            </div>
            {/* Mobile: Social media icons below photo */}
            <ul className="fh5co-social-icons principal-social-media-mobile">
              {(content?.principalFacebook || 'https://www.facebook.com/dalastore') && (
                <li>
                  <a 
                    href={content?.principalFacebook || 'https://www.facebook.com/dalastore'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <i className="icon-facebook2"></i>
                  </a>
                </li>
              )}
              {(content?.principalInstagram || 'https://www.instagram.com/iwayanselamet/') && (
                <li>
                  <a 
                    href={content?.principalInstagram || 'https://www.instagram.com/iwayanselamet/'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <i className="icon-instagram"></i>
                  </a>
                </li>
              )}
            </ul>
          </AnimateBox>
          <AnimateBox className="col-md-9 principal-content">
            <div className="detail">
              <span>{content?.principalTitle || 'About Principal'}</span>
              <h3>{content?.principalName || 'I Wayan Selamet'}</h3>
              <p>
                {content?.principalDescription || 'I Wayan Selamet founded DaLa Bangun Nusa in 2015. Previously active as an individual contractor since 1991, he took a career in architecture to help people find their perfect living environments. DaLa Bangun Nusa, based in Bali, now employs around 50+ professionals and has completed projects in Bali, Jakarta, Semarang, Surabaya, Yogyakarta, and Banten. DaLa Bangun Nusa is known for blending traditional Balinese aesthetics with modern functionality.'}
              </p>
              <ul className="fh5co-social-icons" style={{ marginTop: '20px' }}>
                {(content?.principalFacebook || 'https://www.facebook.com/dalastore') && (
                  <li>
                    <a 
                      href={content?.principalFacebook || 'https://www.facebook.com/dalastore'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <i className="icon-facebook2"></i>
                    </a>
                  </li>
                )}
                {(content?.principalInstagram || 'https://www.instagram.com/iwayanselamet/') && (
                  <li>
                    <a 
                      href={content?.principalInstagram || 'https://www.instagram.com/iwayanselamet/'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <i className="icon-instagram"></i>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </AnimateBox>
        </div>

        {/* Company Organization */}
        <div className="row">
          <AnimateBox className="col-md-6">
            <h3>{content?.organizationTitle || 'Company Organization'}</h3>
            <p>
              {content?.organizationDescription || 'Below is the organizational structure of our company, outlining the key roles and responsibilities within our team. This structure is designed to ensure efficient communication, collaboration, and growth across all departments.'}
            </p>
          </AnimateBox>
          <AnimateBox className="col-md-6">
            <div className="image-item">
              <img
                src={content?.organizationImage || '/images/ComproOrganiztion.png'}
                className="img-responsive"
                alt="Company Organization"
              />
            </div>
          </AnimateBox>
        </div>

        {/* Philosophy */}
        <div className="row">
          <div className="col-md-4 col-md-push-8">
            <div className="detail" id="sticky_item">
              <span>{content?.philosophyTitle || 'Our Philosophy'}</span>
              <h3>{content?.philosophySubtitle || 'Spatial and Sacred Planning'}</h3>
              <p>
                {content?.philosophyDescription || 'Balinese architecture is guided by a cosmological order, where the design and orientation of buildings are considered sacred. An Undagi must understand how the layout of a space aligns with the universe and the divine world. For instance: The north is considered sacred, associated with the gods, and many important temples or shrines are oriented towards the north. Buildings should respect the cardinal directions and natural forces, ensuring that the site is in harmony with the surrounding environment, including the wind, water, and sun.'}
              </p>
            </div>
          </div>
          <div className="col-md-7 col-md-pull-4 image-content">
            <AnimateBox className="image-item">
              <img
                src={content?.philosophyImage || '/images/philosophy.jpg'}
                className="img-responsive"
                alt="Our Philosophy"
              />
            </AnimateBox>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

