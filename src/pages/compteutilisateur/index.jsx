// import { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";

// import {
//   FiUser,
//   FiBell,
//   FiLogOut,
//   FiPackage,
//   FiHeart,
//   FiCreditCard,
//   FiCheckCircle,
//   FiTruck,
//   FiClock,
//   FiShoppingBag,
//   FiArrowRight,
//   FiTrash2,
//   FiChevronUp,
//   FiChevronDown,
//   FiMapPin,
//   FiSmartphone,
//   FiHash,
// } from "react-icons/fi";

// import { toast } from "react-toastify";

// import { socket } from "../../services/socket";

// // ======================================================
// // PAGE COMPTE CLIENT
// // ======================================================

// export default function CompteClient() {
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   const [loading, setLoading] = useState(false);

//   const [user, setUser] = useState(null);

//   const [favorites, setFavorites] = useState([]);

//   const [commandes, setCommandes] = useState([]);

//   const [precommandes, setPrecommandes] = useState([]);

//   const [expanded, setExpanded] = useState({});

//   const [expandedPrecommandes, setExpandedPrecommandes] = useState({});

//   const [notifCount, setNotifCount] = useState(0);
//   const [soldeForm, setSoldeForm] = useState({});
//   const [payingSolde, setPayingSolde] = useState({});

//   const audioRef = useRef(null);

//   // ======================================================
//   // AUDIO
//   // ======================================================

//   useEffect(() => {
//     audioRef.current = new Audio("/notification.mp3");

//     audioRef.current.volume = 1;

//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }
//     };
//   }, []);

//   const playSound = () => {
//     if (!audioRef.current) return;

//     audioRef.current.currentTime = 0;

//     audioRef.current.play().catch((err) => {
//       console.log("🔇 Son bloqué :", err);
//     });
//   };

//   // ======================================================
//   // UNLOCK AUDIO
//   // ======================================================

//   useEffect(() => {
//     const unlockAudio = () => {
//       if (!audioRef.current) return;

//       audioRef.current
//         .play()
//         .then(() => {
//           audioRef.current.pause();
//           audioRef.current.currentTime = 0;
//         })
//         .catch(() => {});

//       window.removeEventListener("click", unlockAudio);
//     };

//     window.addEventListener("click", unlockAudio);

//     return () => {
//       window.removeEventListener("click", unlockAudio);
//     };
//   }, []);

//   // ======================================================
//   // AUTH
//   // ======================================================

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     fetchCompte();
//   }, []);

//   // ======================================================
//   // SOCKET
//   // ======================================================

//   useEffect(() => {
//     if (!user?._id) return;

//     socket.connect();

//     const handleConnect = () => {
//       console.log("🟢 Client connecté au socket");

//       socket.emit("join_room", user._id);
//     };

//     const handleUpdate = (data) => {
//       console.log("📦 Update commande reçu :", data);

//       setCommandes((prev) =>
//         prev.map((cmd) => {
//           if (cmd._id !== data.id) {
//             return cmd;
//           }

//           return {
//             ...cmd,

//             livraison: {
//               ...cmd.livraison,

//               statut: data.statutLivraison || cmd.livraison?.statut,

//               livreurId: data.livreurId || cmd.livraison?.livreurId,

//               livreur: data.livreur || cmd.livraison?.livreur,
//             },
//           };
//         }),
//       );

//       setNotifCount((prev) => prev + 1);

//       let message = "Mise à jour de votre commande";

//       if (data.statutLivraison === "SEARCHING") {
//         message = "🔎 Recherche d'un livreur...";
//       }

//       if (data.statutLivraison === "ACCEPTED") {
//         message = "🚴 Un livreur a accepté votre commande";
//       }

//       if (data.statutLivraison === "PICKING_UP") {
//         message = "📦 Votre livreur récupère votre commande";
//       }

//       if (data.statutLivraison === "IN_DELIVERY") {
//         message = "🚚 Votre commande est en route";
//       }

//       if (data.statutLivraison === "DELIVERED") {
//         message = "🎉 Votre commande a été livrée";
//       }

//       toast.success(message);

//       playSound();
//     };

//     socket.on("connect", handleConnect);

//     socket.on("commande_update", handleUpdate);

//     if (socket.connected) {
//       socket.emit("join_room", user._id);
//     }

//     return () => {
//       socket.off("connect", handleConnect);

//       socket.off("commande_update", handleUpdate);
//     };
//   }, [user?._id]);

//   // ======================================================
//   // FETCH COMPTE
//   // ======================================================

//   const fetchCompte = async () => {
//     setLoading(true);

//     try {
//       // ----------------------------------------------
//       // COMPTE
//       // ----------------------------------------------

//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/compte`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Erreur compte");
//       }

//       const data = await res.json();

//       setUser(data.user);

//       setFavorites(data.favorites || []);

//       setCommandes(data.commandes || []);

//       // ----------------------------------------------
//       // PRÉCOMMANDES
//       // ----------------------------------------------

//       const precommandeRes = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/precommandes/mes`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!precommandeRes.ok) {
//         throw new Error("Erreur précommandes");
//       }

//       const precommandeData = await precommandeRes.json();

//       setPrecommandes(
//         Array.isArray(precommandeData?.precommandes)
//           ? precommandeData.precommandes.filter(
//               (precommande) => precommande.statut !== "FINALIZED",
//             )
//           : [],
//       );
//     } catch (error) {
//       console.error("❌ Erreur compte :", error);

//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // SUPPRIMER FAVORI
//   // ======================================================

//   const removeFavorite = async (favoriteId) => {
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/favorites/${favoriteId}`,
//         {
//           method: "DELETE",

//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (res.ok) {
//         setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));

//         toast.success("Retiré des favoris");
//       } else {
//         toast.error("Impossible de supprimer ce favori");
//       }
//     } catch (error) {
//       console.error(error);

//       toast.error("Une erreur est survenue");
//     }
//   };

//   // ======================================================
//   // LOGOUT
//   // ======================================================

//   const logout = () => {
//     localStorage.removeItem("token");

//     navigate("/login");
//   };

//   // ======================================================
//   // TOTAL PAYÉ
//   // ======================================================

//   const totalPaid = commandes.reduce((total, c) => {
//     if (c.modePaiement === "cod") {
//       return total + (c.statusCommande === "DELIVERED" ? c.total : 0);
//     }

//     const paid = (c.paiements || [])
//       .filter((p) => p.status === "PAID")
//       .reduce((sum, payment) => sum + Number(payment.amountExpected || 0), 0);

//     return total + paid;
//   }, 0);

//   // ======================================================
//   // TOTAL COMMANDES
//   // ======================================================

//   const totalAmount = commandes.reduce(
//     (total, c) => total + Number(c.total || 0),
//     0,
//   );

//   // ======================================================
//   // PAIEMENTS PRÉCOMMANDE
//   // ======================================================

//   const getPaiementDepot = (precommande) => {
//     return (
//       precommande?.paiements?.find((paiement) => paiement.type === "DEPOT") ||
//       null
//     );
//   };

//   const getPaiementSolde = (precommande) => {
//     const paiements = precommande?.paiements || [];

//     return (
//       [...paiements].reverse().find((paiement) => paiement.type === "SOLDE") ||
//       null
//     );
//   };

//   const getServiceDepot = (precommande) => {
//     return getPaiementDepot(precommande)?.service || "";
//   };

//   const getNumeroDepot = (precommande) => {
//     return getPaiementDepot(precommande)?.numeroClient || "";
//   };

//   const getReferenceDepot = (precommande) => {
//     return getPaiementDepot(precommande)?.reference || "";
//   };

//   const getStatutDepot = (precommande) => {
//     return getPaiementDepot(precommande)?.status || "";
//   };

//   const getStatutSolde = (precommande) => {
//     return getPaiementSolde(precommande)?.status || "";
//   };

//   // ======================================================
//   // RESTANT
//   // ======================================================

//   const remaining = Math.max(0, totalAmount - totalPaid);

//   // ======================================================
//   // PROGRESSION
//   // ======================================================

//   const progress = totalAmount
//     ? Math.min(100, (totalPaid / totalAmount) * 100)
//     : 0;

//   // ======================================================
//   // STATUS LIVRAISON
//   // ======================================================

//   const getStatus = (status) => {
//     if (status === "DELIVERED") {
//       return {
//         label: "Livrée",
//         type: "success",
//         icon: <FiCheckCircle />,
//       };
//     }

//     if (status === "IN_DELIVERY") {
//       return {
//         label: "En livraison",
//         type: "blue",
//         icon: <FiTruck />,
//       };
//     }

//     if (status === "PICKING_UP") {
//       return {
//         label: "Récupération",
//         type: "blue",
//         icon: <FiPackage />,
//       };
//     }

//     if (status === "ACCEPTED") {
//       return {
//         label: "Livreur attribué",
//         type: "success",
//         icon: <FiCheckCircle />,
//       };
//     }

//     if (status === "SEARCHING") {
//       return {
//         label: "Recherche d'un livreur",
//         type: "warning",
//         icon: <FiClock />,
//       };
//     }

//     if (status === "NOT_STARTED") {
//       return {
//         label: "En attente",
//         type: "warning",
//         icon: <FiClock />,
//       };
//     }

//     if (status === "CANCELLED") {
//       return {
//         label: "Annulée",
//         type: "danger",
//         icon: <FiClock />,
//       };
//     }

//     return {
//       label: "En cours",
//       type: "warning",
//       icon: <FiClock />,
//     };
//   };

//   // ======================================================
//   // STATUS PRÉCOMMANDE
//   // ======================================================

//   const getPrecommandeStatus = (statut) => {
//     if (statut === "ACCEPTED") {
//       return {
//         label: "Confirmée",
//         type: "success",
//         icon: <FiCheckCircle />,
//       };
//     }

//     if (statut === "REJECTED") {
//       return {
//         label: "Refusée",
//         type: "danger",
//         icon: <FiClock />,
//       };
//     }

//     return {
//       label: "En attente",
//       type: "warning",
//       icon: <FiClock />,
//     };
//   };

//   // ======================================================
//   // PAYER LE SOLDE D'UNE PRÉCOMMANDE
//   // ======================================================

//   const payerSolde = async (precommande) => {
//     const form = soldeForm[precommande._id] || {};

//     const service = form.service?.trim();
//     const numeroClient = form.numeroClient?.trim();
//     const reference = form.reference?.trim();

//     const montantEnvoye = Number(
//       form.montantEnvoye ?? precommande.montantSolde ?? 0,
//     );

//     if (!service) {
//       toast.error("Sélectionnez un service de paiement.");
//       return;
//     }

//     if (!numeroClient) {
//       toast.error("Veuillez renseigner votre numéro.");
//       return;
//     }

//     if (!reference) {
//       toast.error("Veuillez renseigner la référence du paiement.");
//       return;
//     }

//     if (!montantEnvoye || montantEnvoye <= 0) {
//       toast.error("Montant du solde invalide.");
//       return;
//     }

//     if (montantEnvoye !== Number(precommande.montantSolde || 0)) {
//       toast.error(
//         `Le montant attendu est de ${Number(
//           precommande.montantSolde || 0,
//         ).toLocaleString("fr-FR")} FCFA.`,
//       );
//       return;
//     }

//     setPayingSolde((prev) => ({
//       ...prev,
//       [precommande._id]: true,
//     }));

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/precommandes/${precommande._id}/payer-solde`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             service,
//             numeroClient,
//             reference,
//             montantEnvoye,
//           }),
//         },
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(
//           data?.message || "Impossible d'envoyer le paiement du solde.",
//         );
//       }

//       setPrecommandes((prev) =>
//         prev.map((item) =>
//           item._id === precommande._id ? data.precommande || item : item,
//         ),
//       );

//       toast.success(
//         data.message ||
//           "Paiement du solde envoyé. Il est maintenant en attente de vérification.",
//       );
//     } catch (error) {
//       console.error("❌ Paiement solde :", error);

//       toast.error(error.message || "Une erreur est survenue lors du paiement.");
//     } finally {
//       setPayingSolde((prev) => ({
//         ...prev,
//         [precommande._id]: false,
//       }));
//     }
//   };

//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (loading) {
//     return (
//       <LoaderWrapper>
//         <Loader />
//       </LoaderWrapper>
//     );
//   }

//   // ======================================================
//   // RENDER
//   // ======================================================

//   return (
//     <Page>
//       <Container>
//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <Header>
//           <HeaderLeft>
//             <WelcomeLabel>
//               <FiUser />
//               Espace personnel
//             </WelcomeLabel>

//             <Title>Bonjour {user?.username || "vous"} 👋</Title>

//             <Email>{user?.email}</Email>
//           </HeaderLeft>

//           <HeaderActions>
//             <NotificationButton>
//               <FiBell />

//               {notifCount > 0 && (
//                 <NotificationBadge>
//                   {notifCount > 99 ? "99+" : notifCount}
//                 </NotificationBadge>
//               )}
//             </NotificationButton>

//             <LogoutButton onClick={logout}>
//               <FiLogOut />
//               Déconnexion
//             </LogoutButton>
//           </HeaderActions>
//         </Header>

//         {/* =================================================
//             STATS
//         ================================================= */}

//         <StatsGrid>
//           <StatCard>
//             <StatTop>
//               <StatLabel>Commandes</StatLabel>

//               <StatIcon>
//                 <FiPackage />
//               </StatIcon>
//             </StatTop>

//             <StatValue>{commandes.length}</StatValue>
//           </StatCard>

//           <StatCard>
//             <StatTop>
//               <StatLabel>Précommandes</StatLabel>

//               <StatIcon>
//                 <FiClock />
//               </StatIcon>
//             </StatTop>

//             <StatValue>{precommandes.length}</StatValue>
//           </StatCard>

//           <StatCard>
//             <StatTop>
//               <StatLabel>Favoris</StatLabel>

//               <StatIcon>
//                 <FiHeart />
//               </StatIcon>
//             </StatTop>

//             <StatValue>{favorites.length}</StatValue>
//           </StatCard>
//         </StatsGrid>

//         {/* =================================================
//             COFFRE
//         ================================================= */}

//         <Section>
//           <SectionHeader>
//             <SectionTitleWrap>
//               <SectionEyebrow>Suivi financier</SectionEyebrow>

//               <SectionTitle>Mon coffre</SectionTitle>

//               <SectionDescription>
//                 Suivez simplement le montant payé et le montant restant sur vos
//                 commandes.
//               </SectionDescription>
//             </SectionTitleWrap>
//           </SectionHeader>

//           <CoffreBox>
//             <CoffreHeader>
//               <CoffreAmount>
//                 <span>Montant payé</span>

//                 <strong>{totalPaid.toLocaleString("fr-FR")} FCFA</strong>
//               </CoffreAmount>

//               <CoffreRemaining>
//                 <span>Montant restant</span>

//                 <strong>{remaining.toLocaleString("fr-FR")} FCFA</strong>
//               </CoffreRemaining>
//             </CoffreHeader>

//             <ProgressInfo>
//               <span>Progression</span>

//               <strong>{Math.round(progress)}%</strong>
//             </ProgressInfo>

//             <ProgressBar>
//               <Progress $percent={progress} />
//             </ProgressBar>
//           </CoffreBox>
//         </Section>

//         {/* =================================================
//             PRÉCOMMANDES
//         ================================================= */}

//         <Section>
//           <SectionHeader>
//             <SectionTitleWrap>
//               <SectionEyebrow>Réservations</SectionEyebrow>

//               <SectionTitle>Mes précommandes</SectionTitle>

//               <SectionDescription>
//                 Retrouvez ici les modèles que vous avez précommandés ainsi que
//                 les informations de votre dépôt.
//               </SectionDescription>
//             </SectionTitleWrap>
//           </SectionHeader>

//           {precommandes.length === 0 ? (
//             <EmptyState>
//               <EmptyIcon>
//                 <FiClock />
//               </EmptyIcon>

//               <div>Vous n'avez encore aucune précommande.</div>

//               <ShopLink to="/precommande">
//                 Découvrir les précommandes
//                 <FiArrowRight />
//               </ShopLink>
//             </EmptyState>
//           ) : (
//             <PrecommandesList>
//               {precommandes.map((precommande) => {
//                 const status = getPrecommandeStatus(precommande.statut);

//                 const modele = precommande.modele || {};

//                 const produit = precommande.produitId || {};

//                 const image =
//                   modele.image ||
//                   produit?.images?.[0]?.url ||
//                   "https://via.placeholder.com/300x400";

//                 const isOpen = expandedPrecommandes[precommande._id];

//                 return (
//                   <PrecommandeCard key={precommande._id}>
//                     {/* ================================
//                         HEADER
//                     ================================= */}

//                     <PrecommandeHeader
//                       type="button"
//                       onClick={() =>
//                         setExpandedPrecommandes((prev) => ({
//                           ...prev,
//                           [precommande._id]: !prev[precommande._id],
//                         }))
//                       }
//                     >
//                       <PrecommandeMain>
//                         <PrecommandeProduct>
//                           <PrecommandeImage
//                             src={image}
//                             alt={modele.title || produit?.title || "Produit"}
//                           />

//                           <PrecommandeInfo>
//                             <PrecommandeEyebrow>PRÉCOMMANDE</PrecommandeEyebrow>

//                             <PrecommandeTitle>
//                               {modele.title || produit?.title || "Produit"}
//                             </PrecommandeTitle>

//                             <PrecommandeDate>
//                               {precommande.createdAt
//                                 ? new Date(
//                                     precommande.createdAt,
//                                   ).toLocaleDateString("fr-FR", {
//                                     day: "2-digit",
//                                     month: "long",
//                                     year: "numeric",
//                                   })
//                                 : "Date indisponible"}
//                             </PrecommandeDate>
//                           </PrecommandeInfo>
//                         </PrecommandeProduct>
//                       </PrecommandeMain>

//                       <PrecommandeRight>
//                         <StatusBadge $type={status.type}>
//                           {status.icon}
//                           {status.label}
//                         </StatusBadge>

//                         {isOpen ? <FiChevronUp /> : <FiChevronDown />}
//                       </PrecommandeRight>
//                     </PrecommandeHeader>

//                     {/* ================================
//                         DETAILS
//                     ================================= */}

//                     {isOpen && (
//                       <PrecommandeDetailsWrapper>
//                         <PrecommandeDetails>
//                           <PrecommandeDetail>
//                             <span>Taille</span>

//                             <strong>
//                               {precommande.taille || "Non précisée"}
//                             </strong>
//                           </PrecommandeDetail>

//                           <PrecommandeDetail>
//                             <span>Couleur</span>

//                             <strong>
//                               {precommande.couleur || "Non précisée"}
//                             </strong>
//                           </PrecommandeDetail>

//                           <PrecommandeDetail>
//                             <span>Quantité</span>

//                             <strong>{precommande.quantite || 1}</strong>
//                           </PrecommandeDetail>

//                           <PrecommandeDetail>
//                             <span>Montant du dépôt</span>

//                             <strong>
//                               {Number(
//                                 precommande.montantDepot || 0,
//                               ).toLocaleString("fr-FR")}{" "}
//                               FCFA
//                             </strong>
//                           </PrecommandeDetail>
//                         </PrecommandeDetails>

//                         {/* ==============================
//                             DÉPÔT
//                         ============================== */}

//                         <DepotBox>
//                           <DepotHeader>
//                             <DepotIcon>
//                               <FiCreditCard />
//                             </DepotIcon>

//                             <div>
//                               <DepotTitle>Informations du dépôt</DepotTitle>

//                               <DepotSubtitle>
//                                 Informations utilisées lors de votre
//                                 précommande.
//                               </DepotSubtitle>
//                             </div>
//                           </DepotHeader>

//                           <DepotGrid>
//                             <DepotItem>
//                               <DepotItemTop>
//                                 <FiSmartphone />
//                                 <span>Service</span>
//                               </DepotItemTop>

//                               <strong>
//                                 {getServiceDepot(precommande)
//                                   ? getServiceDepot(precommande).toUpperCase()
//                                   : "Non précisé"}
//                               </strong>
//                             </DepotItem>

//                             <DepotItem>
//                               <DepotItemTop>
//                                 <FiSmartphone />
//                                 <span>Votre numéro</span>
//                               </DepotItemTop>

//                               <strong>
//                                 {getNumeroDepot(precommande) || "Non renseigné"}
//                               </strong>
//                             </DepotItem>

//                             <DepotItem>
//                               <DepotItemTop>
//                                 <FiHash />
//                                 <span>Référence du dépôt</span>
//                               </DepotItemTop>

//                               <strong>
//                                 {getReferenceDepot(precommande) ||
//                                   "Non renseignée"}
//                               </strong>
//                             </DepotItem>

//                             <DepotItem>
//                               <DepotItemTop>
//                                 <FiCheckCircle />
//                                 <span>Statut du dépôt</span>
//                               </DepotItemTop>

//                               <strong>
//                                 {getStatutDepot(precommande) === "CONFIRMED"
//                                   ? "Confirmé"
//                                   : getStatutDepot(precommande) === "REJECTED"
//                                     ? "Refusé"
//                                     : "En vérification"}
//                               </strong>
//                             </DepotItem>
//                           </DepotGrid>
//                         </DepotBox>
//                         {/* ==============================
//     FINALISATION
// ============================== */}

//                         {precommande.statut === "READY_TO_FINALIZE" &&
//                           precommande.disponiblePourFinalisation && (
//                             <SoldeBox>
//                               <SoldeHeader>
//                                 <SoldeIcon>
//                                   <FiCreditCard />
//                                 </SoldeIcon>

//                                 <div>
//                                   <SoldeTitle>Finaliser ma commande</SoldeTitle>

//                                   <SoldeSubtitle>
//                                     Votre produit est disponible. Réglez le
//                                     solde pour finaliser votre commande.
//                                   </SoldeSubtitle>
//                                 </div>
//                               </SoldeHeader>

//                               <SoldeAmount>
//                                 <span>Solde à payer</span>

//                                 <strong>
//                                   {Number(
//                                     precommande.montantSolde || 0,
//                                   ).toLocaleString("fr-FR")}{" "}
//                                   FCFA
//                                 </strong>
//                               </SoldeAmount>

//                               <SoldeForm>
//                                 <SoldeField>
//                                   <label>Service de paiement</label>

//                                   <select
//                                     value={
//                                       soldeForm[precommande._id]?.service || ""
//                                     }
//                                     onChange={(e) =>
//                                       setSoldeForm((prev) => ({
//                                         ...prev,
//                                         [precommande._id]: {
//                                           ...prev[precommande._id],
//                                           service: e.target.value,
//                                         },
//                                       }))
//                                     }
//                                   >
//                                     <option value="">Sélectionner</option>

//                                     <option value="orange">Orange Money</option>

//                                     <option value="wave">Wave</option>
//                                   </select>
//                                 </SoldeField>

//                                 <SoldeField>
//                                   <label>Numéro utilisé</label>

//                                   <input
//                                     type="text"
//                                     placeholder="Ex : 0700000000"
//                                     value={
//                                       soldeForm[precommande._id]
//                                         ?.numeroClient || ""
//                                     }
//                                     onChange={(e) =>
//                                       setSoldeForm((prev) => ({
//                                         ...prev,
//                                         [precommande._id]: {
//                                           ...prev[precommande._id],
//                                           numeroClient: e.target.value,
//                                         },
//                                       }))
//                                     }
//                                   />
//                                 </SoldeField>

//                                 <SoldeField>
//                                   <label>Référence du paiement</label>

//                                   <input
//                                     type="text"
//                                     placeholder="Référence de transaction"
//                                     value={
//                                       soldeForm[precommande._id]?.reference ||
//                                       ""
//                                     }
//                                     onChange={(e) =>
//                                       setSoldeForm((prev) => ({
//                                         ...prev,
//                                         [precommande._id]: {
//                                           ...prev[precommande._id],
//                                           reference: e.target.value,
//                                         },
//                                       }))
//                                     }
//                                   />
//                                 </SoldeField>

//                                 <SoldeField>
//                                   <label>Montant envoyé</label>

//                                   <input
//                                     type="number"
//                                     min="0"
//                                     value={
//                                       soldeForm[precommande._id]
//                                         ?.montantEnvoye ??
//                                       precommande.montantSolde ??
//                                       0
//                                     }
//                                     onChange={(e) =>
//                                       setSoldeForm((prev) => ({
//                                         ...prev,
//                                         [precommande._id]: {
//                                           ...prev[precommande._id],
//                                           montantEnvoye: e.target.value,
//                                         },
//                                       }))
//                                     }
//                                   />
//                                 </SoldeField>
//                               </SoldeForm>

//                               <FinalizeButton
//                                 type="button"
//                                 disabled={Boolean(payingSolde[precommande._id])}
//                                 onClick={() => payerSolde(precommande)}
//                               >
//                                 {payingSolde[precommande._id]
//                                   ? "Envoi du paiement..."
//                                   : "Payer le solde et finaliser"}

//                                 {!payingSolde[precommande._id] && (
//                                   <FiArrowRight />
//                                 )}
//                               </FinalizeButton>
//                             </SoldeBox>
//                           )}

//                         {/* ==============================
//                             STATUT
//                         ============================== */}

//                         {precommande.statut === "PENDING" && (
//                           <PrecommandeMessage $type="pending">
//                             <FiClock />

//                             <div>
//                               <strong>Vérification en cours</strong>

//                               <p>
//                                 Votre dépôt est actuellement en cours de
//                                 vérification par notre équipe.
//                               </p>
//                             </div>
//                           </PrecommandeMessage>
//                         )}

//                         {precommande.statut === "ACCEPTED" && (
//                           <PrecommandeMessage $type="accepted">
//                             <FiCheckCircle />

//                             <div>
//                               <strong>Précommande confirmée</strong>

//                               <p>
//                                 Votre dépôt a été vérifié et votre précommande
//                                 est confirmée.
//                               </p>

//                               {precommande.adminComment?.trim() && (
//                                 <p>
//                                   <strong>
//                                     Commentaire de l'administration :
//                                   </strong>{" "}
//                                   {precommande.adminComment}
//                                 </p>
//                               )}
//                             </div>
//                           </PrecommandeMessage>
//                         )}

//                         {precommande.statut === "FINALIZATION_PENDING" && (
//                           <PrecommandeMessage $type="pending">
//                             <FiClock />

//                             <div>
//                               <strong>Paiement du solde en vérification</strong>

//                               <p>
//                                 Votre paiement du solde a bien été envoyé. Notre
//                                 équipe vérifie actuellement la transaction.
//                               </p>

//                               {getPaiementSolde(precommande) && (
//                                 <p>
//                                   Référence :{" "}
//                                   <strong>
//                                     {getPaiementSolde(precommande)?.reference ||
//                                       "—"}
//                                   </strong>
//                                 </p>
//                               )}
//                             </div>
//                           </PrecommandeMessage>
//                         )}

//                         {precommande.statut === "FINALIZED" && (
//                           <PrecommandeMessage $type="accepted">
//                             <FiCheckCircle />

//                             <div>
//                               <strong>Commande finalisée 🎉</strong>

//                               <p>
//                                 Votre solde a été confirmé et votre commande a
//                                 été créée avec succès.
//                               </p>

//                               {precommande.commandeId && (
//                                 <TrackButton
//                                   type="button"
//                                   onClick={() =>
//                                     navigate(
//                                       `/suivi-commande/${precommande.commandeId}`,
//                                     )
//                                   }
//                                 >
//                                   Voir ma commande
//                                   <FiArrowRight />
//                                 </TrackButton>
//                               )}
//                             </div>
//                           </PrecommandeMessage>
//                         )}

//                         {precommande.statut === "REJECTED" && (
//                           <PrecommandeMessage $type="rejected">
//                             <FiClock />

//                             <div>
//                               <strong>Précommande refusée</strong>

//                               <p>
//                                 {precommande.adminComment ||
//                                   "Votre précommande n'a pas été validée."}
//                               </p>
//                             </div>
//                           </PrecommandeMessage>
//                         )}
//                       </PrecommandeDetailsWrapper>
//                     )}
//                   </PrecommandeCard>
//                 );
//               })}
//             </PrecommandesList>
//           )}
//         </Section>

//         {/* =================================================
//             FAVORIS
//         ================================================= */}

//         <Section>
//           <SectionHeader>
//             <SectionTitleWrap>
//               <SectionEyebrow>Votre sélection</SectionEyebrow>

//               <SectionTitle>Mes favoris</SectionTitle>

//               <SectionDescription>
//                 Les pièces que vous avez gardées de côté.
//               </SectionDescription>
//             </SectionTitleWrap>
//           </SectionHeader>

//           {favorites.length === 0 ? (
//             <EmptyState>
//               <EmptyIcon>
//                 <FiHeart />
//               </EmptyIcon>

//               <div>Vous n'avez encore aucun favori.</div>

//               <ShopLink to="/collections">
//                 Découvrir la collection
//                 <FiArrowRight />
//               </ShopLink>
//             </EmptyState>
//           ) : (
//             <FavoritesGrid>
//               {favorites.map((favorite) => {
//                 const product = favorite.productId;

//                 const image =
//                   product?.images?.[0]?.url ||
//                   "https://via.placeholder.com/300x400";

//                 return (
//                   <FavoriteCard key={favorite._id}>
//                     <FavoriteImage
//                       src={image}
//                       alt={product?.title || "Produit"}
//                     />

//                     <FavoriteInfo>
//                       <FavoriteLink to={`/produit/${product?._id}`}>
//                         {product?.title || "Produit"}
//                       </FavoriteLink>

//                       <FavoritePrice>
//                         {product?.price
//                           ? `${product.price.toLocaleString("fr-FR")} FCFA`
//                           : "Prix indisponible"}
//                       </FavoritePrice>
//                     </FavoriteInfo>

//                     <DeleteButton
//                       type="button"
//                       aria-label="Supprimer des favoris"
//                       onClick={() => removeFavorite(favorite._id)}
//                     >
//                       <FiTrash2 />
//                     </DeleteButton>
//                   </FavoriteCard>
//                 );
//               })}
//             </FavoritesGrid>
//           )}
//         </Section>

//         {/* =================================================
//             COMMANDES
//         ================================================= */}

//         <Section>
//           <SectionHeader>
//             <SectionTitleWrap>
//               <SectionEyebrow>Historique</SectionEyebrow>

//               <SectionTitle>Mes commandes</SectionTitle>

//               <SectionDescription>
//                 Consultez le statut, le contenu et le suivi de chacune de vos
//                 commandes.
//               </SectionDescription>
//             </SectionTitleWrap>
//           </SectionHeader>

//           {commandes.length === 0 ? (
//             <EmptyState>
//               <EmptyIcon>
//                 <FiShoppingBag />
//               </EmptyIcon>

//               <div>Vous n'avez encore passé aucune commande.</div>

//               <ShopLink to="/collections">
//                 Commencer mes achats
//                 <FiArrowRight />
//               </ShopLink>
//             </EmptyState>
//           ) : (
//             <OrdersList>
//               {commandes.map((commande) => {
//                 const statut = commande.livraison?.statut || "NOT_STARTED";

//                 const status = getStatus(statut);

//                 const isOpen = expanded[commande._id];

//                 const hasLivreur = Boolean(commande.livraison?.livreurId);

//                 const canTrack =
//                   commande.modePaiement === "cod"
//                     ? ["CONFIRMED", "SHIPPED", "DELIVERED"].includes(
//                         commande.statusCommande,
//                       )
//                     : ["PAID", "SHIPPED", "DELIVERED"].includes(
//                         commande.statusCommande,
//                       );

//                 return (
//                   <OrderCard key={commande._id}>
//                     <OrderHeader
//                       type="button"
//                       onClick={() =>
//                         setExpanded((prev) => ({
//                           ...prev,
//                           [commande._id]: !prev[commande._id],
//                         }))
//                       }
//                     >
//                       <OrderMain>
//                         <OrderNumber>
//                           Commande #{commande._id.slice(-6).toUpperCase()}
//                         </OrderNumber>

//                         <OrderDate>
//                           {commande.createdAt
//                             ? new Date(commande.createdAt).toLocaleDateString(
//                                 "fr-FR",
//                                 {
//                                   day: "2-digit",
//                                   month: "long",
//                                   year: "numeric",
//                                 },
//                               )
//                             : "Date indisponible"}
//                         </OrderDate>
//                       </OrderMain>

//                       <OrderRight>
//                         <OrderTotal>
//                           {Number(commande.total || 0).toLocaleString("fr-FR")}{" "}
//                           FCFA
//                         </OrderTotal>

//                         <StatusBadge $type={status.type}>
//                           {status.icon}
//                           {status.label}
//                         </StatusBadge>

//                         {isOpen ? <FiChevronUp /> : <FiChevronDown />}
//                       </OrderRight>
//                     </OrderHeader>

//                     {isOpen && (
//                       <OrderDetailsWrapper>
//                         <OrderDetails>
//                           {(commande.panier || []).map((p, index) => {
//                             const image =
//                               p.images?.[0]?.url ||
//                               p.produitId?.images?.[0]?.url ||
//                               "https://via.placeholder.com/100";

//                             return (
//                               <OrderProduct
//                                 key={
//                                   p.produitId?._id || `${commande._id}-${index}`
//                                 }
//                               >
//                                 <OrderProductImage
//                                   src={image}
//                                   alt={p.nom || p.produitId?.title || "Produit"}
//                                 />

//                                 <OrderProductInfo>
//                                   <OrderProductLink
//                                     to={`/produit/${p.produitId?._id}`}
//                                   >
//                                     {p.nom || p.produitId?.title || "Produit"}
//                                   </OrderProductLink>

//                                   <Quantity>
//                                     Quantité : {p.quantite || 1}
//                                   </Quantity>
//                                 </OrderProductInfo>
//                               </OrderProduct>
//                             );
//                           })}
//                         </OrderDetails>
//                         {commande.modePaiement === "installments" && (
//                           <InstallmentPaymentBox>
//                             <h4>Paiement en 3 tranches</h4>

//                             {commande.paiements?.map((paiement) => (
//                               <PaymentStep key={paiement.step}>
//                                 <div>
//                                   <strong>Tranche {paiement.step}</strong>

//                                   <span>
//                                     {Number(
//                                       paiement.amountExpected,
//                                     ).toLocaleString()}{" "}
//                                     FCFA
//                                   </span>
//                                 </div>

//                                 <PaymentStatus $status={paiement.status}>
//                                   {paiement.status === "PAID" && "✓ Payée"}

//                                   {paiement.status === "PENDING" &&
//                                     "⏳ En vérification"}

//                                   {paiement.status === "UNPAID" && "À payer"}
//                                   {paiement.status === "REJECTED" &&
//                                     "❌ Rejeté"}
//                                 </PaymentStatus>
//                               </PaymentStep>
//                             ))}

//                             {(() => {
//                               const prochaineTranche = commande.paiements?.find(
//                                 (p) => p.status !== "PAID",
//                               );

//                               if (!prochaineTranche) {
//                                 return (
//                                   <PaymentComplete>
//                                     ✓ Paiement entièrement confirmé
//                                   </PaymentComplete>
//                                 );
//                               }

//                               if (prochaineTranche.status === "PENDING") {
//                                 return (
//                                   <PaymentWaiting>
//                                     Votre paiement est en attente de validation
//                                     par notre équipe.
//                                   </PaymentWaiting>
//                                 );
//                               }

//                               return (
//                                 <PayNextButton
//                                   type="button"
//                                   onClick={() =>
//                                     navigate(`/paiement-suite/${commande._id}`)
//                                   }
//                                 >
//                                   Payer la tranche {prochaineTranche.step}
//                                   <FiArrowRight />
//                                 </PayNextButton>
//                               );
//                             })()}
//                           </InstallmentPaymentBox>
//                         )}

//                         {canTrack && (
//                           <TrackingAction>
//                             <TrackingActionInfo>
//                               <TrackingActionIcon $active={hasLivreur}>
//                                 {hasLivreur ? <FiTruck /> : <FiMapPin />}
//                               </TrackingActionIcon>

//                               <div>
//                                 <TrackingActionTitle>
//                                   {hasLivreur
//                                     ? "Votre livraison est en cours"
//                                     : "Suivre votre commande"}
//                                 </TrackingActionTitle>

//                                 <TrackingActionText>
//                                   {hasLivreur
//                                     ? "Consultez la position de votre livreur en temps réel."
//                                     : "Consultez l'état actuel de votre commande."}
//                                 </TrackingActionText>
//                               </div>
//                             </TrackingActionInfo>

//                             <TrackButton
//                               type="button"
//                               onClick={() =>
//                                 navigate(`/suivi-commande/${commande._id}`)
//                               }
//                             >
//                               {hasLivreur ? "Suivre" : "Voir le suivi"}
//                               <FiArrowRight />
//                             </TrackButton>
//                           </TrackingAction>
//                         )}
//                       </OrderDetailsWrapper>
//                     )}
//                   </OrderCard>
//                 );
//               })}
//             </OrdersList>
//           )}
//         </Section>

//         {/* =================================================
//             FOOTER
//         ================================================= */}

//         <AccountFooter>Votre espace personnel NUMA</AccountFooter>
//       </Container>
//     </Page>
//   );
// }

// // ======================================================
// // STYLES
// // ======================================================

// const Page = styled.div`
//   min-height: 100vh;
//   background: #f5f5f7;
//   color: #111;
//   padding: 40px 0 80px;
// `;

// const Container = styled.div`
//   width: min(1180px, 92%);
//   margin: 0 auto;
// `;

// const Header = styled.header`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 30px;
//   margin-bottom: 40px;

//   @media (max-width: 700px) {
//     flex-direction: column;
//     align-items: flex-start;
//   }
// `;

// const HeaderLeft = styled.div``;

// const WelcomeLabel = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   font-size: 11px;
//   font-weight: 800;
//   letter-spacing: 0.12em;
//   text-transform: uppercase;
//   color: #777;
//   margin-bottom: 10px;
// `;

// const Title = styled.h1`
//   margin: 0;
//   font-size: clamp(30px, 4vw, 48px);
//   line-height: 1.05;
//   letter-spacing: -0.04em;
// `;

// const Email = styled.div`
//   margin-top: 10px;
//   color: #777;
//   font-size: 14px;
// `;

// const HeaderActions = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
// `;

// const NotificationButton = styled.button`
//   position: relative;
//   width: 46px;
//   height: 46px;
//   border: 1px solid #e8e8e8;
//   border-radius: 14px;
//   background: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 18px;
//   cursor: pointer;
// `;

// const NotificationBadge = styled.span`
//   position: absolute;
//   top: -5px;
//   right: -5px;
//   min-width: 19px;
//   height: 19px;
//   padding: 0 5px;
//   border-radius: 999px;
//   background: #111;
//   color: white;
//   font-size: 10px;
//   font-weight: 800;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const LogoutButton = styled.button`
//   border: 0;
//   border-radius: 14px;
//   padding: 13px 17px;
//   background: #111;
//   color: white;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   font-weight: 700;
//   cursor: pointer;
// `;

// const StatsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
//   margin-bottom: 55px;

//   @media (max-width: 800px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const StatCard = styled.div`
//   background: white;
//   border-radius: 22px;
//   padding: 22px;
//   border: 1px solid #eeeeee;
// `;

// const StatTop = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const StatLabel = styled.div`
//   color: #777;
//   font-size: 13px;
//   font-weight: 600;
// `;

// const StatIcon = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 13px;
//   background: #f3f3f3;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const StatValue = styled.div`
//   margin-top: 22px;
//   font-size: 26px;
//   font-weight: 800;
//   letter-spacing: -0.03em;
// `;

// const Section = styled.section`
//   margin-bottom: 55px;
// `;

// const SectionHeader = styled.div`
//   margin-bottom: 20px;
// `;

// const SectionTitleWrap = styled.div``;

// const SectionEyebrow = styled.div`
//   color: #888;
//   font-size: 10px;
//   font-weight: 800;
//   letter-spacing: 0.13em;
//   text-transform: uppercase;
//   margin-bottom: 7px;
// `;

// const SectionTitle = styled.h2`
//   margin: 0;
//   font-size: 27px;
//   letter-spacing: -0.03em;
// `;

// const SectionDescription = styled.p`
//   margin: 8px 0 0;
//   color: #777;
//   font-size: 14px;
//   max-width: 650px;
//   line-height: 1.6;
// `;

// const CoffreBox = styled.div`
//   background: #111;
//   color: white;
//   border-radius: 25px;
//   padding: 28px;
// `;

// const CoffreHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   gap: 30px;
//   margin-bottom: 30px;

//   @media (max-width: 600px) {
//     flex-direction: column;
//   }
// `;

// const CoffreAmount = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 7px;

//   span {
//     color: #aaa;
//     font-size: 12px;
//   }

//   strong {
//     font-size: 25px;
//   }
// `;

// const CoffreRemaining = styled(CoffreAmount)`
//   text-align: right;

//   @media (max-width: 600px) {
//     text-align: left;
//   }
// `;

// const ProgressInfo = styled.div`
//   display: flex;
//   justify-content: space-between;
//   color: #aaa;
//   font-size: 12px;
//   margin-bottom: 9px;

//   strong {
//     color: white;
//   }
// `;

// const ProgressBar = styled.div`
//   height: 8px;
//   background: #333;
//   border-radius: 999px;
//   overflow: hidden;
// `;

// const Progress = styled.div`
//   width: ${({ $percent }) => $percent}%;
//   height: 100%;
//   background: white;
//   border-radius: inherit;
//   transition: width 0.5s ease;
// `;

// const EmptyState = styled.div`
//   background: white;
//   border: 1px solid #eeeeee;
//   border-radius: 22px;
//   padding: 35px;
//   text-align: center;
//   color: #777;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 14px;
// `;

// const EmptyIcon = styled.div`
//   width: 50px;
//   height: 50px;
//   border-radius: 16px;
//   background: #f3f3f3;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 21px;
//   color: #111;
// `;

// const ShopLink = styled(Link)`
//   color: #111;
//   font-weight: 800;
//   text-decoration: none;
//   display: flex;
//   align-items: center;
//   gap: 7px;
// `;

// // ======================================================
// // PRÉCOMMANDES
// // ======================================================

// const PrecommandesList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 14px;
// `;

// const PrecommandeCard = styled.div`
//   background: white;
//   border: 1px solid #eeeeee;
//   border-radius: 21px;
//   overflow: hidden;
// `;

// const PrecommandeHeader = styled.button`
//   width: 100%;
//   border: 0;
//   background: transparent;
//   padding: 18px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 20px;
//   text-align: left;
//   cursor: pointer;
//   color: #111;

//   @media (max-width: 650px) {
//     align-items: flex-start;
//   }
// `;

// const PrecommandeMain = styled.div`
//   min-width: 0;
//   flex: 1;
// `;

// const PrecommandeProduct = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;
//   min-width: 0;
// `;

// const PrecommandeImage = styled.img`
//   width: 76px;
//   height: 92px;
//   flex: 0 0 auto;
//   object-fit: cover;
//   border-radius: 14px;
//   background: #f3f3f3;
// `;

// const PrecommandeInfo = styled.div`
//   min-width: 0;
// `;

// const PrecommandeEyebrow = styled.div`
//   color: #888;
//   font-size: 9px;
//   font-weight: 800;
//   letter-spacing: 0.14em;
//   margin-bottom: 5px;
// `;

// const PrecommandeTitle = styled.div`
//   font-size: 15px;
//   font-weight: 800;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// `;

// const PrecommandeDate = styled.div`
//   margin-top: 6px;
//   color: #888;
//   font-size: 12px;
// `;

// const PrecommandeRight = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   flex: 0 0 auto;

//   @media (max-width: 600px) {
//     flex-direction: column;
//     align-items: flex-end;
//   }
// `;

// const PrecommandeDetailsWrapper = styled.div`
//   padding: 0 18px 18px;
//   border-top: 1px solid #eeeeee;
// `;

// const PrecommandeDetails = styled.div`
//   padding-top: 16px;
// `;

// const PrecommandeDetail = styled.div`
//   padding: 14px;
//   border-radius: 13px;
//   background: #f7f7f7;

//   span {
//     display: block;
//     color: #888;
//     font-size: 11px;
//     margin-bottom: 6px;
//   }

//   strong {
//     display: block;
//     font-size: 14px;
//   }
// `;

// const DepotBox = styled.div`
//   margin-top: 15px;
//   padding: 18px;
//   border-radius: 17px;
//   background: #111;
//   color: white;
// `;

// const DepotHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 17px;
// `;

// const DepotIcon = styled.div`
//   width: 40px;
//   height: 40px;
//   border-radius: 12px;
//   background: #292929;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const DepotTitle = styled.div`
//   font-size: 14px;
//   font-weight: 800;
// `;

// const DepotSubtitle = styled.div`
//   margin-top: 3px;
//   color: #aaa;
//   font-size: 11px;
// `;

// const DepotGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 10px;

//   @media (max-width: 700px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const DepotItem = styled.div`
//   padding: 13px;
//   border-radius: 12px;
//   background: #1c1c1c;

//   strong {
//     display: block;
//     margin-top: 8px;
//     font-size: 13px;
//     word-break: break-word;
//   }
// `;

// const DepotItemTop = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 7px;
//   color: #aaa;
//   font-size: 11px;
// `;

// const PrecommandeMessage = styled.div`
//   margin-top: 15px;
//   padding: 15px;
//   border-radius: 15px;
//   display: flex;
//   align-items: flex-start;
//   gap: 12px;
//   font-size: 13px;

//   background: ${({ $type }) => {
//     if ($type === "accepted") {
//       return "#eaf8ef";
//     }

//     if ($type === "rejected") {
//       return "#fff0f0";
//     }

//     return "#fff7df";
//   }};

//   color: ${({ $type }) => {
//     if ($type === "accepted") {
//       return "#18733a";
//     }

//     if ($type === "rejected") {
//       return "#b42318";
//     }

//     return "#8a6500";
//   }};

//   svg {
//     flex: 0 0 auto;
//     margin-top: 2px;
//   }

//   strong {
//     display: block;
//     font-size: 13px;
//   }

//   p {
//     margin: 5px 0 0;
//     line-height: 1.5;
//   }
// `;

// // ======================================================
// // FAVORIS
// // ======================================================

// const FavoritesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 16px;

//   @media (max-width: 950px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (max-width: 550px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const FavoriteCard = styled.div`
//   position: relative;
//   background: white;
//   border-radius: 20px;
//   overflow: hidden;
//   border: 1px solid #eeeeee;
// `;

// const FavoriteImage = styled.img`
//   width: 100%;
//   height: 220px;
//   object-fit: cover;
//   display: block;
// `;

// const FavoriteInfo = styled.div`
//   padding: 16px;
// `;

// const FavoriteLink = styled(Link)`
//   color: #111;
//   font-weight: 800;
//   text-decoration: none;
//   font-size: 14px;
// `;

// const FavoritePrice = styled.div`
//   margin-top: 7px;
//   color: #777;
//   font-size: 13px;
// `;

// const DeleteButton = styled.button`
//   position: absolute;
//   top: 12px;
//   right: 12px;
//   width: 38px;
//   height: 38px;
//   border: 0;
//   border-radius: 12px;
//   background: rgba(255, 255, 255, 0.94);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
// `;

// // ======================================================
// // COMMANDES
// // ======================================================

// const OrdersList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const OrderCard = styled.div`
//   background: white;
//   border: 1px solid #eeeeee;
//   border-radius: 21px;
//   overflow: hidden;
// `;

// const OrderHeader = styled.button`
//   width: 100%;
//   border: 0;
//   background: transparent;
//   padding: 20px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 20px;
//   text-align: left;
//   cursor: pointer;
//   color: #111;

//   @media (max-width: 650px) {
//     align-items: flex-start;
//   }
// `;

// const OrderMain = styled.div`
//   min-width: 0;
// `;

// const OrderNumber = styled.div`
//   font-weight: 800;
//   font-size: 15px;
// `;

// const OrderDate = styled.div`
//   margin-top: 6px;
//   color: #888;
//   font-size: 12px;
// `;

// const OrderRight = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   flex-wrap: wrap;
//   justify-content: flex-end;
// `;

// const OrderTotal = styled.div`
//   font-weight: 800;
//   font-size: 14px;
// `;

// const StatusBadge = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 6px;
//   padding: 8px 11px;
//   border-radius: 999px;
//   font-size: 11px;
//   font-weight: 800;

//   background: ${({ $type }) => {
//     if ($type === "success") {
//       return "#eaf8ef";
//     }

//     if ($type === "blue") {
//       return "#edf5ff";
//     }

//     if ($type === "danger") {
//       return "#fff0f0";
//     }

//     return "#fff7df";
//   }};

//   color: ${({ $type }) => {
//     if ($type === "success") {
//       return "#18733a";
//     }

//     if ($type === "blue") {
//       return "#2467a8";
//     }

//     if ($type === "danger") {
//       return "#b42318";
//     }

//     return "#8a6500";
//   }};
// `;

// const OrderDetailsWrapper = styled.div`
//   padding: 0 20px 20px;
//   border-top: 1px solid #eeeeee;
// `;

// const OrderDetails = styled.div`
//   padding-top: 16px;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const OrderProduct = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 14px;
//   padding: 10px;
//   background: #f8f8f8;
//   border-radius: 15px;
// `;

// const OrderProductImage = styled.img`
//   width: 58px;
//   height: 58px;
//   border-radius: 12px;
//   object-fit: cover;
// `;

// const OrderProductInfo = styled.div`
//   min-width: 0;
//   flex: 1;
// `;

// const OrderProductLink = styled(Link)`
//   color: #111;
//   text-decoration: none;
//   font-weight: 800;
//   font-size: 14px;
//   display: block;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// `;

// const Quantity = styled.div`
//   margin-top: 5px;
//   color: #888;
//   font-size: 12px;
// `;

// // ======================================================
// // BLOC SUIVI
// // ======================================================

// const TrackingAction = styled.div`
//   margin-top: 16px;
//   padding: 17px;
//   border-radius: 18px;
//   background: #111;
//   color: white;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 18px;

//   @media (max-width: 650px) {
//     flex-direction: column;
//     align-items: stretch;
//   }
// `;

// const TrackingActionInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 13px;
// `;

// const TrackingActionIcon = styled.div`
//   flex: 0 0 auto;
//   width: 43px;
//   height: 43px;
//   border-radius: 14px;
//   background: ${({ $active }) => ($active ? "#fff" : "#292929")};
//   color: ${({ $active }) => ($active ? "#111" : "#fff")};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 18px;
// `;

// const TrackingActionTitle = styled.div`
//   font-weight: 800;
//   font-size: 13px;
// `;

// const TrackingActionText = styled.div`
//   margin-top: 4px;
//   color: #aaa;
//   font-size: 11px;
//   line-height: 1.4;
// `;

// const TrackButton = styled.button`
//   flex: 0 0 auto;
//   border: 0;
//   border-radius: 13px;
//   padding: 12px 15px;
//   background: white;
//   color: #111;
//   font-weight: 800;
//   font-size: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   cursor: pointer;
//   transition:
//     transform 0.2s ease,
//     opacity 0.2s ease;

//   &:hover {
//     transform: translateY(-1px);
//     opacity: 0.9;
//   }
// `;

// const AccountFooter = styled.footer`
//   text-align: center;
//   color: #999;
//   font-size: 12px;
//   padding-top: 20px;
// `;

// const LoaderWrapper = styled.div`
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: #f5f5f7;
// `;

// const Loader = styled.div`
//   width: 42px;
//   height: 42px;
//   border: 4px solid #ddd;
//   border-top-color: #111;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;

//   @keyframes spin {
//     to {
//       transform: rotate(360deg);
//     }
//   }
// `;

// const SoldeBox = styled.div`
//   margin-top: 15px;
//   padding: 20px;
//   border-radius: 18px;
//   background: #f7f7f7;
//   border: 1px solid #e5e5e5;
// `;

// const SoldeHeader = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 18px;
// `;

// const SoldeIcon = styled.div`
//   width: 42px;
//   height: 42px;
//   border-radius: 13px;
//   background: #111;
//   color: white;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const SoldeTitle = styled.div`
//   font-size: 15px;
//   font-weight: 800;
// `;

// const SoldeSubtitle = styled.div`
//   margin-top: 4px;
//   color: #777;
//   font-size: 11px;
//   line-height: 1.5;
// `;

// const SoldeAmount = styled.div`
//   padding: 15px;
//   border-radius: 14px;
//   background: white;
//   border: 1px solid #e9e9e9;
//   margin-bottom: 15px;

//   span {
//     display: block;
//     color: #888;
//     font-size: 11px;
//     margin-bottom: 6px;
//   }

//   strong {
//     font-size: 20px;
//   }
// `;

// const SoldeForm = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 12px;

//   @media (max-width: 650px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const SoldeField = styled.div`
//   label {
//     display: block;
//     margin-bottom: 6px;
//     color: #666;
//     font-size: 11px;
//     font-weight: 700;
//   }

//   input,
//   select {
//     width: 100%;
//     box-sizing: border-box;
//     height: 44px;
//     padding: 0 12px;
//     border: 1px solid #ddd;
//     border-radius: 11px;
//     background: white;
//     color: #111;
//     font-size: 16px;
//     outline: none;

//     &:focus {
//       border-color: #111;
//     }
//   }
// `;

// const FinalizeButton = styled.button`
//   width: 100%;
//   margin-top: 14px;
//   height: 48px;
//   border: 0;
//   border-radius: 13px;
//   background: #111;
//   color: white;
//   font-size: 13px;
//   font-weight: 800;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   cursor: pointer;

//   &:disabled {
//     opacity: 0.55;
//     cursor: not-allowed;
//   }
// `;
// const InstallmentPaymentBox = styled.div`
//   margin-top: 20px;
//   padding: 20px;
//   border-radius: 16px;
//   background: ${({ theme }) => theme.card || "#f5f5f5"};
// `;

// const PaymentStep = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 15px;
//   padding: 12px 0;
//   border-bottom: 1px solid rgba(0, 0, 0, 0.08);

//   div {
//     display: flex;
//     flex-direction: column;
//     gap: 4px;
//   }
// `;

// const PaymentStatus = styled.span`
//   font-weight: 600;
// `;

// const PaymentComplete = styled.div`
//   margin-top: 15px;
//   font-weight: 600;
// `;

// const PaymentWaiting = styled.div`
//   margin-top: 15px;
//   padding: 12px;
//   border-radius: 10px;
// `;

// const PayNextButton = styled.button`
//   margin-top: 18px;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   padding: 12px 18px;
//   border: none;
//   border-radius: 10px;
//   cursor: pointer;
//   font-weight: 600;
// `;
 
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FiSmartphone,
  FiHash,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { socket } from "../../services/socket";

const CompteClient = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [precommandes, setPrecommandes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [expandedPrecommandes, setExpandedPrecommandes] = useState({});
  const [notifCount, setNotifCount] = useState(0);
  const [soldeForm, setSoldeForm] = useState({});
  const [payingSolde, setPayingSolde] = useState({});
  const audioRef = useRef(null);

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /* =========================================================
     AUDIO
  ========================================================= */

  useEffect(() => {
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.5;
    audioRef.current = audio;

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
      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  /* =========================================================
     SOCKET
  ========================================================= */

  useEffect(() => {
    if (!token) return;

    const handleUpdate = (data) => {
      setCommandes((prev) =>
        prev.map((cmd) => {
          if (cmd._id !== data.id) return cmd;

          return {
            ...cmd,

            statusCommande:
              data.status || data.statusCommande || cmd.statusCommande,

            livraison: {
              ...cmd.livraison,

              statut:
                data.statutLivraison ||
                data.statut ||
                cmd.livraison?.statut,

              livreurId:
                data.livreurId || cmd.livraison?.livreurId,

              livreur:
                data.livreur || cmd.livraison?.livreur,
            },

            paiements: data.paiements || cmd.paiements,

            paiementsRecus:
              data.paiementsRecus || cmd.paiementsRecus,
          };
        }),
      );

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    socket.on("commande_update", handleUpdate);

    return () => {
      socket.off("commande_update", handleUpdate);
    };
  }, [token]);

  /* =========================================================
     FETCH COMPTE
  ========================================================= */

  const fetchCompte = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/compte`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du chargement");
      }

      setUser(data.user || null);
      setFavorites(data.favorites || []);
      setCommandes(data.commandes || []);

      try {
        const resPrecommandes = await fetch(
          `${API_URL}/api/precommandes/mes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const dataPrecommandes = await resPrecommandes.json();

        if (resPrecommandes.ok) {
          setPrecommandes(
            (dataPrecommandes.precommandes || []).filter(
              (precommande) =>
                precommande.status !== "FINALIZED",
            ),
          );
        }
      } catch (error) {
        console.error(
          "Erreur chargement précommandes:",
          error,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompte();
  }, []);

  /* =========================================================
     FAVORIS
  ========================================================= */

  const removeFavorite = async (productId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/favoris/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Impossible de retirer le favori",
        );
      }

      setFavorites((prev) =>
        prev.filter((fav) => {
          const id =
            fav._id ||
            fav.produitId?._id ||
            fav.produitId;

          return String(id) !== String(productId);
        }),
      );

      toast.success("Produit retiré des favoris");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erreur serveur");
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* =========================================================
     HELPERS PRÉCOMMANDES
  ========================================================= */

  const getPaiementDepot = (precommande) => {
    return (
      precommande?.paiements?.find(
        (paiement) => paiement.type === "DEPOT",
      ) || null
    );
  };

  const getPaiementSolde = (precommande) => {
    const paiements = precommande?.paiements || [];

    return (
      [...paiements]
        .reverse()
        .find((paiement) => paiement.type === "SOLDE") ||
      null
    );
  };

  /* =========================================================
     PAIEMENT REJETÉ
     
     IMPORTANT :
     Le backend met :
       paiementRecu.status = "REJECTED"
     
     MAIS remet :
       paiementStep.status = "UNPAID"
     
     Donc il faut impérativement regarder
     paiementsRecus pour détecter le rejet.
  ========================================================= */

  const getRejectedPayment = (commande) => {
    const recus = Array.isArray(commande?.paiementsRecus)
      ? commande.paiementsRecus
      : [];

    const rejected = [...recus]
      .reverse()
      .find(
        (paiement) =>
          paiement?.status === "REJECTED",
      );

    if (rejected) {
      return rejected;
    }

    /*
     * Sécurité supplémentaire au cas où un jour
     * le backend met directement REJECTED dans paiements.
     */
    const payments = Array.isArray(commande?.paiements)
      ? commande.paiements
      : [];

    return (
      [...payments]
        .reverse()
        .find(
          (paiement) =>
            paiement?.status === "REJECTED",
        ) || null
    );
  };

  /* =========================================================
     REPAYER
     
     PaiementSuite fonctionne avec paiementSemi
     et retrouve automatiquement la prochaine tranche
     non payée.

     Pour un paiement full :
       step 1 = UNPAID après rejet

     Pour installments :
       la tranche rejetée redevient également UNPAID.
  ========================================================= */

  const handleRepay = (commande) => {
    if (!commande?._id) return;

    navigate(`/paiement-suite/${commande._id}`);
  };

  /* =========================================================
     STATUT LIVRAISON
  ========================================================= */

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

  /* =========================================================
     PAIEMENT STATUS LABEL
  ========================================================= */

  const getPaymentStatusLabel = (status) => {
    if (status === "PAID") return "✓ Payée";
    if (status === "PENDING") return "⏳ En vérification";
    if (status === "REJECTED") return "❌ Rejetée";
    if (status === "UNPAID") return "À payer";

    return status || "À payer";
  };

  /* =========================================================
     TOTAL PAYÉ
  ========================================================= */

  const totalPaid = commandes.reduce((total, commande) => {
    if (commande.modePaiement === "cod") {
      return commande.statusCommande === "DELIVERED"
        ? total + Number(commande.total || 0)
        : total;
    }

    const paid = (commande.paiements || [])
      .filter((paiement) => paiement.status === "PAID")
      .reduce(
        (sum, paiement) =>
          sum + Number(paiement.amountExpected || 0),
        0,
      );

    return total + paid;
  }, 0);

  const totalAmount = commandes.reduce(
    (total, commande) =>
      total + Number(commande.total || 0),
    0,
  );

  const remaining = Math.max(
    0,
    totalAmount - totalPaid,
  );

  const progress =
    totalAmount > 0
      ? Math.min(
          100,
          Math.round(
            (totalPaid / totalAmount) * 100,
          ),
        )
      : 0;

  /* =========================================================
     SOLDE PRÉCOMMANDE
  ========================================================= */

  const handleSoldeChange = (
    precommandeId,
    field,
    value,
  ) => {
    setSoldeForm((prev) => ({
      ...prev,
      [precommandeId]: {
        ...prev[precommandeId],
        [field]: value,
      },
    }));
  };

  const handlePaySolde = async (
    e,
    precommande,
  ) => {
    e.preventDefault();

    const form =
      soldeForm[precommande._id] || {};

    if (
      !form.numeroClient ||
      !form.montantEnvoye ||
      !form.reference
    ) {
      toast.error(
        "Veuillez remplir tous les champs.",
      );
      return;
    }

    setPayingSolde((prev) => ({
      ...prev,
      [precommande._id]: true,
    }));

    try {
      /*
       * Conservation de la logique existante.
       * La route de solde reste celle déjà utilisée
       * dans ton projet.
       */
      const res = await fetch(
        `${API_URL}/api/precommandes/${precommande._id}/paiement-solde`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            numeroClient: form.numeroClient,
            montantEnvoye: Number(
              form.montantEnvoye,
            ),
            reference: form.reference,
            service: form.service || "orange",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Erreur lors du paiement du solde",
        );
      }

      toast.success(
        "Paiement du solde envoyé.",
      );

      setSoldeForm((prev) => ({
        ...prev,
        [precommande._id]: {},
      }));

      fetchCompte();
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Erreur serveur",
      );
    } finally {
      setPayingSolde((prev) => ({
        ...prev,
        [precommande._id]: false,
      }));
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  if (!token) {
    return null;
  }

  return (
    <Page>
      <Container>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Header>
          <HeaderLeft>
            <Eyebrow>
              <span />
              MON ESPACE
              <span />
            </Eyebrow>

            <Title>
              Bonjour{" "}
              {user?.prenom ||
                user?.username ||
                "Client"}
            </Title>

            <Subtitle>
              Retrouvez vos commandes, favoris et
              paiements.
            </Subtitle>
          </HeaderLeft>

          <HeaderActions>
            <NotificationButton
              type="button"
              onClick={() => navigate("/notifications")}
            >
              <FiBell />

              {notifCount > 0 && (
                <NotificationCount>
                  {notifCount}
                </NotificationCount>
              )}
            </NotificationButton>

            <LogoutButton
              type="button"
              onClick={logout}
            >
              <FiLogOut />
              Déconnexion
            </LogoutButton>
          </HeaderActions>
        </Header>

        {/* =====================================================
            NAVIGATION COMPTE
        ===================================================== */}

        <AccountNav>
          <AccountNavItem $active>
            <FiUser />
            Mon compte
          </AccountNavItem>

          <AccountNavItem
            type="button"
            onClick={() =>
              document
                .getElementById("commandes")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <FiPackage />
            Commandes
          </AccountNavItem>

          <AccountNavItem
            type="button"
            onClick={() =>
              document
                .getElementById("favoris")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            <FiHeart />
            Favoris
          </AccountNavItem>
        </AccountNav>

        {/* =====================================================
            STATS
        ===================================================== */}

        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FiPackage />
            </StatIcon>

            <div>
              <StatLabel>
                Commandes
              </StatLabel>

              <StatValue>
                {commandes.length}
              </StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiHeart />
            </StatIcon>

            <div>
              <StatLabel>
                Favoris
              </StatLabel>

              <StatValue>
                {favorites.length}
              </StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiCreditCard />
            </StatIcon>

            <div>
              <StatLabel>
                Total payé
              </StatLabel>

              <StatValue>
                {totalPaid.toLocaleString(
                  "fr-FR",
                )}{" "}
                FCFA
              </StatValue>
            </div>
          </StatCard>

          <StatCard>
            <StatIcon>
              <FiClock />
            </StatIcon>

            <div>
              <StatLabel>
                Reste à payer
              </StatLabel>

              <StatValue>
                {remaining.toLocaleString(
                  "fr-FR",
                )}{" "}
                FCFA
              </StatValue>
            </div>
          </StatCard>
        </StatsGrid>

        {/* =====================================================
            PROGRESSION GLOBALE
        ===================================================== */}

        {totalAmount > 0 && (
          <ProgressCard>
            <ProgressHeader>
              <div>
                <ProgressTitle>
                  Progression de vos paiements
                </ProgressTitle>

                <ProgressSubtitle>
                  {totalPaid.toLocaleString(
                    "fr-FR",
                  )}{" "}
                  FCFA sur{" "}
                  {totalAmount.toLocaleString(
                    "fr-FR",
                  )}{" "}
                  FCFA
                </ProgressSubtitle>
              </div>

              <ProgressPercentage>
                {progress}%
              </ProgressPercentage>
            </ProgressHeader>

            <GlobalProgressTrack>
              <GlobalProgressBar
                $progress={progress}
              />
            </GlobalProgressTrack>
          </ProgressCard>
        )}

        {/* =====================================================
            PRÉCOMMANDES
        ===================================================== */}

        {precommandes.length > 0 && (
          <Section>
            <SectionHeader>
              <div>
                <SectionEyebrow>
                  MES PRÉCOMMANDES
                </SectionEyebrow>

                <SectionTitle>
                  Précommandes
                </SectionTitle>
              </div>

              <SectionCount>
                {precommandes.length}
              </SectionCount>
            </SectionHeader>

            <CardsList>
              {precommandes.map(
                (precommande) => {
                  const isOpen =
                    expandedPrecommandes[
                      precommande._id
                    ];

                  const depot =
                    getPaiementDepot(
                      precommande,
                    );

                  const solde =
                    getPaiementSolde(
                      precommande,
                    );

                  return (
                    <OrderCard
                      key={precommande._id}
                    >
                      <OrderTop>
                        <OrderMain>
                          <OrderIconBox>
                            <FiShoppingBag />
                          </OrderIconBox>

                          <div>
                            <OrderLabel>
                              PRÉCOMMANDE
                            </OrderLabel>

                            <OrderNumber>
                              #
                              {precommande._id
                                .slice(-8)
                                .toUpperCase()}
                            </OrderNumber>

                            <OrderDate>
                              {precommande.createdAt
                                ? new Date(
                                    precommande.createdAt,
                                  ).toLocaleDateString(
                                    "fr-FR",
                                  )
                                : ""}
                            </OrderDate>
                          </div>
                        </OrderMain>

                        <OrderRight>
                          <Price>
                            {Number(
                              precommande.total ||
                                0,
                            ).toLocaleString(
                              "fr-FR",
                            )}{" "}
                            FCFA
                          </Price>

                          <ExpandButton
                            type="button"
                            onClick={() =>
                              setExpandedPrecommandes(
                                (prev) => ({
                                  ...prev,
                                  [precommande._id]:
                                    !prev[
                                      precommande
                                        ._id
                                    ],
                                }),
                              )
                            }
                          >
                            {isOpen ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </ExpandButton>
                        </OrderRight>
                      </OrderTop>

                      {isOpen && (
                        <OrderDetailsWrapper>
                          <ProductsList>
                            {(
                              precommande.panier ||
                              precommande.produits ||
                              []
                            ).map(
                              (
                                item,
                                index,
                              ) => (
                                <ProductRow
                                  key={
                                    item._id ||
                                    index
                                  }
                                >
                                  {item.image && (
                                    <ProductImage
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.nom ||
                                        "Produit"
                                      }
                                    />
                                  )}

                                  <ProductInfo>
                                    <strong>
                                      {item.nom ||
                                        item.title ||
                                        "Produit"}
                                    </strong>

                                    <span>
                                      Quantité :{" "}
                                      {item.quantite ||
                                        1}
                                    </span>
                                  </ProductInfo>

                                  <ProductPrice>
                                    {Number(
                                      item.prix ||
                                        item.price ||
                                        0,
                                    ).toLocaleString(
                                      "fr-FR",
                                    )}{" "}
                                    FCFA
                                  </ProductPrice>
                                </ProductRow>
                              ),
                            )}
                          </ProductsList>

                          {depot && (
                            <PaymentInfoBox>
                              <PaymentInfoHeader>
                                <FiCreditCard />

                                <strong>
                                  Acompte
                                </strong>
                              </PaymentInfoHeader>

                              <PaymentInfoRow>
                                <span>
                                  Statut
                                </span>

                                <PaymentStatus
                                  $status={
                                    depot.status
                                  }
                                >
                                  {getPaymentStatusLabel(
                                    depot.status,
                                  )}
                                </PaymentStatus>
                              </PaymentInfoRow>

                              {depot.montantEnvoye !=
                                null && (
                                <PaymentInfoRow>
                                  <span>
                                    Montant
                                  </span>

                                  <strong>
                                    {Number(
                                      depot.montantEnvoye,
                                    ).toLocaleString(
                                      "fr-FR",
                                    )}{" "}
                                    FCFA
                                  </strong>
                                </PaymentInfoRow>
                              )}

                              {depot.adminComment && (
                                <AdminComment>
                                  <strong>
                                    Commentaire :
                                  </strong>

                                  <span>
                                    {
                                      depot.adminComment
                                    }
                                  </span>
                                </AdminComment>
                              )}
                            </PaymentInfoBox>
                          )}

                          {solde && (
                            <PaymentInfoBox>
                              <PaymentInfoHeader>
                                <FiCreditCard />

                                <strong>
                                  Solde
                                </strong>
                              </PaymentInfoHeader>

                              <PaymentInfoRow>
                                <span>
                                  Statut
                                </span>

                                <PaymentStatus
                                  $status={
                                    solde.status
                                  }
                                >
                                  {getPaymentStatusLabel(
                                    solde.status,
                                  )}
                                </PaymentStatus>
                              </PaymentInfoRow>

                              {solde.montantEnvoye !=
                                null && (
                                <PaymentInfoRow>
                                  <span>
                                    Montant
                                  </span>

                                  <strong>
                                    {Number(
                                      solde.montantEnvoye,
                                    ).toLocaleString(
                                      "fr-FR",
                                    )}{" "}
                                    FCFA
                                  </strong>
                                </PaymentInfoRow>
                              )}

                              {solde.adminComment && (
                                <AdminComment>
                                  <strong>
                                    Commentaire :
                                  </strong>

                                  <span>
                                    {
                                      solde.adminComment
                                    }
                                  </span>
                                </AdminComment>
                              )}
                            </PaymentInfoBox>
                          )}

                          {solde &&
                            solde.status !==
                              "CONFIRMED" &&
                            solde.status !==
                              "PAID" && (
                              <SoldePaymentBox>
                                <h4>
                                  Payer le solde
                                </h4>

                                <form
                                  onSubmit={(e) =>
                                    handlePaySolde(
                                      e,
                                      precommande,
                                    )
                                  }
                                >
                                  <Input
                                    type="tel"
                                    placeholder="Numéro utilisé"
                                    value={
                                      soldeForm[
                                        precommande
                                          ._id
                                      ]?.numeroClient ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleSoldeChange(
                                        precommande._id,
                                        "numeroClient",
                                        e.target
                                          .value,
                                      )
                                    }
                                  />

                                  <Input
                                    type="number"
                                    placeholder="Montant envoyé"
                                    value={
                                      soldeForm[
                                        precommande
                                          ._id
                                      ]?.montantEnvoye ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleSoldeChange(
                                        precommande._id,
                                        "montantEnvoye",
                                        e.target
                                          .value,
                                      )
                                    }
                                  />

                                  <Input
                                    type="text"
                                    placeholder="Référence de transaction"
                                    value={
                                      soldeForm[
                                        precommande
                                          ._id
                                      ]?.reference ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleSoldeChange(
                                        precommande._id,
                                        "reference",
                                        e.target
                                          .value,
                                      )
                                    }
                                  />

                                  <PayNextButton
                                    type="submit"
                                    disabled={
                                      payingSolde[
                                        precommande
                                          ._id
                                      ]
                                    }
                                  >
                                    {payingSolde[
                                      precommande
                                        ._id
                                    ]
                                      ? "Envoi..."
                                      : "Payer le solde"}

                                    <FiArrowRight />
                                  </PayNextButton>
                                </form>
                              </SoldePaymentBox>
                            )}
                        </OrderDetailsWrapper>
                      )}
                    </OrderCard>
                  );
                },
              )}
            </CardsList>
          </Section>
        )}

        {/* =====================================================
            FAVORIS
        ===================================================== */}

        <Section id="favoris">
          <SectionHeader>
            <div>
              <SectionEyebrow>
                MA SÉLECTION
              </SectionEyebrow>

              <SectionTitle>
                Mes favoris
              </SectionTitle>
            </div>

            <SectionCount>
              {favorites.length}
            </SectionCount>
          </SectionHeader>

          {loading ? (
            <LoadingCard>
              <Loader />
              <LoadingText>
                Chargement...
              </LoadingText>
            </LoadingCard>
          ) : favorites.length === 0 ? (
            <EmptyCard>
              <FiHeart />

              <h3>
                Aucun favori
              </h3>

              <p>
                Ajoutez des produits à vos favoris
                pour les retrouver facilement.
              </p>

              <PrimaryLink to="/">
                Découvrir les produits
                <FiArrowRight />
              </PrimaryLink>
            </EmptyCard>
          ) : (
            <FavoritesGrid>
              {favorites.map(
                (favorite, index) => {
                  const product =
                    favorite.produitId ||
                    favorite.product ||
                    favorite;

                  const productId =
                    product?._id ||
                    favorite._id;

                  return (
                    <FavoriteCard
                      key={
                        productId || index
                      }
                    >
                      <FavoriteImageWrapper>
                        {product?.image ||
                        product?.images?.[0]
                          ?.url ? (
                          <FavoriteImage
                            src={
                              product.image ||
                              product
                                .images?.[0]
                                ?.url
                            }
                            alt={
                              product.title ||
                              product.nom ||
                              "Produit"
                            }
                          />
                        ) : (
                          <FavoritePlaceholder>
                            <FiShoppingBag />
                          </FavoritePlaceholder>
                        )}

                        <FavoriteDelete
                          type="button"
                          onClick={() =>
                            removeFavorite(
                              productId,
                            )
                          }
                        >
                          <FiTrash2 />
                        </FavoriteDelete>
                      </FavoriteImageWrapper>

                      <FavoriteContent>
                        <FavoriteName>
                          {product?.title ||
                            product?.nom ||
                            "Produit"}
                        </FavoriteName>

                        <FavoritePrice>
                          {Number(
                            product?.price ||
                              product?.prix ||
                              0,
                          ).toLocaleString(
                            "fr-FR",
                          )}{" "}
                          FCFA
                        </FavoritePrice>

                        {productId && (
                          <FavoriteLink
                            to={`/produit/${productId}`}
                          >
                            Voir le produit
                            <FiArrowRight />
                          </FavoriteLink>
                        )}
                      </FavoriteContent>
                    </FavoriteCard>
                  );
                },
              )}
            </FavoritesGrid>
          )}
        </Section>

        {/* =====================================================
            COMMANDES
        ===================================================== */}

        <Section id="commandes">
          <SectionHeader>
            <div>
              <SectionEyebrow>
                MON HISTORIQUE
              </SectionEyebrow>

              <SectionTitle>
                Mes commandes
              </SectionTitle>
            </div>

            <SectionCount>
              {commandes.length}
            </SectionCount>
          </SectionHeader>

          {loading ? (
            <LoadingCard>
              <Loader />
              <LoadingText>
                Chargement de vos commandes...
              </LoadingText>
            </LoadingCard>
          ) : commandes.length === 0 ? (
            <EmptyCard>
              <FiPackage />

              <h3>
                Aucune commande
              </h3>

              <p>
                Vous n'avez pas encore passé de
                commande.
              </p>

              <PrimaryLink to="/">
                Découvrir les produits
                <FiArrowRight />
              </PrimaryLink>
            </EmptyCard>
          ) : (
            <CardsList>
              {commandes.map((commande) => {
                /*
                 * IMPORTANT :
                 * On cherche le rejet AVANT de calculer
                 * le statut affiché.
                 */
                const paiementRejete =
                  getRejectedPayment(
                    commande,
                  );

                const statut =
                  commande.livraison?.statut ||
                  "NOT_STARTED";

                /*
                 * Le paiement rejeté est prioritaire
                 * sur le statut de livraison.
                 */
                const status =
                  paiementRejete
                    ? {
                        label:
                          "Paiement rejeté",
                        type: "danger",
                        icon: (
                          <FiCreditCard />
                        ),
                      }
                    : getStatus(statut);

                const isOpen =
                  expanded[commande._id];

                const hasLivreur =
                  Boolean(
                    commande.livraison
                      ?.livreurId,
                  );

                /*
                 * Si paiement rejeté :
                 * aucune raison de permettre le suivi.
                 */
                const canTrack =
                  !paiementRejete &&
                  (commande.modePaiement ===
                  "cod"
                    ? [
                        "CONFIRMED",
                        "SHIPPED",
                        "DELIVERED",
                      ].includes(
                        commande.statusCommande,
                      )
                    : [
                        "PAID",
                        "SHIPPED",
                        "DELIVERED",
                      ].includes(
                        commande.statusCommande,
                      ));

                return (
                  <OrderCard
                    key={commande._id}
                  >
                    {/* =================================================
                        ORDER HEADER
                    ================================================= */}

                    <OrderTop>
                      <OrderMain>
                        <OrderIconBox>
                          <FiPackage />
                        </OrderIconBox>

                        <div>
                          <OrderLabel>
                            COMMANDE
                          </OrderLabel>

                          <OrderNumber>
                            #
                            {commande._id
                              .slice(-8)
                              .toUpperCase()}
                          </OrderNumber>

                          <OrderDate>
                            {commande.createdAt
                              ? new Date(
                                  commande.createdAt,
                                ).toLocaleDateString(
                                  "fr-FR",
                                )
                              : ""}
                          </OrderDate>
                        </div>
                      </OrderMain>

                      <OrderRight>
                        <StatusBadge
                          $type={
                            status.type
                          }
                        >
                          {status.icon}
                          {status.label}
                        </StatusBadge>

                        <Price>
                          {Number(
                            commande.total ||
                              0,
                          ).toLocaleString(
                            "fr-FR",
                          )}{" "}
                          FCFA
                        </Price>

                        <ExpandButton
                          type="button"
                          onClick={() =>
                            setExpanded(
                              (prev) => ({
                                ...prev,
                                [commande._id]:
                                  !prev[
                                    commande._id
                                  ],
                              }),
                            )
                          }
                        >
                          {isOpen ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </ExpandButton>
                      </OrderRight>
                    </OrderTop>

                    {/* =================================================
                        DÉTAILS
                    ================================================= */}

                    {isOpen && (
                      <OrderDetailsWrapper>
                        {/* =============================================
                            PRODUITS
                        ============================================= */}

                        <ProductsList>
                          {(
                            commande.panier ||
                            []
                          ).map(
                            (
                              item,
                              index,
                            ) => (
                              <ProductRow
                                key={
                                  item._id ||
                                  index
                                }
                              >
                                {item.image && (
                                  <ProductImage
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.nom ||
                                      "Produit"
                                    }
                                  />
                                )}

                                <ProductInfo>
                                  <strong>
                                    {item.nom}
                                  </strong>

                                  <span>
                                    Quantité :{" "}
                                    {
                                      item.quantite
                                    }
                                  </span>

                                  {(item.couleur ||
                                    item.taille) && (
                                    <span>
                                      {item.couleur &&
                                        `Couleur : ${item.couleur}`}
                                      {item.couleur &&
                                        item.taille &&
                                        " · "}
                                      {item.taille &&
                                        `Taille : ${item.taille}`}
                                    </span>
                                  )}
                                </ProductInfo>

                                <ProductPrice>
                                  {Number(
                                    item.prix ||
                                      0,
                                  ).toLocaleString(
                                    "fr-FR",
                                  )}{" "}
                                  FCFA
                                </ProductPrice>
                              </ProductRow>
                            ),
                          )}
                        </ProductsList>

                        {/* =============================================
                            INFOS LIVRAISON
                        ============================================= */}

                        <DeliveryInfo>
                          <DeliveryInfoItem>
                            <FiMapPin />

                            <div>
                              <span>
                                Adresse
                              </span>

                              <strong>
                                {
                                  commande
                                    .client
                                    ?.adresse
                                }
                              </strong>
                            </div>
                          </DeliveryInfoItem>

                          <DeliveryInfoItem>
                            <FiSmartphone />

                            <div>
                              <span>
                                Téléphone
                              </span>

                              <strong>
                                {
                                  commande
                                    .client
                                    ?.numero
                                }
                              </strong>
                            </div>
                          </DeliveryInfoItem>

                          <DeliveryInfoItem>
                            <FiCreditCard />

                            <div>
                              <span>
                                Paiement
                              </span>

                              <strong>
                                {commande.modePaiement ===
                                "installments"
                                  ? "3 tranches"
                                  : commande.modePaiement ===
                                      "cod"
                                    ? "À la livraison"
                                    : "Paiement intégral"}
                              </strong>
                            </div>
                          </DeliveryInfoItem>
                        </DeliveryInfo>

                        {/* =============================================
                            🔴 PAIEMENT REJETÉ
                            
                            C'est ici que le client voit :
                            - le rejet
                            - la tranche
                            - le commentaire admin
                            - le bouton repayer
                        ============================================= */}

                        {paiementRejete && (
                          <RejectedPaymentBox>
                            <RejectedPaymentHeader>
                              <RejectedPaymentIcon>
                                <FiCreditCard />
                              </RejectedPaymentIcon>

                              <div>
                                <RejectedPaymentTitle>
                                  Paiement rejeté
                                </RejectedPaymentTitle>

                                <RejectedPaymentSubtitle>
                                  Votre paiement n'a
                                  pas été validé par
                                  notre équipe.
                                </RejectedPaymentSubtitle>
                              </div>
                            </RejectedPaymentHeader>

                            {paiementRejete.step && (
                              <RejectedPaymentStep>
                                <strong>
                                  Tranche concernée :
                                </strong>

                                <span>
                                  Tranche{" "}
                                  {
                                    paiementRejete.step
                                  }
                                </span>
                              </RejectedPaymentStep>
                            )}

                            <RejectedPaymentReason>
                              <strong>
                                Motif / commentaire
                                de l'administration
                              </strong>

                              <p>
                                {paiementRejete.adminComment?.trim() ||
                                  "Votre paiement n'a pas été validé. Veuillez effectuer un nouveau paiement."}
                              </p>
                            </RejectedPaymentReason>

                            <RejectedPaymentMessage>
                              Vous pouvez effectuer
                              un nouveau paiement
                              avec les informations
                              correctes.
                            </RejectedPaymentMessage>

                            <RepayButton
                              type="button"
                              onClick={() =>
                                handleRepay(
                                  commande,
                                )
                              }
                            >
                              Repayer maintenant
                              <FiArrowRight />
                            </RepayButton>
                          </RejectedPaymentBox>
                        )}

                        {/* =============================================
                            PAIEMENTS EN 3 TRANCHES
                        ============================================= */}

                        {commande.modePaiement ===
                          "installments" && (
                          <InstallmentPaymentBox>
                            <InstallmentHeader>
                              <div>
                                <h4>
                                  Paiement en 3
                                  tranches
                                </h4>

                                <span>
                                  Suivez l'état de
                                  chaque paiement.
                                </span>
                              </div>

                              <FiCreditCard />
                            </InstallmentHeader>

                            {(
                              commande.paiements ||
                              []
                            ).map(
                              (paiement) => {
                                const paiementRecu =
                                  (
                                    commande.paiementsRecus ||
                                    []
                                  )
                                    .slice()
                                    .reverse()
                                    .find(
                                      (p) =>
                                        Number(
                                          p.step,
                                        ) ===
                                          Number(
                                            paiement.step,
                                          ) &&
                                        p.status ===
                                          "REJECTED",
                                    );

                                const isRejected =
                                  Boolean(
                                    paiementRecu,
                                  );

                                return (
                                  <PaymentStep
                                    key={
                                      paiement.step
                                    }
                                  >
                                    <div>
                                      <strong>
                                        Tranche{" "}
                                        {
                                          paiement.step
                                        }
                                      </strong>

                                      <span>
                                        {Number(
                                          paiement.amountExpected ||
                                            0,
                                        ).toLocaleString(
                                          "fr-FR",
                                        )}{" "}
                                        FCFA
                                      </span>

                                      {isRejected &&
                                        paiementRecu
                                          ?.adminComment && (
                                          <PaymentComment>
                                            {
                                              paiementRecu.adminComment
                                            }
                                          </PaymentComment>
                                        )}
                                    </div>

                                    <PaymentStatus
                                      $status={
                                        isRejected
                                          ? "REJECTED"
                                          : paiement.status
                                      }
                                    >
                                      {isRejected
                                        ? "❌ Rejetée"
                                        : getPaymentStatusLabel(
                                            paiement.status,
                                          )}
                                    </PaymentStatus>
                                  </PaymentStep>
                                );
                              },
                            )}

                            {(() => {
                              const prochaineTranche =
                                (
                                  commande.paiements ||
                                  []
                                ).find(
                                  (p) =>
                                    p.status !==
                                    "PAID",
                                );

                              if (
                                !prochaineTranche
                              ) {
                                return (
                                  <PaymentComplete>
                                    <FiCheckCircle />

                                    Paiement
                                    entièrement
                                    confirmé
                                  </PaymentComplete>
                                );
                              }

                              /*
                               * Si la prochaine tranche
                               * correspond au paiement rejeté,
                               * on affiche explicitement REPAYER.
                               */
                              const isRejected =
                                paiementRejete &&
                                Number(
                                  paiementRejete.step,
                                ) ===
                                  Number(
                                    prochaineTranche.step,
                                  );

                              if (
                                prochaineTranche.status ===
                                  "PENDING" &&
                                !isRejected
                              ) {
                                return (
                                  <PaymentWaiting>
                                    <FiClock />

                                    Votre paiement
                                    est en attente
                                    de validation par
                                    notre équipe.
                                  </PaymentWaiting>
                                );
                              }

                              return (
                                <PayNextButton
                                  type="button"
                                  onClick={() =>
                                    handleRepay(
                                      commande,
                                    )
                                  }
                                >
                                  {isRejected
                                    ? `Repayer la tranche ${prochaineTranche.step}`
                                    : `Payer la tranche ${prochaineTranche.step}`}

                                  <FiArrowRight />
                                </PayNextButton>
                              );
                            })()}
                          </InstallmentPaymentBox>
                        )}

                        {/* =============================================
                            SUIVI LIVRAISON
                            
                            Pas de suivi si paiement rejeté.
                        ============================================= */}

                        {canTrack && (
                          <TrackingBox>
                            <TrackingHeader>
                              <div>
                                <TrackingTitle>
                                  Suivi de la
                                  livraison
                                </TrackingTitle>

                                <TrackingSubtitle>
                                  {hasLivreur
                                    ? "Votre commande est prise en charge."
                                    : "Votre commande est en cours de préparation."}
                                </TrackingSubtitle>
                              </div>

                              <FiTruck />
                            </TrackingHeader>

                            <TrackingStatus>
                              <StatusDot
                                $type={
                                  status.type
                                }
                              />

                              <span>
                                {status.label}
                              </span>
                            </TrackingStatus>

                            {hasLivreur &&
                              commande
                                .livraison
                                ?.livreur && (
                                <LivreurInfo>
                                  <LivreurAvatar>
                                    <FiUser />
                                  </LivreurAvatar>

                                  <div>
                                    <span>
                                      Votre
                                      livreur
                                    </span>

                                    <strong>
                                      {commande
                                        .livraison
                                        .livreur
                                        .username ||
                                        "Livreur"}
                                    </strong>
                                  </div>
                                </LivreurInfo>
                              )}

                            <TrackButton
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/suivi-commande/${commande._id}`,
                                )
                              }
                            >
                              Suivre ma commande
                              <FiArrowRight />
                            </TrackButton>
                          </TrackingBox>
                        )}
                      </OrderDetailsWrapper>
                    )}
                  </OrderCard>
                );
              })}
            </CardsList>
          )}
        </Section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Footer>
          <FooterBrand>
            NUMA
          </FooterBrand>

          <FooterText>
            Votre espace client · Toutes vos
            commandes au même endroit.
          </FooterText>
        </Footer>
      </Container>
    </Page>
  );
};

export default CompteClient;

/* =========================================================
   STYLES
========================================================= */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) =>
    theme.background || "#f7f6f2"};
  color: ${({ theme }) =>
    theme.text || "#171717"};
  padding: 35px 20px 70px;
`;

const Container = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 35px;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div``;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #9a7b43;
  margin-bottom: 12px;

  span {
    width: 22px;
    height: 1px;
    background: #bfa06a;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  margin: 12px 0 0;
  color: #777;
  font-size: 15px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NotificationButton = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.card || "#fff"};
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 18px;
`;

const NotificationCount = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #b42318;
  color: white;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const LogoutButton = styled.button`
  height: 44px;
  padding: 0 15px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.card || "#fff"};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
`;

const AccountNav = styled.div`
  display: flex;
  gap: 8px;
  padding: 7px;
  margin-bottom: 25px;
  border-radius: 15px;
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: fit-content;

  @media (max-width: 600px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const AccountNavItem = styled.button`
  border: none;
  background: ${({ $active }) =>
    $active ? "#171717" : "transparent"};
  color: ${({ $active }) =>
    $active ? "#fff" : "#777"};
  padding: 11px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #f5f0e7;
  color: #8a6b39;
  font-size: 18px;
`;

const StatLabel = styled.span`
  display: block;
  font-size: 11px;
  color: #888;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatValue = styled.strong`
  display: block;
  font-size: 17px;
`;

const ProgressCard = styled.div`
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 45px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const ProgressTitle = styled.strong`
  display: block;
  font-size: 15px;
`;

const ProgressSubtitle = styled.span`
  display: block;
  color: #888;
  font-size: 12px;
  margin-top: 4px;
`;

const ProgressPercentage = styled.strong`
  font-size: 20px;
  color: #8a6b39;
`;

const GlobalProgressTrack = styled.div`
  height: 9px;
  border-radius: 999px;
  background: #ece9e2;
  overflow: hidden;
`;

const GlobalProgressBar = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: #bfa06a;
  border-radius: inherit;
  transition: width 0.4s ease;
`;

const Section = styled.section`
  margin-bottom: 55px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
`;

const SectionEyebrow = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #a08048;
  margin-bottom: 6px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 25px;
  letter-spacing: -0.03em;
`;

const SectionCount = styled.div`
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eeeae2;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const OrderCard = styled.div`
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  overflow: hidden;
`;

const OrderTop = styled.div`
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const OrderMain = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const OrderIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #f5f0e7;
  color: #8b6a38;
`;

const OrderLabel = styled.div`
  font-size: 9px;
  letter-spacing: 0.14em;
  font-weight: 800;
  color: #999;
`;

const OrderNumber = styled.strong`
  display: block;
  margin-top: 2px;
  font-size: 15px;
`;

const OrderDate = styled.span`
  display: block;
  color: #999;
  font-size: 11px;
  margin-top: 3px;
`;

const OrderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  @media (max-width: 700px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Price = styled.strong`
  white-space: nowrap;
  font-size: 14px;
`;

const ExpandButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;

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
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 11px;
  object-fit: cover;
  background: #f4f2ed;
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;

  strong {
    font-size: 13px;
  }

  span {
    font-size: 11px;
    color: #888;
  }
`;

const ProductPrice = styled.strong`
  font-size: 13px;
  white-space: nowrap;
`;

const DeliveryInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const DeliveryInfoItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 13px;
  border-radius: 13px;
  background: #f8f7f4;

  > svg {
    color: #9a7b43;
    margin-top: 2px;
  }

  div {
    min-width: 0;
  }

  span,
  strong {
    display: block;
  }

  span {
    font-size: 10px;
    color: #999;
    margin-bottom: 3px;
  }

  strong {
    font-size: 12px;
    word-break: break-word;
  }
`;

/* =========================================================
   REJET PAIEMENT
========================================================= */

const RejectedPaymentBox = styled.div`
  margin-top: 18px;
  padding: 19px;
  border-radius: 18px;
  background: #fff0f0;
  border: 1px solid #ffd2d2;
  color: #8f211a;
`;

const RejectedPaymentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const RejectedPaymentIcon = styled.div`
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 12px;
  background: #b42318;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 18px;
`;

const RejectedPaymentTitle = styled.strong`
  display: block;
  font-size: 16px;
  color: #a21d15;
`;

const RejectedPaymentSubtitle = styled.span`
  display: block;
  margin-top: 4px;
  color: #a45a55;
  font-size: 12px;
  line-height: 1.5;
`;

const RejectedPaymentStep = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 15px;
  font-size: 12px;

  span {
    font-weight: 800;
  }
`;

const RejectedPaymentReason = styled.div`
  margin-top: 14px;
  padding: 13px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);

  strong {
    display: block;
    font-size: 11px;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #71332f;
  }
`;

const RejectedPaymentMessage = styled.p`
  margin: 13px 0 0;
  font-size: 12px;
  line-height: 1.5;
`;

const RepayButton = styled.button`
  margin-top: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 17px;
  border: none;
  border-radius: 11px;
  background: #b42318;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* =========================================================
   INSTALLMENTS
========================================================= */

const InstallmentPaymentBox = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  background: ${({ theme }) =>
    theme.cardSecondary || "#f5f5f5"};
`;

const InstallmentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 8px;

  h4 {
    margin: 0;
    font-size: 15px;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #888;
    font-size: 11px;
  }

  > svg {
    color: #8a6b39;
    font-size: 19px;
  }
`;

const PaymentStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    font-size: 13px;
  }

  span {
    font-size: 11px;
    color: #888;
  }
`;

const PaymentStatus = styled.span`
  font-weight: 800 !important;
  font-size: 11px !important;

  color: ${({ $status }) => {
    if (
      $status === "PAID" ||
      $status === "CONFIRMED"
    ) {
      return "#18733a";
    }

    if ($status === "REJECTED") {
      return "#b42318";
    }

    if ($status === "PENDING") {
      return "#9a6b00";
    }

    return "#777";
  }} !important;
`;

const PaymentComment = styled.span`
  max-width: 420px;
  color: #b42318 !important;
  font-size: 10px !important;
  line-height: 1.4;
`;

const PaymentComplete = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #18733a;
  font-weight: 800;
  font-size: 12px;
`;

const PaymentWaiting = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 10px;
  background: #fff7df;
  color: #8a6500;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
`;

const PayNextButton = styled.button`
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #171717;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  font-size: 12px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* =========================================================
   TRACKING
========================================================= */

const TrackingBox = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  background: #f8f7f4;
`;

const TrackingHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  > svg {
    color: #8a6b39;
    font-size: 20px;
  }
`;

const TrackingTitle = styled.strong`
  display: block;
  font-size: 14px;
`;

const TrackingSubtitle = styled.span`
  display: block;
  margin-top: 4px;
  color: #888;
  font-size: 11px;
`;

const TrackingStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 12px;
  font-weight: 800;
`;

const StatusDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $type }) => {
    if ($type === "success") return "#18733a";
    if ($type === "blue") return "#2467a8";
    if ($type === "danger") return "#b42318";
    return "#c0922d";
  }};
`;

const LivreurInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 11px;
  border-radius: 11px;
  background: #fff;

  span,
  strong {
    display: block;
  }

  span {
    font-size: 10px;
    color: #999;
  }

  strong {
    font-size: 12px;
    margin-top: 2px;
  }
`;

const LivreurAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f0ece4;
  color: #8a6b39;
`;

const TrackButton = styled.button`
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #171717;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  cursor: pointer;
  font-size: 12px;
`;

/* =========================================================
   PAYMENT INFO
========================================================= */

const PaymentInfoBox = styled.div`
  margin-top: 16px;
  padding: 17px;
  border-radius: 15px;
  background: #f8f7f4;
`;

const PaymentInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 13px;
  color: #8a6b39;

  strong {
    color: #222;
    font-size: 13px;
  }
`;

const PaymentInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 8px 0;
  font-size: 12px;

  > span {
    color: #888;
  }
`;

const AdminComment = styled.div`
  margin-top: 10px;
  padding: 11px;
  border-radius: 10px;
  background: #fff;

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 10px;
    margin-bottom: 4px;
  }

  span {
    font-size: 12px;
    color: #555;
    line-height: 1.5;
  }
`;

const SoldePaymentBox = styled.div`
  margin-top: 18px;
  padding: 18px;
  border-radius: 15px;
  background: #f8f7f4;

  h4 {
    margin: 0 0 14px;
    font-size: 14px;
  }

  form {
    display: grid;
    gap: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 10px;
  padding: 12px 13px;
  outline: none;
  font-size: 13px;

  &:focus {
    border-color: #bfa06a;
  }
`;

/* =========================================================
   FAVORIS
========================================================= */

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FavoriteCard = styled.div`
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 17px;
  overflow: hidden;
`;

const FavoriteImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #f5f3ee;
`;

const FavoriteImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FavoritePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #aaa;
  font-size: 25px;
`;

const FavoriteDelete = styled.button`
  position: absolute;
  top: 9px;
  right: 9px;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.92);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #b42318;
`;

const FavoriteContent = styled.div`
  padding: 14px;
`;

const FavoriteName = styled.strong`
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
`;

const FavoritePrice = styled.div`
  font-size: 13px;
  font-weight: 800;
`;

const FavoriteLink = styled(Link)`
  margin-top: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  color: #8a6b39;
  text-decoration: none;
  font-size: 11px;
  font-weight: 800;
`;

/* =========================================================
   EMPTY / LOADING
========================================================= */

const EmptyCard = styled.div`
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 45px 20px;
  text-align: center;

  > svg {
    font-size: 30px;
    color: #bfa06a;
  }

  h2,
  h3 {
    margin: 13px 0 7px;
  }

  p {
    margin: 0 auto 18px;
    max-width: 430px;
    color: #888;
    font-size: 13px;
    line-height: 1.5;
  }
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 17px;
  border-radius: 10px;
  background: #171717;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
`;

const LoadingCard = styled.div`
  background: ${({ theme }) =>
    theme.card || "#fff"};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 45px 20px;
  text-align: center;
`;

const Loader = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #e6e1d8;
  border-top-color: #8a6b39;
  border-radius: 50%;
  margin: 0 auto 12px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin: 0;
  color: #888;
  font-size: 13px;
`;

/* =========================================================
   FOOTER
========================================================= */

const Footer = styled.footer`
  padding-top: 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FooterBrand = styled.strong`
  font-size: 18px;
  letter-spacing: 0.12em;
`;

const FooterText = styled.span`
  color: #999;
  font-size: 11px;
`;