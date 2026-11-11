// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// /* ================= STYLE ================= */
// const Page = styled.main`
//   max-width: 1200px;
//   margin: 2rem auto;
//   padding: 0 1rem;
//   font-family: "Inter", sans-serif;

//   @media (max-width: 768px) {
//     margin: 1rem;
//     padding: 0.5rem;
//   }
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 1rem;
//   font-size: 0.9rem;

//   th, td {
//     border: 1px solid #ddd;
//     padding: 0.8rem;
//     text-align: left;
//   }

//   th {
//     background-color: #f4f4f4;
//   }

//   @media (max-width: 768px) {
//     font-size: 0.8rem;
//   }
// `;

// const Button = styled.button`
//   padding: 6px 12px;
//   border-radius: 6px;
//   border: none;
//   cursor: pointer;
//   font-weight: 600;
//   margin-right: 4px;
//   margin-top: 4px;

//   &.confirm {
//     background-color: #4f46e5;
//     color: #fff;
//   }

//   &.reject {
//     background-color: #dc2626;
//     color: #fff;
//   }
// `;

// const Badge = styled.span`
//   padding: 4px 10px;
//   border-radius: 12px;
//   font-size: 0.8rem;
//   font-weight: 600;
//   background: ${(p) =>
//     p.status === "PENDING"
//       ? "#fef3c7"
//       : p.status === "CONFIRMED"
//       ? "#dcfce7"
//       : "#fee2e2"};
//   color: ${(p) =>
//     p.status === "PENDING"
//       ? "#92400e"
//       : p.status === "CONFIRMED"
//       ? "#166534"
//       : "#991b1b"};
// `;

// /* ================= COMPONENT ================= */
// export default function AdminPaiements() {
//   const [commandes, setCommandes] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const API_URL = import.meta.env.VITE_API_URL;

//   const fetchCommandes = async (pageNumber = 1) => {
//     try {
//       const res = await fetch(
//         `${API_URL}/api/admin/commandes?page=${pageNumber}&limit=10`
//       );
//       const data = await res.json();
//       setCommandes(data.commandes);
//       setPage(data.page);
//       setTotalPages(data.pages);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCommandes(page);
//   }, [page]);

//   const confirmerPaiement = async (commandeId, paiementRecuId) => {
//     try {
//       const res = await fetch(
//         `${API_URL}/api/admin/commandes/${commandeId}/valider-paiement`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paiementRecuId }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         alert("Paiement confirmé ✅");
//         fetchCommandes(page);
//       } else {
//         alert(data.message || "Erreur lors de la confirmation");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Erreur serveur");
//     }
//   };

//   const rejeterPaiement = async (commandeId, paiementRecuId) => {
//     try {
//       const res = await fetch(
//         `${API_URL}/api/admin/commandes/${commandeId}/rejeter-paiement`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paiementRecuId }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         alert("Paiement rejeté ❌");
//         fetchCommandes(page);
//       } else {
//         alert(data.message || "Erreur lors du rejet");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Erreur serveur");
//     }
//   };

//   return (
//     <Page>
//       <h1>Admin - Suivi des commandes</h1>
//       <Table>
//         <thead>
//           <tr>
//             <th>Commande ID</th>
//             <th>Client</th>
//             <th>Total</th>
//             <th>Status</th>
//             <th>Paiements reçus</th>
//           </tr>
//         </thead>
//         <tbody>
//           {commandes.map((commande) => (
//             <tr key={commande._id}>
//               <td>{commande._id}</td>
//               <td>
//                 {commande.client.prenom} {commande.client.nom}
//               </td>
//               <td>{commande.total.toLocaleString()} FCFA</td>
//               <td>{commande.statusCommande}</td>
//               <td>
//                 {commande.paiementsRecus.length === 0 && <span>Aucun</span>}
//                 {commande.paiementsRecus.map((p) => (
//                   <div
//                     key={p._id}
//                     style={{
//                       marginBottom: "0.5rem",
//                       display: "flex",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <strong>Étape {p.step}</strong> - {p.montantEnvoye.toLocaleString()} FCFA - <Badge status={p.status}>{p.status}</Badge>
//                     <br />
//                     Référence: {p.reference} | Numéro: {p.numeroClient} | Service: {p.service}
//                     <br />
//                     {p.status === "PENDING" && (
//                       <div style={{ marginTop: "4px" }}>
//                         <Button
//                           className="confirm"
//                           onClick={() => confirmerPaiement(commande._id, p._id)}
//                         >
//                           Confirmer
//                         </Button>
//                         <Button
//                           className="reject"
//                           onClick={() => rejeterPaiement(commande._id, p._id)}
//                         >
//                           Rejeter
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <div style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}>
//         <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
//           Précédent
//         </Button>
//         <span style={{ margin: "0 1rem" }}>
//           Page {page} / {totalPages}
//         </span>
//         <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
//           Suivant
//         </Button>
//       </div>
//     </Page>
//   );
// }


import { useEffect, useState } from "react";
import styled from "styled-components";

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

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.9rem;

  th,
  td {
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f4f4f4;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;

    th,
    td {
      padding: 0.5rem;
    }
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

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
  display: inline-block;
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

const StatusCommande = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.8rem;
  color: white;

  background: ${(p) =>
    p.status === "CANCELLED"
      ? "#dc2626"
      : p.status === "DELIVERED"
      ? "#222"
      : p.status === "SHIPPED"
      ? "#3b82f6"
      : p.status === "CONFIRMED"
      ? "#337ab7"
      : "#999"};
`;

/* ================= COMPONENT ================= */

export default function AdminPaiements() {
  const [commandes, setCommandes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [operationEnCours, setOperationEnCours] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Récupérer le token administrateur
  const getAdminHeaders = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Session administrateur expirée. Veuillez vous reconnecter.");
      throw new Error("Token administrateur manquant");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Charger les commandes
  const fetchCommandes = async (pageNumber = 1) => {
    try {
      setChargement(true);

      const res = await fetch(
        `${API_URL}/api/admin/commandes?page=${pageNumber}&limit=10`,
        {
          method: "GET",
          headers: getAdminHeaders(),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur de chargement");
      }

      setCommandes(data.commandes || []);
      setPage(data.page || pageNumber);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);

      if (err.message !== "Token administrateur manquant") {
        alert(err.message || "Erreur lors du chargement des commandes");
      }
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchCommandes(page);
  }, [page]);

  // Confirmer un paiement
  const confirmerPaiement = async (commandeId, paiementRecuId) => {
    if (!window.confirm("Confirmer la réception de ce paiement ?")) {
      return;
    }

    try {
      setOperationEnCours(paiementRecuId);

      const res = await fetch(
        `${API_URL}/api/admin/commandes/${commandeId}/valider-paiement`,
        {
          method: "PUT",
          headers: getAdminHeaders(),
          body: JSON.stringify({ paiementRecuId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la confirmation");
      }

      alert("Paiement confirmé avec succès ✅");
      await fetchCommandes(page);
    } catch (err) {
      console.error("Erreur confirmation paiement :", err);
      alert(err.message || "Erreur serveur");
    } finally {
      setOperationEnCours(null);
    }
  };

  // Rejeter un paiement
  const rejeterPaiement = async (commandeId, paiementRecuId) => {
    if (!window.confirm("Voulez-vous vraiment rejeter ce paiement ?")) {
      return;
    }

    try {
      setOperationEnCours(paiementRecuId);

      const res = await fetch(
        `${API_URL}/api/admin/commandes/${commandeId}/rejeter-paiement`,
        {
          method: "PUT",
          headers: getAdminHeaders(),
          body: JSON.stringify({ paiementRecuId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du rejet");
      }

      alert("Paiement rejeté ❌");
      await fetchCommandes(page);
    } catch (err) {
      console.error("Erreur rejet paiement :", err);
      alert(err.message || "Erreur serveur");
    } finally {
      setOperationEnCours(null);
    }
  };

  return (
    <Page>
      <h1>Admin - Suivi des paiements</h1>

      {chargement && <p>Chargement des commandes...</p>}

      {!chargement && commandes.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Commande ID</th>
                <th>Client</th>
                <th>Total</th>
                <th>Statut commande</th>
                <th>Paiements reçus</th>
              </tr>
            </thead>

            <tbody>
              {commandes.map((commande) => {
                const commandeAnnulee =
                  commande.statusCommande === "CANCELLED";

                return (
                  <tr key={commande._id}>
                    <td>{commande._id}</td>

                    <td>
                      {commande.client?.prenom || "-"}{" "}
                      {commande.client?.nom || "-"}
                      <br />
                      {commande.client?.numero || "-"}
                    </td>

                    <td>
                      {Number(commande.total || 0).toLocaleString("fr-FR")} FCFA
                    </td>

                    <td>
                      <StatusCommande status={commande.statusCommande}>
                        {commande.statusCommande || "INCONNU"}
                      </StatusCommande>

                      {commandeAnnulee && (
                        <p style={{ color: "#dc2626", marginTop: "5px" }}>
                          Commande annulée
                        </p>
                      )}
                    </td>

                    <td>
                      {!commande.paiementsRecus ||
                      commande.paiementsRecus.length === 0 ? (
                        <span>Aucun paiement reçu</span>
                      ) : (
                        commande.paiementsRecus.map((p) => (
                          <div
                            key={p._id}
                            style={{
                              marginBottom: "12px",
                              padding: "10px",
                              border: "1px solid #ddd",
                              borderRadius: "6px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <strong>Étape {p.step || "-"}</strong>

                            <span>
                              {Number(
                                p.montantEnvoye || 0
                              ).toLocaleString("fr-FR")}{" "}
                              FCFA
                            </span>

                            <Badge status={p.status}>
                              {p.status || "INCONNU"}
                            </Badge>

                            <span>
                              Référence : {p.reference || "-"}
                            </span>

                            <span>
                              Numéro : {p.numeroClient || "-"}
                            </span>

                            <span>
                              Service : {p.service || "-"}
                            </span>

                            {/* Actions de paiement */}
                            {p.status === "PENDING" && !commandeAnnulee && (
                              <div style={{ marginTop: "5px" }}>
                                <Button
                                  className="confirm"
                                  disabled={operationEnCours !== null}
                                  onClick={() =>
                                    confirmerPaiement(
                                      commande._id,
                                      p._id
                                    )
                                  }
                                >
                                  {operationEnCours === p._id
                                    ? "Traitement..."
                                    : "✓ Confirmer"}
                                </Button>

                                <Button
                                  className="reject"
                                  disabled={operationEnCours !== null}
                                  onClick={() =>
                                    rejeterPaiement(
                                      commande._id,
                                      p._id
                                    )
                                  }
                                >
                                  ✕ Rejeter
                                </Button>
                              </div>
                            )}

                            {commandeAnnulee && p.status === "PENDING" && (
                              <span style={{ color: "#dc2626" }}>
                                Action impossible : commande annulée
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <Button
            disabled={page <= 1 || chargement}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Précédent
          </Button>

          <span>
            Page {page} / {totalPages}
          </span>

          <Button
            disabled={page >= totalPages || chargement}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </Page>
  );
}
