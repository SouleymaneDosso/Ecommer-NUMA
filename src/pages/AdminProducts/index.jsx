
import { useState, useEffect } from "react";
import styled from "styled-components";

// ===============================
// STYLES
// ===============================

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f9fafb;

  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 12px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const ProductList = styled.div`
  margin-top: 40px;
`;

const ProductItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
  border: ${(props) =>
    props.$isMain ? "2px solid #007bff" : "1px solid #ccc"};
  cursor: pointer;
`;

const CommentContainer = styled.div`
  background: #f1f1f1;
  padding: 10px;
  border-radius: 6px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 0;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;
`;

const PriceSection = styled.div`
  padding: 15px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PricePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 5px;
`;

const CurrentPrice = styled.strong`
  font-size: 20px;
  color: #222;
`;

const OldPrice = styled.span`
  color: #999;
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: #b3261e;
  color: white;
  padding: 5px 9px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const HelpText = styled.small`
  color: #777;
  line-height: 1.5;
`;

const SectionLabel = styled.strong`
  color: #333;
  font-size: 14px;
`;

// ===============================
// HELPERS
// ===============================

const formatPrice = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toLocaleString("fr-FR")} FCFA`;
};

const getDiscount = (price, prixAvant) => {
  const current = Number(price);
  const old = Number(prixAvant);

  if (
    !Number.isFinite(current) ||
    !Number.isFinite(old) ||
    old <= current ||
    current < 0
  ) {
    return 0;
  }

  return Math.round(((old - current) / old) * 100);
};

// ===============================
// COMPOSANT
// ===============================

function AdminProducts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // NOUVEAU : ancien prix
  const [prixAvant, setPrixAvant] = useState("");

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(null);
  const [products, setProducts] = useState([]);

  const [genre, setGenre] = useState("homme");
  const [categorie, setCategorie] = useState("haut");
  const [badge, setBadge] = useState(null);
  const [hero, setHero] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [details, setDetails] = useState({
    matiere: "",
    poids: "",
    coupe: "",
    saison: "",
    entretien: "",
    paysFabrication: "",
  });

  const token = localStorage.getItem("adminToken");

  const reduction = getDiscount(price, prixAvant);

  // ===============================
  // FETCH PRODUITS
  // ===============================

  useEffect(() => {
    if (!token) {
      alert("Accès non autorisé");
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/produits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur récupération produits");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur récupération produits");
    }
  };

  // ===============================
  // GESTION NOUVELLES IMAGES
  // ===============================

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);

    const filesWithPreview = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setNewImages((prev) => [...prev, ...filesWithPreview]);

    if (mainImageIndex === null && existingImages.length + files.length > 0) {
      setMainImageIndex(0);
    }

    e.target.value = null;
  };

  // ===============================
  // GESTION STOCK
  // ===============================

  const handleStockChange = (color, size, value) => {
    setStock((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: parseInt(value, 10) || 0,
      },
    }));
  };

  // ===============================
  // SUPPRESSION IMAGE EXISTANTE
  // ===============================

  const handleDeleteExistingImage = (publicId, idx) => {
    const updatedImages = existingImages.filter(
      (img) => img.publicId !== publicId,
    );

    setExistingImages(updatedImages);
    setImagesToDelete((prev) => [...prev, publicId]);

    if (mainImageIndex === idx) {
      setMainImageIndex(
        updatedImages.length + newImages.length > 0 ? 0 : null,
      );
    } else if (mainImageIndex > idx) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  // ===============================
  // SUPPRESSION NOUVELLE IMAGE
  // ===============================

  const handleDeleteNewImage = (idx) => {
    const globalIdx = existingImages.length + idx;

    URL.revokeObjectURL(newImages[idx].preview);

    const updatedNewImages = newImages.filter((_, i) => i !== idx);

    setNewImages(updatedNewImages);

    if (mainImageIndex === globalIdx) {
      setMainImageIndex(
        existingImages.length + updatedNewImages.length > 0 ? 0 : null,
      );
    } else if (mainImageIndex > globalIdx) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  useEffect(() => {
    return () => {
      newImages.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [newImages]);

  // ===============================
  // RESET FORMULAIRE
  // ===============================

  const resetForm = () => {
    newImages.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });

    setTitle("");
    setDescription("");
    setPrice("");

    // Réinitialiser ancien prix
    setPrixAvant("");

    setColors([]);
    setSizes([]);
    setStock({});
    setExistingImages([]);
    setImagesToDelete([]);
    setNewImages([]);
    setMainImageIndex(null);
    setGenre("homme");
    setCategorie("haut");
    setBadge(null);
    setHero(false);
    setBestSeller(false);
    setEditingProductId(null);

    setDetails({
      matiere: "",
      poids: "",
      coupe: "",
      saison: "",
      entretien: "",
      paysFabrication: "",
    });
  };

  // ===============================
  // SUBMIT PRODUIT
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      existingImages.length + newImages.length === 0
    ) {
      return alert("Vérifie les champs obligatoires et les images.");
    }

    // Vérification ancien prix
    if (prixAvant !== "") {
      if (
        !Number.isFinite(Number(prixAvant)) ||
        Number(prixAvant) <= Number(price)
      ) {
        return alert(
          "L'ancien prix doit être supérieur au prix actuel.",
        );
      }
    }

    // Une promotion doit avoir un ancien prix
    if (badge === "promo" && prixAvant === "") {
      return alert(
        "Pour un produit en promotion, renseigne obligatoirement l'ancien prix.",
      );
    }

    // Préparer le stock par variation
    const stockObj = {};

    colors.forEach((color) => {
      stockObj[color] = {};

      sizes.forEach((size) => {
        stockObj[color][size] = stock[color]?.[size] || 0;
      });
    });

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    // NOUVEAU : envoi de l'ancien prix
    // Une chaîne vide permet aussi d'effacer l'ancien prix en modification.
    formData.append("prixAvant", prixAvant);

    formData.append("couleurs", JSON.stringify(colors));
    formData.append("tailles", JSON.stringify(sizes));
    formData.append("stockParVariation", JSON.stringify(stockObj));

    formData.append("genre", genre);
    formData.append("categorie", categorie);
    formData.append("badge", badge || "");

    formData.append("hero", String(hero));
    formData.append("bestSeller", String(bestSeller));

    formData.append(
      "mainImageIndex",
      mainImageIndex === null ? "" : String(mainImageIndex),
    );

    formData.append(
      "imagesToDelete",
      JSON.stringify(imagesToDelete),
    );

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("details", JSON.stringify(details));

    try {
      let res;

      if (editingProductId) {
        res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
      } else {
        res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );
      }

      const data = await res.json();

      if (!res.ok) {
        return alert(
          data.message || "Erreur lors de l'ajout ou modification",
        );
      }

      alert(
        editingProductId
          ? "Produit modifié avec succès !"
          : "Produit ajouté avec succès !",
      );

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ===============================
  // ÉDITER PRODUIT
  // ===============================

  const handleEditProduct = (p) => {
    setEditingProductId(p._id);

    setTitle(p.title || "");
    setDescription(p.description || "");
    setPrice(p.price ?? "");

    // Récupérer ancien prix
    setPrixAvant(p.prixAvant ?? "");

    setColors(p.couleurs || []);
    setSizes(p.tailles || []);

    const stockObj = {};

    Object.entries(p.stockParVariation || {}).forEach(
      ([color, sizesMap]) => {
        stockObj[color] = Object.fromEntries(
          Object.entries(sizesMap),
        );
      },
    );

    setStock(stockObj);

    setHero(p.hero || false);
    setBestSeller(p.bestSeller || false);
    setGenre(p.genre || "homme");
    setCategorie(p.categorie || "haut");
    setBadge(p.badge || null);

    setExistingImages(p.images || []);
    setImagesToDelete([]);
    setNewImages([]);

    setDetails({
      matiere: p.details?.matiere || "",
      poids: p.details?.poids || "",
      coupe: p.details?.coupe || "",
      saison: p.details?.saison || "",
      entretien: p.details?.entretien || "",
      paysFabrication: p.details?.paysFabrication || "",
    });

    if (p.images?.length > 0) {
      const mainIdx = p.images.findIndex((i) => i.isMain);

      setMainImageIndex(mainIdx !== -1 ? mainIdx : 0);
    } else {
      setMainImageIndex(null);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // SUPPRESSION PRODUIT
  // ===============================

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/produits/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert(data.message || "Produit supprimé !");
      } else {
        alert(data.message || "Erreur suppression produit");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ===============================
  // SUPPRESSION COMMENTAIRE
  // ===============================

  const handleDeleteComment = async (produitId, commentaireId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/produits/${produitId}/commentaires/${commentaireId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(
          data.message || "Erreur suppression commentaire",
        );
      }

      setProducts((prev) =>
        prev.map((p) =>
          p._id === produitId
            ? {
                ...p,
                commentaires: (p.commentaires || []).filter(
                  (c) => c._id.toString() !== commentaireId.toString(),
                ),
              }
            : p,
        ),
      );

      alert("Commentaire supprimé !");
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ===============================
  // RENDER
  // ===============================

  return (
    <Container>
      <Title>Admin Produits</Title>

      <Form onSubmit={handleSubmit}>
        {/* CHAMPS PRODUIT */}

        <Input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* PRIX ACTUEL ET ANCIEN PRIX */}

        <PriceSection>
          <SectionLabel>Prix du produit</SectionLabel>

          <label>Prix actuel (prix de vente)</label>
          <Input
            type="number"
            min="0"
            placeholder="Ex : 35000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Ancien prix (prix avant réduction)</label>
          <Input
            type="number"
            min="0"
            placeholder="Ex : 50000"
            value={prixAvant}
            onChange={(e) => setPrixAvant(e.target.value)}
          />

          <HelpText>
            Renseigne ce champ uniquement si tu souhaites afficher
            un prix barré et une réduction.
          </HelpText>

          {price !== "" && prixAvant !== "" && reduction > 0 && (
            <PricePreview>
              <CurrentPrice>
                {formatPrice(price)}
              </CurrentPrice>

              <OldPrice>
                {formatPrice(prixAvant)}
              </OldPrice>

              <Discount>-{reduction}%</Discount>
            </PricePreview>
          )}

          {prixAvant !== "" &&
            price !== "" &&
            Number(prixAvant) <= Number(price) && (
              <HelpText style={{ color: "#b3261e" }}>
                Attention : l'ancien prix doit être supérieur au prix actuel.
              </HelpText>
            )}
        </PriceSection>

        {/* GENRE */}

        <Select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="enfant">Enfant</option>
        </Select>

        {/* CATÉGORIE */}

        <Select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        >
          <option value="haut">Haut</option>
          <option value="bas">Bas</option>
          <option value="robe">Robe</option>
          <option value="chaussure">Chaussure</option>
          <option value="tout">Tout</option>
        </Select>

        {/* BADGE */}

        <Select
          value={badge || ""}
          onChange={(e) => setBadge(e.target.value || null)}
        >
          <option value="">Aucun</option>
          <option value="new">New</option>
          <option value="promo">Promo</option>
        </Select>

        {/* HERO */}

        <Select
          value={hero ? "true" : "false"}
          onChange={(e) => setHero(e.target.value === "true")}
        >
          <option value="false">Non Hero</option>
          <option value="true">Hero</option>
        </Select>

        {/* BEST SELLER */}

        <Select
          value={bestSeller ? "true" : "false"}
          onChange={(e) => setBestSeller(e.target.value === "true")}
        >
          <option value="false">Non Best-Seller</option>
          <option value="true">⭐ Best-Seller</option>
        </Select>

        {/* COULEURS */}

        <Input
          type="text"
          placeholder="Couleurs (séparées par ,)"
          value={colors.join(",")}
          onChange={(e) =>
            setColors(
              e.target.value
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean),
            )
          }
        />

        {/* TAILLES */}

        <Input
          type="text"
          placeholder="Tailles (séparées par ,)"
          value={sizes.join(",")}
          onChange={(e) =>
            setSizes(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />

        {/* DETAILS PRODUIT */}

        <Input
          type="text"
          placeholder="Matière"
          value={details.matiere}
          onChange={(e) =>
            setDetails((prev) => ({
              ...prev,
              matiere: e.target.value,
            }))
          }
        />

        <Input
          type="text"
          placeholder="Poids"
          value={details.poids}
          onChange={(e) =>
            setDetails((prev) => ({
              ...prev,
              poids: e.target.value,
            }))
          }
        />

        <Input
          type="text"
          placeholder="Coupe"
          value={details.coupe}
          onChange={(e) =>
            setDetails((prev) => ({
              ...prev,
              coupe: e.target.value,
            }))
          }
        />

        <Input
          type="text"
          placeholder="Saison"
          value={details.saison}
          onChange={(e) =>
            setDetails((prev) => ({
              ...prev,
              saison: e.target.value,
            }))
          }
        />

        <Input
          type="text"
          placeholder="Entretien"
          value={details.entretien}
          onChange={(e) =>
            setDetails((prev) => ({
              ...prev,
              entretien: e.target.value,
            }))
          }
        />

        <Input
          type="text"
          placeholder="Pays de fabrication"
          value={details.paysFabrication}
          onChange={(e) =>
            setDetails((prev) => ({
              ...prev,
              paysFabrication: e.target.value,
            }))
          }
        />

        {/* STOCK */}

        {colors.length > 0 && sizes.length > 0 && (
          <div>
            <SectionLabel>Stock par variation</SectionLabel>

            {colors.map((color) => (
              <div key={color} style={{ marginTop: "10px" }}>
                <strong>{color}</strong>

                {sizes.map((size) => (
                  <Input
                    key={`${color}_${size}`}
                    type="number"
                    min="0"
                    placeholder={`${color} / ${size}`}
                    value={stock[color]?.[size] ?? ""}
                    onChange={(e) =>
                      handleStockChange(color, size, e.target.value)
                    }
                    style={{
                      width: "100px",
                      margin: "5px",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* IMAGES EXISTANTES */}

        <SectionLabel>Images existantes</SectionLabel>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          {existingImages.map((img, idx) => (
            <div
              key={img.publicId}
              style={{ position: "relative" }}
            >
              <ImagePreview
                src={img.url}
                $isMain={idx === mainImageIndex}
                onClick={() => setMainImageIndex(idx)}
              />

              <Button
                type="button"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "#e74c3c",
                  padding: "2px 6px",
                }}
                onClick={() =>
                  handleDeleteExistingImage(img.publicId, idx)
                }
              >
                X
              </Button>
            </div>
          ))}
        </div>

        {/* NOUVELLES IMAGES */}

        <SectionLabel>Ajouter des images</SectionLabel>

        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImageChange}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          {newImages.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <ImagePreview
                src={img.preview}
                $isMain={existingImages.length + idx === mainImageIndex}
                onClick={() =>
                  setMainImageIndex(existingImages.length + idx)
                }
              />

              <Button
                type="button"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "#e74c3c",
                  padding: "2px 6px",
                }}
                onClick={() => handleDeleteNewImage(idx)}
              >
                X
              </Button>
            </div>
          ))}
        </div>

        <HelpText>
          Clique sur une image pour la définir comme image principale.
        </HelpText>

        {/* VALIDATION */}

        <Button type="submit">
          {editingProductId
            ? "Modifier le produit"
            : "Ajouter le produit"}
        </Button>

        {editingProductId && (
          <Button
            type="button"
            style={{
              background: "#6c757d",
              marginTop: "5px",
            }}
            onClick={resetForm}
          >
            Annuler la modification
          </Button>
        )}
      </Form>

      {/* ===============================
          LISTE PRODUITS
      =============================== */}

      <ProductList>
        <Title>Produits enregistrés</Title>

        {products.map((p) => {
          const discount = getDiscount(p.price, p.prixAvant);

          return (
            <ProductItem key={p._id}>
              <ProductHeader>
                <div>
                  <strong>{p.title}</strong>
                  {p.hero && " (Hero)"}
                  {p.isNew && " (Nouveau)"}
                  {p.bestSeller && " ⭐ (Best-Seller)"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => handleEditProduct(p)}
                  >
                    Modifier
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleDeleteProduct(p._id)}
                    style={{ background: "#e74c3c" }}
                  >
                    Supprimer
                  </Button>
                </div>
              </ProductHeader>

              {p.images && p.images.length > 0 && (
                <ImagePreview
                  src={
                    p.images.find((i) => i.isMain)?.url ||
                    p.images[0].url
                  }
                  $isMain
                />
              )}

              {/* AFFICHAGE DES PRIX */}

              <PricePreview>
                <CurrentPrice>
                  {formatPrice(p.price)}
                </CurrentPrice>

                {discount > 0 && (
                  <>
                    <OldPrice>
                      {formatPrice(p.prixAvant)}
                    </OldPrice>

                    <Discount>-{discount}%</Discount>
                  </>
                )}
              </PricePreview>

              {p.badge === "promo" && (
                <HelpText>
                  Produit en promotion
                </HelpText>
              )}

              {p.commentaires && p.commentaires.length > 0 && (
                <CommentContainer>
                  <strong>Commentaires :</strong>

                  {p.commentaires.map((c) => (
                    <CommentItem key={c._id}>
                      <span>
                        {c.user}: {c.message} ({c.rating}/5)
                      </span>

                      <Button
                        type="button"
                        onClick={() =>
                          handleDeleteComment(p._id, c._id)
                        }
                        style={{
                          background: "#e74c3c",
                          padding: "2px 6px",
                          fontSize: "12px",
                        }}
                      >
                        Supprimer
                      </Button>
                    </CommentItem>
                  ))}
                </CommentContainer>
              )}
            </ProductItem>
          );
        })}
      </ProductList>
    </Container>
  );
}
export default AdminProducts;
