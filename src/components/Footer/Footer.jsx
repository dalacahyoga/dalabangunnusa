const Footer = () => {
  return (
    <div className="container">
      <footer id="fh5co-footer" role="contentinfo">
        <div className="row">
          <div className="col-md-4 fh5co-widget">
            <h4>PT. DaLa Bangun Nusa</h4>
            <p>
              Jl. Raya Bilukan No.95, Sebatu, Kec. Tegallalang <br /> Kabupaten Gianyar, Bali 80561
            </p>
          </div>
          <div className="col-md-4 col-md-push-1">
            <h4>Our Social Media</h4>
            <p>
              <ul className="fh5co-social-icons">
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61568370484842"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="icon-facebook2"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/dalabangunnusa/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="icon-instagram"></i>
                  </a>
                </li>
              </ul>
            </p>
          </div>
          <div className="col-md-4">
            <h4>Contact Information</h4>
            <ul className="fh5co-footer-links">
              <li>
                <a href="tel://081338506799">+62 8133 8506 799</a>
              </li>
              <li>
                <a href="mailto:dalabangunnusa@gmail.com">dalabangunnusa@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row copyright">
          <div className="col-md-12 text-center">
            <p>
              <small className="block">
                &copy; 2024 DaLa Bangun Nusa. All Rights Reserved.
              </small>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer

