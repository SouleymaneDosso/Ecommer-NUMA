import { useState, useEffect, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

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
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;


// ===============================
// FEATURE CARDS
// ===============================
const FeatureCard = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  padding: 0 5%;
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

const Description = styled.p`
  text-align: center;
  font-weight: 500;
  padding: 10px 20px;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.5;
`;

// ===============================
// DOT CAROUSEL
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

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => (p.active ? "#111" : "#ccc")};
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  transform: scale(${(p) => (p.active ? 1.3 : 1)});
`;

function DotCarousel({ products, categorie, genre, delay = 4000 }) {
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.genre?.toLowerCase() === genre &&
          p.categorie?.toLowerCase() === categorie
      ),
    [products, categorie, genre]
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (filtered.length < 2) return;
    const interval = setInterval(() => setCurrent((c) => (c + 1) % filtered.length), delay);
    return () => clearInterval(interval);
  }, [filtered, delay]);

  if (!filtered.length) return null;

  const imgUrl = (p) =>
    p.images?.[0]?.url.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <div>
      <CarouselWrapper>
        <CarouselTrack style={{ transform: `translateX(-${current * 100}%)` }}>
          {filtered.map((p) => (
            <CarouselSlide key={p._id}>
              <SlideImg src={imgUrl(p)} alt={p.title} />
            </CarouselSlide>
          ))}
        </CarouselTrack>
      </CarouselWrapper>

      <ProgressDots>
        {filtered.map((_, i) => (
          <Dot key={i} active={i === current} onClick={() => setCurrent(i)} />
        ))}
      </ProgressDots>
    </div>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================
export default function HomePremium() {
  const [products, setProducts] = useState([]);
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

  const heroProducts = useMemo(() => products.filter((p) => p.hero), [products]);

  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % heroProducts.length),
      3500
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  const getImg = (p) =>
    p.images?.[0]?.url.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <Wrapper $isDark={$isDark}>
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
          <h1>Nouvelle Collection 2026</h1>
          <HeroBtn to="/collections">Découvrir</HeroBtn>
        </HeroText>
      </Hero>
      {/* COLLECTION HOMME */}
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
      <DotCarousel products={products} categorie="haut" genre="homme" />
      <DotCarousel products={products} categorie="bas" genre="homme" />

      {/* COLLECTION FEMME */}
      <Description>
        NUMA a pour objectif d'apporter plus d'originalité et de classe a la mode.
        avec des pieces uniques et des vetements soignés.
      </Description>
    </Wrapper>
  );
}