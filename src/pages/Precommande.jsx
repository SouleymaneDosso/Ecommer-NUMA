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

  /* =========================================================
     INFORMATIONS CLIENT
  ========================================================= */

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

  const videoRef = useRef(null);
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
     INFORMATIONS DEPOT
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

  /* =========================================================
     CHARGEMENT MODÈLES
  ========================================================= */

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
      previewVideoRef.current.currentTime = 0;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
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

    /* IMAGE PRINCIPALE */

    if (typeof modeleSelectionne.image === "string") {
      if (modeleSelectionne.image.trim()) {
        liste.push({
          type: "image",
          url: modeleSelectionne.image,
          isMain: true,
        });
      }
    }

    /* GALERIE */

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

    /* VIDÉO */

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
     CLAVIER MODAL
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
     BLOQUER LE SCROLL MODAL
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

    /* COULEUR + TAILLE */

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

    /* TAILLE + COULEUR INVERSÉ */

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

    /* PRODUIT SANS COULEUR */

    if (tailleSelectionnee && !couleurSelectionnee) {
      const stockGlobal = Number(modeleSelectionne.stock);

      if (Number.isFinite(stockGlobal)) {
        return Math.max(0, stockGlobal);
      }
    }

    /* STOCK GLOBAL */

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
     TAILLE
  ========================================================= */

  const changerTaille = (taille) => {
    setTailleSelectionnee(taille);
    setQuantite(1);
    setErreur("");
  };

  /* =========================================================
     COULEUR
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
     VIDÉO APERÇU
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
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header>
        <HeaderInner>
          <SmallTitle>COLLECTION NUMA</SmallTitle>

          <MainTitle>Précommandez votre prochain NUMA</MainTitle>

          <Subtitle>
            Découvrez nos modèles disponibles en précommande et choisissez votre
            taille, votre couleur et votre quantité.
          </Subtitle>

          <HeaderFeatures>
            <HeaderFeature>
              <FeatureIcon>
                <PackageCheck size={17} />
              </FeatureIcon>

              <div>
                <strong>Accès prioritaire</strong>
                <span>Réservez votre modèle dès maintenant</span>
              </div>
            </HeaderFeature>

            <HeaderFeature>
              <FeatureIcon>
                <ShieldCheck size={17} />
              </FeatureIcon>

              <div>
                <strong>Paiement sécurisé</strong>
                <span>Votre commande est vérifiée par notre équipe</span>
              </div>
            </HeaderFeature>

            <HeaderFeature>
              <FeatureIcon>
                <CalendarDays size={17} />
              </FeatureIcon>

              <div>
                <strong>Livraison planifiée</strong>
                <span>Selon la date de disponibilité du modèle</span>
              </div>
            </HeaderFeature>
          </HeaderFeatures>
        </HeaderInner>
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
        <ModelsSection>
          <SectionIntro>
            <SectionEyebrow>LA COLLECTION</SectionEyebrow>

            <SectionTitle>Choisissez votre modèle</SectionTitle>

            <SectionText>
              Chaque modèle disponible ci-dessous peut être réservé en
              précommande.
            </SectionText>
          </SectionIntro>

          <ModelesGrid>
            {modeles.length === 0 ? (
              <EmptyBox>
                <EmptyIcon>
                  <PackageCheck size={42} />
                </EmptyIcon>

                <h3>Aucune précommande disponible</h3>

                <p>
                  Aucun modèle n'est actuellement disponible en précommande.
                </p>
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
                          {Number(modele.price || 0).toLocaleString("fr-FR")}{" "}
                          FCFA
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
                          <CalendarDays size={14} />
                          Disponible à partir du{" "}
                          {new Date(
                            modele.dateDisponibilite,
                          ).toLocaleDateString("fr-FR")}
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
                              Object.keys(modele.stockParVariation || {})
                                .length > 0
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
        </ModelsSection>
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

              {/* TAILLES */}

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

              {/* COULEURS */}

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

              {/* STOCK */}

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

              {/* QUANTITÉ */}

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

              {/* RÉCAPITULATIF */}

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

              {/* FORMULAIRE */}

              <Form onSubmit={envoyerPrecommande}>
                <FormTitle>Informations de livraison</FormTitle>

                <FormGrid>
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
                </FormGrid>

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

                <FormGrid>
                  <FieldGroup>
                    <FieldLabel htmlFor="codePostal">Code postal</FieldLabel>

                    <Input id="codePostal" value={codePostal} disabled />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel htmlFor="pays">Pays</FieldLabel>

                    <Input id="pays" value={pays} disabled />
                  </FieldGroup>
                </FormGrid>

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

const PageContainer = styled.main`
  min-height: 100vh;
  padding: 0 24px 80px;
  background:
    radial-gradient(
      circle at 10% 0%,
      rgba(207, 224, 205, 0.35),
      transparent 28%
    ),
    #f7f4ec;
  color: #17382d;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  @media (max-width: 700px) {
    padding: 0 15px 50px;
  }
`;

const Header = styled.header`
  max-width: 1180px;
  margin: 0 auto;
  padding: 72px 0 55px;
`;

const HeaderInner = styled.div`
  max-width: 900px;
`;

const SmallTitle = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 13px;
  border-radius: 999px;
  background: #dfe9dc;
  color: #285441;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
`;

const MainTitle = styled.h1`
  margin: 18px 0 16px;
  max-width: 850px;
  color: #17382d;
  font-size: clamp(42px, 6vw, 76px);
  line-height: 0.98;
  letter-spacing: -0.055em;
  font-weight: 800;
`;

const Subtitle = styled.p`
  max-width: 690px;
  margin: 0;
  color: #64766e;
  font-size: 17px;
  line-height: 1.7;
`;

const HeaderFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 34px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderFeature = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 15px;
  border: 1px solid rgba(23, 56, 45, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.55);

  strong,
  span {
    display: block;
  }

  strong {
    color: #17382d;
    font-size: 13px;
    margin-bottom: 3px;
  }

  span {
    color: #7a8982;
    font-size: 11px;
    line-height: 1.4;
  }
`;

const FeatureIcon = styled.div`
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #17382d;
  color: white;
`;

const ModelsSection = styled.section`
  max-width: 1180px;
  margin: 0 auto;
`;

const SectionIntro = styled.div`
  margin-bottom: 28px;
`;

const SectionEyebrow = styled.div`
  color: #527260;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
`;

const SectionTitle = styled.h2`
  margin: 8px 0 7px;
  color: #17382d;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.04em;
`;

const SectionText = styled.p`
  margin: 0;
  color: #7a8982;
  font-size: 14px;
`;

const ModelesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const ModelCard = styled.article`
  overflow: hidden;
  border: 1px solid rgba(23, 56, 45, 0.08);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 12px 35px rgba(23, 56, 45, 0.06);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 22px 50px rgba(23, 56, 45, 0.11);
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  height: 330px;
  overflow: hidden;
  background: #e9e5da;

  @media (max-width: 650px) {
    height: 310px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${ModelCard}:hover & {
    transform: scale(1.035);
  }
`;

const PrecommandeBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 8px 11px;
  border-radius: 999px;
  background: #17382d;
  color: white;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
`;

const VideoCardBadge = styled.span`
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #17382d;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(10px);
`;

const CardContent = styled.div`
  padding: 22px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px;
  color: #17382d;
  font-size: 22px;
  letter-spacing: -0.025em;
`;

const CardDescription = styled.p`
  min-height: 48px;
  margin: 0 0 18px;
  color: #78877f;
  font-size: 13px;
  line-height: 1.65;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
`;

const Price = styled.strong`
  color: #17382d;
  font-size: 20px;
  letter-spacing: -0.03em;
`;

const Deposit = styled.span`
  color: #7c8983;
  font-size: 10px;
  text-align: right;
`;

const Availability = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-radius: 10px;
  background: #f0f5ed;
  color: #557061;
  font-size: 11px;
`;

const VariationSummary = styled.div`
  padding-top: 13px;
  border-top: 1px solid #edf0eb;
`;

const VariationLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 7px;
`;

const VariationLabel = styled.span`
  color: #9aa59f;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const VariationValues = styled.span`
  color: #42584e;
  font-size: 11px;
  text-align: right;
`;

const StockMini = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  color: #65756d;
  font-size: 11px;
`;

const StockMiniDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $available }) => ($available ? "#5b896a" : "#b65d55")};
`;

const ActionButton = styled.button`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 19px;
  padding: 0 17px;
  border: 0;
  border-radius: 13px;
  background: #17382d;
  color: white;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #245440;
    transform: translateY(-1px);
  }
`;

const DetailContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 25px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #557064;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: #17382d;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(390px, 0.95fr);
  gap: 46px;
  align-items: start;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
    gap: 35px;
  }
`;

const MediaSection = styled.section`
  position: sticky;
  top: 20px;

  @media (max-width: 950px) {
    position: relative;
    top: auto;
  }
`;

const MediaContainer = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 28px;
  background: #e9e5da;
  box-shadow: 0 20px 55px rgba(23, 56, 45, 0.1);
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  cursor: zoom-in;
`;

const PreviewVideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  cursor: zoom-in;
`;

const PreviewVideoPlayButton = styled.button`
  position: absolute;
  left: 22px;
  bottom: 22px;
  z-index: 5;

  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;

  background: rgba(23, 56, 45, 0.9);
  color: white;

  cursor: pointer;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(10px);

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: scale(1.08);
    background: #17382d;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const PreviewVideoLabel = styled.div`
  position: absolute;
  top: 18px;
  left: 18px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 11px;
  border-radius: 999px;

  background: rgba(23, 56, 45, 0.82);
  color: white;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;

  backdrop-filter: blur(8px);
`;

const MediaExpandButton = styled.button`
  position: absolute;
  right: 18px;
  top: 18px;
  z-index: 5;

  width: 43px;
  height: 43px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.88);
  color: #17382d;

  cursor: pointer;
  backdrop-filter: blur(10px);

  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: scale(1.06);
    background: white;
  }
`;

const MediaArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? "left: 16px;" : "right: 16px;")}
  z-index: 5;

  transform: translateY(-50%);

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.9);
  color: #17382d;

  cursor: pointer;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 18px;
  left: 50%;
  z-index: 5;

  display: flex;
  align-items: center;
  gap: 6px;

  transform: translateX(-50%);
  padding: 7px 9px;

  border-radius: 999px;
  background: rgba(23, 56, 45, 0.72);

  backdrop-filter: blur(10px);
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "22px" : "7px")};
  height: 7px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: 0;
  border-radius: 999px;

  background: ${({ $active }) =>
    $active ? "white" : "rgba(255,255,255,0.45)"};

  color: #17382d;

  cursor: pointer;

  transition:
    width 0.2s ease,
    background 0.2s ease;
`;

const MediaDescription = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 13px;
`;

const MediaCurrent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #496358;
  font-size: 11px;
  font-weight: 700;
`;

const MediaHint = styled.span`
  color: #9aa59f;
  font-size: 10px;
`;

const InformationSection = styled.section`
  padding-bottom: 50px;
`;

const PrecommandeLabel = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  background: #dfe9dc;
  color: #315943;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
`;

const DetailTitle = styled.h2`
  margin: 15px 0 10px;
  color: #17382d;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 0.98;
  letter-spacing: -0.05em;
`;

const DetailDescription = styled.p`
  margin: 0;
  color: #738179;
  font-size: 14px;
  line-height: 1.7;
`;

const PriceBlock = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
  margin: 25px 0;
  padding-bottom: 24px;
  border-bottom: 1px solid #e1e5df;
`;

const CurrentPrice = styled.strong`
  color: #17382d;
  font-size: 30px;
  letter-spacing: -0.04em;
`;

const DepositText = styled.span`
  color: #75837c;
  font-size: 11px;
  text-align: right;
`;

const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 25px;
  padding: 14px;
  border-radius: 15px;
  background: #edf4ea;
`;

const DateIcon = styled.div`
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #17382d;
  color: white;
`;

const DateLabel = styled.div`
  margin-bottom: 3px;
  color: #809087;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
`;

const DateValue = styled.div`
  color: #294c3d;
  font-size: 13px;
  font-weight: 700;
`;

const FieldGroup = styled.div`
  margin-bottom: 18px;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #314d41;
  font-size: 11px;
  font-weight: 750;
`;

const ChoiceGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ChoiceButton = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  padding: 0 13px;

  border: 1px solid ${({ $active }) => ($active ? "#17382d" : "#dfe4df")};
  border-radius: 11px;

  background: ${({ $active }) => ($active ? "#17382d" : "#fff")};

  color: ${({ $active }) => ($active ? "#fff" : "#53665d")};

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: #17382d;
  }
`;

const ColorCircle = styled.span`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: linear-gradient(135deg, #17231e, #9caa9e);
  border: 1px solid rgba(23, 56, 45, 0.15);
`;

const StockCard = styled.div`
  margin: 22px 0;
  padding: 17px;
  border: 1px solid ${({ $available }) => ($available ? "#d9e5d8" : "#ead8d6")};
  border-radius: 17px;
  background: ${({ $available }) => ($available ? "#f3f7f1" : "#faf1f0")};
`;

const StockTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StockLabel = styled.div`
  color: #8b9891;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
`;

const StockVariationName = styled.div`
  margin-top: 3px;
  color: #496156;
  font-size: 11px;
`;

const StockNumber = styled.div`
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 50%;

  background: ${({ $available }) => ($available ? "#17382d" : "#a85e58")};

  color: white;
  font-size: 14px;
  font-weight: 800;
`;

const StockVariation = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(23, 56, 45, 0.08);
  color: #738078;
  font-size: 11px;
`;

const StockVariationItem = styled.div`
  display: flex;
  gap: 25px;

  span {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: #294c3d;
    font-size: 12px;
  }
`;

const StockAvailableText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #4d755a;
  font-size: 10px;
  font-weight: 700;
`;

const StockUnavailableText = styled.div`
  margin-top: 12px;
  color: #a55b55;
  font-size: 10px;
  font-weight: 700;
`;

const QuantityContainer = styled.div`
  display: inline-flex;
  align-items: center;
  height: 44px;
  overflow: hidden;
  border: 1px solid #dfe4df;
  border-radius: 12px;
  background: white;
`;

const QuantityButton = styled.button`
  width: 44px;
  height: 44px;

  border: 0;
  background: transparent;

  color: #17382d;
  font-size: 22px;

  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f0f4ef;
  }

  &:disabled {
    color: #c7cfca;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.div`
  min-width: 45px;
  color: #17382d;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
`;

const QuantityHint = styled.div`
  margin-top: 7px;
  color: #9aa49f;
  font-size: 10px;
`;

const SummaryBox = styled.div`
  margin: 25px 0;
  padding: 17px;
  border-radius: 17px;
  background: #17382d;
  color: white;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 7px 0;

  span {
    color: rgba(255, 255, 255, 0.62);
    font-size: 11px;
  }

  strong {
    font-size: 12px;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);

  span {
    color: white;
    font-size: 12px;
    font-weight: 700;
  }

  strong {
    color: white;
    font-size: 19px;
  }
`;

const Form = styled.form`
  margin-top: 30px;
`;

const FormTitle = styled.h3`
  margin: 28px 0 18px;
  color: #17382d;
  font-size: 19px;
  letter-spacing: -0.025em;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 47px;
  box-sizing: border-box;

  padding: 0 13px;

  border: 1px solid #dfe4df;
  border-radius: 11px;

  outline: none;

  background: white;
  color: #17382d;

  font-family: inherit;
  font-size: 12px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #a4aea9;
  }

  &:focus {
    border-color: #527260;
    box-shadow: 0 0 0 3px rgba(82, 114, 96, 0.1);
  }

  &:disabled {
    background: #edf0ec;
    color: #89958e;
    cursor: not-allowed;
  }
`;

const DepotInfoBox = styled.div`
  margin-bottom: 22px;
  padding: 17px;
  border: 1px solid #d9e5d8;
  border-radius: 17px;
  background: #f1f6ef;
`;

const DepotInfoHeader = styled.div`
  display: flex;
  gap: 12px;
`;

const DepotInfoIcon = styled.div`
  width: 37px;
  height: 37px;
  flex: 0 0 37px;

  display: grid;
  place-items: center;

  border-radius: 11px;
  background: #17382d;
  color: white;
`;

const DepotInfoTitle = styled.div`
  margin-bottom: 3px;
  color: #244a39;
  font-size: 13px;
  font-weight: 800;
`;

const DepotInfoText = styled.div`
  color: #718078;
  font-size: 11px;
  line-height: 1.5;
`;

const DepotNumber = styled.div`
  margin: 16px 0;
  padding: 15px;
  border-radius: 11px;
  background: white;
  color: #17382d;
  font-size: 22px;
  font-weight: 850;
  letter-spacing: 0.05em;
  text-align: center;
`;

const DepotLoading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
  color: #697a71;
  font-size: 11px;
`;

const DepotError = styled.div`
  margin: 16px 0;
  color: #a55c56;
  font-size: 11px;
`;

const SupportedServices = styled.div`
  margin-bottom: 12px;
  color: #557061;
  font-size: 10px;
  font-weight: 700;
`;

const DepotWarning = styled.div`
  padding-top: 12px;
  border-top: 1px solid rgba(23, 56, 45, 0.08);
  color: #7c8982;
  font-size: 10px;
  line-height: 1.6;
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentButton = styled.button`
  position: relative;

  display: flex;
  align-items: center;
  gap: 10px;

  min-height: 62px;
  padding: 10px;

  border: 1px solid ${({ $active }) => ($active ? "#17382d" : "#dfe4df")};

  border-radius: 13px;

  background: ${({ $active }) => ($active ? "#f0f5ed" : "white")};

  color: #17382d;
  text-align: left;

  cursor: pointer;

  &:hover {
    border-color: #17382d;
  }
`;

const PaymentLogo = styled.div`
  width: 37px;
  height: 37px;
  flex: 0 0 37px;

  display: grid;
  place-items: center;

  border-radius: 10px;
  background: #17382d;
  color: white;

  font-size: 11px;
  font-weight: 900;
`;

const PaymentName = styled.div`
  color: #294c3d;
  font-size: 12px;
  font-weight: 800;
`;

const PaymentSmall = styled.div`
  margin-top: 2px;
  color: #87938d;
  font-size: 9px;
`;

const PaymentCheck = styled.div`
  position: absolute;
  top: 7px;
  right: 7px;

  width: 18px;
  height: 18px;

  display: grid;
  place-items: center;

  border-radius: 50%;
  background: #17382d;
  color: white;
`;

const FormError = styled.div`
  margin: 15px 0;
  padding: 13px 14px;
  border-radius: 11px;
  background: #faefee;
  color: #a45a54;
  font-size: 11px;
  line-height: 1.5;
`;

const FormSuccess = styled.div`
  margin: 15px 0;
  padding: 13px 14px;
  border-radius: 11px;
  background: #edf5eb;
  color: #4e755b;
  font-size: 11px;
  line-height: 1.5;
`;

const SubmitButton = styled.button`
  width: 100%;
  min-height: 53px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  border: 0;
  border-radius: 13px;

  background: #17382d;
  color: white;

  font-family: inherit;
  font-size: 12px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    background: #245440;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SecurityText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;

  margin-top: 12px;

  color: #89958f;
  font-size: 9px;
  line-height: 1.5;
  text-align: center;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 14px;

  background: #f7f4ec;
  color: #17382d;
`;

const Spinner = styled.div`
  width: 34px;
  height: 34px;

  border: 3px solid #dbe4d9;
  border-top-color: #17382d;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #718078;
  font-size: 12px;
`;

const MiniSpinner = styled.div`
  width: 13px;
  height: 13px;

  border: 2px solid #cbd8c9;
  border-top-color: #17382d;

  border-radius: 50%;

  animation: spinMini 0.7s linear infinite;

  @keyframes spinMini {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ButtonSpinner = styled.div`
  width: 14px;
  height: 14px;

  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;

  border-radius: 50%;

  animation: spinButton 0.7s linear infinite;

  @keyframes spinButton {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorBox = styled.div`
  max-width: 1180px;
  margin: 0 auto 20px;
  padding: 14px 16px;

  border: 1px solid #ead8d6;
  border-radius: 13px;

  background: #faf1f0;
  color: #a45a54;

  font-size: 12px;
  line-height: 1.5;
`;

const SuccessBox = styled.div`
  max-width: 1180px;
  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 14px 16px;

  border: 1px solid #d5e5d4;
  border-radius: 13px;

  background: #edf5eb;
  color: #4d7458;

  font-size: 12px;
  line-height: 1.5;
`;

const SuccessIcon = styled.div`
  width: 27px;
  height: 27px;

  flex: 0 0 27px;

  display: grid;
  place-items: center;

  border-radius: 50%;
  background: #17382d;
  color: white;
`;

const RetryButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 12px 20px;

  border: 0;
  border-radius: 10px;

  background: #17382d;
  color: white;

  cursor: pointer;
`;

const EmptyBox = styled.div`
  grid-column: 1 / -1;

  padding: 70px 25px;

  border: 1px dashed #ccd7ce;
  border-radius: 22px;

  background: rgba(255, 255, 255, 0.55);

  text-align: center;

  h3 {
    margin: 18px 0 7px;
    color: #294c3d;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: #829088;
    font-size: 12px;
  }
`;

const EmptyIcon = styled.div`
  display: flex;
  justify-content: center;
  color: #6d8878;
`;

/* ============================================================
   MODAL
============================================================ */

const MediaModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  flex-direction: column;

  background: rgba(8, 18, 14, 0.96);

  color: white;

  animation: modalIn 0.2s ease;

  @keyframes modalIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

const ModalTopBar = styled.div`
  min-height: 70px;

  display: grid;
  grid-template-columns: 80px 1fr 80px;
  align-items: center;

  gap: 15px;

  padding: 0 25px;

  @media (max-width: 600px) {
    grid-template-columns: 55px 1fr 55px;
    padding: 0 12px;
  }
`;

const ModalCounter = styled.div`
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  font-weight: 700;
`;

const ModalTitle = styled.div`
  overflow: hidden;

  color: white;
  font-size: 13px;
  font-weight: 700;

  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalCloseButton = styled.button`
  justify-self: end;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
  color: white;

  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ModalContent = styled.div`
  position: relative;

  flex: 1;
  min-height: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px 100px 90px;

  @media (max-width: 700px) {
    padding: 10px 20px 90px;
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;

  display: block;

  object-fit: contain;

  border-radius: 8px;

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
`;

const CustomVideoPlayer = styled.div`
  position: relative;

  width: min(100%, 1000px);
  height: min(100%, 650px);

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 12px;
  background: black;

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
`;

const ModalVideo = styled.video`
  width: 100%;
  height: 100%;

  display: block;

  object-fit: contain;
  background: black;

  cursor: pointer;
`;

const VideoOverlayPlay = styled.button`
  position: absolute;
  left: 50%;
  top: 50%;

  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%)
    scale(${({ $visible }) => ($visible ? "1" : "0.8")});

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;

  background: rgba(23, 56, 45, 0.9);
  color: white;

  cursor: pointer;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  backdrop-filter: blur(8px);
`;

const VideoControls = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 14px 17px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.88),
    rgba(0, 0, 0, 0.15),
    transparent
  );
`;

const VideoProgressRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 9px;
`;

const VideoTime = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
`;

const VideoRange = styled.input`
  width: 100%;
  height: 3px;

  accent-color: white;

  cursor: pointer;
`;

const VideoButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const VideoControlButton = styled.button`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: 0;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.12);
  color: white;

  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const VideoControlTitle = styled.div`
  flex: 1;

  overflow: hidden;

  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalNavigation = styled.button`
  position: absolute;
  top: 50%;

  ${({ $left }) => ($left ? "left: 25px;" : "right: 25px;")}

  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.09);
  color: white;

  cursor: pointer;

  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.17);
  }

  @media (max-width: 700px) {
    ${({ $left }) => ($left ? "left: 8px;" : "right: 8px;")}

    width: 40px;
    height: 40px;
  }
`;

const ModalThumbnails = styled.div`
  position: absolute;
  left: 50%;
  bottom: 40px;

  display: flex;
  gap: 7px;

  transform: translateX(-50%);

  max-width: calc(100% - 80px);

  overflow-x: auto;

  padding: 5px;

  border-radius: 11px;

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(10px);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalThumbnail = styled.button`
  position: relative;

  width: 54px;
  height: 40px;

  flex: 0 0 54px;

  overflow: hidden;

  padding: 0;

  border: 2px solid ${({ $active }) => ($active ? "white" : "transparent")};

  border-radius: 7px;

  background: rgba(255, 255, 255, 0.08);

  cursor: pointer;

  opacity: ${({ $active }) => ($active ? 1 : 0.6)};

  transition:
    opacity 0.2s ease,
    border 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const ThumbnailVideoIcon = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #17382d;
  color: white;
`;

const ModalKeyboardHint = styled.div`
  position: absolute;
  right: 22px;
  bottom: 16px;

  color: rgba(255, 255, 255, 0.4);
  font-size: 9px;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 25px;
    height: 18px;

    margin-right: 4px;
    padding: 0 4px;

    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 4px;

    font-size: 8px;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

export default Precommande;
