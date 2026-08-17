import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import {
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiHeart,
  FiPackage,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiBell,
  FiArrowRight,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { socket } from "../../components/socket";
import toast from "react-hot-toast";

/* =========================================================
   ANIMATIONS
========================================================= */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
`;

/* =========================================================
   PAGE
========================================================= */

const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  padding: 40px 20px 80px;
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent 30%),
    radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.04), transparent 30%),
    #0b0b0f;
  color: #f8fafc;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 12px 50px;
  }
`;

const Container = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
`;

/* =========================================================
   LOADER
========================================================= */

const LoaderWrapper = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0b0f;
`;

const Loader = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 4px solid #292932;
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
`;

/* =========================================================
   HEADER
========================================================= */

const Header = styled.section`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;

  padding: 38px;
  margin-bottom: 24px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 30px;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.09),
      rgba(255, 255, 255, 0.025)
    );

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);

  animation: ${fadeUp} 0.6s ease both;

  &::before {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    right: -120px;
    top: -150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 24px 18px;
    border-radius: 22px;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
`;

const HeaderLeft = styled.div`
  min-width: 0;
`;

const WelcomeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  color: #a1a1aa;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.1;
  letter-spacing: -1px;
  word-break: break-word;
`;

const Email = styled.p`
  margin: 0;
  color: #a1a1aa;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NotificationButton = styled.div`
  position: relative;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 15px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;
  font-size: 20px;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;

  min-width: 21px;
  height: 21px;
  padding: 0 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background: #ef4444;
  color: white;

  font-size: 0.7rem;
  font-weight: 800;

  animation: ${pulse} 1.8s infinite;
`;

const LogoutButton = styled.button`
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 0 18px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;

  background: white;
  color: #09090b;

  font-weight: 800;
  cursor: pointer;

  transition: 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    background: #e4e4e7;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

/* =========================================================
   STATS
========================================================= */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  min-width: 0;
  padding: 22px;

  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);

  background: rgba(255, 255, 255, 0.045);

  transition: 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.065);
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;
  background: rgba(255, 255, 255, 0.08);

  font-size: 20px;
`;

const StatLabel = styled.span`
  color: #a1a1aa;
  font-size: 0.84rem;
`;

const StatValue = styled.strong`
  display: block;
  margin-top: 14px;

  font-size: clamp(1.3rem, 3vw, 1.8rem);
  line-height: 1.1;

  overflow-wrap: anywhere;
`;

/* =========================================================
   SECTIONS
========================================================= */

const Section = styled.section`
  padding: 28px;
  margin-bottom: 24px;

  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 26px;

  background: rgba(255, 255, 255, 0.035);

  animation: ${fadeUp} 0.7s ease both;

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 22px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;

  margin-bottom: 22px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const SectionTitleWrap = styled.div`
  min-width: 0;
`;

const SectionEyebrow = styled.span`
  display: block;
  margin-bottom: 6px;

  color: #71717a;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1.7px;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  letter-spacing: -0.4px;
`;

const SectionDescription = styled.p`
  margin: 7px 0 0;
  color: #a1a1aa;
  font-size: 0.9rem;
  line-height: 1.6;
`;

/* =========================================================
   COFFRE
========================================================= */

const CoffreBox = styled.div`
  padding: 24px;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.075),
      rgba(255, 255, 255, 0.025)
    );

  border: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 500px) {
    padding: 18px;
  }
`;

const CoffreHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const CoffreAmount = styled.div`
  strong {
    display: block;
    margin-top: 5px;
    font-size: clamp(1.5rem, 5vw, 2.2rem);
  }

  span {
    color: #a1a1aa;
    font-size: 0.8rem;
  }
`;

const CoffreRemaining = styled.div`
  text-align: right;

  strong {
    display: block;
    font-size: 1rem;
  }

  span {
    color: #a1a1aa;
    font-size: 0.8rem;
  }

  @media (max-width: 520px) {
    text-align: left;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 8px;

  color: #a1a1aa;
  font-size: 0.78rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  overflow: hidden;

  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
`;

const Progress = styled.div`
  height: 100%;
  width: ${({ $percent }) => Math.min(100, Math.max(0, $percent))}%;

  border-radius: inherit;

  background: linear-gradient(90deg, #fff, #a1a1aa);

  transition: width 0.7s ease;
`;

/* =========================================================
   FAVORIS
========================================================= */

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const FavoriteCard = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 14px;

  padding: 12px;

  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.055);

  transition: 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.065);
  }

  @media (max-width: 430px) {
    align-items: flex-start;
  }
`;

const FavoriteImage = styled.img`
  width: 82px;
  height: 96px;
  flex-shrink: 0;

  object-fit: cover;
  border-radius: 13px;

  background: #18181b;

  @media (max-width: 430px) {
    width: 70px;
    height: 84px;
  }
`;

const FavoriteInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const FavoriteLink = styled(Link)`
  display: block;

  color: #fff;
  text-decoration: none;
  font-weight: 700;
  line-height: 1.4;

  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

const FavoritePrice = styled.p`
  margin: 7px 0 0;

  color: #a1a1aa;
  font-size: 0.88rem;
`;

const DeleteButton = styled.button`
  width: 38px;
  height: 38px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 11px;

  background: rgba(239, 68, 68, 0.08);
  color: #f87171;

  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.16);
    transform: scale(1.05);
  }
`;

/* =========================================================
   COMMANDES
========================================================= */

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderCard = styled.div`
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 19px;

  background: rgba(255, 255, 255, 0.035);
`;

const OrderHeader = styled.button`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  padding: 19px;

  border: none;
  background: transparent;
  color: #fff;

  text-align: left;
  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    padding: 16px;
  }
`;

const OrderMain = styled.div`
  min-width: 0;
`;

const OrderNumber = styled.div`
  font-weight: 800;
  font-size: 0.95rem;

  overflow-wrap: anywhere;
`;

const OrderDate = styled.div`
  margin-top: 5px;

  color: #71717a;
  font-size: 0.78rem;
`;

const OrderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 7px;
  }
`;

const OrderTotal = styled.strong`
  white-space: nowrap;
  font-size: 0.9rem;
`;

const OrderDetails = styled.div`
  padding: 0 19px 19px;

  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 600px) {
    padding: 0 14px 14px;
  }
`;

const OrderProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  padding: 14px 0;

  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const OrderProductImage = styled.img`
  width: 58px;
  height: 70px;
  flex-shrink: 0;

  object-fit: cover;
  border-radius: 10px;
  background: #18181b;

  @media (max-width: 430px) {
    width: 52px;
    height: 62px;
  }
`;

const OrderProductInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const OrderProductLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;

  overflow-wrap: anywhere;

  &:hover {
    text-decoration: underline;
  }
`;

const Quantity = styled.div`
  margin-top: 5px;
  color: #71717a;
  font-size: 0.78rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;

  border-radius: 999px;

  background: ${({ $type }) => {
    if ($type === "success") return "rgba(34,197,94,0.12)";
    if ($type === "blue") return "rgba(59,130,246,0.12)";
    return "rgba(245,158,11,0.12)";
  }};

  color: ${({ $type }) => {
    if ($type === "success") return "#4ade80";
    if ($type === "blue") return "#60a5fa";
    return "#fbbf24";
  }};

  font-size: 0.72rem;
  font-weight: 800;
  white-space: nowrap;
`;

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = styled.div`
  padding: 35px 20px;

  text-align: center;

  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 18px;

  color: #71717a;
`;

const EmptyIcon = styled.div`
  width: 52px;
  height: 52px;

  margin: 0 auto 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;

  background: rgba(255, 255, 255, 0.05);

  color: #a1a1aa;
  font-size: 23px;
`;

const ShopLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;

  margin-top: 14px;

  color: white;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.88rem;

  &:hover {
    text-decoration: underline;
  }
`;

/* =========================================================
   FOOTER ACCOUNT
========================================================= */

const AccountFooter = styled.div`
  display: flex;
  justify-content: center;

  padding: 8px 0 0;

  color: #52525b;
  font-size: 0.75rem;
  text-align: center;
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function CompteClient() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [notifCount, setNotifCount] = useState(0);

  const audioRef = useRef(null);

  /* =========================================================
     AUDIO
  ========================================================= */

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 1;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    audioRef.current.play().catch((err) => {
      console.log("🔇 Son bloqué :", err);
    });
  };

  /* =========================================================
     UNLOCK AUDIO
  ========================================================= */

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCompte();
  }, []);

  /* =========================================================
     SOCKET
  ========================================================= */

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    const handleConnect = () => {
      socket.emit("join_room", user._id);
    };

    const handleUpdate = (data) => {
      console.log("📦 Update reçu :", data);

      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === data.id
            ? {
                ...cmd,
                statusCommande: data.status,
              }
            : cmd,
        ),
      );

      setNotifCount((prev) => prev + 1);

      let message = "Mise à jour commande";

      if (data.status === "CONFIRMED") {
        message = "✅ Commande confirmée";
      }

      if (data.status === "SHIPPED") {
        message = "🚚 Commande en livraison";
      }

      if (data.status === "DELIVERED") {
        message = "🎉 Commande livrée";
      }

      toast.success(message);

      playSound();
    };

    socket.on("connect", handleConnect);
    socket.on("commande_update", handleUpdate);

    if (socket.connected) {
      socket.emit("join_room", user._id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("commande_update", handleUpdate);
    };
  }, [user?._id]);

  /* =========================================================
     FETCH COMPTE
  ========================================================= */

  const fetchCompte = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/compte`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Erreur compte");
      }

      const data = await res.json();

      setUser(data.user);
      setFavorites(data.favorites || []);
      setCommandes(data.commandes || []);
    } catch (error) {
      console.error(error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE FAVORITE
  ========================================================= */

  const removeFavorite = async (favoriteId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setFavorites((prev) =>
          prev.filter((item) => item._id !== favoriteId),
        );

        toast.success("Retiré des favoris");
      } else {
        toast.error("Impossible de supprimer ce favori");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* =========================================================
     CALCULS
  ========================================================= */

  const totalPaid = commandes.reduce((total, c) => {
    if (c.modePaiement === "cod") {
      return total + (c.statusCommande === "DELIVERED" ? c.total : 0);
    }

    const paid = (c.paiements || [])
      .filter((p) => p.status === "PAID")
      .reduce(
        (sum, payment) => sum + (payment.amountExpected || 0),
        0,
      );

    return total + paid;
  }, 0);

  const totalAmount = commandes.reduce(
    (total, c) => total + (c.total || 0),
    0,
  );

  const remaining = Math.max(0, totalAmount - totalPaid);

  const progress = totalAmount
    ? Math.min(100, (totalPaid / totalAmount) * 100)
    : 0;

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatus = (status) => {
    if (status === "DELIVERED") {
      return {
        label: "Livrée",
        type: "success",
        icon: <FiCheckCircle />,
      };
    }

    if (status === "SHIPPED") {
      return {
        label: "En livraison",
        type: "blue",
        icon: <FiTruck />,
      };
    }

    if (status === "CONFIRMED") {
      return {
        label: "Confirmée",
        type: "success",
        icon: <FiCheckCircle />,
      };
    }

    return {
      label: "En attente",
      type: "warning",
      icon: <FiClock />,
    };
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Page>
      <Container>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Header>
          <HeaderLeft>
            <WelcomeLabel>
              <FiUser />
              Espace personnel
            </WelcomeLabel>

            <Title>
              Bonjour {user?.username || "vous"} 👋
            </Title>

            <Email>{user?.email}</Email>
          </HeaderLeft>

          <HeaderActions>
            <NotificationButton>
              <FiBell />

              {notifCount > 0 && (
                <NotificationBadge>
                  {notifCount > 99 ? "99+" : notifCount}
                </NotificationBadge>
              )}
            </NotificationButton>

            <LogoutButton onClick={logout}>
              <FiLogOut />
              Déconnexion
            </LogoutButton>
          </HeaderActions>
        </Header>

        {/* =====================================================
            STATS
        ===================================================== */}

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>Commandes</StatLabel>

              <StatIcon>
                <FiPackage />
              </StatIcon>
            </StatTop>

            <StatValue>{commandes.length}</StatValue>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Favoris</StatLabel>

              <StatIcon>
                <FiHeart />
              </StatIcon>
            </StatTop>

            <StatValue>{favorites.length}</StatValue>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Total dépensé</StatLabel>

              <StatIcon>
                <FiCreditCard />
              </StatIcon>
            </StatTop>

            <StatValue>
              {totalPaid.toLocaleString("fr-FR")} FCFA
            </StatValue>
          </StatCard>
        </StatsGrid>

        {/* =====================================================
            COFFRE
        ===================================================== */}

        <Section>
          <SectionHeader>
            <SectionTitleWrap>
              <SectionEyebrow>Suivi financier</SectionEyebrow>

              <SectionTitle>
                Mon coffre
              </SectionTitle>

              <SectionDescription>
                Suivez simplement le montant payé et le montant restant
                sur vos commandes.
              </SectionDescription>
            </SectionTitleWrap>
          </SectionHeader>

          <CoffreBox>
            <CoffreHeader>
              <CoffreAmount>
                <span>Montant payé</span>

                <strong>
                  {totalPaid.toLocaleString("fr-FR")} FCFA
                </strong>
              </CoffreAmount>

              <CoffreRemaining>
                <span>Montant restant</span>

                <strong>
                  {remaining.toLocaleString("fr-FR")} FCFA
                </strong>
              </CoffreRemaining>
            </CoffreHeader>

            <ProgressInfo>
              <span>Progression</span>

              <strong>{Math.round(progress)}%</strong>
            </ProgressInfo>

            <ProgressBar>
              <Progress $percent={progress} />
            </ProgressBar>
          </CoffreBox>
        </Section>

        {/* =====================================================
            FAVORIS
        ===================================================== */}

        <Section>
          <SectionHeader>
            <SectionTitleWrap>
              <SectionEyebrow>
                Votre sélection
              </SectionEyebrow>

              <SectionTitle>
                Mes favoris
              </SectionTitle>

              <SectionDescription>
                Les pièces que vous avez gardées de côté.
              </SectionDescription>
            </SectionTitleWrap>
          </SectionHeader>

          {favorites.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FiHeart />
              </EmptyIcon>

              <div>
                Vous n'avez encore aucun favori.
              </div>

              <ShopLink to="/collections">
                Découvrir la collection
                <FiArrowRight />
              </ShopLink>
            </EmptyState>
          ) : (
            <FavoritesGrid>
              {favorites.map((favorite) => {
                const product = favorite.productId;

                const image =
                  product?.images?.[0]?.url ||
                  "https://via.placeholder.com/300x400";

                return (
                  <FavoriteCard key={favorite._id}>
                    <FavoriteImage
                      src={image}
                      alt={product?.title || "Produit"}
                    />

                    <FavoriteInfo>
                      <FavoriteLink
                        to={`/produit/${product?._id}`}
                      >
                        {product?.title || "Produit"}
                      </FavoriteLink>

                      <FavoritePrice>
                        {product?.price
                          ? `${product.price.toLocaleString(
                              "fr-FR",
                            )} FCFA`
                          : "Prix indisponible"}
                      </FavoritePrice>
                    </FavoriteInfo>

                    <DeleteButton
                      type="button"
                      aria-label="Supprimer des favoris"
                      onClick={() =>
                        removeFavorite(favorite._id)
                      }
                    >
                      <FiTrash2 />
                    </DeleteButton>
                  </FavoriteCard>
                );
              })}
            </FavoritesGrid>
          )}
        </Section>

        {/* =====================================================
            COMMANDES
        ===================================================== */}

        <Section>
          <SectionHeader>
            <SectionTitleWrap>
              <SectionEyebrow>
                Historique
              </SectionEyebrow>

              <SectionTitle>
                Mes commandes
              </SectionTitle>

              <SectionDescription>
                Consultez le statut et le contenu de chacune de vos
                commandes.
              </SectionDescription>
            </SectionTitleWrap>
          </SectionHeader>

          {commandes.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FiShoppingBag />
              </EmptyIcon>

              <div>
                Vous n'avez encore passé aucune commande.
              </div>

              <ShopLink to="/collections">
                Commencer mes achats
                <FiArrowRight />
              </ShopLink>
            </EmptyState>
          ) : (
            <OrdersList>
              {commandes.map((commande) => {
                const status = getStatus(
                  commande.statusCommande,
                );

                const isOpen =
                  expanded[commande._id];

                return (
                  <OrderCard key={commande._id}>
                    <OrderHeader
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [commande._id]:
                            !prev[commande._id],
                        }))
                      }
                    >
                      <OrderMain>
                        <OrderNumber>
                          Commande #
                          {commande._id.slice(-6).toUpperCase()}
                        </OrderNumber>

                        <OrderDate>
                          {commande.createdAt
                            ? new Date(
                                commande.createdAt,
                              ).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                },
                              )
                            : "Date indisponible"}
                        </OrderDate>
                      </OrderMain>

                      <OrderRight>
                        <OrderTotal>
                          {(
                            commande.total || 0
                          ).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </OrderTotal>

                        <StatusBadge
                          $type={status.type}
                        >
                          {status.icon}
                          {status.label}
                        </StatusBadge>

                        {isOpen ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </OrderRight>
                    </OrderHeader>

                    {isOpen && (
                      <OrderDetails>
                        {(commande.panier || []).map(
                          (p, index) => {
                            const image =
                              p.images?.[0]?.url ||
                              p.produitId?.images?.[0]
                                ?.url ||
                              "https://via.placeholder.com/100";

                            return (
                              <OrderProduct
                                key={
                                  p.produitId?._id ||
                                  `${commande._id}-${index}`
                                }
                              >
                                <OrderProductImage
                                  src={image}
                                  alt={
                                    p.nom ||
                                    p.produitId?.title ||
                                    "Produit"
                                  }
                                />

                                <OrderProductInfo>
                                  <OrderProductLink
                                    to={`/produit/${p.produitId._id}`}
                                  >
                                    {p.nom ||
                                      p.produitId?.title ||
                                      "Produit"}
                                  </OrderProductLink>

                                  <Quantity>
                                    Quantité :{" "}
                                    {p.quantite || 1}
                                  </Quantity>
                                </OrderProductInfo>
                              </OrderProduct>
                            );
                          },
                        )}
                      </OrderDetails>
                    )}
                  </OrderCard>
                );
              })}
            </OrdersList>
          )}
        </Section>

        <AccountFooter>
          Votre espace personnel NUMA
        </AccountFooter>
      </Container>
    </Page>
  );
}