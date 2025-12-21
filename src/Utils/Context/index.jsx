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
      const saved = localStorage.getItem("Panier");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Erreur lecture panier:", err);
      return [];
    }
  });

  // 🔹 Ajouter un produit au panier avec variations et quantité
  const ajouterPanier = (element) => {
    setAjouter((prev) => {
      const existe = prev.find(
        (item) =>
          item.id === element.id &&
          item.taille === element.taille &&
          item.couleur === element.couleur
      );

      if (existe) {
        // On augmente la quantité
        return prev.map((item) =>
          item === existe
            ? { ...item, quantite: item.quantite + element.quantite }
            : item
        );
      }

      // Nouveau produit
      return [...prev, element];
    });
  };

  // 🔹 Supprimer un produit spécifique (taille/couleur comprise)
  const supprimer = (element) => {
    setAjouter((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === element.id &&
            item.taille === element.taille &&
            item.couleur === element.couleur
          )
      )
    );
  };

  // 🔹 Vider tout le panier
  const toutSupprimer = () => setAjouter([]);

  // 🔹 Augmenter / diminuer la quantité d’un produit
  const augmenter = (element) => {
    setAjouter((prev) =>
      prev.map((item) =>
        item.id === element.id &&
        item.taille === element.taille &&
        item.couleur === element.couleur
          ? { ...item, quantite: item.quantite + 1 }
          : item
      )
    );
  };

  const diminuer = (element) => {
    setAjouter((prev) =>
      prev.map((item) =>
        item.id === element.id &&
        item.taille === element.taille &&
        item.couleur === element.couleur
          ? { ...item, quantite: item.quantite > 1 ? item.quantite - 1 : 1 }
          : item
      )
    );
  };

  // 🔹 Sauvegarde automatique dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem("Panier", JSON.stringify(ajouter));
    } catch (err) {
      console.error("Impossible de sauvegarder le panier", err);
    }
  }, [ajouter]);

  return (
    <PanierContext.Provider
      value={{
        ajouter,
        ajouterPanier,
        supprimer,
        toutSupprimer,
        augmenter,
        diminuer,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};
