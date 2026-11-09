
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMessageCircle,
  FiTrash2,
  FiCalendar,
  FiImage,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function DecisionsRetour() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [annulling, setAnnulling] = useState({});

  // ==========================================
  // CHARGER LES DEMANDES
  // ==========================================

  const fetchDemandes = async (isRefresh = false) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/returns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Impossible de récupérer vos demandes.",
        );
      }

      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur demandes de retour :", error);
      toast.error(error.message || "Erreur de chargement des demandes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // ==========================================
  // STATUT
  // ==========================================

  const getStatus = (statut) => {
    switch (statut) {
      case "PENDING":
        return {
          label: "En attente de décision",
          type: "warning",
          icon: <FiClock />,
          description: "Votre demande est en cours d'examen par notre équipe.",
        };

      case "APPROVED":
        return {
          label: "Demande acceptée",
          type: "success",
          icon: <FiCheckCircle />,
          description: "Votre demande a été acceptée par notre équipe.",
        };

      case "REJECTED":
        return {
          label: "Demande refusée",
          type: "danger",
          icon: <FiXCircle />,
          description: "Votre demande n'a pas été acceptée.",
        };

      case "CANCELLED":
        return {
          label: "Demande annulée",
          type: "neutral",
          icon: <FiXCircle />,
          description: "Cette demande a été annulée.",
        };

      case "COMPLETED":
        return {
          label: "Retour terminé",
          type: "success",
          icon: <FiCheckCircle />,
          description: "Le traitement de votre demande est terminé.",
        };

      default:
        return {
          label: "Statut inconnu",
          type: "neutral",
          icon: <FiAlertCircle />,
          description: "Le statut de cette demande est indisponible.",
        };
    }
  };

  // ==========================================
  // ANNULER UNE DEMANDE
  // ==========================================

  const annulerDemande = async (demandeId) => {
    if (annulling[demandeId]) return;

    const confirmation = window.confirm(
      "Voulez-vous vraiment annuler cette demande de retour ?",
    );

    if (!confirmation) return;

    setAnnulling((prev) => ({
      ...prev,
      [demandeId]: true,
    }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/returns/${demandeId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Impossible d'annuler cette demande.",
        );
      }

      setDemandes((prev) =>
        prev.map((demande) =>
          demande._id === demandeId
            ? data.demande || {
                ...demande,
                statut: "CANCELLED",
              }
            : demande,
        ),
      );

      toast.success(data.message || "Demande annulée avec succès.");
    } catch (error) {
      console.error("Erreur annulation :", error);
      toast.error(error.message || "Une erreur est survenue.");
    } finally {
      setAnnulling((prev) => ({
        ...prev,
        [demandeId]: false,
      }));
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Date indisponible";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Page>
        <LoadingBox>
          <Spinner />
          <p>Chargement de vos demandes...</p>
        </LoadingBox>
      </Page>
    );
  }

  // ==========================================
  // AFFICHAGE
  // ==========================================

  return (
    <Page>
      <Container>
        <TopBar>
          <BackButton to="/compte">
            <FiArrowLeft />
            Retour à mon compte
          </BackButton>

          <RefreshButton
            type="button"
            onClick={() => fetchDemandes(true)}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? "spinning" : ""} />
            Actualiser
          </RefreshButton>
        </TopBar>

        <Hero>
          <HeroIcon>
            <FiPackage />
          </HeroIcon>

          <HeroEyebrow>ESPACE CLIENT NUMA</HeroEyebrow>

          <Title>Mes décisions de retour</Title>

          <Description>
            Retrouvez le suivi de vos demandes de retour et d'échange,
            ainsi que les réponses de notre équipe.
          </Description>

          <RequestCount>
            {demandes.length} demande{demandes.length > 1 ? "s" : ""}
          </RequestCount>
        </Hero>

        {demandes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FiPackage />
            </EmptyIcon>

            <h3>Aucune demande de retour</h3>

            <p>
              Vous n'avez pas encore effectué de demande de retour ou
              d'échange.
            </p>

            <BackShopLink to="/compte">
              Retourner à mon compte
              <FiArrowLeft />
            </BackShopLink>
          </EmptyState>
        ) : (
          <RequestsList>
            {demandes.map((demande) => {
              const status = getStatus(demande.statut);

              return (
                <RequestCard key={demande._id}>
                  <RequestHeader>
                    <div>
                      <RequestEyebrow>DEMANDE DE RETOUR</RequestEyebrow>

                      <OrderNumber>
                        {demande.commandeId?.numeroCommande ||
                          "Numéro de commande indisponible"}
                      </OrderNumber>

                      <DateText>
                        <FiCalendar />
                        Créée le {formatDate(demande.createdAt)}
                      </DateText>
                    </div>

                    <StatusBadge $type={status.type}>
                      {status.icon}
                      {status.label}
                    </StatusBadge>
                  </RequestHeader>

                  <RequestBody>
                    <StatusDescription $type={status.type}>
                      {status.icon}
                      <span>{status.description}</span>
                    </StatusDescription>

                    <InfoGrid>
                      <InfoBox>
                        <InfoLabel>Solution souhaitée</InfoLabel>
                        <InfoValue>
                          {demande.solutionSouhaitee === "REMBOURSEMENT"
                            ? "Remboursement"
                            : demande.solutionSouhaitee === "ECHANGE"
                              ? "Échange"
                              : "Non précisée"}
                        </InfoValue>
                      </InfoBox>

                      <InfoBox>
                        <InfoLabel>Statut de la demande</InfoLabel>
                        <InfoValue>{status.label}</InfoValue>
                      </InfoBox>
                    </InfoGrid>

                    {demande.description?.trim() && (
                      <ContentBlock>
                        <BlockTitle>Description de votre demande</BlockTitle>
                        <BlockText>{demande.description}</BlockText>
                      </ContentBlock>
                    )}

                    <ContentBlock>
                      <BlockTitle>Articles concernés</BlockTitle>

                      <ItemsList>
                        {(demande.items || []).map((item, index) => (
                          <ProductItem key={`${demande._id}-${index}`}>
                            {item.image ? (
                              <ProductImage
                                src={item.image}
                                alt={item.nom || "Produit"}
                              />
                            ) : (
                              <ProductPlaceholder>
                                <FiPackage />
                              </ProductPlaceholder>
                            )}

                            <ProductDetails>
                              <ProductName>
                                {item.nom || "Produit"}
                              </ProductName>

                              <ProductMeta>
                                Quantité : {item.quantite || 1}
                              </ProductMeta>

                              {item.taille && (
                                <ProductMeta>
                                  Taille : {item.taille}
                                </ProductMeta>
                              )}

                              {item.couleur && (
                                <ProductMeta>
                                  Couleur : {item.couleur}
                                </ProductMeta>
                              )}

                              {item.motif && (
                                <Reason>
                                  Motif : {item.motif}
                                </Reason>
                              )}
                            </ProductDetails>
                          </ProductItem>
                        ))}
                      </ItemsList>
                    </ContentBlock>

                    {demande.photos?.length > 0 && (
                      <ContentBlock>
                        <BlockTitle>
                          <FiImage />
                          Photos jointes
                        </BlockTitle>

                        <PhotosGrid>
                          {demande.photos.map((photo, index) => (
                            <PhotoLink
                              key={photo.publicId || index}
                              href={photo.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={photo.url}
                                alt={`Photo ${index + 1}`}
                              />
                            </PhotoLink>
                          ))}
                        </PhotosGrid>
                      </ContentBlock>
                    )}

                    {demande.commentaireAdmin?.trim() && (
                      <AdminResponse>
                        <AdminResponseIcon>
                          <FiMessageCircle />
                        </AdminResponseIcon>

                        <div>
                          <AdminResponseTitle>
                            Réponse de l'administration
                          </AdminResponseTitle>

                          <AdminResponseText>
                            {demande.commentaireAdmin}
                          </AdminResponseText>
                        </div>
                      </AdminResponse>
                    )}

                    {demande.traiteLe && (
                      <ProcessedDate>
                        <FiCalendar />
                        Décision enregistrée le {formatDate(demande.traiteLe)}
                      </ProcessedDate>
                    )}

                    {demande.statut === "PENDING" && (
                      <Actions>
                        <CancelButton
                          type="button"
                          disabled={Boolean(annulling[demande._id])}
                          onClick={() => annulerDemande(demande._id)}
                        >
                          <FiTrash2 />

                          {annulling[demande._id]
                            ? "Annulation..."
                            : "Annuler cette demande"}
                        </CancelButton>
                      </Actions>
                    )}
                  </RequestBody>
                </RequestCard>
              );
            })}
          </RequestsList>
        )}

        <Footer>
          <span>NUMA</span>
          <p>Merci de votre confiance.</p>
        </Footer>
      </Container>
    </Page>
  );
}

// ==========================================
// STYLES
// ==========================================

const Page = styled.div`
  min-height: 100vh;
  padding: 35px 0 70px;
  background: #f5f5f7;
  color: #171717;
`;

const Container = styled.div`
  width: min(1000px, 92%);
  margin: auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #555;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    color: #000;
  }
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  color: #333;
  cursor: pointer;
  font-size: 12px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Hero = styled.div`
  text-align: center;
  padding: 35px 20px;
  margin-bottom: 30px;
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 20px;
`;

const HeroIcon = styled.div`
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  margin: 0 auto 17px;
  background: #f1f1f1;
  border-radius: 16px;
  font-size: 23px;
`;

const HeroEyebrow = styled.div`
  color: #888;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
`;

const Title = styled.h1`
  margin: 10px 0;
  font-size: clamp(25px, 4vw, 36px);
  letter-spacing: -1px;
`;

const Description = styled.p`
  max-width: 520px;
  margin: 0 auto;
  color: #777;
  font-size: 13px;
  line-height: 1.7;
`;

const RequestCount = styled.div`
  display: inline-block;
  margin-top: 17px;
  padding: 7px 13px;
  border-radius: 30px;
  background: #f2f2f2;
  color: #555;
  font-size: 12px;
  font-weight: 600;
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RequestCard = styled.article`
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 17px;
  overflow: hidden;
`;

const RequestHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RequestEyebrow = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #999;
  margin-bottom: 7px;
`;

const OrderNumber = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #171717;
`;

const DateText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #888;
  font-size: 12px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  background: ${({ $type }) =>
    $type === "success"
      ? "#eaf7ef"
      : $type === "danger"
        ? "#fff0f0"
        : $type === "warning"
          ? "#fff6e5"
          : "#f0f0f0"};

  color: ${({ $type }) =>
    $type === "success"
      ? "#27834b"
      : $type === "danger"
        ? "#bd4141"
        : $type === "warning"
          ? "#a76d16"
          : "#666"};
`;

const RequestBody = styled.div`
  padding: 22px;

  @media (max-width: 600px) {
    padding: 15px;
  }
`;

const StatusDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 12px;
  line-height: 1.5;

  background: ${({ $type }) =>
    $type === "success"
      ? "#f0faf3"
      : $type === "danger"
        ? "#fff4f4"
        : $type === "warning"
          ? "#fff9ed"
          : "#f5f5f5"};

  color: ${({ $type }) =>
    $type === "success"
      ? "#27834b"
      : $type === "danger"
        ? "#bd4141"
        : $type === "warning"
          ? "#a76d16"
          : "#666"};

  svg {
    flex-shrink: 0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 22px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  padding: 13px;
  background: #f8f8f9;
  border-radius: 10px;
`;

const InfoLabel = styled.span`
  display: block;
  color: #888;
  font-size: 11px;
  margin-bottom: 6px;
`;

const InfoValue = styled.strong`
  font-size: 13px;
  color: #222;
`;

const ContentBlock = styled.div`
  margin-top: 22px;
`;

const BlockTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 13px;
  color: #222;
`;

const BlockText = styled.p`
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 11px;
`;

const ProductImage = styled.img`
  width: 65px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f5;
`;

const ProductPlaceholder = styled.div`
  width: 65px;
  height: 75px;
  display: grid;
  place-items: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
  font-size: 20px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

const ProductName = styled.strong`
  font-size: 13px;
  color: #222;
`;

const ProductMeta = styled.span`
  font-size: 11px;
  color: #888;
`;

const Reason = styled.span`
  font-size: 12px;
  color: #555;
`;

const PhotosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PhotoLink = styled.a`
  display: block;

  img {
    display: block;
    width: 80px;
    height: 90px;
    object-fit: cover;
    border-radius: 9px;
    border: 1px solid #eee;
  }
`;

const AdminResponse = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-top: 24px;
  padding: 17px;
  background: #f5f5f6;
  border: 1px solid #ededed;
  border-radius: 12px;
`;

const AdminResponseIcon = styled.div`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background: #e9e9e9;
  border-radius: 9px;
  color: #444;
`;

const AdminResponseTitle = styled.strong`
  display: block;
  margin-bottom: 7px;
  font-size: 13px;
  color: #222;
`;

const AdminResponseText = styled.p`
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
`;

const ProcessedDate = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 17px;
  color: #888;
  font-size: 11px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 15px;
  border: 1px solid #edcccc;
  border-radius: 9px;
  background: #fff;
  color: #a33b3b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #fff4f4;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 55px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;

  h3 {
    margin: 15px 0 8px;
    font-size: 17px;
  }

  p {
    max-width: 400px;
    margin: 0 auto;
    color: #888;
    font-size: 13px;
    line-height: 1.6;
  }
`;

const EmptyIcon = styled.div`
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  margin: auto;
  background: #f2f2f2;
  border-radius: 16px;
  font-size: 22px;
  color: #777;
`;

const BackShopLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 17px;
  border-radius: 9px;
  background: #171717;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
`;

const LoadingBox = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #777;
  font-size: 13px;
`;

const Spinner = styled.div`
  width: 35px;
  height: 35px;
  border: 3px solid #e5e5e5;
  border-top-color: #171717;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Footer = styled.div`
  padding: 35px 0 0;
  text-align: center;

  span {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 4px;
  }

  p {
    margin-top: 7px;
    font-size: 11px;
    color: #999;
  }
`;
