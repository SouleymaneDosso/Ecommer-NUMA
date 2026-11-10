
import { useState, useEffect, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { FiBookmark } from "react-icons/fi";
import { HiBookmark } from "react-icons/hi2";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Bookmark,
  Sparkles
} from "lucide-react";
import { ThemeContext } from "../../Utils/Context";

/* =====================================================
   ANIMATIONS
===================================================== */

const reveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pop = keyframes`
  0% { transform: scale(1); }
  45% { transform: scale(1.22); }
  75% { transform: scale(.92); }
  100% { transform: scale(1); }
`;

/* =====================================================
   PAGE
===================================================== */

const Page = styled.main`
  --paper: ${({ $dark }) => $dark ? "#191919" : "#F3F0E9"};
  --surface: ${({ $dark }) => $dark ? "#222220" : "#FFFFFF"};
  --ink: ${({ $dark }) => $dark ? "#F4F0E9" : "#201F1C"};
  --muted: ${({ $dark }) => $dark ? "#A8A39A" : "#77736B"};
  --line: ${({ $dark }) => $dark ? "#393834" : "#DEDAD1"};
  --accent: #927657;

  background: var(--paper);
  color: var(--ink);
  min-height: 80vh;
  padding-bottom: 100px;
  transition: background .35s, color .35s;

  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  width: min(1440px, 91%);
  margin: auto;

  @media(max-width: 600px) {
    width: 90%;
  }
`;

/* =====================================================
   HEADER ÉDITORIAL
===================================================== */

const Header = styled.section`
  padding: 95px 0 65px;
  border-bottom: 1px solid var(--line);
  animation: ${reveal} .7s ease both;

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .eyebrow::before {
    content: "";
    width: 25px;
    height: 1px;
    background: currentColor;
  }

  h1 {
    font-family: Georgia, serif;
    font-size: clamp(55px, 9vw, 112px);
    font-weight: 400;
    line-height: .95;
    letter-spacing: -5px;
    margin: 25px 0;
  }

  h1 em {
    color: var(--accent);
    font-weight: 400;
  }

  .description {
    max-width: 440px;
    color: var(--muted);
    font-size: 13px;
    line-height: 2;
  }

  @media(max-width: 600px) {
    padding: 65px 0 45px;

    h1 {
      letter-spacing: -2.5px;
    }
  }
`;

const HeaderMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 45px;
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  .count {
    color: var(--accent);
    font-weight: 800;
  }
`;

/* =====================================================
   GRILLE PRODUITS
===================================================== */

const Content = styled.section`
  padding-top: 55px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 48px 18px;

  @media(max-width: 1050px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media(max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 35px 12px;
  }
`;

const ProductCard = styled.article`
  min-width: 0;
  animation: ${reveal} .65s ease both;

  .photo {
    position: relative;
    display: block;
    height: 430px;
    overflow: hidden;
    background: ${({ $dark }) => $dark ? "#302F2B" : "#E6E1D8"};
  }

  .photo img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .9s cubic-bezier(.2,.7,.2,1);
  }

  &:hover .photo img {
    transform: scale(1.055);
  }

  .details {
    padding-top: 17px;
  }

  .category {
    color: var(--accent);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  h2 {
    font-family: Georgia, serif;
    font-size: 19px;
    font-weight: 400;
    line-height: 1.3;
    margin: 9px 0;
    color: var(--ink);
  }

  .price {
    color: var(--muted);
    font-size: 12px;
    letter-spacing: .4px;
  }

  @media(max-width: 700px) {
    .photo {
      height: 270px;
    }

    h2 {
      font-size: 16px;
    }
  }

  @media(max-width: 390px) {
    .photo {
      height: 220px;
    }
  }
`;

/* =====================================================
   BOUTON FAVORI — BOOKMARK PREMIUM
===================================================== */

const FavoriteWrapper = styled.div`
  position: absolute;
  top: 13px;
  right: 13px;
  z-index: 5;

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

const FavoriteButton = styled.button`
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $active }) => $active ? "#171717" : "#dedbd5"};
  border-radius: 50%;
  background: ${({ $active }) => $active ? "#171717" : "#fff"};
  color: ${({ $active }) => $active ? "#f5f0e8" : "#292929"};
  cursor: pointer;
  transition: all .3s ease;

  svg {
    width: 19px;
    height: 19px;
    animation: ${({ $animate }) => $animate ? pop : "none"} .4s ease;
  }

  &:hover {
    border-color: #171717;
    transform: translateY(-2px);
    box-shadow: 0 5px 14px rgba(0,0,0,.09);
  }

  &:active {
    transform: scale(.94);
  }

  &:focus-visible {
    outline: 2px solid #a47c50;
    outline-offset: 3px;
  }

  @media(max-width: 480px) {
    width: 41px;
    height: 41px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 11px);
  left: 50%;
  transform: translateX(-50%);
  background: #171717;
  color: white;
  padding: 8px 11px;
  font-size: 9px;
  letter-spacing: 1px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: .25s;
`;

/* =====================================================
   ACTION PRODUIT
===================================================== */

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 17px;
  padding-top: 13px;
  border-top: 1px solid var(--line);
`;

const ViewLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--ink);
  text-decoration: none;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: color .3s;

  &:hover {
    color: var(--accent);
  }
`;

const ArrowButton = styled(Link)`
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink);
  transition: .3s;

  &:hover {
    background: var(--ink);
    color: var(--paper);
  }
`;

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = styled.div`
  padding: 100px 20px;
  text-align: center;
  border: 1px solid var(--line);
  animation: ${reveal} .6s ease both;

  .icon {
    width: 70px;
    height: 70px;
    margin: 0 auto 25px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 50%;
    color: var(--accent);
  }

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 400;
    margin: 0 0 15px;
  }

  p {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
    max-width: 390px;
    margin: 0 auto 30px;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 18px;
    padding: 17px 23px;
    background: var(--ink);
    color: var(--paper);
    text-decoration: none;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: .3s;
  }

  a:hover {
    background: var(--accent);
    color: white;
  }
`;

/* =====================================================
   PRINCIPAL
===================================================== */

export default function Favorie() {
  const [favorites, setFavorites] = useState([]);
  const [animatedId, setAnimatedId] = useState(null);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "light";

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "";

  const media = (url) => {
    if (!url) return "/placeholder.jpg";
    return url.startsWith("http")
      ? url
      : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  /* RÉCUPÉRATION FAVORIS */

  const fetchFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Impossible de récupérer les favoris");
      }

      const data = await res.json();

      const products = Array.isArray(data)
        ? data.map(f => f.productId).filter(p => p && p._id)
        : [];

      setFavorites(products);
    } catch (err) {
      console.error("Erreur fetch favorites:", err);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  /* SUPPRESSION FAVORI */

  const toggleFavorite = async (product) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id
        })
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la modification du favori");
      }

      const data = await res.json();

      if (data.active === false) {
        setFavorites(prev =>
          prev.filter(p => p._id !== product._id)
        );
      } else if (data.active === true) {
        setFavorites(prev =>
          prev.some(p => p._id === product._id)
            ? prev
            : [...prev, product]
        );
      }

      setAnimatedId(product._id);
      setTimeout(() => setAnimatedId(null), 450);

    } catch (err) {
      console.error("Erreur toggle favori:", err);
    }
  };

  const getMainImage = (product) =>
    product.images?.find(img => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "/placeholder.jpg";

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("fr-FR") + " FCFA";

  /* RENDER */

  return (
    <Page $dark={isDark}>
      <Container>

        <Header>
          <div className="eyebrow">
            VOTRE SÉLECTION PRIVÉE
          </div>

          <h1>
            Mes <em>favoris.</em>
          </h1>

          <p className="description">
            Retrouvez ici les pièces qui ont retenu votre attention.
            Votre sélection personnelle, réunie en un seul endroit.
          </p>

          <HeaderMeta>
            <span>NUMA — COLLECTIONS CONTEMPORAINES</span>
            <span className="count">
              {favorites.length} PIÈCE{favorites.length > 1 ? "S" : ""}
            </span>
          </HeaderMeta>
        </Header>

        <Content>
          {favorites.length === 0 ? (
            <EmptyState>
              <div className="icon">
                <Bookmark size={28} strokeWidth={1.3} />
              </div>

              <h2>Votre sélection vous attend.</h2>

              <p>
                Vous n'avez pas encore enregistré de pièce.
                Explorez nos collections et ajoutez vos coups de cœur
                à votre sélection personnelle.
              </p>

              <Link to="/collections">
                Explorer les collections
                <ArrowRight size={17} />
              </Link>
            </EmptyState>
          ) : (
            <Grid>
              {favorites.map((product, index) => (
                <ProductCard
                  key={product._id}
                  $dark={isDark}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Link
                    className="photo"
                    to={`/produit/${product._id}`}
                    aria-label={`Découvrir ${product.title}`}
                  >
                    <img
                      src={media(getMainImage(product))}
                      alt={product.title || "Produit NUMA"}
                      loading="lazy"
                    />

                    {product.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: 13,
                          left: 13,
                          padding: "8px 10px",
                          background: "#927657",
                          color: "white",
                          fontSize: 9,
                          letterSpacing: 1.5,
                          textTransform: "uppercase"
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </Link>

                  <FavoriteWrapper>
                    <FavoriteButton
                      type="button"
                      $active={true}
                      $animate={animatedId === product._id}
                      onClick={() => toggleFavorite(product)}
                      aria-label="Retirer des favoris"
                      title="Retirer des favoris"
                    >
                      <HiBookmark />
                    </FavoriteButton>

                    <Tooltip className="tooltip">
                      RETIRER DES FAVORIS
                    </Tooltip>
                  </FavoriteWrapper>

                  <div className="details">
                    <div className="category">
                      {String(product.genre || "NUMA").toUpperCase()}
                    </div>

                    <h2>{product.title}</h2>

                    <span className="price">
                      {formatPrice(product.price)}
                    </span>

                    <ProductFooter>
                      <ViewLink to={`/produit/${product._id}`}>
                        Découvrir la pièce
                        <ArrowUpRight size={15} />
                      </ViewLink>

                      <ArrowButton
                        to={`/produit/${product._id}`}
                        aria-label={`Voir ${product.title}`}
                      >
                        <ArrowUpRight size={17} />
                      </ArrowButton>
                    </ProductFooter>
                  </div>
                </ProductCard>
              ))}
            </Grid>
          )}
        </Content>

      </Container>
    </Page>
  );
}
