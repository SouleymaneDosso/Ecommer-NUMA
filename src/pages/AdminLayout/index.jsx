import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ecf0f1;
`;

const Sidebar = styled.aside`
  width: 260px;
  background-color: #1f2a40;
  color: #fff;
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
  letter-spacing: 1px;
  font-weight: bold;
  color: #f1c40f;
`;

const SidebarItem = styled.div`
  padding: 14px 18px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => (props.active ? "#34495e" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    background-color: #3b4b63;
  }
`;

const Badge = styled.span`
  background: ${({ status }) => {
    if (status === "en cours") return "#f39c12";
    if (status === "livré") return "#27ae60";
    if (status === "annulé") return "#e74c3c";
    return "#3498db";
  }};
  color: white;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
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
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
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
  transition: 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

const Content = styled.div`
  padding: 30px;
  flex: 1;
  overflow-y: auto;
`;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    enCours: 0,
    livré: 0,
    annulé: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin");

    // fetch counts
    const fetchCounts = async () => {
      try {
        const resOrders = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/commandes/count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataOrders = await resOrders.json();
        setOrderCount(dataOrders.total || 0);
        setOrderStatusCounts(dataOrders.statusCounts || {});

        const resUsers = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataUsers = await resUsers.json();
        setUserCount(dataUsers.total || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>Admin Panel</Logo>

        <SidebarItem
          active={location.pathname.includes("dashboard")}
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </SidebarItem>

        <SidebarItem
          active={location.pathname.includes("products")}
          onClick={() => navigate("/admin/products")}
        >
          Produits
        </SidebarItem>

        <SidebarItem
          active={location.pathname.includes("orders")}
          onClick={() => navigate("/admin/orders")}
        >
          Commandes <Badge status="en cours">{orderCount}</Badge>
        </SidebarItem>

        <SidebarItem
          active={location.pathname.includes("users")}
          onClick={() => navigate("/admin/users")}
        >
          Utilisateurs <Badge>{userCount}</Badge>
        </SidebarItem>
      </Sidebar>

      <Main>
        <Header>
          <HeaderTitle>Administration</HeaderTitle>
          <HeaderRight>
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
