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

/* ===== STYLES ===== */
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;

  background: ${({ $isdark, $scrolled }) =>
    $scrolled
      ? $isdark
        ? "rgba(0,0,0,0.85)"
        : "#fff"
      : "transparent"};

  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 6px 28px rgba(0,0,0,0.1)" : "none"};

  color: ${({ $isdark, $scrolled }) =>
    $scrolled ? ($isdark ? "#fff" : "#111") : "#fff"};
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
  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
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

/* Search minimal */
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
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <>
      <HeaderWrapper $isdark={$isdark} $scrolled={scrolled}>
        <HeaderTop>
          <Logo to="/" $isdark={$isdark}>NUMA</Logo>

          <Actions>
            <IconButton onClick={toggleTheme} $isdark={$isdark}>
              {$isdark ? <FiMoon size={18} /> : <FiSun size={18} />}
            </IconButton>
           

            <SearchWrapper>
              <IconButton onClick={() => setSearchOpen(prev => !prev)} $isdark={$isdark}>
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

            <IconButton as={Link} to="/compte" $isdark={$isdark}>
              <FiUser />
            </IconButton>

            <IconButton as={Link} to="/panier" $isdark={$isdark} style={{ position: "relative" }}>
              <FiShoppingBag />
              {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
            </IconButton>

            <IconButton as={Link} to="/favoris" $isdark={$isdark}>
              <FiHeart />
            </IconButton>
          </Actions>
        </HeaderTop>
      </HeaderWrapper>
    </>
  );
}