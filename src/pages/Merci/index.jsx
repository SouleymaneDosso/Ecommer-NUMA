import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaBox,
  FaCheckCircle,
  FaRegCircle,
  FaArrowRight,
  FaShieldAlt,
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.04);
  }
`;

/* =========================================================
   LOADER
========================================================= */

const LoaderWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isdark }) =>
    $isdark ? "#090909" : "#f6f5f2"};
`;

const Loader = styled.div`
  width: 44px;
  height: 44px;
  border: 4px solid ${({ $isdark }) => ($isdark ? "#252525" : "#e5e5e5")};
  border-top-color: #111;
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

/* =========================================================
   PAGE
========================================================= */

const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;

  padding: 4rem 1.5rem 5rem;

  background: ${({ $isdark }) =>
    $isdark
      ? "radial-gradient(circle at top, #1a1a1a 0%, #090909 55%)"
      : "linear-gradient(180deg, #faf9f7 0%, #f3f1ed 100%)"};

  color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};

  transition:
    background 0.3s ease,
    color 0.3s ease;

  @media (max-width: 700px) {
    padding: 1.5rem 0.9rem 3rem;
  }
`;

/* =========================================================
   CONTAINER
========================================================= */

const Container = styled.div`
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
`;

/* =========================================================
   HEADER
========================================================= */

const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${fadeUp} 0.6s ease forwards;

  @media (max-width: 600px) {
    margin-bottom: 1.8rem;
  }
`;

const SuccessIcon = styled.div`
  width: 76px;
  height: 76px;
  margin: 0 auto 1.2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ $isdark }) =>
    $isdark ? "#171717" : "#111"};

  color: white;

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.15);

  animation: ${pulse} 2.5s ease-in-out infinite;

  svg {
    font-size: 30px;
  }

  @media (max-width: 600px) {
    width: 64px;
    height: 64px;

    svg {
      font-size: 25px;
    }
  }
`;

const Eyebrow = styled.div`
  margin-bottom: 0.6rem;

  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;

  color: ${({ $isdark }) => ($isdark ? "#999" : "#777")};
`;

const Title = styled.h1`
  margin: 0;

  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
  letter-spacing: -1.8px;
  font-weight: 900;

  @media (max-width: 600px) {
    letter-spacing: -1px;
  }
`;

const Subtitle = styled.p`
  max-width: 600px;
  margin: 1rem auto 0;

  font-size: 0.98rem;
  line-height: 1.6;

  color: ${({ $isdark }) => ($isdark ? "#aaa" : "#666")};

  @media (max-width: 600px) {
    font-size: 0.88rem;
  }
`;

/* =========================================================
   ORDER NUMBER
========================================================= */

const OrderReference = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: 1.2rem;
  padding: 9px 14px;

  border-radius: 999px;

  background: ${({ $isdark }) =>
    $isdark ? "#181818" : "#fff"};

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "#292929" : "#e5e5e5")};

  color: ${({ $isdark }) => ($isdark ? "#ddd" : "#444")};

  font-size: 0.78rem;
  font-weight: 700;
`;

/* =========================================================
   GRID
========================================================= */

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.2rem;

  animation: ${fadeUp} 0.7s ease forwards;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

/* =========================================================
   CARD
========================================================= */

const Card = styled.section`
  padding: 1.5rem;

  border-radius: 22px;

  background: ${({ $isdark }) =>
    $isdark
      ? "rgba(23,23,23,0.96)"
      : "rgba(255,255,255,0.92)"};

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "#292929" : "#e8e6e1")};

  box-shadow: ${({ $isdark }) =>
    $isdark
      ? "0 18px 45px rgba(0,0,0,0.25)"
      : "0 18px 45px rgba(0,0,0,0.06)"};

  backdrop-filter: blur(12px);

  @media (max-width: 600px) {
    padding: 1.1rem;
    border-radius: 17px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 1rem;

  margin-bottom: 1.3rem;
`;

const CardTitle = styled.h2`
  margin: 0;

  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const CardLabel = styled.span`
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;

  color: ${({ $isdark }) => ($isdark ? "#777" : "#999")};
`;

/* =========================================================
   ORDER LINES
========================================================= */

const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;

  padding: 0.85rem 0;

  border-bottom: 1px solid
    ${({ $isdark }) => ($isdark ? "#262626" : "#eeeeee")};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 520px) {
    gap: 0.6rem;
  }
`;

const ItemInfo = styled.div`
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.span`
  font-size: 0.88rem;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemQuantity = styled.span`
  font-size: 0.74rem;

  color: ${({ $isdark }) => ($isdark ? "#777" : "#999")};
`;

const ItemPrice = styled.span`
  white-space: nowrap;

  font-size: 0.88rem;
  font-weight: 800;
`;

const TotalLine = styled(Line)`
  margin-top: 0.4rem;
  padding-top: 1.2rem;

  border-top: 1px solid
    ${({ $isdark }) => ($isdark ? "#333" : "#ddd")};

  border-bottom: none;
`;

const TotalLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
`;

const TotalPrice = styled.span`
  font-size: 1.15rem;
  font-weight: 900;
`;

/* =========================================================
   PAYMENT SUMMARY
========================================================= */

const PaymentSummary = styled.div`
  margin-top: 1rem;
  padding: 1rem;

  border-radius: 15px;

  background: ${({ $isdark }) =>
    $isdark ? "#111" : "#f7f6f3"};
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  margin-bottom: 0.65rem;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    font-size: 0.8rem;

    color: ${({ $isdark }) =>
      $isdark ? "#999" : "#777"};
  }

  strong {
    font-size: 0.82rem;
  }
`;

const Remaining = styled(PaymentRow)`
  padding-top: 0.7rem;

  border-top: 1px solid
    ${({ $isdark }) => ($isdark ? "#292929" : "#e5e5e5")};

  strong {
    color: #d97706;
  }
`;

/* =========================================================
   COFFRE
========================================================= */

const Coffre = styled.div`
  margin-top: 1.2rem;
  padding: 1.25rem;

  display: flex;
  align-items: center;
  gap: 1rem;

  border-radius: 18px;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(135deg, #202020, #111)"
      : "linear-gradient(135deg, #171717, #333)"};

  color: white;

  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.15);

  @media (max-width: 520px) {
    padding: 1rem;
  }
`;

const CoffreIcon = styled.div`
  flex-shrink: 0;

  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: rgba(255, 255, 255, 0.1);

  svg {
    font-size: 20px;
  }
`;

const CoffreText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  min-width: 0;

  span {
    font-size: 0.7rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
  }

  strong {
    font-size: 0.95rem;
  }
`;

/* =========================================================
   PAYMENT STEPS
========================================================= */

const Steps = styled.div`
  display: flex;
  flex-direction: column;
`;

const Step = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 0.85rem;

  padding: 0.85rem 0;

  &:not(:last-child)::after {
    content: "";

    position: absolute;

    left: 11px;
    top: 38px;

    width: 1px;
    height: calc(100% - 15px);

    background: ${({ $isdark }) =>
      $isdark ? "#303030" : "#ddd"};
  }
`;

const StepIcon = styled.div`
  position: relative;
  z-index: 2;

  flex-shrink: 0;

  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $paid, $isdark }) =>
    $paid
      ? $isdark
        ? "#171717"
        : "#fff"
      : $isdark
        ? "#171717"
        : "#fff"};

  svg {
    font-size: 21px;
  }
`;

const StepInfo = styled.div`
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const StepTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 800;
`;

const StepAmount = styled.span`
  font-size: 0.74rem;

  color: ${({ $isdark }) =>
    $isdark ? "#777" : "#999"};
`;

const Badge = styled.span`
  flex-shrink: 0;

  padding: 5px 9px;

  border-radius: 999px;

  font-size: 0.62rem;
  font-weight: 900;

  letter-spacing: 0.5px;

  color: ${({ $paid }) =>
    $paid ? "#166534" : "#92400e"};

  background: ${({ $paid }) =>
    $paid ? "#dcfce7" : "#fef3c7"};

  @media (max-width: 450px) {
    font-size: 0.55rem;
    padding: 4px 7px;
  }
`;

/* =========================================================
   SECURITY INFO
========================================================= */

const Security = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;

  margin-top: 1rem;

  padding: 1rem;

  border-radius: 15px;

  background: ${({ $isdark }) =>
    $isdark ? "#141414" : "#f8f8f6"};

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "#252525" : "#e8e8e5")};

  color: ${({ $isdark }) =>
    $isdark ? "#999" : "#777"};

  font-size: 0.72rem;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

/* =========================================================
   BUTTON
========================================================= */

const Button = styled.button`
  width: 100%;

  margin-top: 1.5rem;

  min-height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border: none;
  border-radius: 14px;

  background: ${({ $isdark }) =>
    $isdark ? "#fff" : "#111"};

  color: ${({ $isdark }) =>
    $isdark ? "#111" : "#fff"};

  font-size: 0.9rem;
  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
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

  padding: 1rem;

  background: rgba(0, 0, 0, 0.72);

  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 440px;

  padding: 2rem;

  border-radius: 22px;

  text-align: center;

  background: ${({ $isdark }) =>
    $isdark ? "#181818" : "#fff"};

  color: ${({ $isdark }) =>
    $isdark ? "#f5f5f5" : "#111"};

  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.3);

  animation: ${fadeUp} 0.35s ease forwards;

  @media (max-width: 500px) {
    padding: 1.5rem;
    border-radius: 18px;
  }
`;

const ModalIcon = styled.div`
  width: 54px;
  height: 54px;

  margin: 0 auto 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ $isdark }) =>
    $isdark ? "#242424" : "#f2f2f2"};

  svg {
    font-size: 23px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0 0 0.7rem;

  font-size: 1.25rem;
`;

const ModalText = styled.p`
  margin: 0;

  color: ${({ $isdark }) =>
    $isdark ? "#999" : "#666"};

  font-size: 0.88rem;
  line-height: 1.6;
`;

const CloseModal = styled.button`
  width: 100%;

  margin-top: 1.4rem;

  padding: 12px 16px;

  border: none;
  border-radius: 12px;

  background: #111;
  color: #fff;

  font-weight: 800;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
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

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      navigate("/login");
      return;
    }

    setToken(savedToken);
  }, [navigate]);

  /* =========================================================
     FETCH COMMANDE
  ========================================================= */

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

  /* =========================================================
     LOADING
  ========================================================= */

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

  /* =========================================================
     CALCULS
  ========================================================= */

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
    Number(commande.total || 0) -
      totalPaid,
  );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <Page $isdark={$isdark}>
      <Container>

        {/* ================= HEADER ================= */}

        <Header>
          <SuccessIcon $isdark={$isdark}>
            <FaCheckCircle />
          </SuccessIcon>

          <Eyebrow $isdark={$isdark}>
            Commande enregistrée
          </Eyebrow>

          <Title>
            Merci pour votre commande
          </Title>

          <Subtitle $isdark={$isdark}>
            Votre commande a bien été prise en
            compte. Vous pouvez suivre son
            avancement et vos paiements depuis
            votre espace personnel.
          </Subtitle>

          {commandeId && (
            <OrderReference $isdark={$isdark}>
              <FaBox />
              Commande #
              {String(commandeId).slice(-8)}
            </OrderReference>
          )}
        </Header>

        {/* ================= CONTENT ================= */}

        <MainGrid>

          {/* ================= LEFT ================= */}

          <div>

            <Card $isdark={$isdark}>
              <CardHeader>
                <CardTitle>
                  Récapitulatif
                </CardTitle>

                <CardLabel $isdark={$isdark}>
                  {panier.length} article
                  {panier.length > 1
                    ? "s"
                    : ""}
                </CardLabel>
              </CardHeader>

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

                    <ItemQuantity $isdark={$isdark}>
                      Quantité :{" "}
                      {item.quantite}
                    </ItemQuantity>
                  </ItemInfo>

                  <ItemPrice>
                    {(
                      Number(item.prix || 0) *
                      Number(
                        item.quantite || 0,
                      )
                    ).toLocaleString()}{" "}
                    FCFA
                  </ItemPrice>
                </Line>
              ))}

              <TotalLine $isdark={$isdark}>
                <TotalLabel>
                  Total
                </TotalLabel>

                <TotalPrice>
                  {Number(
                    commande.total || 0,
                  ).toLocaleString()}{" "}
                  FCFA
                </TotalPrice>
              </TotalLine>

              <PaymentSummary
                $isdark={$isdark}
              >
                <PaymentRow
                  $isdark={$isdark}
                >
                  <span>
                    Montant payé
                  </span>

                  <strong>
                    {totalPaid.toLocaleString()}{" "}
                    FCFA
                  </strong>
                </PaymentRow>

                <Remaining
                  $isdark={$isdark}
                >
                  <span>
                    Reste à payer
                  </span>

                  <strong>
                    {remaining.toLocaleString()}{" "}
                    FCFA
                  </strong>
                </Remaining>
              </PaymentSummary>
            </Card>

            <Coffre $isdark={$isdark}>
              <CoffreIcon>
                <FaBox />
              </CoffreIcon>

              <CoffreText>
                <span>
                  Votre coffre
                </span>

                <strong>
                  {paidSteps} / {totalSteps}{" "}
                  étapes payées
                </strong>
              </CoffreText>
            </Coffre>

          </div>

          {/* ================= RIGHT ================= */}

          <div>

            <Card $isdark={$isdark}>
              <CardHeader>
                <CardTitle>
                  Progression
                </CardTitle>

                <CardLabel $isdark={$isdark}>
                  Paiement
                </CardLabel>
              </CardHeader>

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
                          <FaCheckCircle
                            color="#16a34a"
                          />
                        ) : (
                          <FaRegCircle
                            color="#d97706"
                          />
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
                            p.amountExpected ||
                              0,
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
                  Le statut de vos paiements
                  est mis à jour dans votre
                  espace compte. Pensez à
                  consulter votre coffre pour
                  suivre votre progression.
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
              <ModalIcon $isdark={$isdark}>
                <FaBox />
              </ModalIcon>

              <ModalTitle>
                Paiement en cours de
                validation
              </ModalTitle>

              <ModalText
                $isdark={$isdark}
              >
                Votre commande est bien
                enregistrée. Suivez
                l'avancement de votre coffre
                directement depuis votre
                espace compte.
              </ModalText>

              <CloseModal
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