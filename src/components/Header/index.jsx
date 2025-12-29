import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FiShoppingBag,
  FiUser,
  FiSun,
  FiMoon,
  FiX,
  FiHeart,
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context"; // Ajout du PanierContext
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = 70; 

/* ===== ANIMATIONS ===== */
const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;
const fadeOut = keyframes`
  from { opacity: 1 }
  to { opacity: 0 }
`;

/* ===== STYLES ===== */
const HeaderWrapper = styled.header`
  --header-h: ${HEADER_HEIGHT}px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-h);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 0.5rem;
  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(180deg, rgba(6,8,14,0.85), rgba(12,18,30,0.85))"
      : "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,255,0.92))"};
  border-bottom: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.04)" : "rgba(16,24,40,0.06)")};
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 6px 28px rgba(0,0,0,0.6)" : "0 6px 28px rgba(15,23,42,0.08)"};
`;

const HeaderSpacer = styled.div`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: ${({ $isdark }) => ($isdark ? "#e6eefc" : "#0f172a")};
  text-decoration: none;
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 840px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ $isdark }) => ($isdark ? "#e6eefc" : "#071230")};
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 160ms ease, background 160ms ease, color 160ms ease;
  &:hover {
    transform: translateY(-2px);
    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)"};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)"};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#0f172a")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 150ms ease, background 150ms ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const BurgerButton = styled.button`
  display: none;
  @media (max-width: 840px) {
    display: inline-flex;
  }
  width: 40px;
  height: 40px;
  padding: 6px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  z-index: 10001;

  div.bar {
    width: 22px;
    height: 2px;
    background: ${({ $isdark }) => ($isdark ? "#fff" : "#071230")};
    border-radius: 2px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all 260ms ease;
  }
  div.bar.top {
    top: ${({ $open }) => ($open ? "19px" : "12px")};
    transform: ${({ $open }) => ($open ? "rotate(45deg)" : "none")};
  }
  div.bar.mid {
    top: 21px;
    opacity: ${({ $open }) => ($open ? 0 : 1)};
  }
  div.bar.bot {
    top: ${({ $open }) => ($open ? "19px" : "30px")};
    transform: ${({ $open }) => ($open ? "rotate(-45deg)" : "none")};
  }
`;

const Overlay = styled.div`
  display: ${({ $open }) => ($open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1000;
  animation: ${({ $open }) => ($open ? fadeIn : fadeOut)} 260ms ease forwards;
`;

const MobilePanel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(360px, 100vw);
  max-width: 70%;
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 260ms cubic-bezier(0.25, 0.9, 0.2, 1);
  background: ${({ $isdark }) => ($isdark ? "#071124" : "#fff")};
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $open }) =>
    $open ? "-12px 0 30px rgba(0,0,0,0.24)" : "none"};
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)")};
`;

const MobileTitle = styled.div`
  font-weight: 700;
  font-size: 1.15rem;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#071230")};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#071230")};
  font-size: 22px;
  z-index: 1002;
`;

const MobileContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MobileItem = styled(Link)`
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#071230")};
  font-weight: 600;
  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)"};
  }
`;

/* ===== COMPTEUR PANIER ===== */
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

/* ===== COMPONENT ===== */
export default function Header() {
  const { theme, themeToglle, ToggleTheme } = useContext(ThemeContext || {});
  const { ajouter } = useContext(PanierContext); // compteur
  const toggleTheme = themeToglle ?? ToggleTheme ?? (() => {});
  const $isdark = theme === "light";

  const { t, i18n } = useTranslation();
  const toggleLangue = () =>
    i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");

  const [open, setOpen] = useState(false);

  // Scroll lock fiable
  useEffect(() => {
    let scrollY = 0;
    if (open) {
      scrollY = window.scrollY || window.pageYOffset;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      if (top) {
        const scrollPosition = parseInt(top.replace("-", "").replace("px", ""), 10);
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [open]);

  // Close on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <>
      <HeaderWrapper $isdark={$isdark}>
        <Logo to="/" $isdark={$isdark}>NUMA</Logo>

        <DesktopNav>
          <NavLink to="/collections" $isdark={$isdark}>{t("collections")}</NavLink>
          <NavLink to="/nouveautes" $isdark={$isdark}>{t("new")}</NavLink>
          <NavLink to="/promotions" $isdark={$isdark}>{t("deals")}</NavLink>
          <NavLink to="/a-propos" $isdark={$isdark}>{t("about")}</NavLink>
        </DesktopNav>

        <Actions>
          <IconButton onClick={toggleTheme} $isdark={$isdark}>
            {$isdark ? <FiMoon size={18} /> : <FiSun size={18} />}
          </IconButton>
          <IconButton onClick={toggleLangue} $isdark={$isdark}>
            {i18n.language === "fr" ? "FR" : "EN"}
          </IconButton>

          <NavLink to="/compte" $isdark={$isdark}><FiUser /></NavLink>

          <NavLink to="/panier" $isdark={$isdark} style={{ position: "relative" }}>
            <FiShoppingBag />
            {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
          </NavLink>

          <NavLink to="/favoris" $isdark={$isdark}><FiHeart /></NavLink>

          <BurgerButton
            onClick={() => setOpen(prev => !prev)}
            $open={open}
            $isdark={$isdark}
            aria-expanded={open}
          >
            <div className="bar top" />
            <div className="bar mid" />
            <div className="bar bot" />
          </BurgerButton>
        </Actions>
      </HeaderWrapper>

      <HeaderSpacer />

      <Overlay $open={open} onClick={() => setOpen(false)} />

      <MobilePanel $open={open} $isdark={$isdark}>
        <MobileHeader $isdark={$isdark}>
          <MobileTitle $isdark={$isdark}>NUMA</MobileTitle>
          <CloseButton $isdark={$isdark} onClick={() => setOpen(false)}><FiX /></CloseButton>
        </MobileHeader>

        <MobileContent>
          <MobileItem to="/" onClick={() => setOpen(false)} $isdark={$isdark}>{t("home")}</MobileItem>
          <MobileItem to="/collections" onClick={() => setOpen(false)} $isdark={$isdark}>{t("collections")}</MobileItem>
          <MobileItem to="/new" onClick={() => setOpen(false)} $isdark={$isdark}>{t("new")}</MobileItem>
          <MobileItem to="/promo" onClick={() => setOpen(false)} $isdark={$isdark}>{t("deals")}</MobileItem>
          <MobileItem to="/a-propos" onClick={() => setOpen(false)} $isdark={$isdark}>{t("about")}</MobileItem>

          <div style={{ height: 1, background: $isdark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", margin: "8px 0 4px" }} />

          <MobileItem to="/compte" onClick={() => setOpen(false)}><FiUser /> {t("account")}</MobileItem>
          <MobileItem to="/panier" onClick={() => setOpen(false)}><FiShoppingBag /> {t("cart")}</MobileItem>
        </MobileContent>
      </MobilePanel>
    </>
  );
}
