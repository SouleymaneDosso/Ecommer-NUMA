import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSlash,
  FiUnlock,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLivreurs = () => {
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [raison, setRaison] = useState("");

  const token = localStorage.getItem("adminToken");
  // =====================================================
  // CHARGER LES LIVREURS
  // =====================================================

  const chargerLivreurs = useCallback(
    async (isRefresh = false) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(`${API_URL}/api/livreurs/admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossible de charger les livreurs");
        }

        setLivreurs(data.livreurs || []);
      } catch (error) {
        console.error("CHARGEMENT LIVREURS ERROR:", error);
        alert(error.message || "Erreur lors du chargement des livreurs");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    chargerLivreurs();
  }, [chargerLivreurs]);

  // =====================================================
  // SOCKET.IO
  // =====================================================

  useEffect(() => {
    let socket;

    const initialiserSocket = async () => {
      try {
        const socketModule = await import("socket.io-client");

        socket = socketModule.io(API_URL, {
          transports: ["websocket"],
        });

        socket.on("livreur_admin_update", (update) => {
          setLivreurs((current) =>
            current.map((livreur) => {
              if (livreur._id !== update.livreurId) {
                return livreur;
              }

              return {
                ...livreur,
                actif: update.actif,
                bloque: update.bloque,
                limite: update.limite,
                statut: update.statut,
              };
            }),
          );
        });
      } catch (error) {
        console.error("SOCKET ADMIN LIVREURS ERROR:", error);
      }
    };

    initialiserSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // =====================================================
  // STATISTIQUES
  // =====================================================

  const statistiques = useMemo(() => {
    return {
      total: livreurs.length,

      actifs: livreurs.filter((livreur) => livreur.actif && !livreur.bloque)
        .length,

      bloques: livreurs.filter((livreur) => livreur.bloque).length,

      limites: livreurs.filter((livreur) => livreur.limite).length,

      disponibles: livreurs.filter(
        (livreur) =>
          livreur.statut === "AVAILABLE" && livreur.actif && !livreur.bloque,
      ).length,

      occupes: livreurs.filter((livreur) => livreur.statut === "BUSY").length,

      offline: livreurs.filter((livreur) => livreur.statut === "OFFLINE")
        .length,
    };
  }, [livreurs]);

  // =====================================================
  // FILTRAGE
  // =====================================================

  const livreursFiltres = useMemo(() => {
    const texte = search.trim().toLowerCase();

    return livreurs.filter((livreur) => {
      const correspondRecherche =
        !texte ||
        livreur.username?.toLowerCase().includes(texte) ||
        livreur.email?.toLowerCase().includes(texte) ||
        livreur.telephone?.toLowerCase().includes(texte);

      if (!correspondRecherche) {
        return false;
      }

      switch (filter) {
        case "ACTIVE":
          return livreur.actif && !livreur.bloque;

        case "AVAILABLE":
          return livreur.statut === "AVAILABLE";

        case "BUSY":
          return livreur.statut === "BUSY";

        case "OFFLINE":
          return livreur.statut === "OFFLINE";

        case "BLOCKED":
          return livreur.bloque;

        case "LIMITED":
          return livreur.limite;

        default:
          return true;
      }
    });
  }, [livreurs, search, filter]);

  // =====================================================
  // APPEL API ADMIN
  // =====================================================

  const actionAdmin = async (livreur, endpoint, body = {}) => {
    try {
      setActionLoading(livreur._id);

      const response = await fetch(
        `${API_URL}/api/livreurs/admin/${livreur._id}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Action impossible");
      }

      if (data.livreur) {
        setLivreurs((current) =>
          current.map((item) =>
            item._id === livreur._id ? data.livreur : item,
          ),
        );
      } else {
        await chargerLivreurs(true);
      }

      fermerModal();
    } catch (error) {
      console.error("ACTION ADMIN LIVREUR ERROR:", error);
      alert(error.message || "Une erreur est survenue");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // MODALES
  // =====================================================

  const ouvrirModal = (livreur, type) => {
    setSelectedLivreur(livreur);
    setModalType(type);
    setRaison(livreur.raisonRestriction || "");
  };

  const fermerModal = () => {
    setSelectedLivreur(null);
    setModalType(null);
    setRaison("");
  };

  const confirmerAction = () => {
    if (!selectedLivreur) {
      return;
    }

    switch (modalType) {
      case "BLOCK":
        actionAdmin(selectedLivreur, "bloquer", { raison });
        break;

      case "UNBLOCK":
        actionAdmin(selectedLivreur, "debloquer");
        break;

      case "LIMIT":
        actionAdmin(selectedLivreur, "limiter", { raison });
        break;

      case "UNLIMIT":
        actionAdmin(selectedLivreur, "retirer-limite");
        break;

      default:
        break;
    }
  };

  // =====================================================
  // CHANGER STATUT
  // =====================================================

  const changerStatut = async (livreur, statut) => {
    await actionAdmin(livreur, "statut", {
      statut,
    });
  };

  // =====================================================
  // ACTIVER / DÉSACTIVER
  // =====================================================

  const changerActif = async (livreur) => {
    await actionAdmin(livreur, "actif", {
      actif: !livreur.actif,
    });
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formaterDate = (date) => {
    if (!date) {
      return "Jamais";
    }

    try {
      return new Date(date).toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "Inconnue";
    }
  };

  // =====================================================
  // POSITION
  // =====================================================

  const positionDisponible = (livreur) => {
    return (
      livreur.localisation &&
      typeof livreur.localisation.latitude === "number" &&
      typeof livreur.localisation.longitude === "number"
    );
  };

  // =====================================================
  // TOKEN MANQUANT
  // =====================================================

  if (!token) {
    return (
      <Page>
        <EmptyState>
          <FiShield size={48} />
          <h2>Accès administrateur requis</h2>
          <p>Aucun token administrateur n'a été trouvé dans votre session.</p>
        </EmptyState>
      </Page>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Page>
      <Container>
        {/* =================================================
            HEADER
        ================================================= */}

        <Header>
          <HeaderLeft>
            <Title>
              <TitleIcon>
                <FiUsers />
              </TitleIcon>

              <div>
                <h1>Gestion des livreurs</h1>
                <p>Administration et contrôle des comptes livreurs</p>
              </div>
            </Title>
          </HeaderLeft>

          <RefreshButton
            onClick={() => chargerLivreurs(true)}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? "spin" : ""} />
            {refreshing ? "Actualisation..." : "Actualiser"}
          </RefreshButton>
        </Header>

        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FiUsers />
            </StatIcon>

            <div>
              <StatLabel>Total livreurs</StatLabel>
              <StatValue>{statistiques.total}</StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiCheckCircle />
            </StatIcon>

            <div>
              <StatLabel>Actifs</StatLabel>
              <StatValue>{statistiques.actifs}</StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiActivity />
            </StatIcon>

            <div>
              <StatLabel>Disponibles</StatLabel>
              <StatValue>{statistiques.disponibles}</StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiPackage />
            </StatIcon>

            <div>
              <StatLabel>En livraison</StatLabel>
              <StatValue>{statistiques.occupes}</StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiSlash />
            </StatIcon>

            <div>
              <StatLabel>Bloqués</StatLabel>
              <StatValue>{statistiques.bloques}</StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiAlertTriangle />
            </StatIcon>

            <div>
              <StatLabel>Limites</StatLabel>
              <StatValue>{statistiques.limites}</StatValue>
            </div>
          </StatCard>
        </StatsGrid>

        {/* =================================================
            FILTRES
        ================================================= */}

        <Toolbar>
          <SearchBox>
            <FiSearch />

            <input
              type="text"
              placeholder="Rechercher username, email, téléphone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <ClearSearch onClick={() => setSearch("")} type="button">
                <FiXCircle />
              </ClearSearch>
            )}
          </SearchBox>

          <FilterSelect
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="ALL">Tous les livreurs</option>
            <option value="ACTIVE">Actifs</option>
            <option value="AVAILABLE">Disponibles</option>
            <option value="BUSY">En livraison</option>
            <option value="OFFLINE">Hors ligne</option>
            <option value="BLOCKED">Bloqués</option>
            <option value="LIMITED">Limitées</option>
          </FilterSelect>
        </Toolbar>

        {/* =================================================
            TABLE
        ================================================= */}

        <TableCard>
          <TableHeader>
            <div>
              <strong>Livreurs</strong>
              <span>
                {livreursFiltres.length} résultat
                {livreursFiltres.length > 1 ? "s" : ""}
              </span>
            </div>
          </TableHeader>

          {loading ? (
            <Loading>
              <Spinner />
              <p>Chargement des livreurs...</p>
            </Loading>
          ) : livreursFiltres.length === 0 ? (
            <EmptyTable>
              <FiUsers size={42} />
              <h3>Aucun livreur trouvé</h3>
              <p>Aucun compte ne correspond aux critères sélectionnés.</p>
            </EmptyTable>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Livreur</th>
                    <th>Contact</th>
                    <th>Compte</th>
                    <th>Statut</th>
                    <th>Commande</th>
                    <th>Localisation</th>
                    <th>Dernière activité</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {livreursFiltres.map((livreur) => (
                    <LivreurRow
                      key={livreur._id}
                      livreur={livreur}
                      actionLoading={actionLoading}
                      formaterDate={formaterDate}
                      positionDisponible={positionDisponible}
                      changerStatut={changerStatut}
                      changerActif={changerActif}
                      ouvrirModal={ouvrirModal}
                    />
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </TableCard>
      </Container>

      {/* =================================================
          MODALE
      ================================================= */}

      {selectedLivreur && modalType && (
        <Overlay onClick={fermerModal}>
          <Modal onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalIcon>
                  {modalType === "BLOCK" && <FiSlash />}
                  {modalType === "UNBLOCK" && <FiUnlock />}
                  {modalType === "LIMIT" && <FiAlertTriangle />}
                  {modalType === "UNLIMIT" && <FiCheckCircle />}
                </ModalIcon>

                <div>
                  <h2>
                    {modalType === "BLOCK" && "Bloquer le livreur"}
                    {modalType === "UNBLOCK" && "Débloquer le livreur"}
                    {modalType === "LIMIT" && "Limiter le livreur"}
                    {modalType === "UNLIMIT" && "Retirer la limitation"}
                  </h2>

                  <p>{selectedLivreur.username}</p>
                </div>
              </div>

              <CloseButton onClick={fermerModal}>
                <FiXCircle />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {modalType === "BLOCK" && (
                <>
                  <Warning>
                    <FiAlertTriangle />

                    <span>
                      Le compte sera désactivé et son statut passera
                      automatiquement à OFFLINE.
                    </span>
                  </Warning>

                  <Label>Raison du blocage</Label>

                  <TextArea
                    value={raison}
                    onChange={(event) => setRaison(event.target.value)}
                    placeholder="Ex : comportement non conforme..."
                    rows={4}
                  />
                </>
              )}

              {modalType === "LIMIT" && (
                <>
                  <Warning>
                    <FiAlertTriangle />

                    <span>
                      Le livreur pourra toujours se connecter, mais il ne pourra
                      plus accepter de nouvelles commandes.
                    </span>
                  </Warning>

                  <Label>Raison de la limitation</Label>

                  <TextArea
                    value={raison}
                    onChange={(event) => setRaison(event.target.value)}
                    placeholder="Ex : limitation temporaire..."
                    rows={4}
                  />
                </>
              )}

              {modalType === "UNBLOCK" && (
                <ConfirmText>
                  Voulez-vous vraiment débloquer{" "}
                  <strong>{selectedLivreur.username}</strong> ?
                  <br />
                  Son compte sera de nouveau actif.
                </ConfirmText>
              )}

              {modalType === "UNLIMIT" && (
                <ConfirmText>
                  Voulez-vous retirer la limitation de{" "}
                  <strong>{selectedLivreur.username}</strong> ?
                  <br />
                  Il pourra de nouveau accepter des commandes.
                </ConfirmText>
              )}
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={fermerModal}>Annuler</CancelButton>

              <ConfirmButton
                $danger={modalType === "BLOCK" || modalType === "LIMIT"}
                onClick={confirmerAction}
                disabled={actionLoading === selectedLivreur._id}
              >
                {actionLoading === selectedLivreur._id
                  ? "Traitement..."
                  : modalType === "BLOCK"
                    ? "Bloquer"
                    : modalType === "UNBLOCK"
                      ? "Débloquer"
                      : modalType === "LIMIT"
                        ? "Limiter"
                        : "Retirer la limite"}
              </ConfirmButton>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
};

// =====================================================
// LIGNE LIVREUR
// =====================================================

const LivreurRow = ({
  livreur,
  actionLoading,
  formaterDate,
  positionDisponible,
  changerStatut,
  changerActif,
  ouvrirModal,
}) => {
  const isLoading = actionLoading === livreur._id;

  return (
    <tr>
      {/* LIVREUR */}

      <td>
        <CourierIdentity>
          <Avatar>
            <FiUser />
          </Avatar>

          <div>
            <CourierName>{livreur.username}</CourierName>

            <CourierEmail>{livreur.email}</CourierEmail>

            <Badges>
              {livreur.bloque && (
                <Badge $type="blocked">
                  <FiSlash />
                  Bloqué
                </Badge>
              )}

              {livreur.limite && !livreur.bloque && (
                <Badge $type="limited">
                  <FiAlertTriangle />
                  Limité
                </Badge>
              )}
            </Badges>
          </div>
        </CourierIdentity>
      </td>

      {/* CONTACT */}

      <td>
        <Contact>
          <FiPhone />
          <span>{livreur.telephone || "Non renseigné"}</span>
        </Contact>
      </td>

      {/* COMPTE */}

      <td>
        <AccountStatus $active={livreur.actif && !livreur.bloque}>
          {livreur.actif && !livreur.bloque ? (
            <>
              <FiCheckCircle />
              Actif
            </>
          ) : (
            <>
              <FiXCircle />
              Désactivé
            </>
          )}
        </AccountStatus>
      </td>

      {/* STATUT */}

      <td>
        <StatusWrapper>
          <StatusDot $status={livreur.statut} />

          <select
            value={livreur.statut || "OFFLINE"}
            disabled={isLoading || livreur.bloque || !livreur.actif}
            onChange={(event) => changerStatut(livreur, event.target.value)}
          >
            <option value="OFFLINE">Hors ligne</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="BUSY">Occupé</option>
          </select>
        </StatusWrapper>
      </td>

      {/* COMMANDE */}

      <td>
        {livreur.commandeActuelle ? (
          <CurrentOrder>
            <FiPackage />

            <div>
              <strong>#{String(livreur.commandeActuelle._id).slice(-6)}</strong>

              <small>
                {livreur.commandeActuelle.statusCommande || "En cours"}
              </small>
            </div>
          </CurrentOrder>
        ) : (
          <NoOrder>
            <FiClock />
            Aucune
          </NoOrder>
        )}
      </td>

      {/* LOCALISATION */}

      <td>
        {positionDisponible(livreur) ? (
          <Location>
            <FiMapPin />

            <div>
              <strong>{livreur.localisation.latitude.toFixed(5)}</strong>

              <strong>{livreur.localisation.longitude.toFixed(5)}</strong>
            </div>
          </Location>
        ) : (
          <NoLocation>
            <FiMapPin />
            Non disponible
          </NoLocation>
        )}
      </td>

      {/* DATE */}

      <td>
        <LastUpdate>
          {formaterDate(livreur.localisation?.derniereMiseAJour)}
        </LastUpdate>
      </td>

      {/* ACTIONS */}

      <td>
        <Actions>
          {livreur.bloque ? (
            <ActionButton
              $type="success"
              disabled={isLoading}
              onClick={() => ouvrirModal(livreur, "UNBLOCK")}
              title="Débloquer"
            >
              <FiUnlock />
              Débloquer
            </ActionButton>
          ) : (
            <ActionButton
              $type="danger"
              disabled={isLoading}
              onClick={() => ouvrirModal(livreur, "BLOCK")}
              title="Bloquer"
            >
              <FiSlash />
              Bloquer
            </ActionButton>
          )}

          {livreur.limite ? (
            <ActionButton
              $type="success"
              disabled={isLoading || livreur.bloque}
              onClick={() => ouvrirModal(livreur, "UNLIMIT")}
              title="Retirer la limite"
            >
              <FiCheckCircle />
              Retirer limite
            </ActionButton>
          ) : (
            <ActionButton
              $type="warning"
              disabled={isLoading || livreur.bloque}
              onClick={() => ouvrirModal(livreur, "LIMIT")}
              title="Limiter"
            >
              <FiAlertTriangle />
              Limiter
            </ActionButton>
          )}

          <ActionButton
            $type={livreur.actif ? "danger" : "success"}
            disabled={isLoading || livreur.bloque}
            onClick={() => changerActif(livreur)}
          >
            {livreur.actif ? (
              <>
                <FiXCircle />
                Désactiver
              </>
            ) : (
              <>
                <FiCheckCircle />
                Activer
              </>
            )}
          </ActionButton>

          <DetailsButton
            onClick={() => {
              alert(
                [
                  `Livreur : ${livreur.username}`,
                  `Email : ${livreur.email}`,
                  `Téléphone : ${livreur.telephone}`,
                  `Statut : ${livreur.statut}`,
                  `Actif : ${livreur.actif ? "Oui" : "Non"}`,
                  `Bloqué : ${livreur.bloque ? "Oui" : "Non"}`,
                  `Limité : ${livreur.limite ? "Oui" : "Non"}`,
                  `Raison : ${livreur.raisonRestriction || "Aucune"}`,
                ].join("\n"),
              );
            }}
          >
            <FiEdit3 />
            Détails
          </DetailsButton>
        </Actions>
      </td>
    </tr>
  );
};

// =====================================================
// STYLES
// =====================================================

const Page = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  padding: 32px;
  color: #172033;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1700px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
  }

  p {
    margin: 5px 0 0;
    color: #737c8f;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 22px;
    }
  }
`;

const TitleIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 15px;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const RefreshButton = styled.button`
  border: none;
  background: white;
  color: #172033;
  border: 1px solid #e3e7ef;
  border-radius: 12px;
  padding: 11px 16px;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: #f8f9fc;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1250px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e7eaf0;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 3px 15px rgba(20, 30, 50, 0.04);
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #f1f3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #7c8597;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 25px;
  font-weight: 800;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  height: 48px;
  background: white;
  border: 1px solid #e1e5ec;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;

  svg {
    color: #8a93a4;
    flex-shrink: 0;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    background: transparent;
  }
`;

const ClearSearch = styled.button`
  border: none;
  background: transparent;
  color: #8a93a4;
  cursor: pointer;
  display: flex;
`;

const FilterSelect = styled.select`
  min-width: 210px;
  height: 48px;
  background: white;
  border: 1px solid #e1e5ec;
  border-radius: 12px;
  padding: 0 14px;
  outline: none;
  color: #172033;
  font-weight: 600;
`;

const TableCard = styled.div`
  background: white;
  border: 1px solid #e4e8ef;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 3px 20px rgba(20, 30, 50, 0.04);
`;

const TableHeader = styled.div`
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f4;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  strong {
    font-size: 17px;
  }

  span {
    color: #8992a3;
    font-size: 13px;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1400px;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 13px 18px;
    background: #fafbfc;
    color: #7b8495;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  td {
    padding: 17px 18px;
    border-top: 1px solid #edf0f4;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #fcfcfd;
  }
`;

const CourierIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #eef1f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const CourierName = styled.div`
  font-weight: 750;
  font-size: 14px;
`;

const CourierEmail = styled.div`
  color: #8992a3;
  font-size: 12px;
  margin-top: 3px;
`;

const Badges = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 6px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;

  background: ${({ $type }) => ($type === "blocked" ? "#fff0f0" : "#fff8e6")};

  color: ${({ $type }) => ($type === "blocked" ? "#d63939" : "#a66a00")};

  svg {
    font-size: 10px;
  }
`;

const Contact = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: #515b6d;
  font-size: 13px;

  svg {
    color: #8992a3;
  }
`;

const AccountStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ $active }) => ($active ? "#16804b" : "#d13a3a")};
  font-size: 12px;
  font-weight: 700;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  select {
    border: none;
    background: transparent;
    outline: none;
    font-weight: 650;
    font-size: 12px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  background: ${({ $status }) => {
    if ($status === "AVAILABLE") return "#20a464";
    if ($status === "BUSY") return "#e89517";
    return "#8992a3";
  }};
`;

const CurrentOrder = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #687387;
  }

  strong {
    display: block;
    font-size: 12px;
  }

  small {
    display: block;
    color: #8992a3;
    margin-top: 2px;
    font-size: 10px;
  }
`;

const NoOrder = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: #9aa2b1;
  font-size: 12px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  > svg {
    color: #687387;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 10px;
    font-weight: 600;
  }
`;

const NoLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #a1a8b5;
  font-size: 11px;
`;

const LastUpdate = styled.span`
  color: #7d8797;
  font-size: 11px;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 210px;
`;

const ActionButton = styled.button`
  border: 1px solid
    ${({ $type }) =>
      $type === "danger"
        ? "#ffd1d1"
        : $type === "warning"
          ? "#ffe4aa"
          : "#ccebdc"};

  background: ${({ $type }) =>
    $type === "danger"
      ? "#fff7f7"
      : $type === "warning"
        ? "#fffaf0"
        : "#f4fcf7"};

  color: ${({ $type }) =>
    $type === "danger"
      ? "#cf3737"
      : $type === "warning"
        ? "#a96d00"
        : "#167b49"};

  border-radius: 8px;
  padding: 7px 9px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const DetailsButton = styled.button`
  border: 1px solid #dfe4eb;
  background: white;
  color: #5c6678;
  border-radius: 8px;
  padding: 7px 9px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
`;

const Loading = styled.div`
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  color: #7e8797;

  p {
    margin: 0;
    font-size: 13px;
  }
`;

const Spinner = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 3px solid #e7eaf0;
  border-top-color: #172033;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyTable = styled.div`
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #8992a3;

  h3 {
    color: #414b5d;
    margin: 14px 0 5px;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #7c8595;

  h2 {
    color: #172033;
    margin: 18px 0 6px;
  }

  p {
    margin: 0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 16, 28, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 22px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #edf0f4;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
  }

  p {
    margin: 4px 0 0;
    color: #8992a3;
    font-size: 13px;
  }
`;

const ModalIcon = styled.div`
  width: 43px;
  height: 43px;
  border-radius: 12px;
  background: #f1f3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #8b94a3;
  cursor: pointer;
  font-size: 19px;
  height: 32px;
`;

const ModalBody = styled.div`
  padding: 22px;
`;

const Warning = styled.div`
  display: flex;
  gap: 10px;
  padding: 13px;
  border-radius: 10px;
  background: #fff8e8;
  color: #76550e;
  font-size: 13px;
  line-height: 1.45;
  margin-bottom: 20px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid #dfe4eb;
  border-radius: 10px;
  padding: 12px;
  font-family: inherit;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #8992a3;
  }
`;

const ConfirmText = styled.p`
  color: #596376;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;

  strong {
    color: #172033;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 17px 22px;
  border-top: 1px solid #edf0f4;
`;

const CancelButton = styled.button`
  border: 1px solid #dfe4eb;
  background: white;
  color: #5d6677;
  border-radius: 10px;
  padding: 10px 17px;
  font-weight: 700;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  border: none;
  background: ${({ $danger }) => ($danger ? "#c93636" : "#172033")};
  color: white;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export default AdminLivreurs;
