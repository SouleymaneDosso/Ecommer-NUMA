import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";

// ===== STYLES =====
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #1f1f2e, #11101a);
  font-family: "Inter", sans-serif;
  overflow-y: auto; /* Permet le scroll si le clavier pousse le contenu */

  @media (max-width: 768px) {
    padding-top: 10vh;
    padding-bottom: env(safe-area-inset-bottom, 1rem);
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  background: #1f1f2e;
  padding: 1.75rem 1.25rem;
  border-radius: 18px;
  box-shadow: 0 0 28px rgba(79, 70, 229, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  @media (max-width: 480px) {
    padding: 1.4rem 1.1rem;
    border-radius: 16px;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  padding-right: 40px;
  border-radius: 12px;
  border: none;
  background: #2a2a3d;
  color: #fff;
  font-size: 16px; /* Empêche le zoom iOS */
  -webkit-text-size-adjust: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.35);
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
  font-size: 1.1rem;
  padding: 0;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 0.4rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-bottom: 0.8rem;
  font-size: 0.85rem;
  color: ${(props) => (props.error ? "#ef4444" : "#10b981")};
`;

const SwitchLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #aaa;

  a {
    color: #6366f1;
    font-weight: 600;
    text-decoration: none;
  }
`;

// ===== COMPOSANT =====
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

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
        <Title>Connexion</Title>

        {message && (
          <Message error={message.toLowerCase().includes("erreur")}>
            {message}
          </Message>
        )}

        <form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              type="text"
              placeholder="Identifiant"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeButton>
          </InputWrapper>

          <Button type="submit" disabled={loading}>
            {loading ? "..." : "Se connecter"}
          </Button>
        </form>

        <SwitchLink>
          Nouveau ? <Link to="/signup">Créer un compte</Link>
        </SwitchLink>
      </FormWrapper>
    </PageWrapper>
  );
}
