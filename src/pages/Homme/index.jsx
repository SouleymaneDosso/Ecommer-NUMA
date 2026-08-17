import { useState, useEffect, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiHeart,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiSearch,
  FiSliders,
  FiArrowRight,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeContext, PanierContext } from "../../Utils/Context";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }

  100% {
    background-position: 500px 0;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/* =========================================================
   PAGE
========================================================= */

const PageWrapper = styled.main`
  min-height: 100vh;
  padding: 0 0 100px;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(180deg, #0a0a0a 0%, #111 45%, #0a0a0a 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #fafafa 45%, #ffffff 100%)"};

  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};

  transition:
    background 0.3s ease,
    color 0.3s ease;

  overflow-x: hidden;
`;

/* =========================================================
   HERO / HEADER
========================================================= */

const Hero = styled.section`
  position: relative;
  width: 100%;
  min-height: 410px;

  display: flex;
  align-items: flex-end;

  padding: 70px 6% 55px;

  background: ${({ $isdark }) =>
    $isdark
      ? "radial-gradient(circle at 80% 20%, #292929 0%, #111 35%, #080808 75%)"
      : "radial-gradient(circle at 80% 20%, #eeeeee 0%, #fafafa 35%, #ffffff 75%)"};

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)"};

  @media (max-width: 768px) {
    min-height: 360px;
    padding: 55px 20px 40px;
  }
`;

const HeroInner = styled.div`
  width: min(1300px, 100%);
  margin: 0 auto;

  animation: ${fadeUp} 0.8s ease forwards;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 20px;

  font-size: 0.72rem;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 0.65;

  &::before {
    content: "";
    width: 35px;
    height: 1px;
    background: currentColor;
  }
`;

const HeroTitle = styled.h1`
  margin: 0;

  max-width: 900px;

  font-size: clamp(3.2rem, 8vw, 8rem);
  line-height: 0.88;
  letter-spacing: -0.06em;
  font-weight: 700;

  text-transform: uppercase;
`;

const HeroBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 30px;

  margin-top: 45px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
`;

const HeroDescription = styled.p`
  max-width: 530px;

  margin: 0;

  font-size: 1rem;
  line-height: 1.8;

  opacity: 0.65;
`;

const ProductCount = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;

  opacity: 0.65;

  white-space: nowrap;
`;

/* =========================================================
   CONTENT
========================================================= */

const Content = styled.div`
  width: min(1300px, 88%);
  margin: 0 auto;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
  }
`;

/* =========================================================
   TOOLBAR
========================================================= */

const Toolbar = styled.section`
  position: sticky;
  top: 0;

  z-index: 30;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 22px 0;

  margin-bottom: 35px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(10,10,10,.92)" : "rgba(255,255,255,.92)"};

  backdrop-filter: blur(18px);

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)"};

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;

  width: 270px;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;

  left: 14px;
  top: 50%;

  transform: translateY(-50%);

  font-size: 17px;

  opacity: 0.5;
`;

const SearchInput = styled.input`
  width: 100%;

  box-sizing: border-box;

  padding: 13px 42px 13px 43px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)"};

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,.04)" : "#fff"};

  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};

  outline: none;

  font-size: 0.88rem;

  border-radius: 999px;

  transition: 0.25s ease;

  &:focus {
    border-color: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.5)" : "#111"};
  }

  &::placeholder {
    color: currentColor;
    opacity: 0.45;
  }
`;

const ClearSearch = styled.button`
  position: absolute;

  right: 10px;
  top: 50%;

  transform: translateY(-50%);

  width: 28px;
  height: 28px;

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,.1)" : "#f1f1f1"};

  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};
`;

const Filters = styled.div`
  display: flex;
  align-items: center;

  gap: 7px;

  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FilterButton = styled.button`
  border: 1px solid
    ${({ $active, $isdark }) =>
      $active
        ? $isdark
          ? "#fff"
          : "#111"
        : $isdark
          ? "rgba(255,255,255,.12)"
          : "rgba(0,0,0,.1)"};

  background: ${({ $active, $isdark }) =>
    $active ? ($isdark ? "#fff" : "#111") : "transparent"};

  color: ${({ $active, $isdark }) =>
    $active ? ($isdark ? "#111" : "#fff") : $isdark ? "#fff" : "#111"};

  padding: 11px 17px;

  border-radius: 999px;

  cursor: pointer;

  font-size: 0.68rem;
  letter-spacing: 1px;
  font-weight: 600;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const SortWrapper = styled.div`
  position: relative;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const SortIcon = styled(FiSliders)`
  position: absolute;

  left: 13px;
  top: 50%;

  transform: translateY(-50%);

  pointer-events: none;

  opacity: 0.5;
`;

const Select = styled.select`
  appearance: none;

  min-width: 170px;

  padding: 12px 14px 12px 38px;

  border-radius: 999px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.12)"};

  background: ${({ $isdark }) =>
    $isdark ? "#161616" : "#fff"};

  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};

  cursor: pointer;

  outline: none;

  font-size: 0.78rem;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

/* =========================================================
   GRID
========================================================= */

const Grid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  column-gap: 18px;
  row-gap: 55px;

  animation: ${fadeIn} 0.7s ease;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    column-gap: 10px;
    row-gap: 35px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    column-gap: 8px;
    row-gap: 30px;
  }
`;

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = styled.article`
  min-width: 0;

  cursor: pointer;

  animation: ${fadeUp} 0.55s ease both;

  &:hover .product-image {
    transform: scale(1.045);
  }

  &:hover .product-overlay {
    opacity: 1;
  }

  &:hover .quick-button {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ImageWrapper = styled.div`
  position: relative;

  width: 100%;

  aspect-ratio: 4 / 5;

  overflow: hidden;

  background: ${({ $isdark }) =>
    $isdark ? "#191919" : "#f3f3f1"};

  margin-bottom: 14px;
`;

const ProductImage = styled.img`
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  transform: scale(1);

  transition:
    opacity 0.45s ease,
    transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
`;

const ProductOverlay = styled.div`
  position: absolute;

  inset: 0;

  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  padding: 14px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.48),
    transparent 45%
  );

  opacity: 0;

  transition: opacity 0.3s ease;

  pointer-events: none;

  @media (max-width: 780px) {
    display: none;
  }
`;

const OverlayText = styled.span`
  color: white;

  font-size: 0.65rem;

  letter-spacing: 1.5px;

  text-transform: uppercase;
`;

const QuickButton = styled.button`
  position: relative;

  z-index: 4;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 10px 13px;

  border: none;

  background: white;
  color: #111;

  font-size: 0.65rem;
  font-weight: 700;

  cursor: pointer;

  transform: translateY(12px);

  opacity: 0;

  transition: all 0.3s ease;

  pointer-events: auto;
`;

const Badge = styled.div`
  position: absolute;

  top: 12px;
  left: 12px;

  z-index: 5;

  padding: 7px 9px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,.94)" : "rgba(255,255,255,.94)"};

  color: #111;

  font-size: 0.56rem;

  font-weight: 700;

  letter-spacing: 1.3px;

  text-transform: uppercase;

  backdrop-filter: blur(8px);

  @media (max-width: 480px) {
    top: 7px;
    left: 7px;

    padding: 5px 7px;

    font-size: 0.48rem;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;

  top: 12px;
  right: 12px;

  z-index: 6;

  width: 38px;
  height: 38px;

  border-radius: 50%;

  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: ${({ $favorite }) =>
    $favorite ? "#111" : "rgba(255,255,255,.92)"};

  color: ${({ $favorite }) =>
    $favorite ? "#fff" : "#111"};

  font-size: 17px;

  backdrop-filter: blur(10px);

  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.08);
  }

  @media (max-width: 480px) {
    width: 31px;
    height: 31px;

    top: 7px;
    right: 7px;

    font-size: 14px;
  }
`;

/* =========================================================
   PRODUCT CONTENT
========================================================= */

const CardContent = styled.div`
  padding: 0 2px;
`;

const ProductTop = styled.div`
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
`;

const ProductTitle = styled.h2`
  margin: 0;

  font-size: 0.86rem;

  line-height: 1.35;

  font-weight: 500;

  letter-spacing: 0.1px;

  @media (max-width: 480px) {
    font-size: 0.74rem;
  }
`;

const ProductPrice = styled.div`
  margin-top: 8px;

  font-size: 0.86rem;

  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 0.76rem;
  }
`;

const Gadget = styled.span`
  flex-shrink: 0;

  padding: 5px 7px;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  font-size: 0.5rem;

  letter-spacing: 0.8px;

  text-transform: uppercase;

  @media (max-width: 480px) {
    display: none;
  }
`;

const Validation = styled.div`
  display: inline-flex;

  align-items: center;

  gap: 5px;

  margin-top: 9px;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 0.62rem;

  font-weight: 600;

  color: ${({ $disponible }) =>
    $disponible ? "#15803d" : "#dc2626"};

  background: ${({ $disponible }) =>
    $disponible ? "#dcfce7" : "#fee2e2"};

  svg {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 0.56rem;

    padding: 4px 6px;
  }
`;

/* =========================================================
   LOAD MORE
========================================================= */

const LoadMoreWrapper = styled.div`
  display: flex;

  justify-content: center;

  margin-top: 70px;
`;

const LoadMore = styled.button`
  display: inline-flex;

  align-items: center;

  gap: 10px;

  padding: 15px 25px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.25)" : "#111"};

  background: transparent;

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  cursor: pointer;

  font-size: 0.72rem;

  font-weight: 700;

  letter-spacing: 1.2px;

  text-transform: uppercase;

  transition: all 0.25s ease;

  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "#fff" : "#111"};

    color: ${({ $isdark }) =>
      $isdark ? "#111" : "#fff"};

    transform: translateY(-3px);
  }
`;

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = styled.div`
  grid-column: 1 / -1;

  min-height: 300px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 40px;

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"};
`;

const EmptyIcon = styled.div`
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  margin-bottom: 18px;

  background: ${({ $isdark }) =>
    $isdark ? "#1b1b1b" : "#f3f3f3"};

  font-size: 24px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px;

  font-size: 1.2rem;
`;

const EmptyText = styled.p`
  margin: 0;

  max-width: 430px;

  line-height: 1.7;

  opacity: 0.6;

  font-size: 0.9rem;
`;

/* =========================================================
   LOADER
========================================================= */

const LoaderWrapper = styled.div`
  min-height: 70vh;

  display: flex;

  align-items: center;
  justify-content: center;
`;

const Loader = styled.div`
  width: 40px;
  height: 40px;

  border-radius: 50%;

  border: 3px solid
    ${({ $isdark }) =>
      $isdark ? "#292929" : "#e5e5e5"};

  border-top-color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  animation: ${spin} 0.8s linear infinite;
`;

/* =========================================================
   SKELETON
========================================================= */

const SkeletonGrid = styled.div`
  width: min(1300px, 88%);
  margin: 60px auto;

  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 780px) {
    width: calc(100% - 32px);

    grid-template-columns: repeat(2, 1fr);

    gap: 10px;
  }
`;

const SkeletonCard = styled.div`
  aspect-ratio: 4 / 5;

  background: linear-gradient(
    90deg,
    ${({ $isdark }) =>
        $isdark ? "#151515" : "#eeeeee"}
      0%,
    ${({ $isdark }) =>
        $isdark ? "#222" : "#f8f8f8"}
      50%,
    ${({ $isdark }) =>
        $isdark ? "#151515" : "#eeeeee"}
      100%
  );

  background-size: 500px 100%;

  animation: ${shimmer} 1.3s infinite linear;
`;

/* =========================================================
   MODAL
========================================================= */

const ModalOverlay = styled.div`
  position: fixed;

  inset: 0;

  z-index: 1000;

  display: ${({ $show }) =>
    $show ? "flex" : "none"};

  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.65);

  backdrop-filter: blur(10px);

  animation: ${fadeIn} 0.25s ease;
`;

const ModalContent = styled.div`
  position: relative;

  width: min(440px, 100%);

  padding: 45px 35px;

  background: ${({ $isdark }) =>
    $isdark ? "#171717" : "#fff"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  text-align: center;

  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.3);

  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 480px) {
    padding: 35px 22px;
  }
`;

const ModalClose = styled.button`
  position: absolute;

  top: 15px;
  right: 15px;

  width: 34px;
  height: 34px;

  border: none;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $isdark }) =>
    $isdark ? "#242424" : "#f2f2f2"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  cursor: pointer;
`;

const ModalIcon = styled.div`
  width: 64px;
  height: 64px;

  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  font-size: 25px;
`;

const ModalTitle = styled.h2`
  margin: 0 0 12px;

  font-size: 1.5rem;
`;

const ModalText = styled.p`
  margin: 0 auto;

  max-width: 330px;

  line-height: 1.7;

  opacity: 0.65;

  font-size: 0.9rem;
`;

const ModalButton = styled.button`
  margin-top: 28px;

  width: 100%;

  padding: 14px;

  border: none;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  cursor: pointer;

  font-weight: 700;

  letter-spacing: 0.5px;

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.88;
  }
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function Homme() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const $isdark = theme === "light";

  const { ajouterPanier } = useContext(PanierContext);

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [imageIndexes, setImageIndexes] = useState({});

  const [filter, setFilter] = useState("tout");

  const [sort, setSort] = useState("default");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(12);

  const [showModal, setShowModal] = useState(false);

  /* =======================================================
     STOCK
  ======================================================= */

  const calculStock = (stockParVariation = {}) => {
    return Object.values(stockParVariation).reduce(
      (total, tailles) => {
        return (
          total +
          Object.values(tailles).reduce(
            (v, n) => v + Number(n),
            0
          )
        );
      },
      0
    );
  };

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

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
            p.genre?.toLowerCase() === "homme"
        );

        setProducts(valid);

        const indexes = {};

        valid.forEach((p) => {
          const mainIndex = p.images.findIndex(
            (img) => img.isMain
          );

          indexes[p._id] =
            mainIndex >= 0 ? mainIndex : 0;
        });

        setImageIndexes(indexes);

        setTimeout(() => {
          setLoading(false);
        }, 400);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     FAVORITES
  ======================================================= */

  useEffect(() => {
    if (!token) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/api/favorites`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFavorites(
          data
            .map((f) => f.productId?._id)
            .filter(Boolean)
        );
      })
      .catch(console.error);
  }, [token]);

  /* =======================================================
     TOGGLE FAVORITE
  ======================================================= */

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
            prev.filter((f) => f !== id)
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

  /* =======================================================
     IMAGE SLIDER
  ======================================================= */

  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = {
          ...prev,
        };

        products.forEach((p) => {
          updated[p._id] =
            ((prev[p._id] || 0) + 1) %
            p.images.length;
        });

        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [products]);

  /* =======================================================
     FILTER + SEARCH + SORT
  ======================================================= */

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
      filtered = filtered.filter((p) =>
        p.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sort === "asc") {
      filtered = [...filtered].sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "desc") {
      filtered = [...filtered].sort(
        (a, b) => b.price - a.price
      );
    }

    return filtered.slice(0, limit);
  }, [
    products,
    filter,
    sort,
    search,
    limit,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <PageWrapper $isdark={$isdark}>
        <Hero $isdark={$isdark}>
          <HeroInner>
            <Eyebrow>Collection</Eyebrow>

            <HeroTitle>
              Homme
            </HeroTitle>
          </HeroInner>
        </Hero>

        <SkeletonGrid>
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <SkeletonCard
                key={index}
                $isdark={$isdark}
              />
            )
          )}
        </SkeletonGrid>
      </PageWrapper>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <PageWrapper $isdark={$isdark}>
      {/* =================================================
          HERO
      ================================================= */}

      <Hero $isdark={$isdark}>
        <HeroInner>
          <Eyebrow>
            Numa — Collection Homme
          </Eyebrow>

          <HeroTitle>
            Homme
          </HeroTitle>

          <HeroBottom>
            <HeroDescription>
              Une sélection pensée pour une allure
              contemporaine, précise et assumée.
              Découvrez les pièces essentielles de
              la collection homme.
            </HeroDescription>

            <ProductCount>
              {products.length} pièces
              <FiArrowRight />
            </ProductCount>
          </HeroBottom>
        </HeroInner>
      </Hero>

      <Content>
        {/* =================================================
            TOOLBAR
        ================================================= */}

        <Toolbar $isdark={$isdark}>
          <SearchBox>
            <SearchIcon />

            <SearchInput
              $isdark={$isdark}
              placeholder="Rechercher une pièce..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLimit(12);
              }}
            />

            {search && (
              <ClearSearch
                $isdark={$isdark}
                onClick={() => setSearch("")}
              >
                <FiX />
              </ClearSearch>
            )}
          </SearchBox>

          <Filters>
            {[
              ["tout", "Tout"],
              ["haut", "Hauts"],
              ["bas", "Bas"],
              ["chaussure", "Chaussures"],
            ].map(([value, label]) => (
              <FilterButton
                key={value}
                $active={filter === value}
                $isdark={$isdark}
                onClick={() => {
                  setFilter(value);
                  setLimit(12);
                }}
              >
                {label}
              </FilterButton>
            ))}
          </Filters>

          <SortWrapper>
            <SortIcon />

            <Select
              $isdark={$isdark}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setLimit(12);
              }}
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
          </SortWrapper>
        </Toolbar>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <Grid>
          {filteredProducts.length === 0 ? (
            <EmptyState $isdark={$isdark}>
              <EmptyIcon $isdark={$isdark}>
                <FiShoppingBag />
              </EmptyIcon>

              <EmptyTitle>
                Aucun produit trouvé
              </EmptyTitle>

              <EmptyText>
                Nous n'avons trouvé aucune pièce
                correspondant à votre recherche.
                Essayez une autre catégorie ou un
                autre terme.
              </EmptyText>
            </EmptyState>
          ) : (
            filteredProducts.map((p, index) => {
              const isFav =
                favorites.includes(p._id);

              const totalStock =
                calculStock(
                  p.stockParVariation
                );

              return (
                <ProductCard
                  key={p._id}
                  style={{
                    animationDelay: `${Math.min(
                      index * 0.04,
                      0.4
                    )}s`,
                  }}
                  onClick={() =>
                    navigate(
                      `/produit/${p._id}`
                    )
                  }
                >
                  <ImageWrapper
                    $isdark={$isdark}
                  >
                    {p.images.map(
                      (img, imageIndex) => (
                        <ProductImage
                          className="product-image"
                          key={imageIndex}
                          src={img.url}
                          alt={p.title}
                          loading="lazy"
                          $active={
                            imageIndexes[
                              p._id
                            ] === imageIndex
                          }
                        />
                      )
                    )}

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
                      aria-label={
                        isFav
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                    >
                      {isFav ? (
                        <FaHeart />
                      ) : (
                        <FiHeart />
                      )}
                    </FavoriteButton>

                    <ProductOverlay className="product-overlay">
                      <OverlayText>
                        Découvrir
                      </OverlayText>

                      <QuickButton
                        className="quick-button"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/produit/${p._id}`
                          );
                        }}
                      >
                        Voir la pièce
                        <FiArrowRight />
                      </QuickButton>
                    </ProductOverlay>
                  </ImageWrapper>

                  <CardContent>
                    <ProductTop>
                      <ProductTitle>
                        {p.title}
                      </ProductTitle>

                      {p.gadget && (
                        <Gadget
                          $isdark={$isdark}
                        >
                          {p.gadget}
                        </Gadget>
                      )}
                    </ProductTop>

                    <ProductPrice>
                      {p.price} FCFA
                    </ProductPrice>

                    <Validation
                      $disponible={
                        totalStock > 0
                      }
                    >
                      {totalStock > 10 ? (
                        <>
                          <FiCheckCircle />
                          En stock
                        </>
                      ) : totalStock > 0 ? (
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
                  </CardContent>
                </ProductCard>
              );
            })
          )}
        </Grid>

        {/* =================================================
            LOAD MORE
        ================================================= */}

        {filteredProducts.length >=
          limit &&
          filteredProducts.length <
            products.length && (
            <LoadMoreWrapper>
              <LoadMore
                $isdark={$isdark}
                onClick={() =>
                  setLimit(
                    (prev) => prev + 12
                  )
                }
              >
                Voir plus
                <FiArrowRight />
              </LoadMore>
            </LoadMoreWrapper>
          )}
      </Content>

      {/* =================================================
          LOGIN MODAL
      ================================================= */}

      <ModalOverlay $show={showModal}>
        <ModalContent $isdark={$isdark}>
          <ModalClose
            $isdark={$isdark}
            onClick={() =>
              setShowModal(false)
            }
          >
            <FiX />
          </ModalClose>

          <ModalIcon $isdark={$isdark}>
            <FiHeart />
          </ModalIcon>

          <ModalTitle>
            Connexion requise
          </ModalTitle>

          <ModalText>
            Connectez-vous à votre compte pour
            ajouter cette pièce à vos favoris et
            retrouver votre sélection plus tard.
          </ModalText>

          <ModalButton
            $isdark={$isdark}
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