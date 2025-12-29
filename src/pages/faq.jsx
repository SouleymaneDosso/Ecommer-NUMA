// src/pages/FAQ.jsx
import React, { useState } from "react";

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

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Foire aux Questions (FAQ)</h1>

      {faqData.map((item, index) => (
        <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => toggleIndex(index)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "1rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "none",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {item.question}
          </button>
          {activeIndex === index && (
            <p style={{ padding: "0 1rem 1rem 1rem", color: "#555" }}>{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
