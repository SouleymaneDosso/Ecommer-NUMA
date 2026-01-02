import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

// ---------- ANIMATIONS ----------
const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// ---------- STYLES ----------
const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const ImagesWrapper = styled.div`
  height: 80vh;
  max-height: 500px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  border-radius: 12px;
`;

const ImageSlide = styled.div`
  scroll-snap-align: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
`;

// ---------- FULLSCREEN ----------
const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeInScale} 0.25s ease-out;
  overflow: hidden;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: calc(100vh - 80px); /* espace pour indicateur et confort visuel */
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  transition: transform 0.3s ease;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  color: #fff;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
  &:hover {
    color: #f59e0b;
  }
  z-index: 10000;
`;

const ArrowLeft = styled(Arrow)`left: 20px;`;
const ArrowRight = styled(Arrow)`right: 20px;`;

const IndicatorWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  width: 60%;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
`;

const IndicatorBar = styled.div`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: #f59e0b;
  border-radius: 2px;
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

  useEffect(() => {
    if (images.length) {
      setUrls(images.map((img) => img.url));
    }
    setLoading(false);
  }, [images]);

  // Bloquer scroll sur la page principale en fullscreen
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

  // Scroll automatique vers l'image active si pas fullscreen
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
