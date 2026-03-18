import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FaArrowRight, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

// ===============================
// SCROLL REVEAL COMPONENT
// ===============================
function RevealOnScroll({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}

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
// WRAPPERS & SECTIONS
// ===============================
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 120px;
  background: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
`;

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
  top: 60%;
  left: 96px;
  transform: translateY(-50%);
  color: white;
  max-width: 500px;
  h1 {
    font-size: 2.1rem;
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
  transition: transform 0.3s;
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

const Description = styled.p`
  text-align: center;
  font-weight: 500;
  padding: 10px 20px;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.5;
`;

// ===============================
// BENEFITS SECTION
// ===============================
const BenefitsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 40px 20px;
  flex-wrap: wrap;
`;

const BenefitCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 220px;
  gap: 12px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-8px);
  }
`;

const BenefitIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: white;
`;

const BenefitTitle = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const BenefitText = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

// ===============================
// COMING SOON CAROUSEL CONTINUOUS
// ===============================
const ComingSoonSection = styled.div`
  text-align: center;
  background: ${({ $isDark }) => ($isDark ? "#1a1a1a" : "#f9f9f9")};
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
  h3 {
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: bold;
    animation: ${fadeUp} 1s ease forwards;
  }
`;

const ComingSoonCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  background: black;
  padding: 40px 0;
  overflow: hidden;
`;

const ComingSoonTrack = styled.div`
  display: flex;
  width: max-content;
  animation: scroll 15s linear infinite;

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const ComingSoonSlide = styled.div`
  flex-shrink: 0;
  width: 300px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ComingSoonImg = styled.img`
  width: 300px;
  height: 400px;
  object-fit: cover;
`;

// Carousel continu
function ComingSoonCarousel({ images = [] }) {
  const loopedImages = [...images, ...images]; // boucle infinie

  return (
    <ComingSoonCarouselContainer>
      <ComingSoonTrack>
        {loopedImages.map((src, i) => (
          <ComingSoonSlide key={i}>
            <ComingSoonImg src={src} alt={`bientot ${i + 1}`} />
          </ComingSoonSlide>
        ))}
      </ComingSoonTrack>
    </ComingSoonCarouselContainer>
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

  const heroProducts = useMemo(
    () => products.filter((p) => p.hero),
    [products]
  );

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
          <h1>NOUVELLE COLLECTION CHEZ NUMA</h1>
          <HeroBtn to="/collections">Découvrir</HeroBtn>
        </HeroText>
      </Hero>

      {/* FEATURE CARDS HOMME */}
      <RevealOnScroll>
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
      </RevealOnScroll>

      {/* FEATURE CARDS FEMME */}
      <RevealOnScroll>
        {products
          .filter((p) => p.genre?.toLowerCase() === "femme")
          .slice(0, 1)
          .map((p) => (
            <FeatureCard key={p._id}>
              <FeatureImg src={getImg(p)} alt={p.title} />
              <FeatureOverlay>
                <FeatureText>
                  L'élégance féminine réinventée à travers des créations
                  uniques.
                </FeatureText>
                <FeatureLink to="/femme">
                  Pour elle <FaArrowRight />
                </FeatureLink>
              </FeatureOverlay>
            </FeatureCard>
          ))}
      </RevealOnScroll>

      {/* BENEFITS */}
      <RevealOnScroll>
        <BenefitsSection>
          <BenefitCard>
            <BenefitIcon style={{ background: "#2563eb" }}>
              <FaTruck />
            </BenefitIcon>
            <BenefitTitle>Livraison gratuite</BenefitTitle>
            <BenefitText>
              Livraison offerte sur toutes vos commandes.
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon style={{ background: "#16a34a" }}>
              <FaShieldAlt />
            </BenefitIcon>
            <BenefitTitle>Paiement en credit</BenefitTitle>
            <BenefitText>
              Transactions protégées et 100% sécurisées. whatsapp: 0700247693
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon style={{ background: "#ea580c" }}>
              <FaUndo />
            </BenefitIcon>
            <BenefitTitle>Retour facile</BenefitTitle>
            <BenefitText>Retour possible sous 7 jours.</BenefitText>
          </BenefitCard>
        </BenefitsSection>
      </RevealOnScroll>

      <Description>
        NUMA offre des pièces uniques avec un design raffiné, des
        matériaux de qualité supérieure et une expérience de mode exclusive.
      </Description>

      {/* BIENTÔT DISPONIBLE */}
      <RevealOnScroll>
        <ComingSoonSection $isDark={$isDark}>
          <h3>Bientôt disponible</h3>
          <ComingSoonCarousel
            images={[
              "/image2.jpeg",
              "/image3.jpeg",
              "/image4.jpeg",
            ]}
          />
        </ComingSoonSection>
      </RevealOnScroll>
    </Wrapper>
  );
}