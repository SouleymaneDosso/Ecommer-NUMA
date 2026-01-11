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
  padding: 4px 0;
  border-bottom: 1px solid #ccc;
`;

// ===============================
// COMPOSANT
// ===============================
function AdminProducts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
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
  const [editingProductId, setEditingProductId] = useState(null);

  const token = localStorage.getItem("adminToken");

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
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
      })
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
      [color]: { ...prev[color], [size]: parseInt(value) || 0 },
    }));
  };

  // ===============================
  // SUPPRESSION IMAGE EXISTANTE
  // ===============================
  const handleDeleteExistingImage = (publicId, idx) => {
    const updatedImages = existingImages.filter(
      (img) => img.publicId !== publicId
    );
    setExistingImages(updatedImages);
    setImagesToDelete([...imagesToDelete, publicId]);

    if (mainImageIndex === idx) {
      // image principale supprimée
      if (updatedImages.length + newImages.length > 0) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
    } else if (mainImageIndex > idx) {
      // image supprimée avant l'image principale
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleDeleteNewImage = (idx) => {
    const globalIdx = existingImages.length + idx;

    // 🔥 libération mémoire
    URL.revokeObjectURL(newImages[idx].preview);

    const updatedNewImages = newImages.filter((_, i) => i !== idx);
    setNewImages(updatedNewImages);

    if (mainImageIndex === globalIdx) {
      if (existingImages.length + updatedNewImages.length > 0) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
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
  // SUBMIT PRODUIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Vérification des champs obligatoires
    if (
      !title ||
      !description ||
      !price ||
      existingImages.length + newImages.length === 0
    ) {
      return alert("Tous les champs sont obligatoires !");
    }

    // Préparer l'objet stock par variation
    const stockObj = {};
    colors.forEach((color) => {
      stockObj[color] = {};
      sizes.forEach((size) => {
        stockObj[color][size] = stock[color]?.[size] || 0;
      });
    });

    // -----------------------------
    // FormData
    // -----------------------------
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("couleurs", JSON.stringify(colors));
    formData.append("tailles", JSON.stringify(sizes));
    formData.append("stockParVariation", JSON.stringify(stockObj));
    formData.append("genre", genre);
    formData.append("categorie", categorie);
    formData.append("badge", badge);
    formData.append("hero", hero);
    formData.append("mainImageIndex", mainImageIndex);

    // ✅ Images à supprimer
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete));

    // ✅ Nouvelles images
    newImages.forEach((file) => formData.append("images", file));

    // -----------------------------
    // Envoi vers le backend
    // -----------------------------
    try {
      let res, data;

      if (editingProductId) {
        res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits/${editingProductId}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      data = await res.json();
      if (!res.ok)
        return alert(data.message || "Erreur lors de l'ajout ou modification");

      alert(editingProductId ? "Produit modifié !" : "Produit ajouté !");

      // Réinitialiser formulaire et refetch
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
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setColors(p.couleurs || []);
    setSizes(p.tailles || []);

    const stockObj = {};
    Object.entries(p.stockParVariation || {}).forEach(([color, sizesMap]) => {
      stockObj[color] = Object.fromEntries(Object.entries(sizesMap));
    });
    setStock(stockObj);

    setHero(p.hero);
    setGenre(p.genre);
    setCategorie(p.categorie);
    setBadge(p.badge);
    setExistingImages(p.images || []);
    setImagesToDelete([]);
    setNewImages([]);

    if (p.images?.length > 0) {
      const mainIdx = p.images.findIndex((i) => i.isMain);
      setMainImageIndex(mainIdx !== -1 ? mainIdx : 0);
    } else {
      setMainImageIndex(null);
    }
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert(data.message || "Produit supprimé !");
      } else alert(data.message || "Erreur suppression produit");
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok)
        return alert(data.message || "Erreur suppression commentaire");

      // Mise à jour frontend : filtrer par ID converti en string
      setProducts((prev) =>
        prev.map((p) =>
          p._id === produitId
            ? {
                ...p,
                commentaires: p.commentaires.filter(
                  (c) => c._id.toString() !== commentaireId.toString()
                ),
              }
            : p
        )
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

  const resetForm = () => {
    newImages.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });

    setTitle("");
    setDescription("");
    setPrice("");
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
    setEditingProductId(null);
  };

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
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="enfant">Enfant</option>
        </Select>

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

        <Select
          value={badge || ""}
          onChange={(e) => setBadge(e.target.value || null)}
        >
          <option value="">Aucun</option>
          <option value="new">New</option>
          <option value="promo">Promo</option>
        </Select>

        <Select
          value={hero}
          onChange={(e) => setHero(e.target.value === "true")}
        >
          <option value="false">Non Hero</option>
          <option value="true">Hero</option>
        </Select>

        <Input
          type="text"
          placeholder="Couleurs (séparées par ,)"
          value={colors.join(",")}
          onChange={(e) =>
            setColors(e.target.value.split(",").map((c) => c.trim()))
          }
        />
        <Input
          type="text"
          placeholder="Tailles (séparées par ,)"
          value={sizes.join(",")}
          onChange={(e) =>
            setSizes(e.target.value.split(",").map((s) => s.trim()))
          }
        />

        {/* STOCK */}
        {colors.length > 0 && sizes.length > 0 && (
          <div>
            {colors.map((color) => (
              <div key={color}>
                <strong>{color}</strong>
                {sizes.map((size) => (
                  <Input
                    key={`${color}_${size}`}
                    type="number"
                    placeholder={`${color} / ${size}`}
                    value={stock[color]?.[size] || ""}
                    onChange={(e) =>
                      handleStockChange(color, size, e.target.value)
                    }
                    style={{ width: "80px", marginRight: "5px" }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* EXISTING IMAGES */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          {existingImages.map((img, idx) => (
            <div key={img.publicId} style={{ position: "relative" }}>
              <ImagePreview
                src={img.url}
                $isMain={idx === mainImageIndex}
                onClick={() => setMainImageIndex(idx)}
              />

              <Button
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "#e74c3c",
                  padding: "2px 6px",
                }}
                onClick={() => handleDeleteExistingImage(img.publicId, idx)}
                type="button"
              >
                X
              </Button>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImageChange}
        />
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          {newImages.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <ImagePreview
                src={img.preview}
                $isMain={existingImages.length + idx === mainImageIndex}
                onClick={() => setMainImageIndex(existingImages.length + idx)}
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

        <Button type="submit">
          {editingProductId ? "Modifier Produit" : "Ajouter Produit"}
        </Button>
        {editingProductId && (
          <Button
            type="button"
            style={{ background: "#6c757d", marginTop: "5px" }}
            onClick={resetForm}
          >
            Annuler
          </Button>
        )}
      </Form>

      {/* LISTE PRODUITS */}
      <ProductList>
        {products.map((p) => (
          <ProductItem key={p._id}>
            <ProductHeader>
              <div>
                {p.title} {p.hero && "(Hero)"} {p.isNew && "(Nouveau)"}
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <Button onClick={() => handleEditProduct(p)}>Modifier</Button>
                <Button
                  onClick={() => handleDeleteProduct(p._id)}
                  style={{ background: "#e74c3c" }}
                >
                  Supprimer
                </Button>
              </div>
            </ProductHeader>

            {p.images && p.images.length > 0 && (
              <ImagePreview
                src={p.images.find((i) => i.isMain)?.url || p.images[0].url}
                $isMain
              />
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
                      onClick={() => handleDeleteComment(p._id, c._id)}
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
        ))}
      </ProductList>
    </Container>
  );
}

export default AdminProducts;
