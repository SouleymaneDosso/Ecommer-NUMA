// src/pages/Collection.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiFilter, FiStar, FiClock } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s;
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
  ${({ left }) => left && `left: 8px;`}
  ${({ right }) => right && `right: 8px;`}
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ type }) => (type === "new" ? "#10b981" : "#f59e0b")};
  color: #fff;
`;

const ProductInfo = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.span`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: auto;
`;

const ViewButton = styled(Link)`
  margin-top: 1rem;
  padding: 8px 12px;
  text-align: center;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background-color: #111;
  transition: background 0.3s;
  &:hover {
    background-color: #333;
  }
`;

// ---------- COMPONENT ----------
export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});

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

  if (loading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );

  const filtered = products.filter((p) => {
    const matchCategory =
      category === "Tous" || p.genre.toLowerCase() === category.toLowerCase();
    const matchNew = filterNew ? p.isNew : true;
    const matchPromo = filterPromo ? p.badge === "promo" : true;
    return matchCategory && matchNew && matchPromo;
  });

  const changeImage = (productId, direction) => {
    setImageIndexes((prev) => {
      const current = prev[productId] || 0;
      const product = filtered.find((p) => p._id === productId);
      if (!product || !product.images) return prev;
      const length = product.images.length;
      let next = direction === "next" ? current + 1 : current - 1;
      if (next < 0) next = length - 1;
      if (next >= length) next = 0;
      return { ...prev, [productId]: next };
    });
  };

  const getMainImage = (p) =>
    p.images?.find((img) => img.isMain)?.url ||
    p.images?.[0]?.url ||
    "/placeholder.jpg";

  return (
    <PageWrapper>
      <Sidebar>
        <FilterSection>
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              <FiFilter /> {cat}
            </FilterButton>
          ))}
        </FilterSection>

        <FilterSection>
          <FilterButton
            active={filterNew}
            onClick={() => setFilterNew(!filterNew)}
          >
            <FiClock /> Nouveautés
          </FilterButton>
          <FilterButton
            active={filterPromo}
            onClick={() => setFilterPromo(!filterPromo)}
          >
            <FiStar /> Promotions
          </FilterButton>
        </FilterSection>
      </Sidebar>

      <Grid>
        {filtered.map((p) => (
          <ProductCard key={p._id}>
            <ProductImageWrapper>
              <ProductImage
                src={
                  imageIndexes[p._id] !== undefined
                    ? p.images[imageIndexes[p._id]]?.url
                    : getMainImage(p)
                }
                alt={p.title}
              />
              {p.images?.length > 1 && (
                <>
                  <ArrowButton left onClick={() => changeImage(p._id, "prev")}>
                    <FaChevronLeft />
                  </ArrowButton>
                  <ArrowButton right onClick={() => changeImage(p._id, "next")}>
                    <FaChevronRight />
                  </ArrowButton>
                </>
              )}
              {p.isNew && <Badge type="new">Nouveau</Badge>}
              {p.badge === "promo" && <Badge type="promo">Promo</Badge>}
            </ProductImageWrapper>
            <ProductInfo>
              <ProductName>{p.title}</ProductName>
              <ProductPrice>{p.price.toLocaleString()} FCFA</ProductPrice>
              <ViewButton to={`/produit/${p._id}`}>Voir produit</ViewButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </Grid>
    </PageWrapper>
  );
}
