import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ---------- STYLES ----------
const RecommendationsWrapper = styled.div`
  margin-top: 3rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(3, 1fr);
`;

const RecommendationItem = styled.div`
  position: relative; /* ✅ FIX CRUCIAL */
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition: transform 0.35s ease, box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
`;

const ImageWrapper = styled.div`
  position: relative; /* ✅ sécurité supplémentaire */
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${RecommendationItem}:hover & {
    transform: scale(1.06);
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  pointer-events: none; /* empêche clic parasite */
`;

const Title = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Price = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #f59e0b;
`;

const Badge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ type }) =>
    type === "new" ? "#10b981" : type === "promo" ? "#f59e0b" : "#000"};
  color: #fff;
`;

// ---------- COMPONENT ----------
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

  const handleClick = (id) => navigate(`/produit/${id}`);

  return (
    <RecommendationsWrapper>
      <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>
        Produits recommandés
      </h3>

      <Grid>
        {produits.map((p) => (
          <RecommendationItem
            key={p._id}
            onClick={() => handleClick(p._id)}
          >
            <ImageWrapper>
              <Image
                src={p.images?.[0]?.url || "/placeholder.jpg"}
                alt={p.title}
              />

              {p.badge && <Badge type={p.badge}>{p.badge}</Badge>}

              <Overlay>
                <Title>{p.title}</Title>
                <Price>{p.price.toLocaleString()} FCFA</Price>
              </Overlay>
            </ImageWrapper>
          </RecommendationItem>
        ))}
      </Grid>
    </RecommendationsWrapper>
  );
}
