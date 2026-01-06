// src/pages/FAQ.jsx
import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../Utils/Context";

/* ===== STYLED COMPONENTS ===== */
const PageWrapper = styled.div`
  font-family: Arial, sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

const QuestionWrapper = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.1)" : "#ddd")};
  padding-bottom: 0.5rem;
`;

const QuestionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

const Answer = styled.p`
  padding: 0 1rem 1rem 1rem;
  color: ${({ $isdark }) => ($isdark ? "#ccc" : "#555")};
`;

/* ===== FAQ DATA ===== */
const faqData = [
  {
    question: "Comment puis-je passer une commande sur Numa ?",
    answer: "Vous pouvez commander directement depuis notre site e-commerce. Sélectionnez vos articles, ajoutez-les au panier et suivez les instructions pour le paiement et la livraison."
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons les paiements par carte bancaire (Visa, MasterCard), mobile money et PayPal pour une expérience sécurisée et pratique."
  },
  {
    question: "Livrez-vous en dehors de la Côte d’Ivoire ?",
    answer: "Oui, nous livrons dans toute l’Afrique et certains pays européens. Les délais et frais varient selon la destination."
  },
  {
    question: "Comment suivre ma commande ?",
    answer: "Après confirmation de votre commande, vous recevrez un numéro de suivi que vous pourrez utiliser pour suivre votre livraison en temps réel."
  },
  {
    question: "Puis-je retourner un article si je ne suis pas satisfait ?",
    answer: "Oui, vous pouvez retourner un article dans un délai de 7 jours après réception, sous réserve que l’article soit en parfait état. Contactez notre service client pour plus d’informations."
  },
];

/* ===== COMPONENT ===== */
const FAQ = () => {
  const { theme } = useContext(ThemeContext);
  const $isdark = theme === "light";
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <PageWrapper $isdark={$isdark}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Foire aux Questions (FAQ)</h1>

      {faqData.map((item, index) => (
        <QuestionWrapper key={index} $isdark={$isdark}>
          <QuestionButton onClick={() => toggleIndex(index)} $isdark={$isdark}>
            {item.question}
          </QuestionButton>
          {activeIndex === index && <Answer $isdark={$isdark}>{item.answer}</Answer>}
        </QuestionWrapper>
      ))}
    </PageWrapper>
  );
};

export default FAQ;
