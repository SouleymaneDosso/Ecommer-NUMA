import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ResetPasswordModal from "./ResetPasswordModal";

/* ===== LOADER ===== */
const spin = keyframes` to { transform: rotate(360deg); } `;
const LoaderWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  max-width: 950px;
  margin: 3rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 2rem 1rem;
  }
`;

const Section = styled.section`
  background: #f8f9ff;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  transition: all 0.3s ease;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  font-size: 1.6rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    outline: none;
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
  &:hover { color: #4f46e5; }
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    transform: translateY(-1.5px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  }
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #f87171);
  &:hover { background: linear-gradient(135deg, #f87171, #ef4444); }
`;

const Message = styled.p`
  font-weight: 600;
  margin-top: 0.5rem;
  color: ${(props) => (props.type === "error" ? "#dc2626" : "#10b981")};
`;

const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ProductCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
  background-color: ${(props) =>
    props.statut === "en cours"
      ? "#f59e0b"
      : props.statut === "envoyé"
      ? "#3b82f6"
      : props.statut === "livré"
      ? "#10b981"
      : "#ef4444"};
  font-size: 0.8rem;
`;

const TrashIcon = styled(FiTrash2)`
  cursor: pointer;
  color: #ef4444;
  transition: color 0.2s;
  &:hover { color: #dc2626; }
`;

const CommandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const CommandContent = styled.div`
  max-height: ${({ open }) => (open ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

/* ===== COMPONENT ===== */
export default function CompteClient() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);

  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchCompte = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setUser(data.user);
      setFavorites(data.favorites || []);
      setCommandes(data.commandes || []);
      setEditUsername(data.user.username);
      setEditEmail(data.user.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCompte();
  }, [token]);

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeFavorite = async (favId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/${favId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setFavorites((prev) => prev.filter((f) => f._id !== favId));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = (product) =>
    product?.images?.find((img) => img.isMain)?.url ||
    product?.images?.[0]?.url ||
    "https://via.placeholder.com/80";

  if (loading) return (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  );

  if (!token || !user) {
    return (
      <PageWrapper>
        <Title>{isLogin ? "Connexion" : "Inscription"}</Title>
        {error && <Message type="error">{error}</Message>}
        {/* Formulaire login/signup ici ... */}
      </PageWrapper>
    );
  }

  const filteredCommandes = filterStatus
    ? commandes.filter((c) => c.statut === filterStatus)
    : commandes;

  return (
    <PageWrapper>
      {/* Profil */}
      <Section>
        <Title>Bonjour {user.username}</Title>
        <p>Email : {user.email}</p>
        <InputGroup style={{ marginTop: "1rem" }}>
          <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Modifier username" />
          <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Modifier email" />
          <Button onClick={fetchCompte}>Mettre à jour</Button>
          {updateMessage && <Message type="success">{updateMessage}</Message>}
        </InputGroup>
        <DangerButton onClick={() => { localStorage.removeItem("token"); setUser(null); navigate("/compte"); }} style={{ marginTop: "1rem" }}>
          Se déconnecter
        </DangerButton>
      </Section>

      {/* Favoris */}
      <Section>
        <Title>Favoris</Title>
        {favorites.length === 0 ? (
          <p>Aucun favori</p>
        ) : (
          <FlexRow>
            {favorites.map((f) => {
              const product = f.productId || {};
              const favId = f._id;
              return (
                <ProductCard key={favId}>
                  <ProductImage src={getMainImage(product)} alt={product.title || "Produit"} />
                  <div style={{ flex: 1 }}>
                    <p>{product.title || "—"}</p>
                    <p>{product.price?.toLocaleString() || "—"} FCFA</p>
                  </div>
                  <TrashIcon size={22} onClick={() => removeFavorite(favId)} />
                </ProductCard>
              );
            })}
          </FlexRow>
        )}
      </Section>

      {/* Commandes */}
      <Section>
        <Title>Commandes</Title>
        <div style={{ marginBottom: "1rem" }}>
          <label>Filtrer par statut : </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "0.95rem", background: "#fff" }}>
            <option value="">Tous</option>
            <option value="en cours">En cours</option>
            <option value="envoyé">Envoyé</option>
            <option value="livré">Livré</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>
        {filteredCommandes.length === 0 ? <p>Aucune commande</p> :
          <FlexRow>
            {filteredCommandes.map((c) => (
              <ProductCard key={c._id} style={{ flexDirection: "column" }}>
                <CommandHeader onClick={() => toggleOrder(c._id)}>
                  <div>
                    <p>ID: {c._id}</p>
                    <p>Total: {c.total.toLocaleString()} FCFA</p>
                    <StatusBadge statut={c.statut}>{c.statut}</StatusBadge>
                  </div>
                  {expandedOrders[c._id] ? <FiChevronUp /> : <FiChevronDown />}
                </CommandHeader>
                <CommandContent open={expandedOrders[c._id]}>
                  {c.produits.map((pr) => (
                    <div key={pr.produitId?._id || Math.random()} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <ProductImage src={getMainImage(pr.produitId)} alt={pr.produitId?.title || "Produit"} />
                      <div>
                        <Link to={`/product/${pr.produitId?._id}`} style={{ fontWeight: 600 }}>{pr.produitId?.title || "Produit supprimé"}</Link>
                        <p>Quantité: {pr.quantite}</p>
                        <p>Prix: {pr.produitId?.price?.toLocaleString() || "—"} FCFA</p>
                      </div>
                    </div>
                  ))}
                </CommandContent>
              </ProductCard>
            ))}
          </FlexRow>
        }
      </Section>
    </PageWrapper>
  );
}
