// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";

// // =====================================================
// // STYLES
// // =====================================================

// const Page = styled.main`
//   min-height: 100vh;
//   background: #080808;
//   color: #fff;
// `;

// const Hero = styled.section`
//   min-height: 55vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   padding: 80px 20px 50px;
//   background:
//     radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 45%),
//     #080808;
// `;

// const HeroContent = styled.div`
//   max-width: 760px;
// `;

// const Eyebrow = styled.div`
//   font-size: 12px;
//   letter-spacing: 4px;
//   text-transform: uppercase;
//   color: #aaa;
//   margin-bottom: 18px;
// `;

// const HeroTitle = styled.h1`
//   margin: 0;
//   font-size: clamp(42px, 8vw, 82px);
//   line-height: 0.95;
//   font-weight: 700;
//   letter-spacing: -3px;
// `;

// const HeroText = styled.p`
//   margin: 25px auto 0;
//   max-width: 600px;
//   color: #aaa;
//   font-size: 16px;
//   line-height: 1.7;
// `;

// const ModelsContainer = styled.section`
//   width: 100%;
// `;

// const ModelCard = styled.article`
//   position: relative;
//   height: 92vh;
//   min-height: 620px;
//   overflow: hidden;
//   background: #111;
//   isolation: isolate;

//   @media (max-width: 700px) {
//     height: 88vh;
//     min-height: 600px;
//   }
// `;

// const Media = styled.div`
//   position: absolute;
//   inset: 0;
//   z-index: -2;
//   background: #111;
// `;

// const ProductImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;

//   opacity: ${(props) => (props.$visible ? 1 : 0)};
//   transition: opacity 0.45s ease;
// `;

// const ProductVideo = styled.video`
//   position: absolute;
//   inset: 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;

//   opacity: ${(props) => (props.$visible ? 1 : 0)};
//   transition: opacity 0.45s ease;
// `;

// const Overlay = styled.div`
//   position: absolute;
//   inset: 0;
//   z-index: -1;

//   background:
//     linear-gradient(
//       to bottom,
//       rgba(0, 0, 0, 0.08) 0%,
//       rgba(0, 0, 0, 0.05) 35%,
//       rgba(0, 0, 0, 0.2) 50%,
//       rgba(0, 0, 0, 0.9) 100%
//     );
// `;

// const TopInfo = styled.div`
//   position: absolute;
//   top: 28px;
//   left: 28px;
//   right: 28px;

//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   gap: 15px;

//   @media (max-width: 600px) {
//     top: 18px;
//     left: 18px;
//     right: 18px;
//   }
// `;

// const Badge = styled.span`
//   display: inline-flex;
//   align-items: center;
//   padding: 8px 13px;
//   border-radius: 999px;

//   background: rgba(255, 255, 255, 0.12);
//   border: 1px solid rgba(255, 255, 255, 0.18);

//   backdrop-filter: blur(12px);

//   font-size: 11px;
//   font-weight: 700;
//   letter-spacing: 1.5px;
//   text-transform: uppercase;
// `;

// const Counter = styled.span`
//   font-size: 12px;
//   color: rgba(255, 255, 255, 0.75);
//   padding: 8px 12px;

//   border-radius: 999px;
//   background: rgba(0, 0, 0, 0.25);
//   backdrop-filter: blur(10px);
// `;

// const Content = styled.div`
//   position: absolute;
//   left: 0;
//   right: 0;
//   bottom: 0;

//   padding: 50px 7vw 55px;

//   @media (max-width: 700px) {
//     padding: 35px 20px 30px;
//   }
// `;

// const ProductTitle = styled.h2`
//   margin: 0;
//   font-size: clamp(30px, 5vw, 58px);
//   line-height: 1;
//   letter-spacing: -1.5px;
// `;

// const Description = styled.p`
//   max-width: 650px;
//   margin: 16px 0 22px;

//   color: rgba(255, 255, 255, 0.72);
//   font-size: 15px;
//   line-height: 1.6;
// `;

// const InfoRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 10px;
//   margin-bottom: 24px;
// `;

// const Info = styled.div`
//   padding: 10px 13px;
//   border-radius: 10px;

//   background: rgba(255, 255, 255, 0.09);
//   border: 1px solid rgba(255, 255, 255, 0.12);

//   backdrop-filter: blur(12px);

//   font-size: 13px;
//   color: rgba(255, 255, 255, 0.85);

//   strong {
//     color: #fff;
//   }
// `;

// const ActionRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;
//   flex-wrap: wrap;
// `;

// const PreorderButton = styled.button`
//   border: none;
//   border-radius: 999px;

//   padding: 15px 25px;

//   background: #fff;
//   color: #000;

//   font-size: 14px;
//   font-weight: 700;

//   cursor: pointer;

//   transition:
//     transform 0.2s ease,
//     background 0.2s ease;

//   &:hover {
//     transform: translateY(-2px);
//     background: #eee;
//   }

//   &:active {
//     transform: translateY(0);
//   }
// `;

// const Price = styled.div`
//   font-size: 17px;
//   font-weight: 600;
// `;

// const Empty = styled.div`
//   min-height: 40vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 50px 20px;

//   color: #888;
//   text-align: center;
// `;

// const Loader = styled.div`
//   min-height: 40vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   color: #aaa;
//   font-size: 14px;
// `;

// const ErrorMessage = styled.div`
//   min-height: 40vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   padding: 30px;
//   text-align: center;

//   color: #ff8b8b;
// `;

// // =====================================================
// // COMPOSANT
// // =====================================================

// function Precommande() {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ===================================================
//   // RÉCUPÉRATION DES MODÈLES
//   // ===================================================

//   useEffect(() => {
//     const fetchPrecommandes = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/precommandes/modeles`,
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(
//             data.message || "Impossible de récupérer les précommandes.",
//           );
//         }

//         setProducts(Array.isArray(data) ? data : data.modeles || []);
//       } catch (err) {
//         console.error("Erreur précommandes :", err);
//         setError(
//           err.message || "Une erreur est survenue lors du chargement.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrecommandes();
//   }, []);

//   // ===================================================
//   // CHARGEMENT
//   // ===================================================

//   if (loading) {
//     return (
//       <Page>
//         <Loader>Chargement des prochains modèles...</Loader>
//       </Page>
//     );
//   }

//   // ===================================================
//   // ERREUR
//   // ===================================================

//   if (error) {
//     return (
//       <Page>
//         <ErrorMessage>{error}</ErrorMessage>
//       </Page>
//     );
//   }

//   // ===================================================
//   // AUCUN PRODUIT
//   // ===================================================

//   if (!products.length) {
//     return (
//       <Page>
//         <Hero>
//           <HeroContent>
//             <Eyebrow>NUMA</Eyebrow>

//             <HeroTitle>
//               Prochainement
//             </HeroTitle>

//             <HeroText>
//               Aucun modèle n'est actuellement disponible en précommande.
//               Revenez bientôt pour découvrir les prochaines sorties.
//             </HeroText>
//           </HeroContent>
//         </Hero>
//       </Page>
//     );
//   }

//   // ===================================================
//   // AFFICHAGE
//   // ===================================================

//   return (
//     <Page>
//       <Hero>
//         <HeroContent>
//           <Eyebrow>NUMA — PRECOMMANDE</Eyebrow>

//           <HeroTitle>
//             Les prochains
//             <br />
//             modèles.
//           </HeroTitle>

//           <HeroText>
//             Découvrez en avant-première les prochaines pièces NUMA.
//             Faites votre choix maintenant et réservez votre modèle avant
//             sa disponibilité.
//           </HeroText>
//         </HeroContent>
//       </Hero>

//       <ModelsContainer>
//         {products.map((product, index) => (
//           <PrecommandeCard
//             key={product._id}
//             product={product}
//             index={index}
//             total={products.length}
//             onPreorder={() => {
//               /*
//                * LE PAIEMENT RESTE SUR TA PAGE SÉPARÉE.
//                *
//                * Ici on transmet simplement le produit sélectionné.
//                *
//                * Si ta page paiement utilise une autre route,
//                * modifie uniquement "/paiement".
//                */
//               navigate("/paiement", {
//                 state: {
//                   produit: product,
//                   type: "precommande",
//                 },
//               });
//             }}
//           />
//         ))}
//       </ModelsContainer>
//     </Page>
//   );
// }

// // =====================================================
// // CARD PRODUIT
// // =====================================================

// function PrecommandeCard({
//   product,
//   index,
//   total,
//   onPreorder,
// }) {
//   const cardRef = useRef(null);
//   const videoRef = useRef(null);

//   const [isVisible, setIsVisible] = useState(false);

//   // ===================================================
//   // OBSERVER SCROLL
//   // ===================================================

//   useEffect(() => {
//     const element = cardRef.current;

//     if (!element) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         const visible = entry.isIntersecting;

//         setIsVisible(visible);

//         if (visible) {
//           const video = videoRef.current;

//           if (video) {
//             video.currentTime = 0;

//             const playPromise = video.play();

//             if (playPromise !== undefined) {
//               playPromise.catch(() => {
//                 // Certains navigateurs peuvent bloquer la lecture.
//               });
//             }
//           }
//         } else {
//           const video = videoRef.current;

//           if (video) {
//             video.pause();
//             video.currentTime = 0;
//           }
//         }
//       },
//       {
//         threshold: 0.65,
//       },
//     );

//     observer.observe(element);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   // ===================================================
//   // IMAGE PRINCIPALE
//   // ===================================================

//   const mainImage =
//     product.images?.find((image) => image.isMain)?.url ||
//     product.images?.[0]?.url ||
//     "";

//   // ===================================================
//   // VIDÉO
//   // ===================================================

//   const video =
//     product.videoId && typeof product.videoId === "object"
//       ? product.videoId
//       : null;

//   const hasVideo = Boolean(video?.url);

//   // ===================================================
//   // MONTANT DU DÉPÔT
//   // ===================================================

//   const deposit =
//     product.montantDepot !== null &&
//     product.montantDepot !== undefined &&
//     product.montantDepot !== ""
//       ? Number(product.montantDepot)
//       : Math.ceil(Number(product.price || 0) * 0.3);

//   // ===================================================
//   // DATE DISPONIBILITÉ
//   // ===================================================

//   const formattedDate = product.dateDisponibilite
//     ? new Date(product.dateDisponibilite).toLocaleDateString("fr-FR", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       })
//     : null;

//   // ===================================================
//   // FORMAT PRIX
//   // ===================================================

//   const formatPrice = (value) => {
//     return new Intl.NumberFormat("fr-FR").format(Number(value || 0));
//   };

//   return (
//     <ModelCard ref={cardRef}>
//       <Media>
//         {/* IMAGE */}
//         {mainImage && (
//           <ProductImage
//             src={mainImage}
//             alt={product.title}
//             $visible={!isVisible || !hasVideo}
//             loading={index === 0 ? "eager" : "lazy"}
//           />
//         )}

//         {/* VIDÉO PRODUIT */}
//         {hasVideo && (
//           <ProductVideo
//             ref={videoRef}
//             src={video.url}
//             poster={video.thumbnail || mainImage}
//             muted
//             playsInline
//             loop
//             preload="metadata"
//             $visible={isVisible}
//           />
//         )}
//       </Media>

//       <Overlay />

//       {/* INFOS HAUT */}
//       <TopInfo>
//         <Badge>À venir</Badge>

//         <Counter>
//           {String(index + 1).padStart(2, "0")} /{" "}
//           {String(total).padStart(2, "0")}
//         </Counter>
//       </TopInfo>

//       {/* CONTENU */}
//       <Content>
//         <ProductTitle>{product.title}</ProductTitle>

//         {product.description && (
//           <Description>{product.description}</Description>
//         )}

//         <InfoRow>
//           <Info>
//             Prix : <strong>{formatPrice(product.price)} FCFA</strong>
//           </Info>

//           <Info>
//             Dépôt : <strong>{formatPrice(deposit)} FCFA</strong>
//           </Info>

//           {formattedDate && (
//             <Info>
//               Disponible le : <strong>{formattedDate}</strong>
//             </Info>
//           )}
//         </InfoRow>

//         <ActionRow>
//           <PreorderButton onClick={onPreorder}>
//             Précommander
//           </PreorderButton>

//           <Price>
//             {formatPrice(product.price)} FCFA
//           </Price>
//         </ActionRow>
//       </Content>
//     </ModelCard>
//   );
// }

// export default Precommande;