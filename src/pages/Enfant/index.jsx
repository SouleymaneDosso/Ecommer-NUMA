import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"; // cœur plein
import { Link, useNavigate } from "react-router-dom";


/* ===== MODAL ===== */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;
const ModalText = styled.p`
  margin-bottom: 1.5rem;
`;
const ModalButton = styled.button`
  padding: 10px 20px;
  background: ${({ $primary }) => ($primary ? "#2563eb" : "#ef4444")};
  color: #fff;
  border: none;
  border-radius: 8px;
  margin: 0 0.5rem;
  cursor: pointer;
  font-weight: 600;
`;

/* ===== PAGE ===== */
const PageWrapper = styled.main`
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
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
  background: ${({ $active, theme }) => ($active ? theme.primary : theme.bg)};
  color: ${({ $active, theme }) => ($active ? "white" : theme.text)};
  cursor: pointer;
  font-weight: 500;
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
  background: ${({ theme }) => theme.bg || "#fff"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  background: ${({ theme }) => theme.primary || "#007bff"};
  color: white;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: all 0.3s ease;
`;

const FavoriteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ $favorite }) => ($favorite ? "#ef4444" : "#000")};
  transition: transform 0.2s;
  &:active {
    transform: scale(1.2);
  }
`;

/* ===== COMPONENT ===== */
function Enfant() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("tous");
  const [favorites, setFavorites] = useState([]);
  const [activeView, setActiveView] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageIndexes, setImageIndexes] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Charger produits
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/produits`)
      .then((res) => res.json())
      .then((data) => setProducts(data.filter((p) => p.genre === "enfant")))
      .catch(console.error);
  }, []);

  // Carousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        products.forEach((p) => {
          if (!p.imageUrl || p.imageUrl.length <= 1) return;
          const current = prev[p._id] || 0;
          updated[p._id] = (current + 1) % p.imageUrl.length;
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
      .then((data) => setFavorites(data.map((f) => f.productId._id)))
      .catch(console.error);
  }, [token]);

  // Toggle favori
  const toggleFavorite = async (id) => {
    if (!token) {
      setShowModal(true);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.active) setFavorites((prev) => [...prev, id]);
        else setFavorites((prev) => prev.filter((f) => f !== id));
      }
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  const filteredProducts = useMemo(() => {
    let data = products;
    if (filter !== "tous")
      data = data.filter((p) => p.categorie === filter || p.badge === filter);
    return data;
  }, [filter, products]);

  const filters = [
    { label: "Tous", value: "tous" },
    { label: "Hauts", value: "haut" },
    { label: "Bas", value: "bas" },
    { label: "Robes", value: "robe" },
    { label: "Chaussures", value: "chaussure" },
    { label: "Promo", value: "promo" },
    { label: "Nouveaux", value: "new" },
  ];

  return (
    <>
      <ModalOverlay $visible={showModal}>
        <ModalContent>
          <ModalTitle>Connectez-vous</ModalTitle>
          <ModalText>
            Vous devez vous connecter pour ajouter ce produit à vos favoris.
          </ModalText>
          <div>
            <ModalButton $primary onClick={() => navigate("/compte")}>
              Se connecter / S'inscrire
            </ModalButton>
            <ModalButton onClick={() => setShowModal(false)}>
              Annuler
            </ModalButton>
          </div>
        </ModalContent>
      </ModalOverlay>

      <PageWrapper onClick={() => setActiveView(null)}>
        <PageTitle>Collection Enfant</PageTitle>

        <FiltersWrapper>
          {filters.map((f) => (
            <FilterButton
              key={f.value}
              $active={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </FilterButton>
          ))}
        </FiltersWrapper>

        <Grid>
          {filteredProducts
            .filter((p) => p && p._id) // ← ignore les produits invalides
            .map((p) => {
              const isFav = favorites.includes(p._id);
              const currentImageIndex = imageIndexes[p._id] || 0;

              return (
                <ProductCard
                  key={p._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView(p._id);
                  }}
                >
                  <ProductImageWrapper>
                    <ProductImage
                      src={p.imageUrl[currentImageIndex]}
                      alt={p.title}
                    />
                    {p.badge && <Badge type={p.badge}>{p.badge}</Badge>}
                    <ViewButton
                      to={`/produit/${p._id}`}
                      $visible={activeView === p._id}
                    >
                      Voir produit
                    </ViewButton>
                  </ProductImageWrapper>

                  <CardContent>
                    <ProductTitle>{p.title}</ProductTitle>
                    <ActionWrapper>
                      <ProductPrice>{p.price} FCFA</ProductPrice>
                      <FavoriteButton
                        $favorite={isFav}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p._id);
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
    </>
  );
}

export default Enfant;
