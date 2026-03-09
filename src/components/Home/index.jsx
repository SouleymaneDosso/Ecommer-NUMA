import { useEffect, useState, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

/* ------------------- STYLES ------------------- */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 100px;
  padding-bottom: 120px;
`;

/* HERO */
const Hero = styled.div`
  height: 75vh;
  position: relative;
  overflow: hidden;
`;

const fadeIn = keyframes`
  from {opacity:0;}
  to {opacity:1;}
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${(p) => (p.$active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
`;

const HeroText = styled.div`
  position: absolute;
  top: 50%;
  left: 70px;
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

/* SWITCH */
const Switch = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 1.5rem;
  font-weight: bold;
`;

const SwitchBtn = styled.div`
  cursor: pointer;
  border-bottom: ${(p) => (p.$active ? "3px solid black" : "none")};
  padding-bottom: 6px;
  transition: border 0.3s;
`;

/* SCROLL PRODUCTS HORIZONTAUX */
const ScrollWrapper = styled.div`
  position: relative;
`;

const Scroll = styled.div`
  display: flex;
  gap: 2px;
  overflow-x: auto;
  padding: 20px;
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
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  border-radius: 10px;
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

const Skeleton = styled.div`
  width: 230px;
  height: 270px;
  background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
  background-size: 400%;
  animation: shine 1.3s infinite;

  @keyframes shine {
    0% {
      background-position: 100%;
    }
    100% {
      background-position: -100%;
    }
  }
`;

/* ------------------- CAROUSEL HORIZONTAL FULL SCREEN ------------------- */
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const CarouselInner = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

const CarouselImage = styled.img`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  scroll-snap-align: start;
  transition: transform 0.5s ease, filter 0.5s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => (p.active ? "#000" : "rgba(0,0,0,0.5)")};
  transition: background 0.3s;
  cursor: pointer;
`;

const GenderText = styled.p`
  text-align: center;
  margin: 20px 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
`;

/* ------------------- GENDER BUTTON ------------------- */
const GenderBtn = styled(Link)`
  position: absolute;
  bottom: 30px;
  left: 30px;
  background: black;
  color: white;
  padding: 14px 26px;
  text-decoration: none;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
`;

/* ------------------- COMPONENT ------------------- */
function GenderCarousel({ images, link, text, paragraph }) {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const index = Math.round(
      carouselRef.current.scrollLeft / carouselRef.current.clientWidth
    );
    setActive(index);
  };

  const scrollTo = (i) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: i * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <CarouselWrapper>
        <CarouselInner ref={carouselRef} onScroll={handleScroll}>
          {images.map((imgUrl, i) => (
            <CarouselImage key={i} src={imgUrl} alt={`Collection image ${i + 1}`} />
          ))}
        </CarouselInner>
        <Dots>
          {images.map((_, i) => (
            <Dot key={i} active={i === active} onClick={() => scrollTo(i)} />
          ))}
        </Dots>
        <GenderBtn to={link}>{text}</GenderBtn>
      </CarouselWrapper>
      <GenderText>{paragraph}</GenderText>
    </>
  );
}

/* ------------------- MAIN HOME COMPONENT ------------------- */
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
    const interval = setInterval(
      () => setSlide((s) => (s + 1) % heroProducts.length),
      3500
    );
    return () => clearInterval(interval);
  }, [heroProducts]);

  const img = (p) => {
    if (!p?.images?.length) return "";
    const url = p.images[0].url;
    return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

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
      <Switch>
        <SwitchBtn $active={genre === "homme"} onClick={() => setGenre("homme")}>
          Homme
        </SwitchBtn>
        <SwitchBtn $active={genre === "femme"} onClick={() => setGenre("femme")}>
          Femme
        </SwitchBtn>
      </Switch>

      {/* PRODUITS HORIZONTAUX */}
     <ScrollWrapper>
  <Scroll>
    {products.length === 0
      ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
      : products
          .filter((p) => p.genre?.toLowerCase() === genre)
          .slice(0, 4)
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
                  style={{ filter: "blur(10px)", opacity: 0 }}
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

      {/* CAROUSEL HORIZONTAL HOMME */}
      <GenderCarousel
        images={products.filter((p) => p.genre?.toLowerCase() === "homme").slice(0, 5).map(img)}
        link="/homme"
        text="Voir Homme"
        paragraph="Nos vêtements hommes sont les meilleurs sur le marché des pièces authentiques à des prix accessibles"
      />

      {/* CAROUSEL HORIZONTAL FEMME */}
      <GenderCarousel
        images={products.filter((p) => p.genre?.toLowerCase() === "femme").slice(0, 5).map(img)}
        link="/femme"
        text="Voir Femme"
        paragraph="Nos vêtements femmes sont les meilleurs sur le marché des pièces authentiques à des prix accessibles"
      />
    </Wrapper>
  );
}