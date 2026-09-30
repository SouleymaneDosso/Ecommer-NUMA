import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaWhatsapp,
  FaShoppingBag,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 100px 20px 70px;

  background:
    radial-gradient(
      circle at 15% 10%,
      rgba(37, 211, 102, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 45%,
      rgba(255, 105, 180, 0.07),
      transparent 30%
    ),
    linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
`;

const Container = styled.div`
  width: min(900px, 100%);
  margin: 0 auto;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 55px;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 18px;

  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;

  color: #1f8f41;

  &::before,
  &::after {
    content: "";
    width: 25px;
    height: 1px;
    background: currentColor;
    opacity: 0.5;
  }
`;

const Title = styled.h1`
  margin: 0 0 18px;

  font-size: clamp(2.3rem, 6vw, 4.5rem);
  line-height: 1;
  letter-spacing: -0.05em;

  color: #111;
`;

const Intro = styled.p`
  max-width: 650px;
  margin: 0 auto;

  font-size: 1.05rem;
  line-height: 1.8;

  color: #555;
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  margin-bottom: 45px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  position: relative;

  padding: 30px 24px;

  background: white;

  border: 1px solid rgba(0, 0, 0, 0.07);

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.07);

  text-align: center;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.11);
  }
`;

const StepNumber = styled.div`
  position: absolute;

  top: 15px;
  right: 18px;

  font-size: 0.7rem;
  font-weight: 800;

  color: #999;
`;

const IconCircle = styled.div`
  width: 65px;
  height: 65px;

  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ $green }) =>
    $green ? "rgba(37, 211, 102, 0.12)" : "rgba(255, 105, 180, 0.12)"};

  color: ${({ $green }) => ($green ? "#1f8f41" : "#ff69b4")};

  font-size: 25px;
`;

const StepTitle = styled.h2`
  margin: 0 0 10px;

  font-size: 1.15rem;
`;

const StepText = styled.p`
  margin: 0;

  font-size: 0.9rem;
  line-height: 1.7;

  color: #666;
`;

const Explanation = styled.section`
  padding: 35px;

  margin-bottom: 25px;

  background: #111;

  color: white;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.18);

  @media (max-width: 600px) {
    padding: 27px 22px;
  }
`;

const ExplanationTitle = styled.h2`
  margin: 0 0 20px;

  font-size: clamp(1.5rem, 4vw, 2.2rem);

  letter-spacing: -0.03em;
`;

const ExplanationText = styled.p`
  margin: 0 0 15px;

  line-height: 1.8;

  color: rgba(255, 255, 255, 0.75);

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckoutBox = styled.div`
  padding: 30px;

  margin-bottom: 35px;

  background: #fff;

  border: 2px solid rgba(37, 211, 102, 0.18);

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.06);

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

const CheckoutTitle = styled.h2`
  margin: 0 0 15px;

  font-size: 1.35rem;
`;

const CheckoutText = styled.p`
  margin: 0 0 18px;

  line-height: 1.75;

  color: #555;
`;

const CheckoutStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  padding: 13px 0;

  border-bottom: 1px solid rgba(0, 0, 0, 0.07);

  &:last-child {
    border-bottom: none;
  }

  svg {
    flex-shrink: 0;

    margin-top: 3px;

    color: #1f8f41;
  }
`;

const WhatsappBox = styled.div`
  padding: 30px;

  margin-bottom: 35px;

  background: #25d366;

  color: white;

  text-align: center;

  box-shadow: 0 18px 45px rgba(37, 211, 102, 0.25);
`;

const WhatsappIcon = styled.div`
  font-size: 42px;
  margin-bottom: 12px;
`;

const WhatsappTitle = styled.h2`
  margin: 0 0 10px;

  font-size: 1.5rem;
`;

const WhatsappText = styled.p`
  max-width: 560px;

  margin: 0 auto 22px;

  line-height: 1.7;

  color: rgba(255, 255, 255, 0.9);
`;

const WhatsappButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 14px 22px;

  border-radius: 999px;

  background: white;
  color: #168c38;

  text-decoration: none;

  font-weight: 800;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);

    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: #111;

  text-decoration: none;

  font-weight: 700;

  transition: gap 0.25s ease;

  &:hover {
    gap: 13px;
  }
`;

export default function PaiementTroisFois() {
  return (
    <PageWrapper>
      <Container>
        <Hero>
          <Eyebrow>Paiement flexible</Eyebrow>

          <Title>Paiement en 3 fois</Title>

          <Intro>
            Vous souhaitez commander une pièce mais préférez répartir votre
            paiement ? Numa vous permet de régler votre commande en{" "}
            <strong>trois tranches</strong>, avec un délai maximal d'un mois.
          </Intro>
        </Hero>

        <Steps>
          <StepCard>
            <StepNumber>01</StepNumber>

            <IconCircle>
              <FaShoppingBag />
            </IconCircle>

            <StepTitle>Choisissez votre pièce</StepTitle>

            <StepText>
              Sélectionnez le produit que vous souhaitez commander et renseignez
              vos informations de livraison.
            </StepText>
          </StepCard>

          <StepCard>
            <StepNumber>02</StepNumber>

            <IconCircle $green>
              <FaCreditCard />
            </IconCircle>

            <StepTitle>Choisissez 3 fois</StepTitle>

            <StepText>
              Au moment du paiement, cochez l'option{" "}
              <strong>« Paiement en trois tranches »</strong>.
            </StepText>
          </StepCard>

          <StepCard>
            <StepNumber>03</StepNumber>

            <IconCircle>
              <FaCheckCircle />
            </IconCircle>

            <StepTitle>Réglez progressivement</StepTitle>

            <StepText>
              Effectuez vos trois paiements dans un délai maximal d'un mois pour
              finaliser votre commande.
            </StepText>
          </StepCard>
        </Steps>

        <Explanation>
          <ExplanationTitle>
            Comment cela fonctionne concrètement ?
          </ExplanationTitle>

          <ExplanationText>
            Lorsque vous arrivez sur la page{" "}
            <strong>Checkout / Livraison</strong>, commencez par renseigner
            normalement vos informations de livraison.
          </ExplanationText>

          <ExplanationText>
            Une fois vos informations complétées, rendez-vous dans la section
            des moyens de paiement et cochez le bouton radio{" "}
            <strong>« Paiement en trois tranches »</strong>.
          </ExplanationText>

          <ExplanationText>
            Votre commande sera alors enregistrée avec ce mode de paiement. Vous
            pourrez suivre vos paiements depuis votre espace compte.
          </ExplanationText>

          <ExplanationText>
            Le paiement doit être entièrement effectué dans un délai maximal
            d'un mois.
          </ExplanationText>
        </Explanation>

        <CheckoutBox>
          <CheckoutTitle>
            📦 Sur la page Checkout, faites simplement ceci :
          </CheckoutTitle>

          <CheckoutStep>
            <FaCheckCircle />

            <span>
              <strong>1. Renseignez vos informations de livraison</strong>
            </span>
          </CheckoutStep>

          <CheckoutStep>
            <FaCheckCircle />

            <span>
              <strong>2. Choisissez « Paiement en trois tranches »</strong>
            </span>
          </CheckoutStep>

          <CheckoutStep>
            <FaCheckCircle />

            <span>
              <strong>3. Validez votre commande</strong>
            </span>
          </CheckoutStep>

          <CheckoutStep>
            <FaClock />

            <span>
              Vous disposez ensuite d'un délai maximal d'un mois pour effectuer
              les trois paiements.
            </span>
          </CheckoutStep>

          <CheckoutStep>
            <FaShieldAlt />

            <span>
              Les informations relatives à votre commande et à vos paiements
              restent accessibles depuis votre espace compte.
            </span>
          </CheckoutStep>
        </CheckoutBox>

        <WhatsappBox>
          <WhatsappIcon>
            <FaWhatsapp />
          </WhatsappIcon>

          <WhatsappTitle>Besoin d'aide ?</WhatsappTitle>

          <WhatsappText>
            Une question concernant le paiement en trois fois, votre commande ou
            votre livraison ? Notre équipe est disponible sur WhatsApp.
          </WhatsappText>

          <WhatsappButton
            href="https://wa.me/2250700247693"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Écrire sur WhatsApp
          </WhatsappButton>
        </WhatsappBox>

        <BackLink to="/">
          ← Retour à l'accueil
          <FaArrowRight />
        </BackLink>
      </Container>
    </PageWrapper>
  );
}
