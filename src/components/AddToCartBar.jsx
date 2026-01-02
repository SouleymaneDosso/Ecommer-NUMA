import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { PanierContext } from "../Utils/Context";
import { useNavigate } from "react-router-dom";

// ---------- COLOR MAP ----------
const colorMap = {
  blanc: "#ffffff",
  noir: "#000000",
  rouge: "#ff0000",
  vert: "#008000",
  bleu: "#0000ff",
  jaune: "#ffff00",
  orange: "#ffa500",
  rose: "#ff69b4",
  violet: "#800080",
  gris: "#808080",
  marron: "#a52a2a",
  turquoise: "#40e0d0",
  beige: "#f5f5dc",
  kaki: "#f0e68c",
  indigo: "#4b0082",
  fuchsia: "#ff00ff",
  cyan: "#00ffff",
  lime: "#00ff00",
  magenta: "#ff00ff",
  olive: "#808000",
  teal: "#008080",
  silver: "#c0c0c0",
  gold: "#ffd700",
};

// ---------- STYLES ----------
const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const ColorCircle = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: ${({ $active }) => ($active ? "2px solid #000" : "1px solid #ccc")};
  background: ${({ color }) => color};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const SizeButton = styled.button`
  padding: 10px;
  min-width: 44px;
  border-radius: 6px;
  border: ${({ $active }) => ($active ? "2px solid #000" : "1px solid #ccc")};
  background: ${({ disabled }) => (disabled ? "#f5f5f5" : "#fff")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
`;

const QuantitySelect = styled.select`
  width: 80px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const AddButton = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  background: ${({ disabled }) => (disabled ? "#ccc" : "#000")};
  color: white;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const StockInfo = styled.span`
  font-size: 0.85rem;
  color: #444;
`;

/* ---------- MODAL ---------- */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 14px;
  width: 90%;
  max-width: 420px;
  z-index: 9999;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

// ---------- COMPONENT ----------
export default function AddToCartBar({
  produit,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
}) {
  const { ajouterPanier } = useContext(PanierContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const stockParVariation = produit.stockParVariation;

  const stockDisponible =
    selectedColor && selectedSize
      ? (stockParVariation?.[selectedColor]?.[selectedSize] ?? 0)
      : 0;

  useEffect(() => {
    if (stockDisponible === 0) setQuantity(1);
    else if (quantity > stockDisponible) setQuantity(stockDisponible);
  }, [stockDisponible]);

  const disabled = !selectedColor || !selectedSize || stockDisponible === 0;

  const handleAddToCart = () => {
    if (disabled) return;

    ajouterPanier({
      id: `${produit._id}_${selectedColor}_${selectedSize}`,
      productId: produit._id,
      nom: produit.title,
      prix: produit.price,
      image: produit.images.find((i) => i.isMain)?.url,
      quantite: quantity,
      couleur: selectedColor,
      taille: selectedSize,
      stockDisponible: stockDisponible,
    });

    setShowModal(true);
  };

  const parseColor = (color) =>
    colorMap[color.toLowerCase()] || color.toLowerCase();

  return (
    <ActionWrapper>
      {/* COULEURS */}
      <Label>Couleur</Label>
      <Row>
        {produit.couleurs.map((color) => (
          <ColorCircle
            key={color}
            color={parseColor(color)}
            $active={selectedColor === color}
            onClick={() => {
              setSelectedColor(color);
              setSelectedSize(null);
            }}
          />
        ))}
      </Row>

      {/* TAILLES */}
      <Label>Taille</Label>
      <Row>
        {produit.tailles.map((size) => {
          const stock = stockParVariation?.[selectedColor]?.[size] ?? 0;
          return (
            <SizeButton
              key={size}
              $active={selectedSize === size}
              disabled={!selectedColor || stock === 0}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </SizeButton>
          );
        })}
      </Row>

      {/* QUANTITÉ */}
      <Label>Quantité</Label>
      <Row>
        <QuantitySelect
          value={quantity}
          disabled={disabled}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {Array.from({ length: stockDisponible }, (_, i) => i + 1).map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </QuantitySelect>

        <AddButton disabled={disabled} onClick={handleAddToCart}>
          Ajouter au panier
        </AddButton>
      </Row>
      <StockInfo>
        {!selectedColor || !selectedSize
          ? "Sélectionnez une couleur et une taille"
          : stockDisponible > 0
            ? `Stock disponible : ${stockDisponible}`
            : "Stock épuisé"}
      </StockInfo>

      {/* MODAL */}
      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>✅ Produit ajouté au panier</h3>
            <p style={{ margin: "1rem 0", color: "#555" }}>{produit.title}</p>

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => navigate("/panier")}
                style={{
                  padding: "10px 16px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Voir le panier
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 16px",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Continuer mes achats
              </button>
            </div>
          </Modal>
        </Overlay>
      )}
    </ActionWrapper>
  );
}
