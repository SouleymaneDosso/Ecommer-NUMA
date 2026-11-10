
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

import {
  FiShoppingBag,
  FiUser,
  FiSun,
  FiMoon,
  FiX,
  FiSearch,
  FiMenu,
  FiArrowUpRight,
} from "react-icons/fi";

import { FiBookmark } from "react-icons/fi";
import { HiBookmark } from "react-icons/hi2";

import { ThemeContext, PanierContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = 76;
const TOPBAR_HEIGHT = 50;

/* =========================
   ANIMATIONS
========================= */

const marquee = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const menuReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* =========================
   TOP BAR
========================= */

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${TOPBAR_HEIGHT}px;
  z-index: 10001;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #fff;
  background: #171717;
  font-size: 10px;
  letter-spacing: 1.6px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    height: 46px;
    font-size: 9px;
    letter-spacing: 1px;
  }
`;

const TopBarTrack = styled.div`
  display: flex;
  width: max-content;
  white-space: nowrap;
  animation: ${marquee} 28s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const TopBarGroup = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const TopBarMessage = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 0 35px;
  color: #fff;
  text-decoration: none;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  span {
    color: #d6b982;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 0 22px;
    gap: 6px;
  }
`;

const TopBarDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d6b982;
  flex-shrink: 0;
`;

const CloseTopBar = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  &:hover {
    opacity: 0.6;
  }
`;

/* =========================
   HEADER
========================= */

const HeaderWrapper = styled.header`
  position: fixed;
  top: ${({ $hidden, $topBarVisible }) =>
    $hidden
      ? `-${HEADER_HEIGHT}px`
      : $topBarVisible
        ? `${TOPBAR_HEIGHT}px`
        : "0"};
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  z-index: 10000;
  transition:
    top 0.4s ease,
    background 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;

  background: ${({ $transparent, $isdark }) =>
    $transparent
      ? "transparent"
      : $isdark
        ? "rgba(255,255,255,0.94)"
        : "rgba(20,20,20,0.94)"};

  backdrop-filter: ${({ $transparent }) =>
    $transparent ? "none" : "blur(18px)"};

  border-bottom: ${({ $transparent, $isdark }) =>
    $transparent
      ? "1px solid transparent"
      : $isdark
        ? "1px solid rgba(0,0,0,0.06)"
        : "1px solid rgba(255,255,255,0.09)"};

  box-shadow: ${({ $transparent }) =>
    $transparent ? "none" : "0 8px 35px rgba(0,0,0,0.045)"};

  @media (max-width: 768px) {
    height: 68px;
    top: ${({ $hidden, $topBarVisible }) =>
      $hidden
        ? "-68px"
        : $topBarVisible
          ? "46px"
          : "0"};
  }
`;

const HeaderInner = styled.div`
  width: min(1440px, 94%);
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  @media (max-width: 768px) {
    width: 92%;
    grid-template-columns: 1fr auto 1fr;
  }
`;

/* =========================
   NAVIGATION DESKTOP
========================= */

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 27px;

  @media (max-width: 1100px) {
    gap: 17px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  color: ${({ $isdark }) => ($isdark ? "#202020" : "#fff")};
  text-decoration: none;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
  padding: 8px 0;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 2px;
    width: 0;
    height: 1px;
    background: currentColor;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &:hover {
    opacity: 0.65;
  }
`;

/* =========================
   LOGO
========================= */

const Logo = styled(Link)`
  color: ${({ $isdark }) => ($isdark ? "#171717" : "#fff")};
  text-decoration: none;
  font-family: "Times New Roman", serif;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: 8px;
  padding-left: 8px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 27px;
    letter-spacing: 6px;
  }
`;

/* =========================
   ACTIONS
========================= */

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 19px;

  @media (max-width: 768px) {
    gap: 13px;
  }
`;

const IconButton = styled.button`
  position: relative;
  border: none;
  background: transparent;
  color: ${({ $isdark }) => ($isdark ? "#202020" : "#fff")};
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.65;
  }

  @media (max-width: 768px) {
    font-size: 19px;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -7px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 50px;
  background: #b89b68;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 900px) {
    display: flex;
  }
`;

const DesktopOnly = styled.div`
  display: flex;

  @media (max-width: 900px) {
    display: none;
  }
`;

/* =========================
   SEARCH
========================= */

const SearchPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 24px 5%;
  background: ${({ $isdark }) => ($isdark ? "#fff" : "#191919")};
  border-top: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"};
  animation: ${fadeSlide} 0.3s ease both;
`;

const SearchForm = styled.form`
  width: min(650px, 100%);
  margin: auto;
  display: flex;
  align-items: center;
  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)"};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 14px 4px;
  color: ${({ $isdark }) => ($isdark ? "#171717" : "#fff")};
  font-size: 14px;
  letter-spacing: 1px;

  &::placeholder {
    color: ${({ $isdark }) =>
      $isdark ? "#888" : "rgba(255,255,255,0.55)"};
  }
`;

const SearchSubmit = styled.button`
  border: none;
  background: transparent;
  color: ${({ $isdark }) => ($isdark ? "#171717" : "#fff")};
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
`;

/* =========================
   MOBILE MENU
========================= */

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: ${({ $isdark }) => ($isdark ? "#f8f7f4" : "#171717")};
  color: ${({ $isdark }) => ($isdark ? "#171717" : "#fff")};
  display: ${({ $open }) => ($open ? "flex" : "none")};
  flex-direction: column;
  padding: 30px 8% 45px;
  overflow-y: auto;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 65px;
`;

const MobileLogo = styled.div`
  font-family: "Times New Roman", serif;
  font-size: 27px;
  letter-spacing: 7px;
`;

const MobileClose = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  font-size: 25px;
  cursor: pointer;
`;

const MobileLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 19px 0;
  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)"};
  color: inherit;
  text-decoration: none;
  font-family: "Times New Roman", serif;
  font-size: clamp(25px, 7vw, 38px);
  letter-spacing: 1px;

  animation: ${({ $open }) =>
    $open
      ? css`${menuReveal} 0.6s ease both`
      : "none"};

  &:hover {
    opacity: 0.55;
  }

  svg {
    font-size: 19px;
  }
`;

const MobileFooter = styled.div`
  margin-top: auto;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
`;

const MobileFooterLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

/* =========================
   COMPONENT
========================= */

function Header() {
  const themeContext = useContext(ThemeContext);
  const panierContext = useContext(PanierContext);

  const theme = themeContext?.theme;
  const ajouter = panierContext?.ajouter || [];

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [topBarVisible, setTopBarVisible] = useState(true);

  // Conserve la logique de thème du composant existant.
  const $isdark = theme === "dark";

  const isHome = location.pathname === "/";

  const totalItems = Array.isArray(ajouter)
    ? ajouter.reduce(
        (acc, item) => acc + (Number(item.quantite) || 0),
        0
      )
    : 0;

  const isFavoritesPage = location.pathname === "/favoris";

  /* =========================
     SCROLL HEADER
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY < 80) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  /* =========================
     MOBILE SCROLL LOCK
  ========================= */

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  /* =========================
     CLOSE ON ROUTE CHANGE
  ========================= */

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchValue.trim();

    if (!value) return;

    navigate(`/search?q=${encodeURIComponent(value)}`);
    setSearchValue("");
    setSearchOpen(false);
  };

  const toggleTheme = () => {
    const changeTheme =
      themeContext?.themeToglle ??
      themeContext?.ToggleTheme ??
      (() => {});

    changeTheme();
  };

  /* =========================
     NAVIGATION LINKS
  ========================= */

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Homme", path: "/homme" },
    { label: "Femme", path: "/femme" },
    { label: "Collections", path: "/collections" },
    { label: "Nouveautés", path: "/new" },
    { label: "Promotions", path: "/promo" },
  ];

  return (
    <>
      {topBarVisible && (
        <TopBar>
          <TopBarTrack>
            {[0, 1].map((group) => (
              <TopBarGroup key={group}>
                <TopBarMessage to="/paiement-3x">
                  <span>NUMA PRIVILEGE</span>
                  Paiement en 3 fois : profitez maintenant, payez à votre rythme
                  <FiArrowUpRight />
                </TopBarMessage>

                <TopBarDot />

                <TopBarMessage to="/paiement-3x">
                  Paiement à la livraison également disponible
                  <FiArrowUpRight />
                </TopBarMessage>

                <TopBarDot />

                <TopBarMessage to="/collections">
                  Découvrez nos collections exclusives
                  <FiArrowUpRight />
                </TopBarMessage>

                <TopBarDot />
              </TopBarGroup>
            ))}
          </TopBarTrack>

          <CloseTopBar
            type="button"
            onClick={() => setTopBarVisible(false)}
            aria-label="Fermer le bandeau"
          >
            <FiX />
          </CloseTopBar>
        </TopBar>
      )}

      <HeaderWrapper
        $hidden={hidden}
        $transparent={isHome && !scrolled}
        $isdark={$isdark}
        $topBarVisible={topBarVisible}
      >
        <HeaderInner>
          <DesktopNav>
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $isdark={$isdark}
              >
                {item.label}
              </NavLink>
            ))}
          </DesktopNav>

          <MobileMenuButton
            type="button"
            $isdark={$isdark}
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <FiMenu />
          </MobileMenuButton>

          <Logo to="/" $isdark={$isdark}>
            NUMA
          </Logo>

          <HeaderActions>
            <DesktopOnly>
              <IconButton
                type="button"
                $isdark={$isdark}
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label="Rechercher"
              >
                <FiSearch />
              </IconButton>
            </DesktopOnly>

            <DesktopOnly>
              <IconButton
                type="button"
                $isdark={$isdark}
                onClick={toggleTheme}
                aria-label="Changer le thème"
              >
                {$isdark ? <FiMoon /> : <FiSun />}
              </IconButton>
            </DesktopOnly>

            <DesktopOnly>
              <IconButton
                as={Link}
                to="/compte"
                $isdark={$isdark}
                aria-label="Mon compte"
              >
                <FiUser />
              </IconButton>
            </DesktopOnly>

            <IconButton
              as={Link}
              to="/favoris"
              $isdark={$isdark}
              aria-label="Mes favoris"
            >
              {isFavoritesPage ? <HiBookmark /> : <FiBookmark />}
            </IconButton>

            <IconButton
              as={Link}
              to="/panier"
              $isdark={$isdark}
              aria-label="Mon panier"
            >
              <FiShoppingBag />
              {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
            </IconButton>

            <MobileMenuButton
              type="button"
              $isdark={$isdark}
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Rechercher"
            >
              <FiSearch />
            </MobileMenuButton>
          </HeaderActions>
        </HeaderInner>

        {searchOpen && (
          <SearchPanel $isdark={$isdark}>
            <SearchForm onSubmit={handleSearch} $isdark={$isdark}>
              <SearchInput
                type="search"
                placeholder="Que recherchez-vous ?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
                $isdark={$isdark}
              />

              <SearchSubmit
                type="submit"
                $isdark={$isdark}
                aria-label="Lancer la recherche"
              >
                <FiSearch />
              </SearchSubmit>
            </SearchForm>
          </SearchPanel>
        )}
      </HeaderWrapper>

      <MobileOverlay $open={menuOpen} $isdark={$isdark}>
        <MobileMenuHeader>
          <MobileLogo>NUMA</MobileLogo>

          <MobileClose
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <FiX />
          </MobileClose>
        </MobileMenuHeader>

        <MobileLinks>
          {navLinks.map((item, index) => (
            <MenuLink
              key={item.path}
              to={item.path}
              $isdark={$isdark}
              $open={menuOpen}
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              {item.label}
              <FiArrowUpRight />
            </MenuLink>
          ))}

          <MenuLink
            to="/favoris"
            $isdark={$isdark}
            $open={menuOpen}
          >
            Mes favoris
            <FiBookmark />
          </MenuLink>

          <MenuLink
            to="/compte"
            $isdark={$isdark}
            $open={menuOpen}
          >
            Mon compte
            <FiArrowUpRight />
          </MenuLink>

          <MenuLink
            to="/admin-livreur"
            $isdark={$isdark}
            $open={menuOpen}
          >
            Espace livreur
            <FiArrowUpRight />
          </MenuLink>
        </MobileLinks>

        <MobileFooter>
          <MobileFooterLink to="/apropo">
            À propos de NUMA
          </MobileFooterLink>

          <MobileFooterLink to="/paiement-3x">
            Nos moyens de paiement
          </MobileFooterLink>

          <button
            type="button"
            onClick={toggleTheme}
            style={{
              border: "none",
              background: "transparent",
              color: "inherit",
              textAlign: "left",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
              letterSpacing: "inherit",
              textTransform: "inherit",
            }}
          >
            Changer le thème {$isdark ? "sombre" : "clair"}
          </button>
        </MobileFooter>
      </MobileOverlay>
    </>
  );
}

export default Header;
