import styled from "styled-components";
import { FiInfo, FiArrowUpRight } from "react-icons/fi";

const DetailsWrapper = styled.section`
  margin-top: 2.5rem;
  padding: 1.8rem;
  background: #faf9f6;
  border: 1px solid #eae6df;
  border-radius: 4px;

  @media (max-width: 600px) {
    padding: 1.3rem;
    margin-top: 2rem;
  }
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.3rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid #e7e2d9;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Eyebrow = styled.span`
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9b805e;
  font-weight: 600;
`;

const DetailsTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  color: #171714;
  font-family: Georgia, serif;
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.03em;

  svg {
    color: #a48763;
    stroke-width: 1.4;
  }
`;

const HeaderNumber = styled.span`
  font-family: Georgia, serif;
  font-size: 2rem;
  color: #d8cbb9;
  line-height: 1;
`;

const DetailsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 2rem;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #ebe7e0;
  transition: padding 0.2s ease;

  &:hover {
    padding-left: 0.25rem;
  }

  span:first-child {
    color: #858078;
    font-size: 0.83rem;
    font-weight: 400;
  }

  span:last-child {
    color: #24231f;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: right;
    max-width: 60%;
    overflow-wrap: anywhere;
  }
`;

const DetailsFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.3rem;
  color: #999187;
  font-size: 0.72rem;
  letter-spacing: 0.02em;

  svg {
    color: #a48763;
    flex-shrink: 0;
  }
`;

const labels = {
  matiere: "Matière",
  poids: "Poids",
  coupe: "Coupe",
  saison: "Saison",
  entretien: "Entretien",
  paysFabrication: "Pays de fabrication",
};

export default function ProductDetailsInfo({ details }) {
  if (!details || typeof details !== "object") return null;

  const entries = Object.entries(details).filter(
    ([, value]) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

  if (entries.length === 0) return null;

  return (
    <DetailsWrapper>
      <DetailsHeader>
        <HeaderContent>
          <Eyebrow>Informations & caractéristiques</Eyebrow>
          <DetailsTitle>
            <FiInfo size={19} />
            Détails du produit
          </DetailsTitle>
        </HeaderContent>

        <HeaderNumber>{String(entries.length).padStart(2, "0")}</HeaderNumber>
      </DetailsHeader>

      <DetailsList>
        {entries.map(([key, value]) => (
          <DetailItem key={key}>
            <span>{labels[key] || key}</span>
            <span>{String(value)}</span>
          </DetailItem>
        ))}
      </DetailsList>

      <DetailsFooter>
        <FiArrowUpRight size={14} />
        Les caractéristiques de cet article
      </DetailsFooter>
    </DetailsWrapper>
  );
}
