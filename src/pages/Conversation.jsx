import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiMessageCircle,
  FiSend,
  FiTrash2,
  FiAlertCircle,
  FiX,
  FiUser,
  FiTruck,
  FiClock,
} from "react-icons/fi";

import { socket } from "../services/socket";

export default function Conversation({ role = "client" }) {
  const navigate = useNavigate();
  const { commandeId } = useParams();

  const API_URL = import.meta.env.VITE_API_URL || "";

  // =====================================================
  // AUTHENTIFICATION
  // =====================================================

  const typeUtilisateur =
    role === "livreur" ? "livreur" : "client";

  const tokenKey =
    typeUtilisateur === "livreur"
      ? "tokenLivreur"
      : "token";

  const token = localStorage.getItem(tokenKey);

  // =====================================================
  // REFS
  // =====================================================

  const messagesContainerRef = useRef(null);

  const premierChargementRef = useRef(true);

  const conversationIdRef = useRef(null);

  const messagesRef = useRef([]);

  const estEnBasRef = useRef(true);

  // =====================================================
  // ÉTATS
  // =====================================================

  const [conversation, setConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [nouveauMessage, setNouveauMessage] =
    useState("");

  const [loading, setLoading] = useState(true);

  const [envoiEnCours, setEnvoiEnCours] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [messageInfo, setMessageInfo] =
    useState("");

  const [suppressionEnCours, setSuppressionEnCours] =
    useState(null);

  const [confirmationSuppression, setConfirmationSuppression] =
    useState(null);

  const [estEnBas, setEstEnBas] = useState(true);

  const [nouveauxMessages, setNouveauxMessages] =
    useState(0);

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

      const base64 = parties[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payload = JSON.parse(atob(base64));

      if (!payload.userId) {
        return null;
      }

      return {
        id: payload.userId,
        type: typeUtilisateur,
      };
    } catch (error) {
      console.error(
        "Erreur lecture token :",
        error,
      );

      return null;
    }
  }, [token, typeUtilisateur]);

  // =====================================================
  // SYNCHRONISATION REFS
  // =====================================================

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    estEnBasRef.current = estEnBas;
  }, [estEnBas]);

  useEffect(() => {
    conversationIdRef.current =
      conversation?._id || null;
  }, [conversation?._id]);

  // =====================================================
  // FETCH API
  // =====================================================

  const fetchAPI = useCallback(
    async (url, options = {}) => {
      if (!token) {
        throw new Error(
          "Token d'authentification manquant.",
        );
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
        throw new Error(
          data?.message ||
            `Erreur HTTP ${response.status}`,
        );
      }

      return data;
    },
    [token],
  );

  // =====================================================
  // MESSAGE À MOI
  // =====================================================

  const estMonMessage = useCallback(
    (message) => {
      if (
        !message?.expediteur ||
        !utilisateurConnecte
      ) {
        return false;
      }

      return (
        message.expediteur.type ===
          utilisateurConnecte.type &&
        String(
          message.expediteur.id,
        ) ===
          String(utilisateurConnecte.id)
      );
    },
    [utilisateurConnecte],
  );

  // =====================================================
  // SCROLL
  // =====================================================

  const scrollVersBas = useCallback(
    (smooth = true) => {
      const container =
        messagesContainerRef.current;

      if (!container) {
        return;
      }

      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [],
  );

  const verifierSiEnBas = useCallback(() => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      estEnBasRef.current = true;
      setEstEnBas(true);
      return true;
    }

    const distance =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    const procheDuBas = distance < 100;

    estEnBasRef.current = procheDuBas;

    setEstEnBas(procheDuBas);

    if (procheDuBas) {
      setNouveauxMessages(0);
    }

    return procheDuBas;
  }, []);

  useEffect(() => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      verifierSiEnBas();
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [verifierSiEnBas, loading]);

  // =====================================================
  // CRÉER / RÉCUPÉRER CONVERSATION
  // =====================================================

  const chargerConversation =
    useCallback(async () => {
      if (!commandeId) {
        setErreur(
          "Identifiant de commande manquant.",
        );

        return null;
      }

      if (!token) {
        setErreur(
          typeUtilisateur === "livreur"
            ? "Vous devez être connecté en tant que livreur."
            : "Vous devez être connecté en tant que client.",
        );

        return null;
      }

      try {
        const data = await fetchAPI(
          `${API_URL}/api/conversations`,
          {
            method: "POST",
            body: JSON.stringify({
              commandeId,
            }),
          },
        );

        if (!data?.conversation?._id) {
          throw new Error(
            "La conversation n'a pas été retournée par le serveur.",
          );
        }

        const conversationChargee =
          data.conversation;

        conversationIdRef.current =
          conversationChargee._id;

        setConversation(
          conversationChargee,
        );

        return conversationChargee;
      } catch (error) {
        console.error(
          "ERREUR CHARGEMENT CONVERSATION :",
          error,
        );

        setErreur(
          error.message ||
            "Impossible de charger la conversation.",
        );

        return null;
      }
    }, [
      API_URL,
      commandeId,
      fetchAPI,
      token,
      typeUtilisateur,
    ]);

  // =====================================================
  // RÉCUPÉRER LES MESSAGES
  // =====================================================

  const chargerMessages = useCallback(
    async (
      conversationId,
      afficherErreur = true,
    ) => {
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

        const nouveaux =
          data?.messages || [];

        /*
         * On fusionne avec les messages déjà
         * reçus en temps réel afin qu'un message
         * Socket.IO ne soit pas écrasé par une
         * requête REST arrivée un peu plus tard.
         */
        setMessages((anciensMessages) => {
          const map = new Map();

          anciensMessages.forEach((message) => {
            if (message?._id) {
              map.set(
                String(message._id),
                message,
              );
            }
          });

          nouveaux.forEach((message) => {
            if (message?._id) {
              map.set(
                String(message._id),
                message,
              );
            }
          });

          return Array.from(map.values()).sort(
            (a, b) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime(),
          );
        });

        return nouveaux;
      } catch (error) {
        console.error(
          "ERREUR CHARGEMENT MESSAGES :",
          error,
        );

        if (afficherErreur) {
          setErreur(
            error.message ||
              "Impossible de récupérer les messages.",
          );
        }

        return null;
      }
    },
    [API_URL, fetchAPI],
  );

  // =====================================================
  // MARQUER COMME LU
  // =====================================================

  const marquerMessagesCommeLus =
    useCallback(
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

          setMessages(
            (anciensMessages) =>
              anciensMessages.map(
                (message) => {
                  if (
                    !estMonMessage(message)
                  ) {
                    return {
                      ...message,
                      lu: true,
                    };
                  }

                  return message;
                },
              ),
          );
        } catch (error) {
          console.error(
            "ERREUR MARQUAGE MESSAGES LUS :",
            error,
          );
        }
      },
      [
        API_URL,
        fetchAPI,
        estMonMessage,
      ],
    );

  // =====================================================
  // INITIALISATION RAPIDE
  // =====================================================

  useEffect(() => {
    let actif = true;

    const initialiser = async () => {
      setErreur("");
      setLoading(true);

      /*
       * 1. On récupère uniquement la conversation.
       *
       * Dès qu'elle existe, l'interface est affichée.
       * Le chargement des messages ne bloque plus
       * l'ouverture de la page.
       */
      const conversationChargee =
        await chargerConversation();

      if (!actif) {
        return;
      }

      if (!conversationChargee?._id) {
        setLoading(false);
        return;
      }

      /*
       * IMPORTANT :
       * l'interface devient disponible immédiatement.
       */
      setLoading(false);

      /*
       * 2. Les messages sont chargés ensuite,
       * sans bloquer l'affichage.
       */
      const messagesCharges =
        await chargerMessages(
          conversationChargee._id,
          true,
        );

      if (!actif) {
        return;
      }

      /*
       * 3. On marque les messages comme lus
       * en arrière-plan.
       */
      marquerMessagesCommeLus(
        conversationChargee._id,
      );

      /*
       * 4. Positionnement en bas après
       * réception des messages.
       */
      if (
        messagesCharges &&
        messagesCharges.length > 0
      ) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollVersBas(false);
            verifierSiEnBas();
          });
        });
      }

      premierChargementRef.current =
        false;
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
  // SOCKET.IO PARTAGÉ
  // =====================================================

  useEffect(() => {
    if (
      !utilisateurConnecte?.id ||
      !commandeId
    ) {
      return;
    }

    /*
     * IMPORTANT :
     *
     * On utilise le socket singleton de
     * services/socket.js.
     *
     * On ne fait surtout PAS socket.disconnect()
     * ici car ce socket est utilisé par toute
     * l'application.
     */

    const rejoindreRooms = () => {
      socket.emit(
        "join_room",
        utilisateurConnecte.id,
      );

      socket.emit(
        "join_commande",
        commandeId,
      );
    };

    // ===================================================
    // NOUVEAU MESSAGE
    // ===================================================

    const handleNouveauMessage = (
      data,
    ) => {
      if (!data?.nouveauMessage) {
        return;
      }

      if (
        String(data.commandeId) !==
        String(commandeId)
      ) {
        return;
      }

      const currentConversationId =
        conversationIdRef.current;

      if (
        currentConversationId &&
        data.conversationId &&
        String(
          data.conversationId,
        ) !==
          String(currentConversationId)
      ) {
        return;
      }

      const message =
        data.nouveauMessage;

      if (!message?._id) {
        return;
      }

      /*
       * Anti-doublon.
       */
      const existeDeja =
        messagesRef.current.some(
          (ancienMessage) =>
            String(
              ancienMessage._id,
            ) ===
            String(message._id),
        );

      if (!existeDeja) {
        setMessages(
          (anciensMessages) => {
            const dejaPresent =
              anciensMessages.some(
                (ancienMessage) =>
                  String(
                    ancienMessage._id,
                  ) ===
                  String(message._id),
              );

            if (dejaPresent) {
              return anciensMessages;
            }

            return [
              ...anciensMessages,
              message,
            ].sort(
              (a, b) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime(),
            );
          },
        );
      }

      /*
       * Si c'est notre propre message,
       * le serveur nous l'a déjà renvoyé
       * via la requête POST.
       */
      if (estMonMessage(message)) {
        return;
      }

      const container =
        messagesContainerRef.current;

      const distance = container
        ? container.scrollHeight -
          container.scrollTop -
          container.clientHeight
        : 0;

      const procheDuBas =
        distance < 100;

      if (procheDuBas) {
        requestAnimationFrame(() => {
          scrollVersBas(true);
        });

        const currentConversationId =
          conversationIdRef.current;

        if (currentConversationId) {
          marquerMessagesCommeLus(
            currentConversationId,
          );
        }
      } else {
        setNouveauxMessages(
          (nombre) =>
            nombre + 1,
        );

        setMessageInfo(
          "Nouveau message reçu.",
        );

        setTimeout(() => {
          setMessageInfo("");
        }, 3000);
      }
    };

    // ===================================================
    // MESSAGES LUS
    // ===================================================

    const handleMessagesLus = (
      data,
    ) => {
      if (!data) {
        return;
      }

      if (
        data.commandeId &&
        String(data.commandeId) !==
          String(commandeId)
      ) {
        return;
      }

      const currentConversationId =
        conversationIdRef.current;

      if (
        currentConversationId &&
        data.conversationId &&
        String(
          data.conversationId,
        ) !==
          String(currentConversationId)
      ) {
        return;
      }

      setMessages(
        (anciensMessages) =>
          anciensMessages.map(
            (message) => {
              if (
                estMonMessage(message)
              ) {
                return {
                  ...message,
                  lu: true,
                };
              }

              return message;
            },
          ),
      );
    };

    // ===================================================
    // MESSAGE SUPPRIMÉ
    // ===================================================

    const handleMessageSupprime = (
      data,
    ) => {
      if (!data?.messageId) {
        return;
      }

      if (
        data.commandeId &&
        String(data.commandeId) !==
          String(commandeId)
      ) {
        return;
      }

      const currentConversationId =
        conversationIdRef.current;

      if (
        currentConversationId &&
        data.conversationId &&
        String(
          data.conversationId,
        ) !==
          String(currentConversationId)
      ) {
        return;
      }

      setMessages(
        (anciensMessages) =>
          anciensMessages.filter(
            (message) =>
              String(message._id) !==
              String(data.messageId),
          ),
      );

      if (
        data.derniermessage !==
        undefined
      ) {
        setConversation(
          (ancienneConversation) => {
            if (!ancienneConversation) {
              return ancienneConversation;
            }

            return {
              ...ancienneConversation,
              derniermessage:
                data.derniermessage,
            };
          },
        );
      }
    };

    // ===================================================
    // CONNEXION
    // ===================================================

    socket.on(
      "connect",
      rejoindreRooms,
    );

    socket.on(
      "nouveau_message",
      handleNouveauMessage,
    );

    socket.on(
      "messages_lus",
      handleMessagesLus,
    );

    socket.on(
      "message_supprime",
      handleMessageSupprime,
    );

    /*
     * Si le singleton est déjà connecté,
     * on rejoint immédiatement les rooms.
     */
    if (socket.connected) {
      rejoindreRooms();
    }

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      socket.off(
        "connect",
        rejoindreRooms,
      );

      socket.off(
        "nouveau_message",
        handleNouveauMessage,
      );

      socket.off(
        "messages_lus",
        handleMessagesLus,
      );

      socket.off(
        "message_supprime",
        handleMessageSupprime,
      );

      socket.emit(
        "leave_commande",
        commandeId,
      );
    };
  }, [
    commandeId,
    utilisateurConnecte?.id,
    estMonMessage,
    marquerMessagesCommeLus,
    scrollVersBas,
  ]);

  // =====================================================
  // POLLING DE SÉCURITÉ
  // =====================================================

  useEffect(() => {
    if (!conversation?._id) {
      return;
    }

    const conversationId =
      conversation._id;

    const interval =
      setInterval(async () => {
        const container =
          messagesContainerRef.current;

        const etaitEnBas = container
          ? container.scrollHeight -
              container.scrollTop -
              container.clientHeight <
            100
          : true;

        const anciensMessages =
          messagesRef.current;

        const messagesActualises =
          await chargerMessages(
            conversationId,
            false,
          );

        if (!messagesActualises) {
          return;
        }

        const anciensIds =
          new Set(
            anciensMessages.map(
              (msg) =>
                String(msg._id),
            ),
          );

        const messagesNouveaux =
          messagesActualises.filter(
            (msg) =>
              !anciensIds.has(
                String(msg._id),
              ) &&
              !estMonMessage(msg),
          );

        if (
          messagesNouveaux.length > 0
        ) {
          if (etaitEnBas) {
            requestAnimationFrame(() => {
              scrollVersBas(true);
            });

            setNouveauxMessages(0);

            marquerMessagesCommeLus(
              conversationId,
            );
          } else {
            setNouveauxMessages(
              (nombre) =>
                nombre +
                messagesNouveaux.length,
            );
          }
        } else if (etaitEnBas) {
          setNouveauxMessages(0);

          marquerMessagesCommeLus(
            conversationId,
          );
        }
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    conversation?._id,
    chargerMessages,
    estMonMessage,
    marquerMessagesCommeLus,
    scrollVersBas,
  ]);

  // =====================================================
  // ENVOYER
  // =====================================================

  const envoyerMessage = async (
    event,
  ) => {
    event?.preventDefault();

    const texte =
      nouveauMessage.trim();

    if (!texte) {
      return;
    }

    if (!conversation?._id) {
      setErreur(
        "Conversation introuvable.",
      );

      return;
    }

    if (texte.length > 1000) {
      setErreur(
        "Le message ne peut pas dépasser 1000 caractères.",
      );

      return;
    }

    try {
      setEnvoiEnCours(true);

      setErreur("");
      setMessageInfo("");

      const data =
        await fetchAPI(
          `${API_URL}/api/conversations/${conversation._id}/messages`,
          {
            method: "POST",
            body: JSON.stringify({
              message: texte,
            }),
          },
        );

      if (
        data?.nouveauMessage
      ) {
        setMessages(
          (anciensMessages) => {
            const existeDeja =
              anciensMessages.some(
                (message) =>
                  String(
                    message._id,
                  ) ===
                  String(
                    data.nouveauMessage
                      ._id,
                  ),
              );

            if (existeDeja) {
              return anciensMessages;
            }

            return [
              ...anciensMessages,
              data.nouveauMessage,
            ].sort(
              (a, b) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime(),
            );
          },
        );
      } else {
        await chargerMessages(
          conversation._id,
          false,
        );
      }

      setConversation(
        (ancienneConversation) => {
          if (!ancienneConversation) {
            return ancienneConversation;
          }

          return {
            ...ancienneConversation,
            derniermessage: texte,
          };
        },
      );

      setNouveauMessage("");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollVersBas(true);
        });
      });

      setNouveauxMessages(0);
    } catch (error) {
      console.error(
        "ERREUR ENVOI MESSAGE :",
        error,
      );

      setErreur(
        error.message ||
          "Impossible d'envoyer le message.",
      );
    } finally {
      setEnvoiEnCours(false);
    }
  };

  // =====================================================
  // SUPPRESSION
  // =====================================================

  const demanderSuppression = (
    messageId,
  ) => {
    setConfirmationSuppression(
      messageId,
    );
  };

  const supprimerMessage = async (
    messageId,
  ) => {
    if (
      !conversation?._id ||
      !messageId
    ) {
      return;
    }

    try {
      setSuppressionEnCours(
        messageId,
      );

      setErreur("");

      const data =
        await fetchAPI(
          `${API_URL}/api/conversations/${conversation._id}/messages/${messageId}`,
          {
            method: "DELETE",
          },
        );

      if (data?.conversation) {
        setConversation(
          data.conversation,
        );

        if (
          Array.isArray(
            data.conversation
              .messages,
          )
        ) {
          setMessages(
            data.conversation
              .messages,
          );
        } else {
          setMessages(
            (anciensMessages) =>
              anciensMessages.filter(
                (message) =>
                  String(
                    message._id,
                  ) !==
                  String(messageId),
              ),
          );
        }
      } else {
        setMessages(
          (anciensMessages) =>
            anciensMessages.filter(
              (message) =>
                String(message._id) !==
                String(messageId),
            ),
        );
      }

      setConfirmationSuppression(
        null,
      );

      setMessageInfo(
        "Message supprimé.",
      );

      setTimeout(() => {
        setMessageInfo("");
      }, 2500);
    } catch (error) {
      console.error(
        "ERREUR SUPPRESSION MESSAGE :",
        error,
      );

      setErreur(
        error.message ||
          "Impossible de supprimer le message.",
      );
    } finally {
      setSuppressionEnCours(
        null,
      );
    }
  };

  // =====================================================
  // DATES
  // =====================================================

  const formaterHeure = (
    date,
  ) => {
    if (!date) {
      return "";
    }

    const dateObj =
      new Date(date);

    if (
      Number.isNaN(
        dateObj.getTime(),
      )
    ) {
      return "";
    }

    return dateObj.toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const formaterJour = (
    date,
  ) => {
    if (!date) {
      return "";
    }

    const dateObj =
      new Date(date);

    if (
      Number.isNaN(
        dateObj.getTime(),
      )
    ) {
      return "";
    }

    return dateObj.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );
  };

  // =====================================================
  // GROUPEMENT PAR JOUR
  // =====================================================

  const messagesAvecSeparateurs =
    [];

  let dernierJour = null;

  messages.forEach(
    (message) => {
      const jour =
        new Date(
          message.date,
        ).toLocaleDateString(
          "fr-FR",
        );

      if (jour !== dernierJour) {
        messagesAvecSeparateurs.push(
          {
            type: "date",
            id: `date-${jour}`,
            date: message.date,
          },
        );

        dernierJour = jour;
      }

      messagesAvecSeparateurs.push(
        {
          type: "message",
          ...message,
        },
      );
    },
  );

  // =====================================================
  // LOADING INITIAL
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div
            style={
              styles.loadingSpinner
            }
          />

          <strong>
            Ouverture de la
            conversation
          </strong>

          <span>
            Connexion en cours...
          </span>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDU
  // =====================================================

  const interlocuteurEstLivreur =
    typeUtilisateur === "client";

  return (
    <div style={styles.page}>
      <div style={styles.appShell}>
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header style={styles.header}>
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            style={styles.backButton}
            aria-label="Retour"
            title="Retour"
          >
            <FiArrowLeft size={21} />
          </button>

          <div
            style={styles.avatar}
          >
            {interlocuteurEstLivreur ? (
              <FiTruck size={21} />
            ) : (
              <FiUser size={21} />
            )}
          </div>

          <div
            style={
              styles.headerIdentity
            }
          >
            <div
              style={
                styles.headerName
              }
            >
              {interlocuteurEstLivreur
                ? "Livreur"
                : "Client"}
            </div>

            <div
              style={
                styles.onlineStatus
              }
            >
              <span
                style={
                  styles.onlineDot
                }
              />

              Conversation active
            </div>
          </div>

          <div
            style={
              styles.headerRight
            }
          >
            <span
              style={
                styles.orderLabel
              }
            >
              <FiClock size={11} />
              Commande
            </span>

            <span
              style={styles.orderId}
            >
              #
              {String(
                commandeId,
              ).slice(-6)}
            </span>
          </div>
        </header>

        {/* ================================================= */}
        {/* ALERTES */}
        {/* ================================================= */}

        {erreur && (
          <div
            style={
              styles.errorBox
            }
          >
            <FiAlertCircle
              size={18}
            />

            <span
              style={
                styles.alertText
              }
            >
              {erreur}
            </span>

            <button
              type="button"
              onClick={() =>
                setErreur("")
              }
              style={
                styles.closeAlertButton
              }
              aria-label="Fermer"
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        {messageInfo && (
          <div
            style={
              styles.successBox
            }
          >
            <FiCheckCircle
              size={18}
            />

            <span>
              {messageInfo}
            </span>
          </div>
        )}

        {/* ================================================= */}
        {/* CHAT */}
        {/* ================================================= */}

        <main
          style={styles.chatCard}
        >
          <div
            ref={
              messagesContainerRef
            }
            style={
              styles.messagesContainer
            }
          >
            {messages.length ===
            0 ? (
              <div
                style={
                  styles.emptyState
                }
              >
                <div
                  style={
                    styles.emptyAvatar
                  }
                >
                  <FiMessageCircle
                    size={34}
                  />
                </div>

                <h2
                  style={
                    styles.emptyTitle
                  }
                >
                  Aucun message
                </h2>

                <p
                  style={
                    styles.emptyText
                  }
                >
                  Envoyez un message
                  pour commencer la
                  conversation.
                </p>
              </div>
            ) : (
              <div
                style={
                  styles.messagesList
                }
              >
                {messagesAvecSeparateurs.map(
                  (item) => {
                    if (
                      item.type ===
                      "date"
                    ) {
                      return (
                        <div
                          key={item.id}
                          style={
                            styles.dateSeparator
                          }
                        >
                          <span
                            style={
                              styles.dateLine
                            }
                          />

                          <span
                            style={
                              styles.dateBadge
                            }
                          >
                            {formaterJour(
                              item.date,
                            )}
                          </span>

                          <span
                            style={
                              styles.dateLine
                            }
                          />
                        </div>
                      );
                    }

                    const monMessage =
                      estMonMessage(
                        item,
                      );

                    const messageLu =
                      item.lu ===
                      true;

                    return (
                      <div
                        key={
                          item._id
                        }
                        style={{
                          ...styles.messageRow,
                          justifyContent:
                            monMessage
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageGroup,
                            alignItems:
                              monMessage
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <div
                            style={{
                              ...styles.bubble,

                              ...(monMessage
                                ? styles.myBubble
                                : styles.otherBubble),

                              ...(monMessage &&
                              messageLu
                                ? styles.myBubbleRead
                                : {}),

                              ...(monMessage &&
                              !messageLu
                                ? styles.myBubbleSent
                                : {}),
                            }}
                          >
                            <div
                              style={
                                styles.messageText
                              }
                            >
                              {
                                item.message
                              }
                            </div>

                            <div
                              style={{
                                ...styles.messageMeta,

                                ...(monMessage
                                  ? styles.myMessageMeta
                                  : styles.otherMessageMeta),
                              }}
                            >
                              <span>
                                {formaterHeure(
                                  item.date,
                                )}
                              </span>

                              {monMessage && (
                                <span
                                  style={{
                                    ...styles.checks,

                                    ...(messageLu
                                      ? styles.checksRead
                                      : styles.checksSent),
                                  }}
                                  title={
                                    messageLu
                                      ? "Lu"
                                      : "Envoyé"
                                  }
                                >
                                  {messageLu ? (
                                    <span
                                      style={
                                        styles.doubleChecks
                                      }
                                    >
                                      <FiCheck
                                        size={
                                          12
                                        }
                                        strokeWidth={
                                          3
                                        }
                                      />

                                      <FiCheck
                                        size={
                                          12
                                        }
                                        strokeWidth={
                                          3
                                        }
                                        style={{
                                          position:
                                            "absolute",
                                          left: "5px",
                                          top: "0",
                                        }}
                                      />
                                    </span>
                                  ) : (
                                    <FiCheck
                                      size={
                                        12
                                      }
                                      strokeWidth={
                                        3
                                      }
                                    />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {monMessage && (
                            <button
                              type="button"
                              onClick={() =>
                                demanderSuppression(
                                  item._id,
                                )
                              }
                              disabled={
                                suppressionEnCours ===
                                item._id
                              }
                              style={
                                styles.deleteButton
                              }
                              title="Supprimer le message"
                            >
                              <FiTrash2
                                size={12}
                              />

                              <span>
                                {suppressionEnCours ===
                                item._id
                                  ? "Suppression..."
                                  : "Supprimer"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}

            {/* ================================================= */}
            {/* NOUVEAUX MESSAGES */}
            {/* ================================================= */}

            {!estEnBas &&
              nouveauxMessages >
                0 && (
                <button
                  type="button"
                  onClick={() => {
                    scrollVersBas(
                      true,
                    );

                    setNouveauxMessages(
                      0,
                    );

                    if (
                      conversation?._id
                    ) {
                      marquerMessagesCommeLus(
                        conversation._id,
                      );
                    }
                  }}
                  style={
                    styles.newMessagesButton
                  }
                >
                  <FiChevronDown
                    size={16}
                  />

                  <span>
                    {
                      nouveauxMessages
                    }{" "}
                    nouveau
                    {nouveauxMessages >
                    1
                      ? "x"
                      : ""}{" "}
                    message
                    {nouveauxMessages >
                    1
                      ? "s"
                      : ""}
                  </span>
                </button>
              )}
          </div>

          {/* ================================================= */}
          {/* COMPOSER */}
          {/* ================================================= */}

          <form
            onSubmit={
              envoyerMessage
            }
            style={
              styles.composer
            }
          >
            <div
              style={
                styles.composerInner
              }
            >
              <textarea
                value={
                  nouveauMessage
                }
                onChange={(
                  event,
                ) => {
                  setNouveauMessage(
                    event.target
                      .value,
                  );

                  setErreur("");
                }}
                onInput={(
                  event,
                ) => {
                  event.target.style.height =
                    "auto";

                  event.target.style.height = `${Math.min(
                    event.target
                      .scrollHeight,
                    130,
                  )}px`;
                }}
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    envoyerMessage(
                      event,
                    );
                  }
                }}
                placeholder="Écrivez votre message..."
                maxLength={1000}
                rows={1}
                disabled={
                  envoiEnCours
                }
                style={
                  styles.textarea
                }
              />

              <div
                style={
                  styles.characterCount
                }
              >
                {
                  nouveauMessage.length
                }
                /1000
              </div>
            </div>

            <button
              type="submit"
              disabled={
                envoiEnCours ||
                !nouveauMessage.trim() ||
                !conversation
              }
              style={{
                ...styles.sendButton,

                ...(envoiEnCours ||
                !nouveauMessage.trim() ||
                !conversation
                  ? styles.sendButtonDisabled
                  : {}),
              }}
              aria-label="Envoyer le message"
              title="Envoyer"
            >
              {envoiEnCours ? (
                <span
                  style={
                    styles.buttonSpinner
                  }
                />
              ) : (
                <>
                  <span>
                    Envoyer
                  </span>

                  <FiSend size={16} />
                </>
              )}
            </button>
          </form>

          <div
            style={
              styles.composerHint
            }
          >
            <span>
              Entrée
            </span>{" "}
            pour envoyer
            <span
              style={
                styles.hintSeparator
              }
            >
              ·
            </span>
            <span>
              Maj + Entrée
            </span>{" "}
            pour aller à la ligne
          </div>
        </main>
      </div>

      {/* =================================================== */}
      {/* MODAL SUPPRESSION */}
      {/* =================================================== */}

      {confirmationSuppression && (
        <div
          style={
            styles.modalOverlay
          }
        >
          <div
            style={styles.modal}
          >
            <div
              style={
                styles.modalIcon
              }
            >
              <FiTrash2 size={24} />
            </div>

            <h3
              style={
                styles.modalTitle
              }
            >
              Supprimer ce
              message ?
            </h3>

            <p
              style={
                styles.modalText
              }
            >
              Cette action
              supprimera
              définitivement le
              message de la
              conversation.
            </p>

            <div
              style={
                styles.modalActions
              }
            >
              <button
                type="button"
                onClick={() =>
                  setConfirmationSuppression(
                    null,
                  )
                }
                style={
                  styles.cancelButton
                }
              >
                <FiX size={16} />
                Annuler
              </button>

              <button
                type="button"
                onClick={() =>
                  supprimerMessage(
                    confirmationSuppression,
                  )
                }
                style={
                  styles.confirmDeleteButton
                }
                disabled={
                  suppressionEnCours !==
                  null
                }
              >
                <FiTrash2 size={16} />
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
  page: {
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #f5f7fb 0%, #eef2f7 100%)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    overflow: "hidden",
  },

  appShell: {
    width: "100%",
    height: "100vh",
    minHeight: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  loadingCard: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#1f2937",
  },

  loadingSpinner: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#111827",
    animation:
      "conversationSpin 0.8s linear infinite",
  },

  header: {
    flexShrink: 0,
    width: "100%",
    minHeight: "72px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#ffffff",
    borderBottom:
      "1px solid #e6e9ef",
    padding: "12px 24px",
    boxShadow:
      "0 3px 15px rgba(15, 23, 42, 0.06)",
    zIndex: 5,
  },

  backButton: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    border:
      "1px solid #e4e7ec",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #111827, #374151)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 4px 12px rgba(17, 24, 39, 0.18)",
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
    boxShadow:
      "0 0 0 3px rgba(34,197,94,0.12)",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",
    paddingLeft: "15px",
  },

  orderLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
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

  errorBox: {
    flexShrink: 0,
    width: "100%",
    boxSizing: "border-box",
    background: "#fff5f5",
    borderBottom:
      "1px solid #fecaca",
    color: "#b91c1c",
    padding: "11px 24px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
  },

  alertText: {
    flex: 1,
  },

  successBox: {
    flexShrink: 0,
    width: "100%",
    boxSizing: "border-box",
    background: "#f0fdf4",
    borderBottom:
      "1px solid #bbf7d0",
    color: "#166534",
    padding: "11px 24px",
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
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
  },

  chatCard: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    overflow: "hidden",
  },

  messagesContainer: {
    position: "relative",
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    WebkitOverflowScrolling:
      "touch",
    overscrollBehavior: "contain",
    background:
      "radial-gradient(circle at top left, rgba(17,24,39,0.025), transparent 35%), #fafbfc",
    padding:
      "24px clamp(14px, 4vw, 70px)",
    boxSizing: "border-box",
  },

  messagesList: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },

  emptyState: {
    width: "100%",
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
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "#eef2f7",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },

  emptyTitle: {
    margin: "0 0 7px",
    fontSize: "18px",
    color: "#1f2937",
  },

  emptyText: {
    margin: 0,
    fontSize: "13px",
    color: "#9ca3af",
  },

  dateSeparator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    margin: "12px 0 20px",
  },

  dateLine: {
    height: "1px",
    flex: 1,
    maxWidth: "120px",
    background: "#e5e7eb",
  },

  dateBadge: {
    flexShrink: 0,
    padding: "6px 11px",
    borderRadius: "20px",
    background: "#eef1f5",
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: 700,
  },

  messageRow: {
    width: "100%",
    display: "flex",
    marginBottom: "8px",
  },

  messageGroup: {
    maxWidth: "min(76%, 680px)",
    display: "flex",
    flexDirection: "column",
  },

  bubble: {
    padding: "11px 14px 8px",
    borderRadius: "17px",
    wordBreak: "break-word",
    boxShadow:
      "0 1px 2px rgba(15, 23, 42, 0.06)",
  },

  myBubble: {
    color: "#ffffff",
    borderBottomRightRadius: "5px",
  },

  myBubbleSent: {
    background:
      "linear-gradient(135deg, #111827, #1f2937)",
  },

  myBubbleRead: {
    background:
      "linear-gradient(135deg, #075985, #0369a1)",
  },

  otherBubble: {
    background: "#ffffff",
    color: "#1f2937",
    border:
      "1px solid #e5e7eb",
    borderBottomLeftRadius: "5px",
  },

  messageText: {
    fontSize: "14px",
    lineHeight: 1.55,
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
    display: "inline-flex",
    alignItems: "center",
    position: "relative",
    width: "17px",
    height: "14px",
  },

  doubleChecks: {
    position: "relative",
    width: "17px",
    height: "14px",
    display: "inline-block",
  },

  checksSent: {
    color: "rgba(255,255,255,0.72)",
  },

  checksRead: {
    color: "#38bdf8",
  },

  deleteButton: {
    border: "none",
    background: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "10px",
    padding: "4px 2px",
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

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
    boxShadow:
      "0 5px 15px rgba(15, 23, 42, 0.22)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  composer: {
    flexShrink: 0,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    padding:
      "14px clamp(14px, 4vw, 70px) 8px",
    background: "#ffffff",
    borderTop:
      "1px solid #edf0f4",
  },

  composerInner: {
    position: "relative",
    flex: 1,
    minWidth: 0,
  },

  textarea: {
    width: "100%",
    minHeight: "48px",
    maxHeight: "130px",
    boxSizing: "border-box",
    resize: "none",
    overflowY: "auto",
    border:
      "1px solid #dfe3e8",
    borderRadius: "15px",
    outline: "none",
    background: "#f8fafc",
    color: "#111827",
    padding:
      "12px 65px 11px 14px",
    fontSize: "16px",
    lineHeight: 1.4,
    fontFamily: "inherit",
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
    minWidth: "108px",
    height: "48px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #111827, #374151)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 16px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow:
      "0 4px 12px rgba(17, 24, 39, 0.18)",
  },

  sendButtonDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  buttonSpinner: {
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    border:
      "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#ffffff",
    animation:
      "conversationSpin 0.7s linear infinite",
  },

  composerHint: {
    flexShrink: 0,
    textAlign: "right",
    padding:
      "0 clamp(14px, 4vw, 70px) 9px",
    color: "#a1a1aa",
    fontSize: "9px",
    background: "#ffffff",
  },

  hintSeparator: {
    margin: "0 5px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background:
      "rgba(15, 23, 42, 0.45)",
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
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.2)",
    textAlign: "center",
  },

  modalIcon: {
    width: "52px",
    height: "52px",
    margin: "0 auto 14px",
    borderRadius: "50%",
    background: "#fff1f2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    border:
      "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#374151",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
  },
};