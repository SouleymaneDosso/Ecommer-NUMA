// src/pages/Favorie.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import {API_URL } from "../../render"

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ProductImageWrapper = styled.div`
  position: relative;
  padding-top: 100%;
`;

const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background-color: ${({ type }) => (type === "new" ? "#2563eb" : "#ef4444")};
`;

const CardContent = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
`;

const ProductPrice = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled(Link)`
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  text-decoration: none;
  background: ${({ theme }) => theme.primary || "#007bff"};
  color: white;
`;

const FavoriteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.4rem;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(1.3);
  }
`;

/* ===== PAGE FAVORIS ===== */
export default function Favorie() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Récupérer les favoris
  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetch(`{API_URL }/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavorites(data.map((f) => f.productId).filter((p) => p));
    } catch (err) {
      console.error("Erreur fetch favorites:", err);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  // 🔹 Toggle favori (instantané et sécurisé)
  const toggleFavorite = async (product) => {
    if (!token) return alert("Connecte-toi pour ajouter un favori");

    try {
      const res = await fetch(`${API_URL }/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await res.json();

      setFavorites((prev) => {
        // Vérifie si le produit existe toujours côté backend
        const exists = prev.find((f) => f._id === product._id);

        if (data.active) {
          // Ajouter le produit complet si ce n'est pas déjà dans la liste
          return exists ? prev : [...prev, product];
        } else {
          // Retirer le produit des favoris
          return prev.filter((f) => f._id !== product._id);
        }
      });
    } catch (err) {
      console.error("Erreur toggle favori:", err);
    }
  };

  return (
    <PageWrapper>
      <PageTitle>Mes Favoris</PageTitle>
      {favorites.length === 0 && <p>Aucun favori.</p>}

      <Grid>
        {favorites.map((product) => (
          <ProductCard key={product._id}>
            <ProductImageWrapper>
              <ProductImage
                src={
                  Array.isArray(product.imageUrl)
                    ? product.imageUrl[0]
                    : product.imageUrl
                }
                alt={product.title}
              />
              {product.badge && (
                <Badge type={product.badge}>{product.badge}</Badge>
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
              <ViewButton to={`/produit/${product._id}`}>
                Voir produit
              </ViewButton>
            </CardContent>
          </ProductCard>
        ))}
      </Grid>
    </PageWrapper>
  );
}
