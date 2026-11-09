
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

// ================= ANIMATIONS =================

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ================= GLOBAL =================

const Page = styled.main`
  --black: #111111;
  --white: #ffffff;
  --gray: #777777;
  --light: #f5f4f1;
  --border: #e6e5e2;

  width: 100%;
  overflow: hidden;
  background: var(--white);
  color: var(--black);
  font-family: inherit;

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
  }
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const SectionLabel = styled(Eyebrow)`
  color: var(--gray);
  margin-bottom: 28px;
`;

const OutlineText = styled.span`
  color: transparent;
  -webkit-text-stroke: 1px currentColor;
`;

// ================= BUTTONS =================

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 45px;
  padding: 19px 24px;
  background: var(--black);
  color: white;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.3px;
  transition: 0.3s ease;

  &:hover {
    background: #393939;
    transform: translateY(-3px);
  }

  span {
    font-size: 18px;
  }
`;

const WhiteButton = styled(PrimaryButton)`
  background: white;
  color: black;

  &:hover {
    background: #dddddd;
  }
`;

// ================= HERO =================

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr 0.85fr;
  min-height: 590px;
  background: var(--light);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const HeroContent = styled.div`
  padding: 100px 8% 75px 12%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  animation: ${fadeUp} 0.7s ease;

  h1 {
    font-size: clamp(55px, 7vw, 105px);
    line-height: 0.91;
    letter-spacing: -5px;
    font-weight: 800;
    margin: 30px 0 0;
  }

  h1 span {
    color: transparent;
    -webkit-text-stroke: 1px var(--black);
  }

  p {
    max-width: 420px;
    color: #666;
    line-height: 1.9;
    font-size: 14px;
    margin: 30px 0;
  }

  @media (max-width: 900px) {
    padding: 65px 30px 65px 8%;

    h1 {
      font-size: 65px;
    }
  }

  @media (max-width: 600px) {
    padding: 75px 25px 45px;

    h1 {
      font-size: clamp(55px, 15vw, 75px);
      letter-spacing: -3px;
    }

    p {
      font-size: 13px;
    }
  }
`;

const HeroNote = styled.div`
  margin-top: 28px;
  font-size: 10px;
  color: #777;
  display: flex;
  align-items: center;
  gap: 9px;

  span {
    width: 7px;
    height: 7px;
    background: #5e8d62;
    border-radius: 50%;
  }
`;

const HeroVisual = styled.div`
  padding: 35px 35px 25px 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 0 20px 25px;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  min-height: 450px;
  position: relative;
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.03),
      rgba(0, 0, 0, 0.25)
    ),
    url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200")
    center 35% / cover;

  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 35px;

  @media (max-width: 600px) {
    min-height: 380px;
  }
`;

const ImageOverlay = styled.div`
  color: white;
  text-align: right;

  strong {
    display: block;
    font-size: 65px;
    font-weight: 800;
    letter-spacing: -4px;
  }

  p {
    font-size: 9px;
    letter-spacing: 3px;
  }
`;

const ImageCaption = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  font-size: 9px;
  letter-spacing: 1px;
  color: #777;
`;

// ================= INTRO =================

const Intro = styled.section`
  padding: 115px 12%;
  text-align: center;

  h2 {
    font-size: clamp(32px, 5vw, 57px);
    line-height: 1.05;
    letter-spacing: -2px;
    margin: 0 auto;
    max-width: 800px;
  }

  h2 span {
    color: transparent;
    -webkit-text-stroke: 1px var(--black);
  }

  p {
    max-width: 630px;
    margin: 28px auto 0;
    font-size: 14px;
    line-height: 2;
    color: #777;
  }

  @media (max-width: 600px) {
    padding: 80px 25px;

    h2 {
      font-size: 34px;
      letter-spacing: -1px;
    }

    p {
      font-size: 13px;
    }
  }
`;

// ================= SHARED SECTIONS =================

const Section = styled.section`
  padding: 100px 10%;

  @media (max-width: 600px) {
    padding: 75px 22px;
  }
`;

const SectionHeading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 45px;

  h2 {
    font-size: clamp(28px, 4vw, 43px);
    letter-spacing: -1.5px;
    margin: 0;
  }

  > p {
    max-width: 300px;
    color: #777;
    font-size: 13px;
    line-height: 1.8;
    margin: 0;
  }

  @media (max-width: 600px) {
    display: block;
    margin-bottom: 30px;

    h2 {
      font-size: 30px;
    }

    > p {
      margin-top: 18px;
    }
  }
`;

// ================= CONDITIONS =================

const Conditions = styled(Section)`
  background: var(--light);
`;

const ConditionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ConditionCard = styled.article`
  min-height: 245px;
  padding: 30px 25px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  transition: 0.3s;

  &:hover {
    background: white;
  }

  > span {
    display: inline-flex;
    font-size: 11px;
    color: #999;
    border: 1px solid #ccc;
    width: 35px;
    height: 35px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-bottom: 35px;
  }

  h3 {
    font-size: 16px;
    margin: 0 0 13px;
  }

  p {
    font-size: 12px;
    line-height: 1.9;
    color: #777;
    margin: 0;
  }

  @media (max-width: 600px) {
    min-height: auto;
    padding: 25px;

    > span {
      margin-bottom: 20px;
    }
  }
`;

const ImportantNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: white;
  padding: 22px;
  margin-top: 25px;

  > span {
    flex-shrink: 0;
    width: 23px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #999;
    border-radius: 50%;
    font-size: 12px;
  }

  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.8;
    color: #666;
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

// ================= REASONS =================

const ReasonList = styled.div`
  border-top: 1px solid var(--border);
`;

const ReasonItem = styled.article`
  display: grid;
  grid-template-columns: 60px 1fr 35px;
  gap: 25px;
  align-items: center;
  padding: 27px 10px;
  border-bottom: 1px solid var(--border);
  transition: 0.3s ease;

  &:hover {
    padding-left: 20px;
    background: #fafafa;
  }

  @media (max-width: 600px) {
    grid-template-columns: 35px 1fr 20px;
    gap: 12px;
    padding: 23px 5px;
  }
`;

const ReasonNumber = styled.span`
  font-size: 12px;
  color: #999;
`;

const ReasonContent = styled.div`
  h3 {
    font-size: 17px;
    margin: 0 0 7px;
  }

  p {
    color: #777;
    font-size: 12px;
    line-height: 1.7;
    margin: 0;
  }

  @media (max-width: 600px) {
    h3 {
      font-size: 14px;
    }

    p {
      font-size: 11px;
    }
  }
`;

const ReasonArrow = styled.span`
  font-size: 19px;
  color: #777;
`;

// ================= PROCESS =================

const Process = styled(Section)`
  background: var(--black);
  color: white;
`;

const ProcessHeading = styled.div`
  text-align: center;
  margin-bottom: 75px;

  ${SectionLabel} {
    color: #999;
  }

  h2 {
    font-size: clamp(38px, 6vw, 65px);
    line-height: 1;
    letter-spacing: -2px;
    margin: 0;
  }

  h2 span {
    color: transparent;
    -webkit-text-stroke: 1px white;
  }

  @media (max-width: 600px) {
    text-align: left;
    margin-bottom: 45px;

    h2 {
      font-size: 45px;
    }
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 45px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 35px;
  }
`;

const StepCard = styled.article`
  .number {
    display: block;
    font-size: 34px;
    font-weight: 300;
    color: #aaa;
    margin-bottom: 25px;
  }

  .line {
    height: 1px;
    width: 100%;
    background: #555;
    margin-bottom: 25px;
  }

  h3 {
    font-size: 16px;
    margin: 0 0 15px;
  }

  p {
    color: #aaa;
    font-size: 12px;
    line-height: 1.9;
    margin: 0;
  }

  @media (max-width: 600px) {
    .number {
      margin-bottom: 12px;
    }

    .line {
      margin-bottom: 18px;
    }
  }
`;

// ================= SOLUTIONS =================

const SolutionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 44px);
  max-width: 700px;
  letter-spacing: -1.5px;
  line-height: 1.15;
  margin: 0 0 55px;

  @media (max-width: 600px) {
    font-size: 33px;
  }
`;

const SolutionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 35px;
  border-top: 1px solid var(--border);

  > div {
    padding-top: 25px;
  }

  span {
    font-size: 11px;
    color: #999;
  }

  h3 {
    font-size: 22px;
    margin: 25px 0 12px;
  }

  p {
    font-size: 13px;
    line-height: 1.9;
    color: #777;
    margin: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;

    > div {
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }

    h3 {
      margin-top: 15px;
    }
  }
`;

// ================= FAQ =================

const FaqSection = styled.section`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 80px;
  padding: 110px 10%;
  background: var(--light);

  @media (max-width: 900px) {
    gap: 40px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 35px;
    padding: 75px 22px;
  }
`;

const FaqHeading = styled.div`
  h2 {
    font-size: clamp(38px, 5vw, 58px);
    line-height: 1;
    letter-spacing: -2px;
    margin: 0;
  }

  h2 span {
    color: transparent;
    -webkit-text-stroke: 1px var(--black);
  }

  > p {
    color: #777;
    font-size: 13px;
    line-height: 1.9;
    max-width: 300px;
    margin-top: 25px;
  }
`;

const FaqList = styled.div`
  border-top: 1px solid #ddd;
`;

const FaqItem = styled.article`
  border-bottom: 1px solid #ddd;

  button {
    width: 100%;
    border: 0;
    background: transparent;
    padding: 23px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    text-align: left;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    color: var(--black);
  }

  button:focus-visible {
    outline: 2px solid var(--black);
    outline-offset: 4px;
  }

  .toggle {
    font-size: 23px;
    font-weight: 300;
    flex-shrink: 0;
  }

  .answer {
    padding: 0 30px 23px 0;
    font-size: 12px;
    color: #777;
    line-height: 1.9;
    animation: ${fadeUp} 0.25s ease;
  }
`;

// ================= FINAL CTA =================

const FinalCTA = styled.section`
  background: var(--black);
  color: white;
  text-align: center;
  padding: 105px 20px 50px;

  > span {
    font-size: 10px;
    letter-spacing: 3px;
    color: #aaa;
  }

  h2 {
    font-size: clamp(55px, 9vw, 105px);
    letter-spacing: -5px;
    line-height: 0.9;
    margin: 35px 0 25px;
  }

  h2 span {
    color: transparent;
    -webkit-text-stroke: 1px white;
  }

  > p {
    max-width: 480px;
    margin: 0 auto 35px;
    font-size: 13px;
    line-height: 1.9;
    color: #aaa;
  }

  small {
    display: block;
    margin-top: 85px;
    padding-top: 25px;
    border-top: 1px solid #333;
    font-size: 9px;
    letter-spacing: 2px;
    color: #888;
  }

  @media (max-width: 600px) {
    padding: 80px 20px 35px;

    h2 {
      font-size: 65px;
      letter-spacing: -3px;
    }

    > p {
      font-size: 12px;
    }

    small {
      margin-top: 65px;
    }
  }
`;

// ================= DATA =================

const reasons = [
  {
    number: "01",
    title: "Article défectueux",
    description:
      "Le vêtement présente un défaut de fabrication, une couture abîmée ou une détérioration à la réception.",
  },
  {
    number: "02",
    title: "Mauvaise taille",
    description:
      "La taille reçue ne correspond pas à celle sélectionnée lors de votre commande.",
  },
  {
    number: "03",
    title: "Article incorrect",
    description:
      "Vous avez reçu un modèle, une couleur ou un article différent de celui commandé.",
  },
  {
    number: "04",
    title: "Article endommagé",
    description:
      "Votre vêtement présente une tache, une déchirure ou un dommage constaté à la livraison.",
  },
  {
    number: "05",
    title: "Commande incomplète",
    description:
      "Un ou plusieurs articles de votre commande sont manquants.",
  },
  {
    number: "06",
    title: "Changement d'avis",
    description:
      "Vous souhaitez retourner un article conformément aux conditions applicables aux retours.",
  },
];

const steps = [
  {
    number: "01",
    title: "Soumettez votre demande",
    description:
      "Retrouvez votre commande et sélectionnez le produit que vous souhaitez retourner.",
  },
  {
    number: "02",
    title: "Expliquez le problème",
    description:
      "Indiquez le motif de votre demande et ajoutez les photos nécessaires à son examen.",
  },
  {
    number: "03",
    title: "Examen de votre demande",
    description:
      "Notre équipe vérifie votre dossier et vous communique la décision ainsi que les prochaines étapes.",
  },
  {
    number: "04",
    title: "Finalisation du retour",
    description:
      "Selon la situation, nous organisons la suite : échange, remboursement ou autre solution appropriée.",
  },
];

const faqs = [
  {
    question: "Combien de temps ai-je pour effectuer un retour ?",
    answer:
      "Le délai dépend du motif du retour et des dispositions légales applicables. Consultez les conditions de retour associées à votre achat. Les garanties légales restent applicables.",
  },
  {
    question: "Puis-je retourner un vêtement déjà porté ?",
    answer:
      "Pour un retour lié à un changement d'avis, le vêtement doit normalement être conservé dans son état d'origine, non porté, non lavé et avec ses étiquettes. Cette exigence ne limite pas vos droits en cas de défaut ou de non-conformité.",
  },
  {
    question: "Dois-je fournir des photos ?",
    answer:
      "Pour un article endommagé, défectueux ou incorrect, des photos permettent à notre équipe de mieux comprendre la situation. Nous pouvons vous demander des informations complémentaires si nécessaire.",
  },
  {
    question: "Le retour est-il automatiquement accepté ?",
    answer:
      "Non. Chaque demande est examinée selon son motif, les informations fournies et les conditions applicables. Une demande peut nécessiter des justificatifs complémentaires.",
  },
  {
    question: "Puis-je obtenir un remboursement ?",
    answer:
      "La solution proposée dépend du motif du retour, de la situation et des règles applicables. Lorsqu'un remboursement est dû, nous vous communiquons les modalités de traitement.",
  },
  {
    question: "Comment suivre ma demande ?",
    answer:
      "Après l'envoi de votre demande, vous pourrez retrouver son état d'avancement depuis notre espace de suivi à l'aide de votre référence de dossier.",
  },
];

// ================= MAIN COMPONENT =================

export default function ReturnsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <Page>

      {/* HERO */}
      <Hero>
        <HeroContent>
          <Eyebrow>NUMA / SERVICE CLIENT</Eyebrow>

          <h1>
            RETOURS
            <br />
            <span>& ÉCHANGES.</span>
          </h1>

          <p>
            Parce que votre satisfaction compte.
            Si votre commande ne correspond pas à vos attentes
            ou présente un problème, notre équipe est là pour vous accompagner.
          </p>

          <PrimaryButton href="/returns/request">
            INITIER UN RETOUR <span>↗</span>
          </PrimaryButton>

          <HeroNote>
            <span />
            Un accompagnement simple et transparent
          </HeroNote>
        </HeroContent>

        <HeroVisual>
          <HeroImage>
            <ImageOverlay>
              <strong>NUMA</strong>
              <p>MADE TO BE YOURS.</p>
            </ImageOverlay>
          </HeroImage>

          <ImageCaption>
            <span>NUMA ESSENTIALS</span>
            <span>COLLECTION / 2026</span>
          </ImageCaption>
        </HeroVisual>
      </Hero>

      {/* INTRO */}
      <Intro>
        <SectionLabel>01 — NOTRE ENGAGEMENT</SectionLabel>

        <h2>
          UNE EXPÉRIENCE
          <br />
          <span>À LA HAUTEUR DE VOS ATTENTES.</span>
        </h2>

        <p>
          Chez NUMA, nous accordons une attention particulière
          à chaque commande. Si un article présente un problème,
          nous mettons tout en œuvre pour trouver une solution adaptée.
          Consultez nos conditions avant de soumettre votre demande.
        </p>
      </Intro>

      {/* CONDITIONS */}
      <Conditions>
        <SectionHeading>
          <div>
            <SectionLabel>02 — AVANT DE COMMENCER</SectionLabel>
            <h2>LES CONDITIONS DE RETOUR</h2>
          </div>
          <p>
            Quelques informations essentielles
            pour préparer votre demande.
          </p>
        </SectionHeading>

        <ConditionGrid>
          <ConditionCard>
            <span>01</span>
            <h3>Votre commande</h3>
            <p>
              La demande doit concerner une commande réellement
              effectuée auprès de NUMA. Votre numéro de commande
              pourra être demandé.
            </p>
          </ConditionCard>

          <ConditionCard>
            <span>02</span>
            <h3>L'état du vêtement</h3>
            <p>
              Pour un retour lié à un changement d'avis,
              le vêtement doit être conservé dans son état d'origine,
              avec ses étiquettes et accessoires.
            </p>
          </ConditionCard>

          <ConditionCard>
            <span>03</span>
            <h3>Les justificatifs</h3>
            <p>
              Pour un article défectueux, endommagé ou incorrect,
              des photos et une description précise peuvent être demandées.
            </p>
          </ConditionCard>

          <ConditionCard>
            <span>04</span>
            <h3>La vérification</h3>
            <p>
              Chaque demande est examinée individuellement.
              Des informations supplémentaires peuvent être nécessaires.
            </p>
          </ConditionCard>
        </ConditionGrid>

        <ImportantNote>
          <span>!</span>
          <p>
            <strong>Important :</strong> les conditions de conservation
            du vêtement ne doivent pas faire obstacle à l'exercice
            de vos droits en cas de défaut, de non-conformité ou
            de garantie légale. Les droits prévus par la réglementation
            applicable prévalent sur les présentes modalités.
          </p>
        </ImportantNote>
      </Conditions>

      {/* REASONS */}
      <Section>
        <SectionHeading>
          <div>
            <SectionLabel>03 — MOTIFS DE RETOUR</SectionLabel>
            <h2>POUR QUELLE RAISON ?</h2>
          </div>
          <p>
            Sélectionnez le motif correspondant
            à votre situation lors de votre demande.
          </p>
        </SectionHeading>

        <ReasonList>
          {reasons.map((reason) => (
            <ReasonItem key={reason.number}>
              <ReasonNumber>{reason.number}</ReasonNumber>

              <ReasonContent>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </ReasonContent>

              <ReasonArrow>↗</ReasonArrow>
            </ReasonItem>
          ))}
        </ReasonList>
      </Section>

      {/* PROCESS */}
      <Process>
        <ProcessHeading>
          <SectionLabel>04 — COMMENT ÇA MARCHE ?</SectionLabel>

          <h2>
            4 ÉTAPES.
            <br />
            <span>TOUT SIMPLEMENT.</span>
          </h2>
        </ProcessHeading>

        <StepsGrid>
          {steps.map((step) => (
            <StepCard key={step.number}>
              <span className="number">{step.number}</span>
              <div className="line" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </StepCard>
          ))}
        </StepsGrid>
      </Process>

      {/* SOLUTIONS */}
      <Section>
        <SectionLabel>05 — NOS SOLUTIONS</SectionLabel>

        <SolutionTitle>
          UNE SOLUTION ADAPTÉE À VOTRE SITUATION.
        </SolutionTitle>

        <SolutionGrid>
          <div>
            <span>01 /</span>
            <h3>Échange</h3>
            <p>
              Un remplacement du produit lorsque cela est possible
              et adapté à votre situation.
            </p>
          </div>

          <div>
            <span>02 /</span>
            <h3>Remboursement</h3>
            <p>
              Un remboursement lorsque les conditions légales
              ou commerciales applicables le prévoient.
            </p>
          </div>

          <div>
            <span>03 /</span>
            <h3>Autre solution</h3>
            <p>
              Une solution appropriée selon la nature du problème
              et les circonstances de votre demande.
            </p>
          </div>
        </SolutionGrid>
      </Section>

      {/* FAQ */}
      <FaqSection>
        <FaqHeading>
          <SectionLabel>06 — BESOIN D'AIDE ?</SectionLabel>

          <h2>
            QUESTIONS
            <br />
            <span>FRÉQUENTES.</span>
          </h2>

          <p>
            Retrouvez les réponses aux questions
            les plus fréquentes concernant les retours NUMA.
          </p>
        </FaqHeading>

        <FaqList>
          {faqs.map((faq, index) => (
            <FaqItem key={index}>
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                aria-expanded={openFaq === index}
              >
                <span>{faq.question}</span>
                <span className="toggle">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <div className="answer">
                  {faq.answer}
                </div>
              )}
            </FaqItem>
          ))}
        </FaqList>
      </FaqSection>

      {/* FINAL CTA */}
      <FinalCTA>
        <Eyebrow>NUMA / WE ARE HERE FOR YOU</Eyebrow>

        <h2>
          ON S'OCCUPE
          <br />
          <span>DE TOUT.</span>
        </h2>

        <p>
          Vous avez rencontré un problème avec votre commande ?
          Lancez votre demande et laissez notre équipe vous accompagner.
        </p>

        <WhiteButton href="/returns/request">
          COMMENCER MA DEMANDE <span>↗</span>
        </WhiteButton>

        <small>NUMA — YOUR STYLE, YOUR STORY.</small>
      </FinalCTA>

    </Page>
  );
}
