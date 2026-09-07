import { useState, useEffect } from "react";
import styled from "styled-components";

// =====================================================
// STYLES
// =====================================================

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

  @media (max-width: 768px) {
    font-size: 25px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

const Section = styled.div`
  margin-top: 10px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px;
  color: #2c3e50;
  font-size: 18px;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border-radius: 7px;
  border: 1px solid #ccc;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 11px 12px;
  border-radius: 7px;
  border: 1px solid #ccc;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProductList = styled.div`
  margin-top: 40px;
`;

const ProductItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProductName = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #2c3e50;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
`;

const ImageGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: ${(props) =>
    props.$isMain ? "2px solid #007bff" : "1px solid #ccc"};
  cursor: pointer;
`;

const VideoPreview = styled.video`
  width: 100%;
  max-width: 500px;
  max-height: 280px;
  display: block;
  object-fit: cover;
  border-radius: 10px;
  background: #111;
`;

const VideoBox = styled.div`
  padding: 15px;
  border-radius: 10px;
  background: #111;
  color: #fff;
`;

const VideoLabel = styled.div`
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 14px;
`;

const VideoActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const CommentContainer = styled.div`
  background: #f1f1f1;
  padding: 12px;
  border-radius: 8px;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StockBlock = styled.div`
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const StockTitle = styled.strong`
  display: block;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const StockInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StockInput = styled(Input)`
  width: 100px;

  @media (max-width: 500px) {
    width: 90px;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;

  background: ${(props) =>
    props.$precommande ? "#fff3cd" : "#e9f7ef"};

  color: ${(props) =>
    props.$precommande ? "#856404" : "#1e7e34"};
`;

// =====================================================
// COMPOSANT
// =====================================================

function AdminProducts() {
  // ===================================================
  // PRODUIT
  // ===================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState({});

  // ===================================================
  // IMAGES
  // ===================================================

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(null);

  // ===================================================
  // CATALOGUE
  // ===================================================

  const [products, setProducts] = useState([]);

  const [genre, setGenre] = useState("homme");
  const [categorie, setCategorie] = useState("haut");
  const [badge, setBadge] = useState(null);
  const [hero, setHero] = useState(false);

  // ===================================================
  // ÉDITION
  // ===================================================

  const [editingProductId, setEditingProductId] = useState(null);

  // ===================================================
  // PRÉCOMMANDE
  // ===================================================

  const [precommande, setPrecommande] = useState(false);
  const [montantDepot, setMontantDepot] = useState("");
  const [dateDisponibilite, setDateDisponibilite] = useState("");

  // ===================================================
  // VIDÉO PRODUIT
  // ===================================================

  const [videoFile, setVideoFile] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);

  // ===================================================
  // DETAILS
  // ===================================================

  const [details, setDetails] = useState({
    matiere: "",
    poids: "",
    coupe: "",
    saison: "",
    entretien: "",
    paysFabrication: "",
  });

  // ===================================================
  // TOKEN
  // ===================================================

  const token = localStorage.getItem("adminToken");

  // ===================================================
  // FETCH PRODUITS
  // ===================================================

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
      console.error("Erreur fetch produits :", err);
    }
  };

  // ===================================================
  // NOUVELLES IMAGES
  // ===================================================

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const filesWithPreview = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setNewImages((prev) => [...prev, ...filesWithPreview]);

    if (
      mainImageIndex === null &&
      existingImages.length + files.length > 0
    ) {
      setMainImageIndex(0);
    }

    e.target.value = null;
  };

  // ===================================================
  // STOCK
  // ===================================================

  const handleStockChange = (color, size, value) => {
    setStock((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: parseInt(value, 10) || 0,
      },
    }));
  };

  // ===================================================
  // SUPPRESSION IMAGE EXISTANTE
  // ===================================================

  const handleDeleteExistingImage = (publicId, idx) => {
    const updatedImages = existingImages.filter(
      (img) => img.publicId !== publicId,
    );

    setExistingImages(updatedImages);

    setImagesToDelete((prev) => [...prev, publicId]);

    if (mainImageIndex === idx) {
      if (updatedImages.length + newImages.length > 0) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
    } else if (
      mainImageIndex !== null &&
      mainImageIndex > idx
    ) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  // ===================================================
  // SUPPRESSION NOUVELLE IMAGE
  // ===================================================

  const handleDeleteNewImage = (idx) => {
    const globalIdx = existingImages.length + idx;

    const image = newImages[idx];

    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    const updatedNewImages = newImages.filter(
      (_, i) => i !== idx,
    );

    setNewImages(updatedNewImages);

    if (mainImageIndex === globalIdx) {
      if (existingImages.length + updatedNewImages.length > 0) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
    } else if (
      mainImageIndex !== null &&
      mainImageIndex > globalIdx
    ) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  // ===================================================
  // NETTOYAGE PREVIEWS
  // ===================================================

  useEffect(() => {
    return () => {
      newImages.forEach((img) => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [newImages]);

  // ===================================================
  // VIDÉO PRODUIT
  // ===================================================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setVideoFile(null);
      return;
    }

    if (!file.type.startsWith("video/")) {
      alert("Veuillez sélectionner une vidéo.");

      e.target.value = null;
      return;
    }

    setVideoFile(file);
  };

  // ===================================================
  // SUPPRIMER VIDÉO EXISTANTE
  // ===================================================

  const handleDeleteVideo = async () => {
    if (!existingVideo?._id) {
      return;
    }

    if (!window.confirm("Supprimer la vidéo de ce produit ?")) {
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/videos/videos/${existingVideo._id}`,
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
          data.message || "Impossible de supprimer la vidéo.",
        );
      }

      setExistingVideo(null);

      alert("Vidéo supprimée.");

      fetchProducts();
    } catch (err) {
      console.error("Erreur suppression vidéo :", err);
      alert("Erreur serveur.");
    }
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      existingImages.length + newImages.length === 0
    ) {
      return alert(
        "Le titre, la description, le prix et au moins une image sont obligatoires.",
      );
    }

    if (precommande) {
      if (!montantDepot || Number(montantDepot) <= 0) {
        return alert(
          "Veuillez indiquer un montant de dépôt valide pour la précommande.",
        );
      }

      if (!dateDisponibilite) {
        return alert(
          "Veuillez indiquer la date de disponibilité du modèle.",
        );
      }
    }

    // -------------------------------------------------
    // STOCK
    // -------------------------------------------------

    const stockObj = {};

    colors.forEach((color) => {
      if (!color) return;

      stockObj[color] = {};

      sizes.forEach((size) => {
        if (!size) return;

        stockObj[color][size] =
          stock[color]?.[size] || 0;
      });
    });

    // -------------------------------------------------
    // FORMDATA PRODUIT
    // -------------------------------------------------

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);

    formData.append(
      "couleurs",
      JSON.stringify(colors.filter(Boolean)),
    );

    formData.append(
      "tailles",
      JSON.stringify(sizes.filter(Boolean)),
    );

    formData.append(
      "stockParVariation",
      JSON.stringify(stockObj),
    );

    formData.append("genre", genre);
    formData.append("categorie", categorie);

    formData.append("hero", String(hero));

    formData.append(
      "precommande",
      String(precommande),
    );

    formData.append(
      "montantDepot",
      precommande ? montantDepot : "",
    );

    formData.append(
      "dateDisponibilite",
      precommande ? dateDisponibilite : "",
    );

    formData.append(
      "imagesToDelete",
      JSON.stringify(imagesToDelete),
    );

    if (badge !== null) {
      formData.append("badge", badge);
    }

    if (mainImageIndex !== null) {
      formData.append(
        "mainImageIndex",
        String(mainImageIndex),
      );
    }

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append(
      "details",
      JSON.stringify(details),
    );

    try {
      let res;

      // =================================================
      // 1. CRÉATION / MODIFICATION PRODUIT
      // =================================================

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
          data.message ||
            "Erreur lors de l'enregistrement du produit.",
        );
      }

      // =================================================
      // ID PRODUIT
      // =================================================

      const produitId =
        data._id ||
        data.produit?._id ||
        editingProductId;

      if (!produitId) {
        return alert(
          "Produit enregistré mais impossible de récupérer son identifiant.",
        );
      }

      // =================================================
      // 2. UPLOAD VIDÉO PRODUIT
      // =================================================

      if (videoFile) {
        const videoFormData = new FormData();

        videoFormData.append(
          "produitId",
          produitId,
        );

        videoFormData.append(
          "video",
          videoFile,
        );

        videoFormData.append(
          "title",
          title.trim(),
        );

        videoFormData.append(
          "description",
          description.trim(),
        );

        const videoRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/videos/upload-produit`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: videoFormData,
          },
        );

        const videoData = await videoRes.json();

        if (!videoRes.ok) {
          console.error(
            "Erreur vidéo :",
            videoData,
          );

          alert(
            "Produit enregistré, mais la vidéo n'a pas pu être associée.",
          );
        }
      }

      // =================================================
      // SUCCÈS
      // =================================================

      alert(
        editingProductId
          ? "Produit modifié avec succès !"
          : "Produit ajouté avec succès !",
      );

      resetForm();

      await fetchProducts();
    } catch (err) {
      console.error(
        "Erreur enregistrement produit :",
        err,
      );

      alert("Erreur serveur.");
    }
  };

  // ===================================================
  // ÉDITER PRODUIT
  // ===================================================

  const handleEditProduct = (p) => {
    setEditingProductId(p._id);

    setTitle(p.title || "");
    setDescription(p.description || "");
    setPrice(p.price ?? "");

    setColors(p.couleurs || []);
    setSizes(p.tailles || []);

    // -----------------------------------------------
    // STOCK
    // -----------------------------------------------

    const stockObj = {};

    Object.entries(
      p.stockParVariation || {},
    ).forEach(([color, sizesMap]) => {
      stockObj[color] = Object.fromEntries(
        Object.entries(sizesMap || {}),
      );
    });

    setStock(stockObj);

    // -----------------------------------------------
    // INFOS
    // -----------------------------------------------

    setHero(Boolean(p.hero));

    setGenre(
      p.genre || "homme",
    );

    setCategorie(
      p.categorie || "haut",
    );

    setBadge(
      p.badge || null,
    );

    // -----------------------------------------------
    // PRÉCOMMANDE
    // -----------------------------------------------

    setPrecommande(
      Boolean(p.precommande),
    );

    setMontantDepot(
      p.montantDepot !== null &&
      p.montantDepot !== undefined
        ? p.montantDepot
        : "",
    );

    setDateDisponibilite(
      p.dateDisponibilite
        ? new Date(p.dateDisponibilite)
            .toISOString()
            .split("T")[0]
        : "",
    );

    // -----------------------------------------------
    // IMAGES
    // -----------------------------------------------

    setExistingImages(
      p.images || [],
    );

    setImagesToDelete([]);

    setNewImages([]);

    if (p.images?.length > 0) {
      const mainIdx = p.images.findIndex(
        (image) => image.isMain,
      );

      setMainImageIndex(
        mainIdx !== -1
          ? mainIdx
          : 0,
      );
    } else {
      setMainImageIndex(null);
    }

    // -----------------------------------------------
    // VIDÉO
    // -----------------------------------------------

    setVideoFile(null);

    if (
      p.videoId &&
      typeof p.videoId === "object"
    ) {
      setExistingVideo(p.videoId);
    } else {
      setExistingVideo(null);
    }

    // -----------------------------------------------
    // DETAILS
    // -----------------------------------------------

    setDetails({
      matiere:
        p.details?.matiere || "",

      poids:
        p.details?.poids || "",

      coupe:
        p.details?.coupe || "",

      saison:
        p.details?.saison || "",

      entretien:
        p.details?.entretien || "",

      paysFabrication:
        p.details?.paysFabrication || "",
    });

    // -----------------------------------------------
    // SCROLL FORM
    // -----------------------------------------------

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // SUPPRESSION PRODUIT
  // ===================================================

  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Supprimer ce produit ?",
      )
    ) {
      return;
    }

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
        setProducts((prev) =>
          prev.filter(
            (p) => p._id !== id,
          ),
        );

        alert(
          data.message ||
            "Produit supprimé !",
        );
      } else {
        alert(
          data.message ||
            "Erreur suppression produit",
        );
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ===================================================
  // SUPPRESSION COMMENTAIRE
  // ===================================================

  const handleDeleteComment = async (
    produitId,
    commentaireId,
  ) => {
    if (
      !window.confirm(
        "Supprimer ce commentaire ?",
      )
    ) {
      return;
    }

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
          data.message ||
            "Erreur suppression commentaire",
        );
      }

      setProducts((prev) =>
        prev.map((p) =>
          p._id === produitId
            ? {
                ...p,
                commentaires:
                  p.commentaires.filter(
                    (c) =>
                      c._id.toString() !==
                      commentaireId.toString(),
                  ),
              }
            : p,
        ),
      );

      alert(
        "Commentaire supprimé !",
      );
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // ===================================================
  // RESET
  // ===================================================

  const resetForm = () => {
    newImages.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(
          img.preview,
        );
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

    // -----------------------------------------------
    // PRÉCOMMANDE
    // -----------------------------------------------

    setPrecommande(false);
    setMontantDepot("");
    setDateDisponibilite("");

    // -----------------------------------------------
    // VIDÉO
    // -----------------------------------------------

    setVideoFile(null);
    setExistingVideo(null);

    // -----------------------------------------------
    // DETAILS
    // -----------------------------------------------

    setDetails({
      matiere: "",
      poids: "",
      coupe: "",
      saison: "",
      entretien: "",
      paysFabrication: "",
    });
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <Container>
      <Title>
        {editingProductId
          ? "Modifier le produit"
          : "Admin Produits"}
      </Title>

      <Form onSubmit={handleSubmit}>
        {/* =================================================
            INFORMATIONS PRODUIT
        ================================================= */}

        <Section>
          <SectionTitle>
            Informations du produit
          </SectionTitle>

          <Input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
          />

          <Input
            type="number"
            min="0"
            placeholder="Prix"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />

          <Select
            value={genre}
            onChange={(e) =>
              setGenre(e.target.value)
            }
          >
            <option value="homme">
              Homme
            </option>

            <option value="femme">
              Femme
            </option>

            <option value="enfant">
              Enfant
            </option>
          </Select>

          <Select
            value={categorie}
            onChange={(e) =>
              setCategorie(
                e.target.value,
              )
            }
          >
            <option value="haut">
              Haut
            </option>

            <option value="bas">
              Bas
            </option>

            <option value="robe">
              Robe
            </option>

            <option value="chaussure">
              Chaussure
            </option>

            <option value="tout">
              Tout
            </option>
          </Select>

          <Select
            value={badge || ""}
            onChange={(e) =>
              setBadge(
                e.target.value || null,
              )
            }
          >
            <option value="">
              Aucun badge
            </option>

            <option value="new">
              New
            </option>

            <option value="promo">
              Promo
            </option>
          </Select>

          <Select
            value={hero}
            onChange={(e) =>
              setHero(
                e.target.value === "true",
              )
            }
          >
            <option value="false">
              Non Hero
            </option>

            <option value="true">
              Hero
            </option>
          </Select>
        </Section>

        {/* =================================================
            PRÉCOMMANDE
        ================================================= */}

        <Section>
          <SectionTitle>
            Précommande
          </SectionTitle>

          <Select
            value={String(precommande)}
            onChange={(e) =>
              setPrecommande(
                e.target.value === "true",
              )
            }
          >
            <option value="false">
              Produit normal
            </option>

            <option value="true">
              Produit disponible en précommande
            </option>
          </Select>

          {precommande && (
            <>
              <Input
                type="number"
                min="0"
                placeholder="Montant du dépôt en FCFA"
                value={montantDepot}
                onChange={(e) =>
                  setMontantDepot(
                    e.target.value,
                  )
                }
              />

              <Input
                type="date"
                value={dateDisponibilite}
                onChange={(e) =>
                  setDateDisponibilite(
                    e.target.value,
                  )
                }
              />

              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                Le produit apparaîtra sur la
                page précommande avec son prix,
                son dépôt et sa date de
                disponibilité.
              </div>
            </>
          )}
        </Section>

        {/* =================================================
            COULEURS / TAILLES
        ================================================= */}

        <Section>
          <SectionTitle>
            Variations
          </SectionTitle>

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
        </Section>

        {/* =================================================
            DETAILS
        ================================================= */}

        <Section>
          <SectionTitle>
            Détails du produit
          </SectionTitle>

          <Input
            type="text"
            placeholder="Matière"
            value={details.matiere}
            onChange={(e) =>
              setDetails((prev) => ({
                ...prev,
                matiere:
                  e.target.value,
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
                poids:
                  e.target.value,
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
                coupe:
                  e.target.value,
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
                saison:
                  e.target.value,
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
                entretien:
                  e.target.value,
              }))
            }
          />

          <Input
            type="text"
            placeholder="Pays de fabrication"
            value={
              details.paysFabrication
            }
            onChange={(e) =>
              setDetails((prev) => ({
                ...prev,
                paysFabrication:
                  e.target.value,
              }))
            }
          />
        </Section>

        {/* =================================================
            STOCK
        ================================================= */}

        {colors.length > 0 &&
          sizes.length > 0 && (
            <Section>
              <SectionTitle>
                Stock par variation
              </SectionTitle>

              {colors.map((color) => (
                <StockBlock key={color}>
                  <StockTitle>
                    {color}
                  </StockTitle>

                  <StockInputs>
                    {sizes.map((size) => (
                      <StockInput
                        key={`${color}_${size}`}
                        type="number"
                        min="0"
                        placeholder={`${size}`}
                        value={
                          stock[color]?.[
                            size
                          ] ?? ""
                        }
                        onChange={(e) =>
                          handleStockChange(
                            color,
                            size,
                            e.target.value,
                          )
                        }
                      />
                    ))}
                  </StockInputs>
                </StockBlock>
              ))}
            </Section>
          )}

        {/* =================================================
            IMAGES EXISTANTES
        ================================================= */}

        <Section>
          <SectionTitle>
            Images du produit
          </SectionTitle>

          {existingImages.length > 0 && (
            <ImageGrid>
              {existingImages.map(
                (img, idx) => (
                  <ImageWrapper
                    key={img.publicId}
                  >
                    <ImagePreview
                      src={img.url}
                      alt={title}
                      $isMain={
                        idx ===
                        mainImageIndex
                      }
                      onClick={() =>
                        setMainImageIndex(
                          idx,
                        )
                      }
                    />

                    <Button
                      type="button"
                      style={{
                        position:
                          "absolute",
                        top: 0,
                        right: 0,
                        background:
                          "#e74c3c",
                        padding:
                          "2px 6px",
                        borderRadius:
                          "0 6px 0 6px",
                      }}
                      onClick={() =>
                        handleDeleteExistingImage(
                          img.publicId,
                          idx,
                        )
                      }
                    >
                      X
                    </Button>
                  </ImageWrapper>
                ),
              )}
            </ImageGrid>
          )}

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={
              handleNewImageChange
            }
          />

          {newImages.length > 0 && (
            <>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                Nouvelles images
              </div>

              <ImageGrid>
                {newImages.map(
                  (img, idx) => (
                    <ImageWrapper
                      key={`${img.name}-${idx}`}
                    >
                      <ImagePreview
                        src={img.preview}
                        alt="Nouvelle image"
                        $isMain={
                          existingImages.length +
                            idx ===
                          mainImageIndex
                        }
                        onClick={() =>
                          setMainImageIndex(
                            existingImages.length +
                              idx,
                          )
                        }
                      />

                      <Button
                        type="button"
                        style={{
                          position:
                            "absolute",
                          top: 0,
                          right: 0,
                          background:
                            "#e74c3c",
                          padding:
                            "2px 6px",
                          borderRadius:
                            "0 6px 0 6px",
                        }}
                        onClick={() =>
                          handleDeleteNewImage(
                            idx,
                          )
                        }
                      >
                        X
                      </Button>
                    </ImageWrapper>
                  ),
                )}
              </ImageGrid>
            </>
          )}

          <div
            style={{
              marginTop: "5px",
              fontSize: "12px",
              color: "#777",
            }}
          >
            Clique sur une image pour la
            définir comme image principale.
          </div>
        </Section>

        {/* =================================================
            VIDÉO DU PRODUIT
        ================================================= */}

        <Section>
          <SectionTitle>
            Vidéo de ce produit
          </SectionTitle>

          {existingVideo?.url && (
            <VideoBox>
              <VideoLabel>
                Vidéo actuellement associée
              </VideoLabel>

              <VideoPreview
                src={existingVideo.url}
                poster={
                  existingVideo.thumbnail ||
                  undefined
                }
                controls
                muted
                playsInline
              />

              <VideoActions>
                <Button
                  type="button"
                  style={{
                    background:
                      "#e74c3c",
                  }}
                  onClick={
                    handleDeleteVideo
                  }
                >
                  Supprimer la vidéo
                </Button>
              </VideoActions>
            </VideoBox>
          )}

          <div
            style={{
              marginTop:
                existingVideo
                  ? "15px"
                  : "0",
            }}
          >
            <Input
              type="file"
              accept="video/*"
              onChange={
                handleVideoChange
              }
            />
          </div>

          {videoFile && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                background: "#eef6ff",
                borderRadius: "8px",
                color: "#24527a",
                fontSize: "13px",
              }}
            >
              Nouvelle vidéo sélectionnée :
              <strong>
                {" "}
                {videoFile.name}
              </strong>
            </div>
          )}

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#777",
              lineHeight: "1.5",
            }}
          >
            Cette vidéo appartient uniquement à
            ce produit. Elle sera utilisée sur la
            page précommande si le produit est
            marqué comme précommande.
          </div>
        </Section>

        {/* =================================================
            BOUTONS
        ================================================= */}

        <Button
          type="submit"
        >
          {editingProductId
            ? "Modifier Produit"
            : "Ajouter Produit"}
        </Button>

        {editingProductId && (
          <Button
            type="button"
            style={{
              background: "#6c757d",
            }}
            onClick={resetForm}
          >
            Annuler
          </Button>
        )}
      </Form>

      {/* =================================================
          LISTE PRODUITS
      ================================================= */}

      <ProductList>
        <Title
          style={{
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          Produits existants
        </Title>

        {products.map((p) => {
          const mainImage =
            p.images?.find(
              (i) => i.isMain,
            )?.url ||
            p.images?.[0]?.url;

          const productVideo =
            p.videoId &&
            typeof p.videoId ===
              "object"
              ? p.videoId
              : null;

          return (
            <ProductItem
              key={p._id}
            >
              {/* -----------------------------------------
                  HEADER
              ----------------------------------------- */}

              <ProductHeader>
                <div>
                  <ProductName>
                    {p.title}
                  </ProductName>

                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      flexWrap: "wrap",
                      marginTop: "7px",
                    }}
                  >
                    {p.hero && (
                      <StatusBadge>
                        HERO
                      </StatusBadge>
                    )}

                    {p.precommande && (
                      <StatusBadge
                        $precommande
                      >
                        PRÉCOMMANDE
                      </StatusBadge>
                    )}
                  </div>
                </div>

                <ProductActions>
                  <Button
                    type="button"
                    onClick={() =>
                      handleEditProduct(
                        p,
                      )
                    }
                  >
                    Modifier
                  </Button>

                  <Button
                    type="button"
                    onClick={() =>
                      handleDeleteProduct(
                        p._id,
                      )
                    }
                    style={{
                      background:
                        "#e74c3c",
                    }}
                  >
                    Supprimer
                  </Button>
                </ProductActions>
              </ProductHeader>

              {/* -----------------------------------------
                  IMAGE PRINCIPALE
              ----------------------------------------- */}

              {mainImage && (
                <ImagePreview
                  src={mainImage}
                  alt={p.title}
                  $isMain
                />
              )}

              {/* -----------------------------------------
                  VIDÉO
              ----------------------------------------- */}

              {productVideo?.url && (
                <div>
                  <div
                    style={{
                      marginBottom:
                        "8px",
                      fontWeight: 700,
                      color: "#333",
                    }}
                  >
                    Vidéo produit
                  </div>

                  <VideoPreview
                    src={
                      productVideo.url
                    }
                    poster={
                      productVideo.thumbnail ||
                      mainImage
                    }
                    controls
                    muted
                    playsInline
                  />
                </div>
              )}

              {/* -----------------------------------------
                  INFOS PRÉCOMMANDE
              ----------------------------------------- */}

              {p.precommande && (
                <div
                  style={{
                    padding: "12px",
                    background:
                      "#fff8e1",
                    borderRadius:
                      "8px",
                    fontSize: "13px",
                  }}
                >
                  <strong>
                    Précommande
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "5px",
                    }}
                  >
                    Dépôt :{" "}
                    <strong>
                      {Number(
                        p.montantDepot ||
                          0,
                      ).toLocaleString(
                        "fr-FR",
                      )}{" "}
                      FCFA
                    </strong>
                  </div>

                  {p.dateDisponibilite && (
                    <div>
                      Disponible le :{" "}
                      <strong>
                        {new Date(
                          p.dateDisponibilite,
                        ).toLocaleDateString(
                          "fr-FR",
                        )}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* -----------------------------------------
                  COMMENTAIRES
              ----------------------------------------- */}

              {p.commentaires &&
                p.commentaires.length >
                  0 && (
                  <CommentContainer>
                    <strong>
                      Commentaires :
                    </strong>

                    <div
                      style={{
                        marginTop:
                          "8px",
                      }}
                    >
                      {p.commentaires.map(
                        (c) => (
                          <CommentItem
                            key={c._id}
                          >
                            <span>
                              {c.user}:{" "}
                              {c.message}{" "}
                              (
                              {
                                c.rating
                              }
                              /5)
                            </span>

                            <Button
                              type="button"
                              onClick={() =>
                                handleDeleteComment(
                                  p._id,
                                  c._id,
                                )
                              }
                              style={{
                                background:
                                  "#e74c3c",
                                padding:
                                  "6px 9px",
                                fontSize:
                                  "12px",
                              }}
                            >
                              Supprimer
                            </Button>
                          </CommentItem>
                        ),
                      )}
                    </div>
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