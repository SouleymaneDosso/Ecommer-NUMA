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

  h1 { font-size: 3rem; margin: 0; }
  p { margin-top: 12px; font-size: 1.2rem; }
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

  img {
    width: 150px;
    height: 160px;
    object-fit: cover;
    border-radius: 16px;
  }

  p { margin-top: 12px; font-weight: bold; }
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
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
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

  p { text-align: center; font-weight: 600; }
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

  p { font-weight: 600; padding: 6px; }
`;

/* ---------------------- COMPONENT ---------------------- */
export default function Home() {
  const { t } = useTranslation();
  const [heroProducts, setHeroProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [categoryImages, setCategoryImages] = useState({
    homme: "",
    femme: "",
    enfant: "",
  });

  const getFullImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

  /* FETCH PRODUITS */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        setHeroProducts(data.filter((p) => p.hero));
        setProducts((data.filter((p) => !p.hero) || []).slice(0, 10));

        const getFirstImageByGenre = (genre) => {
          const prod = data.find(
            (p) => p.genre?.toLowerCase() === genre && p.images?.length > 0
          );
          return getFullImageUrl(prod?.images[0]?.url);
        };

        setCategoryImages({
          homme: getFirstImageByGenre("homme"),
          femme: getFirstImageByGenre("femme"),
          enfant: getFirstImageByGenre("enfant"),
        });
      });
  }, []);

  /* PRELOAD HERO IMAGES */
  useEffect(() => {
    if (!heroProducts.length) return;
    let loaded = 0;
    heroProducts.forEach((p) => {
      const img = new Image();
      img.src = getFullImageUrl(p.images[0]?.url);
      img.onload = () => {
        loaded++;
        if (loaded === heroProducts.length) setImagesLoaded(true);
      };
    });
  }, [heroProducts]);

  /* HERO AUTOPLAY */
  useEffect(() => {
    if (!heroProducts.length) return;
    const interval = setInterval(
      () => setActiveSlide((s) => (s + 1) % heroProducts.length),
      3500
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  const sliderDuration = useMemo(() => (window.innerWidth < 768 ? 18 : 30), []);

  const sliderDouble = [...heroProducts, ...heroProducts];
  const nouveautes = products.filter((p) => p.isNew);

  return (
    <Wrapper>
      {/* HERO */}
      <Hero>
        {imagesLoaded &&
          heroProducts.map((p, i) => (
            <HeroSlide
              key={p._id}
              $active={i === activeSlide}
              style={{ backgroundImage: `url('${getFullImageUrl(p.images[0]?.url)}')` }}
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

      <PromoBanner>{t("promoBanner")}</PromoBanner>

      {/* CATEGORIES */}
      <Categories>
        <CategoryCard to="/homme">
          <img src={categoryImages.homme} loading="lazy" alt="Homme" />
          <p>{t("categoryMen")}</p>
        </CategoryCard>
        <CategoryCard to="/femme">
          <img src={categoryImages.femme} loading="lazy" alt="Femme" />
          <p>{t("categoryWomen")}</p>
        </CategoryCard>
        <CategoryCard to="/enfant">
          <img src={categoryImages.enfant} loading="lazy" alt="Enfant" />
          <p>{t("categoryKids")}</p>
        </CategoryCard>
      </Categories>

      {/* SLIDER CONTINU */}
      <SliderContainer>
        <SlideRow $duration={sliderDuration}>
          {sliderDouble.map((p, i) => (
            <Slide
              key={`${p._id}-${i}`}
              style={{ backgroundImage: `url('${getFullImageUrl(p.images[0]?.url)}')` }}
            />
          ))}
        </SlideRow>
      </SliderContainer>

      {/* NOUVEAUTÉS */}
      <SectionTitle>{t("newArrivals")}</SectionTitle>
      <HorizontalScroll>
        {nouveautes.map((p) => (
          <CardHorizontal key={p._id} to={`/produit/${p._id}`}>
            <img src={getFullImageUrl(p.images[0]?.url)} loading="lazy" decoding="async" />
            <p>{p.title} – {p.price} FCFA</p>
          </CardHorizontal>
        ))}
      </HorizontalScroll>

      {/* PRODUITS */}
      <SectionTitle>{t("forYou")}</SectionTitle>
      <ProductGrid>
        {products.map((p) => (
          <Card key={p._id} to={`/produit/${p._id}`}>
            <img src={getFullImageUrl(p.images[0]?.url)} loading="lazy" decoding="async" />
            <p>{p.title} – {p.price} FCFA</p>
          </Card>
        ))}
      </ProductGrid>
    </Wrapper>
  );
}
