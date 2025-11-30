import { ThemeContext } from '../../Utils/Context';
import { useContext } from "react";
import styled, { keyframes } from 'styled-components';
import { FiShoppingBag } from "react-icons/fi";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeWrapper = styled.div`
  min-height: 100vh;
  background: ${({ $isdark }) => $isdark ? '#0D192B' : '#f8f9fb'};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  transition: background 0.5s ease;
`;

const HeroCard = styled.div`
  background: ${({ $isdark }) => $isdark ? '#1E2A44' : '#ffffff'};
  color: ${({ $isdark }) => $isdark ? '#e6eefc' : '#222'};
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: ${({ $isdark }) => $isdark ? '0 15px 35px rgba(2,6,23,0.5)' : '0 15px 35px rgba(15,23,42,0.15)'};
  max-width: 700px;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease forwards;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
`;

const FeaturedProducts = styled.div`
  margin-top: 3rem;
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  background: ${({ $isdark }) => $isdark ? '#15263C' : '#ffffff'};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.15);
  }

  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
  }

  div.info {
    padding: 0.8rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  div.info h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  div.info span {
    font-weight: 700;
    color: ${({ $isdark }) => $isdark ? '#a5b4fc' : '#4f46e5'};
  }
`;

function Home() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  const featured = [
    { title: "T-shirt Streetwear", price: "29€", img: "https://via.placeholder.com/300x220" },
    { title: "Veste Classique", price: "99€", img: "https://via.placeholder.com/300x220" },
    { title: "Pantalon Casual", price: "59€", img: "https://via.placeholder.com/300x220" },
    { title: "Chaussures Sport", price: "79€", img: "https://via.placeholder.com/300x220" },
  ];

  return (
    <HomeWrapper $isdark={$isdark}>
      <HeroCard $isdark={$isdark}>
        <h1>Bienvenue chez NumaShop</h1>
        <p>Découvrez nos collections modernes et tendance de vêtements pour tous les styles.</p>
      </HeroCard>

      <FeaturedProducts>
        {featured.map((item, i) => (
          <ProductCard key={i} $isdark={$isdark}>
            <img src={item.img} alt={item.title} />
            <div className="info">
              <h4>{item.title}</h4>
              <span>{item.price}</span>
            </div>
          </ProductCard>
        ))}
      </FeaturedProducts>
    </HomeWrapper>
  );
}

export default Home;

