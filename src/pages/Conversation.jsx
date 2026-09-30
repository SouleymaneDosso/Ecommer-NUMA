import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Conversation({ role = "client" }) {
  const navigate = useNavigate();
  const { commandeId } = useParams();

  const API_URL = import.meta.env.VITE_API_URL || "";

  // =====================================================
  // AUTHENTIFICATION
  // =====================================================

  const typeUtilisateur = role === "livreur" ? "livreur" : "client";

  const tokenKey = typeUtilisateur === "livreur" ? "tokenLivreur" : "token";

  const token = localStorage.getItem(tokenKey);

  // =====================================================
  // REFS
  // =====================================================

  const messagesContainerRef = useRef(null);

  const premierChargementRef = useRef(true);

  // =====================================================
  // ÉTATS
  // =====================================================

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [nouveauMessage, setNouveauMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const [erreur, setErreur] = useState("");
  const [messageInfo, setMessageInfo] = useState("");

  const [suppressionEnCours, setSuppressionEnCours] = useState(null);

  const [confirmationSuppression, setConfirmationSuppression] = useState(null);

  const [estEnBas, setEstEnBas] = useState(true);

  const [nouveauxMessages, setNouveauxMessages] = useState(0);

  // =====================================================
  // IDENTITÉ
  // =====================================================

  const utilisateurConnecte = useMemo(() => {
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

      if (!payload.userId) {
        return null;
      }

      return {
        id: payload.userId,
        type: typeUtilisateur,
      };
    } catch (error) {
      console.error("Erreur lecture token :", error);
      return null;
    }
  }, [token, typeUtilisateur]);

  // =====================================================
  // FETCH API
  // =====================================================

  const fetchAPI = useCallback(
    async (url, options = {}) => {
      if (!token) {
        throw new Error("Token d'authentification manquant.");
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || `Erreur HTTP ${response.status}`);
      }

      return data;
    },
    [token],
  );

  // =====================================================
  // SCROLL
  // =====================================================

  const scrollVersBas = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const verifierSiEnBas = useCallback(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return true;
    }

    const distance =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const procheDuBas = distance < 100;

    setEstEnBas(procheDuBas);

    if (procheDuBas) {
      setNouveauxMessages(0);
    }

    return procheDuBas;
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      verifierSiEnBas();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [verifierSiEnBas]);

  // =====================================================
  // CRÉER / RÉCUPÉRER CONVERSATION
  // =====================================================

  const chargerConversation = useCallback(async () => {
    if (!commandeId) {
      setErreur("Identifiant de commande manquant.");
      setLoading(false);
      return null;
    }

    if (!token) {
      setErreur(
        typeUtilisateur === "livreur"
          ? "Vous devez être connecté en tant que livreur."
          : "Vous devez être connecté en tant que client.",
      );

      setLoading(false);
      return null;
    }

    try {
      setErreur("");

      const data = await fetchAPI(`${API_URL}/api/conversations`, {
        method: "POST",
        body: JSON.stringify({
          commandeId,
        }),
      });

      if (!data?.conversation?._id) {
        throw new Error(
          "La conversation n'a pas été retournée par le serveur.",
        );
      }

      setConversation(data.conversation);

      return data.conversation;
    } catch (error) {
      console.error("ERREUR CHARGEMENT CONVERSATION :", error);

      setErreur(error.message || "Impossible de charger la conversation.");

      return null;
    }
  }, [API_URL, commandeId, fetchAPI, token, typeUtilisateur]);

  // =====================================================
  // RÉCUPÉRER LES MESSAGES
  // =====================================================

  const chargerMessages = useCallback(
    async (conversationId, afficherErreur = true) => {
      if (!conversationId) {
        return null;
      }

      try {
        const data = await fetchAPI(
          `${API_URL}/api/conversations/${conversationId}/messages`,
          {
            method: "GET",
          },
        );

        const nouveaux = data?.messages || [];

        setMessages(nouveaux);

        return nouveaux;
      } catch (error) {
        console.error("ERREUR CHARGEMENT MESSAGES :", error);

        if (afficherErreur) {
          setErreur(error.message || "Impossible de récupérer les messages.");
        }

        return null;
      }
    },
    [API_URL, fetchAPI],
  );

  // =====================================================
  // MARQUER COMME LU
  // =====================================================

  const marquerMessagesCommeLus = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        return;
      }

      try {
        await fetchAPI(
          `${API_URL}/api/conversations/${conversationId}/messages/read`,
          {
            method: "PATCH",
          },
        );
      } catch (error) {
        console.error("ERREUR MARQUAGE MESSAGES LUS :", error);
      }
    },
    [API_URL, fetchAPI],
  );

  // =====================================================
  // INITIALISATION
  // =====================================================

  useEffect(() => {
    let actif = true;

    const initialiser = async () => {
      setLoading(true);
      setErreur("");

      const conversationChargee = await chargerConversation();

      if (!actif) {
        return;
      }

      if (!conversationChargee?._id) {
        setLoading(false);
        return;
      }

      const messagesCharges = await chargerMessages(
        conversationChargee._id,
        true,
      );

      await marquerMessagesCommeLus(conversationChargee._id);

      if (!actif) {
        return;
      }

      setLoading(false);

      // Premier affichage :
      // on descend automatiquement tout en bas.
      if (messagesCharges && messagesCharges.length > 0) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollVersBas(false);
            verifierSiEnBas();
          });
        });
      }

      premierChargementRef.current = false;
    };

    initialiser();

    return () => {
      actif = false;
    };
  }, [
    chargerConversation,
    chargerMessages,
    marquerMessagesCommeLus,
    scrollVersBas,
    verifierSiEnBas,
  ]);

  // =====================================================
  // POLLING
  // =====================================================

  useEffect(() => {
    if (!conversation?._id) {
      return;
    }

    const interval = setInterval(async () => {
      const container = messagesContainerRef.current;

      const etaitEnBas = container
        ? container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100
        : true;

      const anciensMessages = messages;

      const messagesActualises = await chargerMessages(conversation._id, false);

      if (!messagesActualises) {
        return;
      }

      await marquerMessagesCommeLus(conversation._id);

      // Nombre de nouveaux messages reçus.
      const anciensIds = new Set(anciensMessages.map((msg) => String(msg._id)));

      const messagesNouveaux = messagesActualises.filter(
        (msg) => !anciensIds.has(String(msg._id)) && !estMonMessage(msg),
      );

      if (messagesNouveaux.length > 0) {
        if (etaitEnBas) {
          requestAnimationFrame(() => {
            scrollVersBas(true);
          });

          setNouveauxMessages(0);
        } else {
          setNouveauxMessages((nombre) => nombre + messagesNouveaux.length);
        }
      } else if (etaitEnBas) {
        setNouveauxMessages(0);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    conversation?._id,
    chargerMessages,
    marquerMessagesCommeLus,
    messages,
    scrollVersBas,
  ]);

  // =====================================================
  // ENVOYER
  // =====================================================

  const envoyerMessage = async (event) => {
    event?.preventDefault();

    const texte = nouveauMessage.trim();

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
      setMessageInfo("");

      const data = await fetchAPI(
        `${API_URL}/api/conversations/${conversation._id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            message: texte,
          }),
        },
      );

      if (data?.nouveauMessage) {
        setMessages((anciensMessages) => [
          ...anciensMessages,
          data.nouveauMessage,
        ]);
      } else {
        await chargerMessages(conversation._id, false);
      }

      setConversation((ancienneConversation) => {
        if (!ancienneConversation) {
          return ancienneConversation;
        }

        return {
          ...ancienneConversation,
          derniermessage: texte,
        };
      });

      setNouveauMessage("");

      // Après envoi : toujours descendre.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollVersBas(true);
        });
      });

      setNouveauxMessages(0);
    } catch (error) {
      console.error("ERREUR ENVOI MESSAGE :", error);

      setErreur(error.message || "Impossible d'envoyer le message.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  // =====================================================
  // SUPPRIMER
  // =====================================================

  const demanderSuppression = (messageId) => {
    setConfirmationSuppression(messageId);
  };

  const supprimerMessage = async (messageId) => {
    if (!conversation?._id || !messageId) {
      return;
    }

    try {
      setSuppressionEnCours(messageId);
      setErreur("");

      const data = await fetchAPI(
        `${API_URL}/api/conversations/${conversation._id}/messages/${messageId}`,
        {
          method: "DELETE",
        },
      );

      if (data?.conversation) {
        setConversation(data.conversation);

        setMessages(data.conversation.messages || []);
      } else {
        await chargerMessages(conversation._id, false);
      }

      setConfirmationSuppression(null);

      setMessageInfo("Message supprimé.");

      setTimeout(() => {
        setMessageInfo("");
      }, 2500);
    } catch (error) {
      console.error("ERREUR SUPPRESSION MESSAGE :", error);

      setErreur(error.message || "Impossible de supprimer le message.");
    } finally {
      setSuppressionEnCours(null);
    }
  };

  // =====================================================
  // MESSAGE À MOI
  // =====================================================

  const estMonMessage = useCallback(
    (message) => {
      if (!message?.expediteur || !utilisateurConnecte) {
        return false;
      }

      return (
        message.expediteur.type === utilisateurConnecte.type &&
        String(message.expediteur.id) === String(utilisateurConnecte.id)
      );
    },
    [utilisateurConnecte],
  );

  // =====================================================
  // DATES
  // =====================================================

  const formaterHeure = (date) => {
    if (!date) {
      return "";
    }

    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
      return "";
    }

    return dateObj.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formaterJour = (date) => {
    if (!date) {
      return "";
    }

    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
      return "";
    }

    return dateObj.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // GROUPEMENT PAR JOUR
  // =====================================================

  const messagesAvecSeparateurs = [];

  let dernierJour = null;

  messages.forEach((message) => {
    const jour = new Date(message.date).toLocaleDateString("fr-FR");

    if (jour !== dernierJour) {
      messagesAvecSeparateurs.push({
        type: "date",
        id: `date-${jour}`,
        date: message.date,
      });

      dernierJour = jour;
    }

    messagesAvecSeparateurs.push({
      type: "message",
      ...message,
    });
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner} />

          <strong>Ouverture de la conversation</strong>

          <span>Chargement des messages...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDU
  // =====================================================

  return (
    <div style={styles.page}>
      <div style={styles.appShell}>
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header style={styles.header}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.backButton}
            aria-label="Retour"
          >
            ←
          </button>

          <div style={styles.avatar}>
            {typeUtilisateur === "livreur" ? "C" : "L"}
          </div>

          <div style={styles.headerIdentity}>
            <div style={styles.headerName}>
              {typeUtilisateur === "livreur" ? "Client" : "Livreur"}
            </div>

            <div style={styles.onlineStatus}>
              <span style={styles.onlineDot} />
              Conversation active
            </div>
          </div>

          <div style={styles.headerRight}>
            <span style={styles.orderLabel}>Commande</span>

            <span style={styles.orderId}>#{String(commandeId).slice(-6)}</span>
          </div>
        </header>

        {/* ================================================= */}
        {/* ALERTES */}
        {/* ================================================= */}

        {erreur && (
          <div style={styles.errorBox}>
            <span>⚠️</span>
            <span>{erreur}</span>

            <button
              type="button"
              onClick={() => setErreur("")}
              style={styles.closeAlertButton}
            >
              ×
            </button>
          </div>
        )}

        {messageInfo && (
          <div style={styles.successBox}>
            <span>✓</span>
            <span>{messageInfo}</span>
          </div>
        )}

        {/* ================================================= */}
        {/* CHAT */}
        {/* ================================================= */}

        <main style={styles.chatCard}>
          {/* Zone messages */}

          <div ref={messagesContainerRef} style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyAvatar}>💬</div>

                <h2 style={styles.emptyTitle}>Aucun message</h2>

                <p style={styles.emptyText}>
                  Envoyez un message pour commencer la conversation.
                </p>
              </div>
            ) : (
              <div style={styles.messagesList}>
                {messagesAvecSeparateurs.map((item) => {
                  // -----------------------------
                  // DATE
                  // -----------------------------

                  if (item.type === "date") {
                    return (
                      <div key={item.id} style={styles.dateSeparator}>
                        <span style={styles.dateBadge}>
                          {formaterJour(item.date)}
                        </span>
                      </div>
                    );
                  }

                  // -----------------------------
                  // MESSAGE
                  // -----------------------------

                  const monMessage = estMonMessage(item);

                  const messageLu = item.lu === true;

                  return (
                    <div
                      key={item._id}
                      style={{
                        ...styles.messageRow,
                        justifyContent: monMessage ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageGroup,
                          alignItems: monMessage ? "flex-end" : "flex-start",
                        }}
                      >
                        {/* Bulle */}

                        <div
                          style={{
                            ...styles.bubble,
                            ...(monMessage
                              ? styles.myBubble
                              : styles.otherBubble),

                            ...(monMessage && messageLu
                              ? styles.myBubbleRead
                              : {}),

                            ...(monMessage && !messageLu
                              ? styles.myBubbleSent
                              : {}),
                          }}
                        >
                          <div style={styles.messageText}>{item.message}</div>

                          <div
                            style={{
                              ...styles.messageMeta,

                              ...(monMessage
                                ? styles.myMessageMeta
                                : styles.otherMessageMeta),
                            }}
                          >
                            <span>{formaterHeure(item.date)}</span>

                            {monMessage && (
                              <span
                                style={{
                                  ...styles.checks,
                                  ...(messageLu
                                    ? styles.checksRead
                                    : styles.checksSent),
                                }}
                                title={messageLu ? "Lu" : "Envoyé"}
                              >
                                {messageLu ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Suppression */}

                        {monMessage && (
                          <button
                            type="button"
                            onClick={() => demanderSuppression(item._id)}
                            disabled={suppressionEnCours === item._id}
                            style={styles.deleteButton}
                          >
                            {suppressionEnCours === item._id
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ================================================= */}
            {/* NOUVEAUX MESSAGES */}
            {/* ================================================= */}

            {!estEnBas && nouveauxMessages > 0 && (
              <button
                type="button"
                onClick={() => {
                  scrollVersBas(true);
                  setNouveauxMessages(0);
                }}
                style={styles.newMessagesButton}
              >
                ↓ {nouveauxMessages} nouveau
                {nouveauxMessages > 1 ? "x" : ""} message
                {nouveauxMessages > 1 ? "s" : ""}
              </button>
            )}
          </div>

          {/* ================================================= */}
          {/* BARRE DE SAISIE */}
          {/* ================================================= */}

          <form onSubmit={envoyerMessage} style={styles.composer}>
            <div style={styles.composerInner}>
              <textarea
                value={nouveauMessage}
                onChange={(event) => {
                  setNouveauMessage(event.target.value);
                  setErreur("");
                }}
                onInput={(event) => {
                  event.target.style.height = "auto";

                  event.target.style.height = `${Math.min(
                    event.target.scrollHeight,
                    130,
                  )}px`;
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();

                    envoyerMessage(event);
                  }
                }}
                placeholder="Écrivez votre message..."
                maxLength={1000}
                rows={1}
                disabled={envoiEnCours}
                style={styles.textarea}
              />

              <div style={styles.characterCount}>
                {nouveauMessage.length}
                /1000
              </div>
            </div>

            <button
              type="submit"
              disabled={envoiEnCours || !nouveauMessage.trim() || !conversation}
              style={{
                ...styles.sendButton,

                ...(envoiEnCours || !nouveauMessage.trim() || !conversation
                  ? styles.sendButtonDisabled
                  : {}),
              }}
              aria-label="Envoyer le message"
            >
              {envoiEnCours ? (
                <span style={styles.buttonSpinner} />
              ) : (
                <>
                  <span>Envoyer</span>
                  <span style={styles.sendIcon}>➤</span>
                </>
              )}
            </button>
          </form>

          <div style={styles.composerHint}>
            Entrée pour envoyer · Maj + Entrée pour aller à la ligne
          </div>
        </main>
      </div>

      {/* =================================================== */}
      {/* MODAL SUPPRESSION */}
      {/* =================================================== */}

      {confirmationSuppression && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>🗑️</div>

            <h3 style={styles.modalTitle}>Supprimer ce message ?</h3>

            <p style={styles.modalText}>
              Cette action supprimera définitivement le message de la
              conversation.
            </p>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setConfirmationSuppression(null)}
                style={styles.cancelButton}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => supprimerMessage(confirmationSuppression)}
                style={styles.confirmDeleteButton}
                disabled={suppressionEnCours !== null}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {
  // -----------------------------------------------------
  // PAGE
  // -----------------------------------------------------

  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fb 0%, #eef2f7 100%)",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },

  appShell: {
    width: "100%",
    maxWidth: "980px",
    height: "calc(100vh - 40px)",
    minHeight: "620px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },

  // -----------------------------------------------------
  // LOADING
  // -----------------------------------------------------

  loadingCard: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#1f2937",
  },

  loadingSpinner: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#111827",
    animation: "conversationSpin 0.8s linear infinite",
  },

  // -----------------------------------------------------
  // HEADER
  // -----------------------------------------------------

  header: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#ffffff",
    border: "1px solid #e6e9ef",
    borderRadius: "18px 18px 0 0",
    padding: "14px 18px",
    boxShadow: "0 5px 20px rgba(15, 23, 42, 0.06)",
    zIndex: 5,
  },

  backButton: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    border: "1px solid #e4e7ec",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },

  avatar: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #111827, #374151)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "17px",
    boxShadow: "0 4px 12px rgba(17, 24, 39, 0.18)",
  },

  headerIdentity: {
    minWidth: 0,
    flex: 1,
  },

  headerName: {
    fontSize: "15px",
    fontWeight: 800,
    color: "#111827",
    marginBottom: "3px",
  },

  onlineStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#6b7280",
  },

  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",
    paddingLeft: "10px",
  },

  orderLabel: {
    fontSize: "10px",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 700,
  },

  orderId: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: 800,
  },

  // -----------------------------------------------------
  // ALERTES
  // -----------------------------------------------------

  errorBox: {
    flexShrink: 0,
    marginTop: "10px",
    background: "#fff5f5",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "12px",
    padding: "11px 13px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
  },

  successBox: {
    flexShrink: 0,
    marginTop: "10px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    borderRadius: "12px",
    padding: "11px 13px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
  },

  closeAlertButton: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: "20px",
    lineHeight: 1,
  },

  // -----------------------------------------------------
  // CHAT
  // -----------------------------------------------------

  chatCard: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    border: "1px solid #e6e9ef",
    borderTop: "none",
    borderRadius: "0 0 18px 18px",
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
  },

  messagesContainer: {
    position: "relative",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
    background:
      "radial-gradient(circle at top left, rgba(17,24,39,0.025), transparent 35%), #fafbfc",
    padding: "22px 20px",
    boxSizing: "border-box",
  },

  messagesList: {
    display: "flex",
    flexDirection: "column",
  },

  // -----------------------------------------------------
  // EMPTY
  // -----------------------------------------------------

  emptyState: {
    height: "100%",
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#6b7280",
  },

  emptyAvatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "#eef2f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "16px",
  },

  emptyTitle: {
    margin: "0 0 7px",
    fontSize: "17px",
    color: "#1f2937",
  },

  emptyText: {
    margin: 0,
    fontSize: "13px",
    color: "#9ca3af",
  },

  // -----------------------------------------------------
  // DATES
  // -----------------------------------------------------

  dateSeparator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "12px 0 18px",
  },

  dateBadge: {
    padding: "6px 11px",
    borderRadius: "20px",
    background: "#eef1f5",
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: 700,
  },

  // -----------------------------------------------------
  // MESSAGES
  // -----------------------------------------------------

  messageRow: {
    width: "100%",
    display: "flex",
    marginBottom: "7px",
  },

  messageGroup: {
    maxWidth: "76%",
    display: "flex",
    flexDirection: "column",
  },

  bubble: {
    padding: "10px 13px 8px",
    borderRadius: "17px",
    wordBreak: "break-word",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
  },

  myBubble: {
    color: "#ffffff",
    borderBottomRightRadius: "5px",
  },

  myBubbleSent: {
    background: "linear-gradient(135deg, #111827, #1f2937)",
  },

  myBubbleRead: {
    background: "linear-gradient(135deg, #075985, #0369a1)",
  },

  otherBubble: {
    background: "#ffffff",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: "5px",
  },

  messageText: {
    fontSize: "14px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },

  messageMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "5px",
    marginTop: "5px",
    fontSize: "10px",
    lineHeight: 1,
  },

  myMessageMeta: {
    color: "rgba(255,255,255,0.68)",
  },

  otherMessageMeta: {
    color: "#9ca3af",
  },

  checks: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "-2px",
  },

  checksSent: {
    color: "rgba(255,255,255,0.7)",
  },

  checksRead: {
    color: "#7dd3fc",
  },

  deleteButton: {
    border: "none",
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "10px",
    padding: "4px 2px",
    opacity: 0.8,
  },

  // -----------------------------------------------------
  // NOUVEAUX MESSAGES
  // -----------------------------------------------------

  newMessagesButton: {
    position: "sticky",
    bottom: "12px",
    alignSelf: "center",
    margin: "-45px auto 0",
    zIndex: 4,
    border: "none",
    borderRadius: "20px",
    background: "#111827",
    color: "#ffffff",
    padding: "9px 15px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(15, 23, 42, 0.22)",
  },

  // -----------------------------------------------------
  // COMPOSER
  // -----------------------------------------------------

  composer: {
    flexShrink: 0,
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    padding: "13px 15px 8px",
    background: "#ffffff",
    borderTop: "1px solid #edf0f4",
  },

  composerInner: {
    position: "relative",
    flex: 1,
    minWidth: 0,
  },

  textarea: {
    width: "100%",
    minHeight: "46px",
    maxHeight: "130px",
    boxSizing: "border-box",
    resize: "none",
    overflowY: "auto",
    border: "1px solid #dfe3e8",
    borderRadius: "15px",
    outline: "none",
    background: "#f8fafc",
    color: "#111827",
    padding: "12px 65px 11px 14px",
    fontSize: "16px",
    lineHeight: 1.4,
    fontFamily: "inherit",
    transition: "border-color 0.2s ease, background 0.2s ease",
  },

  characterCount: {
    position: "absolute",
    right: "11px",
    bottom: "8px",
    fontSize: "9px",
    color: "#9ca3af",
    pointerEvents: "none",
  },

  sendButton: {
    flexShrink: 0,
    minWidth: "105px",
    height: "46px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #111827, #374151)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 15px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(17, 24, 39, 0.18)",
    transition: "transform 0.15s ease, opacity 0.2s ease",
  },

  sendButtonDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  sendIcon: {
    fontSize: "14px",
  },

  buttonSpinner: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#ffffff",
    animation: "conversationSpin 0.7s linear infinite",
  },

  composerHint: {
    flexShrink: 0,
    textAlign: "right",
    padding: "0 16px 10px",
    color: "#a1a1aa",
    fontSize: "9px",
    background: "#ffffff",
  },

  // -----------------------------------------------------
  // MODAL
  // -----------------------------------------------------

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  modal: {
    width: "100%",
    maxWidth: "380px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxSizing: "border-box",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.2)",
    textAlign: "center",
  },

  modalIcon: {
    width: "52px",
    height: "52px",
    margin: "0 auto 14px",
    borderRadius: "50%",
    background: "#fff1f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  modalTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    color: "#111827",
  },

  modalText: {
    margin: "0 0 22px",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  modalActions: {
    display: "flex",
    gap: "10px",
  },

  cancelButton: {
    flex: 1,
    height: "44px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#374151",
    fontWeight: 700,
    cursor: "pointer",
  },

  confirmDeleteButton: {
    flex: 1,
    height: "44px",
    border: "none",
    borderRadius: "12px",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
