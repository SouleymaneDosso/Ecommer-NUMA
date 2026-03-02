import { useContext } from "react";
import styled from "styled-components";
import { PanierContext } from "../../Utils/Context";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

/* ================== STYLES ================== */

const Page = styled.main`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 4%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

  @media (max-width: 768px) {
    margin: 1.5rem auto;
    padding: 0 5%;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 90px 1fr auto;
    gap: 1rem;
  }
`;

const Image = styled.img`
  width: 120px;
  height: 150px;
  object-fit: cover;

  @media (max-width: 600px) {
    width: 90px;
    height: 120px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Name = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Meta = styled.span`
  font-size: 0.85rem;
  color: #555;
`;

const Price = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 0.5rem;
`;

const QtyBtn = styled.button`
  border: 1px solid #000;
  background: transparent;
  width: 28px;
  height: 28px;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Qty = styled.span`
  min-width: 20px;
  text-align: center;
`;

const StockHint = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const Remove = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

/* ===== SUMMARY ===== */

const Summary = styled.aside`
  border: 1px solid #e5e5e5;
  padding: 2rem;
  height: fit-content;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Total = styled(Line)`
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

const PayButton = styled.button`
  width: 100%;
  margin-top: 2rem;
  padding: 14px;
  border: none;
  background: #000;
  color: white;
  cursor: pointer;
  border-radius: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Clear = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 12px;
  border: 1px solid #000;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
`;

const Empty = styled.div`
  text-align: center;
  padding: 5rem 0;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
  border-bottom: 1px solid black;
`;

/* ================== COMPONENT ================== */

export default function PagePanierZara() {
  const navigate = useNavigate();

  const {
    ajouter,
    supprimer,
    augmenter,
    diminuer,
    toutSupprimer,
    villeLivraison,
    setVilleLivraison,
    sousTotal,
    fraisLivraison,
    total,
  } = useContext(PanierContext);

  const estAbidjan =
    villeLivraison === "Abidjan";

  const estCommune =
    [
      "Cocody",
      "Bingerville",
      "Plateau",
      "Adjamé",
      "Treichville",
      "Marcory",
      "Attécoubé",
      "Yopougon",
      "Abobo",
      "Koumassi",
      "Port-Bouët",
      "Anyama",
    ].includes(villeLivraison);

  if (ajouter.length === 0) {
    return (
      <Page>
        <Empty>
          <h2>Votre panier est vide</h2>
          <Back to="/">Continuer vos achats</Back>
        </Empty>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Shopping Bag</Title>

      <Grid>
        {/* PRODUITS */}
        <Items>
          {ajouter.map((item) => (
            <Item key={item.id}>
              <Image src={item.image} alt={item.nom} />

              <Info>
                <Name>{item.nom}</Name>
                <Meta>Couleur : {item.couleur}</Meta>
                <Meta>Taille : {item.taille}</Meta>
                <Price>{item.prix.toLocaleString()} FCFA</Price>

                <Quantity>
                  <QtyBtn onClick={() => diminuer(item.id)} disabled={item.quantite <= 1}>
                    <FiMinus size={12} />
                  </QtyBtn>

                  <Qty>{item.quantite}</Qty>

                  <QtyBtn
                    onClick={() => augmenter(item.id)}
                    disabled={item.quantite >= item.stockDisponible}
                  >
                    <FiPlus size={12} />
                  </QtyBtn>
                </Quantity>

                <StockHint>Stock maximum : {item.stockDisponible}</StockHint>
              </Info>

              <Remove onClick={() => supprimer(item.id)}>
                <FiTrash2 />
              </Remove>
            </Item>
          ))}
        </Items>

        {/* SUMMARY */}
        <Summary>
          {/* VILLE */}
          <Select
            value={villeLivraison}
            onChange={(e) => setVilleLivraison(e.target.value)}
          >
            <option value="">Choisir votre ville</option>
            <option>Abidjan</option>
            <option>Bouaké</option>
            <option>Daloa</option>
            <option>Yamoussoukro</option>
            <option>San-Pédro</option>
            <option>Korhogo</option>
            <option>Man</option>
            <option>Gagnoa</option>
            <option>Abengourou</option>
            <option>Bondoukou</option>
            <option>Soubré</option>
            <option>Divo</option>
          </Select>

          {/* COMMUNE (si Abidjan) */}
          {estAbidjan && (
            <Select
              value={estCommune ? villeLivraison : ""}
              onChange={(e) => setVilleLivraison(e.target.value)}
            >
              <option value="">Choisir votre commune</option>
              <option>Cocody</option>
              <option>Bingerville</option>
              <option>Plateau</option>
              <option>Adjamé</option>
              <option>Treichville</option>
              <option>Marcory</option>
              <option>Attécoubé</option>
              <option>Yopougon</option>
              <option>Abobo</option>
              <option>Koumassi</option>
              <option>Port-Bouët</option>
              <option>Anyama</option>
            </Select>
          )}

          {!estAbidjan && villeLivraison && (
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              Livraison hors Abidjan : retrait du colis en gare.
            </p>
          )}

          <Line>
            <span>Sous-total</span>
            <span>{sousTotal.toLocaleString()} FCFA</span>
          </Line>

          <Line>
            <span>Livraison</span>
            <span>
              {fraisLivraison === 0
                ? "Gratuite"
                : `${fraisLivraison.toLocaleString()} FCFA`}
            </span>
          </Line>

          <Total>
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </Total>

          <PayButton
            disabled={!villeLivraison}
            onClick={() => navigate("/checkout")}
          >
            Passer au paiement
          </PayButton>

          <Clear onClick={toutSupprimer}>Vider le panier</Clear>
        </Summary>
      </Grid>

      <Back to="/">← Retour boutique</Back>
    </Page>
  );
}