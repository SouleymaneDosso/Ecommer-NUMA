// src/pages/PagePanierZara.jsx
import { useContext } from "react";
import styled from "styled-components";
import { PanierContext } from "../../Utils/Context";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

/* ================== STYLES ================== */

const Page = styled.main`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 4%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 3rem;
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
`;

const Image = styled.img`
  width: 120px;
  height: 150px;
  object-fit: cover;
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
  text-transform: capitalize;
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
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Qty = styled.span`
  min-width: 20px;
  text-align: center;
  font-size: 0.9rem;
`;

const Remove = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #000;
`;

/* ===== SUMMARY ===== */

const Summary = styled.aside`
  border: 1px solid #e5e5e5;
  padding: 2rem;
  height: fit-content;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
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
  font-size: 0.9rem;
  letter-spacing: 2px;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    background: #111;
  }
`;

const Clear = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 12px;
  border: 1px solid #000;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.8rem;
`;

const Empty = styled.div`
  text-align: center;
  padding: 5rem 0;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  color: #000;
  text-decoration: none;
  border-bottom: 1px solid #000;
`;

/* ================== COMPONENT ================== */

export default function PagePanier() {
  const {
    ajouter,
    supprimer,
    augmenter,
    diminuer,
    toutSupprimer
  } = useContext(PanierContext);

  const total = ajouter.reduce(
    (acc, item) => acc + item.prix * item.quantite,
    0
  );

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
          {ajouter.map(item => (
            <Item key={item.id}>
              <Image src={item.image} alt={item.nom} />

              <Info>
                <Name>{item.nom}</Name>
                <Meta>Couleur : {item.couleur}</Meta>
                <Meta>Taille : {item.taille}</Meta>
                <Price>{item.prix.toLocaleString()} FCFA</Price>

                <Quantity>
                  <QtyBtn
                    onClick={() => diminuer(item.id)}
                    disabled={item.quantite <= 1}
                  >
                    <FiMinus size={12} />
                  </QtyBtn>

                  <Qty>{item.quantite}</Qty>

                  <QtyBtn onClick={() => augmenter(item.id)}>
                    <FiPlus size={12} />
                  </QtyBtn>
                </Quantity>
              </Info>

              <Remove onClick={() => supprimer(item.id)}>
                <FiTrash2 />
              </Remove>
            </Item>
          ))}
        </Items>

        {/* SUMMARY */}
        <Summary>
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

          <PayButton>Procéder au paiement</PayButton>
          <Clear onClick={toutSupprimer}>Vider le panier</Clear>
        </Summary>
      </Grid>

      <Back to="/">← Retour boutique</Back>
    </Page>
  );
}
