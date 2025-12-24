import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

/* ===== LOADER ===== */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;
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

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;
const Section = styled.section`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.2rem;
  margin-bottom: 2rem;
`;
const Title = styled.h2`
  margin-bottom: 1rem;
`;
const InputGroup = styled.div`
  position: relative;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
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
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #007bff;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;
const Error = styled.p`
  color: #e11d48;
  font-weight: 600;
  margin-bottom: 1rem;
`;
const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;
const ProductCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  align-items: center;
`;
const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
`;
const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  color: white;
  background-color: ${props =>
    props.statut === "en cours" ? "#f59e0b" :
    props.statut === "envoyé" ? "#3b82f6" :
    props.statut === "livré" ? "#10b981" :
    "#ef4444"};
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

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  /* ===== FETCH COMPTE ===== */
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCompte();
  }, [token]);

  /* ===== AUTH ===== */
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "login" : "signup";
      const body = isLogin
        ? { username, password }
        : { username, email, password };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      if (isLogin) {
        localStorage.setItem("token", data.token);
        fetchCompte();
      } else {
        alert("Compte créé. Connecte-toi !");
        setIsLogin(true);
      }

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===== MOT DE PASSE OUBLIE ===== */
  const handleForgotPassword = async () => {
    if (!forgotEmail) return;
    setForgotMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setForgotMessage(data.message);
    } catch (err) {
      setForgotMessage(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword) return;
    setResetMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setResetMessage(data.message);
      setResetToken("");
      setNewPassword("");
    } catch (err) {
      setResetMessage(err.message);
    }
  };

  /* ===== LOGOUT ===== */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/compte");
  };

  if (loading) return <LoaderWrapper><Loader /></LoaderWrapper>;

  /* ===== NOT CONNECTED ===== */
  if (!token || !user) {
    return (
      <PageWrapper>
        <Title>{isLogin ? "Connexion" : "Inscription"}</Title>
        {error && <Error>{error}</Error>}

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          )}
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <EyeIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeIcon>
          </InputGroup>
          <Button type="submit">{isLogin ? "Se connecter" : "Créer un compte"}</Button>
        </form>

        {isLogin && (
          <div style={{ marginTop: "1rem" }}>
            <p>Mot de passe oublié ?</p>
            <InputGroup>
              <Input
                type="email"
                placeholder="Votre email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
              />
              <Button onClick={handleForgotPassword}>Envoyer email</Button>
            </InputGroup>
            {forgotMessage && <p style={{ color: "green" }}>{forgotMessage}</p>}
          </div>
        )}

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          {isLogin ? "Pas de compte ?" : "Déjà inscrit ?"}{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer", fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>

        {/* ===== RESET PASSWORD FORM ===== */}
        <Section>
          <Title>Réinitialiser le mot de passe</Title>
          <Input placeholder="Token reçu par email" value={resetToken} onChange={e => setResetToken(e.target.value)} />
          <Input placeholder="Nouveau mot de passe" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <Button onClick={handleResetPassword}>Réinitialiser</Button>
          {resetMessage && <p style={{ color: "green" }}>{resetMessage}</p>}
        </Section>
      </PageWrapper>
    );
  }

  /* ===== CONNECTED ===== */
  return (
    <PageWrapper>
      <Section>
        <Title>Bonjour {user.username}</Title>
        <p>Email : {user.email}</p>
        <Button onClick={logout}>Se déconnecter</Button>
      </Section>

      <Section>
        <Title>Favoris</Title>
        {favorites.length === 0 ? <p>Aucun favori</p> :
          <FlexRow>
            {favorites.map(f => (
              <ProductCard key={f._id}>
                <ProductImage src={f.productId?.imageUrl || "https://via.placeholder.com/70"} alt={f.productId?.title || "Produit"} />
                <div>
                  <p>{f.productId?.title || "—"}</p>
                  <p>{f.productId?.price || "—"} FCFA</p>
                </div>
              </ProductCard>
            ))}
          </FlexRow>
        }
      </Section>

      <Section>
        <Title>Commandes</Title>
        {commandes.length === 0 ? <p>Aucune commande</p> :
          <FlexRow>
            {commandes.map(c => (
              <ProductCard key={c._id}>
                <div>
                  <p>ID: {c._id}</p>
                  <p>Statut: <StatusBadge statut={c.statut}>{c.statut}</StatusBadge></p>
                  <p>Total: {c.total} FCFA</p>
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
        }
      </Section>
    </PageWrapper>
  );
}
