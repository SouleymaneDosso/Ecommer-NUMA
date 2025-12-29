import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

// ---------- ANIMATIONS ----------
const badgeAnim = keyframes`
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

// ---------- STYLES ----------
const PageWrapper = styled.main`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 2%;
`;

const SliderWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 1.5rem;
  position: relative;
  scroll-padding: 2%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductCardWrapper = styled.div`
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: transform 0.35s, box-shadow 0.35s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  }

  @media (max-width: 600px) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 16px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;

  ${ProductCardWrapper}:hover & {
    transform: scale(1.08) rotate(0.3deg);
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ProductName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const ProductPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ type }) => type === "promo" ? "#f59e0b" : "#10b981"};
  color: #fff;
  animation: ${badgeAnim} 0.3s ease-out;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.7);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  z-index: 10;
  transition: opacity 0.2s, background 0.2s;

  &:hover {
    opacity: 1;
    background: rgba(255,255,255,1);
  }

  ${({ left }) => left && `left: 0.5rem;`}
  ${({ right }) => right && `right: 0.5rem;`}

  @media (min-width: 600px) {
    width: 40px;
    height: 40px;
    ${({ left }) => left && `left: 1rem;`}
    ${({ right }) => right && `right: 1rem;`}
  }
`;

const CarouselWrapper = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
`;

const CarouselDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#fff" : "rgba(255,255,255,0.5)")};
  cursor: pointer;
  transition: background 0.2s;
`;

const Skeleton = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 37%,
    #e5e7eb 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

// ---------- PRODUCT CARD ----------
function ProductCard({ product, imageIndex, setImageIndex, onClick }) {
  return (
    <ProductCardWrapper onClick={() => onClick(product._id)}>
      <ProductImageWrapper>
        {product.images?.[0] ? (
          <ProductImage
            src={product.images[imageIndex || 0].url}
            alt={product.title}
            loading="lazy"
          />
        ) : <Skeleton />}

        {product.badge === "promo" && <Badge type="promo">Promo</Badge>}

        {product.images?.length > 1 && (
          <CarouselWrapper>
            {product.images.map((_, i) => (
              <CarouselDot
                key={i}
                active={i === (imageIndex || 0)}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex(i);
                }}
              />
            ))}
          </CarouselWrapper>
        )}
      </ProductImageWrapper>

      <Overlay>
        <ProductName>{product.title}</ProductName>
        <ProductPrice>{product.price.toLocaleString()} FCFA</ProductPrice>
      </Overlay>
    </ProductCardWrapper>
  );
}

// ---------- COMPONENT ----------
export default function PromoLuxury() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        const promoProducts = data.filter(p => p.badge === "promo");
        setProducts(promoProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  const handleClickProduct = (id) => navigate(`/produit/${id}`);
  const setImageIndexForProduct = (productId, index) => {
    setImageIndexes(prev => ({ ...prev, [productId]: index }));
  };

  const scrollSlide = (direction) => {
    if (!sliderRef.current) return;
    const slideWidth = sliderRef.current.firstChild?.getBoundingClientRect().width || 0;
    const scrollAmount = direction === "next" ? slideWidth + 24 : -(slideWidth + 24);
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <PageWrapper>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>Promotions</h1>

      <SliderWrapper ref={sliderRef}>
        <ArrowButton left aria-label="Slide précédent" onClick={() => scrollSlide("prev")}>
          <FaChevronLeft />
        </ArrowButton>
        <ArrowButton right aria-label="Slide suivant" onClick={() => scrollSlide("next")}>
          <FaChevronRight />
        </ArrowButton>

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            imageIndex={imageIndexes[product._id] || 0}
            setImageIndex={(index) => setImageIndexForProduct(product._id, index)}
            onClick={handleClickProduct}
          />
        ))}
      </SliderWrapper>
    </PageWrapper>
  );
}
