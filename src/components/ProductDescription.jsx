// src/components/ProductDescription.jsx
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiEye, FiEyeOff, FiTruck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// ---------- ANIMATIONS ----------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

// ---------- STYLES ----------
const Wrapper = styled.div`
  margin-top: 3rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #e5e5e5;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const TabButton = styled.button`
  padding: 14px 0;
  border: none;
  background: none;
  border-bottom: ${({ active }) =>
    active ? "3px solid #000" : "3px solid transparent"};
  font-weight: ${({ active }) => (active ? "700" : "500")};
  font-size: 1rem;
  cursor: pointer;
  color: ${({ active }) => (active ? "#000" : "#777")};
  transition: all 0.3s ease;

  &:hover {
    color: #000;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Content = styled.div`
  margin-top: 2rem;
  font-size: 1.05rem;
  line-height: 1.8;
  animation: ${fadeIn} 0.4s ease;
  max-width: 800px;
`;

const DescriptionText = styled.p`
  color: #444;
`;

const ShowMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #000;
  font-weight: 600;
  font-size: 0.95rem;
  transition: 0.2s;

  &:hover {
    opacity: 0.6;
  }
`;

const DeliveryBox = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 14px 22px;
  background: linear-gradient(135deg, #25D366, #1ebe57);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;
  z-index: 999;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
    padding: 12px 18px;
    font-size: 0.9rem;
  }
`;

// ---------- COMPONENT ----------
export default function ProductDescription({
  description,
  quantity = 1,
  productName,
  price,
  selectedColor,
  selectedSize,
  productUrl,
}) {
  const tabs = ["Description", "Livraison"];
  const [activeTab, setActiveTab] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // validation options
  const canOrder = selectedColor && selectedSize;

  // message WhatsApp
  const message = `
Bonjour 👋

Je souhaite commander ce produit :

🛍 Produit : ${productName}
💰 Prix : ${price} FCFA
🎨 Couleur : ${selectedColor || "Non spécifiée"}
📏 Taille : ${selectedSize || "Non spécifiée"}
🔢 Quantité : ${quantity}

🔗 Lien : ${productUrl}

Merci.
`;

  const whatsappLink = `https://wa.me/2250700247693?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Wrapper>
      <Tabs>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </TabButton>
        ))}
      </Tabs>

      <Content>
        {activeTab === 0 && (
          <>
            <DescriptionText>
              {showFullDescription
                ? description
                : `${description?.slice(0, 220)}${
                    description?.length > 220 ? "..." : ""
                  }`}
            </DescriptionText>

            {description?.length > 220 && (
              <ShowMoreButton
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <>
                    <FiEyeOff /> Voir moins
                  </>
                ) : (
                  <>
                    <FiEye /> Voir plus
                  </>
                )}
              </ShowMoreButton>
            )}
          </>
        )}

        {activeTab === 1 && (
          <DeliveryBox>
            <FiTruck size={24} />
            <div>
              {quantity >= 2 ? (
                <p>
                  Livraison <strong>gratuite</strong> à partir de 2 articles
                  (peu importe les modèles). Profitez-en 🎉
                </p>
              ) : (
                <p>
                  Ajoutez au moins <strong>2 articles</strong> pour bénéficier
                  de la livraison gratuite. Livraison standard disponible.
                </p>
              )}
            </div>
          </DeliveryBox>
        )}
      </Content>

      {/* WHATSAPP FLOTANT */}
      <WhatsAppButton
        href={canOrder ? whatsappLink : "#"}
        className={!canOrder ? "disabled" : ""}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!canOrder) {
            e.preventDefault();
            alert("Veuillez choisir une taille et une couleur.");
          }
        }}
      >
        <FaWhatsapp size={20} />
        Commander via WhatsApp
      </WhatsAppButton>
    </Wrapper>
  );
}