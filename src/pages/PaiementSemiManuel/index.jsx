import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { PanierContext } from "../../Utils/Context";

/* ===== ANIMATIONS ===== */
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ===== STYLES ===== */
const Page = styled.main`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Inter", sans-serif;
`;

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
  padding: 14px;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
  }
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

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) =>
    p.status === "PAID"
      ? "#dcfce7"
      : p.status === "PENDING"
        ? "#fef3c7"
        : "#fee2e2"};
  color: ${(p) =>
    p.status === "PAID"
      ? "#166534"
      : p.status === "PENDING"
        ? "#92400e"
        : "#991b1b"};
`;

const Timeline = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
`;

const TimelineItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StepInfo = styled.div`
  margin-left: 0.8rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const StepLabel = styled.span`
  font-weight: 500;
`;

const StepAmount = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin: 0.5rem 0 1.5rem 2rem;
  position: relative;
`;

const Progress = styled.div`
  height: 100%;
  width: ${(p) => p.percent}%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  font-size: 0.95rem;
`;

const PaymentCards = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const PaymentCard = styled.div`
  flex: 1;
  min-width: 220px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PaymentLogo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const PaymentNumber = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

/* ===== MODAL ===== */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
`;

const CloseButton = styled.button`
  background: #f3f3f3;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  float: right;
  cursor: pointer;
`;

/* ===== MINI TELEPHONE MOCK RESPONSIVE ===== */
const PhoneMock = styled.div`
  background: #1e293b;
  border-radius: 8vw; /* arrondi responsive */
  width: 90%;
  max-width: 300px;
  aspect-ratio: 0.55; /* ratio approximatif téléphone */
  padding: 4%;
  color: #fff;
  font-family: "Courier New", monospace;
  margin: 1rem auto;
  position: relative;
`;

const Screen = styled.div`
  background: #f3f4f6;
  color: #111827;
  border-radius: 8%;
  padding: 4%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  font-size: 0.9rem;
`;

const SMSLine = styled.p`
  margin: 0.3rem 0;
  word-break: break-word; /* éviter débordement */
`;

function PaymentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>Comment payer ?</h2>
        <ol>
          <li>Choisissez votre service de paiement : Orange Money ou Wave.</li>
          <li>
            Envoyez le montant total ou en plusieurs étapes depuis votre
            téléphone.
          </li>
          <li>
            Récupérez la preuve de paiement : votre{" "}
            <strong>numéro de dépôt</strong>, le <strong>montant envoyé</strong>
            , et l'<strong>ID unique</strong> généré par Orange/Wave (reçu par
            SMS ou dans l'application).
          </li>
          <li>
            Remplissez le formulaire sur notre site avec ces informations.
          </li>
          <li>
            Après soumission, un message{" "}
            <strong>“Vérification en cours”</strong> apparaîtra dans votre
            espace compte.
          </li>
          <li>
            Une fois validé, le statut sera mis à jour. Si le paiement est
            rejeté, le remboursement intégral sera effectué.
          </li>
        </ol>

        <h3>Exemple visuel de SMS :</h3>
        <PhoneMock>
          <Screen>
            <SMSLine>De: Wave/Orange</SMSLine>
            <SMSLine>Numéro de dépôt: 0700247693</SMSLine>
            <SMSLine>Montant: 10 000 FCFA</SMSLine>
            <SMSLine>ID transaction: 4F3A9B12</SMSLine>
            <SMSLine>Date: 06/01/2026</SMSLine>
          </Screen>
        </PhoneMock>

        <p>
          L'<strong>ID transaction</strong> est unique et permet de vérifier
          votre paiement.
        </p>
      </ModalContent>
    </ModalOverlay>
  );
}

/* ===== COMPONENT PRINCIPAL ===== */
export default function PaiementSemiManuel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numeroClient, setNumeroClient] = useState("");
  const [montantEnvoye, setMontantEnvoye] = useState("");
  const [reference, setReference] = useState("");
  const [service, setService] = useState("orange");
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { toutSupprimer } = useContext(PanierContext);

  // Vérifier token
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/login");
      return;
    }
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchCommande = async () => {
      try {
        const res = await fetch(`${API_URL}/api/commandes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur serveur");
        setCommande(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommande();
  }, [id, token]);

  const handlePaiement = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Vous devez être connecté pour payer cette commande.");
      navigate("/login");
      return;
    }

    if (!numeroClient || !montantEnvoye || !reference || step < 1) {
      alert("Veuillez remplir tous les champs correctement");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/commandes/${id}/paiement-semi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          step,
          numeroClient,
          montantEnvoye: Number(montantEnvoye),
          reference,
          service,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erreur lors de l'enregistrement du paiement");
        return;
      }

      toutSupprimer();

      navigate("/merci", { state: { commandeId: id } });
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  if (loading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  if (!commande) return <Page>Commande introuvable</Page>;

  const totalSteps = commande.paiements.length;
  const paidSteps = commande.paiements.filter(
    (p) => p.status === "PAID"
  ).length;
  const progressPercent = (paidSteps / totalSteps) * 100;

  return (
    <Page>
      <Title>Paiement Semi-Manuel</Title>

      <Button
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: "1rem" }}
      >
        Comment payer ?
      </Button>
      <PaymentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <PaymentCards>
        <PaymentCard>
          <PaymentLogo src="/logosorange.png" alt="Orange Money" />
          <PaymentNumber>0700247693</PaymentNumber>
        </PaymentCard>
        <PaymentCard>
          <PaymentLogo src="/logoswave.jpg" alt="Wave" />
          <PaymentNumber>0700247693</PaymentNumber>
        </PaymentCard>
      </PaymentCards>

      <Box>
        <h2>Récapitulatif de la commande</h2>
        {commande.panier.map((item) => (
          <Line key={item.produitId}>
            <span>
              {item.nom} x {item.quantite}
            </span>
            <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
          </Line>
        ))}
        <Line>
          <strong>Total</strong>
          <strong>{commande.total.toLocaleString()} FCFA</strong>
        </Line>
        <Line>
          <strong>Service choisi :</strong>
          <span>
            {commande.servicePaiement === "wave" ? "Wave" : "Orange Money"}
          </span>
        </Line>
      </Box>

      <Box>
        <h2>Soumettre votre paiement</h2>
        <form onSubmit={handlePaiement}>
          <Input
            placeholder="Numéro de téléphone"
            value={numeroClient}
            onChange={(e) => setNumeroClient(e.target.value)}
          />
          <Input
            placeholder="Montant payé (FCFA)"
            type="number"
            min={0}
            value={montantEnvoye}
            onChange={(e) => setMontantEnvoye(e.target.value)}
          />
          <Input
            placeholder="Référence / ID de paiement"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <select
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "1rem",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          >
            {commande.paiements.map((p) => (
              <option
                key={p.step}
                value={p.step}
                disabled={p.status === "PAID"}
              >
                Étape {p.step} {p.status === "PAID" ? "(Déjà payée)" : ""}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", marginBottom: "1rem" }}>
            <RadioLabel>
              <input
                type="radio"
                name="service"
                value="orange"
                checked={service === "orange"}
                onChange={(e) => setService(e.target.value)}
              />
              Orange Money
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="service"
                value="wave"
                checked={service === "wave"}
                onChange={(e) => setService(e.target.value)}
              />
              Wave
            </RadioLabel>
          </div>
          <Button
            type="submit"
            disabled={
              commande.paiements.find((p) => p.step === step)?.status === "PAID"
            }
          >
            Envoyer pour validation
          </Button>
        </form>
      </Box>

      <Box>
        <h2>Étapes de paiement</h2>
        <ProgressBar>
          <Progress percent={progressPercent} />
        </ProgressBar>
        <Timeline>
          {commande.paiements.map((p) => (
            <TimelineItem key={p._id}>
              {p.status === "PAID" ? (
                <FaCheckCircle color="#4f46e5" size={18} />
              ) : (
                <FaRegCircle color="#d1d5db" size={18} />
              )}
              <StepInfo>
                <StepLabel>Étape {p.step}</StepLabel>
                <StepAmount>
                  {(p.amountExpected || 0).toLocaleString()} FCFA
                </StepAmount>
                <Badge status={p.status}>{p.status}</Badge>
              </StepInfo>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Page>
  );
}
