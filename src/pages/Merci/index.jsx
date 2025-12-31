import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaBox, FaCheckCircle } from "react-icons/fa";

/* ===== ANIMATION LOADING ===== */
const spin = keyframes` to { transform: rotate(360deg); } `;
const LoaderWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/* ===== STYLES PAGE ===== */
const Page = styled.main`
  max-width: 900px;
  margin: 4rem auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
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
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background-color: ${(p) =>
    p.status === "PAID" ? "#10b981" : "#f59e0b"};
`;

const Coffre = styled.div`
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const CoffreText = styled.div`
  font-weight: 600;
  span {
    font-weight: 700;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  background: rgba(0,0,0,0.7);
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  text-align: center;
`;

const CloseModal = styled.button`
  margin-top: 1rem;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #4f46e5;
  color: #fff;
  cursor: pointer;
`;

/* ===== COMPONENT ===== */
export default function Merci() {
  const location = useLocation();
  const navigate = useNavigate();
  const commandeId = location.state?.commandeId;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Récupérer la commande
  useEffect(() => {
    if (!commandeId) {
      navigate("/");
      return;
    }

    const fetchCommande = async () => {
      try {
        const res = await fetch(`${API_URL}/api/commandes/${commandeId}`);
        const data = await res.json();
        setCommande(data.commande || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [commandeId, navigate]);

  if (loading) return (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  );

  if (!commande) return <Page>Commande introuvable</Page>;

  const paidSteps = commande.paiements.filter((p) => p.status === "PAID").length;
  const totalSteps = commande.paiements.length;
  const totalPaid = commande.paiements
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amountExpected, 0);

  return (
    <Page>
      <Title>Merci pour votre commande 🎉</Title>

      {/* Modal rassurant */}
      {showModal && (
        <Modal>
          <ModalContent>
            <h2>Votre paiement est en cours de validation</h2>
            <p>Vous pouvez suivre l’avancement de votre coffre dans votre espace compte.</p>
            <CloseModal onClick={() => setShowModal(false)}>Fermer</CloseModal>
          </ModalContent>
        </Modal>
      )}

      {/* Récapitulatif */}
      <Box>
        <h3>Récapitulatif de la commande</h3>
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
          <strong>Payé</strong>
          <strong>{totalPaid.toLocaleString()} FCFA</strong>
        </Line>
        <Line>
          <strong>Reste à payer</strong>
          <strong>{(commande.total - totalPaid).toLocaleString()} FCFA</strong>
        </Line>
      </Box>

      {/* Coffre */}
      <Coffre>
        <FaBox size={24} color="#4f46e5" />
        <CoffreText>
          Votre coffre : <span>{paidSteps}/{totalSteps} étapes payées</span>
        </CoffreText>
      </Coffre>

      <Button onClick={() => navigate("/panier")}>Retour au panier</Button>
    </Page>
  );
}
