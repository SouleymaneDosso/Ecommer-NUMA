// // useCookieConsent.js
// import { useEffect, useState } from "react";

// export function useCookieConsent() {
//   const [preferences, setPreferences] = useState({
//     essential: true,
//     analytics: false,
//     marketing: false,
//   });

//   // Lire le cookie au démarrage
//   useEffect(() => {
//     const consent = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("cookieConsent="));
//     if (consent) {
//       try {
//         setPreferences(JSON.parse(consent.split("=")[1]));
//       } catch {
//         setPreferences({ essential: true, analytics: false, marketing: false });
//       }
//     }
//   }, []);

//   // Charger les scripts selon les préférences
//   useEffect(() => {
//     if (preferences.analytics) {
//       // Exemple : Google Analytics
//       if (!document.getElementById("ga-script")) {
//         const script = document.createElement("script");
//         script.id = "ga-script";
//         script.async = true;
//         script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"; // Remplace par ton ID
//         document.body.appendChild(script);

//         const inline = document.createElement("script");
//         inline.innerHTML = `
//           window.dataLayer = window.dataLayer || [];
//           function gtag(){dataLayer.push(arguments);}
//           gtag('js', new Date());
//           gtag('config', 'G-XXXXXXXXXX');
//         `;
//         document.body.appendChild(inline);
//       }
//     }

//     if (preferences.marketing) {
//       // Exemple : pixel Facebook
//       if (!document.getElementById("fb-pixel")) {
//         const script = document.createElement("script");
//         script.id = "fb-pixel";
//         script.innerHTML = `
//           !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//           n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
//           n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
//           t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
//           }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
//           fbq('init', 'TON_PIXEL_ID');
//           fbq('track', 'PageView');
//         `;
//         document.body.appendChild(script);
//       }
//     }
//   }, [preferences]);

//   return preferences;
// }
