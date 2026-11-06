
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

const API_URL = import.meta.env.VITE_API_URL || "";
const DURATION = 5000;

const media = (url) =>
  !url ? "" : url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;

const genreOf = (genre) => String(genre || "").trim().toLowerCase();

const isPreorder = (p) =>
  p?.precommande === true && p?.disponible === false;

const isBestSeller = (p) => genreOf(p?.badge) === "new";

const getVideoProductId = (video) => {
  const id = video?.produitId;
  return typeof id === "object" && id !== null
    ? String(id._id || id.id || "")
    : String(id || "");
};

const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const zoom = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.07); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37,211,102,.35); }
  70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
`;

/* =====================================================
   GLOBAL
===================================================== */

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  color: ${({ $dark }) => ($dark ? "#f8f6ef" : "#20251f")};
  background: ${({ $dark }) =>
    $dark ? "#101510" : "#f8f6f0"};
`;

const Section = styled.section`
  padding: 100px 0;

  @media(max-width:768px) {
    padding: 65px 0;
  }
`;

const SectionHeader = styled.div`
  max-width: 850px;
  margin: 0 auto 45px;
  padding: 0 20px;
  text-align: center;

  .eyebrow {
    color: #b18b55;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(32px, 5vw, 55px);
    font-weight: 400;
    letter-spacing: -1.5px;
    margin: 0 0 17px;
  }

  p {
    max-width: 650px;
    margin: auto;
    font-size: 14px;
    line-height: 1.9;
    opacity: .65;
  }
`;

const Container = styled.div`
  width: min(1200px, 92%);
  margin: auto;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 9px;
  margin-top: 24px;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "30px" : "7px")};
  height: 7px;
  border: 0;
  border-radius: 20px;
  background: ${({ $active }) =>
    $active ? "#b18b55" : "rgba(177,139,85,.3)"};
  cursor: pointer;
  transition: .3s;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? "left: 25px" : "right: 25px")};
  transform: translateY(-50%);
  z-index: 5;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.55);
  background: rgba(0,0,0,.3);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 28px;
  cursor: pointer;
  transition: .3s;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
  }

  @media(max-width:600px) {
    width: 38px;
    height: 38px;
    font-size: 22px;
    ${({ $left }) => ($left ? "left: 12px" : "right: 12px")};
  }
`;

const EmptyState = styled.div`
  padding: 90px 20px;
  text-align: center;
  opacity: .6;
`;

/* =====================================================
   HERO
===================================================== */

const Hero = styled.section`
  position: relative;
  height: 100svh;
  min-height: 580px;
  background: #101510;
  overflow: hidden;
`;

const HeroSlide = styled.div`
  position: absolute;
  inset: -1%;
  background-image: ${({ $image }) => `url("${$image}")`};
  background-size: cover;
  background-position: center;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 1.2s;
  animation: ${zoom} 9s ease-in-out infinite alternate;
`;

const HeroShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,.05),
    transparent 45%,
    rgba(0,0,0,.5)
  );
`;

const HeroBottom = styled.div`
  position: absolute;
  bottom: 35px;
  left: 5%;
  right: 5%;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  @media(max-width:600px) {
    left: 18px;
    right: 18px;
    bottom: 22px;
  }
`;

const HeroLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  background: rgba(15,25,19,.55);
  border: 1px solid rgba(255,255,255,.55);
  backdrop-filter: blur(12px);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: .3s;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
  }

  @media(max-width:600px) {
    padding: 12px;
    font-size: 9px;
  }
`;

/* =====================================================
   VIDEO
===================================================== */

const VideoSection = styled.section`
  width: 100%;
`;

const VideoFrame = styled.div`
  position: relative;
  height: min(800px, 75vh);
  min-height: 430px;
  background: #080b09;
  overflow: hidden;

  @media(max-width:600px) {
    height: 65vh;
  }
`;

const VideoPlayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoControls = styled.div`
  position: absolute;
  left: 25px;
  right: 25px;
  bottom: 25px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
`;

const VideoGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const VideoButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,.4);
  border-radius: 50%;
  background: rgba(0,0,0,.4);
  color: white;
  cursor: pointer;
  transition: .3s;

  &:hover {
    background: #b18b55;
  }
`;

const VideoCaption = styled.div`
  padding: 28px 6%;
  background: ${({ $dark }) => $dark ? "#19231c" : "#eeeae0"};
`;

const VideoCaptionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;

  .eyebrow {
    color: #b18b55;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3px;
  }

  h2 {
    font-family: Georgia, serif;
    font-size: 35px;
    font-weight: 400;
    margin: 8px 0;
  }

  p {
    opacity: .65;
    font-size: 13px;
  }
`;

const GenreButtons = styled.div`
  display: flex;
  gap: 22px;
`;

const GenreButton = styled.button`
  background: none;
  border: none;
  color: ${({ $active }) => $active ? "#b18b55" : "inherit"};
  opacity: ${({ $active }) => $active ? 1 : .55};
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
`;

const VideoDots = styled(Dots)`
  margin-top: 22px;
`;

const VideoDot = styled(Dot)`
  height: 6px;
`;

/* =====================================================
   UNIVERS HOMME / FEMME
===================================================== */

const UniverseSection = styled.section`
  width: 100%;
`;

const UniverseImageLink = styled(Link)`
  position: relative;
  display: block;
  height: 100svh;
  min-height: 580px;
  overflow: hidden;
  background: #101510;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 1s;
  }

  &:hover img {
    transform: scale(1.035);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg,rgba(0,0,0,.6),transparent 50%);
    pointer-events: none;
  }
`;

const UniverseNumber = styled.span`
  position: absolute;
  z-index: 2;
  top: 25px;
  left: 25px;
  color: white;
  font-size: 11px;
  letter-spacing: 3px;
  padding: 12px 16px;
  background: rgba(0,0,0,.3);
  backdrop-filter: blur(10px);
`;

const UniverseCaption = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 55px;
  left: 6%;
  right: 6%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  color: white;

  .eyebrow {
    color: #d6b77e;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 4px;
  }

  h3 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(40px,7vw,75px);
    margin: 12px 0;
  }

  p {
    font-size: 14px;
    opacity: .8;
  }

  @media(max-width:600px) {
    bottom: 30px;
    left: 22px;
    right: 22px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const UniverseCTA = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 22px;
  border: 1px solid rgba(255,255,255,.7);
  color: white;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: .3s;

  &:hover {
    background: #b18b55;
    border-color: #b18b55;
  }
`;

const UniverseNav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(177,139,85,.2);
`;

const UniverseNavLink = styled(Link)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 38px;
  background: ${({ $dark }) => $dark ? "#19231c" : "#eeeae0"};
  color: inherit;
  text-decoration: none;
  transition: .3s;

  &:hover {
    background: ${({ $dark }) => $dark ? "#26372b" : "#e4dac8"};
  }

  span {
    color: #b18b55;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  h3 {
    font-family: Georgia, serif;
    font-size: 34px;
    font-weight: 400;
    margin: 10px 0 0;
  }

  @media(max-width:600px) {
    padding: 22px 15px;
    h3 { font-size: 25px; }
  }
`;

/* =====================================================
   FOCUS CAROUSEL
   Les Best Sellers sont exclus de cette sélection.
===================================================== */

const FocusSection = styled.div`
  width: min(1240px, 92%);
  margin: auto;
`;

const FocusCarousel = styled.div`
  position: relative;
  height: 680px;
  overflow: hidden;
  background: #111;

  @media(max-width:700px) {
    height: 560px;
  }
`;

const FocusSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => $active ? 1 : 0};
  pointer-events: ${({ $active }) => $active ? "auto" : "none"};
  transition: opacity .8s;
`;

const FocusImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FocusOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 55px;
  color: white;
  background: linear-gradient(0deg,rgba(0,0,0,.8),transparent 65%);

  @media(max-width:600px) {
    padding: 25px;
  }
`;

const FocusInfo = styled.div`
  h3 {
    font-family: Georgia, serif;
    font-size: clamp(30px,5vw,55px);
    font-weight: 400;
    margin: 0 0 12px;
  }

  p {
    opacity: .8;
    max-width: 500px;
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 25px;
  }
`;

const LightButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 22px;
  background: #b18b55;
  color: white;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: .3s;

  &:hover {
    background: #173d32;
  }
`;

/* =====================================================
   BEST SELLERS — FULL SCREEN EDITORIAL
===================================================== */

const BestSection = styled.section`
  width: 100%;
  padding: 95px 0 0;
`;

const BestHeader = styled.div`
  text-align: center;
  padding: 0 20px;
  margin: 0 auto 45px;

  .eyebrow {
    color: #b18b55;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 5px;
    margin-bottom: 17px;
  }

  h2 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(35px,5vw,62px);
    margin: 0 0 16px;
  }

  p {
    font-size: 13px;
    line-height: 1.8;
    opacity: .65;
  }
`;

/* Pleine largeur : aucun padding, aucune marge latérale */

const BestCarousel = styled.div`
  position: relative;
  width: 100%;
  height: 850px;
  overflow: hidden;
  background: #101510;

  @media(max-width:900px) {
    height: 750px;
  }

  @media(max-width:600px) {
    height: 690px;
  }
`;

const BestSlide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => $active ? 1 : 0};
  pointer-events: ${({ $active }) => $active ? "auto" : "none"};
  transition: opacity 1s ease;
`;

const BestImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  animation: ${zoom} 12s ease-in-out infinite alternate;
`;

const BestShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(8,13,10,.88) 0%,
    rgba(8,13,10,.55) 42%,
    rgba(8,13,10,.05) 100%
  );

  @media(max-width:650px) {
    background: linear-gradient(
      0deg,
      rgba(8,13,10,.92) 0%,
      rgba(8,13,10,.48) 58%,
      rgba(8,13,10,.08) 100%
    );
  }
`;

const BestContent = styled.div`
  position: absolute;
  top: 50%;
  left: 9%;
  transform: translateY(-50%);
  z-index: 2;
  width: min(480px, 80%);
  color: white;
  animation: ${fade} .8s ease;

  @media(max-width:650px) {
    top: auto;
    bottom: 65px;
    left: 25px;
    right: 25px;
    width: auto;
    transform: none;
  }
`;

const BestLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 23px;
  color: #d6b77e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 4px;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 32px;
    height: 1px;
    background: #d6b77e;
  }
`;

const BestStars = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 23px;
  color: #e3bd76;

  svg {
    width: 17px;
    height: 17px;
    filter: drop-shadow(0 2px 5px rgba(0,0,0,.3));
  }
`;

const BestTitle = styled.h3`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(38px,5.5vw,72px);
  line-height: 1.04;
  margin: 0 0 20px;
  letter-spacing: -1px;
`;

const BestDescription = styled.p`
  max-width: 420px;
  font-size: 14px;
  line-height: 1.9;
  color: rgba(255,255,255,.78);
  margin: 0 0 24px;
`;

const BestPrice = styled.div`
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 30px;
`;

const BestCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  padding: 17px 25px;
  background: #d6b77e;
  color: #142018;
  text-decoration: none;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: .3s;

  &:hover {
    background: white;
    transform: translateY(-3px);
  }
`;

const BestCounter = styled.div`
  position: absolute;
  right: 7%;
  bottom: 42px;
  z-index: 4;
  color: white;
  font-family: Georgia, serif;
  font-size: 14px;
  letter-spacing: 3px;

  span {
    color: #d6b77e;
    font-size: 25px;
  }

  @media(max-width:650px) {
    right: 20px;
    bottom: 20px;
    font-size: 11px;
  }
`;

const BestProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,.2);
  z-index: 4;

  span {
    display: block;
    width: ${({ $progress }) => $progress}%;
    height: 100%;
    background: #d6b77e;
    transition: width .5s;
  }
`;

/* =====================================================
   BENEFITS
===================================================== */

const Benefits = styled.div`
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;

  @media(max-width:800px) {
    grid-template-columns: 1fr;
  }
`;

const Benefit = styled.div`
  padding: 35px;
  min-height: 215px;
  border: 1px solid ${({ $dark }) =>
    $dark ? "rgba(255,255,255,.1)" : "rgba(23,61,50,.1)"};
  background: ${({ $dark }) =>
    $dark ? "#18221b" : "#fff"};
  transition: .35s;

  &:hover {
    transform: translateY(-7px);
  }

  .icon {
    color: #b18b55;
    font-size: 25px;
    margin-bottom: 25px;
  }

  h3 {
    font-size: 16px;
    margin: 0 0 12px;
  }

  p {
    font-size: 13px;
    line-height: 1.8;
    opacity: .65;
    margin: 0;
  }
`;

const WhatsAppButton = styled.a`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #25d366;
  color: white;
  font-size: 27px;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(0,0,0,.2);
  animation: ${pulse} 2.5s infinite;

  &:hover {
    transform: scale(1.1);
  }
`;

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);

  const [slide, setSlide] = useState(0);
  const [focusSlide, setFocusSlide] = useState(0);
  const [bestSlide, setBestSlide] = useState(0);

  const [videoGenre, setVideoGenre] = useState("homme");
  const [videoIndex, setVideoIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [precommandeDisponible, setPrecommandeDisponible] = useState(false);

  const { theme } = useContext(ThemeContext);
  const dark = theme === "light";

  const videoRef = useRef(null);
  const touchStart = useRef(null);

  /* FETCH */

  useEffect(() => {
    const load = async () => {
      try {
        const [productResponse, videoResponse, preorderResponse] =
          await Promise.allSettled([
            fetch(`${API_URL}/api/produits`),
            fetch(`${API_URL}/api/videos/produits`),
            fetch(`${API_URL}/api/precommandes/modeles`),
          ]);

        if (productResponse.status === "fulfilled" &&
            productResponse.value.ok) {
          const data = await productResponse.value.json();
          setProducts(Array.isArray(data) ? data : []);
        }

        if (videoResponse.status === "fulfilled" &&
            videoResponse.value.ok) {
          const data = await videoResponse.value.json();
          setVideos(
            Array.isArray(data?.videos)
              ? data.videos.filter(v => v?.url && v?.produitId)
              : []
          );
        }

        if (preorderResponse.status === "fulfilled" &&
            preorderResponse.value.ok) {
          const data = await preorderResponse.value.json();
          const models = Array.isArray(data)
            ? data
            : data.modeles || data.data || [];
          setPrecommandeDisponible(models.length > 0);
        }
      } catch (error) {
        console.error("Erreur chargement NUMA :", error);
      }
    };

    load();
  }, []);

  /* PRODUITS */

  const heroProducts = useMemo(
    () => products.filter(p => p.hero && p.images?.[0]?.url),
    [products]
  );

  const hommeProducts = useMemo(
    () => products.filter(p =>
      genreOf(p.genre) === "homme" &&
      !isPreorder(p) &&
      p.images?.[0]?.url
    ),
    [products]
  );

  const femmeProducts = useMemo(
    () => products.filter(p =>
      genreOf(p.genre) === "femme" &&
      !isPreorder(p) &&
      p.images?.[0]?.url
    ),
    [products]
  );

  /*
    IMPORTANT :
    Les Best Sellers sont exclus de la sélection Focus.
    Un produit ne peut donc pas apparaître dans les deux sections.
  */

  const bestSellers = useMemo(
    () => products.filter(p =>
      isBestSeller(p) &&
      !isPreorder(p) &&
      p.images?.[0]?.url
    ).slice(0, 5),
    [products]
  );

  const bestSellerIds = useMemo(
    () => new Set(bestSellers.map(p => String(p._id))),
    [bestSellers]
  );

  const focusProducts = useMemo(
    () => products.filter(p =>
      !isPreorder(p) &&
      !bestSellerIds.has(String(p._id)) &&
      p.images?.[0]?.url
    ).slice(0, 5),
    [products, bestSellerIds]
  );

  /* VIDEOS */

  const videosByGenre = useMemo(() => {
    const result = { homme: [], femme: [] };

    videos.forEach(video => {
      const id = getVideoProductId(video);
      const product = products.find(p => String(p._id) === id);

      if (!product) return;

      const genre = genreOf(product.genre);

      if (genre === "homme" || genre === "femme") {
        result[genre].push({
          ...video,
          produit: product,
          videoUrl: media(video.url),
        });
      }
    });

    return result;
  }, [videos, products]);

  const activeVideos = videosByGenre[videoGenre] || [];
  const activeVideo = activeVideos[videoIndex] || null;

  /* HERO AUTOPLAY */

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const timer = setInterval(() => {
      setSlide(current => (current + 1) % heroProducts.length);
    }, DURATION);

    return () => clearInterval(timer);
  }, [heroProducts.length]);

  useEffect(() => {
    setSlide(current =>
      heroProducts.length ? current % heroProducts.length : 0
    );
  }, [heroProducts.length]);

  /* FOCUS AUTOPLAY */

  useEffect(() => {
    if (focusProducts.length <= 1) return;

    const timer = setInterval(() => {
      setFocusSlide(current => (current + 1) % focusProducts.length);
    }, DURATION);

    return () => clearInterval(timer);
  }, [focusProducts.length]);

  /* BEST SELLERS AUTOPLAY */

  useEffect(() => {
    if (bestSellers.length <= 1) return;

    const timer = setInterval(() => {
      setBestSlide(current => (current + 1) % bestSellers.length);
    }, DURATION);

    return () => clearInterval(timer);
  }, [bestSellers.length]);

  useEffect(() => {
    setBestSlide(current =>
      bestSellers.length ? current % bestSellers.length : 0
    );
  }, [bestSellers.length]);

  /* VIDEO */

  useEffect(() => {
    setVideoIndex(0);
    setIsPlaying(true);
    setIsMuted(true);
    videoRef.current?.pause();
  }, [videoGenre]);

  useEffect(() => {
    if (!videoRef.current || !activeVideo) return;

    videoRef.current.load();

    videoRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [activeVideo?._id, activeVideo?.url]);

  const changeVideoGenre = (genre) => {
    setVideoGenre(genre);
    setVideoIndex(0);
    setIsPlaying(true);
    setIsMuted(true);
  };

  const nextVideo = () => {
    if (activeVideos.length > 1) {
      setVideoIndex(current => (current + 1) % activeVideos.length);
    }
  };

  const previousVideo = () => {
    if (activeVideos.length > 1) {
      setVideoIndex(current =>
        current === 0 ? activeVideos.length - 1 : current - 1
      );
    }
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVideoTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleVideoTouchEnd = (e) => {
    if (touchStart.current === null) return;

    const diff = touchStart.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 55) {
      diff > 0 ? nextVideo() : previousVideo();
    }

    touchStart.current = null;
  };

  /* NAVIGATION */

  const previousFocus = () => {
    setFocusSlide(current =>
      current === 0 ? focusProducts.length - 1 : current - 1
    );
  };

  const nextFocus = () => {
    setFocusSlide(current => (current + 1) % focusProducts.length);
  };

  const previousBest = () => {
    setBestSlide(current =>
      current === 0 ? bestSellers.length - 1 : current - 1
    );
  };

  const nextBest = () => {
    setBestSlide(current => (current + 1) % bestSellers.length);
  };

  /* RENDER */

  return (
    <Wrapper $dark={dark}>

      {/* HERO */}

      <Hero>
        {heroProducts.map((product, index) => (
          <HeroSlide
            key={product._id}
            $active={index === slide}
            $image={media(product.images?.[0]?.url)}
          />
        ))}

        <HeroShade />

        <HeroBottom>
          <HeroLink to="/collections">
            Explorer la collection <FaArrowRight />
          </HeroLink>

          {precommandeDisponible && (
            <HeroLink to="/precommande">
              Précommandes ouvertes <FaArrowRight />
            </HeroLink>
          )}
        </HeroBottom>
      </Hero>

      {/* VIDEO */}

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
              onEnded={nextVideo}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <VideoControls>
              <VideoGroup>
                <VideoButton onClick={toggleVideo} aria-label="Lecture ou pause">
                  {isPlaying ? <Pause size={19} /> : <Play size={19} />}
                </VideoButton>

                <VideoButton onClick={toggleSound} aria-label="Activer ou couper le son">
                  {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
                </VideoButton>
              </VideoGroup>

              {activeVideos.length > 1 && (
                <VideoGroup>
                  <VideoButton onClick={previousVideo}>‹</VideoButton>
                  <VideoButton onClick={nextVideo}>›</VideoButton>
                </VideoGroup>
              )}
            </VideoControls>
          </VideoFrame>
        ) : (
          <EmptyState>
            Les vidéos de cet univers arrivent bientôt.
          </EmptyState>
        )}

        <VideoCaption $dark={dark}>
          <VideoCaptionTop>
            <div>
              <div className="eyebrow">L'UNIVERS NUMA</div>
              <h2>{videoGenre === "femme" ? "Femme" : "Homme"}</h2>
              <p>
                {activeVideo?.produit?.title ||
                  "Découvrez nos créations en mouvement."}
              </p>
            </div>

            <GenreButtons>
              <GenreButton
                $active={videoGenre === "homme"}
                onClick={() => changeVideoGenre("homme")}
              >
                Homme
              </GenreButton>

              <GenreButton
                $active={videoGenre === "femme"}
                onClick={() => changeVideoGenre("femme")}
              >
                Femme
              </GenreButton>
            </GenreButtons>
          </VideoCaptionTop>

          {activeVideos.length > 1 && (
            <VideoDots>
              {activeVideos.map((v, i) => (
                <VideoDot
                  key={v._id}
                  $active={i === videoIndex}
                  onClick={() => setVideoIndex(i)}
                />
              ))}
            </VideoDots>
          )}
        </VideoCaption>
      </VideoSection>

      {/* NAVIGATION DES UNIVERS */}

      <UniverseNav>
        <UniverseNavLink to="/homme" $dark={dark}>
          <div>
            <span>Découvrir la collection</span>
            <h3>Homme</h3>
          </div>
          <FaArrowRight />
        </UniverseNavLink>

        <UniverseNavLink to="/femme" $dark={dark}>
          <div>
            <span>Découvrir la collection</span>
            <h3>Femme</h3>
          </div>
          <FaArrowRight />
        </UniverseNavLink>
      </UniverseNav>

      {/* GALERIE HOMME */}

      <UniverseSection>
        {hommeProducts.length > 0 ? (
          hommeProducts.map((product, index) => (
            <UniverseImageLink
              key={product._id}
              to={`/produit/${product._id}`}
            >
              <img
                src={media(product.images?.[0]?.url)}
                alt={product.title || "Collection Homme NUMA"}
                loading="lazy"
              />
              <UniverseNumber>
                {String(index + 1).padStart(2, "0")} / {String(hommeProducts.length).padStart(2, "0")}
              </UniverseNumber>
              <UniverseCaption>
                <div>
                  <div className="eyebrow">UNIVERS HOMME — NUMA</div>
                  <h3>{product.title || "Homme"}</h3>
                  <p>{product.subtitle || "Élégance et caractère."}</p>
                </div>
                <UniverseCTA>
                  Découvrir <FaArrowRight />
                </UniverseCTA>
              </UniverseCaption>
            </UniverseImageLink>
          ))
        ) : (
          <EmptyState>Aucune pièce Homme disponible.</EmptyState>
        )}
      </UniverseSection>

      {/* GALERIE FEMME */}

      <UniverseSection>
        {femmeProducts.length > 0 ? (
          femmeProducts.map((product, index) => (
            <UniverseImageLink
              key={product._id}
              to={`/produit/${product._id}`}
            >
              <img
                src={media(product.images?.[0]?.url)}
                alt={product.title || "Collection Femme NUMA"}
                loading="lazy"
              />
              <UniverseNumber>
                {String(index + 1).padStart(2, "0")} / {String(femmeProducts.length).padStart(2, "0")}
              </UniverseNumber>
              <UniverseCaption>
                <div>
                  <div className="eyebrow">UNIVERS FEMME — NUMA</div>
                  <h3>{product.title || "Femme"}</h3>
                  <p>{product.subtitle || "Grâce et distinction."}</p>
                </div>
                <UniverseCTA>
                  Découvrir <FaArrowRight />
                </UniverseCTA>
              </UniverseCaption>
            </UniverseImageLink>
          ))
        ) : (
          <EmptyState>Aucune pièce Femme disponible.</EmptyState>
        )}
      </UniverseSection>

      {/* FOCUS — SANS BEST SELLERS */}

      <Section>
        <FocusSection>
          <SectionHeader>
            <div className="eyebrow">L'ÉDITORIAL NUMA</div>
            <h2>Des pièces qui attirent le regard.</h2>
            <p>
              Des créations singulières, sélectionnées pour leur style,
              leur caractère et leur personnalité.
            </p>
          </SectionHeader>

          {focusProducts.length > 0 ? (
            <>
              <FocusCarousel>
                {focusProducts.map((product, index) => (
                  <FocusSlide
                    key={product._id}
                    $active={index === focusSlide}
                  >
                    <FocusImage
                      src={media(product.images?.[0]?.url)}
                      alt={product.title}
                    />

                    <FocusOverlay>
                      <FocusInfo>
                        <h3>{product.title}</h3>
                        <p>
                          {product.subtitle ||
                            "Une pièce signature à forte présence."}
                        </p>
                        <LightButton to={`/produit/${product._id}`}>
                          Découvrir la pièce <FaArrowRight />
                        </LightButton>
                      </FocusInfo>
                    </FocusOverlay>
                  </FocusSlide>
                ))}

                {focusProducts.length > 1 && (
                  <>
                    <Arrow $left onClick={previousFocus}>‹</Arrow>
                    <Arrow onClick={nextFocus}>›</Arrow>
                  </>
                )}
              </FocusCarousel>

              <Dots>
                {focusProducts.map((p, i) => (
                  <Dot
                    key={p._id}
                    $active={i === focusSlide}
                    onClick={() => setFocusSlide(i)}
                    aria-label={`Voir ${p.title}`}
                  />
                ))}
              </Dots>
            </>
          ) : (
            <EmptyState>
              Aucune pièce disponible pour le moment.
            </EmptyState>
          )}
        </FocusSection>
      </Section>

      {/* BEST SELLERS — NOUVEAU DESIGN IMMERSIF */}

      <BestSection>
        <BestHeader>
          <div className="eyebrow">NUMA — SÉLECTION EXCLUSIVE</div>
          <h2>Les pièces les plus convoitées.</h2>
          <p>
            Cinq étoiles, cinq pièces remarquables.
            Découvrez les créations qui incarnent l'esprit NUMA.
          </p>
        </BestHeader>

        {bestSellers.length > 0 ? (
          <>
            <BestCarousel>
              {bestSellers.map((product, index) => (
                <BestSlide
                  key={product._id}
                  $active={index === bestSlide}
                >
                  <BestImage
                    src={media(product.images?.[0]?.url)}
                    alt={product.title}
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  <BestShade />

                  <BestContent key={product._id}>
                    <BestLabel>NUMA BEST SELLER</BestLabel>

                    <BestStars aria-label="5 étoiles sur 5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar key={star} />
                      ))}
                    </BestStars>

                    <BestTitle>{product.title}</BestTitle>

                    <BestDescription>
                      {product.subtitle ||
                        "Une création d'exception, pensée pour révéler votre élégance, votre style et votre caractère."}
                    </BestDescription>

                    <BestPrice>
                      {Number(product.price || 0).toLocaleString("fr-FR")} FCFA
                    </BestPrice>

                    <BestCTA to={`/produit/${product._id}`}>
                      Découvrir cette pièce <FaArrowRight />
                    </BestCTA>
                  </BestContent>
                </BestSlide>
              ))}

              {bestSellers.length > 1 && (
                <>
                  <Arrow $left onClick={previousBest} aria-label="Best Seller précédent">
                    ‹
                  </Arrow>
                  <Arrow onClick={nextBest} aria-label="Best Seller suivant">
                    ›
                  </Arrow>
                </>
              )}

              <BestCounter>
                <span>{String(bestSlide + 1).padStart(2, "0")}</span>
                {" / "}
                {String(bestSellers.length).padStart(2, "0")}
              </BestCounter>

              <BestProgress
                $progress={((bestSlide + 1) / bestSellers.length) * 100}
              >
                <span />
              </BestProgress>
            </BestCarousel>

            <Dots>
              {bestSellers.map((product, index) => (
                <Dot
                  key={product._id}
                  $active={index === bestSlide}
                  onClick={() => setBestSlide(index)}
                  aria-label={`Voir ${product.title}`}
                />
              ))}
            </Dots>
          </>
        ) : (
          <EmptyState>
            <h3>Notre sélection arrive bientôt.</h3>
            <p>De nouvelles pièces seront bientôt disponibles.</p>
          </EmptyState>
        )}
      </BestSection>

      {/* AVANTAGES NUMA */}

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

          <Benefits>
            <Benefit $dark={dark}>
              <div className="icon"><FaTruck /></div>
              <h3>Livraison rapide</h3>
              <p>
                Recevez vos articles rapidement, soigneusement emballés et
                prêts à être portés.
              </p>
            </Benefit>

            <Benefit $dark={dark}>
              <div className="icon"><FaShieldAlt /></div>
              <h3>Paiement sécurisé</h3>
              <p>
                Vos transactions sont protégées pour vous offrir une
                expérience d'achat sereine.
              </p>
            </Benefit>

            <Benefit $dark={dark}>
              <div className="icon"><FaUndo /></div>
              <h3>Retour facile</h3>
              <p>
                Une pièce ne vous convient pas ? Notre processus de retour
                est simple et rapide.
              </p>
            </Benefit>
          </Benefits>
        </Container>
      </Section>

      {/* WHATSAPP */}

      <WhatsAppButton
        href="https://wa.me/2250700247693"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter NUMA sur WhatsApp"
      >
        <FaWhatsapp />
      </WhatsAppButton>

    </Wrapper>
  );
}
