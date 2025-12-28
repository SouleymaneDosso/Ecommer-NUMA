// src/pages/Collection.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiFilter, FiStar, FiClock } from "react-icons/fi";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";

// ---------- STYLES ----------
const PageWrapper = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 4%;
  display: flex;
  gap: 2rem;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 900px) {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ active }) => (active ? "#000" : "#ccc")};
  background: ${({ active }) => (active ? "#000" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: 0.3s;
  &:hover {
    background: #000;
    color: #fff;
  }
`;

const Grid = styled.div`
  flex: 1;
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
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.span`
  font-weight: 700;
  font-size: 1rem;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ type }) =>
    type === "new" ? "#10b981" : type === "promo" ? "#f59e0b" : "transparent"};
  color: #fff;
`;

// ---------- COMPONENT ----------
export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTRES
  const [category, setCategory] = useState("Tous");
  const [filterNew, setFilterNew] = useState(false);
  const [filterPromo, setFilterPromo] = useState(false);

  const categories = ["Tous", "Homme", "Femme", "Enfant"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  const filtered = products.filter(p => {
    const matchCategory =
      category === "Tous" || p.genre.toLowerCase() === category.toLowerCase();
    const matchNew = filterNew ? p.isNew : true;
    const matchPromo = filterPromo ? p.badge === "promo" : true;
    return matchCategory && matchNew && matchPromo;
  });

  return (
    <PageWrapper>
      <Sidebar>
        {/* Catégories */}
        <FilterSection>
          {categories.map(cat => (
            <FilterButton
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              <FiFilter /> {cat}
            </FilterButton>
          ))}
        </FilterSection>

        {/* Nouveautés / Promotions */}
        <FilterSection>
          <FilterButton active={filterNew} onClick={() => setFilterNew(!filterNew)}>
            <FiClock /> Nouveautés
          </FilterButton>
          <FilterButton active={filterPromo} onClick={() => setFilterPromo(!filterPromo)}>
            <FiStar /> Promotions
          </FilterButton>
        </FilterSection>
      </Sidebar>

      <Grid>
        {filtered.map(p => (
          <ProductCard key={p._id}>
            {p.isNew && <Badge type="new">Nouveau</Badge>}
            {p.badge === "promo" && <Badge type="promo">Promo</Badge>}
            <ProductImage src={p.images?.[0]?.url} alt={p.title} />
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
