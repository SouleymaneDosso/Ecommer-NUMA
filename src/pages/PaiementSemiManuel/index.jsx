import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { PanierContext, ThemeContext } from "../../Utils/Context";

/* ANIMATION */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ===== STYLES GLOBAUX ===== */
const Page = styled.main`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.2rem;
  font-family: "Inter", sans-serif;
  background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#f7f7f7")};
  color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
`;

const LoaderWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Box = styled.div`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
  border-radius: 16px;
  padding: 1.8rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 12px 30px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.05)"};
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.2rem;
`;

/* PAYMENT CARDS */
const PaymentCards = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PaymentCard = styled.div`
  flex: 1;
  min-width: 240px;
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
  border-radius: 18px;
  padding: 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 12px 30px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.05)"};
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PaymentLogo = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const PaymentNumber = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#d1d5db")};
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fff")};
  color: inherit;
  font-size: 1rem;
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
  background: linear-gradient(135deg, black, #6366f1);
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ status }) =>
    status === "PAID" ? "#dcfce7" : status === "PENDING" ? "#fef3c7" : "#fee2e2"};
  color: ${({ status }) =>
    status === "PAID" ? "#166534" : status === "PENDING" ? "#92400e" : "#991b1b"};
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin: 0.6rem 0 1.2rem;
`;

const Progress = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const Timeline = styled.ul`
  list-style: none;
  padding: 0;
`;

const TimelineItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const StepInfo = styled.div`
  margin-left: 0.8rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const StepAmount = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

/* ===== COMPONENT ===== */
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

  const { toutSupprimer } = useContext(PanierContext);
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  /* TOKEN CHECK */
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (!saved) {
      navigate("/login");
      return;
    }
    setToken(saved);
  }, []);

  /* FETCH COMMANDE */
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

  /* PAIEMENT */
  const handlePaiement = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    if (!numeroClient || !montantEnvoye || !reference) {
      alert("Remplissez tous les champs.");
      return;
    }

    const montant = Number(montantEnvoye);
    const etape = commande?.paiements.find((p) => p.step === step);
    if (etape && etape.amountExpected && montant < etape.amountExpected) {
      alert("Le montant est inférieur à celui attendu pour cette étape.");
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
          montantEnvoye: montant,
          reference,
          service,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erreur lors du paiement");
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

  if (!commande) return <Page $isdark={$isdark}>Commande introuvable</Page>;

  const totalSteps = commande.paiements.length || 1;
  const paidSteps = commande.paiements.filter((p) => p.status === "PAID").length;
  const progressPercent = (paidSteps / totalSteps) * 100;

  return (
    <Page $isdark={$isdark}>
      <Title>Paiement Semi-Manuel</Title>

      {/* NUMEROS + LOGOS */}
      <Box $isdark={$isdark}>
        <h2>Envoyer votre paiement</h2>

        <PaymentCards>
          <PaymentCard $isdark={$isdark}>
            <PaymentLogo src="/logosorange.png" alt="Orange Money" />
            <div>
              <PaymentNumber>0700247693</PaymentNumber>
              <small>Envoyez via <strong>Orange Money</strong></small>
            </div>
          </PaymentCard>

          <PaymentCard $isdark={$isdark}>
            <PaymentLogo src="/logoswave.jpg" alt="Wave" />
            <div>
              <PaymentNumber>0700247693</PaymentNumber>
              <small>Paiement via <strong>Wave</strong></small>
            </div>
          </PaymentCard>
        </PaymentCards>
      </Box>

      {/* RECAP MODIFIÉ */}
      <Box $isdark={$isdark}>
        <h2>Récapitulatif</h2>
        {commande.panier.map((item) => (
          <Line key={item.produitId}>
            <span>
              {item.nom} x {item.quantite}
            </span>
            <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
          </Line>
        ))}

        <Line>
          <span>Frais de livraison</span>
          <span>{(commande.fraisLivraison || 0).toLocaleString()} FCFA</span>
        </Line>

        <Line>
          <strong>Total</strong>
          <strong>
            {(commande.total ).toLocaleString()} FCFA
          </strong>
        </Line>
      </Box>

      {/* FORM */}
      <Box $isdark={$isdark}>
        <h2>Soumettre le paiement</h2>
        <form onSubmit={handlePaiement}>
          <Input
            $isdark={$isdark}
            placeholder="Numéro de téléphone"
            value={numeroClient}
            onChange={(e) => setNumeroClient(e.target.value)}
          />

          {/* LISTE DES MONTANTS À PAYER */}
          <select
            value={montantEnvoye}
            onChange={(e) => setMontantEnvoye(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
          >
            <option value="">Choisir le montant à payer</option>
            {commande.paiements
              .filter((p) => p.status !== "PAID")
              .map((p) => (
                <option key={p.step} value={p.amountExpected}>
                  Étape {p.step} — {p.amountExpected.toLocaleString()} FCFA
                </option>
              ))}
          </select>

          <Input
            $isdark={$isdark}
            placeholder="Référence"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <select
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              marginBottom: "1rem",
            }}
          >
            {commande.paiements.map((p) => (
              <option
                key={p.step}
                value={p.step}
                disabled={p.status === "PAID"}
              >
                Étape {p.step} {p.status === "PAID" ? "(déjà payée)" : ""}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", marginBottom: "1rem" }}>
            <label>
              <input
                type="radio"
                name="service"
                value="orange"
                checked={service === "orange"}
                onChange={(e) => setService(e.target.value)}
              />
              Orange Money
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name="service"
                value="wave"
                checked={service === "wave"}
                onChange={(e) => setService(e.target.value)}
              />
              Wave
            </label>
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

      {/* TIMELINE */}
      <Box $isdark={$isdark}>
        <h2>Étapes de paiement</h2>
        <ProgressBar>
          <Progress $percent={progressPercent} />
        </ProgressBar>

        <Timeline>
          {commande.paiements.map((p) => (
            <TimelineItem key={p._id}>
              {p.status === "PAID" ? (
                <FaCheckCircle size={18} />
              ) : (
                <FaRegCircle size={18} />
              )}

              <StepInfo>
                <span>Étape {p.step}</span>
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