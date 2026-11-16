
import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from "react-icons/fi";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

/* ========================================
   ANIMATIONS
======================================== */

const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cinematicReveal = keyframes`
  from {
    opacity: 0;
    transform: scale(1.12);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
`;

const thumbnailEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fullscreenEnter = keyframes`
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(14px);
  }
`;

const fullscreenImageEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(.94);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
`;

const grainAnimation = keyframes`
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-1%, 1%); }
  50% { transform: translate(1%, -1%); }
  75% { transform: translate(-1%, -1%); }
`;

/* ========================================
   WRAPPER
======================================== */

const Wrapper = styled.div`
  width: 100%;
  min-width: 0;
  position: relative;
  color: #181818;
  font-family: inherit;
  animation: ${appear} .7s cubic-bezier(.2,.7,.2,1);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* ========================================
   GALLERY
======================================== */

const Gallery = styled.div`
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
  width: 100%;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

/* ========================================
   THUMBNAILS
======================================== */

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 780px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: none;
    padding: 2px 0;
  }
`;

const Thumbnail = styled.button`
  width: 76px;
  height: 94px;
  flex-shrink: 0;
  padding: 0;
  overflow: hidden;

  border: 1px solid ${({ $active }) =>
    $active ? "#171717" : "transparent"};

  background: #eee;
  cursor: pointer;

  opacity: ${({ $active }) => $active ? 1 : .58};

  transition:
    opacity .35s ease,
    border-color .35s ease,
    transform .35s ease,
    box-shadow .35s ease;

  animation: ${thumbnailEnter} .55s ease both;

  &:hover {
    opacity: 1;
    border-color: #171717;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,.12);
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform .6s cubic-bezier(.2,.7,.2,1);
  }

  &:hover img {
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    width: 65px;
    height: 75px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

/* ========================================
   MAIN IMAGE CONTAINER - 3D
======================================== */

const MainImageContainer = styled.div`
  width: 100%;
  min-width: 0;
  height: clamp(480px, 78vh, 900px);
  position: relative;
  overflow: hidden;
  isolation: isolate;

  background: #eae8e4;

  /* Perspective 3D */
  transform:
    perspective(1400px)
    rotateX(${({ $rotateX }) => $rotateX || 0}deg)
    rotateY(${({ $rotateY }) => $rotateY || 0}deg);

  transform-style: preserve-3d;

  transition:
    transform .35s cubic-bezier(.2,.7,.2,1);

  box-shadow: 0 20px 65px rgba(0,0,0,.10);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;

    background: radial-gradient(
      circle at ${({ $lightX }) => $lightX || 50}% ${({ $lightY }) => $lightY || 50}%,
      rgba(255,255,255,.30),
      rgba(255,255,255,.08) 22%,
      transparent 55%
    );

    opacity: .8;
    mix-blend-mode: screen;
    transition: opacity .3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;

    background: linear-gradient(
      180deg,
      rgba(0,0,0,.04),
      transparent 20%,
      transparent 75%,
      rgba(0,0,0,.10)
    );
  }

  @media (max-width: 600px) {
    height: 72vh;
    min-height: 420px;
    max-height: 720px;
    transform: none !important;
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
    transition: none;
  }
`;

/* ========================================
   MAIN PHOTO
======================================== */

const MainImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  /* Remplit toute la zone, sans espace autour */
  object-fit: cover;
  object-position: center;

  display: block;
  cursor: zoom-in;
  user-select: none;

  animation: ${cinematicReveal} 1s
    cubic-bezier(.16,1,.3,1) both;

  transition:
    transform 1s cubic-bezier(.2,.7,.2,1),
    filter .7s ease;

  &:hover {
    transform: scale(1.045);
    filter: contrast(1.03) saturate(1.04);
  }

  @media (max-width: 600px) {
    &:hover {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

/* ========================================
   GRAIN
======================================== */

const Grain = styled.div`
  position: absolute;
  inset: -50%;
  z-index: 4;
  pointer-events: none;
  opacity: .035;

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");

  animation: ${grainAnimation} .3s steps(3) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* ========================================
   LABEL
======================================== */

const ImageLabel = styled.div`
  position: absolute;
  z-index: 5;
  top: 20px;
  left: 20px;

  padding: 9px 13px;

  background: rgba(255,255,255,.78);
  color: #333;

  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  animation: ${appear} .8s .2s both;

  @media (max-width: 600px) {
    top: 14px;
    left: 14px;
  }
`;

/* ========================================
   BUTTONS
======================================== */

const ZoomButton = styled.button`
  position: absolute;
  z-index: 6;
  right: 18px;
  bottom: 18px;

  width: 44px;
  height: 44px;

  border: 1px solid rgba(0,0,0,.08);
  border-radius: 50%;

  background: rgba(255,255,255,.9);
  color: #171717;

  display: grid;
  place-items: center;

  cursor: pointer;

  transition: all .35s ease;

  &:hover {
    background: #171717;
    color: white;
    transform: scale(1.12) rotate(90deg);
  }
`;

const MainNavigation = styled.div`
  position: absolute;
  z-index: 6;
  top: 50%;
  left: 15px;
  right: 15px;

  display: flex;
  justify-content: space-between;

  transform: translateY(-50%);
  pointer-events: none;
`;

const NavigationButton = styled.button`
  width: 43px;
  height: 43px;

  border: 1px solid rgba(0,0,0,.08);
  border-radius: 50%;

  background: rgba(255,255,255,.88);
  color: #222;

  display: grid;
  place-items: center;

  cursor: pointer;
  pointer-events: auto;

  backdrop-filter: blur(8px);

  transition: all .3s ease;

  &:hover {
    background: #171717;
    color: white;
    transform: scale(1.12);
  }
`;

const Counter = styled.div`
  position: absolute;
  z-index: 6;
  bottom: 30px;
  left: 22px;

  color: white;
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 600;
  text-shadow: 0 1px 8px rgba(0,0,0,.45);
`;

/* ========================================
   FULLSCREEN
======================================== */

const Fullscreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;

  background: rgba(8,8,8,.98);

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${fullscreenEnter} .4s ease both;

  /* Image plein écran */
  padding: 0;

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
`;

const FullscreenImage = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  /* Aucun espace autour en plein écran */
  object-fit: cover;
  object-position: center;

  user-select: none;

  animation: ${fullscreenImageEnter} .7s
    cubic-bezier(.16,1,.3,1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FullscreenClose = styled.button`
  position: absolute;
  z-index: 5;
  top: 22px;
  right: 25px;

  width: 45px;
  height: 45px;

  border: 1px solid rgba(255,255,255,.3);
  border-radius: 50%;

  background: rgba(0,0,0,.25);
  color: white;

  display: grid;
  place-items: center;

  cursor: pointer;
  backdrop-filter: blur(10px);

  transition: all .3s ease;

  &:hover {
    background: white;
    color: #111;
    transform: rotate(90deg);
  }
`;

const FullscreenArrow = styled.button`
  position: absolute;
  z-index: 5;
  top: 50%;

  transform: translateY(-50%);

  ${({ $left }) =>
    $left ? "left: 22px;" : "right: 22px;"}

  width: 48px;
  height: 48px;

  border: 1px solid rgba(255,255,255,.35);
  border-radius: 50%;

  background: rgba(0,0,0,.25);
  color: white;

  display: grid;
  place-items: center;

  cursor: pointer;
  backdrop-filter: blur(10px);

  transition: all .3s ease;

  &:hover {
    background: white;
    color: #111;
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;

    ${({ $left }) =>
      $left ? "left: 10px;" : "right: 10px;"}
  }
`;

const FullscreenFooter = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 25px;
  left: 0;
  width: 100%;

  text-align: center;

  color: white;
  font-size: 11px;
  letter-spacing: 2px;
  text-shadow: 0 1px 8px rgba(0,0,0,.5);
`;

/* ========================================
   COMPONENT
======================================== */

export default function ProductImages({ images = [] }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
    lightX: 50,
    lightY: 50,
  });

  const thumbnailRefs = useRef([]);
  const previousOverflow = useRef("");

  /* ========================================
     LOAD IMAGES
  ======================================== */

  useEffect(() => {
    const validImages = (Array.isArray(images) ? images : [])
      .filter((img) => img?.url)
      .map((img) => ({
        url: img.url,
        title: img.title || "",
      }));

    setUrls(validImages);
    setCurrentIndex(0);
    setLoading(false);
  }, [images]);

  /* ========================================
     LOCK BODY SCROLL
  ======================================== */

  useEffect(() => {
    if (!isFullscreen) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [isFullscreen]);

  /* ========================================
     CENTER ACTIVE THUMBNAIL
  ======================================== */

  useEffect(() => {
    thumbnailRefs.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [currentIndex]);

  /* ========================================
     KEYBOARD NAVIGATION
  ======================================== */

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }

      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) =>
          prev === 0 ? urls.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev === urls.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, urls.length]);

  /* ========================================
     NAVIGATION
  ======================================== */

  const previousImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? urls.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === urls.length - 1 ? 0 : prev + 1
    );
  };

  /* ========================================
     3D MOUSE MOVEMENT
  ======================================== */

  const handleMouseMove = (e) => {
    if (window.matchMedia("(max-width: 600px)").matches) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - y) * 5,
      y: (x - 0.5) * 5,
      lightX: x * 100,
      lightY: y * 100,
    });
  };

  const resetTilt = () => {
    setTilt({
      x: 0,
      y: 0,
      lightX: 50,
      lightY: 50,
    });
  };

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!urls.length) return null;

  const activeImage = urls[currentIndex];

  /* ========================================
     RENDER
  ======================================== */

  return (
    <Wrapper>
      <Gallery>

        {/* MINIATURES */}

        {urls.length > 1 && (
          <Thumbnails>
            {urls.map((item, index) => (
              <Thumbnail
                key={`${item.url}-${index}`}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                type="button"
                $active={currentIndex === index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Voir la photo ${index + 1}`}
                aria-pressed={currentIndex === index}
              >
                <img
                  src={item.url}
                  alt={item.title || `Miniature ${index + 1}`}
                />
              </Thumbnail>
            ))}
          </Thumbnails>
        )}

        {/* PHOTO PRINCIPALE */}

        <MainImageContainer
          $rotateX={tilt.x}
          $rotateY={tilt.y}
          $lightX={tilt.lightX}
          $lightY={tilt.lightY}
          onPointerMove={handleMouseMove}
          onPointerLeave={resetTilt}
        >
          <MainImage
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.title || "Photo du produit"}
            onClick={() => setIsFullscreen(true)}
            draggable="false"
          />

          <ImageLabel>
            Collection NUMA
          </ImageLabel>

          <Grain />

          {urls.length > 1 && (
            <MainNavigation>
              <NavigationButton
                type="button"
                onClick={previousImage}
                aria-label="Image précédente"
              >
                <FiChevronLeft size={19} />
              </NavigationButton>

              <NavigationButton
                type="button"
                onClick={nextImage}
                aria-label="Image suivante"
              >
                <FiChevronRight size={19} />
              </NavigationButton>
            </MainNavigation>
          )}

          <Counter>
            {String(currentIndex + 1).padStart(2, "0")}
            {" / "}
            {String(urls.length).padStart(2, "0")}
          </Counter>

          <ZoomButton
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Agrandir l'image"
          >
            <FiMaximize2 />
          </ZoomButton>
        </MainImageContainer>
      </Gallery>

      {/* MODE PLEIN ÉCRAN */}

      {isFullscreen && (
        <Fullscreen
          onClick={() => setIsFullscreen(false)}
        >
          <FullscreenImage
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.title || "Photo du produit"}
            onClick={(e) => e.stopPropagation()}
          />

          <FullscreenClose
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Fermer"
          >
            <FiX size={21} />
          </FullscreenClose>

          {urls.length > 1 && (
            <FullscreenArrow
              type="button"
              $left
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              aria-label="Image précédente"
            >
              <FiChevronLeft size={23} />
            </FullscreenArrow>
          )}

          {urls.length > 1 && (
            <FullscreenArrow
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Image suivante"
            >
              <FiChevronRight size={23} />
            </FullscreenArrow>
          )}

          <FullscreenFooter>
            {String(currentIndex + 1).padStart(2, "0")}
            {" / "}
            {String(urls.length).padStart(2, "0")}
            {" — NUMA"}
          </FullscreenFooter>
        </Fullscreen>
      )}
    </Wrapper>
  );
}
