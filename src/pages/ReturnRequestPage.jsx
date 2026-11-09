import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// ================= CONFIGURATION API =================

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const API_BASE = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

// ================= ANIMATIONS =================

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ================= STYLES =================

const Page = styled.main`
  --black: #111;
  --gray: #777;
  --light: #f5f4f1;
  --border: #e8e7e4;

  min-height: 100vh;
  background: #fff;
  color: var(--black);
  font-family: inherit;

  * {
    box-sizing: border-box;
  }
`;

const Header = styled.header`
  padding: 28px 8%;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    color: inherit;
    text-decoration: none;
    font-size: 11px;
    letter-spacing: 1px;
  }

  .logo {
    font-size: 27px;
    font-weight: 900;
    letter-spacing: -2px;
  }

  @media (max-width: 600px) {
    padding: 22px;
  }
`;

const Main = styled.div`
  max-width: 1050px;
  margin: auto;
  padding: 75px 25px 100px;

  @media (max-width: 600px) {
    padding: 50px 20px 70px;
  }
`;

const Intro = styled.div`
  text-align: center;
  margin-bottom: 50px;

  .eyebrow {
    font-size: 10px;
    letter-spacing: 2px;
    font-weight: 700;
    color: var(--gray);
  }

  h1 {
    font-size: clamp(35px, 6vw, 60px);
    letter-spacing: -3px;
    line-height: 1;
    margin: 22px 0 18px;
  }

  p {
    color: var(--gray);
    font-size: 13px;
    line-height: 1.8;
    max-width: 490px;
    margin: auto;
  }
`;

const Progress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 55px;

  .step {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #aaa;
    font-size: 10px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .number {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }

  .active {
    color: var(--black);

    .number {
      background: var(--black);
      color: white;
      border-color: var(--black);
    }
  }

  .line {
    width: 55px;
    height: 1px;
    background: #ddd;
  }

  @media (max-width: 450px) {
    gap: 8px;

    .step {
      font-size: 8px;
      gap: 5px;
    }

    .number {
      width: 26px;
      height: 26px;
    }

    .line {
      width: 20px;
    }
  }
`;

const Panel = styled.section`
  max-width: 690px;
  margin: auto;
  border: 1px solid var(--border);
  padding: 40px;
  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 600px) {
    padding: 25px 20px;
  }
`;

const PanelHeader = styled.div`
  margin-bottom: 30px;

  h2 {
    font-size: 23px;
    letter-spacing: -0.7px;
    margin: 0 0 10px;
  }

  p {
    color: var(--gray);
    font-size: 12px;
    line-height: 1.8;
    margin: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const Field = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 15px;
  border: 1px solid #dededb;
  background: white;
  outline: none;
  font: inherit;
  font-size: 13px;
  transition: border 0.2s;

  &:focus {
    border-color: #111;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const FieldGroup = styled.div`
  margin-bottom: 23px;
`;

const HelpText = styled.p`
  font-size: 11px;
  color: var(--gray);
  line-height: 1.7;
  margin: 9px 0 0;
`;

const Button = styled.button`
  width: 100%;
  height: 54px;
  padding: 0 20px;
  background: var(--black);
  color: white;
  border: 1px solid var(--black);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: 0.25s;

  &:hover:not(:disabled) {
    background: #383838;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  border: none;
  background: none;
  color: #777;
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 25px;

  &:hover {
    color: #111;
  }
`;

const ErrorBox = styled.div`
  padding: 14px;
  background: #fff1f0;
  border: 1px solid #f0d0cc;
  color: #a33c32;
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const OrderSummary = styled.div`
  background: var(--light);
  padding: 20px;
  margin-bottom: 30px;

  .top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .top:last-child {
    margin-bottom: 0;
  }

  .label {
    color: #888;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .value {
    font-size: 12px;
    font-weight: 700;
    margin-top: 6px;
  }

  .status {
    font-size: 10px;
    font-weight: 700;
    background: white;
    padding: 8px 12px;
    height: fit-content;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductCard = styled.label`
  display: grid;
  grid-template-columns: 24px 90px 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 17px;
  border: 1px solid ${({ $selected }) => ($selected ? "#111" : "#e8e7e4")};
  background: ${({ $selected }) => ($selected ? "#fafafa" : "#fff")};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: #777;
  }

  input {
    width: 17px;
    height: 17px;
    accent-color: #111;
    cursor: pointer;
  }

  img {
    width: 90px;
    height: 110px;
    object-fit: cover;
    background: #eee;
  }

  .name {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .details {
    color: #777;
    font-size: 11px;
    line-height: 1.9;
  }

  .price {
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  @media (max-width: 550px) {
    grid-template-columns: 20px 70px 1fr;
    gap: 12px;

    img {
      width: 70px;
      height: 90px;
    }

    .price {
      grid-column: 3;
    }
  }
`;

const SelectionInfo = styled.div`
  margin: 20px 0;
  font-size: 12px;
  color: #777;

  strong {
    color: #111;
  }
`;

const Footer = styled.footer`
  border-top: 1px solid var(--border);
  padding: 25px;
  text-align: center;
  color: #999;
  font-size: 9px;
  letter-spacing: 2px;
`;

const LoadingText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    border: 2px solid #ffffff70;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// ================= HELPERS =================

const formatPrice = (price) => {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return `${price} FCFA`;
  }

  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
};

const formatDate = (date) => {
  if (!date) return "Non renseignée";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getStatusLabel = (status) => {
  const statuses = {
    PENDING: "En attente",
    PARTIALLY_PAID: "Partiellement payée",
    PAID: "Payée",
    CONFIRMED: "Confirmée",
    DELIVERED: "Livrée",
    SHIPPED: "Expédiée",
  };

  return statuses[status] || status || "Inconnu";
};

// ================= MAIN COMPONENT =================

export default function ReturnRequestPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= ORDER VERIFICATION =================

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setSelectedProducts([]);

    const numero = orderNumber.trim().toUpperCase();

    if (!numero) {
      setError("Veuillez renseigner votre numéro de commande.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Votre session a expiré. Veuillez vous connecter à votre compte pour effectuer un retour.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/commandes/recherche/${encodeURIComponent(numero)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible de retrouver cette commande.",
        );
      }

      const commande = data.commande;

      if (!commande) {
        throw new Error("Aucune commande correspondante n'a été trouvée.");
      }

      // Une commande doit obligatoirement être livrée.
      if (commande.statusCommande !== "DELIVERED") {
        setOrder(commande);

        setError(
          `Votre commande ${commande.numeroCommande} a été retrouvée, mais elle n'est pas encore livrée. Statut actuel : ${getStatusLabel(
            commande.statusCommande,
          )}. Vous pourrez effectuer une demande de retour après sa livraison.`,
        );

        return;
      }

      // Transformation du panier MongoDB en articles affichables.
      const products = (commande.panier || []).map((ligne, panierIndex) => ({
        id: `${commande._id}-${panierIndex}`,
        panierIndex,
        produitId: ligne.produitId,
        name: ligne.nom,
        color: ligne.couleur || "Non renseignée",
        size: ligne.taille || "Non renseignée",
        quantity: ligne.quantite,
        price: formatPrice(ligne.prix),
        image: ligne.image || "",
      }));

      if (products.length === 0) {
        throw new Error(
          "Cette commande ne contient aucun article pouvant être retourné.",
        );
      }

      setOrder({
        ...commande,
        products,
      });

      setStep(2);
    } catch (err) {
      console.error("RECHERCHE COMMANDE ERROR:", err);

      setError(
        err.message ||
          "Une erreur est survenue lors de la recherche de votre commande.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= PRODUCT SELECTION =================

  const toggleProduct = (productId) => {
    setError("");

    setSelectedProducts((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId],
    );
  };

  // ================= CONTINUE =================

  const handleContinue = () => {
    setError("");

    if (!order || order.statusCommande !== "DELIVERED") {
      setError(
        "Seules les commandes livrées peuvent faire l'objet d'un retour.",
      );
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Veuillez sélectionner au moins un article.");
      return;
    }

    const productsToReturn = order.products.filter((product) =>
      selectedProducts.includes(product.id),
    );

    navigate("/returns/new", {
      state: {
        order,
        selectedProducts: productsToReturn,
      },
    });
  };

  // ================= RENDER =================

  return (
    <Page>
      <Header>
        <a href="/" className="logo">
          NUMA
        </a>

        <a href="/returns">RETOURS & ÉCHANGES ↗</a>
      </Header>

      <Main>
        <Intro>
          <span className="eyebrow">NUMA / SERVICE CLIENT</span>

          <h1>INITIER UN RETOUR.</h1>

          <p>
            Retrouvez votre commande pour commencer votre demande de retour ou
            d'échange.
          </p>
        </Intro>

        <Progress>
          <div className={`step ${step === 1 ? "active" : ""}`}>
            <span className="number">01</span>
            COMMANDE
          </div>

          <div className="line" />

          <div className={`step ${step === 2 ? "active" : ""}`}>
            <span className="number">02</span>
            ARTICLES
          </div>
        </Progress>

        {/* ================= STEP 1 ================= */}

        {step === 1 && (
          <Panel>
            <PanelHeader>
              <h2>Retrouvez votre commande</h2>

              <p>
                Saisissez votre numéro de commande pour retrouver les articles
                achetés sur NUMA.
              </p>
            </PanelHeader>

            <form onSubmit={handleVerify}>
              <FieldGroup>
                <Label htmlFor="orderNumber">NUMÉRO DE COMMANDE *</Label>

                <Field
                  id="orderNumber"
                  type="text"
                  placeholder="Ex : NUMA-2026-XXXXXXXX"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  autoComplete="off"
                  required
                />

                <HelpText>
                  Vous trouverez ce numéro dans les informations de votre
                  commande.
                </HelpText>
              </FieldGroup>

              {error && <ErrorBox role="alert">{error}</ErrorBox>}

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <LoadingText>VÉRIFICATION...</LoadingText>
                ) : (
                  <>RETROUVER MA COMMANDE ↗</>
                )}
              </Button>
            </form>
          </Panel>
        )}

        {/* ================= STEP 2 ================= */}

        {step === 2 && order && (
          <Panel>
            <BackButton
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
                setSelectedProducts([]);
              }}
            >
              ← RETOUR À LA VÉRIFICATION
            </BackButton>

            <PanelHeader>
              <h2>Votre commande a été retrouvée.</h2>

              <p>
                Sélectionnez le ou les articles concernés par votre demande de
                retour.
              </p>
            </PanelHeader>

            <OrderSummary>
              <div className="top">
                <div>
                  <div className="label">NUMÉRO DE COMMANDE</div>

                  <div className="value">{order.numeroCommande}</div>
                </div>

                <div className="status">
                  {getStatusLabel(order.statusCommande)}
                </div>
              </div>

              <div className="top">
                <div>
                  <div className="label">DATE DE COMMANDE</div>

                  <div className="value">{formatDate(order.createdAt)}</div>
                </div>
              </div>
            </OrderSummary>

            <Label>ARTICLES DE VOTRE COMMANDE</Label>

            <ProductList>
              {order.products.map((product) => {
                const selected = selectedProducts.includes(product.id);

                return (
                  <ProductCard key={product.id} $selected={selected}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleProduct(product.id)}
                      aria-label={`Sélectionner ${product.name}`}
                    />

                    <img
                      src={
                        product.image ||
                        "https://placehold.co/200x250?text=NUMA"
                      }
                      alt={product.name}
                    />

                    <div>
                      <div className="name">{product.name}</div>

                      <div className="details">
                        Couleur : {product.color}
                        <br />
                        Taille : {product.size}
                        <br />
                        Quantité : {product.quantity}
                      </div>
                    </div>

                    <div className="price">{product.price}</div>
                  </ProductCard>
                );
              })}
            </ProductList>

            <SelectionInfo>
              <strong>{selectedProducts.length}</strong> article(s)
              sélectionné(s) pour le retour.
              <br />
              <HelpText>
                La quantité totale de chaque ligne sélectionnée devra être
                retournée.
              </HelpText>
            </SelectionInfo>

            {error && <ErrorBox role="alert">{error}</ErrorBox>}

            <Button
              type="button"
              onClick={handleContinue}
              disabled={selectedProducts.length === 0}
            >
              CONTINUER MA DEMANDE ↗
            </Button>

            <HelpText>
              La sélection des articles ne signifie pas que votre demande est
              automatiquement acceptée.
            </HelpText>
          </Panel>
        )}
      </Main>

      <Footer>NUMA — YOUR STYLE, YOUR STORY.</Footer>
    </Page>
  );
}
