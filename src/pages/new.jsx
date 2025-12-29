// src/pages/CollectionLuxuryMobile.jsx
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

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
  gap: 2rem;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductCard = styled.div`
  scroll-snap-align: start;
  min-width: 80%;
  flex-shrink: 0;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: transform 0.35s, box-shadow 0.35s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  }

  @media (max-width: 900px) {
    min-width: 90%;
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 16px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;

  ${ProductCard}:hover & {
    transform: scale(1.08) rotate(0.3deg);
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const ProductPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Badge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ type }) => type === "new" ? "#10b981" : "#f59e0b"};
  color: #fff;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

  ${({ left }) => left && `left: 1rem;`}
  ${({ right }) => right && `right: 1rem;`}
`;

const CarouselWrapper = styled.div`
  position: absolute;
  bottom: 1rem;
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

// ---------- COMPONENT ----------
export default function CollectionLuxuryMobile() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  const changeImage = (productId, direction) => {
    setImageIndexes(prev => {
      const current = prev[productId] || 0;
      const product = products.find(p => p._id === productId);
      if (!product || !product.images) return prev;
      const length = product.images.length;
      let next = direction === "next" ? current + 1 : current - 1;
      if (next < 0) next = length - 1;
      if (next >= length) next = 0;
      return { ...prev, [productId]: next };
    });
  };

  const handleClickProduct = (id) => {
    navigate(`/produit/${id}`);
  };

  const scrollSlide = (direction) => {
    if (!sliderRef.current) return;
    const slideWidth = sliderRef.current.firstChild?.offsetWidth || 0;
    const scrollAmount = direction === "next" ? slideWidth + 32 : -(slideWidth + 32);
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });

    const totalSlides = products.length;
    setCurrentSlide(prev => {
      let next = direction === "next" ? prev + 1 : prev - 1;
      if (next < 0) next = totalSlides - 1;
      if (next >= totalSlides) next = 0;
      return next;
    });
  };

  return (
    <PageWrapper>
      <SliderWrapper ref={sliderRef}>
        <ArrowButton left onClick={() => scrollSlide("prev")}><FaChevronLeft /></ArrowButton>
        <ArrowButton right onClick={() => scrollSlide("next")}><FaChevronRight /></ArrowButton>

        {products.map((product, idx) => (
          <ProductCard key={product._id} onClick={() => handleClickProduct(product._id)}>
            <ProductImageWrapper>
              <ProductImage
                src={product.images?.[imageIndexes[product._id] || 0]?.url || "/placeholder.jpg"}
                alt={product.title}
              />
              {product.isNew && <Badge type="new">Nouveau</Badge>}
              {product.badge === "promo" && <Badge type="promo">Promo</Badge>}

              {product.images?.length > 1 && (
                <CarouselWrapper>
                  {product.images.map((_, i) => (
                    <CarouselDot
                      key={i}
                      active={i === (imageIndexes[product._id] || 0)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageIndexes(prev => ({ ...prev, [product._id]: i }));
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
          </ProductCard>
        ))}
      </SliderWrapper>
    </PageWrapper>
  );
}
