import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaLock, FaUnlock } from "react-icons/fa";

/* ================= LOADER ================= */
const spin = keyframes`to { transform: rotate(360deg); }`;

const LoaderWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.div`
  width: 44px;
  height: 44px;
  border: 4px solid #2a2a3d;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/* ================= PAGE ================= */
const PageWrapper = styled.main`
  max-width: 960px;
  margin: 2rem auto;
  padding: 2rem; /* ⬅️ plus d'espace desktop */
  background: #1f1f2e;
  border-radius: 22px;
  color: #f3f3f3;

  @media (max-width: 768px) {
    margin: 0.5rem;
    padding: 1.5rem; /* ⬅️ plus d'espace mobile */
    border-radius: 18px;
  }
`;

const Carousel = styled.div`
  background: #0f0f1a;
  padding: 0.7rem;
  margin-bottom: 2rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  animation: scroll 15s linear infinite;

  @keyframes scroll {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

const Section = styled.section`
  background: #2a2a3d;
  border-radius: 20px;
  padding: 1.8rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.3rem;
  }
`;
const Title = styled.h2`
  margin-bottom: 1.2rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

/* ================= BUTTONS ================= */
const Button = styled.button`
   padding: 12px 18px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #f87171);
`;

/* ================= COFFRE ================= */
const CoffreBox = styled.div`
  background: linear-gradient(145deg, #2a2a3d, #1c1c2b);
  padding: 1.5rem;
  border-radius: 22px;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.45);
`;

const CoffreLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem; 

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
  }
`;

const CoffreLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
`;

const CoffreProgressBar = styled.div`
  height: 10px;
  background: #3a3a5a;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
`;

const CoffreProgress = styled.div`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  transition: width 0.4s ease;
`;

/* ================= CARDS ================= */
const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ProductCard = styled.div`
  background: #1f1f2e;
  padding: 1.2rem;
  border-radius: 16px;
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.3rem;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    max-height: 160px;
  }
`;

const TrashIcon = styled(FiTrash2)`
  color: #ef4444;
  cursor: pointer;
`;

const CommandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const CommandContent = styled.div`
  margin-top: 1rem;
`;

/* ================= COMPONENT ================= */
export default function CompteClient() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchCompte();
  }, []);

  const fetchCompte = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.user);
      setFavorites(data.favorites || []);
      setCommandes(data.commandes || []);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = (p) =>
    p?.images?.[0]?.url || "https://via.placeholder.com/80";

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  const totalPaid = commandes.reduce((total, c) => {
    // ✅ CAS COD
    if (c.modePaiement === "cod") {
      return total + (c.isPaid ? c.total : 0);
    }

    // ✅ CAS NORMAL (paiement en ligne)
    const paid = (c.paiements || [])
      .filter((p) => p.status === "PAID")
      .reduce((a, b) => a + b.amountExpected, 0);

    return total + paid;
  }, 0);

  const totalAmount = commandes.reduce((a, c) => a + c.total, 0);
  const progress = totalAmount ? (totalPaid / totalAmount) * 100 : 0;

  return (
    <PageWrapper>
      <Carousel>
        Bienvenue dans votre coffre 💰 — Paiement sécurisé — Numa vous protège
      </Carousel>

      <Section>
        <Title>Bonjour {user?.username}</Title>
        <p>{user?.email}</p>
        <DangerButton
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Se déconnecter
        </DangerButton>
      </Section>

      <Section>
        <Title>Votre Coffre</Title>
        <CoffreBox>
          <CoffreLine>
            <span>Montant payé</span>
            <strong>{totalPaid.toLocaleString()} FCFA</strong>
          </CoffreLine>

          <CoffreLine>
            <span>Montant restant</span>
            <strong>{(totalAmount - totalPaid).toLocaleString()} FCFA</strong>
          </CoffreLine>

          <CoffreProgressBar>
            <CoffreProgress percent={progress} />
          </CoffreProgressBar>

          {commandes.flatMap((c) =>
            c.modePaiement === "cod" ? (
              <CoffreLine key={c._id}>
                <CoffreLabel>
                  Commande #{c._id.slice(-6)} — Paiement à la livraison{" "}
                  {c.statusCommande === "DELIVERED" ? (
                    <>
                      <FaUnlock />
                      <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                        Payé
                      </span>
                    </>
                  ) : c.statusCommande === "CONFIRMED" ? (
                    <span style={{ color: "#22c55e" }}>Confirmée</span>
                  ) : (
                    <span style={{ color: "#fbbf24" }}>En attente</span>
                  )}
                </CoffreLabel>
              </CoffreLine>
            ) : (
              c.paiements.map((p) => {
                const paiementRecus = c.paiementsRecus?.find(
                  (pr) => pr.step === p.step,
                );

                return (
                  <CoffreLine key={`${c._id}-${p.step}`}>
                    <CoffreLabel>
                      Commande #{c._id.slice(-6)} — Étape {p.step}{" "}
                      {p.status === "PAID" ? (
                        <FaUnlock />
                      ) : paiementRecus?.status === "PENDING" ? (
                        <span style={{ color: "#fbbf24" }}>
                          En attente de confirmation
                        </span>
                      ) : paiementRecus?.status === "REJECTED" ? (
                        <span style={{ color: "#ef4444" }}>
                          Paiement rejeté
                        </span>
                      ) : (
                        <FaLock />
                      )}
                    </CoffreLabel>

                    {p.status !== "PAID" &&
                      (!paiementRecus ||
                        paiementRecus.status === "REJECTED") && (
                        <Button
                          onClick={() => navigate(`/paiement-semi/${c._id}`)}
                        >
                          Payer cette étape
                        </Button>
                      )}
                  </CoffreLine>
                );
              })
            ),
          )}
        </CoffreBox>
      </Section>

      <Section>
        <Title>Favoris</Title>
        <FlexRow>
          {favorites.map((f) => (
            <ProductCard key={f._id}>
              <ProductImage src={getMainImage(f.productId)} />
              <div style={{ flex: 1 }}>
                <p>{f.productId?.title}</p>
                <p>{f.productId?.price?.toLocaleString()} FCFA</p>
              </div>
              <TrashIcon
                size={20}
                onClick={async () => {
                  if (!token) return navigate("/login");
                  try {
                    const res = await fetch(
                      `${import.meta.env.VITE_API_URL}/api/favorites/${f._id}`,
                      {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      },
                    );

                    if (res.ok) {
                      // Supprime le favori de l'état pour mise à jour instantanée
                      setFavorites((prev) =>
                        prev.filter((fav) => fav._id !== f._id),
                      );
                    } else {
                      const data = await res.json();
                      console.error("Erreur suppression :", data.message);
                    }
                  } catch (err) {
                    console.error("Erreur réseau :", err);
                  }
                }}
              />
            </ProductCard>
          ))}
        </FlexRow>
      </Section>

      <Section>
        <Title>Commandes</Title>
        {commandes.map((c) => (
          <ProductCard key={c._id} style={{ flexDirection: "column" }}>
            <CommandHeader
              onClick={() => setExpanded((p) => ({ ...p, [c._id]: !p[c._id] }))}
            >
              <div>
                <p>Commande #{c._id.slice(-6)}</p>
                <p>Total: {c.total.toLocaleString()} FCFA</p>
              </div>
              {expanded[c._id] ? <FiChevronUp /> : <FiChevronDown />}
            </CommandHeader>

            {expanded[c._id] && (
              <CommandContent>
                {c.panier.map((p) => (
                  <div
                    key={p.produitId}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <ProductImage
                      src={
                        p.images?.[0]?.url ||
                        p.produitId?.images?.[0]?.url ||
                        "https://via.placeholder.com/80"
                      }
                    />
                    <div>
                      <Link to={`/produit/${p.produitId._id}`}>{p.nom}</Link>
                      <p>Qté: {p.quantite}</p>
                    </div>
                  </div>
                ))}
              </CommandContent>
            )}
          </ProductCard>
        ))}
      </Section>
    </PageWrapper>
  );
}
