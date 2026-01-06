import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoaderWrapper, Loader } from "../../Utils/Rotate";
import { ThemeContext } from "../../Utils/Context";
import { keyframes } from "styled-components";
/* ===== STYLES PAGE ===== */
const PageWrapper = styled.main`
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductCard = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background: ${({ $isdark }) => ($isdark ? "#1e1e1e" : "#fff")};
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)"};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;
const ProductImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  background-color: ${({ type }) => (type === "new" ? "#2563eb" : "#ef4444")};
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: 12px 14px;
`;

const ProductTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
`;

const ProductPrice = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewButton = styled(Link)`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  background: #007bff;
  color: white;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: all 0.3s ease;
`;

const pop = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  50% { transform: scale(0.9); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;
const burst = keyframes`
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
`;

const FavoriteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ $favorite }) => ($favorite ? "#ef4444" : "#aaa")};
  transition:
    color 0.3s ease,
    transform 0.3s ease;

  &:active {
    animation: ${pop} 0.5s ease forwards;
  }
  position: relative;
  overflow: visible;

  &:active::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, #ef4444 20%, transparent 20%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: ${burst} 0.5s forwards;
  }
`;

/* ===== COMPONENT ===== */
export default function Homme() {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Helper pour image principale
  const getMainImage = (p) =>
    p.images?.find((img) => img.isMain)?.url ||
    p.images?.[0]?.url ||
    "/placeholder.jpg";

  // Charger les produits
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => {
        const valid = data.filter(
          (p) => p && p.images?.length && p.genre === "homme"
        );
        setProducts(valid);
        // Preload images
        const promises = valid.flatMap((p) =>
          p.images.map(
            (img) =>
              new Promise((res) => {
                const i = new Image();
                i.src = img.url;
                i.onload = res;
                i.onerror = res;
              })
          )
        );
        Promise.all(promises).then(() => setLoading(false));
      })
      .catch(console.error);
  }, []);
  // Initialiser l'image principale pour chaque produit
  useEffect(() => {
    if (!products.length) return;
    const initialIndexes = {};
    products.forEach((p) => {
      if (!p?._id) return;
      const mainIndex = p.images?.findIndex((img) => img.isMain);
      initialIndexes[p._id] = mainIndex >= 0 ? mainIndex : 0;
    });
    setImageIndexes(initialIndexes);
  }, [products]);

  // Carousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        products.forEach((p) => {
          if (!p?._id) return; // Sécurité
          const current = prev[p._id] || 0;
          updated[p._id] = (current + 1) % (p.images?.length || 1);
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  // Charger favoris
  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setFavorites(data.map((f) => f.productId?._id).filter(Boolean))
      )
      .catch(console.error);
  }, [token]);

  // Toggle favori
  const toggleFavorite = async (id) => {
    if (!token) {
      navigate("/compte");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        if (data.active) setFavorites((prev) => [...prev, id]);
        else setFavorites((prev) => prev.filter((f) => f !== id));
      }
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  if (loading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );

  return (
    <PageWrapper onClick={() => setActiveCardId(null)} $isdark={$isdark}>
      <PageTitle>Collection Homme</PageTitle>
      <Grid>
        {products
          .filter((p) => p && p._id) // filtrer les produits invalides
          .map((p) => {
            const pid = p._id;
            const isActive = activeCardId === pid;
            const isFav = favorites.includes(pid);

            return (
              <ProductCard
                $isdark={$isdark}
                key={pid}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCardId(isActive ? null : pid);
                }}
              >
                <ProductImageWrapper>
                  <ProductImage
                    src={
                      p.images?.[imageIndexes[pid]]?.url || "/placeholder.jpg"
                    }
                    alt={p.title}
                  />

                  {p.badge && <Badge type={p.badge}>{p.badge}</Badge>}
                  {isActive && (
                    <ViewButton to={`/produit/${pid}`} $visible={true}>
                      Voir produit
                    </ViewButton>
                  )}
                </ProductImageWrapper>

                <CardContent>
                  <ProductTitle>{p.title}</ProductTitle>
                  <ActionWrapper>
                    <ProductPrice>{p.price} FCFA</ProductPrice>
                    <FavoriteButton
                      $favorite={isFav}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pid);
                      }}
                    >
                      {isFav ? <FaHeart /> : <FiHeart />}
                    </FavoriteButton>
                  </ActionWrapper>
                </CardContent>
              </ProductCard>
            );
          })}
      </Grid>
    </PageWrapper>
  );
}
