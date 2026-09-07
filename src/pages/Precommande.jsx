import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";

const API_URL = import.meta.env.VITE_API_URL;

const Precommande = () => {
  const token = localStorage.getItem("token");

  const [modeles, setModeles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modeleSelectionne, setModeleSelectionne] =
    useState(null);

  const [imageIndex, setImageIndex] = useState(0);
  const [mediaVideo, setMediaVideo] = useState(false);

  const [tailleSelectionnee, setTailleSelectionnee] =
    useState("");

  const [couleurSelectionnee, setCouleurSelectionnee] =
    useState("");

  const [quantite, setQuantite] = useState(1);

  const [service, setService] = useState("orange");
  const [numeroDepot, setNumeroDepot] = useState("");
  const [referenceDepot, setReferenceDepot] =
    useState("");

  const [submitting, setSubmitting] = useState(false);

  /* =========================
     CHARGEMENT DES MODÈLES
  ========================= */

  useEffect(() => {
    chargerModeles();
  }, []);

  const chargerModeles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/precommandes/modeles`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de charger les modèles."
        );
      }

      setModeles(data.modeles || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     IMAGES DU MODÈLE
  ========================= */

  const medias = useMemo(() => {
    if (!modeleSelectionne) return [];

    const images = (modeleSelectionne.images || []).map(
      (image) => ({
        type: "image",
        url:
          typeof image === "string"
            ? image
            : image.url,
      })
    );

    if (modeleSelectionne.video) {
      return [
        ...images,
        {
          type: "video",
          url:
            typeof modeleSelectionne.video === "string"
              ? modeleSelectionne.video
              : modeleSelectionne.video?.url,
        },
      ];
    }

    return images;
  }, [modeleSelectionne]);

  const mediaActuel = medias[imageIndex];

  /* =========================
     STOCK VARIATION
  ========================= */

  const getStockVariation = () => {
    if (!modeleSelectionne) return 0;

    const stock = modeleSelectionne.stockParVariation;

    if (!stock) return 0;

    let stockNormalise = stock;

    if (stock instanceof Map) {
      stockNormalise = Object.fromEntries(stock);
    }

    if (!tailleSelectionnee) return 0;

    let variations =
      stockNormalise?.[tailleSelectionnee];

    if (!variations) return 0;

    if (variations instanceof Map) {
      variations =
        Object.fromEntries(variations);
    }

    if (couleurSelectionnee) {
      return (
        Number(
          variations?.[couleurSelectionnee]
        ) || 0
      );
    }

    return (
      Number(variations?.general) || 0
    );
  };

  const stockDisponible = getStockVariation();

  /* =========================
     SÉLECTION MODÈLE
  ========================= */

  const selectionnerModele = (modele) => {
    setModeleSelectionne(modele);

    setImageIndex(0);
    setMediaVideo(false);

    setTailleSelectionnee(
      modele.tailles?.[0] || ""
    );

    setCouleurSelectionnee(
      modele.couleurs?.[0] || ""
    );

    setQuantite(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     CHANGEMENT TAILLE
  ========================= */

  const changerTaille = (taille) => {
    setTailleSelectionnee(taille);
    setQuantite(1);
  };

  /* =========================
     CHANGEMENT COULEUR
  ========================= */

  const changerCouleur = (couleur) => {
    setCouleurSelectionnee(couleur);
    setQuantite(1);
  };

  /* =========================
     MEDIA
  ========================= */

  const afficherMediaSuivant = () => {
    if (medias.length === 0) return;

    setImageIndex((prev) =>
      prev === medias.length - 1
        ? 0
        : prev + 1
    );
  };

  const afficherMediaPrecedent = () => {
    if (medias.length === 0) return;

    setImageIndex((prev) =>
      prev === 0
        ? medias.length - 1
        : prev - 1
    );
  };

  const choisirMedia = (index) => {
    setImageIndex(index);
  };

  /* =========================
     QUANTITÉ
  ========================= */

  const augmenterQuantite = () => {
    const max =
      stockDisponible > 0
        ? stockDisponible
        : 99;

    setQuantite((prev) =>
      Math.min(prev + 1, max)
    );
  };

  const diminuerQuantite = () => {
    setQuantite((prev) =>
      Math.max(1, prev - 1)
    );
  };

  /* =========================
     PRIX
  ========================= */

  const prixUnitaire = Number(
    modeleSelectionne?.prix ||
      modeleSelectionne?.price ||
      0
  );

  const montantDepotUnitaire = Number(
    modeleSelectionne?.montantDepot || 0
  );

  const montantDepotTotal =
    montantDepotUnitaire * quantite;

  /* =========================
     ENVOI PRÉCOMMANDE
  ========================= */

  const envoyerPrecommande = async (e) => {
    e.preventDefault();

    if (!token) {
      alert(
        "Vous devez être connecté pour passer une précommande."
      );
      return;
    }

    if (!modeleSelectionne?._id) {
      alert("Veuillez sélectionner un modèle.");
      return;
    }

    if (!tailleSelectionnee) {
      alert("Veuillez choisir une taille.");
      return;
    }

    if (
      modeleSelectionne.couleurs?.length > 0 &&
      !couleurSelectionnee
    ) {
      alert("Veuillez choisir une couleur.");
      return;
    }

    if (!numeroDepot.trim()) {
      alert(
        "Veuillez renseigner le numéro utilisé pour le dépôt."
      );
      return;
    }

    if (!referenceDepot.trim()) {
      alert(
        "Veuillez renseigner la référence du dépôt."
      );
      return;
    }

    if (stockDisponible > 0 && quantite > stockDisponible) {
      alert(
        `La quantité disponible pour cette variation est de ${stockDisponible}.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/precommandes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            produitId: modeleSelectionne._id,
            service,
            numeroDepot:
              numeroDepot.trim(),
            referenceDepot:
              referenceDepot.trim(),
            taille: tailleSelectionnee,
            couleur:
              couleurSelectionnee || null,
            quantite,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'enregistrer la précommande."
        );
      }

      alert(
        "Votre précommande a été envoyée avec succès."
      );

      setNumeroDepot("");
      setReferenceDepot("");
      setQuantite(1);

      setModeleSelectionne(null);

      await chargerModeles();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <Page>
        <LoadingContainer>
          <Spinner />
          <LoadingText>
            Chargement des précommandes...
          </LoadingText>
        </LoadingContainer>
      </Page>
    );
  }

  /* =========================
     ERREUR
  ========================= */

  if (error) {
    return (
      <Page>
        <ErrorContainer>
          <ErrorIcon>!</ErrorIcon>

          <h2>Impossible de charger les modèles</h2>

          <p>{error}</p>

          <RetryButton
            type="button"
            onClick={chargerModeles}
          >
            Réessayer
          </RetryButton>
        </ErrorContainer>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <Eyebrow>
          COLLECTION NUMA
        </Eyebrow>

        <Title>
          Précommandez votre modèle
        </Title>

        <Description>
          Découvrez nos modèles disponibles en
          précommande et choisissez votre taille,
          votre couleur et votre quantité.
        </Description>
      </Header>

      {/* =========================
          MODELE SELECTIONNE
      ========================= */}

      {modeleSelectionne && (
        <DetailSection>
          <BackButton
            type="button"
            onClick={() =>
              setModeleSelectionne(null)
            }
          >
            ← Retour aux modèles
          </BackButton>

          <DetailGrid>
            {/* =====================
                MEDIA
            ===================== */}

            <MediaColumn>
              <MediaContainer>
                {mediaActuel?.type ===
                  "video" ? (
                  <Video
                    key={mediaActuel.url}
                    src={mediaActuel.url}
                    controls
                    autoPlay
                    muted
                    playsInline
                  />
                ) : mediaActuel?.url ? (
                  <ProductImage
                    src={mediaActuel.url}
                    alt={
                      modeleSelectionne.title
                    }
                  />
                ) : (
                  <NoMedia>
                    Aucune image
                  </NoMedia>
                )}

                {medias.length > 1 && (
                  <>
                    <MediaArrow
                      type="button"
                      $left
                      onClick={
                        afficherMediaPrecedent
                      }
                    >
                      ‹
                    </MediaArrow>

                    <MediaArrow
                      type="button"
                      onClick={
                        afficherMediaSuivant
                      }
                    >
                      ›
                    </MediaArrow>
                  </>
                )}

                {mediaActuel?.type ===
                  "video" && (
                  <VideoIndicator>
                    ▶ Vidéo
                  </VideoIndicator>
                )}
              </MediaContainer>

              {/* DOTS */}

              {medias.length > 1 && (
                <Dots>
                  {medias.map(
                    (media, index) => (
                      <Dot
                        key={`${media.url}-${index}`}
                        type="button"
                        $active={
                          imageIndex === index
                        }
                        $video={
                          media.type === "video"
                        }
                        onClick={() =>
                          choisirMedia(
                            index
                          )
                        }
                        aria-label={`Média ${
                          index + 1
                        }`}
                      >
                        {media.type ===
                        "video"
                          ? "▶"
                          : ""}
                      </Dot>
                    )
                  )}
                </Dots>
              )}

              {/* MINIATURES */}

              {medias.length > 1 && (
                <Thumbnails>
                  {medias.map(
                    (media, index) => (
                      <Thumbnail
                        key={`${media.url}-thumb-${index}`}
                        type="button"
                        $active={
                          imageIndex === index
                        }
                        onClick={() =>
                          choisirMedia(
                            index
                          )
                        }
                      >
                        {media.type ===
                        "video" ? (
                          <ThumbnailVideo>
                            ▶
                          </ThumbnailVideo>
                        ) : (
                          <ThumbnailImage
                            src={media.url}
                            alt=""
                          />
                        )}
                      </Thumbnail>
                    )
                  )}
                </Thumbnails>
              )}
            </MediaColumn>

            {/* =====================
                INFORMATIONS
            ===================== */}

            <InfoColumn>
              <Status>
                PRÉCOMMANDE
              </Status>

              <DetailTitle>
                {modeleSelectionne.title}
              </DetailTitle>

              <DetailDescription>
                {modeleSelectionne.description}
              </DetailDescription>

              <PriceBlock>
                <Price>
                  {prixUnitaire.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  FCFA
                </Price>

                <PriceLabel>
                  Prix du modèle
                </PriceLabel>
              </PriceBlock>

              {modeleSelectionne
                .dateDisponibilite && (
                <Availability>
                  <AvailabilityIcon>
                    ✓
                  </AvailabilityIcon>

                  <div>
                    <strong>
                      Disponible à partir du
                    </strong>

                    <span>
                      {new Date(
                        modeleSelectionne.dateDisponibilite
                      ).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </Availability>
              )}

              <Divider />

              {/* TAILLES */}

              {modeleSelectionne.tailles
                ?.length > 0 && (
                <OptionGroup>
                  <OptionHeader>
                    <OptionLabel>
                      Taille
                    </OptionLabel>

                    <SelectedValue>
                      {tailleSelectionnee ||
                        "Choisir"}
                    </SelectedValue>
                  </OptionHeader>

                  <OptionButtons>
                    {modeleSelectionne.tailles.map(
                      (taille) => (
                        <OptionButton
                          type="button"
                          key={taille}
                          $active={
                            tailleSelectionnee ===
                            taille
                          }
                          onClick={() =>
                            changerTaille(
                              taille
                            )
                          }
                        >
                          {taille}
                        </OptionButton>
                      )
                    )}
                  </OptionButtons>
                </OptionGroup>
              )}

              {/* COULEURS */}

              {modeleSelectionne.couleurs
                ?.length > 0 && (
                <OptionGroup>
                  <OptionHeader>
                    <OptionLabel>
                      Couleur
                    </OptionLabel>

                    <SelectedValue>
                      {couleurSelectionnee ||
                        "Choisir"}
                    </SelectedValue>
                  </OptionHeader>

                  <ColorButtons>
                    {modeleSelectionne.couleurs.map(
                      (couleur) => (
                        <ColorButton
                          type="button"
                          key={couleur}
                          $active={
                            couleurSelectionnee ===
                            couleur
                          }
                          onClick={() =>
                            changerCouleur(
                              couleur
                            )
                          }
                        >
                          {couleur}
                        </ColorButton>
                      )
                    )}
                  </ColorButtons>
                </OptionGroup>
              )}

              {/* STOCK */}

              <StockInfo>
                {stockDisponible > 0 ? (
                  <>
                    <StockDot />
                    {stockDisponible} disponible
                    {stockDisponible > 1
                      ? "s"
                      : ""}{" "}
                    pour cette variation
                  </>
                ) : (
                  <>
                    <StockDot $empty />
                    Variation non disponible
                  </>
                )}
              </StockInfo>

              {/* QUANTITE */}

              <OptionGroup>
                <OptionHeader>
                  <OptionLabel>
                    Quantité
                  </OptionLabel>
                </OptionHeader>

                <QuantityBox>
                  <QuantityButton
                    type="button"
                    onClick={
                      diminuerQuantite
                    }
                    disabled={quantite <= 1}
                  >
                    −
                  </QuantityButton>

                  <QuantityValue>
                    {quantite}
                  </QuantityValue>

                  <QuantityButton
                    type="button"
                    onClick={
                      augmenterQuantite
                    }
                    disabled={
                      stockDisponible > 0 &&
                      quantite >=
                        stockDisponible
                    }
                  >
                    +
                  </QuantityButton>
                </QuantityBox>
              </OptionGroup>

              {/* DEPOT */}

              <DepositBox>
                <DepositTop>
                  <span>
                    Dépôt à verser
                  </span>

                  <strong>
                    {montantDepotTotal.toLocaleString(
                      "fr-FR"
                    )}{" "}
                    FCFA
                  </strong>
                </DepositTop>

                <DepositDescription>
                  Le dépôt sera vérifié par notre
                  équipe avant validation de votre
                  précommande.
                </DepositDescription>
              </DepositBox>

              {/* FORMULAIRE */}

              <PrecommandeForm
                onSubmit={
                  envoyerPrecommande
                }
              >
                <FormTitle>
                  Informations du dépôt
                </FormTitle>

                <Field>
                  <Label>
                    Service de paiement
                  </Label>

                  <ServiceButtons>
                    <ServiceButton
                      type="button"
                      $active={
                        service === "orange"
                      }
                      onClick={() =>
                        setService("orange")
                      }
                    >
                      <ServiceIcon>
                        🟠
                      </ServiceIcon>

                      Orange Money
                    </ServiceButton>

                    <ServiceButton
                      type="button"
                      $active={
                        service === "wave"
                      }
                      onClick={() =>
                        setService("wave")
                      }
                    >
                      <ServiceIcon>
                        🔵
                      </ServiceIcon>

                      Wave
                    </ServiceButton>
                  </ServiceButtons>
                </Field>

                <Field>
                  <Label>
                    Numéro utilisé pour le dépôt
                  </Label>

                  <Input
                    type="tel"
                    value={numeroDepot}
                    onChange={(e) =>
                      setNumeroDepot(
                        e.target.value
                      )
                    }
                    placeholder="Ex: 07 XX XX XX XX"
                  />
                </Field>

                <Field>
                  <Label>
                    Référence du dépôt
                  </Label>

                  <Input
                    type="text"
                    value={referenceDepot}
                    onChange={(e) =>
                      setReferenceDepot(
                        e.target.value
                      )
                    }
                    placeholder="Ex: REF123456"
                  />
                </Field>

                <Summary>
                  <SummaryRow>
                    <span>
                      Modèle
                    </span>

                    <strong>
                      {
                        modeleSelectionne.title
                      }
                    </strong>
                  </SummaryRow>

                  <SummaryRow>
                    <span>
                      Quantité
                    </span>

                    <strong>
                      {quantite}
                    </strong>
                  </SummaryRow>

                  <SummaryRow>
                    <span>
                      Dépôt
                    </span>

                    <strong>
                      {montantDepotTotal.toLocaleString(
                        "fr-FR"
                      )}{" "}
                      FCFA
                    </strong>
                  </SummaryRow>
                </Summary>

                <SubmitButton
                  type="submit"
                  disabled={
                    submitting ||
                    !tailleSelectionnee ||
                    (modeleSelectionne
                      .couleurs?.length >
                      0 &&
                      !couleurSelectionnee) ||
                    stockDisponible <= 0
                  }
                >
                  {submitting
                    ? "Envoi en cours..."
                    : "Confirmer la précommande"}
                </SubmitButton>
              </PrecommandeForm>
            </InfoColumn>
          </DetailGrid>
        </DetailSection>
      )}

      {/* =========================
          LISTE MODELES
      ========================= */}

      {!modeleSelectionne && (
        <ModelsSection>
          <SectionHeader>
            <div>
              <SectionEyebrow>
                NOS MODÈLES
              </SectionEyebrow>

              <SectionTitle>
                Choisissez votre modèle
              </SectionTitle>
            </div>

            <ModelCount>
              {modeles.length} modèle
              {modeles.length > 1
                ? "s"
                : ""}
            </ModelCount>
          </SectionHeader>

          {modeles.length === 0 ? (
            <EmptyModels>
              <EmptyIcon>♡</EmptyIcon>

              <h3>
                Aucune précommande disponible
              </h3>

              <p>
                De nouveaux modèles seront
                bientôt disponibles.
              </p>
            </EmptyModels>
          ) : (
            <ModelGrid>
              {modeles.map((modele) => {
                const image =
                  modele.images?.find(
                    (item) =>
                      item.isMain
                  ) ||
                  modele.images?.[0];

                return (
                  <ModelCard
                    key={modele._id}
                    type="button"
                    onClick={() =>
                      selectionnerModele(
                        modele
                      )
                    }
                  >
                    <CardMedia>
                      {image?.url ? (
                        <CardImage
                          src={image.url}
                          alt={modele.title}
                        />
                      ) : (
                        <NoMedia>
                          Aucune image
                        </NoMedia>
                      )}

                      {modele.video && (
                        <VideoPill>
                          ▶ Vidéo
                        </VideoPill>
                      )}

                      <CardOverlay>
                        Voir le modèle →
                      </CardOverlay>
                    </CardMedia>

                    <CardBody>
                      <CardStatus>
                        PRÉCOMMANDE
                      </CardStatus>

                      <CardTitle>
                        {modele.title}
                      </CardTitle>

                      <CardDescription>
                        {modele.description}
                      </CardDescription>

                      <CardBottom>
                        <CardPrice>
                          {Number(
                            modele.prix ||
                              modele.price ||
                              0
                          ).toLocaleString(
                            "fr-FR"
                          )}{" "}
                          FCFA
                        </CardPrice>

                        <Arrow>
                          →
                        </Arrow>
                      </CardBottom>
                    </CardBody>
                  </ModelCard>
                );
              })}
            </ModelGrid>
          )}
        </ModelsSection>
      )}
    </Page>
  );
};

/* =====================================================
   ANIMATIONS
===================================================== */

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* =====================================================
   PAGE
===================================================== */

const Page = styled.div`
  min-height: 100vh;
  background: #fafafa;
  padding: 45px 40px 70px;
  color: #1f2937;

  @media (max-width: 700px) {
    padding: 25px 16px 50px;
  }
`;

const Header = styled.header`
  max-width: 1100px;
  margin: 0 auto 45px;
  text-align: center;
`;

const Eyebrow = styled.div`
  margin-bottom: 10px;
  color: #9a6b3a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 3px;
`;

const Title = styled.h1`
  margin: 0;
  color: #202020;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: -1px;

  @media (max-width: 700px) {
    font-size: 29px;
  }
`;

const Description = styled.p`
  max-width: 650px;
  margin: 15px auto 0;
  color: #777;
  font-size: 15px;
  line-height: 1.7;
`;

/* =====================================================
   LOADING
===================================================== */

const LoadingContainer = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 45px;
  height: 45px;
  border: 4px solid #e5e7eb;
  border-top-color: #9a6b3a;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 15px;
  color: #777;
`;

/* =====================================================
   ERROR
===================================================== */

const ErrorContainer = styled.div`
  max-width: 500px;
  margin: 100px auto;
  padding: 40px;
  background: white;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.06);

  h2 {
    margin: 15px 0 8px;
  }

  p {
    color: #777;
  }
`;

const ErrorIcon = styled.div`
  width: 45px;
  height: 45px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  font-size: 25px;
  font-weight: 700;
`;

const RetryButton = styled.button`
  margin-top: 15px;
  padding: 11px 20px;
  border: none;
  border-radius: 8px;
  background: #9a6b3a;
  color: white;
  cursor: pointer;
`;

/* =====================================================
   MODELE DETAIL
===================================================== */

const DetailSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s ease;
`;

const BackButton = styled.button`
  margin-bottom: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: #555;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #9a6b3a;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(
      380px,
      0.9fr
    );
  gap: 50px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const MediaColumn = styled.div`
  position: sticky;
  top: 20px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const MediaContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 16px;
  background: #eeeeee;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  background: #111;
`;

const NoMedia = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #eeeeee;
`;

const MediaArrow = styled.button`
  position: absolute;
  top: 50%;
  ${(props) =>
    props.$left ? "left: 15px;" : "right: 15px;"}
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #222;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);

  &:hover {
    background: white;
  }
`;

const VideoIndicator = styled.div`
  position: absolute;
  left: 15px;
  bottom: 15px;
  padding: 7px 11px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
`;

const Dot = styled.button`
  width: ${(props) =>
    props.$video ? "27px" : "8px"};
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: ${(props) =>
    props.$active
      ? "#9a6b3a"
      : "#d1d5db"};
  color: white;
  font-size: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Thumbnail = styled.button`
  position: relative;
  flex: 0 0 70px;
  width: 70px;
  height: 85px;
  padding: 0;
  overflow: hidden;
  border: 2px solid
    ${(props) =>
      props.$active
        ? "#9a6b3a"
        : "transparent"};
  border-radius: 8px;
  background: #eee;
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailVideo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222;
  color: white;
  font-size: 22px;
`;

/* =====================================================
   INFO
===================================================== */

const InfoColumn = styled.div`
  padding: 5px 0;
`;

const Status = styled.div`
  display: inline-block;
  margin-bottom: 12px;
  padding: 6px 10px;
  border-radius: 20px;
  background: #f3e8dc;
  color: #9a6b3a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
`;

const DetailTitle = styled.h2`
  margin: 0;
  color: #202020;
  font-size: 32px;
  line-height: 1.15;

  @media (max-width: 700px) {
    font-size: 27px;
  }
`;

const DetailDescription = styled.p`
  margin: 14px 0 20px;
  color: #777;
  line-height: 1.7;
  font-size: 14px;
`;

const PriceBlock = styled.div`
  margin: 20px 0;
`;

const Price = styled.div`
  color: #202020;
  font-size: 26px;
  font-weight: 700;
`;

const PriceLabel = styled.div`
  margin-top: 3px;
  color: #999;
  font-size: 12px;
`;

const Availability = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border-radius: 10px;
  background: #f7f7f7;
  color: #555;

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 12px;
  }

  span {
    margin-top: 3px;
    color: #777;
    font-size: 13px;
  }
`;

const AvailabilityIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e5f4e9;
  color: #27833f;
  font-weight: 700;
`;

const Divider = styled.hr`
  margin: 25px 0;
  border: none;
  border-top: 1px solid #eeeeee;
`;

const OptionGroup = styled.div`
  margin-bottom: 22px;
`;

const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const OptionLabel = styled.div`
  color: #222;
  font-size: 14px;
  font-weight: 700;
`;

const SelectedValue = styled.div`
  color: #9a6b3a;
  font-size: 13px;
  font-weight: 600;
`;

const OptionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const OptionButton = styled.button`
  min-width: 48px;
  padding: 10px 14px;
  border: 1px solid
    ${(props) =>
      props.$active
        ? "#9a6b3a"
        : "#ddd"};
  border-radius: 7px;
  background: ${(props) =>
    props.$active
      ? "#9a6b3a"
      : "white"};
  color: ${(props) =>
    props.$active ? "white" : "#444"};
  cursor: pointer;
  font-weight: 600;
`;

const ColorButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorButton = styled.button`
  padding: 10px 14px;
  border: 1px solid
    ${(props) =>
      props.$active
        ? "#9a6b3a"
        : "#ddd"};
  border-radius: 7px;
  background: ${(props) =>
    props.$active
      ? "#9a6b3a"
      : "white"};
  color: ${(props) =>
    props.$active ? "white" : "#444"};
  cursor: pointer;
  font-size: 13px;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin: -5px 0 20px;
  color: #777;
  font-size: 12px;
`;

const StockDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(props) =>
    props.$empty ? "#dc2626" : "#22c55e"};
`;

const QuantityBox = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 42px;
  height: 40px;
  border: none;
  background: white;
  color: #333;
  font-size: 20px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.div`
  width: 45px;
  text-align: center;
  font-weight: 600;
`;

const DepositBox = styled.div`
  margin: 25px 0;
  padding: 16px;
  border: 1px solid #eadbca;
  border-radius: 10px;
  background: #fcf8f4;
`;

const DepositTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  span {
    color: #666;
    font-size: 13px;
  }

  strong {
    color: #9a6b3a;
    font-size: 18px;
  }
`;

const DepositDescription = styled.p`
  margin: 8px 0 0;
  color: #888;
  font-size: 11px;
  line-height: 1.5;
`;

const PrecommandeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  color: #222;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.label`
  color: #444;
  font-size: 12px;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 13px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #9a6b3a;
  }
`;

const ServiceButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ServiceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px;
  border: 1px solid
    ${(props) =>
      props.$active
        ? "#9a6b3a"
        : "#ddd"};
  border-radius: 8px;
  background: ${(props) =>
    props.$active
      ? "#fcf8f4"
      : "white"};
  color: #444;
  cursor: pointer;
  font-weight: 600;
`;

const ServiceIcon = styled.span`
  font-size: 14px;
`;

const Summary = styled.div`
  padding: 15px;
  background: #f7f7f7;
  border-radius: 9px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 5px 0;
  color: #777;
  font-size: 12px;

  strong {
    color: #333;
    text-align: right;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 9px;
  background: #202020;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #9a6b3a;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

/* =====================================================
   LISTE MODELES
===================================================== */

const ModelsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 22px;
`;

const SectionEyebrow = styled.div`
  margin-bottom: 6px;
  color: #9a6b3a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #222;
  font-size: 25px;
`;

const ModelCount = styled.span`
  color: #999;
  font-size: 13px;
`;

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(260px, 1fr)
  );
  gap: 22px;
`;

const ModelCard = styled.button`
  padding: 0;
  overflow: hidden;
  border: none;
  border-radius: 14px;
  background: white;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 4px 20px
    rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px
      rgba(0, 0, 0, 0.1);

    .card-overlay {
      opacity: 1;
    }
  }
`;

const CardMedia = styled.div`
  position: relative;
  height: 330px;
  overflow: hidden;
  background: #eee;

  @media (max-width: 600px) {
    height: 300px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${ModelCard}:hover & {
    transform: scale(1.03);
  }
`;

const VideoPill = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 9px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  font-weight: 700;
`;

const CardOverlay = styled.div`
  position: absolute;
  left: 15px;
  right: 15px;
  bottom: 15px;
  padding: 11px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #222;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;

  @media (max-width: 700px) {
    opacity: 1;
  }
`;

const CardBody = styled.div`
  padding: 17px;
`;

const CardStatus = styled.div`
  margin-bottom: 8px;
  color: #9a6b3a;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
`;

const CardTitle = styled.h3`
  margin: 0 0 7px;
  color: #222;
  font-size: 18px;
`;

const CardDescription = styled.p`
  height: 42px;
  margin: 0 0 15px;
  overflow: hidden;
  color: #888;
  font-size: 12px;
  line-height: 1.6;
`;

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardPrice = styled.div`
  color: #222;
  font-size: 16px;
  font-weight: 700;
`;

const Arrow = styled.div`
  color: #9a6b3a;
  font-size: 20px;
`;

const EmptyModels = styled.div`
  padding: 70px 20px;
  border-radius: 15px;
  background: white;
  text-align: center;
`;

const EmptyIcon = styled.div`
  color: #c8a98b;
  font-size: 35px;
`;

export default Precommande;