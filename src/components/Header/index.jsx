import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiShoppingBag, FiUser, FiSun, FiMoon, FiX, FiHeart } from "react-icons/fi";
import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.6rem;
  gap: 1rem;
  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(180deg, rgba(8,10,20,0.85), rgba(15,23,42,0.75))"
      : "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(248,250,255,0.75))"};
  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.1)" : "rgba(16,24,40,0.1)"};
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 5px 25px rgba(2,6,23,0.65)" : "0 6px 29px rgba(15,23,42,0.15)"};
  transition: all 0.35s ease;
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
  gap: 1.25rem;
  align-items: center;

  @media (max-width: 840px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ $isdark }) => ($isdark ? "#e6eefc" : "#0f172a")};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 200ms ease, background 200ms ease, opacity 160ms ease;

  &:hover {
    transform: translateY(-3px);
    opacity: 0.95;
    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ThemeButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#0f172a")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease, background 200ms ease, color 0.35s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const BurgerButton = styled.button`
  display: none;
  @media (max-width: 840px) {
    display: inline-flex;
  }

  width: 44px;
  height: 44px;
  padding: 6px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  position: relative;

  div.bar {
    width: 22px;
    height: 2px;
    background: ${({ $isdark }) => ($isdark ? "#f8fafc" : "#0f172a")};
    border-radius: 2px;
    transition: transform 300ms ease, opacity 200ms ease, top 300ms ease;
    position: absolute;
  }
  div.bar.top {
    top: ${({ $open }) => ($open ? "21px" : "14px")};
    transform: ${({ $open }) => ($open ? "rotate(45deg)" : "none")};
  }
  div.bar.mid {
    top: 21px;
    opacity: ${({ $open }) => ($open ? 0 : 1)};
  }
  div.bar.bot {
    top: ${({ $open }) => ($open ? "21px" : "28px")};
    transform: ${({ $open }) => ($open ? "rotate(-45deg)" : "none")};
  }
`;

const MobilePanel = styled.aside`
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: ${({ $open }) => ($open ? "320px" : "0")};
  max-width: 360px;
  overflow: hidden;
  background: ${({ $isdark }) => ($isdark ? "#0D192B" : "#f4f4f4")};
  box-shadow: -12px 0 30px rgba(2,6,23,0.35);
  transition: width 360ms cubic-bezier(0.2, 0.9, 0.2, 1), transform 360ms ease, background 0.35s ease;
  transform: translateX(${({ $open }) => ($open ? "0" : "6px")});
  border-left: 1px solid ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.03)" : "rgba(10,10,10,0.04)")};
  z-index: 120;
  display: flex;
  flex-direction: column;
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")};
`;

const MobileTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ $isdark }) => ($isdark ? "#f3f6fb" : "#071230")};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#0f172a")};
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const MobileItem = styled(Link)`
  text-decoration: none;
  color: ${({ $isdark }) => ($isdark ? "#f3f6fb" : "#071230")};
  font-size: 1.15rem;
  font-weight: 600;
  padding: 12px 8px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;

  &:hover {
    background: ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.02)" : "rgba(2,6,23,0.03)")};
  }
`;

const Overlay = styled.div`
  display: ${({ $open }) => ($open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(2,6,23, ${({ $open }) => ($open ? 0.35 : 0)});
  z-index: 110;
  transition: background 240ms ease;
`;

export default function Header() {
  const { theme, themeToglle, ToggleTheme } = useContext(ThemeContext || {});
  const toggleTheme = themeToglle ?? ToggleTheme ?? (() => {});
  const $isdark = theme === "light";

  const { t, i18n } = useTranslation();
  const toggleLangue = () => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Bloquer scroll quand menu ouvert
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);


  useEffect(() => {
    function handleClickOutside(e) {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
          <ThemeButton onClick={toggleTheme} $isdark={$isdark}>
            { $isdark ? <FiMoon size={20} /> : <FiSun size={20} /> }
          </ThemeButton>

          <ThemeButton onClick={toggleLangue} $isdark={$isdark}>
            {i18n.language === "fr" ? "FR" : "EN"}
          </ThemeButton>

          <NavLink to="/compte" $isdark={$isdark}><FiUser /></NavLink>
          <NavLink to="/panier" $isdark={$isdark}><FiShoppingBag /></NavLink>
          <NavLink to="/favoris" $isdark={$isdark}><FiHeart /></NavLink>

          <BurgerButton onClick={() => setOpen(!open)} $open={open} $isdark={$isdark}>
            <div className="bar top" />
            <div className="bar mid" />
            <div className="bar bot" />
          </BurgerButton>
        </Actions>
      </HeaderWrapper>

      <Overlay $open={open} onClick={() => setOpen(false)} />

      <MobilePanel $open={open} $isdark={$isdark} ref={panelRef}>
        <MobileHeader $isdark={$isdark}>
          <MobileTitle $isdark={$isdark}>NUMA</MobileTitle>
          <CloseButton $isdark={$isdark} onClick={() => setOpen(false)}><FiX /></CloseButton>
        </MobileHeader>

        <MobileContent>
          <MobileItem to="/" onClick={() => setOpen(false)}>{t("home")}</MobileItem>
          <MobileItem to="/collections" onClick={() => setOpen(false)}>{t("collections")}</MobileItem>
          <MobileItem to="/nouveautes" onClick={() => setOpen(false)}>{t("new")}</MobileItem>
          <MobileItem to="/promotions" onClick={() => setOpen(false)}>{t("deals")}</MobileItem>
          <MobileItem to="/a-propos" onClick={() => setOpen(false)}>{t("about")}</MobileItem>

          <div style={{ height: 1, background: $isdark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", margin: "8px 0 4px" }} />

          <MobileItem to="/compte" onClick={() => setOpen(false)}><FiUser /> {t("account")}</MobileItem>
          <MobileItem to="/panier" onClick={() => setOpen(false)}><FiShoppingBag /> {t("cart")}</MobileItem>
        </MobileContent>
      </MobilePanel>
    </>
  );
}

