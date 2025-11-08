import { Link } from 'react-router-dom'
import AnimateBox from '../components/AnimateBox/AnimateBox'

const Contact = () => {
  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/contact">Contact</Link>&nbsp;
      </div>
      <div id="fh5co-contact" className="contact-page-top">
        <div className="row">
          <AnimateBox className="col-md-12">
            <h3 className="text-center">Contact Information</h3>
            <ul className="contact-info">
              <li>
                <i className="icon-location4"></i>
                <span>Jl. Raya Bilukan No.95, Sebatu, Kec. Tegallalang, Kabupaten Gianyar, Bali 80561</span>
              </li>
              <li>
                <i className="icon-phone3"></i>
                <a href="tel://081338506799">+62 8133 8506 799</a>
              </li>
              <li>
                <i className="icon-envelope"></i>
                <a href="mailto:dalabangunnusa@gmail.com">dalabangunnusa@gmail.com</a>
              </li>
              <li>
                <i className="icon-facebook"></i>
                <a
                  href="https://www.facebook.com/profile.php?id=61568370484842"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dala Bangun Nusa
                </a>
              </li>
              <li>
                <i className="icon-instagram"></i>
                <a
                  href="https://www.instagram.com/dalabangunnusa/"
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
                src="https://www.google.com/maps?q=Jl.+Raya+Bilukan+No.95,+Sebatu,+Kec.+Tegallalang,+Kabupaten+Gianyar,+Bali+80561&output=embed"
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

