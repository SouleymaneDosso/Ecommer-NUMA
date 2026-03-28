import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
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

const miniProgress = keyframes`
  from { width: 0%; }
  to { width: 100%; }
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
  height: 650px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 28px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);

  &:hover img {
    transform: scale(1.06);
  }

  @media (max-width: 768px) {
    height: 460px;
  }
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s ease;
`;

const FeatureOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72),
    rgba(0, 0, 0, 0.25),
    transparent
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 38px;
  color: white;
`;

const FeatureText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 16px;
  max-width: 360px;
  line-height: 1.7;
`;

const FeatureLink = styled(Link)`
  color: white;
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
// MINI CAROUSEL (5 IMAGES)
// ===============================
const MiniCarouselSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const MiniCarouselWrapper = styled.div`
  width: 100%;
`;

const MiniCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 620px;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);

  @media (max-width: 768px) {
    height: 420px;
    border-radius: 22px;
  }
`;

const MiniSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transform: ${(p) => (p.$active ? "scale(1)" : "scale(1.04)")};
  transition: opacity 0.8s ease, transform 0.8s ease;
  pointer-events: ${(p) => (p.$active ? "auto" : "none")};
`;

const MiniSlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MiniOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72),
    rgba(0, 0, 0, 0.18),
    transparent
  );
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 34px;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 22px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
  }
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
  border-radius: 999px;
  background: white;
  color: black;
  text-decoration: none;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.16);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.26);
    transform: translateY(-50%) scale(1.06);
  }

  &:first-of-type {
    left: 18px;
  }

  &:last-of-type {
    right: 18px;
  }

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.12);
  margin-top: 16px;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};
  border-radius: 999px;
  animation: ${miniProgress} 3.8s linear forwards;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
`;

const Dot = styled.button`
  width: ${(p) => (p.$active ? "30px" : "10px")};
  height: 10px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ $active, $isDark }) =>
    $active ? ($isDark ? "#fff" : "#111") : "rgba(150,150,150,0.35)"};
  transition: all 0.3s ease;
`;

const ThumbsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-top: 22px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 90px);
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;

const Thumb = styled.button`
  border: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: 16px;
  position: relative;
  opacity: ${(p) => (p.$active ? 1 : 0.7)};
  transform: ${(p) => (p.$active ? "scale(1)" : "scale(0.98)")};
  transition: all 0.3s ease;
  box-shadow: ${(p) =>
    p.$active ? "0 10px 30px rgba(0,0,0,0.15)" : "none"};

  &:hover {
    opacity: 1;
    transform: scale(1);
  }

  img {
    width: 100%;
    height: 95px;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    min-width: 90px;
  }
`;

// ===============================
// BENEFITS SECTION
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
  border-radius: 26px;
  gap: 16px;
  background: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"};
  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.35s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const BenefitIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 20px;
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
  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "dark";

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

  const carouselProducts = useMemo(() => products.slice(0, 5), [products]);

  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % heroProducts.length),
      4000
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  useEffect(() => {
    if (carouselProducts.length <= 1) return;

    const interval = setInterval(() => {
      setMiniSlide((prev) => (prev + 1) % carouselProducts.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [carouselProducts]);

  const getImg = (p) =>
    p.images?.[0]?.url?.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images?.[0]?.url || ""}`;

  const prevMini = () => {
    setMiniSlide((prev) =>
      prev === 0 ? carouselProducts.length - 1 : prev - 1
    );
  };

  const nextMini = () => {
    setMiniSlide((prev) => (prev + 1) % carouselProducts.length);
  };

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
        <HeroContent>
          <HeroText>
            <HeroBadge>Nouvelle saison • Numa</HeroBadge>
            <h1>Une mode pensée pour séduire au premier regard.</h1>
            <p>
              Découvrez une sélection raffinée de pièces élégantes, modernes
              et conçues pour sublimer votre présence avec caractère.
            </p>
            <HeroActions>
              <HeroBtn to="/collections">
                Explorer la collection <FaArrowRight />
              </HeroBtn>
              <HeroGhostBtn to="/nouveautes">Voir les nouveautés</HeroGhostBtn>
            </HeroActions>
          </HeroText>
        </HeroContent>
      </Hero>

      {/* HOMME / FEMME */}
      <RevealOnScroll>
        <SectionHeader>
          <span>Univers</span>
          <h2>Des silhouettes qui imposent le style</h2>
          <p>
            Deux univers, une seule signature : l’élégance, la présence et le
            détail qui fait toute la différence.
          </p>
        </SectionHeader>

        <FeatureGrid>
          {products
            .filter((p) => p.genre?.toLowerCase() === "homme")
            .slice(0, 1)
            .map((p) => (
              <FeatureCard key={p._id}>
                <FeatureImg src={getImg(p)} alt={p.title} />
                <FeatureOverlay>
                  <FeatureText>
                    Pour l’homme qui veut une allure forte, nette et assumée.
                  </FeatureText>
                  <FeatureLink to="/homme">
                    Découvrir l’univers homme <FaArrowRight />
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
                    Une élégance féminine pensée pour captiver avec finesse.
                  </FeatureText>
                  <FeatureLink to="/femme">
                    Découvrir l’univers femme <FaArrowRight />
                  </FeatureLink>
                </FeatureOverlay>
              </FeatureCard>
            ))}
        </FeatureGrid>
      </RevealOnScroll>

      {/* MINI CAROUSEL */}
      <RevealOnScroll>
        <MiniCarouselSection>
          <SectionHeader>
            <span>Sélection</span>
            <h2>Nos pièces les plus désirées</h2>
            <p>
              Une sélection visuelle forte, conçue pour attirer, convaincre et
              donner envie de cliquer.
            </p>
          </SectionHeader>

          <MiniCarouselWrapper>
            <MiniCarousel>
              {carouselProducts.map((p, i) => (
                <MiniSlide key={p._id} $active={i === miniSlide}>
                  <MiniSlideImg src={getImg(p)} alt={p.title} />
                  <MiniOverlay>
                    <MiniInfo>
                      <h3>{p.title}</h3>
                      <p>{p.price} FCFA</p>
                    </MiniInfo>
                    <MiniCTA to={`/product/${p._id}`}>Voir le produit</MiniCTA>
                  </MiniOverlay>
                </MiniSlide>
              ))}

              {carouselProducts.length > 1 && (
                <>
                  <ArrowBtn onClick={prevMini}>
                    <FaChevronLeft />
                  </ArrowBtn>
                  <ArrowBtn onClick={nextMini}>
                    <FaChevronRight />
                  </ArrowBtn>
                </>
              )}
            </MiniCarousel>

            <ProgressContainer>
              <ProgressBar key={miniSlide} $isDark={$isDark} />
            </ProgressContainer>

            <Dots>
              {carouselProducts.map((_, i) => (
                <Dot
                  key={i}
                  $active={i === miniSlide}
                  $isDark={$isDark}
                  onClick={() => setMiniSlide(i)}
                />
              ))}
            </Dots>

            <ThumbsRow>
              {carouselProducts.map((p, i) => (
                <Thumb
                  key={p._id}
                  $active={i === miniSlide}
                  onClick={() => setMiniSlide(i)}
                >
                  <img src={getImg(p)} alt={p.title} />
                </Thumb>
              ))}
            </ThumbsRow>
          </MiniCarouselWrapper>
        </MiniCarouselSection>
      </RevealOnScroll>

      {/* BENEFITS */}
      <RevealOnScroll>
        <SectionHeader>
          <span>Expérience</span>
          <h2>Un service à la hauteur du style</h2>
          <p>
            Parce qu’une belle marque ne se limite pas au vêtement : elle se
            ressent dans chaque détail de l’expérience.
          </p>
        </SectionHeader>

        <BenefitsSection>
          <BenefitCard $isDark={$isDark}>
            <BenefitIcon style={{ background: "#2563eb" }}>
              <FaTruck />
            </BenefitIcon>
            <BenefitTitle>Livraison gratuite</BenefitTitle>
            <BenefitText>
              Livraison offerte sur vos commandes pour une expérience plus
              fluide et plus agréable.
            </BenefitText>
          </BenefitCard>

          <BenefitCard $isDark={$isDark}>
            <BenefitIcon style={{ background: "#16a34a" }}>
              <FaShieldAlt />
            </BenefitIcon>
            <BenefitTitle>Paiement sécurisé</BenefitTitle>
            <BenefitText>
              Transactions protégées et accompagnement direct via WhatsApp :
              0700247693.
            </BenefitText>
          </BenefitCard>

          <BenefitCard $isDark={$isDark}>
            <BenefitIcon style={{ background: "#ea580c" }}>
              <FaUndo />
            </BenefitIcon>
            <BenefitTitle>Retour facile</BenefitTitle>
            <BenefitText>
              Vous changez d’avis ? Le retour reste simple et possible sous 7
              jours.
            </BenefitText>
          </BenefitCard>
        </BenefitsSection>
      </RevealOnScroll>

      <Description>
        NUMA propose une mode élégante, expressive et soignée, pensée pour les
        personnes qui veulent plus qu’un vêtement : une vraie présence.
      </Description>
    </Wrapper>
  );
}