import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
  margin-bottom: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
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
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!email) {
      setError("Veuillez entrer votre email");
      setLoading(false);
      return;
    }

    try {
      // ✅ Utilisation de la bonne URL avec /api
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      // 🔹 Lire la réponse brute pour debug
      const text = await res.text();
      console.log("Réponse brute du serveur :", text);

      // 🔹 Parser JSON si possible
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("⚠️ Réponse non JSON :", text);
        throw new Error("Réponse serveur invalide");
      }

      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Mot de passe oublié</Title>

        {message && <Message>{message}</Message>}
        {error && <Message error>{error}</Message>}

        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>

          <Button type="submit" disabled={loading}>
            {loading ? "..." : "Envoyer le lien"}
          </Button>
        </form>

        <SwitchLink>
          Retour à la <Link to="/login">connexion</Link>
        </SwitchLink>
      </FormWrapper>
    </PageWrapper>
  );
}
