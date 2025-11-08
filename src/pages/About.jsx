import { Link } from 'react-router-dom'
import AnimateBox from '../components/AnimateBox/AnimateBox'

const About = () => {
  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/about">About</Link>&nbsp;
      </div>
      <div id="fh5co-contact">
        {/* About Us */}
        <div className="row">
          <AnimateBox className="col-md-6">
            <h3>Company Organization</h3>
            <p>
              Below is the organizational structure of our company, outlining
              the key roles and responsibilities within our team. This structure
              is designed to ensure efficient communication, collaboration, and
              growth across all departments.
            </p>
          </AnimateBox>
          <AnimateBox className="col-md-6">
            <div className="image-item">
              <img
                src="/images/ComproOrganiztion.png"
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
              <span>Our Philosophy</span>
              <h3>Spatial and Sacred Planning</h3>
              <p>
                Balinese architecture is guided by a cosmological order, where
                the design and orientation of buildings are considered sacred.
                An Undagi must understand how the layout of a space aligns with
                the universe and the divine world. For instance: The north is
                considered sacred, associated with the gods, and many important
                temples or shrines are oriented towards the north. Buildings
                should respect the cardinal directions and natural forces,
                ensuring that the site is in harmony with the surrounding
                environment, including the wind, water, and sun.
              </p>
            </div>
          </div>
          <div className="col-md-7 col-md-pull-4 image-content">
            <AnimateBox className="image-item">
              <img
                src="/images/philosophy.jpg"
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

