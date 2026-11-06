import { useState, useEffect, useMemo, useContext, useRef } from "react";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";

import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";

import { ThemeContext } from "../../Utils/Context";

/* =========================================================
   HELPERS
========================================================= */

const API_URL = import.meta.env.VITE_API_URL;

const estPrecommande = (product) =>
  product?.precommande === true && product?.disponible === false;

const normaliserGenre = (genre) =>
  String(genre || "")
    .trim()
    .toLowerCase();

const getProduitId = (video) => {
  const produit = video?.produitId;

  if (typeof produit === "object" && produit !== null) {
    return String(produit._id || produit.id || "");
  }

  return String(produit || "");
};

const getMediaUrl = (url) => {
  if (!url) return "";

  return url.startsWith("http")
    ? url
    : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  from { transform: scale(1); }
  to { transform: scale(1.08); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(198, 163, 106, 0.35); }
  70% { box-shadow: 0 0 0 12px rgba(198, 163, 106, 0); }
  100% { box-shadow: 0 0 0 0 rgba(198, 163, 106, 0); }
`;

const rotateBorder = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const arrowFloat = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
`;

/* =========================================================
   WHATSAPP
========================================================= */

const WhatsAppButton = styled.a`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;

  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: #25d366;
  color: white;
  text-decoration: none;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  animation: ${pulse} 2.5s infinite;

  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 600px) {
    right: 16px;
    bottom: 16px;
    width: 54px;
    height: 54px;

    svg {
      width: 27px;
      height: 27px;
    }
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
      { threshold: 0.12 },
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
    $visible ? "translateY(0)" : "translateY(40px)"};

  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  transition-delay: ${({ $delay }) => `${$delay}s`};
`;

/* =========================================================
   GLOBAL LAYOUT
========================================================= */

const Wrapper = styled.main`
  min-height: 100vh;
  overflow: hidden;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(180deg, #101512 0%, #151b17 100%)"
      : "linear-gradient(180deg, #faf9f6 0%, #f1eee7 100%)"};

  color: ${({ $isDark }) => ($isDark ? "#f8f7f2" : "#20251f")};

  transition:
    background 0.4s ease,
    color 0.4s ease;
`;

const Section = styled.section`
  width: 100%;
  padding: 110px 0;

  @media (max-width: 768px) {
    padding: 75px 0;
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
  max-width: 850px;
  margin: 0 auto 52px;
  padding: 0 15px;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;

    color: #b18b55;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;

    &::before,
    &::after {
      content: "";
      width: 25px;
      height: 1px;
      background: currentColor;
    }
  }

  h2 {
    margin: 0 0 18px;
    font-size: clamp(2.1rem, 4vw, 3.5rem);
    line-height: 1.06;
    letter-spacing: -0.045em;
    font-weight: 800;
  }

  p {
    max-width: 700px;
    margin: 0 auto;
    font-size: 1rem;
    line-height: 1.85;
    opacity: 0.65;
  }

  @media (max-width: 600px) {
    margin-bottom: 35px;

    h2 {
      font-size: 2rem;
    }

    p {
      font-size: 0.93rem;
    }
  }
`;

/* =========================================================
   HERO — IMAGE SANS TEXTE ENCOMBRANT
========================================================= */

const Hero = styled.section`
  position: relative;
  height: min(920px, 100vh);
  min-height: 620px;
  overflow: hidden;
  background: #101512;

  @media (max-width: 768px) {
    height: 760px;
    min-height: 620px;
  }
`;

const HeroSlide = styled.div`
  position: absolute;
  inset: -1%;

  background-image: ${({ $image }) => ($image ? `url("${$image}")` : "none")};

  background-size: cover;
  background-position: center;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  transition: opacity 1.2s ease;
  animation: ${slowZoom} 9s ease-in-out infinite alternate;
`;

const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;

  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.08) 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.16) 100%
  );
`;

const HeroBottom = styled.div`
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 35px;
  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 600px) {
    bottom: 22px;
  }
`;

const HeroCollection = styled.span`
  color: white;
  font-size: 0.68rem;
  letter-spacing: 3px;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.75;

  @media (max-width: 600px) {
    font-size: 0.58rem;
    letter-spacing: 2px;
  }
`;

const PreorderLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  padding: 13px 18px;

  color: #fff;
  text-decoration: none;

  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(17, 27, 22, 0.42);
  backdrop-filter: blur(14px);

  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;

  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: rgba(177, 139, 85, 0.85);
    border-color: #c6a36a;
    transform: translateY(-3px);
  }

  svg {
    color: #d8bd91;
  }

  @media (max-width: 600px) {
    padding: 11px 13px;
    font-size: 0.65rem;
  }
`;

/* =========================================================
   DOTS
========================================================= */

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "30px" : "8px")};
  height: 8px;
  padding: 0;

  border: none;
  border-radius: 20px;

  background: ${({ $active }) =>
    $active ? "#b18b55" : "rgba(177, 139, 85, 0.3)"};

  cursor: pointer;

  transition:
    width 0.35s ease,
    background 0.35s ease,
    transform 0.3s ease;

  &:hover {
    transform: scaleY(1.4);
  }
`;

const DotLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
`;

/* =========================================================
   VIDEO SECTION
========================================================= */

const VideoSection = styled.section`
  position: relative;
  width: 100%;
  height: min(850px, 90vh);
  min-height: 570px;
  overflow: hidden;
  background: #080b09;
  touch-action: pan-y;

  @media (max-width: 768px) {
    height: 700px;
    min-height: 560px;
  }
`;

const VideoPlayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  background: #080b09;
`;

const VideoShade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.58) 0%,
    transparent 45%,
    rgba(0, 0, 0, 0.12) 100%
  );
`;

const VideoTop = styled.div`
  position: absolute;
  top: 35px;
  left: 5%;
  z-index: 3;

  color: white;

  .eyebrow {
    margin-bottom: 10px;
    color: #d4b782;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.7rem, 4vw, 3.2rem);
    letter-spacing: -0.04em;
  }

  p {
    margin: 9px 0 0;
    font-size: 0.9rem;
    opacity: 0.75;
  }
`;

const VideoBottom = styled.div`
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 28px;
  z-index: 4;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 600px) {
    left: 18px;
    right: 18px;
    bottom: 20px;
  }
`;

const VideoControls = styled.div`
  display: flex;
  gap: 10px;
`;

const VideoButton = styled.button`
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;

  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);

  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
    transform: scale(1.06);
  }
`;

const VideoDots = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px 17px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 40px;

  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
`;

const VideoDot = styled.button`
  width: ${({ $active }) => ($active ? "34px" : "8px")};
  height: 8px;

  border: none;
  border-radius: 20px;

  background: ${({ $active }) =>
    $active ? "#d6b77e" : "rgba(255,255,255,0.55)"};

  cursor: pointer;
  transition: all 0.3s ease;
`;

const VideoEmpty = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  text-align: center;
  padding: 25px;

  .eyebrow {
    color: #d6b77e;
    font-size: 0.7rem;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h2 {
    margin: 15px 0 0;
    font-size: clamp(1.8rem, 5vw, 3rem);
  }
`;

/* =========================================================
   UNIVERS HOMME / FEMME — CAROUSEL PLEINE LARGEUR
========================================================= */

const UniverseFrame = styled.div`
  position: relative;
  width: 100%;
  padding: 3px;
  overflow: hidden;
  background: ${({ $isDark }) => ($isDark ? "#2a302a" : "#d8d0c1")};

  &::before {
    content: "";
    position: absolute;
    width: 180%;
    height: 180%;
    top: -40%;
    left: -40%;

    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent 250deg,
      #b18b55 290deg,
      #ead7b5 315deg,
      transparent 360deg
    );

    animation: ${rotateBorder} 8s linear infinite;
  }
`;

const UniverseViewport = styled.div`
  position: relative;
  overflow: hidden;
  background: #111;
`;

const UniverseTrack = styled.div`
  display: flex;
  width: 100%;

  transform: translateX(${({ $index }) => `${-$index * 100}%`});
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
`;

const UniverseSlide = styled(Link)`
  position: relative;
  display: block;

  flex: 0 0 100%;
  width: 100%;
  height: min(720px, 70vw);
  min-height: 450px;

  overflow: hidden;
  color: white;
  text-decoration: none;
  background: #111;

  @media (max-width: 700px) {
    height: 570px;
    min-height: 480px;
  }
`;

const UniverseImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);

  ${UniverseSlide}:hover & {
    transform: scale(1.045);
  }
`;

const UniverseOverlay = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  padding: clamp(25px, 5vw, 65px);

  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.12) 55%,
    transparent 100%
  );
`;

const UniverseInfo = styled.div`
  .eyebrow {
    display: inline-block;
    margin-bottom: 15px;

    color: #d6b77e;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h3 {
    margin: 0;
    font-size: clamp(3rem, 7vw, 6.5rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  p {
    margin: 17px 0 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }
`;

const UniverseArrow = styled.span`
  flex: 0 0 65px;
  width: 65px;
  height: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;

  color: white;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);

  transition: all 0.35s ease;

  ${UniverseSlide}:hover & {
    background: #b18b55;
    border-color: #b18b55;
    transform: scale(1.08);
    animation: ${arrowFloat} 1s ease infinite;
  }

  svg {
    font-size: 22px;
  }

  @media (max-width: 600px) {
    flex-basis: 48px;
    width: 48px;
    height: 48px;
  }
`;

/* =========================================================
   MINI CAROUSEL — FOCUS
========================================================= */

const CarouselSection = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const MiniCarousel = styled.div`
  position: relative;
  height: 680px;
  overflow: hidden;

  background: ${({ $isDark }) => ($isDark ? "#111" : "#e9e6df")};
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    height: 560px;
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
  background: rgba(18, 28, 22, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
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

  color: white;
  background: #173d32;
  border: 1px solid rgba(255, 255, 255, 0.25);

  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 800;

  transition: 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: #b18b55;
  }
`;

const CarouselArrow = styled.button`
  position: absolute;
  top: 50%;
  z-index: 5;

  ${({ $left }) => ($left ? "left: 18px;" : "right: 18px;")}

  transform: translateY(-50%);

  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;

  background: rgba(0, 0, 0, 0.4);
  color: white;
  backdrop-filter: blur(12px);

  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #b18b55;
    transform: translateY(-50%) scale(1.08);
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    ${({ $left }) => ($left ? "left: 10px;" : "right: 10px;")}
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
  height: 680px;
  overflow: hidden;

  background: ${({ $isDark }) => ($isDark ? "#111" : "#e9e6df")};
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.13);

  @media (max-width: 900px) {
    height: 850px;
  }

  @media (max-width: 600px) {
    height: 760px;
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

  background: ${({ $isDark }) => ($isDark ? "#101510" : "#e9e6df")};
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

  background: rgba(23, 61, 50, 0.85);
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

  padding: 60px;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #18221b, #101510)"
      : "linear-gradient(135deg, #fff, #f0ede6)"};

  @media (max-width: 900px) {
    padding: 32px;
  }
`;

const BestSmall = styled.span`
  margin-bottom: 15px;
  color: #b18b55;

  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
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

  background: ${({ $isDark }) => ($isDark ? "#d6b77e" : "#173d32")};
  color: ${({ $isDark }) => ($isDark ? "#172019" : "#fff")};

  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 800;

  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
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
    $isDark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.72)"};

  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.08)" : "rgba(23,61,50,0.09)"};

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(18px);

  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-8px);
  }

  &::after {
    content: "";
    position: absolute;

    width: 140px;
    height: 140px;

    right: -70px;
    bottom: -70px;

    border-radius: 50%;
    background: rgba(177, 139, 85, 0.08);
  }
`;

const BenefitIcon = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 25px;

  background: ${({ $isDark }) => ($isDark ? "#d6b77e" : "#173d32")};
  color: ${({ $isDark }) => ($isDark ? "#172019" : "#fff")};

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
  min-height: 350px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  opacity: 0.55;
`;

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);

  const [slide, setSlide] = useState(0);

  const [universeIndex, setUniverseIndex] = useState(0);

  const [miniSlide, setMiniSlide] = useState(0);
  const [miniProgress, setMiniProgress] = useState(0);

  const [bestSlide, setBestSlide] = useState(0);
  const [bestProgress, setBestProgress] = useState(0);

  const [videoGenre, setVideoGenre] = useState("homme");
  const [videoIndex, setVideoIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [precommandeDisponible, setPrecommandeDisponible] = useState(false);

  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "light";

  const videoRef = useRef(null);
  const touchStartX = useRef(null);

  const miniIntervalRef = useRef(null);
  const bestIntervalRef = useRef(null);

  const duration = 4200;

  /* =======================================================
     FETCH PRÉCOMMANDES
  ======================================================= */

  useEffect(() => {
    const verifierPrecommande = async () => {
      try {
        const response = await fetch(`${API_URL}/api/precommandes/modeles`);

        if (!response.ok) {
          setPrecommandeDisponible(false);
          return;
        }

        const data = await response.json();

        const modeles = Array.isArray(data)
          ? data
          : data.modeles || data.data || [];

        setPrecommandeDisponible(modeles.length > 0);
      } catch (error) {
        console.error("Erreur vérification précommande :", error);
        setPrecommandeDisponible(false);
      }
    };

    verifierPrecommande();
  }, []);

  /* =======================================================
     FETCH PRODUITS ET VIDÉOS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/produits`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer les produits");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur produits :", error);
        setProducts([]);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos/produits`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer les vidéos");
        }

        const data = await response.json();

        const liste = Array.isArray(data?.videos)
          ? data.videos.filter((item) => item?.url && item?.produitId)
          : [];

        setVideos(liste);
      } catch (error) {
        console.error("Erreur vidéos :", error);
        setVideos([]);
      }
    };

    fetchProducts();
    fetchVideos();
  }, []);

  /* =======================================================
     PRODUITS HERO
  ======================================================= */

  const heroProducts = useMemo(
    () => products.filter((product) => product.hero),
    [products],
  );

  /* =======================================================
     PRODUITS FOCUS
  ======================================================= */

  const carouselProducts = useMemo(
    () => products.filter((product) => !estPrecommande(product)).slice(0, 5),
    [products],
  );

  /* =======================================================
     BEST SELLERS
  ======================================================= */

  const bestSellers = useMemo(
    () =>
      products
        .filter(
          (product) =>
            normaliserGenre(product.badge) === "new" &&
            !estPrecommande(product),
        )
        .slice(0, 5),
    [products],
  );

  /* =======================================================
     PRODUITS DES UNIVERS
  ======================================================= */

  const universeProducts = useMemo(() => {
    const homme = products.find(
      (product) =>
        normaliserGenre(product.genre) === "homme" &&
        !estPrecommande(product) &&
        product?.images?.[0]?.url,
    );

    const femme = products.find(
      (product) =>
        normaliserGenre(product.genre) === "femme" &&
        !estPrecommande(product) &&
        product?.images?.[0]?.url,
    );

    return [
      {
        genre: "homme",
        title: "Homme",
        subtitle: "Une allure forte, élégante et assumée.",
        image: getMediaUrl(homme?.images?.[0]?.url),
        route: "/homme",
      },
      {
        genre: "femme",
        title: "Femme",
        subtitle: "L'élégance, la confiance et le caractère.",
        image: getMediaUrl(femme?.images?.[0]?.url),
        route: "/femme",
      },
    ];
  }, [products]);

  /* =======================================================
     VIDÉOS PAR GENRE
  ======================================================= */

  const videosByGenre = useMemo(() => {
    const result = {
      homme: [],
      femme: [],
    };

    videos.forEach((video) => {
      const produitId = getProduitId(video);

      const produit = products.find((item) => String(item._id) === produitId);

      if (!produit) return;

      const genre = normaliserGenre(produit.genre);

      if (genre === "homme" || genre === "femme") {
        result[genre].push({
          ...video,
          produit,
          videoUrl: getMediaUrl(video.url),
        });
      }
    });

    return result;
  }, [videos, products]);

  const activeVideos = videosByGenre[videoGenre] || [];
  const activeVideo = activeVideos[videoIndex] || null;

  /* =======================================================
     IMAGES
  ======================================================= */

  const getImg = (product) => getMediaUrl(product?.images?.[0]?.url);

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

  useEffect(() => {
    setSlide((current) =>
      heroProducts.length ? current % heroProducts.length : 0,
    );
  }, [heroProducts.length]);

  /* =======================================================
     FOCUS AUTOPLAY
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
     BEST SELLERS AUTOPLAY
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
     VIDÉO : CHANGEMENT DE GENRE
  ======================================================= */

  const changerGenreVideo = (genre) => {
    if (genre !== "homme" && genre !== "femme") return;

    setVideoGenre(genre);
    setVideoIndex(0);
    setIsPlaying(true);
  };

  const genreSuivant = () => {
    changerGenreVideo(videoGenre === "femme" ? "homme" : "femme");
  };

  const handleVideoTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleVideoTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const difference = touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 55) {
      genreSuivant();
    }

    touchStartX.current = null;
  };

  /* =======================================================
     VIDÉO : NAVIGATION
  ======================================================= */

  const videoSuivante = () => {
    if (activeVideos.length <= 1) return;

    setVideoIndex((current) => (current + 1) % activeVideos.length);
  };

  useEffect(() => {
    setVideoIndex(0);
    setIsPlaying(true);
    setIsMuted(true);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [videoGenre]);

  useEffect(() => {
    if (!videoRef.current || !activeVideo) return;

    videoRef.current.load();

    const promise = videoRef.current.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(() => setIsPlaying(false));
    }
  }, [activeVideo?._id, activeVideo?.url]);

  /* =======================================================
     CONTRÔLES VIDÉO
  ======================================================= */

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const couperSon = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  /* =======================================================
     UNIVERS : NAVIGATION ET SWIPE
  ======================================================= */

  const universeTouchStart = useRef(null);

  const handleUniverseTouchStart = (event) => {
    universeTouchStart.current = event.touches[0].clientX;
  };

  const handleUniverseTouchEnd = (event) => {
    if (universeTouchStart.current === null) return;

    const difference =
      universeTouchStart.current - event.changedTouches[0].clientX;

    if (difference > 45) {
      setUniverseIndex(1);
    } else if (difference < -45) {
      setUniverseIndex(0);
    }

    universeTouchStart.current = null;
  };

  /* =======================================================
     NAVIGATION FOCUS
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
     NAVIGATION BEST SELLERS
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
            <HeroSlide
              key={product._id}
              $active={index === slide}
              $image={getImg(product)}
            />
          ))
        ) : (
          <HeroSlide $active $image="" />
        )}

        <HeroGradient />

        <HeroBottom>
          <HeroCollection>NUMA — COLLECTION</HeroCollection>

          {precommandeDisponible && (
            <PreorderLink to="/precommande">
              Précommandes ouvertes
              <FaArrowRight />
            </PreorderLink>
          )}
        </HeroBottom>
      </Hero>

      {/* ===================================================
          VIDÉOS HOMME / FEMME
      =================================================== */}

      <VideoSection
        onTouchStart={handleVideoTouchStart}
        onTouchEnd={handleVideoTouchEnd}
      >
        {activeVideo ? (
          <VideoPlayer
            ref={videoRef}
            key={activeVideo._id}
            src={activeVideo.videoUrl}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onEnded={videoSuivante}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <VideoEmpty>
            <div>
              <div className="eyebrow">UNIVERS {videoGenre.toUpperCase()}</div>

              <h2>Les vidéos de cet univers arrivent bientôt.</h2>
            </div>
          </VideoEmpty>
        )}

        <VideoShade />

        <VideoTop>
          <div className="eyebrow">L'UNIVERS NUMA</div>

          <h2>{videoGenre === "femme" ? "Femme" : "Homme"}</h2>

          {activeVideo?.produit?.title && <p>{activeVideo.produit.title}</p>}
        </VideoTop>

        <VideoBottom>
          <VideoControls>
            <VideoButton
              type="button"
              onClick={toggleVideo}
              aria-label={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
            >
              {isPlaying ? <Pause size={19} /> : <Play size={19} />}
            </VideoButton>

            <VideoButton
              type="button"
              onClick={couperSon}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </VideoButton>
          </VideoControls>

          <VideoDots aria-label="Choisir un univers vidéo">
            <VideoDot
              type="button"
              $active={videoGenre === "femme"}
              onClick={() => changerGenreVideo("femme")}
              aria-label="Vidéos Femme"
              aria-pressed={videoGenre === "femme"}
            />

            <VideoDot
              type="button"
              $active={videoGenre === "homme"}
              onClick={() => changerGenreVideo("homme")}
              aria-label="Vidéos Homme"
              aria-pressed={videoGenre === "homme"}
            />
          </VideoDots>
        </VideoBottom>
      </VideoSection>

      {/* ===================================================
          UNIVERS HOMME / FEMME
      =================================================== */}

      <Section>
        <RevealOnScroll>
          <Container>
            <SectionHeader>
              <div className="eyebrow">NOS UNIVERS</div>

              <h2>Deux univers. Une même signature.</h2>

              <p>Découvrez les collections Homme et Femme.</p>
            </SectionHeader>

            <UniverseFrame
              $isDark={$isDark}
              onTouchStart={handleUniverseTouchStart}
              onTouchEnd={handleUniverseTouchEnd}
            >
              <UniverseViewport>
                <UniverseTrack $index={universeIndex}>
                  {universeProducts.map((universe, index) => (
                    <UniverseSlide key={universe.genre} to={universe.route}>
                      {universe.image ? (
                        <UniverseImage
                          src={universe.image}
                          alt={`Collection ${universe.title}`}
                          loading="lazy"
                        />
                      ) : null}

                      <UniverseOverlay>
                        <UniverseInfo>
                          <div className="eyebrow">
                            0{index + 1} — COLLECTION NUMA
                          </div>

                          <h3>{universe.title}</h3>

                          <p>{universe.subtitle}</p>
                        </UniverseInfo>

                        <UniverseArrow>
                          <FaArrowRight />
                        </UniverseArrow>
                      </UniverseOverlay>
                    </UniverseSlide>
                  ))}
                </UniverseTrack>
              </UniverseViewport>
            </UniverseFrame>

            <DotsRow>
              {universeProducts.map((universe, index) => (
                <Dot
                  key={universe.genre}
                  type="button"
                  $active={universeIndex === index}
                  onClick={() => setUniverseIndex(index)}
                  aria-label={`Afficher ${universe.title}`}
                  aria-pressed={universeIndex === index}
                />
              ))}
            </DotsRow>
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

                        <MiniCTA
                          to={
                            estPrecommande(product)
                              ? "/precommande"
                              : `/produit/${product._id}`
                          }
                        >
                          {estPrecommande(product)
                            ? "Précommander"
                            : "Voir le produit"}

                          <FaArrowRight />
                        </MiniCTA>
                      </MiniOverlay>
                    </MiniSlide>
                  ))}

                  {carouselProducts.length > 1 && (
                    <>
                      <CarouselArrow
                        type="button"
                        $left
                        aria-label="Produit précédent"
                        onClick={previousMini}
                      >
                        <span>‹</span>
                      </CarouselArrow>

                      <CarouselArrow
                        type="button"
                        aria-label="Produit suivant"
                        onClick={nextMini}
                      >
                        <span>›</span>
                      </CarouselArrow>
                    </>
                  )}
                </MiniCarousel>

                <DotsRow>
                  {carouselProducts.map((product, index) => (
                    <Dot
                      key={product._id}
                      type="button"
                      $active={index === miniSlide}
                      onClick={() => {
                        setMiniSlide(index);
                        setMiniProgress(0);
                      }}
                      aria-label={`Voir ${product.title}`}
                    />
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
                            to={
                              estPrecommande(product)
                                ? "/precommande"
                                : `/produit/${product._id}`
                            }
                            $isDark={$isDark}
                          >
                            {estPrecommande(product)
                              ? "Précommander"
                              : "Voir le produit"}

                            <FaArrowRight />
                          </BestBtn>
                        </BestContent>
                      </BestSlideInner>
                    </BestSlide>
                  ))}

                  {bestSellers.length > 1 && (
                    <>
                      <CarouselArrow
                        type="button"
                        $left
                        aria-label="Produit précédent"
                        onClick={previousBest}
                      >
                        <span>‹</span>
                      </CarouselArrow>

                      <CarouselArrow
                        type="button"
                        aria-label="Produit suivant"
                        onClick={nextBest}
                      >
                        <span>›</span>
                      </CarouselArrow>
                    </>
                  )}
                </BestCarousel>

                <DotsRow>
                  {bestSellers.map((product, index) => (
                    <Dot
                      key={product._id}
                      type="button"
                      $active={index === bestSlide}
                      onClick={() => {
                        setBestSlide(index);
                        setBestProgress(0);
                      }}
                      aria-label={`Voir ${product.title}`}
                    />
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
          AVANTAGES
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

      {/* ===================================================
          WHATSAPP
      =================================================== */}

      <WhatsAppButton
        href="https://wa.me/2250700247693"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Numa sur WhatsApp"
      >
        <FaWhatsapp />
      </WhatsAppButton>
    </Wrapper>
  );
}
