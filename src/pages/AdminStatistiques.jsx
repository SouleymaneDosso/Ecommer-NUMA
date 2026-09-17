import React, { useEffect, useState } from "react";
import styled from "styled-components";

const AdminStatistiques = () => {
  const [resume, setResume] = useState(null);
  const [clients, setClients] = useState([]);
  const [pages, setPages] = useState([]);
  const [funnel, setFunnel] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  const chargerStatistiques = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      };

      const [
        resumeResponse,
        clientsResponse,
        pagesResponse,
        funnelResponse,
      ] = await Promise.all([
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

        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/statistiques/pages`,
          {
            headers,
          },
        ),

        fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/statistiques/funnel`,
          {
            headers,
          },
        ),
      ]);

      if (
        !resumeResponse.ok ||
        !clientsResponse.ok ||
        !pagesResponse.ok ||
        !funnelResponse.ok
      ) {
        throw new Error(
          "Impossible de récupérer les statistiques",
        );
      }

      const [
        resumeData,
        clientsData,
        pagesData,
        funnelData,
      ] = await Promise.all([
        resumeResponse.json(),
        clientsResponse.json(),
        pagesResponse.json(),
        funnelResponse.json(),
      ]);

      setResume(resumeData);
      setClients(clientsData.clients || []);
      setPages(pagesData.pages || []);
      setFunnel(funnelData);
    } catch (error) {
      console.error(
        "❌ Erreur chargement statistiques :",
        error,
      );

      setError(
        "Impossible de charger les statistiques.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerStatistiques();
  }, []);

  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(montant || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculerPourcentage = (valeur, total) => {
    if (!total || !valeur) return 0;

    return Math.round((valeur / total) * 100);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingBox>
          <Spinner />
          <span>Chargement des statistiques...</span>
        </LoadingBox>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Page>
        <ErrorBox>
          <strong>Erreur</strong>
          <span>{error}</span>

          <RetryButton onClick={chargerStatistiques}>
            Réessayer
          </RetryButton>
        </ErrorBox>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <HeaderContent>
          <div>
            <PageTitle>
              Statistiques
            </PageTitle>

            <PageSubtitle>
              Vue globale de l'activité de votre boutique
            </PageSubtitle>
          </div>

          <RefreshButton onClick={chargerStatistiques}>
            ↻ Actualiser
          </RefreshButton>
        </HeaderContent>
      </PageHeader>

      {/* =====================================================
          AUDIENCE
      ===================================================== */}

      <Section>
        <SectionTitle>
          Audience
        </SectionTitle>

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatIcon>👥</StatIcon>

              <StatLabel>
                Visiteurs uniques
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.visiteursUniques || 0}
            </StatValue>

            <StatDescription>
              Visiteurs différents détectés
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatIcon>👁️</StatIcon>

              <StatLabel>
                Visites
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.visites || 0}
            </StatValue>

            <StatDescription>
              Pages consultées au total
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatIcon>🔄</StatIcon>

              <StatLabel>
                Sessions
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.sessions || 0}
            </StatValue>

            <StatDescription>
              Sessions de navigation
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatIcon>🔐</StatIcon>

              <StatLabel>
                Utilisateurs identifiés
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.utilisateursIdentifies || 0}
            </StatValue>

            <StatDescription>
              Visiteurs associés à un compte
            </StatDescription>
          </StatCard>
        </StatsGrid>
      </Section>

      {/* =====================================================
          COMMERCIAL
      ===================================================== */}

      <Section>
        <SectionTitle>
          Activité commerciale
        </SectionTitle>

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatIcon>🛒</StatIcon>

              <StatLabel>
                Commandes
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.commandes || 0}
            </StatValue>

            <StatDescription>
              Commandes enregistrées
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatIcon>🧑‍💼</StatIcon>

              <StatLabel>
                Clients ayant commandé
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.clientsAyantCommande || 0}
            </StatValue>

            <StatDescription>
              Utilisateurs ayant passé une commande
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatIcon>📦</StatIcon>

              <StatLabel>
                Commandes livrées
              </StatLabel>
            </StatTop>

            <StatValue>
              {resume?.commandesLivrees || 0}
            </StatValue>

            <StatDescription>
              Commandes avec statut DELIVERED
            </StatDescription>
          </StatCard>

          <RevenueCard>
            <StatTop>
              <StatIcon>💰</StatIcon>

              <StatLabel>
                Chiffre d'affaires
              </StatLabel>
            </StatTop>

            <RevenueValue>
              {formatMontant(resume?.chiffreAffaires)}
            </RevenueValue>

            <StatDescription>
              Commandes CONFIRMED, SHIPPED ou DELIVERED
            </StatDescription>
          </RevenueCard>
        </StatsGrid>
      </Section>

      {/* =====================================================
          FUNNEL
      ===================================================== */}

      <Section>
        <SectionTitle>
          Funnel visiteurs → clients
        </SectionTitle>

        <FunnelCard>
          <FunnelIntro>
            <FunnelIntroTitle>
              Parcours des visiteurs
            </FunnelIntroTitle>

            <FunnelIntroText>
              Cette vue montre combien de visiteurs passent
              progressivement de la visite du site à la commande.
            </FunnelIntroText>
          </FunnelIntro>

          <FunnelSteps>
            <FunnelStep>
              <FunnelStepTop>
                <FunnelStepNumber>
                  1
                </FunnelStepNumber>

                <FunnelStepTitle>
                  Visiteurs
                </FunnelStepTitle>
              </FunnelStepTop>

              <FunnelStepValue>
                {funnel?.visiteursUniques || 0}
              </FunnelStepValue>

              <FunnelStepDescription>
                100% des visiteurs détectés
              </FunnelStepDescription>
            </FunnelStep>

            <FunnelArrow>
              →
            </FunnelArrow>

            <FunnelStep>
              <FunnelStepTop>
                <FunnelStepNumber>
                  2
                </FunnelStepNumber>

                <FunnelStepTitle>
                  Visiteurs identifiés
                </FunnelStepTitle>
              </FunnelStepTop>

              <FunnelStepValue>
                {funnel?.visiteursIdentifies || 0}
              </FunnelStepValue>

              <FunnelStepDescription>
                {calculerPourcentage(
                  funnel?.visiteursIdentifies,
                  funnel?.visiteursUniques,
                )}
                % des visiteurs
              </FunnelStepDescription>
            </FunnelStep>

            <FunnelArrow>
              →
            </FunnelArrow>

            <FunnelStep>
              <FunnelStepTop>
                <FunnelStepNumber>
                  3
                </FunnelStepNumber>

                <FunnelStepTitle>
                  Utilisateurs inscrits
                </FunnelStepTitle>
              </FunnelStepTop>

              <FunnelStepValue>
                {funnel?.utilisateursInscrits || 0}
              </FunnelStepValue>

              <FunnelStepDescription>
                Comptes enregistrés
              </FunnelStepDescription>
            </FunnelStep>

            <FunnelArrow>
              →
            </FunnelArrow>

            <FunnelStep>
              <FunnelStepTop>
                <FunnelStepNumber>
                  4
                </FunnelStepNumber>

                <FunnelStepTitle>
                  Clients avec commande
                </FunnelStepTitle>
              </FunnelStepTop>

              <FunnelStepValue>
                {funnel?.clientsAvecCommande || 0}
              </FunnelStepValue>

              <FunnelStepDescription>
                {calculerPourcentage(
                  funnel?.clientsAvecCommande,
                  funnel?.utilisateursInscrits,
                )}
                % des comptes
              </FunnelStepDescription>
            </FunnelStep>
          </FunnelSteps>
        </FunnelCard>
      </Section>

      {/* =====================================================
          CLIENTS
      ===================================================== */}

      <Section>
        <SectionTitle>
          Clients
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <div>
              <TableTitle>
                Activité des clients
              </TableTitle>

              <TableSubtitle>
                Commandes et montants cumulés
              </TableSubtitle>
            </div>

            <TableCount>
              {clients.length} client
              {clients.length > 1 ? "s" : ""}
            </TableCount>
          </TableHeader>

          {clients.length === 0 ? (
            <EmptyState>
              Aucun client avec commande pour le moment.
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Commandes</th>
                    <th>Montant total</th>
                    <th>Première commande</th>
                    <th>Dernière commande</th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => (
                    <tr key={client.userId}>
                      <td>
                        <ClientName>
                          {client.username}
                        </ClientName>

                        <ClientEmail>
                          {client.email || "-"}
                        </ClientEmail>
                      </td>

                      <td>
                        <OrdersBadge>
                          {client.nombreCommandes}
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
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>

      {/* =====================================================
          PAGES
      ===================================================== */}

      <Section>
        <SectionTitle>
          Pages les plus consultées
        </SectionTitle>

        <TableCard>
          <TableHeader>
            <div>
              <TableTitle>
                Navigation du site
              </TableTitle>

              <TableSubtitle>
                Visites, visiteurs et sessions par page
              </TableSubtitle>
            </div>

            <TableCount>
              {pages.length} page
              {pages.length > 1 ? "s" : ""}
            </TableCount>
          </TableHeader>

          {pages.length === 0 ? (
            <EmptyState>
              Aucune visite enregistrée pour le moment.
            </EmptyState>
          ) : (
            <TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Visites</th>
                    <th>Visiteurs uniques</th>
                    <th>Sessions uniques</th>
                  </tr>
                </thead>

                <tbody>
                  {pages.map((page) => (
                    <tr key={page.page}>
                      <td>
                        <PagePath>
                          <PageIcon>
                            📄
                          </PageIcon>

                          <PageName>
                            {page.page}
                          </PageName>
                        </PagePath>
                      </td>

                      <td>
                        <VisitsBadge>
                          {page.visites}
                        </VisitsBadge>
                      </td>

                      <td>
                        <UniqueValue>
                          {page.visiteursUniques}
                        </UniqueValue>
                      </td>

                      <td>
                        <UniqueValue>
                          {page.sessionsUniques}
                        </UniqueValue>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </TableWrapper>
          )}
        </TableCard>
      </Section>
    </Page>
  );
};

/* =========================================================
   STYLES
========================================================= */

const Page = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: #f7f8fc;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: #171a21;
`;

const PageSubtitle = styled.p`
  margin: 8px 0 0;
  color: #747986;
  font-size: 15px;
`;

const RefreshButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 11px 17px;
  background: #171a21;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`;

const Section = styled.section`
  margin-bottom: 34px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 800;
  color: #171a21;
`;

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
  background: white;
  border: 1px solid #eceef3;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 5px 18px rgba(20, 25, 35, 0.04);
`;

const RevenueCard = styled(StatCard)`
  background: #171a21;
  border-color: #171a21;

  ${StatLabel} {
    color: #d8dbe2;
  }

  ${StatDescription} {
    color: #9da3af;
  }

  ${StatIcon} {
    background: #292d36;
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatIcon = styled.div`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #f1f3f7;
  font-size: 18px;
`;

const StatLabel = styled.span`
  color: #737985;
  font-size: 14px;
  font-weight: 700;
`;

const StatValue = styled.div`
  margin-top: 20px;
  font-size: 30px;
  line-height: 1;
  font-weight: 850;
  color: #171a21;
`;

const RevenueValue = styled(StatValue)`
  color: white;
`;

const StatDescription = styled.p`
  margin: 10px 0 0;
  color: #9297a2;
  font-size: 12px;
  line-height: 1.5;
`;

/* =========================================================
   FUNNEL
========================================================= */

const FunnelCard = styled.div`
  background: white;
  border: 1px solid #eceef3;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 5px 18px rgba(20, 25, 35, 0.04);
`;

const FunnelIntro = styled.div`
  margin-bottom: 24px;
`;

const FunnelIntroTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #171a21;
`;

const FunnelIntroText = styled.p`
  margin: 7px 0 0;
  color: #777d89;
  font-size: 13px;
  line-height: 1.6;
`;

const FunnelSteps = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const FunnelStep = styled.div`
  flex: 1;
  min-width: 0;
  border: 1px solid #e8eaf0;
  border-radius: 16px;
  padding: 18px;
  background: #fafbfc;
`;

const FunnelStepTop = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const FunnelStepNumber = styled.div`
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #171a21;
  color: white;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
`;

const FunnelStepTitle = styled.div`
  font-size: 13px;
  font-weight: 750;
  color: #555b66;
`;

const FunnelStepValue = styled.div`
  margin-top: 17px;
  font-size: 28px;
  font-weight: 850;
  color: #171a21;
`;

const FunnelStepDescription = styled.div`
  margin-top: 7px;
  color: #9297a2;
  font-size: 12px;
`;

const FunnelArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a2a7b1;
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 900px) {
    transform: rotate(90deg);
  }
`;

/* =========================================================
   TABLES
========================================================= */

const TableCard = styled.div`
  overflow: hidden;
  background: white;
  border: 1px solid #eceef3;
  border-radius: 18px;
  box-shadow: 0 5px 18px rgba(20, 25, 35, 0.04);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 22px;
  border-bottom: 1px solid #eceef3;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #171a21;
`;

const TableSubtitle = styled.p`
  margin: 5px 0 0;
  color: #8a909b;
  font-size: 12px;
`;

const TableCount = styled.div`
  padding: 7px 11px;
  border-radius: 10px;
  background: #f1f3f7;
  color: #5f6570;
  font-size: 12px;
  font-weight: 700;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;

  th {
    padding: 14px 22px;
    background: #fafbfc;
    color: #858b96;
    font-size: 11px;
    font-weight: 800;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  td {
    padding: 17px 22px;
    border-top: 1px solid #f0f1f4;
    color: #4d535e;
    font-size: 13px;
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.15s;
  }

  tbody tr:hover {
    background: #fafbfc;
  }
`;

const ClientName = styled.div`
  color: #20242c;
  font-size: 14px;
  font-weight: 750;
`;

const ClientEmail = styled.div`
  margin-top: 4px;
  color: #9499a3;
  font-size: 12px;
`;

const OrdersBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 5px 9px;
  border-radius: 8px;
  background: #f1f3f7;
  color: #3f454f;
  font-size: 12px;
  font-weight: 800;
`;

const Amount = styled.span`
  color: #20242c;
  font-weight: 800;
`;

const DateText = styled.span`
  color: #747a85;
  white-space: nowrap;
`;

const PagePath = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PageIcon = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f1f3f7;
`;

const PageName = styled.span`
  color: #292e37;
  font-weight: 700;
`;

const VisitsBadge = styled.span`
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f1f3f7;
  color: #353b45;
  font-weight: 800;
`;

const UniqueValue = styled.span`
  color: #555b66;
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 45px 20px;
  text-align: center;
  color: #969ba5;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fc;
`;

const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #656b76;
  font-size: 14px;
  font-weight: 600;
`;

const Spinner = styled.div`
  width: 22px;
  height: 22px;
  border: 3px solid #e1e4e9;
  border-top-color: #171a21;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorBox = styled.div`
  max-width: 520px;
  margin: 80px auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #f0d4d4;
  border-radius: 16px;
  background: #fff7f7;
  color: #7d4040;

  strong {
    font-size: 16px;
  }

  span {
    font-size: 14px;
  }
`;

const RetryButton = styled.button`
  align-self: flex-start;
  margin-top: 8px;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  background: #171a21;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

export default AdminStatistiques;