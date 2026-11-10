
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  FiX,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const imageReveal = keyframes`
  from {
    opacity: 0;
    transform: scale(1.08);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const textReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const progressAnimation = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* =========================================================
   OVERLAY PLEIN ÉCRAN
========================================================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #080808;
  color: white;
  animation: ${fadeIn} 0.7s ease;
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

/* =========================================================
   IMAGE PLEIN ÉCRAN
========================================================= */

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  animation: ${imageReveal} 1.1s cubic-bezier(.2,.7,.2,1);

  @media (max-width: 600px) {
    object-position: center center;
  }
`;

const ImageShade = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  background: linear-gradient(
    to bottom,
    rgba(0,0,0,.58) 0%,
    rgba(0,0,0,.08) 22%,
    transparent 42%,
    rgba(0,0,0,.12) 55%,
    rgba(0,0,0,.78) 100%
  );
`;

/* =========================================================
   HEADER
========================================================= */

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: max(25px, env(safe-area-inset-top)) 5% 20px;

  animation: ${textReveal} .8s ease;

  @media (max-width: 600px) {
    padding: max(20px, env(safe-area-inset-top)) 18px 15px;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  span:first-child {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 5px;
  }

  span:last-child {
    font-size: .57rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: .75;
  }
`;

const CloseButton = styled.button`
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255,255,255,.45);
  border-radius: 50%;
  background: rgba(0,0,0,.16);
  color: white;
  font-size: 21px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all .35s ease;

  &:hover {
    background: white;
    color: #111;
    transform: rotate(90deg);
    border-color: white;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
  }
`;

/* =========================================================
   PROGRESSION
========================================================= */

const ProgressContainer = styled.div`
  position: absolute;
  top: max(88px, calc(env(safe-area-inset-top) + 75px));
  left: 5%;
  right: 5%;
  z-index: 6;

  display: flex;
  gap: 5px;

  @media (max-width: 600px) {
    left: 18px;
    right: 18px;
    top: max(76px, calc(env(safe-area-inset-top) + 65px));
    gap: 4px;
  }
`;

const ProgressBar = styled.div`
  height: 2px;
  flex: 1;
  overflow: hidden;
  background: rgba(255,255,255,.35);
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $completed, $active }) =>
    $completed ? "100%" : $active ? "0%" : "0%"};

  background: white;
  transform-origin: left;

  animation: ${({ $active }) =>
    $active
      ? css`${progressAnimation} 3s linear forwards`
      : "none"};
`;

/* =========================================================
   NAVIGATION LATÉRALE
========================================================= */

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  z-index: 5;

  ${({ $left }) =>
    $left ? "left: 35px;" : "right: 35px;"}

  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255,255,255,.4);
  border-radius: 50%;
  background: rgba(0,0,0,.15);
  color: white;
  font-size: 20px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all .3s ease;

  &:hover {
    background: white;
    color: #111;
    border-color: white;
    transform: translateY(-50%) scale(1.08);
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

/* =========================================================
   INFORMATIONS PRODUIT
========================================================= */

const ProductInfo = styled.div`
  position: absolute;
  left: 8%;
  bottom: 190px;
  z-index: 4;
  width: min(650px, 75%);
  animation: ${textReveal} .8s ease;

  @media (max-width: 700px) {
    left: 22px;
    bottom: 175px;
    width: calc(100% - 44px);
  }
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;

  font-size: .68rem;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255,255,255,.85);

  &::before {
    content: "";
    width: 30px;
    height: 1px;
    background: white;
  }

  @media (max-width: 600px) {
    font-size: .58rem;
    letter-spacing: 3px;
    margin-bottom: 12px;
  }
`;

const ProductTitle = styled.h1`
  margin: 0;
  max-width: 750px;
  font-size: clamp(2.5rem, 6vw, 6.5rem);
  line-height: .98;
  font-weight: 600;
  letter-spacing: -.055em;
  text-transform: uppercase;
  text-shadow: 0 4px 30px rgba(0,0,0,.2);

  @media (max-width: 600px) {
    font-size: clamp(2.1rem, 10vw, 3.8rem);
  }
`;

const ProductPrice = styled.p`
  margin: 20px 0 0;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  color: rgba(255,255,255,.9);

  @media (max-width: 600px) {
    margin-top: 12px;
    font-size: .9rem;
  }
`;

const SlideCounter = styled.div`
  position: absolute;
  right: 8%;
  bottom: 205px;
  z-index: 4;
  font-size: .75rem;
  letter-spacing: 3px;
  color: rgba(255,255,255,.8);

  span {
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

/* =========================================================
   MINIATURES
========================================================= */

const BottomPanel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;

  padding: 25px 5% max(24px, env(safe-area-inset-bottom));

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;

  background: linear-gradient(
    to top,
    rgba(0,0,0,.55),
    rgba(0,0,0,.15),
    transparent
  );

  @media (max-width: 700px) {
    padding: 15px 18px max(18px, env(safe-area-inset-bottom));
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }
`;

const Thumbnails = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  max-width: 60%;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 700px) {
    max-width: 100%;
    gap: 8px;
  }
`;

const ThumbnailButton = styled.button`
  position: relative;
  width: 55px;
  height: 68px;
  flex-shrink: 0;
  padding: 0;
  overflow: hidden;

  border: 1px solid ${({ $active }) =>
    $active ? "white" : "rgba(255,255,255,.25)"};

  background: transparent;
  opacity: ${({ $active }) => ($active ? 1 : .55)};
  cursor: pointer;

  transition:
    opacity .3s ease,
    border-color .3s ease,
    transform .3s ease;

  &:hover {
    opacity: 1;
    transform: translateY(-4px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 600px) {
    width: 43px;
    height: 54px;
  }
`;

/* =========================================================
   BOUTON COLLECTION
========================================================= */

const CollectionButton = styled.button`
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  padding: 17px 25px;
  border: 1px solid white;
  background: white;
  color: #111;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;

  transition:
    background .35s ease,
    color .35s ease,
    transform .35s ease;

  svg {
    font-size: 17px;
    transition: transform .35s ease;
  }

  &:hover {
    background: transparent;
    color: white;
    transform: translateY(-3px);
  }

  &:hover svg {
    transform: translateX(5px);
  }

  @media (max-width: 700px) {
    width: 100%;
    padding: 16px;
  }
`;

/* =========================================================
   CHARGEMENT
========================================================= */

const LoadingScreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  background: #090909;
  color: white;

  p {
    font-size: .7rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    opacity: .7;
  }
`;

const LoadingCircle = styled.div`
  width: 35px;
  height: 35px;
  border: 1px solid rgba(255,255,255,.2);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

/* =========================================================
   COMPOSANT
========================================================= */

function Avantpremiere() {
  const [duree, setDuree] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ferme, setFerme] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  /* ATTENDRE 30 SECONDES */

  useEffect(() => {
    const time = setTimeout(() => {
      setDuree(1);
    }, 30000);

    return () => clearTimeout(time);
  }, []);

  /* RÉCUPÉRER LES NOUVEAUTÉS */

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits`
        );

        if (!res.ok) {
          throw new Error("Erreur de récupération des produits");
        }

        const data = await res.json();

        const liste = Array.isArray(data)
          ? data
          : Array.isArray(data.produits)
            ? data.produits
            : Array.isArray(data.products)
              ? data.products
              : [];

        const newProducts = liste.filter(
          (p) =>
            p.badge === "new" &&
            !(p.precommande === true && p.disponible === false) &&
            Array.isArray(p.images) &&
            p.images.some((img) => img?.url)
        );

        setProducts(newProducts);
      } catch (err) {
        console.error("Erreur Avantpremiere :", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  /* TRANSFORMER EN DIAPOSITIVES */

  const slides = useMemo(() => {
    return products.flatMap((product) =>
      product.images
        .filter((img) => img && img.url)
        .map((img) => ({
          url: img.url,
          title: product.title,
          price: product.price,
          productId: product._id,
        }))
    );
  }, [products]);

  /* SÉCURISER L'INDEX */

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  /* DÉFILEMENT AUTOMATIQUE */

  useEffect(() => {
    if (duree === 0 || ferme || slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [duree, ferme, slides.length]);

  /* NAVIGATION */

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    if (slides.length <= 1) return;

    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  /* AFFICHAGE */

  if (duree === 0 || ferme) {
    return null;
  }

  if (loading) {
    return (
      <LoadingScreen>
        <LoadingCircle />
        <p>Préparation de la collection</p>
      </LoadingScreen>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  if (!currentSlide) {
    return null;
  }

  return (
    <Overlay>
      <BackgroundImage
        key={`${currentSlide.productId}-${currentIndex}`}
        src={currentSlide.url}
        alt={currentSlide.title || "Nouvelle collection NUMA"}
      />

      <ImageShade />

      <Header>
        <Brand>
          <span>NUMA</span>
          <span>Fashion collection</span>
        </Brand>

        <CloseButton
          onClick={() => setFerme(true)}
          aria-label="Fermer"
        >
          <FiX />
        </CloseButton>
      </Header>

      <ProgressContainer>
        {slides.map((slide, index) => (
          <ProgressBar key={`${slide.productId}-${index}`}>
            <ProgressFill
              key={`${currentIndex}-${index}`}
              $active={index === currentIndex}
              $completed={index < currentIndex}
            />
          </ProgressBar>
        ))}
      </ProgressContainer>

      {slides.length > 1 && (
        <>
          <NavigationButton
            $left
            onClick={previousSlide}
            aria-label="Photo précédente"
          >
            <FiChevronLeft />
          </NavigationButton>

          <NavigationButton
            onClick={nextSlide}
            aria-label="Photo suivante"
          >
            <FiChevronRight />
          </NavigationButton>
        </>
      )}

      <ProductInfo key={`info-${currentIndex}`}>
        <Eyebrow>Nouvelle collection · Numa</Eyebrow>

        <ProductTitle>
          {currentSlide.title}
        </ProductTitle>

        {currentSlide.price != null && (
          <ProductPrice>
            {Number(currentSlide.price).toLocaleString("fr-FR")} FCFA
          </ProductPrice>
        )}
      </ProductInfo>

      <SlideCounter>
        <span>
          {String(currentIndex + 1).padStart(2, "0")}
        </span>
        {" / "}
        {String(slides.length).padStart(2, "0")}
      </SlideCounter>

      <BottomPanel>
        <Thumbnails>
          {slides.map((slide, index) => (
            <ThumbnailButton
              key={`${slide.productId}-${index}`}
              $active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Afficher la photo ${index + 1}`}
            >
              <img
                src={slide.url}
                alt={`Nouveauté ${index + 1}`}
                loading="lazy"
              />
            </ThumbnailButton>
          ))}
        </Thumbnails>

        <CollectionButton
          onClick={() => {
            setFerme(true);
            navigate("/new");
          }}
        >
          Découvrir la collection
          <FiArrowRight />
        </CollectionButton>
      </BottomPanel>
    </Overlay>
  );
}

export default Avantpremiere;
