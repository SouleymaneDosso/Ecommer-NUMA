import { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { ThemeContext } from "../../Utils/Context";

const Card = styled.div`
  width: 260px;
 
  border-radius: 16px;
  background: ${({ $isdark }) => ($isdark ? "#1e293b" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#e2e8f0" : "#0f172a")};
  transition: transform 0.25s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-6px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;

  img {
    width: 100%;
    height: 330px;  
    object-fit: cover;     
    border-radius: 12px;
    transition: transform 0.35s ease;

    ${Card}:hover & {
      transform: scale(1.06);
    }
  }
`;


const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

const FavButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 26px;
  cursor: pointer;

  svg {
    stroke: ${({ fav }) => (fav ? "red" : "gray")};
    fill: ${({ fav }) => (fav ? "red" : "transparent")};
    transition: 0.2s;
    animation: ${({ animate }) => (animate ? pop : "none")} 0.3s ease;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${({ $type }) =>
    $type === "new" ? "#4f46e5" :
    $type === "promo" ? "#e11d48" :
    "#0ea5e9"};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-top: 10px;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 0.85rem;
  opacity: 0.8;
`;

const Price = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 8px 0;
`;

const AddButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    color: white;
    font-size: 22px;
  }

  &:hover {
    background: #4338ca;
  }
`;

export default function Carte({ title, description, price, image, badge }) {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  const [fav, setFav] = useState(false);
  const [animate, setAnimate] = useState(false);

  const toggleFav = () => {
    setFav((prev) => !prev);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <Card $isdark={$isdark}>
      <ImageWrapper>
        <img src={image} alt={title} />
        {badge && <Badge $type={badge}>{badge.toUpperCase()}</Badge>}
        <FavButton onClick={toggleFav} fav={fav} animate={animate}>
          <FiHeart />
        </FavButton>
      </ImageWrapper>
      

      <Title>{title}</Title>
      <Description>{description}</Description>
      <Price>{price} FCFA</Price>

      <AddButton><FiShoppingBag /></AddButton>
    </Card>
  );
}


