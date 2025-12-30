import { useState, useEffect } from "react";

export default function SuiviPaiement({ commandeId }) {
  const [commande, setCommande] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Récupérer la commande
  const fetchCommande = async () => {
    const res = await fetch(`${API_URL}/api/commandes/${commandeId}`);
    const data = await res.json();
    setCommande(data);
  };

  useEffect(() => { if (commandeId) fetchCommande(); }, [commandeId]);

  // Valider une étape
  const validerEtape = async (step) => {
    const res = await fetch(`${API_URL}/api/commandes/${commandeId}/paiement`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step }),
    });
    const data = await res.json();
    if (res.ok) setCommande(data.commande);
    else alert(data.message);
  };

  if (!commande) return <p>Chargement...</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Suivi des paiements</h3>
      <p>Statut global : {commande.status}</p>
      <ul>
        {commande.paiements.map(p => (
          <li key={p._id}>
            Étape {p.step} : {p.amount.toLocaleString()} FCFA - {p.status}
            {p.status === "UNPAID" && (
              <button onClick={() => validerEtape(p.step)}>Payer cette étape</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
