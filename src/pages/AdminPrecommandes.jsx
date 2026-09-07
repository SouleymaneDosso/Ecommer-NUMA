import { useEffect, useState } from "react";
import styled from "styled-components";

// ===============================
// STYLES
// ===============================

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
  margin-bottom: 30px;
  color: #2c3e50;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const RefreshButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #34495e;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #2c3e50;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Loading = styled.div`
  padding: 30px;
  text-align: center;
  color: #555;
`;

const ErrorMessage = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #f5c6cb;
`;

const EmptyMessage = styled.div`
  padding: 40px;
  background: white;
  border-radius: 12px;
  text-align: center;
  color: #777;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid
    ${(props) => {
      if (props.$status === "ACCEPTED") return "#27ae60";
      if (props.$status === "REJECTED") return "#e74c3c";
      return "#f39c12";
    }};
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #f5f5f5;
`;

const NoImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
  text-align: center;
`;

const ProductTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
  color: #2c3e50;
`;

const ProductPrice = styled.div`
  font-size: 15px;
  color: #555;
`;

const Status = styled.span`
  display: inline-block;
  padding: 7px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;

  background: ${(props) => {
    if (props.$status === "ACCEPTED") return "#d5f5e3";
    if (props.$status === "REJECTED") return "#fadbd8";
    return "#fef3cd";
  }};

  color: ${(props) => {
    if (props.$status === "ACCEPTED") return "#1e8449";
    if (props.$status === "REJECTED") return "#c0392b";
    return "#9a6700";
  }};
`;

const InformationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #777;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const InfoValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  word-break: break-word;
`;

const Section = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 15px;
  color: #2c3e50;
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:disabled {
    background: #f1f1f1;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 11px 18px;
  border: none;
  border-radius: 7px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  background: ${(props) => {
    if (props.$danger) return "#e74c3c";
    if (props.$secondary) return "#7f8c8d";
    return "#27ae60";
  }};

  &:hover {
    background: ${(props) => {
      if (props.$danger) return "#c0392b";
      if (props.$secondary) return "#6c7a7b";
      return "#1e8449";
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;

const PageButton = styled.button`
  padding: 9px 15px;
  border: none;
  border-radius: 7px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #555;
  font-weight: 600;
`;

const VideoLink = styled.a`
  display: inline-block;
  margin-top: 8px;
  color: #007bff;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

// ===============================
// HELPERS
// ===============================

const formatPrice = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "—";
  }

  return `${number.toLocaleString("fr-FR")} FCFA`;
};

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

const getStatusLabel = (status) => {
  switch (status) {
    case "ACCEPTED":
      return "Acceptée";
    case "REJECTED":
      return "Refusée";
    case "PENDING":
      return "En attente";
    default:
      return status || "Inconnu";
  }
};

const getServiceLabel = (service) => {
  switch (service) {
    case "orange":
      return "Orange Money";
    case "wave":
      return "Wave";
    default:
      return service || "—";
  }
};

// ===============================
// COMPOSANT
// ===============================

function AdminPrecommandes() {
  const token = localStorage.getItem("adminToken");

  const [precommandes, setPrecommandes] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [comments, setComments] = useState({});

  // ===============================
  // RÉCUPÉRER LES PRÉCOMMANDES
  // ===============================

  const fetchPrecommandes = async (pageToLoad = page) => {
    if (!token) {
      setError("Accès non autorisé. Token admin manquant.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/precommandes/admin/liste?page=${pageToLoad}&limit=20`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la récupération des précommandes",
        );
      }

      setPrecommandes(data.precommandes || []);
      setTotal(data.total || 0);
      setPage(data.page || pageToLoad);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("FETCH PRECOMMANDES ERROR:", err);
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrecommandes(1);
  }, []);

  // ===============================
  // COMMENTAIRE
  // ===============================

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ===============================
  // ACCEPTER
  // ===============================

  const handleAccept = async (precommande) => {
    const id = precommande._id;

    if (!window.confirm("Accepter cette précommande ?")) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/precommandes/admin/${id}/accepter`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminComment: comments[id] || "",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors de l'acceptation",
        );
      }

      alert(data.message || "Précommande acceptée.");

      await fetchPrecommandes(page);
    } catch (err) {
      console.error("ACCEPTER PRECOMMANDE ERROR:", err);
      setError(err.message || "Erreur serveur");
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // REFUSER
  // ===============================

  const handleReject = async (precommande) => {
    const id = precommande._id;
    const comment = comments[id]?.trim() || "";

    if (!comment) {
      alert("Ajoute un commentaire pour expliquer le refus.");
      return;
    }

    if (!window.confirm("Refuser cette précommande ?")) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/precommandes/admin/${id}/refuser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminComment: comment,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors du refus",
        );
      }

      alert(data.message || "Précommande refusée.");

      await fetchPrecommandes(page);
    } catch (err) {
      console.error("REFUSER PRECOMMANDE ERROR:", err);
      setError(err.message || "Erreur serveur");
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // PAGINATION
  // ===============================

  const handlePreviousPage = () => {
    if (page <= 1) return;

    const newPage = page - 1;
    setPage(newPage);
    fetchPrecommandes(newPage);
  };

  const handleNextPage = () => {
    if (page >= pages) return;

    const newPage = page + 1;
    setPage(newPage);
    fetchPrecommandes(newPage);
  };

  // ===============================
  // RENDER
  // ===============================

  return (
    <Container>
      <Header>
        <Title>Précommandes</Title>

        <RefreshButton
          type="button"
          onClick={() => fetchPrecommandes(page)}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Actualiser"}
        </RefreshButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && (
        <div style={{ marginBottom: "20px", color: "#555" }}>
          <strong>{total}</strong>{" "}
          {total > 1 ? "précommandes" : "précommande"}
        </div>
      )}

      {loading ? (
        <Loading>Chargement des précommandes...</Loading>
      ) : precommandes.length === 0 ? (
        <EmptyMessage>
          Aucune précommande pour le moment.
        </EmptyMessage>
      ) : (
        <>
          <List>
            {precommandes.map((precommande) => {
              const produit = precommande.produitId;
              const modele = precommande.modele;

              const image =
                modele?.image ||
                produit?.images?.find((img) => img.isMain)?.url ||
                produit?.images?.[0]?.url ||
                "";

              const title =
                modele?.title ||
                produit?.title ||
                "Modèle inconnu";

              const price =
                modele?.prix ??
                produit?.price ??
                0;

              const client =
                precommande.clientId || {};

              const isPending =
                precommande.statut === "PENDING";

              const isLoading =
                actionLoading === precommande._id;

              return (
                <Card
                  key={precommande._id}
                  $status={precommande.statut}
                >
                  <CardTop>
                    <ProductInfo>
                      {image ? (
                        <ProductImage
                          src={image}
                          alt={title}
                        />
                      ) : (
                        <NoImage>
                          Aucune image
                        </NoImage>
                      )}

                      <div>
                        <ProductTitle>
                          {title}
                        </ProductTitle>

                        <ProductPrice>
                          Prix :{" "}
                          <strong>
                            {formatPrice(price)}
                          </strong>
                        </ProductPrice>

                        {modele?.video && (
                          <VideoLink
                            href={modele.video}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Voir la vidéo
                          </VideoLink>
                        )}
                      </div>
                    </ProductInfo>

                    <Status
                      $status={precommande.statut}
                    >
                      {getStatusLabel(
                        precommande.statut,
                      )}
                    </Status>
                  </CardTop>

                  <InformationGrid>
                    <InfoBox>
                      <InfoLabel>Client</InfoLabel>
                      <InfoValue>
                        {client.username ||
                          "—"}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>Email</InfoLabel>
                      <InfoValue>
                        {client.email || "—"}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>Téléphone</InfoLabel>
                      <InfoValue>
                        {client.telephone ||
                          "—"}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>
                        Montant du dépôt
                      </InfoLabel>
                      <InfoValue>
                        {formatPrice(
                          precommande.montantDepot,
                        )}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>
                        Moyen de paiement
                      </InfoLabel>
                      <InfoValue>
                        {getServiceLabel(
                          precommande.service,
                        )}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>
                        Numéro de dépôt
                      </InfoLabel>
                      <InfoValue>
                        {precommande.numeroDepot ||
                          "—"}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>
                        Référence du dépôt
                      </InfoLabel>
                      <InfoValue>
                        {precommande.referenceDepot ||
                          "—"}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>
                        Date de demande
                      </InfoLabel>
                      <InfoValue>
                        {formatDate(
                          precommande.submittedAt ||
                            precommande.createdAt,
                        )}
                      </InfoValue>
                    </InfoBox>

                    <InfoBox>
                      <InfoLabel>
                        Vérifiée le
                      </InfoLabel>
                      <InfoValue>
                        {formatDate(
                          precommande.verifieAt,
                        )}
                      </InfoValue>
                    </InfoBox>
                  </InformationGrid>

                  {precommande.adminComment && (
                    <Section>
                      <SectionTitle>
                        Commentaire admin
                      </SectionTitle>

                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          background:
                            precommande.statut ===
                            "REJECTED"
                              ? "#fff5f5"
                              : "#f5fff8",
                          color: "#444",
                        }}
                      >
                        {precommande.adminComment}
                      </div>
                    </Section>
                  )}

                  {isPending && (
                    <Section>
                      <SectionTitle>
                        Commentaire admin
                      </SectionTitle>

                      <CommentInput
                        placeholder="Commentaire facultatif pour l'acceptation ou obligatoire pour un refus..."
                        value={
                          comments[
                            precommande._id
                          ] || ""
                        }
                        onChange={(e) =>
                          handleCommentChange(
                            precommande._id,
                            e.target.value,
                          )
                        }
                        disabled={isLoading}
                      />

                      <ActionContainer>
                        <Button
                          type="button"
                          onClick={() =>
                            handleAccept(
                              precommande,
                            )
                          }
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Traitement..."
                            : "✓ Accepter"}
                        </Button>

                        <Button
                          type="button"
                          $danger
                          onClick={() =>
                            handleReject(
                              precommande,
                            )
                          }
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Traitement..."
                            : "✕ Refuser"}
                        </Button>
                      </ActionContainer>
                    </Section>
                  )}
                </Card>
              );
            })}
          </List>

          {pages > 1 && (
            <Pagination>
              <PageButton
                type="button"
                onClick={handlePreviousPage}
                disabled={
                  page <= 1 || loading
                }
              >
                ← Précédente
              </PageButton>

              <PageInfo>
                Page {page} / {pages}
              </PageInfo>

              <PageButton
                type="button"
                onClick={handleNextPage}
                disabled={
                  page >= pages || loading
                }
              >
                Suivante →
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}

export default AdminPrecommandes;