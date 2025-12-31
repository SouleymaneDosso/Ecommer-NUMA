import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import * as Context from "../../Utils/Context";
import { useNavigate } from "react-router-dom";

/* ===== STYLES ===== */
const Page = styled.main`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Section = styled.section`
  background: #f8f9ff;
  padding: 2rem;
  border-radius: 16px;
`;

const FieldGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  line-height: 1.4;
  box-sizing: border-box;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0.5rem 0 1.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Summary = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.05);

  @media (min-width: 769px) {
    position: sticky;
    top: 2rem;
  }
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Total = styled(Line)`
  font-weight: 700;
  font-size: 1.1rem;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`;

/* ===== COMPONENT ===== */
export default function PageCheckout() {
  const { ajouter } = useContext(Context.PanierContext);
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [pays, setPays] = useState("");
  const [modePaiement, setModePaiement] = useState("full"); // full ou installments
  const [servicePaiement, setServicePaiement] = useState("orange"); // orange ou wave
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

  const total = ajouter.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  const handlePaiement = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Vous devez être connecté pour passer la commande.");
      navigate("/login");
      return;
    }

    if (!nom || !prenom || !adresse || !ville || !codePostal || !pays) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    const commande = {
      client: { nom, prenom, adresse, ville, codePostal, pays },
      panier: ajouter.map((item) => ({
        produitId: item.id,
        nom: item.nom,
        prix: item.prix,
        quantite: item.quantite,
        couleur: item.couleur || "",
        taille: item.taille || "",
      })),
      total,
      modePaiement,
      servicePaiement,
    };

    try {
      const res = await fetch(`${API_URL}/api/commandes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ token utilisé
        },
        body: JSON.stringify(commande),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la commande");
        return;
      }

      navigate(`/paiement-semi/${data.commande._id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (ajouter.length === 0) {
    return (
      <Page>
        <h2>Votre panier est vide</h2>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Checkout</Title>

      <Grid>
        <Section>
          <h2>Adresse de livraison</h2>

          <form onSubmit={handlePaiement}>
            <FieldGroup>
              <Input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Input placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Input placeholder="Ville" value={ville} onChange={(e) => setVille(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Input placeholder="Code postal" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} />
            </FieldGroup>
            <FieldGroup>
              <Input placeholder="Pays" value={pays} onChange={(e) => setPays(e.target.value)} />
            </FieldGroup>

            <h3>Mode de paiement</h3>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="modePaiement"
                  value="full"
                  checked={modePaiement === "full"}
                  onChange={(e) => setModePaiement(e.target.value)}
                />
                Paiement total
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="modePaiement"
                  value="installments"
                  checked={modePaiement === "installments"}
                  onChange={(e) => setModePaiement(e.target.value)}
                />
                Paiement en 3 fois
              </RadioLabel>
            </RadioGroup>

            <h3>Service de paiement</h3>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="servicePaiement"
                  value="orange"
                  checked={servicePaiement === "orange"}
                  onChange={(e) => setServicePaiement(e.target.value)}
                />
                Orange Money
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="servicePaiement"
                  value="wave"
                  checked={servicePaiement === "wave"}
                  onChange={(e) => setServicePaiement(e.target.value)}
                />
                Wave
              </RadioLabel>
            </RadioGroup>

            <Button type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Valider la commande"}
            </Button>
          </form>
        </Section>

        <Summary>
          <h2>Récapitulatif</h2>

          {ajouter.map((item) => (
            <ProductItem key={item.id}>
              <span>
                {item.nom} x {item.quantite}
              </span>
              <span>{(item.prix * item.quantite).toLocaleString()} FCFA</span>
            </ProductItem>
          ))}

          <Line>
            <span>Sous-total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </Line>

          <Line>
            <span>Livraison</span>
            <span>Gratuite</span>
          </Line>

          <Total>
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </Total>
        </Summary>
      </Grid>
    </Page>
  );
}
