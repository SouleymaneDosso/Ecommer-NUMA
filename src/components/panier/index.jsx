// src/pages/PagePanier.jsx
import { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { PanierContext } from "../../Utils/Context";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiCheck } from "react-icons/fi";

/* ===== ANIMATION TOAST ===== */
const fadeInOut = keyframes`
  0%, 100% { opacity: 0; transform: translateY(-20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #2563eb;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${fadeInOut} 2s ease forwards;
  z-index: 999;
`;

/* ===== STYLES ===== */
const PageWrapper = styled.main`
  padding: 2rem 4%;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Empty = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(0,0,0,0.1);
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Name = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const Price = styled.span`
  font-weight: 700;
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QtyBtn = styled.button`
  border: none;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  padding: 4px;
`;

const Remove = styled.button`
  border: none;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
`;

const Summary = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  height: fit-content;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Total = styled(Line)`
  font-size: 1.2rem;
  font-weight: 800;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  background: ${({ danger }) => (danger ? "#ef4444" : "#2563eb")};
  color: white;
  transition: background 0.2s;

  &:hover {
    background: ${({ danger }) => (danger ? "#dc2626" : "#1e40af")};
  }
`;

const Back = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
  color: #2563eb;
`;

/* ===== PAGE PANIER ===== */

function PagePanier() {
  const {
    ajouter,
    supprimer,
    toutSupprimer,
    augmenter,
    diminuer,
    setQuantite // à ajouter dans ton context
  } = useContext(PanierContext);

  const [toastMessage, setToastMessage] = useState("");

  const total = ajouter.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  // Gestion du toast
  const showToast = (message, duration = 1500) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };

  const handleRemove = (id) => {
    supprimer(id);
    showToast("Produit supprimé du panier !");
  };

  const handleIncrease = (id) => {
    augmenter(id);
    showToast("Quantité augmentée !");
  };

  const handleDecrease = (id) => {
    diminuer(id);
    showToast("Quantité diminuée !");
  };

  const handleChangeQuantity = (id, q) => {
    setQuantite(id, q);
    showToast("Quantité mise à jour !");
  };

  if (ajouter.length === 0) {
    return (
      <PageWrapper>
        {toastMessage && <Toast><FiCheck /> {toastMessage}</Toast>}
        <Empty>
          <h2>Votre panier est vide 🛒</h2>
          <Back to="/">← Continuer vos achats</Back>
        </Empty>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {toastMessage && <Toast><FiCheck /> {toastMessage}</Toast>}
      <Title>Mon panier</Title>

      <Grid>
        {/* PRODUITS */}
        <Items>
          {ajouter.map(item => (
            <Item key={item.id}>
              <Image src={item.image} alt={item.nom} />

              <Info>
                <Name>{item.nom}</Name>
                <Price>{item.prix} FCFA</Price>

                <Quantity>
                  <QtyBtn onClick={() => handleDecrease(item.id)}>
                    <FiMinus />
                  </QtyBtn>

                  <QuantityInput
                    type="number"
                    min={1}
                    value={item.quantite}
                    onChange={(e) => {
                      let q = Number(e.target.value) || 1;
                      handleChangeQuantity(item.id, q);
                    }}
                  />

                  <QtyBtn onClick={() => handleIncrease(item.id)}>
                    <FiPlus />
                  </QtyBtn>
                </Quantity>
              </Info>

              <Remove onClick={() => handleRemove(item.id)}>
                <FiTrash2 />
              </Remove>
            </Item>
          ))}
        </Items>

        {/* RÉCAP */}
        <Summary>
          <Line>
            <span>Sous-total</span>
            <span>{total.toFixed(2)} FCFA</span>
          </Line>

          <Line>
            <span>Livraison</span>
            <span>Gratuite</span>
          </Line>

          <Total>
            <span>Total</span>
            <span>{total.toFixed(2)} FCFA</span>
          </Total>

          <Button>Payer maintenant</Button>
          <Button danger onClick={toutSupprimer}>
            Vider le panier
          </Button>
        </Summary>
      </Grid>

      <Back to="/">← Continuer les achats</Back>
    </PageWrapper>
  );
}

export default PagePanier;

