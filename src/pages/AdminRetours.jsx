import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

/* ================= STYLE ================= */

const Page = styled.main`
  max-width: 1250px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 0.7rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h1 {
    margin: 0;
    font-size: 1.6rem;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #ddd;
  cursor: pointer;
  font-weight: 600;
  background: ${(p) => (p.$active ? "#222" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
`;

const RequestCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  background: ${(p) => {
    switch (p.$status) {
      case "PENDING":
        return "#fef3c7";
      case "APPROVED":
        return "#dcfce7";
      case "REJECTED":
        return "#fee2e2";
      case "CANCELLED":
        return "#e5e7eb";
      case "COMPLETED":
        return "#dbeafe";
      default:
        return "#eee";
    }
  }};
  color: ${(p) => {
    switch (p.$status) {
      case "PENDING":
        return "#92400e";
      case "APPROVED":
        return "#166534";
      case "REJECTED":
        return "#991b1b";
      case "CANCELLED":
        return "#374151";
      case "COMPLETED":
        return "#1e40af";
      default:
        return "#333";
    }
  }};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 1rem 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  overflow-wrap: anywhere;

  strong {
    display: block;
    margin-bottom: 5px;
    font-size: 0.85rem;
    color: #555;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  margin: 1.3rem 0 0.8rem;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
`;

const ItemCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  padding: 12px;
  background: #fafafa;

  img {
    width: 100%;
    height: 170px;
    object-fit: contain;
    background: white;
    border-radius: 6px;
  }

  p {
    margin: 7px 0;
    font-size: 0.9rem;
  }
`;

const PhotoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
`;

const ActionArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 9px 15px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background: ${(p) => p.$color || "#222"};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 85px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  margin-top: 10px;
`;

const Select = styled.select`
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
`;

const Message = styled.p`
  padding: 1rem;
  text-align: center;
  color: ${(p) => (p.$error ? "#dc2626" : "#555")};
`;

/* ================= HELPERS ================= */

const statutLabels = {
  PENDING: "En attente",
  APPROVED: "Acceptée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

const solutionLabels = {
  REMBOURSEMENT: "Remboursement",
  ECHANGE: "Échange",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ================= COMPONENT ================= */

export default function AdminRetours() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [demandes, setDemandes] = useState([]);
  const [filtre, setFiltre] = useState("ALL");
  const [commentaires, setCommentaires] = useState({});
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [traitement, setTraitement] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchDemandes = useCallback(async () => {
    setChargement(true);
    setErreur("");

    try {
      const query = filtre === "ALL" ? "" : `?statut=${filtre}`;

      const res = await fetch(`${API_URL}/api/admin/returns${query}`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Impossible de charger les retours");
      }

      setDemandes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ADMIN RETURNS:", error);
      setErreur(error.message || "Erreur lors du chargement");
    } finally {
      setChargement(false);
    }
  }, [API_URL, filtre]);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const traiterDemande = async (id, statut) => {
    const commentaireAdmin = commentaires[id] || "";

    let confirmation = "";

    if (statut === "APPROVED") {
      confirmation = "Veux-tu accepter cette demande de retour ?";
    } else if (statut === "REJECTED") {
      confirmation = "Veux-tu vraiment refuser cette demande ?";
    } else if (statut === "COMPLETED") {
      confirmation = "Confirmer que le traitement du retour est terminé ?";
    }

    if (!window.confirm(confirmation)) return;

    setTraitement(id);

    try {
      const res = await fetch(`${API_URL}/api/admin/returns/${id}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          statut,
          commentaireAdmin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du traitement");
      }

      alert(data.message || "Demande mise à jour avec succès");

      await fetchDemandes();
    } catch (error) {
      console.error("UPDATE RETURN:", error);
      alert(error.message || "Erreur serveur");
    } finally {
      setTraitement(null);
    }
  };

  return (
    <Page>
      <Header>
        <h1>Administration – Retours clients</h1>

        <Button onClick={fetchDemandes} disabled={chargement} $color="#333">
          Actualiser
        </Button>
      </Header>

      <Filters>
        {[
          ["ALL", "Toutes"],
          ["PENDING", "En attente"],
          ["APPROVED", "Acceptées"],
          ["REJECTED", "Refusées"],
          ["COMPLETED", "Terminées"],
          ["CANCELLED", "Annulées"],
        ].map(([value, label]) => (
          <FilterButton
            key={value}
            $active={filtre === value}
            onClick={() => setFiltre(value)}
          >
            {label}
          </FilterButton>
        ))}
      </Filters>

      {chargement ? (
        <Message>Chargement des demandes de retour...</Message>
      ) : erreur ? (
        <Message $error>{erreur}</Message>
      ) : demandes.length === 0 ? (
        <Message>Aucune demande de retour trouvée.</Message>
      ) : (
        <>
          <p>
            <strong>{demandes.length}</strong> demande(s) affichée(s)
          </p>

          {demandes.map((demande) => {
            const commande = demande.commandeId || {};
            const client = demande.clientId || {};
            const clientCommande = commande.client || {};

            return (
              <RequestCard key={demande._id}>
                <TopLine>
                  <div>
                    <strong>
                      Demande #{demande._id.slice(-8).toUpperCase()}
                    </strong>
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      Créée le {formatDate(demande.createdAt)}
                    </p>
                  </div>

                  <Badge $status={demande.statut}>
                    {statutLabels[demande.statut] || demande.statut}
                  </Badge>
                </TopLine>

                <InfoGrid>
                  <InfoBox>
                    <strong>Numéro de commande</strong>
                    {commande.numeroCommande || "Non disponible"}
                  </InfoBox>

                  <InfoBox>
                    <strong>Client</strong>
                    {client.username ||
                      `${clientCommande.prenom || ""} ${clientCommande.nom || ""}`.trim() ||
                      "Client"}
                    <br />
                    {client.email || "-"}
                  </InfoBox>

                  <InfoBox>
                    <strong>Statut de la commande</strong>
                    {commande.statusCommande || "-"}
                  </InfoBox>

                  <InfoBox>
                    <strong>Total de la commande</strong>
                    {(commande.total || 0).toLocaleString("fr-FR")} FCFA
                  </InfoBox>

                  <InfoBox>
                    <strong>Solution souhaitée</strong>
                    {solutionLabels[demande.solutionSouhaitee] ||
                      demande.solutionSouhaitee}
                  </InfoBox>

                  <InfoBox>
                    <strong>Date de traitement</strong>
                    {formatDate(demande.traiteLe)}
                  </InfoBox>
                </InfoGrid>

                <SectionTitle>Articles concernés</SectionTitle>

                <ItemGrid>
                  {demande.items?.map((item, index) => (
                    <ItemCard key={`${item.panierIndex}-${index}`}>
                      <img
                        src={
                          item.image ||
                          "https://placehold.co/300x300?text=Produit"
                        }
                        alt={item.nom}
                      />

                      <p>
                        <strong>{item.nom}</strong>
                      </p>
                      <p>Quantité : {item.quantite}</p>
                      <p>
                        Prix : {(item.prix || 0).toLocaleString("fr-FR")} FCFA
                      </p>
                      <p>Couleur : {item.couleur || "-"}</p>
                      <p>Taille : {item.taille || "-"}</p>
                      <p>
                        <strong>Motif :</strong> {item.motif}
                      </p>
                    </ItemCard>
                  ))}
                </ItemGrid>
                <div>
                  <strong>WhatsApp du client :</strong>{" "}
                  {demande.numeroWhatsApp ? (
                    <a
                      href={`https://wa.me/${String(demande.numeroWhatsApp).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {demande.numeroWhatsApp}
                    </a>
                  ) : (
                    <span>Non renseigné</span>
                  )}
                </div>

                {demande.description && (
                  <>
                    <SectionTitle>Description du client</SectionTitle>
                    <InfoBox>{demande.description}</InfoBox>
                  </>
                )}

                {demande.photos?.length > 0 && (
                  <>
                    <SectionTitle>Photos envoyées par le client</SectionTitle>

                    <PhotoGrid>
                      {demande.photos.map((photo, index) => (
                        <a
                          key={photo.publicId || index}
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={photo.url}
                            alt={`Photo du retour ${index + 1}`}
                          />
                        </a>
                      ))}
                    </PhotoGrid>
                  </>
                )}

                {demande.commentaireAdmin && (
                  <>
                    <SectionTitle>Commentaire administratif</SectionTitle>
                    <InfoBox>{demande.commentaireAdmin}</InfoBox>
                  </>
                )}

                {demande.statut === "PENDING" && (
                  <>
                    <SectionTitle>Traiter cette demande</SectionTitle>

                    <TextArea
                      placeholder="Ajouter un commentaire pour le client (facultatif)..."
                      value={commentaires[demande._id] || ""}
                      onChange={(e) =>
                        setCommentaires((prev) => ({
                          ...prev,
                          [demande._id]: e.target.value,
                        }))
                      }
                    />

                    <ActionArea>
                      <Button
                        $color="#16a34a"
                        disabled={traitement === demande._id}
                        onClick={() => traiterDemande(demande._id, "APPROVED")}
                      >
                        Accepter la demande
                      </Button>

                      <Button
                        $color="#dc2626"
                        disabled={traitement === demande._id}
                        onClick={() => traiterDemande(demande._id, "REJECTED")}
                      >
                        Refuser la demande
                      </Button>
                    </ActionArea>
                  </>
                )}

                {demande.statut === "APPROVED" && (
                  <>
                    <SectionTitle>Finaliser le retour</SectionTitle>

                    <TextArea
                      placeholder="Commentaire sur le remboursement ou l'échange..."
                      value={commentaires[demande._id] || ""}
                      onChange={(e) =>
                        setCommentaires((prev) => ({
                          ...prev,
                          [demande._id]: e.target.value,
                        }))
                      }
                    />

                    <ActionArea>
                      <Button
                        $color="#2563eb"
                        disabled={traitement === demande._id}
                        onClick={() => traiterDemande(demande._id, "COMPLETED")}
                      >
                        Marquer comme terminé
                      </Button>
                    </ActionArea>
                  </>
                )}

                {traitement === demande._id && (
                  <Message>Traitement en cours...</Message>
                )}
              </RequestCard>
            );
          })}
        </>
      )}
    </Page>
  );
}
