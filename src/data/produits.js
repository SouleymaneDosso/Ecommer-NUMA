import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import image7 from "../assets/image7.jpg";
import image8 from "../assets/image8.jpg";
import image9 from "../assets/image9.jpg";
import image10 from "../assets/image10.jpg";

// Fonction utilitaire pour créer stock par variation
function generateStockParVariation(product) {
  const stockParVariation = {};
  const tailles = product.tailles || [];
  const couleurs = product.couleurs || [];
  const totalCombinations = tailles.length * couleurs.length;
  const stockParCombo = totalCombinations > 0 ? Math.floor(product.stock / totalCombinations) : 0;

  tailles.forEach((t) => {
    couleurs.forEach((c) => {
      stockParVariation[`${t}_${c}`] = stockParCombo;
    });
  });

  return stockParVariation;
}

export const produits = [
  {
    id: 1,
    titre: "Chemise Classique Blanche",
    description: "Chemise en coton 100% confortable pour un style élégant au quotidien.",
    image: image1,
    images: [image1, image2, image3],
    badge: "new",
    prix: 55,
    genre: "homme",
    categorie: "haut",
    stock: 25,
    tailles: ["S", "M", "L", "XL"],
    couleurs: ["blanc", "bleu", "gris"],
    notes: 4.5,
    commentaires: [
      { user: "Jean", texte: "Très belle chemise, qualité au top !" },
      { user: "Marc", texte: "La taille M est parfaite pour moi." }
    ]
  },
  {
    id: 2,
    titre: "Jean Slim Bleu",
    description: "Jean slim bleu foncé, coupe moderne, parfait pour toutes les occasions.",
    image: image2,
    images: [image2, image4, image5],
    badge: "promo",
    prix: 70,
    genre: "homme",
    categorie: "bas",
    stock: 30,
    tailles: ["30", "32", "34", "36"],
    couleurs: ["bleu", "noir", "gris"],
    notes: 4.2,
    commentaires: [
      { user: "Louis", texte: "Jean confortable et coupe parfaite." }
    ]
  },
  {
    id: 3,
    titre: "T-shirt Femme Rose",
    description: "T-shirt léger et confortable, parfait pour l'été.",
    image: image3,
    images: [image3, image6],
    badge: "new",
    prix: 25,
    genre: "femme",
    categorie: "haut",
    stock: 40,
    tailles: ["XS", "S", "M", "L"],
    couleurs: ["rose", "blanc", "noir"],
    notes: 4.7,
    commentaires: [
      { user: "Sophie", texte: "Très agréable à porter, matière douce." }
    ]
  },
  {
    id: 4,
    titre: "Robe Cocktail Noire",
    description: "Robe élégante pour soirée, coupe ajustée et confortable.",
    image: image4,
    images: [image4, image7],
    badge: "promo",
    prix: 120,
    genre: "femme",
    categorie: "robe",
    stock: 15,
    tailles: ["S", "M", "L"],
    couleurs: ["noir", "rouge"],
    notes: 4.9,
    commentaires: [
      { user: "Claire", texte: "Robe parfaite, belle coupe et tissu agréable." }
    ]
  },
  {
    id: 5,
    titre: "Pull Homme Col Rond",
    description: "Pull chaud et confortable pour l'hiver, style casual.",
    image: image5,
    images: [image5, image8],
    badge: "new",
    prix: 60,
    genre: "homme",
    categorie: "haut",
    stock: 20,
    tailles: ["S", "M", "L", "XL"],
    couleurs: ["gris", "bleu", "noir"],
    notes: 4.3,
    commentaires: [
      { user: "Pierre", texte: "Très chaud et agréable, conforme à la photo." }
    ]
  },
  {
    id: 6,
    titre: "Short Été Femme",
    description: "Short léger, idéal pour les journées chaudes.",
    image: image6,
    images: [image6, image9],
    badge: "promo",
    prix: 30,
    genre: "femme",
    categorie: "bas",
    stock: 35,
    tailles: ["XS", "S", "M", "L"],
    couleurs: ["bleu", "rose", "blanc"],
    notes: 4.5,
    commentaires: [
      { user: "Emma", texte: "Short léger et confortable." }
    ]
  },
  {
    id: 7,
    titre: "Veste Homme Cuir",
    description: "Veste en cuir véritable, style biker, look tendance.",
    image: image7,
    images: [image7, image10],
    badge: "new",
    prix: 250,
    genre: "homme",
    categorie: "veste",
    stock: 10,
    tailles: ["M", "L", "XL"],
    couleurs: ["noir", "marron"],
    notes: 4.8,
    commentaires: [
      { user: "David", texte: "Veste de qualité, très satisfait de l'achat." }
    ]
  },
  {
    id: 8,
    titre: "Chaussures Sport Homme",
    description: "Chaussures légères et confortables pour la course et le sport.",
    image: image8,
    images: [image8, image1],
    badge: "promo",
    prix: 90,
    genre: "homme",
    categorie: "chaussures",
    stock: 50,
    tailles: ["40", "41", "42", "43", "44"],
    couleurs: ["blanc", "noir", "bleu"],
    notes: 4.4,
    commentaires: [
      { user: "Alex", texte: "Chaussures confortables et légères." }
    ]
  },
  {
    id: 9,
    titre: "Sac Femme Bandoulière",
    description: "Sac pratique et élégant, parfait pour tous les jours.",
    image: image9,
    images: [image9, image2],
    badge: "new",
    prix: 80,
    genre: "femme",
    categorie: "accessoire",
    stock: 25,
    tailles: ["unique"],
    couleurs: ["noir", "rouge", "beige"],
    notes: 4.6,
    commentaires: [
      { user: "Julie", texte: "Sac pratique et joli." }
    ]
  },
  {
    id: 10,
    titre: "Montre Homme Classique",
    description: "Montre élégante avec bracelet en cuir, pour toutes occasions.",
    image: image10,
    images: [image10, image3],
    badge: "promo",
    prix: 150,
    genre: "homme",
    categorie: "accessoire",
    stock: 20,
    tailles: ["unique"],
    couleurs: ["noir", "marron"],
    notes: 4.9,
    commentaires: [
      { user: "Thomas", texte: "Montre très élégante et précise." }
    ]
  },
];

// On génère automatiquement le stock par variation pour chaque produit
produits.forEach(p => {
  p.stockParVariation = generateStockParVariation(p);
});
