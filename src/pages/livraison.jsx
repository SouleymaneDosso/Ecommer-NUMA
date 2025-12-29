// src/pages/Delivery.jsx
import React from "react";

const Delivery = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Politique de Livraison</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>
          Chez <strong>Numa</strong>, nous nous engageons à vous offrir une expérience d’achat agréable et rapide. Nos services de livraison
          sont conçus pour garantir que vos articles arrivent en parfait état et dans les meilleurs délais.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Délais de livraison</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Livraison express en Côte d’Ivoire : <strong>24 à 48 heures</strong> après confirmation de la commande.</li>
          <li>Livraison standard en Afrique : <strong>3 à 7 jours ouvrables</strong>, selon le pays de destination.</li>
          <li>Livraison internationale : <strong>7 à 15 jours ouvrables</strong>, selon la zone géographique et le transporteur.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Frais de livraison</h2>
        <p>
          Les frais de livraison sont calculés automatiquement lors de la validation de votre commande, en fonction de votre adresse et du mode de livraison choisi.
          Nous proposons des options adaptées à vos besoins : express ou standard.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Suivi de commande</h2>
        <p>
          Après la confirmation de votre commande, vous recevrez un numéro de suivi pour suivre votre livraison en temps réel.
          Vous serez informé(e) par email ou WhatsApp de chaque étape de l’acheminement de votre colis.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Emballage et sécurité</h2>
        <p>
          Tous nos articles sont soigneusement emballés pour garantir qu’ils arrivent en parfait état.
          Chaque colis Numa reflète notre attention aux détails et notre engagement envers la qualité.
        </p>
      </section>

      <section>
        <p style={{ fontStyle: "italic" }}>
          Nous nous engageons à rendre votre expérience d’achat avec Numa simple, rapide et sécurisée, du clic jusqu’à la réception de votre commande.
        </p>
      </section>
    </div>
  );
};

export default Delivery;
