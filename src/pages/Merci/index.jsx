import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaBox, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

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
  border: 4px solid ${({ $isdark }) => ($isdark ? "#333" : "#f3f3f3")};
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
  background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#f7f7f7")};
  color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
`;

const Box = styled.div`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 12px 30px rgba(0,0,0,0.6)" : "0 6px 18px rgba(0,0,0,0.04)"};
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
  background-color: ${(p) => (p.status === "PAID" ? "#10b981" : "#f59e0b")};
`;

const Coffre = styled.div`
  background: ${({ $isdark }) =>
    $isdark ? "linear-gradient(135deg,#1f2937,#111827)" : "linear-gradient(135deg,#e0e7ff,#c7d2fe)"};
  padding: 1rem 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1rem;
  color: ${({ $isdark }) => ($isdark ? "#e5e7eb" : "#1e3a8a")};
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
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
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};
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
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  const commandeId = location.state?.commandeId;
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [token, setToken] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return navigate("/login");
    setToken(savedToken);
  }, [navigate]);

  useEffect(() => {
    if (!commandeId || !token) return;
    const fetchCommande = async () => {
      try {
        const res = await fetch(`${API_URL}/api/commandes/${commandeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur serveur");
        setCommande(data.commande || data);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer la commande");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCommande();
  }, [commandeId, token, navigate]);

  if (loading)
    return (
      <LoaderWrapper>
        <Loader $isdark={$isdark} />
      </LoaderWrapper>
    );
  if (!commande) return <Page $isdark={$isdark}>Commande introuvable</Page>;

  const paidSteps = commande.paiements.filter((p) => p.status === "PAID").length;
  const totalSteps = commande.paiements.length;
  const totalPaid = commande.paiements
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + (p.amountExpected || 0), 0);

  return (
    <Page $isdark={$isdark}>
      <Title>Merci pour votre commande 🎉</Title>

      {showModal && (
        <Modal>
          <ModalContent $isdark={$isdark}>
            <h2>Paiement en cours de validation</h2>
            <p>Suivez l’avancement de votre coffre dans votre espace compte.</p>
            <CloseModal onClick={() => setShowModal(false)}>Fermer</CloseModal>
          </ModalContent>
        </Modal>
      )}

      <Box $isdark={$isdark}>
        <h3>Récapitulatif de la commande</h3>
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
          <strong>Payé</strong>
          <strong>{totalPaid.toLocaleString()} FCFA</strong>
        </Line>
        <Line>
          <strong>Reste à payer</strong>
          <strong>{(commande.total - totalPaid).toLocaleString()} FCFA</strong>
        </Line>
      </Box>

      <Coffre $isdark={$isdark}>
        <FaBox size={24} />
        <div>
          Votre coffre :{" "}
          <strong>
            {paidSteps}/{totalSteps} étapes payées
          </strong>
        </div>
      </Coffre>

      <Box $isdark={$isdark}>
        <h3>Étapes de paiement</h3>
        {commande.paiements.map((p) => (
          <Line key={p._id}>
            {p.status === "PAID" ? (
              <FaCheckCircle color="#10b981" />
            ) : (
              <FaRegCircle color="#f59e0b" />
            )}
            <span>
              Étape {p.step} - {(p.amountExpected || 0).toLocaleString()} FCFA
            </span>
            <Badge status={p.status}>{p.status}</Badge>
          </Line>
        ))}
      </Box>

      <Button onClick={() => navigate("/compte")}>Accéder à mon coffre</Button>
    </Page>
  );
}