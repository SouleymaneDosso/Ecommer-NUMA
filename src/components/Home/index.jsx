import {
  useState,
  useEffect,
  useMemo,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
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

const getProductId = (video) => {
  const id = video?.produitId;
  return typeof id === "object" ? id?._id : id;
};

const getMediaUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slowZoom = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.07); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const borderFlow = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const whatsappPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, .45); }
  70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

/* =========================================================
   GLOBAL WRAPPER
========================================================= */

const Wrapper = styled.main`
  min-height: 100vh;
  overflow: hidden;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(180deg, #090d0c, #101714)"
      : "linear-gradient(180deg, #fbfaf7, #f2f0eb)"};

  color: ${({ $isDark }) => ($isDark ? "#f8f6f0" : "#191d1a")};

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
  transform: translateY(${({ $visible }) => ($visible ? "0" : "35px")});
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: ${({ $delay }) => `${$delay}s`};
`;

/* =========================================================
   SECTION HEADERS
========================================================= */

const SectionHeader = styled.div`
  max-width: 850px;
  margin: 0 auto 48px;
  padding: 0 15px;
  text-align: center;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 17px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.55;

    &::before,
    &::after {
      content: "";
      width: 25px;
      height: 1px;
      background: currentColor;
      opacity: 0.55;
    }
  }

  h2 {
    margin: 0 0 17px;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 800;
  }

  p {
    max-width: 680px;
    margin: 0 auto;
    font-size: 0.98rem;
    line-height: 1.8;
    opacity: 0.65;
  }

  @media (max-width: 600px) {
    margin-bottom: 35px;

    h2 {
      font-size: 2rem;
    }
    p {
      font-size: 0.91rem;
    }
  }
`;

/* =========================================================
   HERO
========================================================= */

const Hero = styled.section`
  position: relative;
  width: 100%;
  height: min(920px, 100svh);
  min-height: 620px;
  overflow: hidden;
  background: #080b09;

  @media (max-width: 768px) {
    height: 85svh;
    min-height: 570px;
  }
`;

const HeroSlide = styled.div`
  position: absolute;
  inset: -1%;
  background-image: ${({ $image }) => `url("${$image}")`};
  background-size: cover;
  background-position: center;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 1.2s ease;
  animation: ${slowZoom} 10s ease-in-out infinite alternate;
`;

const HeroShade = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent 35%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.12), transparent 65%);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: min(1240px, 92%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 48px;

  @media (max-width: 768px) {
    padding-bottom: 35px;
  }
`;

const HeroCollectionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 13px;
  color: rgba(255, 255, 255, 0.76);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.65rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.23);
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  svg {
    font-size: 0.72rem;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.65);
    background: rgba(0, 0, 0, 0.3);
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

/* =========================================================
   FULL SCREEN UNIVERSES
========================================================= */

const UniverseSection = styled.section`
  position: relative;
  width: 100%;
  height: min(900px, 100svh);
  min-height: 650px;
  overflow: hidden;
  background: #101310;

  @media (max-width: 768px) {
    height: 78svh;
    min-height: 570px;
  }
`;

const UniverseTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  touch-action: pan-x pan-y;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const UniverseSlide = styled.article`
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  scroll-snap-align: start;
  background: #111;
`;

const UniverseImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);

  ${UniverseSlide}:hover & {
    transform: scale(1.035);
  }
`;

const UniverseFallback = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 70% 30%,
      rgba(198, 163, 106, 0.2),
      transparent 35%
    ),
    linear-gradient(135deg, #1b2923, #080b09);
`;

const UniverseShade = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.78), transparent 65%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.15), transparent 70%);
`;

const UniverseTop = styled.div`
  position: absolute;
  top: 35px;
  left: 5%;
  right: 5%;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  span {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.8;
  }
`;

const UniverseCounter = styled.span`
  font-variant-numeric: tabular-nums;
`;

const UniverseBottom = styled.div`
  position: absolute;
  z-index: 2;
  left: 7%;
  right: 7%;
  bottom: 85px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
  color: white;

  @media (max-width: 650px) {
    left: 6%;
    right: 6%;
    bottom: 82px;
    align-items: flex-end;
  }
`;

const UniverseInfo = styled.div`
  max-width: 650px;

  .eyebrow {
    display: inline-block;
    margin-bottom: 15px;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #e3c99b;
  }

  h2 {
    margin: 0 0 12px;
    font-size: clamp(3rem, 7vw, 6.5rem);
    line-height: 0.92;
    letter-spacing: -0.065em;
    font-weight: 800;
  }

  p {
    max-width: 440px;
    margin: 0;
    font-size: 0.96rem;
    line-height: 1.7;
    opacity: 0.82;
  }

  @media (max-width: 600px) {
    h2 {
      font-size: 3.4rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

const UniverseProductTitle = styled.div`
  margin-top: 17px;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.8;
`;

const UniverseArrow = styled(Link)`
  flex-shrink: 0;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #171a16;
  background: #f5f0e6;
  border-radius: 50%;
  text-decoration: none;
  transition:
    transform 0.35s ease,
    background 0.35s ease;

  svg {
    font-size: 1.15rem;
  }

  &:hover {
    transform: translateX(7px);
    background: #d6bd91;
  }

  @media (max-width: 600px) {
    width: 49px;
    height: 49px;
  }
`;

const UniverseDots = styled.div`
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 9px;
`;

const UniverseDot = styled.button`
  width: ${({ $active }) => ($active ? "32px" : "7px")};
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 20px;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? "#e5c99b" : "rgba(255,255,255,.48)"};
  transition:
    width 0.3s ease,
    background 0.3s ease;
`;

const UniverseEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: white;
  text-align: center;
  background: linear-gradient(135deg, #1b2923, #080b09);

  h2 {
    margin: 0 0 10px;
    font-size: clamp(3rem, 8vw, 6rem);
    letter-spacing: -0.06em;
  }

  p {
    opacity: 0.7;
  }
`;

/* =========================================================
   VIDEO SECTION
========================================================= */

const VideoSection = styled.section`
  position: relative;
  width: 100%;
  height: min(900px, 100svh);
  min-height: 650px;
  overflow: hidden;
  background: #080b09;

  @media (max-width: 768px) {
    height: 78svh;
    min-height: 570px;
  }
`;

const VideoPlayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #080b09;
  pointer-events: none;
`;

const VideoShade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.72), transparent 55%);
`;

const VideoTop = styled.div`
  position: absolute;
  top: 35px;
  left: 5%;
  right: 5%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;

  span {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
`;

const VideoGenderDots = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const VideoGenderButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 0;
  border: 0;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 0.68rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: ${({ $active }) => ($active ? 1 : 0.55)};

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? "#e5c99b" : "white")};
    box-shadow: ${({ $active }) =>
      $active ? "0 0 12px rgba(229,201,155,.7)" : "none"};
  }
`;

const VideoCaption = styled.div`
  position: absolute;
  left: 6%;
  bottom: 82px;
  z-index: 3;
  color: white;

  span {
    display: block;
    margin-bottom: 12px;
    font-size: 0.68rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #e5c99b;
  }

  h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 4.5rem);
    letter-spacing: -0.05em;
  }

  p {
    margin: 10px 0 0;
    font-size: 0.9rem;
    opacity: 0.75;
  }
`;

const VideoControls = styled.div`
  position: absolute;
  z-index: 4;
  right: 5%;
  bottom: 35px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VideoButton = styled.button`
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  color: white;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition:
    background 0.25s ease,
    transform 0.25s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.06);
  }
`;

const VideoDots = styled.div`
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 39px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
`;

const VideoDot = styled.button`
  width: ${({ $active }) => ($active ? "27px" : "7px")};
  height: 7px;
  border: 0;
  border-radius: 20px;
  padding: 0;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? "#e5c99b" : "rgba(255,255,255,.45)"};
  transition: width 0.3s ease;
`;

const VideoEmpty = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 25px;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, #1b2923, #080b09);

  h2 {
    font-size: 2rem;
  }
  p {
    opacity: 0.7;
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
  width: ${({ $active }) => ($active ? "40px" : "8px")};
  height: 8px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 99px;
  cursor: pointer;
  background: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.13)"};
  transition: width 0.3s ease;
`;

const DotProgress = styled.span`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $width }) => `${$width}%`};
  border-radius: inherit;
  background: ${({ $isDark }) => ($isDark ? "#e5c99b" : "#876c42")};
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
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.13);

  @media (max-width: 768px) {
    height: 560px;
  }
`;

const MiniSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition: opacity 0.7s ease;
`;

const MiniSlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.8s ease;

  ${MiniSlide}:hover & {
    transform: scale(1.025);
  }
`;

const MiniOverlay = styled.div`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 23px 26px;
  color: white;
  background: rgba(12, 15, 13, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(16px);

  @media (max-width: 650px) {
    left: 12px;
    right: 12px;
    bottom: 12px;
    flex-direction: column;
    align-items: flex-start;
    padding: 18px;
  }
`;

const MiniInfo = styled.div`
  h3 {
    margin: 0 0 8px;
    font-size: clamp(1.35rem, 3vw, 2rem);
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    opacity: 0.75;
  }
`;

const MiniCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding: 13px 19px;
  color: #171a16;
  background: #f5f0e6;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 800;
  transition:
    transform 0.3s ease,
    background 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: #dfc79f;
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
  background: ${({ $isDark }) => ($isDark ? "#101512" : "#e9e6df")};
  box-shadow: 0 25px 75px rgba(0, 0, 0, 0.13);

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
  transition: opacity 0.7s ease;
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
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ $isDark }) => ($isDark ? "#090e0b" : "#e5e1d9")};
`;

const BestImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 25px;
  object-fit: contain;
  transition: transform 0.8s ease;

  ${BestSlide}:hover & {
    transform: scale(1.025);
  }
`;

const BestBadge = styled.div`
  position: absolute;
  top: 22px;
  left: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  color: white;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  font-size: 0.66rem;
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
      ? "linear-gradient(135deg,#17221b,#0d120f)"
      : "linear-gradient(135deg,#fbfaf7,#eae6dd)"};

  @media (max-width: 900px) {
    padding: 30px;
  }
`;

const BestSmall = styled.span`
  margin-bottom: 15px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.5;
`;

const BestTitle = styled.h3`
  margin: 0 0 16px;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1;
  letter-spacing: -0.055em;
`;

const BestSubtitle = styled.p`
  max-width: 500px;
  margin: 0 0 23px;
  font-size: 0.95rem;
  line-height: 1.8;
  opacity: 0.68;
`;

const BestPrice = styled.div`
  margin-bottom: 25px;
  font-size: 1.35rem;
  font-weight: 800;
`;

const BestBtn = styled(Link)`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 11px;
  padding: 15px 22px;
  color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
  background: ${({ $isDark }) => ($isDark ? "#f5f0e6" : "#17231b")};
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 800;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
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
  z-index: 5;
  top: 50%;
  transform: translateY(-50%);
  ${({ $left }) => ($left ? "left: 17px;" : "right: 17px;")}
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.75);
    transform: translateY(-50%) scale(1.06);
  }

  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    ${({ $left }) => ($left ? "left: 8px;" : "right: 8px;")}
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
  min-height: 245px;
  padding: 32px;
  background: ${({ $isDark }) =>
    $isDark ? "rgba(255,255,255,.035)" : "rgba(255,255,255,.72)"};
  border: 1px solid
    ${({ $isDark }) => ($isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)")};
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.055);
  backdrop-filter: blur(15px);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 25px 55px rgba(0, 0, 0, 0.1);
  }
`;

const BenefitIcon = styled.div`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  margin-bottom: 23px;
  color: ${({ $isDark }) => ($isDark ? "#17231b" : "#f5f0e6")};
  background: ${({ $isDark }) => ($isDark ? "#f5f0e6" : "#17231b")};
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
  font-size: 0.89rem;
  line-height: 1.75;
  opacity: 0.65;
`;

const EmptyState = styled.div`
  min-height: 300px;
  display: grid;
  place-items: center;
  text-align: center;
  opacity: 0.6;
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
  color: white;
  background: #25d366;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  animation: ${whatsappPulse} 2.5s infinite;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 600px) {
    right: 15px;
    bottom: 15px;
    width: 52px;
    height: 52px;
  }
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function HomePremium() {
  const { theme } = useContext(ThemeContext);
  const $isDark = theme === "dark";

  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [precommandeDisponible, setPrecommandeDisponible] = useState(false);

  const [heroSlide, setHeroSlide] = useState(0);

  const [videoGenre, setVideoGenre] = useState("femme");
  const [videoIndex, setVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [hommeIndex, setHommeIndex] = useState(0);
  const [femmeIndex, setFemmeIndex] = useState(0);

  const [miniSlide, setMiniSlide] = useState(0);
  const [miniProgress, setMiniProgress] = useState(0);

  const [bestSlide, setBestSlide] = useState(0);
  const [bestProgress, setBestProgress] = useState(0);

  const videoRef = useRef(null);
  const hommeTrackRef = useRef(null);
  const femmeTrackRef = useRef(null);
  const miniIntervalRef = useRef(null);
  const bestIntervalRef = useRef(null);

  const duration = 4200;

  /* -------------------------------------------------------
     IMAGES
  ------------------------------------------------------- */

  const getImg = useCallback((product) => {
    const image = product?.images?.[0]?.url || product?.image;
    return getMediaUrl(image);
  }, []);

  /* -------------------------------------------------------
     FETCH PRODUCTS, VIDEOS AND PREORDERS
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/produits`);
        if (!response.ok) throw new Error("Erreur chargement produits");
        const data = await response.json();
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur produits :", error);
        if (mounted) setProducts([]);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos/produits`);
        if (!response.ok) throw new Error("Erreur chargement vidéos");
        const data = await response.json();
        const list = Array.isArray(data?.videos)
          ? data.videos.filter((item) => item?.url && item?.produitId)
          : [];
        if (mounted) setVideos(list);
      } catch (error) {
        console.error("Erreur vidéos :", error);
        if (mounted) setVideos([]);
      }
    };

    const fetchPrecommandes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/precommandes/modeles`);
        if (!response.ok) throw new Error("Erreur précommandes");
        const data = await response.json();
        const modeles = Array.isArray(data)
          ? data
          : data?.modeles || data?.data || [];
        if (mounted) setPrecommandeDisponible(modeles.length > 0);
      } catch (error) {
        console.error("Erreur précommandes :", error);
        if (mounted) setPrecommandeDisponible(false);
      }
    };

    fetchProducts();
    fetchVideos();
    fetchPrecommandes();

    return () => {
      mounted = false;
    };
  }, []);

  /* -------------------------------------------------------
     PRODUCT GROUPS
  ------------------------------------------------------- */

  const heroProducts = useMemo(
    () => products.filter((product) => product.hero),
    [products],
  );

  const hommeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          normaliserGenre(product.genre) === "homme" &&
          !estPrecommande(product) &&
          getImg(product),
      ),
    [products, getImg],
  );

  const femmeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          normaliserGenre(product.genre) === "femme" &&
          !estPrecommande(product) &&
          getImg(product),
      ),
    [products, getImg],
  );

  const carouselProducts = useMemo(
    () => products.filter((product) => !estPrecommande(product)).slice(0, 5),
    [products],
  );

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

  /* -------------------------------------------------------
     VIDEOS BY GENDER
  ------------------------------------------------------- */

  const videosByGenre = useMemo(() => {
    const grouped = { homme: [], femme: [] };

    videos.forEach((video) => {
      const productId = getProductId(video);
      const product = products.find(
        (item) => String(item._id) === String(productId),
      );

      const genre = normaliserGenre(product?.genre);

      if (product && grouped[genre] && video.url) {
        grouped[genre].push({
          ...video,
          product,
        });
      }
    });

    return grouped;
  }, [videos, products]);

  const activeVideos = videosByGenre[videoGenre] || [];
  const activeVideo = activeVideos[videoIndex] || null;

  useEffect(() => {
    setVideoIndex(0);
    setIsPlaying(true);
  }, [videoGenre]);

  useEffect(() => {
    if (!videoRef.current || !activeVideo) return;

    videoRef.current.load();
    videoRef.current.muted = isMuted;

    const promise = videoRef.current.play();
    if (promise?.catch) promise.catch(() => setIsPlaying(false));
  }, [activeVideo, isMuted]);

  const changeVideoGenre = (genre) => {
    setVideoGenre(genre);
    setVideoIndex(0);
    setIsPlaying(true);
  };

  const nextVideo = () => {
    if (activeVideos.length <= 1) return;
    setVideoIndex((current) => (current + 1) % activeVideos.length);
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  /* -------------------------------------------------------
     VIDEO HORIZONTAL SWIPE
  ------------------------------------------------------- */

  const videoTouchStart = useRef(null);

  const handleVideoTouchStart = (event) => {
    videoTouchStart.current = event.touches[0].clientX;
  };

  const handleVideoTouchEnd = (event) => {
    if (videoTouchStart.current === null) return;

    const distance = videoTouchStart.current - event.changedTouches[0].clientX;

    if (Math.abs(distance) > 55) {
      const nextGenre = distance > 0 ? "homme" : "femme";
      changeVideoGenre(nextGenre);
    }

    videoTouchStart.current = null;
  };

  /* -------------------------------------------------------
     HERO AUTOPLAY
  ------------------------------------------------------- */

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const timer = setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroProducts.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [heroProducts.length]);

  /* -------------------------------------------------------
     UNIVERSE CAROUSEL SCROLL
  ------------------------------------------------------- */

  const scrollUniverseTo = (ref, index) => {
    if (!ref.current) return;

    const width = ref.current.clientWidth;
    ref.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  const handleUniverseScroll = (ref, setter) => {
    if (!ref.current) return;

    const width = ref.current.clientWidth;
    if (!width) return;

    const index = Math.round(ref.current.scrollLeft / width);
    setter(index);
  };

  /* -------------------------------------------------------
     FOCUS AUTOPLAY
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     BEST SELLERS AUTOPLAY
  ------------------------------------------------------- */

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
      {/* HERO : IMAGE + LIEN COLLECTION DISCRET */}

      <Hero>
        {heroProducts.length > 0 ? (
          heroProducts.map((product, index) => (
            <HeroSlide
              key={product._id}
              $active={index === heroSlide}
              $image={getImg(product)}
            />
          ))
        ) : (
          <HeroSlide $active $image="" />
        )}

        <HeroShade />

        <HeroContent>
          <HeroCollectionLink to="/collections">
            Explorer la collection <FaArrowRight />
          </HeroCollectionLink>
        </HeroContent>
      </Hero>

      {/* VIDÉOS : UNIVERS HOMME / FEMME */}

      <VideoSection
        onTouchStart={handleVideoTouchStart}
        onTouchEnd={handleVideoTouchEnd}
      >
        {activeVideo ? (
          <VideoPlayer
            ref={videoRef}
            key={activeVideo._id}
            src={getMediaUrl(activeVideo.url)}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onEnded={nextVideo}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <VideoEmpty>
            <div>
              <h2>
                {videoGenre === "femme" ? "Univers Femme" : "Univers Homme"}
              </h2>
              <p>Les vidéos de cet univers arrivent bientôt.</p>
            </div>
          </VideoEmpty>
        )}

        <VideoShade />

        <VideoTop>
          <span>NUMA — FILMS</span>

          <VideoGenderDots>
            <VideoGenderButton
              $active={videoGenre === "femme"}
              onClick={() => changeVideoGenre("femme")}
            >
              Femme
            </VideoGenderButton>

            <VideoGenderButton
              $active={videoGenre === "homme"}
              onClick={() => changeVideoGenre("homme")}
            >
              Homme
            </VideoGenderButton>
          </VideoGenderDots>
        </VideoTop>

        {activeVideo && (
          <VideoCaption>
            <span>
              {videoGenre === "femme" ? "Collection Femme" : "Collection Homme"}
            </span>
            <h2>{activeVideo.product?.title || "NUMA Collection"}</h2>
            <p>
              {activeVideo.product?.subtitle ||
                "L'élégance dans chaque détail."}
            </p>
          </VideoCaption>
        )}

        {activeVideos.length > 1 && (
          <VideoDots>
            {activeVideos.map((item, index) => (
              <VideoDot
                key={item._id || index}
                $active={index === videoIndex}
                aria-label={`Voir la vidéo ${index + 1}`}
                onClick={() => setVideoIndex(index)}
              />
            ))}
          </VideoDots>
        )}

        <VideoControls>
          <VideoButton onClick={toggleVideo} aria-label="Lecture ou pause">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </VideoButton>

          <VideoButton
            onClick={toggleMute}
            aria-label="Activer ou couper le son"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </VideoButton>
        </VideoControls>
      </VideoSection>

      {/* UNIVERS HOMME : PLEIN ÉCRAN + SCROLL HORIZONTAL */}

      <UniverseSection>
        {hommeProducts.length > 0 ? (
          <>
            <UniverseTrack
              ref={hommeTrackRef}
              onScroll={() =>
                handleUniverseScroll(hommeTrackRef, setHommeIndex)
              }
            >
              {hommeProducts.map((product, index) => (
                <UniverseSlide key={product._id}>
                  {getImg(product) ? (
                    <UniverseImage
                      src={getImg(product)}
                      alt={product.title || "Collection Homme"}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <UniverseFallback />
                  )}

                  <UniverseShade />

                  <UniverseTop>
                    <span>NUMA — UNIVERS HOMME</span>
                    <UniverseCounter>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(hommeProducts.length).padStart(2, "0")}
                    </UniverseCounter>
                  </UniverseTop>

                  <UniverseBottom>
                    <UniverseInfo>
                      <span className="eyebrow">L'UNIVERS HOMME</span>
                      <h2>Homme.</h2>
                      <p>
                        Une allure affirmée. Des pièces pensées pour ceux qui
                        avancent avec caractère.
                      </p>
                      <UniverseProductTitle>
                        {product.title}
                        {product.price ? ` — ${product.price} FCFA` : ""}
                      </UniverseProductTitle>
                    </UniverseInfo>

                    <UniverseArrow
                      to="/homme"
                      aria-label="Découvrir la collection Homme"
                    >
                      <FaArrowRight />
                    </UniverseArrow>
                  </UniverseBottom>
                </UniverseSlide>
              ))}
            </UniverseTrack>

            {hommeProducts.length > 1 && (
              <UniverseDots>
                {hommeProducts.map((product, index) => (
                  <UniverseDot
                    key={product._id}
                    $active={hommeIndex === index}
                    onClick={() => scrollUniverseTo(hommeTrackRef, index)}
                    aria-label={`Voir le produit Homme ${index + 1}`}
                  />
                ))}
              </UniverseDots>
            )}
          </>
        ) : (
          <UniverseEmpty>
            <div>
              <h2>Homme.</h2>
              <p>Notre univers Homme arrive bientôt.</p>
              <UniverseArrow to="/homme" aria-label="Découvrir Homme">
                <FaArrowRight />
              </UniverseArrow>
            </div>
          </UniverseEmpty>
        )}
      </UniverseSection>

      {/* UNIVERS FEMME : PLEIN ÉCRAN + SCROLL HORIZONTAL */}

      <UniverseSection>
        {femmeProducts.length > 0 ? (
          <>
            <UniverseTrack
              ref={femmeTrackRef}
              onScroll={() =>
                handleUniverseScroll(femmeTrackRef, setFemmeIndex)
              }
            >
              {femmeProducts.map((product, index) => (
                <UniverseSlide key={product._id}>
                  {getImg(product) ? (
                    <UniverseImage
                      src={getImg(product)}
                      alt={product.title || "Collection Femme"}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <UniverseFallback />
                  )}

                  <UniverseShade />

                  <UniverseTop>
                    <span>NUMA — UNIVERS FEMME</span>
                    <UniverseCounter>
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(femmeProducts.length).padStart(2, "0")}
                    </UniverseCounter>
                  </UniverseTop>

                  <UniverseBottom>
                    <UniverseInfo>
                      <span className="eyebrow">L'UNIVERS FEMME</span>
                      <h2>Femme.</h2>
                      <p>
                        Une élégance libre, des lignes singulières et une
                        présence qui ne passe pas inaperçue.
                      </p>
                      <UniverseProductTitle>
                        {product.title}
                        {product.price ? ` — ${product.price} FCFA` : ""}
                      </UniverseProductTitle>
                    </UniverseInfo>

                    <UniverseArrow
                      to="/femme"
                      aria-label="Découvrir la collection Femme"
                    >
                      <FaArrowRight />
                    </UniverseArrow>
                  </UniverseBottom>
                </UniverseSlide>
              ))}
            </UniverseTrack>

            {femmeProducts.length > 1 && (
              <UniverseDots>
                {femmeProducts.map((product, index) => (
                  <UniverseDot
                    key={product._id}
                    $active={femmeIndex === index}
                    onClick={() => scrollUniverseTo(femmeTrackRef, index)}
                    aria-label={`Voir le produit Femme ${index + 1}`}
                  />
                ))}
              </UniverseDots>
            )}
          </>
        ) : (
          <UniverseEmpty>
            <div>
              <h2>Femme.</h2>
              <p>Notre univers Femme arrive bientôt.</p>
              <UniverseArrow to="/femme" aria-label="Découvrir Femme">
                <FaArrowRight />
              </UniverseArrow>
            </div>
          </UniverseEmpty>
        )}
      </UniverseSection>

      {/* FOCUS */}

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
                        $left
                        onClick={previousMini}
                        aria-label="Produit précédent"
                      >
                        <FaChevronLeft />
                      </CarouselArrow>

                      <CarouselArrow
                        onClick={nextMini}
                        aria-label="Produit suivant"
                      >
                        <FaChevronRight />
                      </CarouselArrow>
                    </>
                  )}
                </MiniCarousel>

                <DotsRow>
                  {carouselProducts.map((product, index) => (
                    <Dot
                      key={product._id}
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

      {/* SÉLECTION / BEST SELLERS */}

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
                            <FaStar /> BEST SELLER
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
                        $left
                        onClick={previousBest}
                        aria-label="Produit précédent"
                      >
                        <FaChevronLeft />
                      </CarouselArrow>

                      <CarouselArrow
                        onClick={nextBest}
                        aria-label="Produit suivant"
                      >
                        <FaChevronRight />
                      </CarouselArrow>
                    </>
                  )}
                </BestCarousel>

                <DotsRow>
                  {bestSellers.map((product, index) => (
                    <Dot
                      key={product._id}
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

      {/* AVANTAGES */}

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
