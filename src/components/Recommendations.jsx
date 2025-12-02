import styled from "styled-components";
import { produits } from "../data/produits";

const Wrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 120px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Img = styled.img`
  width: 100%;
  height: 120px;       /* hauteur fixe pour toutes les images */
  border-radius: 8px;
  object-fit: cover;    /* recadre l'image pour remplir la hauteur */
`;

const Title = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
`;

export default function Recommendations({ currentId }) {
  const recs = produits.filter((p) => p.id !== currentId).slice(0, 4);

  return (
    <Wrapper>
      {recs.map((r) => (
        <Card key={r.id}>
          <Img src={r.image} alt={r.titre} />
          <Title>{r.titre}</Title>
        </Card>
      ))}
    </Wrapper>
  );
}

