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
  FaStar,
} from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slowZoom = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.08);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(120%);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }

  100% {
    transform: translateY(0);
  }
`;

/* =========================================================
   SCROLL REVEAL
========================================================= */

function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <RevealWrapper ref={ref} $visible={visible} $delay={delay}>
      {children}
    </RevealWrapper>
  );
}

const RevealWrapper = styled.div`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(45px)"};
  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: ${({ $delay }) => `${$delay}s`};
`;

/* =========================================================
   MAIN WRAPPER
========================================================= */

const Wrapper = styled.main`
  min-height: 100vh;
  overflow: hidden;

  background: ${({ $isDark }) =>
    $isDark
      ? `
        radial-gradient(
          circle at 15% 10%,
          rgba(255,255,255,0.035),
          transparent 28%
        ),
        radial-gradient(
          circle at 85% 45%,
          rgba(255,255,255,0.025),
          transparent 30%
        ),
        linear-gradient(
          180deg,
          #080808 0%,
          #0d0d0d 40%,
          #111 100%
        )
      `
      : `
        radial-gradient(
          circle at 15% 10%,
          rgba(0,0,0,0.025),
          transparent 28%
        ),
        radial-gradient(
          circle at 85% 45%,
          rgba(0,0,0,0.02),
          transparent 30%
        ),
        linear-gradient(
          180deg,
          #ffffff 0%,
          #fafafa 50%,
          #f4f4f4 100%
        )
      `};

  color: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};

  transition:
    background 0.4s ease,
    color 0.4s ease;
`;

const Section = styled.section`
  width: 100%;
  padding: 120px 0;

  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const Container = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto 55px;
  padding: 0 15px;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;

    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;

    opacity: 0.58;

    &::before,
    &::after {
      content: "";
      width: 25px;
      height: 1px;
      background: currentColor;
      opacity: 0.5;
    }
  }

  h2 {
    margin: 0 0 18px;

    font-size: clamp(2.1rem, 4vw, 3.6rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 800;
  }

  p {
    max-width: 720px;
    margin: 0 auto;

    font-size: 1rem;
    line-height: 1.9;

    opacity: 0.68;
  }

  @media (max-width: 600px) {
    margin-bottom: 38px;

    h2 {
      font-size: 2rem;
    }

    p {
      font-size: 0.94rem;
      line-height: 1.75;
    }
  }
`;

/* =========================================================
   HERO
========================================================= */

const Hero = styled.section`
  position: relative;
  height: min(920px, 100vh);
  min-height: 680px;
  overflow: hidden;
  background: #090909;

  @media (max-width: 768px) {
    height: 760px;
    min-height: 680px;
  }
`;

const Slide = styled.div`
  position: absolute;
  inset: -1%;

  background-image: ${({ $image }) => `url("${$image}")`};
  background-size: cover;
  background-position: center;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  transition: opacity 1.2s ease;

  animation: ${slowZoom} 9s ease-in-out infinite alternate;

  z-index: 0;
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.78) 0%,
      rgba(0, 0, 0, 0.46) 42%,
      rgba(0, 0, 0, 0.12) 75%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(0deg, rgba(0, 0, 0, 0.65), transparent 45%);

  @media (max-width: 768px) {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.68)
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;

  height: 100%;

  display: flex;
  align-items: center;

  width: min(1240px, 92%);
  margin: 0 auto;

  padding-top: 90px;
`;

const HeroText = styled.div`
  max-width: 760px;
  color: white;

  animation: ${fadeUp} 1s ease forwards;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;

    margin-bottom: 25px;

    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;

    opacity: 0.78;

    &::before {
      content: "";
      width: 38px;
      height: 1px;
      background: white;
      opacity: 0.7;
    }
  }

  h1 {
    margin: 0 0 25px;

    font-size: clamp(3.2rem, 6vw, 6.5rem);
    line-height: 0.96;
    letter-spacing: -0.065em;
    font-weight: 800;
  }

  p {
    max-width: 570px;
    margin: 0;

    font-size: 1.05rem;
    line-height: 1.8;

    opacity: 0.82;
  }

  @media (max-width: 768px) {
    padding-top: 80px;

    h1 {
      font-size: clamp(2.8rem, 13vw, 4.4rem);
    }

    p {
      font-size: 0.95rem;
    }
  }
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 35px;

  flex-wrap: wrap;
`;

const HeroBtn = styled(Link)`
  position: relative;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  padding: 16px 24px;

  background: white;
  color: #111;

  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 800;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &::before {
    content: "";

    position: absolute;
    top: 0;
    left: -100%;

    width: 70%;
    height: 100%;

    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );

    transform: skewX(-20deg);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.25);
  }

  &:hover::before {
    animation: ${shimmer} 0.8s ease;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const HeroMeta = styled.div`
  position: absolute;
  bottom: 35px;
  left: 4%;

  z-index: 4;

  display: flex;
  align-items: center;
  gap: 14px;

  color: white;

  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 0.65;

  span {
    width: 34px;
    height: 1px;
    background: white;
  }

  @media (max-width: 768px) {
    bottom: 25px;
  }
`;

/* =========================================================
   FEATURE CARDS
========================================================= */

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  position: relative;

  height: 650px;

  overflow: hidden;

  background: #111;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.14);

  @media (max-width: 768px) {
    height: 540px;
  }
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);

  ${FeatureCard}:hover & {
    transform: scale(1.055);
  }
`;

const FeatureOverlay = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 42px;

  color: white;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.86) 0%,
    rgba(0, 0, 0, 0.35) 45%,
    transparent 75%
  );

  @media (max-width: 600px) {
    padding: 28px;
  }
`;

const FeatureNumber = styled.span`
  position: absolute;
  top: 30px;
  right: 30px;

  font-size: 0.72rem;
  letter-spacing: 2px;

  opacity: 0.65;
`;

const FeatureBadge = styled.span`
  width: fit-content;

  display: inline-flex;

  padding: 8px 13px;

  margin-bottom: 17px;

  border: 1px solid rgba(255, 255, 255, 0.25);

  background: rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(12px);

  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 12px;

  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;

  letter-spacing: -0.04em;
`;

const FeatureText = styled.p`
  max-width: 390px;

  margin: 0 0 22px;

  font-size: 0.98rem;
  line-height: 1.7;

  opacity: 0.82;
`;

const FeatureLink = styled(Link)`
  width: fit-content;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding-bottom: 8px;

  color: white;

  text-decoration: none;

  border-bottom: 1px solid rgba(255, 255, 255, 0.45);

  font-size: 0.85rem;
  font-weight: 800;

  transition:
    gap 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    gap: 16px;
    border-color: white;
  }
`;

/* =========================================================
   CAROUSEL DOTS
========================================================= */

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;

  margin-top: 25px;
`;

const Dot = styled.button`
  position: relative;

  width: ${({ $active }) => ($active ? "42px" : "8px")};
  height: 8px;

  padding: 0;

  border: none;
  border-radius: 99px;

  overflow: hidden;

  cursor: pointer;

  background: ${({ $isDark, $active }) =>
    $active
      ? $isDark
        ? "rgba(255,255,255,0.18)"
        : "rgba(0,0,0,0.13)"
      : $isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.1)"};

  transition:
    width 0.35s ease,
    transform 0.3s ease;

  &:hover {
    transform: scaleY(1.3);
  }
`;

const DotProgress = styled.span`
  position: absolute;
  inset: 0 auto 0 0;

  width: ${({ $width }) => `${$width}%`};

  background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};

  border-radius: inherit;
`;

/* =========================================================
   MINI CAROUSEL
========================================================= */

const CarouselSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const MiniCarousel = styled.div`
  position: relative;

  height: 700px;

  overflow: hidden;

  background: ${({ $isDark }) => ($isDark ? "#111" : "#eee")};

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.14);

  @media (max-width: 768px) {
    height: 570px;
  }
`;

const MiniSlide = styled.div`
  position: absolute;
  inset: 0;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};

  transition: opacity 0.8s ease;
`;

const MiniSlideImg = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;

  transition: transform 1s ease;

  ${MiniSlide}:hover & {
    transform: scale(1.02);
  }
`;

const MiniOverlay = styled.div`
  position: absolute;

  left: 25px;
  right: 25px;
  bottom: 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 24px 27px;

  color: white;

  background: rgba(0, 0, 0, 0.45);

  border: 1px solid rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(18px);

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: flex-start;

    padding: 20px;
  }
`;

const MiniInfo = styled.div`
  h3 {
    margin: 0 0 8px;

    font-size: clamp(1.4rem, 3vw, 2rem);

    letter-spacing: -0.03em;
  }

  p {
    margin: 0;

    font-size: 0.9rem;

    opacity: 0.75;
  }
`;

const MiniCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  flex-shrink: 0;

  padding: 13px 20px;

  color: #111;
  background: white;

  text-decoration: none;

  font-size: 0.8rem;
  font-weight: 800;

  transition:
    transform 0.3s ease,
    background 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: #f0f0f0;
  }
`;

/* =========================================================
   BEST SELLERS
========================================================= */

const BestSellerSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const BestCarousel = styled.div`
  position: relative;

  width: 100%;
  height: 700px;

  overflow: hidden;

  background: ${({ $isDark }) => ($isDark ? "#0d0d0d" : "#f2f2f2")};

  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.15);

  @media (max-width: 900px) {
    height: 900px;
  }

  @media (max-width: 600px) {
    height: 800px;
  }
`;

const BestSlide = styled.div`
  position: absolute;
  inset: 0;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};

  transition: opacity 0.8s ease;
`;

const BestSlideInner = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  width: 100%;
  height: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 48% 52%;
  }
`;

const BestImageWrap = styled.div`
  position: relative;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $isDark }) => ($isDark ? "#0a0a0a" : "#eaeaea")};
`;

const BestImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;

  padding: 30px;

  transition: transform 0.8s ease;

  ${BestSlide}:hover & {
    transform: scale(1.025);
  }
`;

const BestBadge = styled.div`
  position: absolute;

  top: 25px;
  left: 25px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 9px 13px;

  background: rgba(0, 0, 0, 0.55);
  color: white;

  border: 1px solid rgba(255, 255, 255, 0.15);

  backdrop-filter: blur(12px);

  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 2px;
`;

const BestContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 65px;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg,#121212,#0d0d0d)"
      : "linear-gradient(135deg,#fff,#f3f3f3)"};

  @media (max-width: 900px) {
    padding: 35px;
  }
`;

const BestSmall = styled.span`
  margin-bottom: 15px;

  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 0.5;
`;

const BestTitle = styled.h3`
  margin: 0 0 17px;

  font-size: clamp(2rem, 4vw, 3.6rem);

  line-height: 1;

  letter-spacing: -0.055em;
`;

const BestSubtitle = styled.p`
  max-width: 500px;

  margin: 0 0 24px;

  font-size: 0.98rem;
  line-height: 1.85;

  opacity: 0.68;
`;

const BestPrice = styled.div`
  margin-bottom: 27px;

  font-size: 1.4rem;
  font-weight: 800;
`;

const BestBtn = styled(Link)`
  width: fit-content;

  display: inline-flex;
  align-items: center;
  gap: 11px;

  padding: 15px 22px;

  background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};

  color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};

  text-decoration: none;

  font-size: 0.82rem;
  font-weight: 800;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);

    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.15);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const CarouselArrow = styled.button`
  position: absolute;

  top: 50%;
  transform: translateY(-50%);

  ${({ $left }) => ($left ? "left: 18px;" : "right: 18px;")}

  z-index: 5;

  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.2);

  background: rgba(0, 0, 0, 0.35);
  color: white;

  backdrop-filter: blur(12px);

  cursor: pointer;

  transition:
    background 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.65);

    transform: translateY(-50%) scale(1.06);
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;

    ${({ $left }) => ($left ? "left: 10px;" : "right: 10px;")}
  }
`;

/* =========================================================
   BENEFITS
========================================================= */

const BenefitsSection = styled.div`
  width: min(1120px, 92%);
  margin: 0 auto;

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  position: relative;

  overflow: hidden;

  padding: 32px;

  min-height: 250px;

  background: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.75)"};

  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.06);

  backdrop-filter: blur(18px);

  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-8px);

    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: "";

    position: absolute;

    width: 140px;
    height: 140px;

    right: -70px;
    bottom: -70px;

    border-radius: 50%;

    background: ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"};
  }
`;

const BenefitIcon = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 25px;

  background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};

  color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};

  font-size: 21px;

  animation: ${float} 4s ease-in-out infinite;
`;

const BenefitTitle = styled.h3`
  margin: 0 0 10px;

  font-size: 1.05rem;
  font-weight: 800;
`;

const BenefitText = styled.p`
  max-width: 300px;

  margin: 0;

  font-size: 0.9rem;
  line-height: 1.75;

  opacity: 0.62;
`;

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = styled.div`
  min-height: 400px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;

  opacity: 0.55;
`;

/* =========================================================
   VIDEO — HERO STYLE
========================================================= */

const VideoSection = styled.section`
  position: relative;

  width: 100%;
  height: min(920px, 100vh);
  min-height: 680px;

  overflow: hidden;

  background: #090909;

  @media (max-width: 768px) {
    height: 760px;
    min-height: 680px;
  }
`;

const VideoPlayer = styled.video`
  position: absolute;
  inset: -1%;

  width: 102%;
  height: 102%;

  object-fit: cover;
  object-position: center;

  background: #090909;

  pointer-events: none;

  user-select: none;
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function HomePremium() {
  const [products, setProducts] = useState([]);

  const [slide, setSlide] = useState(0);

  const [miniSlide, setMiniSlide] = useState(0);
  const [miniProgress, setMiniProgress] = useState(0);

  const [bestSlide, setBestSlide] = useState(0);
  const [bestProgress, setBestProgress] = useState(0);
  const [video, setVideo] = useState([]);
  const { theme } = useContext(ThemeContext);

  const $isDark = theme === "light";

  const miniIntervalRef = useRef(null);
  const bestIntervalRef = useRef(null);

  const duration = 4200;

  // fetch video

  const fetchVideo = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/videos/videos`,
        {
          method: "GET",
        },
      );
      const data = await res.json();
      setVideo(data.videos);
    } catch (error) {
      console.error("Erreur vidéo :", error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

        if (!res.ok) {
          throw new Error("Impossible de récupérer les produits");
        }

        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur produits :", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     PRODUCT FILTERS
  ======================================================= */

  const heroProducts = useMemo(
    () => products.filter((p) => p.hero),
    [products],
  );

  const carouselProducts = useMemo(() => products.slice(0, 5), [products]);

  const bestSellers = useMemo(
    () => products.filter((p) => p.badge?.toLowerCase() === "new").slice(0, 5),
    [products],
  );

  /* =======================================================
     IMAGE
  ======================================================= */

  const getImg = (product) => {
    const image = product?.images?.[0]?.url;

    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_API_URL}${image}`;
  };

  /* =======================================================
     HERO AUTOPLAY
  ======================================================= */

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const interval = setInterval(() => {
      setSlide((current) => (current + 1) % heroProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroProducts.length]);

  /* =======================================================
     MINI CAROUSEL
  ======================================================= */

  useEffect(() => {
    if (carouselProducts.length <= 1) return;

    const step = 100 / (duration / 50);

    miniIntervalRef.current = setInterval(() => {
      setMiniProgress((previous) => {
        if (previous + step >= 100) {
          setMiniSlide((current) => (current + 1) % carouselProducts.length);

          return 0;
        }

        return previous + step;
      });
    }, 50);

    return () => clearInterval(miniIntervalRef.current);
  }, [carouselProducts.length]);

  /* =======================================================
     BEST SELLERS
  ======================================================= */

  useEffect(() => {
    if (bestSellers.length <= 1) return;

    const step = 100 / (duration / 50);

    bestIntervalRef.current = setInterval(() => {
      setBestProgress((previous) => {
        if (previous + step >= 100) {
          setBestSlide((current) => (current + 1) % bestSellers.length);

          return 0;
        }

        return previous + step;
      });
    }, 50);

    return () => clearInterval(bestIntervalRef.current);
  }, [bestSellers.length]);

  /* =======================================================
     MINI NAVIGATION
  ======================================================= */

  const previousMini = () => {
    if (!carouselProducts.length) return;

    setMiniSlide((current) =>
      current === 0 ? carouselProducts.length - 1 : current - 1,
    );

    setMiniProgress(0);
  };

  const nextMini = () => {
    if (!carouselProducts.length) return;

    setMiniSlide((current) => (current + 1) % carouselProducts.length);

    setMiniProgress(0);
  };

  /* =======================================================
     BEST NAVIGATION
  ======================================================= */

  const previousBest = () => {
    if (!bestSellers.length) return;

    setBestSlide((current) =>
      current === 0 ? bestSellers.length - 1 : current - 1,
    );

    setBestProgress(0);
  };

  const nextBest = () => {
    if (!bestSellers.length) return;

    setBestSlide((current) => (current + 1) % bestSellers.length);

    setBestProgress(0);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Wrapper $isDark={$isDark}>
      {/* ===================================================
          HERO
      =================================================== */}

      <Hero>
        {heroProducts.length > 0 ? (
          heroProducts.map((product, index) => (
            <Slide
              key={product._id}
              $active={index === slide}
              $image={getImg(product)}
            />
          ))
        ) : (
          <Slide
            $active
            $image=""
            style={{
              background: $isDark ? "#111" : "#e8e8e8",
            }}
          />
        )}

        <HeroGradient />

        <HeroContent>
          <HeroText>
            <div className="eyebrow">NUMA — COLLECTION</div>
            <p>
              Des silhouettes fortes, des détails maîtrisés et une élégance
              pensée pour marquer les esprits.
            </p>

            <HeroActions>
              <HeroBtn to="/collections">
                Explorer la collection
                <FaArrowRight />
              </HeroBtn>
            </HeroActions>
          </HeroText>
        </HeroContent>

        <HeroMeta>
          <span />
          COLLECTION NUMA
        </HeroMeta>
      </Hero>

      <VideoSection>
        {video.length > 0 ? (
          <VideoPlayer
            src={video[0].url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
          />
        ) : null}
      </VideoSection>
      {/* ===================================================
          UNIVERS
      =================================================== */}

      <Section>
        <RevealOnScroll>
          <Container>
            <SectionHeader>
              <div className="eyebrow">UNIVERS</div>

              <h2>Des silhouettes qui imposent le style.</h2>

              <p>
                Deux univers, une seule signature : l'élégance, la présence et
                le détail qui fait la différence.
              </p>
            </SectionHeader>

            <FeatureGrid>
              {products
                .filter((product) => product.genre?.toLowerCase() === "homme")
                .slice(0, 1)
                .map((product) => (
                  <FeatureCard key={product._id}>
                    <FeatureImg src={getImg(product)} alt={product.title} />

                    <FeatureOverlay>
                      <FeatureNumber>01 / 02</FeatureNumber>

                      <FeatureBadge>Univers Homme</FeatureBadge>

                      <FeatureTitle>Homme</FeatureTitle>

                      <FeatureText>
                        Pour l'homme qui veut une allure forte, propre et
                        assumée.
                      </FeatureText>

                      <FeatureLink to="/homme">
                        Découvrir l'univers
                        <FaArrowRight />
                      </FeatureLink>
                    </FeatureOverlay>
                  </FeatureCard>
                ))}

              {products
                .filter((product) => product.genre?.toLowerCase() === "femme")
                .slice(0, 1)
                .map((product) => (
                  <FeatureCard key={product._id}>
                    <FeatureImg src={getImg(product)} alt={product.title} />

                    <FeatureOverlay>
                      <FeatureNumber>02 / 02</FeatureNumber>

                      <FeatureBadge>Univers Femme</FeatureBadge>

                      <FeatureTitle>Femme</FeatureTitle>

                      <FeatureText>
                        Pour la femme qui veut captiver avec confiance et
                        élégance.
                      </FeatureText>

                      <FeatureLink to="/femme">
                        Découvrir l'univers
                        <FaArrowRight />
                      </FeatureLink>
                    </FeatureOverlay>
                  </FeatureCard>
                ))}
            </FeatureGrid>
          </Container>
        </RevealOnScroll>
      </Section>

      {/* ===================================================
          FOCUS
      =================================================== */}

      <Section>
        <RevealOnScroll>
          <CarouselSection>
            <SectionHeader>
              <div className="eyebrow">FOCUS</div>

              <h2>Des pièces qui attirent le regard.</h2>

              <p>
                Une sélection de créations pensées pour marquer les esprits dès
                le premier regard.
              </p>
            </SectionHeader>

            {carouselProducts.length > 0 ? (
              <>
                <MiniCarousel $isDark={$isDark}>
                  {carouselProducts.map((product, index) => (
                    <MiniSlide key={product._id} $active={index === miniSlide}>
                      <MiniSlideImg src={getImg(product)} alt={product.title} />

                      <MiniOverlay>
                        <MiniInfo>
                          <h3>{product.title}</h3>

                          <p>
                            {product.subtitle ||
                              "Une pièce signature à forte présence."}
                          </p>
                        </MiniInfo>

                        <MiniCTA to={`/produit/${product._id}`}>
                          Voir le produit
                          <FaArrowRight />
                        </MiniCTA>
                      </MiniOverlay>
                    </MiniSlide>
                  ))}

                  {carouselProducts.length > 1 && (
                    <>
                      <CarouselArrow
                        $left
                        aria-label="Produit précédent"
                        onClick={previousMini}
                      >
                        <FaChevronLeft />
                      </CarouselArrow>

                      <CarouselArrow
                        aria-label="Produit suivant"
                        onClick={nextMini}
                      >
                        <FaChevronRight />
                      </CarouselArrow>
                    </>
                  )}
                </MiniCarousel>

                <DotsRow>
                  {carouselProducts.map((_, index) => (
                    <Dot
                      key={index}
                      $active={index === miniSlide}
                      $isDark={$isDark}
                      onClick={() => {
                        setMiniSlide(index);
                        setMiniProgress(0);
                      }}
                    >
                      {index === miniSlide && (
                        <DotProgress $width={miniProgress} $isDark={$isDark} />
                      )}
                    </Dot>
                  ))}
                </DotsRow>
              </>
            ) : (
              <EmptyState>Aucune pièce disponible pour le moment.</EmptyState>
            )}
          </CarouselSection>
        </RevealOnScroll>
      </Section>

      {/* ===================================================
          BEST SELLERS
      =================================================== */}

      <Section>
        <RevealOnScroll>
          <BestSellerSection>
            <SectionHeader>
              <div className="eyebrow">SÉLECTION</div>

              <h2>Les pièces les plus convoitées.</h2>

              <p>
                Une sélection pensée pour celles et ceux qui veulent une allure
                marquante, élégante et mémorable.
              </p>
            </SectionHeader>

            {bestSellers.length > 0 ? (
              <>
                <BestCarousel $isDark={$isDark}>
                  {bestSellers.map((product, index) => (
                    <BestSlide key={product._id} $active={index === bestSlide}>
                      <BestSlideInner>
                        <BestImageWrap $isDark={$isDark}>
                          <BestImage
                            src={getImg(product)}
                            alt={product.title}
                          />

                          <BestBadge>
                            <FaStar />
                            BEST SELLER
                          </BestBadge>
                        </BestImageWrap>

                        <BestContent $isDark={$isDark}>
                          <BestSmall>Collection Signature</BestSmall>

                          <BestTitle>{product.title}</BestTitle>

                          <BestSubtitle>
                            {product.subtitle ||
                              "Une pièce forte pensée pour révéler votre présence avec style, élégance et caractère."}
                          </BestSubtitle>

                          <BestPrice>{product.price} FCFA</BestPrice>

                          <BestBtn
                            to={`/produit/${product._id}`}
                            $isDark={$isDark}
                          >
                            Voir le produit
                            <FaArrowRight />
                          </BestBtn>
                        </BestContent>
                      </BestSlideInner>
                    </BestSlide>
                  ))}

                  {bestSellers.length > 1 && (
                    <>
                      <CarouselArrow
                        $left
                        aria-label="Produit précédent"
                        onClick={previousBest}
                      >
                        <FaChevronLeft />
                      </CarouselArrow>

                      <CarouselArrow
                        aria-label="Produit suivant"
                        onClick={nextBest}
                      >
                        <FaChevronRight />
                      </CarouselArrow>
                    </>
                  )}
                </BestCarousel>

                <DotsRow>
                  {bestSellers.map((_, index) => (
                    <Dot
                      key={index}
                      $active={index === bestSlide}
                      $isDark={$isDark}
                      onClick={() => {
                        setBestSlide(index);
                        setBestProgress(0);
                      }}
                    >
                      {index === bestSlide && (
                        <DotProgress $width={bestProgress} $isDark={$isDark} />
                      )}
                    </Dot>
                  ))}
                </DotsRow>
              </>
            ) : (
              <EmptyState>
                <div>
                  <h3>Notre sélection arrive bientôt.</h3>

                  <p>De nouvelles pièces seront bientôt disponibles.</p>
                </div>
              </EmptyState>
            )}
          </BestSellerSection>
        </RevealOnScroll>
      </Section>

      {/* ===================================================
          BENEFITS
      =================================================== */}

      <Section>
        <RevealOnScroll>
          <Container>
            <SectionHeader>
              <div className="eyebrow">L'EXPÉRIENCE NUMA</div>

              <h2>Pourquoi choisir Numa ?</h2>

              <p>
                Parce que votre expérience compte autant que la pièce que vous
                choisissez.
              </p>
            </SectionHeader>

            <BenefitsSection>
              <BenefitCard $isDark={$isDark}>
                <BenefitIcon $isDark={$isDark}>
                  <FaTruck />
                </BenefitIcon>

                <BenefitTitle>Livraison rapide</BenefitTitle>

                <BenefitText>
                  Recevez vos articles rapidement, soigneusement emballés et
                  prêts à être portés.
                </BenefitText>
              </BenefitCard>

              <BenefitCard $isDark={$isDark}>
                <BenefitIcon $isDark={$isDark}>
                  <FaShieldAlt />
                </BenefitIcon>

                <BenefitTitle>Paiement sécurisé</BenefitTitle>

                <BenefitText>
                  Vos transactions sont protégées pour vous offrir une
                  expérience d'achat sereine.
                </BenefitText>
              </BenefitCard>

              <BenefitCard $isDark={$isDark}>
                <BenefitIcon $isDark={$isDark}>
                  <FaUndo />
                </BenefitIcon>

                <BenefitTitle>Retour facile</BenefitTitle>

                <BenefitText>
                  Une pièce ne vous convient pas ? Notre processus de retour est
                  simple et rapide.
                </BenefitText>
              </BenefitCard>
            </BenefitsSection>
          </Container>
        </RevealOnScroll>
      </Section>
    </Wrapper>
  );
}
