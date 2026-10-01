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
  FiArrowRight,
} from "react-icons/fi";
import { useContext, useState, useEffect, useMemo } from "react";
import { ThemeContext, PanierContext } from "../../Utils/Context";
import { useTranslation } from "react-i18next";
import { socket } from "../../services/socket";

const HEADER_HEIGHT = 70;
const TOPBAR_HEIGHT = 50;

// =====================================================
// ANIMATIONS
// =====================================================

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

const messagePanelAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// =====================================================
// HEADER
// =====================================================

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

// =====================================================
// PANIER
// =====================================================

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

// =====================================================
// MESSAGES
// =====================================================

const MessageWrapper = styled.div`
  position: relative;
`;

const MessageBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;

  min-width: 18px;
  height: 18px;
  padding: 0 4px;

  background: #ef4444;
  color: #fff;

  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 10px;
  font-weight: 800;
  line-height: 1;

  border: 2px solid
    ${({ $isdark }) =>
      $isdark ? "#111" : "#fff"};

  pointer-events: none;
`;

const MessagePanel = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;

  width: min(360px, calc(100vw - 24px));

  background: ${({ $isdark }) =>
    $isdark ? "#111827" : "#ffffff"};

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111827"};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,0.08)"
        : "rgba(17,24,39,0.08)"};

  border-radius: 16px;

  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.18);

  overflow: hidden;

  animation: ${messagePanelAnimation}
    0.18s ease;

  z-index: 10020;
`;

const MessagePanelHeader = styled.div`
  padding: 14px 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark
        ? "rgba(255,255,255,0.08)"
        : "rgba(17,24,39,0.08)"};
`;

const MessagePanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 800;
`;

const MessagePanelCount = styled.span`
  min-width: 20px;
  height: 20px;
  padding: 0 6px;

  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #ef4444;
  color: #fff;

  font-size: 10px;
  font-weight: 800;
`;

const MessagePanelClose = styled.button`
  width: 28px;
  height: 28px;

  border: none;
  background: transparent;

  color: ${({ $isdark }) =>
    $isdark ? "#9ca3af" : "#6b7280"};

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "#1f2937" : "#f3f4f6"};

    color: ${({ $isdark }) =>
      $isdark ? "#fff" : "#111827"};
  }
`;

const MessageList = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

const MessageItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;

  padding: 13px 15px;

  display: flex;
  align-items: flex-start;
  gap: 11px;

  text-align: left;
  color: inherit;

  cursor: pointer;

  transition: background 0.18s ease;

  &:hover {
    background: ${({ $isdark }) =>
      $isdark ? "#1f2937" : "#f8fafc"};
  }

  & + & {
    border-top: 1px solid
      ${({ $isdark }) =>
        $isdark
          ? "rgba(255,255,255,0.06)"
          : "rgba(17,24,39,0.06)"};
  }
`;

const MessageItemIcon = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;

  border-radius: 12px;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(135deg, #374151, #111827)"
      : "linear-gradient(135deg, #111827, #374151)"};

  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageItemContent = styled.div`
  min-width: 0;
  flex: 1;
`;

const MessageItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const MessageItemName = styled.strong`
  font-size: 13px;
  font-weight: 800;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageItemOrder = styled.span`
  flex-shrink: 0;

  font-size: 10px;
  font-weight: 700;

  color: ${({ $isdark }) =>
    $isdark ? "#9ca3af" : "#9ca3af"};
`;

const MessageItemText = styled.div`
  margin-top: 4px;

  font-size: 12px;
  line-height: 1.45;

  color: ${({ $isdark }) =>
    $isdark ? "#d1d5db" : "#6b7280"};

  overflow: hidden;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MessageItemArrow = styled.div`
  display: flex;
  align-items: center;
  align-self: center;

  color: ${({ $isdark }) =>
    $isdark ? "#9ca3af" : "#9ca3af"};
`;

const EmptyMessages = styled.div`
  padding: 28px 18px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  color: ${({ $isdark }) =>
    $isdark ? "#9ca3af" : "#6b7280"};
`;

const EmptyMessagesIcon = styled.div`
  width: 46px;
  height: 46px;

  border-radius: 14px;

  background: ${({ $isdark }) =>
    $isdark ? "#1f2937" : "#f3f4f6"};

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 10px;
`;

const EmptyMessagesTitle = styled.strong`
  font-size: 13px;

  color: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111827"};
`;

const EmptyMessagesText = styled.span`
  margin-top: 4px;

  font-size: 12px;
  line-height: 1.4;
`;

// =====================================================
// RECHERCHE
// =====================================================

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

// =====================================================
// MENU MOBILE
// =====================================================

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

  animation: ${fadeSlide}
    0.35s ease;

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
    transform 0.3s ease ${({ $delay }) => $delay}s,
    opacity 0.3s ease ${({ $delay }) => $delay}s;

  animation: ${({ $open }) =>
    $open
      ? linkSlide
      : "none"} 0.35s forwards;

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

// =====================================================
// TOP BAR
// =====================================================

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

// =====================================================
// HEADER COMPONENT
// =====================================================

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
    0,
  );

  // ===================================================
  // ÉTATS HEADER
  // ===================================================

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

  // ===================================================
  // ÉTATS MESSAGES
  // ===================================================

  const [notificationsMessages, setNotificationsMessages] =
    useState([]);

  const [messagesOpen, setMessagesOpen] =
    useState(false);

  // ===================================================
  // RÔLE UTILISATEUR
  // ===================================================

  const tokenClient =
    localStorage.getItem("token");

  const tokenLivreur =
    localStorage.getItem("tokenLivreur");

  const roleUtilisateur = useMemo(() => {
    if (tokenLivreur && !tokenClient) {
      return "livreur";
    }

    if (tokenClient) {
      return "client";
    }

    if (tokenLivreur) {
      return "livreur";
    }

    return null;
  }, [tokenClient, tokenLivreur]);

  // ===================================================
  // NOTIFICATIONS SOCKET.IO
  // ===================================================

  useEffect(() => {
    if (!roleUtilisateur) {
      setNotificationsMessages([]);
      return;
    }

    const handleNouveauMessage = (data) => {
      if (!data?.nouveauMessage) {
        return;
      }

      const message =
        data.nouveauMessage;

      const commandeId =
        data.commandeId;

      if (!commandeId) {
        return;
      }

      // -----------------------------------------------
      // Déterminer qui a envoyé le message
      // -----------------------------------------------

      const typeExpediteur =
        message?.expediteur?.type ||
        message?.sender?.type ||
        "";

      /*
       * Un client ne doit recevoir une notification
       * que pour les messages venant du livreur.
       *
       * Un livreur ne doit recevoir une notification
       * que pour les messages venant du client.
       */

      if (
        typeExpediteur &&
        typeExpediteur === roleUtilisateur
      ) {
        return;
      }

      // -----------------------------------------------
      // Si on est déjà dans cette conversation,
      // pas besoin de badge dans le Header.
      // -----------------------------------------------

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

      const messageId = message?._id
        ? String(message._id)
        : `${commandeId}-${message?.date || Date.now()}`;

      // -----------------------------------------------
      // Anti-doublon
      // -----------------------------------------------

      setNotificationsMessages(
        (anciens) => {
          const existeDeja =
            anciens.some(
              (notification) =>
                notification.id ===
                messageId,
            );

          if (existeDeja) {
            return anciens;
          }

          const nouvelleNotification = {
            id: messageId,
            commandeId: String(
              commandeId,
            ),
            message,
            date:
              message?.date ||
              new Date().toISOString(),
          };

          /*
           * On garde au maximum 20 notifications.
           */
          return [
            nouvelleNotification,
            ...anciens,
          ].slice(0, 20);
        },
      );
    };

    const handleMessagesLus = (data) => {
      if (!data) {
        return;
      }

      if (!data.commandeId) {
        return;
      }

      const commandeId =
        String(data.commandeId);

      setNotificationsMessages(
        (anciens) =>
          anciens.filter(
            (notification) =>
              String(
                notification.commandeId,
              ) !== commandeId,
          ),
      );
    };

    socket.on(
      "nouveau_message",
      handleNouveauMessage,
    );

    socket.on(
      "messages_lus",
      handleMessagesLus,
    );

    return () => {
      socket.off(
        "nouveau_message",
        handleNouveauMessage,
      );

      socket.off(
        "messages_lus",
        handleMessagesLus,
      );
    };
  }, [
    roleUtilisateur,
    location.pathname,
  ]);

  // ===================================================
  // NETTOYER LA NOTIFICATION SI ON ENTRE
  // DANS UNE CONVERSATION
  // ===================================================

  useEffect(() => {
    const matchClient =
      location.pathname.match(
        /^\/conversation\/([^/]+)$/,
      );

    const matchLivreur =
      location.pathname.match(
        /^\/conversation-livreur\/([^/]+)$/,
      );

    const commandeId =
      matchClient?.[1] ||
      matchLivreur?.[1];

    if (!commandeId) {
      return;
    }

    setNotificationsMessages(
      (anciens) =>
        anciens.filter(
          (notification) =>
            String(
              notification.commandeId,
            ) !== String(commandeId),
        ),
    );

    setMessagesOpen(false);
  }, [location.pathname]);

  // ===================================================
  // FERMER LE PANNEAU EN CLIQUANT AILLEURS
  // ===================================================

  useEffect(() => {
    if (!messagesOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      const target =
        event.target;

      if (
        target.closest?.(
          "[data-numa-messages]",
        )
      ) {
        return;
      }

      setMessagesOpen(false);
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [messagesOpen]);

  // ===================================================
  // TOP BAR
  // ===================================================

  const handleCloseTopBar = () => {
    setClosingTopBar(true);

    setTimeout(() => {
      setShowTopBar(false);
    }, 350);
  };

  // ===================================================
  // BLOQUER SCROLL MENU
  // ===================================================

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
          document.body.style.top ||
            "0",
        );

      document.body.style.position =
        "";

      document.body.style.top =
        "";

      document.body.style.width =
        "";

      window.scrollTo(
        0,
        scrollY,
      );
    }

    return () => {
      document.body.style.position =
        "";

      document.body.style.top =
        "";

      document.body.style.width =
        "";
    };
  }, [menuOpen]);

  // ===================================================
  // HEADER QUI DISPARAÎT AU SCROLL
  // ===================================================

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      setScrolled(
        currentScrollY > 80,
      );

      if (
        currentScrollY >
          lastScrollY &&
        currentScrollY > 120
      ) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(
        currentScrollY,
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
  }, [lastScrollY]);

  // ===================================================
  // RECHERCHE
  // ===================================================

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(
        query,
      )}`,
    );

    setQuery("");
    setSearchOpen(false);
  };

  // ===================================================
  // OUVRIR UNE CONVERSATION
  // ===================================================

  const ouvrirConversation = (
    commandeId,
  ) => {
    if (!commandeId) {
      return;
    }

    setNotificationsMessages(
      (anciens) =>
        anciens.filter(
          (notification) =>
            String(
              notification.commandeId,
            ) !== String(commandeId),
        ),
    );

    setMessagesOpen(false);

    const route =
      roleUtilisateur === "livreur"
        ? `/conversation-livreur/${commandeId}`
        : `/conversation/${commandeId}`;

    navigate(route);
  };

  // ===================================================
  // RENDU
  // ===================================================

  return (
    <>
      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

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
            {" : "}
            réservez, payez à votre rythme.
            Vous pouvez aussi Payer à la
            livraison.
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

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

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
          <Logo to="/">NUMA</Logo>

          <Actions>
            {/* ========================= */}
            {/* THÈME */}
            {/* ========================= */}

            <IconButton
              onClick={toggleTheme}
              aria-label="Changer le thème"
              title="Changer le thème"
            >
              {$isdark ? (
                <FiMoon />
              ) : (
                <FiSun />
              )}
            </IconButton>

            {/* ========================= */}
            {/* COMPTE */}
            {/* ========================= */}

            <IconButton
              as={Link}
              to="/compte"
              aria-label="Mon compte"
              title="Mon compte"
            >
              <FiUser />
            </IconButton>

            {/* ========================= */}
            {/* MESSAGES */}
            {/* ========================= */}

            <MessageWrapper
              data-numa-messages
            >
              <IconButton
                type="button"
                onClick={() =>
                  setMessagesOpen(
                    (prev) => !prev,
                  )
                }
                aria-label="Messages"
                title="Messages"
              >
                <FiMessageCircle />

                {notificationsMessages.length >
                  0 && (
                  <MessageBadge
                    $isdark={$isdark}
                  >
                    {notificationsMessages.length >
                    99
                      ? "99+"
                      : notificationsMessages.length}
                  </MessageBadge>
                )}
              </IconButton>

              {messagesOpen && (
                <MessagePanel
                  $isdark={$isdark}
                  data-numa-messages
                >
                  <MessagePanelHeader
                    $isdark={$isdark}
                  >
                    <MessagePanelTitle>
                      <FiMessageCircle
                        size={16}
                      />

                      Messages

                      {notificationsMessages.length >
                        0 && (
                        <MessagePanelCount>
                          {
                            notificationsMessages.length
                          }
                        </MessagePanelCount>
                      )}
                    </MessagePanelTitle>

                    <MessagePanelClose
                      type="button"
                      $isdark={$isdark}
                      onClick={() =>
                        setMessagesOpen(
                          false,
                        )
                      }
                      aria-label="Fermer"
                    >
                      <FiX
                        size={15}
                      />
                    </MessagePanelClose>
                  </MessagePanelHeader>

                  {notificationsMessages.length ===
                  0 ? (
                    <EmptyMessages
                      $isdark={$isdark}
                    >
                      <EmptyMessagesIcon
                        $isdark={$isdark}
                      >
                        <FiMessageCircle
                          size={21}
                        />
                      </EmptyMessagesIcon>

                      <EmptyMessagesTitle
                        $isdark={$isdark}
                      >
                        Aucun nouveau message
                      </EmptyMessagesTitle>

                      <EmptyMessagesText
                        $isdark={$isdark}
                      >
                        Vous êtes à jour.
                      </EmptyMessagesText>
                    </EmptyMessages>
                  ) : (
                    <MessageList>
                      {notificationsMessages.map(
                        (
                          notification,
                        ) => {
                          const message =
                            notification.message;

                          const typeExpediteur =
                            message?.expediteur?.type ||
                            message?.sender?.type ||
                            "";

                          const nomExpediteur =
                            message?.expediteur?.nom ||
                            message?.expediteur?.name ||
                            message?.sender?.nom ||
                            message?.sender?.name ||
                            (typeExpediteur ===
                            "livreur"
                              ? "Livreur"
                              : typeExpediteur ===
                                  "client"
                                ? "Client"
                                : "Nouveau message");

                          const contenu =
                            String(
                              message?.message ||
                                "",
                            ).trim();

                          const apercu =
                            contenu.length >
                            100
                              ? `${contenu.substring(
                                  0,
                                  100,
                                )}…`
                              : contenu ||
                                "Vous avez reçu un nouveau message.";

                          return (
                            <MessageItem
                              key={
                                notification.id
                              }
                              type="button"
                              $isdark={
                                $isdark
                              }
                              onClick={() =>
                                ouvrirConversation(
                                  notification.commandeId,
                                )
                              }
                            >
                              <MessageItemIcon
                                $isdark={
                                  $isdark
                                }
                              >
                                <FiMessageCircle
                                  size={18}
                                />
                              </MessageItemIcon>

                              <MessageItemContent>
                                <MessageItemTop>
                                  <MessageItemName>
                                    {
                                      nomExpediteur
                                    }
                                  </MessageItemName>

                                  <MessageItemOrder
                                    $isdark={
                                      $isdark
                                    }
                                  >
                                    #
                                    {String(
                                      notification.commandeId,
                                    ).slice(
                                      -6,
                                    )}
                                  </MessageItemOrder>
                                </MessageItemTop>

                                <MessageItemText
                                  $isdark={
                                    $isdark
                                  }
                                >
                                  {apercu}
                                </MessageItemText>
                              </MessageItemContent>

                              <MessageItemArrow
                                $isdark={
                                  $isdark
                                }
                              >
                                <FiArrowRight
                                  size={14}
                                />
                              </MessageItemArrow>
                            </MessageItem>
                          );
                        },
                      )}
                    </MessageList>
                  )}
                </MessagePanel>
              )}
            </MessageWrapper>

            {/* ========================= */}
            {/* PANIER */}
            {/* ========================= */}

            <IconButton
              as={Link}
              to="/panier"
              style={{
                position:
                  "relative",
              }}
              aria-label="Panier"
              title="Panier"
            >
              <FiShoppingBag />

              {totalItems > 0 && (
                <CartCount>
                  {totalItems}
                </CartCount>
              )}
            </IconButton>

            {/* ========================= */}
            {/* FAVORIS */}
            {/* ========================= */}

            <IconButton
              as={Link}
              to="/favoris"
              aria-label="Favoris"
              title="Favoris"
            >
              <FiHeart />
            </IconButton>

            {/* ========================= */}
            {/* RECHERCHE */}
            {/* ========================= */}

            <SearchWrapper>
              <IconButton
                onClick={() =>
                  setSearchOpen(
                    (prev) => !prev,
                  )
                }
                aria-label="Rechercher"
                title="Rechercher"
              >
                <FiSearch />
              </IconButton>

              <form
                onSubmit={
                  handleSearch
                }
              >
                <SearchInput
                  $open={
                    searchOpen
                  }
                  type="text"
                  placeholder={
                    t?.(
                      "searchProducts",
                    ) ??
                    "Search products"
                  }
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      e.target.value,
                    )
                  }
                />
              </form>
            </SearchWrapper>

            {/* ========================= */}
            {/* MENU */}
            {/* ========================= */}

            <IconButton
              onClick={() =>
                setMenuOpen(
                  (prev) => !prev,
                )
              }
              aria-label="Menu"
              title="Menu"
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

      {/* ================================================= */}
      {/* MENU MOBILE */}
      {/* ================================================= */}

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