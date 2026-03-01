import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";
import { ThemeContext } from "../../Utils/Context";

/* =========================
   STYLES PREMIUM
========================= */

const PageWrapper = styled.main`
  padding: 3rem 6%;
  background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  font-size: 0.8rem;
  letter-spacing: 1px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: ${({ $active }) =>
    $active ? "1px solid #000" : "1px solid transparent"};
  transition: all 0.3s ease;
  color: inherit;

  &:hover {
    opacity: 0.6;
  }
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
  position: relative;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ $active }) => ($active ? "#000" : "#444")};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  margin-top: 14px;
`;

const ProductTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const ProductPrice = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`;

/* =========================
   COMPONENT
========================= */

export default function Homme() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tout");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        const valid = data.filter(
          (p) => p && p.images?.length && p.genre === "homme"
        );
        setProducts(valid);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

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
    if (!token) {
      navigate("/compte");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        if (data.active) setFavorites((prev) => [...prev, id]);
        else setFavorites((prev) => prev.filter((f) => f !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );

  return (
    <PageWrapper $isdark={$isdark}>
      <PageHeader>
        <PageTitle>Collection Homme</PageTitle>

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
      </PageHeader>

      <Grid>
        {products
          .filter(
            (p) =>
              filter === "tout" ||
              p.categorie?.toLowerCase().trim() === filter
          )
          .map((p) => {
            const isFav = favorites.includes(p._id);

            return (
              <ProductCard
                key={p._id}
                onClick={() => navigate(`/produit/${p._id}`)}
              >
                <ImageWrapper>
                  <ProductImage
                    src={p.images?.[0]?.url || "/placeholder.jpg"}
                    alt={p.title}
                  />

                  <FavoriteButton
                    $active={isFav}
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
                  <ProductPrice>{p.price} FCFA</ProductPrice>
                </CardContent>
              </ProductCard>
            );
          })}
      </Grid>
    </PageWrapper>
  );
}