import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FiShoppingBag,
  FiUser,
  FiSun,
  FiMoon,
  FiX,
  FiHeart,
  FiSearch,
  FiMenu
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context"; 
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = 70;

/* ===== ANIMATIONS ===== */
const slideMenu = keyframes`
from { transform: translateY(-20px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
`;

const linkAppear = keyframes`
from { opacity: 0; transform: translateY(10px); }
to { opacity: 1; transform: translateY(0); }
`;

/* ===== STYLES ===== */
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  background: ${({ $isdark, $scrolled, $hero }) =>
    $hero
      ? "transparent"
      : $scrolled
        ? $isdark
          ? "rgba(0,0,0,0.85)"
          : "#fff"
        : $isdark
          ? "rgba(0,0,0,0.85)"
          : "#fff"};
  box-shadow: ${({ $scrolled, $hero }) =>
    !$hero && $scrolled ? "0 6px 28px rgba(0,0,0,0.1)" : "none"};
  color: ${({ $isdark, $scrolled }) =>
    $scrolled ? ($isdark ? "#fff" : "#111") : "#fff"};
`;

const HeaderTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Spacer = styled.div`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.3rem;
  color: inherit;
  text-decoration: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background-color: transparent;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;
  &:hover { transform: scale(1.1); }
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: red;
  color: white;
  width: 18px;
  height: 18px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  width: ${({ $open }) => ($open ? "200px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  padding: ${({ $open }) => ($open ? "8px 12px" : "0")};
  border-radius: 50px;
  border: 1px solid #ccc;
  outline: none;
  transition: all 0.25s ease;
`;

/* ===== MENU MOBILE ===== */
const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh;
  display: ${({ $open }) => ($open ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  background: ${({ $isdark }) =>
    $isdark ? "rgba(0,0,0,0.96)" : "rgba(255,255,255,0.98)"};
  backdrop-filter: blur(12px);
  animation: ${slideMenu} 0.35s ease;
  z-index: 10000; 
`;

const MenuLink = styled(Link)`
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  margin: 12px 0;
  opacity: 0;
  animation: ${linkAppear} 0.4s forwards;
  &:nth-child(1){animation-delay:0.05s}
  &:nth-child(2){animation-delay:0.12s}
  &:nth-child(3){animation-delay:0.18s}
  &:nth-child(4){animation-delay:0.24s}
  &:nth-child(5){animation-delay:0.30s}
  transition: transform 0.2s ease;
  &:hover{ transform: scale(1.1); }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  z-index: 10001;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  font-size: 28px;
`;

/* ===== COMPONENT ===== */
export default function Header() {
  const { theme, themeToglle, ToggleTheme } = useContext(ThemeContext || {});
  const { ajouter } = useContext(PanierContext);
  const toggleTheme = themeToglle ?? ToggleTheme ?? (() => {});
  const $isdark = theme === "light";
  const { t, i18n } = useTranslation();
  const toggleLangue = () =>
    i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

  const heroPage = location.pathname === "/"; // si page hero

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Bloquer scroll quand menu ouvert */
  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (top) {
        const scrollPosition = parseInt(top.replace("-", "").replace("px", ""), 10);
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <>
      <HeaderWrapper $isdark={$isdark} $scrolled={scrolled} $hero={heroPage}>
        <HeaderTop>
          <Logo to="/">NUMA</Logo>

          <Actions>
            <IconButton onClick={toggleTheme}>
              {$isdark ? <FiMoon size={18} /> : <FiSun size={18} />}
            </IconButton>

            <SearchWrapper>
              <IconButton onClick={() => setSearchOpen(prev => !prev)}>
                <FiSearch size={18} />
              </IconButton>
              <form onSubmit={handleSearch}>
                <SearchInput
                  $open={searchOpen}
                  type="text"
                  placeholder={t("searchProducts")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </SearchWrapper>

            <IconButton as={Link} to="/compte">
              <FiUser />
            </IconButton>

            <IconButton as={Link} to="/panier" style={{ position: "relative" }}>
              <FiShoppingBag />
              {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
            </IconButton>

            <IconButton as={Link} to="/favoris">
              <FiHeart />
            </IconButton>

            <IconButton onClick={() => setMenuOpen(prev => !prev)}>
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </IconButton>
          </Actions>
        </HeaderTop>
      </HeaderWrapper>

      {!heroPage && <Spacer />} {/* espace pour ne pas couvrir le contenu sur autres pages */}

      {/* MENU MOBILE */}
      <MobileMenu $open={menuOpen} $isdark={$isdark}>
        <CloseButton $isdark={$isdark} onClick={() => setMenuOpen(false)}>
          <FiX />
        </CloseButton>

        <MenuLink to="/" onClick={() => setMenuOpen(false)}>{t("home")}</MenuLink>
        <MenuLink to="/collections" onClick={() => setMenuOpen(false)}>{t("collections")}</MenuLink>
        <MenuLink to="/new" onClick={() => setMenuOpen(false)}>{t("new")}</MenuLink>
        <MenuLink to="/promo" onClick={() => setMenuOpen(false)}>{t("deals")}</MenuLink>
        <MenuLink to="/apropo" onClick={() => setMenuOpen(false)}>{t("about")}</MenuLink>
      </MobileMenu>
    </>
  );
}