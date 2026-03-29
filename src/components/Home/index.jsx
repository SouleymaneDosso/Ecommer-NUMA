import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
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
      : "linear-gradient(to bottom, #fff, #f7f7f7, #fff)"};
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
    rgba(0, 0, 0, 0.68),
    rgba(0, 0, 0, 0.4),
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
  max-width: 760px;
  animation: ${floatUp} 1s ease forwards;

  h1 {
    font-size: clamp(2.8rem, 5vw, 5.2rem);
    line-height: 1.02;
    margin-bottom: 18px;
    animation: ${fadeIn} 1.2s ease forwards;
    font-weight: 800;
  }

  p {
    font-size: 1.08rem;
    line-height: 1.8;
    max-width: 600px;
    opacity: 0.95;
    margin-bottom: 10px;
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
  min-height: 620px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.14);

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    min-height: 480px;
  }
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
`;

const FeatureOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 38px;
  color: white;
  background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.08));
`;

const FeatureBadge = styled.span`
  display: inline-block;
  width: fit-content;
  margin-bottom: 16px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.16);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const FeatureText = styled.p`
  font-size: 1.25rem;
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
// PREMIUM DOTS
// ===============================
const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
`;

const Dot = styled.button`
  width: ${(p) => (p.$active ? "34px" : "12px")};
  height: 12px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background: ${({ $isDark, $active }) =>
    $active
      ? $isDark
        ? "rgba(255,255,255,0.18)"
        : "rgba(0,0,0,0.12)"
      : $isDark
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)"};
  transition: all 0.35s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const DotProgress = styled.div`
  position: absolute;
  inset: 0;
  width: ${(p) => p.$width}%;
  background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};
  border-radius: 999px;
  transition: width 0.08s linear;
`;

// ===============================
// MINI CAROUSEL
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
  height: 680px;
  overflow: hidden;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);
  background: ${({ $isDark }) => ($isDark ? "#111" : "#f6f6f6")};

  @media (max-width: 768px) {
    height: 500px;
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
  object-position: center;
`;

const MiniOverlay = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: rgba(0,0,0,0.34);
  backdrop-filter: blur(10px);
  padding: 20px 22px;
  border-radius: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MiniInfo = styled.div`
  color: white;

  h3 {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  p {
    font-size: 1.05rem;
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
  border-radius: 999px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
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
  border-radius: 26px;
  background: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.86)"};
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
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #fff, #d6d6d6)"
      : "linear-gradient(135deg, #111, #333)"};
  color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
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
// BEST SELLERS CAROUSEL
// ===============================
const BestSellerSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const BestCarouselWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const BestCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 720px;
  overflow: hidden;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.18);
  border-radius: 30px;
  background: ${({ $isDark }) => ($isDark ? "#111" : "#f6f6f6")};

  @media (max-width: 900px) {
    height: 860px;
  }

  @media (max-width: 768px) {
    height: 760px;
  }
`;

const BestSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 0.8s ease;
  pointer-events: ${(p) => (p.$active ? "auto" : "none")};
`;

const BestSlideInner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BestImageWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${({ $isDark }) => ($isDark ? "#0d0d0d" : "#efefef")};
`;

const BestImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  padding: 24px;
`;

const BestBadge = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(0,0,0,0.5);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
`;

const BestContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))"
      : "linear-gradient(135deg, #ffffff, #f2f2f2)"};

  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const BestSmall = styled.span`
  display: inline-block;
  margin-bottom: 14px;
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
`;

const BestTitle = styled.h3`
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  margin-bottom: 14px;
`;

const BestSubtitle = styled.p`
  font-size: 1rem;
  line-height: 1.9;
  opacity: 0.8;
  margin-bottom: 20px;
  max-width: 500px;
`;

const BestPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 26px;
`;

const BestBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 15px 24px;
  border-radius: 999px;
  background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};
  color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
  text-decoration: none;
  font-weight: 800;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

// ===============================
// MAIN COMPONENT
// ===============================
export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [slide, setSlide] = useState(0);

  const [miniSlide, setMiniSlide] = useState(0);
  const [miniProgress, setMiniProgress] = useState(0);

  const [bestSlide, setBestSlide] = useState(0);
  const [bestProgress, setBestProgress] = useState(0);

  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "light"

  const miniIntervalRef = useRef(null);
  const bestIntervalRef = useRef(null);

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
  const bestSellers = useMemo(() => products.slice(0, 5), [products]);

  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % heroProducts.length),
      4000
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  // MINI CAROUSEL AUTOPLAY
  useEffect(() => {
    if (carouselProducts.length <= 1) return;

    const step = 100 / (duration / 50);

    miniIntervalRef.current = setInterval(() => {
      setMiniProgress((prev) => {
        if (prev + step >= 100) {
          setMiniSlide((s) => (s + 1) % carouselProducts.length);
          return 0;
        }
        return prev + step;
      });
    }, 50);

    return () => clearInterval(miniIntervalRef.current);
  }, [carouselProducts.length]);

  // BEST SELLERS AUTOPLAY
  useEffect(() => {
    if (bestSellers.length <= 1) return;

    const step = 100 / (duration / 50);

    bestIntervalRef.current = setInterval(() => {
      setBestProgress((prev) => {
        if (prev + step >= 100) {
          setBestSlide((s) => (s + 1) % bestSellers.length);
          return 0;
        }
        return prev + step;
      });
    }, 50);

    return () => clearInterval(bestIntervalRef.current);
  }, [bestSellers.length]);

  const getImg = (p) =>
    p.images?.[0]?.url?.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images?.[0]?.url || ""}`;

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
            <h1>Une mode pensée pour séduire au premier regard.</h1>

            <HeroActions>
              <HeroBtn to="/collections">
                Explorer la collection <FaArrowRight />
              </HeroBtn>
            </HeroActions>
          </HeroText>
        </HeroContent>
      </Hero>

      {/* FEATURE CARDS */}
      <RevealOnScroll>
        <SectionHeader>
          <span>Univers</span>
          <h2>Des silhouettes qui imposent le style</h2>
          <p>
            Deux univers, une seule signature : l’élégance, la présence et le
            détail qui fait la différence.
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
                  <FeatureBadge>Univers Homme</FeatureBadge>
                  <FeatureText>
                    Pour l’homme qui veut une allure forte, propre et assumée.
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
                  <FeatureBadge>Univers Femme</FeatureBadge>
                  <FeatureText>
                    Pour la femme qui veut captiver avec confiance et élégance.
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
            <span>Focus</span>
            <h2>Des pièces qui attirent le regard</h2>
            <p>
              Une mise en lumière de créations pensées pour marquer les esprits
              dès le premier regard.
            </p>
          </SectionHeader>

          <MiniCarouselWrapper>
            <MiniCarousel $isDark={$isDark}>
              {carouselProducts.map((p, i) => (
                <MiniSlide key={p._id} $active={i === miniSlide}>
                  <MiniSlideImg src={getImg(p)} alt={p.title} />
                  <MiniOverlay>
                    <MiniInfo>
                      <h3>{p.title}</h3>
                      <p>{p.subtitle || "Une pièce signature à forte présence."}</p>
                    </MiniInfo>
                    <MiniCTA to={`/produit/${p._id}`}>Voir le produit</MiniCTA>
                  </MiniOverlay>
                </MiniSlide>
              ))}
            </MiniCarousel>

            <DotsRow>
              {carouselProducts.map((_, i) => (
                <Dot
                  key={i}
                  $active={i === miniSlide}
                  $isDark={$isDark}
                  onClick={() => {
                    setMiniSlide(i);
                    setMiniProgress(0);
                  }}
                >
                  {i === miniSlide && (
                    <DotProgress $width={miniProgress} $isDark={$isDark} />
                  )}
                </Dot>
              ))}
            </DotsRow>
          </MiniCarouselWrapper>
        </MiniCarouselSection>
      </RevealOnScroll>

      {/* BEST SELLERS */}
      <RevealOnScroll>
        <BestSellerSection>
          <SectionHeader>
            <span>Best Sellers</span>
            <h2>Les pièces les plus convoitées</h2>
            <p>
              Une sélection pensée pour celles et ceux qui veulent une allure
              marquante, élégante et immédiatement mémorable.
            </p>
          </SectionHeader>

          <BestCarouselWrapper>
            <BestCarousel $isDark={$isDark}>
              {bestSellers.map((p, i) => (
                <BestSlide key={p._id} $active={i === bestSlide}>
                  <BestSlideInner>
                    <BestImageWrap $isDark={$isDark}>
                      <BestImage src={getImg(p)} alt={p.title} />
                      <BestBadge>BEST SELLER</BestBadge>
                    </BestImageWrap>

                    <BestContent $isDark={$isDark}>
                      <BestSmall>Collection Signature</BestSmall>
                      <BestTitle>{p.title}</BestTitle>
                      <BestSubtitle>
                        {p.subtitle ||
                          "Une pièce forte pensée pour révéler votre présence avec style, élégance et caractère."}
                      </BestSubtitle>
                      <BestPrice>{p.price} FCFA</BestPrice>

                      <BestBtn to={`/produit/${p._id}`} $isDark={$isDark}>
                        Voir le produit <FaArrowRight />
                      </BestBtn>
                    </BestContent>
                  </BestSlideInner>
                </BestSlide>
              ))}
            </BestCarousel>

            <DotsRow>
              {bestSellers.map((_, i) => (
                <Dot
                  key={i}
                  $active={i === bestSlide}
                  $isDark={$isDark}
                  onClick={() => {
                    setBestSlide(i);
                    setBestProgress(0);
                  }}
                >
                  {i === bestSlide && (
                    <DotProgress $width={bestProgress} $isDark={$isDark} />
                  )}
                </Dot>
              ))}
            </DotsRow>
          </BestCarouselWrapper>
        </BestSellerSection>
      </RevealOnScroll>

      {/* BENEFITS */}
      <RevealOnScroll>
        <SectionHeader>
          <span>Avantages</span>
          <h2>Pourquoi choisir Numa ?</h2>
          <Description>
            Chaque pièce est pensée pour allier style, confort et durabilité. La
            signature Numa, c’est l’assurance d’un vêtement qui vous accompagne
            au quotidien.
          </Description>
        </SectionHeader>

        <BenefitsSection>
          <BenefitCard $isDark={$isDark}>
            <BenefitIcon $isDark={$isDark}>
              <FaTruck />
            </BenefitIcon>
            <BenefitTitle>Livraison rapide</BenefitTitle>
            <BenefitText>
              Recevez vos articles en un temps record, soigneusement emballés
              pour vous.
            </BenefitText>
          </BenefitCard>

          <BenefitCard $isDark={$isDark}>
            <BenefitIcon $isDark={$isDark}>
              <FaShieldAlt />
            </BenefitIcon>
            <BenefitTitle>Paiement sécurisé</BenefitTitle>
            <BenefitText>
              Vos transactions sont cryptées et protégées pour une tranquillité
              totale.
            </BenefitText>
          </BenefitCard>

          <BenefitCard $isDark={$isDark}>
            <BenefitIcon $isDark={$isDark}>
              <FaUndo />
            </BenefitIcon>
            <BenefitTitle>Retour facile</BenefitTitle>
            <BenefitText>
              Si un produit ne vous convient pas, retournez-le simplement et
              rapidement.
            </BenefitText>
          </BenefitCard>
        </BenefitsSection>
      </RevealOnScroll>
    </Wrapper>
  );
}