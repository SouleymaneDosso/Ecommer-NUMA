import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaLock, FaUnlock } from "react-icons/fa";

// ===== LOADER =====
const spin = keyframes` to { transform: rotate(360deg); } `;
const LoaderWrapper = styled.div`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// ===== STYLES =====
const PageWrapper = styled.main`
  max-width: 950px;
  margin: 3rem auto;
  padding: 2rem;
  background: #1f1f2e;
  border-radius: 20px;
  font-family: "Inter", sans-serif;
  color: #f3f3f3;
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 2rem 1rem;
  }
`;

const Carousel = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background: #111;
  color: #fff;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  font-weight: 600;
  animation: scroll 15s linear infinite;
  
  @keyframes scroll {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`;

const Section = styled.section`
  background: #2a2a3d;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  transition: all 0.3s ease;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.6rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    transform: translateY(-1.5px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  }
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #f87171);
  &:hover { background: linear-gradient(135deg, #f87171, #ef4444); }
`;

const Message = styled.p`
  font-weight: 600;
  margin-top: 0.5rem;
  color: ${(props) => (props.type === "error" ? "#dc2626" : "#10b981")};
`;

const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ProductCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px;
  border-radius: 14px;
  background: #1f1f2e;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
  background-color: ${(props) =>
    props.statut === "en cours"
      ? "#f59e0b"
      : props.statut === "envoyé"
      ? "#3b82f6"
      : props.statut === "livré"
      ? "#10b981"
      : "#ef4444"};
  font-size: 0.8rem;
`;

const TrashIcon = styled(FiTrash2)`
  cursor: pointer;
  color: #ef4444;
  transition: color 0.2s;
  &:hover { color: #dc2626; }
`;

const CommandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const CommandContent = styled.div`
  max-height: ${({ open }) => (open ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const CoffreBox = styled.div`
  background: linear-gradient(145deg, #2a2a3d, #1f1f2e);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
  margin-bottom: 2rem;
  position: relative;
`;

const CoffreLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center;
`;

const CoffreProgressBar = styled.div`
  height: 12px;
  background: #3a3a5a;
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;
`;

const CoffreProgress = styled.div`
  height: 100%;
  width: ${(p) => p.percent}%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  transition: width 0.4s ease;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content:center;
  align-items: center;
  z-index:1000;
`;

const ModalContent = styled.div`
  background: #2a2a3d;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 1rem;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

// ===== COMPONENT =====
export default function CompteClient() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState("");

  const [expandedOrders, setExpandedOrders] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fetchCompte = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");
      setUser(data.user);
      setFavorites(data.favorites || []);
      setCommandes(data.commandes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if(token) fetchCompte(); }, [token]);

  const toggleOrder = (id) => setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  const removeFavorite = async (favId) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${favId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setFavorites(prev => prev.filter(f => f._id !== favId));
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };
  const getMainImage = (product) => product?.images?.find(img => img.isMain)?.url || product?.images?.[0]?.url || "https://via.placeholder.com/80";

  if (loading) return (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  );

  if (!token || !user) {
    return <PageWrapper>
      <Title>Connexion</Title>
      {error && <Message type="error">{error}</Message>}
    </PageWrapper>
  }

  // Coffre calcul
  const totalPaid = commandes.flatMap(c => c.paiements).filter(p => p.status === "PAID").reduce((a,b)=>a+b.amountExpected,0);
  const totalAmount = commandes.reduce((a,c)=>a+c.total,0);
  const progressPercent = (totalPaid/totalAmount)*100;

  return (
    <PageWrapper>
      <Carousel>
        Bienvenue dans votre coffre 💰 — Suivez vos paiements — Paiement sécurisé — Numa vous protège
      </Carousel>

      <Section>
        <Title>Bonjour {user.username}</Title>
        <p>Email : {user.email}</p>
        <DangerButton onClick={() => { localStorage.removeItem("token"); setUser(null); navigate("/compte"); }} style={{ marginTop:"1rem" }}>
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
            <CoffreProgress percent={progressPercent} />
          </CoffreProgressBar>

          {commandes.map(c => c.paiements.map(p => (
            <CoffreLine key={p._id}>
              <span>Commande {c._id} - Étape {p.step} {p.status === "PAID"?<FaUnlock/>:<FaLock/>}</span>
              {p.status !== "PAID" && <Button onClick={()=>navigate(`/paiement-semi/${c._id}`)}>Payer cette étape</Button>}
            </CoffreLine>
          )))}

          <Button style={{ marginTop:"1rem" }} onClick={()=>setShowModal(true)}>Comment ça marche ?</Button>
        </CoffreBox>
      </Section>

      <Section>
        <Title>Favoris</Title>
        {favorites.length === 0 ? <p>Aucun favori</p> : (
          <FlexRow>
            {favorites.map(f => (
              <ProductCard key={f._id}>
                <ProductImage src={getMainImage(f.productId)} alt={f.productId?.title || "Produit"} />
                <div style={{ flex:1 }}>
                  <p>{f.productId?.title || "—"}</p>
                  <p>{f.productId?.price?.toLocaleString() || "—"} FCFA</p>
                </div>
                <TrashIcon size={22} onClick={()=>removeFavorite(f._id)} />
              </ProductCard>
            ))}
          </FlexRow>
        )}
      </Section>

      <Section>
        <Title>Commandes</Title>
        {commandes.length === 0 ? <p>Aucune commande</p> : commandes.map(c => (
          <ProductCard key={c._id} style={{ flexDirection:"column" }}>
            <CommandHeader onClick={()=>toggleOrder(c._id)}>
              <div>
                <p>ID: {c._id}</p>
                <p>Total: {c.total.toLocaleString()} FCFA</p>
              </div>
              {expandedOrders[c._id]?<FiChevronUp/>:<FiChevronDown/>}
            </CommandHeader>
            <CommandContent open={expandedOrders[c._id]}>
              {c.produits.map(pr=>(
                <div key={pr.produitId?._id||Math.random()} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                  <ProductImage src={getMainImage(pr.produitId)} alt={pr.produitId?.title||"Produit"} />
                  <div>
                    <Link to={`/product/${pr.produitId?._id}`} style={{ fontWeight:600 }}>{pr.produitId?.title||"Produit supprimé"}</Link>
                    <p>Quantité: {pr.quantite}</p>
                    <p>Prix: {pr.produitId?.price?.toLocaleString()||"—"} FCFA</p>
                  </div>
                </div>
              ))}
            </CommandContent>
          </ProductCard>
        ))}
      </Section>

      {showModal && <ModalBackdrop onClick={()=>setShowModal(false)}>
        <ModalContent onClick={e=>e.stopPropagation()}>
          <h2>Comment fonctionne votre coffre ?</h2>
          <p>
            Chaque paiement est divisé en étapes. Vous pouvez voir le montant déjà payé et le montant restant. 
            Cliquez sur "Payer cette étape" pour continuer vos paiements. Une fois toutes les étapes payées, votre coffre est totalement ouvert et la livraison est possible.
          </p>
          <CloseButton onClick={()=>setShowModal(false)}>Fermer</CloseButton>
        </ModalContent>
      </ModalBackdrop>}
    </PageWrapper>
  );
}
