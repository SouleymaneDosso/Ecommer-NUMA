// src/pages/Collection.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


/* ===== STYLES ===== */
const PageWrapper = styled.main`
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
`;

const StairWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    min-height: auto;
    align-items: center;
  }
`;

const CollectionItem = styled.div`
  position: absolute;
  width: ${({ $width }) => $width || "35%"};
  height: ${({ $height }) => $height || "300px"};
  cursor: pointer;
  top: ${({ $top }) => $top || "0"};
  left: ${({ $left }) => $left || "0"};
  z-index: ${({ $zIndex }) => $zIndex || 1};
  overflow: hidden;
  transition: transform 0.4s ease, z-index 0s 0.4s;

  ${({ $isActive }) =>
    $isActive &&
    `
    transform: scale(1.2) rotate(0deg);
    z-index: 20;
  `}

  &:hover {
    transform: scale(1.05) rotate(0deg);
    z-index: 10;
    transition: transform 0.4s ease, z-index 0s;
  }

  @media (max-width: 768px) {
    position: relative;
    width: ${({ $mobileWidth }) => $mobileWidth || "70%"};
    height: ${({ $mobileHeight }) => $mobileHeight || "140px"};
    top: 0;
    left: 0;
    transform: rotate(0deg);
    z-index: auto;

    ${({ $isActive }) =>
      $isActive &&
      `
      transform: scale(1.15);
      z-index: 20;
    `}
  }
`;

const CollectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Label = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  font-size: 2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.7);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

/* ===== PAGE ===== */
function Collection() {
  const [images, setImages] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then(res => res.json())
      .then(data => {
        const categories = ["enfant", "femme", "homme"];
        const imgs = {};
        categories.forEach(cat => {
          const prod = data.find(p => p.genre === cat && p.imageUrl?.length > 0);
          if (prod) imgs[cat] = prod.imageUrl[0];
        });
        setImages(imgs);
      })
      .catch(console.error);
  }, []);

  const sections = [
    { genre: "enfant", label: "Enfant", $zIndex: 3, $top: "0", $left: "0", $width: "40%", $height: "350px", $rotate: "-3deg", $mobileHeight: "140px", $mobileWidth: "70%" },
    { genre: "femme", label: "Femme", $zIndex: 2, $top: "50px", $left: "30%", $width: "35%", $height: "300px", $rotate: "2deg", $mobileHeight: "120px", $mobileWidth: "65%" },
    { genre: "homme", label: "Homme", $zIndex: 1, $top: "100px", $left: "60%", $width: "30%", $height: "250px", $rotate: "-2deg", $mobileHeight: "100px", $mobileWidth: "60%" },
  ];

  const handleClick = (genre) => {
    setActiveItem(genre);
    // attendre 300ms pour animation puis naviguer
    setTimeout(() => navigate(`/${genre}`), 300);
  };

  return (
    <PageWrapper>
      <PageTitle>Nos Collections</PageTitle>
      <StairWrapper>
        {sections.map(section => (
          <CollectionItem
            key={section.genre}
            $zIndex={section.$zIndex}
            $top={section.$top}
            $left={section.$left}
            $width={section.$width}
            $height={section.$height}
            $rotate={section.$rotate}
            $mobileHeight={section.$mobileHeight}
            $mobileWidth={section.$mobileWidth}
            $isActive={activeItem === section.genre}
            onClick={() => handleClick(section.genre)}
          >
            {images[section.genre] && (
              <>
                <CollectionImage src={images[section.genre]} alt={section.label} />
                <Label>{section.label}</Label>
              </>
            )}
          </CollectionItem>
        ))}
      </StairWrapper>
    </PageWrapper>
  );
}

export default Collection;
