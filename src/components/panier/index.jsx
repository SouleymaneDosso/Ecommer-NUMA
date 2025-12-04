import { useContext } from "react";
import { PanierContext } from "../../Utils/Context";
import { Link } from "react-router-dom";

function PagePanier() {
  const { ajouter, supprimer, toutSupprimer } = useContext(PanierContext);

  // Calcul du prix total
  const total = ajouter.reduce(
    (acc, item) => acc + item.prix * item.quantite,
    0
  );

  return (
    <div style={{ padding: "40px" }}>
      <h2>Panier</h2>

      {/* Si panier vide */}
      {ajouter.length === 0 ? (
        <div>
          <p>Votre panier est vide.</p>
          <Link to="/">← Retour à l'accueil</Link>
        </div>
      ) : (
        <div>
          {/* Liste des articles */}
          {ajouter.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #ccc",
                padding: "15px 0",
                gap: "20px",
              }}
            >
              <img
                src={item.image}
                alt={item.nom}
                style={{ width: "100px", borderRadius: "8px" }}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.nom}</h3>
                <p>Prix : {item.prix} €</p>
                <p>Quantité : {item.quantite}</p>
              </div>

              <button
                onClick={() => supprimer(item.id)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  backgroundColor: "red",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                Supprimer
              </button>
            </div>
          ))}

          {/* Total */}
          <h3 style={{ marginTop: "20px" }}>Total : {total.toFixed(2)} €</h3>

          {/* Bouton vider panier */}
          <button
            onClick={toutSupprimer}
            style={{
              marginTop: "20px",
              padding: "12px 18px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            Vider le panier
          </button>
        </div>
      )}
    </div>
  );
}

export default PagePanier;
