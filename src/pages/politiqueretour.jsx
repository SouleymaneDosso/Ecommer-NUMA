// src/pages/ReturnPolicy.jsx
import React from "react";

const ReturnPolicy = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Politique de Retour</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>
          Chez <strong>Numa</strong>, nous voulons que vous soyez entièrement satisfait(e) de vos achats. Si pour une raison quelconque
          vous n’êtes pas satisfait(e) de votre commande, nous offrons une politique de retour simple et transparente.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Conditions de retour</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Les retours sont acceptés dans un délai de <strong>7 jours</strong> après la réception de votre commande.</li>
          <li>Les articles doivent être dans leur état d’origine, non portés, non lavés et avec toutes les étiquettes attachées.</li>
          <li>Les articles soldés ou personnalisés ne sont pas éligibles au retour.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Processus de retour</h2>
        <ol style={{ paddingLeft: "1.5rem" }}>
          <li>Contactez notre service client à <a href="mailto:numa7433@gmail.com">numa7433@gmail.com</a> ou via WhatsApp au <a href="https://wa.me/2250700247693" target="_blank" rel="noopener noreferrer">0700247693</a> pour notifier le retour.</li>
          <li>Indiquez votre numéro de commande et le(s) article(s) à retourner.</li>
          <li>Emballez soigneusement les articles et envoyez-les à notre adresse : Abidjan, Côte d’Ivoire.</li>
        </ol>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Remboursements</h2>
        <p>
          Une fois votre retour reçu et vérifié, nous vous informerons par email et procéderons au remboursement via le même moyen de paiement
          utilisé lors de l’achat. Le remboursement sera effectué dans un délai de <strong>5 à 7 jours ouvrables</strong>.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Articles endommagés ou incorrects</h2>
        <p>
          Si vous recevez un article endommagé ou incorrect, contactez immédiatement notre service client pour que nous puissions corriger le problème
          rapidement, sans frais supplémentaires pour vous.
        </p>
      </section>

      <section>
        <p style={{ fontStyle: "italic" }}>
          Chez Numa, votre satisfaction est notre priorité. Nous nous engageons à rendre vos achats agréables, sûrs et sans stress.
        </p>
      </section>
    </div>
  );
};

export default ReturnPolicy;
