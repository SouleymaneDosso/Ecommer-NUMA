
import { useContext } from "react";
import styled from "styled-components";
import { PanierContext } from "../../Utils/Context";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiTruck
} from "react-icons/fi";

/* ================= PALETTE LUXE ================= */

const C = {
  background: "#F7F5F0",
  white: "#FFFFFF",
  black: "#171714",
  muted: "#88857E",
  border: "#E8E4DC",
  gold: "#AD9161",
  cream: "#EEEAE1"
};

/* ================= PAGE ================= */

const Page = styled.main`
  min-height: 100vh;
  background: ${C.background};
  padding: 65px 6% 90px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: ${C.black};

  @media(max-width: 768px) {
    padding: 35px 5% 60px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 25px;
  border-bottom: 1px solid ${C.border};
`;

const Brand = styled.span`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 5px;
`;

const Secure = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${C.muted};
  font-size: 11px;
  letter-spacing: 1px;

  svg {
    color: ${C.gold};
  }

  @media(max-width: 500px) {
    font-size: 9px;
  }
`;

const Hero = styled.div`
  padding: 65px 0 55px;

  @media(max-width: 768px) {
    padding: 45px 0 35px;
  }
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 10px;
  letter-spacing: 4px;
  color: ${C.gold};
  text-transform: uppercase;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: clamp(42px, 6vw, 76px);
  letter-spacing: -2px;
  margin: 0;

  span {
    font-style: italic;
    color: ${C.gold};
  }
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${C.muted};
  margin-top: 18px;
  letter-spacing: .5px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 65px;
  align-items: start;

  @media(max-width: 1050px) {
    grid-template-columns: 1fr 330px;
    gap: 30px;
  }

  @media(max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const ItemsSection = styled.section``;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid ${C.border};
  margin-bottom: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const Count = styled.span`
  color: ${C.muted};
  font-size: 12px;
`;

const Item = styled.article`
  display: grid;
  grid-template-columns: 165px 1fr auto;
  gap: 28px;
  padding: 25px 0;
  border-bottom: 1px solid ${C.border};

  @media(max-width: 600px) {
    grid-template-columns: 105px 1fr;
    gap: 16px;
  }
`;

const ImageWrapper = styled.div`
  width: 165px;
  height: 205px;
  background: ${C.cream};
  overflow: hidden;

  @media(max-width: 600px) {
    width: 105px;
    height: 145px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .7s cubic-bezier(.2,.8,.2,1);

  &:hover {
    transform: scale(1.07);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 0;
`;

const ProductLabel = styled.span`
  font-size: 9px;
  color: ${C.gold};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const Name = styled.h3`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 21px;
  margin: 0 0 14px;

  @media(max-width: 600px) {
    font-size: 16px;
  }
`;

const Meta = styled.span`
  color: ${C.muted};
  font-size: 11px;
  margin-bottom: 7px;
  letter-spacing: .3px;
`;

const Price = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-top: 13px;
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${C.border};
  margin-top: 18px;
  height: 36px;
`;

const QtyBtn = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  background: transparent;
  color: ${C.black};
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: .2s;

  &:hover:not(:disabled) {
    background: ${C.cream};
  }

  &:disabled {
    opacity: .25;
    cursor: not-allowed;
  }
`;

const Qty = styled.span`
  min-width: 30px;
  text-align: center;
  font-size: 12px;
`;

const StockHint = styled.span`
  font-size: 9px;
  color: ${C.muted};
  margin-top: 9px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding: 8px 0;

  @media(max-width: 600px) {
    grid-column: 2;
    flex-direction: row;
    align-items: center;
    padding: 0;
  }
`;

const Remove = styled.button`
  border: none;
  background: transparent;
  color: #A09B92;
  cursor: pointer;
  transition: .3s;
  padding: 8px;

  &:hover {
    color: #A33B32;
    transform: scale(1.12);
  }
`;

const ItemTotal = styled.span`
  font-size: 12px;
  font-weight: 600;

  @media(max-width: 600px) {
    font-size: 11px;
  }
`;

/* ================= SUMMARY ================= */

const Summary = styled.aside`
  position: sticky;
  top: 25px;
  background: ${C.white};
  padding: 35px 30px;
  border: 1px solid ${C.border};

  @media(max-width: 850px) {
    position: static;
  }

  @media(max-width: 500px) {
    padding: 27px 20px;
  }
`;

const SummaryEyebrow = styled.span`
  color: ${C.gold};
  font-size: 9px;
  letter-spacing: 3px;
`;

const SummaryTitle = styled.h2`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 29px;
  margin: 12px 0 30px;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 19px;
  font-size: 12px;
  color: ${C.muted};

  strong {
    color: ${C.black};
    font-weight: 500;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${C.border};
  margin: 25px 0;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  span:first-child {
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 600;
  }

  span:last-child {
    font-family: Georgia, serif;
    font-size: 24px;
  }
`;

const PayButton = styled.button`
  width: 100%;
  min-height: 56px;
  border: 1px solid ${C.black};
  background: ${C.black};
  color: white;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: .35s;

  &:hover {
    background: ${C.gold};
    border-color: ${C.gold};
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`;

const Clear = styled.button`
  width: 100%;
  margin-top: 14px;
  padding: 14px;
  border: none;
  background: transparent;
  color: ${C.muted};
  font-size: 10px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: .3s;

  &:hover {
    color: #A33B32;
  }
`;

const Benefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  margin-top: 32px;
`;

const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  color: ${C.muted};

  svg {
    color: ${C.gold};
    font-size: 15px;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  color: ${C.black};
  text-decoration: none;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: .3s;

  &:hover {
    color: ${C.gold};
    gap: 17px;
  }
`;

/* ================= EMPTY CART ================= */

const Empty = styled.div`
  min-height: 55vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 85px;
  height: 85px;
  border: 1px solid ${C.border};
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${C.gold};
  font-size: 28px;
  margin-bottom: 30px;
`;

const EmptyTitle = styled.h2`
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 38px;
  margin: 0;
`;

const EmptyText = styled.p`
  color: ${C.muted};
  font-size: 12px;
  margin: 18px 0 30px;
`;

const ShopButton = styled(Link)`
  background: ${C.black};
  color: white;
  padding: 18px 35px;
  font-size: 10px;
  letter-spacing: 2px;
  text-decoration: none;
  transition: .3s;

  &:hover {
    background: ${C.gold};
  }
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

  const nombreArticles = ajouter.reduce(
    (total, item) => total + item.quantite,
    0
  );

  if (ajouter.length === 0) {
    return (
      <Page>
        <TopBar>
          <Brand>MAISON</Brand>
          <Secure><FiShield /> SHOPPING SÉCURISÉ</Secure>
        </TopBar>

        <Empty>
          <EmptyIcon>
            <FiShoppingBag />
          </EmptyIcon>
          <Eyebrow>VOTRE SÉLECTION</Eyebrow>
          <EmptyTitle>Votre panier est vide.</EmptyTitle>
          <EmptyText>
            Découvrez nos collections et trouvez votre prochaine pièce coup de cœur.
          </EmptyText>
          <ShopButton to="/">DÉCOUVRIR LA COLLECTION</ShopButton>
        </Empty>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar>
        <Brand>MAISON</Brand>
        <Secure>
          <FiShield />
          SHOPPING SÉCURISÉ
        </Secure>
      </TopBar>

      <Hero>
        <Eyebrow>VOTRE SÉLECTION PRIVÉE</Eyebrow>
        <Title>Shopping <span>Bag.</span></Title>
        <Subtitle>
          Vos pièces préférées, réunies en un seul endroit.
        </Subtitle>
      </Hero>

      <Grid>
        <ItemsSection>
          <SectionHeader>
            <SectionTitle>Vos articles</SectionTitle>
            <Count>{nombreArticles} pièce(s)</Count>
          </SectionHeader>

          <Items>
            {ajouter.map((item) => (
              <Item key={item.id}>
                <ImageWrapper>
                  <Image src={item.image} alt={item.nom} />
                </ImageWrapper>

                <Info>
                  <ProductLabel>Collection exclusive</ProductLabel>
                  <Name>{item.nom}</Name>

                  <Meta>Couleur : {item.couleur}</Meta>
                  <Meta>Taille : {item.taille}</Meta>

                  <Price>
                    {item.prix.toLocaleString("fr-FR")} FCFA
                  </Price>

                  <Quantity>
                    <QtyBtn
                      onClick={() => diminuer(item.id)}
                      disabled={item.quantite <= 1}
                      aria-label="Diminuer la quantité"
                    >
                      <FiMinus size={12} />
                    </QtyBtn>

                    <Qty>{item.quantite}</Qty>

                    <QtyBtn
                      onClick={() => augmenter(item.id)}
                      disabled={item.quantite >= item.stockDisponible}
                      aria-label="Augmenter la quantité"
                    >
                      <FiPlus size={12} />
                    </QtyBtn>
                  </Quantity>

                  <StockHint>
                    Stock disponible : {item.stockDisponible}
                  </StockHint>
                </Info>

                <Actions>
                  <Remove
                    onClick={() => supprimer(item.id)}
                    aria-label="Supprimer cet article"
                    title="Supprimer"
                  >
                    <FiTrash2 size={16} />
                  </Remove>

                  <ItemTotal>
                    {(item.prix * item.quantite).toLocaleString("fr-FR")} FCFA
                  </ItemTotal>
                </Actions>
              </Item>
            ))}
          </Items>

          <Back to="/">
            <FiArrowLeft />
            Continuer mes achats
          </Back>
        </ItemsSection>

        <Summary>
          <SummaryEyebrow>FINALISATION</SummaryEyebrow>
          <SummaryTitle>Votre commande</SummaryTitle>

          <Line>
            <span>Articles ({nombreArticles})</span>
            <strong>
              {sousTotal.toLocaleString("fr-FR")} FCFA
            </strong>
          </Line>

          <Line>
            <span>Livraison</span>
            <strong>À confirmer</strong>
          </Line>

          <Divider />

          <Total>
            <span>TOTAL</span>
            <span>
              {sousTotal.toLocaleString("fr-FR")} FCFA
            </span>
          </Total>

          <PayButton onClick={() => navigate("/checkout")}>
            PASSER AU PAIEMENT
            <FiArrowRight />
          </PayButton>

          <Clear onClick={toutSupprimer}>
            VIDER MON PANIER
          </Clear>

          <Divider />

          <Benefits>
            <Benefit>
              <FiTruck />
              Livraison selon votre zone
            </Benefit>

            <Benefit>
              <FiShield />
              Commande sécurisée
            </Benefit>

            <Benefit>
              <FiShoppingBag />
              Une expérience shopping premium
            </Benefit>
          </Benefits>
        </Summary>
      </Grid>
    </Page>
  );
}
