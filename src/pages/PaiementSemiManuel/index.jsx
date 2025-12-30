import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

/* ===== STYLES ===== */
const Page = styled.main`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
  font-family: "Inter", sans-serif;
`;

const Box = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) => (p.status === "PAID" ? "#dcfce7" : "#fee2e2")};
  color: ${(p) => (p.status === "PAID" ? "#166534" : "#991b1b")};
`;

/* ===== COMPONENT ===== */
export default function PaiementSemiManuel() {
  const { id } = useParams(); // ID de la commande
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState("");
  const [montant, setMontant] = useState("");

  // Récupérer la commande
  const fetchCommande = async () => {
    try {
      const res = await fetch(`${API_URL}/api/commandes/${id}`);
      const data = await res.json();
      setCommande(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommande();
  }, [id]);

  // Soumettre paiement semi-manuel
  const handlePaiement = async (e) => {
    e.preventDefault();

    if (!transactionId || !montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/commandes/${id}/paiement-semi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, montant }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de l'enregistrement du paiement");
        return;
      }

      alert("Paiement soumis avec succès, en attente de validation admin");
      navigate("/merci");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  if (loading) return <Page><p>Chargement...</p></Page>;
  if (!commande) return <Page><p>Commande introuvable</p></Page>;

  return (
    <Page>
      <Title>Paiement Semi-Manuel</Title>

      <Box>
        <h2>Récapitulatif de la commande</h2>
        {commande.panier.map((item) => (
          <Line key={item.produitId}>
            <span>{item.nom} x {item.quantite}</span>
            <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
          </Line>
        ))}
        <Line>
          <strong>Total</strong>
          <strong>{commande.total.toLocaleString()} FCFA</strong>
        </Line>
        <Line>
          <strong>Service choisi :</strong>
          <span>{commande.servicePaiement === "wave" ? "Wave" : "Orange Money"}</span>
        </Line>
      </Box>

      <Box>
        <h2>Enregistrement du paiement</h2>
        <form onSubmit={handlePaiement}>
          <Input
            placeholder="ID de transaction"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <Input
            placeholder="Montant payé (FCFA)"
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
          <Button type="submit">Envoyer pour validation</Button>
        </form>
      </Box>

      <Box>
        <h2>Étapes de paiement</h2>
        {commande.paiements.map((p) => (
          <Line key={p._id}>
            <span>Étape {p.step}</span>
            <Badge status={p.status}>{p.status}</Badge>
          </Line>
        ))}
      </Box>
    </Page>
  );
}
