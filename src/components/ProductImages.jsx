import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

// ---------- STYLES ----------
const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const ImagesWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  border-radius: 12px;
`;

const ImageSlide = styled.div`
  scroll-snap-align: start;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overscroll-behavior: contain;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2.5rem;
  color: white;
  cursor: pointer;
  user-select: none;
  z-index: 10000;
`;

const ArrowLeft = styled(Arrow)`left: 20px;`;
const ArrowRight = styled(Arrow)`right: 20px;`;

const DotsWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ isActive }) => (isActive ? "#000" : "#ccc")};
`;

const ThumbnailsWrapper = styled.div`
  display: flex;
  gap: 8px;
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
  border: ${({ isActive }) => (isActive ? "2px solid #000" : "1px solid #ccc")};
  border-radius: 6px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.6)};
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

  // Backend images -> urls
  useEffect(() => {
    if (images.length) {
      setUrls(images.map((img) => img.url));
    }
    setLoading(false);
  }, [images]);

  // Bloquer scroll page en fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Scroll vers l'image actuelle si currentIndex change
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
      <ImagesWrapper ref={wrapperRef}>
        {urls.map((url, i) => (
          <ImageSlide key={i} ref={(el) => (slidesRef.current[i] = el)}>
            <ProductImage src={url} alt={`Produit ${i + 1}`} onClick={() => openFullscreen(i)} />
          </ImageSlide>
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
          <FullscreenImage src={urls[currentIndex]} />
          <ArrowRight onClick={nextImage}>&rarr;</ArrowRight>
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}
