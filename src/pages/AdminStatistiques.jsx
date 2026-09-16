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

  @media (max-width: 1100px) {
    grid-column: span 2;
  }

  @media (max-width: 600px) {
    grid-column: span 1;
  }
`;

const RevenueValue = styled(StatValue)`
  font-size: 32px;
`;

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const chargerResume = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/statistiques/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const texte = await response.text();

        console.error("❌ ERREUR API STATISTIQUES :", {
          status: response.status,
          statusText: response.statusText,
          response: texte,
        });

        throw new Error(`Erreur API ${response.status}`);
      }

      const data = await response.json();

      setResume(data);
    } catch (error) {
      console.error("Erreur statistiques admin :", error);

      setError(
        "Impossible de charger les statistiques. Vérifiez votre connexion puis réessayez.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    chargerResume();
  }, []);

  const formatNombre = (nombre) => {
    return new Intl.NumberFormat("fr-FR").format(Number(nombre || 0));
  };

  const formatMontant = (montant) => {
    return `${new Intl.NumberFormat("fr-FR").format(
      Number(montant || 0),
    )} FCFA`;
  };

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

  if (error) {
    return (
      <Page>
        <PageHeader>
          <HeaderContent>
            <h1>Statistiques</h1>
            <p>Vue globale de l'activité de votre boutique</p>
          </HeaderContent>

          <RefreshButton onClick={() => chargerResume(true)}>
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

  return (
    <Page>
      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <PageHeader>
        <HeaderContent>
          <h1>Statistiques</h1>

          <p>
            Vue globale des visiteurs, utilisateurs et commandes
          </p>
        </HeaderContent>

        <RefreshButton
          onClick={() => chargerResume(true)}
          disabled={refreshing}
        >
          {refreshing ? "Actualisation..." : "↻ Actualiser"}
        </RefreshButton>
      </PageHeader>

      {/* =================================================
          VISITEURS
      ================================================= */}

      <Section>
        <SectionTitle>
          <h2>Audience</h2>
          <p>Analyse de la fréquentation de votre boutique</p>
        </SectionTitle>

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>Visiteurs uniques</StatLabel>

              <StatIcon $background="#e8f4fd">
                👥
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.visiteursUniques)}
            </StatValue>

            <StatDescription>
              Nombre de visiteurs distincts
            </StatDescription>
          </StatCard>

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
              Nombre total de pages visitées
            </StatDescription>
          </StatCard>

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
              Sessions de navigation enregistrées
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Utilisateurs identifiés</StatLabel>

              <StatIcon $background="#f4ecf7">
                👤
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.utilisateursIdentifies)}
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
          <h2>Commandes</h2>
          <p>Suivi de l'activité commerciale</p>
        </SectionTitle>

        <StatsGrid>
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

          <StatCard>
            <StatTop>
              <StatLabel>Clients ayant commandé</StatLabel>

              <StatIcon $background="#eafaf1">
                🤝
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.clientsAyantCommande)}
            </StatValue>

            <StatDescription>
              Clients distincts ayant passé commande
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Commandes livrées</StatLabel>

              <StatIcon $background="#e8f8f5">
                📦
              </StatIcon>
            </StatTop>

            <StatValue>
              {formatNombre(resume.commandesLivrees)}
            </StatValue>

            <StatDescription>
              Commandes avec statut livré
            </StatDescription>
          </StatCard>

          <RevenueCard>
            <StatTop>
              <StatLabel>Chiffre d'affaires</StatLabel>

              <StatIcon $background="#fff4e5">
                💰
              </StatIcon>
            </StatTop>

            <RevenueValue>
              {formatMontant(resume.chiffreAffaires)}
            </RevenueValue>

            <StatDescription>
              Chiffre d'affaires des commandes confirmées,
              expédiées ou livrées
            </StatDescription>
          </RevenueCard>
        </StatsGrid>
      </Section>
    </Page>
  );
};

export default AdminStatistiques;