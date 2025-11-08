import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const FilowUbud = () => {
  const images = [
    '/images/portfolio/4.filowubud/1.jpeg',
    '/images/portfolio/4.filowubud/2.jpeg',
    '/images/portfolio/4.filowubud/3.jpeg',
    '/images/portfolio/4.filowubud/4.jpeg',
    '/images/portfolio/4.filowubud/5.jpeg',
  ]

  return (
    <PortfolioDetail
      title="HOSTEL FILOW IN UBUD"
      year="2015"
      location="Gianyar, Bali"
      description="A modern hostel designed for backpackers and travelers seeking affordable yet stylish accommodation. With comfortable dormitories, social spaces, and contemporary design, Hostel Filow provides the perfect base for exploring Ubud's artistic and cultural attractions."
      images={images}
    />
  )
}

export default FilowUbud

