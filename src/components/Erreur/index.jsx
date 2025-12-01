import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

/* ------------------- STYLES ------------------- */

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: url('/hotel-background.jpg') center/cover no-repeat;
  color: #fff;
  text-align: center;
  padding: 20px;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
`;

const ErrorContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 8rem;
  margin: 0;
  font-weight: 900;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin: 20px 0;
  font-weight: 400;
`;

const Text = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;

  @media(min-width: 600px){
    flex-direction: row;
  }
`;

const HomeButton = styled(Link)`
  background: #fff;
  color: #000;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const WhatsappButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25d366;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-3px);
  }

  svg {
    font-size: 1.5rem;
  }
`;

/* ------------------- COMPONENT ------------------- */

export default function ErrorPage() {
  return (
    <ErrorWrapper>
      <Overlay />
      <ErrorContent>
        <Title>404</Title>
        <Subtitle>Oups ! Page introuvable</Subtitle>
        <Text>
          La page que vous cherchez n'existe pas ou a été déplacée. 
          Mais ne vous inquiétez pas, nous sommes là pour vous aider.
        </Text>
        <ButtonGroup>
          <HomeButton to="/">Retour à l'accueil</HomeButton>
          <WhatsappButton
            href="https://wa.me/0700247693"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Nous écrire
          </WhatsappButton>
        </ButtonGroup>
      </ErrorContent>
    </ErrorWrapper>
  );
}
