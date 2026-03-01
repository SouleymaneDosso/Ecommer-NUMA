import { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { FiHeart, FiCheck } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ================= ANIMATIONS ================= */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

/* ================= STYLES ================= */

const PageWrapper = styled.main`
  padding: 3rem 6%;
  background: #ffffff;
  color: #111;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 18px;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 0.8rem;
  letter-spacing: 1px;
  cursor: pointer;
  padding-bottom: 5px;
  border-bottom: ${({ $active }) =>
    $active ? "2px solid #111" : "2px solid transparent"};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  transition: 0.3s;

  &:hover {
    opacity: 0.6;
  }
`;

const SortSelect = styled.select`
  padding: 6px 10px;
  font-size: 0.8rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
  }
`;

const ProductCard = styled.div`
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease forwards;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${({ type }) =>
    type === "promo" ? "#111" : "#f3f3f3"};
  color: ${({ type }) =>
    type === "promo" ? "#fff" : "#111"};
  letter-spacing: 1px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CardContent = styled.div`
  margin-top: 12px;
`;

const ProductTitle = styled.h2`
  font-size: 0.9rem;
  margin-bottom: 6px;
  font-weight: 400;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const Gadget = styled.div`
  font-size: 0.7rem;
  padding: 4px 8px;
  background: #111;
  color: white;
  letter-spacing: 1px;
`;

const Validation = styled.div`
  font-size: 0.75rem;
  color: #2e7d32;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SkeletonCard = styled.div`
  aspect-ratio: 4/5;
  background: linear-gradient(
    to right,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.2s infinite linear;
`;

/* ================= COMPONENT ================= */

export default function Homme() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [filter, setFilter] = useState("tout");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        const valid = data.filter(
          (p) => p.images?.length && p.genre === "homme"
        );

        setProducts(valid);

        const indexes = {};
        valid.forEach((p) => {
          const mainIndex =
            p.images.findIndex((img) => img.isMain);
          indexes[p._id] =
            mainIndex >= 0 ? mainIndex : 0;
        });

        setImageIndexes(indexes);
        setTimeout(() => setLoading(false), 600);
      });
  }, []);

  /* Rotation images */
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        products.forEach((p) => {
          updated[p._id] =
            ((prev[p._id] || 0) + 1) %
            p.images.length;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  /* Filtrage + tri */
  const filteredProducts = useMemo(() => {
    let filtered =
      filter === "tout"
        ? products
        : products.filter(
            (p) =>
              p.categorie?.toLowerCase().trim() === filter
          );

    if (sort === "asc")
      filtered = [...filtered].sort(
        (a, b) => a.price - b.price
      );
    if (sort === "desc")
      filtered = [...filtered].sort(
        (a, b) => b.price - a.price
      );

    return filtered;
  }, [products, filter, sort]);

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>
          Collection Homme ({filteredProducts.length})
        </PageTitle>

        <ControlsWrapper>
          <FilterWrapper>
            {["tout", "haut", "bas", "chaussure"].map((cat) => (
              <FilterButton
                key={cat}
                $active={filter === cat}
                onClick={() => setFilter(cat)}
              >
                {cat.toUpperCase()}
              </FilterButton>
            ))}
          </FilterWrapper>

          <SortSelect
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Trier</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </SortSelect>
        </ControlsWrapper>
      </PageHeader>

      <Grid>
        {loading
          ? Array(6).fill().map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : filteredProducts.map((p) => (
              <ProductCard
                key={p._id}
                onClick={() =>
                  navigate(`/produit/${p._id}`)
                }
              >
                <ImageWrapper>
                  {p.images.map((img, index) => (
                    <ProductImage
                      key={index}
                      src={img.url}
                      alt={p.title}
                      loading="lazy"
                      $active={
                        imageIndexes[p._id] === index
                      }
                    />
                  ))}

                  {p.badge && (
                    <Badge type={p.badge}>
                      {p.badge.toUpperCase()}
                    </Badge>
                  )}
                </ImageWrapper>

                <CardContent>
                  <ProductTitle>
                    {p.title}
                  </ProductTitle>

                  <PriceRow>
                    <ProductPrice>
                      {p.price} FCFA
                    </ProductPrice>

                    {p.gadget && (
                      <Gadget>
                        {p.gadget.toUpperCase()}
                      </Gadget>
                    )}
                  </PriceRow>

                  <Validation>
                    <FiCheck />
                    Disponible
                  </Validation>
                </CardContent>
              </ProductCard>
            ))}
      </Grid>
    </PageWrapper>
  );
}