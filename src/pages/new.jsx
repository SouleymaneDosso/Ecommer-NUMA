
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment,
} from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiChevronDown, FiArrowUpRight } from "react-icons/fi";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

/* =====================================================
   ANIMATIONS
===================================================== */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
`;

const reveal = keyframes`
  from { opacity: 0; transform: scale(1.04); }
  to { opacity: 1; transform: scale(1); }
`;

/* =====================================================
   PAGE
===================================================== */

const PageWrapper = styled.main`
  --paper: #f4f1eb;
  --ink: #211f1b;
  --muted: #817b72;
  --accent: #947858;
  --line: #ded9cf;

  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding-bottom: 100px;
  overflow: hidden;
`;

const Container = styled.div`
  width: min(1500px, 91%);
  margin: auto;

  @media (max-width: 600px) {
    width: 92%;
  }
`;

/* =====================================================
   INTRODUCTION
===================================================== */

const Intro = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  padding: 100px 0 65px;
  animation: ${fadeUp} .8s ease both;

  @media (max-width: 700px) {
    padding: 65px 0 40px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const IntroContent = styled.div`
  max-width: 850px;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: currentColor;
  }
`;

const Title = styled.h1`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(65px, 10vw, 135px);
  letter-spacing: -8px;
  line-height: .86;
  margin: 25px 0;

  span {
    color: var(--accent);
    font-style: italic;
  }

  @media (max-width: 700px) {
    font-size: clamp(65px, 17vw, 95px);
    letter-spacing: -4px;
    margin: 20px 0;
  }
`;

const IntroDescription = styled.p`
  color: var(--muted);
  font-size: 13px;
  line-height: 2;
  max-width: 470px;
  margin: 0;
`;

const IntroCount = styled.div`
  text-align: right;
  padding-bottom: 5px;

  strong {
    display: block;
    font-family: Georgia, serif;
    font-size: 65px;
    font-weight: 400;
    line-height: 1;
  }

  span {
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
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 0;
  margin-bottom: 35px;
  background: rgba(244, 241, 235, .94);
  backdrop-filter: blur(15px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  @media (max-width: 750px) {
    flex-direction: column;
    align-items: stretch;
    gap: 13px;
  }
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 17px;
  border: 1px solid ${({ $active }) => $active ? "#211f1b" : "var(--line)"};
  background: ${({ $active }) => $active ? "#211f1b" : "transparent"};
  color: ${({ $active }) => $active ? "#fff" : "var(--ink)"};
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: .3s;

  &:hover {
    background: #211f1b;
    color: white;
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 750px) {
    width: 100%;
  }
`;

const Count = styled.span`
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 1px;
  white-space: nowrap;

  @media (max-width: 500px) {
    display: none;
  }
`;

const SortWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 220px;

  @media (max-width: 750px) {
    max-width: none;
  }
`;

const SortSelect = styled.select`
  width: 100%;
  appearance: none;
  padding: 12px 40px 12px 14px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  outline: none;
`;

const SortIcon = styled(FiChevronDown)`
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

/* =====================================================
   GRID
===================================================== */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 35px 18px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px 11px;
  }
`;

/* =====================================================
   PRODUCT CARD
===================================================== */

const ProductCard = styled.article`
  min-width: 0;
  cursor: pointer;
  animation: ${fadeUp} .65s ease both;
  transition: transform .4s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #e8e4dc;
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
  width: 100%;
  scroll-snap-align: start;
`;

const ProductImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: .76;
  object-fit: cover;
  object-position: center;
  animation: ${reveal} .6s ease both;
  transition: transform .8s ease;

  ${ProductCard}:hover & {
    transform: scale(1.045);
  }

  @media (max-width: 600px) {
    aspect-ratio: .72;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 13px;
  left: 13px;
  z-index: 3;
  padding: 8px 11px;
  background: #211f1b;
  color: white;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  @media (max-width: 600px) {
    top: 8px;
    left: 8px;
    padding: 6px 8px;
    font-size: 7px;
  }
`;

const ProductArrow = styled.div`
  position: absolute;
  z-index: 4;
  right: 13px;
  bottom: 13px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: white;
  color: #211f1b;
  opacity: 0;
  transform: translateY(6px);
  transition: .3s;

  ${ProductCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const ProductDots = styled.div`
  position: absolute;
  bottom: 13px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
  z-index: 3;
`;

const ProductDot = styled.span`
  width: ${({ $active }) => $active ? "20px" : "6px"};
  height: 3px;
  background: ${({ $active }) => $active ? "#fff" : "rgba(255,255,255,.6)"};
  transition: .3s;
`;

const ProductInfo = styled.div`
  padding: 16px 2px 8px;

  @media (max-width: 600px) {
    padding-top: 11px;
  }
`;

const ProductGenre = styled.span`
  color: var(--accent);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const ProductTitle = styled.h3`
  margin: 8px 0;
  color: var(--ink);
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3;

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const ProductBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

const ProductPrice = styled.span`
  color: var(--ink);
  font-size: 12px;
  font-weight: 800;
`;

const ProductDiscover = styled.span`
  color: var(--muted);
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 500px) {
    display: none;
  }
`;

/* =====================================================
   BANNER
===================================================== */

const BannerCard = styled.section`
  grid-column: 1 / -1;
  position: relative;
  height: 590px;
  overflow: hidden;
  background: #211f1b;

  @media (max-width: 900px) {
    height: 440px;
  }

  @media (max-width: 600px) {
    height: 390px;
  }
`;

const BannerWrapper = styled.div`
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  scroll-snap-align: start;
`;

const BannerImage = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,.75),
    rgba(0,0,0,.25) 60%,
    rgba(0,0,0,.08)
  );
`;

const BannerText = styled.div`
  position: absolute;
  left: 65px;
  bottom: 65px;
  z-index: 2;
  color: white;
  max-width: 550px;

  @media (max-width: 700px) {
    left: 22px;
    right: 22px;
    bottom: 40px;
  }
`;

const BannerLabel = styled.div`
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 18px;
`;

const BannerTitle = styled.h2`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(45px, 7vw, 90px);
  letter-spacing: -4px;
  line-height: .95;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 48px;
    letter-spacing: -2px;
  }
`;

const BannerDescription = styled.p`
  max-width: 400px;
  margin-top: 18px;
  color: rgba(255,255,255,.8);
  font-size: 12px;
  line-height: 1.9;
`;

const Dots = styled.div`
  position: absolute;
  right: 25px;
  bottom: 25px;
  z-index: 4;
  display: flex;
  gap: 7px;
`;

const Dot = styled.button`
  width: ${({ $active }) => $active ? "30px" : "8px"};
  height: 3px;
  padding: 0;
  border: none;
  background: ${({ $active }) => $active ? "#fff" : "rgba(255,255,255,.4)"};
  cursor: pointer;
  transition: .3s;
`;

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = styled.div`
  padding: 100px 20px;
  text-align: center;
  border-top: 1px solid var(--line);

  h3 {
    font-family: Georgia, serif;
    font-size: 32px;
    font-weight: 400;
  }

  p {
    color: var(--muted);
    font-size: 13px;
  }
`;

/* =====================================================
   COMPONENT
===================================================== */

export default function Nouveautes() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [genreFilter, setGenreFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");
  const [activeSlide, setActiveSlide] = useState(0);

  const bannerRef = useRef(null);
  const carouselRefs = useRef({});

  /* FETCH */

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/produits`
        );

        if (!res.ok) throw new Error("Impossible de charger les produits");

        const data = await res.json();

        const newProducts = Array.isArray(data)
          ? data.filter(
              (p) =>
                p.badge === "new" &&
                !(p.precommande === true && p.disponible === false) &&
                p.images?.length
            )
          : [];

        if (!mounted) return;

        setProducts(newProducts);

        const indexes = {};
        newProducts.forEach((p) => {
          const mainIndex = p.images.findIndex((img) => img.isMain);
          indexes[p._id] = mainIndex >= 0 ? mainIndex : 0;
        });

        setImageIndexes(indexes);
      } catch (err) {
        console.error("Erreur chargement nouveautés :", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* GENRES */

  const genres = useMemo(
    () => [
      "Tous",
      ...new Set(products.map((p) => p.genre).filter(Boolean)),
    ],
    [products]
  );

  /* FILTRE ET TRI */

  const filteredProducts = useMemo(() => {
    let result =
      genreFilter === "Tous"
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

  /* BANNIÈRE */

  const bannerImages = useMemo(() => {
    const source = products.find((p) => p.images?.length);
    return source?.images || [];
  }, [products]);

  useEffect(() => {
    if (!bannerRef.current || bannerImages.length <= 1) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % bannerImages.length;

        bannerRef.current?.scrollTo({
          left: next * bannerRef.current.clientWidth,
          behavior: "smooth",
        });

        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  /* CARROUSEL PRODUITS */

  const handleProductScroll = useCallback((id) => {
    const el = carouselRefs.current[id];
    if (!el) return;

    const index = Math.round(el.scrollLeft / el.clientWidth);

    setImageIndexes((prev) => ({
      ...prev,
      [id]: index,
    }));
  }, []);

  /* LOADING */

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  /* RENDER */

  return (
    <PageWrapper>
      <Container>
        {/* INTRODUCTION */}

        <Intro>
          <IntroContent>
            <Eyebrow>MAISON NUMA — NOUVELLE SAISON</Eyebrow>

            <Title>
              Les <span>nouveautés.</span>
            </Title>

            <IntroDescription>
              Découvrez nos dernières créations. Des pièces sélectionnées
              avec exigence pour une allure contemporaine, affirmée et
              intemporelle.
            </IntroDescription>
          </IntroContent>

          <IntroCount>
            <strong>{filteredProducts.length}</strong>
            <span>Pièces disponibles</span>
          </IntroCount>
        </Intro>

        {/* FILTRES */}

        <Toolbar>
          <Filters>
            {genres.map((genre) => (
              <FilterButton
                key={genre}
                $active={genreFilter === genre}
                onClick={() => setGenreFilter(genre)}
              >
                {genre === "Tous" && <FiFilter size={12} />}
                {genre}
              </FilterButton>
            ))}
          </Filters>

          <ToolbarRight>
            <Count>{filteredProducts.length} PIÈCES</Count>

            <SortWrapper>
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="title-asc">Nom A → Z</option>
                <option value="title-desc">Nom Z → A</option>
              </SortSelect>

              <SortIcon size={14} />
            </SortWrapper>
          </ToolbarRight>
        </Toolbar>

        {/* PRODUITS */}

        {filteredProducts.length === 0 ? (
          <EmptyState>
            <h3>Aucune nouveauté pour le moment.</h3>
            <p>Nos prochaines créations arrivent bientôt.</p>
          </EmptyState>
        ) : (
          <Grid>
            {filteredProducts.map((product, index) => (
              <Fragment key={product._id}>
                {/* BANNIÈRE ÉDITORIALE */}

                {index === 2 && bannerImages.length > 0 && (
                  <BannerCard>
                    <BannerWrapper ref={bannerRef}>
                      {bannerImages.map((image, i) => (
                        <BannerSlide key={i}>
                          <BannerImage
                            src={image.url}
                            alt={`Nouvelle collection NUMA ${i + 1}`}
                            loading="lazy"
                          />

                          <BannerOverlay />

                          <BannerText>
                            <BannerLabel>COLLECTION EXCLUSIVE</BannerLabel>

                            <BannerTitle>
                              A new
                              <br />
                              perspective.
                            </BannerTitle>

                            <BannerDescription>
                              Des créations pensées pour révéler votre
                              personnalité et redéfinir votre élégance.
                            </BannerDescription>
                          </BannerText>
                        </BannerSlide>
                      ))}
                    </BannerWrapper>

                    {bannerImages.length > 1 && (
                      <Dots>
                        {bannerImages.map((_, i) => (
                          <Dot
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
                      </Dots>
                    )}
                  </BannerCard>
                )}

                {/* CARTE PRODUIT */}

                <ProductCard
                  onClick={() => navigate(`/produit/${product._id}`)}
                >
                  <ImageArea>
                    <Badge>NOUVEAU</Badge>

                    <ProductArrow>
                      <FiArrowUpRight size={18} />
                    </ProductArrow>

                    <ProductCarousel
                      ref={(el) => {
                        carouselRefs.current[product._id] = el;
                      }}
                      onScroll={() => handleProductScroll(product._id)}
                    >
                      {product.images.map((image, imageIndex) => (
                        <ProductSlide key={imageIndex}>
                          <ProductImage
                            src={image.url}
                            alt={product.title}
                            loading="lazy"
                          />
                        </ProductSlide>
                      ))}
                    </ProductCarousel>

                    {product.images.length > 1 && (
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
                      {product.genre || "COLLECTION NUMA"}
                    </ProductGenre>

                    <ProductTitle>{product.title}</ProductTitle>

                    <ProductBottom>
                      <ProductPrice>
                        {Number(product.price || 0).toLocaleString("fr-FR")} FCFA
                      </ProductPrice>

                      <ProductDiscover>Découvrir ↗</ProductDiscover>
                    </ProductBottom>
                  </ProductInfo>
                </ProductCard>
              </Fragment>
            ))}
          </Grid>
        )}
      </Container>
    </PageWrapper>
  );
}
