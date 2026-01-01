import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

/* ================= STYLE ================= */
const Page = styled.main`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 0.5rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.9rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-right: 4px;
  margin-top: 4px;

  &.confirm {
    background-color: #4f46e5;
    color: #fff;
  }

  &.reject {
    background-color: #dc2626;
    color: #fff;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(p) =>
    p.status === "PENDING"
      ? "#fef3c7"
      : p.status === "CONFIRMED"
      ? "#dcfce7"
      : "#fee2e2"};
  color: ${(p) =>
    p.status === "PENDING"
      ? "#92400e"
      : p.status === "CONFIRMED"
      ? "#166534"
      : "#991b1b"};
`;

/* ================= COMPONENT ================= */
export default function AdminPaiements() {
  const [commandes, setCommandes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCommandes = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/commandes?page=${pageNumber}&limit=10`
      );
      const data = await res.json();
      setCommandes(data.commandes);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCommandes(page);
  }, [page]);

  const confirmerPaiement = async (commandeId, paiementRecuId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/commandes/${commandeId}/valider-paiement`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paiementRecuId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Paiement confirmé ✅");
        fetchCommandes(page);
      } else {
        alert(data.message || "Erreur lors de la confirmation");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const rejeterPaiement = async (commandeId, paiementRecuId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/commandes/${commandeId}/rejeter-paiement`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paiementRecuId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Paiement rejeté ❌");
        fetchCommandes(page);
      } else {
        alert(data.message || "Erreur lors du rejet");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <Page>
      <h1>Admin - Suivi des commandes</h1>
      <Table>
        <thead>
          <tr>
            <th>Commande ID</th>
            <th>Client</th>
            <th>Total</th>
            <th>Status</th>
            <th>Paiements reçus</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map((commande) => (
            <tr key={commande._id}>
              <td>{commande._id}</td>
              <td>
                {commande.client.prenom} {commande.client.nom}
              </td>
              <td>{commande.total.toLocaleString()} FCFA</td>
              <td>{commande.statusCommande}</td>
              <td>
                {commande.paiementsRecus.length === 0 && <span>Aucun</span>}
                {commande.paiementsRecus.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      marginBottom: "0.5rem",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <strong>Étape {p.step}</strong> - {p.montantEnvoye.toLocaleString()} FCFA - <Badge status={p.status}>{p.status}</Badge>
                    <br />
                    Référence: {p.reference} | Numéro: {p.numeroClient} | Service: {p.service}
                    <br />
                    {p.status === "PENDING" && (
                      <div style={{ marginTop: "4px" }}>
                        <Button
                          className="confirm"
                          onClick={() => confirmerPaiement(commande._id, p._id)}
                        >
                          Confirmer
                        </Button>
                        <Button
                          className="reject"
                          onClick={() => rejeterPaiement(commande._id, p._id)}
                        >
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}>
        <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Précédent
        </Button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} / {totalPages}
        </span>
        <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Suivant
        </Button>
      </div>
    </Page>
  );
}
