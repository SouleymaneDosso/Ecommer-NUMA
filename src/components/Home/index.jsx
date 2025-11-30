import styled from "styled-components";
import { produits } from "../../data/produits";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

/* ---------------------------------------------- */
/*  STYLES                                         */
/* ---------------------------------------------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 80px;
`;

/* HERO */
const Hero = styled.div`
  height: 70vh;
  width: 100%;
  background-image: url("/hero.jpg"); /* mets une image dans public/hero.jpg */
  background-size: cover;
  background-position: center;
  position: relative;

  display: flex;
  align-items: center;
  padding-left: 60px;
  color: #fff;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0));
  }
`;

const HeroText = styled.div`
  position: relative;
  z-index: 2;

  h1 {
    font-size: 3.5rem;
    margin: 0;
  }
  p {
    margin-top: 12px;
    font-size: 1.2rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  padding: 12px 24px;
  background: #fff;
  color: #000;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.25s;

  &:hover {
    transform: translateX(6px);
  }
`;

/* SLIDER */
const SliderContainer = styled.div`
  width: 100%;
  height: 380px;
  overflow: hidden;
  position: relative;
`;

const SlideRow = styled.div`
  display: flex;
  height: 100%;
  width: 400%;
  animation: scroll 14s linear infinite;

  @keyframes scroll {
    0% { transform: translateX(0); }
    25% { transform: translateX(-100%); }
    50% { transform: translateX(-200%); }
    75% { transform: translateX(-300%); }
    100% { transform: translateX(0%); }
  }
`;

const Slide = styled.div`
  flex: 1;
  background-size: cover;
  background-position: center;
`;

/* Nouveautés */
const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-left: 20px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 20px;
`;

const Card = styled(Link)`
  min-width: 220px;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: ${({ theme }) => theme.card};

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
  }

  p {
    padding: 8px;
    font-weight: 600;
  }
`;

/* Lifestyle sections */
const Lifestyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 40px;
  gap: 40px;

  img {
    width: 100%;
    border-radius: 16px;
  }

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const LifestyleText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 2rem;
  }

  p {
    margin-top: 10px;
    opacity: 0.8;
  }
`;

const DiscoverBtn = styled(Link)`
  margin-top: 20px;
  width: fit-content;
  padding: 10px 20px;
  border-radius: 12px;
  background: black;
  color: white;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateX(6px);
  }
`;

/* Promotions */
const Promo = styled.div`
  padding: 20px 40px;

  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
  gap: 24px;

  img {
    width: 100%;
    border-radius: 12px;
  }
`;


/* ---------------------------------------------- */
/*  PAGE ACCUEIL                                    */
/* ---------------------------------------------- */

export default function Home() {

  const nouveautes = produits.filter(p => p.badge === "new");
  const promos = produits.filter(p => p.badge === "promo");

  return (
    <Wrapper>

      {/* HERO */}
      <Hero>
        <HeroText>
          <h1>Nouvelle Collection 2025</h1>
          <p>Découvrez les dernières tendances homme & femme.</p>
          <HeroButton to="/collections">
            Explorer <FiChevronRight/>
          </HeroButton>
        </HeroText>
      </Hero>

      {/* CARROUSEL AUTOMATIQUE */}
      <SliderContainer>
        <SlideRow>
          <Slide style={{ backgroundImage: "url('/image1.jpg')" }} />
          <Slide style={{ backgroundImage: "url('/image2.jpg')" }} />
          <Slide style={{ backgroundImage: "url('/image3.jpg')" }} />
          <Slide style={{ backgroundImage: "url('/image4.jpg')" }} />
          <Slide style={{ backgroundImage: "url('/image5.jpg')" }} />
          <Slide style={{ backgroundImage: "url('/image6.jpg')" }} />
          <Slide style={{ backgroundImage: "url('/image7.jpg')" }} />
        </SlideRow>
      </SliderContainer>

      {/* NOUVEAUTES */}
      <SectionTitle>Nouveautés</SectionTitle>
      <HorizontalScroll>
        {nouveautes.map((p) => (
          <Card key={p.id} to={`/produit/${p.id}`}>
            <img src={p.image} alt={p.title} />
            <p>{p.title} – {p.price}€</p>
          </Card>
        ))}
      </HorizontalScroll>

      {/* LIFESTYLE SECTIONS */}
      <Lifestyle>
        <img src="/image2.jpg" alt="fashion" />
        <LifestyleText>
          <h3>Style minimaliste</h3>
          <p>Des pièces intemporelles pour exprimer votre identité.</p>
          <DiscoverBtn to="/collections">Découvrir</DiscoverBtn>
        </LifestyleText>
      </Lifestyle>

      <Lifestyle>
        <LifestyleText>
          <h3>Élégance moderne</h3>
          <p>La mode pensée pour sublimer chaque silhouette.</p>
          <DiscoverBtn to="/collections">Explorer</DiscoverBtn>
        </LifestyleText>
        <img src="/image1.jpg" alt="style" />
      </Lifestyle>

      {/* PROMOTIONS */}
      <SectionTitle>Promotions</SectionTitle>
      <Promo>
        {promos.map((p) => (
          <Card key={p.id} to={`/produit/${p.id}`}>
            <img src={p.image} alt={p.title} />
            <p>{p.title} – {p.price}€</p>
          </Card>
        ))}
      </Promo>

    </Wrapper>
  );
}
