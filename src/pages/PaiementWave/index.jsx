import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import * as Context from "../../Utils/Context";
import { ThemeContext } from "../../Utils/Context";
import { useNavigate } from "react-router-dom";

/* ==========================
   STYLES
========================== */

const Page = styled.main`
  max-width: 1100px;
  margin: 3rem auto;
  padding: 0 1.5rem;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#f7f7f7")};
  color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#ffffff")};
  border-radius: 18px;
  padding: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#dcdcdc")};
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fff")};
  color: inherit;
  font-size: 16px;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#dcdcdc")};
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fff")};
  color: inherit;
  font-size: 16px;
  margin-bottom: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin: 1rem 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, black, #6366f1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.6;
  }
`;

const Summary = styled.aside`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  border-radius: 18px;
  padding: 2rem;
`;

/* ==========================
   VILLES
========================== */

const villesCI = [
  "Abidjan",
  "Bouaké",
  "Daloa",
  "Yamoussoukro",
  "San-Pédro",
  "Korhogo",
  "Man",
  "Gagnoa",
  "Abengourou",
  "Bondoukou",
  "Soubré",
  "Divo",
  "Anyama",
  "Bingerville",
  "Grand-Bassam",
  "Issia",
  "Tiassalé",
  "Oumé",
  "Toumodi",
  "Dimbokro",
  "Sinfra",
  "Adzopé",
  "Ferkessédougou",
  "Séguéla",
  "Guiglo",
  "Danané",
];

/* ==========================
   COMPONENT
========================== */

export default function PageCheckout() {
  const { ajouter, fraisLivraison, total } = useContext(Context.PanierContext);
  const { theme } = useContext(ThemeContext);

  const $isdark = theme === "light";
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");

  const codePostal = "00225";
  const pays = "Côte d'Ivoire";

  // paiement
  const [modePaiement, setModePaiement] = useState("full"); // full / installments
  const [servicePaiement, setServicePaiement] = useState("orange");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/login");
      return;
    }
    setToken(savedToken);
  }, []);

  const handlePaiement = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !adresse || !ville) {
      alert("Remplissez tous les champs.");
      return;
    }

    setLoading(true);

    const panierBackend = ajouter.map((item) => ({
      produitId: item.id.split("_")[0],
      quantite: item.quantite,
      couleur: item.couleur || "",
      taille: item.taille || "",
    }));

    const commande = {
      client: { nom, prenom, adresse, ville, codePostal, pays },
      panier: panierBackend,
      modePaiement,
      servicePaiement: modePaiement === "cod" ? "livraison" : servicePaiement,
      fraisLivraison,
      total,
    };

    try {
      const res = await fetch(`${API_URL}/api/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commande),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur");
        return;
      }

      if (modePaiement === "cod") {
        navigate(`/commande-confirmee/${data.commande._id}`);
      } else {
        navigate(`/paiement-semi/${data.commande._id}`);
      }
    } catch (err) {
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (ajouter.length === 0) {
    return (
      <Page $isdark={$isdark}>
        <h2>Votre panier est vide</h2>
      </Page>
    );
  }

  const montantParMois =
    modePaiement === "installments" ? Math.ceil(total / 3) : total;
  const peutTroisFois = total >= 3000; 

  return (
    <Page $isdark={$isdark}>
      <Title>Checkout</Title>

      <Grid>
        <Section $isdark={$isdark}>
          <h2>Adresse de livraison</h2>

          <form onSubmit={handlePaiement}>
            <Input
              $isdark={$isdark}
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <Input
              $isdark={$isdark}
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <Input
              $isdark={$isdark}
              placeholder="Adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />

            <Select
              $isdark={$isdark}
              value={ville}
              onChange={(e) => setVille(e.target.value)}
            >
              <option value="">Choisir votre ville</option>
              {villesCI.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Input $isdark={$isdark} value={codePostal} disabled />
            <Input $isdark={$isdark} value={pays} disabled />

            {/* MODE DE PAIEMENT */}
            <h3>Mode de paiement</h3>
            <br />

            <RadioLabel>
              <input
                type="radio"
                name="mode"
                value="cod"
                checked={modePaiement === "cod"}
                onChange={(e) => setModePaiement(e.target.value)}
              />
              Paiement à la livraison
            </RadioLabel>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="mode"
                  value="full"
                  checked={modePaiement === "full"}
                  onChange={(e) => setModePaiement(e.target.value)}
                />
                Paiement en 1 fois
              </RadioLabel>

              <RadioLabel>
                <input
                  type="radio"
                  name="mode"
                  value="installments"
                  checked={modePaiement === "installments"}
                  onChange={(e) => setModePaiement(e.target.value)}
                  disabled={!peutTroisFois}
                />
                Paiement en 3 tranches
                {!peutTroisFois && (
                  <small style={{ color: "red", marginLeft: "6px" }}>
                    (minimum 3000 FCFA)
                  </small>
                )}
              </RadioLabel>
            </RadioGroup>

            {/* SERVICE */}
            <h3>Service de paiement</h3>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="service"
                  value="orange"
                  checked={servicePaiement === "orange"}
                  onChange={(e) => setServicePaiement(e.target.value)}
                />
                Orange Money
              </RadioLabel>

              <RadioLabel>
                <input
                  type="radio"
                  name="service"
                  value="wave"
                  checked={servicePaiement === "wave"}
                  onChange={(e) => setServicePaiement(e.target.value)}
                />
                Wave
              </RadioLabel>
            </RadioGroup>

            {modePaiement === "installments" && (
              <p>
                Paiement en 3 fois :{" "}
                <strong>{montantParMois.toLocaleString()} FCFA</strong> par mois
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Valider la commande"}
            </Button>
          </form>
        </Section>

        <Summary $isdark={$isdark}>
          <h2>Récapitulatif</h2>

          {ajouter.map((item) => (
            <div key={item.id}>
              {item.nom} x {item.quantite} —{" "}
              {(item.prix * item.quantite).toLocaleString()} FCFA
            </div>
          ))}

          <div>
            Livraison :{" "}
            {fraisLivraison === 0
              ? "Gratuite"
              : `${fraisLivraison.toLocaleString()} FCFA`}
          </div>

          <div>
            <strong>Total : {total.toLocaleString()} FCFA</strong>
          </div>
        </Summary>
      </Grid>
    </Page>
  );
}
