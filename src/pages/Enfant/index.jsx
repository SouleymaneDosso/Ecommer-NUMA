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
  padding: 3.6rem 6%;
  background: #ffffff;
  color: #111;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.6rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #dcdcdc;
  font-size: 15px;
  width: 220px;
  outline: none;

  &:focus {
    border-color: #111;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 0.7rem;
  letter-spacing: 1px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: ${({ $active }) =>
    $active ? "2px solid #111" : "2px solid transparent"};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  transition: 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.4rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductCard = styled.div`
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease forwards;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  overflow: hidden;
  background: #f7f7f7;
`;

const ProductImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const Badge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 6px;
  font-size: 0.5rem;
  font-weight: 600;
  background: #111;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ $favorite }) => ($favorite ? "#000" : "#777")};
`;

const CardContent = styled.div`
  margin-top: 10px;
`;

const ProductTitle = styled.h2`
  font-size: 0.8rem;
  font-weight: 400;
  margin-bottom: 6px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductPrice = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
`;

const Gadget = styled.div`
  font-size: 0.5rem;
  padding: 3px 6px;
  color: black;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Validation = styled.div`
  font-size: 0.7rem;
  color: #2e7d32;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LoadMore = styled.button`
  margin: 2.6rem auto 0;
  padding: 11px 20px;
  border: 1px solid #111;
  background: #fff;
  cursor: pointer;
  font-weight: 500;
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

export default function Enfant() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [filter, setFilter] = useState("tout");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(12);

  /* CHARGER PRODUITS */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        const valid = data.filter(
          (p) => p.images?.length && p.genre === "enfant"
        );

        setProducts(valid);

        const indexes = {};
        valid.forEach((p) => {
          const mainIndex = p.images.findIndex((img) => img.isMain);
          indexes[p._id] = mainIndex >= 0 ? mainIndex : 0;
        });

        setImageIndexes(indexes);
        setTimeout(() => setLoading(false), 500);
      })
      .catch(console.error);
  }, []);

  /* FAVORIS */
  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setFavorites(data.map((f) => f.productId?._id).filter(Boolean))
      )
      .catch(console.error);
  }, [token]);

  const toggleFavorite = async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.active) setFavorites((prev) => [...prev, id]);
        else setFavorites((prev) => prev.filter((f) => f !== id));
      }
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  /* CAROUSEL */
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        products.forEach((p) => {
          updated[p._id] = ((prev[p._id] || 0) + 1) % p.images.length;
        });
        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [products]);

  /* FILTRE + TRI + RECHERCHE */
  const filteredProducts = useMemo(() => {
    let filtered =
      filter === "tout"
        ? products
        : products.filter((p) => p.categorie?.toLowerCase().trim() === filter);

    if (search)
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );

    if (sort === "asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

    return filtered.slice(0, limit);
  }, [products, filter, sort, search, limit]);

  if (loading) return <SkeletonCard />;

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Collection Enfant</PageTitle>

        <ControlsWrapper>
          <SearchInput
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FilterWrapper>
            {["tout", "haut", "bas", "robe", "chaussure"].map((cat) => (
              <FilterButton
                key={cat}
                $active={filter === cat}
                onClick={() => setFilter(cat)}
              >
                {cat.toUpperCase()}
              </FilterButton>
            ))}
          </FilterWrapper>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Trier</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </ControlsWrapper>
      </PageHeader>

      <Grid>
        {filteredProducts.map((p) => {
          const isFav = favorites.includes(p._id);

          return (
            <ProductCard key={p._id} onClick={() => navigate(`/produit/${p._id}`)}>
              <ImageWrapper>
                {p.images.map((img, index) => (
                  <ProductImage
                    key={index}
                    src={img.url}
                    alt={p.title}
                    loading="lazy"
                    $active={imageIndexes[p._id] === index}
                  />
                ))}

                {p.badge && <Badge>{p.badge}</Badge>}

                <FavoriteButton
                  $favorite={isFav}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p._id);
                  }}
                >
                  {isFav ? <FaHeart /> : <FiHeart />}
                </FavoriteButton>
              </ImageWrapper>

              <CardContent>
                <ProductTitle>{p.title}</ProductTitle>

                <PriceRow>
                  <ProductPrice>{p.price} FCFA</ProductPrice>
                  {p.gadget && <Gadget>{p.gadget}</Gadget>}
                </PriceRow>

                <Validation>
                  <FiCheck />
                  Disponible
                </Validation>
              </CardContent>
            </ProductCard>
          );
        })}
      </Grid>

      {filteredProducts.length >= limit && (
        <LoadMore onClick={() => setLimit(limit + 12)}>
          Voir plus
        </LoadMore>
      )}
    </PageWrapper>
  );
}