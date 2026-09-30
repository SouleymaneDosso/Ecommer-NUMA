import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaTrash,
} from "react-icons/fa";

import styled from "styled-components";

export default function Conversation() {
  const { commandeId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [envoiEnCours, setEnvoiEnCours] =
    useState(false);

  const [erreur, setErreur] =
    useState("");

  // =====================================================
  // RÉCUPÉRER / CRÉER LA CONVERSATION
  // =====================================================

  useEffect(() => {
    if (!commandeId) {
      setErreur(
        "Identifiant de commande manquant.",
      );

      setLoading(false);

      return;
    }

    const chargerConversation = async () => {
      try {
        setLoading(true);
        setErreur("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // ---------------------------------------------
        // CRÉER OU RÉCUPÉRER LA CONVERSATION
        // ---------------------------------------------

        const response = await fetch(
          `${API_URL}/api/conversations`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              commandeId,
            }),
          },
        );

        const data =
          await response.json().catch(
            () => ({}),
          );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible d'ouvrir la conversation.",
          );
        }

        const conversationData =
          data.conversation;

        if (!conversationData?._id) {
          throw new Error(
            "Conversation invalide reçue du serveur.",
          );
        }

        setConversation(
          conversationData,
        );

        // ---------------------------------------------
        // RÉCUPÉRER LES MESSAGES
        // ---------------------------------------------

        const messagesResponse =
          await fetch(
            `${API_URL}/api/conversations/${conversationData._id}/messages`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        const messagesData =
          await messagesResponse
            .json()
            .catch(() => ({}));

        if (!messagesResponse.ok) {
          throw new Error(
            messagesData.message ||
              "Impossible de récupérer les messages.",
          );
        }

        setMessages(
          messagesData.messages || [],
        );
      } catch (error) {
        console.error(
          "CONVERSATION ERROR:",
          error,
        );

        setErreur(
          error.message ||
            "Impossible d'ouvrir la conversation.",
        );
      } finally {
        setLoading(false);
      }
    };

    chargerConversation();
  }, [
    API_URL,
    commandeId,
    navigate,
  ]);

  // =====================================================
  // ENVOYER MESSAGE
  // =====================================================

  const envoyerMessage = async (
    event,
  ) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    if (!conversation?._id) {
      return;
    }

    try {
      setEnvoiEnCours(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/conversations/${conversation._id}/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: message.trim(),
          }),
        },
      );

      const data =
        await response.json().catch(
          () => ({}),
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'envoyer le message.",
        );
      }

      if (data.nouveauMessage) {
        setMessages((prev) => [
          ...prev,
          data.nouveauMessage,
        ]);
      }

      setMessage("");
    } catch (error) {
      console.error(
        "ENVOYER MESSAGE ERROR:",
        error,
      );

      alert(
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
    if (!conversation?._id) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/conversations/${conversation._id}/messages/${messageId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      const data =
        await response.json().catch(
          () => ({}),
        );

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

      alert(
        error.message ||
          "Impossible de supprimer le message.",
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Page>
        <Loading>
          Chargement de la conversation...
        </Loading>
      </Page>
    );
  }

  // =====================================================
  // ERREUR
  // =====================================================

  if (erreur) {
    return (
      <Page>
        <ErrorBox>
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
          >
            <FaArrowLeft />
          </BackButton>

          <div>
            <ChatTitle>
              Discussion
            </ChatTitle>

            <ChatSubtitle>
              Commande #
              {commandeId
                ?.slice(-8)
                .toUpperCase()}
            </ChatSubtitle>
          </div>
        </ChatHeader>

        {/* =============================================
            MESSAGES
        ============================================= */}

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyMessages>
              <div>
                💬
              </div>

              <strong>
                Aucun message
              </strong>

              <span>
                Vous pouvez commencer la
                conversation.
              </span>
            </EmptyMessages>
          ) : (
            messages.map((msg) => (
              <MessageItem
                key={msg._id}
                $mine={
                  estMonMessage(msg)
                }
              >
                <MessageBubble
                  $mine={
                    estMonMessage(msg)
                  }
                >
                  <MessageText>
                    {msg.message}
                  </MessageText>

                  <MessageBottom>
                    <MessageDate>
                      {msg.date
                        ? new Date(
                            msg.date,
                          ).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            },
                          )
                        : ""}
                    </MessageDate>

                    {estMonMessage(
                      msg,
                    ) && (
                      <DeleteButton
                        onClick={() =>
                          supprimerMessage(
                            msg._id,
                          )
                        }
                        title="Supprimer"
                      >
                        <FaTrash />
                      </DeleteButton>
                    )}
                  </MessageBottom>
                </MessageBubble>
              </MessageItem>
            ))
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
          <MessageInput
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value,
              )
            }
            placeholder="Écrire un message..."
            disabled={envoiEnCours}
          />

          <SendButton
            type="submit"
            disabled={
              envoiEnCours ||
              !message.trim()
            }
          >
            <FaPaperPlane />
          </SendButton>
        </MessageForm>
      </ChatContainer>
    </Page>
  );

  // =====================================================
  // IDENTIFIER MES MESSAGES
  // =====================================================

  function estMonMessage(msg) {
    /*
     * Pour l'instant on détermine le type
     * grâce au JWT client.
     *
     * Plus tard, si cette page est également
     * utilisée par le livreur, on adaptera cela
     * proprement avec notre système d'auth.
     */

    const token =
      localStorage.getItem("token");

    if (!token) {
      return false;
    }

    try {
      const payload =
        JSON.parse(
          atob(
            token
              .split(".")[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/"),
          ),
        );

      return (
        msg.expediteur?.type ===
          "client" &&
        msg.expediteur?.id?.toString() ===
          payload.userId?.toString()
      );
    } catch {
      return false;
    }
  }
}

// =====================================================
// STYLE
// =====================================================

const Page = styled.div`
  min-height: 100vh;
  background: #f4f5f7;
  display: flex;
  justify-content: center;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 850px;
  height: 100vh;

  background: white;

  display: flex;
  flex-direction: column;

  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
`;

const ChatHeader = styled.header`
  min-height: 75px;

  padding: 0 20px;

  display: flex;
  align-items: center;
  gap: 14px;

  border-bottom: 1px solid #e8e8ea;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;

  border: 1px solid #e5e5e7;
  border-radius: 12px;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const ChatTitle = styled.div`
  font-size: 17px;
  font-weight: 800;
`;

const ChatSubtitle = styled.div`
  margin-top: 3px;

  color: #888;

  font-size: 10px;
`;

const MessagesContainer = styled.main`
  flex: 1;

  overflow-y: auto;

  padding: 25px 20px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  background: #f8f8f9;
`;

const MessageItem = styled.div`
  display: flex;

  justify-content: ${({ $mine }) =>
    $mine
      ? "flex-end"
      : "flex-start"};
`;

const MessageBubble = styled.div`
  max-width: min(70%, 500px);

  padding: 11px 13px;

  border-radius: ${({ $mine }) =>
    $mine
      ? "17px 17px 4px 17px"
      : "17px 17px 17px 4px"};

  background: ${({ $mine }) =>
    $mine ? "#111" : "white"};

  color: ${({ $mine }) =>
    $mine ? "white" : "#111"};

  border: ${({ $mine }) =>
    $mine
      ? "none"
      : "1px solid #e5e5e7"};

  box-shadow: 0 3px 10px
    rgba(0, 0, 0, 0.04);
`;

const MessageText = styled.div`
  font-size: 13px;
  line-height: 1.5;

  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const MessageBottom = styled.div`
  margin-top: 5px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 8px;
`;

const MessageDate = styled.span`
  font-size: 9px;
  opacity: 0.55;
`;

const DeleteButton = styled.button`
  padding: 2px;

  border: 0;
  background: transparent;

  color: inherit;

  opacity: 0.5;

  cursor: pointer;

  font-size: 9px;

  &:hover {
    opacity: 1;
  }
`;

const MessageForm = styled.form`
  min-height: 75px;

  padding: 12px 16px;

  display: flex;
  align-items: center;

  gap: 10px;

  border-top: 1px solid #e8e8ea;

  background: white;
`;

const MessageInput = styled.input`
  flex: 1;

  height: 46px;

  padding: 0 15px;

  border: 1px solid #dddde0;

  border-radius: 14px;

  outline: none;

  font-size: 13px;

  &:focus {
    border-color: #111;
  }
`;

const SendButton = styled.button`
  width: 46px;
  height: 46px;

  border: 0;
  border-radius: 14px;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const EmptyMessages = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  color: #888;

  gap: 6px;

  div {
    font-size: 35px;
    margin-bottom: 5px;
  }

  strong {
    color: #222;
    font-size: 14px;
  }

  span {
    font-size: 11px;
  }
`;

const Loading = styled.div`
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #777;
`;

const ErrorBox = styled.div`
  width: min(450px, calc(100% - 30px));

  margin: auto;

  padding: 30px;

  background: white;

  border-radius: 20px;

  text-align: center;

  h2 {
    margin-top: 0;
  }

  p {
    color: #777;
    font-size: 13px;
  }
`;