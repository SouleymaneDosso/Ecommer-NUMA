import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaBox,
  FaCheckCircle,
  FaRegCircle,
  FaArrowRight,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

/* =========================================================
   ANIMATIONS
========================================================= */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const reveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

/* =========================================================
   GLOBAL
========================================================= */

const Page = styled.main`
  min-height: 100vh;
  padding: 40px 22px 80px;
  box-sizing: border-box;

  background: ${({ $isdark }) =>
    $isdark
      ? `
        radial-gradient(
          circle at 50% -20%,
          #29251d 0%,
          #11100e 35%,
          #080808 75%
        )
      `
      : `
        radial-gradient(
          circle at 50% -20%,
          #fffdf7 0%,
          #f7f3ea 38%,
          #eee9df 100%
        )
      `};

  color: ${({ $isdark }) =>
    $isdark ? "#f7f4ed" : "#171512"};

  transition: 0.3s ease;

  @media (max-width: 700px) {
    padding: 20px 12px 50px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: auto;
`;

/* =========================================================
   LOADER
========================================================= */

const LoaderWrapper = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;

  background: ${({ $isdark }) =>
    $isdark ? "#080808" : "#f7f3ea"};
`;

const Loader = styled.div`
  width: 44px;
  height: 44px;

  border-radius: 50%;
  border: 3px solid
    ${({ $isdark }) =>
      $isdark ? "#2d2a25" : "#e1dcd1"};

  border-top-color: #b89b5e;

  animation: ${spin} 0.8s linear infinite;
`;

/* =========================================================
   HERO
========================================================= */

const Hero = styled.section`
  position: relative;
  overflow: hidden;

  min-height: 330px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  padding: 55px 25px;

  border-radius: 34px;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(145deg, #181713, #0d0d0c)"
      : "linear-gradient(145deg, #fffdf8, #f3eee3)"};

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "#302d26" : "#e2dbcc")};

  box-shadow: ${({ $isdark }) =>
    $isdark
      ? "0 30px 80px rgba(0,0,0,.45)"
      : "0 30px 80px rgba(77,61,31,.10)"};

  animation: ${reveal} .7s ease both;

  &::before {
    content: "";
    position: absolute;

    width: 420px;
    height: 420px;

    border-radius: 50%;

    background: ${({ $isdark }) =>
      $isdark
        ? "rgba(184,155,94,.06)"
        : "rgba(184,155,94,.09)"};

    top: -260px;
    left: 50%;

    transform: translateX(-50%);
  }

  @media (max-width: 600px) {
    min-height: 280px;
    border-radius: 24px;
    padding: 40px 18px;
  }
`;

const LuxuryLine = styled.div`
  width: 70px;
  height: 1px;

  margin-bottom: 22px;

  background: #b89b5e;
`;

const SuccessIcon = styled.div`
  position: relative;
  z-index: 1;

  width: 82px;
  height: 82px;

  display: grid;
  place-items: center;

  margin-bottom: 22px;

  border-radius: 50%;

  background: ${({ $isdark }) =>
    $isdark ? "#b89b5e" : "#171512"};

  color: ${({ $isdark }) =>
    $isdark ? "#171512" : "#fffdf8"};

  box-shadow:
    0 0 0 8px
      ${({ $isdark }) =>
        $isdark
          ? "rgba(184,155,94,.10)"
          : "rgba(23,21,18,.06)"},
    0 18px 45px rgba(0, 0, 0, .18);

  animation: ${scaleIn} .7s .15s ease both;

  svg {
    font-size: 34px;
  }

  @media (max-width: 600px) {
    width: 70px;
    height: 70px;

    svg {
      font-size: 28px;
    }
  }
`;

const Eyebrow = styled.div`
  position: relative;
  z-index: 1;

  color: #b89b5e;

  font-size: .68rem;
  font-weight: 800;

  letter-spacing: 3px;
  text-transform: uppercase;

  margin-bottom: 13px;
`;

const Title = styled.h1`
  position: relative;
  z-index: 1;

  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(2.3rem, 6vw, 4.7rem);

  line-height: .95;

  font-weight: 500;

  letter-spacing: -2px;

  @media (max-width: 600px) {
    letter-spacing: -1px;
  }
`;

const Subtitle = styled.p`
  position: relative;
  z-index: 1;

  max-width: 620px;

  margin: 20px auto 0;

  font-size: .9rem;
  line-height: 1.8;

  color: ${({ $isdark }) =>
    $isdark ? "#aaa59a" : "#777168"};
`;

const OrderReference = styled.div`
  position: relative;
  z-index: 1;

  margin-top: 22px;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  padding: 9px 16px;

  border-radius: 100px;

  background: ${({ $isdark }) =>
    $isdark ? "#211f1a" : "#fff"};

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "#39342a" : "#ded7c9")};

  color: ${({ $isdark }) =>
    $isdark ? "#d8d1c4" : "#514b42"};

  font-size: .7rem;
  font-weight: 800;

  letter-spacing: 1px;
`;

/* =========================================================
   CONTENT
========================================================= */

const MainGrid = styled.div`
  display: grid;

  grid-template-columns: 1.35fr .85fr;

  gap: 22px;

  margin-top: 22px;

  animation: ${reveal} .8s .15s ease both;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

/* =========================================================
   CARD
========================================================= */

const Card = styled.section`
  position: relative;
  overflow: hidden;

  padding: 28px;

  border-radius: 28px;

  background: ${({ $isdark }) =>
    $isdark
      ? "rgba(20,19,17,.94)"
      : "rgba(255,255,255,.88)"};

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "#302d26" : "#e2dbcf")};

  box-shadow: ${({ $isdark }) =>
    $isdark
      ? "0 25px 70px rgba(0,0,0,.28)"
      : "0 25px 70px rgba(55,42,20,.08)"};

  backdrop-filter: blur(15px);

  @media (max-width: 600px) {
    padding: 20px 17px;
    border-radius: 22px;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  margin-bottom: 25px;
`;

const CardIcon = styled.div`
  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;

  border-radius: 13px;

  background: ${({ $isdark }) =>
    $isdark ? "#25221c" : "#f3eee3"};

  color: #b89b5e;

  svg {
    font-size: 17px;
  }
`;

const CardTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const CardTitle = styled.h2`
  margin: 0;

  font-size: .95rem;
  font-weight: 800;
`;

const CardLabel = styled.span`
  color: ${({ $isdark }) =>
    $isdark ? "#77736b" : "#999187"};

  font-size: .58rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

/* =========================================================
   PRODUCTS
========================================================= */

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;

  padding: 17px 0;

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#292720" : "#eee9df"};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ItemName = styled.span`
  font-size: .87rem;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemQuantity = styled.span`
  color: ${({ $isdark }) =>
    $isdark ? "#77736b" : "#9b958b"};

  font-size: .68rem;
`;

const ItemPrice = styled.span`
  white-space: nowrap;

  font-size: .83rem;
  font-weight: 800;
`;

const TotalBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 20px;
  padding-top: 22px;

  border-top: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#3a362d" : "#ddd6c8"};
`;

const TotalLabel = styled.span`
  font-size: .82rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 800;
`;

const TotalPrice = styled.span`
  font-family: Georgia, serif;

  color: #b89b5e;

  font-size: 1.55rem;
`;

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

const PaymentSummary = styled.div`
  margin-top: 20px;

  padding: 18px;

  border-radius: 18px;

  background: ${({ $isdark }) =>
    $isdark ? "#11100e" : "#f7f3ea"};
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 8px 0;

  span {
    color: ${({ $isdark }) =>
      $isdark ? "#858078" : "#817a70"};

    font-size: .72rem;
  }

  strong {
    font-size: .76rem;
  }
`;

const Remaining = styled(PaymentRow)`
  margin-top: 8px;
  padding-top: 15px;

  border-top: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#302d26" : "#e5dfd3"};

  strong {
    color: #b88a38;
  }
`;

/* =========================================================
   COFFRE
========================================================= */

const Coffre = styled.div`
  position: relative;
  overflow: hidden;

  margin-top: 22px;

  padding: 24px;

  border-radius: 25px;

  background:
    linear-gradient(
      135deg,
      #191713,
      #0c0c0b
    );

  color: #fff;

  box-shadow:
    0 25px 60px rgba(0,0,0,.22);

  &::after {
    content: "";

    position: absolute;

    width: 180px;
    height: 180px;

    border-radius: 50%;

    border: 1px solid rgba(184,155,94,.18);

    right: -70px;
    top: -80px;
  }
`;

const CoffreTop = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  position: relative;
  z-index: 1;
`;

const CoffreIcon = styled.div`
  width: 50px;
  height: 50px;

  display: grid;
  place-items: center;

  border-radius: 15px;

  background: rgba(184,155,94,.14);

  color: #c5a867;

  svg {
    font-size: 20px;
  }
`;

const CoffreText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  span {
    color: #8c877d;

    font-size: .58rem;

    text-transform: uppercase;
    letter-spacing: 2px;
  }

  strong {
    font-family: Georgia, serif;

    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const ProgressBar = styled.div`
  position: relative;
  z-index: 1;

  width: 100%;
  height: 4px;

  margin-top: 22px;

  border-radius: 10px;

  background: #2a2823;

  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;

  width: ${({ $percent }) => `${$percent}%`};

  background: linear-gradient(
    90deg,
    #8d733d,
    #d0b56f
  );

  border-radius: inherit;

  transition: width .6s ease;
`;

/* =========================================================
   STEPS
========================================================= */

const Steps = styled.div`
  display: flex;
  flex-direction: column;
`;

const Step = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  gap: 14px;

  padding: 15px 0;

  &:not(:last-child)::after {
    content: "";

    position: absolute;

    left: 11px;
    top: 39px;

    width: 1px;
    height: calc(100% - 10px);

    background: ${({ $isdark }) =>
      $isdark ? "#302d26" : "#e2ddd4"};
  }
`;

const StepIcon = styled.div`
  position: relative;
  z-index: 2;

  flex-shrink: 0;

  width: 24px;
  height: 24px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background: ${({ $paid, $isdark }) =>
    $paid
      ? "#b89b5e"
      : $isdark
        ? "#211f1a"
        : "#f1eee7"};

  color: ${({ $paid }) =>
    $paid ? "#fff" : "#a39a8b"};

  svg {
    font-size: ${({ $paid }) =>
      $paid ? "12px" : "15px"};
  }
`;

const StepInfo = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StepTitle = styled.span`
  font-size: .78rem;
  font-weight: 800;
`;

const StepAmount = styled.span`
  color: ${({ $isdark }) =>
    $isdark ? "#77736c" : "#999288"};

  font-size: .65rem;
`;

const Badge = styled.span`
  padding: 6px 9px;

  border-radius: 100px;

  font-size: .53rem;
  font-weight: 900;

  letter-spacing: .8px;

  color: ${({ $paid }) =>
    $paid ? "#27613a" : "#876523"};

  background: ${({ $paid }) =>
    $paid ? "#e5f3e8" : "#f6edda"};
`;

/* =========================================================
   SECURITY
========================================================= */

const Security = styled.div`
  display: flex;
  gap: 10px;

  margin-top: 22px;

  padding: 15px;

  border-radius: 15px;

  background: ${({ $isdark }) =>
    $isdark ? "#171613" : "#f8f5ef"};

  color: ${({ $isdark }) =>
    $isdark ? "#77736b" : "#858076"};

  font-size: .65rem;

  line-height: 1.6;

  svg {
    flex-shrink: 0;
    color: #b89b5e;
    margin-top: 2px;
  }
`;

/* =========================================================
   BUTTON
========================================================= */

const Button = styled.button`
  width: 100%;

  margin-top: 22px;

  min-height: 58px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  border: 1px solid #b89b5e;
  border-radius: 16px;

  background: ${({ $isdark }) =>
    $isdark ? "#b89b5e" : "#171512"};

  color: ${({ $isdark }) =>
    $isdark ? "#171512" : "#fff"};

  font-size: .76rem;
  font-weight: 900;

  letter-spacing: 1px;
  text-transform: uppercase;

  cursor: pointer;

  transition: .25s ease;

  svg {
    transition: transform .25s ease;
  }

  &:hover {
    transform: translateY(-3px);

    box-shadow:
      0 15px 35px rgba(0,0,0,.18);

    svg {
      transform: translateX(4px);
    }
  }
`;

/* =========================================================
   MODAL
========================================================= */

const Modal = styled.div`
  position: fixed;
  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(7,7,6,.78);

  backdrop-filter: blur(14px);
`;

const ModalContent = styled.div`
  position: relative;

  width: 100%;
  max-width: 460px;

  padding: 38px;

  border-radius: 28px;

  text-align: center;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(145deg,#1d1b17,#11100e)"
      : "linear-gradient(145deg,#fffefa,#f5f0e7)"};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "#39342a" : "#e2dacb"};

  box-shadow:
    0 40px 100px rgba(0,0,0,.4);

  animation: ${reveal} .4s ease both;

  @media (max-width: 500px) {
    padding: 28px 20px;
    border-radius: 22px;
  }
`;

const ModalIcon = styled.div`
  width: 64px;
  height: 64px;

  display: grid;
  place-items: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: #b89b5e;

  color: #171512;

  box-shadow:
    0 10px 30px rgba(184,155,94,.25);

  svg {
    font-size: 23px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0 0 10px;

  font-family: Georgia, serif;

  font-size: 1.5rem;
  font-weight: 500;
`;

const ModalText = styled.p`
  margin: 0;

  color: ${({ $isdark }) =>
    $isdark ? "#969188" : "#716b61"};

  font-size: .78rem;
  line-height: 1.7;
`;

const CloseModal = styled.button`
  width: 100%;

  margin-top: 25px;

  padding: 14px;

  border: none;
  border-radius: 13px;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#171512"};

  color: ${({ $isdark }) =>
    $isdark ? "#171512" : "#fff"};

  font-size: .7rem;
  font-weight: 900;

  letter-spacing: 1px;
  text-transform: uppercase;

  cursor: pointer;

  transition: .2s;

  &:hover {
    opacity: .88;
    transform: translateY(-1px);
  }
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function Merci() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const $isdark = theme !== "light";

  const commandeId = location.state?.commandeId;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [token, setToken] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= AUTH ================= */

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      navigate("/login");
      return;
    }

    setToken(savedToken);
  }, [navigate]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!commandeId || !token) return;

    const fetchCommande = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/commandes/${commandeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Erreur serveur",
          );
        }

        setCommande(data.commande || data);
      } catch (err) {
        console.error(err);

        alert(
          "Impossible de récupérer la commande",
        );

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [
    commandeId,
    token,
    navigate,
    API_URL,
  ]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <LoaderWrapper $isdark={$isdark}>
        <Loader $isdark={$isdark} />
      </LoaderWrapper>
    );
  }

  if (!commande) {
    return (
      <Page $isdark={$isdark}>
        <Container>
          <Card $isdark={$isdark}>
            Commande introuvable
          </Card>
        </Container>
      </Page>
    );
  }

  /* ================= DATA ================= */

  const paiements = commande.paiements || [];
  const panier = commande.panier || [];

  const paidSteps = paiements.filter(
    (p) => p.status === "PAID",
  ).length;

  const totalSteps = paiements.length;

  const totalPaid = paiements
    .filter((p) => p.status === "PAID")
    .reduce(
      (acc, p) =>
        acc + Number(p.amountExpected || 0),
      0,
    );

  const remaining = Math.max(
    0,
    Number(commande.total || 0) - totalPaid,
  );

  const progress =
    totalSteps > 0
      ? Math.round(
          (paidSteps / totalSteps) * 100,
        )
      : 0;

  /* ================= UI ================= */

  return (
    <Page $isdark={$isdark}>
      <Container>

        {/* ================= HERO ================= */}

        <Hero $isdark={$isdark}>
          <LuxuryLine />

          <SuccessIcon $isdark={$isdark}>
            <FaCheckCircle />
          </SuccessIcon>

          <Eyebrow>
            Confirmation de commande
          </Eyebrow>

          <Title>
            Merci pour votre confiance
          </Title>

          <Subtitle $isdark={$isdark}>
            Votre commande est officiellement
            enregistrée. Retrouvez ci-dessous
            son récapitulatif ainsi que
            l'avancement de votre coffre.
          </Subtitle>

          {commandeId && (
            <OrderReference $isdark={$isdark}>
              <FaStar />
              COMMANDE #
              {String(commandeId).slice(-8).toUpperCase()}
            </OrderReference>
          )}
        </Hero>

        {/* ================= CONTENT ================= */}

        <MainGrid>

          {/* ================= LEFT ================= */}

          <div>

            <Card $isdark={$isdark}>

              <CardTop>
                <CardIcon $isdark={$isdark}>
                  <FaBox />
                </CardIcon>

                <CardTitleBox>
                  <CardTitle>
                    Votre commande
                  </CardTitle>

                  <CardLabel $isdark={$isdark}>
                    Récapitulatif
                  </CardLabel>
                </CardTitleBox>
              </CardTop>

              {panier.map((item, index) => (
                <Line
                  key={
                    item.produitId ||
                    item._id ||
                    index
                  }
                  $isdark={$isdark}
                >
                  <ItemInfo>
                    <ItemName>
                      {item.nom}
                    </ItemName>

                    <ItemQuantity
                      $isdark={$isdark}
                    >
                      Quantité : {item.quantite}
                    </ItemQuantity>
                  </ItemInfo>

                  <ItemPrice>
                    {(
                      Number(item.prix || 0) *
                      Number(item.quantite || 0)
                    ).toLocaleString()}{" "}
                    FCFA
                  </ItemPrice>
                </Line>
              ))}

              <TotalBox $isdark={$isdark}>
                <TotalLabel>
                  Total commande
                </TotalLabel>

                <TotalPrice>
                  {Number(
                    commande.total || 0,
                  ).toLocaleString()}{" "}
                  FCFA
                </TotalPrice>
              </TotalBox>

              <PaymentSummary
                $isdark={$isdark}
              >
                <PaymentRow $isdark={$isdark}>
                  <span>
                    Montant déjà payé
                  </span>

                  <strong>
                    {totalPaid.toLocaleString()} FCFA
                  </strong>
                </PaymentRow>

                <Remaining $isdark={$isdark}>
                  <span>
                    Solde restant
                  </span>

                  <strong>
                    {remaining.toLocaleString()} FCFA
                  </strong>
                </Remaining>
              </PaymentSummary>

            </Card>

            {/* COFFRE */}

            <Coffre $isdark={$isdark}>

              <CoffreTop>
                <CoffreIcon>
                  <FaBox />
                </CoffreIcon>

                <CoffreText>
                  <span>
                    Votre coffre
                  </span>

                  <strong>
                    {paidSteps} / {totalSteps} étapes payées
                  </strong>
                </CoffreText>
              </CoffreTop>

              <ProgressBar>
                <Progress $percent={progress} />
              </ProgressBar>

            </Coffre>

          </div>

          {/* ================= RIGHT ================= */}

          <div>

            <Card $isdark={$isdark}>

              <CardTop>
                <CardIcon $isdark={$isdark}>
                  <FaCheckCircle />
                </CardIcon>

                <CardTitleBox>
                  <CardTitle>
                    Progression
                  </CardTitle>

                  <CardLabel $isdark={$isdark}>
                    Suivi du paiement
                  </CardLabel>
                </CardTitleBox>
              </CardTop>

              <Steps>

                {paiements.map((p) => {
                  const paid =
                    p.status === "PAID";

                  return (
                    <Step
                      key={p._id}
                      $isdark={$isdark}
                    >

                      <StepIcon
                        $paid={paid}
                        $isdark={$isdark}
                      >
                        {paid ? (
                          <FaCheckCircle />
                        ) : (
                          <FaRegCircle />
                        )}
                      </StepIcon>

                      <StepInfo>

                        <StepTitle>
                          Étape {p.step}
                        </StepTitle>

                        <StepAmount
                          $isdark={$isdark}
                        >
                          {Number(
                            p.amountExpected || 0,
                          ).toLocaleString()}{" "}
                          FCFA
                        </StepAmount>

                      </StepInfo>

                      <Badge $paid={paid}>
                        {paid
                          ? "PAYÉ"
                          : "EN ATTENTE"}
                      </Badge>

                    </Step>
                  );
                })}

              </Steps>

              <Security $isdark={$isdark}>
                <FaShieldAlt />

                <span>
                  Vos paiements sont suivis
                  automatiquement. Consultez
                  régulièrement votre coffre
                  pour connaître l'état de votre
                  commande.
                </span>
              </Security>

            </Card>

            <Button
              $isdark={$isdark}
              onClick={() =>
                navigate("/compte")
              }
            >
              Accéder à mon coffre
              <FaArrowRight />
            </Button>

          </div>

        </MainGrid>

        {/* ================= MODAL ================= */}

        {showModal && (
          <Modal>

            <ModalContent
              $isdark={$isdark}
            >

              <ModalIcon>
                <FaBox />
              </ModalIcon>

              <ModalTitle>
                Paiement en cours de validation
              </ModalTitle>

              <ModalText
                $isdark={$isdark}
              >
                Votre commande est bien
                enregistrée. La validation de
                votre paiement peut prendre
                quelques instants. Vous pourrez
                suivre chaque étape depuis votre
                coffre.
              </ModalText>

              <CloseModal
                $isdark={$isdark}
                onClick={() =>
                  setShowModal(false)
                }
              >
                Compris
              </CloseModal>

            </ModalContent>

          </Modal>
        )}

      </Container>
    </Page>
  );
}