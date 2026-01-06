import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiX } from "react-icons/fi";

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
  padding: 2rem;
  border-radius: 12px;
  max-width: 320px;
  width: 90%;
  text-align: center;
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
  font-size: 20px;
  cursor: pointer;
`;

const SliderContainer = styled.div`
  height: 320px;
  overflow: hidden;
  position: relative;
`;

const SlideRow = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${({ $duration }) => `slide ${$duration}s linear infinite`};

  @keyframes slide {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
`;

const Slide = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
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
    // Vérifie si l'utilisateur a déjà vu le modal ou s'il est déjà inscrit
    const seen = localStorage.getItem("seenHeroModal");
    const subscribed = localStorage.getItem("newsletterSubscribed"); // flag si l'utilisateur est déjà inscrit
    if (!seen && !subscribed) setModalVisible(true);

    // Fetch produits hero
    const fetchHero = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/produits`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const heroes = data.filter(p => p.hero).slice(0, 4);
          const images = heroes.map(p => {
            const mainImg = p.images.find(img => img.isMain) || p.images[0];
            return mainImg ? (mainImg.url.startsWith("http") ? mainImg.url : `${apiUrl}${mainImg.url}`) : null;
          }).filter(Boolean);
          setHeroImages(images);
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
    // Marque comme vu et scroll vers la section newsletter
    localStorage.setItem("seenHeroModal", "true");
    document.getElementById("newsletterSection")?.scrollIntoView({ behavior: "smooth" });
    setModalVisible(false);
  };

  return (
    <ModalOverlay $visible={modalVisible}>
      <ModalContent>
        <CloseButton onClick={handleClose}><FiX /></CloseButton>

        {/* Slider seulement si images chargées */}
        {heroImages.length > 0 && (
          <SliderContainer>
            <SlideRow $duration={16}>
              {[...heroImages, ...heroImages].map((img, i) => (
                <Slide key={i} src={img} alt={`hero-${i}`} />
              ))}
            </SlideRow>
          </SliderContainer>
        )}

        <NewsletterLink onClick={handleLinkClick}>
          Inscrivez-vous à notre newsletter pour ne rien rater des nouveautés
        </NewsletterLink>
      </ModalContent>
    </ModalOverlay>
  );
}
