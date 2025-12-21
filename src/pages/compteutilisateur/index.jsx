// src/pages/Compte.jsx
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.bg || "#fff"};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary || "#007bff"};
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const SwitchMode = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;

  span {
    color: ${({ theme }) => theme.primary || "#007bff"};
    cursor: pointer;
    font-weight: 600;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-weight: 600;
  text-align: center;
`;

/* ===== PAGE COMPTE ===== */
function Compte() {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isLogin
      ? "http://localhost:3000/api/admin/login"
      : "http://localhost:3000/api/admin/create";

    const body = JSON.stringify({ username, password });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Erreur serveur");
        return;
      }

      // Si login, on stocke le token
      if (isLogin) {
        localStorage.setItem("token", data.token);
        navigate("/"); // Redirige vers la page d'accueil
      } else {
        alert("Compte créé avec succès ! Tu peux maintenant te connecter.");
        setIsLogin(true);
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      setError("Erreur réseau, réessaie plus tard.");
    }
  };

  return (
    <PageWrapper>
      <Title>{isLogin ? "Connexion" : "Inscription"}</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</Button>
      </Form>

      <SwitchMode>
        {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
        <span onClick={() => { setIsLogin(!isLogin); setError(""); }}>
          {isLogin ? "S'inscrire" : "Se connecter"}
        </span>
      </SwitchMode>
    </PageWrapper>
  );
}

export default Compte;
