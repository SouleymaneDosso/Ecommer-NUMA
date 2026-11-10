
import {
  useState,
  useEffect,
  Fragment,
  useRef,
  useMemo,
  useCallback,
} from "react";

import styled, { keyframes } from "styled-components";
import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* =====================================================
   ANIMATIONS
===================================================== */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const reveal = keyframes`
  from { opacity: 0; transform: scale(1.04); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  from { background-position: -500px 0; }
  to { background-position: 500px 0; }
`;

/* =====================================================
   PAGE
===================================================== */

const Page = styled.main`
  --bg: #f7f5f0;
  --paper: #fffefa;
  --ink: #24221e;
  --muted: #8a857c;
  --line: #e5e0d7;
  --accent: #927657;

  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  padding-bottom: 100px;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }
`;

const Container = styled.div`
  width: min(1500px, calc(100% - 100px));
  margin: auto;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
  }
`;

/* =====================================================
   INTRODUCTION
===================================================== */

const Intro = styled.header`
  padding: 105px 0 65px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  animation: ${fadeUp} .8s ease both;

  @media (max-width: 700px) {
    padding: 65px 0 38px;
    display: block;
  }
`;

const IntroContent = styled.div`
  max-width: 850px;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 25px;

  span {
    color: var(--accent);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: var(--accent);
  }
`;

const Title = styled.h1`
  margin: 0;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(65px, 10vw, 135px);
  line-height: .85;
  letter-spacing: -7px;

  span {
    color: var(--accent);
    font-style: italic;
    font-weight: 400;
  }

  @media (max-width: 600px) {
    font-size: 72px;
    letter-spacing: -4px;
  }
`;

const IntroText = styled.p`
  max-width: 480px;
  color: var(--muted);
  font-size: 12px;
  line-height: 2;
  margin: 30px 0 0;
  letter-spacing: .2px;
`;

const IntroCount = styled.div`
  text-align: right;
  padding-bottom: 8px;

  strong {
    display: block;
    font-family: Georgia, serif;
    font-size: 52px;
    font-weight: 400;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 10px;
    color: var(--muted);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

/* =====================================================
   TOOLBAR
===================================================== */

const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 17px 0;
  margin-bottom: 30px;
  background: rgba(247, 245, 240, .94);
  backdrop-filter: blur(15px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  overflow-x: auto;
  scrollbar-width: none;
  min-width: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    gap: 24px;
  }
`;

const FilterButton = styled.button`
  flex-shrink: 0;
  position: relative;
  border: 0;
  background: transparent;
  color: ${({ $active }) => $active ? "var(--ink)" : "var(--muted)"};
  padding: 8px 0;
  cursor: pointer;
  font-size: 10px;
  font-weight: ${({ $active }) => $active ? "800" : "500"};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: color .25s;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: ${({ $active }) => $active ? "100%" : "0"};
    height: 1px;
    background: var(--accent);
    transition: width .3s;
  }

  &:hover {
    color: var(--ink);
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;

  @media (max-width: 700px) {
    justify-content: space-between;
  }
`;

const Count = styled.span`
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const SortWrapper = styled.div`
  position: relative;
`;

const SortSelect = styled.select`
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--ink);
  padding: 8px 25px 8px 0;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;

  option {
    background: var(--paper);
    color: var(--ink);
  }
`;

const SortIcon = styled(FiChevronDown)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 13px;
`;

/* =====================================================
   PRODUCT GRID
===================================================== */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 55px 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px 16px;
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px 11px;
  }
`;

/* =====================================================
   PRODUCT CARD
===================================================== */

const ProductCard = styled.article`
  min-width: 0;
  cursor: pointer;
  animation: ${fadeUp} .7s ease both;

  &:hover .product-image {
    transform: scale(1.055);
  }

  &:hover .product-arrow {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #ebe8e1;
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
  flex: 0 0 100%;
  min-width: 100%;
  scroll-snap-align: start;
`;

const ProductImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: .76;
  object-fit: cover;
  transition: transform .8s cubic-bezier(.2,.7,.2,1);
  animation: ${reveal} .7s ease both;

  @media (max-width: 600px) {
    aspect-ratio: .70;
  }
`;

const Badge = styled.span`
  position: absolute;
  z-index: 3;
  top: 15px;
  left: 15px;
  padding: 7px 10px;
  background: rgba(247,245,240,.94);
  color: var(--ink);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  @media (max-width: 600px) {
    top: 8px;
    left: 8px;
    font-size: 7px;
    padding: 6px 7px;
  }
`;

const ProductArrow = styled.div`
  position: absolute;
  z-index: 4;
  right: 15px;
  bottom: 15px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--paper);
  color: var(--ink);
  opacity: 0;
  transform: translateY(8px);
  transition: .3s;

  @media (max-width: 700px) {
    display: none;
  }
`;

const ProductDots = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 3;
`;

const ProductDot = styled.span`
  width: ${({ $active }) => $active ? "19px" : "5px"};
  height: 3px;
  background: ${({ $active }) =>
    $active ? "#fff" : "rgba(255,255,255,.55)"};
  transition: .3s;
`;

const ProductInfo = styled.div`
  padding: 16px 2px 0;

  @media (max-width: 600px) {
    padding-top: 12px;
  }
`;

const ProductGenre = styled.div`
  color: var(--accent);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const ProductTitle = styled.h3`
  color: var(--ink);
  margin: 0 0 12px;
  font-family: Georgia, serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.35;
  min-height: 44px;

  @media (max-width: 600px) {
    font-size: 14px;
    min-height: 37px;
    margin-bottom: 8px;
  }
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
`;

const ProductPrice = styled.span`
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .5px;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const Discover = styled.span`
  color: var(--muted);
  font-size: 8px;
  letter-spacing: 1.3px;
  text-transform: uppercase;

  @media (max-width: 600px) {
    display: none;
  }
`;

/* =====================================================
   EDITORIAL BANNER
===================================================== */

const Banner = styled.section`
  grid-column: 1 / -1;
  position: relative;
  width: 100%;
  height: 570px;
  overflow: hidden;
  margin: 20px 0 15px;
  background: #28241e;

  @media (max-width: 800px) {
    height: 430px;
  }

  @media (max-width: 600px) {
    height: 400px;
    margin: 5px 0;
  }
`;

const BannerTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BannerSlide = styled.div`
  position: relative;
  flex: 0 0 100%;
  min-width: 100%;
  height: 100%;
  scroll-snap-align: start;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`;

const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,.72),
    rgba(0,0,0,.24) 65%,
    rgba(0,0,0,.05)
  );
`;

const BannerContent = styled.div`
  position: absolute;
  z-index: 2;
  left: 7%;
  bottom: 75px;
  max-width: 600px;
  color: white;

  @media (max-width: 600px) {
    left: 22px;
    right: 22px;
    bottom: 55px;
  }
`;

const BannerEyebrow = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #d2b38e;
  margin-bottom: 20px;
`;

const BannerTitle = styled.h2`
  font-family: Georgia, serif;
  font-size: clamp(45px, 7vw, 88px);
  line-height: .95;
  font-weight: 400;
  letter-spacing: -3px;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 49px;
  }
`;

const BannerDescription = styled.p`
  max-width: 400px;
  font-size: 12px;
  line-height: 2;
  color: rgba(255,255,255,.75);
  margin: 22px 0 0;
`;

const BannerDots = styled.div`
  position: absolute;
  right: 35px;
  bottom: 30px;
  z-index: 4;
  display: flex;
  gap: 7px;
`;

const BannerDot = styled.button`
  width: ${({ $active }) => $active ? "30px" : "7px"};
  height: 3px;
  padding: 0;
  border: none;
  background: ${({ $active }) =>
    $active ? "#fff" : "rgba(255,255,255,.4)"};
  cursor: pointer;
  transition: .3s;
`;

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = styled.div`
  padding: 110px 20px;
  text-align: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  h2 {
    font-family: Georgia, serif;
    font-size: 36px;
    font-weight: 400;
  }

  p {
    color: var(--muted);
    font-size: 12px;
  }
`;

/* =====================================================
   LOADING
===================================================== */

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media(max-width: 750px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Skeleton = styled.div`
  aspect-ratio: .76;
  background: linear-gradient(
    90deg,
    #e9e5dd,
    #f5f2ec,
    #e9e5dd
  );
  background-size: 500px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

/* =====================================================
   MAIN COMPONENT
===================================================== */

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

  const API_URL = import.meta.env.VITE_API_URL || "";

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  /* FETCH */

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/api/produits`);

        if (!res.ok) throw new Error("Erreur chargement produits");

        const data = await res.json();

        const validProducts = Array.isArray(data)
          ? data.filter(
              (p) =>
                p.images?.length &&
                !(p.precommande === true && p.disponible === false)
            )
          : [];

        if (!mounted) return;

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
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* BANNER DATA */

  const bannerImages = useMemo(() => {
    const source = products.find((p) => p.images?.length);
    return source?.images || [];
  }, [products]);

  /* BANNER AUTOPLAY */

  useEffect(() => {
    if (!bannerRef.current || bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % bannerImages.length;

        bannerRef.current?.scrollTo({
          left: next * bannerRef.current.clientWidth,
          behavior: "smooth",
        });

        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  /* PRODUCT CAROUSEL */

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

  /* GENRES */

  const genres = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.genre).filter(Boolean))
    ];

    return ["Tous", ...unique];
  }, [products]);

  /* FILTER AND SORT */

  const filteredProducts = useMemo(() => {
    let result = genreFilter === "Tous"
      ? [...products]
      : products.filter((p) => p.genre === genreFilter);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "title-asc":
        result.sort((a, b) =>
          String(a.title || "").localeCompare(String(b.title || ""))
        );
        break;

      case "title-desc":
        result.sort((a, b) =>
          String(b.title || "").localeCompare(String(a.title || ""))
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, genreFilter, sortBy]);

  /* BADGES */

  const getBadgeText = (index, product) => {
    if (product.bestSeller) return "Best seller";
    if (index < 2) return "Nouveauté";
    if (Number(product.price) >= 25000) return "Sélection NUMA";
    return "Collection";
  };

  /* LOADING */

  if (loading) {
    return (
      <Page>
        <Container>
          <Intro>
            <IntroContent>
              <Eyebrow><span>Maison NUMA</span></Eyebrow>
              <Title>Collection<span>.</span></Title>
            </IntroContent>
          </Intro>

          <SkeletonGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </SkeletonGrid>
        </Container>
      </Page>
    );
  }

  /* RENDER */

  return (
    <Page>
      <Container>

        {/* INTRO */}

        <Intro>
          <IntroContent>
            <Eyebrow>
              <span>Maison NUMA — L'art du style</span>
            </Eyebrow>

            <Title>
              Collection<span>.</span>
            </Title>

            <IntroText>
              Des pièces soigneusement sélectionnées, pensées pour
              révéler votre personnalité et donner à chaque silhouette
              une signature unique.
            </IntroText>
          </IntroContent>

          <IntroCount>
            <strong>{filteredProducts.length}</strong>
            <span>Pièces disponibles</span>
          </IntroCount>
        </Intro>

        {/* FILTERS */}

        <Toolbar>
          <Filters>
            {genres.map((genre) => (
              <FilterButton
                key={genre}
                $active={genreFilter === genre}
                onClick={() => setGenreFilter(genre)}
              >
                {genre}
              </FilterButton>
            ))}
          </Filters>

          <ToolbarRight>
            <Count>
              {filteredProducts.length} articles
            </Count>

            <SortWrapper>
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="title-asc">Nom A — Z</option>
                <option value="title-desc">Nom Z — A</option>
              </SortSelect>

              <SortIcon />
            </SortWrapper>
          </ToolbarRight>
        </Toolbar>

        {/* PRODUCTS */}

        {filteredProducts.length === 0 ? (
          <EmptyState>
            <h2>Aucune pièce disponible.</h2>
            <p>Essayez une autre catégorie pour découvrir notre collection.</p>
          </EmptyState>
        ) : (
          <Grid>
            {filteredProducts.map((product, index) => (
              <Fragment key={product._id}>

                {/* EDITORIAL BANNER */}

                {index === 2 && bannerImages.length > 0 && (
                  <Banner>
                    <BannerTrack ref={bannerRef}>
                      {bannerImages.map((image, i) => (
                        <BannerSlide key={i}>
                          <BannerImage
                            src={getImageUrl(image.url)}
                            alt={`Campagne NUMA ${i + 1}`}
                          />

                          <BannerOverlay />

                          <BannerContent>
                            <BannerEyebrow>
                              L'expression du style
                            </BannerEyebrow>

                            <BannerTitle>
                              Dress to<br />
                              impress.
                            </BannerTitle>

                            <BannerDescription>
                              Une vision contemporaine de l'élégance.
                              Des pièces qui parlent avant même
                              que vous ne le fassiez.
                            </BannerDescription>
                          </BannerContent>
                        </BannerSlide>
                      ))}
                    </BannerTrack>

                    <BannerDots>
                      {bannerImages.map((_, i) => (
                        <BannerDot
                          key={i}
                          $active={activeSlide === i}
                          onClick={() => {
                            setActiveSlide(i);

                            bannerRef.current?.scrollTo({
                              left: i * bannerRef.current.clientWidth,
                              behavior: "smooth",
                            });
                          }}
                        />
                      ))}
                    </BannerDots>
                  </Banner>
                )}

                {/* PRODUCT */}

                <ProductCard
                  onClick={() =>
                    navigate(`/produit/${product._id}`)
                  }
                >
                  <ImageArea>
                    <Badge>
                      {getBadgeText(index, product)}
                    </Badge>

                    <ProductArrow className="product-arrow">
                      <FiArrowUpRight size={19} />
                    </ProductArrow>

                    <ProductCarousel
                      ref={(element) => {
                        carouselRefs.current[product._id] = element;
                      }}
                      onScroll={() =>
                        handleProductScroll(product._id)
                      }
                    >
                      {product.images?.map((image, imageIndex) => (
                        <ProductSlide key={imageIndex}>
                          <ProductImage
                            className="product-image"
                            src={getImageUrl(image.url)}
                            alt={product.title}
                            loading="lazy"
                          />
                        </ProductSlide>
                      ))}
                    </ProductCarousel>

                    {product.images?.length > 1 && (
                      <ProductDots>
                        {product.images.map((_, imageIndex) => (
                          <ProductDot
                            key={imageIndex}
                            $active={
                              imageIndexes[product._id] === imageIndex
                            }
                          />
                        ))}
                      </ProductDots>
                    )}
                  </ImageArea>

                  <ProductInfo>
                    <ProductGenre>
                      {product.genre || "Collection NUMA"}
                    </ProductGenre>

                    <ProductTitle>
                      {product.title}
                    </ProductTitle>

                    <ProductBottom>
                      <ProductPrice>
                        {Number(product.price || 0).toLocaleString("fr-FR")} FCFA
                      </ProductPrice>

                      <Discover>
                        Découvrir <FiArrowUpRight />
                      </Discover>
                    </ProductBottom>
                  </ProductInfo>
                </ProductCard>

              </Fragment>
            ))}
          </Grid>
        )}

      </Container>
    </Page>
  );
}
