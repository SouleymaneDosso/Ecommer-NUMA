import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Fragment,
} from "react";
import styled from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiChevronDown, FiArrowUpRight } from "react-icons/fi";

// ==============================
// STYLES
// ==============================

const PageWrapper = styled.main`
  min-height: 100vh;
  background: #f8f7f4;
  padding: 4rem 5vw 6rem;

  @media (max-width: 768px) {
    padding: 2.5rem 1rem 4rem;
  }
`;

const PageContainer = styled.div`
  max-width: 1500px;
  margin: 0 auto;
`;

const PageIntro = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;
`;

const Eyebrow = styled.span`
  display: inline-block;
  color: #a58a58;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const CollectionTitle = styled.h1`
  color: #24231f;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 400;
  letter-spacing: -1.8px;
  line-height: 1.1;
  margin: 0 0 1rem;
`;

const CollectionSub = styled.p`
  color: #858078;
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0;
`;

const IntroLine = styled.div`
  width: 45px;
  height: 1px;
  background: #b69a66;
  margin: 1.7rem auto 0;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem 0;
  margin-bottom: 1.5rem;
  border-top: 1px solid #e9e6df;
  border-bottom: 1px solid #e9e6df;

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #817c73;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  white-space: nowrap;
  margin-right: 0.6rem;

  @media (max-width: 700px) {
    display: none;
  }
`;

const FilterButton = styled.button`
  flex-shrink: 0;
  border: 1px solid ${({ active }) => (active ? "#292720" : "#e6e2da")};
  background: ${({ active }) => (active ? "#292720" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#777168")};
  padding: 0.65rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: #292720;
    color: ${({ active }) => (active ? "#fff" : "#292720")};
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2rem;
  flex-shrink: 0;
`;

const CountBadge = styled.span`
  color: #8a857c;
  font-size: 0.78rem;
  white-space: nowrap;

  strong {
    color: #292720;
    font-weight: 700;
  }
`;

const SortWrapper = styled.div`
  position: relative;
`;

const SortSelect = styled.select`
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  color: #292720;
  padding: 0.6rem 2rem 0.6rem 0.5rem;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
`;

const SortIcon = styled(FiChevronDown)`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a857c;
  pointer-events: none;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2.2rem 1.2rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.6rem 0.75rem;
  }

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.article`
  min-width: 0;
  cursor: pointer;
  background: transparent;
  animation: appear 0.5s ease both;

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover img {
    transform: scale(1.045);
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #eeece7;
`;

const ProductCarousel = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
`;

const ProductImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.65s cubic-bezier(0.2, 0.65, 0.3, 1);
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 13px;
  left: 13px;
  z-index: 2;
  background: rgba(248, 247, 244, 0.94);
  color: #76613e;
  padding: 0.5rem 0.7rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1.1px;
  text-transform: uppercase;
`;

const ProductDots = styled.div`
  position: absolute;
  left: 50%;
  bottom: 13px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 20px;
  background: rgba(30, 29, 26, 0.28);
  backdrop-filter: blur(5px);
`;

const ProductDot = styled.span`
  display: block;
  width: ${({ active }) => (active ? "17px" : "5px")};
  height: 5px;
  border-radius: 10px;
  background: ${({ active }) => (active ? "#fff" : "rgba(255,255,255,0.55)")};
  transition: all 0.25s ease;
`;

const ProductInfo = styled.div`
  padding: 1rem 0.1rem 0;
`;

const ProductTitle = styled.h3`
  color: #302e29;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.45;
  margin: 0 0 0.55rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const ProductBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const ProductPrice = styled.span`
  color: #292720;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.2px;
`;

const ProductArrow = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border: 1px solid #e5e1d9;
  border-radius: 50%;
  color: #76613e;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s ease;

  ${ProductCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  padding: 5rem 1.5rem;
  text-align: center;
  border: 1px solid #e9e6df;
  background: #fff;
`;

const EmptyTitle = styled.h2`
  color: #302e29;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.6rem;
  font-weight: 400;
  margin: 0 0 0.7rem;
`;

const EmptyText = styled.p`
  color: #858078;
  font-size: 0.88rem;
  margin: 0;
`;

// ==============================
// COMPONENT
// ==============================

export default function PromoLuxury() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [genreFilter, setGenreFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");

  const carouselRefs = useRef({});

  // Récupération des promotions
  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

        if (!res.ok) {
          throw new Error("Impossible de récupérer les promotions.");
        }

        const data = await res.json();

        const promos = (Array.isArray(data) ? data : []).filter(
          (p) =>
            p.badge === "promo" &&
            !(p.precommande === true && p.disponible === false) &&
            Array.isArray(p.images) &&
            p.images.some((img) => img?.url),
        );

        if (!mounted) return;

        setProducts(promos);

        const indexes = {};
        promos.forEach((p) => {
          indexes[p._id] = 0;
        });

        setImageIndexes(indexes);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // Catégories disponibles
  const genres = useMemo(
    () => ["Tous", ...new Set(products.map((p) => p.genre).filter(Boolean))],
    [products],
  );

  // Filtrage et tri
  const filteredProducts = useMemo(() => {
    let result =
      genreFilter === "Tous"
        ? [...products]
        : products.filter((p) => p.genre === genreFilter);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;

      case "price-desc":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      case "title-asc":
        result.sort((a, b) =>
          String(a.title || "").localeCompare(String(b.title || ""), "fr"),
        );
        break;

      case "title-desc":
        result.sort((a, b) =>
          String(b.title || "").localeCompare(String(a.title || ""), "fr"),
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, genreFilter, sortBy]);

  // Gestion du carrousel d'images
  const handleProductScroll = useCallback((id) => {
    const el = carouselRefs.current[id];

    if (!el || !el.clientWidth) return;

    const index = Math.round(el.scrollLeft / el.clientWidth);

    setImageIndexes((prev) => {
      if (prev[id] === index) return prev;
      return { ...prev, [id]: index };
    });
  }, []);

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageContainer>
        <PageIntro>
          <Eyebrow>Offres exclusives</Eyebrow>
          <CollectionTitle>Promotions</CollectionTitle>
          <CollectionSub>
            Découvrez nos pièces sélectionnées à prix privilégiés.
          </CollectionSub>
          <IntroLine />
        </PageIntro>

        <Toolbar>
          <Sidebar>
            <FilterLabel>
              <FiFilter size={13} />
              Catégories
            </FilterLabel>

            {genres.map((genre) => (
              <FilterButton
                key={genre}
                type="button"
                active={genreFilter === genre}
                onClick={() => setGenreFilter(genre)}
              >
                {genre}
              </FilterButton>
            ))}
          </Sidebar>

          <ToolbarRight>
            <CountBadge>
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length > 1 ? "articles" : "article"}
            </CountBadge>

            <SortWrapper>
              <SortSelect
                aria-label="Trier les promotions"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="title-asc">Nom A → Z</option>
                <option value="title-desc">Nom Z → A</option>
              </SortSelect>
              <SortIcon />
            </SortWrapper>
          </ToolbarRight>
        </Toolbar>

        {filteredProducts.length === 0 ? (
          <EmptyState>
            <EmptyTitle>Aucune promotion disponible</EmptyTitle>
            <EmptyText>
              Aucune offre ne correspond à cette catégorie pour le moment.
            </EmptyText>
          </EmptyState>
        ) : (
          <Grid>
            {filteredProducts.map((p, index) => {
              const images = p.images.filter((img) => img?.url);

              return (
                <Fragment key={p._id}>
                  <ProductCard
                    style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Voir ${p.title || "ce produit"}`}
                    onClick={() => navigate(`/produit/${p._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/produit/${p._id}`);
                      }
                    }}
                  >
                    <ImageArea>
                      <ProductCarousel
                        ref={(el) => {
                          carouselRefs.current[p._id] = el;
                        }}
                        onScroll={() => handleProductScroll(p._id)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {images.map((img, idx) => (
                          <ProductSlide key={img._id || img.url || idx}>
                            <ProductImage
                              src={img.url}
                              alt={p.title || "Produit en promotion"}
                              loading="lazy"
                            />
                          </ProductSlide>
                        ))}
                      </ProductCarousel>

                      <ProductBadge>
                        {p.precommande ? "Précommande" : "Offre spéciale"}
                      </ProductBadge>

                      {images.length > 1 && (
                        <ProductDots>
                          {images.map((_, idx) => (
                            <ProductDot
                              key={idx}
                              active={(imageIndexes[p._id] || 0) === idx}
                            />
                          ))}
                        </ProductDots>
                      )}
                    </ImageArea>

                    <ProductInfo>
                      <ProductTitle>{p.title}</ProductTitle>

                      <ProductBottom>
                        <ProductPrice>
                          {Number(p.price || 0).toLocaleString("fr-FR")} FCFA
                        </ProductPrice>

                        <ProductArrow>
                          <FiArrowUpRight size={15} />
                        </ProductArrow>
                      </ProductBottom>
                    </ProductInfo>
                  </ProductCard>
                </Fragment>
              );
            })}
          </Grid>
        )}
      </PageContainer>
    </PageWrapper>
  );
}
