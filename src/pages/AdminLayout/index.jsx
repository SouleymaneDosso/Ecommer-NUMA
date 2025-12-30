import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
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

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
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
          Commandes <Badge>12</Badge>
        </SidebarItem>

        <SidebarItem
          $active={location.pathname.includes("users")}
          onClick={() => navigate("/admin/users")}
        >
          Utilisateurs <Badge>5</Badge>
        </SidebarItem>


          <SidebarItem
          $active={location.pathname.includes("paiement")}
          onClick={() => navigate("/admin/paiement")}
        >
          Paiement <Badge>0</Badge>
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
