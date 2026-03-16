import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import AddToCartBar from "../../components/AddToCartBar";
import ProductImages from "../../components/ProductImages";
import Comments from "../../components/Comments";
import Recommendations from "../../components/Recommendations";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";
import ProductDescription from "../../components/ProductDescription";
import ProductDetailsInfo from "../../components/ProductDetailsInfo";
// ---------- STYLES (minimaliste & pro) ----------
const PageWrapper = styled.main`
  padding: 2rem 5%;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: transparent;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;

  &:hover {
    color: #000;
  }
`;

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 1.9rem;
  font-weight: 700;
  margin: 0;
`;

const ProductPrice = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
`;

const Badge = styled.span`
  background: ${({ type }) =>
    type === "new" ? "#10b981" : type === "promo" ? "#f59e0b" : "transparent"};
  color: white;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// ---------- COMPONENT ----------
export default function Produit() {
  const { id } = useParams();

  const [produit, setProduit] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const stockDisponible =
    selectedColor && selectedSize
      ? (produit.stockParVariation?.[selectedColor]?.[selectedSize] ?? 0)
      : 0;

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

  const message = `
Bonjour 👋

Je souhaite commander ce produit :

🛍 Produit : ${produit.title}
💰 Prix : ${produit.price} FCFA
🎨 Couleur : ${selectedColor || "Non spécifiée"}
📏 Taille : ${selectedSize || "Non spécifiée"}
🔢 Quantité : ${quantity}

🔗 Lien : ${window.location.origin}/produit/${produit._id}

Merci.
`;

  const whatsappLink = `https://wa.me/2250700247693?text=${encodeURIComponent(
    message
  )}`;

  return (
    <PageWrapper>
      <BackLink onClick={() => window.history.back()}>
        <FiArrowLeft size={18} />
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

 <ProductDescription
  description={produit.description}
  quantity={quantity}
  productName={produit.title}
  price={produit.price}
  selectedColor={selectedColor}
  selectedSize={selectedSize}
  productUrl={`${window.location.origin}/produit/${produit._id}`}
/>
<ProductDetailsInfo details={produit.details} />

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