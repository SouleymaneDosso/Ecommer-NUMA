import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { PanierContext } from "../../Utils/Context";

/* ===== ANIMATION ===== */
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ===== PAGE ===== */
const Page = styled.main`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: Inter, sans-serif;
`;

/* ===== LOADER ===== */
const LoaderWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/* ===== UI ===== */
const Box = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
`;

/* ===== PAIEMENT CARDS ===== */
const PaymentCards = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const PaymentCard = styled.div`
  flex: 1;
  min-width: 220px;
  background: #fff;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PaymentLogo = styled.img`
  width: 44px;
  height: 44px;
`;

const PaymentNumber = styled.div`
  font-weight: 600;
`;

/* ===== MODAL ===== */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 92%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  padding: 1.5rem;
`;

const CloseButton = styled.button`
  float: right;
  border: none;
  background: none;
  font-size: 1.4rem;
  cursor: pointer;
`;

const ReceiptBox = styled.div`
  background: #f9fafb;
  border: 1px dashed #c7d2fe;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
`;

const ReceiptLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  gap: 0.5rem;
`;

/* ===== MODAL COMPONENT ===== */
function PaymentModal({ open, onClose }) {
  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <h2>Comment payer ?</h2>

        <p>
          Le paiement se fait <strong>manuellement</strong> via
          <strong> Orange Money</strong> ou <strong>Wave</strong>.
        </p>

        <ol>
          <li>Effectuez le paiement vers le numéro affiché.</li>
          <li>Vous pouvez payer <strong>en totalité</strong> ou <strong>en plusieurs étapes</strong>.</li>
          <li>Après paiement, récupérez les informations fournies par le service.</li>
          <li>Remplissez le formulaire avec ces informations.</li>
        </ol>

        <h3>Exemple de preuve de paiement</h3>

        <ReceiptBox>
          <ReceiptLine><span>Numéro de dépôt</span><span>0700247693</span></ReceiptLine>
          <ReceiptLine><span>Montant</span><span>10 000 FCFA</span></ReceiptLine>
          <ReceiptLine><span>ID transaction</span><span>4F3A9B12</span></ReceiptLine>
          <ReceiptLine><span>Service</span><span>Wave</span></ReceiptLine>
        </ReceiptBox>

        <p>
          🔑 L’<strong>ID transaction</strong> est unique et permet de vérifier votre paiement.
        </p>

        <p>
          ⏳ Votre statut passera à <strong>« Vérification en cours »</strong>
          dans votre espace compte.
        </p>

        <p>
          ❌ En cas de rejet, le <strong>remboursement est intégral</strong>.
        </p>
      </ModalContent>
    </ModalOverlay>
  );
}

/* ===== MAIN COMPONENT ===== */
export default function PaiementSemiManuel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toutSupprimer } = useContext(PanierContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`${API_URL}/api/commandes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setCommande)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <LoaderWrapper><Loader /></LoaderWrapper>;

  if (!commande) return <Page>Commande introuvable</Page>;

  return (
    <Page>
      <Title>Paiement Semi-Manuel</Title>

      <Button onClick={() => setModalOpen(true)}>
        Comment payer ?
      </Button>

      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <PaymentCards>
        <PaymentCard>
          <PaymentLogo src="/logosorange.png" />
          <PaymentNumber>0700247693</PaymentNumber>
        </PaymentCard>
        <PaymentCard>
          <PaymentLogo src="/logoswave.jpg" />
          <PaymentNumber>0700247693</PaymentNumber>
        </PaymentCard>
      </PaymentCards>

      <Box>
        <h2>Total à payer</h2>
        <strong>{commande.total.toLocaleString()} FCFA</strong>
      </Box>
    </Page>
  );
}
