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

const fadeSlide = keyframes`
from { opacity:0; transform:translateY(-20px); }
to { opacity:1; transform:translateY(0); }
`;

const linkAppear = keyframes`
from { opacity:0; transform:translateY(10px); }
to { opacity:1; transform:translateY(0); }
`;

const HeaderWrapper = styled.header`
  position: fixed;
  top: ${({ $show }) => ($show ? "0" : `-${HEADER_HEIGHT}px`)};
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;

  transition: top 0.35s ease, background 0.3s ease, color 0.3s ease;

  /* plus de blur */
  /* backdrop-filter: blur(10px); */

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
  transition: transform .15s ease;

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

  transition: all .25s ease;
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;

  display: ${({ $open }) => ($open ? "flex" : "none")};

  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(0,0,0,0.96)" : "rgba(255,255,255,0.98)"};

  /* plus de blur */
  /* backdrop-filter: blur(12px); */

  animation: ${fadeSlide} .35s ease;

  z-index: 10000;
`;

const MenuLink = styled(Link)`
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
  margin: 12px 0;
  opacity: 0;
  animation: ${linkAppear} .4s forwards;

  &:nth-child(1){animation-delay:.05s}
  &:nth-child(2){animation-delay:.12s}
  &:nth-child(3){animation-delay:.18s}
  &:nth-child(4){animation-delay:.24s}
  &:nth-child(5){animation-delay:.30s}

  transition: transform .2s ease;

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

export default function Header() {

  const { theme, themeToglle, ToggleTheme } = useContext(ThemeContext || {});
  const { ajouter } = useContext(PanierContext);

  const toggleTheme = themeToglle ?? ToggleTheme ?? (() => {});
  const $isdark = theme === "light";

  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const heroPage = location.pathname === "/";

  const totalItems = ajouter.reduce((acc,item)=>acc+item.quantite,0);

  const [scrolled,setScrolled] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [searchOpen,setSearchOpen] = useState(false);
  const [query,setQuery] = useState("");

  const [showHeader,setShowHeader] = useState(true);
  const [lastScrollY,setLastScrollY] = useState(0);

  useEffect(()=>{

    const handleScroll = ()=>{

      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 80);

      if(currentScrollY > lastScrollY && currentScrollY > 120){
        setShowHeader(false);
      }else{
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);

    };

    window.addEventListener("scroll",handleScroll);

    return ()=> window.removeEventListener("scroll",handleScroll);

  },[lastScrollY]);

  const handleSearch = (e)=>{

    e.preventDefault();

    if(!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);

    setQuery("");
    setSearchOpen(false);

  };

  return (

    <>

      <HeaderWrapper
        $isdark={$isdark}
        $hero={heroPage}
        $scrolled={scrolled}
        $show={showHeader}
      >

        <HeaderTop>

          <Logo to="/">NUMA</Logo>

          <Actions>

            <IconButton onClick={toggleTheme}>
              {$isdark ? <FiMoon/> : <FiSun/>}
            </IconButton>

            <SearchWrapper>

              <IconButton onClick={()=>setSearchOpen(prev=>!prev)}>
                <FiSearch/>
              </IconButton>

              <form onSubmit={handleSearch}>

                <SearchInput
                  $open={searchOpen}
                  type="text"
                  placeholder={t("searchProducts")}
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                />

              </form>

            </SearchWrapper>

            <IconButton as={Link} to="/compte">
              <FiUser/>
            </IconButton>

            <IconButton as={Link} to="/panier" style={{position:"relative"}}>
              <FiShoppingBag/>
              {totalItems>0 && <CartCount>{totalItems}</CartCount>}
            </IconButton>

            <IconButton as={Link} to="/favoris">
              <FiHeart/>
            </IconButton>

            <IconButton onClick={()=>setMenuOpen(prev=>!prev)}>
              {menuOpen ? <FiX/> : <FiMenu/>}
            </IconButton>

          </Actions>

        </HeaderTop>

      </HeaderWrapper>

      <MobileMenu $open={menuOpen} $isdark={$isdark}>

        <CloseButton $isdark={$isdark} onClick={()=>setMenuOpen(false)}>
          <FiX/>
        </CloseButton>

        <MenuLink to="/" onClick={()=>setMenuOpen(false)}>{t("home")}</MenuLink>
        <MenuLink to="/collections" onClick={()=>setMenuOpen(false)}>{t("collections")}</MenuLink>
        <MenuLink to="/new" onClick={()=>setMenuOpen(false)}>{t("new")}</MenuLink>
        <MenuLink to="/promo" onClick={()=>setMenuOpen(false)}>{t("deals")}</MenuLink>
        <MenuLink to="/apropo" onClick={()=>setMenuOpen(false)}>{t("about")}</MenuLink>

      </MobileMenu>

    </>
  );
}