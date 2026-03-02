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

  const [villeLivraison, setVilleLivraison] = useState(() => {
    try {
      return localStorage.getItem("villeLivraison") || "";
    } catch {
      return "";
    }
  });

  /* ================== ACTIONS ================== */

  const ajouterPanier = (produit) => {
    setAjouter((prev) => {
      const exist = prev.find((p) => p.id === produit.id);

      if (exist) {
        const newQuantite = exist.quantite + produit.quantite;

        return prev.map((p) =>
          p.id === produit.id
            ? {
                ...p,
                quantite:
                  newQuantite > p.stockDisponible
                    ? p.stockDisponible
                    : newQuantite,
              }
            : p
        );
      }

      return [...prev, produit];
    });
  };

  const supprimer = (id) => {
    setAjouter((prev) => prev.filter((p) => p.id !== id));
  };

  const augmenter = (id) => {
    setAjouter((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quantite:
                p.quantite < p.stockDisponible
                  ? p.quantite + 1
                  : p.quantite,
            }
          : p
      )
    );
  };

  const diminuer = (id) => {
    setAjouter((prev) =>
      prev.map((p) =>
        p.id === id && p.quantite > 1
          ? { ...p, quantite: p.quantite - 1 }
          : p
      )
    );
  };

  const toutSupprimer = () => setAjouter([]);

  /* ================== CALCULS LIVRAISON ================== */

  const sousTotal = ajouter.reduce(
    (acc, item) => acc + item.prix * item.quantite,
    0
  );

  const nombreProduits = ajouter.reduce(
    (acc, item) => acc + item.quantite,
    0
  );

  let fraisLivraison = 0;

  const zonesProche = ["Cocody", "Bingerville"];
  const zonesMoyenne = [
    "Plateau",
    "Adjamé",
    "Treichville",
    "Marcory",
    "Attécoubé",
  ];
  const zonesLoin = [
    "Yopougon",
    "Abobo",
    "Koumassi",
    "Port-Bouët",
    "Anyama",
  ];

  if (villeLivraison) {
    if (zonesProche.includes(villeLivraison)) {
      // À Abidjan
      fraisLivraison = nombreProduits >= 2 ? 0 : 1500;
    } else if (zonesMoyenne.includes(villeLivraison)) {
      fraisLivraison = nombreProduits >= 2 ? 0 : 2000;
    } else if (zonesLoin.includes(villeLivraison)) {
      fraisLivraison = nombreProduits >= 2 ? 0 : 3000;
    } else {
      // Hors Abidjan
      fraisLivraison = nombreProduits >= 2 ? 2000 : 4000;
    }
  }

  const total = sousTotal + fraisLivraison;

  /* ================== PERSISTENCE ================== */

  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(ajouter));
  }, [ajouter]);

  useEffect(() => {
    localStorage.setItem("villeLivraison", villeLivraison);
  }, [villeLivraison]);

  return (
    <PanierContext.Provider
      value={{
        ajouter,
        ajouterPanier,
        supprimer,
        augmenter,
        diminuer,
        toutSupprimer,
        villeLivraison,
        setVilleLivraison,
        sousTotal,
        fraisLivraison,
        total,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};