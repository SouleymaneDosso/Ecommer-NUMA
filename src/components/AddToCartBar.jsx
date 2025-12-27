import styled from "styled-components";
import { useContext, useEffect } from "react";
import { PanierContext } from "../Utils/Context";

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
  border: ${({ active }) => (active ? "2px solid #000" : "1px solid #ccc")};
  background: ${({ color }) => color || "#fff"};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const SizeButton = styled.button`
  padding: 10px;
  min-width: 44px;
  border-radius: 6px;
  border: ${({ active }) => (active ? "2px solid #000" : "1px solid #ccc")};
  background: ${({ disabled }) => (disabled ? "#f5f5f5" : "#fff")};
  color: ${({ disabled }) => (disabled ? "#aaa" : "#000")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
`;

const QuantityInput = styled.input`
  width: 70px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
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
  const stockParVariation = produit.stockParVariation;

  // Stock réel selon variante
  const stockDisponible =
    selectedColor && selectedSize
      ? stockParVariation?.[selectedColor]?.[selectedSize] ?? 0
      : 0;

  // Ajuster la quantité automatiquement
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
    });
  };

  return (
    <ActionWrapper>
      {/* COULEURS */}
      <Label>Couleur</Label>
      <Row>
        {produit.couleurs.map((color) => (
          <ColorCircle
            key={color}
            color={colorMap[color.toLowerCase()] || color.toLowerCase()}
            title={color} // tooltip
            active={selectedColor === color}
            disabled={produit.tailles.every(
              (size) => (stockParVariation?.[color]?.[size] ?? 0) === 0
            )}
            onClick={() => {
              setSelectedColor(color);
              setSelectedSize(null); // reset taille
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
              active={selectedSize === size}
              disabled={!selectedColor || stock === 0}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </SizeButton>
          );
        })}
      </Row>

      {/* QUANTITÉ + AJOUT */}
      <Row>
        <QuantityInput
          type="number"
          min={1}
          max={stockDisponible}
          value={quantity}
          disabled={disabled}
          onChange={(e) => {
            let q = Number(e.target.value) || 1;
            if (q < 1) q = 1;
            if (q > stockDisponible) q = stockDisponible;
            setQuantity(q);
          }}
        />
        <AddButton disabled={disabled} onClick={handleAddToCart}>
          {stockDisponible > 0 ? "Ajouter au panier" : "Rupture de stock"}
        </AddButton>
      </Row>

      {/* STOCK INFO */}
      <StockInfo>
        {!selectedColor || !selectedSize
          ? "Sélectionnez une couleur et une taille"
          : stockDisponible > 0
          ? `Stock disponible : ${stockDisponible}`
          : "Rupture de stock"}
      </StockInfo>
    </ActionWrapper>
  );
}
