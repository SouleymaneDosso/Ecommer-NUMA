
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
   CINEMATIC ANIMATIONS
======================================== */

const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cinematicReveal = keyframes`
  0% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
    transform: scale(1.08);
  }

  45% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }

  100% {
    opacity: 1;
    transform: scale(1);
    clip-path: inset(0 0 0 0);
  }
`;

const cinematicZoom = keyframes`
  from {
    transform: scale(1.12);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fullscreenEnter = keyframes`
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }

  to {
    opacity: 1;
    backdrop-filter: blur(12px);
  }
`;

const fullscreenImageEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.88) translateY(20px);
    filter: blur(12px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
`;

const thumbnailEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(-12px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const grainAnimation = keyframes`
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-1%, 1%); }
  40% { transform: translate(1%, -1%); }
  60% { transform: translate(-1%, -1%); }
  80% { transform: translate(1%, 1%); }
`;

/* ========================================
   MAIN WRAPPER
======================================== */

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  color: #181818;
  font-family: inherit;
  animation: ${appear} 0.8s cubic-bezier(.2,.7,.2,1);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

/* ========================================
   THUMBNAILS
======================================== */

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  max-height: 620px;
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
    padding-bottom: 4px;
  }
`;

const Thumbnail = styled.button`
  width: 76px;
  height: 94px;
  flex-shrink: 0;
  padding: 3px;

  border: 1px solid ${({ $active }) =>
    $active ? "#171717" : "#e9e9e9"};

  background: #fff;
  cursor: pointer;

  opacity: ${({ $active }) => $active ? 1 : 0.55};

  transform: ${({ $active }) =>
    $active ? "translateX(4px)" : "translateX(0)"};

  transition:
    opacity 0.4s ease,
    border-color 0.4s ease,
    transform 0.4s cubic-bezier(.2,.7,.2,1),
    box-shadow 0.4s ease;

  animation: ${thumbnailEnter} 0.6s ease both;

  &:hover {
    opacity: 1;
    border-color: #171717;
    transform: translateX(4px);
    box-shadow: 0 5px 18px rgba(0,0,0,0.08);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  &:hover img {
    transform: scale(1.06);
  }

  @media (max-width: 600px) {
    width: 65px;
    height: 75px;

    transform: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;

/* ========================================
   MAIN IMAGE
======================================== */

const MainImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: #eae8e4;
  aspect-ratio: 4 / 5;
  max-height: 760px;

  animation: ${appear} 0.7s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;

    background:
      linear-gradient(
        180deg,
        rgba(0,0,0,0.04),
        transparent 20%,
        transparent 75%,
        rgba(0,0,0,0.07)
      );

    opacity: 0.7;
  }

  @media (max-width: 600px) {
    aspect-ratio: 4 / 5;
    max-height: none;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  cursor: zoom-in;

  animation: ${cinematicReveal} 1.1s
    cubic-bezier(.16,1,.3,1) both;

  transition:
    transform 1s cubic-bezier(.2,.7,.2,1),
    filter 0.8s ease;

  &:hover {
    transform: scale(1.035);
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

const Grain = styled.div`
  position: absolute;
  inset: -50%;
  z-index: 2;
  pointer-events: none;
  opacity: 0.055;

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");

  animation: ${grainAnimation} 0.3s steps(3) infinite;
`;

const ImageLabel = styled.div`
  position: absolute;
  z-index: 3;
  top: 20px;
  left: 20px;
  padding: 9px 13px;

  background: rgba(255,255,255,0.78);
  color: #333;

  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  animation: ${appear} 0.8s 0.3s both;
`;

const ZoomButton = styled.button`
  position: absolute;
  z-index: 4;
  right: 18px;
  bottom: 18px;

  width: 43px;
  height: 43px;

  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50%;

  background: rgba(255,255,255,0.9);
  color: #171717;

  display: grid;
  place-items: center;

  cursor: pointer;

  transition:
    transform 0.4s cubic-bezier(.2,.7,.2,1),
    background 0.3s ease,
    color 0.3s ease;

  &:hover {
    background: #171717;
    color: #fff;
    transform: scale(1.12) rotate(90deg);
  }
`;

const MainNavigation = styled.div`
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 15px;
  right: 15px;

  display: flex;
  justify-content: space-between;

  transform: translateY(-50%);
  pointer-events: none;
`;

const NavigationButton = styled.button`
  width: 42px;
  height: 42px;

  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50%;

  background: rgba(255,255,255,0.83);
  color: #222;

  display: grid;
  place-items: center;

  cursor: pointer;
  pointer-events: auto;

  backdrop-filter: blur(8px);

  transition:
    transform 0.35s ease,
    background 0.3s ease,
    color 0.3s ease;

  &:hover {
    background: #171717;
    color: white;
    transform: scale(1.12);
  }
`;

const Counter = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 24px;
  left: 20px;

  color: #777;
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 600;
`;

/* ========================================
   FULLSCREEN
======================================== */

const Fullscreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;

  background: rgba(10,10,10,0.97);

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${fullscreenEnter} 0.45s ease both;

  padding: 65px 85px;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 600px) {
    padding: 65px 12px;
  }
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;

  object-fit: contain;
  user-select: none;

  animation: ${fullscreenImageEnter} 0.75s
    cubic-bezier(.16,1,.3,1) both;

  filter: drop-shadow(0 15px 45px rgba(0,0,0,0.25));

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const FullscreenClose = styled.button`
  position: absolute;
  z-index: 3;
  top: 22px;
  right: 25px;

  width: 45px;
  height: 45px;

  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;

  background: transparent;
  color: white;

  display: grid;
  place-items: center;

  cursor: pointer;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: white;
    color: #111;
    transform: rotate(90deg);
  }
`;

const FullscreenArrow = styled.button`
  position: absolute;
  z-index: 3;
  top: 50%;

  transform: translateY(-50%);

  ${({ $left }) =>
    $left ? "left: 22px;" : "right: 22px;"}

  width: 47px;
  height: 47px;

  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;

  background: rgba(255,255,255,0.08);
  color: white;

  display: grid;
  place-items: center;

  cursor: pointer;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: white;
    color: #111;
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 600px) {
    width: 38px;
    height: 38px;

    ${({ $left }) =>
      $left ? "left: 8px;" : "right: 8px;"}
  }
`;

const FullscreenFooter = styled.div`
  position: absolute;
  bottom: 25px;
  left: 0;
  width: 100%;

  text-align: center;

  color: rgba(255,255,255,0.65);
  font-size: 11px;
  letter-spacing: 2px;

  animation: ${appear} 0.8s 0.2s both;
`;

/* ========================================
   COMPONENT
======================================== */

export default function ProductImages({ images = [] }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const thumbnailRefs = useRef([]);
  const previousOverflow = useRef("");

  /* ========================================
     LOAD IMAGES
  ======================================== */

  useEffect(() => {
    const validImages = images
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

  const openFullscreen = () => setIsFullscreen(true);

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

        {/* THUMBNAILS */}

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

        {/* MAIN IMAGE */}

        <MainImageContainer key={activeImage.url}>
          <ImageLabel>
            Collection NUMA
          </ImageLabel>

          <MainImage
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.title || "Photo du produit"}
            onClick={openFullscreen}
          />

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
            onClick={openFullscreen}
            aria-label="Agrandir l'image"
          >
            <FiMaximize2 />
          </ZoomButton>
        </MainImageContainer>
      </Gallery>

      {/* FULLSCREEN MODE */}

      {isFullscreen && (
        <Fullscreen
          onClick={() => setIsFullscreen(false)}
        >
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

          <FullscreenImage
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.title || "Photo du produit"}
            onClick={(e) => e.stopPropagation()}
          />

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
