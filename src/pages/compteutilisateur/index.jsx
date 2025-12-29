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
  width: 48px;
  height: 48px;
  border: 5px solid #ddd;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/* ===== STYLES RESPONSIVE & LUXE ===== */
const PageWrapper = styled.main`
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    margin: 1.5rem;
    padding: 1rem;
  }
`;

const Section = styled.section`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-weight: 700;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1 1 200px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 6px rgba(0,123,255,0.3);
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #555;
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  background: #007bff;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 120px;
  max-width: 200px;

  &:hover {
    background: #0056b3;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Error = styled.p`
  color: #e11d48;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Success = styled.p`
  color: #10b981;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ProductCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  align-items: center;
  flex: 1 1 calc(50% - 1rem);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;

  @media (max-width: 500px) {
    width: 100%;
    height: auto;
    max-height: 150px;
  }
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  background-color: ${(props) =>
    props.statut === "en cours"
      ? "#f59e0b"
      : props.statut === "envoyé"
        ? "#3b82f6"
        : props.statut === "livré"
          ? "#10b981"
          : "#ef4444"};

  @media (max-width: 500px) {
    padding: 3px 6px;
    font-size: 0.85rem;
  }
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
  const [updateMessage, setUpdateMessage] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
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
      setError("Impossible de récupérer vos informations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchCompte(); }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!username || (!isLogin && !email) || !password) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }
    try {
      const endpoint = isLogin ? "login" : "signup";
      const body = isLogin ? { username, password } : { username, email, password };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la connexion");
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
        setLoginAttempts(prev => {
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
    if (!editUsername || !editEmail) {
      setUpdateMessage("Tous les champs sont obligatoires.");
      return;
    }
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
      setUser(prev => ({ ...prev, username: editUsername, email: editEmail }));
      setUpdateMessage("Profil mis à jour ✅");
    } catch (err) {
      setUpdateMessage(err.message);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setFavorites(favs => favs.filter(f => f._id !== id));
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
        {error && <Error>{error}</Error>}
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required />
          {!isLogin && <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />}
          <InputGroup>
            <Input type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
            <EyeIcon onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</EyeIcon>
          </InputGroup>
          <Button type="submit">{isLogin ? "Se connecter" : "Créer un compte"}</Button>
        </form>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          {isLogin ? "Pas de compte ?" : "Déjà inscrit ?"}{" "}
          <span style={{ color: "#007bff", cursor: "pointer", fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>
        {showResetModal && <ResetPasswordModal onClose={() => setShowResetModal(false)} />}
      </PageWrapper>
    );
  }

  const filteredCommandes = filterStatus ? commandes.filter(c => c.statut === filterStatus) : commandes;

  return (
    <PageWrapper>
      <Section>
        <Title>Bonjour {user.username}</Title>
        <p>Email : {user.email}</p>
        <InputGroup style={{ marginTop: "0.5rem" }}>
          <Input value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder="Modifier username" />
          <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Modifier email" />
          <Button onClick={handleUpdateProfile}>Mettre à jour</Button>
        </InputGroup>
        {updateMessage && <Success>{updateMessage}</Success>}
        <Button onClick={logout} style={{ marginTop: "0.5rem", background: "#ef4444" }}>Se déconnecter</Button>
      </Section>

      <Section>
        <Title>Favoris</Title>
        {favorites.length === 0 ? <p>Aucun favori</p> : (
          <FlexRow>
            {favorites.map(f => (
              <ProductCard key={f._id}>
                <ProductImage src={f.productId?.images[0]?.url || "https://via.placeholder.com/70"} alt={f.productId?.title || "Produit"} />
                <div>
                  <p>{f.productId?.title || "—"}</p>
                  <p>{f.productId?.price?.toLocaleString() || "—"} FCFA</p>
                  <Button onClick={() => removeFavorite(f._id)}>Supprimer</Button>
                </div>
              </ProductCard>
            ))}
          </FlexRow>
        )}
      </Section>

      <Section>
        <Title>Commandes</Title>
        <div style={{ marginBottom: "1rem" }}>
          <label>Filtrer par statut : </label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tous</option>
            <option value="en cours">En cours</option>
            <option value="envoyé">Envoyé</option>
            <option value="livré">Livré</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>

        {filteredCommandes.length === 0 ? <p>Aucune commande</p> : (
          <FlexRow>
            {filteredCommandes.map(c => (
              <ProductCard key={c._id}>
                <div>
                  <p>ID: {c._id}</p>
                  <p>Statut: <StatusBadge statut={c.statut}>{c.statut}</StatusBadge></p>
                  <p>Total: {c.total.toLocaleString()} FCFA</p>
                  <p>Date: {new Date(c.createdAt).toLocaleString()}</p>
                  <div>
                    Produits:
                    {c.produits.map(pr => (
                      <p key={pr.produitId?._id || Math.random()}>{pr.produitId?.title || "Produit supprimé"} x {pr.quantite}</p>
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
