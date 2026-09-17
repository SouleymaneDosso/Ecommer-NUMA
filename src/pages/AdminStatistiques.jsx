import { useEffect, useState } from "react";
import styled from "styled-components";

/* =====================================================
   STYLES
===================================================== */

const Page = styled.div`
  width: 100%;
`;

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
  transition:
    transform 0.2s,
    box-shadow 0.2s;

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
  background: ${(props) => props.$background || "#ecf0f1"};
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
   TABLE CLIENTS
===================================================== */

const TableCard = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf0f2;
  box-shadow: 0 3px 12px rgba(31, 42, 64, 0.08);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const ClientsTable = styled.table`
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

  tbody tr {
    transition: background 0.2s;
  }

  tbody tr:hover {
    background: #fafbfc;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

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

/* =====================================================
   COMPOSANT
===================================================== */

const AdminStatistiques = () => {
  const [resume, setResume] = useState(null);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const chargerStatistiques = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("adminToken");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      /* ================================================
         CHARGEMENT DU RÉSUMÉ + CLIENTS
      ================================================ */

      const [resumeResponse, clientsResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/statistiques/resume`,
          {
            headers,
          },
        ),

        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/statistiques/clients`,
          {
            headers,
          },
        ),
      ]);

      /* ================================================
         VÉRIFICATION RÉSUMÉ
      ================================================ */

      if (!resumeResponse.ok) {
        const texte = await resumeResponse.text();

        console.error("❌ ERREUR API RESUME :", {
          status: resumeResponse.status,
          response: texte,
        });

        throw new Error(
          `Erreur API résumé ${resumeResponse.status}`,
        );
      }

      /* ================================================
         VÉRIFICATION CLIENTS
      ================================================ */

      if (!clientsResponse.ok) {
        const texte = await clientsResponse.text();

        console.error("❌ ERREUR API CLIENTS :", {
          status: clientsResponse.status,
          response: texte,
        });

        throw new Error(
          `Erreur API clients ${clientsResponse.status}`,
        );
      }

      const resumeData = await resumeResponse.json();
      const clientsData = await clientsResponse.json();

      setResume(resumeData);
      setClients(clientsData.clients || []);
    } catch (error) {
      console.error(
        "Erreur statistiques admin :",
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
    return new Intl.NumberFormat("fr-FR").format(
      Number(nombre || 0),
    );
  };

  const formatMontant = (montant) => {
    return `${new Intl.NumberFormat("fr-FR").format(
      Number(montant || 0),
    )} FCFA`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
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
              Vue globale de l'activité de votre boutique
            </p>
          </HeaderContent>

          <RefreshButton
            onClick={() => chargerStatistiques(true)}
          >
            Réessayer
          </RefreshButton>
        </PageHeader>

        <ErrorBox>
          <h3>Erreur de chargement</h3>

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
          EN-TÊTE
      ================================================= */}

      <PageHeader>
        <HeaderContent>
          <h1>Statistiques</h1>

          <p>
            Vue globale des visiteurs, utilisateurs et
            commandes
          </p>
        </HeaderContent>

        <RefreshButton
          onClick={() => chargerStatistiques(true)}
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
            Analyse de la fréquentation de votre boutique
          </p>
        </SectionTitle>

        <StatsGrid>
          {/* VISITEURS */}

          <StatCard>
            <StatTop>
              <StatLabel>
                Visiteurs uniques
              </StatLabel>

              <StatIcon $background="#e8f4fd">
                👥
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.visiteursUniques,
              )}
            </StatValue>

            <StatDescription>
              Visiteurs distincts enregistrés
            </StatDescription>
          </StatCard>

          {/* VISITES */}

          <StatCard>
            <StatTop>
              <StatLabel>Visites</StatLabel>

              <StatIcon $background="#fef3e7">
                👁️
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.visites)}
            </StatValue>

            <StatDescription>
              Nombre total de visites enregistrées
            </StatDescription>
          </StatCard>

          {/* SESSIONS */}

          <StatCard>
            <StatTop>
              <StatLabel>Sessions</StatLabel>

              <StatIcon $background="#eafaf1">
                🕐
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.sessions)}
            </StatValue>

            <StatDescription>
              Sessions de navigation
            </StatDescription>
          </StatCard>

          {/* UTILISATEURS */}

          <StatCard>
            <StatTop>
              <StatLabel>
                Utilisateurs identifiés
              </StatLabel>

              <StatIcon $background="#f4ecf7">
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
          COMMANDES
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>Activité commerciale</h2>

          <p>
            Suivi des commandes et du chiffre d'affaires
          </p>
        </SectionTitle>

        <StatsGrid>
          {/* COMMANDES */}

          <StatCard>
            <StatTop>
              <StatLabel>Commandes</StatLabel>

              <StatIcon $background="#e8f4fd">
                🛒
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.commandes)}
            </StatValue>

            <StatDescription>
              Nombre total de commandes
            </StatDescription>
          </StatCard>

          {/* CLIENTS */}

          <StatCard>
            <StatTop>
              <StatLabel>
                Clients ayant commandé
              </StatLabel>

              <StatIcon $background="#eafaf1">
                🤝
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.clientsAyantCommande,
              )}
            </StatValue>

            <StatDescription>
              Clients distincts ayant commandé
            </StatDescription>
          </StatCard>

          {/* LIVRÉES */}

          <StatCard>
            <StatTop>
              <StatLabel>
                Commandes livrées
              </StatLabel>

              <StatIcon $background="#e8f8f5">
                📦
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(
                resume.commandesLivrees,
              )}
            </StatValue>

            <StatDescription>
              Commandes avec statut livré
            </StatDescription>
          </StatCard>

          {/* CA */}

          <RevenueCard>
            <StatTop>
              <StatLabel>
                Chiffre d'affaires
              </StatLabel>

              <StatIcon $background="#fff4e5">
                💰
              </StatIcon>
            </StatTop>

            <RevenueValue>
              {formatMontant(
                resume.chiffreAffaires,
              )}
            </RevenueValue>

            <StatDescription>
              Commandes confirmées, expédiées ou
              livrées
            </StatDescription>
          </RevenueCard>
        </StatsGrid>
      </Section>

      {/* =================================================
          CLIENTS
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>Clients</h2>

          <p>
            Activité et valeur des clients ayant passé
            commande
          </p>
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <div>
              <h3>Liste des clients</h3>
            </div>

            <span>
              {formatNombre(clients.length)} client
              {clients.length > 1 ? "s" : ""}
            </span>
          </TableHeader>

          {clients.length === 0 ? (
            <EmptyState>
              <div className="icon">
                👥
              </div>

              <h3>
                Aucun client ayant commandé
              </h3>

              <p>
                Les clients apparaîtront ici dès qu'une
                commande sera enregistrée.
              </p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <ClientsTable>
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>COMMANDES</th>
                    <th>MONTANT TOTAL</th>
                    <th>PREMIÈRE COMMANDE</th>
                    <th>DERNIÈRE COMMANDE</th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => (
                    <tr key={client.userId}>
                      <td>
                        <ClientName>
                          {client.username ||
                            "Utilisateur inconnu"}
                        </ClientName>

                        <ClientEmail>
                          {client.email || "—"}
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
                  ))}
                </tbody>
              </ClientsTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>
    </Page>
  );
};

export default AdminStatistiques;