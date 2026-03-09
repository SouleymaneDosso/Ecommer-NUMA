import { useState, useEffect, useMemo, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

// ===============================
// ANIMATIONS
// ===============================
const fadeUp = keyframes`
from {
  opacity: 0;
  transform: translateY(40px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
`;

const fadeIn = keyframes`
from {opacity:0;}
to {opacity:1;}
`;

// ===============================
// WRAPPERS
// ===============================
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;
  padding-bottom: 120px;
  background: #fafafa;
`;

// ===============================
// HERO
// ===============================
const Hero = styled.div`
  height: 75vh;
  position: relative;
  overflow: hidden;
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  filter: blur(1px) brightness(0.85);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  color: white;
  max-width: 500px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);

  h1 {
    font-size: 3rem;
    animation: ${fadeIn} 1.2s ease forwards;
  }
`;

const HeroBtn = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 14px 26px;
  background: white;
  color: black;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  &:hover {
    transform: scale(1.05);
  }
`;

// ===============================
// HORIZONTAL SCROLL PRODUITS
// ===============================
const ScrollWrapper = styled.div`
  padding: 0 40px;
`;

const Scroll = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

const Card = styled.div`
  min-width: 230px;
  position: relative;
  animation: ${fadeIn} 0.8s ease forwards;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s;
  }
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  transition: transform 0.4s, filter 0.5s;
  filter: blur(10px);
  opacity: 0;
`;

const Title = styled.p`
  text-align: center;
  font-weight: 600;
  margin-top: 8px;
`;

const Price = styled.p`
  text-align: center;
  color: #555;
`;

const CartBtn = styled.button`
  position: absolute;
  bottom: 80px;
  right: 10px;
  background: black;
  color: white;
  border: none;
  padding: 8px;
  opacity: 0;
  cursor: pointer;

  ${Card}:hover & {
    opacity: 1;
  }
`;

// ===============================
// COLLECTIONS H/F
// ===============================
const Collections = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const CollectionCard = styled(Link)`
  flex: 1;
  min-width: 300px;
  height: 400px;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: white;

  @media(max-width:768px){
    width: 100%;
    height: 300px;
  }
`;

const CollectionImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s;
  ${CollectionCard}:hover & {
    transform: scale(1.05);
  }
`;

const CollectionOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: center;
`;

// ===============================
// COMPONENT
// ===============================
export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [genre, setGenre] = useState("homme");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const heroProducts = useMemo(() => products.filter((p) => p.hero), [products]);

  useEffect(() => {
    if (heroProducts.length === 0) return;
    const interval = setInterval(() => setSlide((s) => (s + 1) % heroProducts.length), 3500);
    return () => clearInterval(interval);
  }, [heroProducts]);

  const img = (p) => {
    if (!p?.images?.length) return "";
    const url = p.images[0].url;
    return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

  const hommeImage = useMemo(() => {
    const p = products.find((prod) => prod.genre?.toLowerCase() === "homme");
    return p ? img(p) : "";
  }, [products]);

  const femmeImage = useMemo(() => {
    const p = products.find((prod) => prod.genre?.toLowerCase() === "femme");
    return p ? img(p) : "";
  }, [products]);

  return (
    <Wrapper>
      {/* HERO */}
      <Hero>
        {heroProducts.map((p, i) => (
          <Slide key={p._id} $active={i === slide} style={{ backgroundImage: `url(${img(p)})` }} />
        ))}
        <Overlay />
        <HeroText>
          <h1>Nouvelle Collection</h1>
          <HeroBtn to="/collections">Découvrir</HeroBtn>
        </HeroText>
      </Hero>

      {/* SWITCH PRODUITS H/F */}
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", fontWeight: "600", fontSize: "1.3rem" }}>
        <div style={{ cursor: "pointer", borderBottom: genre === "homme" ? "3px solid black" : "none" }} onClick={() => setGenre("homme")}>Homme</div>
        <div style={{ cursor: "pointer", borderBottom: genre === "femme" ? "3px solid black" : "none" }} onClick={() => setGenre("femme")}>Femme</div>
      </div>

      {/* PRODUITS HORIZONTAUX */}
      <ScrollWrapper>
        <Scroll>
          {products
            .filter((p) => p.genre?.toLowerCase() === genre)
            .slice(0, 6)
            .map((p) => (
              <Card key={p._id}>
                <ProductLink to={`/produit/${p._id}`}>
                  <ProductImg
                    src={img(p)}
                    alt={p.title}
                    onLoad={(e) => {
                      e.currentTarget.style.filter = "blur(0)";
                      e.currentTarget.style.opacity = 1;
                    }}
                  />
                  <Title>{p.title}</Title>
                  <Price>{p.price} FCFA</Price>
                </ProductLink>
                <CartBtn>
                  <FiShoppingCart />
                </CartBtn>
              </Card>
            ))}
        </Scroll>
      </ScrollWrapper>

      {/* COLLECTIONS */}
      <Collections>
        <CollectionCard to="/homme">
          {hommeImage && <CollectionImg src={hommeImage} alt="Collection Homme" />}
          <CollectionOverlay>Collection Homme</CollectionOverlay>
        </CollectionCard>

        <CollectionCard to="/femme">
          {femmeImage && <CollectionImg src={femmeImage} alt="Collection Femme" />}
          <CollectionOverlay>Collection Femme</CollectionOverlay>
        </CollectionCard>
      </Collections>
    </Wrapper>
  );
}