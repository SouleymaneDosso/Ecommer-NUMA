import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

/* ---------------------- STYLES ---------------------- */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  padding-bottom: 100px;
`;

const Hero = styled.div`
  width: 100%;
  height: 75vh;
  position: relative;
  overflow: hidden;
`;

const HeroSlide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 60px;
  transform: translateY(-50%);
  color: white;
  z-index: 3;
  max-width: 500px;

  h1 {
    font-size: 3rem;
  }
  p {
    margin-top: 12px;
    font-size: 1.2rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 22px;
  padding: 12px 24px;
  background: #fff;
  color: #000;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
`;

const PromoBanner = styled.div`
  padding: 18px;
  background: linear-gradient(90deg, #ff4e4e, #ff7d36);
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
`;

const Categories = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const CategoryCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  text-align: center;
  width: 120px;

  img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 32px;
  }

  p {
    margin-top: 1px;
    font-weight: bold;
  }
`;

const SkeletonImage = styled.div`
  width: ${({ width }) => width || "120px"};
  height: ${({ height }) => height || "120px"};
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 37%,
    #e5e7eb 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 380px;
  overflow: hidden;
`;

const SlideRow = styled.div`
  display: flex;
  height: 100%;
  width: max-content;
  animation: slide linear infinite;
  animation-duration: ${({ $duration }) => $duration}s;

  @keyframes slide {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-50%, 0, 0);
    }
  }
`;

const Slide = styled.div`
  width: 420px;
  height: 100%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-left: 20px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 20px;
`;

const CardHorizontal = styled(Link)`
  min-width: 220px;
  text-decoration: none;
  color: inherit;

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 12px;
  }

  p {
    text-align: center;
    font-weight: 600;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  padding: 20px;
`;

const Card = styled(Link)`
  text-decoration: none;
  color: inherit;

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 12px;
  }

  p {
    font-weight: 600;
    padding: 6px;
  }
`;

/* ---------------------- COMPONENT ---------------------- */
export default function Home() {
  const [nouveautes, setNouveautes] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [categoryImages, setCategoryImages] = useState({
    homme: null,
    femme: null,
    enfant: null,
  });
  const [sliderDuration, setSliderDuration] = useState(
    window.innerWidth < 768 ? 18 : 30
  );

  const { t } = useTranslation();

  /* ---------------------- HELPERS ---------------------- */
  const getFullImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_URL}${url}`;
  };

  const getMainImage = (product) => {
    if (!product?.images?.length) return null;
    const mainImg =
      product.images.find((img) => img.isMain) || product.images[0];
    return getFullImageUrl(mainImg.url);
  };

  /* ---------------------- FETCH PRODUITS ---------------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        console.log(data)
        const getFirstImageByGenre = (genre) => {
          const prod = data.find(
            (p) => p.genre?.toLowerCase() === genre && p.images?.length
          );
          return getMainImage(prod);
        };

        setCategoryImages({
          homme: getFirstImageByGenre("homme"),
          femme: getFirstImageByGenre("femme"),
          enfant: getFirstImageByGenre("enfant"),
        });
      } catch (err) {
        console.error("Erreur fetch produits:", err);
      }
    };
    fetchProducts();
  }, []);

  /* ---------------------- HERO PRODUCTS ---------------------- */
  const heroProducts = useMemo(
    () => products.filter((p) => p.hero),
    [products]
  );

  const normalProducts = useMemo(
    () => products.filter((p) => !p.hero),
    [products]
  );

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits/new`);
        const data = await res.json();
        setNouveautes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur fetch nouveautés:", err);
        setNouveautes([]);
      }
    };
    fetchNew();
  }, []);

  /* ---------------------- PRELOAD HERO IMAGES ---------------------- */
  useEffect(() => {
    if (!heroProducts.length) return;
    const preloadImages = async () => {
      const promises = heroProducts.map(
        (p) =>
          new Promise((res) => {
            const img = new Image();
            img.src = getMainImage(p);
            img.onload = res;
            img.onerror = res;
          })
      );
      await Promise.all(promises);
      setImagesLoaded(true);
    };
    preloadImages();
  }, [heroProducts]);

  /* ---------------------- HERO AUTOPLAY ---------------------- */
  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(
      () => setActiveSlide((s) => (s + 1) % heroProducts.length),
      3500
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  /* ---------------------- SLIDER RESPONSIVE ---------------------- */
  useEffect(() => {
    const handleResize = () =>
      setSliderDuration(window.innerWidth < 768 ? 18 : 30);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sliderDouble = [...heroProducts, ...heroProducts];

  return (
    <Wrapper>
      {/* HERO */}
      <Hero>
        {imagesLoaded
          ? heroProducts.map((p, i) => (
              <HeroSlide
                key={p._id}
                $active={i === activeSlide}
                style={{ backgroundImage: `url('${getMainImage(p)}')` }}
              />
            ))
          : Array.from({ length: 3 }).map((_, i) => (
              <HeroSlide
                key={i}
                $active={i === 0}
                style={{ background: "#ccc" }}
              />
            ))}
        <HeroOverlay />
        <HeroText>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSubtitle")}</p>
          <HeroButton to="/collections">
            {t("heroButton")} <FiChevronRight />
          </HeroButton>
        </HeroText>
      </Hero>

      {/* PROMO */}
      <PromoBanner>{t("promoBanner")}</PromoBanner>

      {/* CATEGORIES */}
      <Categories>
        {["homme", "femme", "enfant"].map((cat) => (
          <CategoryCard key={cat} to={`/${cat}`}>
            {categoryImages[cat] ? (
              <img src={categoryImages[cat]} alt={cat} loading="lazy" />
            ) : (
              <SkeletonImage />
            )}
            <p>{t(`${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</p>
          </CategoryCard>
        ))}
      </Categories>

      {/* SLIDER */}
      <SliderContainer>
        <SlideRow $duration={sliderDuration}>
          {sliderDouble.map((p, i) => (
            <Slide
              key={`${p._id}-${i}`}
              style={{ backgroundImage: `url('${getMainImage(p)}')` }}
            />
          ))}
        </SlideRow>
      </SliderContainer>

      {/* NOUVEAUTÉS */}
      <SectionTitle>{t("newArrivals")}</SectionTitle>
      <HorizontalScroll>
        {Array.isArray(nouveautes) && nouveautes.length > 0 ? (
          nouveautes.map((p) => (
            <CardHorizontal key={p._id} to={`/produit/${p._id}`}>
              <img src={getMainImage(p)} loading="lazy" alt={p.title} />
              <p>
                {p.title} – {p.price} FCFA
              </p>
            </CardHorizontal>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonImage key={i} width="220px" height="260px" />
          ))
        )}
      </HorizontalScroll>

      {/* PRODUITS */}
      <SectionTitle>{t("forYou")}</SectionTitle>
      <ProductGrid>
        {normalProducts.length > 0 ? (
          normalProducts.map((p) => (
            <Card key={p._id} to={`/produit/${p._id}`}>
              <img src={getMainImage(p)} loading="lazy" alt={p.title} />
              <p>
                {p.title} – {p.price} FCFA
              </p>
            </Card>
          ))
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonImage key={i} width="260px" height="260px" />
          ))
        )}
      </ProductGrid>
    </Wrapper>
  );
}
