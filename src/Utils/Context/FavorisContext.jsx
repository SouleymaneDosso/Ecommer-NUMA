import { createContext, useContext, useEffect, useState } from "react";

const FavorisContext = createContext();

export const FavorisProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  /* ================== FETCH ================== */
  const fetchFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setFavorites(data.map((f) => f.productId).filter(Boolean));
    } catch (err) {
      console.error("Erreur fetch favorites:", err);
      setFavorites([]);
    }
  };

  /* ================== TOGGLE ================== */
  const toggleFavorite = async (productId) => {
    if (!token) return;

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      // 🔥 clé magique : on resynchronise depuis l'API
      fetchFavorites();
    } catch (err) {
      console.error("Erreur toggle favorite:", err);
    }
  };

  /* ================== INIT ================== */
  useEffect(() => {
    fetchFavorites();
  }, [token]);

  return (
    <FavorisContext.Provider
      value={{
        favorites,
        toggleFavorite,
        fetchFavorites,
      }}
    >
      {children}
    </FavorisContext.Provider>
  );
};

/* ================== HOOK ================== */
export const useFavoris = () => useContext(FavorisContext);
