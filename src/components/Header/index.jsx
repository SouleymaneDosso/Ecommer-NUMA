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
  FiMessageCircle,
} from "react-icons/fi";
import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";
import { socket } from "../../services/socket";

const HEADER_HEIGHT = 70;
const TOPBAR_HEIGHT = 50;

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const linkSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const messagePulse = keyframes`
  0% {
    transform: scale(1);
  }

  35% {
    transform: scale(1.18);
  }

  70% {
    transform: scale(0.96);
  }

  100% {
    transform: scale(1);
  }
`;

const badgePop = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0;
  }

  70% {
    transform: scale(1.15);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

/* =========================================================
   HEADER
========================================================= */

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
    $scrolled
      ? "0 6px 28px rgba(0,0,0,0.08)"
      : "none"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};
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

  transition:
    transform 0.15s ease,
    background 0.2s ease;

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

/* =========================================================
   MESSAGE BUTTON
========================================================= */

const MessageButton = styled(Link)`
  width: 36px;
  height: 36px;

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  color: inherit;
  text-decoration: none;

  transition:
    transform 0.15s ease,
    background 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  ${({ $hasUnread }) =>
    $hasUnread &&
    `
      svg {
        animation: ${messagePulse} 0.55s ease;
      }
    `}
`;

const MessageBadge = styled.span`
  position: absolute;

  top: -7px;
  right: -7px;

  min-width: 19px;
  height: 19px;

  padding: 0 5px;

  background: #ef4444;
  color: #fff;

  border: 2px solid
    ${({ $isdark }) =>
      $isdark ? "#000" : "#fff"};

  border-radius: 999px;

  font-size: 10px;
  font-weight: 800;

  display: flex;
  align-items: center;
  justify-content: center;

  line-height: 1;

  animation: ${badgePop} 0.25s ease;
`;

const MessageDot = styled.span`
  position: absolute;

  width: 7px;
  height: 7px;

  top: 0;
  right: 0;

  background: #22c55e;

  border-radius: 50%;

  border: 2px solid
    ${({ $isdark }) =>
      $isdark ? "#000" : "#fff"};
`;

/* =========================================================
   SEARCH
========================================================= */

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  position: absolute;

  top: 50%;
  right: 40px;

  transform: translateY(-50%);

  width: ${({ $open }) =>
    $open ? "200px" : "0"};

  opacity: ${({ $open }) =>
    $open ? 1 : 0};

  padding: ${({ $open }) =>
    $open ? "8px 12px" : "0"};

  border-radius: 50px;
  border: 1px solid #ccc;

  outline: none;

  transition: all 0.25s ease;
`;

/* =========================================================
   MOBILE MENU
========================================================= */

const MobileMenu = styled.div`
  position: fixed;

  top: 0;
  left: 0;

  width: 100%;
  height: 90vh;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  background: ${({ $isdark }) =>
    $isdark
      ? "rgba(0,0,0,0.96)"
      : "rgba(255,255,255,0.98)"};

  transform: ${({ $open }) =>
    $open
      ? "translateY(0)"
      : "translateY(-100%)"};

  opacity: ${({ $open }) =>
    $open ? 1 : 0};

  transition:
    transform 0.35s ease,
    opacity 0.35s ease;

  animation: ${fadeSlide} 0.35s ease;

  z-index: 10000;
`;

const MenuLink = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;

  text-decoration: none;
  color: inherit;

  margin: 20px 0;

  transform: ${({ $open }) =>
    $open
      ? "translateY(0)"
      : "translateY(15px)"};

  opacity: ${({ $open }) =>
    $open ? 1 : 0};

  transition:
    transform 0.3s ease
      ${({ $delay }) => $delay}s,
    opacity 0.3s ease
      ${({ $delay }) => $delay}s;

  animation: ${({ $open }) =>
      $open ? linkSlide : "none"}
    0.35s forwards;

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

  font-size: 25px;

  cursor: pointer;

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#000"};
`;

/* =========================================================
   TOP BAR
========================================================= */

const TopBarWrapper = styled.div`
  width: 100%;
  height: ${TOPBAR_HEIGHT}px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 1rem;

  background: linear-gradient(
    90deg,
    black,
    black
  );

  color: #fff;

  position: fixed;

  top: 0;
  left: 0;

  z-index: 10001;

  box-sizing: border-box;

  font-weight: 500;
  font-size: 0.95rem;

  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.08);

  transition:
    transform 0.35s ease,
    opacity 0.35s ease;

  a {
    color: #fff;
    text-decoration: underline;

    margin: 0 4px;

    font-weight: 600;
  }

  &.closing {
    transform: translateY(-100%);
    opacity: 0;
  }

  @media (max-width: 768px) {
    height: 56px;
    font-size: 0.8rem;
    text-align: center;
  }
`;

const Messagelink = styled(Link)`
  display: flex;
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

const TopBarContent = styled.div`
  display: flex;
  align-items: center;

  gap: 6px;

  flex-wrap: nowrap;
`;

/* =========================================================
   HEADER COMPONENT
========================================================= */

export default function Header() {
  const themeContext = useContext(ThemeContext);
  const panierContext = useContext(PanierContext);

  const theme =
    themeContext?.theme ?? "dark";

  const toggleTheme =
    themeContext?.themeToglle ??
    themeContext?.ToggleTheme ??
    (() => {});

  const ajouter =
    panierContext?.ajouter ?? [];

  const $isdark = theme === "light";

  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const heroPage =
    location.pathname === "/";

  const totalItems = ajouter.reduce(
    (acc, item) =>
      acc + item.quantite,
    0
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [scrolled, setScrolled] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [showHeader, setShowHeader] =
    useState(true);

  const [lastScrollY, setLastScrollY] =
    useState(0);

  const [showTopBar, setShowTopBar] =
    useState(true);

  const [closingTopBar, setClosingTopBar] =
    useState(false);

  /* =========================================================
     MESSAGES NON LUS
  ========================================================= */

  const [unreadMessages, setUnreadMessages] =
    useState(0);

  const [lastConversation, setLastConversation] =
    useState(null);

  const lastMessageIdsRef =
    useRef(new Set());

  /* =========================================================
     IDENTIFICATION
  ========================================================= */

  const tokenClient =
    localStorage.getItem("token");

  const tokenLivreur =
    localStorage.getItem(
      "tokenLivreur"
    );

  const isLivreur =
    Boolean(tokenLivreur && !tokenClient);

  const isClient =
    Boolean(tokenClient && !tokenLivreur);

  /* =========================================================
     CHARGER NOTIFICATIONS SAUVEGARDÉES
  ========================================================= */

  useEffect(() => {
    try {
      const storageKey = isLivreur
        ? "numa_unread_messages_livreur"
        : "numa_unread_messages_client";

      const savedCount =
        Number(
          sessionStorage.getItem(storageKey)
        ) || 0;

      const savedConversation =
        sessionStorage.getItem(
          `${storageKey}_conversation`
        );

      setUnreadMessages(savedCount);

      if (savedConversation) {
        try {
          setLastConversation(
            JSON.parse(savedConversation)
          );
        } catch {
          setLastConversation(null);
        }
      }
    } catch {
      setUnreadMessages(0);
      setLastConversation(null);
    }
  }, [isLivreur]);

  /* =========================================================
     SOCKET.IO — NOUVEAUX MESSAGES
  ========================================================= */

  useEffect(() => {
    const handleNouveauMessage = (data) => {
      if (
        !data?.commandeId ||
        !data?.nouveauMessage
      ) {
        return;
      }

      const commandeId =
        String(data.commandeId);

      const message =
        data.nouveauMessage;

      const messageId = message?._id
        ? String(message._id)
        : `${commandeId}-${message?.date || Date.now()}`;

      /*
       * Empêcher le même événement
       * d'être compté plusieurs fois.
       */

      if (
        lastMessageIdsRef.current.has(
          messageId
        )
      ) {
        return;
      }

      lastMessageIdsRef.current.add(
        messageId
      );

      /*
       * Limiter la mémoire du Set.
       */

      if (
        lastMessageIdsRef.current.size >
        100
      ) {
        const first =
          lastMessageIdsRef.current
            .values()
            .next()
            .value;

        if (first) {
          lastMessageIdsRef.current.delete(
            first
          );
        }
      }

      /*
       * Si on est déjà dans cette conversation,
       * Conversation.jsx gère le message.
       *
       * On ne l'ajoute donc pas au compteur global.
       */

      const conversationClient =
        location.pathname ===
        `/conversation/${commandeId}`;

      const conversationLivreur =
        location.pathname ===
        `/conversation-livreur/${commandeId}`;

      if (
        conversationClient ||
        conversationLivreur
      ) {
        return;
      }

      /*
       * Vérifier que le message est bien destiné
       * au type d'utilisateur actuel.
       */

      const expediteurType =
        message?.expediteur?.type ||
        message?.sender?.type ||
        "";

      if (
        isClient &&
        expediteurType === "client"
      ) {
        return;
      }

      if (
        isLivreur &&
        expediteurType === "livreur"
      ) {
        return;
      }

      /*
       * Déterminer la route.
       */

      const route = isLivreur
        ? `/conversation-livreur/${commandeId}`
        : `/conversation/${commandeId}`;

      /*
       * Enregistrer la conversation reçue.
       */

      const conversationData = {
        commandeId,
        messageId,
        message: message?.message || "",
        date:
          message?.date ||
          new Date().toISOString(),
        route,
      };

      setLastConversation(
        conversationData
      );

      /*
       * Incrémenter le compteur.
       */

      setUnreadMessages((previous) => {
        const next = previous + 1;

        try {
          const storageKey = isLivreur
            ? "numa_unread_messages_livreur"
            : "numa_unread_messages_client";

          sessionStorage.setItem(
            storageKey,
            String(next)
          );

          sessionStorage.setItem(
            `${storageKey}_conversation`,
            JSON.stringify(
              conversationData
            )
          );
        } catch {}

        return next;
      });
    };

    socket.on(
      "nouveau_message",
      handleNouveauMessage
    );

    return () => {
      socket.off(
        "nouveau_message",
        handleNouveauMessage
      );
    };
  }, [
    location.pathname,
    isClient,
    isLivreur,
  ]);

  /* =========================================================
     RÉINITIALISER LE COMPTEUR QUAND ON OUVRE
     UNE CONVERSATION
  ========================================================= */

  useEffect(() => {
    const matchClient =
      location.pathname.match(
        /^\/conversation\/([^/]+)$/
      );

    const matchLivreur =
      location.pathname.match(
        /^\/conversation-livreur\/([^/]+)$/
      );

    const commandeId =
      matchClient?.[1] ||
      matchLivreur?.[1];

    if (!commandeId) {
      return;
    }

    const routeLivreur =
      Boolean(matchLivreur);

    if (
      routeLivreur !== isLivreur
    ) {
      return;
    }

    setUnreadMessages(0);

    setLastConversation(null);

    try {
      const storageKey = isLivreur
        ? "numa_unread_messages_livreur"
        : "numa_unread_messages_client";

      sessionStorage.removeItem(
        storageKey
      );

      sessionStorage.removeItem(
        `${storageKey}_conversation`
      );
    } catch {}
  }, [
    location.pathname,
    isLivreur,
  ]);

  /* =========================================================
     CLIC SUR ICÔNE MESSAGE
  ========================================================= */

  const handleMessageClick = (event) => {
    /*
     * S'il n'y a pas encore de conversation,
     * on ouvre une destination logique.
     */

    if (lastConversation?.route) {
      event.preventDefault();

      navigate(
        lastConversation.route
      );
    }
  };

  const messageRoute =
    lastConversation?.route ||
    (isLivreur
      ? "/admin-livreur"
      : "/compte");

  /* =========================================================
     TOP BAR
  ========================================================= */

  const handleCloseTopBar = () => {
    setClosingTopBar(true);

    setTimeout(() => {
      setShowTopBar(false);
    }, 350);
  };

  /* =========================================================
     BLOQUER SCROLL MENU
  ========================================================= */

  useEffect(() => {
    if (menuOpen) {
      const scrollY =
        window.scrollY;

      document.body.style.position =
        "fixed";

      document.body.style.top =
        `-${scrollY}px`;

      document.body.style.width =
        "100%";
    } else {
      const scrollY =
        -parseInt(
          document.body.style.top || "0"
        );

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(
        0,
        scrollY
      );
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [menuOpen]);

  /* =========================================================
     HEADER QUI DISPARAÎT AU SCROLL
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      setScrolled(
        currentScrollY > 80
      );

      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 120
      ) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(
        currentScrollY
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [lastScrollY]);

  /* =========================================================
     RECHERCHE
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(
        query
      )}`
    );

    setQuery("");
    setSearchOpen(false);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      {showTopBar && (
        <TopBarWrapper
          className={
            closingTopBar
              ? "closing"
              : ""
          }
        >
          <TopBarContent>
            <Messagelink to="/paiement-3x">
              Paiement en 3 tranches
            </Messagelink>

            : réservez, payez à votre
            rythme. Vous pouvez aussi
            Payer à la livraison.
          </TopBarContent>

          <CloseTopBar
            onClick={
              handleCloseTopBar
            }
            aria-label="Fermer"
          >
            ×
          </CloseTopBar>
        </TopBarWrapper>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <HeaderWrapper
        $isdark={$isdark}
        $hero={heroPage}
        $scrolled={scrolled}
        $show={showHeader}
        $topOffset={
          showTopBar
            ? TOPBAR_HEIGHT
            : 0
        }
      >
        <HeaderTop>
          {/* LOGO */}

          <Logo to="/">NUMA</Logo>

          {/* ACTIONS */}

          <Actions>
            {/* THEME */}

            <IconButton
              onClick={toggleTheme}
              aria-label="Changer le thème"
            >
              {$isdark ? (
                <FiMoon />
              ) : (
                <FiSun />
              )}
            </IconButton>

            {/* COMPTE */}

            <IconButton
              as={Link}
              to="/compte"
              aria-label="Mon compte"
            >
              <FiUser />
            </IconButton>

            {/* =================================================
                MESSAGES
            ================================================= */}

            <MessageButton
              to={messageRoute}
              $hasUnread={
                unreadMessages > 0
              }
              onClick={
                handleMessageClick
              }
              aria-label={
                unreadMessages > 0
                  ? `${unreadMessages} message${
                      unreadMessages > 1
                        ? "s"
                        : ""
                    } non lu${
                      unreadMessages > 1
                        ? "s"
                        : ""
                    }`
                  : "Messages"
              }
            >
              <FiMessageCircle
                size={19}
              />

              {unreadMessages > 0 && (
                <MessageBadge
                  $isdark={$isdark}
                >
                  {unreadMessages >
                  99
                    ? "99+"
                    : unreadMessages}
                </MessageBadge>
              )}

              {unreadMessages === 0 &&
                lastConversation && (
                  <MessageDot
                    $isdark={$isdark}
                  />
                )}
            </MessageButton>

            {/* PANIER */}

            <IconButton
              as={Link}
              to="/panier"
              style={{
                position: "relative",
              }}
              aria-label="Panier"
            >
              <FiShoppingBag />

              {totalItems > 0 && (
                <CartCount>
                  {totalItems}
                </CartCount>
              )}
            </IconButton>

            {/* FAVORIS */}

            <IconButton
              as={Link}
              to="/favoris"
              aria-label="Favoris"
            >
              <FiHeart />
            </IconButton>

            {/* RECHERCHE */}

            <SearchWrapper>
              <IconButton
                onClick={() =>
                  setSearchOpen(
                    (prev) => !prev
                  )
                }
                aria-label="Rechercher"
              >
                <FiSearch />
              </IconButton>

              <form
                onSubmit={
                  handleSearch
                }
              >
                <SearchInput
                  $open={searchOpen}
                  type="text"
                  placeholder={
                    t?.(
                      "searchProducts"
                    ) ??
                    "Search products"
                  }
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      e.target.value
                    )
                  }
                />
              </form>
            </SearchWrapper>

            {/* MENU */}

            <IconButton
              onClick={() =>
                setMenuOpen(
                  (prev) => !prev
                )
              }
              aria-label={
                menuOpen
                  ? "Fermer le menu"
                  : "Ouvrir le menu"
              }
            >
              {menuOpen ? (
                <FiX />
              ) : (
                <FiMenu />
              )}
            </IconButton>
          </Actions>
        </HeaderTop>
      </HeaderWrapper>

      {/* =====================================================
          MENU MOBILE
      ===================================================== */}

      <MobileMenu
        $open={menuOpen}
        $isdark={$isdark}
      >
        <CloseButton
          $isdark={$isdark}
          onClick={() =>
            setMenuOpen(false)
          }
          aria-label="Fermer le menu"
        >
          <FiX />
        </CloseButton>

        <MenuLink
          to="/"
          $open={menuOpen}
          $delay={0.05}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("home") ?? "Home"}
        </MenuLink>

        <MenuLink
          to="/collections"
          $open={menuOpen}
          $delay={0.12}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("collections") ??
            "Collections"}
        </MenuLink>

        <MenuLink
          to="/homme"
          $open={menuOpen}
          $delay={0.05}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("Homme") ?? "Homme"}
        </MenuLink>

        <MenuLink
          to="/femme"
          $open={menuOpen}
          $delay={0.05}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("Femme") ?? "Femme"}
        </MenuLink>

        <MenuLink
          to="/new"
          $open={menuOpen}
          $delay={0.18}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("new") ?? "New"}
        </MenuLink>

        <MenuLink
          to="/promo"
          $open={menuOpen}
          $delay={0.24}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("deals") ?? "Deals"}
        </MenuLink>

        <MenuLink
          to="/apropo"
          $open={menuOpen}
          $delay={0.3}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          {t?.("about") ?? "About"}
        </MenuLink>

        <MenuLink
          to="/admin-livreur"
          $open={menuOpen}
          $delay={0.3}
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Espace livreur
        </MenuLink>
      </MobileMenu>
    </>
  );
}