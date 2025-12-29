import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import AddToCartBar from "../../components/AddToCartBar";
import ProductImages from "../../components/ProductImages";
import Comments from "../../components/Comments";
import Recommendations from "../../components/Recommendations";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";

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
  background: #f5f5f5;
  color: #007bff;
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

// ---------- COMPONENT ----------
export default function Produit() {
  const { id } = useParams();

  const [produit, setProduit] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    fetchProduit();
  }, [id]);

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  if (!produit) return null;

  // calcule stock disponible
  const stockDisponible =
    selectedColor && selectedSize
      ? (produit.stockParVariation?.[selectedColor]?.[selectedSize] ?? 0)
      : 0;

  // couleurs disponibles selon taille sélectionnée
  const availableColors = selectedSize
    ? produit.couleurs.filter(
        (c) => produit.stockParVariation?.[c]?.[selectedSize] > 0
      )
    : produit.couleurs;

  const orderedImages = produit.images
    ? [
        produit.images.find((img) => img.isMain) || produit.images[0],
        ...produit.images.filter(
          (img) =>
            img !==
            (produit.images.find((img) => img.isMain) || produit.images[0])
        ),
      ]
    : [];

  return (
    <PageWrapper>
      <BackLink onClick={() => window.history.back()}>
        <FiArrowLeft size={20} />
        Retour
      </BackLink>

      <ProductWrapper>
        <ProductImages images={orderedImages} />

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

          <AddToCartBar
            produit={produit}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
          />

          <Comments
            commentaires={produit.commentaires}
            produitId={produit._id}
            userId={localStorage.getItem("userId")}
          />

          <Recommendations currentId={produit._id} />
        </ProductDetails>
      </ProductWrapper>
    </PageWrapper>
  );
}
