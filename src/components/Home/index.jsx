import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoveRight,
} from "lucide-react";
import { FaWhatsapp, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

/* =====================================================
   CONFIGURATION
===================================================== */

const API_URL = import.meta.env.VITE_API_URL || "";

const media = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const isPreorder = (p) => p?.precommande === true && p?.disponible === false;

const genreOf = (g) =>
  String(g || "")
    .trim()
    .toLowerCase();

const reveal = keyframes`
  from { opacity: 0; transform: translateY(35px); }
  to { opacity: 1; transform: translateY(0); }
`;

const imageZoom = keyframes`
  from { transform: scale(1.02); }
  to { transform: scale(1.09); }
`;

/* =====================================================
   DESIGN SYSTEM
===================================================== */

const Page = styled.main`
  --paper: ${({ $dark }) => ($dark ? "#191919" : "#F3F0E9")};
  --surface: ${({ $dark }) => ($dark ? "#222220" : "#FFFFFF")};
  --ink: ${({ $dark }) => ($dark ? "#F4F0E9" : "#201F1C")};
  --muted: ${({ $dark }) => ($dark ? "#A8A39A" : "#77736B")};
  --line: ${({ $dark }) => ($dark ? "#393834" : "#DEDAD1")};
  --accent: #927657;

  background: var(--paper);
  color: var(--ink);
  width: 100%;
  overflow: hidden;
  transition:
    background 0.35s,
    color 0.35s;

  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  width: min(1440px, 91%);
  margin: auto;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

// Nouveau conteneur pour les médias pleine largeur
const FullWidthMedia = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  img,
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 24px;
    height: 1px;
    background: currentColor;
  }
`;

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 25px;
  margin-bottom: 42px;

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(34px, 5vw, 66px);
    font-weight: 400;
    letter-spacing: -2.5px;
    line-height: 1;
    margin: 16px 0 0;
    max-width: 700px;
  }

  p {
    max-width: 330px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
    margin: 0;
  }

  @media (max-width: 700px) {
    display: block;
    margin-bottom: 28px;

    p {
      margin-top: 15px;
    }
  }
`;

const Section = styled.section`
  padding: 115px 0;

  @media (max-width: 700px) {
    padding: 75px 0;
  }
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  color: var(--ink);
  text-decoration: none;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.6px;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 9px;
  transition: gap 0.3s;

  &:hover {
    gap: 23px;
  }
`;

/* =====================================================
   HERO EDITORIAL
===================================================== */

const Hero = styled.section`
  min-height: 760px;
  height: min(900px, 92svh);
  position: relative;
  overflow: hidden;
  background: #25231f;

  @media (max-width: 700px) {
    height: 78svh;
    min-height: 580px;
  }
`;

const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: ${({ $src }) =>
    $src ? `url("${$src}")` : "linear-gradient(120deg,#50483e,#171715)"};
  background-size: cover;
  background-position: center;
  animation: ${imageZoom} 12s ease-in-out infinite alternate;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.63), rgba(0, 0, 0, 0.12) 75%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.4), transparent 40%);
`;

const HeroCounter = styled.div`
  position: absolute;
  right: 4.5%;
  bottom: 45px;
  z-index: 3;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  letter-spacing: 2px;

  span {
    display: block;
    width: 70px;
    height: 1px;
    background: rgba(255, 255, 255, 0.6);
  }
`;

/* =====================================================
   INTRODUCTION
===================================================== */

const Intro = styled.section`
  padding: 105px 0 115px;
  text-align: center;

  .number {
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--accent);
  }

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(38px, 6vw, 78px);
    line-height: 1.12;
    font-weight: 400;
    letter-spacing: -3px;
    max-width: 970px;
    margin: 30px auto;
  }

  h2 em {
    color: var(--accent);
  }

  p {
    max-width: 510px;
    margin: auto;
    color: var(--muted);
    line-height: 2;
    font-size: 13px;
  }

  @media (max-width: 600px) {
    padding: 75px 0;
    h2 {
      letter-spacing: -1.5px;
    }
  }
`;

/* =====================================================
   COLLECTION HOMME / FEMME
===================================================== */

const UniverseGrid = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const UniverseCard = styled(Link)`
  display: block;
  position: relative;
  width: 100%;
  height: 680px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #292723;
  color: white;
  text-decoration: none;

  img {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 1s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.055);
  }

  .shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.62), transparent 65%);
  }

  .top {
    position: absolute;
    top: 24px;
    left: 25px;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .bottom {
    position: absolute;
    bottom: 35px;
    left: 35px;
    right: 35px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  h3 {
    font-family: Georgia, serif;
    font-size: clamp(55px, 7vw, 95px);
    font-weight: 400;
    letter-spacing: -4px;
    margin: 0;
    line-height: 1;
  }

  .arrow {
    width: 50px;
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    display: grid;
    place-items: center;
    transition: 0.3s;
  }

  &:hover .arrow {
    background: white;
    color: #191919;
    transform: rotate(45deg);
  }

  @media (max-width: 700px) {
    height: 540px;
    .bottom {
      left: 22px;
      right: 22px;
      bottom: 25px;
    }
    h3 {
      font-size: 65px;
    }
  }
`;

/* =====================================================
   PRODUITS — GRILLE ÉDITORIALE
===================================================== */

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 17px;

  @media (max-width: 950px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px 13px;
  }
`;

const ProductCard = styled.article`
  min-width: 0;

  .photo {
    display: block;
    position: relative;
    width: 100%;
    height: 390px;
    overflow: hidden;
    padding: 0;
    margin: 0;
    background: #e6e1d8;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: cover;
    object-position: center;
    transition: transform 0.8s ease;
  }

  &:hover img {
    transform: scale(1.06);
  }

  .tag {
    position: absolute;
    top: 13px;
    left: 13px;
    background: var(--paper);
    color: var(--ink);
    padding: 8px 10px;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .details {
    padding-top: 16px;
  }

  .category {
    color: var(--accent);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  h3 {
    margin: 9px 0;
    font-family: Georgia, serif;
    font-size: 18px;
    font-weight: 400;
  }

  .price {
    color: var(--muted);
    font-size: 12px;
  }

  @media (max-width: 700px) {
    .photo {
      height: 260px;
    }
    h3 {
      font-size: 16px;
    }
  }

  @media (max-width: 390px) {
    .photo {
      height: 215px;
    }
  }
`;

const ProductPhotoLink = styled(Link)`
  position: absolute;
  inset: 0;
`;

const ProductArrow = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 37px;
  height: 37px;
  border-radius: 50%;
  border: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    background: var(--ink);
    color: var(--paper);
  }
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

/* =====================================================
   EDITORIAL CAMPAIGN
===================================================== */

const Campaign = styled.section`
  min-height: 650px;
  position: relative;
  background: #24221f;
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;

  .visual {
    width: 100%;
    height: 100%;
    min-height: 650px;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }

  .visual img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 650px;
    object-fit: cover;
    object-position: center;
  }

  &:hover .visual img {
    transform: scale(1.035);
  }

  .copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 12%;
  }

  .copy small {
    color: #c5a984;
    letter-spacing: 3px;
    font-size: 10px;
    text-transform: uppercase;
  }

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(45px, 6vw, 85px);
    line-height: 0.99;
    letter-spacing: -3px;
    font-weight: 400;
    margin: 30px 0;
  }

  p {
    color: rgba(255, 255, 255, 0.65);
    line-height: 2;
    font-size: 13px;
    max-width: 400px;
  }

  a {
    margin-top: 30px;
    display: inline-flex;
    align-items: center;
    gap: 20px;
    width: fit-content;
    padding-bottom: 12px;
    border-bottom: 1px solid #c5a984;
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 10px;
    font-weight: 800;
  }

  @media (max-width: 750px) {
    grid-template-columns: 1fr;

    .visual {
      min-height: 430px;
    }
    .copy {
      padding: 60px 8%;
    }
  }
`;

/* =====================================================
   VIDEO EDITORIAL
===================================================== */

const VideoSection = styled.section`
  padding: 110px 0;

  .video-shell {
    position: relative;
    width: 100%;
    height: min(780px, 75vw);
    min-height: 400px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #171715;
  }

  video {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: cover;
    object-position: center;
  }

  .controls {
    position: absolute;
    left: 25px;
    right: 25px;
    bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(12px);
    color: white;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: 0.3s;
  }

  button:hover {
    background: #927657;
  }

  .video-title {
    color: var(--ink);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: 25px;
  }

  h3 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(27px, 4vw, 45px);
    margin: 0;
  }

  .genres {
    display: flex;
    gap: 18px;
  }

  .genres button {
    width: auto;
    height: auto;
    border: none;
    border-radius: 0;
    color: var(--muted);
    background: none;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .genres button.active {
    color: var(--accent);
    border-bottom: 1px solid var(--accent);
  }

  @media (max-width: 650px) {
    padding: 75px 0;
    .video-shell {
      height: 65svh;
      min-height: 380px;
    }
    .video-title {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

/* =====================================================
   BEST SELLERS
===================================================== */

const BestsellerSection = styled.section`
  padding: 100px 0;
  background: ${({ $dark }) => ($dark ? "#222220" : "#E8E3D9")};

  .best-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 45px;
    align-items: center;
  }

  .best-main {
  position: relative;
  display: block;
  width: 100%;
  height: 680px;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.best-main img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform .8s;
}

  .best-main:hover img {
    transform: scale(1.045);
  }

  .best-copy {
    padding: 35px 0;
  }

  .best-copy h2 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(43px, 5vw, 75px);
    line-height: 1;
    letter-spacing: -3px;
  }

  .best-copy p {
    color: var(--muted);
    line-height: 2;
    font-size: 13px;
    max-width: 400px;
  }

  .mini-list {
    display: flex;
    flex-direction: column;
    gap: 17px;
    margin-top: 45px;
  }

  .mini {
    display: flex;
    align-items: center;
    gap: 17px;
    text-decoration: none;
    color: var(--ink);
    border-bottom: 1px solid var(--line);
    padding-bottom: 15px;
  }

  .mini img {
    width: 76px;
    height: 88px;
    object-fit: cover;
  }

  .mini strong {
    font-family: Georgia, serif;
    font-size: 17px;
    font-weight: 400;
  }

  .mini small {
    display: block;
    margin-top: 8px;
    font-size: 11px;
    color: var(--muted);
  }

  @media (max-width: 800px) {
    padding: 75px 0;
    .best-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    .best-main {
      height: 520px;
    }
  }
`;

/* =====================================================
   BENEFITS
===================================================== */

const Benefits = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  article {
    padding: 40px 30px;
    border-right: 1px solid var(--line);
  }

  article:last-child {
    border: none;
  }

  .icon {
    color: var(--accent);
    font-size: 23px;
  }

  h3 {
    font-family: Georgia, serif;
    font-size: 22px;
    font-weight: 400;
    margin: 22px 0 10px;
  }

  p {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.9;
    max-width: 270px;
  }

  @media (max-width: 750px) {
    grid-template-columns: 1fr;

    article {
      border-right: none;
      border-bottom: 1px solid var(--line);
      padding: 30px 10px;
    }
  }
`;

const WhatsApp = styled.a`
  position: fixed;
  z-index: 9999;
  right: 25px;
  bottom: 25px;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  background: #20c76a;
  color: white;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  font-size: 25px;
  text-decoration: none;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px) scale(1.05);
  }
    img,
video {
  max-width: 100%;
}

img {
  vertical-align: middle;
}

video {
  background: #171715;
}
`;

/* =====================================================
   COMPOSANT PRINCIPAL
===================================================== */

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [precommandeDisponible, setPrecommandeDisponible] = useState(false);

  const [slide, setSlide] = useState(0);
  const [videoGenre, setVideoGenre] = useState("homme");
  const [videoIndex, setVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "light";

  const videoRef = useRef(null);

  /* FETCH */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const requests = await Promise.allSettled([
        fetch(`${API_URL}/api/produits`).then((r) => {
          if (!r.ok) throw new Error("Produits");
          return r.json();
        }),
        fetch(`${API_URL}/api/videos/produits`).then((r) => {
          if (!r.ok) throw new Error("Vidéos");
          return r.json();
        }),
        fetch(`${API_URL}/api/produits/best-sellers`).then((r) => {
          if (!r.ok) throw new Error("Best sellers");
          return r.json();
        }),
        fetch(`${API_URL}/api/precommandes/modeles`).then((r) => {
          if (!r.ok) throw new Error("Précommandes");
          return r.json();
        }),
      ]);

      if (!mounted) return;

      const [p, v, b, pre] = requests;

      if (p.status === "fulfilled")
        setProducts(Array.isArray(p.value) ? p.value : []);

      if (v.status === "fulfilled")
        setVideos(
          Array.isArray(v.value?.videos)
            ? v.value.videos.filter((x) => x?.url && x?.produitId)
            : [],
        );

      if (b.status === "fulfilled")
        setBestSellers(
          (Array.isArray(b.value) ? b.value : [])
            .filter(
              (x) =>
                x.bestSeller === true &&
                x.disponible === true &&
                !isPreorder(x) &&
                x.images?.[0]?.url,
            )
            .slice(0, 5),
        );

      if (pre.status === "fulfilled") {
        const data = pre.value;
        const models = Array.isArray(data)
          ? data
          : data.modeles || data.data || [];
        setPrecommandeDisponible(models.length > 0);
      }
    };

    load().catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  /* DATA */

  const heroProducts = useMemo(
    () => products.filter((p) => p.hero && p.images?.[0]?.url),
    [products],
  );

  const heroProduct = heroProducts[slide] || heroProducts[0];

  const menProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          genreOf(p.genre) === "homme" && !isPreorder(p) && p.images?.[0]?.url,
      ),
    [products],
  );

  const womenProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          genreOf(p.genre) === "femme" && !isPreorder(p) && p.images?.[0]?.url,
      ),
    [products],
  );

  const focusProducts = useMemo(() => {
    const ids = new Set(bestSellers.map((p) => String(p._id)));
    return products
      .filter(
        (p) => !isPreorder(p) && p.images?.[0]?.url && !ids.has(String(p._id)),
      )
      .slice(0, 8);
  }, [products, bestSellers]);

  const videosByGenre = useMemo(() => {
    const result = { homme: [], femme: [] };

    videos.forEach((video) => {
      const id =
        typeof video.produitId === "object"
          ? String(video.produitId?._id || video.produitId?.id || "")
          : String(video.produitId || "");

      const product = products.find((p) => String(p._id) === id);
      const genre = genreOf(product?.genre);

      if (product && result[genre]) {
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
  const activeVideo = activeVideos[videoIndex];

  /* SLIDER HERO */

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const timer = setInterval(() => {
      setSlide((i) => (i + 1) % heroProducts.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [heroProducts.length]);

  /* VIDEO */

  useEffect(() => {
    setVideoIndex(0);
    setPlaying(true);
    setMuted(true);
  }, [videoGenre]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideo) return;

    video.load();
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [activeVideo?._id, activeVideo?.url]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const nextVideo = () => {
    if (activeVideos.length > 1)
      setVideoIndex((i) => (i + 1) % activeVideos.length);
  };

  /* RENDER */

  return (
    <Page $dark={isDark}>
      {/* HERO */}

      <Hero>
        <HeroImage $src={media(heroProduct?.images?.[0]?.url)} />
        <HeroOverlay />

        {heroProducts.length > 1 && (
          <HeroCounter>
            {String(slide + 1).padStart(2, "0")}
            <span />
            {String(heroProducts.length).padStart(2, "0")}
          </HeroCounter>
        )}
      </Hero>

      {/* INTRODUCTION */}

      <Intro>
        <Container>
          <div className="number">01 — NOTRE VISION</div>
          <h2>
            Le style n'est pas une tendance. C'est une <em>signature.</em>
          </h2>
          <p>
            NUMA célèbre une mode contemporaine, expressive et intemporelle. Des
            pièces sélectionnées pour celles et ceux qui savent que chaque
            détail compte.
          </p>
        </Container>
      </Intro>

      {/* UNIVERS */}

      <UniverseGrid>
        {[
          {
            title: "Homme",
            genre: "homme",
            items: menProducts,
            label: "01 / MENSWEAR",
          },
          {
            title: "Femme",
            genre: "femme",
            items: womenProducts,
            label: "02 / WOMENSWEAR",
          },
        ].map((item) => (
          <UniverseCard
            className="universe"
            key={item.genre}
            to={`/${item.genre}`}
          >
            {item.items[0]?.images?.[0]?.url && (
              <img
                src={media(item.items[0].images[0].url)}
                alt={`Collection ${item.title}`}
                loading="lazy"
              />
            )}
            <div className="shade" />
            <div className="top">{item.label}</div>
            <div className="bottom">
              <h3>{item.title}</h3>
              <span className="arrow">
                <ArrowUpRight size={23} />
              </span>
            </div>
          </UniverseCard>
        ))}
      </UniverseGrid>

      {/* SELECTION */}

      <Section>
        <Container>
          <SectionHeading>
            <div>
              <Eyebrow>LA SÉLECTION NUMA</Eyebrow>
              <h2>
                Des pièces.
                <br />
                Du caractère.
              </h2>
            </div>
            <p>
              Une sélection de créations qui conjuguent silhouette, matière et
              personnalité.
            </p>
          </SectionHeading>

          {focusProducts.length > 0 ? (
            <ProductGrid>
              {focusProducts.map((product, index) => (
                <ProductCard key={product._id} $dark={isDark}>
                  <div className="photo">
                    <ProductPhotoLink
                      to={`/produit/${product._id}`}
                      aria-label={`Découvrir ${product.title}`}
                    />
                    <img
                      src={media(product.images?.[0]?.url)}
                      alt={product.title}
                      loading="lazy"
                    />
                    {index === 0 && <span className="tag">Sélection</span>}
                  </div>

                  <div className="details">
                    <div className="category">
                      {genreOf(product.genre) === "femme" ? "Femme" : "Homme"}
                    </div>
                    <ProductMeta>
                      <div>
                        <h3>{product.title}</h3>
                        <span className="price">
                          {Number(product.price || 0).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </span>
                      </div>
                      <ProductArrow
                        to={`/produit/${product._id}`}
                        aria-label={`Voir ${product.title}`}
                      >
                        <ArrowUpRight size={17} />
                      </ProductArrow>
                    </ProductMeta>
                  </div>
                </ProductCard>
              ))}
            </ProductGrid>
          ) : (
            <p>Aucun produit disponible actuellement.</p>
          )}

          <div style={{ textAlign: "center", marginTop: 50 }}>
            <TextLink to="/collections">
              Voir toute la collection <ArrowRight size={16} />
            </TextLink>
          </div>
        </Container>
      </Section>

      {/* CAMPAGNE */}

      <Campaign>
        <div className="visual">
          {focusProducts[0]?.images?.[0]?.url && (
            <img
              src={media(focusProducts[0].images[0].url)}
              alt="Campagne NUMA"
              loading="lazy"
            />
          )}
        </div>

        <div className="copy">
          <small>03 — L'ESPRIT NUMA</small>
          <h2>La différence se joue dans les détails.</h2>
          <p>
            Chaque pièce raconte une histoire. Une recherche de lignes, de
            matières et de finitions qui donnent du sens à votre style.
          </p>
          <Link to="/collections">
            Explorer notre univers <ArrowRight size={17} />
          </Link>
        </div>
      </Campaign>

      {/* VIDEO */}

      <VideoSection>
        <Container>
          <SectionHeading>
            <div>
              <Eyebrow>NUMA EN MOUVEMENT</Eyebrow>
              <h2>
                Une autre façon
                <br />
                de voir la mode.
              </h2>
            </div>
            <p>
              Découvrez nos créations autrement, à travers nos vidéos et nos
              campagnes.
            </p>
          </SectionHeading>

          {activeVideo ? (
            <>
              <div className="video-shell">
                <video
                  ref={videoRef}
                  key={activeVideo._id}
                  src={activeVideo.videoUrl}
                  autoPlay
                  muted={muted}
                  playsInline
                  preload="metadata"
                  onEnded={nextVideo}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />

                <div className="controls">
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={togglePlay} aria-label="Lecture ou pause">
                      {playing ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button onClick={toggleMute} aria-label="Son">
                      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>

                  {activeVideos.length > 1 && (
                    <button onClick={nextVideo} aria-label="Vidéo suivante">
                      <ArrowRight size={19} />
                    </button>
                  )}
                </div>
              </div>

              <div className="video-title">
                <div>
                  <Eyebrow>COLLECTION {videoGenre.toUpperCase()}</Eyebrow>
                  <h3>{activeVideo.produit?.title || "L'univers NUMA"}</h3>
                </div>

                <div className="genres">
                  {["homme", "femme"].map((genre) => (
                    <button
                      key={genre}
                      className={videoGenre === genre ? "active" : ""}
                      onClick={() => setVideoGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: 80,
                textAlign: "center",
                background: "var(--surface)",
                color: "var(--muted)",
              }}
            >
              Les vidéos de cet univers arrivent bientôt.
              <div className="genres" style={{ marginTop: 25 }}>
                {["homme", "femme"].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setVideoGenre(genre)}
                    className={videoGenre === genre ? "active" : ""}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Container>
      </VideoSection>

      {/* BEST SELLERS */}

      {bestSellers.length > 0 && (
        <BestsellerSection $dark={isDark}>
          <Container>
            <div className="best-grid">
              <Link className="best-main" to={`/produit/${bestSellers[0]._id}`}>
                <img
                  src={media(bestSellers[0].images?.[0]?.url)}
                  alt={bestSellers[0].title}
                  loading="lazy"
                />
              </Link>

              <div className="best-copy">
                <Eyebrow>LES PLUS APPRÉCIÉS</Eyebrow>
                <h2>Les incontournables NUMA.</h2>
                <p>
                  Les pièces qui séduisent, inspirent et deviennent rapidement
                  indispensables.
                </p>

                <TextLink to="/collections">
                  Découvrir les favoris <ArrowRight size={16} />
                </TextLink>

                <div className="mini-list">
                  {bestSellers.slice(0, 4).map((product) => (
                    <Link
                      className="mini"
                      key={product._id}
                      to={`/produit/${product._id}`}
                    >
                      <img
                        src={media(product.images?.[0]?.url)}
                        alt={product.title}
                        loading="lazy"
                      />
                      <div>
                        <strong>{product.title}</strong>
                        <small>
                          {Number(product.price || 0).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </small>
                      </div>
                      <ArrowUpRight size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </BestsellerSection>
      )}

      {/* PRECOMMANDES */}

      {precommandeDisponible && (
        <Section>
          <Container>
            <Campaign>
              <div className="visual">
                {heroProduct?.images?.[0]?.url && (
                  <img
                    src={media(heroProduct.images[0].url)}
                    alt="Précommandes NUMA"
                  />
                )}
              </div>
              <div className="copy">
                <small>ÉDITIONS À VENIR</small>
                <h2>Les prochaines pièces se préparent.</h2>
                <p>
                  Accédez à nos modèles disponibles en précommande et soyez
                  parmi les premiers à les découvrir.
                </p>
                <Link to="/precommande">
                  Découvrir les précommandes <ArrowRight size={17} />
                </Link>
              </div>
            </Campaign>
          </Container>
        </Section>
      )}

      {/* SERVICE */}

      <Section>
        <Container>
          <SectionHeading>
            <div>
              <Eyebrow>LA SIGNATURE NUMA</Eyebrow>
              <h2>
                Une expérience
                <br />à la hauteur de vos attentes.
              </h2>
            </div>
            <p>
              Bien plus qu'une collection, une expérience pensée pour vous
              accompagner à chaque étape.
            </p>
          </SectionHeading>

          <Benefits>
            <article>
              <FaTruck className="icon" />
              <h3>Livraison</h3>
              <p>
                Vos commandes sont préparées avec soin et expédiées dans les
                meilleures conditions.
              </p>
            </article>

            <article>
              <FaShieldAlt className="icon" />
              <h3>Paiement sécurisé</h3>
              <p>
                Profitez d'une expérience d'achat sécurisée et d'un parcours
                simple.
              </p>
            </article>

            <article>
              <FaUndo className="icon" />
              <h3>Accompagnement</h3>
              <p>
                Notre équipe reste disponible pour vous guider avant et après
                votre commande.
              </p>
            </article>
          </Benefits>
        </Container>
      </Section>

      {/* WHATSAPP */}

      <WhatsApp
        href="https://wa.me/2250700247693"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter NUMA sur WhatsApp"
      >
        <FaWhatsapp />
      </WhatsApp>
    </Page>
  );
}
