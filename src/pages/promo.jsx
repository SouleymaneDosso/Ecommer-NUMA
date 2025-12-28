// src/pages/Promo.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiFilter } from "react-icons/fi";
import { LoaderWrapper, Loader } from "../Utils/Rotate";

// ---------- STYLES ----------
const PageWrapper = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 4%;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: 1px;
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#000" : "#ccc")};
  background: ${({ active }) => (active ? "#000" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 6px 25px rgba(0,0,0,0.1);
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 280px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${({ type }) => (type === "new" ? "#10b981" : type === "promo" ? "#f59e0b" : "transparent")};
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
`;

const ProductPrice = styled.span`
  font-weight: 700;
  font-size: 1rem;
`;

// ---------- COMPONENT ----------
export default function Promo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTRES HOMME / FEMME / ENFANT
  const [category, setCategory] = useState("Tous");
  const categories = ["Tous", "Homme", "Femme", "Enfant"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        // On ne garde que les produits en promo
        const promoProducts = data.filter(p => p.badge === "promo");
        setProducts(promoProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  // Filtre par catégorie
  const filtered = products.filter(p =>
    category === "Tous" || p.genre.toLowerCase() === category.toLowerCase()
  );

  return (
    <PageWrapper>
      <Title>Promotions</Title>

      <FiltersWrapper>
        {categories.map(cat => (
          <FilterButton
            key={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
          >
            <FiFilter /> {cat}
          </FilterButton>
        ))}
      </FiltersWrapper>

      <Grid>
        {filtered.map(p => (
          <ProductCard key={p._id}>
            <ProductImageWrapper>
              <ProductImage src={p.images?.[0]?.url} alt={p.title} />
              <Badge type="promo">Promo</Badge>
            </ProductImageWrapper>
            <ProductInfo>
              <ProductName>{p.title}</ProductName>
              <ProductPrice>{p.price.toLocaleString()} FCFA</ProductPrice>
            </ProductInfo>
          </ProductCard>
        ))}
      </Grid>
    </PageWrapper>
  );
}
