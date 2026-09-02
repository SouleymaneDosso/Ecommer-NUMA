import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";

import {
  FiUser,
  FiBell,
  FiLogOut,
  FiPackage,
  FiHeart,
  FiCreditCard,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiShoppingBag,
  FiArrowRight,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiMapPin,
} from "react-icons/fi";

import { toast } from "react-toastify";

import { socket } from "../../services/socket";

// ======================================================
// PAGE COMPTE CLIENT
// ======================================================

export default function CompteClient() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [favorites, setFavorites] = useState([]);

  const [commandes, setCommandes] = useState([]);

  const [expanded, setExpanded] = useState({});

  const [notifCount, setNotifCount] = useState(0);

  const audioRef = useRef(null);

  // ======================================================
  // AUDIO
  // ======================================================

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");

    audioRef.current.volume = 1;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    audioRef.current.play().catch((err) => {
      console.log("🔇 Son bloqué :", err);
    });
  };

  // ======================================================
  // UNLOCK AUDIO
  // ======================================================

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // ======================================================
  // AUTH
  // ======================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCompte();
  }, []);

  // ======================================================
  // SOCKET
  // ======================================================

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    const handleConnect = () => {
      console.log("🟢 Client connecté au socket");

      socket.emit("join_room", user._id);
    };

    // ====================================================
    // MISE À JOUR COMMANDE
    // ====================================================

    const handleUpdate = (data) => {
      console.log("📦 Update commande reçu :", data);

      setCommandes((prev) =>
        prev.map((cmd) => {
          if (cmd._id !== data.id) {
            return cmd;
          }

          return {
            ...cmd,

            livraison: {
              ...cmd.livraison,

              statut: data.statutLivraison || cmd.livraison?.statut,

              livreurId: data.livreurId || cmd.livraison?.livreurId,

              livreur: data.livreur || cmd.livraison?.livreur,
            },
          };
        }),
      );

      setNotifCount((prev) => prev + 1);

      // ==================================================
      // MESSAGE
      // ==================================================

      let message = "Mise à jour de votre commande";

      if (data.statutLivraison === "SEARCHING") {
        message = "🔎 Recherche d'un livreur...";
      }

      if (data.statutLivraison === "ACCEPTED") {
        message = "🚴 Un livreur a accepté votre commande";
      }

      if (data.statutLivraison === "PICKING_UP") {
        message = "📦 Votre livreur récupère votre commande";
      }

      if (data.statutLivraison === "IN_DELIVERY") {
        message = "🚚 Votre commande est en route";
      }

      if (data.statutLivraison === "DELIVERED") {
        message = "🎉 Votre commande a été livrée";
      }

      toast.success(message);

      playSound();
    };

    socket.on("connect", handleConnect);

    socket.on("commande_update", handleUpdate);

    if (socket.connected) {
      socket.emit("join_room", user._id);
    }

    return () => {
      socket.off("connect", handleConnect);

      socket.off("commande_update", handleUpdate);
    };
  }, [user?._id]);

  // ======================================================
  // FETCH COMPTE
  // ======================================================

  const fetchCompte = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erreur compte");
      }

      const data = await res.json();

      setUser(data.user);

      setFavorites(data.favorites || []);

      setCommandes(data.commandes || []);
    } catch (error) {
      console.error(error);

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SUPPRIMER FAVORI
  // ======================================================

  const removeFavorite = async (favoriteId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/favorites/${favoriteId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));

        toast.success("Retiré des favoris");
      } else {
        toast.error("Impossible de supprimer ce favori");
      }
    } catch (error) {
      console.error(error);

      toast.error("Une erreur est survenue");
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  // ======================================================
  // TOTAL PAYÉ
  // ======================================================

  const totalPaid = commandes.reduce((total, c) => {
    if (c.modePaiement === "cod") {
      return total + (c.statusCommande === "DELIVERED" ? c.total : 0);
    }

    const paid = (c.paiements || [])
      .filter((p) => p.status === "PAID")
      .reduce((sum, payment) => sum + Number(payment.amountExpected || 0), 0);

    return total + paid;
  }, 0);

  // ======================================================
  // TOTAL COMMANDES
  // ======================================================

  const totalAmount = commandes.reduce(
    (total, c) => total + Number(c.total || 0),
    0,
  );

  // ======================================================
  // RESTANT
  // ======================================================

  const remaining = Math.max(0, totalAmount - totalPaid);

  // ======================================================
  // PROGRESSION
  // ======================================================

  const progress = totalAmount
    ? Math.min(100, (totalPaid / totalAmount) * 100)
    : 0;

  // ======================================================
  // STATUS LIVRAISON
  // ======================================================

  const getStatus = (status) => {
    if (status === "DELIVERED") {
      return {
        label: "Livrée",
        type: "success",
        icon: <FiCheckCircle />,
      };
    }

    if (status === "IN_DELIVERY") {
      return {
        label: "En livraison",
        type: "blue",
        icon: <FiTruck />,
      };
    }

    if (status === "PICKING_UP") {
      return {
        label: "Récupération",
        type: "blue",
        icon: <FiPackage />,
      };
    }

    if (status === "ACCEPTED") {
      return {
        label: "Livreur attribué",
        type: "success",
        icon: <FiCheckCircle />,
      };
    }

    if (status === "SEARCHING") {
      return {
        label: "Recherche d'un livreur",
        type: "warning",
        icon: <FiClock />,
      };
    }

    if (status === "NOT_STARTED") {
      return {
        label: "En attente",
        type: "warning",
        icon: <FiClock />,
      };
    }

    if (status === "CANCELLED") {
      return {
        label: "Annulée",
        type: "danger",
        icon: <FiClock />,
      };
    }

    return {
      label: "En cours",
      type: "warning",
      icon: <FiClock />,
    };
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <Page>
      <Container>
        {/* =================================================
            HEADER
        ================================================= */}

        <Header>
          <HeaderLeft>
            <WelcomeLabel>
              <FiUser />
              Espace personnel
            </WelcomeLabel>

            <Title>Bonjour {user?.username || "vous"} 👋</Title>

            <Email>{user?.email}</Email>
          </HeaderLeft>

          <HeaderActions>
            <NotificationButton>
              <FiBell />

              {notifCount > 0 && (
                <NotificationBadge>
                  {notifCount > 99 ? "99+" : notifCount}
                </NotificationBadge>
              )}
            </NotificationButton>

            <LogoutButton onClick={logout}>
              <FiLogOut />
              Déconnexion
            </LogoutButton>
          </HeaderActions>
        </Header>

        {/* =================================================
            STATS
        ================================================= */}

        <StatsGrid>
          <StatCard>
            <StatTop>
              <StatLabel>Commandes</StatLabel>

              <StatIcon>
                <FiPackage />
              </StatIcon>
            </StatTop>

            <StatValue>{commandes.length}</StatValue>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Favoris</StatLabel>

              <StatIcon>
                <FiHeart />
              </StatIcon>
            </StatTop>

            <StatValue>{favorites.length}</StatValue>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Total dépensé</StatLabel>

              <StatIcon>
                <FiCreditCard />
              </StatIcon>
            </StatTop>

            <StatValue>{totalPaid.toLocaleString("fr-FR")} FCFA</StatValue>
          </StatCard>
        </StatsGrid>

        {/* =================================================
            COFFRE
        ================================================= */}

        <Section>
          <SectionHeader>
            <SectionTitleWrap>
              <SectionEyebrow>Suivi financier</SectionEyebrow>

              <SectionTitle>Mon coffre</SectionTitle>

              <SectionDescription>
                Suivez simplement le montant payé et le montant restant sur vos
                commandes.
              </SectionDescription>
            </SectionTitleWrap>
          </SectionHeader>

          <CoffreBox>
            <CoffreHeader>
              <CoffreAmount>
                <span>Montant payé</span>

                <strong>{totalPaid.toLocaleString("fr-FR")} FCFA</strong>
              </CoffreAmount>

              <CoffreRemaining>
                <span>Montant restant</span>

                <strong>{remaining.toLocaleString("fr-FR")} FCFA</strong>
              </CoffreRemaining>
            </CoffreHeader>

            <ProgressInfo>
              <span>Progression</span>

              <strong>{Math.round(progress)}%</strong>
            </ProgressInfo>

            <ProgressBar>
              <Progress $percent={progress} />
            </ProgressBar>
          </CoffreBox>
        </Section>

        {/* =================================================
            FAVORIS
        ================================================= */}

        <Section>
          <SectionHeader>
            <SectionTitleWrap>
              <SectionEyebrow>Votre sélection</SectionEyebrow>

              <SectionTitle>Mes favoris</SectionTitle>

              <SectionDescription>
                Les pièces que vous avez gardées de côté.
              </SectionDescription>
            </SectionTitleWrap>
          </SectionHeader>

          {favorites.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FiHeart />
              </EmptyIcon>

              <div>Vous n'avez encore aucun favori.</div>

              <ShopLink to="/collections">
                Découvrir la collection
                <FiArrowRight />
              </ShopLink>
            </EmptyState>
          ) : (
            <FavoritesGrid>
              {favorites.map((favorite) => {
                const product = favorite.productId;

                const image =
                  product?.images?.[0]?.url ||
                  "https://via.placeholder.com/300x400";

                return (
                  <FavoriteCard key={favorite._id}>
                    <FavoriteImage
                      src={image}
                      alt={product?.title || "Produit"}
                    />

                    <FavoriteInfo>
                      <FavoriteLink to={`/produit/${product?._id}`}>
                        {product?.title || "Produit"}
                      </FavoriteLink>

                      <FavoritePrice>
                        {product?.price
                          ? `${product.price.toLocaleString("fr-FR")} FCFA`
                          : "Prix indisponible"}
                      </FavoritePrice>
                    </FavoriteInfo>

                    <DeleteButton
                      type="button"
                      aria-label="Supprimer des favoris"
                      onClick={() => removeFavorite(favorite._id)}
                    >
                      <FiTrash2 />
                    </DeleteButton>
                  </FavoriteCard>
                );
              })}
            </FavoritesGrid>
          )}
        </Section>

        {/* =================================================
            COMMANDES
        ================================================= */}

        <Section>
          <SectionHeader>
            <SectionTitleWrap>
              <SectionEyebrow>Historique</SectionEyebrow>

              <SectionTitle>Mes commandes</SectionTitle>

              <SectionDescription>
                Consultez le statut, le contenu et le suivi de chacune de vos
                commandes.
              </SectionDescription>
            </SectionTitleWrap>
          </SectionHeader>

          {commandes.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FiShoppingBag />
              </EmptyIcon>

              <div>Vous n'avez encore passé aucune commande.</div>

              <ShopLink to="/collections">
                Commencer mes achats
                <FiArrowRight />
              </ShopLink>
            </EmptyState>
          ) : (
            <OrdersList>
              {commandes.map((commande) => {
                const statut = commande.livraison?.statut || "NOT_STARTED";

                const status = getStatus(statut);

                const isOpen = expanded[commande._id];

                const hasLivreur = Boolean(commande.livraison?.livreurId);

                return (
                  <OrderCard key={commande._id}>
                    {/* ==========================
                          HEADER COMMANDE
                      ========================== */}

                    <OrderHeader
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,

                          [commande._id]: !prev[commande._id],
                        }))
                      }
                    >
                      <OrderMain>
                        <OrderNumber>
                          Commande #{commande._id.slice(-6).toUpperCase()}
                        </OrderNumber>

                        <OrderDate>
                          {commande.createdAt
                            ? new Date(commande.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                },
                              )
                            : "Date indisponible"}
                        </OrderDate>
                      </OrderMain>

                      <OrderRight>
                        <OrderTotal>
                          {Number(commande.total || 0).toLocaleString("fr-FR")}{" "}
                          FCFA
                        </OrderTotal>

                        <StatusBadge $type={status.type}>
                          {status.icon}

                          {status.label}
                        </StatusBadge>

                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </OrderRight>
                    </OrderHeader>

                    {/* ==========================
                          DETAILS
                      ========================== */}

                    {isOpen && (
                      <OrderDetailsWrapper>
                        <OrderDetails>
                          {(commande.panier || []).map((p, index) => {
                            const image =
                              p.images?.[0]?.url ||
                              p.produitId?.images?.[0]?.url ||
                              "https://via.placeholder.com/100";

                            return (
                              <OrderProduct
                                key={
                                  p.produitId?._id || `${commande._id}-${index}`
                                }
                              >
                                <OrderProductImage
                                  src={image}
                                  alt={p.nom || p.produitId?.title || "Produit"}
                                />

                                <OrderProductInfo>
                                  <OrderProductLink
                                    to={`/produit/${p.produitId?._id}`}
                                  >
                                    {p.nom || p.produitId?.title || "Produit"}
                                  </OrderProductLink>

                                  <Quantity>
                                    Quantité : {p.quantite || 1}
                                  </Quantity>
                                </OrderProductInfo>
                              </OrderProduct>
                            );
                          })}
                        </OrderDetails>

                        {/* ==========================
                              SUIVI
                          ========================== */}

                        <TrackingAction>
                          <TrackingActionInfo>
                            <TrackingActionIcon $active={hasLivreur}>
                              {hasLivreur ? <FiTruck /> : <FiMapPin />}
                            </TrackingActionIcon>

                            <div>
                              <TrackingActionTitle>
                                {hasLivreur
                                  ? "Votre livraison est en cours"
                                  : "Suivre votre commande"}
                              </TrackingActionTitle>

                              <TrackingActionText>
                                {hasLivreur
                                  ? "Consultez la position de votre livreur en temps réel."
                                  : "Consultez l'état actuel de votre commande."}
                              </TrackingActionText>
                            </div>
                          </TrackingActionInfo>

                          <TrackButton
                            type="button"
                            onClick={() =>
                              navigate(`/suivi-commande/${commande._id}`)
                            }
                          >
                            {hasLivreur ? "Suivre" : "Voir le suivi"}

                            <FiArrowRight />
                          </TrackButton>
                        </TrackingAction>
                      </OrderDetailsWrapper>
                    )}
                  </OrderCard>
                );
              })}
            </OrdersList>
          )}
        </Section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <AccountFooter>Votre espace personnel NUMA</AccountFooter>
      </Container>
    </Page>
  );
}

// ======================================================
// STYLES
// ======================================================

const Page = styled.div`
  min-height: 100vh;

  background: #f5f5f7;

  color: #111;

  padding: 40px 0 80px;
`;

const Container = styled.div`
  width: min(1180px, 92%);

  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  margin-bottom: 40px;

  @media (max-width: 700px) {
    flex-direction: column;

    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div``;

const WelcomeLabel = styled.div`
  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  color: #777;

  margin-bottom: 10px;
`;

const Title = styled.h1`
  margin: 0;

  font-size: clamp(30px, 4vw, 48px);

  line-height: 1.05;

  letter-spacing: -0.04em;
`;

const Email = styled.div`
  margin-top: 10px;

  color: #777;

  font-size: 14px;
`;

const HeaderActions = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;
`;

const NotificationButton = styled.button`
  position: relative;

  width: 46px;

  height: 46px;

  border: 1px solid #e8e8e8;

  border-radius: 14px;

  background: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 18px;

  cursor: pointer;
`;

const NotificationBadge = styled.span`
  position: absolute;

  top: -5px;

  right: -5px;

  min-width: 19px;

  height: 19px;

  padding: 0 5px;

  border-radius: 999px;

  background: #111;

  color: white;

  font-size: 10px;

  font-weight: 800;

  display: flex;

  align-items: center;

  justify-content: center;
`;

const LogoutButton = styled.button`
  border: 0;

  border-radius: 14px;

  padding: 13px 17px;

  background: #111;

  color: white;

  display: flex;

  align-items: center;

  gap: 8px;

  font-weight: 700;

  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 16px;

  margin-bottom: 55px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;

  border-radius: 22px;

  padding: 22px;

  border: 1px solid #eeeeee;
`;

const StatTop = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;
`;

const StatLabel = styled.div`
  color: #777;

  font-size: 13px;

  font-weight: 600;
`;

const StatIcon = styled.div`
  width: 40px;

  height: 40px;

  border-radius: 13px;

  background: #f3f3f3;

  display: flex;

  align-items: center;

  justify-content: center;
`;

const StatValue = styled.div`
  margin-top: 22px;

  font-size: 26px;

  font-weight: 800;

  letter-spacing: -0.03em;
`;

const Section = styled.section`
  margin-bottom: 55px;
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const SectionTitleWrap = styled.div``;

const SectionEyebrow = styled.div`
  color: #888;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.13em;

  text-transform: uppercase;

  margin-bottom: 7px;
`;

const SectionTitle = styled.h2`
  margin: 0;

  font-size: 27px;

  letter-spacing: -0.03em;
`;

const SectionDescription = styled.p`
  margin: 8px 0 0;

  color: #777;

  font-size: 14px;

  max-width: 650px;

  line-height: 1.6;
`;

const CoffreBox = styled.div`
  background: #111;

  color: white;

  border-radius: 25px;

  padding: 28px;
`;

const CoffreHeader = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 30px;

  margin-bottom: 30px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CoffreAmount = styled.div`
  display: flex;

  flex-direction: column;

  gap: 7px;

  span {
    color: #aaa;

    font-size: 12px;
  }

  strong {
    font-size: 25px;
  }
`;

const CoffreRemaining = styled(CoffreAmount)`
  text-align: right;

  @media (max-width: 600px) {
    text-align: left;
  }
`;

const ProgressInfo = styled.div`
  display: flex;

  justify-content: space-between;

  color: #aaa;

  font-size: 12px;

  margin-bottom: 9px;

  strong {
    color: white;
  }
`;

const ProgressBar = styled.div`
  height: 8px;

  background: #333;

  border-radius: 999px;

  overflow: hidden;
`;

const Progress = styled.div`
  width: ${({ $percent }) => $percent}%;

  height: 100%;

  background: white;

  border-radius: inherit;

  transition: width 0.5s ease;
`;

const EmptyState = styled.div`
  background: white;

  border: 1px solid #eeeeee;

  border-radius: 22px;

  padding: 35px;

  text-align: center;

  color: #777;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 14px;
`;

const EmptyIcon = styled.div`
  width: 50px;

  height: 50px;

  border-radius: 16px;

  background: #f3f3f3;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 21px;

  color: #111;
`;

const ShopLink = styled(Link)`
  color: #111;

  font-weight: 800;

  text-decoration: none;

  display: flex;

  align-items: center;

  gap: 7px;
`;

const FavoritesGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 16px;

  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;

const FavoriteCard = styled.div`
  position: relative;

  background: white;

  border-radius: 20px;

  overflow: hidden;

  border: 1px solid #eeeeee;
`;

const FavoriteImage = styled.img`
  width: 100%;

  height: 220px;

  object-fit: cover;

  display: block;
`;

const FavoriteInfo = styled.div`
  padding: 16px;
`;

const FavoriteLink = styled(Link)`
  color: #111;

  font-weight: 800;

  text-decoration: none;

  font-size: 14px;
`;

const FavoritePrice = styled.div`
  margin-top: 7px;

  color: #777;

  font-size: 13px;
`;

const DeleteButton = styled.button`
  position: absolute;

  top: 12px;

  right: 12px;

  width: 38px;

  height: 38px;

  border: 0;

  border-radius: 12px;

  background: rgba(255, 255, 255, 0.94);

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;
`;

const OrdersList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 12px;
`;

const OrderCard = styled.div`
  background: white;

  border: 1px solid #eeeeee;

  border-radius: 21px;

  overflow: hidden;
`;

const OrderHeader = styled.button`
  width: 100%;

  border: 0;

  background: transparent;

  padding: 20px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  text-align: left;

  cursor: pointer;

  color: #111;

  @media (max-width: 650px) {
    align-items: flex-start;
  }
`;

const OrderMain = styled.div`
  min-width: 0;
`;

const OrderNumber = styled.div`
  font-weight: 800;

  font-size: 15px;
`;

const OrderDate = styled.div`
  margin-top: 6px;

  color: #888;

  font-size: 12px;
`;

const OrderRight = styled.div`
  display: flex;

  align-items: center;

  gap: 12px;

  flex-wrap: wrap;

  justify-content: flex-end;
`;

const OrderTotal = styled.div`
  font-weight: 800;

  font-size: 14px;
`;

const StatusBadge = styled.div`
  display: flex;

  align-items: center;

  gap: 6px;

  padding: 8px 11px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 800;

  background: ${({ $type }) => {
    if ($type === "success") {
      return "#eaf8ef";
    }

    if ($type === "blue") {
      return "#edf5ff";
    }

    if ($type === "danger") {
      return "#fff0f0";
    }

    return "#fff7df";
  }};

  color: ${({ $type }) => {
    if ($type === "success") {
      return "#18733a";
    }

    if ($type === "blue") {
      return "#2467a8";
    }

    if ($type === "danger") {
      return "#b42318";
    }

    return "#8a6500";
  }};
`;

const OrderDetailsWrapper = styled.div`
  padding: 0 20px 20px;

  border-top: 1px solid #eeeeee;
`;

const OrderDetails = styled.div`
  padding-top: 16px;

  display: flex;

  flex-direction: column;

  gap: 10px;
`;

const OrderProduct = styled.div`
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 10px;

  background: #f8f8f8;

  border-radius: 15px;
`;

const OrderProductImage = styled.img`
  width: 58px;

  height: 58px;

  border-radius: 12px;

  object-fit: cover;
`;

const OrderProductInfo = styled.div`
  min-width: 0;

  flex: 1;
`;

const OrderProductLink = styled(Link)`
  color: #111;

  text-decoration: none;

  font-weight: 800;

  font-size: 14px;

  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
`;

const Quantity = styled.div`
  margin-top: 5px;

  color: #888;

  font-size: 12px;
`;

/* ======================================================
   BLOC SUIVI
====================================================== */

const TrackingAction = styled.div`
  margin-top: 16px;

  padding: 17px;

  border-radius: 18px;

  background: #111;

  color: white;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 18px;

  @media (max-width: 650px) {
    flex-direction: column;

    align-items: stretch;
  }
`;

const TrackingActionInfo = styled.div`
  display: flex;

  align-items: center;

  gap: 13px;
`;

const TrackingActionIcon = styled.div`
  flex: 0 0 auto;

  width: 43px;

  height: 43px;

  border-radius: 14px;

  background: ${({ $active }) => ($active ? "#fff" : "#292929")};

  color: ${({ $active }) => ($active ? "#111" : "#fff")};

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 18px;
`;

const TrackingActionTitle = styled.div`
  font-weight: 800;

  font-size: 13px;
`;

const TrackingActionText = styled.div`
  margin-top: 4px;

  color: #aaa;

  font-size: 11px;

  line-height: 1.4;
`;

const TrackButton = styled.button`
  flex: 0 0 auto;

  border: 0;

  border-radius: 13px;

  padding: 12px 15px;

  background: white;

  color: #111;

  font-weight: 800;

  font-size: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);

    opacity: 0.9;
  }
`;

const AccountFooter = styled.footer`
  text-align: center;

  color: #999;

  font-size: 12px;

  padding-top: 20px;
`;

const LoaderWrapper = styled.div`
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #f5f5f7;
`;

const Loader = styled.div`
  width: 42px;

  height: 42px;

  border: 4px solid #ddd;

  border-top-color: #111;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
