// import { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import styled, { keyframes } from "styled-components";
// import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
// import { PanierContext, ThemeContext } from "../../Utils/Context";

// /* ANIMATION */
// const spin = keyframes`
//   to { transform: rotate(360deg); }
// `;

// /* ===== STYLES GLOBAUX ===== */
// const Page = styled.main`
//   max-width: 900px;
//   margin: 2rem auto;
//   padding: 0 1.2rem;
//   font-family: "Inter", sans-serif;
//   background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#f7f7f7")};
//   color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};
//   min-height: 100vh;
//   transition:
//     background 0.3s ease,
//     color 0.3s ease;
// `;

// const LoaderWrapper = styled.div`
//   min-height: 50vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const Loader = styled.div`
//   width: 40px;
//   height: 40px;
//   border: 4px solid #eee;
//   border-top-color: #4f46e5;
//   border-radius: 50%;
//   animation: ${spin} 1s linear infinite;
// `;

// const Box = styled.div`
//   background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
//   border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
//   border-radius: 16px;
//   padding: 1.8rem;
//   margin-bottom: 1.5rem;
//   box-shadow: ${({ $isdark }) =>
//     $isdark ? "0 12px 30px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.05)"};
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   margin-bottom: 1.2rem;
// `;

// /* PAYMENT CARDS */
// const PaymentCards = styled.div`
//   display: flex;
//   gap: 1rem;
//   flex-wrap: wrap;
// `;

// const PaymentCard = styled.div`
//   flex: 1;
//   min-width: 240px;
//   background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
//   border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
//   border-radius: 18px;
//   padding: 1.4rem;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   box-shadow: ${({ $isdark }) =>
//     $isdark ? "0 12px 30px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.05)"};
//   transition: transform 0.15s ease;

//   &:hover {
//     transform: translateY(-4px);
//   }
// `;

// const PaymentLogo = styled.img`
//   width: 52px;
//   height: 52px;
//   object-fit: contain;
// `;

// const PaymentNumber = styled.div`
//   font-weight: 700;
//   font-size: 1.2rem;
// `;

// const Line = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 0.6rem;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 14px;
//   margin-bottom: 1rem;
//   border-radius: 10px;
//   border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#d1d5db")};
//   background: ${({ $isdark }) => ($isdark ? "#222" : "#fff")};
//   color: inherit;
//   font-size: 1rem;
//   box-sizing: border-box;

//   &:focus {
//     outline: none;
//     border-color: #6366f1;
//     box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   padding: 14px;
//   border-radius: 12px;
//   border: none;
//   background: linear-gradient(135deg, black, #6366f1);
//   color: white;
//   font-weight: 600;
//   cursor: pointer;

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const Badge = styled.span`
//   padding: 4px 10px;
//   border-radius: 12px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   background: ${({ status }) =>
//     status === "PAID"
//       ? "#dcfce7"
//       : status === "PENDING"
//         ? "#fef3c7"
//         : "#fee2e2"};
//   color: ${({ status }) =>
//     status === "PAID"
//       ? "#166534"
//       : status === "PENDING"
//         ? "#92400e"
//         : "#991b1b"};
// `;

// const ProgressBar = styled.div`
//   height: 6px;
//   background: #e5e7eb;
//   border-radius: 3px;
//   margin: 0.6rem 0 1.2rem;
// `;

// const Progress = styled.div`
//   height: 100%;
//   width: ${({ $percent }) => $percent}%;
//   background: linear-gradient(90deg, #4f46e5, #6366f1);
//   border-radius: 3px;
//   transition: width 0.3s ease;
// `;

// const Timeline = styled.ul`
//   list-style: none;
//   padding: 0;
// `;

// const TimelineItem = styled.li`
//   display: flex;
//   align-items: center;
//   margin-bottom: 1.2rem;
// `;

// const StepInfo = styled.div`
//   margin-left: 0.8rem;
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   align-items: center;
// `;

// const StepAmount = styled.span`
//   font-size: 0.9rem;
//   color: #6b7280;
// `;

// /* ===== COMPONENT ===== */
// export default function PaiementSemiManuel() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [commande, setCommande] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [numeroClient, setNumeroClient] = useState("");
//   const [montantEnvoye, setMontantEnvoye] = useState("");
//   const [reference, setReference] = useState("");
//   const [service, setService] = useState("orange");
//   const [step, setStep] = useState(1);
//   const [token, setToken] = useState(null);
//   const [sending, setSending] = useState(false);

//   const { toutSupprimer } = useContext(PanierContext);
//   const { theme } = useContext(ThemeContext);
//   const $isdark = theme === "light";

//   /* TOKEN CHECK */
//   useEffect(() => {
//     const saved = localStorage.getItem("token");
//     if (!saved) {
//       navigate("/login");
//       return;
//     }
//     setToken(saved);
//   }, []);

//   /* FETCH COMMANDE */
//   useEffect(() => {
//     if (!token) return;

//     const fetchCommande = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/commandes/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Erreur serveur");
//         setCommande(data.commande);
//       } catch (err) {
//         console.error(err);
//         alert(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCommande();
//   }, [id, token]);

//   /* PAIEMENT */
//   const handlePaiement = async (e) => {
//     e.preventDefault();
//     if (sending) return;
//     setSending(true);
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (!numeroClient || !montantEnvoye || !reference) {
//       alert("Remplissez tous les champs.");
//       return;
//     }

//     const montant = Number(montantEnvoye);
//     const etape = commande?.paiements.find((p) => p.step === step);
//     if (etape && etape.amountExpected && montant < etape.amountExpected) {
//       alert("Le montant est inférieur à celui attendu pour cette étape.");
//       return;
//     }

//     try {
//       setSending(true);

//       const res = await fetch(`${API_URL}/api/commandes/${id}/paiement-semi`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           step,
//           numeroClient,
//           montantEnvoye: montant,
//           reference,
//           service,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         alert(data.message || "Erreur lors du paiement");
//         return;
//       }

//       toutSupprimer();
//       navigate(`/merci/${id}`);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur serveur");

//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading)
//     return (
//       <LoaderWrapper>
//         <Loader />
//       </LoaderWrapper>
//     );

//   if (!commande) return <Page $isdark={$isdark}>Commande introuvable</Page>;

//   const totalSteps = commande.paiements.length || 1;
//   const paidSteps = commande.paiements.filter(
//     (p) => p.status === "PAID",
//   ).length;
//   const progressPercent = (paidSteps / totalSteps) * 100;

//   return (
//     <Page $isdark={$isdark}>
//       <Title>Paiement Semi-Manuel</Title>

//       {/* NUMEROS + LOGOS */}
//       <Box $isdark={$isdark}>
//         <h2>Envoyer votre paiement</h2>

//         <PaymentCards>
//           <PaymentCard $isdark={$isdark}>
//             <PaymentLogo src="/logosorange.png" alt="Orange Money" />
//             <div>
//               <PaymentNumber>0700247693</PaymentNumber>
//               <small>
//                 Envoyez via <strong>Orange Money</strong>
//               </small>
//             </div>
//           </PaymentCard>

//           <PaymentCard $isdark={$isdark}>
//             <PaymentLogo src="/logoswave.jpg" alt="Wave" />
//             <div>
//               <PaymentNumber>0700247693</PaymentNumber>
//               <small>
//                 Paiement via <strong>Wave</strong>
//               </small>
//             </div>
//           </PaymentCard>
//         </PaymentCards>
//       </Box>

//       {/* RECAP MODIFIÉ */}
//       <Box $isdark={$isdark}>
//         <h2>Récapitulatif</h2>
//         {commande.panier.map((item) => (
//           <Line key={item.produitId}>
//             <span>
//               {item.nom} x {item.quantite}
//             </span>
//             <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
//           </Line>
//         ))}

       

//         <Line>
//           <strong>Total</strong>
//           <strong>{commande.total.toLocaleString()} FCFA</strong>
//         </Line>
//       </Box>

//       {/* FORM */}
//       <Box $isdark={$isdark}>
//         <h2>Soumettre le paiement</h2>
//         <form onSubmit={handlePaiement}>
//           <Input
//             $isdark={$isdark}
//             placeholder="Numéro de téléphone"
//             value={numeroClient}
//             onChange={(e) => setNumeroClient(e.target.value)}
//           />

//           {/* LISTE DES MONTANTS À PAYER */}
//           <select
//             value={montantEnvoye}
//             onChange={(e) => setMontantEnvoye(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "14px",
//               borderRadius: "10px",
//               border: "1px solid #d1d5db",
//               marginBottom: "1rem",
//             }}
//           >
//             <option value="">Choisir le montant à payer</option>
//             {commande.paiements
//               .filter((p) => p.status !== "PAID")
//               .map((p) => (
//                 <option key={p.step} value={p.amountExpected}>
//                   Étape {p.step} — {p.amountExpected.toLocaleString()} FCFA
//                 </option>
//               ))}
//           </select>

//           <Input
//             $isdark={$isdark}
//             placeholder="Référence"
//             value={reference}
//             onChange={(e) => setReference(e.target.value)}
//           />

//           <select
//             value={step}
//             onChange={(e) => setStep(Number(e.target.value))}
//             style={{
//               width: "100%",
//               padding: "14px",
//               borderRadius: "10px",
//               border: "1px solid #d1d5db",
//               marginBottom: "1rem",
//             }}
//           >
//             {commande.paiements.map((p) => (
//               <option
//                 key={p.step}
//                 value={p.step}
//                 disabled={p.status === "PAID"}
//               >
//                 Étape {p.step} {p.status === "PAID" ? "(déjà payée)" : ""}
//               </option>
//             ))}
//           </select>

//           <div style={{ display: "flex", marginBottom: "1rem" }}>
//             <label>
//               <input
//                 type="radio"
//                 name="service"
//                 value="orange"
//                 checked={service === "orange"}
//                 onChange={(e) => setService(e.target.value)}
//               />
//               Orange Money
//             </label>
//             <label style={{ marginLeft: "1rem" }}>
//               <input
//                 type="radio"
//                 name="service"
//                 value="wave"
//                 checked={service === "wave"}
//                 onChange={(e) => setService(e.target.value)}
//               />
//               Wave
//             </label>
//           </div>

//           <Button
//             type="submit"
//             disabled={
//               commande.paiements.find((p) => p.step === step)?.status === "PAID"
//             }
//           >
//             {sending ? "Envoi..." : "Soumettre le paiement"}
//           </Button>
//         </form>
//       </Box>

//       {/* TIMELINE */}
//       <Box $isdark={$isdark}>
//         <h2>Étapes de paiement</h2>
//         <ProgressBar>
//           <Progress $percent={progressPercent} />
//         </ProgressBar>

//         <Timeline>
//           {commande.paiements.map((p) => (
//             <TimelineItem key={p._id}>
//               {p.status === "PAID" ? (
//                 <FaCheckCircle size={18} />
//               ) : (
//                 <FaRegCircle size={18} />
//               )}

//               <StepInfo>
//                 <span>Étape {p.step}</span>
//                 <StepAmount>
//                   {(p.amountExpected || 0).toLocaleString()} FCFA
//                 </StepAmount>
//                 <Badge status={p.status}>{p.status}</Badge>
//               </StepInfo>
//             </TimelineItem>
//           ))}
//         </Timeline>
//       </Box>
//     </Page>
//   );
// }


import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";

import {
  PanierContext,
  ThemeContext,
} from "../../Utils/Context";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCopy,
  FiCreditCard,
  FiLock,
  FiShield,
  FiSmartphone,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

/* ==========================
   ANIMATIONS
========================== */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(185,154,103,0.15);
  }
  50% {
    box-shadow: 0 0 0 9px rgba(185,154,103,0);
  }
`;

/* ==========================
   PAGE
========================== */

const Page = styled.main`
  min-height: 100vh;
  padding: 145px 22px 75px;
  background: ${({ $isdark }) =>
    $isdark ? "#101010" : "#f7f5f1"};
  color: ${({ $isdark }) =>
    $isdark ? "#f5f1e9" : "#24221f"};
  font-family: "Inter", system-ui, sans-serif;
  transition: background 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 115px 14px 45px;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
  animation: ${fadeUp} 0.7s ease both;
`;

/* ==========================
   LOADING
========================== */

const LoaderWrapper = styled.div`
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #b99a67;

  p {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
`;

const Loader = styled.div`
  width: 42px;
  height: 42px;
  border: 2px solid rgba(185,154,103,0.2);
  border-top-color: #b99a67;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

/* ==========================
   INTRO
========================== */

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 30px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ $isdark }) => $isdark ? "#aaa" : "#888"};
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: #b99a67;
  }
`;

const Intro = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #b99a67;
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 15px;

  &::before,
  &::after {
    content: "";
    width: 32px;
    height: 1px;
    background: #b99a67;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-family: "Times New Roman", serif;
  font-size: clamp(35px, 5vw, 55px);
  font-weight: 400;

  span {
    color: #b99a67;
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  max-width: 550px;
  margin: 14px auto 0;
  color: ${({ $isdark }) => $isdark ? "#999" : "#888"};
  font-size: 12px;
  line-height: 1.8;
`;

/* ==========================
   STATUS
========================== */

const StatusBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 20px;
  margin-bottom: 25px;
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#49402f" : "#e7d9c0"};
  background: ${({ $isdark }) =>
    $isdark ? "#211e18" : "#fbf7ef"};

  svg {
    flex-shrink: 0;
    color: #b99a67;
    font-size: 23px;
  }

  strong {
    display: block;
    margin-bottom: 5px;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    color: ${({ $isdark }) => $isdark ? "#aaa" : "#888"};
    font-size: 10px;
    line-height: 1.6;
  }
`;

/* ==========================
   GENERAL LAYOUT
========================== */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.85fr;
  gap: 23px;
  align-items: start;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Box = styled.section`
  padding: 28px;
  background: ${({ $isdark }) =>
    $isdark ? "#191919" : "#fff"};
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#303030" : "#ebe7df"};
  box-shadow: ${({ $isdark }) =>
    $isdark ? "none" : "0 12px 40px rgba(30,25,15,0.035)"};

  @media (max-width: 550px) {
    padding: 21px 16px;
  }
`;

const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 20px;
  margin-bottom: 22px;
  border-bottom: 1px solid ${({ $isdark }) =>
    $isdark ? "#333" : "#eee9e1"};
`;

const BoxIcon = styled.div`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #b99a67;
  background: ${({ $isdark }) =>
    $isdark ? "#29251f" : "#f5f0e7"};
  font-size: 18px;
`;

const BoxHeading = styled.div`
  h2 {
    margin: 0 0 5px;
    font-family: "Times New Roman", serif;
    font-size: 23px;
    font-weight: 400;
  }

  p {
    margin: 0;
    font-size: 10px;
    color: ${({ $isdark }) => $isdark ? "#999" : "#999"};
  }
`;

/* ==========================
   PAYMENT NUMBERS
========================== */

const PaymentCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentCard = styled.div`
  padding: 20px 16px;
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#353535" : "#eae5dc"};
  background: ${({ $isdark }) =>
    $isdark ? "#202020" : "#fdfcf9"};
  transition: border 0.3s ease, transform 0.3s ease;

  &:hover {
    border-color: #b99a67;
    transform: translateY(-3px);
  }
`;

const ProviderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const PaymentLogo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 50%;
`;

const ProviderLabel = styled.span`
  color: #b99a67;
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const PaymentNumber = styled.div`
  font-family: "Times New Roman", serif;
  font-size: clamp(20px, 3vw, 25px);
  letter-spacing: 1px;
  margin-bottom: 7px;
`;

const ProviderDescription = styled.p`
  margin: 0;
  color: ${({ $isdark }) => $isdark ? "#999" : "#888"};
  font-size: 10px;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 17px;
  padding: 9px 12px;
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#444" : "#e6dfd3"};
  background: transparent;
  color: #b99a67;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    border-color: #b99a67;
  }
`;

/* ==========================
   SUMMARY
========================== */

const ProductLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 0;
  border-bottom: 1px solid ${({ $isdark }) =>
    $isdark ? "#303030" : "#f0ece5"};

  &:last-child {
    border-bottom: none;
  }

  .name {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .detail {
    font-size: 10px;
    color: ${({ $isdark }) => $isdark ? "#999" : "#888"};
  }

  .price {
    white-space: nowrap;
    font-size: 12px;
    font-weight: 600;
  }
`;

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  margin-top: 10px;
  border-top: 1px solid ${({ $isdark }) =>
    $isdark ? "#444" : "#ddd"};

  span {
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  strong {
    color: #b99a67;
    font-family: "Times New Roman", serif;
    font-size: 25px;
    font-weight: 400;
  }
`;

/* ==========================
   FORM
========================== */

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 9px;
  color: ${({ $isdark }) => $isdark ? "#c8c0b3" : "#777"};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 15px 16px;
  margin-bottom: 19px;
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#393939" : "#e8e3db"};
  border-radius: 0;
  outline: none;
  background: ${({ $isdark }) =>
    $isdark ? "#222" : "#fbfaf8"};
  color: inherit;
  font-size: 16px;
  transition: border 0.25s ease;

  &:focus {
    border-color: #b99a67;
  }

  &::placeholder {
    color: ${({ $isdark }) => $isdark ? "#777" : "#aaa"};
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 15px 16px;
  margin-bottom: 19px;
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#393939" : "#e8e3db"};
  border-radius: 0;
  outline: none;
  background: ${({ $isdark }) =>
    $isdark ? "#222" : "#fbfaf8"};
  color: inherit;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    border-color: #b99a67;
  }
`;

/* ==========================
   BUTTON
========================== */

const Button = styled.button`
  width: 100%;
  min-height: 55px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid #b99a67;
  background: #b99a67;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover:not(:disabled) {
    background: #96794d;
    border-color: #96794d;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ==========================
   BADGES
========================== */

const Badge = styled.span`
  padding: 6px 10px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;

  background: ${({ status }) =>
    status === "PAID"
      ? "#e1efe5"
      : status === "PENDING"
        ? "#f6edda"
        : "#f5e3e0"};

  color: ${({ status }) =>
    status === "PAID"
      ? "#28613c"
      : status === "PENDING"
        ? "#8b6727"
        : "#963d32"};
`;

/* ==========================
   TIMELINE
========================== */

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    font-family: "Times New Roman", serif;
    font-size: 23px;
    font-weight: 400;
  }

  span {
    color: #b99a67;
    font-size: 10px;
    letter-spacing: 1px;
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  background: ${({ $isdark }) =>
    $isdark ? "#383838" : "#e9e5dd"};
  margin-bottom: 30px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: linear-gradient(90deg, #96794d, #d8c29a);
  transition: width 0.5s ease;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineItem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding-bottom: 25px;

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 34px;
    left: 16px;
    width: 1px;
    height: calc(100% - 34px);
    background: ${({ $isdark }) =>
      $isdark ? "#444" : "#e5dfd4"};
  }
`;

const TimelineIcon = styled.div`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ $paid, $isdark }) =>
    $paid ? "#b99a67" : $isdark ? "#292929" : "#f3f0ea"};
  color: ${({ $paid }) => $paid ? "#fff" : "#b99a67"};
  font-size: 14px;
  animation: ${({ $active }) =>
    $active ? pulse : "none"} 2s infinite;
`;

const StepInfo = styled.div`
  flex: 1;
  min-width: 0;
  padding-top: 2px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .title strong {
    font-size: 12px;
    font-weight: 600;
  }

  .amount {
    font-family: "Times New Roman", serif;
    font-size: 19px;
    color: #b99a67;
  }

  .description {
    font-size: 10px;
    color: ${({ $isdark }) => $isdark ? "#999" : "#888"};
  }
`;

/* ==========================
   TRUST
========================== */

const Trust = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid ${({ $isdark }) =>
    $isdark ? "#333" : "#eee9e1"};

  div {
    display: flex;
    align-items: center;
    gap: 7px;
    color: ${({ $isdark }) => $isdark ? "#999" : "#888"};
    font-size: 9px;
  }

  svg {
    color: #b99a67;
  }
`;

/* ==========================
   ERROR
========================== */

const ErrorBox = styled.div`
  max-width: 600px;
  margin: 60px auto;
  padding: 50px 25px;
  text-align: center;
  background: ${({ $isdark }) =>
    $isdark ? "#191919" : "#fff"};
  border: 1px solid ${({ $isdark }) =>
    $isdark ? "#333" : "#ebe7df"};

  svg {
    color: #b99a67;
    font-size: 35px;
    margin-bottom: 15px;
  }

  h2 {
    font-family: "Times New Roman", serif;
    font-size: 29px;
    font-weight: 400;
  }

  p {
    font-size: 12px;
    color: ${({ $isdark }) => $isdark ? "#999" : "#888"};
  }
`;

/* ==========================
   COMPONENT
========================== */

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
  const [sending, setSending] = useState(false);

  const [copied, setCopied] = useState("");

  const { toutSupprimer } = useContext(PanierContext);
  const { theme } = useContext(ThemeContext);

  const $isdark = theme === "light";

  /* ==========================
     TOKEN
  ========================== */

  useEffect(() => {
    const saved = localStorage.getItem("token");

    if (!saved) {
      navigate("/login");
      return;
    }

    setToken(saved);
  }, [navigate]);

  /* ==========================
     FETCH COMMANDE
  ========================== */

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchCommande = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/commandes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur serveur");
        }

        if (!cancelled) {
          setCommande(data.commande);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          alert(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCommande();

    return () => {
      cancelled = true;
    };
  }, [id, token, API_URL]);

  /* ==========================
     CURRENT PAYMENT STEP
  ========================== */

  const paiements = commande?.paiements || [];

  const etapeSelectionnee = paiements.find(
    (p) => Number(p.step) === Number(step)
  );

  useEffect(() => {
    if (!etapeSelectionnee) {
      setMontantEnvoye("");
      return;
    }

    setMontantEnvoye(
      etapeSelectionnee.status === "PAID"
        ? ""
        : String(etapeSelectionnee.amountExpected ?? "")
    );
  }, [
    step,
    etapeSelectionnee?.amountExpected,
    etapeSelectionnee?.status,
  ]);

  /* ==========================
     COPY NUMBER
  ========================== */

  const handleCopy = async (numero, provider) => {
    try {
      await navigator.clipboard.writeText(numero);
      setCopied(provider);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (err) {
      console.error("Copie impossible :", err);
      alert("Impossible de copier le numéro.");
    }
  };

  /* ==========================
     PAYMENT
  ========================== */

  const handlePaiement = async (e) => {
    e.preventDefault();

    if (sending) return;

    if (!token) {
      navigate("/login");
      return;
    }

    if (!numeroClient.trim() || !montantEnvoye || !reference.trim()) {
      alert("Remplissez tous les champs.");
      return;
    }

    const montant = Number(montantEnvoye);

    if (!Number.isFinite(montant) || montant <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }

    const etape = paiements.find(
      (p) => Number(p.step) === Number(step)
    );

    if (!etape) {
      alert("Cette étape de paiement est introuvable.");
      return;
    }

    if (etape.status === "PAID") {
      alert("Cette étape a déjà été payée.");
      return;
    }

    if (
      etape.amountExpected != null &&
      montant < Number(etape.amountExpected)
    ) {
      alert("Le montant est inférieur à celui attendu pour cette étape.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(
        `${API_URL}/api/commandes/${id}/paiement-semi`,
        {
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
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors du paiement.");
        return;
      }

      toutSupprimer();
      navigate(`/merci/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  /* ==========================
     LOADING / ERROR
  ========================== */

  if (loading) {
    return (
      <Page $isdark={$isdark}>
        <LoaderWrapper>
          <Loader />
          <p>Préparation de votre paiement</p>
        </LoaderWrapper>
      </Page>
    );
  }

  if (!commande) {
    return (
      <Page $isdark={$isdark}>
        <Container>
          <ErrorBox $isdark={$isdark}>
            <FiAlertCircle />
            <h2>Commande introuvable</h2>
            <p>Nous ne pouvons pas retrouver cette commande.</p>
            <Button onClick={() => navigate("/panier")}>
              Retour au panier
            </Button>
          </ErrorBox>
        </Container>
      </Page>
    );
  }

  /* ==========================
     CALCULS
  ========================== */

  const totalSteps = paiements.length || 1;

  const paidSteps = paiements.filter(
    (p) => p.status === "PAID"
  ).length;

  const progressPercent = (paidSteps / totalSteps) * 100;

  const totalCommande = Number(commande.total) || 0;

  const tousPayes =
    paiements.length > 0 && paidSteps === paiements.length;

  return (
    <Page $isdark={$isdark}>
      <Container>
        <BackButton
          type="button"
          $isdark={$isdark}
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Retour à la boutique
        </BackButton>

        <Intro>
          <Eyebrow>NUMA PRIVILEGE</Eyebrow>
          <Title>
            Votre paiement <span>en toute sérénité.</span>
          </Title>
          <Subtitle $isdark={$isdark}>
            Effectuez votre transfert, puis renseignez les informations
            nécessaires pour confirmer votre paiement.
          </Subtitle>
        </Intro>

        {!tousPayes && (
          <StatusBanner $isdark={$isdark}>
            <FiClock />
            <div>
              <strong>Votre paiement est en attente de confirmation</strong>
              <p>
                Effectuez le transfert vers l'un des numéros ci-dessous,
                puis soumettez votre référence de transaction.
              </p>
            </div>
          </StatusBanner>
        )}

        {tousPayes && (
          <StatusBanner $isdark={$isdark}>
            <FiCheckCircle />
            <div>
              <strong>Toutes les étapes sont payées</strong>
              <p>Votre échéancier de paiement est entièrement réglé.</p>
            </div>
          </StatusBanner>
        )}

        <Grid>
          <MainColumn>
            {/* NUMEROS DE PAIEMENT */}

            <Box $isdark={$isdark}>
              <BoxHeader $isdark={$isdark}>
                <BoxIcon $isdark={$isdark}>
                  <FiSmartphone />
                </BoxIcon>

                <BoxHeading $isdark={$isdark}>
                  <h2>Effectuer le transfert</h2>
                  <p>Choisissez votre service de paiement mobile.</p>
                </BoxHeading>
              </BoxHeader>

              <PaymentCards>
                <PaymentCard $isdark={$isdark}>
                  <ProviderTop>
                    <PaymentLogo
                      src="/logosorange.png"
                      alt="Orange Money"
                    />
                    <ProviderLabel>Orange Money</ProviderLabel>
                  </ProviderTop>

                  <PaymentNumber>0700247693</PaymentNumber>
                  <ProviderDescription>
                    Numéro destinataire Orange Money
                  </ProviderDescription>

                  <CopyButton
                    type="button"
                    $isdark={$isdark}
                    onClick={() =>
                      handleCopy("0700247693", "orange")
                    }
                  >
                    {copied === "orange" ? <FiCheck /> : <FiCopy />}
                    {copied === "orange" ? "Copié" : "Copier le numéro"}
                  </CopyButton>
                </PaymentCard>

                <PaymentCard $isdark={$isdark}>
                  <ProviderTop>
                    <PaymentLogo
                      src="/logoswave.jpg"
                      alt="Wave"
                    />
                    <ProviderLabel>Wave</ProviderLabel>
                  </ProviderTop>

                  <PaymentNumber>0700247693</PaymentNumber>
                  <ProviderDescription>
                    Numéro destinataire Wave
                  </ProviderDescription>

                  <CopyButton
                    type="button"
                    $isdark={$isdark}
                    onClick={() =>
                      handleCopy("0700247693", "wave")
                    }
                  >
                    {copied === "wave" ? <FiCheck /> : <FiCopy />}
                    {copied === "wave" ? "Copié" : "Copier le numéro"}
                  </CopyButton>
                </PaymentCard>
              </PaymentCards>
            </Box>

            {/* FORMULAIRE */}

            {!tousPayes && (
              <Box $isdark={$isdark}>
                <BoxHeader $isdark={$isdark}>
                  <BoxIcon $isdark={$isdark}>
                    <FiCreditCard />
                  </BoxIcon>

                  <BoxHeading $isdark={$isdark}>
                    <h2>Confirmer votre transfert</h2>
                    <p>Renseignez les détails de votre transaction.</p>
                  </BoxHeading>
                </BoxHeader>

                <form onSubmit={handlePaiement}>
                  <FieldLabel $isdark={$isdark}>
                    Étape de paiement
                  </FieldLabel>

                  <Select
                    $isdark={$isdark}
                    value={step}
                    onChange={(e) => setStep(Number(e.target.value))}
                    required
                  >
                    {paiements.map((p) => (
                      <option
                        key={p._id || p.step}
                        value={p.step}
                        disabled={p.status === "PAID"}
                      >
                        Étape {p.step}
                        {p.status === "PAID" ? " — Déjà payée" : ""}
                      </option>
                    ))}
                  </Select>

                  <FieldLabel $isdark={$isdark}>
                    Numéro utilisé pour le transfert
                  </FieldLabel>

                  <Input
                    $isdark={$isdark}
                    type="tel"
                    placeholder="+225XXXXXXXX"
                    value={numeroClient}
                    onChange={(e) =>
                      setNumeroClient(e.target.value)
                    }
                    required
                  />

                  <FieldLabel $isdark={$isdark}>
                    Montant envoyé (FCFA)
                  </FieldLabel>

                  <Input
                    $isdark={$isdark}
                    type="number"
                    min="1"
                    placeholder="Montant transféré"
                    value={montantEnvoye}
                    onChange={(e) =>
                      setMontantEnvoye(e.target.value)
                    }
                    required
                  />

                  {etapeSelectionnee && (
                    <p style={{
                      marginTop: -10,
                      marginBottom: 20,
                      fontSize: 10,
                      color: "#b99a67",
                    }}>
                      Montant attendu :{" "}
                      {Number(
                        etapeSelectionnee.amountExpected || 0
                      ).toLocaleString("fr-FR")} FCFA
                    </p>
                  )}

                  <FieldLabel $isdark={$isdark}>
                    Référence de transaction
                  </FieldLabel>

                  <Input
                    $isdark={$isdark}
                    type="text"
                    placeholder="Ex : référence du reçu de paiement"
                    value={reference}
                    onChange={(e) =>
                      setReference(e.target.value)
                    }
                    required
                  />

                  <FieldLabel $isdark={$isdark}>
                    Service utilisé
                  </FieldLabel>

                  <Select
                    $isdark={$isdark}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option value="orange">Orange Money</option>
                    <option value="wave">Wave</option>
                  </Select>

                  <Button
                    type="submit"
                    disabled={sending || !etapeSelectionnee ||
                      etapeSelectionnee.status === "PAID"}
                  >
                    {sending
                      ? "Envoi en cours..."
                      : "Soumettre mon paiement"}
                    {!sending && <FiArrowRight />}
                  </Button>
                </form>
              </Box>
            )}

            {/* SUIVI DES ECHEANCES */}

            <Box $isdark={$isdark}>
              <TimelineHeader>
                <h2>Suivi de vos paiements</h2>
                <span>
                  {paidSteps}/{totalSteps} RÉGLÉ(S)
                </span>
              </TimelineHeader>

              <ProgressBar $isdark={$isdark}>
                <Progress $percent={progressPercent} />
              </ProgressBar>

              <Timeline>
                {paiements.map((p) => {
                  const paid = p.status === "PAID";
                  const active =
                    !paid &&
                    Number(p.step) === Number(step);

                  return (
                    <TimelineItem
                      key={p._id || p.step}
                      $isdark={$isdark}
                    >
                      <TimelineIcon
                        $paid={paid}
                        $active={active}
                        $isdark={$isdark}
                      >
                        {paid ? (
                          <FiCheck />
                        ) : (
                          <FaRegCircle />
                        )}
                      </TimelineIcon>

                      <StepInfo $isdark={$isdark}>
                        <div className="title">
                          <strong>Étape {p.step}</strong>

                          <Badge status={p.status}>
                            {paid
                              ? "Payé"
                              : p.status === "PENDING"
                                ? "En attente"
                                : p.status}
                          </Badge>
                        </div>

                        <div className="amount">
                          {Number(
                            p.amountExpected || 0
                          ).toLocaleString("fr-FR")} FCFA
                        </div>

                        <div className="description">
                          {paid
                            ? "Cette échéance a été réglée."
                            : active
                              ? "Étape actuellement sélectionnée."
                              : "En attente de votre transfert."}
                        </div>
                      </StepInfo>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </Box>
          </MainColumn>

          {/* RECAPITULATIF */}

          <Box $isdark={$isdark}>
            <BoxHeader $isdark={$isdark}>
              <BoxIcon $isdark={$isdark}>
                <FiCreditCard />
              </BoxIcon>

              <BoxHeading $isdark={$isdark}>
                <h2>Votre commande</h2>
                <p>Récapitulatif de votre achat.</p>
              </BoxHeading>
            </BoxHeader>

            {commande.panier?.map((item, index) => (
              <ProductLine
                key={item._id || item.produitId || index}
                $isdark={$isdark}
              >
                <div>
                  <div className="name">{item.nom}</div>
                  <div className="detail">
                    Quantité : {item.quantite}
                  </div>
                </div>

                <div className="price">
                  {(
                    Number(item.prix || 0) *
                    Number(item.quantite || 0)
                  ).toLocaleString("fr-FR")} FCFA
                </div>
              </ProductLine>
            ))}

            <TotalLine $isdark={$isdark}>
              <span>Total commande</span>
              <strong>
                {totalCommande.toLocaleString("fr-FR")} FCFA
              </strong>
            </TotalLine>

            <Trust $isdark={$isdark}>
              <div>
                <FiLock />
                Informations protégées
              </div>
              <div>
                <FiShield />
                Paiement suivi par NUMA
              </div>
              <div>
                <FiCheckCircle />
                Confirmation après vérification
              </div>
            </Trust>
          </Box>
        </Grid>
      </Container>
    </Page>
  );
}
