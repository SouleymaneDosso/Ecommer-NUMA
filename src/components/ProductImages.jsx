import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate"; // importer ton rotate

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
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
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

  &:hover {
    color: black;
  }
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
  background: ${({ active }) => (active ? "#000" : "#ccc")};
`;

export default function ProductImages({ images = [] }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const wrapperRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // transformer le tableau d'objets en URLs
  useEffect(() => {
    if (images.length) {
      const imgs = images.map((img) => img.url);
      setUrls(imgs);
    }
    setLoading(false);
  }, [images]);

  const openFullscreen = (index) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => setIsFullscreen(false);

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!urls.length) return;
    setCurrentIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!urls.length) return;
    setCurrentIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
  };

  const handleScroll = () => {
    if (!wrapperRef.current || !urls.length) return;
    const height = wrapperRef.current.clientHeight;
    const index = Math.round(wrapperRef.current.scrollTop / height);
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) nextImage();
    if (delta < -50) prevImage();
  };

  // 🔄 Afficher le loader tant que les images ne sont pas prêtes
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
      <ImagesWrapper ref={wrapperRef} onScroll={handleScroll}>
        {urls.map((url, i) => (
          <ImageSlide key={i}>
            <ProductImage
              src={url}
              alt={`Produit ${i + 1}`}
              onClick={() => openFullscreen(i)}
            />
          </ImageSlide>
        ))}
      </ImagesWrapper>

      <DotsWrapper>
        {urls.map((_, i) => (
          <Dot key={i} active={i === currentIndex} />
        ))}
      </DotsWrapper>

      {isFullscreen && urls[currentIndex] && (
        <FullscreenOverlay
          onClick={closeFullscreen}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ArrowLeft onClick={prevImage}>&larr;</ArrowLeft>
          <FullscreenImage src={urls[currentIndex]} />
          <ArrowRight onClick={nextImage}>&rarr;</ArrowRight>
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}
