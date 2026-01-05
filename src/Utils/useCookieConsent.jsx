import { useEffect, useState } from "react";

// --- Hook pour gérer les cookies et les scripts tiers ---
export function useCookieConsent() {
  const [preferences, setPreferences] = useState({
    essential: true,   // toujours actif
    marketing: false,  // newsletter / Brevo
  });

  // --- Lire le cookie au démarrage ---
  useEffect(() => {
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookieConsent="));

    if (consentCookie) {
      try {
        const parsed = JSON.parse(consentCookie.split("=")[1]);
        setPreferences(parsed);
      } catch (err) {
        console.error("Impossible de parser le cookie existant", err);
      }
    }
  }, []);

  // --- Charger les scripts tiers selon consentement ---
  useEffect(() => {
    // Brevo Newsletter / Marketing
    if (preferences.marketing) {
      if (!document.getElementById("brevo-script")) {
        const script = document.createElement("script");
        script.id = "brevo-script";

        // Remplace URL et Key par ta clé Brevo
        script.src = "https://scripts.brevo.com/widget.js"; // Exemple
        script.async = true;

        document.body.appendChild(script);

        // Si tu as besoin d’initialiser avec ta clé
        const inline = document.createElement("script");
        inline.innerHTML = `
          window.brevoKey = "TA_CLE_BREVO_ICI"; // remplace par ta key Brevo
        `;
        document.body.appendChild(inline);
      }
    }
  }, [preferences]);

  return preferences;
}
