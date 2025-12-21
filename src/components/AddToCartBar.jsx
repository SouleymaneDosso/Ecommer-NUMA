// src/components/AddToCartBar.jsx
import styled from "styled-components";
import { useContext, useEffect } from "react";
import { PanierContext } from "../Utils/Context";

// ---------- STYLES ----------
const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.border || "#ccc"};
  border-radius: 6px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary || "#4caf50"};
  color: ${({ theme }) => theme.buttonText || "white"};
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover || "#45a049"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StockInfo = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text || "#333"};
`;

// ---------- COMPONENT ----------
export default function AddToCartBar({
  quantity,
  setQuantity,
  selectedSize,
  selectedColor,
  stockParVariation,
  produit,
}) {
  const { ajouterPanier } = useContext(PanierContext);

  // Calcul du stock disponible pour la variante sélectionnée
  const stockDisponible =
    selectedSize && selectedColor
      ? stockParVariation?.[selectedSize]?.[selectedColor] ?? 0
      : 0;

  // Valider la quantité
  useEffect(() => {
    if (stockDisponible === 0) setQuantity(0);
    else if (quantity < 1) setQuantity(1);
    else if (quantity > stockDisponible) setQuantity(stockDisponible);
  }, [stockDisponible, quantity, setQuantity]);

  const disabled = !selectedSize || !selectedColor || stockDisponible === 0;

  // Ajouter le produit au panier
  const handleAddToCart = () => {
    if (!produit || disabled) return;

    ajouterPanier({
      id: produit._id,
      nom: produit.title,
      prix: produit.price,
      image: produit.imageUrl?.[0] || "",
      quantite: quantity,
      taille: selectedSize,
      couleur: selectedColor,
    });
  };

  return (
    <ActionWrapper>
      <Row>
        <QuantityInput
          type="number"
          min={1}
          max={stockDisponible}
          value={disabled ? 0 : quantity}
          onChange={(e) => {
            let q = Number(e.target.value) || 1;
            if (q < 1) q = 1;
            if (q > stockDisponible) q = stockDisponible;
            setQuantity(q);
          }}
          disabled={disabled}
        />
        <AddButton disabled={disabled} onClick={handleAddToCart}>
          {stockDisponible > 0 ? "Ajouter au panier" : "Rupture de stock"}
        </AddButton>
      </Row>

      <StockInfo>
        {!selectedSize || !selectedColor
          ? "Sélectionnez taille et couleur"
          : stockDisponible > 0
          ? `Stock disponible : ${stockDisponible}`
          : "Rupture de stock"}
      </StockInfo>
    </ActionWrapper>
  );
}
