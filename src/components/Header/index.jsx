import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiShoppingBag, FiUser, FiSun, FiMoon, FiX, FiHeart, FiSearch } from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context"; 
import { useTranslation } from "react-i18next";

const HEADER_HEIGHT = 70;
const SEARCH_HEIGHT = 50;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ $isdark }) => $isdark ? "#0a0a0a" : "#fff"};
  border-bottom: 1px solid ${({ $isdark }) => $isdark ? "rgba(255,255,255,0.05)" : "#ddd"};
  backdrop-filter: blur(10px);
  height: ${HEADER_HEIGHT + SEARCH_HEIGHT}px;
  padding: 0.5rem 1rem;
`;

const HeaderSpacer = styled.div`
  height: ${HEADER_HEIGHT + SEARCH_HEIGHT}px;
  width: 100%;
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
  color: ${({ $isdark }) => $isdark ? "#fff" : "#111"};
  text-decoration: none;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ $isdark }) => $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
  color: ${({ $isdark }) => $isdark ? "#fff" : "#111"};
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-width: 600px;
  margin-top: 8px;
  display: flex;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 50px 0 0 50px;
  border: 1px solid ${({ $isdark }) => $isdark ? "#444" : "#ccc"};
  background: ${({ $isdark }) => $isdark ? "rgba(255,255,255,0.05)" : "#f5f5f5"};
  color: ${({ $isdark }) => $isdark ? "#fff" : "#111"};
  font-size: 0.95rem;
  outline: none;
  width: 100%;
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  border-radius: 0 50px 50px 0;
  border: 1px solid ${({ $isdark }) => $isdark ? "#444" : "#ccc"};
  background: ${({ $isdark }) => $isdark ? "rgba(255,255,255,0.1)" : "#eaeaea"};
  color: ${({ $isdark }) => $isdark ? "#fff" : "#111"};
  cursor: pointer;
`;

export default function Header() {
  const { theme, themeToglle, ToggleTheme } = useContext(ThemeContext || {});
  const { ajouter } = useContext(PanierContext);
  const toggleTheme = themeToglle ?? ToggleTheme ?? (() => {});
  const $isdark = theme === "light";
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const totalItems = ajouter.reduce((acc, item) => acc + item.quantite, 0);

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
            <Link to="/panier" style={{ position: "relative" }}>
              <IconButton $isdark={$isdark}><FiShoppingBag /></IconButton>
              {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
            </Link>
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
          <SearchButton type="submit" $isdark={$isdark}><FiSearch /></SearchButton>
        </SearchForm>
      </HeaderWrapper>

      <HeaderSpacer />
    </>
  );
}
