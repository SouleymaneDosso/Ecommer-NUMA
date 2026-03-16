import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FaArrowRight, FaTruck, FaUndo, FaHeadset } from "react-icons/fa";
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
  opacity: 0;
  animation: ${fadeIn} 1.2s forwards;
  animation-delay: 0.3s;
  &.visible {
    opacity: 1;
  }
  h1 {
    font-size: 2.5rem;
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
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FeatureImgWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: ${(p) => (p.loaded ? 1 : 0)};
  transition: opacity 0.5s ease;
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
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ===============================
// DOT CAROUSEL
// ===============================
const CarouselTrack = styled.div`
  display: flex;
  width: 100%;
`;

const CarouselSlide = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

const SlideImgWrapper = styled.div`
  width: 300px;
  height: 400px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlideImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  margin: 0 auto;
  object-fit: cover;
  opacity: ${(p) => (p.loaded ? 1 : 0)};
  transition: opacity 0.5s ease;
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

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 70px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProgressDotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const SlideInfo = styled.div`
  text-align: left;
  margin-top: 8px;
  padding: 0 10px;
`;

const SlideTitleText = styled.div`
  font-weight: bold;
  font-size: 1rem;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
`;

const SlidePriceText = styled.div`
  font-size: 0.9rem;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
  margin-top: 4px;
`;

// ===============================
// ICÔNES AVANTAGES
// ===============================
const IconsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 60px 20px;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
  text-align: center;
`;

const IconLabel = styled.p`
  font-weight: bold;
  font-size: 1rem;
`;

// ===============================
// AVIS CLIENTS
// ===============================
const ReviewsSection = styled.div`
  padding: 80px 20px;
  background: ${({ $isDark }) => ($isDark ? "#1a1a1a" : "#f9f9f9")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ReviewsTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
  text-align: center;
`;

const ReviewCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
`;

const ReviewCard = styled.div`
  background: ${({ $isDark }) => ($isDark ? "#222" : "#fff")};
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
  padding: 24px;
  border-radius: 12px;
  max-width: 320px;
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 4px 12px rgba(0,0,0,0.5)"
      : "0 4px 12px rgba(0,0,0,0.1)"};
  opacity: 0;
  transform: translateY(40px);
  animation: ${fadeUp} 1s forwards;
`;

const StarsWrapper = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

const Star = styled.span`
  color: #facc15; /* jaune étoile */
  font-size: 18px;
`;

const ReviewText = styled.p`
  font-size: 0.95rem;
  line-height: 1.4;
  font-style: italic;
`;

const Reviewer = styled.p`
  margin-top: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: right;
`;

// ===============================
// DOT CAROUSEL COMPONENT
// ===============================
function DotCarousel({ products, delay = 4000, $isDark }) {
  const filtered = useMemo(() => products.slice(0, 6), [products]);
  const slides = filtered.length ? [...filtered, filtered[0]] : [];

  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);
  const [loadedImgs, setLoadedImgs] = useState({});

  useEffect(() => {
    if (filtered.length < 2) return;
    const interval = setInterval(() => setCurrent((c) => c + 1), delay);
    return () => clearInterval(interval);
  }, [filtered, delay]);

  useEffect(() => {
    if (current === filtered.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 500);
    }
  }, [current, filtered.length]);

  useEffect(() => {
    if (!transition) {
      setTimeout(() => setTransition(true), 50);
    }
  }, [transition]);

  const imgUrl = (p) =>
    p.images?.[0]?.url.startsWith("http")
      ? p.images[0].url
      : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  return (
    <CarouselContainer className="visible">
      <CarouselTrack
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transition ? "transform 0.5s ease" : "none",
        }}
      >
        {slides.map((p, i) => (
          <CarouselSlide key={i}>
            <SlideImgWrapper>
              <SlideImg
                src={imgUrl(p)}
                alt={p.title}
                loaded={loadedImgs[i]}
                onLoad={() =>
                  setLoadedImgs((prev) => ({ ...prev, [i]: true }))
                }
              />
            </SlideImgWrapper>
            <SlideInfo>
              <SlideTitleText $isDark={$isDark}>{p.title}</SlideTitleText>
              <SlidePriceText $isDark={$isDark}>{p.price} FCFA</SlidePriceText>
            </SlideInfo>
          </CarouselSlide>
        ))}
      </CarouselTrack>
      <ProgressDotsWrapper>
        {filtered.map((_, i) => (
          <Dot
            key={i}
            active={i === current % filtered.length}
            onClick={() => setCurrent(i)}
          />
        ))}
      </ProgressDotsWrapper>
    </CarouselContainer>
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

  const [loadedFeatureImgs, setLoadedFeatureImgs] = useState({});
  const sectionRefs = useRef([]);

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

  const getImg = (p) =>
    p.images?.[0]?.url.startsWith("http") ? p.images[0].url : `${import.meta.env.VITE_API_URL}${p.images[0].url}`;

  const reviews = [
    { text: "Très satisfait ! Qualité exceptionnelle et livraison rapide.", name: "Awa D.", stars: 5 },
    { text: "Le design est incroyable, je recommande vivement NUMA Premium.", name: "Souleymane K.", stars: 5 },
    { text: "Excellent service et produits de haute qualité.", name: "Fatou B.", stars: 4 },
  ];

  // ===============================
  // SCROLL REVEAL
  // ===============================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      sectionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [sectionRefs, products]);

  return (
    <Wrapper $isDark={$isDark}>
      {/* HERO */}
      <Hero ref={(el) => (sectionRefs.current[0] = el)}>
        {heroProducts.map((p, i) => (
          <Slide key={p._id} $active={i === slide} style={{ backgroundImage: `url(${getImg(p)})` }} />
        ))}
        <Overlay />
        <HeroText className="visible">
          <h1>Nouvelle Collection 2026</h1>
          <HeroBtn to="/collections">Découvrir</HeroBtn>
        </HeroText>
      </Hero>

      {/* COLLECTION HOMME */}
      {products.filter((p) => p.genre?.toLowerCase() === "homme").slice(0, 1).map((p, i) => (
        <FeatureCard
          key={p._id}
          ref={(el) => (sectionRefs.current[1] = el)}
        >
          <FeatureImgWrapper>
            <FeatureImg
              src={getImg(p)}
              loaded={loadedFeatureImgs[i]}
              onLoad={() => setLoadedFeatureImgs((prev) => ({ ...prev, [i]: true }))}
            />
          </FeatureImgWrapper>
          <FeatureOverlay>
            <FeatureText>Du l'art de la confection à l'excellence du design.</FeatureText>
            <FeatureLink to="/homme">Pour lui <FaArrowRight /></FeatureLink>
          </FeatureOverlay>
        </FeatureCard>
      ))}

      {/* COLLECTION FEMME */}
      {products.filter((p) => p.genre?.toLowerCase() === "femme").slice(0, 1).map((p, i) => (
        <FeatureCard
          key={p._id}
          ref={(el) => (sectionRefs.current[2] = el)}
        >
          <FeatureImgWrapper>
            <FeatureImg
              src={getImg(p)}
              loaded={loadedFeatureImgs[i]}
              onLoad={() => setLoadedFeatureImgs((prev) => ({ ...prev, [i]: true }))}
            />
          </FeatureImgWrapper>
          <FeatureOverlay>
            <FeatureText>L'élégance féminine réinventée à travers des créations uniques.</FeatureText>
            <FeatureLink to="/femme">Pour elle <FaArrowRight /></FeatureLink>
          </FeatureOverlay>
        </FeatureCard>
      ))}

      {/* DOT CAROUSEL */}
      <div ref={(el) => (sectionRefs.current[3] = el)}>
        <DotCarousel products={products} delay={3500} $isDark={$isDark} />
      </div>

      {/* ICONS AVANTAGES */}
      <IconsSection ref={(el) => (sectionRefs.current[4] = el)}>
        <IconCard $isDark={$isDark}>
          <FaTruck size={48} color="#facc15" />
          <IconLabel>Livraison Gratuite</IconLabel>
        </IconCard>
        <IconCard $isDark={$isDark}>
          <FaUndo size={48} color="#34d399" />
          <IconLabel>Retour Facile</IconLabel>
        </IconCard>
        <IconCard $isDark={$isDark}>
          <FaHeadset size={48} color="#60a5fa" />
          <IconLabel>Support 24/7</IconLabel>
        </IconCard>
      </IconsSection>

      {/* AVIS CLIENTS */}
      <ReviewsSection ref={(el) => (sectionRefs.current[5] = el)} $isDark={$isDark}>
        <ReviewsTitle $isDark={$isDark}>Avis Clients</ReviewsTitle>
        <ReviewCards>
          {reviews.map((r, i) => (
            <ReviewCard key={i} style={{ animationDelay: `${i * 0.2}s` }} $isDark={$isDark}>
              <StarsWrapper>
                {Array.from({ length: r.stars }).map((_, idx) => <Star key={idx}>★</Star>)}
              </StarsWrapper>
              <ReviewText>"{r.text}"</ReviewText>
              <Reviewer>- {r.name}</Reviewer>
            </ReviewCard>
          ))}
        </ReviewCards>
      </ReviewsSection>

      {/* COLLECTION DESCRIPTION */}
      <Description ref={(el) => (sectionRefs.current[6] = el)}>
        NUMA Premium offre des pièces uniques avec un design raffiné, des matériaux de qualité supérieure et une expérience de mode exclusive.
      </Description>
    </Wrapper>
  );
}