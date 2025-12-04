// useEffect(() => {
//   let isFetching = false;

//   function handleScroll() {
//     if (isFetching) return;

//     const bottom =
//       window.innerHeight + window.scrollY >=
//       document.documentElement.scrollHeight - 300;

//     if (bottom && visibleCount < produits.length) {
//       isFetching = true;
//       setLoadingMore(true);

//       setTimeout(() => {
//         setVisibleCount(prev => Math.min(prev + 4, produits.length));
//         setLoadingMore(false);
//         isFetching = false;
//       }, 600);
//     }
//   }

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, [visibleCount]);

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { produits } from "../../data/produits";

import Comments from "../../components/Comments";
import Recommendations from "../../components/Recommendations";
import FavoriteButton from "../../components/FavoriteButton";
import ProductImages from "../../components/ProductImages";
import AddToCartBar from "../../components/AddToCartBar";
import VariationsSelector from "../../components/VariationsSelector";

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
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
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
  color: ${({ theme }) => theme.primary};
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
`;

const StockInfo = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10000;
  user-select: none;
`;

// ---------- PAGE PRODUCT ----------
export default function Produit() {
  const { id } = useParams();
  const produit = produits.find((p) => p.id === parseInt(id));
  if (!produit) return <p>Produit introuvable</p>;

  const [selectedSize, setSelectedSize] = useState(
    produit.tailles?.[0] || null
  );
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const imagesToShow =
    produit.images?.length > 0 ? produit.images : [produit.image];

  // Couleurs disponibles pour la taille sélectionnée
  const availableColors = produit.couleurs.filter((c) => {
    const key = `${selectedSize}_${c}`;
    return produit.stockParVariation?.[key] > 0;
  });

  useEffect(() => {
    if (!availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0] || null);
    }
  }, [selectedSize, availableColors]);

  const key = selectedColor ? `${selectedSize}_${selectedColor}` : null;
  const stockDisponible = key ? (produit.stockParVariation?.[key] ?? 0) : 0;

  useEffect(() => setQuantity(1), [selectedSize, selectedColor]);

  return (
    <PageWrapper>
      <BackLink onClick={() => window.history.back()}>
        <FiArrowLeft size={20} />
        Retour
      </BackLink>

      <ProductWrapper>
        <ProductImages images={imagesToShow} />

        <ProductDetails>
          <ProductTitle>{produit.titre}</ProductTitle>
          <ProductPrice>{produit.prix} €</ProductPrice>
          <Description>{produit.description}</Description>

          <VariationsSelector
            tailles={produit.tailles}
            couleurs={availableColors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />

          <StockInfo>
            {stockDisponible > 0
              ? `Stock disponible : ${stockDisponible}`
              : "Rupture de stock pour cette combinaison"}
          </StockInfo>

          <AddToCartBar
            quantity={quantity}
            setQuantity={setQuantity}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            stockParVariation={produit.stockParVariation}
            produit={produit}
          />

          <FavoriteButton />
          <Comments commentaires={produit.commentaires} />
          <Recommendations currentId={produit.id} />
        </ProductDetails>
      </ProductWrapper>
    </PageWrapper>
  );
}
