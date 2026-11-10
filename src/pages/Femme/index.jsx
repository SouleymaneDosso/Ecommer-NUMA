
import React, { useState, useEffect, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiSearch,
  FiChevronDown,
  FiArrowUpRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Utils/Context";
import Boutonsfavoris from "../../components/Boutonsfavoris";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

/* =========================================================
   PAGE
========================================================= */

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 3rem 5% 6rem;

  background: ${({ $isdark }) => ($isdark ? "#101010" : "#f8f7f3")};
  color: ${({ $isdark }) => ($isdark ? "#f7f5f0" : "#171714")};

  transition: background 0.3s ease, color 0.3s ease;

  @media (max-width: 900px) {
    padding: 2.5rem 3% 4rem;
  }

  @media (max-width: 600px) {
    padding: 1.5rem 3% 3rem;
  }
`;

/* =========================================================
   HEADER
========================================================= */

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1050px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.8rem;
  }
`;

const TitleArea = styled.div`
  flex-shrink: 0;
`;

const Eyebrow = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.9rem;

  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;

  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#888")};

  &::before {
    content: "";
    width: 27px;
    height: 1px;
    background: currentColor;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3rem, 6vw, 5.4rem);
  line-height: 0.95;
  font-weight: 400;
  letter-spacing: -3px;
`;

const HeaderDescription = styled.p`
  margin: 1rem 0 0;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};
  font-size: 0.83rem;
  letter-spacing: 0.2px;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.8rem;
  flex-wrap: wrap;

  @media (max-width: 1050px) {
    justify-content: flex-start;
  }
`;

/* =========================================================
   SEARCH
========================================================= */

const SearchBox = styled.div`
  position: relative;
  width: 220px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ $isdark }) => ($isdark ? "#999" : "#888")};
  pointer-events: none;
`;

const SearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  padding: 0 14px 0 40px;

  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#dedbd3")};
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#171714")};

  outline: none;
  font-size: 16px;
  transition: border 0.2s ease;

  &:focus {
    border-color: ${({ $isdark }) => ($isdark ? "#aaa" : "#171714")};
  }

  &::placeholder {
    color: #999;
  }
`;

/* =========================================================
   FILTERS
========================================================= */

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px;

  background: ${({ $isdark }) => ($isdark ? "#191919" : "#eeece6")};
  border-radius: 40px;

  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const FilterButton = styled.button`
  flex-shrink: 0;
  border: none;
  border-radius: 30px;
  padding: 10px 15px;

  background: ${({ $active, $isdark }) =>
    $active ? ($isdark ? "#f5f2eb" : "#171714") : "transparent"};

  color: ${({ $active, $isdark }) =>
    $active ? ($isdark ? "#171714" : "#fff") : $isdark ? "#aaa" : "#555"};

  font-size: 0.61rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: ${({ $active, $isdark }) =>
      $active ? undefined : $isdark ? "#fff" : "#111"};
  }
`;

/* =========================================================
   SORT
========================================================= */

const SortBox = styled.div`
  position: relative;
`;

const Select = styled.select`
  appearance: none;
  height: 45px;
  min-width: 150px;
  padding: 0 35px 0 13px;

  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#dedbd3")};
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#171714")};

  font-size: 0.7rem;
  cursor: pointer;
  outline: none;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const SelectIcon = styled(FiChevronDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#555")};
`;

/* =========================================================
   COLLECTION INFO
========================================================= */

const CollectionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ $isdark }) => ($isdark ? "#292929" : "#e4e1da")};
`;

const CollectionLabel = styled.span`
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};
  font-size: 0.65rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const ProductCount = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  color: ${({ $isdark }) => ($isdark ? "#ddd" : "#333")};
`;

/* =========================================================
   GRID
========================================================= */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.5rem 1.3rem;
  }

  @media (min-width: 1150px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 3rem 1.5rem;
  }

  @media (max-width: 500px) {
    gap: 1.6rem 0.65rem;
  }
`;

/* =========================================================
   CARD
========================================================= */

const ProductCard = styled.article`
  min-width: 0;
  cursor: pointer;
  animation: ${fadeUp} 0.55s ease both;
  transition: transform 0.35s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 600px) {
    &:hover {
      transform: none;
    }
  }
`;

/* =========================================================
   IMAGE
========================================================= */

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ $isdark }) => ($isdark ? "#1d1d1d" : "#ebe9e3")};
`;

const ProductImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  transition: opacity 0.5s ease, transform 0.8s ease;

  ${ProductCard}:hover & {
    transform: scale(1.045);
  }
`;

const ImageShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.12),
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.08)
  );
  pointer-events: none;
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;

  padding: 7px 10px;

  background: ${({ $promo }) => ($promo ? "#a43b32" : "#f8f6f0")};
  color: ${({ $promo }) => ($promo ? "#fff" : "#171714")};

  font-size: 0.52rem;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;

  @media (max-width: 600px) {
    top: 7px;
    left: 7px;
    padding: 5px 7px;
    font-size: 0.43rem;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 3;

  padding: 6px 9px;
  background: #a43b32;
  color: #fff;

  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.7px;

  @media (max-width: 600px) {
    left: 7px;
    bottom: 7px;
    padding: 5px 6px;
    font-size: 0.48rem;
  }
`;

/* =========================================================
   FAVORITES
========================================================= */

const FavoriteWrapper = styled.div`
  position: absolute;
  top: 11px;
  right: 11px;
  z-index: 4;

  width: 37px;
  height: 37px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);

  @media (max-width: 600px) {
    top: 7px;
    right: 7px;
    width: 31px;
    height: 31px;
  }
`;

/* =========================================================
   PRODUCT INFO
========================================================= */

const CardContent = styled.div`
  padding: 0.9rem 0.1rem 0;
`;

const ProductTitle = styled.h2`
  min-width: 0;
  margin: 0;

  color: ${({ $isdark }) => ($isdark ? "#f7f5f0" : "#171714")};

  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.98rem;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.1px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 600px) {
    font-size: 0.78rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const ProductPrice = styled.span`
  color: ${({ $promo, $isdark }) =>
    $promo ? "#b04439" : $isdark ? "#f0eee8" : "#171714"};

  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.1px;

  @media (max-width: 600px) {
    font-size: 0.73rem;
  }
`;

const OldPrice = styled.span`
  color: ${({ $isdark }) => ($isdark ? "#888" : "#999")};
  font-size: 0.72rem;
  text-decoration: line-through;
  text-decoration-thickness: 1px;

  @media (max-width: 600px) {
    font-size: 0.64rem;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-top: 11px;
`;

const Gadget = styled.span`
  font-size: 0.5rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ $isdark }) => ($isdark ? "#999" : "#888")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Validation = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  font-size: 0.56rem;
  font-weight: 600;

  color: ${({ $disponible }) => ($disponible ? "#39815b" : "#b04439")};

  @media (max-width: 600px) {
    font-size: 0.47rem;
  }
`;

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = styled.div`
  padding: 5rem 1rem;
  text-align: center;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};

  h2 {
    margin: 0 0 0.7rem;
    color: ${({ $isdark }) => ($isdark ? "#fff" : "#171714")};
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.8rem;
    font-weight: 400;
  }

  p {
    font-size: 0.8rem;
  }
`;

/* =========================================================
   LOAD MORE
========================================================= */

const LoadMore = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4rem auto 0;
  padding: 14px 30px;

  border: 1px solid ${({ $isdark }) => ($isdark ? "#777" : "#171714")};
  background: transparent;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#171714")};

  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: ${({ $isdark }) => ($isdark ? "#fff" : "#171714")};
    color: ${({ $isdark }) => ($isdark ? "#171714" : "#fff")};
  }
`;

/* =========================================================
   SKELETON
========================================================= */

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 1rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const SkeletonCard = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(90deg, #eee 0%, #ddd 50%, #eee 100%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.2s infinite linear;
`;

/* =========================================================
   MODAL
========================================================= */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  padding: 1rem;

  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.68);
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 410px;
  padding: 2.5rem 2rem;
  box-sizing: border-box;

  background: #f8f7f3;
  color: #171714;
  text-align: center;

  h2 {
    margin: 0 0 0.8rem;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.7rem;
    font-weight: 400;
  }

  p {
    color: #777;
    line-height: 1.7;
    font-size: 0.85rem;
  }
`;

const ModalButton = styled.button`
  margin-top: 1rem;
  padding: 13px 26px;
  border: 1px solid #171714;
  background: #171714;
  color: white;

  cursor: pointer;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 1.3px;
  text-transform: uppercase;

  transition: all 0.25s ease;

  &:hover {
    background: transparent;
    color: #171714;
  }
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function Femme() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const $isdark = theme === "light";

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  const [filter, setFilter] = useState("tout");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(12);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  /* =========================================================
     STOCK
  ========================================================= */

  const calculStock = (stockParVariation = {}) => {
    return Object.values(stockParVariation).reduce((total, tailles) => {
      return (
        total +
        Object.values(tailles).reduce((n, v) => n + Number(v || 0), 0)
      );
    }, 0);
  };

  /* =========================================================
     PRIX ET RÉDUCTION
  ========================================================= */

  const calculReduction = (prixAvant, prixActuel) => {
    const ancien = Number(prixAvant);
    const actuel = Number(prixActuel);

    if (
      !Number.isFinite(ancien) ||
      !Number.isFinite(actuel) ||
      ancien <= actuel ||
      ancien <= 0
    ) {
      return 0;
    }

    return Math.round(((ancien - actuel) / ancien) * 100);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("fr-FR") + " FCFA";
  };

  /* =========================================================
     FETCH PRODUITS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

        if (!res.ok) {
          throw new Error("Impossible de récupérer les produits.");
        }

        const data = await res.json();

        const valid = data.filter(
          (p) =>
            p.images?.length &&
            p.genre?.toLowerCase() === "femme" &&
            !(p.precommande === true && p.disponible === false),
        );

        if (!mounted) return;

        setProducts(valid);

        const indexes = {};

        valid.forEach((p) => {
          const mainIndex = p.images.findIndex((img) => img.isMain);
          indexes[p._id] = mainIndex >= 0 ? mainIndex : 0;
        });

        setImageIndexes(indexes);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     FAVORIS
  ========================================================= */

  useEffect(() => {
    if (!token) {
      setFavorites([]);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de récupération des favoris");
        return res.json();
      })
      .then((data) => {
        setFavorites(data.map((f) => f.productId?._id).filter(Boolean));
      })
      .catch((error) => console.error("Erreur favoris :", error));
  }, [token]);

  const toggleFavorite = async (id) => {
    if (!token) {
      setShowModal(true);
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
          body: JSON.stringify({
            productId: id,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        if (data.active) {
          setFavorites((prev) =>
            prev.includes(id) ? prev : [...prev, id],
          );
        } else {
          setFavorites((prev) => prev.filter((f) => f !== id));
        }
      }
    } catch (error) {
      console.error("Erreur favoris :", error);
    }
  };

  /* =========================================================
     CAROUSEL AUTOMATIQUE
  ========================================================= */

  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };

        products.forEach((p) => {
          if (!p.images?.length) return;

          updated[p._id] = ((prev[p._id] || 0) + 1) % p.images.length;
        });

        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [products]);

  /* =========================================================
     FILTRE / RECHERCHE / TRI
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let filtered =
      filter === "tout"
        ? [...products]
        : products.filter(
            (p) => p.categorie?.toLowerCase().trim() === filter,
          );

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    if (sort === "asc") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "desc") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [products, filter, sort, search]);

  const visibleProducts = filteredProducts.slice(0, limit);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <PageWrapper $isdark={$isdark}>
        <SkeletonGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </SkeletonGrid>
      </PageWrapper>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <PageWrapper $isdark={$isdark}>
      <PageHeader>
        <TitleArea>
          <Eyebrow $isdark={$isdark}>Collection 2026</Eyebrow>
          <PageTitle>Femme.</PageTitle>
          <HeaderDescription $isdark={$isdark}>
            L'élégance se révèle dans chaque détail.
          </HeaderDescription>
        </TitleArea>

        <ControlsWrapper>
          <SearchBox>
            <SearchIcon $isdark={$isdark} />

            <SearchInput
              $isdark={$isdark}
              placeholder="Rechercher une pièce..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLimit(12);
              }}
            />
          </SearchBox>

          <FilterWrapper $isdark={$isdark}>
            {["tout", "haut", "bas", "robe", "chaussure"].map((cat) => (
              <FilterButton
                key={cat}
                $active={filter === cat}
                $isdark={$isdark}
                onClick={() => {
                  setFilter(cat);
                  setLimit(12);
                }}
              >
                {cat === "tout" ? "Tout" : cat}
              </FilterButton>
            ))}
          </FilterWrapper>

          <SortBox>
            <Select
              $isdark={$isdark}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Trier par</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </Select>

            <SelectIcon $isdark={$isdark} />
          </SortBox>
        </ControlsWrapper>
      </PageHeader>

      <CollectionInfo $isdark={$isdark}>
        <CollectionLabel $isdark={$isdark}>
          Notre sélection
        </CollectionLabel>

        <ProductCount $isdark={$isdark}>
          {filteredProducts.length} article
          {filteredProducts.length > 1 ? "s" : ""}
        </ProductCount>
      </CollectionInfo>

      {visibleProducts.length > 0 ? (
        <Grid>
          {visibleProducts.map((p) => {
            const isFav = favorites.includes(p._id);
            const totalStock = calculStock(p.stockParVariation);

            const reduction = calculReduction(p.prixAvant, p.price);

            const isPromo =
              Number(p.prixAvant) > Number(p.price) &&
              p.prixAvant !== null &&
              p.prixAvant !== undefined;

            return (
              <ProductCard
                key={p._id}
                onClick={() => navigate(`/produit/${p._id}`)}
              >
                <ImageWrapper $isdark={$isdark}>
                  {p.images.map((img, index) => (
                    <ProductImage
                      key={`${p._id}-${index}`}
                      src={img.url}
                      alt={p.title}
                      loading="lazy"
                      $active={imageIndexes[p._id] === index}
                    />
                  ))}

                  <ImageShade />

                  {p.badge && (
                    <Badge $promo={p.badge === "promo"}>
                      {p.badge === "promo"
                        ? "Promotion"
                        : p.badge === "new"
                          ? "Nouveauté"
                          : p.badge}
                    </Badge>
                  )}

                  {isPromo && reduction > 0 && (
                    <DiscountBadge>
                      -{reduction}%
                    </DiscountBadge>
                  )}

                  
                    <Boutonsfavoris
                      active={isFav}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p._id);
                      }}
                    />
                  
                </ImageWrapper>

                <CardContent>
                  <ProductTitle $isdark={$isdark}>
                    {p.title}
                  </ProductTitle>

                  <PriceRow>
                    <ProductPrice $isdark={$isdark} $promo={isPromo}>
                      {formatPrice(p.price)}
                    </ProductPrice>

                    {isPromo && (
                      <OldPrice $isdark={$isdark}>
                        {formatPrice(p.prixAvant)}
                      </OldPrice>
                    )}
                  </PriceRow>

                  <ProductMeta>
                    {p.gadget ? (
                      <Gadget $isdark={$isdark}>
                        {p.gadget}
                      </Gadget>
                    ) : (
                      <span />
                    )}

                    <Validation $disponible={totalStock > 0}>
                      {totalStock > 10 ? (
                        <>
                          <FiCheckCircle />
                          En stock
                        </>
                      ) : totalStock > 0 ? (
                        <>
                          <FiAlertCircle />
                          Plus que {totalStock}
                        </>
                      ) : (
                        <>
                          <FiXCircle />
                          Épuisé
                        </>
                      )}
                    </Validation>
                  </ProductMeta>
                </CardContent>
              </ProductCard>
            );
          })}
        </Grid>
      ) : (
        <EmptyState $isdark={$isdark}>
          <h2>Aucun article trouvé</h2>
          <p>Essayez une autre recherche ou sélectionnez une autre catégorie.</p>
        </EmptyState>
      )}

      {visibleProducts.length < filteredProducts.length && (
        <LoadMore
          $isdark={$isdark}
          onClick={() => setLimit((prev) => prev + 12)}
        >
          Découvrir davantage
          <FiArrowUpRight />
        </LoadMore>
      )}

      <ModalOverlay $show={showModal}>
        <ModalContent>
          <h2>Un instant...</h2>

          <p>
            Vous devez être connecté pour ajouter un article à vos favoris.
          </p>

          <ModalButton
            onClick={() => {
              setShowModal(false);
              navigate("/login");
            }}
          >
            Se connecter
          </ModalButton>
        </ModalContent>
      </ModalOverlay>
    </PageWrapper>
  );
}
