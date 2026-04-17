import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { PanierContext, ThemeContext } from "../../Utils/Context";

/* ===== ANIMATIONS ===== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

/* ===== PAGE ===== */
const Page = styled.main`
  min-height: 100vh;
  padding: 4rem 1rem;
  background: ${({ $isdark }) =>
    $isdark
      ? "radial-gradient(circle at top, #1a1a1a, #000)"
      : "linear-gradient(135deg, #f8fafc, #e2e8f0)"};
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* ===== CARD ===== */
const Card = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#fff")};
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.6s ease;
`;

/* ===== HEADER ===== */
const Badge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 50px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
  font-size: 14px;
  animation: ${pulse} 1.5s infinite;
  margin-bottom: 1rem;
`;

/* ===== GRID ===== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== BOX ===== */
const Box = styled.div`
  background: ${({ $isdark }) => ($isdark ? "#1c1c1c" : "#f8fafc")};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#e5e7eb")};
`;

/* ===== PRODUIT ===== */
const Product = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
`;

/* ===== BUTTON ===== */
const Button = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #22c55e);
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: scale(1.02);
  }
`;

/* ===== WHATSAPP BUTTON ===== */
const WhatsAppButton = styled.a`
  display: block;
  margin-top: 1rem;
  text-align: center;
  padding: 14px;
  border-radius: 14px;
  background: #25d366;
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    transform: scale(1.02);
  }
`;

export default function PageCommandeConfirmee() {
  const { id } = useParams();
  const { toutSupprimer } = useContext(PanierContext);
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "dark";

  const [commande, setCommande] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCommande = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/commandes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCommande(data);

      toutSupprimer();
    };

    fetchCommande();
  }, [id]);

  if (!commande) return <Page $isdark={$isdark}>Chargement...</Page>;

  return (
    <Page $isdark={$isdark}>
      <Card $isdark={$isdark}>
        <Badge>🎉 Commande confirmée</Badge>

        <h1>Merci {commande.client.prenom} 👋</h1>
        <p>Votre commande a été enregistrée avec succès.</p>

        <Grid>
          <Box $isdark={$isdark}>
            <h3>💰 Paiement</h3>
            <p><strong>{commande.total.toLocaleString()} FCFA</strong></p>
            <p>Paiement à la livraison</p>
          </Box>

          <Box $isdark={$isdark}>
            <h3>📍 Livraison</h3>
            <p>{commande.client.adresse}</p>
            <p>{commande.client.ville}</p>
          </Box>
        </Grid>

        <Box $isdark={$isdark} style={{ marginTop: "1.5rem" }}>
          <h3>📦 Produits</h3>

          {commande.panier.map((item) => (
            <Product key={item.produitId}>
              🛍 {item.nom} — x{item.quantite}
            </Product>
          ))}
        </Box>

        {/* WHATSAPP SUPPORT */}
        <WhatsAppButton
          href="https://wa.me/2250700247693"
          target="_blank"
        >
          💬 Contacter le support WhatsApp
        </WhatsAppButton>

        <Button onClick={() => navigate("/")}>
          🏠 Retour à l’accueil
        </Button>
      </Card>
    </Page>
  );
}