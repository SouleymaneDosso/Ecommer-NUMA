import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

/* ======================= Animations ====================== */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

/* ======================= Overlay ====================== */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease forwards;
`;

/* ======================= Modal ====================== */
const ModalContent = styled.div`
  background: #fff;
  width: min(90vw, 400px);
  padding: 2rem 1.5rem;
  border-radius: 14px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${scaleIn} 0.4s ease forwards;
`;

/* ======================= Close button ====================== */
const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.05);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ======================= Newsletter link ====================== */
const NewsletterLink = styled.a`
  text-decoration: underline;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

/* ======================= Component ====================== */
export default function NewsletterModal() {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenNewsletterModal");
    const subscribed = localStorage.getItem("newsletterSubscribed");

    if (!seen && !subscribed) {
      // délai avant affichage du modal (1,5s)
      const timer = setTimeout(() => {
        setModalVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("seenNewsletterModal", "true");
    setModalVisible(false);
  };

  const handleNewsletterClick = () => {
    localStorage.setItem("seenNewsletterModal", "true");
    document
      .getElementById("newsletterSection")
      ?.scrollIntoView({ behavior: "smooth" });
    setModalVisible(false);
  };

  if (!modalVisible) return null;

  return (
    <ModalOverlay $visible={modalVisible}>
      <ModalContent>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <h2>Bienvenue sur notre application !</h2>
        <p>Inscrivez-vous à notre newsletter pour recevoir nos nouveautés et offres exclusives.</p>
        <NewsletterLink onClick={handleNewsletterClick}>
          S’inscrire à la newsletter
        </NewsletterLink>
      </ModalContent>
    </ModalOverlay>
  );
}