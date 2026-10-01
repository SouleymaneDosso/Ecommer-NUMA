import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import toast from "react-hot-toast";
import { socket } from "./services/socket";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiX, FiArrowRight } from "react-icons/fi";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import GlobalStyle from "./GlobaleStyle";
import { ToggleTheme } from "./Utils/Context";
import { Panier } from "./Utils/Context";
import ScrollToTop from "./components/ScrollToTop";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Favorie from "./pages/favorie";
import Homme from "./pages/Homme";
import Femme from "./pages/Femme";
import Enfant from "./pages/Enfant";
import PagePanier from "./components/panier";
import Produit from "./pages/produits";
import New from "./pages/new";
import Promo from "./pages/promo";
import Apropos from "./pages/apropos";
import FAQ from "./pages/faq";
import Contact from "./pages/contact";
import ReturnPolicy from "./pages/politiqueretour";
import Delivery from "./pages/livraison";
import TermsOfUse from "./pages/conditionutilisation";
import Collection from "./pages/Collection";
import Signup from "./pages/inscription";
import Login from "./pages/connexion";
import Search from "./pages/recherche";
import CompteClient from "./pages/compteutilisateur";
import PaiementWave from "./pages/PaiementWave";
import PaiementSemiManuel from "./pages/PaiementSemiManuel";
import Merci from "./pages/Merci";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Erreur from "./components/Erreur";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import AdminProducts from "./pages/AdminProducts";
import AdminCommandes from "./pages/AdminCommande";
import AdminPaiements from "./pages/AdminPaiements";
import AdminPrecommandes from "./pages/AdminPrecommandes";
import PaiementTroisFois from "./pages/paiement-3x";
import InscriptionLivreur from "./connexionlivreur";
import ConnexionLivreur from "./connexionlivreur/connexion";
import LivreurAdmin from "./pages/livreuradmin";
import { Toaster } from "react-hot-toast";
import SuiviCommande from "./pages/SuiviCommande";
import AdminLivreurs from "./pages/AdminLivreurs";
import PaiementSuite from "./pages/PaiementSuite";
import "./i18n";
import Precommande from "./pages/Precommande";
import ReceptionPrecommande from "./pages/ReceptionPrecommande";
import { trackPage } from "./Utils/visitorTracking";
import AdminStatistiques from "./pages/AdminStatistiques";
import Conversation from "./pages/Conversation";

function GlobalNotifications() {
  const location = useLocation();
  const navigate = useNavigate();

  const notificationsRef = useRef(new Set());
  const audioContextRef = useRef(null);

  const jouerSonNotification = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

      oscillator.frequency.exponentialRampToValueAtTime(
        660,
        audioContext.currentTime + 0.12,
      );

      gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);

      gainNode.gain.exponentialRampToValueAtTime(
        0.08,
        audioContext.currentTime + 0.01,
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.18,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Le son est optionnel : on ne bloque jamais la notification.
    }
  };

  useEffect(() => {
    const handleNouveauMessage = (data) => {
      if (!data?.commandeId || !data?.nouveauMessage) {
        return;
      }

      const commandeId = String(data.commandeId);
      const message = data.nouveauMessage;

      /*
       * ---------------------------------------------------------
       * 1. Ne rien afficher si l'utilisateur est déjà dans
       *    cette conversation.
       * ---------------------------------------------------------
       */

      const conversationClient =
        location.pathname === `/conversation/${commandeId}`;

      const conversationLivreur =
        location.pathname === `/conversation-livreur/${commandeId}`;

      if (conversationClient || conversationLivreur) {
        return;
      }

      /*
       * ---------------------------------------------------------
       * 2. Éviter les doublons.
       * ---------------------------------------------------------
       */

      const messageId = message?._id
        ? String(message._id)
        : `${commandeId}-${message?.date || Date.now()}`;

      if (notificationsRef.current.has(messageId)) {
        return;
      }

      notificationsRef.current.add(messageId);

      /*
       * On évite que le Set grossisse indéfiniment.
       */
      if (notificationsRef.current.size > 100) {
        const first = notificationsRef.current.values().next().value;

        if (first) {
          notificationsRef.current.delete(first);
        }
      }

      /*
       * ---------------------------------------------------------
       * 3. Déterminer qui a envoyé le message.
       * ---------------------------------------------------------
       */

      const typeExpediteur =
        message?.expediteur?.type || message?.sender?.type || "";

      const nomExpediteur =
        message?.expediteur?.nom ||
        message?.expediteur?.name ||
        message?.sender?.nom ||
        message?.sender?.name ||
        (typeExpediteur === "livreur"
          ? "Le livreur"
          : typeExpediteur === "client"
            ? "Le client"
            : "Nouveau message");

      /*
       * ---------------------------------------------------------
       * 4. Déterminer automatiquement le lien.
       *
       * Si le message vient du livreur :
       * client -> conversation client
       *
       * Si le message vient du client :
       * livreur -> conversation livreur
       * ---------------------------------------------------------
       */

      const tokenClient = localStorage.getItem("token");
      const tokenLivreur = localStorage.getItem("tokenLivreur");

      let route = `/conversation/${commandeId}`;

      if (tokenLivreur && !tokenClient) {
        route = `/conversation-livreur/${commandeId}`;
      } else if (typeExpediteur === "client" && tokenLivreur) {
        route = `/conversation-livreur/${commandeId}`;
      } else if (typeExpediteur === "livreur" && tokenClient) {
        route = `/conversation/${commandeId}`;
      }

      /*
       * ---------------------------------------------------------
       * 5. Aperçu du message.
       * ---------------------------------------------------------
       */

      const contenuMessage = String(message?.message || "").trim();

      const apercu =
        contenuMessage.length > 100
          ? `${contenuMessage.substring(0, 100)}…`
          : contenuMessage || "Vous avez reçu un nouveau message.";

      /*
       * ---------------------------------------------------------
       * 6. Son.
       * ---------------------------------------------------------
       */

      jouerSonNotification();

      /*
       * ---------------------------------------------------------
       * 7. Notification personnalisée.
       * ---------------------------------------------------------
       */

      toast.custom(
        (t) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              toast.dismiss(t.id);
              navigate(route);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toast.dismiss(t.id);
                navigate(route);
              }
            }}
            style={{
              width: "min(390px, calc(100vw - 32px))",
              background: "#ffffff",
              color: "#111827",
              borderRadius: "18px",
              padding: "14px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              cursor: "pointer",
              boxShadow: "0 14px 40px rgba(0, 0, 0, 0.16)",
              border: "1px solid rgba(17, 24, 39, 0.08)",
              position: "relative",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "translateY(-2px)";
              event.currentTarget.style.boxShadow =
                "0 18px 45px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
              event.currentTarget.style.boxShadow =
                "0 14px 40px rgba(0, 0, 0, 0.16)";
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                minWidth: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #111827, #374151)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiMessageCircle size={21} />
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 0,
                paddingRight: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginBottom: "3px",
                }}
              >
                <strong
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}
                >
                  {nomExpediteur}
                </strong>

                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Nouveau message
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: 1.45,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {apercu}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "9px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                <span>Ouvrir la conversation</span>
                <FiArrowRight size={13} />
              </div>
            </div>

            <button
              type="button"
              aria-label="Fermer la notification"
              onClick={(event) => {
                event.stopPropagation();
                toast.dismiss(t.id);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "28px",
                height: "28px",
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = "#f3f4f6";
                event.currentTarget.style.color = "#111827";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
                event.currentTarget.style.color = "#9ca3af";
              }}
            >
              <FiX size={16} />
            </button>
          </div>
        ),
        {
          id: `message-${messageId}`,
          duration: 6000,
          position: "top-right",
        },
      );
    };

    socket.on("nouveau_message", handleNouveauMessage);

    return () => {
      socket.off("nouveau_message", handleNouveauMessage);
    };
  }, [location.pathname, navigate]);

  return null;
}

const VisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location.pathname]);

  return null;
};

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const heroPage = location.pathname === "/";
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 6000,
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />
      <ScrollToTop />
      <GlobalStyle heroPage={heroPage} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
const SEO = () => {
  useEffect(() => {
    document.title = "numa.luxe - Boutique de vêtements en ligne";
  }, []);

  return null;
};
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <VisitorTracking />
      <GlobalNotifications />
      <ToggleTheme>
        <Panier>
          <GlobalStyle />
          <SEO />
          <Routes>
            {/* Pages publiques */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/homme"
              element={
                <PublicLayout>
                  <Homme />
                </PublicLayout>
              }
            />
            <Route
              path="/femme"
              element={
                <PublicLayout>
                  <Femme />
                </PublicLayout>
              }
            />
            <Route
              path="/enfant"
              element={
                <PublicLayout>
                  <Enfant />
                </PublicLayout>
              }
            />
            <Route
              path="/paiement-suite/:id"
              element={
                <PublicLayout>
                  <PaiementSuite />
                </PublicLayout>
              }
            />
            <Route
              path="/collections"
              element={
                <PublicLayout>
                  <Collection />
                </PublicLayout>
              }
            />
            <Route
              path="/paiement-3x"
              element={
                <PublicLayout>
                  <PaiementTroisFois />
                </PublicLayout>
              }
            />
            <Route
              path="/new"
              element={
                <PublicLayout>
                  <New />
                </PublicLayout>
              }
            />
            <Route
              path="/promo"
              element={
                <PublicLayout>
                  <Promo />
                </PublicLayout>
              }
            />

            <Route
              path="/conversation/:commandeId"
              element={<Conversation role="client" />}
            />

            <Route
              path="/conversation-livreur/:commandeId"
              element={<Conversation role="livreur" />}
            />

            <Route
              path="/admin-livreur"
              element={
                <PublicLayout>
                  <LivreurAdmin />
                </PublicLayout>
              }
            />
            <Route
              path="/search"
              element={
                <PublicLayout>
                  <Search />
                </PublicLayout>
              }
            />

            <Route
              path="/apropo"
              element={
                <PublicLayout>
                  <Apropos />
                </PublicLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <PublicLayout>
                  <FAQ />
                </PublicLayout>
              }
            />
            <Route
              path="/politiqueretour"
              element={
                <PublicLayout>
                  <ReturnPolicy />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <Contact />
                </PublicLayout>
              }
            />
            <Route
              path="/livraison"
              element={
                <PublicLayout>
                  <Delivery />
                </PublicLayout>
              }
            />
            <Route
              path="/inscription-livreur"
              element={
                <PublicLayout>
                  <InscriptionLivreur />
                </PublicLayout>
              }
            />
            <Route
              path="/connexion-livreur"
              element={
                <PublicLayout>
                  <ConnexionLivreur />
                </PublicLayout>
              }
            />
            <Route
              path="/suivi-commande/:commandeId"
              element={<SuiviCommande />}
            />

            <Route
              path="/conditionUtilisation"
              element={
                <PublicLayout>
                  <TermsOfUse />
                </PublicLayout>
              }
            />
            <Route
              path="/favoris"
              element={
                <PublicLayout>
                  <Favorie />
                </PublicLayout>
              }
            />
            <Route
              path="/produit/:id"
              element={
                <PublicLayout>
                  <Produit />
                </PublicLayout>
              }
            />
            <Route
              path="/panier"
              element={
                <PublicLayout>
                  <PagePanier />
                </PublicLayout>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicLayout>
                  <Signup />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/forgot"
              element={
                <PublicLayout>
                  <ForgotPassword />
                </PublicLayout>
              }
            />

            <Route
              path="/reset-password/:token"
              element={
                <PublicLayout>
                  <ResetPassword />
                </PublicLayout>
              }
            />

            <Route
              path="/compte"
              element={
                <PublicLayout>
                  <CompteClient />
                </PublicLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <PublicLayout>
                  <PaiementWave />
                </PublicLayout>
              }
            />

            <Route
              path="/paiement-semi/:id"
              element={
                <PublicLayout>
                  <PaiementSemiManuel />
                </PublicLayout>
              }
            />
            <Route
              path="/precommande"
              element={
                <PublicLayout>
                  <Precommande />
                </PublicLayout>
              }
            />
            <Route
              path="/merci/:id"
              element={
                <PublicLayout>
                  <Merci />
                </PublicLayout>
              }
            />

            <Route
              path="*"
              element={
                <PublicLayout>
                  <Erreur />
                </PublicLayout>
              }
            />

            {/* Pages admin sans Header et Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminCommandes />} />
              <Route path="paiement" element={<AdminPaiements />} />
              <Route path="livreurs" element={<AdminLivreurs />} />
              <Route path="precommandes" element={<AdminPrecommandes />} />
              <Route
                path="reception-precommandes"
                element={<ReceptionPrecommande />}
              />
              <Route path="statistiques" element={<AdminStatistiques />} />
            </Route>
          </Routes>
        </Panier>
      </ToggleTheme>
    </Router>
  </StrictMode>,
);
