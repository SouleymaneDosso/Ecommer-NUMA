import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { produits } from "../../data/produits";
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

/* HERO CARROUSEL */
const Hero = styled.div`
  width: 100%;
  height: 75vh;
  position: relative;
  overflow: hidden;
`;

const HeroSlide = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: opacity 1s ease-in-out;
  opacity: ${({ active }) => (active ? 1 : 0)};
`;

const HeroSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #e0e0e0 0%, #f8f8f8 50%, #e0e0e0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
  }
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 60px;
  transform: translateY(-50%);
  color: white;
  z-index: 3;

  h1 {
    font-size: 3.5rem;
    margin: 0;
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
  transition: 0.25s;

  &:hover {
    transform: translateX(6px);
  }
`;

/* BANNIERE PROMO */
const PromoBanner = styled.div`
  padding: 18px;
  background: linear-gradient(90deg, #ff4e4e, #ff7d36);
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  animation: bannerMove 10s linear infinite;

  @keyframes bannerMove {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

/* CATEGORIES */
const Categories = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
`;

const CategoryCard = styled(Link)`
  text-decoration: none;
  color: #000;
  text-align: center;

  img {
    width: 130px;
    height: 140px;
    border-radius: 16px;
    object-fit: cover;
    transition: 0.3s;
    &:hover { transform: scale(1.05); }
  }

  p {
    margin-top: 10px;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

/* SLIDER CONTINU */
const SliderContainer = styled.div`
  width: 100%;
  height: 380px;
  overflow: hidden;
  position: relative;
`;

const SlideRow = styled.div`
  display: flex;
  height: 100%;
  animation: slideinfinite 28s linear infinite;
  width: max-content;

  @keyframes slideinfinite {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
`;

const Slide = styled.div`
  width: 420px;
  height: 100%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const SlideSkeleton = styled.div`
  width: 420px;
  height: 100%;
  background: linear-gradient(90deg, #e0e0e0 0%, #f8f8f8 50%, #e0e0e0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-left: 20px;
`;

/* NOUVEAUTES SCROLL HORIZONTAL */
const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 20px 20px 10px;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 10px;
  }
`;

const CardHorizontal = styled(Link)`
  min-width: 220px;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: ${({ theme }) => theme.card};
  scroll-snap-align: start;

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
  }

  p {
    padding: 8px;
    font-weight: 600;
  }
`;

/* SKELETON CARD */
const SkeletonCard = styled.div`
  min-width: 220px;
  height: 320px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e0e0e0 0%, #f8f8f8 50%, #e0e0e0 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
  }
`;

/* GRID PRODUITS */
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
  gap: 24px;
  padding: 20px;
`;

const Card = styled(Link)`
  display: block;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: ${({ theme }) => theme.card};

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    display: block;
  }

  p {
    padding: 8px;
    font-weight: 600;
  }
`;

/* ---------------------- COMPONENT ---------------------- */
export default function Home() {

  const { t } = useTranslation();

  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const loadMoreRef = useRef();

  /* HERO AUTOPLAY */
  const heroImages = [
    "/image1.jpg","/image2.jpg","/image3.jpg",
    "/image4.jpg","/image5.jpg","/image6.jpg",
    "/image7.jpg","/image8.jpg","/image9.jpg"
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  /* Pré-chargement Hero */
  useEffect(() => {
    let loaded = 0;
    heroImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === heroImages.length) setImagesLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(s => (s + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  /* INFINITE SCROLL */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < produits.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 4, produits.length));
            setLoadingMore(false);
          }, 600);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [visibleCount]);

  /* SLIDER CONTINU */
  const sliderDouble = [...heroImages, ...heroImages];

  const nouveautes = produits.filter(p => p.badge === "new");
  const visibleProducts = produits.slice(0, visibleCount);


  return (
    <Wrapper>

      {/* HERO CARROUSEL */}
      <Hero>
        {imagesLoaded ? (
          heroImages.map((img,i) => (
            <HeroSlide key={i} active={i===activeSlide} style={{ backgroundImage: `url('${img}')` }}/>
          ))
        ) : (
          <HeroSkeleton />
        )}
        <HeroText>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSubtitle")}</p>
          <HeroButton to="/collections">
            {t("heroButton")} <FiChevronRight/>
          </HeroButton>
        </HeroText>
      </Hero>

      {/* BANNIERE PROMO */}
      <PromoBanner>
        {t("promoBanner")}
      </PromoBanner>

      {/* CATEGORIES */}
      <Categories>
        <CategoryCard to="/categorie/homme">
          <img src="/image1.jpg" alt="Homme"/>
          <p>{t("categoryMen")}</p>
        </CategoryCard>

        <CategoryCard to="/categorie/femme">
          <img src="/image2.jpg" alt="Femme"/>
          <p>{t("categoryWomen")}</p>
        </CategoryCard>

        <CategoryCard to="/categorie/enfant">
          <img src="/image3.jpg" alt="Enfant"/>
          <p>{t("categoryKids")}</p>
        </CategoryCard>
      </Categories>

      {/* SLIDER CONTINU */}
      <SliderContainer>
        {imagesLoaded ? (
          <SlideRow>
            {sliderDouble.map((img,i) => (
              <Slide key={i} style={{ backgroundImage: `url('${img}')` }}/>
            ))}
          </SlideRow>
        ) : (
          <SlideSkeleton />
        )}
      </SliderContainer>

      {/* NOUVEAUTES */}
      <SectionTitle>{t("newArrivals")}</SectionTitle>
      <HorizontalScroll>
        {nouveautes.map(p => (
          <CardHorizontal key={p.id} to={`/produit/${p.id}`}>
            <img src={p.image} alt={p.title} loading="lazy"/>
            <p>{p.title} – {p.price}€</p>
          </CardHorizontal>
        ))}
      </HorizontalScroll>

      {/* PRODUITS + INFINITE SCROLL */}
      <SectionTitle>{t("forYou")}</SectionTitle>
      <ProductGrid>
        {visibleProducts.map(p => (
          <Card key={p.id} to={`/produit/${p.id}`}>
            <img src={p.image} alt={p.title} loading="lazy"/>
            <p>{p.title} – {p.price}€</p>
          </Card>
        ))}
        {loadingMore &&
          Array(Math.min(3, produits.length - visibleCount))
            .fill(0)
            .map((_,i) => <SkeletonCard key={`sk-${i}`}/>)
        }
      </ProductGrid>

      {/* Ref pour déclencher le load */}
      <div ref={loadMoreRef} />
    </Wrapper>
  );
}
