import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi"; // <- icônes œil

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

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px; /* espace pour l'icône œil */
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

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
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
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- état mot de passe visible
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      localStorage.setItem("token", data.token);
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
        <Title>Se connecter</Title>
        {message && <Message error={message.includes("Erreur")}>{message}</Message>}
        <form onSubmit={handleLogin}>
          <Input 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <InputWrapper>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeButton>
          </InputWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <SwitchLink>
          Pas encore inscrit ? <Link to="/signup">Créer un compte</Link>
        </SwitchLink>
      </FormWrapper>
    </PageWrapper>
  );
}

