import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  // =====================================================
  // IDENTITÉ DE L'UTILISATEUR
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
  // UTILITAIRE FETCH
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
  // CRÉER / RÉCUPÉRER LA CONVERSATION
  // =====================================================

  const chargerConversation = useCallback(async () => {
    if (!commandeId) {
      setErreur("Identifiant de commande manquant.");
      setLoading(false);
      return;
    }

    if (!token) {
      setErreur(
        typeUtilisateur === "livreur"
          ? "Vous devez être connecté en tant que livreur."
          : "Vous devez être connecté en tant que client.",
      );
      setLoading(false);
      return;
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
        return;
      }

      try {
        const data = await fetchAPI(
          `${API_URL}/api/conversations/${conversationId}/messages`,
          {
            method: "GET",
          },
        );

        setMessages(data?.messages || []);

        return data?.messages || [];
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
  // MARQUER LES MESSAGES COMME LUS
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

      await chargerMessages(conversationChargee._id, true);

      await marquerMessagesCommeLus(conversationChargee._id);

      if (actif) {
        setLoading(false);
      }
    };

    initialiser();

    return () => {
      actif = false;
    };
  }, [chargerConversation, chargerMessages, marquerMessagesCommeLus]);

  // =====================================================
  // ACTUALISATION DES MESSAGES
  // =====================================================

  useEffect(() => {
    if (!conversation?._id) {
      return;
    }

    const interval = setInterval(async () => {
      await chargerMessages(conversation._id, false);

      await marquerMessagesCommeLus(conversation._id);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [conversation?._id, chargerMessages, marquerMessagesCommeLus]);

  // =====================================================
  // ENVOYER UN MESSAGE
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
    } catch (error) {
      console.error("ERREUR ENVOI MESSAGE :", error);

      setErreur(error.message || "Impossible d'envoyer le message.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  // =====================================================
  // SUPPRIMER UN MESSAGE
  // =====================================================

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

      setMessageInfo("Message supprimé.");
    } catch (error) {
      console.error("ERREUR SUPPRESSION MESSAGE :", error);

      setErreur(error.message || "Impossible de supprimer le message.");
    } finally {
      setSuppressionEnCours(null);
    }
  };

  // =====================================================
  // DÉTERMINER SI LE MESSAGE APPARTIENT À L'UTILISATEUR
  // =====================================================

  const estMonMessage = (message) => {
    if (!message?.expediteur || !utilisateurConnecte) {
      return false;
    }

    return (
      message.expediteur.type === utilisateurConnecte.type &&
      String(message.expediteur.id) === String(utilisateurConnecte.id)
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formaterDate = (date) => {
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
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // REGROUPER LES MESSAGES PAR JOUR
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
  // RETOUR
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.centerMessage}>Chargement de la conversation...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header style={styles.header}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.backButton}
          >
            ←
          </button>

          <div style={styles.headerContent}>
            <h1 style={styles.title}>Discussion</h1>

            <span style={styles.role}>
              {typeUtilisateur === "livreur" ? "Client" : "Livreur"}
            </span>
          </div>
        </header>

        {/* ================================================= */}
        {/* ERREUR */}
        {/* ================================================= */}

        {erreur && <div style={styles.errorBox}>{erreur}</div>}

        {/* ================================================= */}
        {/* INFORMATION */}
        {/* ================================================= */}

        {messageInfo && <div style={styles.infoBox}>{messageInfo}</div>}

        {/* ================================================= */}
        {/* CONVERSATION */}
        {/* ================================================= */}

        <main style={styles.chatCard}>
          {/* Messages */}

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyMessage}>
                <div style={styles.emptyIcon}>💬</div>

                <strong>Aucun message</strong>

                <span>Commencez la conversation.</span>
              </div>
            ) : (
              messagesAvecSeparateurs.map((item) => {
                if (item.type === "date") {
                  return (
                    <div key={item.id} style={styles.dateSeparator}>
                      <span>{formaterJour(item.date)}</span>
                    </div>
                  );
                }

                const monMessage = estMonMessage(item);

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
                        ...styles.messageWrapper,
                        alignItems: monMessage ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          ...styles.bubble,
                          ...(monMessage
                            ? styles.myBubble
                            : styles.otherBubble),
                        }}
                      >
                        <div style={styles.messageText}>{item.message}</div>

                        <div
                          style={{
                            ...styles.messageMeta,
                            ...(monMessage ? styles.myMeta : {}),
                          }}
                        >
                          <span>{formaterDate(item.date)}</span>

                          {monMessage && <span>{item.lu ? "✓✓" : "✓"}</span>}
                        </div>
                      </div>

                      {monMessage && (
                        <button
                          type="button"
                          onClick={() => supprimerMessage(item._id)}
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
              })
            )}
          </div>

          {/* ================================================= */}
          {/* FORMULAIRE */}
          {/* ================================================= */}

          <form onSubmit={envoyerMessage} style={styles.form}>
            <div style={styles.inputWrapper}>
              <textarea
                value={nouveauMessage}
                onChange={(event) => setNouveauMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    envoyerMessage(event);
                  }
                }}
                placeholder="Écrire un message..."
                maxLength={1000}
                rows={1}
                disabled={envoiEnCours}
                style={styles.textarea}
              />

              <div style={styles.counter}>{nouveauMessage.length}/1000</div>
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
            >
              {envoiEnCours ? "..." : "Envoyer"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "20px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },

  centerMessage: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#555",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#fff",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },

  backButton: {
    width: "42px",
    height: "42px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "22px",
  },

  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#111",
  },

  role: {
    fontSize: "13px",
    color: "#777",
  },

  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffcaca",
    color: "#b00020",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "12px",
    fontSize: "14px",
  },

  infoBox: {
    background: "#f0fff4",
    border: "1px solid #b8ebc6",
    color: "#237a3b",
    padding: "12px 14px",
    borderRadius: "12px",
    marginBottom: "12px",
    fontSize: "14px",
  },

  chatCard: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },

  messagesContainer: {
    height: "60vh",
    minHeight: "400px",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
    padding: "20px",
    boxSizing: "border-box",
  },

  emptyMessage: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#777",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "5px",
  },

  dateSeparator: {
    display: "flex",
    justifyContent: "center",
    margin: "15px 0",
  },

  dateSeparatorSpan: {
    background: "#f1f1f1",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#777",
  },

  messageRow: {
    display: "flex",
    width: "100%",
    marginBottom: "10px",
  },

  messageWrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "78%",
  },

  bubble: {
    padding: "10px 13px",
    borderRadius: "15px",
    wordBreak: "break-word",
  },

  myBubble: {
    background: "#111",
    color: "#fff",
    borderBottomRightRadius: "4px",
  },

  otherBubble: {
    background: "#f0f0f0",
    color: "#111",
    borderBottomLeftRadius: "4px",
  },

  messageText: {
    fontSize: "15px",
    lineHeight: 1.45,
    whiteSpace: "pre-wrap",
  },

  messageMeta: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "5px",
    fontSize: "10px",
    color: "#777",
  },

  myMeta: {
    color: "#ccc",
  },

  deleteButton: {
    border: "none",
    background: "transparent",
    color: "#999",
    cursor: "pointer",
    fontSize: "11px",
    padding: "4px 0",
  },

  form: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    borderTop: "1px solid #eee",
    alignItems: "flex-end",
  },

  inputWrapper: {
    flex: 1,
    position: "relative",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "none",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "12px 55px 12px 13px",
    fontSize: "16px",
    lineHeight: 1.4,
    outline: "none",
    minHeight: "46px",
    maxHeight: "120px",
    fontFamily: "inherit",
  },

  counter: {
    position: "absolute",
    right: "10px",
    bottom: "8px",
    fontSize: "10px",
    color: "#999",
  },

  sendButton: {
    minWidth: "90px",
    minHeight: "46px",
    border: "none",
    borderRadius: "12px",
    background: "#111",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    padding: "0 15px",
  },

  sendButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};
