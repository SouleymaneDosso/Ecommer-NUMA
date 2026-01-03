import React, { useEffect, useState } from "react";
import axios from "axios";

const statutColors = {
  PENDING: "#f0ad4e",
  PARTIALLY_PAID: "#5bc0de",
  PAID: "#5cb85c",
};

const AdminCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [openPanier, setOpenPanier] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCommandes(page);
  }, [page]);

  const fetchCommandes = async (pageNum = 1) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/commandes?page=${pageNum}&limit=10`);
      console.log("Réponse backend commandes :", res.data);
      setCommandes(res.data.commandes || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des commandes");
    }
  };

  const togglePanier = (id) => {
    setOpenPanier((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin – Suivi des commandes</h1>

      {commandes.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        commandes.map((cmd) => {
          const totalPaye =
            cmd.paiementsRecus?.filter((p) => p.status === "CONFIRMED")?.reduce((acc, p) => acc + p.montantEnvoye, 0) || 0;

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
              {/* Infos client */}
              <div style={{ marginBottom: "10px" }}>
                <strong>Date :</strong> {new Date(cmd.createdAt).toLocaleString()} <br />
                <strong>ID :</strong> {cmd._id} <br />
                <strong>Client :</strong> {cmd.client?.nom || "-"} {cmd.client?.prenom || "-"} <br />
                <strong>Total :</strong> {cmd.total || 0} FCFA <br />
                <strong>Payé :</strong> {totalPaye} FCFA <br />
                <strong>Statut :</strong>{" "}
                <span
                  style={{
                    backgroundColor: statutColors[cmd.statusCommande] || "#999",
                    color: "#fff",
                    padding: "3px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {cmd.statusCommande || "INCONNU"}
                </span>
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

              {/* Panier */}
              {openPanier[cmd._id] && cmd.panier?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                  {cmd.panier.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        padding: "10px",
                        width: "calc(33.33% - 10px)",
                        boxSizing: "border-box",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt={item.nom}
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
                        Couleur: {item.couleur || "-"} | Taille: {item.taille || "-"}
                      </div>
                    </div>
                  ))}
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
                      }}
                    >
                      Étape {p.step || "-"} – {p.montantEnvoye || 0} FCFA – <strong>{p.status || "-"}</strong>
                      <br />
                      Référence: {p.reference || "-"} | Numéro: {p.numeroClient || "-"} | Service: {p.service || "-"}
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
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Précédent
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {page} / {pages}
          </span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCommandes;