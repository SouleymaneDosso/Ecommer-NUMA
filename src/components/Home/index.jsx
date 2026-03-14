import { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// ===============================
// ANIMATIONS
// ===============================
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from {opacity:0;}
  to {opacity:1;}
`;

// ===============================
// WRAPPERS
// ===============================
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 120px;
  background: #fafafa;
`;

// ===============================
// HERO
// ===============================
const Hero = styled.div`
  height: 75vh;
  position: relative;
  overflow: hidden;
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  filter: blur(1px) brightness(0.85);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  color: white;
  max-width: 500px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);

  h1 {
    font-size: 3rem;
    animation: ${fadeIn} 1.2s ease forwards;
  }
`;

const HeroBtn = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 14px 26px;
  background: white;
  color: black;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  &:hover {
    transform: scale(1.05);
  }
`;

// ===============================
// SWITCH H/F
// ===============================
const GenreSwitch = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  font-weight: 600;
  font-size: 1.3rem;
`;

const GenreBtn = styled.div`
  cursor: pointer;
  border-bottom: ${(p) => (p.active ? "3px solid black" : "none")};
  padding-bottom: 5px;
  transition: border 0.3s;
`;

// ===============================
// PRODUITS HORIZONTAUX
// ===============================
const ScrollWrapper = styled.div`
  padding: 0 40px;
`;

const Scroll = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

const Card = styled.div`
  min-width: 230px;
  position: relative;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  animation: ${fadeUp} 0.5s ease forwards;

  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s;
  }
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  transition: transform 0.4s, filter 0.5s, opacity 0.5s;
  filter: blur(10px);
  opacity: 0;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.p`
  text-align: center;
  font-weight: 600;
  margin-top: 8px;
`;

const Price = styled.p`
  text-align: center;
  color: #555;
`;

const CartBtn = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: black;
  color: white;
  border: none;
  padding: 8px;
  opacity: 0;
  cursor: pointer;
  border-radius: 6px;

  ${Card}:hover & {
    opacity: 1;
  }
`;

// ===============================
// CAROUSEL SWIPE HAUT/BAS
// ===============================
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  overflow: hidden;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const CarouselSlide = styled.div`
  min-width: 80%;
  margin: 0 10%;
  position: relative;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const SlideImg = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const SlideText = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(0,0,0,0.4);
  padding: 8px 12px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: white;
  cursor: pointer;
  z-index: 10;
  ${(p) => (p.left ? "left: 5px;" : "right: 5px;")}
  user-select: none;
`;

// ===============================
// DESCRIPTION
// ===============================
const Description = styled.p`
  text-align: center;
  font-weight: 500;
  padding: 10px 20px;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.5;
`;


const PremiumGenreLink = styled(Link)`
  padding: 12px 24px;
  margin: 0 10px;
  font-weight: 700;
  font-size: 1.15rem;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(135deg, #ff7e5f, #feb47b); /* joli gradient */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  }

  &.active {
    background: linear-gradient(135deg, #6a11cb, #2575fc); /* couleur active différente */
    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
  }

  /* Optionnel : effet de survol “glow” */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

// ===============================
// CAROUSEL COMPONENT
// ===============================
function SwipeCarousel({ products, categorie, genre, autoplay = true, delay = 4000 }) {
  const filtered = useMemo(() =>
    products.filter(p => p.genre?.toLowerCase() === genre && p.categorie?.toLowerCase() === categorie)
  , [products, categorie, genre]);

  const [current, setCurrent] = useState(0);

  // Autoplay
  useEffect(() => {
    if (!autoplay || filtered.length < 2) return;
    const interval = setInterval(() => setCurrent((c) => (c + 1) % filtered.length), delay);
    return () => clearInterval(interval);
  }, [filtered, autoplay, delay]);

  const prev = () => setCurrent((c) => (c === 0 ? filtered.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === filtered.length - 1 ? 0 : c + 1));

  if (!filtered.length) return null;

  const imgUrl = (p) => p.images?.[0]?.url.startsWith("http") ? p.images[0].url : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <CarouselWrapper>
      <Arrow left onClick={prev}><FiChevronLeft /></Arrow>
      <Arrow onClick={next}><FiChevronRight /></Arrow>
      <CarouselTrack style={{ transform: `translateX(-${current * 100}%)` }}>
        {filtered.map((p) => (
          <CarouselSlide key={p._id}>
            <SlideImg src={imgUrl(p)} alt={p.title} />
            <SlideText>{categorie.toUpperCase()}</SlideText>
          </CarouselSlide>
        ))}
      </CarouselTrack>
    </CarouselWrapper>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================
export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [genre, setGenre] = useState("homme");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const heroProducts = useMemo(() => products.filter((p) => p.hero), [products]);

  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(() => setSlide((s) => (s + 1) % heroProducts.length), 3500);
    return () => clearInterval(interval);
  }, [heroProducts]);

  const getImg = (p) => p.images?.[0]?.url.startsWith("http") ? p.images[0].url : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <Wrapper>
      {/* HERO */}
      <Hero>
        {heroProducts.map((p, i) => (
          <Slide key={p._id} $active={i === slide} style={{ backgroundImage: `url(${getImg(p)})` }} />
        ))}
        <Overlay />
        <HeroText>
          <h1>Nouvelle Collection</h1>
          <HeroBtn to="/collections">Découvrir</HeroBtn>
        </HeroText>
      </Hero>

      {/* SWITCH H/F */}
      <GenreSwitch>
        <GenreBtn active={genre === "homme"} onClick={() => setGenre("homme")}>Homme</GenreBtn>
        <GenreBtn active={genre === "femme"} onClick={() => setGenre("femme")}>Femme</GenreBtn>
      </GenreSwitch>

      {/* PRODUITS HORIZONTAUX */}
      <ScrollWrapper>
        <Scroll>
          {products.filter(p => p.genre?.toLowerCase() === genre).slice(0, 6).map(p => (
            <Card key={p._id}>
              <ProductLink to={`/produit/${p._id}`}>
                <ProductImg
                  src={getImg(p)}
                  alt={p.title}
                  onLoad={(e) => {
                    e.currentTarget.style.filter = "blur(0)";
                    e.currentTarget.style.opacity = 1;
                  }}
                />
                <Title>{p.title}</Title>
                <Price>{p.price} FCFA</Price>
              </ProductLink>
              <CartBtn>
                <FiShoppingCart />
              </CartBtn>
            </Card>
          ))}
        </Scroll>
      </ScrollWrapper>

      {/* COLLECTIONS HAUT / BAS */}
      <PremiumGenreLink to={"/homme"}>homme</PremiumGenreLink>
      <Description>
        Notre collection homme rassemble des pièces uniques de haute qualité, confectionnées par des professionnels de la mode.
      </Description>
      <SwipeCarousel products={products} categorie="haut" genre="homme" />
      <SwipeCarousel products={products} categorie="bas" genre="homme" />
      
          <PremiumGenreLink to={"/femme"}>femme</PremiumGenreLink>
      <Description>
        Notre collection femme est une ode à l'élégance et à la diversité, offrant des pièces qui célèbrent la féminité sous toutes ses formes.
      </Description>
      <SwipeCarousel products={products} categorie="haut" genre="femme" />
      <SwipeCarousel products={products} categorie="bas" genre="femme" />
    </Wrapper>
  );
}