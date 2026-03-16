import styled from "styled-components";
import { FiInfo } from "react-icons/fi";

// Container minimaliste
const DetailsWrapper = styled.div`
  margin-top: 2rem;
  padding: 1.2rem;
  border-top: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
`;

// Titre
const DetailsTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  color: #111;
`;

// Liste des détails
const DetailsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
`;

// Item avec hover subtil
const DetailItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  background: #fafafa;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }

  span:first-child {
    color: #555;
  }

  span:last-child {
    font-weight: 600;
    color: #111;
  }
`;

export default function ProductDetailsInfo({ details }) {
  if (!details) return null;

  return (
    <DetailsWrapper>
      <DetailsTitle>
        <FiInfo size={18} />
        Détails du produit
      </DetailsTitle>

      <DetailsList>
        {Object.entries(details).map(([key, value]) => {
          if (!value) return null;

          const label = {
            matiere: "Matière",
            poids: "Poids",
            coupe: "Coupe",
            saison: "Saison",
            entretien: "Entretien",
            paysFabrication: "Pays de fabrication",
          }[key] || key;

          return (
            <DetailItem key={key}>
              <span>{label}</span>
              <span>{value}</span>
            </DetailItem>
          );
        })}
      </DetailsList>
    </DetailsWrapper>
  );
}