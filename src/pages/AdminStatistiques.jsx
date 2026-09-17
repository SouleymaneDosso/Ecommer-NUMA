import { useEffect, useState } from "react";
import styled from "styled-components";

/* =====================================================
   PAGE
===================================================== */

const Page = styled.div`
  width: 100%;
`;

/* =====================================================
   HEADER
===================================================== */

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  h1 {
    margin: 0 0 8px;
    color: #1f2a40;
    font-size: 30px;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 14px;
  }
`;

const RefreshButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  background: #1f2a40;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #34495e;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

/* =====================================================
   SECTIONS
===================================================== */

const Section = styled.section`
  margin-bottom: 35px;
`;

const SectionTitle = styled.div`
  margin-bottom: 18px;

  h2 {
    margin: 0 0 5px;
    color: #2c3e50;
    font-size: 20px;
  }

  p {
    margin: 0;
    color: #95a5a6;
    font-size: 13px;
  }
`;

/* =====================================================
   KPI
===================================================== */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 3px 12px rgba(31, 42, 64, 0.08);
  border: 1px solid #edf0f2;
  transition: 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(31, 42, 64, 0.12);
  }
`;

const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
`;

const StatIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$background || "#ecf0f1"};
  font-size: 21px;
`;

const StatLabel = styled.span`
  color: #7f8c8d;
  font-size: 13px;
  font-weight: 600;
`;

const StatValue = styled.div`
  color: #1f2a40;
  font-size: 27px;
  font-weight: 700;
  line-height: 1.2;
  word-break: break-word;
`;

const StatDescription = styled.div`
  margin-top: 7px;
  color: #95a5a6;
  font-size: 12px;
`;

const RevenueCard = styled(StatCard)`
  grid-column: span 2;

  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

const RevenueValue = styled(StatValue)`
  font-size: 32px;
`;

/* =====================================================
   FUNNEL
===================================================== */

const FunnelCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #edf0f2;
  box-shadow: 0 3px 12px rgba(31, 42, 64, 0.08);
  padding: 24px;
`;

const FunnelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FunnelItem = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 10px;
  background: #f8f9fa;
  border: 1px solid #edf0f2;
`;

const FunnelNumber = styled.div`
  color: #95a5a6;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const FunnelTitle = styled.div`
  color: #34495e;
  font-size: 13px;
  font-weight: 600;
`;

const FunnelValue = styled.div`
  margin-top: 12px;
  color: #1f2a40;
  font-size: 28px;
  font-weight: 700;
`;

const FunnelPercentage = styled.div`
  margin-top: 6px;
  color: #27ae60;
  font-size: 12px;
  font-weight: 600;
`;

/* =====================================================
   TABLES
===================================================== */

const TableCard = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf0f2;
  box-shadow: 0 3px 12px rgba(31, 42, 64, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 17px;
  }

  span {
    color: #95a5a6;
    font-size: 12px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;

  th {
    background: #f8f9fa;
    color: #5d6d7e;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
    padding: 15px 18px;
    border-bottom: 1px solid #edf0f2;
    white-space: nowrap;
  }

  td {
    padding: 16px 18px;
    border-bottom: 1px solid #f0f2f3;
    color: #2c3e50;
    font-size: 13px;
  }

  tbody tr:hover {
    background: #fafbfc;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

/* =====================================================
   CLIENTS
===================================================== */

const ClientName = styled.div`
  font-weight: 700;
  color: #1f2a40;
`;

const ClientEmail = styled.div`
  margin-top: 4px;
  color: #95a5a6;
  font-size: 12px;
`;

const OrdersBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 28px;
  padding: 0 8px;
  border-radius: 7px;
  background: #eaf2f8;
  color: #2c3e50;
  font-weight: 700;
`;

const Amount = styled.span`
  font-weight: 700;
  color: #1f2a40;
`;

const DateText = styled.span`
  color: #7f8c8d;
  font-size: 12px;
`;

/* =====================================================
   PAGES
===================================================== */

const PagePath = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageIcon = styled.span`
  font-size: 18px;
`;

const PageName = styled.span`
  font-weight: 600;
  color: #1f2a40;
`;

const VisitsBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  height: 28px;
  padding: 0 9px;
  border-radius: 7px;
  background: #fef3e7;
  color: #d35400;
  font-weight: 700;
`;

const UniqueValue = styled.span`
  font-weight: 600;
  color: #34495e;
`;

/* =====================================================
   VISITEURS
===================================================== */

const VisitorId = styled.span`
  display: inline-block;
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
  font-size: 11px;
  color: #7f8c8d;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 7px;
  background: ${(props) =>
    props.$identified
      ? "#eafaf1"
      : "#f4f6f7"};
  color: ${(props) =>
    props.$identified
      ? "#27ae60"
      : "#7f8c8d"};
  font-size: 11px;
  font-weight: 700;
`;

/* =====================================================
   UTILISATEURS
===================================================== */

const UserBadge = styled.span`
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 7px;
  background: ${(props) =>
    props.$hasOrder
      ? "#e8f4fd"
      : "#f4f6f7"};
  color: ${(props) =>
    props.$hasOrder
      ? "#2980b9"
      : "#7f8c8d"};
  font-size: 11px;
  font-weight: 700;
`;

/* =====================================================
   ÉVOLUTION
===================================================== */

const EvolutionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(180px, 1fr)
  );
  gap: 12px;
`;

const EvolutionItem = styled.div`
  padding: 16px;
  border: 1px solid #edf0f2;
  border-radius: 10px;
  background: #fafbfc;
`;

const EvolutionDate = styled.div`
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const EvolutionValue = styled.div`
  color: #1f2a40;
  font-size: 24px;
  font-weight: 700;
`;

const EvolutionDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;

  span {
    padding: 4px 7px;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #edf0f2;
    color: #7f8c8d;
    font-size: 10px;
  }
`;

/* =====================================================
   EMPTY
===================================================== */

const EmptyState = styled.div`
  padding: 50px 20px;
  text-align: center;
  color: #95a5a6;

  .icon {
    font-size: 35px;
    margin-bottom: 12px;
  }

  h3 {
    margin: 0 0 6px;
    color: #5d6d7e;
    font-size: 16px;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
`;

/* =====================================================
   LOADING / ERROR
===================================================== */

const LoadingContainer = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 15px;
`;

const LoadingBox = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 35px;
  height: 35px;
  margin: 0 auto 15px;
  border: 4px solid #ecf0f1;
  border-top-color: #1f2a40;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorBox = styled.div`
  background: #fff;
  border: 1px solid #f5c6cb;
  border-left: 5px solid #e74c3c;
  border-radius: 10px;
  padding: 20px;
  color: #721c24;

  h3 {
    margin: 0 0 7px;
    font-size: 16px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

/* =====================================================
   COMPOSANT
===================================================== */

const AdminStatistiques = () => {
  const [resume, setResume] = useState(null);
  const [clients, setClients] = useState([]);
  const [pages, setPages] = useState([]);
  const [funnel, setFunnel] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [visiteurs, setVisiteurs] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [fidelite, setFidelite] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     CHARGEMENT
  ===================================================== */

  const chargerStatistiques = async (
    isRefresh = false,
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("adminToken");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const baseUrl =
        `${import.meta.env.VITE_API_URL}` +
        `/api/admin/statistiques`;

      const responses = await Promise.all([
        fetch(`${baseUrl}/resume`, {
          headers,
        }),

        fetch(`${baseUrl}/clients`, {
          headers,
        }),

        fetch(`${baseUrl}/pages`, {
          headers,
        }),

        fetch(`${baseUrl}/funnel`, {
          headers,
        }),

        fetch(`${baseUrl}/evolution`, {
          headers,
        }),

        fetch(`${baseUrl}/visiteurs`, {
          headers,
        }),

        fetch(`${baseUrl}/utilisateurs`, {
          headers,
        }),

        fetch(`${baseUrl}/fidelite`, {
          headers,
        }),
      ]);

      const noms = [
        "résumé",
        "clients",
        "pages",
        "funnel",
        "évolution",
        "visiteurs",
        "utilisateurs",
        "fidélité",
      ];

      for (
        let i = 0;
        i < responses.length;
        i++
      ) {
        if (!responses[i].ok) {
          const texte =
            await responses[i].text();

          console.error(
            `❌ ERREUR API ${noms[i]} :`,
            {
              status:
                responses[i].status,
              response: texte,
            },
          );

          throw new Error(
            `Erreur API ${noms[i]} ${responses[i].status}`,
          );
        }
      }

      const [
        resumeData,
        clientsData,
        pagesData,
        funnelData,
        evolutionData,
        visiteursData,
        utilisateursData,
        fideliteData,
      ] = await Promise.all(
        responses.map((response) =>
          response.json(),
        ),
      );

      setResume(resumeData);

      setClients(
        clientsData.clients || [],
      );

      setPages(
        pagesData.pages || [],
      );

      setFunnel(funnelData);

      setEvolution(
        evolutionData.evolution || [],
      );

      setVisiteurs(
        visiteursData.visiteurs || [],
      );

      setUtilisateurs(
        utilisateursData.utilisateurs ||
          [],
      );

      setFidelite(
        fideliteData.clients || [],
      );
    } catch (error) {
      console.error(
        "❌ Erreur statistiques admin :",
        error,
      );

      setError(
        "Impossible de charger les statistiques. Vérifiez votre connexion puis réessayez.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    chargerStatistiques();
  }, []);

  /* =====================================================
     FORMATAGE
  ===================================================== */

  const formatNombre = (nombre) => {
    return new Intl.NumberFormat(
      "fr-FR",
    ).format(Number(nombre || 0));
  };

  const formatMontant = (montant) => {
    return `${new Intl.NumberFormat(
      "fr-FR",
    ).format(Number(montant || 0))} FCFA`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    ).format(new Date(date));
  };

  const formatDateComplete = (date) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(new Date(date));
  };

  const calculerPourcentage = (
    valeur,
    total,
  ) => {
    if (!total) {
      return 0;
    }

    return Math.round(
      (Number(valeur || 0) /
        Number(total || 0)) *
        100,
    );
  };

  const formatDateEvolution = (date) => {
    if (!date) {
      return "—";
    }

    const [annee, mois, jour] =
      date.split("-");

    return `${jour}/${mois}`;
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingBox>
          <Spinner />
          Chargement des statistiques...
        </LoadingBox>
      </LoadingContainer>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <Page>
        <PageHeader>
          <HeaderContent>
            <h1>Statistiques</h1>

            <p>
              Vue globale de l'activité de votre
              boutique
            </p>
          </HeaderContent>

          <RefreshButton
            onClick={() =>
              chargerStatistiques(true)
            }
          >
            Réessayer
          </RefreshButton>
        </PageHeader>

        <ErrorBox>
          <h3>
            Erreur de chargement
          </h3>

          <p>{error}</p>
        </ErrorBox>
      </Page>
    );
  }

  if (!resume) {
    return null;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Page>
      {/* =================================================
          HEADER
      ================================================= */}

      <PageHeader>
        <HeaderContent>
          <h1>Statistiques</h1>

          <p>
            Vue globale des visiteurs,
            utilisateurs et commandes
          </p>
        </HeaderContent>

        <RefreshButton
          onClick={() =>
            chargerStatistiques(true)
          }
          disabled={refreshing}
        >
          {refreshing
            ? "Actualisation..."
            : "↻ Actualiser"}
        </RefreshButton>
      </PageHeader>

      {/* =================================================
          AUDIENCE
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>Audience</h2>

          <p>
            Fréquentation globale de la boutique
          </p>
        </SectionTitle>

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>
                Visiteurs uniques
              </StatLabel>

              <StatIcon
                $background="#e8f4fd"
              >
                👥
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.visiteursUniques,
              )}
            </StatValue>

            <StatDescription>
              Visiteurs différents
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                Visites
              </StatLabel>

              <StatIcon
                $background="#fef3e7"
              >
                👁️
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.visites,
              )}
            </StatValue>

            <StatDescription>
              Pages consultées
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                Sessions
              </StatLabel>

              <StatIcon
                $background="#eafaf1"
              >
                🕐
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.sessions,
              )}
            </StatValue>

            <StatDescription>
              Sessions de navigation
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                Utilisateurs identifiés
              </StatLabel>

              <StatIcon
                $background="#f4ecf7"
              >
                👤
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.utilisateursIdentifies,
              )}
            </StatValue>

            <StatDescription>
              Visiteurs associés à un compte
            </StatDescription>
          </StatCard>
        </StatsGrid>
      </Section>

      {/* =================================================
          COMMERCIAL
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Activité commerciale
          </h2>

          <p>
            Commandes et chiffre d'affaires
          </p>
        </SectionTitle>

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>
                Commandes
              </StatLabel>

              <StatIcon
                $background="#e8f4fd"
              >
                🛒
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.commandes,
              )}
            </StatValue>

            <StatDescription>
              Commandes enregistrées
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                Clients ayant commandé
              </StatLabel>

              <StatIcon
                $background="#eafaf1"
              >
                🤝
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.clientsAyantCommande,
              )}
            </StatValue>

            <StatDescription>
              Clients distincts
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>
                Commandes livrées
              </StatLabel>

              <StatIcon
                $background="#e8f8f5"
              >
                📦
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.commandesLivrees,
              )}
            </StatValue>

            <StatDescription>
              Commandes livrées
            </StatDescription>
          </StatCard>

          <RevenueCard>
            <StatTop>
              <StatLabel>
                Chiffre d'affaires
              </StatLabel>

              <StatIcon
                $background="#fff4e5"
              >
                💰
              </StatIcon>
            </StatTop>

            <RevenueValue>
              {formatMontant(
                resume.chiffreAffaires,
              )}
            </RevenueValue>

            <StatDescription>
              Commandes confirmées,
              expédiées ou livrées
            </StatDescription>
          </RevenueCard>
        </StatsGrid>
      </Section>

      {/* =================================================
          FUNNEL
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Funnel visiteurs → clients
          </h2>

          <p>
            Parcours des visiteurs jusqu'à la
            commande
          </p>
        </SectionTitle>

        <FunnelCard>
          <FunnelGrid>
            <FunnelItem>
              <FunnelNumber>
                ÉTAPE 01
              </FunnelNumber>

              <FunnelTitle>
                Visiteurs
              </FunnelTitle>

              <FunnelValue>
                {formatNombre(
                  funnel?.visiteursUniques,
                )}
              </FunnelValue>

              <FunnelPercentage>
                100%
              </FunnelPercentage>
            </FunnelItem>

            <FunnelItem>
              <FunnelNumber>
                ÉTAPE 02
              </FunnelNumber>

              <FunnelTitle>
                Visiteurs identifiés
              </FunnelTitle>

              <FunnelValue>
                {formatNombre(
                  funnel?.visiteursIdentifies,
                )}
              </FunnelValue>

              <FunnelPercentage>
                {calculerPourcentage(
                  funnel?.visiteursIdentifies,
                  funnel?.visiteursUniques,
                )}
                % des visiteurs
              </FunnelPercentage>
            </FunnelItem>

            <FunnelItem>
              <FunnelNumber>
                ÉTAPE 03
              </FunnelNumber>

              <FunnelTitle>
                Utilisateurs inscrits
              </FunnelTitle>

              <FunnelValue>
                {formatNombre(
                  funnel?.utilisateursInscrits,
                )}
              </FunnelValue>

              <FunnelPercentage>
                Comptes enregistrés
              </FunnelPercentage>
            </FunnelItem>

            <FunnelItem>
              <FunnelNumber>
                ÉTAPE 04
              </FunnelNumber>

              <FunnelTitle>
                Clients avec commande
              </FunnelTitle>

              <FunnelValue>
                {formatNombre(
                  funnel?.clientsAvecCommande,
                )}
              </FunnelValue>

              <FunnelPercentage>
                {calculerPourcentage(
                  funnel?.clientsAvecCommande,
                  funnel?.utilisateursInscrits,
                )}
                % des comptes
              </FunnelPercentage>
            </FunnelItem>
          </FunnelGrid>
        </FunnelCard>
      </Section>

      {/* =================================================
          ÉVOLUTION
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Évolution des visites
          </h2>

          <p>
            Activité des 30 derniers jours
          </p>
        </SectionTitle>

        <TableCard>
          {evolution.length === 0 ? (
            <EmptyState>
              <div className="icon">
                📈
              </div>

              <h3>
                Pas encore de données
              </h3>

              <p>
                Les données apparaîtront
                automatiquement avec les
                nouvelles visites.
              </p>
            </EmptyState>
          ) : (
            <EvolutionGrid
              style={{
                padding: "20px",
              }}
            >
              {evolution.map((jour) => (
                <EvolutionItem
                  key={jour.date}
                >
                  <EvolutionDate>
                    {formatDateEvolution(
                      jour.date,
                    )}
                  </EvolutionDate>

                  <EvolutionValue>
                    {formatNombre(
                      jour.visites,
                    )}{" "}
                    visites
                  </EvolutionValue>

                  <EvolutionDetails>
                    <span>
                      👥{" "}
                      {formatNombre(
                        jour.visiteursUniques,
                      )}
                    </span>

                    <span>
                      🕐{" "}
                      {formatNombre(
                        jour.sessionsUniques,
                      )}
                    </span>

                    <span>
                      👤{" "}
                      {formatNombre(
                        jour.utilisateursIdentifies,
                      )}
                    </span>
                  </EvolutionDetails>
                </EvolutionItem>
              ))}
            </EvolutionGrid>
          )}
        </TableCard>
      </Section>

      {/* =================================================
          FIDÉLITÉ
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Fidélité des clients
          </h2>

          <p>
            Indicateurs objectifs basés sur
            l'historique des commandes
          </p>
        </SectionTitle>

        <TableCard>
          {fidelite.length === 0 ? (
            <EmptyState>
              <div className="icon">
                ⭐
              </div>

              <h3>
                Aucun historique client
              </h3>

              <p>
                Les statistiques apparaîtront
                après les premières commandes.
              </p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>
                      CLIENT
                    </th>

                    <th>
                      COMMANDES
                    </th>

                    <th>
                      MONTANT TOTAL
                    </th>

                    <th>
                      PANIER MOYEN
                    </th>

                    <th>
                      PREMIÈRE
                    </th>

                    <th>
                      DERNIÈRE
                    </th>

                    <th>
                      DURÉE CLIENT
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {fidelite.map(
                    (client) => (
                      <tr
                        key={
                          client.userId
                        }
                      >
                        <td>
                          <ClientName>
                            {
                              client.username
                            }
                          </ClientName>

                          <ClientEmail>
                            {
                              client.email
                            }
                          </ClientEmail>
                        </td>

                        <td>
                          <OrdersBadge>
                            {formatNombre(
                              client.nombreCommandes,
                            )}
                          </OrdersBadge>
                        </td>

                        <td>
                          <Amount>
                            {formatMontant(
                              client.montantTotal,
                            )}
                          </Amount>
                        </td>

                        <td>
                          {formatMontant(
                            client.panierMoyen,
                          )}
                        </td>

                        <td>
                          <DateText>
                            {formatDate(
                              client.premiereCommande,
                            )}
                          </DateText>
                        </td>

                        <td>
                          <DateText>
                            {formatDate(
                              client.derniereCommande,
                            )}
                          </DateText>
                        </td>

                        <td>
                          <DateText>
                            {
                              client.joursClient
                            }{" "}
                            jour
                            {client.joursClient >
                            1
                              ? "s"
                              : ""}
                          </DateText>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>

      {/* =================================================
          TOUS LES UTILISATEURS
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Utilisateurs inscrits
          </h2>

          <p>
            Tous les comptes enregistrés sur
            la plateforme
          </p>
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <h3>
              Liste des utilisateurs
            </h3>

            <span>
              {formatNombre(
                utilisateurs.length,
              )}{" "}
              utilisateur
              {utilisateurs.length >
              1
                ? "s"
                : ""}
            </span>
          </TableHeader>

          {utilisateurs.length === 0 ? (
            <EmptyState>
              <div className="icon">
                👤
              </div>

              <h3>
                Aucun utilisateur
              </h3>

              <p>
                Aucun compte enregistré.
              </p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>
                      UTILISATEUR
                    </th>

                    <th>
                      INSCRIPTION
                    </th>

                    <th>
                      COMMANDES
                    </th>

                    <th>
                      MONTANT TOTAL
                    </th>

                    <th>
                      DERNIÈRE COMMANDE
                    </th>

                    <th>
                      STATUT
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {utilisateurs.map(
                    (user) => (
                      <tr
                        key={
                          user.userId
                        }
                      >
                        <td>
                          <ClientName>
                            {
                              user.username
                            }
                          </ClientName>

                          <ClientEmail>
                            {
                              user.email
                            }
                          </ClientEmail>
                        </td>

                        <td>
                          <DateText>
                            {formatDate(
                              user.createdAt,
                            )}
                          </DateText>
                        </td>

                        <td>
                          <OrdersBadge>
                            {formatNombre(
                              user.nombreCommandes,
                            )}
                          </OrdersBadge>
                        </td>

                        <td>
                          <Amount>
                            {formatMontant(
                              user.montantTotal,
                            )}
                          </Amount>
                        </td>

                        <td>
                          <DateText>
                            {formatDate(
                              user.derniereCommande,
                            )}
                          </DateText>
                        </td>

                        <td>
                          <UserBadge
                            $hasOrder={
                              user.nombreCommandes >
                              0
                            }
                          >
                            {user.nombreCommandes >
                            0
                              ? "CLIENT"
                              : "INSCRIT"}
                          </UserBadge>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>

      {/* =================================================
          VISITEURS
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Visiteurs
          </h2>

          <p>
            Visiteurs anonymes et visiteurs
            identifiés
          </p>
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <h3>
              Activité des visiteurs
            </h3>

            <span>
              Jusqu'à 500 visiteurs
              récents
            </span>
          </TableHeader>

          {visiteurs.length === 0 ? (
            <EmptyState>
              <div className="icon">
                👥
              </div>

              <h3>
                Aucun visiteur
              </h3>

              <p>
                Les visiteurs apparaîtront
                automatiquement.
              </p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>
                      VISITEUR
                    </th>

                    <th>
                      STATUT
                    </th>

                    <th>
                      VISITES
                    </th>

                    <th>
                      SESSIONS
                    </th>

                    <th>
                      PAGES
                    </th>

                    <th>
                      PREMIÈRE VISITE
                    </th>

                    <th>
                      DERNIÈRE VISITE
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiteurs.map(
                    (visiteur) => (
                      <tr
                        key={
                          visiteur.visitorId
                        }
                      >
                        <td>
                          <VisitorId>
                            {
                              visiteur.visitorId
                            }
                          </VisitorId>
                        </td>

                        <td>
                          <StatusBadge
                            $identified={
                              visiteur.identifie
                            }
                          >
                            {visiteur.identifie
                              ? "IDENTIFIÉ"
                              : "ANONYME"}
                          </StatusBadge>
                        </td>

                        <td>
                          <VisitsBadge>
                            {formatNombre(
                              visiteur.nombreVisites,
                            )}
                          </VisitsBadge>
                        </td>

                        <td>
                          <UniqueValue>
                            {formatNombre(
                              visiteur.sessions,
                            )}
                          </UniqueValue>
                        </td>

                        <td>
                          <UniqueValue>
                            {formatNombre(
                              visiteur.pages,
                            )}
                          </UniqueValue>
                        </td>

                        <td>
                          <DateText>
                            {formatDateComplete(
                              visiteur.premiereVisite,
                            )}
                          </DateText>
                        </td>

                        <td>
                          <DateText>
                            {formatDateComplete(
                              visiteur.derniereVisite,
                            )}
                          </DateText>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>

      {/* =================================================
          PAGES
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Pages visitées
          </h2>

          <p>
            Pages les plus consultées
          </p>
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <h3>
              Activité par page
            </h3>

            <span>
              {formatNombre(
                pages.length,
              )}{" "}
              page
              {pages.length > 1
                ? "s"
                : ""}
            </span>
          </TableHeader>

          {pages.length === 0 ? (
            <EmptyState>
              <div className="icon">
                📊
              </div>

              <h3>
                Aucune visite
              </h3>

              <p>
                Les pages apparaîtront ici
                automatiquement.
              </p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>
                      PAGE
                    </th>

                    <th>
                      VISITES
                    </th>

                    <th>
                      VISITEURS UNIQUES
                    </th>

                    <th>
                      SESSIONS UNIQUES
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pages.map(
                    (page) => (
                      <tr
                        key={page.page}
                      >
                        <td>
                          <PagePath>
                            <PageIcon>
                              📄
                            </PageIcon>

                            <PageName>
                              {
                                page.page
                              }
                            </PageName>
                          </PagePath>
                        </td>

                        <td>
                          <VisitsBadge>
                            {formatNombre(
                              page.visites,
                            )}
                          </VisitsBadge>
                        </td>

                        <td>
                          <UniqueValue>
                            {formatNombre(
                              page.visiteursUniques,
                            )}
                          </UniqueValue>
                        </td>

                        <td>
                          <UniqueValue>
                            {formatNombre(
                              page.sessionsUniques,
                            )}
                          </UniqueValue>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>

      {/* =================================================
          CLIENTS
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>
            Clients et commandes
          </h2>

          <p>
            Vue détaillée des clients ayant
            commandé
          </p>
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <h3>
              Historique commercial
            </h3>

            <span>
              {formatNombre(
                clients.length,
              )}{" "}
              client
              {clients.length > 1
                ? "s"
                : ""}
            </span>
          </TableHeader>

          {clients.length === 0 ? (
            <EmptyState>
              <div className="icon">
                🛒
              </div>

              <h3>
                Aucun client ayant commandé
              </h3>

              <p>
                Les statistiques apparaîtront
                après les premières commandes.
              </p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>
                      CLIENT
                    </th>

                    <th>
                      COMMANDES
                    </th>

                    <th>
                      MONTANT TOTAL
                    </th>

                    <th>
                      PREMIÈRE COMMANDE
                    </th>

                    <th>
                      DERNIÈRE COMMANDE
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map(
                    (client) => (
                      <tr
                        key={
                          client.userId
                        }
                      >
                        <td>
                          <ClientName>
                            {
                              client.username
                            }
                          </ClientName>

                          <ClientEmail>
                            {
                              client.email
                            }
                          </ClientEmail>
                        </td>

                        <td>
                          <OrdersBadge>
                            {formatNombre(
                              client.nombreCommandes,
                            )}
                          </OrdersBadge>
                        </td>

                        <td>
                          <Amount>
                            {formatMontant(
                              client.montantTotal,
                            )}
                          </Amount>
                        </td>

                        <td>
                          <DateText>
                            {formatDate(
                              client.premiereCommande,
                            )}
                          </DateText>
                        </td>

                        <td>
                          <DateText>
                            {formatDate(
                              client.derniereCommande,
                            )}
                          </DateText>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>
    </Page>
  );
};

export default AdminStatistiques;