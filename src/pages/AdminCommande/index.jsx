// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const statutColors = {
//   PENDING: "#f0ad4e",
//   PARTIALLY_PAID: "#5bc0de",
//   PAID: "#5cb85c",
//   CONFIRMED: "#337ab7",
//   DELIVERED: "#222",
//   SHIPPED: "#3b82f6",
// };

// const AdminCommandes = () => {
//   const [commandes, setCommandes] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [openPanier, setOpenPanier] = useState({});

//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     fetchCommandes(page);
//   }, [page]);

//   const confirmerCommandeCOD = async (id) => {
//     try {
//       const res = await fetch(
//         `${API_URL}/api/admin/commandes/${id}/confirmer-cod`,
//         {
//           method: "PUT",
//         },
//       );

//       const data = await res.json();

//       if (res.ok) {
//         alert("Commande confirmée ✅");
//         fetchCommandes(page);
//       } else {
//         alert(data.message || "Erreur");
//       }
//     } catch (err) {
//       alert("Erreur serveur");
//     }
//   };

//   const marquerCommeLivre = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/api/admin/commandes/${id}/livrer`, {
//         method: "PUT",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Commande livrée ✅");
//         fetchCommandes(page);
//       } else {
//         alert(data.message || "Erreur");
//       }
//     } catch (err) {
//       alert("Erreur serveur");
//       console.error(err);
//     }
//   };

//   const fetchCommandes = async (pageNum = 1) => {
//     try {
//       const res = await axios.get(
//         `${API_URL}/api/admin/commandes?page=${pageNum}&limit=10`,
//       );
//       console.log("Réponse backend commandes :", res.data);
//       setCommandes(res.data.commandes || []);
//       setPages(res.data.pages || 1);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors du chargement des commandes");
//     }
//   };

//   const marquerCommeExpedie = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/api/admin/commandes/${id}/ship`, {
//         method: "PUT",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Commande en livraison 🚚");
//         fetchCommandes(page);
//       } else {
//         alert(data.message || "Erreur");
//       }
//     } catch (err) {
//       alert("Erreur serveur");
//       console.error(err);
//     }
//   };

//   const togglePanier = (id) => {
//     setOpenPanier((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1>Admin – Suivi des commandes</h1>

//       {commandes.length === 0 ? (
//         <p>Aucune commande pour le moment.</p>
//       ) : (
//         commandes.map((cmd) => {
//           const totalPaye =
//             cmd.paiementsRecus
//               ?.filter((p) => p.status === "CONFIRMED")
//               ?.reduce((acc, p) => acc + p.montantEnvoye, 0) || 0;

//           return (
//             <div
//               key={cmd._id}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//                 padding: "15px",
//                 marginBottom: "20px",
//                 background: "#fafafa",
//               }}
//             >
//               {/* Infos client */}
//               <div style={{ marginBottom: "10px" }}>
//                 <strong>Date :</strong>{" "}
//                 {new Date(cmd.createdAt).toLocaleString()} <br />
//                 <strong>ID :</strong> {cmd._id} <br />
//                 <strong>Client :</strong> {cmd.client?.nom || "-"}{" "}
//                 {cmd.client?.prenom || "-"} <br />
//                 <strong>Adresse :</strong> {cmd.client?.adresse || "-"} <br />
//                 <strong>Ville :</strong> {cmd.client?.ville || "-"} <br />
//                 <strong>Pays :</strong> {cmd.client?.pays || "-"} <br />
//                 <strong>Numéro :</strong> {cmd.client?.numero || "-"} <br />
//                 <strong>Total :</strong> {cmd.total || 0} FCFA <br />
//                 <strong>Payé :</strong> {totalPaye} FCFA <br />
//                 <strong>Statut :</strong>{" "}
//                 <span
//                   style={{
//                     backgroundColor: statutColors[cmd.statusCommande] || "#999",
//                     color: "#fff",
//                     padding: "3px 8px",
//                     borderRadius: "4px",
//                   }}
//                 >
//                   {cmd.statusCommande || "INCONNU"}
//                 </span>
//                 {cmd.modePaiement === "cod" &&
//                   cmd.statusCommande === "PENDING" && (
//                     <button
//                       onClick={() => confirmerCommandeCOD(cmd._id)}
//                       style={{
//                         marginTop: "10px",
//                         padding: "6px 12px",
//                         background: "green",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Confirmer commande COD
//                     </button>
//                   )}
//                 {cmd.statusCommande === "CONFIRMED" && (
//                   <button
//                     onClick={() => marquerCommeExpedie(cmd._id)}
//                     style={{
//                       marginTop: "10px",
//                       padding: "6px 12px",
//                       background: "#3b82f6",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     🚚 Mettre en livraison
//                   </button>
//                 )}
//                 {cmd.statusCommande === "SHIPPED" && (
//                   <button
//                     onClick={() => marquerCommeLivre(cmd._id)}
//                     style={{
//                       marginTop: "10px",
//                       padding: "6px 12px",
//                       background: "#222",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     ✔ Marquer comme livré
//                   </button>
//                 )}
//               </div>

//               {/* Bouton afficher panier */}
//               <button
//                 onClick={() => togglePanier(cmd._id)}
//                 style={{
//                   marginBottom: "10px",
//                   padding: "6px 12px",
//                   background: "#0275d8",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 {openPanier[cmd._id]
//                   ? "Masquer le panier"
//                   : `Voir le panier (${cmd.panier?.length || 0})`}
//               </button>

//               {/* Panier */}
//               {openPanier[cmd._id] && cmd.panier?.length > 0 && (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: "10px",
//                     marginTop: "10px",
//                   }}
//                 >
//                   {cmd.panier.map((item, idx) => (
//                     <div
//                       key={idx}
//                       style={{
//                         border: "1px solid #ddd",
//                         borderRadius: "6px",
//                         padding: "10px",
//                         width: "calc(33.33% - 10px)",
//                         boxSizing: "border-box",
//                         background: "#fff",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                       }}
//                     >
//                       <img
//                         src={item.image || "https://via.placeholder.com/100"}
//                         alt={item.nom}
//                         style={{
//                           width: "100px",
//                           height: "100px",
//                           objectFit: "cover",
//                           borderRadius: "4px",
//                           marginBottom: "8px",
//                         }}
//                       />
//                       <div style={{ textAlign: "center" }}>
//                         <strong>{item.nom}</strong>
//                         <br />
//                         {item.prix || 0} FCFA × {item.quantite || 1}
//                         <br />
//                         Couleur: {item.couleur || "-"} | Taille:{" "}
//                         {item.taille || "-"}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Paiements reçus */}
//               <div style={{ marginTop: "15px" }}>
//                 <h4>Paiements reçus</h4>
//                 {cmd.paiementsRecus?.length > 0 ? (
//                   cmd.paiementsRecus.map((p) => (
//                     <div
//                       key={p._id}
//                       style={{
//                         padding: "8px",
//                         border: "1px solid #ddd",
//                         borderRadius: "4px",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       Étape {p.step || "-"} – {p.montantEnvoye || 0} FCFA –{" "}
//                       <strong>{p.status || "-"}</strong>
//                       <br />
//                       Référence: {p.reference || "-"} | Numéro:{" "}
//                       {p.numeroClient || "-"} | Service: {p.service || "-"}
//                     </div>
//                   ))
//                 ) : (
//                   <p>Aucun paiement reçu pour cette commande.</p>
//                 )}
//               </div>
//             </div>
//           );
//         })
//       )}

//       {/* Pagination */}
//       {pages > 1 && (
//         <div style={{ textAlign: "center", marginTop: "20px" }}>
//           <button disabled={page === 1} onClick={() => setPage(page - 1)}>
//             Précédent
//           </button>
//           <span style={{ margin: "0 10px" }}>
//             Page {page} / {pages}
//           </span>
//           <button disabled={page === pages} onClick={() => setPage(page + 1)}>
//             Suivant
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCommandes;


import React, { useEffect, useState } from "react";
import axios from "axios";

const statutColors = {
  PENDING: "#f0ad4e",
  PARTIALLY_PAID: "#5bc0de",
  PAID: "#5cb85c",
  CONFIRMED: "#337ab7",
  SHIPPED: "#3b82f6",
  DELIVERED: "#222",
  CANCELLED: "#dc3545",
};

const AdminCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [openPanier, setOpenPanier] = useState({});
  const [chargement, setChargement] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Token administrateur
  const getAdminHeaders = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Session administrateur expirée. Veuillez vous reconnecter.");
      throw new Error("Token administrateur manquant");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCommandes(page);
  }, [page]);

  // Charger les commandes
  const fetchCommandes = async (pageNum = 1) => {
    try {
      setChargement(true);

      const res = await axios.get(
        `${API_URL}/api/admin/commandes?page=${pageNum}&limit=10`,
        {
          headers: getAdminHeaders(),
        }
      );

      setCommandes(res.data.commandes || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Accès refusé. Veuillez vous reconnecter en tant qu'administrateur.");
      } else if (err.message !== "Token administrateur manquant") {
        alert(
          err.response?.data?.message ||
          "Erreur lors du chargement des commandes"
        );
      }
    } finally {
      setChargement(false);
    }
  };

  // Mettre une commande en livraison
  const marquerCommeExpedie = async (id) => {
    if (!window.confirm("Mettre cette commande en livraison ?")) return;

    try {
      await axios.put(
        `${API_URL}/api/admin/commandes/${id}/ship`,
        {},
        { headers: getAdminHeaders() }
      );

      alert("Commande mise en livraison 🚚");
      fetchCommandes(page);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'expédition");
    }
  };

  // Marquer une commande comme livrée
  const marquerCommeLivre = async (id) => {
    if (!window.confirm("Confirmer la livraison de cette commande ?")) return;

    try {
      await axios.put(
        `${API_URL}/api/admin/commandes/${id}/livrer`,
        {},
        { headers: getAdminHeaders() }
      );

      alert("Commande livrée avec succès ✅");
      fetchCommandes(page);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la livraison");
    }
  };

  // Annuler une commande et restituer le stock réservé
  const annulerCommande = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment annuler cette commande ? Le stock réservé sera restitué."
    );

    if (!confirmation) return;

    try {
      await axios.put(
        `${API_URL}/api/admin/commandes/${id}/annuler`,
        {},
        { headers: getAdminHeaders() }
      );

      alert("Commande annulée et stock restitué si nécessaire ✅");
      fetchCommandes(page);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const togglePanier = (id) => {
    setOpenPanier((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Admin – Suivi des commandes</h1>

      {chargement && <p>Chargement des commandes...</p>}

      {!chargement && commandes.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        commandes.map((cmd) => {
          const totalPaye =
            cmd.paiementsRecus
              ?.filter((p) => p.status === "CONFIRMED")
              ?.reduce(
                (acc, p) => acc + Number(p.montantEnvoye || 0),
                0
              ) || 0;

          const statut = cmd.statusCommande || "INCONNU";

          const commandeAnnulable = ![
            "DELIVERED",
            "SHIPPED",
            "CANCELLED",
          ].includes(statut);

          return (
            <div
              key={cmd._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                background: "#fafafa",
              }}
            >
              {/* Informations client */}
              <div style={{ marginBottom: "10px" }}>
                <strong>Date :</strong>{" "}
                {new Date(cmd.createdAt).toLocaleString()} <br />

                <strong>ID :</strong> {cmd._id} <br />

                <strong>Client :</strong>{" "}
                {cmd.client?.nom || "-"}{" "}
                {cmd.client?.prenom || "-"} <br />

                <strong>Adresse :</strong>{" "}
                {cmd.client?.adresse || "-"} <br />

                <strong>Ville :</strong>{" "}
                {cmd.client?.ville || "-"} <br />

                <strong>Pays :</strong>{" "}
                {cmd.client?.pays || "-"} <br />

                <strong>Numéro :</strong>{" "}
                {cmd.client?.numero || "-"} <br />

                <strong>Mode de paiement :</strong>{" "}
                {cmd.modePaiement || "-"} <br />

                <strong>Total :</strong>{" "}
                {cmd.total || 0} FCFA <br />

                <strong>Total payé :</strong>{" "}
                {totalPaye} FCFA <br />

                <strong>Stock réservé :</strong>{" "}
                {cmd.stockReserve ? "Oui" : "Non"} <br />

                <strong>Stock restitué :</strong>{" "}
                {cmd.stockRestitue ? "Oui" : "Non"} <br />

                <strong>Statut :</strong>{" "}
                <span
                  style={{
                    backgroundColor: statutColors[statut] || "#999",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "13px",
                  }}
                >
                  {statut}
                </span>

                {/* Mettre en livraison */}
                {statut === "CONFIRMED" && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => marquerCommeExpedie(cmd._id)}
                      style={{
                        padding: "8px 12px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      🚚 Mettre en livraison
                    </button>
                  </div>
                )}

                {/* Marquer comme livré */}
                {statut === "SHIPPED" && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => marquerCommeLivre(cmd._id)}
                      style={{
                        padding: "8px 12px",
                        background: "#222",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ✔ Marquer comme livré
                    </button>
                  </div>
                )}

                {/* Annuler la commande */}
                {commandeAnnulable && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => annulerCommande(cmd._id)}
                      style={{
                        padding: "8px 12px",
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      ✖ Annuler la commande
                    </button>
                  </div>
                )}
              </div>

              {/* Bouton afficher panier */}
              <button
                onClick={() => togglePanier(cmd._id)}
                style={{
                  marginBottom: "10px",
                  padding: "6px 12px",
                  background: "#0275d8",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {openPanier[cmd._id]
                  ? "Masquer le panier"
                  : `Voir le panier (${cmd.panier?.length || 0})`}
              </button>

              {/* Contenu du panier */}
              {openPanier[cmd._id] && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  {cmd.panier?.length > 0 ? (
                    cmd.panier.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          padding: "10px",
                          width: "calc(33.33% - 10px)",
                          minWidth: "150px",
                          boxSizing: "border-box",
                          background: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={
                            item.image ||
                            "https://via.placeholder.com/100"
                          }
                          alt={item.nom || "Produit"}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginBottom: "8px",
                          }}
                        />

                        <div style={{ textAlign: "center" }}>
                          <strong>{item.nom}</strong>
                          <br />
                          {item.prix || 0} FCFA × {item.quantite || 1}
                          <br />
                          Couleur : {item.couleur || "-"}
                          <br />
                          Taille : {item.taille || "-"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Panier vide.</p>
                  )}
                </div>
              )}

              {/* Paiements reçus */}
              <div style={{ marginTop: "15px" }}>
                <h4>Paiements reçus</h4>

                {cmd.paiementsRecus?.length > 0 ? (
                  cmd.paiementsRecus.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        background: "#fff",
                      }}
                    >
                      Étape {p.step || "-"} –{" "}
                      {p.montantEnvoye || 0} FCFA –{" "}
                      <strong>{p.status || "-"}</strong>
                      <br />

                      Référence : {p.reference || "-"}
                      <br />

                      Numéro : {p.numeroClient || "-"}
                      <br />

                      Service : {p.service || "-"}
                    </div>
                  ))
                ) : (
                  <p>Aucun paiement reçu pour cette commande.</p>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Précédent
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {page} / {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCommandes;
