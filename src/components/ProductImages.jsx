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
  max-height: 450px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  border-radius: 12px;
`;

const ImageSlide = styled.div`
  scroll-snap-align: start;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeInScale} 0.25s ease-out;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
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

const DotsWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ isActive }) => (isActive ? "#f59e0b" : "#ccc")};
  transition: all 0.2s;
`;

const ThumbnailsWrapper = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 8px 0;
  margin-top: 12px;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: ${({ isActive }) => (isActive ? "2px solid #f59e0b" : "1px solid #ccc")};
  border-radius: 6px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.7)};
  transition: all 0.2s;
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
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
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

  if (loading) return (
    <LoaderWrapper><Loader /></LoaderWrapper>
  );

  if (!urls.length) return null;

  return (
    <Wrapper>
      <ImagesWrapper ref={wrapperRef}>
        {urls.map((url, i) => (
          <div key={i} ref={(el) => (slidesRef.current[i] = el)}>
            <ProductImage src={url} alt={`Produit ${i + 1}`} onClick={() => openFullscreen(i)} />
          </div>
        ))}
      </ImagesWrapper>

      <DotsWrapper>
        {urls.map((_, i) => (
          <Dot key={i} isActive={i === currentIndex} />
        ))}
      </DotsWrapper>

      <ThumbnailsWrapper>
        {urls.map((url, i) => (
          <Thumb key={i} src={url} isActive={i === currentIndex} onClick={() => setCurrentIndex(i)} />
        ))}
      </ThumbnailsWrapper>

      {isFullscreen && urls[currentIndex] && (
        <FullscreenOverlay onClick={closeFullscreen}>
          <ArrowLeft onClick={prevImage}>&larr;</ArrowLeft>
          <FullscreenImage src={urls[currentIndex]} onClick={(e) => e.stopPropagation()} />
          <ArrowRight onClick={nextImage}>&rarr;</ArrowRight>
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}
