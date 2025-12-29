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
      const saved = localStorage.getItem("panier");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ================== ACTIONS ================== */

  // Ajouter un produit au panier
  const ajouterPanier = (produit) => {
    setAjouter((prev) => {
      const exist = prev.find((p) => p.id === produit.id);

      if (exist) {
        // Si le produit existe déjà, on additionne les quantités
        const newQuantite = exist.quantite + produit.quantite;
        // On ne peut pas dépasser le stock disponible
        return prev.map((p) =>
          p.id === produit.id
            ? { ...p, quantite: newQuantite > p.stockDisponible ? p.stockDisponible : newQuantite }
            : p
        );
      }

      return [...prev, produit];
    });
  };

  // Supprimer un produit du panier
  const supprimer = (id) => {
    setAjouter((prev) => prev.filter((p) => p.id !== id));
  };

  // Augmenter la quantité (bloquée par stock disponible)
  const augmenter = (id) => {
    setAjouter((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantite: p.quantite < p.stockDisponible ? p.quantite + 1 : p.quantite }
          : p
      )
    );
  };

  // Diminuer la quantité (minimum 1)
  const diminuer = (id) => {
    setAjouter((prev) =>
      prev.map((p) =>
        p.id === id && p.quantite > 1
          ? { ...p, quantite: p.quantite - 1 }
          : p
      )
    );
  };

  // Vider le panier
  const toutSupprimer = () => setAjouter([]);

  /* ================== PERSISTENCE ================== */
  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(ajouter));
  }, [ajouter]);

  return (
    <PanierContext.Provider
      value={{
        ajouter,
        ajouterPanier,
        supprimer,
        augmenter,
        diminuer,
        toutSupprimer,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};