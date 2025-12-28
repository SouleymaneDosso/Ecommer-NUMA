import { useState } from "react";
import styled from "styled-components";

// Styles réutilisés
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #fff; padding: 2rem; border-radius: 12px;
  width: 90%; max-width: 400px; text-align: center;
`;

const Input = styled.input`
  width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #ccc;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 10px; border-radius: 8px; border: none;
  background: #007bff; color: white; font-weight: 600; cursor: pointer;
  margin-top: 1rem;
  width: 100%;
`;

const Success = styled.p` color: #10b981; font-weight: 600; margin-top: 1rem; `;
const Error = styled.p` color: #e11d48; font-weight: 600; margin-top: 1rem; `;

export default function ResetPasswordModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email || !newPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setMessage(""); setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage(data.message || "Mot de passe réinitialisé avec succès ✅");
      setEmail(""); setNewPassword("");

      // On appelle la callback pour notifier le parent
      if (onSuccess) onSuccess(data.message || "Mot de passe réinitialisé !");
      // Fermer le modal après 1 seconde
      setTimeout(() => { onClose(); }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Réinitialiser le mot de passe</h3>
        <p>Veuillez saisir votre email et votre nouveau mot de passe.</p>

        <Input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />

        <Button onClick={handleReset} disabled={loading}>
          {loading ? "En cours..." : "Réinitialiser"}
        </Button>
        <Button onClick={onClose} style={{ background: "#ccc", color: "#000", marginTop: "0.5rem" }}>
          Annuler
        </Button>

        {message && <Success>{message}</Success>}
        {error && <Error>{error}</Error>}
      </ModalContent>
    </ModalOverlay>
  );
}
