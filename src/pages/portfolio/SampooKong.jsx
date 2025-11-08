import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const SampooKong = () => {
  const images = [
    '/images/portfolio/7.sampookong/1.jpg',
    '/images/portfolio/7.sampookong/2.jpg',
    '/images/portfolio/7.sampookong/3.jpg',
    '/images/portfolio/7.sampookong/4.jpg',
    '/images/portfolio/7.sampookong/5.jpg',
    '/images/portfolio/7.sampookong/6.jpg',
    '/images/portfolio/7.sampookong/7.jpg',
    '/images/portfolio/7.sampookong/8.jpg',
    '/images/portfolio/7.sampookong/9.jpg',
    '/images/portfolio/7.sampookong/10.JPG',
    '/images/portfolio/7.sampookong/11.jpg',
    '/images/portfolio/7.sampookong/12.jpg',
    '/images/portfolio/7.sampookong/13.jpg',
    '/images/portfolio/7.sampookong/14.JPG',
  ]

  return (
    <PortfolioDetail
      title="SAM POO KONG"
      year="2003"
      location="Semarang, Central Java"
      description="A sacred temple restoration and construction project that honors Chinese-Javanese heritage. This project showcases our expertise in traditional temple architecture, combining historical authenticity with modern construction techniques to preserve cultural legacy for future generations."
      images={images}
    />
  )
}

export default SampooKong

