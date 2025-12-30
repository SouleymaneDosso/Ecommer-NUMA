import { useEffect, useState } from "react";
import styled from "styled-components";

const Page = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  width: 200px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) => (p.status === "PAID" ? "#dcfce7" : "#fee2e2")};
  color: ${(p) => (p.status === "PAID" ? "#166534" : "#991b1b")};
  margin-right: 5px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background-color: #4f46e5;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  margin-bottom: 4px;
`;

const Pagination = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 1rem;
`;

export default function AdminPaiements() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchClient, setSearchClient] = useState("");

  const fetchCommandes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/commandes`);
      const data = await res.json();
      setCommandes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const validerEtape = async (commandeId, step) => {
    try {
      const res = await fetch(`${API_URL}/api/commandes/${commandeId}/paiement`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Erreur lors de la validation");
        return;
      }
      fetchCommandes(); // refresh
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // 🔹 Filtrage et recherche
  const filteredCommandes = commandes.filter((c) => {
    const statusMatch = filterStatus === "all" || c.status === filterStatus;
    const searchMatch =
      `${c.client.nom} ${c.client.prenom}`.toLowerCase().includes(searchClient.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredCommandes.length / pageSize);
  const commandesPage = filteredCommandes.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <Page><p>Chargement...</p></Page>;

  return (
    <Page>
      <Title>Gestion des Paiements</Title>

      <Controls>
        <Input
          placeholder="Rechercher client..."
          value={searchClient}
          onChange={(e) => { setSearchClient(e.target.value); setPage(1); }}
        />
        <Select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="all">Tous</option>
          <option value="PENDING">PENDING</option>
          <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
          <option value="PAID">PAID</option>
        </Select>
      </Controls>

      <Table>
        <thead>
          <tr>
            <Th>Client</Th>
            <Th>Total</Th>
            <Th>Service</Th>
            <Th>Étapes de paiement</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {commandesPage.map((c) => (
            <tr key={c._id}>
              <Td>{c.client.nom} {c.client.prenom}</Td>
              <Td>{c.total.toLocaleString()} FCFA</Td>
              <Td>{c.servicePaiement === "wave" ? "Wave" : "Orange Money"}</Td>
              <Td>
                {c.paiements.map((p) => (
                  <Badge key={p.step} status={p.status}>
                    Étape {p.step}: {p.status}
                  </Badge>
                ))}
              </Td>
              <Td>
                {c.paiements.map((p) =>
                  p.status === "UNPAID" && (
                    <Button key={p.step} onClick={() => validerEtape(c._id, p.step)}>
                      Valider étape {p.step}
                    </Button>
                  )
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button key={i+1} onClick={() => setPage(i+1)}>{i+1}</Button>
        ))}
      </Pagination>
    </Page>
  );
}

