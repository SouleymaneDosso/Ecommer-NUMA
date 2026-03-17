import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding: 80px 20px 40px 20px;
  max-width: 800px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  margin-bottom: 12px;
  line-height: 1.6;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  color: #1f8f41;
  text-decoration: underline;
`;

export default function PaiementTroisFois() {
  return (
    <PageWrapper>
      <Title>Paiement en 3 fois</Title>
      <Paragraph>
        Le paiement en trois phases vous permet de <strong>réserver un produit et payer à votre rythme</strong> 
        avec un délai maximal de 1 mois.
      </Paragraph>
      <Paragraph>
        Toutes vos transactions et informations sont disponibles dans votre <strong>espace compte</strong>. 
        L’administrateur confirme ou rejette le paiement si nécessaire.
      </Paragraph>
      <Paragraph>
        En cas de besoin, vous pouvez contacter l’administrateur par appel ou WhatsApp au : <strong>0700247693</strong>.
      </Paragraph>
      <BackLink to="/">← Retour à l’accueil</BackLink>
    </PageWrapper>
  );
}