import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const KiniSebatu = () => {
  const images = [
    '/images/portfolio/5.kinivilla/1.jpg',
    '/images/portfolio/5.kinivilla/2.jpg',
    '/images/portfolio/5.kinivilla/3.jpg',
    '/images/portfolio/5.kinivilla/4.jpg',
    '/images/portfolio/5.kinivilla/5.jpg',
  ]

  return (
    <PortfolioDetail
      title="KINI SEBATU VILLA"
      year="2023"
      location="Gianyar, Bali"
      description="An exclusive villa nestled in the tranquil village of Sebatu, offering guests a private sanctuary surrounded by lush tropical gardens. The villa features contemporary Balinese architecture, luxurious interiors, and world-class amenities for an unforgettable stay."
      images={images}
    />
  )
}

export default KiniSebatu

