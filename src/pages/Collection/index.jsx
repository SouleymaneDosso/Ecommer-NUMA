// src/pages/Collection.jsx
import { useState, useEffect, Fragment, useRef } from "react";
import styled from "styled-components";
import { FiFilter } from "react-icons/fi";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";

// ---------- STYLES ----------
const PageWrapper = styled.main`
  max-width: 1400px;
  margin: auto;
  padding: 2rem;
  display: flex;
  gap: 2rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 200px;
`;

const FilterButton = styled.button`
  display: block;
  margin-bottom: 8px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
`;

const Content = styled.div`
  flex: 1;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// ---------- PRODUIT ----------
const ProductCard = styled.div``;

const ProductCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth; // <-- smooth scroll

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
  height: 280px;
  object-fit: cover;
`;

const ProductDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 6px;
`;

const ProductDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#000" : "#ccc")};
  transition: background 0.3s ease;
`;

const ProductInfo = styled.div`
  padding: 5px;
`;

// ---------- BANNER ----------
const BannerCard = styled.div`
  grid-column: 1 / -1;
  overflow: hidden;
`;

const BannerWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth; // <-- smooth scroll

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
  height: 400px;
  object-fit: cover;
`;

const BannerText = styled.div`
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  max-width: 300px;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
`;

const Dot = styled.div`
  width: 20px;
  height: 3px;
  background: #ccc;
  overflow: hidden;
`;

const DotFill = styled.div`
  height: 100%;
  width: ${({ active }) => (active ? "100%" : "0%")};
  background: black;
  transition: width 0.3s ease;
`;

// ---------- COMPONENT ----------
export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [genreFilter, setGenreFilter] = useState("Tous");

  const bannerRef = useRef();
  const carouselRefs = useRef({});

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleScroll = () => {
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

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  // Filtrage par genre
  const filteredProducts =
    genreFilter === "Tous"
      ? products
      : products.filter((p) => p.genre === genreFilter);

  const bannerImages = filteredProducts[0]?.images || [];

  // Liste des genres pour le filtre
  const genres = ["Tous", ...new Set(products.map((p) => p.genre))];

  return (
    <PageWrapper>
      <Sidebar>
        {genres.map((g) => (
          <FilterButton
            key={g}
            onClick={() => setGenreFilter(g)}
            style={{
              fontWeight: genreFilter === g ? "bold" : "normal",
            }}
          >
            <FiFilter /> {g}
          </FilterButton>
        ))}
      </Sidebar>

      <Content>
        <TopBar>
          <div>{filteredProducts.length} PRODUITS</div>
          <div>Filtrer par genre</div> {/* <-- texte modifié */}
        </TopBar>

        <Grid>
          {filteredProducts.map((p, index) => (
            <Fragment key={p._id}>

              {/* 🔥 BANNER */}
              {index === 2 && (
                <BannerCard>
                  <BannerWrapper ref={bannerRef} onScroll={handleScroll}>
                    {bannerImages.map((img, i) => (
                      <BannerSlide key={i}>
                        <BannerImage src={img.url} />
                        <BannerText>
                          Like a king, I dress to impress
                        </BannerText>
                      </BannerSlide>
                    ))}
                  </BannerWrapper>

                  {/* DOTS */}
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
              <ProductCard>
                <ProductCarousel
                  ref={(el) => (carouselRefs.current[p._id] = el)}
                  onScroll={() => handleProductScroll(p._id)}
                >
                  {p.images.map((img, idx) => (
                    <ProductSlide key={idx}>
                      <ProductImage src={img.url} />
                    </ProductSlide>
                  ))}
                </ProductCarousel>

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
                  <div>{p.title}</div>
                  <strong>{p.price} FCFA</strong>
                </ProductInfo>
              </ProductCard>

            </Fragment>
          ))}
        </Grid>
      </Content>
    </PageWrapper>
  );
}