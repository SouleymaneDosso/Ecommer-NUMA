import { useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

/* ================= STYLE ================= */
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ecf0f1;
`;

const Sidebar = styled.aside`
  width: 240px;
  background-color: #1f2a40;
  color: #fff;
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 22px;
  letter-spacing: 1px;
`;

const SidebarItem = styled.div`
  padding: 14px 15px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => (props.$active ? "#34495e" : "transparent")};
  transition: background 0.2s;

  &:hover {
    background-color: #34495e;
  }
`;

const Badge = styled.span`
  background: #e67e22;
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 12px;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: #fff;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const HeaderTitle = styled.h3`
  color: #2c3e50;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AdminName = styled.span`
  font-size: 14px;
  color: #555;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #e74c3c;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const Content = styled.div`
  padding: 30px;
  flex: 1;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  position: relative;
  color: #e67e22;
  font-weight: bold;

  &::after {
    content: '${(props) => props.count || 0}';
    position: absolute;
    top: -5px;
    right: -10px;
    background: red;
    color: white;
    font-size: 10px;
    font-weight: bold;
    border-radius: 50%;
    padding: 2px 6px;
  }
`;

/* ================= COMPONENT ================= */
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nbCommandes, setNbCommandes] = useState(0);
  const [nbPaiementsPending, setNbPaiementsPending] = useState(0);
  const notificationSound = useRef(null);
  const [sonAutorise, setSonAutorise] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");

    // Prépare le son
    notificationSound.current = new Audio("/notification.mp3");
    notificationSound.current.volume = 0.5;
  }, [navigate]);

  // Vérifie commandes + paiements toutes les 5s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/commandes`);
        const data = await res.json();
        if (data?.commandes) {
          const commandes = data.commandes;
          setNbCommandes(commandes.length);

          // Compte des paiements PENDING
          const pending = commandes.reduce((acc, cmd) => {
            return acc + cmd.paiementsRecus.filter(p => p.status === "PENDING").length;
          }, 0);

          // Joue le son si nouveau paiement en attente
          if (sonAutorise && pending > nbPaiementsPending) {
            notificationSound.current.play().catch(() => {});
          }

          setNbPaiementsPending(pending);
        }
      } catch (err) {
        console.error("Erreur fetch commandes:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [nbPaiementsPending, sonAutorise]);

  const handleAutoriserSon = () => {
    setSonAutorise(true);
    notificationSound.current.play().catch(() => {});
    alert("Notifications son activées ✅");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>Admin Panel</Logo>

        <SidebarItem
          $active={location.pathname.includes("dashboard")}
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </SidebarItem>

        <SidebarItem
          $active={location.pathname.includes("products")}
          onClick={() => navigate("/admin/products")}
        >
          Produits
        </SidebarItem>

        <SidebarItem
          $active={location.pathname.includes("orders")}
          onClick={() => navigate("/admin/orders")}
        >
          Commandes <Badge>{nbCommandes}</Badge>
        </SidebarItem>

        <SidebarItem
          $active={location.pathname.includes("paiement")}
          onClick={() => navigate("/admin/paiement")}
        >
          Paiements <Badge>{nbPaiementsPending}</Badge>
        </SidebarItem>
      </Sidebar>

      <Main>
        <Header>
          <HeaderTitle>Administration</HeaderTitle>
          <HeaderRight>
            {!sonAutorise && (
              <NotificationButton onClick={handleAutoriserSon}>
                🔔 Activer
              </NotificationButton>
            )}
            <AdminName>Connecté : Admin</AdminName>
            <LogoutButton onClick={handleLogout}>Déconnexion</LogoutButton>
          </HeaderRight>
        </Header>

        <Content>
          <Outlet />
        </Content>
      </Main>
    </LayoutContainer>
  );
}

export default AdminLayout;
