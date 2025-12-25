import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";

import VariationsSelector from "../../components/VariationsSelector";
import AddToCartBar from "../../components/AddToCartBar";
import Comments from "../../components/Comments";
import ProductImages from "../../components/ProductImages";
import Recommendations from "../../components/Recommendations"; // <-- ajouté
// ---------- STYLES ----------
const PageWrapper = styled.main`
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.bgLight || "#f5f5f5"};
  color: ${({ theme }) => theme.primary || "#007bff"};
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
`;

const ProductWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const ProductDetails = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
`;

const ProductPrice = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 1rem;
`;

const StockInfo = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
`;

const Badge = styled.span`
  background: ${({ type }) =>
    type === "new" ? "#10b981" : type === "promo" ? "#f59e0b" : "transparent"};
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  align-self: flex-start;
`;

// ---------- PAGE PRODUIT ----------
export default function Produit() {
  const { id } = useParams();

  const [produit, setProduit] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // fetch produit
  useEffect(() => {
    async function fetchProduit() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits/${id}`
        );
        if (!res.ok) throw new Error("Erreur fetch produit");
        const data = await res.json();
        setProduit(data);

        setSelectedSize(data.tailles?.[0] || null);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduit();
  }, [id]);

  if (!produit) return <p>Chargement du produit...</p>;

  const stockDisponible =
    selectedSize && selectedColor
      ? (produit.stockParVariation?.[selectedSize]?.[selectedColor] ?? 0)
      : 0;

  const availableColors = produit.couleurs.filter(
    (c) => selectedSize && produit.stockParVariation?.[selectedSize]?.[c] > 0
  );

  return (
    <PageWrapper>
      <BackLink onClick={() => window.history.back()}>
        <FiArrowLeft size={20} />
        Retour
      </BackLink>

      <ProductWrapper>
        <ProductImages
          images={
            produit.images
          }
        />

        <ProductDetails>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <ProductTitle>{produit.title}</ProductTitle>
            {(produit.badge || produit.isNew) && (
              <Badge type={produit.badge || (produit.isNew ? "new" : null)}>
                {produit.badge || (produit.isNew ? "Nouveau" : "")}
              </Badge>
            )}
          </div>

          <ProductPrice>{produit.price} FCFA</ProductPrice>
          <Description>{produit.description}</Description>

          <VariationsSelector
            tailles={produit.tailles}
            couleurs={availableColors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            stockParVariation={produit.stockParVariation}
          />

          <StockInfo>
            {selectedSize && selectedColor
              ? `Stock disponible : ${stockDisponible}`
              : "Sélectionnez taille et couleur"}
          </StockInfo>

          <AddToCartBar
            quantity={quantity}
            setQuantity={setQuantity}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            stockParVariation={produit.stockParVariation}
            produit={produit}
          />

          <Comments
            commentaires={produit.commentaires}
            produitId={produit._id}
            userId={localStorage.getItem("userId")}
          />

          {/* -------------------- RECOMMANDATIONS -------------------- */}
          <Recommendations currentId={produit._id} />
        </ProductDetails>
      </ProductWrapper>
    </PageWrapper>
  );
}
