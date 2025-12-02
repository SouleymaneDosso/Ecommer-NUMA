import styled from "styled-components";

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

const StockInfo = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text};
`;

export default function AddToCartBar({
  quantity,
  setQuantity,
  selectedSize,
  selectedColor,
  stockParVariation,
}) {
  // Calcul du stock disponible pour la combinaison sélectionnée
  const key = selectedSize && selectedColor ? `${selectedSize}_${selectedColor}` : null;
  const stockDisponible = key ? stockParVariation?.[key] ?? 0 : 0;

  return (
    <ActionWrapper>
      <Row>
        <QuantityInput
          type="number"
          min={1}
          max={stockDisponible}
          value={quantity}
          onChange={(e) => {
            let q = Number(e.target.value);
            if (q < 1) q = 1;
            if (q > stockDisponible) q = stockDisponible;
            setQuantity(q);
          }}
          disabled={!selectedSize || !selectedColor || stockDisponible === 0}
        />
        <AddButton disabled={!selectedSize || !selectedColor || stockDisponible === 0}>
          Ajouter au panier
        </AddButton>
      </Row>
      <StockInfo>
        {selectedSize && selectedColor
          ? `Max disponible : ${stockDisponible}`
          : "Sélectionnez taille et couleur"}
      </StockInfo>
    </ActionWrapper>
  );
}
