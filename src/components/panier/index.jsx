
import { useContext } from "react";
import styled from "styled-components";
import { PanierContext } from "../../Utils/Context";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowRight,
  FiArrowLeft,
  FiLock,
  FiShoppingBag
} from "react-icons/fi";

/* ================= STYLES ================= */

const Page = styled.main`
  background: #faf9f6;
  min-height: 100vh;
  padding: 65px 5% 100px;
  color: #171717;
  font-family: "Helvetica Neue", Arial, sans-serif;

  @media(max-width: 768px) {
    padding: 35px 5% 70px;
  }
`;

const Container = styled.div`
  max-width: 1350px;
  margin: auto;
`;

const Breadcrumb = styled.div`
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 45px;

  span {
    color: #171717;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-bottom: 35px;
  border-bottom: 1px solid #dedbd5;

  @media(max-width: 600px) {
    align-items: start;
    flex-direction: column;
    gap: 15px;
  }
`;

const Eyebrow = styled.p`
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #9a8870;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-family: Georgia, serif;
  font-size: clamp(38px, 5vw, 65px);
  font-weight: 400;
  letter-spacing: -2px;
  margin: 0;
`;

const Count = styled.span`
  font-size: 11px;
  letter-spacing: 1px;
  color: #777;
  padding-bottom: 8px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 90px;
  margin-top: 45px;
  align-items: start;

  @media(max-width: 1000px) {
    grid-template-columns: 1fr;
    gap: 45px;
  }
`;

const Products = styled.section``;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px solid #dedbd5;
  margin-bottom: 10px;

  span {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const Product = styled.article`
  display: grid;
  grid-template-columns: 180px 1fr auto;
  gap: 30px;
  padding: 28px 0;
  border-bottom: 1px solid #e5e2dc;

  @media(max-width: 650px) {
    grid-template-columns: 115px 1fr;
    gap: 17px;
    padding: 22px 0;
  }
`;

const ProductImage = styled.div`
  overflow: hidden;
  background: #eeece7;
  aspect-ratio: 3 / 4;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .7s ease;
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 0;
`;

const ProductName = styled.h3`
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 400;
  margin: 0 0 15px;
  line-height: 1.3;

  @media(max-width: 600px) {
    font-size: 17px;
  }
`;

const Detail = styled.p`
  font-size: 11px;
  color: #85817a;
  letter-spacing: .5px;
  margin: 0 0 8px;
`;

const ProductPrice = styled.p`
  font-size: 13px;
  font-weight: 600;
  margin: 17px 0;
  letter-spacing: .5px;
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #dedbd5;
  height: 36px;
`;

const QtyButton = styled.button`
  border: none;
  background: transparent;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #171717;

  &:hover:not(:disabled) {
    background: #eeece7;
  }

  &:disabled {
    opacity: .3;
    cursor: not-allowed;
  }
`;

const QtyValue = styled.span`
  min-width: 28px;
  text-align: center;
  font-size: 12px;
`;

const Stock = styled.p`
  font-size: 10px;
  color: #999;
  margin-top: 12px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;

  @media(max-width: 650px) {
    grid-column: 2;
    flex-direction: row;
    align-items: center;
  }
`;

const Delete = styled.button`
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  padding: 8px;
  transition: color .3s;

  &:hover {
    color: #a33b32;
  }
`;

const Subtotal = styled.span`
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

/* ================= SUMMARY ================= */

const Summary = styled.aside`
  background: #f0eee9;
  padding: 35px 30px;
  position: sticky;
  top: 30px;

  @media(max-width: 1000px) {
    position: static;
  }

  @media(max-width: 600px) {
    padding: 27px 20px;
  }
`;

const SummaryTitle = styled.h2`
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
  margin: 0 0 30px;
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 19px;
  font-size: 12px;
  color: #777;

  strong {
    color: #171717;
    font-weight: 500;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #d8d4cc;
  margin: 25px 0;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:first-child {
    font-family: Georgia, serif;
    font-size: 21px;
  }

  strong {
    font-size: 17px;
    font-weight: 600;
  }
`;

const Note = styled.p`
  font-size: 10px;
  line-height: 1.8;
  color: #8b867e;
  margin: 17px 0 28px;
`;

const Checkout = styled.button`
  width: 100%;
  height: 58px;
  background: #171717;
  color: white;
  border: 1px solid #171717;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  transition: all .3s;

  &:hover {
    background: transparent;
    color: #171717;
  }
`;

const Clear = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: #999;
  font-size: 10px;
  text-decoration: underline;
  text-underline-offset: 4px;
  margin-top: 22px;
  cursor: pointer;

  &:hover {
    color: #171717;
  }
`;

const Security = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 25px;
  color: #888;
  font-size: 10px;
  letter-spacing: .5px;
`;

const Continue = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 35px;
  text-decoration: none;
  color: #555;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: color .3s;

  &:hover {
    color: #000;
  }
`;

/* ================= EMPTY CART ================= */

const Empty = styled.div`
  text-align: center;
  padding: 100px 20px;

  svg {
    font-size: 35px;
    color: #aaa;
    margin-bottom: 25px;
  }

  h2 {
    font-family: Georgia, serif;
    font-size: 36px;
    font-weight: 400;
  }

  p {
    color: #888;
    font-size: 12px;
    margin: 20px 0 35px;
  }
`;

const EmptyButton = styled(Link)`
  display: inline-flex;
  padding: 17px 30px;
  background: #171717;
  color: white;
  text-decoration: none;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

/* ================= COMPONENT ================= */

export default function PagePanierZara() {
  const navigate = useNavigate();

  const {
    ajouter,
    supprimer,
    augmenter,
    diminuer,
    toutSupprimer,
    sousTotal,
  } = useContext(PanierContext);

  if (ajouter.length === 0) {
    return (
      <Page>
        <Container>
          <Empty>
            <FiShoppingBag />
            <Eyebrow>Votre sélection</Eyebrow>
            <h2>Votre panier est vide.</h2>
            <p>Découvrez nos pièces et trouvez votre prochain coup de cœur.</p>
            <EmptyButton to="/">
              Découvrir la collection
            </EmptyButton>
          </Empty>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>

        <Breadcrumb>
          Boutique / <span>Votre panier</span>
        </Breadcrumb>

        <Header>
          <div>
            <Eyebrow>Votre sélection personnelle</Eyebrow>
            <Title>Mon panier.</Title>
          </div>

          <Count>
            {ajouter.reduce((total, item) => total + item.quantite, 0)}
            {" "}ARTICLE(S)
          </Count>
        </Header>

        <Layout>

          {/* PRODUITS */}

          <Products>
            <SectionHeader>
              <span>Articles sélectionnés</span>
              <span>Prix</span>
            </SectionHeader>

            {ajouter.map((item) => (
              <Product key={item.id}>

                <ProductImage>
                  <img src={item.image} alt={item.nom} />
                </ProductImage>

                <ProductInfo>
                  <ProductName>{item.nom}</ProductName>

                  <Detail>Couleur : {item.couleur}</Detail>
                  <Detail>Taille : {item.taille}</Detail>

                  <ProductPrice>
                    {item.prix.toLocaleString("fr-FR")} FCFA
                  </ProductPrice>

                  <Quantity>
                    <QtyButton
                      onClick={() => diminuer(item.id)}
                      disabled={item.quantite <= 1}
                      aria-label="Diminuer la quantité"
                    >
                      <FiMinus size={12} />
                    </QtyButton>

                    <QtyValue>{item.quantite}</QtyValue>

                    <QtyButton
                      onClick={() => augmenter(item.id)}
                      disabled={item.quantite >= item.stockDisponible}
                      aria-label="Augmenter la quantité"
                    >
                      <FiPlus size={12} />
                    </QtyButton>
                  </Quantity>

                  <Stock>
                    Stock disponible : {item.stockDisponible}
                  </Stock>
                </ProductInfo>

                <Actions>
                  <Delete
                    onClick={() => supprimer(item.id)}
                    aria-label="Supprimer cet article"
                  >
                    <FiTrash2 size={16} />
                  </Delete>

                  <Subtotal>
                    {(item.prix * item.quantite).toLocaleString("fr-FR")}
                    {" "}FCFA
                  </Subtotal>
                </Actions>

              </Product>
            ))}

            <Continue to="/">
              <FiArrowLeft />
              Continuer mes achats
            </Continue>
          </Products>

          {/* RÉCAPITULATIF */}

          <Summary>
            <Eyebrow>Finaliser votre sélection</Eyebrow>

            <SummaryTitle>
              Récapitulatif
            </SummaryTitle>

            <SummaryLine>
              <span>Nombre d'articles</span>
              <strong>
                {ajouter.reduce(
                  (total, item) => total + item.quantite,
                  0
                )}
              </strong>
            </SummaryLine>

            <SummaryLine>
              <span>Sous-total</span>
              <strong>
                {sousTotal.toLocaleString("fr-FR")} FCFA
              </strong>
            </SummaryLine>

            <SummaryLine>
              <span>Livraison</span>
              <strong>Par le livreur</strong>
            </SummaryLine>

            <Divider />

            <Total>
              <span>Total</span>
              <strong>
                {sousTotal.toLocaleString("fr-FR")} FCFA
              </strong>
            </Total>

            <Note>
              Les frais de livraison seront communiqués par le livreur.
            </Note>

            <Checkout onClick={() => navigate("/checkout")}>
              Procéder au paiement
              <FiArrowRight size={16} />
            </Checkout>

            <Clear onClick={toutSupprimer}>
              Vider entièrement mon panier
            </Clear>

            <Security>
              <FiLock size={13} />
              Paiement sécurisé
            </Security>
          </Summary>

        </Layout>
      </Container>
    </Page>
  );
}
