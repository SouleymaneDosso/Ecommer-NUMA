import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { API_URL } from "../../render";
Modal.setAppElement("#root");

/* ===== Styles ===== */
const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f9fafb;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f1f3f6;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #4a5568;
  vertical-align: top;
`;

const Button = styled.button`
  padding: 6px 12px;
  background: ${({ bg }) => bg || "#007bff"};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalSection = styled.div`
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
`;

const ModalSectionTitle = styled.h4`
  margin-bottom: 10px;
  color: #34495e;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

/* ===== COMPONENT ===== */
function AdminOrdersPro() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/commandes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Erreur récupération commandes:", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===== Filtrage & tri ===== */
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(
      (o) =>
        o._id.includes(search) ||
        o.userId.username?.toLowerCase().includes(search.toLowerCase()) ||
        o.statut.includes(filterStatus)
    );

    filtered.sort((a, b) => {
      if (sortField === "total") return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
      if (sortField === "createdAt") return sortOrder === "asc" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    return filtered;
  }, [orders, search, filterStatus, sortField, sortOrder]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  /* ===== Actions ===== */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/commande/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statut: newStatus })
      });
      if (!res.ok) throw new Error("Erreur mise à jour statut");
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, statut: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de changer le statut");
    }
  };

  const handleSendEmail = async (order) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/commande/${order._id}/send-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur envoi email");
      alert("Email envoyé avec succès !");
    } catch (err) {
      console.error(err);
      alert("Impossible d’envoyer l’email");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/commande/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur suppression commande");
      fetchOrders();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la commande");
    }
  };

  /* ===== Render ===== */
  return (
    <Container>
      <Title>Gestion des commandes (PRO)</Title>

      <Controls>
        <Input placeholder="Recherche par ID ou utilisateur..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="en cours">En cours</option>
          <option value="envoyé">Envoyé</option>
          <option value="livré">Livré</option>
          <option value="annulé">Annulé</option>
        </Select>
      </Controls>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th onClick={() => { setSortField("createdAt"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Date</Th>
              <Th>ID</Th>
              <Th>Utilisateur</Th>
              <Th onClick={() => { setSortField("total"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Total</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order._id}>
                <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                <Td>{order._id}</Td>
                <Td>{order.userId?.username || order.userId || "—"}</Td>
                <Td>{order.total} FCFA</Td>
                <Td>{order.statut}</Td>
                <Td style={{ display: "flex", gap: "8px" }}>
                  <Button onClick={() => { setSelectedOrder(order); setModalOpen(true); }}>Détails</Button>
                  <Button bg="#28a745" onClick={() => handleSendEmail(order)}>Envoyer email</Button>
                  <Button bg="#e74c3c" onClick={() => handleDeleteOrder(order._id)}>Supprimer</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button key={i} bg={currentPage === i + 1 ? "#007bff" : "#6c757d"} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
        ))}
      </div>

      {/* Modal détails */}
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} style={{ content: { maxWidth: "800px", margin: "auto", borderRadius: "14px", padding: "25px", maxHeight: "85vh", overflow: "auto" } }}>
        {selectedOrder && (
          <ModalContent>
            <h2>Commande {selectedOrder._id}</h2>

            <ModalSection>
              <ModalSectionTitle>Utilisateur</ModalSectionTitle>
              <p>Nom : {selectedOrder.userId?.username || "—"}</p>
              <p>Email : {selectedOrder.userId?.email || "—"}</p>
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>Produits</ModalSectionTitle>
              {selectedOrder.produits.map(p => (
                <p key={p.produitId?._id || p.produitId}>{p.produitId?.title || "Produit"} — Qte: {p.quantite} — Prix: {p.prix} FCFA</p>
              ))}
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>Statut</ModalSectionTitle>
              <Select value={selectedOrder.statut} onChange={e => handleStatusChange(selectedOrder._id, e.target.value)}>
                <option value="en cours">En cours</option>
                <option value="envoyé">Envoyé</option>
                <option value="livré">Livré</option>
                <option value="annulé">Annulé</option>
              </Select>
            </ModalSection>

            <ModalSection>
              <ModalSectionTitle>Total & Adresse</ModalSectionTitle>
              <p>Total : {selectedOrder.total} FCFA</p>
              <p>Adresse : {selectedOrder.adresseLivraison || "—"}</p>
            </ModalSection>

            <ModalFooter>
              <Button onClick={() => setModalOpen(false)}>Fermer</Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
}

export default AdminOrdersPro;
