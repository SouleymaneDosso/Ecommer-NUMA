
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

/* =============================
   ANIMATION
============================= */

const marquee = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

/* =============================
   SECTION
============================= */

const Section = styled.section`
  width: 100%;
  padding: 5rem 0;
  background: #111111;
  color: #f5f1e9;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3.5rem 0;
  }
`;

const Container = styled.div`
  width: 100%;
`;

/* =============================
   HEADER
============================= */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 5%;
  margin-bottom: 2.5rem;

  @media (max-width: 600px) {
    padding: 0 1rem;
    margin-bottom: 1.8rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const Eyebrow = styled.span`
  color: #b99a72;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
`;

const Heading = styled.h2`
  margin: 0;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(1.7rem, 3vw, 2.7rem);
  letter-spacing: -0.04em;
  color: #f5f1e9;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.7rem;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ArrowButton = styled.button`
  width: 42px;
  height: 42px;
  border: 1px solid #514b43;
  background: transparent;
  color: #f5f1e9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #b99a72;
    border-color: #b99a72;
    color: #111;
  }
`;

/* =============================
   CAROUSEL
============================= */

const CarouselViewport = styled.div`
  width: 100%;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  gap: 22px;
  padding: 0 5%;
  animation: ${marquee} ${({ $duration }) => $duration}s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  &[data-paused="true"] {
    animation-play-state: paused;
  }

  @media (max-width: 600px) {
    gap: 14px;
    padding: 0 1rem;
  }
`;

/* =============================
   PRODUCT CARD
============================= */

const Card = styled.article`
  flex: 0 0 clamp(210px, 22vw, 300px);
  cursor: pointer;

  @media (max-width: 600px) {
    flex-basis: 68vw;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #242321;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.2, 0.65, 0.3, 1);

  ${Card}:hover & {
    transform: scale(1.06);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 13px;
  left: 13px;
  padding: 7px 10px;
  background: #f5f1e9;
  color: #171714;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const ProductTitle = styled.h3`
  margin: 0;
  color: #f5f1e9;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.5;
`;

const Price = styled.span`
  color: #b99a72;
  font-size: 0.85rem;
  font-weight: 500;
`;

/* =============================
   BOTTOM LINE
============================= */

const BottomLine = styled.div`
  height: 1px;
  margin: 3rem 5% 0;
  background: #37332e;
`;

/* =============================
   COMPONENT
============================= */

export default function Recommendations({ currentId }) {
  const [produits, setProduits] = useState([]);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentId) {
      setProduits([]);
      return;
    }

    const controller = new AbortController();

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits/recommandations/${currentId}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Erreur recommandations");
        }

        const data = await res.json();

        if (!controller.signal.aborted) {
          setProduits(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    };

    fetchRecommendations();

    return () => controller.abort();
  }, [currentId]);

  if (!produits.length) return null;

  const openProduct = (id) => {
    navigate(`/produit/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const duplicatedProducts = [...produits, ...produits];

  return (
    <Section>
      <Container>
        <Header>
          <HeaderLeft>
            <Eyebrow>La sélection NUMA</Eyebrow>
            <Heading>Vous aimerez aussi</Heading>
          </HeaderLeft>

          <Controls>
            <ArrowButton
              aria-label="Mettre en pause le carrousel"
              onClick={() => setPaused(!paused)}
            >
              {paused ? <FiArrowRight /> : <FiArrowLeft />}
            </ArrowButton>

            <ArrowButton
              aria-label="Reprendre le défilement"
              onClick={() => setPaused(false)}
            >
              <FiArrowRight />
            </ArrowButton>
          </Controls>
        </Header>

        <CarouselViewport
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <Track
            $duration={Math.max(produits.length * 5, 20)}
            data-paused={paused}
          >
            {duplicatedProducts.map((p, index) => (
              <Card
                key={`${p._id}-${index}`}
                onClick={() => openProduct(p._id)}
              >
                <ImageWrapper>
                  <Image
                    src={p.images?.[0]?.url || "/placeholder.jpg"}
                    alt={p.title || "Produit NUMA"}
                    loading="lazy"
                    draggable="false"
                  />

                  {p.badge && (
                    <Badge>{p.badge}</Badge>
                  )}
                </ImageWrapper>

                <ProductInfo>
                  <ProductTitle>
                    {p.title || "Article NUMA"}
                  </ProductTitle>

                  <Price>
                    {Number(p.price || 0).toLocaleString("fr-FR")} FCFA
                  </Price>
                </ProductInfo>
              </Card>
            ))}
          </Track>
        </CarouselViewport>

        <BottomLine />
      </Container>
    </Section>
  );
}
