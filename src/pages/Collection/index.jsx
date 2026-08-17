import {
  useState,
  useEffect,
  Fragment,
  useRef,
  useMemo,
  useCallback,
} from "react";
import styled, { keyframes } from "styled-components";
import { FiFilter, FiChevronDown, FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const imageReveal = keyframes`
  from {
    opacity: 0;
    transform: scale(1.04);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }

  100% {
    background-position: 500px 0;
  }
`;

/* =========================================================
   PAGE
========================================================= */

const PageWrapper = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 15% 10%,
      rgba(0, 0, 0, 0.035),
      transparent 28%
    ),
    #f7f6f3;
  color: #111;
  padding: 0 0 100px;
`;

const PageInner = styled.div`
  width: min(1500px, calc(100% - 48px));
  margin: 0 auto;

  @media (max-width: 768px) {
    width: calc(100% - 24px);
  }
`;

/* =========================================================
   INTRO
========================================================= */

const Intro = styled.header`
  padding: 75px 0 48px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  animation: ${fadeUp} 0.8s ease both;

  @media (max-width: 900px) {
    padding: 50px 0 30px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  @media (max-width: 600px) {
    padding: 35px 0 25px;
  }
`;

const IntroLeft = styled.div`
  max-width: 780px;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;

  span {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 700;
    color: #777;
  }

  &::before {
    content: "";
    width: 38px;
    height: 1px;
    background: #111;
  }
`;

const CollectionTitle = styled.h1`
  margin: 0;
  font-size: clamp(3rem, 7vw, 7rem);
  line-height: 0.88;
  letter-spacing: -0.07em;
  font-weight: 900;
  text-transform: uppercase;
`;

const CollectionSub = styled.p`
  margin: 24px 0 0;
  max-width: 560px;
  font-size: 1rem;
  line-height: 1.8;
  color: #777;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    line-height: 1.7;
    margin-top: 18px;
  }
`;

const IntroCount = styled.div`
  min-width: 130px;
  padding-bottom: 5px;

  strong {
    display: block;
    font-size: 2.8rem;
    line-height: 1;
    font-weight: 900;
    letter-spacing: -0.06em;
  }

  span {
    display: block;
    margin-top: 7px;
    color: #888;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

/* =========================================================
   TOOLBAR
========================================================= */

const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 14px 0;
  margin-bottom: 28px;
  background: rgba(247, 246, 243, 0.9);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);

  @media (max-width: 800px) {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }
`;

const FilterScroll = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;
  min-width: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 15px;
  border: 1px solid
    ${({ $active }) => ($active ? "#111" : "rgba(0,0,0,0.1)")};
  background: ${({ $active }) => ($active ? "#111" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.25s ease;

  &:hover {
    background: #111;
    color: #fff;
    border-color: #111;
  }

  svg {
    font-size: 13px;
  }

  @media (max-width: 600px) {
    padding: 9px 13px;
    font-size: 0.65rem;
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const CountBadge = styled.div`
  padding: 11px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.6);
  color: #555;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;

  @media (max-width: 600px) {
    display: none;
  }
`;

const SortWrapper = styled.div`
  position: relative;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const SortSelect = styled.select`
  appearance: none;
  width: 220px;
  padding: 11px 40px 11px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #111;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #111;
  }

  @media (max-width: 800px) {
    width: 100%;
  }
`;

const SortIcon = styled(FiChevronDown)`
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

/* =========================================================
   GRID
========================================================= */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: 420px) {
    gap: 8px;
  }
`;

/* =========================================================
   BANNER
========================================================= */

const BannerCard = styled.section`
  grid-column: 1 / -1;
  position: relative;
  overflow: hidden;
  margin: 8px 0 14px;
  background: #111;
  min-height: 600px;
  animation: ${fadeUp} 0.8s ease both;

  @media (max-width: 900px) {
    min-height: 460px;
  }

  @media (max-width: 600px) {
    min-height: 390px;
    margin: 5px 0 10px;
  }
`;

const BannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BannerSlide = styled.div`
  min-width: 100%;
  height: 600px;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;

  @media (max-width: 900px) {
    height: 460px;
  }

  @media (max-width: 600px) {
    height: 390px;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: ${imageReveal} 1s ease both;
`;

const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.78) 0%,
      rgba(0, 0, 0, 0.42) 38%,
      rgba(0, 0, 0, 0.08) 75%,
      rgba(0, 0, 0, 0.18) 100%
    );
`;

const BannerText = styled.div`
  position: absolute;
  left: 60px;
  bottom: 65px;
  z-index: 2;
  color: #fff;
  max-width: 600px;

  @media (max-width: 900px) {
    left: 32px;
    bottom: 40px;
    max-width: 470px;
  }

  @media (max-width: 600px) {
    left: 20px;
    bottom: 28px;
    right: 20px;
  }
`;

const BannerLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: #fff;
  }
`;

const BannerTitle = styled.h2`
  margin: 0;
  font-size: clamp(2.3rem, 5vw, 5.2rem);
  line-height: 0.95;
  letter-spacing: -0.055em;
  font-weight: 900;
  text-transform: uppercase;

  @media (max-width: 600px) {
    font-size: 2.2rem;
  }
`;

const BannerDesc = styled.p`
  max-width: 480px;
  margin: 18px 0 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);

  @media (max-width: 600px) {
    font-size: 0.78rem;
    line-height: 1.55;
    margin-top: 12px;
  }
`;

const Dots = styled.div`
  position: absolute;
  z-index: 5;
  right: 30px;
  bottom: 30px;
  display: flex;
  gap: 6px;

  @media (max-width: 600px) {
    right: 20px;
    bottom: 18px;
  }
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "32px" : "8px")};
  height: 4px;
  border: none;
  padding: 0;
  background: ${({ $active }) =>
    $active ? "#fff" : "rgba(255,255,255,0.35)"};
  cursor: pointer;
  transition: all 0.3s ease;
`;

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = styled.article`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: #fff;
  animation: ${fadeUp} 0.65s ease both;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 22px 45px rgba(0, 0, 0, 0.1);
  }
`;

const ImageArea = styled.div`
  position: relative;
  overflow: hidden;
  background: #ededeb;
`;

const ProductCarousel = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductSlide = styled.div`
  min-width: 100%;
  scroll-snap-align: start;
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 0.78;
  object-fit: cover;
  display: block;
  transition: transform 0.65s cubic-bezier(0.2, 0.7, 0.2, 1);

  ${ProductCard}:hover & {
    transform: scale(1.035);
  }

  @media (max-width: 600px) {
    aspect-ratio: 0.72;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 4;
  padding: 7px 10px;
  background: #111;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;

  @media (max-width: 600px) {
    top: 8px;
    left: 8px;
    padding: 5px 7px;
    font-size: 0.5rem;
  }
`;

const ProductArrow = styled.div`
  position: absolute;
  z-index: 5;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  color: #111;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease;

  ${ProductCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const ProductDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  position: relative;
  z-index: 3;
  margin-top: -15px;
`;

const ProductDot = styled.div`
  width: ${({ $active }) => ($active ? "19px" : "6px")};
  height: 3px;
  background: ${({ $active }) =>
    $active ? "#fff" : "rgba(255,255,255,0.6)"};
  transition: all 0.25s ease;
`;

const ProductInfo = styled.div`
  padding: 16px 15px 19px;

  @media (max-width: 600px) {
    padding: 11px 9px 14px;
  }
`;

const ProductGenre = styled.div`
  margin-bottom: 7px;
  color: #999;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  @media (max-width: 600px) {
    font-size: 0.52rem;
  }
`;

const ProductTitle = styled.h3`
  margin: 0 0 10px;
  color: #111;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
  min-height: 38px;

  @media (max-width: 600px) {
    font-size: 0.76rem;
    min-height: 32px;
    margin-bottom: 7px;
  }
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ProductPrice = styled.div`
  color: #111;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: -0.02em;

  @media (max-width: 600px) {
    font-size: 0.78rem;
  }
`;

const ProductMiniLabel = styled.span`
  color: #999;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    display: none;
  }
`;

/* =========================================================
   EMPTY
========================================================= */

const EmptyState = styled.div`
  min-height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fff;
  padding: 40px;
  animation: ${fadeUp} 0.7s ease both;

  strong {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  span {
    color: #888;
    font-size: 0.9rem;
  }
`;

/* =========================================================
   SKELETON
========================================================= */

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const SkeletonCard = styled.div`
  aspect-ratio: 0.78;
  background: linear-gradient(
    90deg,
    #e7e6e3 0%,
    #f3f2ef 50%,
    #e7e6e3 100%
  );
  background-size: 500px 100%;
  animation: ${shimmer} 1.3s infinite linear;
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function Collection() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [genreFilter, setGenreFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");

  const bannerRef = useRef(null);
  const carouselRefs = useRef({});

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits`
        );

        const data = await res.json();

        const validProducts = Array.isArray(data)
          ? data.filter((p) => p.images?.length)
          : [];

        setProducts(validProducts);

        const indexes = {};

        validProducts.forEach((p) => {
          const mainIndex = p.images.findIndex((img) => img.isMain);

          indexes[p._id] = mainIndex >= 0 ? mainIndex : 0;
        });

        setImageIndexes(indexes);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    }

    fetchProducts();
  }, []);

  /* =======================================================
     BANNER AUTO SCROLL
  ======================================================= */

  const bannerImages = useMemo(() => {
    const source = products.find((p) => p.images?.length);
    return source?.images || [];
  }, [products]);

  useEffect(() => {
    if (!bannerRef.current || bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = prev + 1 >= bannerImages.length ? 0 : prev + 1;

        if (bannerRef.current) {
          bannerRef.current.scrollTo({
            left: next * bannerRef.current.clientWidth,
            behavior: "smooth",
          });
        }

        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  /* =======================================================
     PRODUCT CAROUSEL
  ======================================================= */

  const handleProductScroll = useCallback((id) => {
    const element = carouselRefs.current[id];

    if (!element) return;

    const index = Math.round(
      element.scrollLeft / element.clientWidth
    );

    setImageIndexes((prev) => ({
      ...prev,
      [id]: index,
    }));
  }, []);

  /* =======================================================
     GENRES
  ======================================================= */

  const genres = useMemo(() => {
    const uniqueGenres = [
      ...new Set(
        products
          .map((p) => p.genre)
          .filter(Boolean)
      ),
    ];

    return ["Tous", ...uniqueGenres];
  }, [products]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredProducts = useMemo(() => {
    let result =
      genreFilter === "Tous"
        ? [...products]
        : products.filter(
            (p) => p.genre === genreFilter
          );

    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) =>
            Number(a.price) - Number(b.price)
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) =>
            Number(b.price) - Number(a.price)
        );
        break;

      case "title-asc":
        result.sort((a, b) =>
          String(a.title || "").localeCompare(
            String(b.title || "")
          )
        );
        break;

      case "title-desc":
        result.sort((a, b) =>
          String(b.title || "").localeCompare(
            String(a.title || "")
          )
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, genreFilter, sortBy]);

  /* =======================================================
     BADGES
  ======================================================= */

  const getBadgeText = (index, product) => {
    if (index < 2) return "Nouveau";

    if (Number(product.price) >= 25000) {
      return "Premium";
    }

    return "Tendance";
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <PageWrapper>
        <PageInner>
          <Intro>
            <IntroLeft>
              <Eyebrow>
                <span>Collection</span>
              </Eyebrow>

              <CollectionTitle>
                Collection
              </CollectionTitle>
            </IntroLeft>
          </Intro>

          <SkeletonGrid>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </SkeletonGrid>
        </PageInner>
      </PageWrapper>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <PageWrapper>
      <PageInner>

        {/* =================================================
            INTRO
        ================================================= */}

        <Intro>
          <IntroLeft>
            <Eyebrow>
              <span>Maison Numa — Collection</span>
            </Eyebrow>

            <CollectionTitle>
              Collection
            </CollectionTitle>

            <CollectionSub>
              Des pièces pensées pour construire une
              silhouette forte, élégante et immédiatement
              reconnaissable.
            </CollectionSub>
          </IntroLeft>

          <IntroCount>
            <strong>{filteredProducts.length}</strong>
            <span>pièces disponibles</span>
          </IntroCount>
        </Intro>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <Toolbar>
          <FilterScroll>
            {genres.map((genre) => (
              <FilterButton
                key={genre}
                $active={genreFilter === genre}
                onClick={() => setGenreFilter(genre)}
              >
                {genre === "Tous" && <FiFilter />}
                {genre}
              </FilterButton>
            ))}
          </FilterScroll>

          <ToolbarRight>
            <CountBadge>
              {filteredProducts.length} produits
            </CountBadge>

            <SortWrapper>
              <SortSelect
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="default">
                  Trier par
                </option>

                <option value="price-asc">
                  Prix croissant
                </option>

                <option value="price-desc">
                  Prix décroissant
                </option>

                <option value="title-asc">
                  Nom A → Z
                </option>

                <option value="title-desc">
                  Nom Z → A
                </option>
              </SortSelect>

              <SortIcon size={15} />
            </SortWrapper>
          </ToolbarRight>
        </Toolbar>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {filteredProducts.length === 0 ? (
          <EmptyState>
            <strong>
              Aucun produit trouvé
            </strong>

            <span>
              Essayez une autre catégorie.
            </span>
          </EmptyState>
        ) : (
          <Grid>
            {filteredProducts.map((product, index) => (
              <Fragment key={product._id}>

                {/* =========================================
                    BANNER
                ========================================= */}

                {index === 2 &&
                  bannerImages.length > 0 && (
                    <BannerCard>
                      <BannerWrapper ref={bannerRef}>
                        {bannerImages.map((image, i) => (
                          <BannerSlide key={i}>
                            <BannerImage
                              src={image.url}
                              alt={`Collection ${i + 1}`}
                            />

                            <BannerOverlay />

                            <BannerText>
                              <BannerLabel>
                                Nouvelle saison
                              </BannerLabel>

                              <BannerTitle>
                                Dress to impress.
                              </BannerTitle>

                              <BannerDesc>
                                Une collection pensée pour
                                celles et ceux qui veulent
                                une allure forte, propre et
                                remarquable.
                              </BannerDesc>
                            </BannerText>
                          </BannerSlide>
                        ))}
                      </BannerWrapper>

                      <Dots>
                        {bannerImages.map((_, i) => (
                          <Dot
                            key={i}
                            $active={
                              i === activeSlide
                            }
                            onClick={() => {
                              setActiveSlide(i);

                              bannerRef.current?.scrollTo(
                                {
                                  left:
                                    i *
                                    bannerRef.current
                                      .clientWidth,
                                  behavior: "smooth",
                                }
                              );
                            }}
                          />
                        ))}
                      </Dots>
                    </BannerCard>
                  )}

                {/* =========================================
                    PRODUCT
                ========================================= */}

                <ProductCard
                  onClick={() =>
                    navigate(
                      `/produit/${product._id}`
                    )
                  }
                >
                  <ImageArea>

                    <Badge>
                      {getBadgeText(
                        index,
                        product
                      )}
                    </Badge>

                    <ProductArrow>
                      <FiArrowUpRight
                        size={18}
                      />
                    </ProductArrow>

                    <ProductCarousel
                      ref={(element) => {
                        carouselRefs.current[
                          product._id
                        ] = element;
                      }}
                      onScroll={() =>
                        handleProductScroll(
                          product._id
                        )
                      }
                    >
                      {product.images?.map(
                        (image, imageIndex) => (
                          <ProductSlide
                            key={imageIndex}
                          >
                            <ProductImage
                              src={image.url}
                              alt={product.title}
                              loading="lazy"
                            />
                          </ProductSlide>
                        )
                      )}
                    </ProductCarousel>

                    {product.images?.length > 1 && (
                      <ProductDots>
                        {product.images.map(
                          (_, imageIndex) => (
                            <ProductDot
                              key={imageIndex}
                              $active={
                                imageIndexes[
                                  product._id
                                ] === imageIndex
                              }
                            />
                          )
                        )}
                      </ProductDots>
                    )}
                  </ImageArea>

                  <ProductInfo>
                    <ProductGenre>
                      {product.genre ||
                        "Collection"}
                    </ProductGenre>

                    <ProductTitle>
                      {product.title}
                    </ProductTitle>

                    <ProductBottom>
                      <ProductPrice>
                        {product.price} FCFA
                      </ProductPrice>

                      <ProductMiniLabel>
                        Découvrir
                      </ProductMiniLabel>
                    </ProductBottom>
                  </ProductInfo>
                </ProductCard>
              </Fragment>
            ))}
          </Grid>
        )}
      </PageInner>
    </PageWrapper>
  );
}