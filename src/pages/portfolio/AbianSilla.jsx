import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const AbianSilla = () => {
  const images = [
    '/images/portfolio/2.abiansilla/1.jpeg',
    '/images/portfolio/2.abiansilla/2.jpeg',
    '/images/portfolio/2.abiansilla/3.jpeg',
    '/images/portfolio/2.abiansilla/4.jpeg',
    '/images/portfolio/2.abiansilla/5.jpeg',
  ]

  return (
    <PortfolioDetail
      title="ABIAN SILA ADVENTURE"
      year="2018"
      location="Gianyar, Bali"
      description="We specialize in designing and building one-of-a-kind adventure-themed spaces combined with stylish pool bars. Our projects create exciting, immersive environments where guests can enjoy both thrilling activities and relaxing moments by the pool. With a focus on high-quality materials and innovative design, we deliver dynamic, functional spaces that enhance both adventure and leisure."
      images={images}
    />
  )
}

export default AbianSilla

