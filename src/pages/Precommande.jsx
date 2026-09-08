import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

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

  const chargerInformationsDepot = async () => {
    try {
      setLoadingDepot(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("clientToken") ||
        localStorage.getItem("userToken");

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
     RÉCUPÉRATION DES MODÈLES
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

      setModeles(data.modeles || data.produits || []);
    } catch (error) {
      console.error(error);
      setErreur(error.message || "Une erreur est survenue lors du chargement.");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     FERMER LE MODÈLE
  ========================================================= */

  const fermerModele = () => {
    setModeleSelectionne(null);
    setMessage("");
    setErreur("");
  };

  /* =========================================================
     MÉDIAS
  ========================================================= */

  const medias = useMemo(() => {
    if (!modeleSelectionne) return [];

    const liste = [];

    if (Array.isArray(modeleSelectionne.images)) {
      modeleSelectionne.images.forEach((image) => {
        if (typeof image === "string" && image) {
          liste.push({
            type: "image",
            url: image,
          });
        }

        if (typeof image === "object" && image?.url) {
          liste.push({
            type: "image",
            url: image.url,
          });
        }
      });
    }

    let videoUrl = modeleSelectionne.video;

    if (typeof videoUrl === "object" && videoUrl !== null) {
      videoUrl = videoUrl.url || videoUrl.secure_url || videoUrl.video || "";
    }

    if (videoUrl) {
      liste.push({
        type: "video",
        url: videoUrl,
      });
    }

    return liste;
  }, [modeleSelectionne]);

  /* =========================================================
     STOCK PAR VARIATION
  ========================================================= */

  const getStockVariation = () => {
    if (!modeleSelectionne) return 0;

    const stockParVariation = modeleSelectionne.stockParVariation;

    if (!stockParVariation) {
      return 0;
    }

    if (tailleSelectionnee && couleurSelectionnee) {
      const variationTaille = stockParVariation[tailleSelectionnee];

      if (!variationTaille) {
        return 0;
      }

      const stock = variationTaille[couleurSelectionnee];

      return Number(stock || 0);
    }

    /*
      Cas où il n'y a pas de couleur.
    */

    if (tailleSelectionnee && !couleurSelectionnee) {
      const variationTaille = stockParVariation[tailleSelectionnee];

      if (typeof variationTaille === "number") {
        return variationTaille;
      }

      if (variationTaille?.general !== undefined) {
        return Number(variationTaille.general || 0);
      }

      return 0;
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
     CHANGEMENT DE TAILLE
  ========================================================= */

  const changerTaille = (taille) => {
    setTailleSelectionnee(taille);
    setQuantite(1);
    setErreur("");
  };

  /* =========================================================
     CHANGEMENT DE COULEUR
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
     PASSER LA PRÉCOMMANDE
  ========================================================= */

  const envoyerPrecommande = async (e) => {
    e.preventDefault();

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

    try {
      setLoadingCommande(true);

      const token =
        localStorage.getItem("token") || localStorage.getItem("clientToken");

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
        body: JSON.stringify({
          produitId: modeleSelectionne._id,
          service,
          numeroDepot: numeroDepot.trim(),
          referenceDepot: referenceDepot.trim(),

          /*
            Informations de variation
          */
          taille: tailleSelectionnee,
          couleur: couleurSelectionnee || null,
          quantite,

          /*
            Ces valeurs permettent aussi au backend
            de vérifier le montant attendu.
          */
          montantDepot: montantDepotTotal,
        }),
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
      console.error(error);

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

        <RetryButton onClick={chargerModeles}>Réessayer</RetryButton>
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
          <SuccessIcon>✓</SuccessIcon>
          <div>{message}</div>
        </SuccessBox>
      )}

      {erreur && !modeleSelectionne && <ErrorBox>{erreur}</ErrorBox>}

      {!modeleSelectionne && (
        <ModelesGrid>
          {modeles.length === 0 ? (
            <EmptyBox>
              <EmptyIcon>◌</EmptyIcon>
              <h3>Aucune précommande disponible</h3>
              <p>Aucun modèle n'est actuellement disponible en précommande.</p>
            </EmptyBox>
          ) : (
            modeles.map((modele) => {
              const image =
                modele.images?.find((img) => img.isMain)?.url ||
                modele.images?.[0]?.url ||
                (typeof modele.image === "string" ? modele.image : "");

              return (
                <ModelCard key={modele._id}>
                  <CardImageContainer>
                    {image ? (
                      <CardImage src={image} alt={modele.title} />
                    ) : (
                      <NoImage>Aucune image</NoImage>
                    )}

                    <PrecommandeBadge>PRÉCOMMANDE</PrecommandeBadge>
                  </CardImageContainer>

                  <CardContent>
                    <CardTitle>{modele.title}</CardTitle>

                    <CardDescription>{modele.description}</CardDescription>

                    <CardInfo>
                      <Price>
                        {Number(modele.price || 0).toLocaleString("fr-FR")} FCFA
                      </Price>

                      {modele.montantDepot && (
                        <Deposit>
                          Dépôt :{" "}
                          {Number(modele.montantDepot).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </Deposit>
                      )}
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
                    </VariationSummary>

                    <ActionButton onClick={() => ouvrirModele(modele)}>
                      Voir le modèle
                    </ActionButton>
                  </CardContent>
                </ModelCard>
              );
            })
          )}
        </ModelesGrid>
      )}

      {modeleSelectionne && (
        <DetailContainer>
          <BackButton onClick={fermerModele}>← Retour aux modèles</BackButton>

          <DetailGrid>
            {/* =================================================
                MÉDIA
            ================================================= */}

            <MediaSection>
              <MediaContainer>
                {medias.length > 0 ? (
                  medias[mediaIndex]?.type === "video" ? (
                    <Video
                      key={medias[mediaIndex].url}
                      src={medias[mediaIndex].url}
                      controls
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <MainImage
                      src={medias[mediaIndex]?.url}
                      alt={modeleSelectionne.title}
                    />
                  )
                ) : (
                  <NoImage>Aucune image disponible</NoImage>
                )}

                {medias.length > 1 && (
                  <DotsContainer>
                    {medias.map((media, index) => (
                      <Dot
                        key={`${media.url}-${index}`}
                        $active={mediaIndex === index}
                        $video={media.type === "video"}
                        onClick={() => setMediaIndex(index)}
                        aria-label={
                          media.type === "video"
                            ? "Afficher la vidéo"
                            : `Afficher l'image ${index + 1}`
                        }
                      >
                        {media.type === "video" ? "▶" : ""}
                      </Dot>
                    ))}
                  </DotsContainer>
                )}
              </MediaContainer>

              {medias.length > 1 && (
                <MediaDescription>
                  <MediaCurrent>
                    {medias[mediaIndex]?.type === "video"
                      ? "Vidéo du modèle"
                      : `Photo ${mediaIndex + 1}`}
                  </MediaCurrent>

                  <MediaHint>
                    Touchez les points pour changer de média
                  </MediaHint>
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
                {modeleSelectionne.description}
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
                      </ChoiceButton>
                    ))}
                  </ChoiceGrid>
                </FieldGroup>
              )}

              {/* =================================================
                  STOCK DE LA VARIATION
              ================================================= */}

              <StockCard $available={stockDisponible > 0}>
                <StockTop>
                  <StockLabel>STOCK DISPONIBLE</StockLabel>

                  <StockNumber $available={stockDisponible > 0}>
                    {stockDisponible}
                  </StockNumber>
                </StockTop>

                {tailleSelectionnee || couleurSelectionnee ? (
                  <StockVariation>
                    Variation sélectionnée :
                    <strong>
                      {" "}
                      {tailleSelectionnee || "—"}
                      {couleurSelectionnee ? ` • ${couleurSelectionnee}` : ""}
                    </strong>
                  </StockVariation>
                ) : (
                  <StockVariation>
                    Sélectionnez une variation pour voir le stock.
                  </StockVariation>
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
                  FORMULAIRE PAIEMENT
              ================================================= */}

              <Form onSubmit={envoyerPrecommande}>
                <FormTitle>Informations du dépôt</FormTitle>
                <DepotInfoBox>
                  <DepotInfoTitle>Effectuez votre dépôt</DepotInfoTitle>

                  <DepotInfoText>
                    Envoyez le montant du dépôt sur le numéro suivant :
                  </DepotInfoText>

                  {loadingDepot ? (
                    <DepotLoading>
                      Chargement du numéro de dépôt...
                    </DepotLoading>
                  ) : informationsDepot?.numeroDepot ? (
                    <DepotNumber>{informationsDepot.numeroDepot}</DepotNumber>
                  ) : (
                    <DepotError>
                      Le numéro de dépôt est momentanément indisponible.
                    </DepotError>
                  )}

                  <DepotWarning>
                    Après avoir effectué le dépôt, renseignez ci-dessous le
                    numéro utilisé pour effectuer le paiement ainsi que la
                    référence de la transaction.
                  </DepotWarning>
                </DepotInfoBox>

                <FormTitle>Informations du dépôt</FormTitle>

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
                    "Confirmer la précommande"
                  )}
                </SubmitButton>

                <SecurityText>
                  Votre précommande sera vérifiée par notre équipe avant
                  validation définitive.
                </SecurityText>
              </Form>
            </InformationSection>
          </DetailGrid>
        </DetailContainer>
      )}
    </PageContainer>
  );
};

/* ============================================================
   STYLES
============================================================ */

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  padding: 45px 25px 80px;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 45px;
  text-align: center;
`;

const SmallTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #777;
  margin-bottom: 10px;
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: 42px;
  color: #1e1e1e;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  max-width: 650px;
  margin: 15px auto 0;
  color: #777;
  line-height: 1.7;
`;

const ModelesGrid = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;

  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const ModelCard = styled.article`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #ececec;
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  }
`;

const CardImageContainer = styled.div`
  position: relative;
  height: 360px;
  background: #eeeeee;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #eeeeee;
`;

const PrecommandeBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: #111;
  color: white;
  padding: 8px 12px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const CardContent = styled.div`
  padding: 22px;
`;

const CardTitle = styled.h2`
  margin: 0 0 10px;
  color: #222;
  font-size: 21px;
`;

const CardDescription = styled.p`
  color: #777;
  font-size: 14px;
  line-height: 1.6;
  min-height: 68px;
`;

const CardInfo = styled.div`
  margin-top: 18px;
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const Deposit = styled.div`
  margin-top: 5px;
  color: #777;
  font-size: 13px;
`;

const Availability = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  background: #f6f6f6;
  border-radius: 8px;
  font-size: 12px;
  color: #555;
`;

const VariationSummary = styled.div`
  margin-top: 16px;
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
  font-weight: 700;
  color: #333;
`;

const VariationValues = styled.span`
  color: #777;
`;

const ActionButton = styled.button`
  width: 100%;
  border: none;
  background: #111;
  color: white;
  padding: 14px;
  border-radius: 10px;
  margin-top: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #333;
  }
`;

const DetailContainer = styled.div`
  max-width: 1250px;
  margin: auto;
`;

const BackButton = styled.button`
  border: none;
  background: transparent;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 25px;
  padding: 8px 0;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 45px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MediaSection = styled.div`
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
  background: #eeeeee;
  border-radius: 22px;
  overflow: hidden;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  border-radius: 30px;
`;

const Dot = styled.button`
  width: ${(props) => (props.$video ? "30px" : "9px")};
  height: ${(props) => (props.$video ? "30px" : "9px")};
  border-radius: 50%;
  border: none;

  background: ${(props) =>
    props.$active
      ? "#ffffff"
      : props.$video
        ? "rgba(255,255,255,0.7)"
        : "rgba(255,255,255,0.5)"};

  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${(props) => (props.$video ? "10px" : "0")};

  padding: 0;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }
`;

const MediaDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 5px;
`;

const MediaCurrent = styled.span`
  font-weight: 700;
  color: #333;
  font-size: 13px;
`;

const MediaHint = styled.span`
  color: #999;
  font-size: 11px;
`;

const InformationSection = styled.div`
  background: white;
  border-radius: 22px;
  padding: 30px;
  border: 1px solid #ececec;

  @media (max-width: 600px) {
    padding: 22px;
  }
`;

const PrecommandeLabel = styled.div`
  display: inline-flex;
  background: #111;
  color: white;
  border-radius: 20px;
  padding: 7px 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const DetailTitle = styled.h2`
  margin: 15px 0 10px;
  font-size: 32px;
  color: #1d1d1d;
`;

const DetailDescription = styled.p`
  color: #777;
  line-height: 1.7;
  margin-bottom: 20px;
`;

const PriceBlock = styled.div`
  padding: 18px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const CurrentPrice = styled.div`
  font-size: 27px;
  font-weight: 800;
  color: #111;
`;

const DepositText = styled.div`
  margin-top: 7px;
  color: #777;
  font-size: 13px;
`;

const DateBox = styled.div`
  margin-top: 18px;
  background: #f7f7f7;
  padding: 15px;
  border-radius: 12px;
`;

const DateLabel = styled.div`
  font-size: 10px;
  font-weight: 800;
  color: #888;
  letter-spacing: 1px;
`;

const DateValue = styled.div`
  margin-top: 5px;
  font-weight: 700;
  color: #333;
`;

const FieldGroup = styled.div`
  margin-top: 23px;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #222;
  font-size: 13px;
  font-weight: 700;
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
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;

  &:hover {
    border-color: #111;
  }
`;

const ColorCircle = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: currentColor;
  border: 1px solid rgba(0, 0, 0, 0.15);
`;

const StockCard = styled.div`
  margin-top: 22px;
  padding: 17px;
  border-radius: 13px;

  background: ${(props) => (props.$available ? "#f3f8f3" : "#fff2f2")};

  border: 1px solid ${(props) => (props.$available ? "#dceadc" : "#f1d2d2")};
`;

const StockTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockLabel = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #777;
`;

const StockNumber = styled.span`
  font-size: 22px;
  font-weight: 800;

  color: ${(props) => (props.$available ? "#26733a" : "#b33a3a")};
`;

const StockVariation = styled.div`
  margin-top: 7px;
  color: #777;
  font-size: 12px;

  strong {
    color: #333;
  }
`;

const QuantityContainer = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 42px;
  height: 42px;
  border: none;
  background: #f5f5f5;
  font-size: 20px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
`;

const QuantityValue = styled.div`
  width: 55px;
  text-align: center;
  font-weight: 700;
`;

const SummaryBox = styled.div`
  margin-top: 25px;
  padding: 18px;
  background: #f7f7f7;
  border-radius: 13px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  font-size: 13px;
  color: #666;

  strong {
    color: #222;
  }
`;

const SummaryTotal = styled.div`
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid #ddd;

  display: flex;
  justify-content: space-between;

  font-size: 15px;
  font-weight: 800;
  color: #111;
`;

const Form = styled.form`
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid #eee;
`;

const FormTitle = styled.h3`
  margin: 0 0 5px;
  font-size: 18px;
  color: #222;
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
  border: 1px solid ${(props) => (props.$active ? "#111" : "#ddd")};

  background: ${(props) => (props.$active ? "#f4f4f4" : "#fff")};

  border-radius: 12px;
  padding: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-align: left;
`;

const PaymentLogo = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #111;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
`;

const PaymentName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #222;
`;

const PaymentSmall = styled.div`
  margin-top: 2px;
  color: #999;
  font-size: 10px;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  background: white;

  &:focus {
    border-color: #111;
  }
`;

const FormError = styled.div`
  margin-top: 18px;
  background: #fff1f1;
  border: 1px solid #f0d0d0;
  color: #b33131;
  padding: 13px;
  border-radius: 10px;
  font-size: 13px;
`;

const FormSuccess = styled.div`
  margin-top: 18px;
  background: #eff9f0;
  border: 1px solid #d5ead7;
  color: #287038;
  padding: 13px;
  border-radius: 10px;
  font-size: 13px;
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 20px;
  height: 53px;
  border: none;
  border-radius: 11px;
  background: #111;
  color: white;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: #292929;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SecurityText = styled.p`
  text-align: center;
  color: #999;
  font-size: 11px;
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
  font-size: 14px;
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
`;

const SuccessIcon = styled.div`
  width: 25px;
  height: 25px;
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
  }
`;

const EmptyIcon = styled.div`
  font-size: 45px;
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
const DepotInfoBox = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f8fafc;
`;

const DepotInfoTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const DepotInfoText = styled.p`
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
`;

const DepotNumber = styled.div`
  padding: 14px 16px;
  border-radius: 10px;
  background: white;
  border: 1px solid #dbe3ea;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
  text-align: center;
  color: #111827;
`;

const DepotLoading = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: white;
  color: #6b7280;
  text-align: center;
  font-size: 14px;
`;

const DepotError = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
`;

const DepotWarning = styled.p`
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
`;

export default Precommande;
