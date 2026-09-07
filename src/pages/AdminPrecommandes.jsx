import { useEffect, useState } from "react";
import styled from "styled-components";

// ======================================================
// STYLES
// ======================================================

const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f9fafb;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const Subtitle = styled.p`
  margin-bottom: 30px;
  color: #666;
`;

const Section = styled.section`
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px;
  color: #2c3e50;
  font-size: 22px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border-radius: 7px;
  border: 1px solid #ccc;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
  resize: vertical;
  padding: 11px;
  border-radius: 7px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border-radius: 7px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 14px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 11px 18px;
  border: none;
  border-radius: 7px;
  color: #fff;
  background: ${(props) => {
    if (props.$danger) return "#e74c3c";
    if (props.$secondary) return "#7f8c8d";
    if (props.$warning) return "#f39c12";
    return "#007bff";
  }};
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CheckBoxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const CheckBox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const PreviewImage = styled.img`
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  border: ${(props) =>
    props.$main ? "3px solid #007bff" : "1px solid #ddd"};
  cursor: pointer;
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  border: none;
  background: #e74c3c;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
`;

const MainBadge = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: #007bff;
  color: white;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
`;

const VideoPreview = styled.video`
  width: 300px;
  max-width: 100%;
  max-height: 250px;
  border-radius: 10px;
  background: #000;
  margin-top: 10px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
`;

const ProductCardImage = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
`;

const ProductCardBody = styled.div`
  padding: 15px;
`;

const ProductCardTitle = styled.h3`
  margin: 0 0 8px;
  color: #2c3e50;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
  margin: 8px 0;
`;

const Deposit = styled.div`
  color: #27ae60;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Availability = styled.div`
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 5px 9px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
  background: ${(props) =>
    props.$active ? "#d5f5e3" : "#fadbd8"};
  color: ${(props) =>
    props.$active ? "#1e8449" : "#c0392b"};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
`;

const Tag = styled.span`
  background: #f1f1f1;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  background: #fdecea;
  color: #c0392b;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: #eafaf1;
  color: #1e8449;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Loading = styled.div`
  padding: 30px;
  text-align: center;
  color: #666;
`;

// ======================================================
// HELPERS
// ======================================================

const formatPrice = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0 FCFA";
  }

  return `${number.toLocaleString("fr-FR")} FCFA`;
};

const formatDate = (value) => {
  if (!value) return "Non définie";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date invalide";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ======================================================
// COMPOSANT
// ======================================================

function AdminPrecommandes() {
  const token = localStorage.getItem("adminToken");
  const API = import.meta.env.VITE_API_URL;

  // ====================================================
  // FORMULAIRE
  // ====================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [montantDepot, setMontantDepot] = useState("");
  const [dateDisponibilite, setDateDisponibilite] =
    useState("");

  const [genre, setGenre] = useState("homme");
  const [categorie, setCategorie] = useState("haut");
  const [badge, setBadge] = useState("");

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [details, setDetails] = useState({
    matiere: "",
    poids: "",
    coupe: "",
    saison: "",
    entretien: "",
    paysFabrication: "",
  });

  const [precommande, setPrecommande] = useState(true);

  // ====================================================
  // IMAGES
  // ====================================================

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(null);

  // ====================================================
  // VIDÉO
  // ====================================================

  const [existingVideo, setExistingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] =
    useState("");
  const [videoUploading, setVideoUploading] =
    useState(false);

  // ====================================================
  // PRODUITS
  // ====================================================

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] =
    useState(null);

  // ====================================================
  // UI
  // ====================================================

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ====================================================
  // RÉCUPÉRER LES PRODUITS
  // ====================================================

  const fetchProducts = async () => {
    if (!token) {
      setError("Accès non autorisé.");
      setProductsLoading(false);
      return;
    }

    try {
      setProductsLoading(true);

      const res = await fetch(`${API}/api/produits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la récupération des produits",
        );
      }

      /*
       * Ton endpoint peut retourner directement un tableau
       * ou un objet contenant produits.
       */
      const liste = Array.isArray(data)
        ? data
        : data.produits || [];

      setProducts(liste);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Erreur lors de la récupération des produits",
      );
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ====================================================
  // GESTION IMAGES
  // ====================================================

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    const filesWithPreview = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setNewImages((prev) => [
      ...prev,
      ...filesWithPreview,
    ]);

    if (
      mainImageIndex === null &&
      existingImages.length + filesWithPreview.length > 0
    ) {
      setMainImageIndex(0);
    }

    e.target.value = "";
  };

  const handleDeleteExistingImage = (
    publicId,
    index,
  ) => {
    const updated = existingImages.filter(
      (img) => img.publicId !== publicId,
    );

    setExistingImages(updated);
    setImagesToDelete((prev) => [...prev, publicId]);

    if (mainImageIndex === index) {
      if (updated.length + newImages.length > 0) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
    } else if (mainImageIndex > index) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleDeleteNewImage = (index) => {
    const globalIndex =
      existingImages.length + index;

    const image = newImages[index];

    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    const updated = newImages.filter(
      (_, i) => i !== index,
    );

    setNewImages(updated);

    if (mainImageIndex === globalIndex) {
      if (
        existingImages.length + updated.length >
        0
      ) {
        setMainImageIndex(0);
      } else {
        setMainImageIndex(null);
      }
    } else if (mainImageIndex > globalIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  // ====================================================
  // GESTION VIDÉO
  // ====================================================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (newVideo?.preview) {
      URL.revokeObjectURL(newVideo.preview);
    }

    const video = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setNewVideo(video);

    e.target.value = "";
  };

  const removeNewVideo = () => {
    if (newVideo?.preview) {
      URL.revokeObjectURL(newVideo.preview);
    }

    setNewVideo(null);
  };

  // ====================================================
  // STOCK / COULEURS / TAILLES
  // ====================================================

  const handleColorsChange = (value) => {
    const result = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setColors(result);
  };

  const handleSizesChange = (value) => {
    const result = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setSizes(result);
  };

  // ====================================================
  // RESET
  // ====================================================

  const resetForm = () => {
    newImages.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });

    if (newVideo?.preview) {
      URL.revokeObjectURL(newVideo.preview);
    }

    setTitle("");
    setDescription("");
    setPrice("");
    setMontantDepot("");
    setDateDisponibilite("");

    setGenre("homme");
    setCategorie("haut");
    setBadge("");

    setColors([]);
    setSizes([]);

    setDetails({
      matiere: "",
      poids: "",
      coupe: "",
      saison: "",
      entretien: "",
      paysFabrication: "",
    });

    setPrecommande(true);

    setExistingImages([]);
    setNewImages([]);
    setImagesToDelete([]);
    setMainImageIndex(null);

    setExistingVideo(null);
    setNewVideo(null);
    setVideoTitle("");
    setVideoDescription("");

    setEditingProductId(null);
  };

  // ====================================================
  // ÉDITER UN MODÈLE
  // ====================================================

  const handleEditProduct = async (product) => {
    setError("");
    setSuccess("");

    setEditingProductId(product._id);

    setTitle(product.title || "");
    setDescription(product.description || "");
    setPrice(product.price ?? "");

    setMontantDepot(
      product.montantDepot !== null &&
        product.montantDepot !== undefined
        ? product.montantDepot
        : "",
    );

    if (product.dateDisponibilite) {
      const date = new Date(
        product.dateDisponibilite,
      );

      if (!Number.isNaN(date.getTime())) {
        setDateDisponibilite(
          date.toISOString().split("T")[0],
        );
      } else {
        setDateDisponibilite("");
      }
    } else {
      setDateDisponibilite("");
    }

    setGenre(product.genre || "homme");
    setCategorie(product.categorie || "haut");
    setBadge(product.badge || "");

    setColors(product.couleurs || []);
    setSizes(product.tailles || []);

    setPrecommande(
      product.precommande === true,
    );

    setDetails({
      matiere: product.details?.matiere || "",
      poids: product.details?.poids || "",
      coupe: product.details?.coupe || "",
      saison: product.details?.saison || "",
      entretien:
        product.details?.entretien || "",
      paysFabrication:
        product.details?.paysFabrication || "",
    });

    setExistingImages(product.images || []);
    setNewImages([]);
    setImagesToDelete([]);

    const mainIndex =
      product.images?.findIndex(
        (image) => image.isMain,
      );

    setMainImageIndex(
      mainIndex !== undefined &&
        mainIndex !== -1
        ? mainIndex
        : product.images?.length
          ? 0
          : null,
    );

    setExistingVideo(null);
    setNewVideo(null);

    /*
     * On récupère la vidéo associée au produit.
     * product.videoId peut être un ObjectId ou un objet
     * selon la réponse backend.
     */
    if (product.videoId) {
      const videoId =
        typeof product.videoId === "object"
          ? product.videoId._id
          : product.videoId;

      try {
        const res = await fetch(
          `${API}/api/videos/videos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (res.ok) {
          const videos = data.videos || [];

          const video = videos.find(
            (item) =>
              item._id === videoId ||
              item.produitId?._id === product._id ||
              item.produitId === product._id,
          );

          if (video) {
            setExistingVideo(video);
            setVideoTitle(video.title || "");
            setVideoDescription(
              video.description || "",
            );
          }
        }
      } catch (err) {
        console.error(
          "Erreur récupération vidéo:",
          err,
        );
      }
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // UPLOAD VIDÉO
  // ====================================================

  const uploadVideoForProduct = async (
    productId,
  ) => {
    if (!newVideo) {
      return true;
    }

    try {
      setVideoUploading(true);

      const formData = new FormData();

      formData.append("video", newVideo);
      formData.append("produitId", productId);

      if (videoTitle.trim()) {
        formData.append(
          "title",
          videoTitle.trim(),
        );
      }

      formData.append(
        "description",
        videoDescription.trim(),
      );

      const res = await fetch(
        `${API}/api/videos/upload-produit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de l'upload de la vidéo",
        );
      }

      return true;
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Erreur lors de l'upload de la vidéo",
      );

      return false;
    } finally {
      setVideoUploading(false);
    }
  };

  // ====================================================
  // SUPPRIMER VIDÉO EXISTANTE
  // ====================================================

  const deleteExistingVideo = async () => {
    if (!existingVideo?._id) {
      return;
    }

    if (
      !window.confirm(
        "Supprimer la vidéo associée à ce modèle ?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${API}/api/videos/videos/${existingVideo._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la suppression de la vidéo",
        );
      }

      setExistingVideo(null);
      setVideoTitle("");
      setVideoDescription("");

      setSuccess(
        data.message ||
          "Vidéo supprimée avec succès.",
      );

      await fetchProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Erreur lors de la suppression de la vidéo",
      );
    }
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Token admin manquant.");
      return;
    }

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    if (!description.trim()) {
      setError("La description est obligatoire.");
      return;
    }

    if (!price || Number(price) < 0) {
      setError("Le prix est obligatoire.");
      return;
    }

    if (
      existingImages.length + newImages.length ===
      0
    ) {
      setError(
        "Ajoute au moins une image au modèle.",
      );
      return;
    }

    if (
      precommande &&
      montantDepot !== "" &&
      Number(montantDepot) < 0
    ) {
      setError(
        "Le montant du dépôt ne peut pas être négatif.",
      );
      return;
    }

    if (
      mainImageIndex === null &&
      existingImages.length + newImages.length > 0
    ) {
      setMainImageIndex(0);
    }

    try {
      setLoading(true);

      // ----------------------------------------------
      // STOCK PAR VARIATION
      // ----------------------------------------------
      const stockParVariation = {};

      colors.forEach((color) => {
        stockParVariation[color] = {};

        sizes.forEach((size) => {
          stockParVariation[color][size] = 0;
        });
      });

      // ----------------------------------------------
      // FORM DATA
      // ----------------------------------------------

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append(
        "description",
        description.trim(),
      );

      formData.append("price", Number(price));
      formData.append(
        "stock",
        "0",
      );

      formData.append(
        "couleurs",
        JSON.stringify(colors),
      );

      formData.append(
        "tailles",
        JSON.stringify(sizes),
      );

      formData.append(
        "stockParVariation",
        JSON.stringify(stockParVariation),
      );

      formData.append("genre", genre);
      formData.append("categorie", categorie);

      if (badge) {
        formData.append("badge", badge);
      }

      formData.append(
        "hero",
        "false",
      );

      formData.append(
        "precommande",
        String(precommande),
      );

      if (montantDepot !== "") {
        formData.append(
          "montantDepot",
          Number(montantDepot),
        );
      } else {
        formData.append(
          "montantDepot",
          "",
        );
      }

      if (dateDisponibilite) {
        formData.append(
          "dateDisponibilite",
          dateDisponibilite,
        );
      } else {
        formData.append(
          "dateDisponibilite",
          "",
        );
      }

      formData.append(
        "details",
        JSON.stringify(details),
      );

      formData.append(
        "imagesToDelete",
        JSON.stringify(imagesToDelete),
      );

      // ----------------------------------------------
      // IMAGES
      // ----------------------------------------------

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      /*
       * Important :
       * mainImageIndex correspond à la liste finale
       * existantes + nouvelles.
       */
      formData.append(
        "mainImageIndex",
        mainImageIndex !== null
          ? String(mainImageIndex)
          : "0",
      );

      // ----------------------------------------------
      // PRODUIT
      // ----------------------------------------------

      let res;

      if (editingProductId) {
        res = await fetch(
          `${API}/api/produits/${editingProductId}`,
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
          `${API}/api/produits`,
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
        throw new Error(
          data.message ||
            "Erreur lors de l'enregistrement du modèle",
        );
      }

      /*
       * On récupère l'ID du produit créé/modifié.
       */
      const productId =
        editingProductId ||
        data.produit?._id ||
        data.product?._id ||
        data._id;

      // ----------------------------------------------
      // VIDÉO
      // ----------------------------------------------

      if (newVideo && productId) {
        const videoOk =
          await uploadVideoForProduct(
            productId,
          );

        if (!videoOk) {
          setLoading(false);

          alert(
            "Le modèle a été enregistré, mais la vidéo n'a pas pu être associée.",
          );

          await fetchProducts();
          return;
        }
      }

      setSuccess(
        editingProductId
          ? "Modèle de précommande modifié avec succès."
          : "Modèle de précommande créé avec succès.",
      );

      resetForm();

      await fetchProducts();
    } catch (err) {
      console.error(
        "SAVE PRECOMMANDE MODEL ERROR:",
        err,
      );

      setError(
        err.message ||
          "Erreur lors de l'enregistrement du modèle.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // SUPPRIMER PRODUIT
  // ====================================================

  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Supprimer définitivement ce modèle ?",
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const res = await fetch(
        `${API}/api/produits/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la suppression",
        );
      }

      setProducts((prev) =>
        prev.filter(
          (product) => product._id !== id,
        ),
      );

      setSuccess(
        data.message ||
          "Modèle supprimé avec succès.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Erreur lors de la suppression.",
      );
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <Container>
      <Title>
        Gestion des précommandes
      </Title>

      <Subtitle>
        Crée et gère les modèles que les clients
        pourront précommander.
      </Subtitle>

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          {success}
        </SuccessMessage>
      )}

      {/* ==================================================
          FORMULAIRE
      ================================================== */}

      <Section>
        <SectionTitle>
          {editingProductId
            ? "Modifier le modèle"
            : "Ajouter un modèle de précommande"}
        </SectionTitle>

        <Form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              <Label>Titre *</Label>

              <Input
                type="text"
                placeholder="Ex : Ensemble premium"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />
            </Field>

            <Field>
              <Label>Prix *</Label>

              <Input
                type="number"
                min="0"
                placeholder="Ex : 25000"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            </Field>
          </Grid>

          <Field>
            <Label>Description *</Label>

            <Textarea
              placeholder="Description du modèle..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </Field>

          <Grid>
            <Field>
              <Label>
                Montant du dépôt
              </Label>

              <Input
                type="number"
                min="0"
                placeholder="Ex : 10000"
                value={montantDepot}
                onChange={(e) =>
                  setMontantDepot(e.target.value)
                }
              />

              <small>
                Si laissé vide, le backend utilisera
                son calcul par défaut.
              </small>
            </Field>

            <Field>
              <Label>
                Date de disponibilité
              </Label>

              <Input
                type="date"
                value={dateDisponibilite}
                onChange={(e) =>
                  setDateDisponibilite(
                    e.target.value,
                  )
                }
              />
            </Field>
          </Grid>

          <Grid>
            <Field>
              <Label>Genre</Label>

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
            </Field>

            <Field>
              <Label>Catégorie</Label>

              <Select
                value={categorie}
                onChange={(e) =>
                  setCategorie(e.target.value)
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
            </Field>
          </Grid>

          <Grid>
            <Field>
              <Label>Badge</Label>

              <Select
                value={badge}
                onChange={(e) =>
                  setBadge(e.target.value)
                }
              >
                <option value="">
                  Aucun
                </option>

                <option value="new">
                  New
                </option>

                <option value="promo">
                  Promo
                </option>
              </Select>
            </Field>

            <Field>
              <Label>
                Précommande
              </Label>

              <CheckBoxRow>
                <CheckBox
                  type="checkbox"
                  checked={precommande}
                  onChange={(e) =>
                    setPrecommande(
                      e.target.checked,
                    )
                  }
                />

                <span>
                  Disponible en précommande
                </span>
              </CheckBoxRow>
            </Field>
          </Grid>

          <Grid>
            <Field>
              <Label>
                Couleurs
              </Label>

              <Input
                type="text"
                placeholder="Noir, Blanc, Rouge"
                value={colors.join(", ")}
                onChange={(e) =>
                  handleColorsChange(
                    e.target.value,
                  )
                }
              />
            </Field>

            <Field>
              <Label>
                Tailles
              </Label>

              <Input
                type="text"
                placeholder="S, M, L, XL"
                value={sizes.join(", ")}
                onChange={(e) =>
                  handleSizesChange(
                    e.target.value,
                  )
                }
              />
            </Field>
          </Grid>

          {/* ============================================
              DÉTAILS
          ============================================ */}

          <SectionTitle>
            Détails du modèle
          </SectionTitle>

          <Grid>
            <Field>
              <Label>Matière</Label>

              <Input
                type="text"
                value={details.matiere}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    matiere: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <Label>Poids</Label>

              <Input
                type="text"
                value={details.poids}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    poids: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <Label>Coupe</Label>

              <Input
                type="text"
                value={details.coupe}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    coupe: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <Label>Saison</Label>

              <Input
                type="text"
                value={details.saison}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    saison: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <Label>Entretien</Label>

              <Input
                type="text"
                value={details.entretien}
                onChange={(e) =>
                  setDetails((prev) => ({
                    ...prev,
                    entretien: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <Label>
                Pays de fabrication
              </Label>

              <Input
                type="text"
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
            </Field>
          </Grid>

          {/* ============================================
              IMAGES
          ============================================ */}

          <SectionTitle>
            Photos du modèle
          </SectionTitle>

          <Field>
            <Label>
              Ajouter des photos
            </Label>

            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />
          </Field>

          {existingImages.length > 0 && (
            <>
              <Label>
                Photos existantes
              </Label>

              <PreviewContainer>
                {existingImages.map(
                  (image, index) => (
                    <ImageWrapper
                      key={
                        image.publicId ||
                        `${image.url}-${index}`
                      }
                    >
                      <PreviewImage
                        src={image.url}
                        alt={title}
                        $main={
                          index ===
                          mainImageIndex
                        }
                        onClick={() =>
                          setMainImageIndex(
                            index,
                          )
                        }
                      />

                      <DeleteImageButton
                        type="button"
                        onClick={() =>
                          handleDeleteExistingImage(
                            image.publicId,
                            index,
                          )
                        }
                      >
                        ×
                      </DeleteImageButton>

                      {index ===
                        mainImageIndex && (
                        <MainBadge>
                          PRINCIPALE
                        </MainBadge>
                      )}
                    </ImageWrapper>
                  ),
                )}
              </PreviewContainer>
            </>
          )}

          {newImages.length > 0 && (
            <>
              <Label>
                Nouvelles photos
              </Label>

              <PreviewContainer>
                {newImages.map(
                  (image, index) => {
                    const globalIndex =
                      existingImages.length +
                      index;

                    return (
                      <ImageWrapper
                        key={`${image.name}-${index}`}
                      >
                        <PreviewImage
                          src={image.preview}
                          alt="Nouvelle"
                          $main={
                            globalIndex ===
                            mainImageIndex
                          }
                          onClick={() =>
                            setMainImageIndex(
                              globalIndex,
                            )
                          }
                        />

                        <DeleteImageButton
                          type="button"
                          onClick={() =>
                            handleDeleteNewImage(
                              index,
                            )
                          }
                        >
                          ×
                        </DeleteImageButton>

                        {globalIndex ===
                          mainImageIndex && (
                          <MainBadge>
                            PRINCIPALE
                          </MainBadge>
                        )}
                      </ImageWrapper>
                    );
                  },
                )}
              </PreviewContainer>
            </>
          )}

          <small>
            Clique sur une photo pour la définir
            comme photo principale.
          </small>

          {/* ============================================
              VIDÉO
          ============================================ */}

          <SectionTitle>
            Vidéo du modèle
          </SectionTitle>

          {existingVideo && (
            <div>
              <Label>
                Vidéo actuellement associée
              </Label>

              <VideoPreview
                controls
                src={existingVideo.url}
              />

              <ButtonRow>
                <Button
                  type="button"
                  $danger
                  onClick={
                    deleteExistingVideo
                  }
                >
                  Supprimer la vidéo
                </Button>
              </ButtonRow>
            </div>
          )}

          <Field>
            <Label>
              {existingVideo
                ? "Remplacer par une nouvelle vidéo"
                : "Ajouter une vidéo"}
            </Label>

            <Input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
            />
          </Field>

          {newVideo && (
            <div>
              <VideoPreview
                controls
                src={newVideo.preview}
              />

              <Button
                type="button"
                $danger
                onClick={removeNewVideo}
                style={{
                  marginTop: "10px",
                }}
              >
                Retirer cette vidéo
              </Button>
            </div>
          )}

          {(newVideo || existingVideo) && (
            <Grid>
              <Field>
                <Label>
                  Titre de la vidéo
                </Label>

                <Input
                  type="text"
                  placeholder="Titre de la vidéo"
                  value={videoTitle}
                  onChange={(e) =>
                    setVideoTitle(
                      e.target.value,
                    )
                  }
                />
              </Field>

              <Field>
                <Label>
                  Description de la vidéo
                </Label>

                <Input
                  type="text"
                  placeholder="Description"
                  value={videoDescription}
                  onChange={(e) =>
                    setVideoDescription(
                      e.target.value,
                    )
                  }
                />
              </Field>
            </Grid>
          )}

          {/* ============================================
              BOUTONS
          ============================================ */}

          <ButtonRow>
            <Button
              type="submit"
              disabled={
                loading || videoUploading
              }
            >
              {loading || videoUploading
                ? "Enregistrement..."
                : editingProductId
                  ? "Modifier le modèle"
                  : "Créer le modèle"}
            </Button>

            {editingProductId && (
              <Button
                type="button"
                $secondary
                onClick={resetForm}
                disabled={loading}
              >
                Annuler
              </Button>
            )}
          </ButtonRow>
        </Form>
      </Section>

      {/* ==================================================
          LISTE DES MODÈLES
      ================================================== */}

      <Section>
        <SectionTitle>
          Modèles de précommande
        </SectionTitle>

        {productsLoading ? (
          <Loading>
            Chargement des modèles...
          </Loading>
        ) : products.length === 0 ? (
          <Loading>
            Aucun produit enregistré.
          </Loading>
        ) : (
          <ProductGrid>
            {products.map((product) => {
              const image =
                product.images?.find(
                  (item) => item.isMain,
                )?.url ||
                product.images?.[0]?.url ||
                "";

              return (
                <ProductCard
                  key={product._id}
                >
                  {image ? (
                    <ProductCardImage
                      src={image}
                      alt={product.title}
                    />
                  ) : (
                    <div
                      style={{
                        height: "260px",
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      Aucune image
                    </div>
                  )}

                  <ProductCardBody>
                    <Badge
                      $active={
                        product.precommande
                      }
                    >
                      {product.precommande
                        ? "PRÉCOMMANDE ACTIVE"
                        : "PRÉCOMMANDE INACTIVE"}
                    </Badge>

                    <ProductCardTitle>
                      {product.title}
                    </ProductCardTitle>

                    <ProductDescription>
                      {product.description}
                    </ProductDescription>

                    <Price>
                      {formatPrice(
                        product.price,
                      )}
                    </Price>

                    <Deposit>
                      Dépôt :{" "}
                      {product.montantDepot !==
                        null &&
                      product.montantDepot !==
                        undefined
                        ? formatPrice(
                            product.montantDepot,
                          )
                        : "Calcul automatique"}
                    </Deposit>

                    <Availability>
                      Disponibilité :{" "}
                      {formatDate(
                        product.dateDisponibilite,
                      )}
                    </Availability>

                    {product.couleurs?.length >
                      0 && (
                      <Tags>
                        {product.couleurs.map(
                          (color) => (
                            <Tag key={color}>
                              {color}
                            </Tag>
                          ),
                        )}
                      </Tags>
                    )}

                    {product.tailles?.length >
                      0 && (
                      <Tags>
                        {product.tailles.map(
                          (size) => (
                            <Tag key={size}>
                              {size}
                            </Tag>
                          ),
                        )}
                      </Tags>
                    )}

                    <ButtonRow>
                      <Button
                        type="button"
                        onClick={() =>
                          handleEditProduct(
                            product,
                          )
                        }
                      >
                        Modifier
                      </Button>

                      <Button
                        type="button"
                        $danger
                        onClick={() =>
                          handleDeleteProduct(
                            product._id,
                          )
                        }
                      >
                        Supprimer
                      </Button>
                    </ButtonRow>
                  </ProductCardBody>
                </ProductCard>
              );
            })}
          </ProductGrid>
        )}
      </Section>
    </Container>
  );
}

export default AdminPrecommandes;