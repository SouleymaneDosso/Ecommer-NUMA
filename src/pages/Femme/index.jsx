import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import styled, { keyframes } from "styled-components";
import {
  FiHeart,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Utils/Context";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -600px 0;
  }

  100% {
    background-position: 600px 0;
  }
`;

/* =========================================================
   PAGE
========================================================= */

const PageWrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;

  background: ${({ $isdark }) =>
    $isdark ? "#0d0d0d" : "#f8f7f4"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  padding: 2.5rem 4% 5rem;

  transition:
    background 0.3s ease,
    color 0.3s ease;

  @media (max-width: 900px) {
    padding: 2rem 2.5% 4rem;
  }

  @media (max-width: 600px) {
    padding: 1.3rem 3% 3rem;
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

  margin-bottom: 2.5rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
`;

const TitleArea = styled.div`
  flex-shrink: 0;
`;

const Eyebrow = styled.span`
  display: block;

  margin-bottom: 0.6rem;

  font-size: 0.62rem;
  font-weight: 700;

  letter-spacing: 3px;

  text-transform: uppercase;

  color: ${({ $isdark }) =>
    $isdark ? "#999" : "#888"};
`;

const PageTitle = styled.h1`
  margin: 0;

  font-size: clamp(2rem, 4vw, 3.8rem);

  line-height: 0.95;

  font-weight: 500;

  letter-spacing: -2px;

  text-transform: uppercase;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 0.8rem;

  flex-wrap: wrap;

  @media (max-width: 900px) {
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

  left: 13px;
  top: 50%;

  transform: translateY(-50%);

  color: ${({ $isdark }) =>
    $isdark ? "#aaa" : "#777"};

  pointer-events: none;
`;

const SearchInput = styled.input`
  box-sizing: border-box;

  width: 100%;
  height: 42px;

  padding: 0 12px 0 38px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#333" : "#dedcd7"};

  background: ${({ $isdark }) =>
    $isdark ? "#151515" : "#fff"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  outline: none;

  font-size: 0.78rem;

  transition: border 0.2s ease;

  &:focus {
    border-color: ${({ $isdark }) =>
      $isdark ? "#777" : "#111"};
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

  gap: 6px;

  padding: 4px;

  background: ${({ $isdark }) =>
    $isdark ? "#151515" : "#eeece8"};

  border-radius: 30px;

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

  border-radius: 25px;

  padding: 8px 14px;

  background: ${({ $active, $isdark }) =>
    $active
      ? $isdark
        ? "#fff"
        : "#111"
      : "transparent"};

  color: ${({ $active, $isdark }) =>
    $active
      ? $isdark
        ? "#111"
        : "#fff"
      : $isdark
        ? "#aaa"
        : "#555"};

  font-size: 0.62rem;

  font-weight: 700;

  letter-spacing: 1px;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    color: ${({ $isdark }) =>
      $isdark ? "#fff" : "#111"};
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

  height: 42px;

  min-width: 145px;

  padding: 0 35px 0 13px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#333" : "#dedcd7"};

  background: ${({ $isdark }) =>
    $isdark ? "#151515" : "#fff"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  font-size: 0.72rem;

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
`;

/* =========================================================
   GRID
========================================================= */

const Grid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 1.8rem 1rem;

  @media (min-width: 700px) {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 2.2rem 1.2rem;
  }

  @media (min-width: 1150px) {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));

    gap: 2.8rem 1.4rem;
  }

  @media (max-width: 500px) {
    gap: 1.5rem 0.55rem;
  }
`;

/* =========================================================
   CARD
========================================================= */

const ProductCard = styled.article`
  min-width: 0;

  cursor: pointer;

  animation: ${fadeUp} 0.55s ease both;

  transition:
    transform 0.35s ease;

  &:hover {
    transform: translateY(-6px);
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

  background: ${({ $isdark }) =>
    $isdark ? "#191919" : "#ebe9e4"};
`;

const ProductImage = styled.img`
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: ${({ $active }) =>
    $active ? 1 : 0};

  transition:
    opacity 0.5s ease,
    transform 0.7s ease;

  ${ProductCard}:hover & {
    transform: scale(1.035);
  }
`;

const ImageShade = styled.div`
  position: absolute;

  inset: 0;

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05),
    transparent 35%,
    rgba(0, 0, 0, 0.12)
  );

  pointer-events: none;
`;

const Badge = styled.div`
  position: absolute;

  top: 12px;
  left: 12px;

  padding: 6px 9px;

  background: ${({ $isdark }) =>
    $isdark
      ? "rgba(255,255,255,.95)"
      : "rgba(255,255,255,.9)"};

  color: #111;

  font-size: 0.52rem;

  font-weight: 800;

  letter-spacing: 1.5px;

  text-transform: uppercase;

  z-index: 3;

  @media (max-width: 600px) {
    top: 7px;
    left: 7px;

    padding: 4px 6px;

    font-size: 0.43rem;
  }
`;

/* =========================================================
   FAVORITE
========================================================= */

const FavoriteButton = styled.button`
  position: absolute;

  top: 12px;
  right: 12px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid
    rgba(255, 255, 255, 0.35);

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.92);

  color: ${({ $favorite }) =>
    $favorite ? "#111" : "#777"};

  cursor: pointer;

  z-index: 4;

  transition:
    transform 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 7px;
    right: 7px;

    width: 31px;
    height: 31px;

    font-size: 13px;
  }
`;

/* =========================================================
   PRODUCT INFO
========================================================= */

const CardContent = styled.div`
  padding: 0.85rem 0.15rem 0;
`;

const ProductTop = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: flex-start;

  gap: 10px;
`;

const ProductTitle = styled.h2`
  min-width: 0;

  margin: 0;

  font-size: 0.88rem;

  font-weight: 500;

  line-height: 1.35;

  letter-spacing: 0.1px;

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  @media (max-width: 600px) {
    font-size: 0.72rem;
  }
`;

const ProductPrice = styled.div`
  margin-top: 7px;

  font-size: 0.82rem;

  font-weight: 700;

  letter-spacing: 0.2px;

  color: ${({ $isdark }) =>
    $isdark ? "#ddd" : "#222"};

  @media (max-width: 600px) {
    font-size: 0.7rem;
  }
`;

const ProductMeta = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;

  gap: 5px;

  margin-top: 9px;
`;

const Gadget = styled.span`
  font-size: 0.48rem;

  letter-spacing: 1.2px;

  text-transform: uppercase;

  color: ${({ $isdark }) =>
    $isdark ? "#aaa" : "#888"};

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

  color: ${({ $disponible }) =>
    $disponible
      ? "#23804b"
      : "#b83232"};

  @media (max-width: 600px) {
    font-size: 0.48rem;
  }
`;

/* =========================================================
   LOAD MORE
========================================================= */

const LoadMore = styled.button`
  display: block;

  margin: 4rem auto 0;

  padding: 13px 35px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#fff" : "#111"};

  background: transparent;

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  font-size: 0.65rem;

  font-weight: 700;

  letter-spacing: 1.5px;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease;

  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "#fff" : "#111"};

    color: ${({ $isdark }) =>
      $isdark ? "#111" : "#fff"};
  }
`;

/* =========================================================
   SKELETON
========================================================= */

const SkeletonCard = styled.div`
  width: 100%;

  min-height: 60vh;

  background: linear-gradient(
    90deg,
    #eee 0%,
    #ddd 50%,
    #eee 100%
  );

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

  display: ${({ $show }) =>
    $show ? "flex" : "none"};

  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.65);

  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 400px;

  padding: 2rem;

  box-sizing: border-box;

  background: #fff;

  color: #111;

  text-align: center;

  border-radius: 4px;

  h2 {
    margin-top: 0;

    font-size: 1.3rem;
  }

  p {
    color: #666;

    line-height: 1.6;

    font-size: 0.9rem;
  }
`;

const ModalButton = styled.button`
  margin-top: 1rem;

  padding: 11px 22px;

  border: none;

  background: #111;

  color: white;

  cursor: pointer;

  font-size: 0.75rem;

  font-weight: 700;

  letter-spacing: 1px;

  text-transform: uppercase;
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
  const [imageIndexes, setImageIndexes] =
    useState({});

  const [filter, setFilter] =
    useState("tout");

  const [sort, setSort] =
    useState("default");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [limit, setLimit] =
    useState(12);

  const [showModal, setShowModal] =
    useState(false);

  const token =
    localStorage.getItem("token");

  /* =========================================================
     STOCK
  ========================================================= */

  const calculStock = (
    stockParVariation = {}
  ) => {
    return Object.values(
      stockParVariation
    ).reduce((total, tailles) => {
      return (
        total +
        Object.values(tailles).reduce(
          (n, v) => n + Number(v),
          0
        )
      );
    }, 0);
  };

  /* =========================================================
     FETCH PRODUITS
  ========================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits`
        );

        const data = await res.json();

        const valid = data.filter(
          (p) =>
            p.images?.length &&
            p.genre === "femme"
        );

        setProducts(valid);

        const indexes = {};

        valid.forEach((p) => {
          const mainIndex =
            p.images.findIndex(
              (img) => img.isMain
            );

          indexes[p._id] =
            mainIndex >= 0
              ? mainIndex
              : 0;
        });

        setImageIndexes(indexes);

        setTimeout(
          () => setLoading(false),
          500
        );
      } catch (error) {
        console.error(error);

        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =========================================================
     FAVORIS
  ========================================================= */

  useEffect(() => {
    if (!token) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/api/favorites`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFavorites(
          data
            .map(
              (f) =>
                f.productId?._id
            )
            .filter(Boolean)
        );
      })
      .catch(console.error);
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
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: id,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (data.active) {
          setFavorites((prev) => [
            ...prev,
            id,
          ]);
        } else {
          setFavorites((prev) =>
            prev.filter(
              (f) => f !== id
            )
          );
        }
      }
    } catch (error) {
      console.error(
        "Erreur favoris :",
        error
      );
    }
  };

  /* =========================================================
     CAROUSEL AUTOMATIQUE
  ========================================================= */

  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = {
          ...prev,
        };

        products.forEach((p) => {
          if (!p.images?.length)
            return;

          updated[p._id] =
            ((prev[p._id] || 0) + 1) %
            p.images.length;
        });

        return updated;
      });
    }, 3200);

    return () =>
      clearInterval(interval);
  }, [products]);

  /* =========================================================
     FILTRE / RECHERCHE / TRI
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let filtered =
      filter === "tout"
        ? products
        : products.filter(
            (p) =>
              p.categorie
                ?.toLowerCase()
                .trim() === filter
          );

    if (search.trim()) {
      filtered =
        filtered.filter((p) =>
          p.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
    }

    if (sort === "asc") {
      filtered = [...filtered].sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (sort === "desc") {
      filtered = [...filtered].sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    }

    return filtered.slice(
      0,
      limit
    );
  }, [
    products,
    filter,
    sort,
    search,
    limit,
  ]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return <SkeletonCard />;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <PageWrapper $isdark={$isdark}>

      {/* HEADER */}

      <PageHeader>

        <TitleArea>
          <Eyebrow $isdark={$isdark}>
            Collection 2026
          </Eyebrow>

          <PageTitle>
            Femme
          </PageTitle>
        </TitleArea>

        <ControlsWrapper>

          {/* SEARCH */}

          <SearchBox>
            <SearchIcon
              $isdark={$isdark}
            />

            <SearchInput
              $isdark={$isdark}
              placeholder="Rechercher une pièce..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </SearchBox>

          {/* FILTRES */}

          <FilterWrapper>
            {[
              "tout",
              "haut",
              "bas",
              "robe",
              "chaussure",
            ].map((cat) => (
              <FilterButton
                key={cat}
                $active={
                  filter === cat
                }
                $isdark={$isdark}
                onClick={() =>
                  setFilter(cat)
                }
              >
                {cat === "tout"
                  ? "Tout"
                  : cat}
              </FilterButton>
            ))}
          </FilterWrapper>

          {/* TRI */}

          <SortBox>
            <Select
              $isdark={$isdark}
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
            >
              <option value="default">
                Trier
              </option>

              <option value="asc">
                Prix croissant
              </option>

              <option value="desc">
                Prix décroissant
              </option>
            </Select>

            <SelectIcon />
          </SortBox>

        </ControlsWrapper>

      </PageHeader>

      {/* PRODUITS */}

      <Grid>
        {filteredProducts.map((p) => {
          const isFav =
            favorites.includes(
              p._id
            );

          const totalStock =
            calculStock(
              p.stockParVariation
            );

          return (
            <ProductCard
              key={p._id}
              onClick={() =>
                navigate(
                  `/produit/${p._id}`
                )
              }
            >

              {/* IMAGE */}

              <ImageWrapper
                $isdark={$isdark}
              >

                {p.images.map(
                  (img, index) => (
                    <ProductImage
                      key={index}
                      src={img.url}
                      alt={p.title}
                      loading="lazy"
                      $active={
                        imageIndexes[
                          p._id
                        ] === index
                      }
                    />
                  )
                )}

                <ImageShade />

                {p.badge && (
                  <Badge
                    $isdark={$isdark}
                  >
                    {p.badge}
                  </Badge>
                )}

                <FavoriteButton
                  $favorite={isFav}
                  onClick={(e) => {
                    e.stopPropagation();

                    toggleFavorite(
                      p._id
                    );
                  }}
                  aria-label="Ajouter aux favoris"
                >
                  {isFav ? (
                    <FaHeart />
                  ) : (
                    <FiHeart />
                  )}
                </FavoriteButton>

              </ImageWrapper>

              {/* INFOS */}

              <CardContent>

                <ProductTop>
                  <ProductTitle
                    $isdark={$isdark}
                  >
                    {p.title}
                  </ProductTitle>
                </ProductTop>

                <ProductPrice
                  $isdark={$isdark}
                >
                  {Number(
                    p.price
                  ).toLocaleString()}{" "}
                  FCFA
                </ProductPrice>

                <ProductMeta>

                  {p.gadget ? (
                    <Gadget
                      $isdark={$isdark}
                    >
                      {p.gadget}
                    </Gadget>
                  ) : (
                    <span />
                  )}

                  <Validation
                    $disponible={
                      totalStock > 0
                    }
                  >
                    {totalStock >
                    10 ? (
                      <>
                        <FiCheckCircle />
                        En stock
                      </>
                    ) : totalStock >
                      0 ? (
                      <>
                        <FiAlertCircle />
                        Plus que{" "}
                        {totalStock}
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

      {/* VOIR PLUS */}

      {filteredProducts.length >=
        limit && (
        <LoadMore
          $isdark={$isdark}
          onClick={() =>
            setLimit(
              (prev) =>
                prev + 12
            )
          }
        >
          Voir plus
        </LoadMore>
      )}

      {/* MODAL */}

      <ModalOverlay
        $show={showModal}
      >
        <ModalContent>

          <h2>
            Connexion requise
          </h2>

          <p>
            Vous devez être connecté
            pour ajouter un produit à
            vos favoris.
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