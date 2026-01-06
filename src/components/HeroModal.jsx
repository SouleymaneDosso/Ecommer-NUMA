import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FiX } from "react-icons/fi";

// Animation horizontale infinie
const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 90%;
  width: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const SliderContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

const SlideRow = styled.div`
  display: flex;
  gap: 12px;
  width: max-content;
  animation: ${scroll} linear infinite;
  animation-duration: ${({ $duration }) => $duration}s;
`;

const Slide = styled.img`
  width: 300px;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;

  @media (max-width: 768px) {
    width: 80vw;
    height: auto;
  }
`;

const NewsletterLink = styled.a`
  margin-top: 12px;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
`;

export default function HeroModal({ apiUrl }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const seen = localStorage.getItem("seenHeroModal");
    const subscribed = localStorage.getItem("newsletterSubscribed");
    if (!seen && !subscribed) setModalVisible(true);

    const fetchHero = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/produits`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const heroes = data.filter(p => p.hero).slice(0, 6);
          const images = heroes.map(p => {
            const mainImg = p.images.find(img => img.isMain) || p.images[0];
            return mainImg ? (mainImg.url.startsWith("http") ? mainImg.url : `${apiUrl}${mainImg.url}`) : null;
          }).filter(Boolean);
          // On double les images pour créer l'effet infini
          setHeroImages([...images, ...images]);
        }
      } catch (err) {
        console.error("Erreur fetch hero images:", err);
      }
    };
    fetchHero();
  }, [apiUrl]);

  const handleClose = () => {
    localStorage.setItem("seenHeroModal", "true");
    setModalVisible(false);
  };

  const handleLinkClick = () => {
    localStorage.setItem("seenHeroModal", "true");
    document.getElementById("newsletterSection")?.scrollIntoView({ behavior: "smooth" });
    setModalVisible(false);
  };

  if (!heroImages.length) return null;

  return (
    <ModalOverlay $visible={modalVisible}>
      <ModalContent>
        <CloseButton onClick={handleClose}><FiX /></CloseButton>
        <SliderContainer>
          <SlideRow $duration={20}>
            {heroImages.map((img, i) => (
              <Slide key={i} src={img} alt={`hero-${i}`} />
            ))}
          </SlideRow>
        </SliderContainer>
        <NewsletterLink onClick={handleLinkClick}>
          Inscrivez-vous à notre newsletter pour ne rien rater des nouveautés
        </NewsletterLink>
      </ModalContent>
    </ModalOverlay>
  );
}
