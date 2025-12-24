import { useEffect, useState } from "react";
import styled from "styled-components";

// ---------- STYLES ----------
const RecommendationsWrapper = styled.div`
  margin-top: 2rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;

  /* 3 colonnes sur grand écran */
  grid-template-columns: repeat(3, 1fr);

  /* 2 colonnes sur tablette et mobile */
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const RecommendationItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 0.5rem 0.75rem 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Title = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Price = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #f59e0b; 
`;

// ---------- COMPONENT ----------
export default function Recommendations({ currentId }) {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    if (!currentId) return;

    async function fetchRecommendations() {
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
    }

    fetchRecommendations();
  }, [currentId]);

  if (!produits.length) return null;

  return (
    <RecommendationsWrapper>
      <h3>Produits recommandés</h3>
      <Grid>
        {produits.map((p) => (
          <RecommendationItem key={p._id}>
            <ImageWrapper>
              <Image src={p.imageUrl[0]} alt={p.title} />
            </ImageWrapper>
            <Info>
              <Title>{p.title}</Title>
              <Price>{p.price} FCFA</Price>
            </Info>
          </RecommendationItem>
        ))}
      </Grid>
    </RecommendationsWrapper>
  );
}
