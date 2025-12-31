import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

// ===== STYLES =====
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1f1f2e, #11101a);
  font-family: "Inter", sans-serif;
`;

const FormWrapper = styled.div`
  background: #1f1f2e;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 0 40px rgba(79, 70, 229, 0.4);
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 1.2rem;
  border-radius: 12px;
  border: none;
  background: #2a2a3d;
  color: #fff;
  font-size: 1rem;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  }
`;

const Message = styled.p`
  color: ${(props) => (props.error ? "#ef4444" : "#10b981")};
  text-align: center;
  margin-bottom: 1rem;
`;

const SwitchLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #aaa;
  a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

// ===== COMPOSANT =====
export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      // ⚡ Récupérer le token et le stocker
      localStorage.setItem("token", data.token);

      // Redirection directe vers le compte
      navigate("/compte");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Créer un compte</Title>
        {message && <Message error={message.includes("Erreur")}>{message}</Message>}
        <form onSubmit={handleSignup}>
          <Input 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
        <SwitchLink>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </SwitchLink>
      </FormWrapper>
    </PageWrapper>
  );
}
