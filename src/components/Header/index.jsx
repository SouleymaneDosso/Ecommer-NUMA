import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FiShoppingBag,
  FiUser,
  FiSun,
  FiMoon,
  FiX,
  FiHeart,
  FiSearch
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context"; 
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
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(20,20,20,0.85))"
      : "linear-gradient(180deg, #fff, #f5f5f5)"};
  border-bottom: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)")};
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 6px 28px rgba(0,0,0,0.6)" : "0 6px 28px rgba(0,0,0,0.08)"};
`;

const HeaderTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderSpacer = styled.div`
  height: ${HEADER_HEIGHT + 60}px; /* +60px pour la barre recherche */
  width: 100%;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: -0.02em;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  text-decoration: none;
  z-index: 10002;
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
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
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
      $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 10002;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
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
  z-index: 10003;

  div.bar {
    width: 22px;
    height: 2px;
    background: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
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
  background: ${({ $isdark }) => ($isdark ? "#000" : "#fff")};
  z-index: 10001;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $open }) =>
    $open ? "-12px 0 30px rgba(0,0,0,0.3)" : "none"};
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)")};
`;

const MobileTitle = styled.div`
  font-weight: 700;
  font-size: 1.15rem;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  font-size: 22px;
`;

const MobileContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10000;
`;

const MobileItem = styled(Link)`
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  font-weight: 600;
  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
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

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8px;
  max-width: 500px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 50px 0 0 50px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#222" : "#ccc")};
  background: ${({ $isdark }) => ($isdark ? "#111" : "#f5f5f5")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  outline: none;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  &:focus {
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  }
  -webkit-text-size-adjust: 100%;
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  border-radius: 0 50px 50px 0;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#222" : "#ccc")};
  background: ${({ $isdark }) => ($isdark ? "#111" : "#eaeaea")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background: ${({ $isdark }) => ($isdark ? "#222" : "#ddd")};
    transform: scale(1.05);
  }
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

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

  // Scroll lock
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

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <>
      <HeaderWrapper $isdark={$isdark}>
        <HeaderTop>
          <Logo to="/" $isdark={$isdark}>NUMA</Logo>

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
        </HeaderTop>

        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            $isdark={$isdark}
            type="text"
            placeholder={t("searchProducts")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchButton type="submit" $isdark={$isdark}>
            <FiSearch size={20} />
          </SearchButton>
        </SearchForm>
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
          <MobileItem to="/apropo" onClick={() => setOpen(false)} $isdark={$isdark}>{t("about")}</MobileItem>

          <div style={{ height: 1, background: $isdark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", margin: "8px 0 4px" }} />

          <MobileItem to="/compte" onClick={() => setOpen(false)}><FiUser /> {t("account")}</MobileItem>
          <MobileItem to="/panier" onClick={() => setOpen(false)}><FiShoppingBag /> {t("cart")}</MobileItem>
        </MobileContent>
      </MobilePanel>
    </>
  );
}
