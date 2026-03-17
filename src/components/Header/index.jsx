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
  FiMenu,
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = 70;
const TOPBAR_HEIGHT = 40; // ✅ Défini

// Animation fade + slide pour le menu entier
const fadeSlide = keyframes`
from { opacity:0; transform:translateY(-30px); }
to { opacity:1; transform:translateY(0); }
`;

// Animation fade + slide pour les liens
const linkSlide = keyframes`
from { opacity:0; transform:translateY(15px); }
to { opacity:1; transform:translateY(0); }
`;

// Animation TopBar slide out
const topBarSlideOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-100%); }
`;

// ================= Styled Components =================

const HeaderWrapper = styled.header`
  position: fixed;
  top: ${({ $show, $topOffset }) =>
    $show ? `${$topOffset}px` : `-${HEADER_HEIGHT}px`};
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;

  transition:
    top 0.35s ease,
    background 0.3s ease,
    color 0.3s ease;

  background: ${({ $isdark, $hero, $scrolled }) =>
    $hero && !$scrolled
      ? "transparent"
      : $isdark
        ? "rgba(0,0,0,0.92)"
        : "rgba(255,255,255,0.92)"};

  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 6px 28px rgba(0,0,0,0.08)" : "none"};

  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};
`;

const HeaderTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.3rem;
  text-decoration: none;
  color: inherit;
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
  background: transparent;
  color: inherit;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }
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

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(0,0,0,0.96)" : "rgba(255,255,255,0.98)"};

  transform: ${({ $open }) => ($open ? "translateY(0)" : "translateY(-100%)")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;

  animation: ${fadeSlide} 0.35s ease;

  z-index: 10000;
`;

const MenuLink = styled(Link)`
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  margin: 30px 0;

  transform: ${({ $open }) => ($open ? "translateY(0)" : "translateY(15px)")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    transform 0.3s ease ${({ $delay }) => $delay}s,
    opacity 0.3s ease ${({ $delay }) => $delay}s;
  animation: ${({ $open }) => ($open ? linkSlide : "none")} 0.35s forwards;

  &:hover {
    transform: scale(1.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;

  background: none;
  border: none;

  font-size: 28px;
  cursor: pointer;

  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

// ================= TopBar =================
const TopBarWrapper = styled.div`
  width: 100%;
  height: ${TOPBAR_HEIGHT}px;
  background: linear-gradient(90deg, black, black); 
  color: #fff;
  display: flex;
  justify-content: center; /* centre le texte */
  align-items: center;
  font-weight: 500;
  font-size: 0.95rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10001;
  padding: 0 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.35s ease,
    opacity 0.35s ease;
  animation: ${fadeSlide} 0.35s ease;

  /* Flex pour aligner texte et lien correctement */
  a {
    color: #fff;
    text-decoration: underline;
    margin: 0 4px;
    font-weight: 600;
    transition: color 0.25s;
  }

  a:hover {
    color: #d4f7d1; /* léger survol */
  }

  &.closing {
    animation: ${topBarSlideOut} 0.35s forwards;
  }

  /* Responsivité: petit texte sur mobile */
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const CloseTopBar = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 16px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

// ================= Header Component =================
export default function Header() {
  const themeContext = useContext(ThemeContext);
  const panierContext = useContext(PanierContext);

  const theme = themeContext?.theme ?? "dark";
  const toggleTheme =
    themeContext?.themeToglle ?? themeContext?.ToggleTheme ?? (() => {});
  const ajouter = panierContext?.ajouter ?? [];
  const $isdark = theme === "light";

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const heroPage = location.pathname === "/";
  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showTopBar, setShowTopBar] = useState(true);
  const [closingTopBar, setClosingTopBar] = useState(false);

  const handleCloseTopBar = () => {
    setClosingTopBar(true);
    setTimeout(() => setShowTopBar(false), 350);
  };

  // Bloquer scroll quand menu ouvert
  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = -parseInt(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
  }, [menuOpen]);

  // Header qui disparaît à scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 80);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <>
      <TopBarWrapper className={closingTopBar ? "closing" : ""}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          💳
          <Link to="/paiement-3x">Paiement en 3 tranches</Link>: réservez, payez à
          votre rythme !
        </span>
        <CloseTopBar onClick={handleCloseTopBar}>×</CloseTopBar>
      </TopBarWrapper>

      {/* Header */}
      <HeaderWrapper
        $isdark={$isdark}
        $hero={heroPage}
        $scrolled={scrolled}
        $show={showHeader}
        $topOffset={showTopBar ? TOPBAR_HEIGHT : 0} // ✅ décalage sous TopBar
      >
        <HeaderTop>
          <Logo to="/">NUMA</Logo>

          <Actions>
            <IconButton onClick={toggleTheme}>
              {$isdark ? <FiMoon /> : <FiSun />}
            </IconButton>

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

            <SearchWrapper>
              <IconButton onClick={() => setSearchOpen((prev) => !prev)}>
                <FiSearch />
              </IconButton>

              <form onSubmit={handleSearch}>
                <SearchInput
                  $open={searchOpen}
                  type="text"
                  placeholder={t?.("searchProducts") ?? "Search products"}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </SearchWrapper>

            <IconButton onClick={() => setMenuOpen((prev) => !prev)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </IconButton>
          </Actions>
        </HeaderTop>
      </HeaderWrapper>

      {/* Menu mobile */}
      <MobileMenu $open={menuOpen} $isdark={$isdark}>
        <CloseButton $isdark={$isdark} onClick={() => setMenuOpen(false)}>
          <FiX />
        </CloseButton>

        <MenuLink
          to="/"
          $open={menuOpen}
          $delay={0.05}
          onClick={() => setMenuOpen(false)}
        >
          {t?.("home") ?? "Home"}
        </MenuLink>
        <MenuLink
          to="/collections"
          $open={menuOpen}
          $delay={0.12}
          onClick={() => setMenuOpen(false)}
        >
          {t?.("collections") ?? "Collections"}
        </MenuLink>
        <MenuLink
          to="/new"
          $open={menuOpen}
          $delay={0.18}
          onClick={() => setMenuOpen(false)}
        >
          {t?.("new") ?? "New"}
        </MenuLink>
        <MenuLink
          to="/promo"
          $open={menuOpen}
          $delay={0.24}
          onClick={() => setMenuOpen(false)}
        >
          {t?.("deals") ?? "Deals"}
        </MenuLink>
        <MenuLink
          to="/apropo"
          $open={menuOpen}
          $delay={0.3}
          onClick={() => setMenuOpen(false)}
        >
          {t?.("about") ?? "About"}
        </MenuLink>
      </MobileMenu>
    </>
  );
}
