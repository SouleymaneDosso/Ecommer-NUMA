// src/pages/Nouveautes.jsx
import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react";
import styled from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiChevronDown } from "react-icons/fi";

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

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1250px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 520px) {
    gap: 0.2rem;
  }
`;

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

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: #111;
  margin: 0 0 8px;
  line-height: 1.35;
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
export default function Nouveautes() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [genreFilter, setGenreFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("default");
  const carouselRefs = useRef({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        const newProducts = data.filter((p) => p.badge === "new");
        setProducts(newProducts);

        const indexes = {};
        newProducts.forEach((p) => (indexes[p._id] = 0));
        setImageIndexes(indexes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const genres = useMemo(() => ["Tous", ...new Set(products.map((p) => p.genre).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    let result = genreFilter === "Tous" ? [...products] : products.filter((p) => p.genre === genreFilter);
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return result;
  }, [products, genreFilter, sortBy]);

  const handleProductScroll = useCallback((id) => {
    const el = carouselRefs.current[id];
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setImageIndexes((prev) => ({ ...prev, [id]: index }));
  }, []);

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  return (
    <PageWrapper>
      <Sidebar>
        <SidebarTitle>Catégories</SidebarTitle>
        {genres.map((g) => (
          <FilterButton key={g} active={genreFilter === g} onClick={() => setGenreFilter(g)}>
            <FiFilter /> {g}
          </FilterButton>
        ))}
      </Sidebar>

      <Content>
        <TopBar>
          <TitleBlock>
            <CollectionTitle>Nouveautés</CollectionTitle>
            <CollectionSub>Les dernières tendances pour vous.</CollectionSub>
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
          <EmptyState>Aucune nouveauté trouvée pour cette catégorie.</EmptyState>
        ) : (
          <Grid>
            {filteredProducts.map((p, index) => (
              <Fragment key={p._id}>
                {/* BANNIERE AU MILIEU */}
                {index === 2 && filteredProducts[0]?.images?.length > 0 && (
                  <ProductCard style={{ gridColumn: "1 / -1" }} onClick={() => navigate(`/produit/${filteredProducts[0]._id}`)}>
                    <ProductCarousel
                      ref={(el) => (carouselRefs.current["banner"] = el)}
                      onScroll={() => {
                        const el = carouselRefs.current["banner"];
                        if (!el) return;
                        const idx = Math.round(el.scrollLeft / el.clientWidth);
                        setImageIndexes((prev) => ({ ...prev, banner: idx }));
                      }}
                      style={{ height: "400px" }}
                    >
                      {filteredProducts[0].images.map((img, idx) => (
                        <ProductSlide key={idx}>
                          <ProductImage src={img.url} alt={`Banner ${idx + 1}`} />
                        </ProductSlide>
                      ))}
                    </ProductCarousel>

                    <ProductDots>
                      {filteredProducts[0].images.map((_, idx) => (
                        <ProductDot key={idx} active={idx === imageIndexes["banner"]} />
                      ))}
                    </ProductDots>
                  </ProductCard>
                )}

                {/* PRODUIT NORMAL */}
                <ProductCard onClick={() => navigate(`/produit/${p._id}`)}>
                  <ImageArea>
                    <ProductCarousel ref={(el) => (carouselRefs.current[p._id] = el)} onScroll={() => handleProductScroll(p._id)}>
                      {p.images.map((img, idx) => (
                        <ProductSlide key={idx}>
                          <ProductImage src={img.url} alt={p.title} />
                        </ProductSlide>
                      ))}
                    </ProductCarousel>

                    {p.images.length > 1 && (
                      <ProductDots>
                        {p.images.map((_, idx) => (
                          <ProductDot key={idx} active={imageIndexes[p._id] === idx} />
                        ))}
                      </ProductDots>
                    )}
                  </ImageArea>

                  <ProductInfo>
                    <ProductTitle>{p.title}</ProductTitle>
                    <ProductPrice>{p.price.toLocaleString()} FCFA</ProductPrice>
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