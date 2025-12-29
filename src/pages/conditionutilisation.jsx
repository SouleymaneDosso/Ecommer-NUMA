// src/pages/TermsOfUse.jsx
import React from "react";

const TermsOfUse = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Conditions d’Utilisation</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <p>
          Bienvenue sur le site <strong>Numa</strong>. En accédant à notre site ou en utilisant nos services, vous acceptez de respecter
          les présentes conditions d’utilisation. Si vous n’acceptez pas ces conditions, veuillez ne pas utiliser notre site.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>1. Utilisation du site</h2>
        <p>
          Vous vous engagez à utiliser le site Numa uniquement à des fins légales et conformément aux lois en vigueur.
          Toute utilisation frauduleuse, abusive ou illégale est strictement interdite.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>2. Création de compte</h2>
        <p>
          Pour passer une commande, vous pouvez créer un compte sur notre site. Vous êtes responsable de la confidentialité
          de vos informations et de toutes les activités effectuées depuis votre compte.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>3. Propriété intellectuelle</h2>
        <p>
          Tous les contenus du site, y compris les textes, images, logos et designs, sont la propriété de Numa ou de ses partenaires.
          Toute reproduction ou utilisation sans autorisation est interdite.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>4. Commandes et paiement</h2>
        <p>
          Les commandes passées sur le site sont soumises à disponibilité et confirmation. Le paiement doit être effectué selon les
          modes proposés sur le site. Numa se réserve le droit d’annuler toute commande en cas de problème de paiement.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>5. Limitation de responsabilité</h2>
        <p>
          Numa ne pourra être tenue responsable des dommages indirects, pertes de données ou retards liés à l’utilisation du site ou
          à la livraison des produits, dans les limites autorisées par la loi.
        </p>
      </section>

      <section>
        <p style={{ fontStyle: "italic" }}>
          En utilisant le site Numa, vous acceptez ces conditions et vous engagez à les respecter. Nous vous remercions pour votre confiance
          et votre fidélité.
        </p>
      </section>
    </div>
  );
};

export default TermsOfUse;
