// src/components/ProductDescription.jsx
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";

// ---------- ANIMATIONS ----------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ---------- STYLES ----------
const Wrapper = styled.div`
  margin-top: 2rem;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #eee;
`;

const TabButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-bottom: ${({ active }) => (active ? "3px solid #000" : "3px solid transparent")};
  background: none;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  cursor: pointer;
  color: ${({ active }) => (active ? "#000" : "#666")};
  transition: all 0.25s;

  &:hover {
    color: #000;
    border-bottom: 3px solid #000;
  }
`;

const Content = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  animation: ${fadeIn} 0.25s ease;
`;

const ShowMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  padding: 6px 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: #007bff;
  font-weight: 600;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 12px 18px;
  background: #25D366;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 50px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  transition: all 0.2s;
  z-index: 999;

  &:hover {
    background: #1ebe57;
    transform: translateY(-2px);
  }

  svg {
    width: 22px;
    height: 22px;
    fill: white;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

// ---------- COMPONENT ----------
export default function ProductDescription({ description, quantity = 1 }) {
  const tabs = ["Description", "Livraison"];
  const [activeTab, setActiveTab] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const whatsappLink = `https://wa.me/2250700247693?text=Bonjour,+je+suis+intéressé+par+un+produit`;

  return (
    <Wrapper>
      {/* TABS */}
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

      {/* CONTENT */}
      <Content>
        {/* DESCRIPTION */}
        {activeTab === 0 && (
          <div>
            <p>
              {showFullDescription
                ? description
                : `${description?.slice(0, 200)}${description?.length > 200 ? "..." : ""}`}
            </p>
            {description?.length > 200 && (
              <ShowMoreButton onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? <><FiEyeOff /> Voir moins</> : <><FiEye /> Voir plus</>}
              </ShowMoreButton>
            )}
          </div>
        )}

        {/* LIVRAISON */}
        {activeTab === 1 && (
          <div>
            <p>
              {quantity >= 2
                ? "🚚 Livraison gratuite à partir de 2 produits"
                : "🚚 Livraison standard disponible. Profitez de la livraison gratuite en commandant au moins un pantalon et un t-shirt. Commandez tôt dans la journée et recevez votre colis le jour même !"}
            </p>
          </div>
        )}
      </Content>

      {/* WHATSAPP FLOTANT */}
      <WhatsAppButton href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <IconWrapper>
          <svg viewBox="0 0 448 512">
            <path d="M380.9 97.1C339-5.2 221-24.7 132 23.2-18.7 107-24.3 322.7 123.3 404.2l-7.2 52.5c-1.5 11.4 13.3 19.1 22.6 11.8l56.5-43c95.5 49.6 220.4 17.5 279.8-77.5 59.5-95 51.3-220-19.1-303.8zM224 403.1c-41.6 0-82.2-10.3-118.6-29.8L72 399l31.7-82.1C59 277.5 48 234.4 48 190.1 48 106.8 118.8 36 202.1 36 285.3 36 356 106.8 356 190.1c0 83.3-70.8 154.9-157.9 154.9zm95.7-138.6c-5.7-2.8-33.7-16.7-38.9-18.6-5.2-1.9-9-2.8-12.8 2.8s-14.7 18.6-18.1 22.4c-3.3 3.8-6.7 4.3-12.4 1.5-5.7-2.8-24-8.9-45.8-28.3-16.9-15-28.2-33.6-31.5-39.3-3.3-5.7-.4-8.7 2.4-11.5 2.5-2.5 5.7-6.5 8.6-9.7 2.9-3.3 3.8-5.7 5.7-9.5 1.9-3.8.9-7.1-.4-9.7s-12.8-30.9-17.6-42.5c-4.7-11.6-9.4-10.1-12.8-10.3-3.3-.2-7.1-.2-10.9-.2s-9.7 1.4-14.7 7c-5 5.7-19 18.6-19 45.3 0 26.7 19.5 52.5 22.2 56.1s38.3 58.4 92.8 81.8c54.5 23.4 54.5 15.6 64.6 14.7 10.1-.9 33-13.5 37.6-26.6 4.6-13.1 4.6-24.3 3.3-26.6-1.4-2.3-5.1-3.7-10.8-6.5z"/>
          </svg>
        </IconWrapper>
        WhatsApp
      </WhatsAppButton>
    </Wrapper>
  );
}
