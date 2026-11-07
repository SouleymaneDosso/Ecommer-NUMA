
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// CONTENEUR PRINCIPAL
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  width: 100%;
  height: 100dvh;
  background: #111;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// EN-TÊTE
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;

  h1 {
    font-size: 20px;
    margin: 0;
  }

  button {
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 50%;
    background: white;
    color: black;
    font-size: 25px;
    cursor: pointer;
  }
`;

// BARRE DE PROGRESSION
const ProgressContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 15px 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
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

// PHOTO PRINCIPALE
const MainContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 65vh;
  object-fit: contain;
  border-radius: 12px;
`;

const ProductInfo = styled.div`
  text-align: center;
  padding: 12px;

  h2 {
    font-size: 21px;
    margin: 5px;
  }

  p {
    font-size: 18px;
    color: #ddd;
    margin: 5px;
  }
`;

// MINIATURES
const Thumbnails = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 12px 15px;
  justify-content: center;

  &::-webkit-scrollbar {
    display: none;
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
`;

// BOUTON FINAL
const Footer = styled.div`
  padding: 12px 20px 20px;
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
`;

const Message = styled.p`
  text-align: center;
  margin: auto;
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

  return (
    <Overlay>
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

      {/* GRANDE PHOTO */}
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

      {/* FERMER */}
      <Footer>
        <button onClick={() =>{
            navigate("/new") & setFerme(true)
        }}>
          Nouveautés-NUMA
        </button>
      </Footer>
    </Overlay>
  );
}

export default Avantpremiere;
