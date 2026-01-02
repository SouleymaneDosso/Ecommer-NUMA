import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

// ---------- ANIMATIONS ----------
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ---------- STYLES ----------

// Container principal
const Wrapper = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  position: relative;
`;

// Wrapper des images (scroll vertical type runway)
const ImagesWrapper = styled.div`
  height: 85vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// Slide unique
const ImageSlide = styled.div`
  height: 85vh;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.4s ease;
`;

// Image produit
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;
  transition: transform 0.35s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

// ---------- FULLSCREEN ----------

// Overlay fullscreen
const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

// Image fullscreen
const FullscreenImage = styled.img`
  max-width: 85vw;
  max-height: 90vh;
  object-fit: contain;
  animation: ${fadeIn} 0.3s ease;
`;

// Flèches navigation
const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: white;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const ArrowLeft = styled(Arrow)`left: 40px;`;
const ArrowRight = styled(Arrow)`right: 40px;`;

// Indicateur discret
const IndicatorWrapper = styled.div`
  position: absolute;
  bottom: 32px;
  width: 120px;
  height: 2px;
  background: rgba(255,255,255,0.2);
`;

const IndicatorBar = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: white;
  transition: width 0.3s ease;
`;

// ---------- COMPONENT ----------
export default function ProductImages({ images = [] }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const wrapperRef = useRef(null);
  const slidesRef = useRef([]);

  // Charger les images
  useEffect(() => {
    if (images.length) {
      setUrls(images.map((img) => img.url));
    }
    setLoading(false);
  }, [images]);

  // Bloquer scroll principal en fullscreen
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

  // Scroll automatique vers image active
  useEffect(() => {
    if (slidesRef.current[currentIndex] && !isFullscreen) {
      slidesRef.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentIndex, isFullscreen]);

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

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;
  if (!urls.length) return null;

  return (
    <Wrapper>
      <ImagesWrapper ref={wrapperRef}>
        {urls.map((url, i) => (
          <ImageSlide key={i} ref={(el) => (slidesRef.current[i] = el)}>
            <ProductImage src={url} alt={`Produit ${i + 1}`} onClick={() => openFullscreen(i)} />
          </ImageSlide>
        ))}
      </ImagesWrapper>

      {isFullscreen && urls[currentIndex] && (
        <FullscreenOverlay onClick={closeFullscreen}>
          <ArrowLeft onClick={prevImage}>&larr;</ArrowLeft>
          <FullscreenImage src={urls[currentIndex]} onClick={(e) => e.stopPropagation()} />
          <ArrowRight onClick={nextImage}>&rarr;</ArrowRight>

          <IndicatorWrapper>
            <IndicatorBar progress={progress} />
          </IndicatorWrapper>
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}
