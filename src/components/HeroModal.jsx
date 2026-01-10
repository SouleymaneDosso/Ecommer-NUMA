import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiX } from "react-icons/fi";

/* =======================
   Animation horizontale
======================= */
const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

/* =======================
   Overlay
======================= */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 1rem;
  overflow-y: auto; /* scroll si modal trop grand */
`;

/* =======================
   Modal
======================= */
const ModalContent = styled.div`
  background: #fff;
  width: min(92vw, 500px); /* largeur max sur mobile */
  max-height: 80vh; /* modal visible sur mobile */
  padding: 2rem 1.5rem 1.5rem 1.5rem; /* padding confortable */
  border-radius: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: auto; /* centre verticalement */
  overflow: hidden;

  @media (max-width: 480px) {
    width: 90vw;
    padding: 1.5rem 1rem;
  }
`;

/* =======================
   Close button
======================= */
const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.05);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
  z-index: 10;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }
`;

/* =======================
   Slider
======================= */
const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center; /* centre horizontalement */
`;

const SlideRow = styled.div`
  display: flex;
  gap: 12px;
  animation: ${scroll} linear infinite;
  animation-duration: ${({ $duration }) => $duration}s;
`;

/* =======================
   Image
======================= */
const Slide = styled.img`
  width: clamp(120px, 40vw, 200px); /* images plus petites sur mobile */
  max-height: 60vh; /* limiter hauteur pour modal mobile */
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 70vw;
    max-height: 50vh;
  }
`;

/* =======================
   Newsletter link
======================= */
const NewsletterLink = styled.a`
  margin-top: 12px;
  text-align: center;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

/* =======================
   Component
======================= */
export default function HeroModal({ apiUrl }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const seen = localStorage.getItem("seenHeroModal");
    const subscribed = localStorage.getItem("newsletterSubscribed");

    if (!seen && !subscribed) {
      setModalVisible(true);
    }

    const fetchHeroImages = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/produits`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const heroes = data.filter((p) => p.hero).slice(0, 6);

          const images = heroes
            .map((p) => {
              const mainImg =
                p.images?.find((img) => img.isMain) || p.images?.[0];
              if (!mainImg) return null;
              return mainImg.url.startsWith("http")
                ? mainImg.url
                : `${apiUrl}${mainImg.url}`;
            })
            .filter(Boolean);

          // duplication pour animation infinie
          setHeroImages([...images, ...images]);
        }
      } catch (err) {
        console.error("Erreur chargement images hero :", err);
      }
    };

    fetchHeroImages();
  }, [apiUrl]);

  const handleClose = () => {
    localStorage.setItem("seenHeroModal", "true");
    setModalVisible(false);
  };

  const handleNewsletterClick = () => {
    localStorage.setItem("seenHeroModal", "true");
    document
      .getElementById("newsletterSection")
      ?.scrollIntoView({ behavior: "smooth" });
    setModalVisible(false);
  };

  if (!heroImages.length) return null;

  return (
    <ModalOverlay $visible={modalVisible}>
      <ModalContent>
        <CloseButton onClick={handleClose}>
          <FiX />
        </CloseButton>

        <SliderContainer>
          <SlideRow $duration={20}>
            {heroImages.map((img, i) => (
              <Slide key={i} src={img} alt={`hero-${i}`} loading="lazy" />
            ))}
          </SlideRow>
        </SliderContainer>

        <NewsletterLink onClick={handleNewsletterClick}>
          Inscrivez-vous à notre newsletter pour ne rien rater des nouveautés
        </NewsletterLink>
      </ModalContent>
    </ModalOverlay>
  );
}
