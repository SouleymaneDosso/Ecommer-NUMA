
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiEye,
  FiEyeOff,
  FiTruck,
  FiPackage,
  FiShield,
  FiArrowUpRight,
  FiClock,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

/* ============================
   ANIMATIONS
============================ */

const reveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const whatsappPulse = keyframes`
  0%, 100% {
    box-shadow: 0 8px 25px rgba(37,211,102,0.18);
  }
  50% {
    box-shadow: 0 8px 32px rgba(37,211,102,0.32);
  }
`;

/* ============================
   WRAPPER
============================ */

const Wrapper = styled.section`
  width: 100%;
  margin-top: 55px;
  font-family: inherit;
  color: #191919;
  animation: ${reveal} 0.5s ease;
`;

/* ============================
   SECTION HEADER
============================ */

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9e7e2;
  margin-bottom: 28px;

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #a08b6b;
    text-transform: uppercase;
  }

  h3 {
    margin: 7px 0 0;
    font-size: 23px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }

  @media (max-width: 480px) {
    h3 {
      font-size: 20px;
    }
  }
`;

const SectionNumber = styled.span`
  font-size: 35px !important;
  font-weight: 300 !important;
  color: #dedbd5 !important;
  letter-spacing: -2px !important;
`;

/* ============================
   DESCRIPTION
============================ */

const DescriptionContainer = styled.div`
  max-width: 780px;
`;

const DescriptionText = styled.p`
  font-size: 14px;
  line-height: 2;
  color: #686868;
  font-weight: 400;
  white-space: pre-line;
  margin: 0;
  overflow-wrap: anywhere;
`;

const MoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 19px;
  padding: 0 0 5px;
  border: none;
  border-bottom: 1px solid #191919;
  background: transparent;
  color: #191919;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    color: #a08b6b;
    border-color: #a08b6b;
  }
`;

/* ============================
   DELIVERY
============================ */

const DeliveryCard = styled.div`
  background: #f7f6f2;
  padding: 28px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    border: 1px solid rgba(160,139,107,0.12);
    border-radius: 50%;
    right: -70px;
    top: -75px;
  }

  @media (max-width: 480px) {
    padding: 21px;
  }
`;

const DeliveryTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 17px;
  position: relative;
  z-index: 1;
`;

const DeliveryIcon = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: #fff;
  display: grid;
  place-items: center;
  color: #9c8056;
  font-size: 21px;
`;

const DeliveryTitle = styled.div`
  h4 {
    margin: 2px 0 7px;
    font-size: 15px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #777;
    line-height: 1.8;
  }

  strong {
    color: #191919;
  }
`;

const FreeDelivery = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 15px;
  padding: 8px 11px;
  background: #e9efe7;
  color: #416d48;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

const DeliveryFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 28px;
  padding-top: 23px;
  border-top: 1px solid #e6e3dc;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 17px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 16px;
    color: #9c8056;
    flex-shrink: 0;
  }

  span {
    font-size: 10px;
    font-weight: 600;
    color: #555;
    line-height: 1.5;
  }
`;

/* ============================
   WHATSAPP CTA
============================ */

const WhatsAppContainer = styled.div`
  margin-top: 32px;
  padding: 22px;
  border: 1px solid #e9e7e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const WhatsAppInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  .icon {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    background: #eaf5ec;
    color: #25864c;
    display: grid;
    place-items: center;
    font-size: 21px;
    flex-shrink: 0;
  }

  h4 {
    font-size: 12px;
    margin: 0 0 5px;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #888;
    font-size: 10px;
  }
`;

const WhatsAppButton = styled.a`
  min-height: 47px;
  padding: 0 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${({ $disabled }) => $disabled ? "#aaa" : "#191919"};
  color: white;
  text-decoration: none;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: ${({ $disabled }) => $disabled ? "not-allowed" : "pointer"};
  pointer-events: ${({ $disabled }) => $disabled ? "none" : "auto"};

  &:hover {
    background: ${({ $disabled }) => $disabled ? "#aaa" : "#a08b6b"};
  }

  svg {
    font-size: 17px;
  }
`;

/* ============================
   COMPONENT
============================ */

export default function ProductDescription({
  description,
  quantity = 1,
  productName,
  price,
  selectedColor,
  selectedSize,
  productUrl,
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const canOrder = Boolean(selectedColor && selectedSize);

  const hasLongDescription = (description || "").length > 250;

  const deliveryFree = quantity >= 2;

  const message = `
Bonjour NUMA 👋

Je souhaite commander le produit suivant :

🛍 Produit : ${productName}
💰 Prix : ${Number(price).toLocaleString("fr-FR")} FCFA
🎨 Couleur : ${selectedColor || "Non spécifiée"}
📏 Taille : ${selectedSize || "Non spécifiée"}
🔢 Quantité : ${quantity}

🔗 Lien du produit : ${productUrl || "Non disponible"}

Merci !
`;

  const whatsappLink = `https://wa.me/2250700247693?text=${encodeURIComponent(message)}`;

  return (
    <Wrapper>

      {/* DESCRIPTION */}

      <SectionHeader>
        <div>
          <span>En savoir plus</span>
          <h3>Description du produit</h3>
        </div>

        <SectionNumber>01</SectionNumber>
      </SectionHeader>

      <DescriptionContainer>
        <DescriptionText>
          {showFullDescription
            ? description
            : `${(description || "").slice(0, 250)}${
                hasLongDescription ? "..." : ""
              }`}
        </DescriptionText>

        {hasLongDescription && (
          <MoreButton
            type="button"
            onClick={() =>
              setShowFullDescription(!showFullDescription)
            }
          >
            {showFullDescription ? (
              <>
                <FiEyeOff />
                Voir moins
              </>
            ) : (
              <>
                <FiEye />
                Découvrir la suite
              </>
            )}
          </MoreButton>
        )}
      </DescriptionContainer>

      {/* LIVRAISON */}

      <div style={{ marginTop: 55 }}>
        <SectionHeader>
          <div>
            <span>Votre expérience NUMA</span>
            <h3>Livraison & services</h3>
          </div>

          <SectionNumber>02</SectionNumber>
        </SectionHeader>

        <DeliveryCard>

          <DeliveryTop>
            <DeliveryIcon>
              <FiTruck />
            </DeliveryIcon>

            <DeliveryTitle>
              <h4>Une livraison pensée pour vous</h4>

              {deliveryFree ? (
                <p>
                  Félicitations ! Votre commande bénéficie de la
                  <strong> livraison gratuite</strong> à partir de 2 articles.
                </p>
              ) : (
                <p>
                  Ajoutez un deuxième article pour profiter de la
                  <strong> livraison gratuite</strong>, quel que soit le modèle.
                </p>
              )}

              <FreeDelivery>
                <FiCheck />
                {deliveryFree
                  ? "Livraison gratuite débloquée"
                  : "Offre disponible dès 2 articles"}
              </FreeDelivery>
            </DeliveryTitle>
          </DeliveryTop>

          <DeliveryFeatures>
            <Feature>
              <FiPackage />
              <span>Préparation de commande</span>
            </Feature>

            <Feature>
              <FiShield />
              <span>Commande accompagnée</span>
            </Feature>

            <Feature>
              <FiClock />
              <span>Service client disponible</span>
            </Feature>
          </DeliveryFeatures>

        </DeliveryCard>
      </div>

      {/* WHATSAPP */}

      <WhatsAppContainer>

        <WhatsAppInfo>
          <div className="icon">
            <FaWhatsapp />
          </div>

          <div>
            <h4>Besoin d'un accompagnement ?</h4>
            <p>Notre équipe est disponible sur WhatsApp.</p>
          </div>
        </WhatsAppInfo>

        <WhatsAppButton
          href={canOrder ? whatsappLink : undefined}
          $disabled={!canOrder}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canOrder}
          onClick={(e) => {
            if (!canOrder) {
              e.preventDefault();
            }
          }}
        >
          <FaWhatsapp />
          Commander
          <FiArrowUpRight />
        </WhatsAppButton>

      </WhatsAppContainer>

    </Wrapper>
  );
}
