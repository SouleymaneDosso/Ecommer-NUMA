const VISITOR_ID_KEY = "numa_visitor_id";
const SESSION_ID_KEY = "numa_session_id";

const generateId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
};

export const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
};

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
};
export const trackPage = async (page) => {
  try {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/statistiques/visite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          page,
        }),
      },
    );
  } catch (error) {
    console.error("Erreur tracking visite :", error);
  }
};