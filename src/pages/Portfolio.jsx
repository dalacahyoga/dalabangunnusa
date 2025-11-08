import { Link } from 'react-router-dom'
import AnimateBox from '../components/AnimateBox/AnimateBox'

const Portfolio = () => {
  const portfolios = [
    {
      id: 1,
      title: 'ABIAN TAKSU VILLA',
      location: 'Gianyar, Bali',
      image: '/images/portfolio/thumbnail/1.abiantaksu.jpg',
      link: '/portfolio/abiantaksu',
    },
    {
      id: 2,
      title: 'ABIANSILA ADVENTURE',
      location: 'Gianyar, Bali',
      image: '/images/portfolio/thumbnail/2.abiansilla.jpg',
      link: '/portfolio/abiansilla',
    },
    {
      id: 3,
      title: 'CRETYA UBUD BALI',
      location: 'Gianyar, Bali',
      image: '/images/portfolio/thumbnail/3.cretya.jpeg',
      link: '/portfolio/cretyaubud',
    },
    {
      id: 4,
      title: 'HOSTEL FILOW IN UBUD',
      location: 'Gianyar, Bali',
      image: '/images/portfolio/thumbnail/4.fillowubud.jpg',
      link: '/portfolio/filowubud',
    },
    {
      id: 5,
      title: '⁠KINI SEBATU VILLA',
      location: 'Gianyar, Bali',
      image: '/images/portfolio/thumbnail/5.kinivilla.jpg',
      link: '/portfolio/kinisebatu',
    },
    {
      id: 6,
      title: 'KUBER DAY CLUB',
      location: 'Gianyar, Bali',
      image: '/images/portfolio/thumbnail/6.kuberdayclub.jpg',
      link: '/portfolio/kuberdayclub',
    },
    {
      id: 7,
      title: 'SAM POO KONG',
      location: 'Semarang, Central Java',
      image: '/images/portfolio/thumbnail/7.sampookong.jpg',
      link: '/portfolio/sampookong',
    },
  ]

  const leftPortfolios = portfolios.filter((p) => [1, 2, 3].includes(p.id))
  const rightPortfolios = portfolios.filter((p) => [4, 5, 6, 7].includes(p.id))

  return (
    <div className="container">
      <div>
        <Link to="/">Home /</Link>&nbsp;
        <Link to="/portfolio">Portfolio</Link>&nbsp;
      </div>
      <div id="fh5co-intro" className="portfolio-page-top">
        <AnimateBox>
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-md-pull-2">
              <h2>
                Our Portfolio<span></span>
              </h2>
              <p>
                Explore our collection of projects, where design and
                craftsmanship create lasting impact.
              </p>
            </div>
          </div>
        </AnimateBox>
      </div>

      {/* Portfolio */}
      <div id="fh5co-portfolio">
        <div className="row nopadding">
          {/* Right Portfolio */}
          <div className="col-md-6 padding-right">
            <div className="row">
              {leftPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="col-md-12">
                  <AnimateBox>
                    <Link to={portfolio.link} className="portfolio-grid">
                      <img
                        src={portfolio.image}
                        className="img-responsive"
                        alt={portfolio.title}
                      />
                      <div className="hover-text">Open Portfolio</div>
                      <div className="desc">
                        <h3>{portfolio.title}</h3>
                        <span>{portfolio.location}</span>
                      </div>
                    </Link>
                  </AnimateBox>
                </div>
              ))}
            </div>
          </div>

          {/* Left Portfolio */}
          <div className="col-md-6 padding-left">
            <div className="row">
              {rightPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="col-md-12">
                  <AnimateBox>
                    <Link to={portfolio.link} className="portfolio-grid">
                      <img
                        src={portfolio.image}
                        className="img-responsive"
                        alt={portfolio.title}
                      />
                      <div className="hover-text">Open Portfolio</div>
                      <div className="desc">
                        <h3>{portfolio.title}</h3>
                        <span>{portfolio.location}</span>
                      </div>
                    </Link>
                  </AnimateBox>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio

