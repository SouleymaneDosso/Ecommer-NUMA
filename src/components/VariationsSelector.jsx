import styled from "styled-components";

const SelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionsRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Label = styled.p`
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const OptionButton = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid
    ${({ theme, active, disabled }) => {
      if (disabled) return "#ccc";
      return active ? theme.primary : theme.border;
    }};
  background: ${({ active, theme, disabled }) => {
    if (disabled) return "#f5f5f5";
    return active ? theme.primary : theme.bg;
  }};
  color: ${({ active, theme, disabled }) => {
    if (disabled) return "#999";
    return active ? "white" : theme.text;
  }};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: 500;
  transition: 0.2s;

  &:hover {
    background: ${({ theme, disabled }) => (disabled ? "#f5f5f5" : theme.primary)};
    color: ${({ disabled }) => (disabled ? "#999" : "white")};
  }
`;

export default function VariationsSelector({
  tailles,
  couleurs,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  stockParVariation
}) {
  // Vérifie si une combinaison taille-couleur a du stock
  const isAvailable = (size, color) => {
    if (!stockParVariation) return true;
    const key = `${size}_${color}`;
    return stockParVariation[key] > 0;
  };

  // Vérifie si au moins une couleur est disponible pour une taille
  const sizeAvailable = (size) => {
    return couleurs.some((c) => isAvailable(size, c));
  };

  // Vérifie si au moins une taille est disponible pour une couleur
  const colorAvailable = (color) => {
    return tailles.some((t) => isAvailable(t, color));
  };

  // Ajuste la sélection si elle devient indisponible
  if (selectedSize && !sizeAvailable(selectedSize)) setSelectedSize(null);
  if (selectedColor && !colorAvailable(selectedColor)) setSelectedColor(null);

  return (
    <SelectorWrapper>
      {tailles?.length > 0 && (
        <div>
          <Label>Taille :</Label>
          <OptionsRow>
            {tailles.map((t) => {
              const available = sizeAvailable(t);
              return (
                <OptionButton
                  key={t}
                  active={selectedSize === t}
                  disabled={!available}
                  onClick={() => available && setSelectedSize(t)}
                >
                  {t}
                </OptionButton>
              );
            })}
          </OptionsRow>
        </div>
      )}

      {couleurs?.length > 0 && (
        <div>
          <Label>Couleur :</Label>
          <OptionsRow>
            {couleurs.map((c) => {
              const available = selectedSize ? isAvailable(selectedSize, c) : colorAvailable(c);
              return (
                <OptionButton
                  key={c}
                  active={selectedColor === c}
                  disabled={!available}
                  onClick={() => available && setSelectedColor(c)}
                >
                  {c}
                </OptionButton>
              );
            })}
          </OptionsRow>
        </div>
      )}
    </SelectorWrapper>
  );
}


