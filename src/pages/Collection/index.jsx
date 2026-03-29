// src/pages/Collection.jsx
import { useState, useEffect, Fragment, useRef, useMemo } from "react";
import styled from "styled-components";
import { FiFilter, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";

// ==============================
// STYLES
// ==============================

const PageWrapper = styled.main`
  max-width: 1500px;
  margin: auto;
  padding: 2rem 1.2rem 4rem;
  display: flex;
  gap: 2.5rem;
  background: #f7f5f1;
  min-height: 100vh;

  @media (max-width: 950px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1.2rem;
  }
`;

const Sidebar = styled.aside`
  width: 240px;
  background: white;
  padding: 1.2rem;
  border: 1px solid #ececec;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  height: fit-content;

  @media (max-width: 950px) {
    width: 100%;
    display: flex;
    overflow-x: auto;
    gap: 0.8rem;
    padding: 0.8rem;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: #777;
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 950px) {
    display: none;
  }
`;

const FilterButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 12px 14px;
  border: 1px solid ${({ active }) => (active ? "#111" : "#e7e7e7")};
  background: ${({ active }) => (active ? "#111" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#111")};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    background: ${({ active }) => (active ? "#111" : "#f5f5f5")};
  }

  @media (max-width: 950px) {
    width: auto;
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

const Content = styled.section`
  flex: 1;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 1.8rem;
  gap: 1rem;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: start;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CollectionTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0;
  color: #111;
  letter-spacing: -1px;

  @media (max-width: 700px) {
    font-size: 1.8rem;
  }
`;

const CollectionSub = styled.span`
  color: #6f6f6f;
  font-size: 0.95rem;
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const CountBadge = styled.div`
  background: white;
  padding: 11px 16px;
  border: 1px solid #ececec;
  font-weight: 800;
  font-size: 0.95rem;
`;

const SortWrapper = styled.div`
  position: relative;
`;

const SortSelect = styled.select`
  appearance: none;
  border: 1px solid #e4e4e4;
  background: white;
  padding: 11px 42px 11px 14px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  min-width: 220px;
  color: #111;

  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const SortIcon = styled(FiChevronDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1250px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 520px) {
    gap: 1rem;
  }
`;

// ==============================
// BANNER
// ==============================

const BannerCard = styled.section`
  grid-column: 1 / -1;
  overflow: hidden;
  background: white;
  border: 1px solid #ececec;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
  margin: 0.2rem 0 0.7rem;
`;

const BannerWrapper = styled.div`
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
  position: relative;
  scroll-snap-align: center;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;

  @media (max-width: 850px) {
    height: 340px;
  }
`;

const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.18),
    transparent
  );
`;

const BannerText = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: white;
  max-width: 470px;
  z-index: 2;

  @media (max-width: 850px) {
    left: 20px;
    bottom: 22px;
    max-width: 280px;
  }
`;

const BannerLabel = styled.div`
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;
  margin-bottom: 10px;
  font-weight: 700;
`;

const BannerTitle = styled.h2`
  font-size: 2.5rem;
  line-height: 1.02;
  margin: 0 0 10px;
  font-weight: 900;

  @media (max-width: 850px) {
    font-size: 1.65rem;
  }
`;

const BannerDesc = styled.p`
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 14px 0 16px;
`;

const Dot = styled.div`
  width: 30px;
  height: 4px;
  background: #ddd;
  overflow: hidden;
`;

const DotFill = styled.div`
  height: 100%;
  width: ${({ active }) => (active ? "100%" : "0%")};
  background: #111;
  transition: width 0.3s ease;
`;

// ==============================
// PRODUCT
// ==============================

const ProductCard = styled.article`
  cursor: pointer;
  overflow: hidden;
  background: white;
  border: 1px solid #ececec;
  transition: all 0.28s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.035);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 38px rgba(0, 0, 0, 0.08);
  }
`;

const ImageArea = styled.div`
  position: relative;
  overflow: hidden;
  background: #f1f1f1;
`;

const ProductCarousel = styled.div`
  display: flex;
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
  scroll-snap-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;

  ${ProductCard}:hover & {
    transform: scale(1.04);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #111;
  color: white;
  padding: 7px 10px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  z-index: 2;
`;

const ProductDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 10px 0 0;
`;

const ProductDot = styled.div`
  width: ${({ active }) => (active ? "18px" : "8px")};
  height: 8px;
  background: ${({ active }) => (active ? "#111" : "#d8d8d8")};
  transition: all 0.25s ease;
`;

const ProductInfo = styled.div`
  padding: 1rem 1rem 1.15rem;
`;

const ProductGenre = styled.div`
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8a8a8a;
  margin-bottom: 8px;
  font-weight: 700;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: #111;
  margin: 0 0 8px;
  line-height: 1.35;
  min-height: 42px;
`;

const ProductPrice = styled.div`
  font-size: 1.03rem;
  font-weight: 900;
  color: #111;
`;

const EmptyState = styled.div`
  background: white;
  border: 1px solid #ececec;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #777;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
`;

// ==============================
// COMPONENT
// ==============================

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

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();

        setProducts(data);
        setLoading(false);

        const indexes = {};
        data.forEach((p) => {
          indexes[p._id] = 0;
        });
        setImageIndexes(indexes);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleScroll = () => {
    if (!bannerRef.current) return;
    const scrollLeft = bannerRef.current.scrollLeft;
    const width = bannerRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveSlide(index);
  };

  const handleProductScroll = (id) => {
    const el = carouselRefs.current[id];
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setImageIndexes((prev) => ({ ...prev, [id]: index }));
  };

  const genres = ["Tous", ...new Set(products.map((p) => p.genre).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let result =
      genreFilter === "Tous"
        ? [...products]
        : products.filter((p) => p.genre === genreFilter);

    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "title-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [products, genreFilter, sortBy]);

  const bannerImages = filteredProducts[0]?.images || [];

  const getBadgeText = (index, product) => {
    if (index < 2) return "Nouveau";
    if (Number(product.price) >= 25000) return "Premium";
    return "Tendance";
  };

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <PageWrapper>
      <Sidebar>
        <SidebarTitle>Catégories</SidebarTitle>

        {genres.map((g) => (
          <FilterButton
            key={g}
            active={genreFilter === g}
            onClick={() => setGenreFilter(g)}
          >
            <FiFilter /> {g}
          </FilterButton>
        ))}
      </Sidebar>

      <Content>
        <TopBar>
          <TitleBlock>
            <CollectionTitle>Collection</CollectionTitle>
            <CollectionSub>
              Des pièces fortes pour imposer ton style.
            </CollectionSub>
          </TitleBlock>

          <TopRight>
            <CountBadge>{filteredProducts.length} produits</CountBadge>

            <SortWrapper>
              <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Trier</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="title-asc">Nom A → Z</option>
                <option value="title-desc">Nom Z → A</option>
              </SortSelect>
              <SortIcon />
            </SortWrapper>
          </TopRight>
        </TopBar>

        {filteredProducts.length === 0 ? (
          <EmptyState>Aucun produit trouvé dans cette catégorie.</EmptyState>
        ) : (
          <Grid>
            {filteredProducts.map((p, index) => (
              <Fragment key={p._id}>
                {/* BANNER */}
                {index === 2 && bannerImages.length > 0 && (
                  <BannerCard>
                    <BannerWrapper ref={bannerRef} onScroll={handleScroll}>
                      {bannerImages.map((img, i) => (
                        <BannerSlide key={i}>
                          <BannerImage src={img.url} alt={`Banner ${i + 1}`} />
                          <BannerOverlay />
                          <BannerText>
                            <BannerLabel>Nouvelle Saison</BannerLabel>
                            <BannerTitle>Like a king, dress to impress</BannerTitle>
                            <BannerDesc>
                              Une collection pensée pour un style puissant,
                              propre et remarquable.
                            </BannerDesc>
                          </BannerText>
                        </BannerSlide>
                      ))}
                    </BannerWrapper>

                    <Dots>
                      {bannerImages.map((_, i) => (
                        <Dot key={i}>
                          <DotFill active={i === activeSlide} />
                        </Dot>
                      ))}
                    </Dots>
                  </BannerCard>
                )}

                {/* PRODUIT */}
                <ProductCard onClick={() => navigate(`/produit/${p._id}`)}>
                  <ImageArea>
                    <Badge>{getBadgeText(index, p)}</Badge>

                    <ProductCarousel
                      ref={(el) => (carouselRefs.current[p._id] = el)}
                      onScroll={() => handleProductScroll(p._id)}
                    >
                      {p.images?.map((img, idx) => (
                        <ProductSlide key={idx}>
                          <ProductImage src={img.url} alt={p.title} />
                        </ProductSlide>
                      ))}
                    </ProductCarousel>
                  </ImageArea>

                  {p.images?.length > 1 && (
                    <ProductDots>
                      {p.images.map((_, idx) => (
                        <ProductDot
                          key={idx}
                          active={imageIndexes[p._id] === idx}
                        />
                      ))}
                    </ProductDots>
                  )}

                  <ProductInfo>
                    <ProductGenre>{p.genre || "Collection"}</ProductGenre>
                    <ProductTitle>{p.title}</ProductTitle>
                    <ProductPrice>{p.price} FCFA</ProductPrice>
                  </ProductInfo>
                </ProductCard>
              </Fragment>
            ))}
          </Grid>
        )}
      </Content>
    </PageWrapper>
  );
}