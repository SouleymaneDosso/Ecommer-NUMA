import React, { useEffect, useState } from "react";
import styled from "styled-components";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPrecommandes = () => {
  const token = localStorage.getItem("adminToken");

  const [produits, setProduits] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    montantDepot: "",
    dateDisponibilite: "",
    genre: "homme",
    categorie: "haut",
    badge: "",
    precommande: true,
    hero: false,
    details: "",
  });

  const [tailles, setTailles] = useState([]);
  const [couleurs, setCouleurs] = useState([]);

  const [nouvelleTaille, setNouvelleTaille] = useState("");
  const [nouvelleCouleur, setNouvelleCouleur] = useState("");

  const [stockParVariation, setStockParVariation] = useState({});

  const [imagesExistantes, setImagesExistantes] = useState([]);
  const [nouvellesImages, setNouvellesImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [videoFile, setVideoFile] = useState(null);
  const [videoActuelle, setVideoActuelle] = useState(null);

  /* =========================
     CHARGER LES PRODUITS
  ========================= */

  const chargerProduits = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/produits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du chargement");
      }

      const liste =
        data.produits ||
        data.products ||
        data ||
        [];

      setProduits(Array.isArray(liste) ? liste : []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CHARGER LES VIDEOS
  ========================= */

  const chargerVideos = async () => {
    try {
      setLoadingVideos(true);

      const response = await fetch(`${API_URL}/api/videos/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du chargement des vidéos");
      }

      setVideos(data.videos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    chargerProduits();
    chargerVideos();
  }, []);

  /* =========================
     FORM
  ========================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     TAILLES
  ========================= */

  const ajouterTaille = () => {
    const taille = nouvelleTaille.trim();

    if (!taille) return;

    const existe = tailles.some(
      (item) => item.toLowerCase() === taille.toLowerCase()
    );

    if (existe) {
      setNouvelleTaille("");
      return;
    }

    setTailles((prev) => [...prev, taille]);

    setStockParVariation((prev) => ({
      ...prev,
      [taille]: {
        ...(prev[taille] || {}),
      },
    }));

    setNouvelleTaille("");
  };

  const supprimerTaille = (taille) => {
    setTailles((prev) => prev.filter((item) => item !== taille));

    setStockParVariation((prev) => {
      const nouveau = { ...prev };
      delete nouveau[taille];
      return nouveau;
    });
  };

  /* =========================
     COULEURS
  ========================= */

  const ajouterCouleur = () => {
    const couleur = nouvelleCouleur.trim();

    if (!couleur) return;

    const existe = couleurs.some(
      (item) => item.toLowerCase() === couleur.toLowerCase()
    );

    if (existe) {
      setNouvelleCouleur("");
      return;
    }

    setCouleurs((prev) => [...prev, couleur]);

    setStockParVariation((prev) => {
      const nouveau = { ...prev };

      tailles.forEach((taille) => {
        nouveau[taille] = {
          ...(nouveau[taille] || {}),
          [couleur]: nouveau[taille]?.[couleur] ?? 0,
        };
      });

      return nouveau;
    });

    setNouvelleCouleur("");
  };

  const supprimerCouleur = (couleur) => {
    setCouleurs((prev) => prev.filter((item) => item !== couleur));

    setStockParVariation((prev) => {
      const nouveau = { ...prev };

      Object.keys(nouveau).forEach((taille) => {
        if (nouveau[taille]) {
          const variations = { ...nouveau[taille] };
          delete variations[couleur];

          nouveau[taille] = variations;
        }
      });

      return nouveau;
    });
  };

  /* =========================
     QUANTITE VARIATION
  ========================= */

  const modifierQuantiteVariation = (
    taille,
    couleur,
    valeur
  ) => {
    const quantite = Math.max(0, Number(valeur) || 0);

    setStockParVariation((prev) => ({
      ...prev,
      [taille]: {
        ...(prev[taille] || {}),
        [couleur]: quantite,
      },
    }));
  };

  const modifierQuantiteTaille = (taille, valeur) => {
    const quantite = Math.max(0, Number(valeur) || 0);

    setStockParVariation((prev) => ({
      ...prev,
      [taille]: {
        ...(prev[taille] || {}),
        general: quantite,
      },
    }));
  };

  /* =========================
     STOCK TOTAL
  ========================= */

  const calculerStockTotal = () => {
    let total = 0;

    Object.values(stockParVariation).forEach((variations) => {
      Object.values(variations || {}).forEach((quantite) => {
        total += Number(quantite) || 0;
      });
    });

    return total;
  };

  /* =========================
     IMAGES
  ========================= */

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    setNouvellesImages((prev) => [...prev, ...files]);
  };

  const supprimerNouvelleImage = (index) => {
    setNouvellesImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const supprimerImageExistante = (index) => {
    setImagesExistantes((prev) =>
      prev.filter((_, i) => i !== index)
    );

    if (mainImageIndex >= index) {
      setMainImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  /* =========================
     VIDEO
  ========================= */

  const trouverVideoProduit = (produit) => {
    if (!produit) return null;

    if (produit.videoId) {
      const videoId =
        typeof produit.videoId === "object"
          ? produit.videoId._id
          : produit.videoId;

      const videoParId = videos.find(
        (video) => video._id === videoId
      );

      if (videoParId) return videoParId;
    }

    const videoParProduit = videos.find((video) => {
      const produitId =
        typeof video.produitId === "object"
          ? video.produitId?._id
          : video.produitId;

      return produitId === produit._id;
    });

    return videoParProduit || null;
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setVideoFile(file);
    }
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      price: "",
      montantDepot: "",
      dateDisponibilite: "",
      genre: "homme",
      categorie: "haut",
      badge: "",
      precommande: true,
      hero: false,
      details: "",
    });

    setTailles([]);
    setCouleurs([]);

    setNouvelleTaille("");
    setNouvelleCouleur("");

    setStockParVariation({});

    setImagesExistantes([]);
    setNouvellesImages([]);
    setMainImageIndex(0);

    setVideoFile(null);
    setVideoActuelle(null);
  };

  /* =========================
     EDITER
  ========================= */

  const modifierProduit = (produit) => {
    setEditingId(produit._id);

    setForm({
      title: produit.title || "",
      description: produit.description || "",
      price: produit.price ?? "",
      montantDepot: produit.montantDepot ?? "",
      dateDisponibilite: produit.dateDisponibilite
        ? new Date(produit.dateDisponibilite)
            .toISOString()
            .split("T")[0]
        : "",
      genre: produit.genre || "homme",
      categorie: produit.categorie || "haut",
      badge: produit.badge || "",
      precommande: produit.precommande ?? false,
      hero: produit.hero ?? false,
      details: produit.details
        ? Object.entries(produit.details)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : "",
    });

    setTailles(produit.tailles || []);
    setCouleurs(produit.couleurs || []);

    /* Conversion Map -> objet */
    let variations = produit.stockParVariation || {};

    if (
      variations &&
      typeof variations.toJSON === "function"
    ) {
      variations = variations.toJSON();
    }

    if (variations instanceof Map) {
      variations = Object.fromEntries(variations);
    }

    const variationsNormalisees = {};

    Object.entries(variations || {}).forEach(
      ([taille, valeurs]) => {
        if (valeurs instanceof Map) {
          variationsNormalisees[taille] =
            Object.fromEntries(valeurs);
        } else {
          variationsNormalisees[taille] = {
            ...(valeurs || {}),
          };
        }
      }
    );

    setStockParVariation(variationsNormalisees);

    setImagesExistantes(produit.images || []);
    setNouvellesImages([]);

    const imagePrincipaleIndex = (
      produit.images || []
    ).findIndex((image) => image.isMain);

    setMainImageIndex(
      imagePrincipaleIndex >= 0
        ? imagePrincipaleIndex
        : 0
    );

    const video = trouverVideoProduit(produit);

    setVideoActuelle(video);
    setVideoFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DETAILS
  ========================= */

  const convertirDetails = () => {
    const details = {};

    if (!form.details.trim()) {
      return details;
    }

    form.details
      .split("\n")
      .map((ligne) => ligne.trim())
      .filter(Boolean)
      .forEach((ligne) => {
        const index = ligne.indexOf(":");

        if (index !== -1) {
          const key = ligne
            .slice(0, index)
            .trim();

          const value = ligne
            .slice(index + 1)
            .trim();

          if (key) {
            details[key] = value;
          }
        }
      });

    return details;
  };

  /* =========================
     CONSTRUIRE FORMDATA
  ========================= */

  const construireFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append(
      "description",
      form.description.trim()
    );

    formData.append(
      "price",
      String(Number(form.price) || 0)
    );

    formData.append(
      "montantDepot",
      form.montantDepot === ""
        ? ""
        : String(Number(form.montantDepot) || 0)
    );

    if (form.dateDisponibilite) {
      formData.append(
        "dateDisponibilite",
        form.dateDisponibilite
      );
    }

    formData.append("genre", form.genre);
    formData.append("categorie", form.categorie);

    if (form.badge) {
      formData.append("badge", form.badge);
    }

    formData.append(
      "precommande",
      String(form.precommande)
    );

    formData.append(
      "hero",
      String(form.hero)
    );

    formData.append(
      "tailles",
      JSON.stringify(tailles)
    );

    formData.append(
      "couleurs",
      JSON.stringify(couleurs)
    );

    formData.append(
      "stockParVariation",
      JSON.stringify(stockParVariation)
    );

    formData.append(
      "stock",
      String(calculerStockTotal())
    );

    formData.append(
      "details",
      JSON.stringify(convertirDetails())
    );

    nouvellesImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append(
      "imagesExistantes",
      JSON.stringify(imagesExistantes)
    );

    formData.append(
      "mainImageIndex",
      String(mainImageIndex)
    );

    return formData;
  };

  /* =========================
     ENREGISTRER
  ========================= */

  const enregistrerProduit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Le titre est requis.");
      return;
    }

    if (!form.description.trim()) {
      alert("La description est requise.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Le prix doit être supérieur à 0.");
      return;
    }

    if (tailles.length === 0) {
      alert("Ajoute au moins une taille.");
      return;
    }

    if (
      couleurs.length > 0 &&
      tailles.length > 0
    ) {
      const stockTotal = calculerStockTotal();

      if (stockTotal <= 0) {
        alert(
          "Ajoute au moins une quantité dans les variations."
        );
        return;
      }
    }

    try {
      setLoading(true);

      const formData = construireFormData();

      const url = editingId
        ? `${API_URL}/api/produits/${editingId}`
        : `${API_URL}/api/produits`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de l'enregistrement"
        );
      }

      const produitEnregistre =
        data.produit ||
        data.product ||
        data;

      const produitId =
        produitEnregistre?._id ||
        editingId;

      /* =========================
         VIDEO
      ========================= */

      if (videoFile && produitId) {
        const videoFormData = new FormData();

        videoFormData.append(
          "video",
          videoFile
        );

        videoFormData.append(
          "produitId",
          produitId
        );

        videoFormData.append(
          "title",
          form.title.trim()
        );

        videoFormData.append(
          "description",
          form.description.trim()
        );

        const videoResponse = await fetch(
          `${API_URL}/api/videos/upload-produit`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: videoFormData,
          }
        );

        const videoData =
          await videoResponse.json();

        if (!videoResponse.ok) {
          throw new Error(
            videoData.message ||
              "Le produit a été enregistré mais la vidéo n'a pas pu être envoyée."
          );
        }
      }

      alert(
        editingId
          ? "Modèle de précommande modifié avec succès."
          : "Modèle de précommande créé avec succès."
      );

      resetForm();

      await chargerProduits();
      await chargerVideos();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUPPRIMER VIDEO
  ========================= */

  const supprimerVideo = async (video) => {
    if (!video?._id) return;

    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer cette vidéo ?"
    );

    if (!confirmer) return;

    try {
      const response = await fetch(
        `${API_URL}/api/videos/videos/${video._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la suppression"
        );
      }

      setVideoActuelle(null);

      if (editingId) {
        setProduits((prev) =>
          prev.map((produit) =>
            produit._id === editingId
              ? {
                  ...produit,
                  videoId: null,
                }
              : produit
          )
        );
      }

      await chargerVideos();

      alert("Vidéo supprimée.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /* =========================
     SUPPRIMER PRODUIT
  ========================= */

  const supprimerProduit = async (id) => {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer ce modèle ?"
    );

    if (!confirmer) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/produits/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la suppression"
        );
      }

      if (editingId === id) {
        resetForm();
      }

      await chargerProduits();

      alert("Modèle supprimé avec succès.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     TOTAL PAR TAILLE
  ========================= */

  const totalParTaille = (taille) => {
    return couleurs.length > 0
      ? couleurs.reduce(
          (total, couleur) =>
            total +
            (Number(
              stockParVariation?.[taille]?.[
                couleur
              ]
            ) || 0),
          0
        )
      : Number(
          stockParVariation?.[taille]?.general
        ) || 0;
  };

  return (
    <Container>
      <Title>
        Gestion des modèles de précommande
      </Title>

      <Subtitle>
        Crée les modèles disponibles à la
        précommande et configure leurs tailles,
        couleurs et quantités.
      </Subtitle>

      {/* =========================
          FORMULAIRE
      ========================= */}

      <FormCard>
        <FormTitle>
          {editingId
            ? "Modifier le modèle"
            : "Ajouter un modèle de précommande"}
        </FormTitle>

        <Form onSubmit={enregistrerProduit}>
          <Field>
            <Label>Titre du modèle</Label>

            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Ensemble premium"
            />
          </Field>

          <Field>
            <Label>Description</Label>

            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description du modèle..."
              rows="5"
            />
          </Field>

          <Grid>
            <Field>
              <Label>Prix</Label>

              <Input
                type="number"
                min="0"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ex: 25000"
              />
            </Field>

            <Field>
              <Label>
                Montant du dépôt
              </Label>

              <Input
                type="number"
                min="0"
                name="montantDepot"
                value={form.montantDepot}
                onChange={handleChange}
                placeholder="Ex: 10000"
              />

              <HelpText>
                Si vide, le backend peut utiliser
                son montant par défaut.
              </HelpText>
            </Field>
          </Grid>

          <Grid>
            <Field>
              <Label>
                Date de disponibilité
              </Label>

              <Input
                type="date"
                name="dateDisponibilite"
                value={form.dateDisponibilite}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label>Genre</Label>

              <Select
                name="genre"
                value={form.genre}
                onChange={handleChange}
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
          </Grid>

          <Grid>
            <Field>
              <Label>Catégorie</Label>

              <Select
                name="categorie"
                value={form.categorie}
                onChange={handleChange}
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

            <Field>
              <Label>Badge</Label>

              <Select
                name="badge"
                value={form.badge}
                onChange={handleChange}
              >
                <option value="">
                  Aucun badge
                </option>

                <option value="new">
                  Nouveau
                </option>

                <option value="promo">
                  Promo
                </option>
              </Select>
            </Field>
          </Grid>

          {/* =========================
              TAILLES
          ========================= */}

          <VariationSection>
            <VariationTitle>
              1. Tailles disponibles
            </VariationTitle>

            <VariationAddRow>
              <VariationInput
                type="text"
                placeholder="Ex: S, M, L, XL"
                value={nouvelleTaille}
                onChange={(e) =>
                  setNouvelleTaille(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    ajouterTaille();
                  }
                }}
              />

              <VariationAddButton
                type="button"
                onClick={ajouterTaille}
              >
                + Ajouter
              </VariationAddButton>
            </VariationAddRow>

            <VariationList>
              {tailles.map((taille) => (
                <VariationTag key={taille}>
                  <span>{taille}</span>

                  <button
                    type="button"
                    onClick={() =>
                      supprimerTaille(
                        taille
                      )
                    }
                  >
                    ×
                  </button>
                </VariationTag>
              ))}
            </VariationList>

            {tailles.length === 0 && (
              <EmptyVariation>
                Aucune taille ajoutée.
              </EmptyVariation>
            )}
          </VariationSection>

          {/* =========================
              COULEURS
          ========================= */}

          <VariationSection>
            <VariationTitle>
              2. Couleurs disponibles
            </VariationTitle>

            <VariationAddRow>
              <VariationInput
                type="text"
                placeholder="Ex: Noir, Blanc, Rouge"
                value={nouvelleCouleur}
                onChange={(e) =>
                  setNouvelleCouleur(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    ajouterCouleur();
                  }
                }}
              />

              <VariationAddButton
                type="button"
                onClick={ajouterCouleur}
              >
                + Ajouter
              </VariationAddButton>
            </VariationAddRow>

            <VariationList>
              {couleurs.map((couleur) => (
                <VariationTag key={couleur}>
                  <span>{couleur}</span>

                  <button
                    type="button"
                    onClick={() =>
                      supprimerCouleur(
                        couleur
                      )
                    }
                  >
                    ×
                  </button>
                </VariationTag>
              ))}
            </VariationList>

            {couleurs.length === 0 && (
              <EmptyVariation>
                Aucune couleur ajoutée. Si le
                modèle n'a pas de couleur,
                les quantités seront gérées
                uniquement par taille.
              </EmptyVariation>
            )}
          </VariationSection>

          {/* =========================
              TABLEAU TAILLE x COULEUR
          ========================= */}

          {tailles.length > 0 &&
            couleurs.length > 0 && (
              <VariationSection>
                <VariationHeader>
                  <div>
                    <VariationTitle>
                      3. Quantités par variation
                    </VariationTitle>

                    <VariationDescription>
                      Indique combien d'articles
                      sont disponibles pour
                      chaque combinaison taille
                      + couleur.
                    </VariationDescription>
                  </div>

                  <StockTotal>
                    Stock total
                    <strong>
                      {calculerStockTotal()}
                    </strong>
                  </StockTotal>
                </VariationHeader>

                <VariationTableWrapper>
                  <VariationTable>
                    <thead>
                      <tr>
                        <th>Taille</th>

                        {couleurs.map(
                          (couleur) => (
                            <th key={couleur}>
                              {couleur}
                            </th>
                          )
                        )}

                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tailles.map(
                        (taille) => (
                          <tr key={taille}>
                            <td>
                              <SizeCell>
                                {taille}
                              </SizeCell>
                            </td>

                            {couleurs.map(
                              (couleur) => (
                                <td
                                  key={
                                    couleur
                                  }
                                >
                                  <QuantityInput
                                    type="number"
                                    min="0"
                                    value={
                                      stockParVariation?.[
                                        taille
                                      ]?.[
                                        couleur
                                      ] ?? 0
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      modifierQuantiteVariation(
                                        taille,
                                        couleur,
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                  />
                                </td>
                              )
                            )}

                            <td>
                              <TotalCell>
                                {totalParTaille(
                                  taille
                                )}
                              </TotalCell>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </VariationTable>
                </VariationTableWrapper>
              </VariationSection>
            )}

          {/* =========================
              QUANTITE PAR TAILLE
          ========================= */}

          {tailles.length > 0 &&
            couleurs.length === 0 && (
              <VariationSection>
                <VariationHeader>
                  <div>
                    <VariationTitle>
                      3. Quantités par taille
                    </VariationTitle>

                    <VariationDescription>
                      Ce modèle n'a pas de
                      couleur. Indique simplement
                      la quantité disponible pour
                      chaque taille.
                    </VariationDescription>
                  </div>

                  <StockTotal>
                    Stock total
                    <strong>
                      {calculerStockTotal()}
                    </strong>
                  </StockTotal>
                </VariationHeader>

                <SimpleStockList>
                  {tailles.map((taille) => (
                    <SimpleStockRow
                      key={taille}
                    >
                      <SizeCell>
                        Taille {taille}
                      </SizeCell>

                      <QuantityInput
                        type="number"
                        min="0"
                        value={
                          stockParVariation?.[
                            taille
                          ]?.general ?? 0
                        }
                        onChange={(e) =>
                          modifierQuantiteTaille(
                            taille,
                            e.target.value
                          )
                        }
                      />
                    </SimpleStockRow>
                  ))}
                </SimpleStockList>
              </VariationSection>
            )}

          {/* =========================
              IMAGES
          ========================= */}

          <VariationSection>
            <VariationTitle>
              Photos du modèle
            </VariationTitle>

            <Field>
              <Label>
                Ajouter plusieurs photos
              </Label>

              <FileInput
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
              />
            </Field>

            {imagesExistantes.length > 0 && (
              <>
                <SmallTitle>
                  Photos actuelles
                </SmallTitle>

                <ImageGrid>
                  {imagesExistantes.map(
                    (image, index) => (
                      <ImageItem
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                      >
                        <PreviewImage
                          src={image.url}
                          alt={`Image ${
                            index + 1
                          }`}
                        />

                        <ImageActions>
                          <MainButton
                            type="button"
                            $active={
                              mainImageIndex ===
                              index
                            }
                            onClick={() =>
                              setMainImageIndex(
                                index
                              )
                            }
                          >
                            {mainImageIndex ===
                            index
                              ? "★ Principale"
                              : "☆ Principale"}
                          </MainButton>

                          <DeleteSmallButton
                            type="button"
                            onClick={() =>
                              supprimerImageExistante(
                                index
                              )
                            }
                          >
                            Supprimer
                          </DeleteSmallButton>
                        </ImageActions>
                      </ImageItem>
                    )
                  )}
                </ImageGrid>
              </>
            )}

            {nouvellesImages.length > 0 && (
              <>
                <SmallTitle>
                  Nouvelles photos
                </SmallTitle>

                <ImageGrid>
                  {nouvellesImages.map(
                    (file, index) => (
                      <ImageItem
                        key={`${file.name}-${index}`}
                      >
                        <NewImagePreview
                          src={URL.createObjectURL(
                            file
                          )}
                          alt={file.name}
                        />

                        <ImageActions>
                          <MainButton
                            type="button"
                            $active={
                              mainImageIndex ===
                              imagesExistantes.length +
                                index
                            }
                            onClick={() =>
                              setMainImageIndex(
                                imagesExistantes.length +
                                  index
                              )
                            }
                          >
                            {mainImageIndex ===
                            imagesExistantes.length +
                              index
                              ? "★ Principale"
                              : "☆ Principale"}
                          </MainButton>

                          <DeleteSmallButton
                            type="button"
                            onClick={() =>
                              supprimerNouvelleImage(
                                index
                              )
                            }
                          >
                            Supprimer
                          </DeleteSmallButton>
                        </ImageActions>
                      </ImageItem>
                    )
                  )}
                </ImageGrid>
              </>
            )}
          </VariationSection>

          {/* =========================
              VIDEO
          ========================= */}

          <VariationSection>
            <VariationTitle>
              Vidéo du modèle
            </VariationTitle>

            {videoActuelle && (
              <CurrentVideoBox>
                <video
                  src={videoActuelle.url}
                  controls
                  width="100%"
                />

                <VideoInfo>
                  <span>
                    Vidéo actuelle
                  </span>

                  <DeleteVideoButton
                    type="button"
                    onClick={() =>
                      supprimerVideo(
                        videoActuelle
                      )
                    }
                  >
                    Supprimer la vidéo
                  </DeleteVideoButton>
                </VideoInfo>
              </CurrentVideoBox>
            )}

            <Field>
              <Label>
                {videoActuelle
                  ? "Remplacer la vidéo"
                  : "Ajouter une vidéo"}
              </Label>

              <FileInput
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />

              {videoFile && (
                <SelectedFile>
                  Vidéo sélectionnée :{" "}
                  <strong>
                    {videoFile.name}
                  </strong>
                </SelectedFile>
              )}
            </Field>
          </VariationSection>

          {/* =========================
              DETAILS
          ========================= */}

          <Field>
            <Label>
              Détails supplémentaires
            </Label>

            <Textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder={`matiere: Coton
coupe: Regular
origine: Côte d'Ivoire`}
              rows="5"
            />

            <HelpText>
              Une ligne par détail au format :
              clé: valeur
            </HelpText>
          </Field>

          {/* =========================
              OPTIONS
          ========================= */}

          <OptionsBox>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="precommande"
                checked={form.precommande}
                onChange={handleChange}
              />

              <span>
                Activer la précommande
              </span>
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                name="hero"
                checked={form.hero}
                onChange={handleChange}
              />

              <span>
                Afficher comme modèle Hero
              </span>
            </CheckboxLabel>
          </OptionsBox>

          {/* =========================
              BOUTONS
          ========================= */}

          <ButtonsRow>
            <SubmitButton
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Enregistrement..."
                : editingId
                ? "Modifier le modèle"
                : "Créer le modèle"}
            </SubmitButton>

            {editingId && (
              <CancelButton
                type="button"
                onClick={resetForm}
              >
                Annuler
              </CancelButton>
            )}
          </ButtonsRow>
        </Form>
      </FormCard>

      {/* =========================
          LISTE DES PRODUITS
      ========================= */}

      <ListHeader>
        <div>
          <ListTitle>
            Modèles disponibles
          </ListTitle>

          <ListDescription>
            {produits.length} modèle
            {produits.length > 1 ? "s" : ""}
          </ListDescription>
        </div>
      </ListHeader>

      {loading && produits.length === 0 ? (
        <Loading>
          Chargement des modèles...
        </Loading>
      ) : produits.length === 0 ? (
        <Empty>
          Aucun modèle pour le moment.
        </Empty>
      ) : (
        <ProductGrid>
          {produits.map((produit) => {
            const imagePrincipale =
              produit.images?.find(
                (image) => image.isMain
              ) ||
              produit.images?.[0];

            const video = trouverVideoProduit(
              produit
            );

            let variations =
              produit.stockParVariation ||
              {};

            if (variations instanceof Map) {
              variations =
                Object.fromEntries(
                  variations
                );
            }

            const stockTotal = Object.values(
              variations || {}
            ).reduce(
              (total, valeurs) => {
                if (
                  valeurs instanceof Map
                ) {
                  valeurs =
                    Object.fromEntries(
                      valeurs
                    );
                }

                return (
                  total +
                  Object.values(
                    valeurs || {}
                  ).reduce(
                    (somme, quantite) =>
                      somme +
                      (Number(
                        quantite
                      ) || 0),
                    0
                  )
                );
              },
              0
            );

            return (
              <ProductCard
                key={produit._id}
              >
                {imagePrincipale?.url ? (
                  <CardImage
                    src={imagePrincipale.url}
                    alt={produit.title}
                  />
                ) : (
                  <NoImage>
                    Aucune image
                  </NoImage>
                )}

                <CardContent>
                  <StatusRow>
                    <StatusBadge
                      $active={
                        produit.precommande
                      }
                    >
                      {produit.precommande
                        ? "Précommande active"
                        : "Précommande inactive"}
                    </StatusBadge>

                    {video && (
                      <VideoBadge>
                        🎥 Vidéo
                      </VideoBadge>
                    )}
                  </StatusRow>

                  <CardTitle>
                    {produit.title}
                  </CardTitle>

                  <CardDescription>
                    {produit.description}
                  </CardDescription>

                  <Price>
                    {Number(
                      produit.price || 0
                    ).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    FCFA
                  </Price>

                  <InfoList>
                    <InfoItem>
                      <strong>
                        Dépôt :
                      </strong>{" "}
                      {produit.montantDepot
                        ? `${Number(
                            produit.montantDepot
                          ).toLocaleString(
                            "fr-FR"
                          )} FCFA`
                        : "Par défaut"}
                    </InfoItem>

                    <InfoItem>
                      <strong>
                        Stock :
                      </strong>{" "}
                      {stockTotal}
                    </InfoItem>

                    {produit.dateDisponibilite && (
                      <InfoItem>
                        <strong>
                          Disponible :
                        </strong>{" "}
                        {new Date(
                          produit.dateDisponibilite
                        ).toLocaleDateString(
                          "fr-FR"
                        )}
                      </InfoItem>
                    )}

                    <InfoItem>
                      <strong>
                        Tailles :
                      </strong>{" "}
                      {produit.tailles?.length
                        ? produit.tailles.join(
                            ", "
                          )
                        : "Aucune"}
                    </InfoItem>

                    <InfoItem>
                      <strong>
                        Couleurs :
                      </strong>{" "}
                      {produit.couleurs?.length
                        ? produit.couleurs.join(
                            ", "
                          )
                        : "Aucune"}
                    </InfoItem>
                  </InfoList>

                  <CardActions>
                    <EditButton
                      type="button"
                      onClick={() =>
                        modifierProduit(
                          produit
                        )
                      }
                    >
                      Modifier
                    </EditButton>

                    <DeleteButton
                      type="button"
                      onClick={() =>
                        supprimerProduit(
                          produit._id
                        )
                      }
                    >
                      Supprimer
                    </DeleteButton>
                  </CardActions>
                </CardContent>
              </ProductCard>
            );
          })}
        </ProductGrid>
      )}
    </Container>
  );
};

/* =====================================================
   STYLES
===================================================== */

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: #f9fafb;
  min-height: 100vh;

  @media (max-width: 700px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2c3e50;
  font-size: 32px;
`;

const Subtitle = styled.p`
  margin: 10px 0 30px;
  color: #6b7280;
  font-size: 15px;
`;

const FormCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
  margin-bottom: 40px;

  @media (max-width: 700px) {
    padding: 20px;
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 25px;
  color: #2c3e50;
  font-size: 23px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #3498db;
  }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const HelpText = styled.small`
  color: #6b7280;
  font-size: 12px;
`;

const VariationSection = styled.div`
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const VariationTitle = styled.h3`
  margin: 0 0 8px;
  color: #2c3e50;
  font-size: 18px;
`;

const VariationDescription = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 13px;
`;

const VariationAddRow = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const VariationInput = styled.input`
  flex: 1;
  padding: 11px 13px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

const VariationAddButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #2980b9;
  }
`;

const VariationList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const VariationTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 14px;

  button {
    border: none;
    background: transparent;
    color: #e74c3c;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
`;

const EmptyVariation = styled.div`
  color: #9ca3af;
  font-size: 13px;
`;

const VariationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StockTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: 10px 15px;
  background: white;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  color: #6b7280;
  font-size: 12px;

  strong {
    margin-top: 3px;
    color: #2563eb;
    font-size: 20px;
  }
`;

const VariationTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const VariationTable = styled.table`
  width: 100%;
  min-width: 550px;
  border-collapse: collapse;
  background: white;

  th,
  td {
    padding: 12px;
    border: 1px solid #e5e7eb;
    text-align: center;
  }

  th {
    background: #f1f5f9;
    color: #374151;
    font-weight: 600;
    font-size: 13px;
  }

  td:first-child {
    text-align: left;
  }
`;

const QuantityInput = styled.input`
  width: 75px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SizeCell = styled.strong`
  color: #2c3e50;
`;

const TotalCell = styled.strong`
  color: #2563eb;
`;

const SimpleStockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SimpleStockRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const FileInput = styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(180px, 1fr)
  );
  gap: 15px;
  margin-top: 15px;
`;

const ImageItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const NewImagePreview = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const ImageActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 10px;
`;

const MainButton = styled.button`
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  background: ${(props) =>
    props.$active ? "#f1c40f" : "#eef2f7"};
  color: ${(props) =>
    props.$active ? "#5d4a00" : "#374151"};
  font-size: 12px;
  font-weight: 600;
`;

const DeleteSmallButton = styled.button`
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  background: #fee2e2;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
`;

const SmallTitle = styled.h4`
  margin: 20px 0 5px;
  color: #374151;
`;

const CurrentVideoBox = styled.div`
  max-width: 500px;
  margin-bottom: 20px;

  video {
    display: block;
    width: 100%;
    max-height: 350px;
    border-radius: 10px;
    background: #111;
  }
`;

const VideoInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  font-size: 13px;
`;

const DeleteVideoButton = styled.button`
  border: none;
  background: #fee2e2;
  color: #dc2626;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
`;

const SelectedFile = styled.div`
  padding: 10px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 7px;
  font-size: 13px;
`;

const OptionsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  color: #374151;
  font-size: 14px;

  input {
    width: 17px;
    height: 17px;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 5px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  padding: 13px 22px;
  border: none;
  border-radius: 8px;
  background: #3498db;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 13px 22px;
  border: none;
  border-radius: 8px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ListTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
`;

const ListDescription = styled.p`
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 14px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(280px, 1fr)
  );
  gap: 20px;
`;

const ProductCard = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
`;

const CardImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const NoImage = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
`;

const CardContent = styled.div`
  padding: 18px;
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 10px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 8px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 700;
  background: ${(props) =>
    props.$active ? "#dcfce7" : "#f3f4f6"};
  color: ${(props) =>
    props.$active ? "#15803d" : "#6b7280"};
`;

const VideoBadge = styled.span`
  display: inline-block;
  padding: 5px 8px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 700;
  background: #ede9fe;
  color: #6d28d9;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px;
  color: #2c3e50;
  font-size: 19px;
`;

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  min-height: 40px;
`;

const Price = styled.div`
  margin: 12px 0;
  color: #2563eb;
  font-size: 19px;
  font-weight: 700;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoItem = styled.div`
  color: #6b7280;
  font-size: 13px;

  strong {
    color: #374151;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 18px;
`;

const EditButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 7px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #2980b9;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 7px;
  background: #fee2e2;
  color: #dc2626;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #fecaca;
  }
`;

const Loading = styled.div`
  padding: 40px;
  text-align: center;
  color: #6b7280;
`;

const Empty = styled.div`
  padding: 50px;
  text-align: center;
  background: white;
  border-radius: 12px;
  color: #6b7280;
`;

export default AdminPrecommandes;