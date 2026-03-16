import { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";
import { useContext } from "react";
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
  background: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
`;

// ===============================
// HERO
// ===============================
const Hero = styled.div`
  height: 90vh;
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
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 100px;
  transform: translateY(-50%);
  color: white;
  max-width: 500px;
  h1 {
    font-size: 2.5rem;
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
  transition:
    transform 0.3s,
    box-shadow 0.3s;
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
  padding: 0px;
`;

const Scroll = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8 px;
  }
  &::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius:10px;
  }
`;

const Card = styled.div`
  width: 100%;
  position: relative;
  flex-shrink: 0;

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
height: 100%;
object-fit: cover
  transition:
    transform 0.4s,
    filter 0.5s,
    opacity 0.5s;
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
  border-radius: 5px;

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
  overflow: hidden;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
`;

const CarouselSlide = styled.div`
  width: 100%;
  flex-shrink: 0;
  position: relative;
`;

const SlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const SlideText = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 12px;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
  font-weight: bold;
  border-radius: 5px;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
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
const FeatureCard = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FeatureOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.55),
    rgba(0, 0, 0, 0.15),
    transparent
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  color: white;
`;

const FeatureText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 12px;
  max-width: 300px;
`;

const FeatureLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateX(5px);
    transition: transform 0.3s;
  }
`;
const FeatureTitle = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  margin-top: 20px;
`;

// ===============================
// CAROUSEL COMPONENT
// ===============================
function SwipeCarousel({
  products,
  categorie,
  genre,
  autoplay = true,
  delay = 4000,
}) {
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.genre?.toLowerCase() === genre &&
          p.categorie?.toLowerCase() === categorie,
      ),
    [products, categorie, genre],
  );

  const [current, setCurrent] = useState(0);

  // Autoplay
  useEffect(() => {
    if (!autoplay || filtered.length < 2) return;
    const interval = setInterval(
      () => setCurrent((c) => (c + 1) % filtered.length),
      delay,
    );
    return () => clearInterval(interval);
  }, [filtered, autoplay, delay]);

  const prev = () => setCurrent((c) => (c === 0 ? filtered.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === filtered.length - 1 ? 0 : c + 1));

  if (!filtered.length) return null;

  const imgUrl = (p) =>
    p.images?.[0]?.url.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <CarouselWrapper>
      <Arrow left onClick={prev}>
        <FiChevronLeft />
      </Arrow>
      <Arrow onClick={next}>
        <FiChevronRight />
      </Arrow>
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
  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "light";

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

  const heroProducts = useMemo(
    () => products.filter((p) => p.hero),
    [products],
  );

  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % heroProducts.length),
      3500,
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  const getImg = (p) =>
    p.images?.[0]?.url.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <Wrapper   $isDark={$isDark}>
      {/* HERO */}
      <Hero>
        {heroProducts.map((p, i) => (
          <Slide
            key={p._id}
            $active={i === slide}
            style={{ backgroundImage: `url(${getImg(p)})` }}
          />
        ))}
        <Overlay />
        <HeroText>
          <h1>Nouvelle Collection</h1>
          <HeroBtn to="/collections">Découvrir</HeroBtn>
        </HeroText>
      </Hero>

      {/* SWITCH H/F */}
      <GenreSwitch>
        <GenreBtn active={genre === "homme"} onClick={() => setGenre("homme")}>
          Homme
        </GenreBtn>
        <GenreBtn active={genre === "femme"} onClick={() => setGenre("femme")}>
          Femme
        </GenreBtn>
      </GenreSwitch>

      {/* PRODUITS HORIZONTAUX */}
      <ScrollWrapper>
        <Scroll>
          {products
            .filter((p) => p.genre?.toLowerCase() === genre)
            .slice(0, 6)
            .map((p) => (
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

      <Description>
        Notre collection homme rassemble des pièces uniques de haute qualité,
        confectionnées par des professionnels de la mode.
      </Description>
               {products
        .filter((p) => p.genre?.toLowerCase() === "homme")
        .slice(0, 1)
        .map((p) => (
          <FeatureCard key={p._id}>
            <FeatureImg src={getImg(p)} alt={p.title} />

            <FeatureOverlay>
              <FeatureText>
                Du l'art de la confection à l'excellence du design.
              </FeatureText>

              <FeatureLink to="/homme">
                Pour lui <FaArrowRight />
              </FeatureLink>
            </FeatureOverlay>
          </FeatureCard>
        ))}
        <FeatureTitle>Tendance Homme</FeatureTitle>
      <SwipeCarousel products={products} categorie="haut" genre="homme" />
      <SwipeCarousel products={products} categorie="bas" genre="homme" />
   

     
      <Description>
        Notre collection femme est une ode à l'élégance et à la diversité,
        offrant des pièces qui célèbrent la féminité sous toutes ses formes.
      </Description>
         {products
        .filter((p) => p.genre?.toLowerCase() === "femme")
        .slice(0, 1)
        .map((p) => (
          <FeatureCard key={p._id}>
            <FeatureImg src={getImg(p)} alt={p.title} />

            <FeatureOverlay>
              <FeatureText>
                L'élégance féminine réinventée à travers des créations uniques.
              </FeatureText>

              <FeatureLink to="/femme">
                Pour elle <FaArrowRight />
              </FeatureLink>
            </FeatureOverlay>
          </FeatureCard>
        ))}
         <FeatureTitle>Tendance Femme</FeatureTitle>
      <SwipeCarousel products={products} categorie="haut" genre="femme"  />
      <SwipeCarousel products={products} categorie="bas" genre="femme" />
    </Wrapper>
  );
}
