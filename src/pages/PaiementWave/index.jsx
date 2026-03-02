import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import * as Context from "../../Utils/Context";
import { ThemeContext } from "../../Utils/Context";
import { useNavigate } from "react-router-dom";

/* ==========================
   GLOBAL FIX INPUT BUG
========================== */

const Page = styled.main`
  max-width: 1100px;
  margin: 3rem auto;
  padding: 0 1.5rem;
  font-family: "Inter", system-ui, sans-serif;
  background: ${({ $isdark }) => ($isdark ? "#0f0f0f" : "#f7f7f7")};
  color: ${({ $isdark }) => ($isdark ? "#f5f5f5" : "#111")};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 2.4rem);
  margin-bottom: 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#ffffff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
  border-radius: 18px;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  display: block;
  opacity: 0.7;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#dcdcdc")};
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fff")};
  color: inherit;
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    border-color: #6366f1;
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${({ $isdark }) => ($isdark ? "#333" : "#dcdcdc")};
  background: ${({ $isdark }) => ($isdark ? "#222" : "#fff")};
  color: inherit;
  font-size: 0.95rem;
  box-sizing: border-box;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.8rem 0 1.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, black, #6366f1);
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const Summary = styled.aside`
  background: ${({ $isdark }) => ($isdark ? "#181818" : "#fff")};
  border: 1px solid ${({ $isdark }) => ($isdark ? "#2a2a2a" : "#e5e5e5")};
  border-radius: 18px;
  padding: 2rem;
  height: fit-content;
`;

/* ==========================
   VILLES CI
========================== */

const villesCI = ["Abidjan","Bouaké","Daloa","Yamoussoukro","San-Pédro","Korhogo","Man","Gagnoa","Abengourou","Bondoukou","Soubré","Divo","Anyama","Bingerville","Grand-Bassam","Issia","Tiassalé","Oumé","Toumodi","Dimbokro","Sinfra","Adzopé","Ferkessédougou","Séguéla","Guiglo","Danané"];

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

  const [modePaiement, setModePaiement] = useState("full");
  const [servicePaiement, setServicePaiement] = useState("orange");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return navigate("/login");
    setToken(savedToken);
  }, []);

  const handlePaiement = async (e) => {
    e.preventDefault();
    if (!nom || !prenom || !adresse || !ville)
      return alert("Remplissez tous les champs.");

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
      servicePaiement,
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
      if (!res.ok) return alert(data.message || "Erreur");

      navigate(`/paiement-semi/${data.commande._id}`);
    } catch (err) {
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (ajouter.length === 0)
    return <Page $isdark={$isdark}><h2>Votre panier est vide</h2></Page>;

  return (
    <Page $isdark={$isdark}>
      <Title>Checkout</Title>

      <Grid>
        <Section $isdark={$isdark}>
          <h2>Adresse de livraison</h2>

          <Form onSubmit={handlePaiement}>
            <FormGroup>
              <Label>Nom</Label>
              <Input $isdark={$isdark} value={nom} onChange={(e)=>setNom(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label>Prénom</Label>
              <Input $isdark={$isdark} value={prenom} onChange={(e)=>setPrenom(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label>Adresse</Label>
              <Input $isdark={$isdark} value={adresse} onChange={(e)=>setAdresse(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label>Ville</Label>
              <Select $isdark={$isdark} value={ville} onChange={(e)=>setVille(e.target.value)}>
                <option value="">Choisir votre ville</option>
                {villesCI.map((v)=>(
                  <option key={v} value={v}>{v}</option>
                ))}
              </Select>
            </FormGroup>

            <Row>
              <FormGroup>
                <Label>Code postal</Label>
                <Input $isdark={$isdark} value={codePostal} disabled />
              </FormGroup>

              <FormGroup>
                <Label>Pays</Label>
                <Input $isdark={$isdark} value={pays} disabled />
              </FormGroup>
            </Row>

            <h3>Mode de paiement</h3>
            <RadioGroup>
              <RadioLabel>
                <input type="radio" value="full" checked={modePaiement==="full"} onChange={(e)=>setModePaiement(e.target.value)} />
                Paiement total
              </RadioLabel>
              <RadioLabel>
                <input type="radio" value="installments" checked={modePaiement==="installments"} onChange={(e)=>setModePaiement(e.target.value)} />
                Paiement en 3 fois
              </RadioLabel>
            </RadioGroup>

            <h3>Service de paiement</h3>
            <RadioGroup>
              <RadioLabel>
                <input type="radio" value="orange" checked={servicePaiement==="orange"} onChange={(e)=>setServicePaiement(e.target.value)} />
                Orange Money
              </RadioLabel>
              <RadioLabel>
                <input type="radio" value="wave" checked={servicePaiement==="wave"} onChange={(e)=>setServicePaiement(e.target.value)} />
                Wave
              </RadioLabel>
            </RadioGroup>

            <Button disabled={loading}>
              {loading ? "Envoi..." : "Valider la commande"}
            </Button>
          </Form>
        </Section>

        <Summary $isdark={$isdark}>
          <h2>Récapitulatif</h2>
          {ajouter.map((item)=>(
            <div key={item.id}>
              {item.nom} x {item.quantite} — {(item.prix*item.quantite).toLocaleString()} FCFA
            </div>
          ))}
          <div>Livraison : {fraisLivraison===0 ? "Gratuite" : `${fraisLivraison.toLocaleString()} FCFA`}</div>
          <div><strong>Total : {total.toLocaleString()} FCFA</strong></div>
        </Summary>
      </Grid>
    </Page>
  );
}
