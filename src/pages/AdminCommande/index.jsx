import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Modal from "react-modal";
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f1f3f6;
  font-weight: 600;
  color: #2c3e50;
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
  &:disabled {
    opacity: 0.6;
  }
`;
const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 8px;
`;
const ProductRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 10px;
`;
const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

/* ===== COMPONENT ===== */
function AdminOrdersWithThumb() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const token = localStorage.getItem("adminToken");

  /* ===== FETCH ===== */
  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/commandes?page=${currentPage}&limit=${itemsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setOrders(data.commandes || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  /* ===== FILTERS ===== */
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o._id.includes(search) ||
        o.client?.nom?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        !filterStatus || o.statusCommande === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  /* ===== PAGINATION ===== */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <Container>
      <Title>Gestion des commandes</Title>

      <Controls>
        <Input
          placeholder="Recherche ID / client"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="PENDING">En attente</option>
          <option value="PARTIALLY_PAID">Partiel</option>
          <option value="PAID">Payé</option>
        </Select>
      </Controls>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>ID</Th>
              <Th>Client</Th>
              <Th>Produit</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const firstProduct = order.panier?.[0];

              const label =
                order.panier?.length === 1
                  ? firstProduct?.nom
                  : `${firstProduct?.nom} + ${order.panier.length - 1} autres`;

              return (
                <tr key={order._id}>
                  <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                  <Td>{order._id}</Td>
                  <Td>{order.client?.nom}</Td>
                  <Td style={{ display: "flex", alignItems: "center" }}>
                    {firstProduct?.image && (
                      <Thumbnail src={firstProduct.image} />
                    )}
                    {label}
                  </Td>
                  <Td>{order.total} FCFA</Td>
                  <Td>{order.statusCommande}</Td>
                  <Td>
                    <Button
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalOpen(true);
                      }}
                    >
                      Détails
                    </Button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Pagination */}
      <div style={{ marginTop: 20, textAlign: "right" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            bg={currentPage === i + 1 ? "#007bff" : "#6c757d"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            maxWidth: "900px",
            margin: "auto",
            borderRadius: "14px",
            padding: "25px",
          },
        }}
      >
        {selectedOrder && (
          <>
            <h2>Commande {selectedOrder._id}</h2>

            <h3>Produits</h3>
            {selectedOrder.panier.map((p) => (
              <ProductRow key={p.produitId}>
                {p.image && <ProductImage src={p.image} />}
                <div>
                  <p><strong>{p.nom}</strong></p>
                  <p>Prix : {p.prix} FCFA</p>
                  <p>Quantité : {p.quantite}</p>
                  <p>
                    Couleur : {p.couleur || "-"} | Taille : {p.taille || "-"}
                  </p>
                </div>
              </ProductRow>
            ))}

            <Button onClick={() => setModalOpen(false)}>Fermer</Button>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default AdminOrdersWithThumb;
