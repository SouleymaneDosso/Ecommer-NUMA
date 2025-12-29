import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
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

/* ===== STYLES GÉNÉRAUX ===== */
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
  padding: 10px 12px; /* plus compact */
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
  &:hover {
    color: #4f46e5;
  }
`;

const Button = styled.button`
  padding: 10px 14px; /* plus compact */
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
  &:hover {
    background: linear-gradient(135deg, #f87171, #ef4444);
  }
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
  padding: 12px; /* plus compact */
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
  align-items: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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
  padding: 4px 10px; /* plus compact */
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "login" : "signup";
      const body = isLogin
        ? { username, password }
        : { username, email, password };
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      if (isLogin) {
        localStorage.setItem("token", data.token);
        fetchCompte();
        setLoginAttempts(0);
      } else {
        alert("Compte créé. Connecte-toi !");
        setIsLogin(true);
      }

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      if (isLogin) {
        setLoginAttempts((prev) => {
          const attempts = prev + 1;
          if (attempts >= 3) setShowResetModal(true);
          return attempts;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/compte");
  };

  const handleUpdateProfile = async () => {
    if (!editUsername || !editEmail) return;
    setUpdateMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: editUsername, email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setUser((prev) => ({
        ...prev,
        username: editUsername,
        email: editEmail,
      }));
      setUpdateMessage("Profil mis à jour ✅");
    } catch (err) {
      setUpdateMessage(err.message);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setFavorites((favs) => favs.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );

  if (!token || !user) {
    return (
      <PageWrapper>
        <Title>{isLogin ? "Connexion" : "Inscription"}</Title>
        {error && <Message type="error">{error}</Message>}
        <form
          onSubmit={handleAuth}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeIcon>
          </InputGroup>
          <Button type="submit">
            {isLogin ? "Se connecter" : "Créer un compte"}
          </Button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center", color: "#4b5563" }}>
          {isLogin ? "Pas de compte ?" : "Déjà inscrit ?"}{" "}
          <span
            style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 700 }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>

        {showResetModal && (
          <ResetPasswordModal onClose={() => setShowResetModal(false)} />
        )}
      </PageWrapper>
    );
  }

  const filteredCommandes = filterStatus
    ? commandes.filter((c) => c.statut === filterStatus)
    : commandes;
  const getMainImage = (product) =>
    product?.images?.find((img) => img.isMain)?.url ||
    product?.images?.[0]?.url ||
    "https://via.placeholder.com/80";

  return (
    <PageWrapper>
      {/* Profil */}
      <Section>
        <Title>Bonjour {user.username}</Title>
        <p>Email : {user.email}</p>
        <InputGroup style={{ marginTop: "1rem" }}>
          <Input
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Modifier username"
          />
          <Input
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Modifier email"
          />
          <Button onClick={handleUpdateProfile}>Mettre à jour</Button>
          {updateMessage && <Message type="success">{updateMessage}</Message>}
        </InputGroup>
        <DangerButton onClick={logout} style={{ marginTop: "1rem" }}>
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
            {favorites.map((f) => (
              <ProductCard key={f._id}>
                <ProductImage
                  src={getMainImage(f.productId)}
                  alt={f.productId?.title || "Produit"}
                />

                <div>
                  <p>{f.productId?.title || "—"}</p>
                  <p>{f.productId?.price?.toLocaleString() || "—"} FCFA</p>
                  <Button onClick={() => removeFavorite(f._id)}>
                    Supprimer
                  </Button>
                </div>
              </ProductCard>
            ))}
          </FlexRow>
        )}
      </Section>

      {/* Commandes */}
      <Section>
        <Title>Commandes</Title>
        <div style={{ marginBottom: "1rem" }}>
          <label>Filtrer par statut : </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              background: "#fff",
            }}
          >
            <option value="">Tous</option>
            <option value="en cours">En cours</option>
            <option value="envoyé">Envoyé</option>
            <option value="livré">Livré</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>

        {filteredCommandes.length === 0 ? (
          <p>Aucune commande</p>
        ) : (
          <FlexRow>
            {filteredCommandes.map((c) => (
              <ProductCard key={c._id}>
                <div>
                  <p>ID: {c._id}</p>
                  <p>
                    Statut:{" "}
                    <StatusBadge statut={c.statut}>{c.statut}</StatusBadge>
                  </p>
                  <p>Total: {c.total.toLocaleString()} FCFA</p>
                  <p>Date: {new Date(c.createdAt).toLocaleString()}</p>
                  <div>
                    Produits:
                    {c.produits.map((pr) => (
                      <p key={pr.produitId?._id || Math.random()}>
                        {pr.produitId?.title || "Produit supprimé"} x{" "}
                        {pr.quantite}
                      </p>
                    ))}
                  </div>
                </div>
              </ProductCard>
            ))}
          </FlexRow>
        )}
      </Section>
    </PageWrapper>
  );
}
