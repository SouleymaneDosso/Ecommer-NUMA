import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import HeroModal from "../../components/HeroModal";
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
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
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
    const fetchProductsForNew = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const now = new Date();
          const days = 7; // nombre de jours pour considérer un produit "nouveau"
          const newProducts = data.filter((p) => {
            const createdAt = new Date(p.createdAt);
            const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
            return diffDays <= days;
          });
          setNouveautes(newProducts);
        } else {
          setNouveautes([]);
        }
      } catch (err) {
        console.error("Erreur fetch nouveautés:", err);
        setNouveautes([]);
      }
    };
    fetchProductsForNew();
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
     <>
     <HeroModal apiUrl={import.meta.env.VITE_API_URL} />
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
      <PromoBanner>Code promo bientôt disponible</PromoBanner>

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
        {Array.isArray(nouveautes) && nouveautes.length > 0
          ? nouveautes.map((p) => (
              <CardHorizontal key={p._id} to={`/produit/${p._id}`}>
                <img src={getMainImage(p)} loading="lazy" alt={p.title} />
                <p>
                  {p.title} – {p.price} FCFA
                </p>
              </CardHorizontal>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <SkeletonImage key={i} width="220px" height="260px" />
            ))}
      </HorizontalScroll>

      {/* PRODUITS */}
      <SectionTitle>{t("forYou")}</SectionTitle>
      <ProductGrid>
        {normalProducts.length > 0
          ? normalProducts.map((p) => (
              <Card key={p._id} to={`/produit/${p._id}`}>
                <img src={getMainImage(p)} loading="lazy" alt={p.title} />
                <p>
                  {p.title} – {p.price} FCFA
                </p>
              </Card>
            ))
          : Array.from({ length: 6 }).map((_, i) => (
              <SkeletonImage key={i} width="260px" height="260px" />
            ))}
      </ProductGrid>
    </Wrapper>
    </>
  );
}





















import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FiShoppingBag,
  FiUser,
  FiSun,
  FiMoon,
  FiX,
  FiHeart,
  FiSearch
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context"; 
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = 70;

/* ===== ANIMATIONS ===== */
const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

/* ===== STYLES ===== */
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;

  background: ${({ $isdark, $scrolled }) =>
    $scrolled
      ? $isdark
        ? "rgba(0,0,0,0.85)"
        : "#fff"
      : "transparent"};

  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 6px 28px rgba(0,0,0,0.1)" : "none"};

  color: ${({ $isdark, $scrolled }) =>
    $scrolled ? ($isdark ? "#fff" : "#111") : "#fff"};
`;

const HeaderTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.3rem;
  color: inherit;
  text-decoration: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
background-color: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;
  &:hover { transform: scale(1.1); }
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: red;
  color: white;
  width: 18px;
  height: 18px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Search minimal */
const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  width: ${({ $open }) => ($open ? "200px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  padding: ${({ $open }) => ($open ? "8px 12px" : "0")};
  border-radius: 50px;
  border: 1px solid #ccc;
  outline: none;
  transition: all 0.25s ease;
`;

/* ===== COMPONENT ===== */
export default function Header() {
  const { theme, themeToglle, ToggleTheme } = useContext(ThemeContext || {});
  const { ajouter } = useContext(PanierContext);
  const toggleTheme = themeToglle ?? ToggleTheme ?? (() => {});
  const $isdark = theme === "light";
  const { t, i18n } = useTranslation();
  const toggleLangue = () =>
    i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <>
      <HeaderWrapper $isdark={$isdark} $scrolled={scrolled}>
        <HeaderTop>
          <Logo to="/" $isdark={$isdark}>NUMA</Logo>

          <Actions>
            <IconButton onClick={toggleTheme} $isdark={$isdark}>
              {$isdark ? <FiMoon size={18} /> : <FiSun size={18} />}
            </IconButton>
           

            <SearchWrapper>
              <IconButton onClick={() => setSearchOpen(prev => !prev)} $isdark={$isdark}>
                <FiSearch size={18} />
              </IconButton>
              <form onSubmit={handleSearch}>
                <SearchInput
                  $open={searchOpen}
                  type="text"
                  placeholder={t("searchProducts")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </SearchWrapper>

            <IconButton as={Link} to="/compte" $isdark={$isdark}>
              <FiUser />
            </IconButton>

            <IconButton as={Link} to="/panier" $isdark={$isdark} style={{ position: "relative" }}>
              <FiShoppingBag />
              {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
            </IconButton>

            <IconButton as={Link} to="/favoris" $isdark={$isdark}>
              <FiHeart />
            </IconButton>
          </Actions>
        </HeaderTop>
      </HeaderWrapper>
    </>
  );
}