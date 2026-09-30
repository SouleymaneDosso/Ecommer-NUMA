import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:5000";

export default function Conversation({ role = "client" }) {
  const { commandeId } = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [chargement, setChargement] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const messagesContainerRef = useRef(null);

  /*
   * ============================================================
   * UTILISATEUR CONNECTÉ
   * ============================================================
   *
   * Client :
   * localStorage.getItem("token")
   *
   * Livreur :
   * localStorage.getItem("tokenLivreur")
   *
   * On utilise le rôle de la page pour éviter de prendre
   * accidentellement le mauvais token si les deux existent.
   */

  const utilisateurConnecte = useMemo(() => {
    const tokenKey = role === "livreur" ? "tokenLivreur" : "token";

    const token = localStorage.getItem(tokenKey);

    if (!token) {
      return null;
    }

    try {
      const parties = token.split(".");

      if (parties.length !== 3) {
        return null;
      }

      const base64 = parties[1].replace(/-/g, "+").replace(/_/g, "/");

      const payload = JSON.parse(atob(base64));

      return {
        id: payload.userId,
        type: role === "livreur" ? "livreur" : "client",
      };
    } catch (error) {
      console.error("Impossible de lire le token :", error);

      return null;
    }
  }, [role]);

  const typeUtilisateur = utilisateurConnecte?.type || role;

  const typeCorrespondant = typeUtilisateur === "client" ? "livreur" : "client";

  /*
   * ============================================================
   * TOKEN
   * ============================================================
   */

  const recupererToken = useCallback(() => {
    const tokenKey = role === "livreur" ? "tokenLivreur" : "token";

    return localStorage.getItem(tokenKey);
  }, [role]);

  /*
   * ============================================================
   * HEADERS
   * ============================================================
   */

  const getHeaders = useCallback(() => {
    const token = recupererToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [recupererToken]);

  /*
   * ============================================================
   * CHARGER / CRÉER LA CONVERSATION
   * ============================================================
   */

  const chargerConversation = useCallback(async () => {
    if (!commandeId) {
      setErreur("Commande introuvable.");
      setChargement(false);
      return null;
    }

    const token = recupererToken();

    if (!token) {
      setErreur("Vous devez être connecté pour accéder à la conversation.");

      setChargement(false);
      return null;
    }

    try {
      setErreur("");

      /*
       * On envoie la commande.
       *
       * Le backend :
       * - vérifie le client OU le livreur
       * - récupère l'autre participant
       * - trouve la conversation existante
       * - ou la crée
       */

      const response = await fetch(`${API_URL}/api/conversations`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          commandeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'ouvrir la conversation.");
      }

      if (!data.conversation) {
        throw new Error("Conversation introuvable.");
      }

      setConversation(data.conversation);

      return data.conversation;
    } catch (error) {
      console.error("Erreur chargement conversation :", error);

      setErreur(error.message || "Impossible d'ouvrir la conversation.");

      return null;
    }
  }, [commandeId, getHeaders, recupererToken]);

  /*
   * ============================================================
   * CHARGER LES MESSAGES
   * ============================================================
   */

  const chargerMessages = useCallback(
    async (conversationId, afficherChargement = false) => {
      if (!conversationId) {
        return;
      }

      try {
        if (afficherChargement) {
          setChargement(true);
        }

        const response = await fetch(
          `${API_URL}/api/conversations/${conversationId}/messages`,
          {
            method: "GET",
            headers: getHeaders(),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de récupérer les messages.",
          );
        }

        /*
         * IMPORTANT :
         *
         * On ne fait PAS :
         *
         * messagesContainer.scrollTop =
         * messagesContainer.scrollHeight;
         *
         * Donc aucun scroll automatique.
         */

        setMessages(data.messages || []);
      } catch (error) {
        console.error("Erreur récupération messages :", error);

        setErreur(error.message || "Impossible de récupérer les messages.");
      } finally {
        if (afficherChargement) {
          setChargement(false);
        }
      }
    },
    [getHeaders],
  );

  /*
   * ============================================================
   * MARQUER LES MESSAGES COMME LUS
   * ============================================================
   */

  const marquerCommeLus = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        return;
      }

      try {
        await fetch(
          `${API_URL}/api/conversations/${conversationId}/messages/read`,
          {
            method: "PATCH",
            headers: getHeaders(),
          },
        );
      } catch (error) {
        console.error("Erreur marquage messages lus :", error);
      }
    },
    [getHeaders],
  );

  /*
   * ============================================================
   * INITIALISATION
   * ============================================================
   */

  useEffect(() => {
    let actif = true;

    const initialiser = async () => {
      const conv = await chargerConversation();

      if (!actif || !conv?._id) {
        return;
      }

      await chargerMessages(conv._id, true);

      await marquerCommeLus(conv._id);
    };

    initialiser();

    return () => {
      actif = false;
    };
  }, [chargerConversation, chargerMessages, marquerCommeLus]);

  /*
   * ============================================================
   * RAFRAÎCHISSEMENT DES MESSAGES
   * ============================================================
   *
   * Pas de scroll automatique ici non plus.
   */

  useEffect(() => {
    if (!conversation?._id) {
      return;
    }

    const interval = setInterval(() => {
      chargerMessages(conversation._id, false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [conversation?._id, chargerMessages]);

  /*
   * ============================================================
   * ENVOYER UN MESSAGE
   * ============================================================
   */

  const envoyerMessage = async (event) => {
    event.preventDefault();

    const texte = message.trim();

    if (!texte) {
      return;
    }

    if (!conversation?._id) {
      setErreur("Conversation introuvable.");
      return;
    }

    if (texte.length > 1000) {
      setErreur("Le message ne peut pas dépasser 1000 caractères.");
      return;
    }

    try {
      setEnvoiEnCours(true);
      setErreur("");

      const response = await fetch(
        `${API_URL}/api/conversations/${conversation._id}/messages`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            message: texte,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'envoyer le message.");
      }

      /*
       * Le backend renvoie normalement :
       *
       * {
       *   nouveauMessage,
       *   conversation
       * }
       */

      if (data.nouveauMessage) {
        setMessages((anciensMessages) => [
          ...anciensMessages,
          data.nouveauMessage,
        ]);
      } else {
        /*
         * Sécurité :
         * si le backend ne renvoie pas le message,
         * on recharge simplement.
         */
        await chargerMessages(conversation._id, false);
      }

      if (data.conversation) {
        setConversation(data.conversation);
      }

      setMessage("");

      /*
       * IMPORTANT :
       * Aucun scroll forcé après l'envoi.
       */
    } catch (error) {
      console.error("Erreur envoi message :", error);

      setErreur(error.message || "Impossible d'envoyer le message.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  /*
   * ============================================================
   * SUPPRIMER UN MESSAGE
   * ============================================================
   */

  const supprimerMessage = async (messageId) => {
    if (!conversation?._id || !messageId) {
      return;
    }

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce message ?",
    );

    if (!confirmation) {
      return;
    }

    try {
      setErreur("");

      const response = await fetch(
        `${API_URL}/api/conversations/${conversation._id}/messages/${messageId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de supprimer le message.");
      }

      /*
       * Le backend renvoie la conversation
       * mise à jour.
       */

      if (data.conversation) {
        setConversation(data.conversation);

        setMessages(data.conversation.messages || []);
      } else {
        await chargerMessages(conversation._id, false);
      }
    } catch (error) {
      console.error("Erreur suppression message :", error);

      setErreur(error.message || "Impossible de supprimer le message.");
    }
  };

  /*
   * ============================================================
   * TOUCHE ENTRÉE
   * ============================================================
   */

  const gererTouche = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      envoyerMessage(event);
    }
  };

  /*
   * ============================================================
   * FORMAT DATE
   * ============================================================
   */

  const formaterHeure = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formaterDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /*
   * ============================================================
   * REGROUPER LES MESSAGES PAR JOUR
   * ============================================================
   */

  const messagesAvecDate = useMemo(() => {
    const resultat = [];
    let derniereDate = null;

    messages.forEach((msg) => {
      const dateMessage = formaterDate(msg.date);

      if (dateMessage !== derniereDate) {
        resultat.push({
          type: "date",
          id: `date-${dateMessage}`,
          date: dateMessage,
        });

        derniereDate = dateMessage;
      }

      resultat.push({
        type: "message",
        ...msg,
      });
    });

    return resultat;
  }, [messages]);

  /*
   * ============================================================
   * RETOUR
   * ============================================================
   */

  const retour = () => {
    navigate(-1);
  };

  /*
   * ============================================================
   * ÉTAT ERREUR COMMANDE
   * ============================================================
   */

  if (!commandeId) {
    return (
      <div style={styles.page}>
        <div style={styles.erreurPage}>
          <h2>Conversation introuvable</h2>

          <button onClick={retour} style={styles.boutonRetour}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * RENDU
   * ============================================================
   */

  return (
    <div style={styles.page}>
      <div style={styles.conversationWrapper}>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header style={styles.header}>
          <button
            type="button"
            onClick={retour}
            style={styles.boutonBack}
            aria-label="Retour"
          >
            <FaArrowLeft />
          </button>

          <div style={styles.headerInfo}>
            <div style={styles.avatar}>
              {typeCorrespondant === "livreur" ? "L" : "C"}
            </div>

            <div>
              <div style={styles.titre}>
                {typeCorrespondant === "livreur" ? "Livreur" : "Client"}
              </div>

              <div style={styles.sousTitre}>
                Commande #{commandeId.slice(-6)}
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            ERREUR
        ====================================================== */}

        {erreur && <div style={styles.erreur}>{erreur}</div>}

        {/* =====================================================
            MESSAGES
        ====================================================== */}

        <main ref={messagesContainerRef} style={styles.messages}>
          {chargement ? (
            <div style={styles.chargement}>Chargement des messages...</div>
          ) : messagesAvecDate.length === 0 ? (
            <div style={styles.vide}>
              <div style={styles.videIcon}>💬</div>

              <div style={styles.videTitre}>Aucun message</div>

              <div style={styles.videTexte}>Commencez la conversation.</div>
            </div>
          ) : (
            messagesAvecDate.map((element, index) => {
              if (element.type === "date") {
                return (
                  <div
                    key={`${element.id}-${index}`}
                    style={styles.dateSeparator}
                  >
                    <span style={styles.dateSeparatorText}>{element.date}</span>
                  </div>
                );
              }

              const estMoi =
                element.expediteur?.id?.toString() ===
                utilisateurConnecte?.id?.toString();

              return (
                <div
                  key={element._id || `message-${index}`}
                  style={{
                    ...styles.messageRow,
                    ...(estMoi ? styles.messageRowMoi : styles.messageRowAutre),
                  }}
                >
                  <div
                    style={{
                      ...styles.bulle,
                      ...(estMoi ? styles.bulleMoi : styles.bulleAutre),
                    }}
                  >
                    <div style={styles.messageTexte}>{element.message}</div>

                    <div
                      style={{
                        ...styles.messageMeta,
                        ...(estMoi ? styles.messageMetaMoi : {}),
                      }}
                    >
                      <span>{formaterHeure(element.date)}</span>

                      {estMoi && (
                        <>
                          <span>{element.lu ? "✓✓" : "✓"}</span>

                          <button
                            type="button"
                            onClick={() => supprimerMessage(element._id)}
                            style={styles.boutonSupprimer}
                            title="Supprimer"
                            aria-label="Supprimer le message"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>

        {/* =====================================================
            INPUT
        ====================================================== */}

        <form onSubmit={envoyerMessage} style={styles.form}>
          <div style={styles.inputWrapper}>
            <textarea
              value={message}
              onChange={(event) => {
                if (event.target.value.length <= 1000) {
                  setMessage(event.target.value);
                }
              }}
              onKeyDown={gererTouche}
              placeholder="Écrire un message..."
              rows={1}
              maxLength={1000}
              disabled={envoiEnCours}
              style={styles.input}
            />

            <div style={styles.compteur}>{message.length}/1000</div>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || envoiEnCours}
            style={{
              ...styles.boutonEnvoyer,
              ...(message.trim() && !envoiEnCours
                ? styles.boutonEnvoyerActif
                : styles.boutonEnvoyerDesactive),
            }}
            aria-label="Envoyer"
          >
            {envoiEnCours ? (
              <span style={styles.spinner}>⏳</span>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/*
 * ==============================================================
 * STYLES
 * ==============================================================
 */

const styles = {
  page: {
    minHeight: "100dvh",
    width: "100%",
    backgroundColor: "#f5f6f8",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  conversationWrapper: {
    width: "100%",
    maxWidth: "900px",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },

  /*
   * HEADER
   */

  header: {
    flexShrink: 0,
    height: "64px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },

  boutonBack: {
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    flexShrink: 0,
  },

  titre: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
  },

  sousTitre: {
    marginTop: "2px",
    fontSize: "12px",
    color: "#6b7280",
  },

  /*
   * ERREUR
   */

  erreur: {
    flexShrink: 0,
    margin: "10px 16px 0",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "13px",
  },

  erreurPage: {
    width: "100%",
    maxWidth: "500px",
    margin: "auto",
    padding: "24px",
    textAlign: "center",
  },

  boutonRetour: {
    marginTop: "15px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#111827",
    color: "#ffffff",
    cursor: "pointer",
  },

  /*
   * MESSAGES
   *
   * IMPORTANT :
   *
   * overflowY: auto
   * MAIS aucun scrollTop n'est utilisé.
   */

  messages: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "16px",
    boxSizing: "border-box",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
  },

  chargement: {
    minHeight: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "14px",
  },

  vide: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#6b7280",
  },

  videIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  videTitre: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#374151",
  },

  videTexte: {
    marginTop: "5px",
    fontSize: "13px",
  },

  /*
   * DATES
   */

  dateSeparator: {
    display: "flex",
    justifyContent: "center",
    margin: "16px 0",
  },

  dateSeparatorText: {
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    fontSize: "11px",
  },

  /*
   * MESSAGES
   */

  messageRow: {
    width: "100%",
    display: "flex",
    marginBottom: "8px",
    boxSizing: "border-box",
  },

  messageRowMoi: {
    justifyContent: "flex-end",
  },

  messageRowAutre: {
    justifyContent: "flex-start",
  },

  bulle: {
    maxWidth: "75%",
    padding: "9px 12px 7px",
    borderRadius: "14px",
    boxSizing: "border-box",
    overflowWrap: "anywhere",
  },

  bulleMoi: {
    backgroundColor: "#111827",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },

  bulleAutre: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    borderBottomLeftRadius: "4px",
  },

  messageTexte: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "14px",
    lineHeight: "1.45",
  },

  messageMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
    marginTop: "4px",
    fontSize: "10px",
    color: "#6b7280",
  },

  messageMetaMoi: {
    color: "#d1d5db",
  },

  boutonSupprimer: {
    border: "none",
    background: "transparent",
    color: "inherit",
    padding: "2px",
    margin: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
  },

  /*
   * FORMULAIRE
   */

  form: {
    flexShrink: 0,
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    padding: "10px 12px",
    paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },

  inputWrapper: {
    flex: 1,
    minWidth: 0,
    position: "relative",
  },

  /*
   * IMPORTANT MOBILE :
   *
   * fontSize: 16px
   *
   * Cela évite le zoom automatique d'iOS/Safari
   * lorsque l'utilisateur touche le champ.
   */

  input: {
    width: "100%",
    minHeight: "44px",
    maxHeight: "120px",
    resize: "none",
    border: "1px solid #d1d5db",
    borderRadius: "22px",
    outline: "none",
    padding: "11px 50px 11px 14px",
    boxSizing: "border-box",

    fontSize: "16px",
    lineHeight: "1.4",
    fontFamily: "inherit",

    backgroundColor: "#ffffff",
    color: "#111827",

    overflowY: "auto",
    WebkitAppearance: "none",
  },

  compteur: {
    position: "absolute",
    right: "14px",
    bottom: "5px",
    fontSize: "9px",
    color: "#9ca3af",
    pointerEvents: "none",
  },

  boutonEnvoyer: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    border: "none",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "0.2s",
  },

  boutonEnvoyerActif: {
    backgroundColor: "#111827",
    color: "#ffffff",
    cursor: "pointer",
  },

  boutonEnvoyerDesactive: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },

  spinner: {
    fontSize: "15px",
  },
};
