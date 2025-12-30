import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

/* ===== STYLES ===== */
const Page = styled.main`
  max-width: 900px;
  margin: 4rem auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const Box = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) => (p.status === "PAID" ? "#dcfce7" : "#fee2e2")};
  color: ${(p) => (p.status === "PAID" ? "#166534" : "#991b1b")};
`;

const Coffre = styled.p`
  font-weight: bold;
  font-size: 1rem;
  color: ${(p) => (p.unlocked ? "#166534" : "#991b1b")};
  margin-top: 1rem;
`;

/* ===== COMPONENT ===== */
export default function Merci() {
  const location = useLocation();
  const navigate = useNavigate();
  const commandeId = location.state?.commandeId;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Récupération commande
  const fetchCommande = async () => {
    try {
      const res = await fetch(`${API_URL}/api/commandes/${commandeId}`);
      const data = await res.json();
      setCommande(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!commandeId) {
      navigate("/");
      return;
    }

    fetchCommande();

    // Rafraîchissement automatique toutes les 5 secondes
    const interval = setInterval(fetchCommande, 5000);
    return () => clearInterval(interval);
  }, [commandeId, navigate]);

  if (loading) return <Page>Chargement...</Page>;
  if (!commande) return <Page>Commande introuvable</Page>;

  const toutesPayees = commande.paiements.every((p) => p.status === "PAID");

  return (
    <Page>
      <Title>Merci pour votre commande 🎉</Title>

      {/* Informations client */}
      <Box>
        <h3>Informations client</h3>
        <p>
          {commande.client.prenom} {commande.client.nom}
        </p>
        <p>{commande.client.adresse}</p>
        <p>
          {commande.client.ville}, {commande.client.pays}
        </p>
      </Box>

      {/* Produits et total */}
      <Box>
        <h3>Produits</h3>
        {commande.panier.map((item) => (
          <Line key={item._id}>
            <span>
              {item.nom} x {item.quantite}
            </span>
            <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
          </Line>
        ))}
        <hr />
        <Line>
          <strong>Total</strong>
          <strong>{commande.total.toLocaleString()} FCFA</strong>
        </Line>
      </Box>

      {/* Paiement */}
      <Box>
        <h3>Mode de paiement</h3>
        <p>
          {commande.modePaiement === "installments"
            ? "Paiement en 3 fois"
            : "Paiement en totalité"}
        </p>

        <Coffre unlocked={toutesPayees}>
          Coffre : {toutesPayees ? "Déverrouillé ✅" : "Verrouillé 🔒"}
        </Coffre>

        <h4>État des paiements</h4>
        {commande.paiements.map((p) => (
          <Line key={p._id}>
            <span>Étape {p.step}</span>
            <span>
              {p.amount.toLocaleString()} FCFA <Badge status={p.status}>{p.status}</Badge>
            </span>
          </Line>
        ))}

        {toutesPayees && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#166534" }}>
            Toutes les étapes sont payées. Livraison possible !
          </p>
        )}
      </Box>
    </Page>
  );
}
