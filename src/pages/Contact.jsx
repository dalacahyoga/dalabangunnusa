import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AnimateBox from '../components/AnimateBox/AnimateBox'
import { getPageContent } from '../utils/contentLoader'

const Contact = () => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      const pageContent = await getPageContent('contact')
      if (pageContent) {
        setContent(pageContent)
      } else {
        setContent({
          title: 'Contact Information',
          address: 'Jl. Raya Bilukan No.95, Sebatu, Kec. Tegallalang, Kabupaten Gianyar, Bali 80561',
          phone: '+62 8133 8506 799',
          email: 'dalabangunnusa@gmail.com',
          facebook: 'https://www.facebook.com/profile.php?id=61568370484842',
          instagram: 'https://www.instagram.com/dalabangunnusa/',
          mapUrl: 'https://www.google.com/maps?q=Jl.+Raya+Bilukan+No.95,+Sebatu,+Kec.+Tegallalang,+Kabupaten+Gianyar,+Bali+80561&output=embed'
        })
      }
    }
    loadContent()
  }, [])

  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/contact">Contact</Link>&nbsp;
      </div>
      <div id="fh5co-contact" className="contact-page-top">
        <div className="row">
          <AnimateBox className="col-md-12">
            <h3 className="text-center">{content?.title || 'Contact Information'}</h3>
            <ul className="contact-info">
              <li>
                <i className="icon-location4"></i>
                <span>{content?.address || 'Jl. Raya Bilukan No.95, Sebatu, Kec. Tegallalang, Kabupaten Gianyar, Bali 80561'}</span>
              </li>
              <li>
                <i className="icon-phone3"></i>
                <a href={`tel://${content?.phone?.replace(/[^0-9]/g, '') || '081338506799'}`}>
                  {content?.phone || '+62 8133 8506 799'}
                </a>
              </li>
              <li>
                <i className="icon-mail2"></i>
                <a href={`mailto:${content?.email || 'dalabangunnusa@gmail.com'}`}>
                  {content?.email || 'dalabangunnusa@gmail.com'}
                </a>
              </li>
              <li>
                <i className="icon-facebook2"></i>
                <a
                  href={content?.facebook || 'https://www.facebook.com/profile.php?id=61568370484842'}
                  target="_blank"
                  rel="noreferrer"
                >
                  Dala Bangun Nusa
                </a>
              </li>
              <li>
                <i className="icon-instagram"></i>
                <a
                  href={content?.instagram || 'https://www.instagram.com/dalabangunnusa/'}
                  target="_blank"
                  rel="noreferrer"
                >
                  Dala Bangun Nusa
                </a>
              </li>
            </ul>
          </AnimateBox>
        </div>

        {/* Maps Section */}
        <div className="row">
          <AnimateBox className="col-md-12">
            <div className="map-container">
              <iframe
                src={content?.mapUrl || 'https://www.google.com/maps?q=Jl.+Raya+Bilukan+No.95,+Sebatu,+Kec.+Tegallalang,+Kabupaten+Gianyar,+Bali+80561&output=embed'}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PT. DaLa Bangun Nusa Location"
              ></iframe>
            </div>
          </AnimateBox>
        </div>
      </div>
    </div>
  )
}

export default Contact

