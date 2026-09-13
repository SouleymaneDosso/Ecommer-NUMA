import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiHash,
  FiLock,
  FiSmartphone,
} from "react-icons/fi";

const PaiementSuite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numeroClient, setNumeroClient] = useState("");
  const [montantEnvoye, setMontantEnvoye] = useState("");
  const [reference, setReference] = useState("");
  const [service, setService] = useState("orange");
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCommande = async () => {
      try {
        const res = await fetch(`${API_URL}/api/commandes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur");
        }

        setCommande(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [id, token, API_URL, navigate]);

  if (loading) {
    return (
      <Page>
        <LoadingCard>
          <Loader />
          <LoadingText>Chargement de votre paiement...</LoadingText>
        </LoadingCard>
      </Page>
    );
  }

  if (!commande) {
    return (
      <Page>
        <EmptyCard>
          <FiCreditCard />
          <h2>Commande introuvable</h2>
          <p>Impossible de retrouver cette commande.</p>
          <BackButton onClick={() => navigate("/compte")}>
            Retour à mon compte
          </BackButton>
        </EmptyCard>
      </Page>
    );
  }

  const prochaineTranche = commande.paiements?.find((p) => p.status !== "PAID");

  if (!prochaineTranche) {
    return (
      <Page>
        <SuccessCard>
          <SuccessIcon>
            <FiCheckCircle />
          </SuccessIcon>

          <h2>Paiement terminé</h2>

          <p>
            Cette commande est entièrement payée.
            <br />
            Merci pour votre confiance.
          </p>

          <BackButton onClick={() => navigate(`/merci/${commande._id}`)}>
            Retour
            <FiArrowRight />
          </BackButton>
        </SuccessCard>
      </Page>
    );
  }

  const totalTranches = commande.paiements?.length || 3;
  const progress = Math.round(
    ((prochaineTranche.step - 1) / totalTranches) * 100,
  );

  const handlePaiement = async (e) => {
    e.preventDefault();

    if (!numeroClient || !montantEnvoye || !reference) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (prochaineTranche.status === "PENDING") {
      alert("Cette tranche est déjà en attente de validation.");
      return;
    }

    const montant = Number(montantEnvoye);

    if (montant < prochaineTranche.amountExpected) {
      alert(
        `Le montant attendu est de ${Number(
          prochaineTranche.amountExpected,
        ).toLocaleString("fr-FR")} FCFA.`,
      );
      return;
    }

    setSending(true);

    try {
      const res = await fetch(`${API_URL}/api/commandes/${id}/paiement-semi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          step: prochaineTranche.step,
          numeroClient,
          montantEnvoye: montant,
          reference,
          service,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors du paiement.");
        return;
      }

      alert("Paiement envoyé. Il est maintenant en attente de validation.");

      navigate(`/merci/${id}`);
    } catch (error) {
      console.error(error);
      alert("Erreur serveur.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Page>
      <BackgroundGlow />

      <Container>
        <TopBar>
          <BackLink type="button" onClick={() => navigate("/compte")}>
            <FiArrowLeft />
            Mon compte
          </BackLink>

          <SecureBadge>
            <FiLock />
            Paiement sécurisé
          </SecureBadge>
        </TopBar>

        <Header>
          <Eyebrow>
            <span />
            PAIEMENT DE COMMANDE
            <span />
          </Eyebrow>

          <Title>Payer la suite</Title>

          <Subtitle>Continuez votre paiement en toute simplicité.</Subtitle>
        </Header>

        <MainGrid>
          <SummaryCard>
            <CardTop>
              <div>
                <CardEyebrow>VOTRE COMMANDE</CardEyebrow>

                <OrderNumber>
                  #{commande._id.slice(-8).toUpperCase()}
                </OrderNumber>
              </div>

              <OrderIcon>
                <FiCreditCard />
              </OrderIcon>
            </CardTop>

            <Divider />

            <StepHeader>
              <div>
                <SmallLabel>ÉTAPE ACTUELLE</SmallLabel>

                <StepTitle>
                  Tranche {prochaineTranche.step}
                  <span> / {totalTranches}</span>
                </StepTitle>
              </div>

              <StepBadge>
                <FiClock />À payer
              </StepBadge>
            </StepHeader>

            <ProgressArea>
              <ProgressTop>
                <span>Progression du paiement</span>
                <strong>{progress}%</strong>
              </ProgressTop>

              <ProgressTrack>
                <ProgressBar $progress={progress} />
              </ProgressTrack>
            </ProgressArea>

            <AmountBox>
              <AmountLabel>Montant de cette tranche</AmountLabel>

              <Amount>
                {Number(prochaineTranche.amountExpected).toLocaleString(
                  "fr-FR",
                )}
                <small>FCFA</small>
              </Amount>

              <AmountHint>Montant minimum à envoyer</AmountHint>
            </AmountBox>

            <Timeline>
              {(commande.paiements || []).map((paiement) => (
                <TimelineItem
                  key={paiement.step}
                  $active={paiement.step === prochaineTranche.step}
                  $done={paiement.status === "PAID"}
                >
                  <TimelineDot
                    $active={paiement.step === prochaineTranche.step}
                    $done={paiement.status === "PAID"}
                  >
                    {paiement.status === "PAID" ? (
                      <FiCheckCircle />
                    ) : (
                      paiement.step
                    )}
                  </TimelineDot>

                  <TimelineContent>
                    <strong>Tranche {paiement.step}</strong>

                    <span>
                      {paiement.status === "PAID"
                        ? "Paiement confirmé"
                        : paiement.status === "PENDING"
                          ? "En vérification"
                          : "À payer"}
                    </span>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </SummaryCard>

          <PaymentCard>
            <PaymentCardHeader>
              <PaymentIcon>
                <FiCreditCard />
              </PaymentIcon>

              <div>
                <CardEyebrow>TRANSACTION</CardEyebrow>
                <PaymentTitle>Confirmer votre paiement</PaymentTitle>
              </div>
            </PaymentCardHeader>

            <form onSubmit={handlePaiement}>
              <FieldGroup>
                <FieldLabel>
                  <FiCreditCard />
                  Service de paiement
                </FieldLabel>

                <ServiceGrid>
                  <ServiceOption
                    type="button"
                    $active={service === "orange"}
                    onClick={() => setService("orange")}
                  >
                    <ServiceLogo $type="orange">OM</ServiceLogo>

                    <div>
                      <strong>Orange Money</strong>
                      <span>Paiement mobile</span>
                    </div>

                    {service === "orange" && (
                      <Selected>
                        <FiCheckCircle />
                      </Selected>
                    )}
                  </ServiceOption>

                  <ServiceOption
                    type="button"
                    $active={service === "wave"}
                    onClick={() => setService("wave")}
                  >
                    <ServiceLogo $type="wave">W</ServiceLogo>

                    <div>
                      <strong>Wave</strong>
                      <span>Paiement mobile</span>
                    </div>

                    {service === "wave" && (
                      <Selected>
                        <FiCheckCircle />
                      </Selected>
                    )}
                  </ServiceOption>
                </ServiceGrid>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>
                  <FiSmartphone />
                  Numéro utilisé
                </FieldLabel>

                <InputWrapper>
                  <InputPrefix>+225</InputPrefix>

                  <Input
                    type="tel"
                    value={numeroClient}
                    onChange={(e) => setNumeroClient(e.target.value)}
                    placeholder="07 00 00 00 00"
                  />
                </InputWrapper>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>
                  <FiCreditCard />
                  Montant envoyé
                </FieldLabel>

                <InputWrapper>
                  <Input
                    type="number"
                    min={prochaineTranche.amountExpected}
                    value={montantEnvoye}
                    onChange={(e) => setMontantEnvoye(e.target.value)}
                    placeholder={String(prochaineTranche.amountExpected)}
                  />

                  <InputSuffix>FCFA</InputSuffix>
                </InputWrapper>

                <FieldHint>
                  Minimum :{" "}
                  {Number(prochaineTranche.amountExpected).toLocaleString(
                    "fr-FR",
                  )}{" "}
                  FCFA
                </FieldHint>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>
                  <FiHash />
                  Référence de transaction
                </FieldLabel>

                <Input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex : OM123456789"
                />

                <FieldHint>
                  Saisissez la référence affichée après votre paiement.
                </FieldHint>
              </FieldGroup>

              <SecurityNote>
                <FiLock />

                <div>
                  <strong>Vos informations sont protégées</strong>
                  <span>
                    Elles servent uniquement à vérifier votre transaction.
                  </span>
                </div>
              </SecurityNote>

              <SubmitButton type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <LoaderSmall />
                    Vérification...
                  </>
                ) : (
                  <>
                    Envoyer le paiement
                    <FiArrowRight />
                  </>
                )}
              </SubmitButton>
            </form>
          </PaymentCard>
        </MainGrid>

        <FooterNote>
          Paiement de la tranche {prochaineTranche.step} sur {totalTranches} ·
          NUMA
        </FooterNote>
      </Container>
    </Page>
  );
};

export default PaiementSuite;

/* =========================================================
   STYLES
========================================================= */

const Page = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 15% 10%,
      rgba(190, 160, 100, 0.1),
      transparent 28%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(190, 160, 100, 0.08),
      transparent 30%
    ),
    ${({ theme }) => theme.background || "#f7f6f2"};

  padding: 35px 20px 70px;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(190, 160, 100, 0.08);
  filter: blur(90px);
  top: -250px;
  right: -180px;
  pointer-events: none;
`;

const Container = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 55px;

  @media (max-width: 600px) {
    margin-bottom: 40px;
  }
`;

const BackLink = styled.button`
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text || "#222"};
  cursor: pointer;
  padding: 8px 0;

  svg {
    font-size: 17px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(-4px);
  }
`;

const SecureBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.07);
  color: #6d6d68;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);

  svg {
    color: #8c7650;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 42px;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9a8056;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
  margin-bottom: 14px;

  span {
    width: 28px;
    height: 1px;
    background: #b49a6c;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(38px, 6vw, 58px);
  font-weight: 500;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.text || "#171715"};
`;

const Subtitle = styled.p`
  margin: 12px 0 0;
  color: #77766f;
  font-size: 15px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 0.88fr 1.12fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 26px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(16px);
`;

const PaymentCard = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 26px;
  padding: 32px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(16px);

  @media (max-width: 500px) {
    padding: 23px;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardEyebrow = styled.div`
  color: #99958b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
`;

const OrderNumber = styled.div`
  margin-top: 7px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const OrderIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #f1ece2;
  color: #8d754c;
  font-size: 20px;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.07);
  margin: 25px 0;
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
`;

const SmallLabel = styled.div`
  color: #a09d94;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.13em;
`;

const StepTitle = styled.div`
  margin-top: 6px;
  font-size: 23px;
  font-weight: 700;

  span {
    color: #aaa69d;
    font-weight: 500;
  }
`;

const StepBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: #f7f1e7;
  color: #92754a;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
`;

const ProgressArea = styled.div`
  margin-top: 28px;
`;

const ProgressTop = styled.div`
  display: flex;
  justify-content: space-between;
  color: #8c8981;
  font-size: 11px;
  margin-bottom: 9px;

  strong {
    color: #272622;
  }
`;

const ProgressTrack = styled.div`
  height: 6px;
  border-radius: 999px;
  background: #ebe8e1;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  border-radius: inherit;
  background: linear-gradient(90deg, #a68a5b, #c4aa78);
  transition: width 0.5s ease;
`;

const AmountBox = styled.div`
  margin-top: 25px;
  padding: 22px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f5f0e7, #fbfaf7);
  border: 1px solid rgba(170, 140, 90, 0.13);
`;

const AmountLabel = styled.div`
  color: #8d897f;
  font-size: 11px;
  font-weight: 600;
`;

const Amount = styled.div`
  margin-top: 5px;
  color: #211f1b;
  font-size: 32px;
  font-weight: 750;
  letter-spacing: -0.04em;

  small {
    margin-left: 6px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0;
    color: #8f8b83;
  }
`;

const AmountHint = styled.div`
  margin-top: 3px;
  color: #a09c93;
  font-size: 10px;
`;

const Timeline = styled.div`
  margin-top: 28px;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 10px 0;
  opacity: ${({ $active, $done }) => ($active || $done ? 1 : 0.45)};
`;

const TimelineDot = styled.div`
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  background: ${({ $done, $active }) =>
    $done ? "#e9f3eb" : $active ? "#f2eadc" : "#eeeeeb"};
  color: ${({ $done, $active }) =>
    $done ? "#56845f" : $active ? "#9a794a" : "#aaa8a1"};

  svg {
    font-size: 15px;
  }
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 12px;
  }

  span {
    color: #98958d;
    font-size: 10px;
  }
`;

const PaymentCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
`;

const PaymentIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #211f1b;
  color: white;
  font-size: 20px;
`;

const PaymentTitle = styled.h2`
  margin: 5px 0 0;
  font-size: 20px;
  letter-spacing: -0.02em;
`;

const FieldGroup = styled.div`
  margin-bottom: 22px;
`;

const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 9px;
  font-size: 11px;
  font-weight: 750;
  color: #4e4c47;

  svg {
    color: #9b7e52;
    font-size: 14px;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceOption = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  text-align: left;
  padding: 13px;
  border-radius: 15px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(150, 115, 65, 0.55)" : "rgba(0, 0, 0, 0.08)"};
  background: ${({ $active }) => ($active ? "#fbf7ef" : "#fafaf9")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(150, 115, 65, 0.35);
  }

  div:not(:first-child) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 11px;
    color: #282622;
  }

  span {
    font-size: 9px;
    color: #99968e;
  }
`;

const ServiceLogo = styled.div`
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 900;
  color: white;
  background: ${({ $type }) => ($type === "orange" ? "#f28b18" : "#2c9fe8")};
`;

const Selected = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #967a50;

  svg {
    font-size: 14px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #deddd8;
  border-radius: 13px;
  background: #fff;
  overflow: hidden;
  transition: 0.2s ease;

  &:focus-within {
    border-color: #a88a5a;
    box-shadow: 0 0 0 3px rgba(168, 138, 90, 0.09);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #deddd8;
  border-radius: 13px;
  outline: none;
  background: #fff;
  color: #24231f;
  font-size: 16px;
  box-sizing: border-box;
  transition: 0.2s ease;

  &:focus {
    border-color: #a88a5a;
    box-shadow: 0 0 0 3px rgba(168, 138, 90, 0.09);
  }

  ${InputWrapper} & {
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
`;

const InputPrefix = styled.span`
  padding-left: 14px;
  color: #77736b;
  font-size: 12px;
  font-weight: 700;
`;

const InputSuffix = styled.span`
  padding-right: 14px;
  color: #77736b;
  font-size: 10px;
  font-weight: 800;
`;

const FieldHint = styled.div`
  margin-top: 6px;
  color: #9b9890;
  font-size: 9px;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px;
  margin-top: 5px;
  border-radius: 13px;
  background: #f7f7f4;
  color: #89867e;

  > svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: #9a8056;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: #57544e;
    font-size: 10px;
  }

  span {
    font-size: 9px;
    line-height: 1.4;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 54px;
  margin-top: 20px;
  border: none;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #211f1b;
  color: white;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 12px 25px rgba(33, 31, 27, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(33, 31, 27, 0.23);

    svg {
      transform: translateX(4px);
    }
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  margin-top: 22px;
  height: 46px;
  padding: 0 20px;
  border: none;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #211f1b;
  color: white;
  font-weight: 650;
  cursor: pointer;
`;

const FooterNote = styled.div`
  text-align: center;
  margin-top: 28px;
  color: #aaa69d;
  font-size: 10px;
  letter-spacing: 0.04em;
`;

const LoadingCard = styled.div`
  width: min(400px, 100%);
  margin: 18vh auto;
  padding: 45px 30px;
  text-align: center;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.07);
`;

const LoadingText = styled.p`
  margin: 15px 0 0;
  color: #77736c;
  font-size: 13px;
`;

const Loader = styled.div`
  width: 34px;
  height: 34px;
  margin: auto;
  border: 3px solid #e8e3da;
  border-top-color: #9b7e52;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoaderSmall = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyCard = styled(LoadingCard)`
  svg {
    font-size: 40px;
    color: #9b7e52;
  }

  h2 {
    margin: 15px 0 5px;
  }

  p {
    color: #88847c;
    font-size: 13px;
  }
`;

const SuccessCard = styled(LoadingCard)`
  padding: 55px 35px;

  h2 {
    margin: 18px 0 8px;
    font-family: Georgia, serif;
    font-size: 28px;
  }

  p {
    color: #858178;
    font-size: 13px;
    line-height: 1.7;
  }
`;

const SuccessIcon = styled.div`
  width: 68px;
  height: 68px;
  margin: auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #edf5ee;
  color: #5d8c66;
  font-size: 31px;
`;
