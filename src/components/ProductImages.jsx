import { useState, useRef } from "react";
import styled from "styled-components";

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
  height: 100vh;
  background: rgba(0,0,0,0.9);
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
  transition: transform 0.4s ease;
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
    color: #ddd;
  }
`;

const ArrowLeft = styled(Arrow)`left: 20px;`;
const ArrowRight = styled(Arrow)`right: 20px;`;

export default function ProductImages({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = (index) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => setIsFullscreen(false);

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Swipe support for mobile fullscreen
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) nextImage();
    else if (delta < -50) prevImage();
  };

  return (
    <Wrapper>
      <ImagesWrapper>
        {images.map((img, i) => (
          <ImageSlide key={i}>
            <ProductImage
              src={img}
              alt={`Produit ${i + 1}`}
              onClick={() => openFullscreen(i)}
            />
          </ImageSlide>
        ))}
      </ImagesWrapper>

      {isFullscreen && (
        <FullscreenOverlay
          onClick={closeFullscreen}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ArrowLeft onClick={prevImage}>&larr;</ArrowLeft>
          <FullscreenImage key={currentIndex} src={images[currentIndex]} />
          <ArrowRight onClick={nextImage}>&rarr;</ArrowRight>
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}

