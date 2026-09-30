import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCheck,
  FaCheckDouble,
  FaPaperPlane,
  FaTrash,
  FaUser,
  FaMotorcycle,
  FaCircle,
} from "react-icons/fa";

import styled from "styled-components";

export default function Conversation() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const [erreur, setErreur] = useState("");

  const [suppressionEnCours, setSuppressionEnCours] =
    useState(null);

  // =====================================================
  // IDENTITÉ CONNECTÉE
  // =====================================================

  const utilisateur = useMemo(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(
          token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/"),
        ),
      );

      return {
        id: payload.userId,
        type: "client",
      };
    } catch {
      return null;
    }
  }, []);

  const livreurUtilisateur = useMemo(() => {
    const token = localStorage.getItem("tokenLivreur");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(
          token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/"),
        ),
      );

      return {
        id: payload.userId,
        type: "livreur",
      };
    } catch {
      return null;
    }
  }, []);

  const utilisateurConnecte =
    utilisateur || livreurUtilisateur;

  // =====================================================
  // MON MESSAGE ?
  // =====================================================

  const estMonMessage = (msg) => {
    if (!utilisateurConnecte) {
      return false;
    }

    return (
      msg.expediteur?.type ===
        utilisateurConnecte.type &&
      msg.expediteur?.id?.toString() ===
        utilisateurConnecte.id?.toString()
    );
  };

  // =====================================================
  // CORRESPONDANT
  // =====================================================

  const typeCorrespondant =
    utilisateurConnecte?.type === "client"
      ? "livreur"
      : "client";

  // =====================================================
  // CHARGER LA CONVERSATION
  // =====================================================

  useEffect(() => {
    if (!conversationId) {
      setErreur(
        "Identifiant de conversation manquant.",
      );

      setLoading(false);

      return;
    }

    const chargerConversation = async () => {
      try {
        setLoading(true);
        setErreur("");

        const tokenClient =
          localStorage.getItem("token");

        const tokenLivreur =
          localStorage.getItem("tokenLivreur");

        const token =
          tokenClient || tokenLivreur;

        if (!token) {
          navigate("/login");
          return;
        }

        // ---------------------------------------------
        // RÉCUPÉRER LES MESSAGES
        // ---------------------------------------------

        const response = await fetch(
          `${API_URL}/api/conversations/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de récupérer la conversation.",
          );
        }

        setMessages(data.messages || []);

        // ---------------------------------------------
        // MARQUER COMME LU
        // ---------------------------------------------

        await fetch(
          `${API_URL}/api/conversations/${conversationId}/messages/read`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error(
          "CHARGEMENT CONVERSATION ERROR:",
          error,
        );

        setErreur(
          error.message ||
            "Impossible de charger la conversation.",
        );
      } finally {
        setLoading(false);
      }
    };

    chargerConversation();
  }, [
    API_URL,
    conversationId,
    navigate,
  ]);

  // =====================================================
  // SCROLL AUTOMATIQUE
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =====================================================
  // RAFRAÎCHISSEMENT TEMPORAIRE
  // =====================================================
  //
  // Pour l'instant pas de Socket.IO.
  //
  // On recharge donc périodiquement les messages.
  //
  // Plus tard :
  // Socket.IO remplacera complètement cette partie.
  //

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const tokenClient =
          localStorage.getItem("token");

        const tokenLivreur =
          localStorage.getItem("tokenLivreur");

        const token =
          tokenClient || tokenLivreur;

        if (!token) {
          return;
        }

        const response = await fetch(
          `${API_URL}/api/conversations/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setMessages(data.messages || []);
      } catch (error) {
        console.error(
          "REFRESH CHAT ERROR:",
          error,
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    API_URL,
    conversationId,
  ]);

  // =====================================================
  // ENVOYER MESSAGE
  // =====================================================

  const envoyerMessage = async (event) => {
    event.preventDefault();

    const texte = message.trim();

    if (!texte || envoiEnCours) {
      return;
    }

    try {
      setEnvoiEnCours(true);
      setErreur("");

      const tokenClient =
        localStorage.getItem("token");

      const tokenLivreur =
        localStorage.getItem("tokenLivreur");

      const token =
        tokenClient || tokenLivreur;

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: texte,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'envoyer le message.",
        );
      }

      // ---------------------------------------------
      // AJOUTER UNIQUEMENT LE NOUVEAU MESSAGE
      // ---------------------------------------------

      if (data.nouveauMessage) {
        setMessages((prev) => [
          ...prev,
          data.nouveauMessage,
        ]);
      } else if (data.conversation) {
        setMessages(
          data.conversation.messages || [],
        );
      }

      setMessage("");

      // Remet le focus dans le champ
      textareaRef.current?.focus();
    } catch (error) {
      console.error(
        "ENVOYER MESSAGE ERROR:",
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
  // SUPPRIMER MESSAGE
  // =====================================================

  const supprimerMessage = async (
    messageId,
  ) => {
    if (
      suppressionEnCours ||
      !conversationId
    ) {
      return;
    }

    try {
      setSuppressionEnCours(messageId);
      setErreur("");

      const tokenClient =
        localStorage.getItem("token");

      const tokenLivreur =
        localStorage.getItem("tokenLivreur");

      const token =
        tokenClient || tokenLivreur;

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/conversations/${conversationId}/messages/${messageId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer le message.",
        );
      }

      setMessages(
        data.conversation?.messages ||
          [],
      );
    } catch (error) {
      console.error(
        "SUPPRIMER MESSAGE ERROR:",
        error,
      );

      setErreur(
        error.message ||
          "Impossible de supprimer le message.",
      );
    } finally {
      setSuppressionEnCours(null);
    }
  };

  // =====================================================
  // FORMATER DATE
  // =====================================================

  const formaterHeure = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const formaterDateComplete = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );
  };

  // =====================================================
  // GROUPER LES MESSAGES PAR DATE
  // =====================================================

  const messagesAvecSeparateurs =
    useMemo(() => {
      let derniereDate = null;

      return messages.map((msg) => {
        const dateMessage = new Date(
          msg.date,
        );

        const cleDate =
          dateMessage.toLocaleDateString(
            "fr-FR",
          );

        const nouveauJour =
          cleDate !== derniereDate;

        derniereDate = cleDate;

        return {
          ...msg,
          nouveauJour,
          cleDate,
        };
      });
    }, [messages]);

  // =====================================================
  // COMPTEUR NON LUS
  // =====================================================

  const nombreNonLus = messages.filter(
    (msg) =>
      !estMonMessage(msg) &&
      msg.lu === false,
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Page>
        <LoadingScreen>
          <LoadingSpinner />

          <LoadingText>
            Chargement de la conversation...
          </LoadingText>
        </LoadingScreen>
      </Page>
    );
  }

  // =====================================================
  // ERREUR
  // =====================================================

  if (erreur && !messages.length) {
    return (
      <Page>
        <ErrorBox>
          <ErrorIcon>!</ErrorIcon>

          <h2>
            Impossible d'ouvrir le chat
          </h2>

          <p>{erreur}</p>

          <BackButton
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Retour
          </BackButton>
        </ErrorBox>
      </Page>
    );
  }

  // =====================================================
  // RENDU
  // =====================================================

  return (
    <Page>
      <ChatContainer>
        {/* =============================================
            HEADER
        ============================================= */}

        <ChatHeader>
          <BackButton
            onClick={() => navigate(-1)}
            title="Retour"
          >
            <FaArrowLeft />
          </BackButton>

          <Avatar
            $type={
              typeCorrespondant
            }
          >
            {typeCorrespondant ===
            "livreur" ? (
              <FaMotorcycle />
            ) : (
              <FaUser />
            )}
          </Avatar>

          <HeaderInfo>
            <ChatTitle>
              {typeCorrespondant ===
              "livreur"
                ? "Votre livreur"
                : "Client"}
            </ChatTitle>

            <ChatStatus>
              <StatusDot />

              <span>
                {nombreNonLus > 0
                  ? `${nombreNonLus} nouveau${
                      nombreNonLus > 1
                        ? "x"
                        : ""
                    } message${
                      nombreNonLus > 1
                        ? "s"
                        : ""
                    }`
                  : "Conversation"}
              </span>
            </ChatStatus>
          </HeaderInfo>

          <HeaderRight>
            <CommandeBadge>
              Commande #
              {conversationId
                ?.slice(-8)
                .toUpperCase()}
            </CommandeBadge>
          </HeaderRight>
        </ChatHeader>

        {/* =============================================
            ERREUR NON BLOQUANTE
        ============================================= */}

        {erreur && (
          <ErrorBanner>
            {erreur}
          </ErrorBanner>
        )}

        {/* =============================================
            MESSAGES
        ============================================= */}

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyMessages>
              <EmptyIcon>
                <FaPaperPlane />
              </EmptyIcon>

              <EmptyTitle>
                Votre conversation commence ici
              </EmptyTitle>

              <EmptyText>
                Envoyez un message pour
                contacter{" "}
                {typeCorrespondant ===
                "livreur"
                  ? "votre livreur"
                  : "le client"}.
              </EmptyText>
            </EmptyMessages>
          ) : (
            <>
              {messagesAvecSeparateurs.map(
                (msg) => (
                  <div
                    key={msg._id}
                  >
                    {/* --------------------------------
                        SÉPARATEUR DE DATE
                    -------------------------------- */}

                    {msg.nouveauJour && (
                      <DateSeparator>
                        <DateLine />

                        <DateLabel>
                          {formaterDateComplete(
                            msg.date,
                          )}
                        </DateLabel>

                        <DateLine />
                      </DateSeparator>
                    )}

                    {/* --------------------------------
                        MESSAGE
                    -------------------------------- */}

                    <MessageItem
                      $mine={estMonMessage(
                        msg,
                      )}
                    >
                      <MessageBubble
                        $mine={estMonMessage(
                          msg,
                        )}
                      >
                        <MessageText>
                          {msg.message}
                        </MessageText>

                        <MessageBottom>
                          <MessageDate>
                            {formaterHeure(
                              msg.date,
                            )}
                          </MessageDate>

                          {/* --------------------------------
                              ÉTAT DU MESSAGE
                          -------------------------------- */}

                          {estMonMessage(
                            msg,
                          ) && (
                            <ReadStatus
                              $read={
                                msg.lu
                              }
                            >
                              {msg.lu ? (
                                <FaCheckDouble />
                              ) : (
                                <FaCheck />
                              )}
                            </ReadStatus>
                          )}

                          {/* --------------------------------
                              SUPPRESSION
                          -------------------------------- */}

                          {estMonMessage(
                            msg,
                          ) && (
                            <DeleteButton
                              type="button"
                              onClick={() =>
                                supprimerMessage(
                                  msg._id,
                                )
                              }
                              disabled={
                                suppressionEnCours ===
                                msg._id
                              }
                              title="Supprimer le message"
                            >
                              <FaTrash />
                            </DeleteButton>
                          )}
                        </MessageBottom>
                      </MessageBubble>
                    </MessageItem>
                  </div>
                ),
              )}

              <div
                ref={messagesEndRef}
              />
            </>
          )}
        </MessagesContainer>

        {/* =============================================
            INPUT
        ============================================= */}

        <MessageForm
          onSubmit={
            envoyerMessage
          }
        >
          <MessageInputWrapper>
            <MessageInput
              ref={textareaRef}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  envoyerMessage(event);
                }
              }}
              placeholder="Écrire un message..."
              disabled={
                envoiEnCours
              }
              maxLength={1000}
            />

            <CharacterCounter>
              {message.length}/1000
            </CharacterCounter>
          </MessageInputWrapper>

          <SendButton
            type="submit"
            disabled={
              envoiEnCours ||
              !message.trim()
            }
            title="Envoyer"
          >
            {envoiEnCours ? (
              <SmallSpinner />
            ) : (
              <FaPaperPlane />
            )}
          </SendButton>
        </MessageForm>
      </ChatContainer>
    </Page>
  );
}

// =====================================================
// PAGE
// =====================================================

const Page = styled.div`
  min-height: 100vh;

  background:
    radial-gradient(
      circle at top left,
      rgba(17, 17, 17, 0.04),
      transparent 35%
    ),
    #f3f4f6;

  display: flex;
  justify-content: center;
`;

// =====================================================
// CONTAINER
// =====================================================

const ChatContainer = styled.div`
  width: 100%;
  max-width: 1050px;

  height: 100vh;
  height: 100dvh;

  background: #ffffff;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  box-shadow:
    0 0 50px rgba(0, 0, 0, 0.08);
`;

// =====================================================
// HEADER
// =====================================================

const ChatHeader = styled.header`
  min-height: 78px;

  padding: 0 22px;

  display: flex;
  align-items: center;

  gap: 13px;

  background: #ffffff;

  border-bottom: 1px solid #ececef;

  z-index: 10;
`;

const BackButton = styled.button`
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  border: 1px solid #e5e5e8;

  border-radius: 13px;

  background: #ffffff;

  color: #171717;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: #f5f5f6;
    transform: translateX(-2px);
  }
`;

const Avatar = styled.div`
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #111111;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;
`;

const HeaderInfo = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 4px;
`;

const ChatTitle = styled.div`
  font-size: 15px;

  font-weight: 800;

  color: #151515;
`;

const ChatStatus = styled.div`
  display: flex;
  align-items: center;

  gap: 5px;

  color: #8a8a8f;

  font-size: 10px;
`;

const StatusDot = styled(FaCircle)`
  color: #25b56f;

  font-size: 7px;
`;

const HeaderRight = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;

  @media (max-width: 650px) {
    display: none;
  }
`;

const CommandeBadge = styled.div`
  padding: 8px 11px;

  border-radius: 10px;

  background: #f5f5f6;

  color: #777;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.3px;
`;

// =====================================================
// ERROR
// =====================================================

const ErrorBanner = styled.div`
  padding: 9px 18px;

  background: #fff1f1;

  color: #c53535;

  border-bottom: 1px solid #ffdada;

  font-size: 11px;

  text-align: center;
`;

// =====================================================
// MESSAGES
// =====================================================

const MessagesContainer = styled.main`
  flex: 1;

  overflow-y: auto;

  padding: 25px clamp(14px, 4vw, 45px);

  background:
    linear-gradient(
      rgba(248, 249, 250, 0.96),
      rgba(248, 249, 250, 0.96)
    );

  scroll-behavior: smooth;

  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d4d4d7;

    border-radius: 20px;
  }
`;

// =====================================================
// DATE
// =====================================================

const DateSeparator = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;

  margin: 12px 0 20px;
`;

const DateLine = styled.div`
  flex: 1;

  height: 1px;

  background: #e1e1e4;
`;

const DateLabel = styled.span`
  flex-shrink: 0;

  padding: 5px 9px;

  border-radius: 20px;

  background: #e8e8eb;

  color: #777;

  font-size: 9px;

  font-weight: 700;
`;

// =====================================================
// MESSAGE
// =====================================================

const MessageItem = styled.div`
  display: flex;

  justify-content: ${({ $mine }) =>
    $mine
      ? "flex-end"
      : "flex-start"};

  margin-bottom: 8px;
`;

const MessageBubble = styled.div`
  position: relative;

  max-width: min(72%, 570px);

  padding: 10px 12px 8px;

  border-radius: ${({ $mine }) =>
    $mine
      ? "18px 18px 5px 18px"
      : "18px 18px 18px 5px"};

  background: ${({ $mine }) =>
    $mine ? "#111111" : "#ffffff"};

  color: ${({ $mine }) =>
    $mine ? "#ffffff" : "#171717"};

  border: ${({ $mine }) =>
    $mine
      ? "none"
      : "1px solid #e7e7e9"};

  box-shadow: ${({ $mine }) =>
    $mine
      ? "0 5px 15px rgba(0,0,0,0.12)"
      : "0 3px 12px rgba(0,0,0,0.035)"};

  transition: transform 0.15s;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    max-width: 82%;
  }
`;

const MessageText = styled.div`
  font-size: 13px;

  line-height: 1.55;

  white-space: pre-wrap;

  overflow-wrap: anywhere;
`;

const MessageBottom = styled.div`
  margin-top: 5px;

  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 7px;
`;

const MessageDate = styled.span`
  font-size: 8px;

  opacity: 0.55;
`;

const ReadStatus = styled.span`
  display: flex;

  align-items: center;

  color: ${({ $read }) =>
    $read
      ? "#4da3ff"
      : "currentColor"};

  opacity: ${({ $read }) =>
    $read ? 1 : 0.55};

  font-size: 9px;
`;

const DeleteButton = styled.button`
  padding: 2px;

  border: 0;

  background: transparent;

  color: inherit;

  opacity: 0.4;

  cursor: pointer;

  font-size: 9px;

  transition: 0.2s;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    cursor: wait;

    opacity: 0.2;
  }
`;

// =====================================================
// EMPTY
// =====================================================

const EmptyMessages = styled.div`
  min-height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 30px;
`;

const EmptyIcon = styled.div`
  width: 65px;
  height: 65px;

  margin-bottom: 15px;

  border-radius: 50%;

  background: #eeeeef;

  color: #111;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 21px;

  transform: rotate(-10deg);
`;

const EmptyTitle = styled.strong`
  color: #222;

  font-size: 14px;
`;

const EmptyText = styled.span`
  margin-top: 6px;

  color: #999;

  font-size: 11px;
`;

// =====================================================
// FORM
// =====================================================

const MessageForm = styled.form`
  min-height: 78px;

  padding: 12px 18px;

  display: flex;

  align-items: center;

  gap: 10px;

  background: #ffffff;

  border-top: 1px solid #e8e8ea;

  box-shadow:
    0 -5px 20px rgba(0, 0, 0, 0.025);
`;

const MessageInputWrapper = styled.div`
  position: relative;

  flex: 1;
`;

const MessageInput = styled.textarea`
  width: 100%;

  min-height: 46px;
  max-height: 120px;

  padding: 13px 55px 13px 15px;

  resize: none;

  border: 1px solid #dedee1;

  border-radius: 15px;

  outline: none;

  background: #fafafa;

  color: #151515;

  font-family: inherit;

  font-size: 13px;

  line-height: 1.4;

  transition: 0.2s;

  box-sizing: border-box;

  &:focus {
    border-color: #111;

    background: #ffffff;

    box-shadow:
      0 0 0 3px rgba(
        17,
        17,
        17,
        0.06
      );
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const CharacterCounter = styled.span`
  position: absolute;

  right: 12px;
  bottom: 7px;

  color: #aaa;

  font-size: 8px;

  pointer-events: none;
`;

const SendButton = styled.button`
  width: 47px;
  height: 47px;

  flex-shrink: 0;

  border: 0;

  border-radius: 14px;

  background: #111111;

  color: #ffffff;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.15);

  transition:
    transform 0.2s,
    opacity 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.35;

    cursor: not-allowed;

    box-shadow: none;
  }
`;

// =====================================================
// LOADING
// =====================================================

const LoadingScreen = styled.div`
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 14px;

  color: #777;
`;

const LoadingSpinner = styled.div`
  width: 28px;
  height: 28px;

  border: 3px solid #e3e3e5;

  border-top-color: #111;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SmallSpinner = styled.div`
  width: 15px;
  height: 15px;

  border: 2px solid
    rgba(255, 255, 255, 0.35);

  border-top-color: white;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 12px;
`;

// =====================================================
// ERROR SCREEN
// =====================================================

const ErrorBox = styled.div`
  width: min(
    450px,
    calc(100% - 30px)
  );

  margin: auto;

  padding: 35px;

  background: white;

  border-radius: 22px;

  text-align: center;

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.08);

  h2 {
    margin: 15px 0 8px;

    color: #222;

    font-size: 18px;
  }

  p {
    margin-bottom: 22px;

    color: #777;

    font-size: 12px;

    line-height: 1.5;
  }
`;

const ErrorIcon = styled.div`
  width: 45px;
  height: 45px;

  margin: auto;

  border-radius: 50%;

  background: #fff0f0;

  color: #d83b3b;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 900;
`;