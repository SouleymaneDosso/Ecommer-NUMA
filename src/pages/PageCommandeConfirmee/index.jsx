import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PanierContext, ThemeContext } from "../../Utils/Context";

/* ===== STYLES ===== */
const Page = styled.main`
  max-width: 800px;
  margin: 3rem auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;
  background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#f7f7f7")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#111")};
  min-height: 100vh;
`;

const Box = styled.div`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  padding: 2rem;
  border-radius: 16px;
  margin-top: 1rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const Button = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, black, #6366f1);
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

export default function PageCommandeConfirmee() {
  const { id } = useParams();
  const { toutSupprimer } = useContext(PanierContext);
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

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

      // vider panier
      toutSupprimer();
    };

    fetchCommande();
  }, [id]);

  if (!commande) return <Page $isdark={$isdark}>Chargement...</Page>;

  return (
    <Page $isdark={$isdark}>
      <Title>🎉 Commande confirmée</Title>

      <Box $isdark={$isdark}>
        <p>Merci <strong>{commande.client.prenom}</strong> 👋</p>

        <p>
          Votre commande a été enregistrée avec succès.
        </p>

        <h3>🚚 Paiement à la livraison</h3>
        <p>
          Vous paierez <strong>{commande.total.toLocaleString()} FCFA</strong> à la réception.
        </p>

        <h3>📍 Livraison</h3>
        <p>{commande.client.adresse}</p>
        <p>{commande.client.ville}</p>

        <h3>📦 Produits</h3>
        {commande.panier.map((item) => (
          <p key={item.produitId}>
            {item.nom} x {item.quantite}
          </p>
        ))}

        <Button onClick={() => navigate("/")}>
          Retour à l’accueil
        </Button>
      </Box>
    </Page>
  );
}