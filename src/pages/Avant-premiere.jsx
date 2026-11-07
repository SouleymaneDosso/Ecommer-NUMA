import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// CONTENEUR PRINCIPAL
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background: #111;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

// EN-TÊTE
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding: max(15px, env(safe-area-inset-top)) 20px 12px;

  h1 {
    font-size: 20px;
    line-height: 1.3;
    margin: 0;
    flex: 1;
  }

  button {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: white;
    color: black;
    font-size: 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding-left: 16px;
    padding-right: 16px;

    h1 {
      font-size: 17px;
    }
  }
`;

// BARRE DE PROGRESSION
const ProgressContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 15px 12px;
  flex-shrink: 0;
`;

const ProgressBar = styled.div`
  flex: 1;
  min-width: 0;
  height: 3px;
  background: #555;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${({ active }) => (active ? "100%" : "0%")};
  height: 100%;
  background: white;
  transition: width 0.2s linear;
`;

// ZONE DE LA PHOTO ET DES INFORMATIONS
const MainContent = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  gap: 12px;
  overflow: hidden;
`;

// IMAGE PRINCIPALE
const MainImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;

  @media (max-width: 600px) {
    border-radius: 10px;
  }
`;

// INFORMATIONS PRODUIT
const ProductInfo = styled.div`
  width: 100%;
  flex-shrink: 0;
  text-align: center;
  padding: 4px 10px 8px;
  overflow: hidden;

  h2 {
    font-size: 21px;
    line-height: 1.3;
    margin: 0 0 8px;
    overflow-wrap: anywhere;
  }

  p {
    font-size: 18px;
    line-height: 1.3;
    color: #ddd;
    margin: 0;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    padding: 4px 8px 10px;

    h2 {
      font-size: 17px;
      margin-bottom: 6px;
    }

    p {
      font-size: 16px;
    }
  }
`;

// MINIATURES
const Thumbnails = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 12px 20px 16px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  @media (max-width: 480px) {
    gap: 9px;
    padding: 12px 16px 16px;
  }
`;

const Thumbnail = styled.img`
  width: 55px;
  height: 65px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 7px;
  border: 2px solid ${({ active }) =>
    active ? "white" : "transparent"};
  opacity: ${({ active }) => (active ? 1 : 0.55)};
  transition: opacity 0.2s, border-color 0.2s;
`;

// BOUTON FINAL
const Footer = styled.div`
  width: 100%;
  flex-shrink: 0;
  padding: 12px 20px max(20px, env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;

  button {
    width: 100%;
    max-width: 350px;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: white;
    color: black;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    padding-left: 16px;
    padding-right: 16px;

    button {
      padding: 15px;
    }
  }
`;

const Message = styled.p`
  text-align: center;
  margin: auto;
  padding: 20px;
  color: white;
`;

function Avantpremiere() {
  const [duree, setDuree] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ferme, setFerme] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  // ATTENDRE 30 SECONDES
  useEffect(() => {
    const time = setTimeout(() => {
      setDuree(1);
    }, 30000);

    return () => clearTimeout(time);
  }, []);

  // RÉCUPÉRER LES NOUVEAUTÉS
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits`
        );

        if (!res.ok) {
          throw new Error("Erreur de récupération des produits");
        }

        const data = await res.json();

        const newProducts = data.filter(
          (p) =>
            p.badge === "new" &&
            !(p.precommande === true && p.disponible === false) &&
            Array.isArray(p.images) &&
            p.images.length > 0
        );

        setProducts(newProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // TRANSFORMER LES PRODUITS EN DIAPOSITIVES
  const slides = useMemo(() => {
    return products.flatMap((product) =>
      product.images
        .filter((img) => img && img.url)
        .map((img) => ({
          url: img.url,
          title: product.title,
          price: product.price,
          productId: product._id,
        }))
    );
  }, [products]);

  // SÉCURISER L'INDEX SI LES PRODUITS CHANGENT
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // DÉFILEMENT AUTOMATIQUE TOUTES LES 3 SECONDES
  useEffect(() => {
    if (duree === 0 || ferme || slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [duree, ferme, slides.length]);

  // AFFICHAGE
  if (duree === 0 || ferme) {
    return null;
  }

  if (loading) {
    return (
      <Overlay>
        <Message>Chargement des nouveautés...</Message>
      </Overlay>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  if (!currentSlide) {
    return null;
  }

  return (
    <Overlay>
      {/* EN-TÊTE */}
      <Header>
        <h1>✨ Découvrez nos nouveautés</h1>

        <button
          onClick={() => setFerme(true)}
          aria-label="Fermer"
        >
          ×
        </button>
      </Header>

      {/* PROGRESSION */}
      <ProgressContainer>
        {slides.map((slide, index) => (
          <ProgressBar key={`${slide.productId}-${index}`}>
            <ProgressFill active={index <= currentIndex} />
          </ProgressBar>
        ))}
      </ProgressContainer>

      {/* GRANDE PHOTO ET INFORMATIONS */}
      <MainContent>
        <MainImage
          src={currentSlide.url}
          alt={currentSlide.title}
        />

        <ProductInfo>
          <h2>{currentSlide.title}</h2>

          {currentSlide.price != null && (
            <p>
              {Number(currentSlide.price).toLocaleString("fr-FR")} FCFA
            </p>
          )}
        </ProductInfo>
      </MainContent>

      {/* MINIATURES */}
      <Thumbnails>
        {slides.map((slide, index) => (
          <Thumbnail
            key={`${slide.productId}-${index}`}
            src={slide.url}
            alt={`Nouveauté ${index + 1}`}
            active={index === currentIndex}
          />
        ))}
      </Thumbnails>

      {/* BOUTON FINAL */}
      <Footer>
        <button
          onClick={() => {
            setFerme(true);
            navigate("/new");
          }}
        >
          Nouveautés-NUMA
        </button>
      </Footer>
    </Overlay>
  );
}

export default Avantpremiere;
