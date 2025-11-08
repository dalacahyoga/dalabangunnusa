import PortfolioDetail from '../../components/PortfolioDetail/PortfolioDetail'

const KuberDayClub = () => {
  const images = [
    '/images/portfolio/6.kuberdayclub/1.PNG',
    '/images/portfolio/6.kuberdayclub/2.PNG',
    '/images/portfolio/6.kuberdayclub/3.PNG',
    '/images/portfolio/6.kuberdayclub/4.PNG',
    '/images/portfolio/6.kuberdayclub/5.PNG',
    '/images/portfolio/6.kuberdayclub/6.PNG',
    '/images/portfolio/6.kuberdayclub/7.PNG',
    '/images/portfolio/6.kuberdayclub/8.PNG',
  ]

  return (
    <PortfolioDetail
      title="KUBER DAY CLUB"
      year="2024"
      location="Gianyar, Bali"
      description="A vibrant day club designed for relaxation and entertainment. Featuring a stunning infinity pool, cabanas, and modern facilities, Kuber Day Club offers guests a premium experience with breathtaking views and exceptional service in a sophisticated tropical setting."
      images={images}
    />
  )
}

export default KuberDayClub

