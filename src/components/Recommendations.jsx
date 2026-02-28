import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* =============================
   GLOBAL WRAPPER
============================= */

const Section = styled.section`
  width: 100%;
  padding: 5rem 4rem;
  background: #ffffff;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

/* =============================
   TITLE
============================= */

const Heading = styled.h2`
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 3rem;
  text-transform: uppercase;
`;

/* =============================
   GRID
============================= */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

/* =============================
   CARD
============================= */

const Card = styled.div`
  cursor: pointer;
  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

/* =============================
   IMAGE
============================= */

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #f5f5f5;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

/* =============================
   BADGE
============================= */

const Badge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 0.65rem;
  letter-spacing: 1px;
  padding: 5px 10px;
  border: 1px solid #111;
  background: #ffffff;
  color: #111;
`;

/* =============================
   INFO
============================= */

const Info = styled.div`
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Price = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

/* =============================
   COMPONENT
============================= */

export default function Recommendations({ currentId }) {
  const [produits, setProduits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentId) return;

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits/recommandations/${currentId}`
        );

        if (!res.ok) throw new Error("Erreur fetch recommandations");

        const data = await res.json();
        setProduits(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendations();
  }, [currentId]);

  if (!produits.length) return null;

  return (
    <Section>
      <Container>
        <Heading>Vous aimerez aussi</Heading>

        <Grid>
          {produits.map((p) => (
            <Card
              key={p._id}
              onClick={() => navigate(`/produit/${p._id}`)}
            >
              <ImageWrapper>
                <Image
                  src={p.images?.[0]?.url || "/placeholder.jpg"}
                  alt={p.title}
                />
                {p.badge && (
                  <Badge>{p.badge.toUpperCase()}</Badge>
                )}
              </ImageWrapper>

              <Info>
                <ProductTitle>{p.title}</ProductTitle>
                <Price>{p.price.toLocaleString()} FCFA</Price>
              </Info>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}