import { createContext, useEffect, useRef } from "react";
import { socket } from "../../components/socket";
import toast from "react-hot-toast";

export const NotificationContext = createContext();

export function NotificationProvider({ userId, children }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // 🎵 son notification
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 1;

    const playSound = () => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.log("🔇 audio bloqué :", err);
      });
    };

    const handleCommandeUpdate = (data) => {
      let message = "Mise à jour commande";

      if (data.status === "CONFIRMED") message = "✅ Commande confirmée";
      if (data.status === "SHIPPED") message = "🚚 En livraison";
      if (data.status === "DELIVERED") message = "🎉 Commande livrée";

      toast.success(message);
      playSound();
    };

    // 🔌 connect UNE seule fois
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_room", userId);

    socket.on("commande_update", handleCommandeUpdate);

    return () => {
      socket.off("commande_update", handleCommandeUpdate);
    };
  }, [userId]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
}