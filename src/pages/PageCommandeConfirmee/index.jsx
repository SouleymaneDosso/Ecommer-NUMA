import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { PanierContext, ThemeContext } from "../../Utils/Context";
import { FaWhatsapp } from "react-icons/fa";

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
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* ===== CARD PRINCIPALE ===== */
const Card = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#fff")};
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.6s ease;
  position: relative;
  overflow: hidden;
`;

/* ===== HEADER ===== */
const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 50px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
  font-size: 14px;
  animation: ${pulse} 1.5s infinite;
`;

/* ===== GRID ===== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

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

/* ===== PRODUITS ===== */
const Product = styled.div`
  padding: 10px 0;
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
const WhatsAppFloat = styled.a`
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 60px;
  height: 60px;
  background: #25d366;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  z-index: 9999;
  transition: 0.3s;

  &:hover {
    transform: scale(1.1);
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
        <Header>
          <Badge>🎉 Commande confirmée</Badge>
          <h1 style={{ marginTop: "1rem" }}>
            Merci {commande.client.prenom} 👋
          </h1>
          <p>Votre commande a été enregistrée avec succès</p>
        </Header>

        <Grid>
          {/* PAIEMENT */}
          <Box $isdark={$isdark}>
            <h3>💰 Paiement</h3>
            <p>
              <strong>{commande.total.toLocaleString()} FCFA</strong>
            </p>
            <p>Paiement à la livraison</p>
          </Box>

          {/* LIVRAISON */}
          <Box $isdark={$isdark}>
            <h3>📍 Livraison</h3>
            <p>{commande.client.adresse}</p>
            <p>{commande.client.ville}</p>
          </Box>
        </Grid>

        {/* PRODUITS */}
        <Box $isdark={$isdark} style={{ marginTop: "1.5rem" }}>
          <h3>📦 Produits commandés</h3>

          {commande.panier.map((item) => (
            <Product key={item.produitId}>
              🛍 {item.nom} — <strong>x{item.quantite}</strong>
            </Product>
          ))}
        </Box>

        <Button onClick={() => navigate("/")}>🏠 Retour à l’accueil</Button>
      </Card>

      <WhatsAppFloat
        href="https://wa.me/2250700247693"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </WhatsAppFloat>
    </Page>
  );
}
