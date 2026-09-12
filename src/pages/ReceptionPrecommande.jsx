import React, { useEffect, useState } from "react";
import styled from "styled-components";

const API_URL = import.meta.env.VITE_API_URL;

const ReceptionPrecommande = () => {
  const [precommandes, setPrecommandes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  const [statutFiltre, setStatutFiltre] = useState("ALL");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [precommandeSelectionnee, setPrecommandeSelectionnee] =
    useState(null);

  const [adminComment, setAdminComment] = useState("");

  /* =========================================================
     TOKEN ADMIN
  ========================================================= */

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  /* =========================================================
     PAIEMENTS
  ========================================================= */

  const getPaiementDepot = (precommande) => {
    return (
      precommande?.paiements?.find(
        (paiement) => paiement.type === "DEPOT",
      ) ||
      precommande?.paiements?.[0] ||
      null
    );
  };

  /*
   * IMPORTANT :
   * Le backend peut avoir plusieurs paiements SOLDE.
   * On prend donc toujours le dernier.
   */
  const getPaiementSolde = (precommande) => {
    const paiements = precommande?.paiements || [];

    return (
      [...paiements]
        .reverse()
        .find((paiement) => paiement.type === "SOLDE") || null
    );
  };

  const getServicePaiement = (precommande) => {
    return getPaiementDepot(precommande)?.service || "";
  };

  const getNumeroPaiement = (precommande) => {
    return getPaiementDepot(precommande)?.numeroClient || "";
  };

  const getReferencePaiement = (precommande) => {
    return getPaiementDepot(precommande)?.reference || "";
  };

  const getMontantPaiement = (precommande) => {
    const paiement = getPaiementDepot(precommande);

    return (
      paiement?.montantEnvoye ??
      precommande?.montantDepot ??
      0
    );
  };

  const getServiceSolde = (precommande) => {
    return getPaiementSolde(precommande)?.service || "";
  };

  const getNumeroSolde = (precommande) => {
    return getPaiementSolde(precommande)?.numeroClient || "";
  };

  const getReferenceSolde = (precommande) => {
    return getPaiementSolde(precommande)?.reference || "";
  };

  const getMontantSoldeEnvoye = (precommande) => {
    const paiement = getPaiementSolde(precommande);

    return paiement?.montantEnvoye ?? 0;
  };

  const getMontantSoldeAttendu = (precommande) => {
    const paiement = getPaiementSolde(precommande);

    return (
      paiement?.montantAttendu ??
      precommande?.montantSolde ??
      0
    );
  };

  const getStatutSolde = (precommande) => {
    return getPaiementSolde(precommande)?.status || "";
  };

  /* =========================================================
     CHARGER LES PRÉCOMMANDES
  ========================================================= */

  const chargerPrecommandes = async (pageActuelle = page) => {
    try {
      setLoading(true);
      setErreur("");

      const token = getToken();

      if (!token) {
        setErreur("Session administrateur introuvable.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/precommandes/admin/liste?page=${pageActuelle}&limit=20`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de récupérer les précommandes.",
        );
      }

      setPrecommandes(data.precommandes || []);
      setTotal(data.total || 0);
      setPage(data.page || pageActuelle);
      setPages(data.pages || 1);

      /*
       * Si le détail est ouvert, on actualise également
       * la précommande sélectionnée.
       */
      if (precommandeSelectionnee?._id) {
        const updated = (data.precommandes || []).find(
          (item) => item._id === precommandeSelectionnee._id,
        );

        if (updated) {
          setPrecommandeSelectionnee(updated);
        }
      }
    } catch (error) {
      console.error(error);

      setErreur(
        error.message ||
          "Erreur lors du chargement des précommandes.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerPrecommandes(1);
  }, []);

  /* =========================================================
     FILTRE
  ========================================================= */

  const precommandesFiltrees = precommandes.filter(
    (precommande) => {
      if (statutFiltre === "ALL") {
        return true;
      }

      return precommande.statut === statutFiltre;
    },
  );

  /* =========================================================
     OUVRIR DÉTAIL
  ========================================================= */

  const ouvrirDetail = (precommande) => {
    setPrecommandeSelectionnee(precommande);
    setAdminComment(precommande.adminComment || "");
    setMessage("");
    setErreur("");
  };

  /* =========================================================
     FERMER DÉTAIL
  ========================================================= */

  const fermerDetail = () => {
    if (actionLoading) return;

    setPrecommandeSelectionnee(null);
    setAdminComment("");
    setMessage("");
    setErreur("");
  };

  /* =========================================================
     ACCEPTER PRÉCOMMANDE
  ========================================================= */

  const accepter = async () => {
    if (!precommandeSelectionnee) return;

    try {
      setActionLoading(true);
      setErreur("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Session administrateur introuvable.",
        );
      }

      const response = await fetch(
        `${API_URL}/api/precommandes/admin/${precommandeSelectionnee._id}/accepter`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminComment,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'accepter la précommande.",
        );
      }

      setMessage(
        "Précommande acceptée avec succès.",
      );

      setPrecommandeSelectionnee(
        data.precommande ||
          precommandeSelectionnee,
      );

      await chargerPrecommandes(page);
    } catch (error) {
      console.error(error);

      setErreur(
        error.message ||
          "Erreur lors de l'acceptation.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     REFUSER PRÉCOMMANDE
  ========================================================= */

  const refuser = async () => {
    if (!precommandeSelectionnee) return;

    const confirmation = window.confirm(
      "Voulez-vous vraiment refuser cette précommande ?",
    );

    if (!confirmation) return;

    try {
      setActionLoading(true);
      setErreur("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Session administrateur introuvable.",
        );
      }

      const response = await fetch(
        `${API_URL}/api/precommandes/admin/${precommandeSelectionnee._id}/refuser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminComment,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de refuser la précommande.",
        );
      }

      setMessage("Précommande refusée.");

      setPrecommandeSelectionnee(
        data.precommande ||
          precommandeSelectionnee,
      );

      await chargerPrecommandes(page);
    } catch (error) {
      console.error(error);

      setErreur(
        error.message ||
          "Erreur lors du refus.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     CONFIRMER LE SOLDE
  ========================================================= */

  const confirmerSolde = async () => {
    if (!precommandeSelectionnee) return;

    const paiementSolde = getPaiementSolde(
      precommandeSelectionnee,
    );

    if (!paiementSolde) {
      setErreur(
        "Aucun paiement de solde trouvé pour cette précommande.",
      );
      return;
    }

    const confirmation = window.confirm(
      `Confirmer le paiement du solde de ${formatPrix(
        paiementSolde.montantEnvoye,
      )} FCFA ?\n\nCette action créera automatiquement la commande finale.`,
    );

    if (!confirmation) return;

    try {
      setActionLoading(true);
      setErreur("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Session administrateur introuvable.",
        );
      }

      const response = await fetch(
        `${API_URL}/api/precommandes/admin/${precommandeSelectionnee._id}/confirmer-solde`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de confirmer le solde.",
        );
      }

      setMessage(
        data.message ||
          "Solde confirmé. La commande finale a été créée.",
      );

      setPrecommandeSelectionnee(
        data.precommande ||
          precommandeSelectionnee,
      );

      await chargerPrecommandes(page);
    } catch (error) {
      console.error(
        "❌ Confirmation solde :",
        error,
      );

      setErreur(
        error.message ||
          "Erreur lors de la confirmation du solde.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     REJETER LE SOLDE
  ========================================================= */

  const rejeterSolde = async () => {
    if (!precommandeSelectionnee) return;

    const paiementSolde = getPaiementSolde(
      precommandeSelectionnee,
    );

    if (!paiementSolde) {
      setErreur(
        "Aucun paiement de solde trouvé pour cette précommande.",
      );
      return;
    }

    const confirmation = window.confirm(
      "Voulez-vous vraiment rejeter ce paiement de solde ?\n\nLe client pourra effectuer un nouveau paiement du solde.",
    );

    if (!confirmation) return;

    try {
      setActionLoading(true);
      setErreur("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Session administrateur introuvable.",
        );
      }

      const response = await fetch(
        `${API_URL}/api/precommandes/admin/${precommandeSelectionnee._id}/rejeter-solde`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminComment,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de rejeter le solde.",
        );
      }

      setMessage(
        data.message ||
          "Paiement du solde rejeté.",
      );

      setPrecommandeSelectionnee(
        data.precommande ||
          precommandeSelectionnee,
      );

      await chargerPrecommandes(page);
    } catch (error) {
      console.error(
        "❌ Rejet solde :",
        error,
      );

      setErreur(
        error.message ||
          "Erreur lors du rejet du solde.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     IMAGE
  ========================================================= */

  const getImage = (precommande) => {
    if (precommande?.modele?.image) {
      return precommande.modele.image;
    }

    if (precommande?.produitId?.image) {
      return precommande.produitId.image;
    }

    if (
      precommande?.produitId?.images &&
      precommande.produitId.images.length > 0
    ) {
      return (
        precommande.produitId.images.find(
          (image) => image.isMain,
        )?.url ||
        precommande.produitId.images[0]?.url ||
        ""
      );
    }

    return "";
  };

  /* =========================================================
     NOM PRODUIT
  ========================================================= */

  const getNomProduit = (precommande) => {
    return (
      precommande?.modele?.title ||
      precommande?.produitId?.title ||
      "Modèle"
    );
  };

  /* =========================================================
     PRIX PRODUIT
  ========================================================= */

  const getPrixProduit = (precommande) => {
    return (
      precommande?.modele?.prix ??
      precommande?.modele?.price ??
      precommande?.produitId?.price ??
      0
    );
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /* =========================================================
     FORMAT PRIX
  ========================================================= */

  const formatPrix = (prix) => {
    return Number(prix || 0).toLocaleString(
      "fr-FR",
    );
  };

  /* =========================================================
     NOM SERVICE
  ========================================================= */

  const getNomService = (service) => {
    if (service === "orange") {
      return "Orange Money";
    }

    if (service === "wave") {
      return "Wave";
    }

    return service || "—";
  };

  /* =========================================================
     STATUT
  ========================================================= */

  const getStatutLabel = (statut) => {
    switch (statut) {
      case "PENDING":
        return "En attente";

      case "ACCEPTED":
        return "Acceptée";

      case "READY_TO_FINALIZE":
        return "Prête à finaliser";

      case "FINALIZATION_PENDING":
        return "Solde en attente";

      case "FINALIZED":
        return "Finalisée";

      case "REJECTED":
        return "Refusée";

      case "CANCELLED":
        return "Annulée";

      default:
        return statut || "Inconnu";
    }
  };

  /* =========================================================
     STATUT PAIEMENT SOLDE
  ========================================================= */

  const getStatutSoldeLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "En attente de vérification";

      case "CONFIRMED":
        return "Confirmé";

      case "REJECTED":
        return "Rejeté";

      default:
        return "—";
    }
  };

  /* =========================================================
     STATISTIQUES
  ========================================================= */

  const pendingCount = precommandes.filter(
    (item) => item.statut === "PENDING",
  ).length;

  const acceptedCount = precommandes.filter(
    (item) =>
      item.statut === "ACCEPTED" ||
      item.statut === "READY_TO_FINALIZE",
  ).length;

  const soldePendingCount = precommandes.filter(
    (item) =>
      item.statut === "FINALIZATION_PENDING",
  ).length;

  const finalizedCount = precommandes.filter(
    (item) => item.statut === "FINALIZED",
  ).length;

  const rejectedCount = precommandes.filter(
    (item) => item.statut === "REJECTED",
  ).length;

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading &&
    precommandes.length === 0
  ) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>
          Chargement des précommandes...
        </LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header>
        <div>
          <SmallLabel>
            ESPACE ADMINISTRATEUR
          </SmallLabel>

          <Title>
            Précommandes reçues
          </Title>

          <Subtitle>
            Consultez, vérifiez et validez les
            précommandes envoyées par vos clients.
          </Subtitle>
        </div>

        <RefreshButton
          onClick={() =>
            chargerPrecommandes(page)
          }
          disabled={loading}
        >
          {loading
            ? "Actualisation..."
            : "Actualiser"}
        </RefreshButton>
      </Header>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <SuccessMessage>
          ✓ {message}
        </SuccessMessage>
      )}

      {erreur && (
        <ErrorMessage>
          {erreur}
        </ErrorMessage>
      )}

      {/* =====================================================
          STATISTIQUES
      ===================================================== */}

      <StatsGrid>
        <StatCard>
          <StatNumber>
            {total}
          </StatNumber>

          <StatLabel>
            Total
          </StatLabel>
        </StatCard>

        <StatCard $pending>
          <StatNumber>
            {pendingCount}
          </StatNumber>

          <StatLabel>
            En attente
          </StatLabel>
        </StatCard>

        <StatCard $accepted>
          <StatNumber>
            {acceptedCount}
          </StatNumber>

          <StatLabel>
            Acceptées / disponibles
          </StatLabel>
        </StatCard>

        <StatCard $solde>
          <StatNumber>
            {soldePendingCount}
          </StatNumber>

          <StatLabel>
            Solde à vérifier
          </StatLabel>
        </StatCard>

        <StatCard $finalized>
          <StatNumber>
            {finalizedCount}
          </StatNumber>

          <StatLabel>
            Finalisées
          </StatLabel>
        </StatCard>

        <StatCard $rejected>
          <StatNumber>
            {rejectedCount}
          </StatNumber>

          <StatLabel>
            Refusées
          </StatLabel>
        </StatCard>
      </StatsGrid>

      {/* =====================================================
          FILTRES
      ===================================================== */}

      <FilterBar>
        <FilterTitle>
          Filtrer
        </FilterTitle>

        <FilterButton
          $active={
            statutFiltre === "ALL"
          }
          onClick={() =>
            setStatutFiltre("ALL")
          }
        >
          Toutes
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre === "PENDING"
          }
          onClick={() =>
            setStatutFiltre("PENDING")
          }
        >
          En attente
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre === "ACCEPTED"
          }
          onClick={() =>
            setStatutFiltre("ACCEPTED")
          }
        >
          Acceptées
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre ===
            "READY_TO_FINALIZE"
          }
          onClick={() =>
            setStatutFiltre(
              "READY_TO_FINALIZE",
            )
          }
        >
          Prêtes à finaliser
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre ===
            "FINALIZATION_PENDING"
          }
          onClick={() =>
            setStatutFiltre(
              "FINALIZATION_PENDING",
            )
          }
        >
          Solde à vérifier
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre ===
            "FINALIZED"
          }
          onClick={() =>
            setStatutFiltre(
              "FINALIZED",
            )
          }
        >
          Finalisées
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre ===
            "REJECTED"
          }
          onClick={() =>
            setStatutFiltre(
              "REJECTED",
            )
          }
        >
          Refusées
        </FilterButton>

        <FilterButton
          $active={
            statutFiltre ===
            "CANCELLED"
          }
          onClick={() =>
            setStatutFiltre(
              "CANCELLED",
            )
          }
        >
          Annulées
        </FilterButton>
      </FilterBar>

      {/* =====================================================
          LISTE
      ===================================================== */}

      <ContentCard>
        <TableHeader>
          <span>CLIENT</span>
          <span>MODÈLE</span>
          <span>VARIATION</span>
          <span>DÉPÔT</span>
          <span>STATUT</span>
          <span>DATE</span>
          <span></span>
        </TableHeader>

        {precommandesFiltrees.length ===
        0 ? (
          <EmptyState>
            <EmptyIcon>
              ◌
            </EmptyIcon>

            <EmptyTitle>
              Aucune précommande
            </EmptyTitle>

            <EmptyText>
              Aucune demande ne correspond
              au filtre sélectionné.
            </EmptyText>
          </EmptyState>
        ) : (
          precommandesFiltrees.map(
            (precommande) => (
              <PrecommandeRow
                key={
                  precommande._id
                }
                onClick={() =>
                  ouvrirDetail(
                    precommande,
                  )
                }
              >
                {/* CLIENT */}

                <ClientCell>
                  <Avatar>
                    {(
                      precommande
                        .clientId
                        ?.username ||
                      "C"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>

                  <ClientInfo>
                    <ClientName>
                      {precommande
                        .clientId
                        ?.username ||
                        "Client"}
                    </ClientName>

                    <ClientEmail>
                      {precommande
                        .clientId
                        ?.email ||
                        "—"}
                    </ClientEmail>
                  </ClientInfo>
                </ClientCell>

                {/* MODÈLE */}

                <ProductCell>
                  <ProductImage>
                    {getImage(
                      precommande,
                    ) ? (
                      <img
                        src={getImage(
                          precommande,
                        )}
                        alt={getNomProduit(
                          precommande,
                        )}
                      />
                    ) : (
                      <NoProductImage>
                        —
                      </NoProductImage>
                    )}
                  </ProductImage>

                  <ProductName>
                    {getNomProduit(
                      precommande,
                    )}
                  </ProductName>
                </ProductCell>

                {/* VARIATION */}

                <VariationCell>
                  {precommande.taille && (
                    <VariationTag>
                      Taille :{" "}
                      {
                        precommande.taille
                      }
                    </VariationTag>
                  )}

                  {precommande.couleur && (
                    <VariationTag>
                      Couleur :{" "}
                      {
                        precommande.couleur
                      }
                    </VariationTag>
                  )}

                  <QuantityText>
                    ×{" "}
                    {
                      precommande.quantite ||
                      1
                    }
                  </QuantityText>
                </VariationCell>

                {/* DÉPÔT */}

                <DepositCell>
                  <DepositAmount>
                    {formatPrix(
                      getMontantPaiement(
                        precommande,
                      ),
                    )}{" "}
                    FCFA
                  </DepositAmount>

                  <PaymentMethod>
                    {getNomService(
                      getServicePaiement(
                        precommande,
                      ),
                    )}
                  </PaymentMethod>

                  <DepositSmallInfo>
                    N° :{" "}
                    {getNumeroPaiement(
                      precommande,
                    ) || "—"}
                  </DepositSmallInfo>

                  <DepositSmallInfo>
                    Réf. :{" "}
                    {getReferencePaiement(
                      precommande,
                    ) || "—"}
                  </DepositSmallInfo>
                </DepositCell>

                {/* STATUT */}

                <StatusCell>
                  <StatusBadge
                    $status={
                      precommande.statut
                    }
                  >
                    {getStatutLabel(
                      precommande.statut,
                    )}
                  </StatusBadge>
                </StatusCell>

                {/* DATE */}

                <DateCell>
                  {formatDate(
                    precommande.createdAt,
                  )}
                </DateCell>

                {/* ACTION */}

                <ViewCell>
                  <ViewButton
                    onClick={(e) => {
                      e.stopPropagation();

                      ouvrirDetail(
                        precommande,
                      );
                    }}
                  >
                    Voir
                  </ViewButton>
                </ViewCell>
              </PrecommandeRow>
            ),
          )
        )}
      </ContentCard>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {pages > 1 && (
        <Pagination>
          <PageButton
            disabled={
              page <= 1 || loading
            }
            onClick={() =>
              chargerPrecommandes(
                page - 1,
              )
            }
          >
            Précédent
          </PageButton>

          <PageInfo>
            Page {page} / {pages}
          </PageInfo>

          <PageButton
            disabled={
              page >= pages ||
              loading
            }
            onClick={() =>
              chargerPrecommandes(
                page + 1,
              )
            }
          >
            Suivant
          </PageButton>
        </Pagination>
      )}

      {/* =====================================================
          MODAL DÉTAIL
      ===================================================== */}

      {precommandeSelectionnee && (
        <ModalOverlay
          onClick={fermerDetail}
        >
          <Modal
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <ModalHeader>
              <div>
                <ModalLabel>
                  PRÉCOMMANDE
                </ModalLabel>

                <ModalTitle>
                  Détails de la demande
                </ModalTitle>
              </div>

              <CloseButton
                onClick={fermerDetail}
                disabled={
                  actionLoading
                }
              >
                ×
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* =================================================
                  PRODUIT
              ================================================= */}

              <ProductHero>
                <LargeProductImage>
                  {getImage(
                    precommandeSelectionnee,
                  ) ? (
                    <img
                      src={getImage(
                        precommandeSelectionnee,
                      )}
                      alt={getNomProduit(
                        precommandeSelectionnee,
                      )}
                    />
                  ) : (
                    <NoProductImage>
                      —
                    </NoProductImage>
                  )}
                </LargeProductImage>

                <ProductHeroInfo>
                  <ProductHeroTitle>
                    {getNomProduit(
                      precommandeSelectionnee,
                    )}
                  </ProductHeroTitle>

                  <ProductPrice>
                    {formatPrix(
                      getPrixProduit(
                        precommandeSelectionnee,
                      ),
                    )}{" "}
                    FCFA
                  </ProductPrice>

                  <StatusBadge
                    $status={
                      precommandeSelectionnee.statut
                    }
                  >
                    {getStatutLabel(
                      precommandeSelectionnee.statut,
                    )}
                  </StatusBadge>
                </ProductHeroInfo>
              </ProductHero>

              {/* =================================================
                  CLIENT
              ================================================= */}

              <Section>
                <SectionTitle>
                  Informations client
                </SectionTitle>

                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>
                      Nom / pseudo
                    </InfoLabel>

                    <InfoValue>
                      {precommandeSelectionnee
                        .clientId
                        ?.username ||
                        "—"}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Email
                    </InfoLabel>

                    <InfoValue>
                      {precommandeSelectionnee
                        .clientId
                        ?.email ||
                        "—"}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Téléphone
                    </InfoLabel>

                    <InfoValue>
                      {precommandeSelectionnee
                        .clientId
                        ?.telephone ||
                        precommandeSelectionnee
                          .clientId
                          ?.phone ||
                        "—"}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Date de demande
                    </InfoLabel>

                    <InfoValue>
                      {formatDate(
                        precommandeSelectionnee.createdAt,
                      )}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </Section>

              {/* =================================================
                  VARIATION
              ================================================= */}

              <Section>
                <SectionTitle>
                  Choix du client
                </SectionTitle>

                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>
                      Taille
                    </InfoLabel>

                    <InfoValue>
                      {precommandeSelectionnee.taille ||
                        "—"}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Couleur
                    </InfoLabel>

                    <InfoValue>
                      {precommandeSelectionnee.couleur ||
                        "—"}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Quantité
                    </InfoLabel>

                    <InfoValue>
                      {precommandeSelectionnee.quantite ||
                        1}
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Prix unitaire
                    </InfoLabel>

                    <InfoValue>
                      {formatPrix(
                        getPrixProduit(
                          precommandeSelectionnee,
                        ),
                      )}{" "}
                      FCFA
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Montant total
                    </InfoLabel>

                    <InfoValue>
                      {formatPrix(
                        Number(
                          getPrixProduit(
                            precommandeSelectionnee,
                          ),
                        ) *
                          Number(
                            precommandeSelectionnee.quantite ||
                              1,
                          ),
                      )}{" "}
                      FCFA
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Dépôt demandé
                    </InfoLabel>

                    <InfoValue>
                      {formatPrix(
                        precommandeSelectionnee.montantDepot ||
                          0,
                      )}{" "}
                      FCFA
                    </InfoValue>
                  </InfoItem>

                  <InfoItem>
                    <InfoLabel>
                      Solde à payer
                    </InfoLabel>

                    <DepositBig>
                      {formatPrix(
                        precommandeSelectionnee.montantSolde ||
                          0,
                      )}{" "}
                      FCFA
                    </DepositBig>
                  </InfoItem>
                </InfoGrid>
              </Section>

              {/* =================================================
                  DÉPÔT
              ================================================= */}

              <Section>
                <SectionTitle>
                  Informations du dépôt
                </SectionTitle>

                <PaymentBox>
                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel>
                        Service choisi
                      </InfoLabel>

                      <InfoValue>
                        {getNomService(
                          getServicePaiement(
                            precommandeSelectionnee,
                          ),
                        )}
                      </InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        Numéro utilisé
                      </InfoLabel>

                      <InfoValue>
                        {getNumeroPaiement(
                          precommandeSelectionnee,
                        ) || "—"}
                      </InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        Référence du dépôt
                      </InfoLabel>

                      <ReferenceValue>
                        {getReferencePaiement(
                          precommandeSelectionnee,
                        ) || "—"}
                      </ReferenceValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        Montant envoyé
                      </InfoLabel>

                      <DepositBig>
                        {formatPrix(
                          getMontantPaiement(
                            precommandeSelectionnee,
                          ),
                        )}{" "}
                        FCFA
                      </DepositBig>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        Montant attendu
                      </InfoLabel>

                      <InfoValue>
                        {formatPrix(
                          getPaiementDepot(
                            precommandeSelectionnee,
                          )?.montantAttendu ??
                            precommandeSelectionnee.montantDepot ??
                            0,
                        )}{" "}
                        FCFA
                      </InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel>
                        Statut du dépôt
                      </InfoLabel>

                      <PaymentStatus
                        $status={
                          getPaiementDepot(
                            precommandeSelectionnee,
                          )?.status
                        }
                      >
                        {getPaiementDepot(
                          precommandeSelectionnee,
                        )?.status ===
                        "CONFIRMED"
                          ? "✓ Confirmé"
                          : getPaiementDepot(
                                precommandeSelectionnee,
                              )?.status ===
                              "REJECTED"
                            ? "✕ Rejeté"
                            : "⏳ En attente"}
                      </PaymentStatus>
                    </InfoItem>
                  </InfoGrid>
                </PaymentBox>
              </Section>

              {/* =================================================
                  SOLDE
              ================================================= */}

              {getPaiementSolde(
                precommandeSelectionnee,
              ) && (
                <Section>
                  <SectionTitle>
                    Informations du solde
                  </SectionTitle>

                  <SoldePaymentBox
                    $pending={
                      getStatutSolde(
                        precommandeSelectionnee,
                      ) === "PENDING"
                    }
                  >
                    <SoldeHeader>
                      <div>
                        <SoldeTitle>
                          Paiement du solde
                        </SoldeTitle>

                        <SoldeSubtitle>
                          {getStatutSoldeLabel(
                            getStatutSolde(
                              precommandeSelectionnee,
                            ),
                          )}
                        </SoldeSubtitle>
                      </div>

                      <SoldeStatusBadge
                        $status={
                          getStatutSolde(
                            precommandeSelectionnee,
                          )
                        }
                      >
                        {getStatutSoldeLabel(
                          getStatutSolde(
                            precommandeSelectionnee,
                          ),
                        )}
                      </SoldeStatusBadge>
                    </SoldeHeader>

                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>
                          Service
                        </InfoLabel>

                        <InfoValue>
                          {getNomService(
                            getServiceSolde(
                              precommandeSelectionnee,
                            ),
                          )}
                        </InfoValue>
                      </InfoItem>

                      <InfoItem>
                        <InfoLabel>
                          Numéro utilisé
                        </InfoLabel>

                        <InfoValue>
                          {getNumeroSolde(
                            precommandeSelectionnee,
                          ) || "—"}
                        </InfoValue>
                      </InfoItem>

                      <InfoItem>
                        <InfoLabel>
                          Référence du paiement
                        </InfoLabel>

                        <ReferenceValue>
                          {getReferenceSolde(
                            precommandeSelectionnee,
                          ) || "—"}
                        </ReferenceValue>
                      </InfoItem>

                      <InfoItem>
                        <InfoLabel>
                          Montant envoyé
                        </InfoLabel>

                        <DepositBig>
                          {formatPrix(
                            getMontantSoldeEnvoye(
                              precommandeSelectionnee,
                            ),
                          )}{" "}
                          FCFA
                        </DepositBig>
                      </InfoItem>

                      <InfoItem>
                        <InfoLabel>
                          Montant attendu
                        </InfoLabel>

                        <InfoValue>
                          {formatPrix(
                            getMontantSoldeAttendu(
                              precommandeSelectionnee,
                            ),
                          )}{" "}
                          FCFA
                        </InfoValue>
                      </InfoItem>

                      <InfoItem>
                        <InfoLabel>
                          Envoyé le
                        </InfoLabel>

                        <InfoValue>
                          {formatDate(
                            getPaiementSolde(
                              precommandeSelectionnee,
                            )?.submittedAt,
                          )}
                        </InfoValue>
                      </InfoItem>

                      {getPaiementSolde(
                        precommandeSelectionnee,
                      )?.confirmedAt && (
                        <InfoItem>
                          <InfoLabel>
                            Confirmé le
                          </InfoLabel>

                          <InfoValue>
                            {formatDate(
                              getPaiementSolde(
                                precommandeSelectionnee,
                              )?.confirmedAt,
                            )}
                          </InfoValue>
                        </InfoItem>
                      )}

                      {getPaiementSolde(
                        precommandeSelectionnee,
                      )?.adminComment && (
                        <InfoItem>
                          <InfoLabel>
                            Commentaire du paiement
                          </InfoLabel>

                          <InfoValue>
                            {
                              getPaiementSolde(
                                precommandeSelectionnee,
                              )?.adminComment
                            }
                          </InfoValue>
                        </InfoItem>
                      )}
                    </InfoGrid>

                    {/* =================================================
                        ACTIONS SOLDE
                    ================================================= */}

                    {precommandeSelectionnee.statut ===
                      "FINALIZATION_PENDING" &&
                      getStatutSolde(
                        precommandeSelectionnee,
                      ) === "PENDING" && (
                        <SoldeActionBox>
                          <SoldeActionTitle>
                            Vérification nécessaire
                          </SoldeActionTitle>

                          <SoldeActionText>
                            Vérifiez la transaction
                            Orange Money / Wave puis
                            confirmez ou rejetez le paiement.
                          </SoldeActionText>

                          <SoldeActions>
                            <RejectSoldeButton
                              type="button"
                              onClick={
                                rejeterSolde
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              {actionLoading
                                ? "Traitement..."
                                : "Rejeter le solde"}
                            </RejectSoldeButton>

                            <ConfirmSoldeButton
                              type="button"
                              onClick={
                                confirmerSolde
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              {actionLoading
                                ? "Traitement..."
                                : "Confirmer le solde"}
                            </ConfirmSoldeButton>
                          </SoldeActions>
                        </SoldeActionBox>
                      )}

                    {precommandeSelectionnee.statut ===
                      "FINALIZED" && (
                      <FinalizedBox>
                        <FinalizedIcon>
                          ✓
                        </FinalizedIcon>

                        <div>
                          <FinalizedTitle>
                            Paiement confirmé
                          </FinalizedTitle>

                          <FinalizedText>
                            Le solde a été confirmé
                            et la commande finale a
                            été créée automatiquement.
                          </FinalizedText>

                          {precommandeSelectionnee.commandeId && (
                            <CommandeId>
                              Commande :{" "}
                              <strong>
                                {
                                  precommandeSelectionnee.commandeId
                                }
                              </strong>
                            </CommandeId>
                          )}
                        </div>
                      </FinalizedBox>
                    )}

                    {precommandeSelectionnee.statut ===
                      "READY_TO_FINALIZE" && (
                      <WaitingClientBox>
                        <WaitingIcon>
                          ⏳
                        </WaitingIcon>

                        <div>
                          <WaitingTitle>
                            En attente du client
                          </WaitingTitle>

                          <WaitingText>
                            Le produit est disponible.
                            Le client doit maintenant
                            payer le solde pour finaliser
                            sa commande.
                          </WaitingText>
                        </div>
                      </WaitingClientBox>
                    )}
                  </SoldePaymentBox>
                </Section>
              )}

              {/* =================================================
                  COMMENTAIRE ADMIN
              ================================================= */}

              <Section>
                <SectionTitle>
                  Commentaire administrateur
                </SectionTitle>

                <CommentTextarea
                  value={adminComment}
                  onChange={(e) =>
                    setAdminComment(
                      e.target.value,
                    )
                  }
                  placeholder="Ajouter une remarque concernant cette précommande..."
                  disabled={
                    precommandeSelectionnee.statut !==
                    "PENDING" &&
                    precommandeSelectionnee.statut !==
                    "FINALIZATION_PENDING"
                  }
                />

                {precommandeSelectionnee.adminComment && (
                  <ExistingComment>
                    <ExistingCommentLabel>
                      COMMENTAIRE ENREGISTRÉ
                    </ExistingCommentLabel>

                    <ExistingCommentText>
                      {
                        precommandeSelectionnee.adminComment
                      }
                    </ExistingCommentText>
                  </ExistingComment>
                )}
              </Section>

              {/* =================================================
                  HISTORIQUE
              ================================================= */}

              <Section>
                <SectionTitle>
                  Historique
                </SectionTitle>

                <HistoryList>
                  <HistoryItem>
                    <HistoryDot />
                    <HistoryContent>
                      <HistoryLabel>
                        Créée
                      </HistoryLabel>

                      <HistoryDate>
                        {formatDate(
                          precommandeSelectionnee.createdAt,
                        )}
                      </HistoryDate>
                    </HistoryContent>
                  </HistoryItem>

                  {getPaiementDepot(
                    precommandeSelectionnee,
                  )?.submittedAt && (
                    <HistoryItem>
                      <HistoryDot />
                      <HistoryContent>
                        <HistoryLabel>
                          Dépôt envoyé
                        </HistoryLabel>

                        <HistoryDate>
                          {formatDate(
                            getPaiementDepot(
                              precommandeSelectionnee,
                            )?.submittedAt,
                          )}
                        </HistoryDate>
                      </HistoryContent>
                    </HistoryItem>
                  )}

                  {getPaiementSolde(
                    precommandeSelectionnee,
                  )?.submittedAt && (
                    <HistoryItem>
                      <HistoryDot />
                      <HistoryContent>
                        <HistoryLabel>
                          Solde envoyé
                        </HistoryLabel>

                        <HistoryDate>
                          {formatDate(
                            getPaiementSolde(
                              precommandeSelectionnee,
                            )?.submittedAt,
                          )}
                        </HistoryDate>
                      </HistoryContent>
                    </HistoryItem>
                  )}

                  {getPaiementSolde(
                    precommandeSelectionnee,
                  )?.confirmedAt && (
                    <HistoryItem>
                      <HistoryDot />
                      <HistoryContent>
                        <HistoryLabel>
                          Solde confirmé
                        </HistoryLabel>

                        <HistoryDate>
                          {formatDate(
                            getPaiementSolde(
                              precommandeSelectionnee,
                            )?.confirmedAt,
                          )}
                        </HistoryDate>
                      </HistoryContent>
                    </HistoryItem>
                  )}

                  {precommandeSelectionnee.updatedAt && (
                    <HistoryItem>
                      <HistoryDot />
                      <HistoryContent>
                        <HistoryLabel>
                          Dernière mise à jour
                        </HistoryLabel>

                        <HistoryDate>
                          {formatDate(
                            precommandeSelectionnee.updatedAt,
                          )}
                        </HistoryDate>
                      </HistoryContent>
                    </HistoryItem>
                  )}
                </HistoryList>
              </Section>

              {/* =================================================
                  MESSAGES
              ================================================= */}

              {message && (
                <SuccessMessage>
                  ✓ {message}
                </SuccessMessage>
              )}

              {erreur && (
                <ErrorMessage>
                  {erreur}
                </ErrorMessage>
              )}
            </ModalBody>

            {/* =================================================
                ACTIONS FOOTER
            ================================================= */}

            {precommandeSelectionnee.statut ===
              "PENDING" && (
              <ModalFooter>
                <RejectButton
                  onClick={refuser}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Traitement..."
                    : "Refuser"}
                </RejectButton>

                <AcceptButton
                  onClick={accepter}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Traitement..."
                    : "Accepter la précommande"}
                </AcceptButton>
              </ModalFooter>
            )}

            {precommandeSelectionnee.statut !==
              "PENDING" && (
              <ModalFooter>
                <CloseFooterButton
                  onClick={fermerDetail}
                  disabled={actionLoading}
                >
                  Fermer
                </CloseFooterButton>
              </ModalFooter>
            )}
          </Modal>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

/* ============================================================
   STYLES
============================================================ */

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f7f8fa;
  padding: 35px 30px 70px;

  @media (max-width: 700px) {
    padding: 25px 15px 50px;
  }
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 30px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SmallLabel = styled.div`
  color: #888;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  margin: 0;
  color: #222;
  font-size: 32px;

  @media (max-width: 600px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  margin: 9px 0 0;
  color: #777;
  font-size: 14px;
  line-height: 1.5;
`;

const RefreshButton = styled.button`
  border: 1px solid #ddd;
  background: white;
  border-radius: 9px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #111;
    color: white;
    border-color: #111;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto 25px;

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  padding: 20px;

  ${(props) =>
    props.$pending &&
    `
      border-left: 4px solid #e6a400;
    `}

  ${(props) =>
    props.$accepted &&
    `
      border-left: 4px solid #31954b;
    `}

  ${(props) =>
    props.$solde &&
    `
      border-left: 4px solid #365bb5;
    `}

  ${(props) =>
    props.$finalized &&
    `
      border-left: 4px solid #17863b;
    `}

  ${(props) =>
    props.$rejected &&
    `
      border-left: 4px solid #c63c3c;
    `}
`;

const StatNumber = styled.div`
  font-size: 27px;
  font-weight: 800;
  color: #222;
`;

const StatLabel = styled.div`
  margin-top: 5px;
  color: #888;
  font-size: 12px;
`;

const FilterBar = styled.div`
  max-width: 1400px;
  margin: 0 auto 18px;

  background: white;
  border: 1px solid #e9e9e9;
  border-radius: 13px;
  padding: 10px;

  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterTitle = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 700;
  margin: 0 10px;
`;

const FilterButton = styled.button`
  border: none;

  background: ${(props) =>
    props.$active ? "#111" : "#f3f3f3"};

  color: ${(props) =>
    props.$active ? "#fff" : "#555"};

  padding: 9px 14px;
  border-radius: 8px;
  cursor: pointer;

  font-size: 12px;
  font-weight: 700;

  &:hover {
    background: ${(props) =>
      props.$active ? "#111" : "#e7e7e7"};
  }
`;

const ContentCard = styled.div`
  max-width: 1400px;
  margin: auto;

  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 15px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;

  grid-template-columns:
    1.2fr
    1.3fr
    1fr
    1fr
    0.9fr
    1fr
    80px;

  gap: 15px;

  padding: 15px 20px;

  background: #fafafa;
  border-bottom: 1px solid #eee;

  color: #999;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;

  @media (max-width: 1050px) {
    display: none;
  }
`;

const PrecommandeRow = styled.div`
  display: grid;

  grid-template-columns:
    1.2fr
    1.3fr
    1fr
    1fr
    0.9fr
    1fr
    80px;

  gap: 15px;

  padding: 17px 20px;

  align-items: center;

  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }

  @media (max-width: 1050px) {
    display: block;
    padding: 18px;
  }
`;

const ClientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1050px) {
    margin-bottom: 15px;
  }
`;

const Avatar = styled.div`
  width: 37px;
  height: 37px;
  min-width: 37px;

  border-radius: 50%;

  background: #111;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 800;
  font-size: 13px;
`;

const ClientInfo = styled.div`
  min-width: 0;
`;

const ClientName = styled.div`
  font-weight: 700;
  color: #222;
  font-size: 13px;
`;

const ClientEmail = styled.div`
  color: #999;
  font-size: 11px;
  margin-top: 3px;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 1050px) {
    margin-bottom: 15px;
  }
`;

const ProductImage = styled.div`
  width: 45px;
  height: 55px;

  border-radius: 7px;
  overflow: hidden;

  background: #eee;

  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NoProductImage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #aaa;
`;

const ProductName = styled.div`
  font-weight: 700;
  color: #333;
  font-size: 13px;
`;

const VariationCell = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;

  @media (max-width: 1050px) {
    margin-bottom: 15px;
  }
`;

const VariationTag = styled.span`
  background: #f1f1f1;

  padding: 5px 8px;

  border-radius: 6px;

  font-size: 10px;
  font-weight: 700;

  color: #444;
`;

const QuantityText = styled.span`
  font-size: 12px;
  color: #777;
  font-weight: 700;
`;

const DepositCell = styled.div`
  @media (max-width: 1050px) {
    margin-bottom: 15px;
  }
`;

const DepositAmount = styled.div`
  font-weight: 800;
  font-size: 12px;
  color: #222;
`;

const PaymentMethod = styled.div`
  margin-top: 4px;
  color: #888;
  font-size: 10px;
`;

const DepositSmallInfo = styled.div`
  margin-top: 3px;
  color: #777;
  font-size: 10px;
  line-height: 1.4;
`;

const StatusCell = styled.div`
  @media (max-width: 1050px) {
    margin-bottom: 15px;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;

  padding: 7px 9px;

  border-radius: 20px;

  font-size: 10px;
  font-weight: 800;

  background: ${(props) => {
    switch (props.$status) {
      case "ACCEPTED":
      case "READY_TO_FINALIZE":
      case "FINALIZED":
        return "#e9f7ec";

      case "REJECTED":
      case "CANCELLED":
        return "#fff0f0";

      case "FINALIZATION_PENDING":
        return "#eef3ff";

      default:
        return "#fff7e6";
    }
  }};

  color: ${(props) => {
    switch (props.$status) {
      case "ACCEPTED":
      case "READY_TO_FINALIZE":
      case "FINALIZED":
        return "#28743a";

      case "REJECTED":
      case "CANCELLED":
        return "#b53636";

      case "FINALIZATION_PENDING":
        return "#365bb5";

      default:
        return "#a56b00";
    }
  }};
`;

const DateCell = styled.div`
  color: #777;
  font-size: 11px;

  @media (max-width: 1050px) {
    margin-bottom: 15px;
  }
`;

const ViewCell = styled.div``;

const ViewButton = styled.button`
  border: 1px solid #ddd;
  background: white;

  padding: 8px 12px;

  border-radius: 7px;

  cursor: pointer;

  font-size: 11px;
  font-weight: 700;

  &:hover {
    background: #111;
    color: white;
    border-color: #111;
  }
`;

const EmptyState = styled.div`
  padding: 80px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 50px;
  color: #bbb;
`;

const EmptyTitle = styled.h3`
  margin: 15px 0 5px;
  color: #333;
`;

const EmptyText = styled.p`
  margin: 0;
  color: #999;
`;

const Pagination = styled.div`
  max-width: 1400px;
  margin: 20px auto 0;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const PageButton = styled.button`
  border: 1px solid #ddd;
  background: white;

  padding: 9px 15px;

  border-radius: 8px;

  cursor: pointer;

  &:hover:not(:disabled) {
    background: #111;
    color: white;
    border-color: #111;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #666;
  font-size: 13px;
  font-weight: 700;
`;

const LoadingContainer = styled.div`
  min-height: 70vh;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  background: #f7f8fa;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;

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
  font-size: 13px;
`;

const SuccessMessage = styled.div`
  max-width: 1400px;

  margin: 0 auto 20px;

  padding: 13px 15px;

  background: #eff9f0;
  color: #287038;

  border: 1px solid #d7ead9;
  border-radius: 9px;

  font-size: 13px;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  max-width: 1400px;

  margin: 0 auto 20px;

  padding: 13px 15px;

  background: #fff1f1;
  color: #b33131;

  border: 1px solid #f0d0d0;
  border-radius: 9px;

  font-size: 13px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  z-index: 1000;

  background: rgba(0, 0, 0, 0.55);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const Modal = styled.div`
  width: 100%;
  max-width: 850px;

  max-height: 92vh;

  overflow-y: auto;

  background: white;

  border-radius: 18px;

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);

  @media (max-width: 600px) {
    max-height: 96vh;
    border-radius: 14px;
  }
`;

const ModalHeader = styled.div`
  padding: 22px 25px;

  border-bottom: 1px solid #eee;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

const ModalLabel = styled.div`
  font-size: 9px;
  letter-spacing: 2px;

  font-weight: 800;

  color: #999;
`;

const ModalTitle = styled.h2`
  margin: 5px 0 0;

  color: #222;

  font-size: 23px;

  @media (max-width: 600px) {
    font-size: 19px;
  }
`;

const CloseButton = styled.button`
  width: 35px;
  height: 35px;

  border: none;
  border-radius: 50%;

  background: #f3f3f3;

  font-size: 23px;

  cursor: pointer;

  &:hover:not(:disabled) {
    background: #111;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalBody = styled.div`
  padding: 25px;

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

const ProductHero = styled.div`
  display: flex;

  gap: 18px;

  padding-bottom: 25px;

  border-bottom: 1px solid #eee;

  @media (max-width: 500px) {
    align-items: center;
  }
`;

const LargeProductImage = styled.div`
  width: 110px;
  height: 135px;

  border-radius: 12px;

  overflow: hidden;

  background: #eee;

  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  @media (max-width: 500px) {
    width: 85px;
    height: 105px;
  }
`;

const ProductHeroInfo = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 9px;
`;

const ProductHeroTitle = styled.h3`
  margin: 5px 0 0;

  font-size: 21px;

  color: #222;

  @media (max-width: 500px) {
    font-size: 17px;
  }
`;

const ProductPrice = styled.div`
  font-weight: 800;
  font-size: 17px;

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

const Section = styled.section`
  padding: 22px 0;

  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px;

  font-size: 14px;

  color: #222;
`;

const InfoGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 15px;

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  background: #f8f8f8;
  border-radius: 9px;
  padding: 13px;
`;

const InfoLabel = styled.div`
  color: #999;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  color: #333;
  font-size: 13px;
  font-weight: 700;
  word-break: break-word;
`;

const ReferenceValue = styled.div`
  color: #111;
  font-size: 13px;
  font-weight: 800;
  word-break: break-all;
`;

const DepositBig = styled.div`
  color: #287038;
  font-size: 15px;
  font-weight: 800;
`;

const PaymentBox = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 12px;
`;

const PaymentStatus = styled.div`
  color: ${(props) => {
    if (props.$status === "CONFIRMED") {
      return "#287038";
    }

    if (props.$status === "REJECTED") {
      return "#b53636";
    }

    return "#a56b00";
  }};

  font-size: 13px;
  font-weight: 800;
`;

const SoldePaymentBox = styled.div`
  background: ${(props) =>
    props.$pending
      ? "#f5f8ff"
      : "#f8f8f8"};

  border: 1px solid
    ${(props) =>
      props.$pending
        ? "#dce5ff"
        : "#eee"};

  padding: 17px;

  border-radius: 14px;
`;

const SoldeHeader = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: flex-start;

  gap: 15px;

  margin-bottom: 17px;

  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

const SoldeTitle = styled.div`
  color: #222;
  font-size: 15px;
  font-weight: 800;
`;

const SoldeSubtitle = styled.div`
  margin-top: 4px;
  color: #777;
  font-size: 11px;
`;

const SoldeStatusBadge = styled.span`
  display: inline-flex;
  padding: 7px 10px;
  border-radius: 20px;

  font-size: 10px;
  font-weight: 800;

  background: ${(props) => {
    if (props.$status === "CONFIRMED") {
      return "#e9f7ec";
    }

    if (props.$status === "REJECTED") {
      return "#fff0f0";
    }

    return "#eef3ff";
  }};

  color: ${(props) => {
    if (props.$status === "CONFIRMED") {
      return "#28743a";
    }

    if (props.$status === "REJECTED") {
      return "#b53636";
    }

    return "#365bb5";
  }};
`;

const SoldeActionBox = styled.div`
  margin-top: 16px;

  padding: 17px;

  background: white;

  border: 1px solid #dfe6f7;

  border-radius: 12px;
`;

const SoldeActionTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #222;
`;

const SoldeActionText = styled.p`
  margin: 6px 0 15px;

  color: #777;

  font-size: 11px;

  line-height: 1.5;
`;

const SoldeActions = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

const RejectSoldeButton = styled.button`
  border: 1px solid #e3baba;

  background: #fff5f5;

  color: #b53636;

  padding: 12px 18px;

  border-radius: 9px;

  cursor: pointer;

  font-weight: 800;

  &:hover:not(:disabled) {
    background: #ffe9e9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmSoldeButton = styled.button`
  border: none;

  background: #287038;

  color: white;

  padding: 12px 20px;

  border-radius: 9px;

  cursor: pointer;

  font-weight: 800;

  &:hover:not(:disabled) {
    background: #1f5b2e;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FinalizedBox = styled.div`
  margin-top: 16px;

  display: flex;

  align-items: flex-start;

  gap: 12px;

  padding: 16px;

  background: #eff9f0;

  border: 1px solid #d7ead9;

  border-radius: 12px;
`;

const FinalizedIcon = styled.div`
  width: 35px;
  height: 35px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #287038;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 900;
`;

const FinalizedTitle = styled.div`
  color: #287038;

  font-size: 13px;

  font-weight: 800;
`;

const FinalizedText = styled.div`
  margin-top: 5px;

  color: #4f7056;

  font-size: 11px;

  line-height: 1.5;
`;

const CommandeId = styled.div`
  margin-top: 8px;

  color: #287038;

  font-size: 11px;

  word-break: break-all;
`;

const WaitingClientBox = styled.div`
  margin-top: 16px;

  display: flex;

  align-items: flex-start;

  gap: 12px;

  padding: 16px;

  background: #fffaf0;

  border: 1px solid #f0dfb4;

  border-radius: 12px;
`;

const WaitingIcon = styled.div`
  font-size: 22px;
`;

const WaitingTitle = styled.div`
  color: #8c6500;

  font-size: 13px;

  font-weight: 800;
`;

const WaitingText = styled.div`
  margin-top: 5px;

  color: #806f3e;

  font-size: 11px;

  line-height: 1.5;
`;

const CommentTextarea = styled.textarea`
  width: 100%;

  min-height: 110px;

  resize: vertical;

  box-sizing: border-box;

  border: 1px solid #ddd;

  border-radius: 10px;

  padding: 13px;

  font-family: inherit;

  font-size: 13px;

  outline: none;

  &:focus {
    border-color: #111;
  }

  &:disabled {
    background: #f5f5f5;

    cursor: not-allowed;
  }
`;

const ExistingComment = styled.div`
  margin-top: 12px;

  padding: 13px;

  border-radius: 9px;

  background: #f8f8f8;

  border: 1px solid #eee;
`;

const ExistingCommentLabel = styled.div`
  color: #999;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1px;

  margin-bottom: 6px;
`;

const ExistingCommentText = styled.div`
  color: #444;

  font-size: 13px;

  line-height: 1.5;

  white-space: pre-wrap;
`;

const HistoryList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 13px;
`;

const HistoryItem = styled.div`
  display: flex;

  align-items: flex-start;

  gap: 10px;
`;

const HistoryDot = styled.div`
  width: 9px;

  height: 9px;

  margin-top: 4px;

  border-radius: 50%;

  background: #111;

  flex-shrink: 0;
`;

const HistoryContent = styled.div`
  display: flex;

  flex-direction: column;

  gap: 3px;
`;

const HistoryLabel = styled.div`
  color: #444;

  font-size: 12px;

  font-weight: 700;
`;

const HistoryDate = styled.div`
  color: #999;

  font-size: 11px;
`;

const ModalFooter = styled.div`
  padding: 18px 25px;

  border-top: 1px solid #eee;

  display: flex;

  justify-content: flex-end;

  gap: 10px;

  @media (max-width: 550px) {
    flex-direction: column;
  }
`;

const RejectButton = styled.button`
  border: 1px solid #e3baba;

  background: #fff5f5;

  color: #b53636;

  padding: 12px 18px;

  border-radius: 9px;

  cursor: pointer;

  font-weight: 800;

  &:hover:not(:disabled) {
    background: #ffe9e9;
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }
`;

const AcceptButton = styled.button`
  border: none;

  background: #111;

  color: white;

  padding: 12px 20px;

  border-radius: 9px;

  cursor: pointer;

  font-weight: 800;

  &:hover:not(:disabled) {
    background: #333;
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }
`;

const CloseFooterButton = styled.button`
  border: 1px solid #ddd;

  background: white;

  padding: 11px 20px;

  border-radius: 9px;

  cursor: pointer;

  font-weight: 700;

  &:hover:not(:disabled) {
    background: #111;

    color: white;

    border-color: #111;
  }

  &:disabled {
    opacity: 0.5;

    cursor: not-allowed;
  }
`;

export default ReceptionPrecommande;