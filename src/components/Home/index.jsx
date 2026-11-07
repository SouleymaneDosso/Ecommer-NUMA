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

const API_URL = import.meta.env.VITE_API_URL || "";

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

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.35); }
  70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

const slowZoom = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.07); }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

/* =========================================================
   GLOBAL LAYOUT
========================================================= */

const Wrapper = styled.main`
  width: 100%;
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
  padding: 100px 0;

  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

const Container = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 45px;
  padding: 0 15px;

  .eyebrow {
    display: inline-block;
    margin-bottom: 16px;
    color: #b18b55;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(2rem, 4vw, 3.3rem);
    line-height: 1.1;
    font-weight: 400;
    letter-spacing: -0.035em;
  }

  p {
    max-width: 600px;
    margin: 16px auto 0;
    font-size: 0.95rem;
    line-height: 1.8;
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    margin-bottom: 30px;

    h2 {
      font-size: 2rem;
    }
  }
`;

/* =========================================================
   WHATSAPP
========================================================= */

const WhatsAppButton = styled.a`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;

  width: 58px;
  height: 58px;

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
    width: 29px;
    height: 29px;
  }

  @media (max-width: 600px) {
    right: 16px;
    bottom: 16px;
    width: 52px;
    height: 52px;
  }
`;

/* =========================================================
   HERO
========================================================= */

const Hero = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
  background: #101512;
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
    rgba(0, 0, 0, 0.04) 0%,
    transparent 55%,
    rgba(0, 0, 0, 0.4) 100%
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
  gap: 15px;

  @media (max-width: 600px) {
    left: 18px;
    right: 18px;
    bottom: 22px;
  }
`;

const HeroCollection = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 13px 18px;

  color: white;
  text-decoration: none;

  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(17, 27, 22, 0.42);
  backdrop-filter: blur(14px);

  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;

  transition: 0.3s ease;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
  }
`;

const PreorderLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 13px 18px;

  color: white;
  text-decoration: none;

  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(17, 27, 22, 0.42);
  backdrop-filter: blur(14px);

  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;

  transition: 0.3s ease;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
  }

  @media (max-width: 600px) {
    padding: 11px 12px;
    font-size: 0.6rem;
  }
`;

/* =========================================================
   DOTS
========================================================= */

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  margin-top: 22px;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "28px" : "7px")};
  height: 7px;
  padding: 0;

  border: none;
  border-radius: 20px;

  background: ${({ $active }) =>
    $active ? "#b18b55" : "rgba(177, 139, 85, 0.3)"};

  cursor: pointer;
  transition:
    width 0.35s ease,
    background 0.35s ease;
`;

/* =========================================================
   UNIVERS HOMME / FEMME — PLEIN ÉCRAN
========================================================= */

const UniverseSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 620px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #111;

  @media (max-width: 650px) {
    min-height: 620px;
  }
`;

const UniverseSlide = styled.div`
  position: absolute;
  inset: 0;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};

  transition:
    opacity 1s ease,
    visibility 1s ease;
`;

const UniverseImage = styled.img`
  position: absolute;
  inset: 0;

  display: block;
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  animation: ${slowZoom} 6s ease-in-out infinite alternate;
`;

const UniverseShade = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.02) 30%,
    rgba(0, 0, 0, 0.08) 55%,
    rgba(0, 0, 0, 0.48) 100%
  );
`;

const UniverseContent = styled.div`
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: 8%;
  z-index: 2;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  animation: ${fadeUp} 0.8s ease both;

  @media (max-width: 600px) {
    left: 22px;
    right: 22px;
    bottom: 7%;

    align-items: flex-end;
  }
`;

const UniverseTitle = styled.h2`
  margin: 0;
  color: white;

  font-family: Georgia, serif;
  font-size: clamp(3.5rem, 10vw, 8rem);
  line-height: 0.95;
  font-weight: 400;
  letter-spacing: -0.055em;

  @media (max-width: 600px) {
    font-size: clamp(3rem, 16vw, 5.2rem);
  }
`;

const UniverseCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  padding: 15px 21px;

  color: white;
  background: rgba(23, 61, 50, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);

  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;

  transition: 0.3s ease;

  &:hover {
    background: #b18b55;
    transform: translateY(-3px);
  }

  @media (max-width: 600px) {
    padding: 12px 13px;
    font-size: 0.62rem;
  }
`;

const UniverseDots = styled.div`
  position: absolute;
  z-index: 3;
  left: 6%;
  bottom: 35px;

  display: flex;
  gap: 8px;

  @media (max-width: 600px) {
    left: 22px;
    bottom: 20px;
  }
`;

const UniverseDot = styled.button`
  width: ${({ $active }) => ($active ? "28px" : "7px")};
  height: 7px;
  padding: 0;
  border: none;
  border-radius: 20px;
  background: ${({ $active }) =>
    $active ? "#d6b77e" : "rgba(255,255,255,0.5)"};
  cursor: pointer;
  transition: width 0.3s ease;
`;

/* =========================================================
   VIDEO
========================================================= */

const VideoSection = styled.section`
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const VideoFrame = styled.div`
  position: relative;
  width: 100%;
  height: min(800px, 75vh);
  min-height: 480px;
  overflow: hidden;
  background: #080b09;

  @media (max-width: 650px) {
    height: 65vh;
    min-height: 420px;
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

const VideoControls = styled.div`
  position: absolute;
  left: 25px;
  right: 25px;
  bottom: 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  z-index: 2;
`;

const VideoControlGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const VideoButton = styled.button`
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;

  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);

  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
  }
`;

const VideoCaption = styled.div`
  width: 100%;
  padding: 30px 6%;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #202b23, #141b16)"
      : "linear-gradient(135deg, #e9e4d9, #f5f1e9)"};

  border-bottom: 1px solid
    ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.09)" : "rgba(23,61,50,0.12)"};
`;

const VideoCaptionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  .eyebrow {
    color: #b18b55;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 0;
    font-size: clamp(1.7rem, 4vw, 2.7rem);
  }

  p {
    margin: 8px 0 0;
    opacity: 0.65;
  }
`;

const VideoGenreButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const GenreChoice = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;

  padding: 8px 0;

  border: none;
  color: ${({ $active, $isDark }) =>
    $active ? "#b18b55" : $isDark ? "#f8f7f2" : "#20251f"};

  background: transparent;
  opacity: ${({ $active }) => ($active ? 1 : 0.55)};

  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;

  cursor: pointer;
`;

const RadioDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;

  background: ${({ $active }) => ($active ? "#b18b55" : "transparent")};
  border: 1px solid #b18b55;
`;

const VideoNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
`;

const VideoDot = styled.button`
  width: ${({ $active }) => ($active ? "28px" : "8px")};
  height: 8px;
  padding: 0;

  border: none;
  border-radius: 20px;

  background: ${({ $active }) =>
    $active ? "#b18b55" : "rgba(177,139,85,0.35)"};

  cursor: pointer;
  transition: 0.3s ease;
`;

const VideoEmpty = styled.div`
  width: 100%;
  min-height: 480px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  text-align: center;
  padding: 25px;

  background: #101512;

  h2 {
    font-size: clamp(1.6rem, 4vw, 2.5rem);
  }
`;

/* =========================================================
   FOCUS CAROUSEL
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

  padding: 22px 25px;

  color: white;
  background: rgba(18, 28, 22, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px;
  }
`;

const MiniInfo = styled.div`
  h3 {
    margin: 0;
    font-size: clamp(1.3rem, 3vw, 1.8rem);
  }

  p {
    margin: 8px 0 0;
    font-size: 0.88rem;
    opacity: 0.7;
  }
`;

const MiniCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  padding: 13px 19px;

  color: white;
  background: #173d32;
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

  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #b18b55;
  }
`;

/* =========================================================
   BEST SELLERS — FULL BLEED
========================================================= */

const BestSellerSection = styled.section`
  width: 100%;
  margin: 0;
`;

const BestCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 90vh;
  height: 90svh;
  min-height: 600px;
  overflow: hidden;
  background: #101510;

  @media (max-width: 650px) {
    height: 75vh;
    height: 75svh;
    min-height: 520px;
  }
`;

const BestSlide = styled.div`
  position: absolute;
  inset: 0;

  opacity: ${({ $active }) => ($active ? 1 : 0)};
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};
  transition:
    opacity 0.9s ease,
    visibility 0.9s ease;
`;

const BestImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
  object-position: center;

  transform: ${({ $active }) => ($active ? "scale(1)" : "scale(1.04)")};
  transition: transform 6s ease;
`;

const BestShade = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.12) 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.38) 100%
  );
`;

const BestBadge = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 2;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  padding: 11px 15px;

  color: #fff;
  background: rgba(23, 61, 50, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);

  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 2px;

  @media (max-width: 600px) {
    top: 18px;
    left: 18px;
  }
`;

const BestStars = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #e3bd76;

  svg {
    font-size: 13px;
  }

  @media (max-width: 600px) {
    svg {
      font-size: 11px;
    }
  }
`;

const BestBottom = styled.div`
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 55px;
  z-index: 3;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  color: white;

  @media (max-width: 600px) {
    left: 20px;
    right: 20px;
    bottom: 45px;
    align-items: flex-start;
    flex-direction: column;
  }
`;

const BestPhrase = styled.div`
  max-width: 480px;

  h3 {
    margin: 0;
    font-family: Georgia, serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    line-height: 1.1;
    font-weight: 400;
    letter-spacing: -0.025em;
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.25);
  }
`;

const BestBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;

  padding: 14px 20px;

  color: #172019;
  background: #d6b77e;

  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;

  transition: 0.3s ease;

  &:hover {
    background: white;
    transform: translateY(-3px);
  }
`;

const BestDots = styled.div`
  position: absolute;
  z-index: 4;
  left: 5%;
  bottom: 20px;

  display: flex;
  align-items: center;
  gap: 9px;

  @media (max-width: 600px) {
    left: 20px;
    bottom: 15px;
  }
`;

const BestDot = styled.button`
  width: ${({ $active }) => ($active ? "27px" : "7px")};
  height: 7px;
  padding: 0;
  border: none;
  border-radius: 20px;

  background: ${({ $active }) =>
    $active ? "#d6b77e" : "rgba(255,255,255,0.55)"};

  cursor: pointer;
  transition: width 0.3s ease;
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
  min-height: 240px;

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

const EmptyState = styled.div`
  min-height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  opacity: 0.55;
`;

/* =========================================================
   COMPOSANT : UNIVERS HOMME / FEMME
========================================================= */

function UniverseShowcase({ title, genre, products }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = products.filter((product) => product?.images?.[0]?.url);

  useEffect(() => {
    setActiveIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  const goTo = (index) => {
    setActiveIndex(index);
  };

  return (
    <UniverseSection>
      {items.length > 0 ? (
        items.map((product, index) => (
          <UniverseSlide key={product._id} $active={index === activeIndex}>
            <Link
              to={`/${genre}`}
              aria-label={`Découvrir la collection ${title}`}
              style={{
                position: "absolute",
                inset: 0,
                display: "block",
              }}
            >
              <UniverseImage
                src={getMediaUrl(product.images?.[0]?.url)}
                alt={product.title || `Collection ${title}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <UniverseShade />
            </Link>
          </UniverseSlide>
        ))
      ) : (
        <UniverseSlide $active>
          <UniverseShade />
        </UniverseSlide>
      )}

      <UniverseContent>
        <UniverseTitle>{title}</UniverseTitle>

        <UniverseCTA to={`/${genre}`}>
          Découvrir <FaArrowRight />
        </UniverseCTA>
      </UniverseContent>

      {items.length > 1 && (
        <UniverseDots>
          {items.map((product, index) => (
            <UniverseDot
              key={product._id}
              type="button"
              $active={index === activeIndex}
              onClick={() => goTo(index)}
              aria-label={`Afficher l'image ${index + 1}`}
            />
          ))}
        </UniverseDots>
      )}
    </UniverseSection>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [slide, setSlide] = useState(0);
  const [miniSlide, setMiniSlide] = useState(0);
  const [bestSlide, setBestSlide] = useState(0);

  const [videoGenre, setVideoGenre] = useState("homme");
  const [videoIndex, setVideoIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [precommandeDisponible, setPrecommandeDisponible] = useState(false);

  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "light";

  const videoRef = useRef(null);
  const videoTouchStart = useRef(null);

  const duration = 5000;

  /* =======================================================
   FETCH BEST SELLERS
======================================================= */

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/produits/best-sellers`);

        if (!response.ok) {
          throw new Error("Erreur récupération Best Sellers");
        }

        const data = await response.json();

        setBestSellers(
          (Array.isArray(data) ? data : [])
            .filter(
              (product) =>
                product.bestSeller === true &&
                product.disponible === true &&
                !estPrecommande(product) &&
                product.images?.[0]?.url,
            )
            .slice(0, 5),
        );
      } catch (error) {
        console.error("Erreur Best Sellers :", error);
        setBestSellers([]);
      }
    };

    fetchBestSellers();
  }, []);

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
     HERO
  ======================================================= */

  const heroProducts = useMemo(
    () =>
      products.filter((product) => product.hero && product.images?.[0]?.url),
    [products],
  );

  /* =======================================================
     PRODUITS PAR UNIVERS
  ======================================================= */

  const hommeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          normaliserGenre(product.genre) === "homme" &&
          !estPrecommande(product) &&
          product?.images?.[0]?.url,
      ),
    [products],
  );

  const femmeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          normaliserGenre(product.genre) === "femme" &&
          !estPrecommande(product) &&
          product?.images?.[0]?.url,
      ),
    [products],
  );

  /* =======================================================
     FOCUS
     Exclusion des Best Sellers pour éviter les doublons.
  ======================================================= */

  const carouselProducts = useMemo(() => {
    const bestSellerIds = new Set(
      bestSellers.map((product) => String(product._id)),
    );

    return products
      .filter(
        (product) =>
          !estPrecommande(product) &&
          product?.images?.[0]?.url &&
          !bestSellerIds.has(String(product._id)),
      )
      .slice(0, 5);
  }, [products, bestSellers]);

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
     HERO AUTOPLAY
  ======================================================= */

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const interval = setInterval(() => {
      setSlide((current) => (current + 1) % heroProducts.length);
    }, duration);

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

    const interval = setInterval(() => {
      setMiniSlide((current) => (current + 1) % carouselProducts.length);
    }, duration);

    return () => clearInterval(interval);
  }, [carouselProducts.length]);

  /* =======================================================
     BEST SELLERS AUTOPLAY
  ======================================================= */

  useEffect(() => {
    if (bestSellers.length <= 1) return;

    const interval = setInterval(() => {
      setBestSlide((current) => (current + 1) % bestSellers.length);
    }, duration);

    return () => clearInterval(interval);
  }, [bestSellers.length]);

  /* =======================================================
     VIDÉOS : NAVIGATION
  ======================================================= */

  const changerGenreVideo = (genre) => {
    if (genre !== "homme" && genre !== "femme") return;

    setVideoGenre(genre);
    setVideoIndex(0);
    setIsPlaying(true);
    setIsMuted(true);
  };

  const videoSuivante = () => {
    if (activeVideos.length <= 1) return;

    setVideoIndex((current) => (current + 1) % activeVideos.length);
  };

  const videoPrecedente = () => {
    if (activeVideos.length <= 1) return;

    setVideoIndex((current) =>
      current === 0 ? activeVideos.length - 1 : current - 1,
    );
  };

  const handleVideoTouchStart = (event) => {
    videoTouchStart.current = event.touches[0].clientX;
  };

  const handleVideoTouchEnd = (event) => {
    if (videoTouchStart.current === null) return;

    const difference =
      videoTouchStart.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 55) {
      if (difference > 0) {
        videoSuivante();
      } else {
        videoPrecedente();
      }
    }

    videoTouchStart.current = null;
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
     NAVIGATION FOCUS
  ======================================================= */

  const previousMini = () => {
    if (!carouselProducts.length) return;

    setMiniSlide((current) =>
      current === 0 ? carouselProducts.length - 1 : current - 1,
    );
  };

  const nextMini = () => {
    if (!carouselProducts.length) return;

    setMiniSlide((current) => (current + 1) % carouselProducts.length);
  };

  /* =======================================================
     NAVIGATION BEST SELLERS
  ======================================================= */

  const previousBest = () => {
    if (!bestSellers.length) return;

    setBestSlide((current) =>
      current === 0 ? bestSellers.length - 1 : current - 1,
    );
  };

  const nextBest = () => {
    if (!bestSellers.length) return;

    setBestSlide((current) => (current + 1) % bestSellers.length);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Wrapper $isDark={$isDark}>
      {/* HERO */}

      <Hero>
        {heroProducts.length > 0 ? (
          heroProducts.map((product, index) => (
            <HeroSlide
              key={product._id}
              $active={index === slide}
              $image={getMediaUrl(product.images?.[0]?.url)}
            />
          ))
        ) : (
          <HeroSlide $active $image="" />
        )}

        <HeroGradient />

        <HeroBottom>
          <HeroCollection to="/collections">
            Explorer la collection <FaArrowRight />
          </HeroCollection>

          {precommandeDisponible && (
            <PreorderLink to="/precommande">
              Précommandes ouvertes <FaArrowRight />
            </PreorderLink>
          )}
        </HeroBottom>
      </Hero>

      {/* UNIVERS HOMME : UNE IMAGE À LA FOIS */}

      <UniverseShowcase title="Homme" genre="homme" products={hommeProducts} />

      {/* UNIVERS FEMME : UNE IMAGE À LA FOIS */}

      <UniverseShowcase title="Femme" genre="femme" products={femmeProducts} />

      {/* VIDÉOS */}

      <VideoSection>
        {activeVideo ? (
          <VideoFrame
            onTouchStart={handleVideoTouchStart}
            onTouchEnd={handleVideoTouchEnd}
          >
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

            <VideoControls>
              <VideoControlGroup>
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
              </VideoControlGroup>

              {activeVideos.length > 1 && (
                <VideoControlGroup>
                  <VideoButton
                    type="button"
                    onClick={videoPrecedente}
                    aria-label="Vidéo précédente"
                  >
                    ‹
                  </VideoButton>

                  <VideoButton
                    type="button"
                    onClick={videoSuivante}
                    aria-label="Vidéo suivante"
                  >
                    ›
                  </VideoButton>
                </VideoControlGroup>
              )}
            </VideoControls>
          </VideoFrame>
        ) : (
          <VideoEmpty>
            <div>
              <h2>Les vidéos de cet univers arrivent bientôt.</h2>
            </div>
          </VideoEmpty>
        )}

        <VideoCaption $isDark={$isDark}>
          <VideoCaptionTop>
            <div>
              <div className="eyebrow">L'UNIVERS NUMA</div>

              <h2>{videoGenre === "femme" ? "Femme" : "Homme"}</h2>

              <p>
                {activeVideo?.produit?.title ||
                  "Découvrez nos créations en mouvement."}
              </p>
            </div>

            <VideoGenreButtons>
              <GenreChoice
                type="button"
                $active={videoGenre === "homme"}
                $isDark={$isDark}
                onClick={() => changerGenreVideo("homme")}
              >
                <RadioDot $active={videoGenre === "homme"} />
                Homme
              </GenreChoice>

              <GenreChoice
                type="button"
                $active={videoGenre === "femme"}
                $isDark={$isDark}
                onClick={() => changerGenreVideo("femme")}
              >
                <RadioDot $active={videoGenre === "femme"} />
                Femme
              </GenreChoice>
            </VideoGenreButtons>
          </VideoCaptionTop>

          {activeVideos.length > 1 && (
            <VideoNavigation>
              {activeVideos.map((video, index) => (
                <VideoDot
                  key={video._id}
                  type="button"
                  $active={index === videoIndex}
                  onClick={() => setVideoIndex(index)}
                  aria-label={`Voir la vidéo ${index + 1}`}
                />
              ))}
            </VideoNavigation>
          )}
        </VideoCaption>
      </VideoSection>

      {/* FOCUS */}

      <Section>
        <CarouselSection>
          <SectionHeader>
            <div className="eyebrow">FOCUS</div>

            <h2>Des pièces qui attirent le regard.</h2>

            <p>Une sélection de créations pensées pour marquer les esprits.</p>
          </SectionHeader>

          {carouselProducts.length > 0 ? (
            <>
              <MiniCarousel $isDark={$isDark}>
                {carouselProducts.map((product, index) => (
                  <MiniSlide key={product._id} $active={index === miniSlide}>
                    <MiniSlideImg
                      src={getMediaUrl(product.images?.[0]?.url)}
                      alt={product.title}
                    />

                    <MiniOverlay>
                      <MiniInfo>
                        <h3>{product.title}</h3>
                        <p>
                          {product.subtitle ||
                            "Une pièce signature à forte présence."}
                        </p>
                      </MiniInfo>

                      <MiniCTA to={`/produit/${product._id}`}>
                        Voir le produit <FaArrowRight />
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
                      ‹
                    </CarouselArrow>

                    <CarouselArrow
                      type="button"
                      aria-label="Produit suivant"
                      onClick={nextMini}
                    >
                      ›
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
                    onClick={() => setMiniSlide(index)}
                    aria-label={`Voir ${product.title}`}
                  />
                ))}
              </DotsRow>
            </>
          ) : (
            <EmptyState>Aucune pièce disponible pour le moment.</EmptyState>
          )}
        </CarouselSection>
      </Section>

      {/* BEST SELLERS */}

      <BestSellerSection>
        <Section>
          <SectionHeader>
            <div className="eyebrow">BEST SELLERS</div>
            <h2>Nos pièces incontournables.</h2>
          </SectionHeader>
        </Section>

        {bestSellers.length > 0 ? (
          <BestCarousel>
            {bestSellers.map((product, index) => (
              <BestSlide key={product._id} $active={index === bestSlide}>
                <Link
                  to={`/produit/${product._id}`}
                  aria-label={`Découvrir ${product.title}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                  }}
                >
                  <BestImage
                    src={getMediaUrl(product.images?.[0]?.url)}
                    alt={product.title}
                    $active={index === bestSlide}
                  />
                  <BestShade />
                </Link>

                <BestBadge>
                  <FaStar />
                  BEST SELLER
                </BestBadge>

                <BestBottom>
                  <BestPhrase>
                    <h3>Une pièce qui fait la différence.</h3>
                  </BestPhrase>

                  <BestStars aria-label="5 étoiles">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <FaStar key={starIndex} />
                    ))}
                  </BestStars>
                </BestBottom>
              </BestSlide>
            ))}

            {bestSellers.length > 1 && (
              <>
                <CarouselArrow
                  type="button"
                  $left
                  aria-label="Best Seller précédent"
                  onClick={previousBest}
                >
                  ‹
                </CarouselArrow>

                <CarouselArrow
                  type="button"
                  aria-label="Best Seller suivant"
                  onClick={nextBest}
                >
                  ›
                </CarouselArrow>

                <BestDots>
                  {bestSellers.map((product, index) => (
                    <BestDot
                      key={product._id}
                      type="button"
                      $active={index === bestSlide}
                      onClick={() => setBestSlide(index)}
                      aria-label={`Voir le Best Seller ${index + 1}`}
                    />
                  ))}
                </BestDots>
              </>
            )}
          </BestCarousel>
        ) : (
          <EmptyState>
            <h3>Notre sélection arrive bientôt.</h3>
          </EmptyState>
        )}
      </BestSellerSection>

      {/* AVANTAGES */}

      <Section>
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
                Recevez vos articles rapidement, soigneusement emballés et prêts
                à être portés.
              </BenefitText>
            </BenefitCard>

            <BenefitCard $isDark={$isDark}>
              <BenefitIcon $isDark={$isDark}>
                <FaShieldAlt />
              </BenefitIcon>

              <BenefitTitle>Paiement sécurisé</BenefitTitle>

              <BenefitText>
                Vos transactions sont protégées pour vous offrir une expérience
                d'achat sereine.
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
      </Section>

      {/* WHATSAPP */}

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
