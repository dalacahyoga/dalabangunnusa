import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const CretyaUbud = () => {
  const images = [
    '/images/portfolio/3.cretya/1.jpeg',
    '/images/portfolio/3.cretya/2.jpeg',
    '/images/portfolio/3.cretya/3.jpeg',
    '/images/portfolio/3.cretya/4.jpeg',
    '/images/portfolio/3.cretya/5.jpeg',
    '/images/portfolio/3.cretya/6.jpeg',
    '/images/portfolio/3.cretya/7.jpeg',
  ]

  return (
    <PortfolioDetail
      title="CRETYA UBUD BALI"
      year="2018"
      location="Gianyar, Bali"
      description="A beautiful resort that combines traditional Balinese architecture with modern luxury. Located in the heart of Ubud, this property offers guests an immersive experience in nature and culture, featuring stunning rice field views, premium amenities, and spaces designed for ultimate relaxation."
      images={images}
    />
  )
}

export default CretyaUbud

