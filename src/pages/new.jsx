// src/pages/Nouveautes.jsx
import { useState, useEffect, useRef, Fragment } from "react";
import styled from "styled-components";
import { LoaderWrapper, Loader } from "../Utils/Rotate";
import { useNavigate } from "react-router-dom";

// ---------- STYLES ----------
const PageWrapper = styled.main`
  max-width: 1600px;
  margin: auto;
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProductCard = styled.div`
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-4px);
  }
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

// ---------- COMPONENT ----------
export default function Nouveautes() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const carouselRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        const newProducts = data.filter((p) => p.badge === "new");
        setProducts(newProducts);

        // Initialiser les index pour le carrousel
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

  const handleProductScroll = (id) => {
    const el = carouselRefs.current[id];
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setImageIndexes((prev) => ({ ...prev, [id]: index }));
  };

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  return (
    <PageWrapper>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Nouveautés
      </h1>

      <Grid>
        {products.map((p, index) => (
          <Fragment key={p._id}>

            {/* 🔥 GRAND BANNER AU MILIEU */}
            {index === 2 && products[0]?.images?.length > 0 && (
              <ProductCard
                style={{ gridColumn: "1 / -1", position: "relative" }}
                onClick={() => navigate(`/produit/${products[0]._id}`)}
              >
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
                  {products[0].images.map((img, idx) => (
                    <ProductSlide key={idx}>
                      <ProductImage
                        src={img.url}
                        alt={`Banner ${idx}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </ProductSlide>
                  ))}
                </ProductCarousel>

                {/* DOTS */}
                <ProductDots>
                  {products[0].images.map((_, idx) => (
                    <ProductDot
                      key={idx}
                      active={idx === imageIndexes["banner"]}
                    />
                  ))}
                </ProductDots>
              </ProductCard>
            )}

            {/* PRODUIT NORMAL */}
            <ProductCard onClick={() => navigate(`/produit/${p._id}`)}>
              <ProductCarousel
                ref={(el) => (carouselRefs.current[p._id] = el)}
                onScroll={() => handleProductScroll(p._id)}
              >
                {p.images.map((img, idx) => (
                  <ProductSlide key={idx}>
                    <ProductImage src={img.url} alt={p.title} />
                  </ProductSlide>
                ))}
              </ProductCarousel>

              {p.images.length > 1 && (
                <ProductDots>
                  {p.images.map((_, idx) => (
                    <ProductDot
                      key={idx}
                      active={idx === imageIndexes[p._id]}
                    />
                  ))}
                </ProductDots>
              )}

              <ProductInfo>
                <div>{p.title}</div>
                <strong>{p.price.toLocaleString()} FCFA</strong>
              </ProductInfo>
            </ProductCard>

          </Fragment>
        ))}
      </Grid>

      {/* TEXTE À LA FIN DES PRODUITS */}
      <div style={{ marginTop: "2rem", fontSize: "1.1rem", lineHeight: "1.6", color: "#333" }}>
        Les nouveautés représentent les produits récents et tendance, incarnant parfaitement
        l'élégance et le style contemporain. Chaque pièce illustre la créativité et la
        passion pour la mode, offrant des options uniques qui s'adaptent à votre personnalité
        et votre quotidien avec raffinement.
      </div>
    </PageWrapper>
  );
}