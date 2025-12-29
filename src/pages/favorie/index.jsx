// src/pages/Favorie.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  padding: 3rem 5%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 80vh;
`;

const PageTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  padding-top: 100%;
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background-color: ${({ type }) => (type === "new" ? "#2563eb" : "#ef4444")};
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.2;
`;

const ProductPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #111;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled(Link)`
  margin-top: 10px;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  text-decoration: none;
  background: #111;
  color: #fff;
  text-align: center;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const FavoriteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
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
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  ${({ left }) => left && `left: 8px;`}
  ${({ right }) => right && `right: 8px;`}
`;

/* ===== COMPONENT ===== */
export default function Favorie() {
  const [favorites, setFavorites] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const token = localStorage.getItem("token");

  // Charger les favoris
  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavorites(data.map((f) => f.productId).filter((p) => p && p._id));
    } catch (err) {
      console.error("Erreur fetch favorites:", err);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  // Toggle favori
  const toggleFavorite = async (product) => {
    if (!token) return alert("Connecte-toi pour ajouter un favori");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      setFavorites((prev) => {
        const exists = prev.find((f) => f._id === product._id);
        if (data.active) return exists ? prev : [...prev, product];
        else return prev.filter((f) => f._id !== product._id);
      });
    } catch (err) {
      console.error("Erreur toggle favori:", err);
    }
  };

  // Carousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        favorites.forEach((p) => {
          const current = prev[p._id] || 0;
          updated[p._id] = (current + 1) % (p.images?.length || 1);
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [favorites]);

  // Changer image manuellement
  const changeImage = (productId, direction) => {
    setImageIndexes((prev) => {
      const current = prev[productId] || 0;
      const product = favorites.find((p) => p._id === productId);
      if (!product || !product.images) return prev;
      const length = product.images.length;
      let next = direction === "next" ? current + 1 : current - 1;
      if (next < 0) next = length - 1;
      if (next >= length) next = 0;
      return { ...prev, [productId]: next };
    });
  };

  return (
    <PageWrapper>
      <PageTitle>Mes Favoris</PageTitle>

      {favorites.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#555" }}>
          Aucun favori pour l’instant.
        </p>
      )}

      <Grid>
        {favorites.map(
          (product) =>
            product?._id && (
              <ProductCard key={product._id}>
                <ProductImageWrapper>
                  <ProductImage
                    src={product.images?.[imageIndexes[product._id] || 0]?.url || "/placeholder.jpg"}
                    alt={product.title}
                  />
                  {product.badge && <Badge type={product.badge}>{product.badge}</Badge>}

                  {product.images?.length > 1 && (
                    <>
                      <ArrowButton left onClick={() => changeImage(product._id, "prev")}>
                        <FaChevronLeft />
                      </ArrowButton>
                      <ArrowButton right onClick={() => changeImage(product._id, "next")}>
                        <FaChevronRight />
                      </ArrowButton>
                    </>
                  )}
                </ProductImageWrapper>

                <CardContent>
                  <ProductTitle>{product.title}</ProductTitle>
                  <ActionWrapper>
                    <ProductPrice>{product.price} FCFA</ProductPrice>
                    <FavoriteButton onClick={() => toggleFavorite(product)}>
                      {favorites.some((f) => f._id === product._id) ? (
                        <FaHeart color="#ef4444" />
                      ) : (
                        <FiHeart />
                      )}
                    </FavoriteButton>
                  </ActionWrapper>
                  <ViewButton to={`/produit/${product._id}`}>Voir produit</ViewButton>
                </CardContent>
              </ProductCard>
            )
        )}
      </Grid>
    </PageWrapper>
  );
}
