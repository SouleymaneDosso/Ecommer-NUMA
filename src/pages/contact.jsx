// src/pages/Contact.jsx
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux intégrer un backend ou EmailJS pour l'envoi
    console.log("Message envoyé :", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Contactez-nous</h1>

      <p style={{ textAlign: "center", marginBottom: "2rem" }}>
        Pour toute question, suggestion ou partenariat, contactez notre équipe. Nous répondrons dans les plus brefs délais.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: "0.8rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: "0.8rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <textarea
            name="message"
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            style={{ padding: "0.8rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              padding: "1rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Envoyer
          </button>
        </form>

        {submitted && (
          <p style={{ marginTop: "1rem", color: "green", textAlign: "center" }}>
            Merci ! Votre message a été envoyé avec succès.
          </p>
        )}

        {/* Coordonnées */}
        <section style={{ textAlign: "center" }}>
          <h2>Nos coordonnées</h2>
          <p>Email : <a href="mailto:numa7433@gmail.com">numa7433@gmail.com</a></p>
          <p>Téléphone : <a href="tel:0584220157">0584220157</a></p>
          <p>WhatsApp : <a href="https://wa.me/2250700247693" target="_blank" rel="noopener noreferrer">0700247693</a></p>
          <p>Adresse : Abidjan, Côte d'Ivoire</p>
        </section>

        {/* Carte Google Maps */}
        <section style={{ marginTop: "2rem", textAlign: "center" }}>
          <h2>Notre localisation</h2>
          <div style={{ width: "100%", height: "450px", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
            <iframe
              title="Localisation Numa Abidjan"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.3285935180447!2d-4.012!3d5.347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc197b1!2sAbidjan!5e0!3m2!1sfr!2sci!4v1700000000000!5m2!1sfr!2sci"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
