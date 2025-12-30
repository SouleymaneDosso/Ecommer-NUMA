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
  background: ${(p) =>
    p.status === "PAID" ? "#dcfce7" : "#fee2e2"};
  color: ${(p) =>
    p.status === "PAID" ? "#166534" : "#991b1b"};
`;

export default function Merci() {
  const location = useLocation();
  const navigate = useNavigate();
  const commandeId = location.state?.commandeId;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!commandeId) {
      navigate("/");
      return;
    }

    const fetchCommande = async () => {
      try {
        const res = await fetch(`${API_URL}/api/commandes/${commandeId}`);
        const data = await res.json();

        if (!res.ok) {
          alert("Commande introuvable");
          navigate("/");
          return;
        }

        setCommande(data.commande);
      } catch (err) {
        console.error(err);
        alert("Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [commandeId, API_URL, navigate]);

  if (loading) return <Page>Chargement...</Page>;
  if (!commande) return null;

  return (
    <Page>
      <Title>Merci pour votre commande 🎉</Title>

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

      <Box>
        <h3>Produits</h3>
        {commande.panier.map((item) => (
          <Line key={item._id}>
            <span>
              {item.nom} x {item.quantite}
            </span>
            <span>
              {(item.prix * item.quantite).toLocaleString()} FCFA
            </span>
          </Line>
        ))}

        <hr />

        <Line>
          <strong>Total</strong>
          <strong>{commande.total.toLocaleString()} FCFA</strong>
        </Line>
      </Box>

      <Box>
        <h3>Mode de paiement</h3>
        <p>
          {commande.modePaiement === "installments"
            ? "Paiement en 3 fois"
            : "Paiement en totalité"}
        </p>

        {commande.modePaiement === "installments" && (
          <>
            <h4>Échéances</h4>
            {commande.paiements.map((p) => (
              <Line key={p._id}>
                <span>Étape {p.step}</span>
                <span>
                  {p.amount.toLocaleString()} FCFA{" "}
                  <Badge status={p.status}>{p.status}</Badge>
                </span>
              </Line>
            ))}
          </>
        )}
      </Box>
    </Page>
  );
}
