// src/pages/Enfant.jsx
import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { produits } from "../../data/produits";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterButton = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ active, theme }) => (active ? theme.primary : theme.bg)};
  color: ${({ active, theme }) => (active ? "white" : theme.text)};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

/* ===== GRID PRODUITS  ===== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* desktop */
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* tablette */
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* mobile */
  }
`;

const ProductCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.bg};
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.12);
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; // carré

  @media (min-width: 1025px) {
    padding-top: 110%; // desktop légèrement plus grand
  }
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background-color: ${({ type }) =>
    type === "new" ? "#2563eb" : type === "promo" ? "#ef4444" : "#000"};
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ProductPrice = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled(Link)`
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

const FavoriteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
    color: #ef4444;
  }
`;

/* ===== CAROUSEL ===== */
const ProductImageCarousel = ({ images, titre }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  return <ProductImage src={images[index]} alt={titre} />;
};

/* ===== COMPONENT PRINCIPAL ===== */
export default function Enfant() {
  const [filter, setFilter] = useState("tous");

  const produitsEnfant = useMemo(() => {
    let filtered = produits.filter((p) => p.genre === "enfant");
    if (filter === "haut") filtered = filtered.filter((p) => p.categorie === "haut");
    if (filter === "bas") filtered = filtered.filter((p) => p.categorie === "bas");
    if (filter === "chaussure") filtered = filtered.filter((p) => p.categorie === "chaussure");
    if (filter === "promo") filtered = filtered.filter((p) => p.badge === "promo");
    if (filter === "new") filtered = filtered.filter((p) => p.badge === "new");
    return filtered;
  }, [filter]);

  const filters = [
    { label: "Tous", value: "tous" },
    { label: "Hauts", value: "haut" },
    { label: "Bas", value: "bas" },
    { label: "Chaussures", value: "chaussure" },
    { label: "Promo", value: "promo" },
    { label: "Nouveaux", value: "new" },
  ];

  return (
    <PageWrapper>
      <PageTitle>Collection Enfant</PageTitle>

      {/* FILTRES */}
      <FiltersWrapper>
        {filters.map((f) => (
          <FilterButton
            key={f.value}
            active={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </FilterButton>
        ))}
      </FiltersWrapper>

      {/* GRID PRODUITS */}
      <Grid>
        {produitsEnfant.map((produit) => (
          <ProductCard key={produit.id}>
            <ProductImageWrapper>
              <ProductImageCarousel images={produit.images || [produit.image]} titre={produit.titre} />
              {produit.badge && <Badge type={produit.badge}>{produit.badge}</Badge>}
            </ProductImageWrapper>

            <CardContent>
              <ProductTitle>{produit.titre}</ProductTitle>
              <ActionWrapper>
                <ProductPrice>{produit.prix} €</ProductPrice>
                <FavoriteButton aria-label="Ajouter aux favoris">
                  <FiHeart />
                </FavoriteButton>
              </ActionWrapper>
              <ViewButton to={`/produit/${produit.id}`}>Voir produit</ViewButton>
            </CardContent>
          </ProductCard>
        ))}
      </Grid>
    </PageWrapper>
  );
}
