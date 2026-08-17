import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import {
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiLogOut,
  FiHeart,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";
import { ThemeContext } from "../../Utils/Context";
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
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(17, 17, 17, 0.15);
  }

  70% {
    box-shadow: 0 0 0 12px rgba(17, 17, 17, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(17, 17, 17, 0);
  }
`;

const shine = keyframes`
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(120%);
  }
`;

/* =========================================================
   PAGE
========================================================= */

const Page = styled.main`
  min-height: 100vh;
  padding: 40px 20px 100px;

  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(135deg, #080808 0%, #101010 50%, #151515 100%)"
      : "linear-gradient(135deg, #f7f7f7 0%, #ffffff 45%, #f3f3f3 100%)"};

  color: ${({ $dark }) => ($dark ? "#fff" : "#111")};

  transition:
    background 0.3s ease,
    color 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px 12px 70px;
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
  justify-content: center;
  align-items: center;
  background: ${({ $dark }) => ($dark ? "#080808" : "#fafafa")};
`;

const Loader = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;

  border: 3px solid ${({ $dark }) => ($dark ? "#292929" : "#e5e5e5")};
  border-top-color: ${({ $dark }) => ($dark ? "#fff" : "#111")};

  animation: ${spin} 0.8s linear infinite;
`;

/* =========================================================
   TOP HEADER
========================================================= */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;

  margin-bottom: 32px;

  animation: ${fadeUp} 0.7s ease;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(135deg, #ffffff, #bdbdbd)"
      : "linear-gradient(135deg, #111111, #444444)"};

  color: ${({ $dark }) => ($dark ? "#111" : "#fff")};

  font-size: 22px;
  font-weight: 800;

  flex-shrink: 0;
`;

const HeaderText = styled.div`
  h1 {
    margin: 0 0 5px;
    font-size: clamp(1.7rem, 4vw, 2.5rem);
    letter-spacing: -1px;
  }

  p {
    margin: 0;
    opacity: 0.55;
    font-size: 0.95rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NotificationButton = styled.button`
  position: relative;

  width: 46px;
  height: 46px;

  border: 1px solid
    ${({ $dark }) =>
      $dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};

  background: ${({ $dark }) =>
    $dark ? "rgba(255,255,255,0.04)" : "#fff"};

  color: inherit;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -3px;
  right: -2px;

  min-width: 19px;
  height: 19px;

  padding: 0 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #e53935;
  color: white;

  font-size: 10px;
  font-weight: 800;
`;

const LogoutButton = styled.button`
  height: 46px;

  padding: 0 18px;

  display: flex;
  align-items: center;
  gap: 8px;

  border: 1px solid
    ${({ $dark }) =>
      $dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};

  border-radius: 999px;

  background: ${({ $dark }) =>
    $dark ? "rgba(255,255,255,0.04)" : "#fff"};

  color: inherit;

  font-weight: 700;

  cursor: pointer;

  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $dark }) => ($dark ? "#fff" : "#111")};
    color: ${({ $dark }) => ($dark ? "#111" : "#fff")};
  }

  @media (max-width: 500px) {
    padding: 0 14px;

    span {
      display: none;
    }
  }
`;

/* =========================================================
   STATS
========================================================= */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  margin-bottom: 26px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;

const StatCard = styled.div`
  position: relative;
  overflow: hidden;

  padding: 22px;

  border-radius: 22px;

  background: ${({ $dark }) =>
    $dark ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.88)"};

  border: 1px solid
    ${({ $dark }) =>
      $dark
        ? "rgba(255,255,255,0.07)"
        : "rgba(0,0,0,0.06)"};

  box-shadow: ${({ $dark }) =>
    $dark
      ? "0 20px 60px rgba(0,0,0,0.2)"
      : "0 20px 60px rgba(0,0,0,0.06)"};

  backdrop-filter: blur(16px);

  animation: ${fadeUp} 0.7s ease;

  transition: 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $dark }) =>
    $dark ? "#fff" : "#111"};

  color: ${({ $dark }) =>
    $dark ? "#111" : "#fff"};

  margin-bottom: 15px;
`;

const StatLabel = styled.div`
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 0.5;

  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: clamp(1.1rem, 3vw, 1.55rem);
  font-weight: 800;
`;

/* =========================================================
   MAIN GRID
========================================================= */

const MainGrid = styled.div`
  display: grid;

  grid-template-columns: 1.25fr 0.75fr;

  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* =========================================================
   SECTION
========================================================= */

const Section = styled.section`
  position: relative;

  padding: 28px;

  border-radius: 28px;

  background: ${({ $dark }) =>
    $dark
      ? "rgba(255,255,255,0.035)"
      : "rgba(255,255,255,0.92)"};

  border: 1px solid
    ${({ $dark }) =>
      $dark
        ? "rgba(255,255,255,0.07)"
        : "rgba(0,0,0,0.06)"};

  box-shadow: ${({ $dark }) =>
    $dark
      ? "0 25px 70px rgba(0,0,0,0.18)"
      : "0 25px 70px rgba(0,0,0,0.055)"};

  backdrop-filter: blur(18px);

  animation: ${fadeUp} 0.8s ease;

  @media (max-width: 600px) {
    padding: 20px;
    border-radius: 22px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 22px;

  h2 {
    margin: 0;

    font-size: 1.25rem;

    display: flex;
    align-items: center;
    gap: 10px;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.45;
  }
`;

/* =========================================================
   COFFRE
========================================================= */

const Coffre = styled.div`
  position: relative;
  overflow: hidden;

  padding: 26px;

  border-radius: 24px;

  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(135deg, #ffffff 0%, #dcdcdc 100%)"
      : "linear-gradient(135deg, #111111 0%, #333333 100%)"};

  color: ${({ $dark }) =>
    $dark ? "#111" : "#fff"};

  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);

  &:after {
    content: "";

    position: absolute;

    top: -50%;
    left: 0;

    width: 30%;
    height: 200%;

    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.18),
      transparent
    );

    transform: translateX(-120%) rotate(15deg);

    animation: ${shine} 5s ease-in-out infinite;
  }
`;

const CoffreTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 28px;

  position: relative;
  z-index: 1;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const CoffreLabel = styled.span`
  display: block;

  font-size: 0.75rem;

  text-transform: uppercase;

  letter-spacing: 1.5px;

  opacity: 0.55;

  margin-bottom: 7px;
`;

const CoffreAmount = styled.strong`
  font-size: clamp(1.5rem, 5vw, 2rem);
`;

const CoffreRemaining = styled.div`
  text-align: right;

  @media (max-width: 500px) {
    text-align: left;
  }
`;

const ProgressWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;

  margin-bottom: 9px;

  font-size: 0.8rem;
  font-weight: 700;
`;

const ProgressBar = styled.div`
  height: 8px;

  background: rgba(128, 128, 128, 0.25);

  border-radius: 999px;

  overflow: hidden;
`;

const Progress = styled.div`
  width: ${({ $percent }) => Math.min($percent, 100)}%;
  height: 100%;

  background: ${({ $dark }) =>
    $dark ? "#111" : "#fff"};

  border-radius: inherit;

  transition: width 1s ease;
`;

/* =========================================================
   FAVORITES
========================================================= */

const FavoriteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FavoriteCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  padding: 12px;

  border-radius: 18px;

  background: ${({ $dark }) =>
    $dark
      ? "rgba(255,255,255,0.035)"
      : "#f7f7f7"};

  border: 1px solid
    ${({ $dark }) =>
      $dark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.05)"};

  transition: 0.3s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

const FavoriteImage = styled.img`
  width: 72px;
  height: 84px;

  border-radius: 14px;

  object-fit: cover;

  background: #eee;
`;

const FavoriteInfo = styled.div`
  flex: 1;
  min-width: 0;

  a {
    display: block;

    color: inherit;

    text-decoration: none;

    font-weight: 750;

    margin-bottom: 6px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin: 0;

    font-size: 0.88rem;

    opacity: 0.55;
  }
`;

const DeleteButton = styled.button`
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  border: none;

  border-radius: 50%;

  background: ${({ $dark }) =>
    $dark
      ? "rgba(255,255,255,0.06)"
      : "#fff"};

  color: #e53935;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.3s ease;

  &:hover {
    background: #e53935;
    color: white;
    transform: scale(1.08);
  }
`;

/* =========================================================
   EMPTY
========================================================= */

const Empty = styled.div`
  padding: 40px 15px;

  text-align: center;

  opacity: 0.5;

  svg {
    font-size: 30px;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
  }
`;

/* =========================================================
   ORDERS
========================================================= */

const OrdersSection = styled(Section)`
  margin-top: 24px;
`;

const OrderCard = styled.div`
  overflow: hidden;

  border-radius: 20px;

  background: ${({ $dark }) =>
    $dark
      ? "rgba(255,255,255,0.035)"
      : "#f8f8f8"};

  border: 1px solid
    ${({ $dark }) =>
      $dark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.05)"};

  margin-bottom: 12px;

  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.button`
  width: 100%;

  padding: 18px;

  border: none;

  background: transparent;

  color: inherit;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;

  text-align: left;

  cursor: pointer;

  @media (max-width: 500px) {
    padding: 15px;
  }
`;

const OrderInfo = styled.div`
  min-width: 0;

  strong {
    display: block;

    margin-bottom: 5px;

    font-size: 0.95rem;
  }

  span {
    font-size: 0.8rem;
    opacity: 0.5;
  }
`;

const OrderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.span`
  padding: 7px 11px;

  border-radius: 999px;

  font-size: 0.72rem;

  font-weight: 800;

  background: ${({ $status }) => {
    if ($status === "DELIVERED") return "rgba(34,197,94,0.12)";
    if ($status === "SHIPPED") return "rgba(59,130,246,0.12)";
    if ($status === "CONFIRMED") return "rgba(34,197,94,0.12)";
    return "rgba(245,158,11,0.12)";
  }};

  color: ${({ $status }) => {
    if ($status === "DELIVERED") return "#16a34a";
    if ($status === "SHIPPED") return "#2563eb";
    if ($status === "CONFIRMED") return "#16a34a";
    return "#d97706";
  }};

  white-space: nowrap;

  @media (max-width: 500px) {
    font-size: 0.65rem;
    padding: 6px 8px;
  }
`;

const OrderDetails = styled.div`
  padding: 0 18px 18px;

  border-top: 1px solid
    ${({ $dark }) =>
      $dark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.06)"};

  animation: ${fadeUp} 0.35s ease;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px 0;

  border-bottom: 1px solid
    ${({ $dark }) =>
      $dark
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.05)"};

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 58px;
  height: 68px;

  border-radius: 12px;

  object-fit: cover;

  background: #eee;
`;

const ProductInfo = styled.div`
  flex: 1;

  a {
    color: inherit;

    text-decoration: none;

    font-weight: 700;

    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin: 5px 0 0;

    font-size: 0.78rem;

    opacity: 0.5;
  }
`;

/* =========================================================
   ORDER TIMELINE
========================================================= */

const Timeline = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  margin: 20px 0 8px;

  position: relative;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const TimelineLine = styled.div`
  position: absolute;

  top: 17px;
  left: 12%;
  right: 12%;

  height: 2px;

  background: ${({ $dark }) =>
    $dark ? "#333" : "#ddd"};

  z-index: 0;

  @media (max-width: 600px) {
    display: none;
  }
`;

const TimelineStep = styled.div`
  position: relative;
  z-index: 1;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 7px;

  text-align: center;

  font-size: 0.7rem;

  opacity: ${({ $active }) => ($active ? 1 : 0.35)};

  @media (max-width: 600px) {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }
`;

const TimelineIcon = styled.div`
  width: 36px;
  height: 36px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $active, $dark }) =>
    $active
      ? $dark
        ? "#fff"
        : "#111"
      : $dark
        ? "#222"
        : "#eee"};

  color: ${({ $active, $dark }) =>
    $active
      ? $dark
        ? "#111"
        : "#fff"
      : $dark
        ? "#777"
        : "#aaa"};

  transition: 0.3s ease;

  ${({ $active }) =>
    $active &&
    `
      animation: ${pulse} 2s infinite;
    `}
`;

/* =========================================================
   CTA
========================================================= */

const ShopCTA = styled(Link)`
  margin-top: 16px;

  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: inherit;

  font-size: 0.85rem;

  font-weight: 800;

  text-decoration: none;

  opacity: 0.65;

  transition: 0.3s ease;

  &:hover {
    opacity: 1;
    transform: translateX(4px);
  }
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function CompteClient() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const $dark = theme !== "light";

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
      }
    };
  }, []);

  const playSound = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    audioRef.current.play().catch(() => {});
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
     FETCH COMPTE
  ========================================================= */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCompte();
  }, []);

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
        navigate("/login");
        return;
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
     SOCKET
  ========================================================= */

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    const handleConnect = () => {
      socket.emit("join_room", user._id);
    };

    const handleUpdate = (data) => {
      console.log("📦 update reçu :", data);

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
        message = "Commande confirmée";
      }

      if (data.status === "SHIPPED") {
        message = "Commande en livraison";
      }

      if (data.status === "DELIVERED") {
        message = "Commande livrée";
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
     CALCULS
  ========================================================= */

  const totalPaid = useMemo(() => {
    return commandes.reduce((total, c) => {
      if (c.modePaiement === "cod") {
        return (
          total +
          (c.statusCommande === "DELIVERED"
            ? Number(c.total || 0)
            : 0)
        );
      }

      const paid = (c.paiements || [])
        .filter((p) => p.status === "PAID")
        .reduce(
          (a, b) => a + Number(b.amountExpected || 0),
          0,
        );

      return total + paid;
    }, 0);
  }, [commandes]);

  const totalAmount = useMemo(() => {
    return commandes.reduce(
      (total, c) => total + Number(c.total || 0),
      0,
    );
  }, [commandes]);

  const progress = totalAmount
    ? Math.min((totalPaid / totalAmount) * 100, 100)
    : 0;

  const totalOrders = commandes.length;

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatus = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmée";

      case "SHIPPED":
        return "En livraison";

      case "DELIVERED":
        return "Livrée";

      default:
        return "En attente";
    }
  };

  const getStatusStep = (status) => {
    if (status === "DELIVERED") return 4;
    if (status === "SHIPPED") return 3;
    if (status === "CONFIRMED") return 2;

    return 1;
  };

  const getStatusIcon = (status) => {
    if (status === "DELIVERED") {
      return <FiCheckCircle />;
    }

    if (status === "SHIPPED") {
      return <FiTruck />;
    }

    if (status === "CONFIRMED") {
      return <FiCheckCircle />;
    }

    return <FiClock />;
  };

  /* =========================================================
     DELETE FAVORITE
  ========================================================= */

  const deleteFavorite = async (favoriteId) => {
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
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de supprimer le favori");
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");

    socket.disconnect();

    navigate("/login");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <LoaderWrapper $dark={$dark}>
        <Loader $dark={$dark} />
      </LoaderWrapper>
    );
  }

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <Page $dark={$dark}>
      <Container>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <Header>
          <HeaderLeft>
            <Avatar $dark={$dark}>
              {user?.username?.charAt(0)?.toUpperCase() || "N"}
            </Avatar>

            <HeaderText>
              <h1>
                Bonjour {user?.username || "vous"}
              </h1>

              <p>
                {user?.email}
              </p>
            </HeaderText>
          </HeaderLeft>

          <HeaderActions>

            <NotificationButton
              $dark={$dark}
              onClick={() => setNotifCount(0)}
              title="Notifications"
            >
              <FiBell size={19} />

              {notifCount > 0 && (
                <NotificationBadge>
                  {notifCount > 9 ? "9+" : notifCount}
                </NotificationBadge>
              )}
            </NotificationButton>

            <LogoutButton
              $dark={$dark}
              onClick={logout}
            >
              <FiLogOut />

              <span>
                Déconnexion
              </span>
            </LogoutButton>

          </HeaderActions>
        </Header>

        {/* =====================================================
            STATS
        ===================================================== */}

        <StatsGrid>

          <StatCard $dark={$dark}>
            <StatIcon $dark={$dark}>
              <FiPackage />
            </StatIcon>

            <StatLabel>
              Commandes
            </StatLabel>

            <StatValue>
              {totalOrders}
            </StatValue>
          </StatCard>

          <StatCard $dark={$dark}>
            <StatIcon $dark={$dark}>
              <FiHeart />
            </StatIcon>

            <StatLabel>
              Favoris
            </StatLabel>

            <StatValue>
              {favorites.length}
            </StatValue>
          </StatCard>

          <StatCard $dark={$dark}>
            <StatIcon $dark={$dark}>
              <FiCreditCard />
            </StatIcon>

            <StatLabel>
              Total payé
            </StatLabel>

            <StatValue>
              {totalPaid.toLocaleString("fr-FR")} FCFA
            </StatValue>
          </StatCard>

          <StatCard $dark={$dark}>
            <StatIcon $dark={$dark}>
              <FiShoppingBag />
            </StatIcon>

            <StatLabel>
              Panier total
            </StatLabel>

            <StatValue>
              {totalAmount.toLocaleString("fr-FR")} FCFA
            </StatValue>
          </StatCard>

        </StatsGrid>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <MainGrid>

          {/* ===================================================
              COFFRE
          =================================================== */}

          <Section $dark={$dark}>

            <SectionHeader>
              <h2>
                <FiCreditCard />
                Mon coffre
              </h2>

              <span>
                Paiements
              </span>
            </SectionHeader>

            <Coffre $dark={$dark}>

              <CoffreTop>

                <div>
                  <CoffreLabel>
                    Montant payé
                  </CoffreLabel>

                  <CoffreAmount>
                    {totalPaid.toLocaleString("fr-FR")} FCFA
                  </CoffreAmount>
                </div>

                <CoffreRemaining>

                  <CoffreLabel>
                    Restant
                  </CoffreLabel>

                  <CoffreAmount>
                    {Math.max(
                      totalAmount - totalPaid,
                      0,
                    ).toLocaleString("fr-FR")} FCFA
                  </CoffreAmount>

                </CoffreRemaining>

              </CoffreTop>

              <ProgressWrapper>

                <ProgressHeader>
                  <span>
                    Progression
                  </span>

                  <span>
                    {Math.round(progress)}%
                  </span>
                </ProgressHeader>

                <ProgressBar>
                  <Progress
                    $percent={progress}
                    $dark={$dark}
                  />
                </ProgressBar>

              </ProgressWrapper>

            </Coffre>

          </Section>

          {/* ===================================================
              FAVORIS
          =================================================== */}

          <Section $dark={$dark}>

            <SectionHeader>

              <h2>
                <FiHeart />
                Mes favoris
              </h2>

              <span>
                {favorites.length}
              </span>

            </SectionHeader>

            {favorites.length === 0 ? (
              <Empty>
                <FiHeart />

                <p>
                  Aucun favori pour le moment.
                </p>

                <ShopCTA to="/collections">
                  Découvrir les collections
                  <FiArrowRight />
                </ShopCTA>
              </Empty>
            ) : (
              <FavoriteList>

                {favorites.slice(0, 5).map((f) => {

                  const image =
                    f.productId?.images?.[0]?.url ||
                    "https://via.placeholder.com/300x400";

                  return (
                    <FavoriteCard
                      key={f._id}
                      $dark={$dark}
                    >

                      <FavoriteImage
                        src={image}
                        alt={f.productId?.title}
                      />

                      <FavoriteInfo>

                        <Link
                          to={`/produit/${f.productId?._id}`}
                        >
                          {f.productId?.title}
                        </Link>

                        <p>
                          {Number(
                            f.productId?.price || 0,
                          ).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </p>

                      </FavoriteInfo>

                      <DeleteButton
                        $dark={$dark}
                        onClick={() =>
                          deleteFavorite(f._id)
                        }
                        title="Supprimer"
                      >
                        <FiTrash2 size={17} />
                      </DeleteButton>

                    </FavoriteCard>
                  );
                })}

              </FavoriteList>
            )}

          </Section>

        </MainGrid>

        {/* =====================================================
            COMMANDES
        ===================================================== */}

        <OrdersSection $dark={$dark}>

          <SectionHeader>

            <h2>
              <FiPackage />
              Mes commandes
            </h2>

            <span>
              {commandes.length} commande
              {commandes.length > 1 ? "s" : ""}
            </span>

          </SectionHeader>

          {commandes.length === 0 ? (
            <Empty>

              <FiShoppingBag />

              <p>
                Vous n'avez encore passé aucune commande.
              </p>

              <ShopCTA to="/collections">
                Commencer mes achats
                <FiArrowRight />
              </ShopCTA>

            </Empty>
          ) : (
            commandes.map((c) => {

              const isOpen = !!expanded[c._id];

              const currentStep =
                getStatusStep(c.statusCommande);

              return (
                <OrderCard
                  key={c._id}
                  $dark={$dark}
                >

                  <OrderHeader
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [c._id]: !prev[c._id],
                      }))
                    }
                  >

                    <OrderInfo>

                      <strong>
                        Commande #
                        {c._id.slice(-6).toUpperCase()}
                      </strong>

                      <span>
                        {Number(
                          c.total || 0,
                        ).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </span>

                    </OrderInfo>

                    <OrderRight>

                      <StatusBadge
                        $status={c.statusCommande}
                      >
                        {getStatus(c.statusCommande)}
                      </StatusBadge>

                      {isOpen ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}

                    </OrderRight>

                  </OrderHeader>

                  {isOpen && (
                    <OrderDetails $dark={$dark}>

                      {/* TIMELINE */}

                      <Timeline>

                        <TimelineLine
                          $dark={$dark}
                        />

                        <TimelineStep
                          $active={currentStep >= 1}
                        >
                          <TimelineIcon
                            $active={currentStep >= 1}
                            $dark={$dark}
                          >
                            <FiClock />
                          </TimelineIcon>

                          <span>
                            En attente
                          </span>
                        </TimelineStep>

                        <TimelineStep
                          $active={currentStep >= 2}
                        >
                          <TimelineIcon
                            $active={currentStep >= 2}
                            $dark={$dark}
                          >
                            <FiCheckCircle />
                          </TimelineIcon>

                          <span>
                            Confirmée
                          </span>
                        </TimelineStep>

                        <TimelineStep
                          $active={currentStep >= 3}
                        >
                          <TimelineIcon
                            $active={currentStep >= 3}
                            $dark={$dark}
                          >
                            <FiTruck />
                          </TimelineIcon>

                          <span>
                            Livraison
                          </span>
                        </TimelineStep>

                        <TimelineStep
                          $active={currentStep >= 4}
                        >
                          <TimelineIcon
                            $active={currentStep >= 4}
                            $dark={$dark}
                          >
                            <FiCheckCircle />
                          </TimelineIcon>

                          <span>
                            Livrée
                          </span>
                        </TimelineStep>

                      </Timeline>

                      {/* PRODUCTS */}

                      {c.panier?.map((p) => {

                        const image =
                          p.images?.[0]?.url ||
                          p.produitId?.images?.[0]?.url ||
                          "https://via.placeholder.com/100x120";

                        const productId =
                          p.produitId?._id ||
                          p.produitId;

                        return (
                          <ProductRow
                            key={
                              p._id ||
                              p.produitId
                            }
                            $dark={$dark}
                          >

                            <ProductImage
                              src={image}
                              alt={p.nom}
                            />

                            <ProductInfo>

                              <Link
                                to={`/produit/${productId}`}
                              >
                                {p.nom ||
                                  p.produitId?.title ||
                                  "Produit"}
                              </Link>

                              <p>
                                Quantité :{" "}
                                {p.quantite}
                              </p>

                            </ProductInfo>

                          </ProductRow>
                        );
                      })}

                    </OrderDetails>
                  )}

                </OrderCard>
              );
            })
          )}

        </OrdersSection>

      </Container>
    </Page>
  );
}