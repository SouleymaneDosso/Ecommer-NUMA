import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  overflow-y: auto;
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
  font-size: 16px;

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
export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage("Mot de passe réinitialisé avec succès !");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Réinitialiser le mot de passe</Title>

        {message && <Message>{message}</Message>}
        {error && <Message error>{error}</Message>}

        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </EyeButton>
          </InputWrapper>

          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputWrapper>

          <Button type="submit" disabled={loading}>
            {loading ? "..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>

        <SwitchLink>
          Retour à la <Link to="/login">connexion</Link>
        </SwitchLink>
      </FormWrapper>
    </PageWrapper>
  );
}
