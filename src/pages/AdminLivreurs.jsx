import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FaSearch,
  FaSyncAlt,
  FaUserCheck,
  FaUserSlash,
  FaLock,
  FaLockOpen,
  FaBan,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaSpinner,
  FaTimes,
  FaSave,
  FaInfinity,
} from "react-icons/fa";

// =====================================================
// CONFIG
// =====================================================

const API_URL = import.meta.env.VITE_API_URL || "";

const getToken = () => localStorage.getItem("adminToken");

// =====================================================
// API
// =====================================================

const apiRequest = async (url, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Session administrateur introuvable.");
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Une erreur est survenue avec le serveur.",
    );
  }

  return data;
};

// =====================================================
// HELPERS
// =====================================================

const getStatutLabel = (statut) => {
  switch (statut) {
    case "AVAILABLE":
      return "Disponible";

    case "BUSY":
      return "En livraison";

    case "OFFLINE":
      return "Hors ligne";

    default:
      return statut || "Inconnu";
  }
};

const getStatutClass = (statut) => {
  switch (statut) {
    case "AVAILABLE":
      return "available";

    case "BUSY":
      return "busy";

    case "OFFLINE":
      return "offline";

    default:
      return "unknown";
  }
};

// =====================================================
// COMPONENT
// =====================================================

export default function AdminLivreur() {
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  const [limitValues, setLimitValues] = useState({});

  // =====================================================
  // CHARGER LES LIVREURS
  // =====================================================

  const chargerLivreurs = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await apiRequest("/api/livreurs/admin");

      const liste = Array.isArray(data)
        ? data
        : Array.isArray(data.livreurs)
          ? data.livreurs
          : Array.isArray(data.data)
            ? data.data
            : [];

      setLivreurs(liste);

      const limits = {};

      liste.forEach((livreur) => {
        if (
          livreur.limiteCoursesParJour !== undefined &&
          livreur.limiteCoursesParJour !== null
        ) {
          limits[livreur._id] = livreur.limiteCoursesParJour;
        } else if (
          livreur.limiteCourses !== undefined &&
          livreur.limiteCourses !== null
        ) {
          limits[livreur._id] = livreur.limiteCourses;
        } else if (
          livreur.limite !== undefined &&
          livreur.limite !== null
        ) {
          limits[livreur._id] = livreur.limite;
        } else {
          limits[livreur._id] = "";
        }
      });

      setLimitValues(limits);
    } catch (err) {
      console.error("ADMIN LIVREURS ERROR:", err);
      setError(err.message || "Impossible de charger les livreurs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    chargerLivreurs();
  }, []);

  // =====================================================
  // MESSAGE
  // =====================================================

  const showSuccess = (message) => {
    setSuccess(message);
    setError("");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // =====================================================
  // BLOQUER
  // =====================================================

  const bloquerLivreur = async (id) => {
    const livreur = livreurs.find((item) => item._id === id);

    if (!livreur) return;

    const confirmation = window.confirm(
      `Bloquer le compte de ${livreur.username} ?\n\nLe livreur ne pourra plus utiliser son compte.`,
    );

    if (!confirmation) return;

    try {
      setActionLoading(`${id}-bloquer`);
      setError("");

      await apiRequest(`/api/livreurs/admin/${id}/bloquer`, {
        method: "PUT",
      });

      setLivreurs((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                actif: false,
                bloque: true,
              }
            : item,
        ),
      );

      showSuccess(`Le compte de ${livreur.username} a été bloqué.`);
    } catch (err) {
      setError(err.message || "Impossible de bloquer le livreur.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DÉBLOQUER
  // =====================================================

  const debloquerLivreur = async (id) => {
    const livreur = livreurs.find((item) => item._id === id);

    if (!livreur) return;

    try {
      setActionLoading(`${id}-debloquer`);
      setError("");

      await apiRequest(`/api/livreurs/admin/${id}/debloquer`, {
        method: "PUT",
      });

      setLivreurs((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                bloque: false,
              }
            : item,
        ),
      );

      showSuccess(`Le compte de ${livreur.username} a été débloqué.`);
    } catch (err) {
      setError(err.message || "Impossible de débloquer le livreur.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // ACTIVER
  // =====================================================

  const activerLivreur = async (id) => {
    const livreur = livreurs.find((item) => item._id === id);

    if (!livreur) return;

    try {
      setActionLoading(`${id}-actif`);
      setError("");

      await apiRequest(`/api/livreurs/admin/${id}/actif`, {
        method: "PUT",
        body: JSON.stringify({
          actif: true,
        }),
      });

      setLivreurs((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                actif: true,
              }
            : item,
        ),
      );

      showSuccess(`Le compte de ${livreur.username} est maintenant actif.`);
    } catch (err) {
      setError(err.message || "Impossible d'activer le livreur.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DÉSACTIVER
  // =====================================================

  const desactiverLivreur = async (id) => {
    const livreur = livreurs.find((item) => item._id === id);

    if (!livreur) return;

    const confirmation = window.confirm(
      `Désactiver le compte de ${livreur.username} ?`,
    );

    if (!confirmation) return;

    try {
      setActionLoading(`${id}-inactif`);
      setError("");

      await apiRequest(`/api/livreurs/admin/${id}/actif`, {
        method: "PUT",
        body: JSON.stringify({
          actif: false,
        }),
      });

      setLivreurs((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                actif: false,
              }
            : item,
        ),
      );

      showSuccess(`Le compte de ${livreur.username} a été désactivé.`);
    } catch (err) {
      setError(err.message || "Impossible de désactiver le livreur.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // LIMITER
  // =====================================================

  const limiterLivreur = async (id) => {
    const livreur = livreurs.find((item) => item._id === id);

    if (!livreur) return;

    const valeur = limitValues[id];

    if (valeur === "" || valeur === undefined || valeur === null) {
      setError("Indique une limite de courses.");
      return;
    }

    const limite = Number(valeur);

    if (!Number.isInteger(limite) || limite < 0) {
      setError("La limite doit être un nombre entier supérieur ou égal à 0.");
      return;
    }

    try {
      setActionLoading(`${id}-limite`);
      setError("");

      await apiRequest(`/api/livreurs/admin/${id}/limiter`, {
        method: "PUT",
        body: JSON.stringify({
          limite,
        }),
      });

      setLivreurs((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                limite,
                limiteCourses: limite,
                limiteCoursesParJour: limite,
              }
            : item,
        ),
      );

      showSuccess(
        `Limite de ${limite} course${limite > 1 ? "s" : ""} configurée pour ${livreur.username}.`,
      );
    } catch (err) {
      setError(err.message || "Impossible de modifier la limite.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // RETIRER LIMITE
  // =====================================================

  const retirerLimite = async (id) => {
    const livreur = livreurs.find((item) => item._id === id);

    if (!livreur) return;

    const confirmation = window.confirm(
      `Retirer la limite de courses de ${livreur.username} ?`,
    );

    if (!confirmation) return;

    try {
      setActionLoading(`${id}-retirer-limite`);
      setError("");

      await apiRequest(`/api/livreurs/admin/${id}/retirer-limite`, {
        method: "PUT",
      });

      setLivreurs((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                limite: null,
                limiteCourses: null,
                limiteCoursesParJour: null,
              }
            : item,
        ),
      );

      setLimitValues((prev) => ({
        ...prev,
        [id]: "",
      }));

      showSuccess(`La limite de ${livreur.username} a été retirée.`);
    } catch (err) {
      setError(err.message || "Impossible de retirer la limite.");
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // FILTRAGE
  // =====================================================

  const livreursFiltres = useMemo(() => {
    const valeur = search.trim().toLowerCase();

    return livreurs.filter((livreur) => {
      const correspondRecherche =
        !valeur ||
        livreur.username?.toLowerCase().includes(valeur) ||
        livreur.email?.toLowerCase().includes(valeur) ||
        livreur.telephone?.toLowerCase().includes(valeur);

      if (!correspondRecherche) {
        return false;
      }

      switch (filter) {
        case "ACTIFS":
          return livreur.actif === true;

        case "BLOQUES":
          return livreur.bloque === true || livreur.actif === false;

        case "DISPONIBLES":
          return livreur.statut === "AVAILABLE";

        case "BUSY":
          return livreur.statut === "BUSY";

        case "OFFLINE":
          return livreur.statut === "OFFLINE";

        default:
          return true;
      }
    });
  }, [livreurs, search, filter]);

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    const total = livreurs.length;

    const actifs = livreurs.filter(
      (livreur) => livreur.actif === true,
    ).length;

    const bloques = livreurs.filter(
      (livreur) =>
        livreur.bloque === true || livreur.actif === false,
    ).length;

    const disponibles = livreurs.filter(
      (livreur) => livreur.statut === "AVAILABLE",
    ).length;

    const busy = livreurs.filter(
      (livreur) => livreur.statut === "BUSY",
    ).length;

    return {
      total,
      actifs,
      bloques,
      disponibles,
      busy,
    };
  }, [livreurs]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Page>
      <Header>
        <div>
          <Title>Gestion des livreurs</Title>

          <Subtitle>
            Administration des comptes et des limites de courses
          </Subtitle>
        </div>

        <RefreshButton
          type="button"
          onClick={() => chargerLivreurs(true)}
          disabled={refreshing}
        >
          <FaSyncAlt className={refreshing ? "spin" : ""} />
          Actualiser
        </RefreshButton>
      </Header>

      {error && (
        <Alert type="error">
          <FaTimes />
          <span>{error}</span>

          <CloseAlert
            type="button"
            onClick={() => setError("")}
          >
            <FaTimes />
          </CloseAlert>
        </Alert>
      )}

      {success && (
        <Alert type="success">
          <FaCheckCircle />
          <span>{success}</span>

          <CloseAlert
            type="button"
            onClick={() => setSuccess("")}
          >
            <FaTimes />
          </CloseAlert>
        </Alert>
      )}

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaTruck />
          </StatIcon>

          <StatInfo>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total livreurs</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaUserCheck />
          </StatIcon>

          <StatInfo>
            <StatNumber>{stats.actifs}</StatNumber>
            <StatLabel>Comptes actifs</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaBan />
          </StatIcon>

          <StatInfo>
            <StatNumber>{stats.bloques}</StatNumber>
            <StatLabel>Bloqués / inactifs</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaCheckCircle />
          </StatIcon>

          <StatInfo>
            <StatNumber>{stats.disponibles}</StatNumber>
            <StatLabel>Disponibles</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaTruck />
          </StatIcon>

          <StatInfo>
            <StatNumber>{stats.busy}</StatNumber>
            <StatLabel>En livraison</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Toolbar>
        <SearchBox>
          <FaSearch />

          <input
            type="text"
            placeholder="Rechercher un livreur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>

        <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Tous les livreurs</option>
          <option value="ACTIFS">Comptes actifs</option>
          <option value="BLOQUES">Bloqués / inactifs</option>
          <option value="DISPONIBLES">Disponibles</option>
          <option value="BUSY">En livraison</option>
          <option value="OFFLINE">Hors ligne</option>
        </FilterSelect>
      </Toolbar>

      {loading ? (
        <LoadingContainer>
          <FaSpinner className="spin" />
          <span>Chargement des livreurs...</span>
        </LoadingContainer>
      ) : livreursFiltres.length === 0 ? (
        <EmptyState>
          <FaTruck />

          <h3>Aucun livreur trouvé</h3>

          <p>
            Aucun livreur ne correspond aux critères sélectionnés.
          </p>
        </EmptyState>
      ) : (
        <LivreursGrid>
          {livreursFiltres.map((livreur) => {
            const isBlocked =
              livreur.bloque === true ||
              livreur.actif === false;

            const limite =
              livreur.limiteCoursesParJour ??
              livreur.limiteCourses ??
              livreur.limite ??
              null;

            const coursesAujourdHui =
              livreur.coursesAujourdHui ??
              livreur.nombreCoursesAujourdHui ??
              livreur.coursesDuJour ??
              0;

            const hasLimit =
              limite !== null &&
              limite !== undefined;

            return (
              <LivreurCard key={livreur._id}>
                <CardTop>
                  <Identity>
                    <Avatar>
                      {(livreur.username || "L")
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>

                    <div>
                      <Username>
                        {livreur.username || "Livreur"}
                      </Username>

                      <Email>
                        <FaEnvelope />
                        {livreur.email || "Email non renseigné"}
                      </Email>
                    </div>
                  </Identity>

                  <AccountBadge
                    className={isBlocked ? "blocked" : "active"}
                  >
                    {isBlocked ? (
                      <>
                        <FaBan />
                        Bloqué / inactif
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Actif
                      </>
                    )}
                  </AccountBadge>
                </CardTop>

                <Divider />

                <InformationGrid>
                  <InfoItem>
                    <InfoIcon>
                      <FaPhone />
                    </InfoIcon>

                    <div>
                      <InfoLabel>Téléphone</InfoLabel>
                      <InfoValue>
                        {livreur.telephone || "Non renseigné"}
                      </InfoValue>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FaTruck />
                    </InfoIcon>

                    <div>
                      <InfoLabel>Statut du livreur</InfoLabel>

                      <StatusBadge
                        className={getStatutClass(
                          livreur.statut,
                        )}
                      >
                        <span />
                        {getStatutLabel(livreur.statut)}
                      </StatusBadge>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FaMapMarkerAlt />
                    </InfoIcon>

                    <div>
                      <InfoLabel>Localisation</InfoLabel>

                      <InfoValue>
                        {livreur.localisation?.latitude != null &&
                        livreur.localisation?.longitude != null
                          ? `${Number(
                              livreur.localisation.latitude,
                            ).toFixed(5)}, ${Number(
                              livreur.localisation.longitude,
                            ).toFixed(5)}`
                          : "Position inconnue"}
                      </InfoValue>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FaTruck />
                    </InfoIcon>

                    <div>
                      <InfoLabel>Course actuelle</InfoLabel>

                      <InfoValue>
                        {livreur.commandeActuelle
                          ? typeof livreur.commandeActuelle ===
                            "object"
                            ? livreur.commandeActuelle._id ||
                              livreur.commandeActuelle.id ||
                              "En cours"
                            : livreur.commandeActuelle
                          : "Aucune"}
                      </InfoValue>
                    </div>
                  </InfoItem>
                </InformationGrid>

                <LimitSection>
                  <LimitHeader>
                    <div>
                      <LimitTitle>
                        Limite de courses
                      </LimitTitle>

                      <LimitDescription>
                        {hasLimit
                          ? "Nombre maximum de courses autorisées."
                          : "Aucune limite configurée."}
                      </LimitDescription>
                    </div>

                    {hasLimit ? (
                      <LimitBadge>
                        {limite} / jour
                      </LimitBadge>
                    ) : (
                      <UnlimitedBadge>
                        <FaInfinity />
                        Illimitée
                      </UnlimitedBadge>
                    )}
                  </LimitHeader>

                  <CoursesProgress>
                    <ProgressText>
                      <span>Courses aujourd’hui</span>

                      <strong>
                        {coursesAujourdHui}
                        {hasLimit ? ` / ${limite}` : ""}
                      </strong>
                    </ProgressText>

                    {hasLimit && (
                      <ProgressBar>
                        <ProgressValue
                          style={{
                            width: `${Math.min(
                              100,
                              limite > 0
                                ? (coursesAujourdHui / limite) *
                                    100
                                : 100,
                            )}%`,
                          }}
                        />
                      </ProgressBar>
                    )}
                  </CoursesProgress>

                  <LimitControls>
                    <LimitInputWrapper>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Nombre"
                        value={limitValues[livreur._id] ?? ""}
                        onChange={(e) =>
                          setLimitValues((prev) => ({
                            ...prev,
                            [livreur._id]: e.target.value,
                          }))
                        }
                      />

                      <span>courses / jour</span>
                    </LimitInputWrapper>

                    <SmallButton
                      type="button"
                      onClick={() =>
                        limiterLivreur(livreur._id)
                      }
                      disabled={
                        actionLoading ===
                        `${livreur._id}-limite`
                      }
                    >
                      {actionLoading ===
                      `${livreur._id}-limite` ? (
                        <FaSpinner className="spin" />
                      ) : (
                        <FaSave />
                      )}

                      Limiter
                    </SmallButton>

                    {hasLimit && (
                      <SmallDangerButton
                        type="button"
                        onClick={() =>
                          retirerLimite(livreur._id)
                        }
                        disabled={
                          actionLoading ===
                          `${livreur._id}-retirer-limite`
                        }
                      >
                        {actionLoading ===
                        `${livreur._id}-retirer-limite` ? (
                          <FaSpinner className="spin" />
                        ) : (
                          <FaInfinity />
                        )}

                        Retirer
                      </SmallDangerButton>
                    )}
                  </LimitControls>
                </LimitSection>

                <ActionsSection>
                  <ActionTitle>
                    Gestion du compte
                  </ActionTitle>

                  <ActionsGrid>
                    {livreur.bloque === true ? (
                      <ActionButton
                        type="button"
                        className="success"
                        onClick={() =>
                          debloquerLivreur(livreur._id)
                        }
                        disabled={
                          actionLoading ===
                          `${livreur._id}-debloquer`
                        }
                      >
                        {actionLoading ===
                        `${livreur._id}-debloquer` ? (
                          <FaSpinner className="spin" />
                        ) : (
                          <FaLockOpen />
                        )}

                        Débloquer
                      </ActionButton>
                    ) : (
                      <ActionButton
                        type="button"
                        className="danger"
                        onClick={() =>
                          bloquerLivreur(livreur._id)
                        }
                        disabled={
                          actionLoading ===
                          `${livreur._id}-bloquer`
                        }
                      >
                        {actionLoading ===
                        `${livreur._id}-bloquer` ? (
                          <FaSpinner className="spin" />
                        ) : (
                          <FaLock />
                        )}

                        Bloquer
                      </ActionButton>
                    )}

                    {livreur.actif === true ? (
                      <ActionButton
                        type="button"
                        className="warning"
                        onClick={() =>
                          desactiverLivreur(livreur._id)
                        }
                        disabled={
                          actionLoading ===
                          `${livreur._id}-inactif`
                        }
                      >
                        {actionLoading ===
                        `${livreur._id}-inactif` ? (
                          <FaSpinner className="spin" />
                        ) : (
                          <FaUserSlash />
                        )}

                        Désactiver
                      </ActionButton>
                    ) : (
                      <ActionButton
                        type="button"
                        className="success"
                        onClick={() =>
                          activerLivreur(livreur._id)
                        }
                        disabled={
                          actionLoading ===
                          `${livreur._id}-actif`
                        }
                      >
                        {actionLoading ===
                        `${livreur._id}-actif` ? (
                          <FaSpinner className="spin" />
                        ) : (
                          <FaUserCheck />
                        )}

                        Activer
                      </ActionButton>
                    )}
                  </ActionsGrid>
                </ActionsSection>

                <CardFooter>
                  <FooterNote>
                    <FaTruck />

                    <span>
                      Le statut opérationnel est géré par le
                      livreur.
                    </span>
                  </FooterNote>
                </CardFooter>
              </LivreurCard>
            );
          })}
        </LivreursGrid>
      )}
    </Page>
  );
}

// =====================================================
// STYLES
// =====================================================

const Page = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 28px;
  background: #f6f8fb;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  color: #172033;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  margin: 7px 0 0;
  color: #718096;
  font-size: 14px;
`;

const RefreshButton = styled.button`
  border: none;
  background: #172033;
  color: white;
  padding: 12px 17px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #26334d;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 14px;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;

  ${(props) =>
    props.type === "error"
      ? `
        background: #fff1f2;
        color: #be123c;
        border: 1px solid #fecdd3;
      `
      : `
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
      `}
`;

const CloseAlert = styled.button`
  margin-left: auto;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 24px;

  @media (max-width: 1100px) {
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
  border: 1px solid #e8ecf2;
  border-radius: 15px;
  padding: 17px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 3px 14px rgba(16, 24, 40, 0.04);
`;

const StatIcon = styled.div`
  width: 43px;
  height: 43px;
  border-radius: 11px;
  background: #f1f5f9;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  min-width: 0;
`;

const StatNumber = styled.div`
  font-size: 23px;
  font-weight: 800;
  color: #172033;
`;

const StatLabel = styled.div`
  margin-top: 2px;
  color: #718096;
  font-size: 12px;
`;

const Toolbar = styled.div`
  background: white;
  border: 1px solid #e8ecf2;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 22px;
  display: flex;
  gap: 13px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  height: 44px;
  border: 1px solid #dce2ea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 13px;
  color: #94a3b8;
  box-sizing: border-box;

  input {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    background: transparent;
    color: #172033;
    font-size: 14px;
  }
`;

const FilterSelect = styled.select`
  height: 44px;
  min-width: 210px;
  border: 1px solid #dce2ea;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  background: white;
  color: #334155;
  font-size: 14px;
  cursor: pointer;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const LivreursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const LivreurCard = styled.div`
  background: white;
  border: 1px solid #e5e9f0;
  border-radius: 17px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(16, 24, 40, 0.045);
`;

const CardTop = styled.div`
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
`;

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #172033;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  flex-shrink: 0;
`;

const Username = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #172033;
  margin-bottom: 5px;
`;

const Email = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7b8798;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }
`;

const AccountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;

  &.active {
    background: #ecfdf5;
    color: #047857;
  }

  &.blocked {
    background: #fff1f2;
    color: #be123c;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #edf0f4;
`;

const InformationGrid = styled.div`
  padding: 18px 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 17px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
`;

const InfoIcon = styled.div`
  color: #64748b;
  width: 18px;
  margin-top: 2px;
  flex-shrink: 0;
`;

const InfoLabel = styled.div`
  color: #94a3b8;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: block;
  }

  &.available {
    color: #059669;

    span {
      background: #10b981;
    }
  }

  &.busy {
    color: #d97706;

    span {
      background: #f59e0b;
    }
  }

  &.offline {
    color: #64748b;

    span {
      background: #94a3b8;
    }
  }

  &.unknown {
    color: #64748b;

    span {
      background: #94a3b8;
    }
  }
`;

const LimitSection = styled.div`
  margin: 0 20px 18px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e8edf3;
  border-radius: 13px;
`;

const LimitHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
`;

const LimitTitle = styled.div`
  color: #172033;
  font-size: 14px;
  font-weight: 800;
`;

const LimitDescription = styled.div`
  margin-top: 4px;
  color: #8a96a8;
  font-size: 11px;
`;

const LimitBadge = styled.div`
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
`;

const UnlimitedBadge = styled.div`
  background: #ecfdf5;
  color: #047857;
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
`;

const CoursesProgress = styled.div`
  margin-bottom: 13px;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #64748b;
  font-size: 11px;
  margin-bottom: 7px;

  strong {
    color: #172033;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 7px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressValue = styled.div`
  height: 100%;
  background: #334155;
  border-radius: 999px;
  transition: width 0.25s ease;
`;

const LimitControls = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 550px) {
    flex-wrap: wrap;
  }
`;

const LimitInputWrapper = styled.div`
  flex: 1;
  min-width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #dce2ea;
  border-radius: 9px;
  overflow: hidden;

  input {
    width: 75px;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 10px;
    font-size: 13px;
    color: #172033;
  }

  span {
    color: #94a3b8;
    font-size: 11px;
    padding-right: 9px;
    white-space: nowrap;
  }
`;

const SmallButton = styled.button`
  border: none;
  background: #172033;
  color: white;
  border-radius: 9px;
  padding: 0 12px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #26334d;
  }

  &:disabled {
    opacity: 0.55;
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

const SmallDangerButton = styled.button`
  border: 1px solid #fecdd3;
  background: #fff1f2;
  color: #be123c;
  border-radius: 9px;
  padding: 0 11px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #ffe4e6;
  }

  &:disabled {
    opacity: 0.55;
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

const ActionsSection = styled.div`
  padding: 0 20px 18px;
`;

const ActionTitle = styled.div`
  color: #172033;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 9px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  height: 42px;
  border-radius: 9px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;

  &.danger {
    background: #fff1f2;
    color: #be123c;
    border-color: #fecdd3;

    &:hover {
      background: #ffe4e6;
    }
  }

  &.warning {
    background: #fffbeb;
    color: #b45309;
    border-color: #fde68a;

    &:hover {
      background: #fef3c7;
    }
  }

  &.success {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;

    &:hover {
      background: #d1fae5;
    }
  }

  &:disabled {
    opacity: 0.55;
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

const CardFooter = styled.div`
  border-top: 1px solid #edf0f4;
  padding: 12px 20px;
`;

const FooterNote = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: #94a3b8;
  font-size: 10px;

  svg {
    flex-shrink: 0;
  }
`;

const LoadingContainer = styled.div`
  min-height: 350px;
  background: white;
  border-radius: 17px;
  border: 1px solid #e8ecf2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #64748b;
  font-size: 14px;

  svg {
    font-size: 20px;
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

const EmptyState = styled.div`
  min-height: 350px;
  background: white;
  border-radius: 17px;
  border: 1px solid #e8ecf2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px;

  > svg {
    font-size: 40px;
    color: #cbd5e1;
    margin-bottom: 15px;
  }

  h3 {
    margin: 0;
    color: #334155;
    font-size: 18px;
  }

  p {
    color: #94a3b8;
    font-size: 13px;
    margin: 8px 0 0;
  }
`;