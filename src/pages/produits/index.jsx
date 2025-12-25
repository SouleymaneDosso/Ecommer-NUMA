import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import VariationsSelector from "../../components/VariationsSelector";
import AddToCartBar from "../../components/AddToCartBar";
import Comments from "../../components/Comments";
import ProductImages from "../../components/ProductImages";
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalBox = styled(motion.div)`
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  color: #111;
  min-width: 280px;
`;

// ---------- PAGE PRODUIT ----------
export default function Produit() {
  const { id } = useParams();

  const [produit, setProduit] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalSuccess, setModalSuccess] = useState(false);

  // fetch produit
  useEffect(() => {
    async function fetchProduit() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits/${id}`);
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

  if (!produit) return null; // produit non trouvé

  const stockDisponible =
    selectedSize && selectedColor
      ? produit.stockParVariation?.[selectedSize]?.[selectedColor] ?? 0
      : 0;

  const availableColors = produit.couleurs.filter(
    (c) => selectedSize && produit.stockParVariation?.[selectedSize]?.[c] > 0
  );

  // Ajouter au panier (exemple modal)
  const handleAddToCart = () => {
    // Ici tu peux appeler ton backend/cart
    setModalSuccess(true);
    setTimeout(() => setModalSuccess(false), 2000);
  };

  return (
    <PageWrapper>
      <BackLink onClick={() => window.history.back()}>
        <FiArrowLeft size={20} />
        Retour
      </BackLink>

      <ProductWrapper>
        <ProductImages images={produit.images} />

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
            onAddToCart={handleAddToCart} // <-- déclenche modal
          />

          <Comments
            commentaires={produit.commentaires}
            produitId={produit._id}
            userId={localStorage.getItem("userId")}
          />

          <Recommendations currentId={produit._id} />
        </ProductDetails>
      </ProductWrapper>

      {/* ---------- MODAL SUCCÈS ---------- */}
      <AnimatePresence>
        {modalSuccess && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalBox
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Produit ajouté au panier !
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
