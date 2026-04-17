import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaLock, FaUnlock } from "react-icons/fa";
import { socket } from "../../components/socket";
import toast from "react-hot-toast";
import { useRef } from "react";

/* ================= LOADER ================= */
const spin = keyframes`to { transform: rotate(360deg); }`;

const LoaderWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.div`
  width: 44px;
  height: 44px;
  border: 4px solid #2a2a3d;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/* ================= PAGE ================= */
const PageWrapper = styled.main`
  max-width: 960px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1f1f2e;
  border-radius: 22px;
  color: #f3f3f3;

  @media (max-width: 768px) {
    margin: 0.5rem;
    padding: 1.5rem;
  }
`;

const Section = styled.section`
  background: #2a2a3d;
  border-radius: 20px;
  padding: 1.6rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

/* ================= BADGE ================= */
const Badge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: ${({ color }) => color};
  color: #fff;
`;

/* ================= BUTTON ================= */
const Button = styled.button`
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #6366f1;
  color: #fff;
  cursor: pointer;
  width: 100%;
`;

/* ================= COFFRE ================= */
const CoffreBox = styled.div`
  background: #1c1c2b;
  padding: 1.5rem;
  border-radius: 20px;
`;

const CoffreLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: #6366f1;
`;

/* ================= CARD ================= */
const Card = styled.div`
  background: #1f1f2e;
  padding: 1.2rem;
  border-radius: 16px;
  margin-bottom: 1rem;
`;

const Product = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  img {
    width: 70px;
    height: 70px;
    border-radius: 10px;
    object-fit: cover;
  }
`;

/* ================= COMPONENT ================= */
export default function CompteClient() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [notifCount, setNotifCount] = useState(0);


  const audioRef = useRef(new Audio("/notification.mp3"));
audioRef.current.volume = 1;


const playSound = () => {
  const audio = new Audio("/notification.mp3");
  audio.volume = 1;

  audio.play().catch((err) => {
    console.log("🔇 encore bloqué :", err);
  });
};

useEffect(() => {
  const unlockAudio = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
    window.removeEventListener("click", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);

  return () => {
    window.removeEventListener("click", unlockAudio);
  };
}, []);


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCompte();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    const handleUpdate = (data) => {
      console.log("📦 update reçu :", data);

      // 🔥 update commandes
      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd._id === data.id ? { ...cmd, statusCommande: data.status } : cmd,
        ),
      );

      // 🔴 notif badge
      setNotifCount((prev) => prev + 1);

      // 🔔 message
      let message = "Mise à jour commande";

      if (data.status === "CONFIRMED") message = "✅ Commande confirmée";
      if (data.status === "SHIPPED") message = "🚚 En livraison";
      if (data.status === "DELIVERED") message = "🎉 Livrée";

      // 🔥 toast
      toast.success(message);

      // 🔊 son
   playSound();
    };

    socket.on("connect", () => {
      socket.emit("join_room", user._id);
    });

    socket.on("commande_update", handleUpdate);

    return () => {
      socket.off("commande_update", handleUpdate); // ⚠️ important
    };
  }, [user?._id]);
  const fetchCompte = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.user);
      setFavorites(data.favorites || []);
      setCommandes(data.commandes || []);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  /* ================= CALCUL ================= */
  const totalPaid = commandes.reduce((total, c) => {
    if (c.modePaiement === "cod") {
      return total + (c.statusCommande === "DELIVERED" ? c.total : 0);
    }

    const paid = (c.paiements || [])
      .filter((p) => p.status === "PAID")
      .reduce((a, b) => a + b.amountExpected, 0);

    return total + paid;
  }, 0);

  const totalAmount = commandes.reduce((a, c) => a + c.total, 0);
  const progress = totalAmount ? (totalPaid / totalAmount) * 100 : 0;

  /* ================= UI ================= */
  const getStatusBadge = (c) => {
    if (c.statusCommande === "DELIVERED")
      return <Badge color="#22c55e">Livré</Badge>;

    if (c.statusCommande === "SHIPPED")
      return <Badge color="#3b82f6">En livraison</Badge>;

    if (c.statusCommande === "CONFIRMED")
      return <Badge color="#22c55e">Confirmé</Badge>;

    return <Badge color="#f59e0b">En attente</Badge>;
  };

  return (
    <PageWrapper>
      <Section>
        <div style={{ position: "relative", display: "inline-block" }}>
          🔔
          {notifCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
              }}
            >
              {notifCount}
            </span>
          )}
        </div>
        <Title>👋 Bonjour {user?.username}</Title>
        <p>{user?.email}</p>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Se déconnecter
        </Button>
      </Section>

      {/* ================= COFFRE ================= */}
      <Section>
        <Title>💰 Coffre</Title>
        <CoffreBox>
          <CoffreLine>
            <span>Payé</span>
            <strong>{totalPaid} FCFA</strong>
          </CoffreLine>

          <CoffreLine>
            <span>Restant</span>
            <strong>{totalAmount - totalPaid} FCFA</strong>
          </CoffreLine>

          <ProgressBar>
            <Progress percent={progress} />
          </ProgressBar>
        </CoffreBox>
      </Section>

      {/* ================= FAVORIS ================= */}
      <Section>
        <Title>❤️ Favoris</Title>

        {favorites.length === 0 ? (
          <p>Aucun favori pour le moment</p>
        ) : (
          favorites.map((f) => (
            <Card key={f._id}>
              <Product>
                <img
                  src={
                    f.productId?.images?.[0]?.url ||
                    "https://via.placeholder.com/80"
                  }
                />

                <div style={{ flex: 1 }}>
                  <Link to={`/produit/${f.productId?._id}`}>
                    {f.productId?.title}
                  </Link>
                  <p>{f.productId?.price} FCFA</p>
                </div>

                <FiTrash2
                  style={{ color: "red", cursor: "pointer" }}
                  size={20}
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/favorites/${f._id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      if (res.ok) {
                        setFavorites((prev) =>
                          prev.filter((item) => item._id !== f._id),
                        );
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
              </Product>
            </Card>
          ))
        )}
      </Section>

      {/* ================= COMMANDES ================= */}
      <Section>
        <Title>📦 Commandes</Title>

        {commandes.map((c) => (
          <Card key={c._id}>
            <div
              onClick={() => setExpanded((p) => ({ ...p, [c._id]: !p[c._id] }))}
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <div>
                <strong>Commande #{c._id.slice(-6)}</strong>
                <p>{c.total} FCFA</p>
              </div>

              {getStatusBadge(c)}
            </div>

            {expanded[c._id] && (
              <div style={{ marginTop: "10px" }}>
                {c.panier.map((p) => (
                  <Product key={p.produitId}>
                    <img
                      src={p.images?.[0]?.url || p.produitId?.images?.[0]?.url}
                    />
                    <div>
                      <Link to={`/produit/${p.produitId._id}`}>{p.nom}</Link>
                      <p>Qté: {p.quantite}</p>
                    </div>
                  </Product>
                ))}
              </div>
            )}
          </Card>
        ))}
      </Section>
    </PageWrapper>
  );
}
