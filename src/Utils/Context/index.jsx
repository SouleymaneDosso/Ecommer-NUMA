import { createContext, useState, useEffect } from "react";

// ====================== THEME CONTEXT ======================
export const ThemeContext = createContext();

export const ToggleTheme = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme : "dark";
    } catch {
      return "dark";
    }
  });

  const themeToglle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      console.error("Impossible de sauvegarder le thème");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeToglle }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ====================== LANGUE CONTEXT ======================
export const ContextLangue = createContext();

export const LangueTheme = ({ children }) => {
  const [langue, setLangue] = useState(() => {
    try {
      const savedLang = localStorage.getItem("langue");
      return savedLang ? savedLang : "fr";
    } catch {
      return "fr";
    }
  });

  const toggleLangue = () => {
    setLangue((prev) => (prev === "en" ? "fr" : "en"));
  };

  useEffect(() => {
    try {
      localStorage.setItem("langue", langue);
    } catch {
      console.error("Impossible de sauvegarder la langue");
    }
  }, [langue]);

  return (
    <ContextLangue.Provider value={{ langue, toggleLangue }}>
      {children}
    </ContextLangue.Provider>
  );
};

// ====================== PANIER CONTEXT ======================
export const PanierContext = createContext();

export const Panier = ({ children }) => {
  const [ajouter, setAjouter] = useState(() => {
    try {
      const tableau = localStorage.getItem("Panier");
      return tableau ? JSON.parse(tableau) : [];
    } catch (err) {
      console.error("Le panier n'existe pas", err);
      return [];
    }
  });

  // Ajouter produit avec gestion de quantité
  const ajouterPanier = (element) => {
    setAjouter((prev) => {
      const existe = prev.find((item) => item.id === element.id);
      if (existe) {
        return prev.map((item) =>
          item.id === element.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }
      return [...prev, { ...element, quantite: 1 }];
    });
  };

  // Supprimer produit par id
  const supprimer = (id) => {
    setAjouter((prev) => prev.filter((item) => item.id !== id));
  };

  // Vider tout le panier
  const toutSupprimer = () => {
    setAjouter([]);
  };

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem("Panier", JSON.stringify(ajouter));
    } catch (err) {
      console.error("Impossible de sauvegarder le panier", err);
    }
  }, [ajouter]);

  return (
    <PanierContext.Provider
      value={{ ajouter, ajouterPanier, supprimer, toutSupprimer }}
    >
      {children}
    </PanierContext.Provider>
  );
};
