import { useEffect, useState } from "react";

const AdminStatistiques = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const chargerResume = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/statistiques/resume`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const texte = await response.text();

          console.error("❌ ERREUR API STATISTIQUES :", {
            status: response.status,
            statusText: response.statusText,
            response: texte,
          });

          throw new Error(`Erreur API ${response.status} : ${texte}`);
        }

        const data = await response.json();

        setResume(data);
      } catch (error) {
        console.error("Erreur statistiques admin :", error);

        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    chargerResume();
  }, []);

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Statistiques</h1>

      <p>Visiteurs uniques : {resume.visiteursUniques}</p>

      <p>Visites : {resume.visites}</p>

      <p>Sessions : {resume.sessions}</p>

      <p>Utilisateurs identifiés : {resume.utilisateursIdentifies}</p>

      <p>Commandes : {resume.commandes}</p>

      <p>Clients ayant commandé : {resume.clientsAyantCommande}</p>

      <p>Commandes livrées : {resume.commandesLivrees}</p>

      <p>Chiffre d'affaires : {resume.chiffreAffaires} FCFA</p>
    </div>
  );
};

export default AdminStatistiques;
