
import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from "react-icons/fi";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

/* ============================
   ANIMATIONS
============================ */

const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/* ============================
   MAIN WRAPPER
============================ */

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  color: #181818;
  font-family: inherit;
  animation: ${appear} 0.5s ease;
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

/* ============================
   THUMBNAILS
============================ */

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
  transition: all 0.25s ease;
  opacity: ${({ $active }) => $active ? 1 : 0.65};

  &:hover {
    opacity: 1;
    border-color: #171717;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 600px) {
    width: 65px;
    height: 75px;
  }
`;

/* ============================
   MAIN IMAGE
============================ */

const MainImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f5f4f1;
  aspect-ratio: 4 / 5;
  max-height: 760px;
  animation: ${zoomIn} 0.4s ease;

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
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);

  &:hover {
    transform: scale(1.035);
  }
`;

const ImageLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.85);
  color: #333;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.7px;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
`;

const ZoomButton = styled.button`
  position: absolute;
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
  transition: all 0.25s ease;
  z-index: 2;

  &:hover {
    background: #171717;
    color: #fff;
    transform: scale(1.08);
  }
`;

const MainNavigation = styled.div`
  position: absolute;
  top: 50%;
  left: 15px;
  right: 15px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
`;

const NavigationButton = styled.button`
  width: 39px;
  height: 39px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  color: #222;
  display: grid;
  place-items: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;

  &:hover {
    background: #171717;
    color: #fff;
  }
`;

const Counter = styled.div`
  position: absolute;
  bottom: 24px;
  left: 20px;
  color: #777;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 600;
`;

/* ============================
   FULLSCREEN
============================ */

const Fullscreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(12,12,12,0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${appear} 0.25s ease;
  padding: 65px 85px;

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
  animation: ${zoomIn} 0.3s ease;
  user-select: none;
`;

const FullscreenClose = styled.button`
  position: absolute;
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
  transition: 0.25s;

  &:hover {
    background: white;
    color: #111;
  }
`;

const FullscreenArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $left }) => $left ? "left: 22px;" : "right: 22px;"}
  width: 47px;
  height: 47px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: white;
    color: #111;
  }

  @media (max-width: 600px) {
    width: 38px;
    height: 38px;
    ${({ $left }) => $left ? "left: 8px;" : "right: 8px;"}
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
`;

/* ============================
   COMPONENT
============================ */

export default function ProductImages({ images = [] }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const thumbnailRefs = useRef([]);
  const previousOverflow = useRef("");

  // Charger les images
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

  // Bloquer le scroll en plein écran
  useEffect(() => {
    if (!isFullscreen) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [isFullscreen]);

  // Centrer la miniature active
  useEffect(() => {
    thumbnailRefs.current[currentIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [currentIndex]);

  // Navigation clavier
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);

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

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!urls.length) return null;

  const activeImage = urls[currentIndex];

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

        {/* IMAGE PRINCIPALE */}

        <MainImageContainer key={activeImage.url}>

          <ImageLabel>
            Collection NUMA
          </ImageLabel>

          <MainImage
            src={activeImage.url}
            alt={activeImage.title || "Photo du produit"}
            onClick={openFullscreen}
          />

          {urls.length > 1 && (
            <MainNavigation>
              <NavigationButton
                type="button"
                onClick={previousImage}
                aria-label="Image précédente"
              >
                <FiChevronLeft />
              </NavigationButton>

              <NavigationButton
                type="button"
                onClick={nextImage}
                aria-label="Image suivante"
              >
                <FiChevronRight />
              </NavigationButton>
            </MainNavigation>
          )}

          <Counter>
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
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

      {/* MODE PLEIN ÉCRAN */}

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
