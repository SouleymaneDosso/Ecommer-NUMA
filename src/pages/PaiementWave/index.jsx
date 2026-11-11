import { useContext, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import * as Context from "../../Utils/Context";
import { ThemeContext } from "../../Utils/Context";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiLock,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiPhone,
  FiHome,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

/* ==========================
   ANIMATIONS
========================== */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* ==========================
   PAGE
========================== */

const Page = styled.main`
  --gold: #b99a67;
  --gold-light: #d8c29a;

  min-height: 100vh;
  padding: 145px 24px 70px;
  background: ${({ $isdark }) => ($isdark ? "#101010" : "#f7f5f1")};
  color: ${({ $isdark }) => ($isdark ? "#f5f1e9" : "#24221f")};
  font-family: "Inter", system-ui, sans-serif;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 115px 15px 45px;
  }
`;

const Container = styled.div`
  max-width: 1180px;
  margin: auto;
  animation: ${fadeUp} 0.7s ease both;
`;

/* ==========================
   TOP INTRO
========================== */

const Intro = styled.div`
  text-align: center;
  margin-bottom: 45px;
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
    width: 35px;
    height: 1px;
    background: #b99a67;
  }
`;

const Title = styled.h1`
  font-family: "Times New Roman", serif;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 400;
  letter-spacing: 1px;
  margin: 0 0 12px;

  span {
    color: #b99a67;
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};
  letter-spacing: 0.5px;
  line-height: 1.8;
`;

/* ==========================
   PROGRESS
========================== */

const Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin: 35px auto 45px;

  @media (max-width: 500px) {
    gap: 9px;
  }
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  color: ${({ $active, $isdark }) =>
    $active ? "#b99a67" : $isdark ? "#777" : "#aaa"};
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  span:first-child {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    border: 1px solid ${({ $active }) => ($active ? "#b99a67" : "#888")};
    background: ${({ $active }) => ($active ? "#b99a67" : "transparent")};
    color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  }

  @media (max-width: 500px) {
    font-size: 8px;
    letter-spacing: 0.5px;
    gap: 5px;
  }
`;

const ProgressLine = styled.div`
  width: 65px;
  height: 1px;
  background: ${({ $isdark }) => ($isdark ? "#444" : "#ddd")};

  @media (max-width: 500px) {
    width: 20px;
  }
`;

/* ==========================
   GRID
========================== */

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.85fr);
  align-items: start;
  gap: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Section = styled.section`
  background: ${({ $isdark }) => ($isdark ? "#191919" : "#fff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#303030" : "#ebe7df")};
  padding: 30px;
  border-radius: 3px;
  box-shadow: ${({ $isdark }) =>
    $isdark ? "none" : "0 12px 40px rgba(30,25,15,0.035)"};

  @media (max-width: 600px) {
    padding: 22px 17px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#eee9e1")};
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: ${({ $isdark }) => ($isdark ? "#29251f" : "#f5f0e7")};
  color: #b99a67;
  font-size: 17px;
`;

const SectionHeading = styled.div`
  h2 {
    font-family: "Times New Roman", serif;
    font-size: 23px;
    font-weight: 400;
    margin: 0 0 5px;
  }

  p {
    font-size: 11px;
    color: ${({ $isdark }) => ($isdark ? "#999" : "#999")};
    margin: 0;
    letter-spacing: 0.3px;
  }
`;

/* ==========================
   FORM
========================== */

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;

  ${({ $full }) => $full && "grid-column: 1 / -1;"}

  label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: ${({ $isdark }) => ($isdark ? "#c8c0b3" : "#777")};
  }
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 15px 16px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#393939" : "#e8e3db")};
  border-radius: 2px;
  outline: none;
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fbfaf8")};
  color: inherit;
  font-size: 16px;
  transition:
    border 0.25s ease,
    background 0.25s ease;

  &:focus {
    border-color: #b99a67;
    background: ${({ $isdark }) => ($isdark ? "#282828" : "#fff")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ $isdark }) => ($isdark ? "#777" : "#aaa")};
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 15px 16px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#393939" : "#e8e3db")};
  border-radius: 2px;
  outline: none;
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fbfaf8")};
  color: inherit;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    border-color: #b99a67;
  }
`;

/* ==========================
   PAYMENT CARDS
========================== */

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentCard = styled.label`
  position: relative;
  min-height: 90px;
  padding: 17px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid ${({ $active }) => ($active ? "#b99a67" : "var(--border)")};
  background: ${({ $active, $isdark }) =>
    $active ? ($isdark ? "#29241c" : "#fbf7ef") : $isdark ? "#202020" : "#fff"};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: all 0.25s ease;

  &:hover {
    border-color: ${({ $disabled }) =>
      $disabled ? "var(--border)" : "#b99a67"};
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`;

const RadioMark = styled.span`
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  margin-top: 2px;
  border: 1px solid ${({ $active }) => ($active ? "#b99a67" : "#aaa")};
  border-radius: 50%;
  display: grid;
  place-items: center;

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? "#b99a67" : "transparent")};
  }
`;

const PaymentText = styled.div`
  flex: 1;

  strong {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }

  small {
    display: block;
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#888")};
    font-size: 10px;
    line-height: 1.5;
  }
`;

const PaymentBadge = styled.span`
  position: absolute;
  right: 10px;
  top: -9px;
  padding: 5px 8px;
  background: #b99a67;
  color: #fff;
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

/* ==========================
   PAYMENT PROVIDERS
========================== */

const ProviderCard = styled.label`
  min-height: 65px;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ $active }) => ($active ? "#b99a67" : "var(--border)")};
  background: ${({ $active, $isdark }) =>
    $active ? ($isdark ? "#29241c" : "#fbf7ef") : "transparent"};
  cursor: pointer;
  transition: 0.25s ease;

  input {
    position: absolute;
    opacity: 0;
  }

  strong {
    font-size: 12px;
    font-weight: 600;
  }

  &:hover {
    border-color: #b99a67;
  }
`;

const ProviderLogo = styled.span`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: ${({ $wave }) => ($wave ? "#e4f3ff" : "#fff0e6")};
  color: ${({ $wave }) => ($wave ? "#1688d4" : "#ed6c19")};
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
`;

/* ==========================
   INSTALLMENT INFO
========================== */

const InstallmentInfo = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#49402f" : "#e7d9c0")};
  background: ${({ $isdark }) => ($isdark ? "#242019" : "#fbf7ef")};
  animation: ${fadeUp} 0.35s ease both;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 18px;
  }

  .top strong {
    color: #b99a67;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .top span {
    font-size: 10px;
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#888")};
  }

  .amount {
    font-family: "Times New Roman", serif;
    font-size: 30px;
    color: #b99a67;
  }

  .details {
    margin-top: 5px;
    font-size: 10px;
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#888")};
  }
`;

/* ==========================
   SUMMARY
========================== */

const Summary = styled.aside`
  position: sticky;
  top: 120px;
  background: ${({ $isdark }) => ($isdark ? "#191919" : "#fff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#303030" : "#ebe7df")};
  padding: 28px;
  box-shadow: ${({ $isdark }) =>
    $isdark ? "none" : "0 12px 40px rgba(30,25,15,0.035)"};

  @media (max-width: 900px) {
    position: static;
  }

  @media (max-width: 550px) {
    padding: 22px 17px;
  }
`;

const SummaryTitle = styled.h2`
  font-family: "Times New Roman", serif;
  font-size: 25px;
  font-weight: 400;
  margin: 0 0 8px;
`;

const SummarySubtitle = styled.p`
  color: ${({ $isdark }) => ($isdark ? "#999" : "#999")};
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 25px;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding-bottom: 22px;
  border-bottom: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#eee9e1")};
`;

const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;

  .name {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .detail {
    color: ${({ $isdark }) => ($isdark ? "#999" : "#888")};
    font-size: 10px;
    line-height: 1.6;
  }

  .price {
    white-space: nowrap;
    font-size: 12px;
    font-weight: 600;
  }
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  font-size: 11px;

  span:first-child {
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};
  }

  strong {
    font-weight: 600;
  }
`;

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  margin-top: 7px;
  border-top: 1px solid ${({ $isdark }) => ($isdark ? "#444" : "#ddd")};

  span {
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  strong {
    font-family: "Times New Roman", serif;
    font-size: 26px;
    color: #b99a67;
    font-weight: 400;
    text-align: right;
  }
`;

/* ==========================
   BUTTON
========================== */

const Button = styled.button`
  width: 100%;
  min-height: 56px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border: 1px solid #b99a67;
  background: ${({ disabled }) => (disabled ? "#777" : "#b99a67")};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #96794d;
    border-color: #96794d;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  border: none;
  background: transparent;
  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  margin: 0 auto 25px 0;
  padding: 0;

  &:hover {
    color: #b99a67;
  }
`;

const Trust = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#eee9e1")};

  div {
    display: flex;
    align-items: center;
    gap: 11px;
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#777")};
    font-size: 10px;
  }

  svg {
    color: #b99a67;
    font-size: 15px;
  }
`;

const EmptyState = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 60px 25px;
  text-align: center;
  background: ${({ $isdark }) => ($isdark ? "#191919" : "#fff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#ebe7df")};

  svg {
    font-size: 35px;
    color: #b99a67;
    margin-bottom: 20px;
  }

  h2 {
    font-family: "Times New Roman", serif;
    font-size: 30px;
    font-weight: 400;
  }

  p {
    color: ${({ $isdark }) => ($isdark ? "#aaa" : "#888")};
    font-size: 12px;
    margin-bottom: 25px;
  }
`;

const EmptyButton = styled.button`
  padding: 15px 25px;
  border: 1px solid #b99a67;
  background: #b99a67;
  color: white;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
`;

/* ==========================
   VILLES
========================== */

const villesCI = [
  "Abidjan",
  "Bouaké",
  "Daloa",
  "Yamoussoukro",
  "San-Pédro",
  "Korhogo",
  "Man",
  "Gagnoa",
  "Abengourou",
  "Bondoukou",
  "Soubré",
  "Divo",
  "Anyama",
  "Bingerville",
  "Grand-Bassam",
  "Issia",
  "Tiassalé",
  "Oumé",
  "Toumodi",
  "Dimbokro",
  "Sinfra",
  "Adzopé",
  "Ferkessédougou",
  "Séguéla",
  "Guiglo",
  "Danané",
];

/* ==========================
   COMPONENT
========================== */

export default function PageCheckout() {
  const { ajouter, fraisLivraison, total, toutSupprimer } = useContext(
    Context.PanierContext,
  );

  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";

  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [numero, setNumero] = useState("");

  const codePostal = "00225";
  const pays = "Côte d'Ivoire";

  const [modePaiement, setModePaiement] = useState("full");
  const [servicePaiement, setServicePaiement] = useState("orange");

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      navigate("/login");
      return;
    }

    setToken(savedToken);
  }, [navigate]);

  const peutTroisFois = total >= 3000;
  const montantParMois =
    modePaiement === "installments" ? Math.ceil(total / 3) : total;

  const montantLivraison = Number(fraisLivraison) || 0;
  const montantTotal = Number(total) || 0;

  const handlePaiement = async (e) => {
    e.preventDefault();

    if (!nom.trim() || !prenom.trim() || !adresse.trim() || !ville) {
      alert("Remplissez tous les champs de livraison.");
      return;
    }

    if (!/^0[157]\d{8}$/.test(numero)) {
      alert("Veuillez entrer un numéro ivoirien valide de 10 chiffres.");
      return;
    }

    if (!Array.isArray(ajouter) || ajouter.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    if (modePaiement === "installments" && !peutTroisFois) {
      alert("Le paiement en 3 tranches est disponible à partir de 3 000 FCFA.");
      return;
    }

    setLoading(true);

    const panierBackend = ajouter.map((item) => ({
      produitId: item.id.split("_")[0],
      quantite: item.quantite,
      couleur: item.couleur || "",
      taille: item.taille || "",
    }));

    const commande = {
      client: {
        nom,
        prenom,
        adresse,
        ville,
        codePostal,
        pays,
        numero,
      },
      panier: panierBackend,
      modePaiement,
      servicePaiement: modePaiement === "cod" ? "livraison" : servicePaiement,
      fraisLivraison,
      total,
    };

    try {
      const res = await fetch(`${API_URL}/api/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commande),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la commande.");
        return;
      }

      toutSupprimer();

      if (modePaiement === "cod") {
        navigate(`/merci/${data.commande._id}`);
      } else {
        navigate(`/paiement-semi/${data.commande._id}`);
      }
    } catch (err) {
      console.error("Erreur commande :", err);
      alert("Erreur serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!Array.isArray(ajouter) || ajouter.length === 0) {
    return (
      <Page $isdark={$isdark}>
        <Container>
          <EmptyState $isdark={$isdark}>
            <FiShoppingBag />
            <h2>Votre panier est vide</h2>
            <p>Votre prochaine pièce coup de cœur vous attend.</p>
            <EmptyButton onClick={() => navigate("/collections")}>
              Découvrir nos collections
            </EmptyButton>
          </EmptyState>
        </Container>
      </Page>
    );
  }

  return (
    <Page $isdark={$isdark}>
      <Container>
        <BackLink
          type="button"
          $isdark={$isdark}
          onClick={() => navigate("/panier")}
        >
          <FiArrowLeft />
          Retour au panier
        </BackLink>

        <Intro>
          <Eyebrow>NUMA PRIVILEGE</Eyebrow>
          <Title>
            Finaliser votre <span>commande.</span>
          </Title>
          <Subtitle $isdark={$isdark}>
            Quelques dernières informations avant de recevoir vos pièces
            préférées.
          </Subtitle>
        </Intro>

        <Progress>
          <ProgressStep $active $isdark={$isdark}>
            <span>
              <FiCheck />
            </span>
            Panier
          </ProgressStep>

          <ProgressLine $isdark={$isdark} />

          <ProgressStep $active $isdark={$isdark}>
            <span>2</span>
            Livraison
          </ProgressStep>

          <ProgressLine $isdark={$isdark} />

          <ProgressStep $isdark={$isdark}>
            <span>3</span>
            Confirmation
          </ProgressStep>
        </Progress>

        <Grid>
          <MainColumn>
            <Section $isdark={$isdark}>
              <SectionHeader $isdark={$isdark}>
                <SectionIcon $isdark={$isdark}>
                  <FiMapPin />
                </SectionIcon>
                <SectionHeading $isdark={$isdark}>
                  <h2>Adresse de livraison</h2>
                  <p>Où souhaitez-vous recevoir votre commande ?</p>
                </SectionHeading>
              </SectionHeader>

              <form id="checkout-form" onSubmit={handlePaiement}>
                <FormGrid>
                  <Field $isdark={$isdark}>
                    <label>Nom</label>
                    <Input
                      $isdark={$isdark}
                      placeholder="Votre nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </Field>

                  <Field $isdark={$isdark}>
                    <label>Prénom</label>
                    <Input
                      $isdark={$isdark}
                      placeholder="Votre prénom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      autoComplete="given-name"
                      required
                    />
                  </Field>

                  <Field $full $isdark={$isdark}>
                    <label>Adresse complète</label>
                    <Input
                      $isdark={$isdark}
                      placeholder="Quartier, rue, repère..."
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      autoComplete="street-address"
                      required
                    />
                  </Field>

                  <Field $isdark={$isdark}>
                    <label>Ville</label>
                    <Select
                      $isdark={$isdark}
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      required
                    >
                      <option value="">Choisir votre ville</option>
                      {villesCI.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field $isdark={$isdark}>
                    <label>Téléphone</label>
                    <Input
                      $isdark={$isdark}
                      type="tel"
                      placeholder="Exemple : 0700247693"
                      value={numero}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setNumero(value);
                      }}
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                    />
                  </Field>

                  <Field $isdark={$isdark}>
                    <label>Code postal</label>
                    <Input $isdark={$isdark} value={codePostal} disabled />
                  </Field>

                  <Field $isdark={$isdark}>
                    <label>Pays</label>
                    <Input $isdark={$isdark} value={pays} disabled />
                  </Field>
                </FormGrid>
              </form>
            </Section>

            <Section $isdark={$isdark}>
              <SectionHeader $isdark={$isdark}>
                <SectionIcon $isdark={$isdark}>
                  <FiCreditCard />
                </SectionIcon>
                <SectionHeading $isdark={$isdark}>
                  <h2>Mode de paiement</h2>
                  <p>Choisissez la solution qui vous convient.</p>
                </SectionHeading>
              </SectionHeader>

              <PaymentOptions>
                <PaymentCard
                  $isdark={$isdark}
                  $active={modePaiement === "full"}
                >
                  <input
                    type="radio"
                    name="mode"
                    value="full"
                    checked={modePaiement === "full"}
                    onChange={(e) => setModePaiement(e.target.value)}
                  />
                  <RadioMark $active={modePaiement === "full"} />
                  <PaymentText $isdark={$isdark}>
                    <strong>Paiement comptant</strong>
                    <small>Réglez la totalité de votre commande.</small>
                  </PaymentText>
                </PaymentCard>

                <PaymentCard
                  $isdark={$isdark}
                  $active={modePaiement === "installments"}
                  $disabled={!peutTroisFois}
                >
                  {peutTroisFois && <PaymentBadge>Flexibilité</PaymentBadge>}
                  <input
                    type="radio"
                    name="mode"
                    value="installments"
                    checked={modePaiement === "installments"}
                    onChange={(e) => setModePaiement(e.target.value)}
                    disabled={!peutTroisFois}
                  />
                  <RadioMark $active={modePaiement === "installments"} />
                  <PaymentText $isdark={$isdark}>
                    <strong>Paiement en 3 tranches</strong>
                    <small>
                      {peutTroisFois
                        ? "Répartissez votre paiement en trois."
                        : "Disponible dès 3 000 FCFA d'achat."}
                    </small>
                  </PaymentText>
                </PaymentCard>

                <PaymentCard $isdark={$isdark} $active={modePaiement === "cod"}>
                  <input
                    type="radio"
                    name="mode"
                    value="cod"
                    checked={modePaiement === "cod"}
                    onChange={(e) => setModePaiement(e.target.value)}
                  />
                  <RadioMark $active={modePaiement === "cod"} />
                  <PaymentText $isdark={$isdark}>
                    <strong>Paiement à la livraison</strong>
                    <small>Réglez votre commande à la réception.</small>
                  </PaymentText>
                </PaymentCard>
              </PaymentOptions>

              {modePaiement !== "cod" && (
                <>
                  <div style={{ marginTop: 30, marginBottom: 15 }}>
                    <h3
                      style={{
                        fontFamily: "Times New Roman, serif",
                        fontWeight: 400,
                        fontSize: 20,
                        margin: 0,
                      }}
                    >
                      Service de paiement
                    </h3>
                    <p
                      style={{
                        fontSize: 10,
                        opacity: 0.65,
                        marginTop: 6,
                      }}
                    >
                      Sélectionnez votre portefeuille mobile.
                    </p>
                  </div>

                  <PaymentOptions>
                    <ProviderCard
                      $isdark={$isdark}
                      $active={servicePaiement === "orange"}
                    >
                      <input
                        type="radio"
                        name="service"
                        value="orange"
                        checked={servicePaiement === "orange"}
                        onChange={(e) => setServicePaiement(e.target.value)}
                      />
                      <ProviderLogo>OM</ProviderLogo>
                      <strong>Orange Money</strong>
                      <RadioMark $active={servicePaiement === "orange"} />
                    </ProviderCard>

                    <ProviderCard
                      $isdark={$isdark}
                      $active={servicePaiement === "wave"}
                    >
                      <input
                        type="radio"
                        name="service"
                        value="wave"
                        checked={servicePaiement === "wave"}
                        onChange={(e) => setServicePaiement(e.target.value)}
                      />
                      <ProviderLogo $wave>W</ProviderLogo>
                      <strong>Wave</strong>
                      <RadioMark $active={servicePaiement === "wave"} />
                    </ProviderCard>
                  </PaymentOptions>
                </>
              )}

              {modePaiement === "installments" && (
                <InstallmentInfo $isdark={$isdark}>
                  <div className="top">
                    <strong>Votre paiement en 3 fois</strong>
                    <span>Sans changer votre commande</span>
                  </div>
                  <div className="amount">
                    {montantParMois.toLocaleString("fr-FR")} FCFA
                  </div>
                  <div className="details">
                    Montant indicatif par tranche. Les modalités exactes sont
                    celles prévues par votre service de paiement.
                  </div>
                </InstallmentInfo>
              )}
            </Section>
          </MainColumn>

          <Summary $isdark={$isdark}>
            <SummaryTitle>Votre commande</SummaryTitle>
            <SummarySubtitle $isdark={$isdark}>
              Récapitulatif de vos articles
            </SummarySubtitle>

            <ProductList $isdark={$isdark}>
              {ajouter.map((item) => (
                <ProductRow key={item.id} $isdark={$isdark}>
                  <div>
                    <div className="name">{item.nom}</div>
                    <div className="detail">
                      Quantité : {item.quantite}
                      {item.taille ? ` · Taille : ${item.taille}` : ""}
                      {item.couleur ? ` · ${item.couleur}` : ""}
                    </div>
                  </div>

                  <div className="price">
                    {(Number(item.prix) * Number(item.quantite)).toLocaleString(
                      "fr-FR",
                    )}{" "}
                    FCFA
                  </div>
                </ProductRow>
              ))}
            </ProductList>

            <div style={{ paddingTop: 15 }}>
              <SummaryLine $isdark={$isdark}>
                <span>Sous-total</span>
                <strong>{montantTotal.toLocaleString("fr-FR")} FCFA</strong>
              </SummaryLine>

              <SummaryLine $isdark={$isdark}>
                <span>Livraison</span>
                <strong>Communiquer par le livreur.</strong>
              </SummaryLine>
            </div>

            <TotalLine $isdark={$isdark}>
              <span>Total</span>
              <strong>
                {(montantTotal + montantLivraison).toLocaleString("fr-FR")} FCFA
              </strong>
            </TotalLine>

            <Button
              type="submit"
              form="checkout-form"
              disabled={loading || !token}
            >
              {loading ? (
                "Traitement en cours..."
              ) : (
                <>
                  Confirmer ma commande
                  <FiArrowRight />
                </>
              )}
            </Button>

            <Trust $isdark={$isdark}>
              <div>
                <FiLock />
                Vos informations sont protégées.
              </div>
              <div>
                <FiShield />
                Commande traitée en toute sécurité.
              </div>
              <div>
                <FiTruck />
                Livraison en Côte d'Ivoire.
              </div>
            </Trust>
          </Summary>
        </Grid>
      </Container>
    </Page>
  );
}
