import { useEffect, useState } from "react";

// Hook pour gérer les cookies et les scripts tiers
export function useCookieConsent() {
  const [preferences, setPreferences] = useState({
    essential: true,  // toujours actif
    marketing: false, // newsletter / Brevo
  });

  // Lire le cookie au démarrage
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

  useEffect(() => {
    if (preferences.marketing) {
      console.log("Consentement marketing accepté : tu peux initier newsletter ou scripts tiers");
    }
  }, [preferences]);

  // Fonction pour modifier le consentement
  const updatePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    document.cookie = `cookieConsent=${JSON.stringify(newPrefs)}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return { preferences, updatePreferences };
}
