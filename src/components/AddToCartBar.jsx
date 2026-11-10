
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { PanierContext } from "../Utils/Context";
import { useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiShoppingBag,
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiX,
  FiShield,
  FiTruck,
} from "react-icons/fi";

/* ============================
   COLOR MAP
============================ */

const colorMap = {
  blanc: "#ffffff",
  noir: "#171717",
  rouge: "#c62828",
  vert: "#25845b",
  bleu: "#2855a5",
  jaune: "#e6c547",
  orange: "#e98a32",
  rose: "#e9a6ba",
  violet: "#8052a1",
  gris: "#929292",
  marron: "#81543d",
  turquoise: "#40b7b0",
  beige: "#d9c8a8",
  kaki: "#a49b62",
  indigo: "#4b0082",
  fuchsia: "#ff00ff",
  cyan: "#00ffff",
  lime: "#00ff00",
  magenta: "#ff00ff",
  olive: "#808000",
  teal: "#008080",
  silver: "#c0c0c0",
  gold: "#c6a45b",
};

/* ============================
   STYLES
============================ */

const Wrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  color: #191919;
  font-family: inherit;
`;

const Section = styled.div`
  margin-bottom: 28px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 0;
`;

const SelectedValue = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 500;
`;

const ColorList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const ColorOption = styled.button`
  width: 39px;
  height: 39px;
  padding: 3px;
  border-radius: 50%;
  border: ${({ $active }) =>
    $active ? "1px solid #171717" : "1px solid #e5e5e5"};
  background: white;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? 0.35 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    transform: ${({ disabled }) => disabled ? "none" : "scale(1.08)"};
    border-color: #171717;
  }

  span {
    width: 29px;
    height: 29px;
    border-radius: 50%;
    background: ${({ color }) => color};
    border: 1px solid rgba(0,0,0,0.08);
  }
`;

const SizeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
`;

const SizeOption = styled.button`
  min-width: 53px;
  height: 46px;
  padding: 0 15px;
  background: ${({ $active }) => $active ? "#191919" : "#fff"};
  color: ${({ $active }) => $active ? "#fff" : "#333"};
  border: 1px solid ${({ $active }) => $active ? "#191919" : "#e6e6e6"};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? 0.3 : 1};
  transition: all 0.25s ease;

  &:hover {
    border-color: #191919;
    background: ${({ disabled, $active }) =>
      disabled ? "#fff" : $active ? "#333" : "#191919"};
    color: ${({ disabled }) => disabled ? "#333" : "#fff"};
  }
`;

const QuantityArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
`;

const QuantityBox = styled.div`
  height: 53px;
  display: flex;
  align-items: center;
  border: 1px solid #e5e5e5;
  background: #fff;
`;

const QuantityButton = styled.button`
  width: 39px;
  height: 100%;
  border: none;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  color: #555;
  opacity: ${({ disabled }) => disabled ? 0.3 : 1};

  &:hover {
    color: #000;
  }
`;

const QuantityValue = styled.span`
  min-width: 30px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
`;

const StockMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ $available }) => $available ? "#27845b" : "#b34a4a"};
  margin-top: 14px;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const PurchaseButton = styled.button`
  width: 100%;
  min-height: 58px;
  margin-top: 23px;
  padding: 0 22px;
  border: 1px solid #171717;
  background: ${({ disabled }) => disabled ? "#aaa" : "#171717"};
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  transition: all 0.3s ease;

  span {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  &:hover {
    background: ${({ disabled }) => disabled ? "#aaa" : "#333"};
  }

  &:active {
    transform: ${({ disabled }) => disabled ? "none" : "scale(0.99)"};
  }
`;

const Reassurance = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding-top: 19px;
  border-top: 1px solid #ededed;

  div {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #777;
    font-size: 10px;
    font-weight: 500;
  }

  svg {
    font-size: 14px;
    flex-shrink: 0;
  }

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

/* ============================
   MODAL PREMIUM
============================ */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.25s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  width: 100%;
  max-width: 430px;
  background: #fff;
  padding: 38px 30px;
  position: relative;
  text-align: center;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: transparent;
  font-size: 19px;
  color: #777;
  cursor: pointer;
`;

const SuccessIcon = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #f0f5ef;
  color: #477c4d;
  display: grid;
  place-items: center;
  margin: 0 auto 22px;
`;

const ModalTitle = styled.h3`
  font-size: 21px;
  font-weight: 700;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
`;

const ModalDescription = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: #888;
  margin: 0 0 27px;
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalButton = styled.button`
  width: 100%;
  min-height: 49px;
  background: ${({ $secondary }) => $secondary ? "#fff" : "#171717"};
  color: ${({ $secondary }) => $secondary ? "#171717" : "#fff"};
  border: 1px solid #171717;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: ${({ $secondary }) => $secondary ? "#f5f5f5" : "#333"};
  }
`;

/* ============================
   COMPONENT
============================ */

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

  const stockParVariation = produit.stockParVariation || {};

  const stockDisponible =
    selectedColor && selectedSize
      ? stockParVariation?.[selectedColor]?.[selectedSize] ?? 0
      : 0;

  useEffect(() => {
    if (stockDisponible === 0) {
      setQuantity(1);
    } else if (quantity > stockDisponible) {
      setQuantity(stockDisponible);
    }
  }, [stockDisponible, quantity, setQuantity]);

  const canOrder =
    Boolean(selectedColor && selectedSize && stockDisponible > 0);

  const handleAddToCart = () => {
    if (!canOrder) return;

    ajouterPanier({
      id: `${produit._id}_${selectedColor}_${selectedSize}`,
      productId: produit._id,
      nom: produit.title,
      prix: produit.price,
      image: produit.images?.find((i) => i.isMain)?.url,
      quantite: quantity,
      couleur: selectedColor,
      taille: selectedSize,
      stockDisponible,
    });

    setShowModal(true);
  };

  const parseColor = (color) =>
    colorMap[color.toLowerCase()] || color.toLowerCase();

  const formatColor = (color) =>
    color ? color.charAt(0).toUpperCase() + color.slice(1) : "";

  return (
    <Wrapper>

      {/* COULEURS */}

      <Section>
        <SectionHeader>
          <SectionTitle>Choisir la couleur</SectionTitle>
          <SelectedValue>
            {selectedColor ? formatColor(selectedColor) : "Sélectionnez"}
          </SelectedValue>
        </SectionHeader>

        <ColorList>
          {produit.couleurs?.map((color) => {
            const available = Object.values(
              stockParVariation[color] || {}
            ).some((stock) => stock > 0);

            return (
              <ColorOption
                key={color}
                type="button"
                color={parseColor(color)}
                $active={selectedColor === color}
                disabled={!available}
                title={formatColor(color)}
                aria-label={`Couleur ${color}`}
                aria-pressed={selectedColor === color}
                onClick={() => {
                  if (available) {
                    setSelectedColor(color);
                    setSelectedSize(null);
                  }
                }}
              >
                <span />
              </ColorOption>
            );
          })}
        </ColorList>
      </Section>

      {/* TAILLES */}

      <Section>
        <SectionHeader>
          <SectionTitle>Choisir la taille</SectionTitle>
          <SelectedValue>
            {selectedSize || "Guide des tailles"}
          </SelectedValue>
        </SectionHeader>

        <SizeList>
          {produit.tailles?.map((size) => {
            const stock =
              stockParVariation?.[selectedColor]?.[size] ?? 0;

            const available = Boolean(selectedColor) && stock > 0;

            return (
              <SizeOption
                key={size}
                type="button"
                $active={selectedSize === size}
                disabled={!available}
                aria-pressed={selectedSize === size}
                onClick={() => {
                  if (available) setSelectedSize(size);
                }}
              >
                {size}
              </SizeOption>
            );
          })}
        </SizeList>
      </Section>

      {/* QUANTITÉ */}

      <Section>
        <SectionHeader>
          <SectionTitle>Quantité</SectionTitle>
          <SelectedValue>
            {stockDisponible > 0
              ? `${stockDisponible} disponible(s)`
              : "En attente de sélection"}
          </SelectedValue>
        </SectionHeader>

        <QuantityArea>
          <QuantityBox>
            <QuantityButton
              type="button"
              disabled={!canOrder || quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Diminuer la quantité"
            >
              <FiMinus />
            </QuantityButton>

            <QuantityValue>{quantity}</QuantityValue>

            <QuantityButton
              type="button"
              disabled={!canOrder || quantity >= stockDisponible}
              onClick={() =>
                setQuantity(Math.min(stockDisponible, quantity + 1))
              }
              aria-label="Augmenter la quantité"
            >
              <FiPlus />
            </QuantityButton>
          </QuantityBox>
        </QuantityArea>

        <StockMessage $available={stockDisponible > 0}>
          <span />
          {!selectedColor || !selectedSize
            ? "Veuillez choisir une couleur et une taille"
            : stockDisponible > 0
            ? "Article disponible — prêt à être expédié"
            : "Cette combinaison est actuellement indisponible"}
        </StockMessage>
      </Section>

      {/* ACHAT */}

      <PurchaseButton
        type="button"
        disabled={!canOrder}
        onClick={handleAddToCart}
      >
        <span>
          <FiShoppingBag size={17} />
          Ajouter au panier
        </span>

        <FiArrowRight size={19} />
      </PurchaseButton>

      {/* RÉASSURANCE */}

      <Reassurance>
        <div>
          <FiShield />
          Paiement sécurisé
        </div>

        <div>
          <FiTruck />
          Livraison
        </div>
      </Reassurance>

      {/* MODAL */}

      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>

            <CloseButton
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Fermer"
            >
              <FiX />
            </CloseButton>

            <SuccessIcon>
              <FiCheck size={28} />
            </SuccessIcon>

            <ModalTitle>
              Ajouté avec succès !
            </ModalTitle>

            <ModalDescription>
              <strong>{produit.title}</strong>
              <br />
              Votre article a été ajouté à votre panier.
            </ModalDescription>

            <ModalActions>
              <ModalButton
                type="button"
                onClick={() => navigate("/panier")}
              >
                Voir mon panier
                <FiArrowRight style={{ marginLeft: 8 }} />
              </ModalButton>

              <ModalButton
                type="button"
                $secondary
                onClick={() => setShowModal(false)}
              >
                Continuer mes achats
              </ModalButton>
            </ModalActions>

          </Modal>
        </Overlay>
      )}

    </Wrapper>
  );
}
