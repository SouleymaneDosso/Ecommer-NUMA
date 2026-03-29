import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiAperture,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

// ---------- ANIMATIONS ----------
const fadeSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const flipSlide = keyframes`
  0% {
    transform: rotateY(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateY(0deg);
    opacity: 1;
  }
`;

// ---------- STYLES ----------
const Wrapper = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  position: relative;
  font-family: "Helvetica Neue", sans-serif;
  color: #000;
`;

const ImagesWrapper = styled.div`
  height: 88vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImageSlide = styled.div`
  height: 88vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${flipSlide} 0.5s ease;

  &:after {
    content: '${({ index, title }) => title || `0${index + 1}`.slice(-2)}';
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 2rem;
    letter-spacing: 2px;
    opacity: 0.15;
    writing-mode: vertical-rl;
    z-index: 2;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform 0.35s ease, filter 0.3s ease;
  filter: contrast(1.05) brightness(0.95) grayscale(0.01);

  &:hover {
    transform: scale(1.02);
  }
`;

const LogoOverlay = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  font-weight: bold;
  font-size: 1.2rem;
  opacity: 0.2;
  letter-spacing: 2px;
  z-index: 2;
`;

// ---------- ICON ----------
const ZoomButton = styled.button`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.72);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
  opacity: 0.95;

  &:hover {
    transform: translateY(-2px) scale(1.08);
    background: rgba(0, 0, 0, 0.88);
  }

  svg {
    font-size: 1.2rem;
  }
`;

// ---------- FULLSCREEN ----------
const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.992);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`;

const FullscreenImage = styled.img`
  width: auto;
  max-width: 97vw;
  max-height: 97vh;
  object-fit: contain;
  animation: ${fadeSlide} 0.4s ease;
  filter: grayscale(0.01) contrast(1.08);
  user-select: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 54px;
  height: 54px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(1.06);
  }

  svg {
    font-size: 1.35rem;
  }
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 62px;
  height: 62px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: translateY(-50%) scale(1.06);
  }

  svg {
    font-size: 1.6rem;
  }

  @media (max-width: 700px) {
    width: 50px;
    height: 50px;
  }
`;

const ArrowLeft = styled(Arrow)`
  left: 24px;
`;

const ArrowRight = styled(Arrow)`
  right: 24px;
`;

const IndicatorWrapper = styled.div`
  position: absolute;
  bottom: 28px;
  width: 170px;
  height: 3px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  overflow: hidden;
`;

const IndicatorBar = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: white;
  transition: width 0.3s ease;
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 52px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 1px;
`;

// ---------- COMPONENT ----------
export default function ProductImages({ images = [] }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slidesRef = useRef([]);

  // Charger images
  useEffect(() => {
    if (images.length) {
      setUrls(images.map((img) => ({ url: img.url, title: img.title || "" })));
    }
    setLoading(false);
  }, [images]);

  // Bloquer scroll body en fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.width = "100%";
    } else {
      const scrollY = -parseInt(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }, [isFullscreen]);

  // Scroll auto vers image active
  useEffect(() => {
    if (slidesRef.current[currentIndex] && !isFullscreen) {
      slidesRef.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentIndex, isFullscreen]);

  // Clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;

      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, urls.length]);

  const openFullscreen = (index) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => setIsFullscreen(false);

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
  };

  const progress = ((currentIndex + 1) / urls.length) * 100;

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!urls.length) return null;

  return (
    <Wrapper>
      <ImagesWrapper>
        {urls.map((item, i) => (
          <ImageSlide
            key={i}
            index={i}
            title={item.title}
            ref={(el) => (slidesRef.current[i] = el)}
          >
            <LogoOverlay>NUMA</LogoOverlay>

            <ZoomButton
              onClick={() => openFullscreen(i)}
              aria-label="Voir l'image en grand"
            >
              <FiAperture />
            </ZoomButton>

            <ProductImage
              src={item.url}
              alt={item.title || `Produit ${i + 1}`}
              onClick={() => openFullscreen(i)}
            />
          </ImageSlide>
        ))}
      </ImagesWrapper>

      {isFullscreen && urls[currentIndex] && (
        <FullscreenOverlay onClick={closeFullscreen}>
          <CloseButton onClick={closeFullscreen} aria-label="Fermer">
            <FiX />
          </CloseButton>

          {urls.length > 1 && (
            <ArrowLeft onClick={prevImage} aria-label="Image précédente">
              <FiChevronLeft />
            </ArrowLeft>
          )}

          <FullscreenImage
            src={urls[currentIndex].url}
            alt={urls[currentIndex].title || `Produit ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          {urls.length > 1 && (
            <ArrowRight onClick={nextImage} aria-label="Image suivante">
              <FiChevronRight />
            </ArrowRight>
          )}

          <ImageCounter>
            {String(currentIndex + 1).padStart(2, "0")} / {String(urls.length).padStart(2, "0")}
          </ImageCounter>

          <IndicatorWrapper>
            <IndicatorBar progress={progress} />
          </IndicatorWrapper>
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}