import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const AbianTaksu = () => {
  const images = [
    '/images/portfolio/1.villaabiantaksu/1.jpeg',
    '/images/portfolio/1.villaabiantaksu/2.jpeg',
    '/images/portfolio/1.villaabiantaksu/3.jpeg',
    '/images/portfolio/1.villaabiantaksu/4.jpeg',
    '/images/portfolio/1.villaabiantaksu/5.jpeg',
    '/images/portfolio/1.villaabiantaksu/6.jpeg',
    '/images/portfolio/1.villaabiantaksu/7.jpeg',
    '/images/portfolio/1.villaabiantaksu/8.jpeg',
    '/images/portfolio/1.villaabiantaksu/9.jpeg',
    '/images/portfolio/1.villaabiantaksu/10.jpeg',
  ]

  return (
    <PortfolioDetail
      title="ABIAN TAKSU VILLA"
      year="2017"
      location="Gianyar, Bali"
      description="This villa is located in a prime area of Bali, offering modern comfort with stunning views of nature. Designed with elegant touches, it features luxurious amenities, a private swimming pool, and spacious open areas. The perfect retreat for relaxation and an exclusive getaway."
      images={images}
    />
  )
}

export default AbianTaksu

