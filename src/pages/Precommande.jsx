import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  Check,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Video as VideoIcon,
  Images,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Precommande = () => {
  const [modeles, setModeles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCommande, setLoadingCommande] = useState(false);

  const [modeleSelectionne, setModeleSelectionne] = useState(null);

  const [tailleSelectionnee, setTailleSelectionnee] = useState("");
  const [couleurSelectionnee, setCouleurSelectionnee] = useState("");
  const [quantite, setQuantite] = useState(1);

  const [service, setService] = useState("");
  const [numeroDepot, setNumeroDepot] = useState("");
  const [referenceDepot, setReferenceDepot] = useState("");

  const [mediaIndex, setMediaIndex] = useState(0);

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const [informationsDepot, setInformationsDepot] = useState(null);
  const [loadingDepot, setLoadingDepot] = useState(true);

  /* =========================================================
     MODAL MÉDIA
  ========================================================= */

  const [mediaModalOuvert, setMediaModalOuvert] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [numero, setNumero] = useState("");

  const codePostal = "00225";
  const pays = "Côte d'Ivoire";

  /* =========================================================
     VIDÉOS
  ========================================================= */

  // Vidéo dans la modale
  const videoRef = useRef(null);

  // Vidéo de l'aperçu principal
  const previewVideoRef = useRef(null);

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [previewVideoPlaying, setPreviewVideoPlaying] = useState(false);

  const [videoMuted, setVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  /* =========================================================
     TOKEN
  ========================================================= */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("clientToken") ||
      localStorage.getItem("userToken")
    );
  };

  /* =========================================================
     INFOS DEPOT
  ========================================================= */

  const chargerInformationsDepot = async () => {
    try {
      setLoadingDepot(true);

      const token = getToken();

      const response = await fetch(`${API_URL}/api/precommandes/depot`, {
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de récupérer les informations de dépôt.",
        );
      }

      setInformationsDepot(data);
    } catch (error) {
      console.error("INFOS DEPOT :", error);

      setErreur(error.message || "Impossible de récupérer le numéro de dépôt.");
    } finally {
      setLoadingDepot(false);
    }
  };

  const chargerModeles = async () => {
    try {
      setLoading(true);
      setErreur("");

      const response = await fetch(`${API_URL}/api/precommandes/modeles`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de récupérer les modèles.");
      }

      setModeles(data.modeles || []);
    } catch (error) {
      console.error("CHARGEMENT MODÈLES :", error);

      setErreur(
        error.message ||
          "Une erreur est survenue lors du chargement des modèles.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerModeles();
    chargerInformationsDepot();
  }, []);

  /* =========================================================
     OUVRIR UN MODÈLE
  ========================================================= */

  const ouvrirModele = (modele) => {
    setModeleSelectionne(modele);
    setMediaIndex(0);

    setTailleSelectionnee(modele.tailles?.[0] || "");
    setCouleurSelectionnee(modele.couleurs?.[0] || "");

    setQuantite(1);

    setService("");
    setNumeroDepot("");
    setReferenceDepot("");

    setMessage("");
    setErreur("");

    setMediaModalOuvert(false);

    setPreviewVideoPlaying(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  /* =========================================================
     FERMER LE MODÈLE
  ========================================================= */

  const fermerModele = () => {
    setModeleSelectionne(null);
    setMediaModalOuvert(false);

    setMessage("");
    setErreur("");

    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
    }

    if (videoRef.current) {
      videoRef.current.pause();
    }

    setPreviewVideoPlaying(false);
    setVideoPlaying(false);
  };

  /* =========================================================
     MÉDIAS
  ========================================================= */

  const medias = useMemo(() => {
    if (!modeleSelectionne) return [];

    const liste = [];

    /* -------------------------
       IMAGE PRINCIPALE
    ------------------------- */

    if (typeof modeleSelectionne.image === "string") {
      if (modeleSelectionne.image.trim()) {
        liste.push({
          type: "image",
          url: modeleSelectionne.image,
          isMain: true,
        });
      }
    }

    /* -------------------------
       GALERIE
    ------------------------- */

    if (Array.isArray(modeleSelectionne.images)) {
      modeleSelectionne.images.forEach((image) => {
        let url = "";

        if (typeof image === "string") {
          url = image;
        }

        if (typeof image === "object" && image !== null) {
          url = image.url || image.secure_url || image.src || image.path || "";
        }

        if (!url) return;

        const dejaPresente = liste.some((media) => media.url === url);

        if (!dejaPresente) {
          liste.push({
            type: "image",
            url,
            isMain: Boolean(image?.isMain),
          });
        }
      });
    }

    /* -------------------------
       VIDÉO
    ------------------------- */

    const video = modeleSelectionne.video;

    if (typeof video === "string") {
      if (video.trim()) {
        liste.push({
          type: "video",
          url: video,
          thumbnail: "",
          title: "Vidéo du modèle",
        });
      }
    }

    if (typeof video === "object" && video !== null) {
      const videoUrl = video.url || video.secure_url || video.video || "";

      const videoThumbnail = video.thumbnail || video.poster || "";

      if (videoUrl) {
        liste.push({
          type: "video",
          url: videoUrl,
          thumbnail: videoThumbnail,
          title: video.title || "Vidéo du modèle",
        });
      }
    }

    return liste;
  }, [modeleSelectionne]);

  const mediaActuel = medias[mediaIndex];

  /* =========================================================
     FERMER LE MODAL AVEC ESC + NAVIGATION CLAVIER
  ========================================================= */

  useEffect(() => {
    if (!mediaModalOuvert) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMediaModalOuvert(false);
      }

      if (event.key === "ArrowRight" && medias.length > 1) {
        setMediaIndex((current) => (current + 1) % medias.length);
      }

      if (event.key === "ArrowLeft" && medias.length > 1) {
        setMediaIndex(
          (current) => (current - 1 + medias.length) % medias.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mediaModalOuvert, medias.length]);

  /* =========================================================
     BLOQUER LE SCROLL QUAND LE MODAL EST OUVERT
  ========================================================= */

  useEffect(() => {
    if (!mediaModalOuvert) return;

    const ancienneValeur = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = ancienneValeur;
    };
  }, [mediaModalOuvert]);

  /* =========================================================
     RESET VIDÉOS QUAND LE MÉDIA CHANGE
  ========================================================= */

  useEffect(() => {
    setVideoPlaying(false);
    setVideoProgress(0);
    setVideoDuration(0);
    setVideoCurrentTime(0);
    setVideoMuted(false);
    setPreviewVideoPlaying(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  }, [mediaIndex]);

  /* =========================================================
     STOCK
  ========================================================= */

  const trouverStockDansObjet = (objet, cle) => {
    if (!objet || typeof objet !== "object") {
      return null;
    }

    if (Object.prototype.hasOwnProperty.call(objet, cle)) {
      return objet[cle];
    }

    const cleLower = String(cle || "")
      .trim()
      .toLowerCase();

    const cleTrouvee = Object.keys(objet).find(
      (key) => String(key).trim().toLowerCase() === cleLower,
    );

    if (cleTrouvee !== undefined) {
      return objet[cleTrouvee];
    }

    return null;
  };

  const getStockVariation = () => {
    if (!modeleSelectionne) {
      return 0;
    }

    const stockParVariation = modeleSelectionne.stockParVariation;

    /* ---------------------------------------------------------
       CAS 1 : COULEUR + TAILLE
    --------------------------------------------------------- */

    if (couleurSelectionnee && tailleSelectionnee) {
      const variationCouleur = trouverStockDansObjet(
        stockParVariation,
        couleurSelectionnee,
      );

      if (variationCouleur && typeof variationCouleur === "object") {
        const stock = trouverStockDansObjet(
          variationCouleur,
          tailleSelectionnee,
        );

        if (stock !== null && stock !== undefined) {
          const nombre = Number(stock);

          return Number.isFinite(nombre) ? Math.max(0, nombre) : 0;
        }
      }
    }

    /* ---------------------------------------------------------
       CAS 2 : TAILLE + COULEUR INVERSÉ
    --------------------------------------------------------- */

    if (tailleSelectionnee && couleurSelectionnee) {
      const variationTaille = trouverStockDansObjet(
        stockParVariation,
        tailleSelectionnee,
      );

      if (variationTaille && typeof variationTaille === "object") {
        const ancienStock = trouverStockDansObjet(
          variationTaille,
          couleurSelectionnee,
        );

        if (ancienStock !== null && ancienStock !== undefined) {
          const nombre = Number(ancienStock);

          return Number.isFinite(nombre) ? Math.max(0, nombre) : 0;
        }
      }
    }

    /* ---------------------------------------------------------
       CAS 3 : PRODUIT SANS COULEUR
    --------------------------------------------------------- */

    if (tailleSelectionnee && !couleurSelectionnee) {
      const stockGlobal = Number(modeleSelectionne.stock);

      if (Number.isFinite(stockGlobal)) {
        return Math.max(0, stockGlobal);
      }
    }

    /* ---------------------------------------------------------
       CAS 4 : STOCK GLOBAL
    --------------------------------------------------------- */

    const stockGlobal = Number(modeleSelectionne.stock);

    if (Number.isFinite(stockGlobal)) {
      return Math.max(0, stockGlobal);
    }

    return 0;
  };

  const stockDisponible = getStockVariation();

  /* =========================================================
     PRIX
  ========================================================= */

  const prix = Number(modeleSelectionne?.price || 0);

  const montantDepotUnitaire = Number(
    modeleSelectionne?.montantDepot || Math.ceil(prix * 0.3),
  );

  const montantDepotTotal = montantDepotUnitaire * quantite;

  /* =========================================================
     CHANGEMENT TAILLE
  ========================================================= */

  const changerTaille = (taille) => {
    setTailleSelectionnee(taille);
    setQuantite(1);
    setErreur("");
  };

  /* =========================================================
     CHANGEMENT COULEUR
  ========================================================= */

  const changerCouleur = (couleur) => {
    setCouleurSelectionnee(couleur);
    setQuantite(1);
    setErreur("");
  };

  /* =========================================================
     QUANTITÉ
  ========================================================= */

  const diminuerQuantite = () => {
    setQuantite((ancienne) => Math.max(1, ancienne - 1));
  };

  const augmenterQuantite = () => {
    if (stockDisponible <= 0) {
      return;
    }

    setQuantite((ancienne) => Math.min(stockDisponible, ancienne + 1));
  };

  /* =========================================================
     VIDÉO PRINCIPALE
  ========================================================= */

  const togglePreviewVideo = async () => {
    const video = previewVideoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("LECTURE VIDÉO APERÇU :", error);
    }
  };

  const handlePreviewPlay = () => {
    setPreviewVideoPlaying(true);
  };

  const handlePreviewPause = () => {
    setPreviewVideoPlaying(false);
  };

  const handlePreviewEnded = () => {
    setPreviewVideoPlaying(false);
  };

  /* =========================================================
     VIDÉO MODALE
  ========================================================= */

  const toggleVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("LECTURE VIDÉO :", error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;

    setVideoMuted(video.muted);
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) return;

    const current = video.currentTime || 0;
    const duration = video.duration || 0;

    setVideoCurrentTime(current);

    if (duration > 0) {
      setVideoProgress((current / duration) * 100);
    }
  };

  const handleVideoLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setVideoDuration(video.duration || 0);
  };

  const handleVideoEnded = () => {
    setVideoPlaying(false);
    setVideoProgress(100);
  };

  const handleVideoSeek = (event) => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    const valeur = Number(event.target.value);

    video.currentTime = (valeur / 100) * video.duration;

    setVideoProgress(valeur);
  };

  const formatVideoTime = (secondes) => {
    if (!Number.isFinite(secondes)) {
      return "00:00";
    }

    const minutes = Math.floor(secondes / 60);

    const seconds = Math.floor(secondes % 60);

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const passerPleinEcran = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    } catch (error) {
      console.error("PLEIN ÉCRAN :", error);
    }
  };

  /* =========================================================
     NAVIGATION MÉDIA
  ========================================================= */

  const mediaPrecedent = (event) => {
    event?.stopPropagation();

    if (medias.length <= 1) return;

    setMediaIndex((current) => (current - 1 + medias.length) % medias.length);
  };

  const mediaSuivant = (event) => {
    event?.stopPropagation();

    if (medias.length <= 1) return;

    setMediaIndex((current) => (current + 1) % medias.length);
  };

  const ouvrirMedia = (index = mediaIndex) => {
    setMediaIndex(index);
    setMediaModalOuvert(true);
  };

  /* =========================================================
     PRÉCOMMANDE
  ========================================================= */

  const envoyerPrecommande = async (e) => {
    e.preventDefault();

    if (!nom.trim() || !prenom.trim() || !adresse.trim() || !ville.trim()) {
      setErreur("Veuillez remplir toutes vos informations de livraison.");
      return;
    }

    if (!numero.trim() || !numero.startsWith("+225")) {
      setErreur(
        "Veuillez entrer un numéro de téléphone valide au format +225XXXXXXXX.",
      );
      return;
    }

    setMessage("");
    setErreur("");

    if (!modeleSelectionne) {
      setErreur("Veuillez sélectionner un modèle.");
      return;
    }

    if (!tailleSelectionnee && modeleSelectionne.tailles?.length > 0) {
      setErreur("Veuillez sélectionner une taille.");
      return;
    }

    if (!couleurSelectionnee && modeleSelectionne.couleurs?.length > 0) {
      setErreur("Veuillez sélectionner une couleur.");
      return;
    }

    if (stockDisponible <= 0) {
      setErreur("Cette variation n'est actuellement plus disponible.");
      return;
    }

    if (quantite < 1) {
      setErreur("La quantité doit être au moins égale à 1.");
      return;
    }

    if (quantite > stockDisponible) {
      setErreur(
        `Il ne reste que ${stockDisponible} article(s) pour cette variation.`,
      );
      return;
    }

    if (!service) {
      setErreur("Veuillez choisir un moyen de paiement.");
      return;
    }

    if (!numeroDepot.trim()) {
      setErreur("Veuillez renseigner le numéro utilisé pour le dépôt.");
      return;
    }

    if (!referenceDepot.trim()) {
      setErreur("Veuillez renseigner la référence du dépôt.");
      return;
    }

    if (!informationsDepot?.numeroDepot) {
      setErreur("Le numéro de dépôt est momentanément indisponible.");
      return;
    }

    try {
      setLoadingCommande(true);

      const token = getToken();

      const body = {
        produitId: modeleSelectionne._id,

        client: {
          nom: nom.trim(),
          prenom: prenom.trim(),
          adresse: adresse.trim(),
          ville: ville.trim(),
          codePostal,
          pays,
          numero: numero.trim(),
        },

        service,
        numeroDepot: numeroDepot.trim(),
        referenceDepot: referenceDepot.trim(),
        taille: tailleSelectionnee || null,
        couleur: couleurSelectionnee || null,
        quantite,
      };

      const response = await fetch(`${API_URL}/api/precommandes`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible d'enregistrer la précommande.",
        );
      }

      setMessage(
        "Votre précommande a été envoyée avec succès. Elle sera vérifiée par notre équipe.",
      );

      setService("");
      setNumeroDepot("");
      setReferenceDepot("");
      setQuantite(1);

      await chargerModeles();
    } catch (error) {
      console.error("ERREUR PRÉCOMMANDE :", error);

      setErreur(
        error.message ||
          "Une erreur est survenue lors de l'envoi de la précommande.",
      );
    } finally {
      setLoadingCommande(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Chargement des précommandes...</LoadingText>
      </LoadingContainer>
    );
  }

  /* =========================================================
     ERREUR GLOBALE
  ========================================================= */

  if (erreur && !modeleSelectionne && modeles.length === 0) {
    return (
      <PageContainer>
        <ErrorBox>{erreur}</ErrorBox>

        <RetryButton type="button" onClick={chargerModeles}>
          Réessayer
        </RetryButton>
      </PageContainer>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <PageContainer>
      <Header>
        <SmallTitle>COLLECTION NUMA</SmallTitle>

        <MainTitle>Précommandes</MainTitle>

        <Subtitle>
          Découvrez nos modèles disponibles en précommande et choisissez votre
          taille, votre couleur et votre quantité.
        </Subtitle>
      </Header>

      {message && (
        <SuccessBox>
          <SuccessIcon>
            <Check size={15} />
          </SuccessIcon>

          <div>{message}</div>
        </SuccessBox>
      )}

      {erreur && !modeleSelectionne && <ErrorBox>{erreur}</ErrorBox>}

      {/* =====================================================
          LISTE DES MODÈLES
      ===================================================== */}

      {!modeleSelectionne && (
        <ModelesGrid>
          {modeles.length === 0 ? (
            <EmptyBox>
              <EmptyIcon>
                <PackageCheck size={42} />
              </EmptyIcon>

              <h3>Aucune précommande disponible</h3>

              <p>Aucun modèle n'est actuellement disponible en précommande.</p>
            </EmptyBox>
          ) : (
            modeles.map((modele) => {
              const image =
                modele.images?.find(
                  (img) => typeof img === "object" && img?.isMain && img?.url,
                )?.url ||
                modele.images?.find(
                  (img) => typeof img === "object" && img?.url,
                )?.url ||
                (typeof modele.image === "string" ? modele.image : "");

              const stockGlobal = Number(modele.stock || 0);

              return (
                <ModelCard key={modele._id}>
                  <CardImageContainer>
                    {image ? (
                      <CardImage
                        src={image}
                        alt={modele.title}
                        loading="lazy"
                      />
                    ) : (
                      <NoImage>Aucune image</NoImage>
                    )}

                    <PrecommandeBadge>PRÉCOMMANDE</PrecommandeBadge>

                    {modele.video && (
                      <VideoCardBadge>
                        <VideoIcon size={13} strokeWidth={2.2} />
                        Vidéo
                      </VideoCardBadge>
                    )}
                  </CardImageContainer>

                  <CardContent>
                    <CardTitle>{modele.title}</CardTitle>

                    <CardDescription>
                      {modele.description ||
                        "Découvrez ce modèle en précommande."}
                    </CardDescription>

                    <CardInfo>
                      <Price>
                        {Number(modele.price || 0).toLocaleString("fr-FR")} FCFA
                      </Price>

                      <Deposit>
                        Dépôt :{" "}
                        {Number(
                          modele.montantDepot ||
                            Math.ceil(Number(modele.price || 0) * 0.3),
                        ).toLocaleString("fr-FR")}{" "}
                        FCFA
                      </Deposit>
                    </CardInfo>

                    {modele.dateDisponibilite && (
                      <Availability>
                        Disponible à partir du{" "}
                        {new Date(modele.dateDisponibilite).toLocaleDateString(
                          "fr-FR",
                        )}
                      </Availability>
                    )}

                    <VariationSummary>
                      {modele.tailles?.length > 0 && (
                        <VariationLine>
                          <VariationLabel>Tailles</VariationLabel>

                          <VariationValues>
                            {modele.tailles.join(" • ")}
                          </VariationValues>
                        </VariationLine>
                      )}

                      {modele.couleurs?.length > 0 && (
                        <VariationLine>
                          <VariationLabel>Couleurs</VariationLabel>

                          <VariationValues>
                            {modele.couleurs.join(" • ")}
                          </VariationValues>
                        </VariationLine>
                      )}

                      <StockMini>
                        <StockMiniDot
                          $available={
                            stockGlobal > 0 ||
                            Object.keys(modele.stockParVariation || {}).length >
                              0
                          }
                        />
                        Stock disponible
                      </StockMini>
                    </VariationSummary>

                    <ActionButton
                      type="button"
                      onClick={() => ouvrirModele(modele)}
                    >
                      Voir le modèle
                      <ArrowRight size={17} strokeWidth={2.4} />
                    </ActionButton>
                  </CardContent>
                </ModelCard>
              );
            })
          )}
        </ModelesGrid>
      )}

      {/* =====================================================
          DÉTAIL MODÈLE
      ===================================================== */}

      {modeleSelectionne && (
        <DetailContainer>
          <BackButton type="button" onClick={fermerModele}>
            <ArrowLeft size={17} />
            Retour aux modèles
          </BackButton>

          <DetailGrid>
            {/* =================================================
                MÉDIA
            ================================================= */}

            <MediaSection>
              <MediaContainer>
                {medias.length > 0 ? (
                  <>
                    {mediaActuel?.type === "video" ? (
                      <PreviewVideoWrapper>
                        <VideoPreview
                          ref={previewVideoRef}
                          key={mediaActuel.url}
                          src={mediaActuel.url}
                          poster={mediaActuel.thumbnail || undefined}
                          muted
                          playsInline
                          preload="metadata"
                          onPlay={handlePreviewPlay}
                          onPause={handlePreviewPause}
                          onEnded={handlePreviewEnded}
                          onClick={() => ouvrirMedia(mediaIndex)}
                        />

                        {/* PLAY / PAUSE SUR LA VIDÉO PRINCIPALE */}
                        <PreviewVideoPlayButton
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            togglePreviewVideo();
                          }}
                          aria-label={
                            previewVideoPlaying
                              ? "Mettre la vidéo en pause"
                              : "Lire la vidéo"
                          }
                        >
                          {previewVideoPlaying ? (
                            <Pause size={21} strokeWidth={2.3} />
                          ) : (
                            <Play
                              size={21}
                              strokeWidth={2.3}
                              fill="currentColor"
                            />
                          )}
                        </PreviewVideoPlayButton>

                        <PreviewVideoLabel>
                          <VideoIcon size={13} strokeWidth={2} />
                          VIDÉO
                        </PreviewVideoLabel>
                      </PreviewVideoWrapper>
                    ) : (
                      <MainImage
                        src={mediaActuel?.url}
                        alt={modeleSelectionne.title}
                        onClick={() => ouvrirMedia(mediaIndex)}
                      />
                    )}

                    <MediaExpandButton
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        ouvrirMedia(mediaIndex);
                      }}
                      aria-label="Agrandir le média"
                    >
                      <Maximize2 size={18} strokeWidth={2.2} />
                    </MediaExpandButton>

                    {medias.length > 1 && (
                      <>
                        <MediaArrow
                          type="button"
                          $left
                          onClick={mediaPrecedent}
                          aria-label="Média précédent"
                        >
                          <ChevronLeft size={23} strokeWidth={2} />
                        </MediaArrow>

                        <MediaArrow
                          type="button"
                          onClick={mediaSuivant}
                          aria-label="Média suivant"
                        >
                          <ChevronRight size={23} strokeWidth={2} />
                        </MediaArrow>
                      </>
                    )}

                    {medias.length > 1 && (
                      <DotsContainer>
                        {medias.map((media, index) => (
                          <Dot
                            key={`${media.url}-${index}`}
                            type="button"
                            $active={mediaIndex === index}
                            $video={media.type === "video"}
                            onClick={() => setMediaIndex(index)}
                            aria-label={
                              media.type === "video"
                                ? "Afficher la vidéo"
                                : `Afficher la photo ${index + 1}`
                            }
                          >
                            {media.type === "video" ? (
                              <Play
                                size={10}
                                fill="currentColor"
                                strokeWidth={2.5}
                              />
                            ) : null}
                          </Dot>
                        ))}
                      </DotsContainer>
                    )}
                  </>
                ) : (
                  <NoImage>Aucune image disponible</NoImage>
                )}
              </MediaContainer>

              {medias.length > 0 && (
                <MediaDescription>
                  <MediaCurrent>
                    {mediaActuel?.type === "video" ? (
                      <>
                        <VideoIcon size={13} />
                        Vidéo du modèle
                      </>
                    ) : (
                      <>
                        <Images size={13} />
                        Photo {mediaIndex + 1} / {medias.length}
                      </>
                    )}
                  </MediaCurrent>

                  <MediaHint>Cliquez sur le média pour l'agrandir</MediaHint>
                </MediaDescription>
              )}
            </MediaSection>

            {/* =================================================
                INFORMATIONS + FORMULAIRE
            ================================================= */}

            <InformationSection>
              <PrecommandeLabel>PRÉCOMMANDE</PrecommandeLabel>

              <DetailTitle>{modeleSelectionne.title}</DetailTitle>

              <DetailDescription>
                {modeleSelectionne.description ||
                  "Découvrez ce modèle en précommande."}
              </DetailDescription>

              <PriceBlock>
                <CurrentPrice>{prix.toLocaleString("fr-FR")} FCFA</CurrentPrice>

                <DepositText>
                  Dépôt par article :{" "}
                  {montantDepotUnitaire.toLocaleString("fr-FR")} FCFA
                </DepositText>
              </PriceBlock>

              {modeleSelectionne.dateDisponibilite && (
                <DateBox>
                  <DateIcon>
                    <CalendarDays size={18} />
                  </DateIcon>

                  <div>
                    <DateLabel>DISPONIBILITÉ</DateLabel>

                    <DateValue>
                      {new Date(
                        modeleSelectionne.dateDisponibilite,
                      ).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </DateValue>
                  </div>
                </DateBox>
              )}

              {/* =================================================
                  TAILLES
              ================================================= */}

              {modeleSelectionne.tailles?.length > 0 && (
                <FieldGroup>
                  <FieldLabel>Taille</FieldLabel>

                  <ChoiceGrid>
                    {modeleSelectionne.tailles.map((taille) => (
                      <ChoiceButton
                        type="button"
                        key={taille}
                        $active={tailleSelectionnee === taille}
                        onClick={() => changerTaille(taille)}
                      >
                        {taille}

                        {tailleSelectionnee === taille && <Check size={14} />}
                      </ChoiceButton>
                    ))}
                  </ChoiceGrid>
                </FieldGroup>
              )}

              {/* =================================================
                  COULEURS
              ================================================= */}

              {modeleSelectionne.couleurs?.length > 0 && (
                <FieldGroup>
                  <FieldLabel>Couleur</FieldLabel>

                  <ChoiceGrid>
                    {modeleSelectionne.couleurs.map((couleur) => (
                      <ChoiceButton
                        type="button"
                        key={couleur}
                        $active={couleurSelectionnee === couleur}
                        onClick={() => changerCouleur(couleur)}
                      >
                        <ColorCircle />

                        {couleur}

                        {couleurSelectionnee === couleur && <Check size={14} />}
                      </ChoiceButton>
                    ))}
                  </ChoiceGrid>
                </FieldGroup>
              )}

              {/* =================================================
                  STOCK
              ================================================= */}

              <StockCard $available={stockDisponible > 0}>
                <StockTop>
                  <div>
                    <StockLabel>STOCK DISPONIBLE</StockLabel>

                    <StockVariationName>
                      {couleurSelectionnee || tailleSelectionnee
                        ? "Pour votre sélection"
                        : "Stock actuel"}
                    </StockVariationName>
                  </div>

                  <StockNumber $available={stockDisponible > 0}>
                    {stockDisponible}
                  </StockNumber>
                </StockTop>

                {tailleSelectionnee || couleurSelectionnee ? (
                  <StockVariation>
                    <StockVariationItem>
                      {couleurSelectionnee && (
                        <span>
                          Couleur
                          <strong>{couleurSelectionnee}</strong>
                        </span>
                      )}

                      {tailleSelectionnee && (
                        <span>
                          Taille
                          <strong>{tailleSelectionnee}</strong>
                        </span>
                      )}
                    </StockVariationItem>
                  </StockVariation>
                ) : (
                  <StockVariation>
                    Sélectionnez une variation pour voir son stock.
                  </StockVariation>
                )}

                {stockDisponible > 0 ? (
                  <StockAvailableText>
                    <Check size={13} />
                    Cette variation peut être précommandée
                  </StockAvailableText>
                ) : (
                  <StockUnavailableText>
                    Cette variation n'est plus disponible.
                  </StockUnavailableText>
                )}
              </StockCard>

              {/* =================================================
                  QUANTITÉ
              ================================================= */}

              <FieldGroup>
                <FieldLabel>Quantité</FieldLabel>

                <QuantityContainer>
                  <QuantityButton
                    type="button"
                    onClick={diminuerQuantite}
                    disabled={quantite <= 1}
                  >
                    −
                  </QuantityButton>

                  <QuantityValue>{quantite}</QuantityValue>

                  <QuantityButton
                    type="button"
                    onClick={augmenterQuantite}
                    disabled={
                      stockDisponible <= 0 || quantite >= stockDisponible
                    }
                  >
                    +
                  </QuantityButton>
                </QuantityContainer>

                {stockDisponible > 0 && (
                  <QuantityHint>
                    Maximum : {stockDisponible} article
                    {stockDisponible > 1 ? "s" : ""}
                  </QuantityHint>
                )}
              </FieldGroup>

              {/* =================================================
                  RÉCAPITULATIF
              ================================================= */}

              <SummaryBox>
                <SummaryRow>
                  <span>Prix unitaire</span>

                  <strong>{prix.toLocaleString("fr-FR")} FCFA</strong>
                </SummaryRow>

                <SummaryRow>
                  <span>Quantité</span>

                  <strong>{quantite}</strong>
                </SummaryRow>

                <SummaryRow>
                  <span>Dépôt unitaire</span>

                  <strong>
                    {montantDepotUnitaire.toLocaleString("fr-FR")} FCFA
                  </strong>
                </SummaryRow>

                <SummaryTotal>
                  <span>Total du dépôt</span>

                  <strong>
                    {montantDepotTotal.toLocaleString("fr-FR")} FCFA
                  </strong>
                </SummaryTotal>
              </SummaryBox>

              {/* =================================================
                  FORMULAIRE
              ================================================= */}

              <Form onSubmit={envoyerPrecommande}>
                <FormTitle>Informations de livraison</FormTitle>

                <FieldGroup>
                  <FieldLabel htmlFor="nom">Nom</FieldLabel>

                  <Input
                    id="nom"
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="prenom">Prénom</FieldLabel>

                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="adresse">Adresse</FieldLabel>

                  <Input
                    id="adresse"
                    type="text"
                    placeholder="Votre adresse de livraison"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="ville">Ville</FieldLabel>

                  <Input
                    id="ville"
                    type="text"
                    placeholder="Votre ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="numero">Numéro de téléphone</FieldLabel>

                  <Input
                    id="numero"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+225XXXXXXXX"
                    value={numero}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (!value.startsWith("+225")) {
                        value = "+225" + value.replace(/^\+?225\s*/, "");
                      }

                      setNumero(value);
                    }}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="codePostal">Code postal</FieldLabel>

                  <Input id="codePostal" value={codePostal} disabled />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="pays">Pays</FieldLabel>

                  <Input id="pays" value={pays} disabled />
                </FieldGroup>

                <FormTitle>Informations du dépôt</FormTitle>

                <DepotInfoBox>
                  <DepotInfoHeader>
                    <DepotInfoIcon>
                      <CreditCard size={17} />
                    </DepotInfoIcon>

                    <div>
                      <DepotInfoTitle>Effectuez votre dépôt</DepotInfoTitle>

                      <DepotInfoText>
                        Envoyez le montant du dépôt sur le numéro indiqué
                        ci-dessous.
                      </DepotInfoText>
                    </div>
                  </DepotInfoHeader>

                  {loadingDepot ? (
                    <DepotLoading>
                      <MiniSpinner />
                      Chargement du numéro de dépôt...
                    </DepotLoading>
                  ) : informationsDepot?.numeroDepot ? (
                    <DepotNumber>{informationsDepot.numeroDepot}</DepotNumber>
                  ) : (
                    <DepotError>
                      Le numéro de dépôt est momentanément indisponible.
                    </DepotError>
                  )}

                  {informationsDepot?.services?.length > 0 && (
                    <SupportedServices>
                      Moyens acceptés :{" "}
                      {informationsDepot.services
                        .map((item) =>
                          item === "orange"
                            ? "Orange Money"
                            : item === "wave"
                              ? "Wave"
                              : item,
                        )
                        .join(" • ")}
                    </SupportedServices>
                  )}

                  <DepotWarning>
                    Après avoir effectué le dépôt, renseignez le numéro utilisé
                    pour effectuer le paiement ainsi que la référence de la
                    transaction.
                  </DepotWarning>
                </DepotInfoBox>

                <FieldGroup>
                  <FieldLabel>Moyen de paiement</FieldLabel>

                  <PaymentGrid>
                    <PaymentButton
                      type="button"
                      $active={service === "orange"}
                      onClick={() => setService("orange")}
                    >
                      <PaymentLogo>OM</PaymentLogo>

                      <div>
                        <PaymentName>Orange Money</PaymentName>

                        <PaymentSmall>Paiement mobile</PaymentSmall>
                      </div>

                      {service === "orange" && (
                        <PaymentCheck>
                          <Check size={11} />
                        </PaymentCheck>
                      )}
                    </PaymentButton>

                    <PaymentButton
                      type="button"
                      $active={service === "wave"}
                      onClick={() => setService("wave")}
                    >
                      <PaymentLogo>W</PaymentLogo>

                      <div>
                        <PaymentName>Wave</PaymentName>

                        <PaymentSmall>Paiement mobile</PaymentSmall>
                      </div>

                      {service === "wave" && (
                        <PaymentCheck>
                          <Check size={11} />
                        </PaymentCheck>
                      )}
                    </PaymentButton>
                  </PaymentGrid>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="numeroDepot">
                    Numéro utilisé pour le dépôt
                  </FieldLabel>

                  <Input
                    id="numeroDepot"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Ex : 07 XX XX XX XX"
                    value={numeroDepot}
                    onChange={(e) => setNumeroDepot(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="referenceDepot">
                    Référence du dépôt
                  </FieldLabel>

                  <Input
                    id="referenceDepot"
                    type="text"
                    placeholder="Entrez la référence de votre dépôt"
                    value={referenceDepot}
                    onChange={(e) => setReferenceDepot(e.target.value)}
                  />
                </FieldGroup>

                {erreur && <FormError>{erreur}</FormError>}

                {message && <FormSuccess>{message}</FormSuccess>}

                <SubmitButton
                  type="submit"
                  disabled={loadingCommande || stockDisponible <= 0}
                >
                  {loadingCommande ? (
                    <>
                      <ButtonSpinner />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Confirmer la précommande
                      <ArrowRight size={17} />
                    </>
                  )}
                </SubmitButton>

                <SecurityText>
                  <ShieldCheck size={13} />
                  Votre précommande sera vérifiée par notre équipe avant
                  validation définitive.
                </SecurityText>
              </Form>
            </InformationSection>
          </DetailGrid>
        </DetailContainer>
      )}

      {/* =====================================================
          MODAL PHOTO / VIDÉO
      ===================================================== */}

      {mediaModalOuvert && mediaActuel && (
        <MediaModal
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse média"
          onClick={() => setMediaModalOuvert(false)}
        >
          <ModalTopBar onClick={(e) => e.stopPropagation()}>
            <ModalCounter>
              {mediaIndex + 1} / {medias.length}
            </ModalCounter>

            <ModalTitle>
              {mediaActuel.type === "video"
                ? mediaActuel.title || "Vidéo du modèle"
                : modeleSelectionne.title}
            </ModalTitle>

            <ModalCloseButton
              type="button"
              onClick={() => setMediaModalOuvert(false)}
              aria-label="Fermer"
            >
              <X size={22} strokeWidth={2} />
            </ModalCloseButton>
          </ModalTopBar>

          <ModalContent onClick={(e) => e.stopPropagation()}>
            {mediaActuel.type === "video" ? (
              <CustomVideoPlayer>
                <ModalVideo
                  ref={videoRef}
                  src={mediaActuel.url}
                  poster={mediaActuel.thumbnail || undefined}
                  playsInline
                  preload="metadata"
                  muted={videoMuted}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                  onEnded={handleVideoEnded}
                  onClick={toggleVideo}
                />

                <VideoOverlayPlay
                  type="button"
                  $visible={!videoPlaying}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleVideo();
                  }}
                  aria-label={
                    videoPlaying ? "Mettre en pause" : "Lire la vidéo"
                  }
                >
                  {videoPlaying ? (
                    <Pause size={31} strokeWidth={2} />
                  ) : (
                    <Play size={31} strokeWidth={2} fill="currentColor" />
                  )}
                </VideoOverlayPlay>

                <VideoControls>
                  <VideoProgressRow>
                    <VideoTime>{formatVideoTime(videoCurrentTime)}</VideoTime>

                    <VideoRange
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={videoProgress}
                      onChange={handleVideoSeek}
                      aria-label="Progression de la vidéo"
                    />

                    <VideoTime>{formatVideoTime(videoDuration)}</VideoTime>
                  </VideoProgressRow>

                  <VideoButtons>
                    <VideoControlButton
                      type="button"
                      onClick={toggleVideo}
                      aria-label={videoPlaying ? "Pause" : "Lecture"}
                    >
                      {videoPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} fill="currentColor" />
                      )}
                    </VideoControlButton>

                    <VideoControlButton
                      type="button"
                      onClick={toggleMute}
                      aria-label={
                        videoMuted ? "Activer le son" : "Couper le son"
                      }
                    >
                      {videoMuted ? (
                        <VolumeX size={17} />
                      ) : (
                        <Volume2 size={17} />
                      )}
                    </VideoControlButton>

                    <VideoControlTitle>
                      {mediaActuel.title || "Vidéo du modèle"}
                    </VideoControlTitle>

                    <VideoControlButton
                      type="button"
                      onClick={passerPleinEcran}
                      aria-label="Plein écran"
                    >
                      <Maximize2 size={17} />
                    </VideoControlButton>
                  </VideoButtons>
                </VideoControls>
              </CustomVideoPlayer>
            ) : (
              <ModalImage src={mediaActuel.url} alt={modeleSelectionne.title} />
            )}
          </ModalContent>

          {medias.length > 1 && (
            <>
              <ModalNavigation
                $left
                type="button"
                onClick={mediaPrecedent}
                aria-label="Média précédent"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ChevronLeft size={27} />
              </ModalNavigation>

              <ModalNavigation
                type="button"
                onClick={mediaSuivant}
                aria-label="Média suivant"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ChevronRight size={27} />
              </ModalNavigation>

              <ModalThumbnails onClick={(e) => e.stopPropagation()}>
                {medias.map((media, index) => (
                  <ModalThumbnail
                    type="button"
                    key={`${media.url}-${index}`}
                    $active={index === mediaIndex}
                    onClick={() => setMediaIndex(index)}
                  >
                    {media.type === "video" ? (
                      <ThumbnailVideoIcon>
                        <Play size={17} fill="currentColor" strokeWidth={2} />
                      </ThumbnailVideoIcon>
                    ) : (
                      <ThumbnailImage src={media.url} alt="" />
                    )}
                  </ModalThumbnail>
                ))}
              </ModalThumbnails>
            </>
          )}

          <ModalKeyboardHint onClick={(e) => e.stopPropagation()}>
            <span>ESC</span> pour fermer
            {medias.length > 1 && " • ← → pour naviguer"}
          </ModalKeyboardHint>
        </MediaModal>
      )}
    </PageContainer>
  );
};

/* ============================================================
   STYLES — PAGE
============================================================ */

const PageContainer = styled.div`
  min-height: 100vh;

  background: radial-gradient(
    circle at 50% -10%,
    rgba(255, 255, 255, 1) 0,
    rgba(248, 248, 248, 0.98) 35%,
    #f4f4f4 100%
  );

  padding: 50px 25px 90px;

  @media (max-width: 600px) {
    padding: 32px 14px 60px;
  }
`;

const Header = styled.div`
  max-width: 900px;

  margin: 0 auto 48px;

  text-align: center;
`;

const SmallTitle = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 7px 12px;

  border-radius: 999px;

  background: #111;
  color: white;

  font-size: 9px;
  font-weight: 900;

  letter-spacing: 2.5px;

  margin-bottom: 15px;
`;

const MainTitle = styled.h1`
  margin: 0;

  font-size: 46px;

  color: #171717;

  font-weight: 850;

  letter-spacing: -1.8px;

  @media (max-width: 600px) {
    font-size: 34px;
    letter-spacing: -1px;
  }
`;

const Subtitle = styled.p`
  max-width: 680px;

  margin: 16px auto 0;

  color: #777;

  line-height: 1.8;

  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const ModelesGrid = styled.div`
  max-width: 1220px;

  margin: auto;

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 26px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const ModelCard = styled.article`
  position: relative;

  background: #fff;

  border-radius: 22px;

  overflow: hidden;

  border: 1px solid #e8e8e8;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.025);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    transform: translateY(-6px);

    border-color: #ddd;

    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.09);
  }
`;

const CardImageContainer = styled.div`
  position: relative;

  height: 380px;

  background: #ededed;

  overflow: hidden;

  @media (max-width: 650px) {
    height: 420px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1);

  ${ModelCard}:hover & {
    transform: scale(1.035);
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #999;

  background: #eeeeee;

  font-size: 13px;
`;

const PrecommandeBadge = styled.div`
  position: absolute;

  top: 16px;
  left: 16px;

  background: rgba(17, 17, 17, 0.94);

  color: white;

  padding: 8px 12px;

  border-radius: 30px;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.4px;

  backdrop-filter: blur(10px);

  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.15);
`;

const VideoCardBadge = styled.div`
  position: absolute;

  right: 16px;
  top: 16px;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 8px 11px;

  border-radius: 30px;

  background: rgba(255, 255, 255, 0.92);

  color: #111;

  font-size: 10px;

  font-weight: 800;

  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);

  backdrop-filter: blur(10px);
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardTitle = styled.h2`
  margin: 0 0 10px;

  color: #222;

  font-size: 21px;

  font-weight: 800;

  letter-spacing: -0.4px;
`;

const CardDescription = styled.p`
  color: #777;

  font-size: 13px;

  line-height: 1.7;

  min-height: 66px;

  margin: 0;
`;

const CardInfo = styled.div`
  margin-top: 19px;
`;

const Price = styled.div`
  font-size: 21px;

  font-weight: 800;

  color: #111;

  letter-spacing: -0.3px;
`;

const Deposit = styled.div`
  margin-top: 5px;

  color: #777;

  font-size: 12px;
`;

const Availability = styled.div`
  margin-top: 13px;

  padding: 11px 13px;

  background: #f6f6f6;

  border-radius: 10px;

  font-size: 11px;

  color: #555;
`;

const VariationSummary = styled.div`
  margin-top: 17px;

  display: flex;

  flex-direction: column;

  gap: 8px;
`;

const VariationLine = styled.div`
  display: flex;

  gap: 8px;

  font-size: 12px;
`;

const VariationLabel = styled.span`
  font-weight: 800;

  color: #333;
`;

const VariationValues = styled.span`
  color: #777;
`;

const StockMini = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 2px;

  color: #777;

  font-size: 11px;
`;

const StockMiniDot = styled.span`
  width: 7px;
  height: 7px;

  flex: 0 0 7px;

  border-radius: 50%;

  background: ${(props) => (props.$available ? "#32804a" : "#b33a3a")};

  box-shadow: 0 0 0 3px
    ${(props) =>
      props.$available ? "rgba(50,128,74,0.08)" : "rgba(179,58,58,0.08)"};
`;

const ActionButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  border: none;

  background: #111;

  color: white;

  padding: 15px;

  border-radius: 11px;

  margin-top: 21px;

  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #292929;

    box-shadow: 0 9px 24px rgba(0, 0, 0, 0.14);

    svg {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: scale(0.985);
  }
`;

/* ============================================================
   DÉTAIL
============================================================ */

const DetailContainer = styled.div`
  max-width: 1260px;

  margin: auto;
`;

const BackButton = styled.button`
  display: inline-flex;

  align-items: center;

  gap: 9px;

  border: none;

  background: transparent;

  color: #333;

  font-weight: 700;

  cursor: pointer;

  margin-bottom: 25px;

  padding: 8px 0;

  transition: 0.2s;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #000;

    svg {
      transform: translateX(-3px);
    }
  }
`;

const DetailGrid = styled.div`
  display: grid;

  grid-template-columns:
    1.04fr
    0.96fr;

  gap: 45px;

  align-items: start;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;

    gap: 28px;
  }
`;

const MediaSection = styled.div`
  position: sticky;

  top: 20px;

  @media (max-width: 950px) {
    position: static;
  }
`;

const MediaContainer = styled.div`
  position: relative;

  width: 100%;

  aspect-ratio: 4 / 5;

  background: #111;

  border-radius: 24px;

  overflow: hidden;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.13);

  isolation: isolate;

  @media (max-width: 600px) {
    border-radius: 19px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  cursor: zoom-in;

  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);

  &:hover {
    transform: scale(1.018);
  }
`;

const PreviewVideoWrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  background: #080808;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  cursor: zoom-in;

  background: #080808;
`;

const PreviewVideoPlayButton = styled.button`
  position: absolute;

  left: 20px;
  bottom: 20px;

  width: 50px;
  height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.3);

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.68);

  color: white;

  backdrop-filter: blur(12px);

  cursor: pointer;

  z-index: 7;

  box-shadow: 0 9px 28px rgba(0, 0, 0, 0.3);

  transition:
    transform 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;

  &:hover {
    transform: scale(1.08);

    background: rgba(0, 0, 0, 0.85);

    border-color: rgba(255, 255, 255, 0.55);
  }

  &:active {
    transform: scale(0.94);
  }

  @media (max-width: 600px) {
    left: 15px;
    bottom: 15px;

    width: 46px;
    height: 46px;
  }
`;

const PreviewVideoLabel = styled.div`
  position: absolute;

  left: 20px;
  top: 20px;

  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 8px 11px;

  border-radius: 999px;

  background: rgba(0, 0, 0, 0.5);

  color: rgba(255, 255, 255, 0.92);

  border: 1px solid rgba(255, 255, 255, 0.14);

  backdrop-filter: blur(10px);

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1.2px;

  z-index: 6;

  pointer-events: none;

  @media (max-width: 600px) {
    left: 14px;
    top: 14px;
  }
`;

const MediaExpandButton = styled.button`
  position: absolute;

  top: 16px;
  right: 16px;

  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.25);

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.45);

  color: white;

  backdrop-filter: blur(10px);

  cursor: pointer;

  z-index: 8;

  transition: 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.72);

    transform: scale(1.06);
  }
`;

const MediaArrow = styled.button`
  position: absolute;

  ${(props) => (props.$left ? "left: 15px;" : "right: 15px;")}

  top: 50%;

  transform: translateY(-50%);

  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, 0.22);

  background: rgba(0, 0, 0, 0.42);

  color: white;

  backdrop-filter: blur(10px);

  cursor: pointer;

  z-index: 8;

  transition: 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.72);

    transform: translateY(-50%) scale(1.06);
  }
`;

const DotsContainer = styled.div`
  position: absolute;

  bottom: 18px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  padding: 9px 13px;

  background: rgba(0, 0, 0, 0.38);

  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 30px;

  z-index: 8;
`;

const Dot = styled.button`
  width: ${(props) => (props.$video ? "31px" : "9px")};

  height: ${(props) => (props.$video ? "31px" : "9px")};

  border-radius: 50%;

  border: none;

  background: ${(props) =>
    props.$active
      ? "#fff"
      : props.$video
        ? "rgba(255,255,255,0.75)"
        : "rgba(255,255,255,0.48)"};

  color: #111;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 0;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: scale(1.18);
  }
`;

const MediaDescription = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;

  padding: 14px 5px;
`;

const MediaCurrent = styled.span`
  display: inline-flex;

  align-items: center;

  gap: 6px;

  font-weight: 800;

  color: #333;

  font-size: 12px;
`;

const MediaHint = styled.span`
  color: #999;

  font-size: 11px;

  text-align: right;

  @media (max-width: 500px) {
    display: none;
  }
`;

const InformationSection = styled.div`
  background: white;

  border-radius: 24px;

  padding: 31px;

  border: 1px solid #ececec;

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.04);

  @media (max-width: 600px) {
    padding: 22px;

    border-radius: 20px;
  }
`;

const PrecommandeLabel = styled.div`
  display: inline-flex;

  background: #111;

  color: white;

  border-radius: 20px;

  padding: 7px 12px;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.2px;
`;

const DetailTitle = styled.h2`
  margin: 15px 0 10px;

  font-size: 33px;

  line-height: 1.15;

  color: #1d1d1d;

  letter-spacing: -0.7px;

  @media (max-width: 600px) {
    font-size: 27px;
  }
`;

const DetailDescription = styled.p`
  color: #777;

  line-height: 1.75;

  margin: 0 0 20px;

  font-size: 13px;
`;

const PriceBlock = styled.div`
  padding: 19px 0;

  border-top: 1px solid #eee;

  border-bottom: 1px solid #eee;
`;

const CurrentPrice = styled.div`
  font-size: 28px;

  font-weight: 900;

  color: #111;

  letter-spacing: -0.7px;
`;

const DepositText = styled.div`
  margin-top: 7px;

  color: #777;

  font-size: 12px;
`;

const DateBox = styled.div`
  display: flex;

  align-items: center;

  gap: 13px;

  margin-top: 18px;

  background: #f7f7f7;

  padding: 15px;

  border-radius: 13px;
`;

const DateIcon = styled.div`
  width: 39px;
  height: 39px;

  flex: 0 0 39px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: #111;

  color: white;
`;

const DateLabel = styled.div`
  font-size: 9px;

  font-weight: 900;

  color: #888;

  letter-spacing: 1px;
`;

const DateValue = styled.div`
  margin-top: 4px;

  font-weight: 800;

  color: #333;

  font-size: 13px;
`;

const FieldGroup = styled.div`
  margin-top: 23px;
`;

const FieldLabel = styled.label`
  display: block;

  margin-bottom: 10px;

  color: #222;

  font-size: 12px;

  font-weight: 800;
`;

const ChoiceGrid = styled.div`
  display: flex;

  flex-wrap: wrap;

  gap: 9px;
`;

const ChoiceButton = styled.button`
  border: 1px solid ${(props) => (props.$active ? "#111" : "#dddddd")};

  background: ${(props) => (props.$active ? "#111" : "#fff")};

  color: ${(props) => (props.$active ? "#fff" : "#333")};

  padding: 11px 15px;

  border-radius: 9px;

  cursor: pointer;

  font-weight: 700;

  display: flex;

  align-items: center;

  gap: 8px;

  transition: 0.2s ease;

  &:hover {
    border-color: #111;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const ColorCircle = styled.span`
  width: 9px;
  height: 9px;

  flex: 0 0 9px;

  border-radius: 50%;

  background: currentColor;

  border: 1px solid rgba(0, 0, 0, 0.15);
`;

const StockCard = styled.div`
  margin-top: 22px;

  padding: 18px;

  border-radius: 14px;

  background: ${(props) => (props.$available ? "#f3f8f3" : "#fff2f2")};

  border: 1px solid ${(props) => (props.$available ? "#dceadc" : "#f1d2d2")};
`;

const StockTop = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;
`;

const StockLabel = styled.span`
  display: block;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 1px;

  color: #777;
`;

const StockVariationName = styled.div`
  margin-top: 4px;

  color: #999;

  font-size: 11px;
`;

const StockNumber = styled.span`
  font-size: 24px;

  font-weight: 900;

  color: ${(props) => (props.$available ? "#26733a" : "#b33a3a")};
`;

const StockVariation = styled.div`
  margin-top: 12px;

  color: #777;

  font-size: 11px;
`;

const StockVariationItem = styled.div`
  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  span {
    display: inline-flex;

    align-items: center;

    gap: 5px;

    padding: 6px 9px;

    background: rgba(255, 255, 255, 0.65);

    border-radius: 7px;
  }

  strong {
    color: #333;
  }
`;

const StockAvailableText = styled.div`
  margin-top: 11px;

  display: flex;

  align-items: center;

  gap: 5px;

  color: #287038;

  font-size: 11px;

  font-weight: 700;
`;

const StockUnavailableText = styled.div`
  margin-top: 11px;

  color: #b33131;

  font-size: 11px;

  font-weight: 700;
`;

const QuantityContainer = styled.div`
  display: inline-flex;

  align-items: center;

  border: 1px solid #ddd;

  border-radius: 10px;

  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 43px;
  height: 43px;

  border: none;

  background: #f5f5f5;

  font-size: 20px;

  cursor: pointer;

  transition: 0.2s;

  &:disabled {
    cursor: not-allowed;

    opacity: 0.35;
  }

  &:hover:not(:disabled) {
    background: #e9e9e9;
  }
`;

const QuantityValue = styled.div`
  width: 58px;

  text-align: center;

  font-weight: 800;
`;

const QuantityHint = styled.div`
  margin-top: 7px;

  color: #999;

  font-size: 10px;
`;

const SummaryBox = styled.div`
  margin-top: 25px;

  padding: 19px;

  background: #f7f7f7;

  border-radius: 14px;

  border: 1px solid rgba(0, 0, 0, 0.035);
`;

const SummaryRow = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 15px;

  padding: 7px 0;

  font-size: 12px;

  color: #666;

  strong {
    color: #222;

    text-align: right;
  }
`;

const SummaryTotal = styled.div`
  margin-top: 10px;

  padding-top: 14px;

  border-top: 1px solid #ddd;

  display: flex;

  justify-content: space-between;

  gap: 15px;

  font-size: 14px;

  font-weight: 900;

  color: #111;

  strong {
    text-align: right;
  }
`;

const Form = styled.form`
  margin-top: 30px;

  padding-top: 25px;

  border-top: 1px solid #eee;
`;

const FormTitle = styled.h3`
  margin: 0 0 17px;

  font-size: 18px;

  color: #222;
`;

const DepotInfoBox = styled.div`
  margin-bottom: 25px;

  padding: 20px;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  background: linear-gradient(135deg, #f8fafc, #f3f5f7);
`;

const DepotInfoHeader = styled.div`
  display: flex;

  gap: 12px;

  align-items: flex-start;
`;

const DepotInfoIcon = styled.div`
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  border-radius: 10px;

  background: #111;

  color: white;

  display: flex;

  align-items: center;
  justify-content: center;

  font-weight: 900;
`;

const DepotInfoTitle = styled.h3`
  margin: 0 0 6px;

  font-size: 16px;

  font-weight: 800;

  color: #1f2937;
`;

const DepotInfoText = styled.p`
  margin: 0;

  font-size: 12px;

  line-height: 1.6;

  color: #6b7280;
`;

const DepotNumber = styled.div`
  margin-top: 17px;

  padding: 15px;

  border-radius: 11px;

  background: white;

  border: 1px solid #dbe3ea;

  font-size: 23px;

  font-weight: 900;

  letter-spacing: 1.5px;

  text-align: center;

  color: #111827;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.035);
`;

const SupportedServices = styled.div`
  margin-top: 11px;

  font-size: 10px;

  color: #777;

  text-align: center;
`;

const DepotLoading = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 17px;

  padding: 14px;

  border-radius: 10px;

  background: white;

  color: #6b7280;

  text-align: center;

  font-size: 12px;
`;

const MiniSpinner = styled.span`
  width: 14px;
  height: 14px;

  border: 2px solid #ddd;

  border-top-color: #111;

  border-radius: 50%;

  animation: miniSpin 0.7s linear infinite;

  @keyframes miniSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const DepotError = styled.div`
  margin-top: 17px;

  padding: 14px;

  border-radius: 10px;

  background: #fef2f2;

  color: #b91c1c;

  font-size: 12px;
`;

const DepotWarning = styled.p`
  margin: 13px 0 0;

  font-size: 11px;

  line-height: 1.65;

  color: #6b7280;
`;

const PaymentGrid = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentButton = styled.button`
  position: relative;

  border: 1px solid ${(props) => (props.$active ? "#111" : "#ddd")};

  background: ${(props) => (props.$active ? "#f4f4f4" : "#fff")};

  border-radius: 12px;

  padding: 13px;

  display: flex;

  align-items: center;

  gap: 10px;

  cursor: pointer;

  text-align: left;

  transition: 0.2s ease;

  &:hover {
    border-color: #111;
  }

  &:active {
    transform: scale(0.985);
  }
`;

const PaymentLogo = styled.div`
  width: 35px;
  height: 35px;

  flex: 0 0 35px;

  border-radius: 9px;

  background: #111;

  color: white;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 10px;

  font-weight: 900;
`;

const PaymentName = styled.div`
  font-size: 12px;

  font-weight: 800;

  color: #222;
`;

const PaymentSmall = styled.div`
  margin-top: 2px;

  color: #999;

  font-size: 9px;
`;

const PaymentCheck = styled.div`
  position: absolute;

  top: 9px;
  right: 9px;

  width: 18px;
  height: 18px;

  border-radius: 50%;

  background: #111;

  color: white;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 10px;

  font-weight: 900;
`;

const Input = styled.input`
  width: 100%;

  box-sizing: border-box;

  height: 48px;

  padding: 0 14px;

  border: 1px solid #ddd;

  border-radius: 10px;

  outline: none;

  font-size: 16px;

  background: white;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:focus {
    border-color: #111;

    box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.05);
  }

  &:disabled {
    background: #f5f5f5;

    color: #888;

    cursor: not-allowed;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FormError = styled.div`
  margin-top: 18px;

  background: #fff1f1;

  border: 1px solid #f0d0d0;

  color: #b33131;

  padding: 13px;

  border-radius: 10px;

  font-size: 12px;

  line-height: 1.5;
`;

const FormSuccess = styled.div`
  margin-top: 18px;

  background: #eff9f0;

  border: 1px solid #d5ead7;

  color: #287038;

  padding: 13px;

  border-radius: 10px;

  font-size: 12px;
`;

const SubmitButton = styled.button`
  width: 100%;

  margin-top: 20px;

  min-height: 54px;

  border: none;

  border-radius: 12px;

  background: #111;

  color: white;

  font-weight: 800;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  transition: 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) {
    background: #292929;

    svg {
      transform: translateX(4px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.45;

    cursor: not-allowed;
  }
`;

const SecurityText = styled.p`
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 5px;

  text-align: center;

  color: #999;

  font-size: 10px;

  line-height: 1.5;

  margin: 13px 0 0;
`;

const LoadingContainer = styled.div`
  min-height: 70vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  background: #f8f8f8;
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;

  border: 4px solid #ddd;

  border-top-color: #111;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #777;

  margin-top: 15px;

  font-size: 13px;
`;

const ErrorBox = styled.div`
  max-width: 800px;

  margin: 0 auto 20px;

  padding: 15px;

  border-radius: 10px;

  background: #fff1f1;

  border: 1px solid #f0d0d0;

  color: #b33131;

  text-align: center;

  font-size: 13px;
`;

const SuccessBox = styled.div`
  max-width: 800px;

  margin: 0 auto 25px;

  padding: 16px;

  border-radius: 12px;

  background: #eff9f0;

  border: 1px solid #d5ead7;

  color: #287038;

  display: flex;

  gap: 10px;

  align-items: center;

  font-size: 13px;
`;

const SuccessIcon = styled.div`
  width: 25px;
  height: 25px;

  flex: 0 0 25px;

  border-radius: 50%;

  background: #287038;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 800;
`;

const RetryButton = styled.button`
  display: block;

  margin: auto;

  padding: 12px 20px;

  border: none;

  border-radius: 8px;

  background: #111;

  color: white;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    background: #292929;
  }
`;

const EmptyBox = styled.div`
  grid-column: 1 / -1;

  background: white;

  border-radius: 18px;

  padding: 60px 25px;

  text-align: center;

  border: 1px solid #eee;

  h3 {
    color: #222;

    margin: 15px 0 8px;
  }

  p {
    color: #888;

    font-size: 13px;
  }
`;

const EmptyIcon = styled.div`
  display: flex;

  justify-content: center;

  color: #aaa;
`;

const ButtonSpinner = styled.span`
  width: 18px;
  height: 18px;

  border: 2px solid rgba(255, 255, 255, 0.35);

  border-top-color: white;

  border-radius: 50%;

  animation: buttonSpin 0.7s linear infinite;

  @keyframes buttonSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* ============================================================
   MODAL MÉDIA
============================================================ */

const MediaModal = styled.div`
  position: fixed;

  inset: 0;

  z-index: 99999;

  background: radial-gradient(
    circle at center,
    rgba(35, 35, 35, 0.98),
    rgba(0, 0, 0, 0.99)
  );

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 75px 70px 95px;

  animation: modalAppear 0.22s ease;

  @keyframes modalAppear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @media (max-width: 700px) {
    padding: 70px 12px 90px;
  }
`;

const ModalTopBar = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  height: 65px;

  padding: 0 22px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.78), transparent);

  z-index: 20;

  @media (max-width: 600px) {
    padding: 0 12px;
  }
`;

const ModalCounter = styled.div`
  min-width: 65px;

  color: rgba(255, 255, 255, 0.7);

  font-size: 11px;

  font-weight: 700;
`;

const ModalTitle = styled.div`
  flex: 1;

  text-align: center;

  color: white;

  font-size: 13px;

  font-weight: 700;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
`;

const ModalCloseButton = styled.button`
  width: 40px;
  height: 40px;

  flex: 0 0 40px;

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);

  color: white;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;

  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.18);

    transform: rotate(4deg) scale(1.04);
  }
`;

const ModalContent = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 5;
`;

const ModalImage = styled.img`
  max-width: min(94vw, 1200px);

  max-height: 80vh;

  width: auto;
  height: auto;

  object-fit: contain;

  border-radius: 8px;

  user-select: none;

  animation: mediaAppear 0.25s ease;

  @keyframes mediaAppear {
    from {
      opacity: 0;

      transform: scale(0.97);
    }

    to {
      opacity: 1;

      transform: scale(1);
    }
  }

  @media (max-width: 700px) {
    max-width: 96vw;

    max-height: 73vh;
  }
`;

/* ============================================================
   CUSTOM VIDEO MODALE
============================================================ */

const CustomVideoPlayer = styled.div`
  position: relative;

  width: min(94vw, 1200px);

  height: min(76vh, 760px);

  background: #050505;

  border-radius: 12px;

  overflow: hidden;

  box-shadow: 0 35px 100px rgba(0, 0, 0, 0.55);

  animation: mediaAppear 0.25s ease;

  @keyframes mediaAppear {
    from {
      opacity: 0;

      transform: scale(0.97);
    }

    to {
      opacity: 1;

      transform: scale(1);
    }
  }

  @media (max-width: 700px) {
    width: 100%;

    height: min(70vh, 650px);

    border-radius: 9px;
  }
`;

const ModalVideo = styled.video`
  width: 100%;
  height: 100%;

  display: block;

  object-fit: contain;

  background: #050505;

  cursor: pointer;

  &::-webkit-media-controls {
    display: none !important;
  }

  &::-webkit-media-controls-enclosure {
    display: none !important;
  }
`;

const VideoOverlayPlay = styled.button`
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  width: 72px;
  height: 72px;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, 0.3);

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(12px);

  color: white;

  display: flex;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  opacity: ${(props) => (props.$visible ? 1 : 0)};

  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};

  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    background 0.25s ease;

  z-index: 5;

  &:hover {
    transform: translate(-50%, -50%) scale(1.07);

    background: rgba(0, 0, 0, 0.65);
  }

  @media (max-width: 600px) {
    width: 62px;
    height: 62px;
  }
`;

const VideoControls = styled.div`
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  padding: 20px 18px 15px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.88),
    rgba(0, 0, 0, 0.3),
    transparent
  );

  z-index: 10;
`;

const VideoProgressRow = styled.div`
  display: flex;

  align-items: center;

  gap: 9px;
`;

const VideoTime = styled.span`
  color: rgba(255, 255, 255, 0.8);

  font-size: 9px;

  min-width: 35px;

  font-variant-numeric: tabular-nums;
`;

const VideoRange = styled.input`
  flex: 1;

  width: 100%;

  height: 4px;

  appearance: none;

  background: rgba(255, 255, 255, 0.25);

  border-radius: 20px;

  cursor: pointer;

  outline: none;

  &::-webkit-slider-runnable-track {
    height: 4px;

    border-radius: 20px;

    background: linear-gradient(
      to right,
      white ${(props) => props.value || 0}%,
      rgba(255, 255, 255, 0.25) ${(props) => props.value || 0}%
    );
  }

  &::-webkit-slider-thumb {
    appearance: none;

    margin-top: -4.5px;

    width: 13px;
    height: 13px;

    border-radius: 50%;

    background: white;

    cursor: pointer;

    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.35);
  }

  &::-moz-range-thumb {
    width: 13px;
    height: 13px;

    border-radius: 50%;

    border: none;

    background: white;

    cursor: pointer;
  }
`;

const VideoButtons = styled.div`
  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 9px;
`;

const VideoControlButton = styled.button`
  width: 32px;
  height: 32px;

  flex: 0 0 32px;

  border: none;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.1);

  color: white;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;

  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);

    transform: scale(1.05);
  }
`;

const VideoControlTitle = styled.div`
  flex: 1;

  min-width: 0;

  color: rgba(255, 255, 255, 0.75);

  font-size: 10px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  margin-left: 3px;
`;

/* ============================================================
   NAVIGATION MODALE
============================================================ */

const ModalNavigation = styled.button`
  position: absolute;

  ${(props) => (props.$left ? "left: 18px;" : "right: 18px;")}

  top: 50%;

  transform: translateY(-50%);

  width: 50px;
  height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 1px solid rgba(255, 255, 255, 0.2);

  background: rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(12px);

  color: white;

  cursor: pointer;

  z-index: 30;

  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.18);

    transform: translateY(-50%) scale(1.05);
  }

  @media (max-width: 700px) {
    width: 42px;
    height: 42px;

    ${(props) => (props.$left ? "left: 7px;" : "right: 7px;")}
  }
`;

const ModalThumbnails = styled.div`
  position: absolute;

  left: 50%;
  bottom: 32px;

  transform: translateX(-50%);

  display: flex;

  align-items: center;

  gap: 7px;

  max-width: calc(100vw - 30px);

  overflow-x: auto;

  padding: 5px;

  z-index: 25;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalThumbnail = styled.button`
  width: 50px;
  height: 58px;

  flex: 0 0 auto;

  padding: 0;

  overflow: hidden;

  border-radius: 7px;

  border: 2px solid
    ${(props) => (props.$active ? "#fff" : "rgba(255,255,255,0.2)")};

  background: #151515;

  cursor: pointer;

  opacity: ${(props) => (props.$active ? 1 : 0.65)};

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover {
    opacity: 1;

    transform: translateY(-2px);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
`;

const ThumbnailVideoIcon = styled.div`
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: radial-gradient(circle, #333, #111);
`;

const ModalKeyboardHint = styled.div`
  position: absolute;

  bottom: 9px;

  left: 50%;

  transform: translateX(-50%);

  color: rgba(255, 255, 255, 0.45);

  font-size: 9px;

  white-space: nowrap;

  z-index: 25;

  span {
    display: inline-flex;

    padding: 3px 5px;

    border: 1px solid rgba(255, 255, 255, 0.18);

    border-radius: 4px;

    margin-right: 4px;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export default Precommande;
