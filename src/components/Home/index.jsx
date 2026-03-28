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
      { threshold: 0.15 }
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
        transition: "all 0.9s ease",
      }}
    >
      {children}
    </div>
  );
}

// ===============================
// ANIMATIONS
// ===============================
const fadeIn = keyframes`
  from {opacity:0;}
  to {opacity:1;}
`;

const slowZoom = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.08); }
`;

const floatUp = keyframes`
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// ===============================
// WRAPPERS & SECTIONS
// ===============================
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 110px;
  padding-bottom: 120px;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(to bottom, #0b0b0b, #111, #161616)"
      : "linear-gradient(to bottom, #fff, #f8f8f8, #fff)"};
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 26px;
  padding: 0 20px;

  span {
    display: inline-block;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 12px;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 12px;
    font-weight: 700;
  }

  p {
    max-width: 760px;
    margin: 0 auto;
    opacity: 0.75;
    line-height: 1.7;
  }
`;

// ===============================
// HERO
// ===============================
const Hero = styled.div`
  height: 100vh;
  min-height: 720px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 620px;
    height: 90vh;
  }
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  animation: ${slowZoom} 8s linear infinite alternate;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.62),
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.18)
  );
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 7%;
  z-index: 2;
`;

const HeroText = styled.div`
  color: white;
  max-width: 700px;
  animation: ${floatUp} 1s ease forwards;

  h1 {
    font-size: clamp(2.6rem, 5vw, 5rem);
    line-height: 1.05;
    margin-bottom: 18px;
    animation: ${fadeIn} 1.2s ease forwards;
  }

  p {
    font-size: 1.08rem;
    line-height: 1.8;
    max-width: 600px;
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.3rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const HeroBadge = styled.div`
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.82rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const HeroBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: 999px;
  background: white;
  color: black;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);

  &:hover {
    transform: translateY(-3px) scale(1.02);
  }
`;

const HeroGhostBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.14);
  }
`;

// ===============================
// FEATURE CARDS
// ===============================
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  width: min(1240px, 92%);
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const FeatureOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 38px;
  color: hsl(0, 0%, 53%);
`;

const FeatureText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 16px;
  max-width: 360px;
  line-height: 1.7;
`;

const FeatureLink = styled(Link)`
  color: hsl(0, 0%, 53%);
  text-decoration: none;
  font-weight: bold;
  font-size: 1.05rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding-bottom: 3px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);

  &:hover {
    transform: translateX(6px);
    transition: transform 0.3s;
  }
`;

// ===============================
// MINI CAROUSEL AVEC DOT FONCTIONNEL
// ===============================
const MiniCarouselSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const MiniCarouselWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const MiniCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 620px;
  overflow: hidden;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);

  @media (max-width: 768px) {
    height: 420px;
  }
`;

const MiniSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 0.8s ease;
  pointer-events: ${(p) => (p.$active ? "auto" : "none")};
`;

const MiniSlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const MiniOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.25);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MiniInfo = styled.div`
  color: white;

  h3 {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  p {
    font-size: 1.15rem;
    font-weight: 500;
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.3rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

const MiniCTA = styled(Link)`
  padding: 14px 24px;
  background: white;
  color: black;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const DotWrapper = styled.div`
  width: 60px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin: 16px auto 0;
  overflow: hidden;
`;

const DotFill = styled.div`
  height: 100%;
  background: black;
  width: ${(p) => p.$width}%;
  transition: width 0.1s linear;
`;

// ===============================
// BENEFITS
// ===============================
const BenefitsSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  gap: 16px;
  background: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.35s ease;
`;

const BenefitIcon = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
`;

const BenefitTitle = styled.div`
  font-weight: 700;
  font-size: 1.15rem;
`;

const BenefitText = styled.div`
  font-size: 0.96rem;
  opacity: 0.82;
  line-height: 1.7;
`;

const Description = styled.p`
  text-align: center;
  font-weight: 500;
  padding: 0 20px;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.9;
  font-size: 1.05rem;
  opacity: 0.85;
`;

// ===============================
// MAIN COMPONENT
// ===============================
export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [slide, setSlide] = useState(0);
  const [miniSlide, setMiniSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "light";
  const intervalRef = useRef(null);
  const duration = 3800;

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
  const carouselProducts = useMemo(() => products.slice(0, 5), [products]);

  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(() => setSlide((s) => (s + 1) % heroProducts.length), 4000);
    return () => clearInterval(interval);
  }, [heroProducts]);

  // MINI CAROUSEL DOT PROGRESS
  useEffect(() => {
    if (carouselProducts.length <= 1) return;
    const step = 100 / (duration / 50);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setMiniSlide((s) => (s + 1) % carouselProducts.length);
          return 0;
        }
        return prev + step;
      });
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [carouselProducts.length]);

  const getImg = (p) =>
    p.images?.[0]?.url?.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images?.[0]?.url || ""}`;

  return (
    <Wrapper $isDark={$isDark}>
      {/* HERO */}
      <Hero>
        {heroProducts.map((p, i) => (
          <Slide key={p._id} $active={i === slide} style={{ backgroundImage: `url(${getImg(p)})` }} />
        ))}
        <Overlay />
        <HeroContent>
          <HeroText>
            <HeroBadge>Nouvelle saison • Numa</HeroBadge>
            <h1>Une mode pensée pour séduire au premier regard.</h1>
            <p>
              Découvrez une sélection raffinée de pièces élégantes, modernes et conçues pour sublimer votre présence.
            </p>
            <HeroActions>
              <HeroBtn to="/collections">
                Explorer la collection <FaArrowRight />
              </HeroBtn>
              <HeroGhostBtn to="/new">Voir les nouveautés</HeroGhostBtn>
            </HeroActions>
          </HeroText>
        </HeroContent>
      </Hero>

      {/* FEATURE CARDS */}
      <RevealOnScroll>
        <SectionHeader>
          <span>Univers</span>
          <h2>Des silhouettes qui imposent le style</h2>
          <p>Deux univers, une seule signature : l’élégance, la présence et le détail qui fait la différence.</p>
        </SectionHeader>

        <FeatureGrid>
          {products.filter((p) => p.genre?.toLowerCase() === "homme").slice(0, 1).map((p) => (
            <FeatureCard key={p._id}>
              <FeatureImg src={getImg(p)} alt={p.title} />
              <FeatureOverlay>
                <FeatureText>Pour l’homme qui veut une allure forte et assumée.</FeatureText>
                <FeatureLink to="/homme">Découvrir l’univers homme <FaArrowRight /></FeatureLink>
              </FeatureOverlay>
            </FeatureCard>
          ))}

          {products.filter((p) => p.genre?.toLowerCase() === "femme").slice(0, 1).map((p) => (
            <FeatureCard key={p._id}>
              <FeatureImg src={getImg(p)} alt={p.title} />
              <FeatureOverlay>
                <FeatureText>Pour la femme qui veut captiver avec confiance et élégance.</FeatureText>
                <FeatureLink to="/femme">Découvrir l’univers femme <FaArrowRight /></FeatureLink>
              </FeatureOverlay>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </RevealOnScroll>

      {/* MINI CAROUSEL */}
      <RevealOnScroll>
        <MiniCarouselSection>
          <MiniCarouselWrapper>
            <MiniCarousel>
              {carouselProducts.map((p, i) => (
                <MiniSlide key={p._id} $active={i === miniSlide}>
                  <MiniSlideImg src={getImg(p)} alt={p.title} />
                  <MiniOverlay>
                    <MiniInfo>
                      <h3>{p.title}</h3>
                      <p>{p.subtitle || ""}</p>
                    </MiniInfo>
                    <MiniCTA to={`/produit/${p._id}`}>Voir le produit</MiniCTA>
                  </MiniOverlay>
                </MiniSlide>
              ))}
            </MiniCarousel>
            <DotWrapper>
              <DotFill $width={progress} />
            </DotWrapper>
          </MiniCarouselWrapper>
        </MiniCarouselSection>
      </RevealOnScroll>

      {/* BENEFITS */}
      <RevealOnScroll>
        <SectionHeader>
          <span>Avantages</span>
          <h2>Pourquoi choisir Numa ?</h2>
          <Description>Chaque pièce est pensée pour allier style, confort et durabilité. La signature Numa, c’est l’assurance d’un vêtement qui vous accompagne au quotidien.</Description>
        </SectionHeader>

        <BenefitsSection>
          <BenefitCard $isDark={$isDark}>
            <BenefitIcon><FaTruck /></BenefitIcon>
            <BenefitTitle>Livraison rapide</BenefitTitle>
            <BenefitText>Recevez vos articles en un temps record, soigneusement emballés pour vous.</BenefitText>
          </BenefitCard>

          <BenefitCard $isDark={$isDark}>
            <BenefitIcon><FaShieldAlt /></BenefitIcon>
            <BenefitTitle>Paiement sécurisé</BenefitTitle>
            <BenefitText>Vos transactions sont cryptées et protégées pour une tranquillité totale.</BenefitText>
          </BenefitCard>

          <BenefitCard $isDark={$isDark}>
            <BenefitIcon><FaUndo /></BenefitIcon>
            <BenefitTitle>Retour facile</BenefitTitle>
            <BenefitText>Si un produit ne vous convient pas, retournez-le simplement et rapidement.</BenefitText>
          </BenefitCard>
        </BenefitsSection>
      </RevealOnScroll>
    </Wrapper>
  );
}