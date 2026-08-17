// import { useState, useEffect, useMemo, useContext, useRef } from "react";
// import styled, { keyframes } from "styled-components";
// import { Link } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaTruck,
//   FaShieldAlt,
//   FaUndo,
// } from "react-icons/fa";
// import { ThemeContext } from "../../Utils/Context";

// // ===============================
// // SCROLL REVEAL COMPONENT
// // ===============================
// function RevealOnScroll({ children }) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) setVisible(true);
//       },
//       { threshold: 0.15 }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0px)" : "translateY(40px)",
//         transition: "all 0.9s ease",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// // ===============================
// // ANIMATIONS
// // ===============================
// const fadeIn = keyframes`
//   from {opacity:0;}
//   to {opacity:1;}
// `;

// const slowZoom = keyframes`
//   from { transform: scale(1); }
//   to { transform: scale(1.08); }
// `;

// const floatUp = keyframes`
//   from { transform: translateY(16px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// `;

// // ===============================
// // WRAPPERS & SECTIONS
// // ===============================
// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 110px;
//   padding-bottom: 120px;
//   background: ${({ $isDark }) =>
//     $isDark
//       ? "linear-gradient(to bottom, #0b0b0b, #111, #161616)"
//       : "linear-gradient(to bottom, #fff, #f7f7f7, #fff)"};
//   color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};
// `;

// const SectionHeader = styled.div`
//   text-align: center;
//   margin-bottom: 26px;
//   padding: 0 20px;

//   span {
//     display: inline-block;
//     font-size: 0.85rem;
//     letter-spacing: 2px;
//     text-transform: uppercase;
//     opacity: 0.7;
//     margin-bottom: 12px;
//   }

//   h2 {
//     font-size: clamp(2rem, 4vw, 3rem);
//     margin-bottom: 12px;
//     font-weight: 700;
//   }

//   p {
//     max-width: 760px;
//     margin: 0 auto;
//     opacity: 0.75;
//     line-height: 1.7;
//   }
// `;

// // ===============================
// // HERO
// // ===============================
// const Hero = styled.div`
//   height: 100vh;
//   min-height: 720px;
//   position: relative;
//   overflow: hidden;

//   @media (max-width: 768px) {
//     min-height: 620px;
//     height: 100vh;
//   }
// `;

// const Slide = styled.div`
//   position: absolute;
//   inset: 0;
//   background-size: cover;
//   background-position: center;
//   opacity: ${(p) => (p.$active ? 1 : 0)};
//   transition: opacity 1s ease-in-out;
//   animation: ${slowZoom} 8s linear infinite alternate;
// `;

// const Overlay = styled.div`
//   position: absolute;
//   inset: 0;
//   background: linear-gradient(
//     to right,
//     rgba(0, 0, 0, 0.68),
//     rgba(0, 0, 0, 0.4),
//     rgba(0, 0, 0, 0.18)
//   );
// `;

// const HeroContent = styled.div`
//   position: absolute;
//   inset: 0;
//   display: flex;
//   align-items: center;
//   padding: 0 7%;
//   z-index: 2;
//   margin-top: 600px;
// `;

// const HeroText = styled.div`
//   color: white;
//   max-width: 760px;
//   animation: ${floatUp} 1s ease forwards;

//   h1 {
//     font-size: clamp(2.8rem, 5vw, 5.2rem);
//     line-height: 1.02;
//     margin-bottom: 18px;
//     animation: ${fadeIn} 1.2s ease forwards;
//     font-weight: 800;
//   }

//   p {
//     font-size: 1.08rem;
//     line-height: 1.8;
//     max-width: 600px;
//     opacity: 0.95;
//     margin-bottom: 10px;
//   }

//   @media (max-width: 768px) {
//     h1 {
//       font-size: 1.6rem;
//     }

//     p {
//       font-size: 1rem;
//     }
//   }
// `;

// const HeroActions = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-top: 30px;
//   flex-wrap: wrap;
// `;

// const HeroBtn = styled(Link)`
//   display: inline-flex;
//   align-items: center;
//   gap: 10px;
//   padding: 15px 28px;
//   color: white;
//   font-weight: 700;
//   text-decoration: none;
//   transition: all 0.3s ease;
  
//   &:hover {
//     transform: translateY(-3px) scale(1.02);
//   }
// `;


// // ===============================
// // FEATURE CARDS
// // ===============================
// const FeatureGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 28px;
//   width: min(1240px, 92%);
//   margin: 0 auto;

//   @media (max-width: 900px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const FeatureCard = styled.div`
//   position: relative;
//   overflow: hidden;
//   cursor: pointer;
//   min-height: 620px;
//   box-shadow: 0 18px 60px rgba(0, 0, 0, 0.14);

//   &:hover img {
//     transform: scale(1.05);
//   }

//   @media (max-width: 768px) {
//     min-height: 480px;
//   }
// `;

// const FeatureImg = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   transition: transform 0.7s ease;
// `;

// const FeatureOverlay = styled.div`
//   position: absolute;
//   inset: 0;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-end;
//   padding: 38px;
//   color: white;
//   background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.08));
// `;

// const FeatureBadge = styled.span`
//   display: inline-block;
//   width: fit-content;
//   margin-bottom: 16px;
//   padding: 9px 14px;
//   border-radius: 999px;
//   background: rgba(255,255,255,0.12);
//   border: 1px solid rgba(255,255,255,0.16);
//   font-size: 0.8rem;
//   font-weight: 700;
//   letter-spacing: 1px;
//   text-transform: uppercase;
// `;

// const FeatureText = styled.p`
//   font-size: 1.25rem;
//   font-weight: 500;
//   margin-bottom: 16px;
//   max-width: 360px;
//   line-height: 1.7;
// `;

// const FeatureLink = styled(Link)`
//   color: white;
//   text-decoration: none;
//   font-weight: bold;
//   font-size: 1.05rem;
//   display: inline-flex;
//   align-items: center;
//   gap: 8px;
//   width: fit-content;
//   padding-bottom: 3px;
//   border-bottom: 1px solid rgba(255, 255, 255, 0.35);

//   &:hover {
//     transform: translateX(6px);
//     transition: transform 0.3s;
//   }
// `;

// // ===============================
// // PREMIUM DOTS
// // ===============================
// const DotsRow = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 12px;
//   margin-top: 22px;
//   flex-wrap: wrap;
// `;

// const Dot = styled.button`
//   width: ${(p) => (p.$active ? "34px" : "12px")};
//   height: 12px;
//   border-radius: 999px;
//   border: none;
//   padding: 0;
//   cursor: pointer;
//   overflow: hidden;
//   position: relative;
//   background: ${({ $isDark, $active }) =>
//     $active
//       ? $isDark
//         ? "rgba(255,255,255,0.18)"
//         : "rgba(0,0,0,0.12)"
//       : $isDark
//       ? "rgba(255,255,255,0.08)"
//       : "rgba(0,0,0,0.08)"};
//   transition: all 0.35s ease;

//   &:hover {
//     transform: scale(1.08);
//   }
// `;

// const DotProgress = styled.div`
//   position: absolute;
//   inset: 0;
//   width: ${(p) => p.$width}%;
//   background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};
//   border-radius: 999px;
//   transition: width 0.08s linear;
// `;

// // ===============================
// // MINI CAROUSEL
// // ===============================
// const MiniCarouselSection = styled.div`
//   width: min(1240px, 92%);
//   margin: 0 auto;
// `;

// const MiniCarouselWrapper = styled.div`
//   width: 100%;
//   position: relative;
// `;

// const MiniCarousel = styled.div`
//   position: relative;
//   width: 100%;
//   height: 680px;
//   overflow: hidden;
//   box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);
//   background: ${({ $isDark }) => ($isDark ? "#111" : "#f6f6f6")};

//   @media (max-width: 768px) {
//     height: 500px;
//   }
// `;

// const MiniSlide = styled.div`
//   position: absolute;
//   inset: 0;
//   opacity: ${(p) => (p.$active ? 1 : 0)};
//   transition: opacity 0.8s ease;
//   pointer-events: ${(p) => (p.$active ? "auto" : "none")};
// `;

// const MiniSlideImg = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
//   object-position: center;
// `;

// const MiniOverlay = styled.div`
//   position: absolute;
//   bottom: 24px;
//   left: 24px;
//   right: 24px;
//   background: rgba(0,0,0,0.34);
//   backdrop-filter: blur(10px);
//   padding: 20px 22px;
//   border-radius: 22px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 18px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: flex-start;
//   }
// `;

// const MiniInfo = styled.div`
//   color: white;

//   h3 {
//     font-size: 2rem;
//     margin-bottom: 8px;
//   }

//   p {
//     font-size: 1.05rem;
//     font-weight: 500;
//     opacity: 0.95;
//   }

//   @media (max-width: 768px) {
//     h3 {
//       font-size: 1.3rem;
//     }

//     p {
//       font-size: 1rem;
//     }
//   }
// `;

// const MiniCTA = styled(Link)`
//   padding: 14px 24px;
//   background: white;
//   color: black;
//   font-weight: 700;
//   text-decoration: none;
//   border-radius: 999px;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-3px);
//   }
// `;

// // ===============================
// // BENEFITS
// // ===============================
// const BenefitsSection = styled.div`
//   width: min(1240px, 92%);
//   margin: 0 auto;
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 24px;

//   @media (max-width: 900px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const BenefitCard = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   padding: 30px;
//   gap: 16px;
//   border-radius: 26px;
//   background: ${({ $isDark }) =>
//     $isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.86)"};
//   border: 1px solid
//     ${({ $isDark }) =>
//       $isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
//   backdrop-filter: blur(14px);
//   box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
//   transition: all 0.35s ease;

//   &:hover {
//     transform: translateY(-8px);
//   }
// `;

// const BenefitIcon = styled.div`
//   width: 72px;
//   height: 72px;
//   border-radius: 20px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 28px;
//   background: ${({ $isDark }) =>
//     $isDark
//       ? "linear-gradient(135deg, #fff, #d6d6d6)"
//       : "linear-gradient(135deg, #111, #333)"};
//   color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
// `;

// const BenefitTitle = styled.div`
//   font-weight: 700;
//   font-size: 1.15rem;
// `;

// const BenefitText = styled.div`
//   font-size: 0.96rem;
//   opacity: 0.82;
//   line-height: 1.7;
// `;

// const Description = styled.p`
//   text-align: center;
//   font-weight: 500;
//   padding: 0 20px;
//   max-width: 900px;
//   margin: 0 auto;
//   line-height: 1.9;
//   font-size: 1.05rem;
//   opacity: 0.85;
// `;

// // ===============================
// // BEST SELLERS CAROUSEL
// // ===============================
// const BestSellerSection = styled.div`
//   width: min(1240px, 92%);
//   margin: 0 auto;
// `;

// const BestCarouselWrapper = styled.div`
//   position: relative;
//   width: 100%;
// `;

// const BestCarousel = styled.div`
//   position: relative;
//   width: 100%;
//   height: 720px;
//   overflow: hidden;
//   box-shadow: 0 22px 70px rgba(0, 0, 0, 0.18);
//   border-radius: 30px;
//   background: ${({ $isDark }) => ($isDark ? "#111" : "#f6f6f6")};

//   @media (max-width: 900px) {
//     height: 860px;
//   }

//   @media (max-width: 768px) {
//     height: 760px;
//   }
// `;

// const BestSlide = styled.div`
//   position: absolute;
//   inset: 0;
//   opacity: ${(p) => (p.$active ? 1 : 0)};
//   transition: opacity 0.8s ease;
//   pointer-events: ${(p) => (p.$active ? "auto" : "none")};
// `;

// const BestSlideInner = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   width: 100%;
//   height: 100%;

//   @media (max-width: 900px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const BestImageWrap = styled.div`
//   position: relative;
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
//   background: ${({ $isDark }) => ($isDark ? "#0d0d0d" : "#efefef")};
// `;

// const BestImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
//   object-position: center;
//   padding: 24px;
// `;

// const BestBadge = styled.div`
//   position: absolute;
//   top: 24px;
//   left: 24px;
//   padding: 10px 16px;
//   border-radius: 999px;
//   background: rgba(0,0,0,0.5);
//   color: white;
//   backdrop-filter: blur(10px);
//   border: 1px solid rgba(255,255,255,0.12);
//   font-size: 0.85rem;
//   font-weight: 700;
//   letter-spacing: 1px;
// `;

// const BestContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   padding: 60px;
//   background: ${({ $isDark }) =>
//     $isDark
//       ? "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))"
//       : "linear-gradient(135deg, #ffffff, #f2f2f2)"};

//   @media (max-width: 768px) {
//     padding: 30px;
//   }
// `;

// const BestSmall = styled.span`
//   display: inline-block;
//   margin-bottom: 14px;
//   font-size: 0.85rem;
//   letter-spacing: 2px;
//   text-transform: uppercase;
//   opacity: 0.7;
// `;

// const BestTitle = styled.h3`
//   font-size: clamp(2rem, 4vw, 3rem);
//   line-height: 1.1;
//   margin-bottom: 14px;
// `;

// const BestSubtitle = styled.p`
//   font-size: 1rem;
//   line-height: 1.9;
//   opacity: 0.8;
//   margin-bottom: 20px;
//   max-width: 500px;
// `;

// const BestPrice = styled.div`
//   font-size: 1.4rem;
//   font-weight: 800;
//   margin-bottom: 26px;
// `;

// const BestBtn = styled(Link)`
//   display: inline-flex;
//   align-items: center;
//   gap: 10px;
//   width: fit-content;
//   padding: 15px 24px;
//   border-radius: 999px;
//   background: ${({ $isDark }) => ($isDark ? "#fff" : "#111")};
//   color: ${({ $isDark }) => ($isDark ? "#111" : "#fff")};
//   text-decoration: none;
//   font-weight: 800;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-4px);
//   }
// `;

// // ===============================
// // MAIN COMPONENT
// // ===============================
// export default function HomePremium() {
//   const [products, setProducts] = useState([]);
//   const [slide, setSlide] = useState(0);

//   const [miniSlide, setMiniSlide] = useState(0);
//   const [miniProgress, setMiniProgress] = useState(0);

//   const [bestSlide, setBestSlide] = useState(0);
//   const [bestProgress, setBestProgress] = useState(0);

//   const { theme } = useContext(ThemeContext);
//   const $isDark = theme === "light"

//   const miniIntervalRef = useRef(null);
//   const bestIntervalRef = useRef(null);

//   const duration = 3800;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
//         const data = await res.json();
//         setProducts(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const heroProducts = useMemo(() => products.filter((p) => p.hero), [products]);
//   const carouselProducts = useMemo(() => products.slice(0, 5), [products]);
//   const bestSellers = useMemo(
//   () => products.filter((p) => p.badge?.toLowerCase() === "new").slice(0, 5),
//   [products]
// );

//   useEffect(() => {
//     if (!heroProducts.length) return;
//     const interval = setInterval(
//       () => setSlide((s) => (s + 1) % heroProducts.length),
//       4000
//     );
//     return () => clearInterval(interval);
//   }, [heroProducts]);

//   // MINI CAROUSEL AUTOPLAY
//   useEffect(() => {
//     if (carouselProducts.length <= 1) return;

//     const step = 100 / (duration / 50);

//     miniIntervalRef.current = setInterval(() => {
//       setMiniProgress((prev) => {
//         if (prev + step >= 100) {
//           setMiniSlide((s) => (s + 1) % carouselProducts.length);
//           return 0;
//         }
//         return prev + step;
//       });
//     }, 50);

//     return () => clearInterval(miniIntervalRef.current);
//   }, [carouselProducts.length]);

//   // BEST SELLERS AUTOPLAY
//   useEffect(() => {
//     if (bestSellers.length <= 1) return;

//     const step = 100 / (duration / 50);

//     bestIntervalRef.current = setInterval(() => {
//       setBestProgress((prev) => {
//         if (prev + step >= 100) {
//           setBestSlide((s) => (s + 1) % bestSellers.length);
//           return 0;
//         }
//         return prev + step;
//       });
//     }, 50);

//     return () => clearInterval(bestIntervalRef.current);
//   }, [bestSellers.length]);

//   const getImg = (p) =>
//     p.images?.[0]?.url?.startsWith("http")
//       ? p.images[0].url
//       : `${import.meta.env.VITE_API_URL}${p.images?.[0]?.url || ""}`;

//   return (
//     <Wrapper $isDark={$isDark}>
//       {/* HERO */}
//       <Hero>
//         {heroProducts.map((p, i) => (
//           <Slide
//             key={p._id}
//             $active={i === slide}
//             style={{ backgroundImage: `url(${getImg(p)})` }}
//           />
//         ))}
//         <Overlay />
//         <HeroContent>
//           <HeroText>
//             <h1>Une mode pensée pour séduire au premier regard.</h1>

//             <HeroActions>
//               <HeroBtn to="/collections">
//                 Explorer la collection <FaArrowRight />
//               </HeroBtn>
//             </HeroActions>
//           </HeroText>
//         </HeroContent>
//       </Hero>

//       {/* FEATURE CARDS */}
//       <RevealOnScroll>
//         <SectionHeader>
//           <span>Univers</span>
//           <h2>Des silhouettes qui imposent le style</h2>
//           <p>
//             Deux univers, une seule signature : l’élégance, la présence et le
//             détail qui fait la différence.
//           </p>
//         </SectionHeader>

//         <FeatureGrid>
//           {products
//             .filter((p) => p.genre?.toLowerCase() === "homme")
//             .slice(0, 1)
//             .map((p) => (
//               <FeatureCard key={p._id}>
//                 <FeatureImg src={getImg(p)} alt={p.title} />
//                 <FeatureOverlay>
//                   <FeatureBadge>Univers Homme</FeatureBadge>
//                   <FeatureText>
//                     Pour l’homme qui veut une allure forte, propre et assumée.
//                   </FeatureText>
//                   <FeatureLink to="/homme">
//                     Découvrir l’univers homme <FaArrowRight />
//                   </FeatureLink>
//                 </FeatureOverlay>
//               </FeatureCard>
//             ))}

//           {products
//             .filter((p) => p.genre?.toLowerCase() === "femme")
//             .slice(0, 1)
//             .map((p) => (
//               <FeatureCard key={p._id}>
//                 <FeatureImg src={getImg(p)} alt={p.title} />
//                 <FeatureOverlay>
//                   <FeatureBadge>Univers Femme</FeatureBadge>
//                   <FeatureText>
//                     Pour la femme qui veut captiver avec confiance et élégance.
//                   </FeatureText>
//                   <FeatureLink to="/femme">
//                     Découvrir l’univers femme <FaArrowRight />
//                   </FeatureLink>
//                 </FeatureOverlay>
//               </FeatureCard>
//             ))}
//         </FeatureGrid>
//       </RevealOnScroll>

//       {/* MINI CAROUSEL */}
//       <RevealOnScroll>
//         <MiniCarouselSection>
//           <SectionHeader>
//             <span>Focus</span>
//             <h2>Des pièces qui attirent le regard</h2>
//             <p>
//               Une mise en lumière de créations pensées pour marquer les esprits
//               dès le premier regard.
//             </p>
//           </SectionHeader>

//           <MiniCarouselWrapper>
//             <MiniCarousel $isDark={$isDark}>
//               {carouselProducts.map((p, i) => (
//                 <MiniSlide key={p._id} $active={i === miniSlide}>
//                   <MiniSlideImg src={getImg(p)} alt={p.title} />
//                   <MiniOverlay>
//                     <MiniInfo>
//                       <h3>{p.title}</h3>
//                       <p>{p.subtitle || "Une pièce signature à forte présence."}</p>
//                     </MiniInfo>
//                     <MiniCTA to={`/produit/${p._id}`}>Voir le produit</MiniCTA>
//                   </MiniOverlay>
//                 </MiniSlide>
//               ))}
//             </MiniCarousel>

//             <DotsRow>
//               {carouselProducts.map((_, i) => (
//                 <Dot
//                   key={i}
//                   $active={i === miniSlide}
//                   $isDark={$isDark}
//                   onClick={() => {
//                     setMiniSlide(i);
//                     setMiniProgress(0);
//                   }}
//                 >
//                   {i === miniSlide && (
//                     <DotProgress $width={miniProgress} $isDark={$isDark} />
//                   )}
//                 </Dot>
//               ))}
//             </DotsRow>
//           </MiniCarouselWrapper>
//         </MiniCarouselSection>
//       </RevealOnScroll>

//       {/* BEST SELLERS */}
//       <RevealOnScroll>
//         <BestSellerSection>
//           <SectionHeader>
//             <span>Best Sellers</span>
//             <h2>Les pièces les plus convoitées</h2>
//             <p>
//               Une sélection pensée pour celles et ceux qui veulent une allure
//               marquante, élégante et immédiatement mémorable.
//             </p>
//           </SectionHeader>

//           <BestCarouselWrapper>
//             <BestCarousel $isDark={$isDark}>
//               {bestSellers.map((p, i) => (
//                 <BestSlide key={p._id} $active={i === bestSlide}>
//                   <BestSlideInner>
//                     <BestImageWrap $isDark={$isDark}>
//                       <BestImage src={getImg(p)} alt={p.title} />
//                       <BestBadge>BEST SELLER</BestBadge>
//                     </BestImageWrap>

//                     <BestContent $isDark={$isDark}>
//                       <BestSmall>Collection Signature</BestSmall>
//                       <BestTitle>{p.title}</BestTitle>
//                       <BestSubtitle>
//                         {p.subtitle ||
//                           "Une pièce forte pensée pour révéler votre présence avec style, élégance et caractère."}
//                       </BestSubtitle>
//                       <BestPrice>{p.price} FCFA</BestPrice>

//                       <BestBtn to={`/produit/${p._id}`} $isDark={$isDark}>
//                         Voir le produit <FaArrowRight />
//                       </BestBtn>
//                     </BestContent>
//                   </BestSlideInner>
//                 </BestSlide>
//               ))}
//             </BestCarousel>

//             <DotsRow>
//               {bestSellers.map((_, i) => (
//                 <Dot
//                   key={i}
//                   $active={i === bestSlide}
//                   $isDark={$isDark}
//                   onClick={() => {
//                     setBestSlide(i);
//                     setBestProgress(0);
//                   }}
//                 >
//                   {i === bestSlide && (
//                     <DotProgress $width={bestProgress} $isDark={$isDark} />
//                   )}
//                 </Dot>
//               ))}
//             </DotsRow>
//           </BestCarouselWrapper>
//         </BestSellerSection>
//       </RevealOnScroll>

//       {/* BENEFITS */}
//       <RevealOnScroll>
//         <SectionHeader>
//           <span>Avantages</span>
//           <h2>Pourquoi choisir Numa ?</h2>
//           <Description>
//             Chaque pièce est pensée pour allier style, confort et durabilité. La
//             signature Numa, c’est l’assurance d’un vêtement qui vous accompagne
//             au quotidien.
//           </Description>
//         </SectionHeader>

//         <BenefitsSection>
//           <BenefitCard $isDark={$isDark}>
//             <BenefitIcon $isDark={$isDark}>
//               <FaTruck />
//             </BenefitIcon>
//             <BenefitTitle>Livraison rapide</BenefitTitle>
//             <BenefitText>
//               Recevez vos articles en un temps record, soigneusement emballés
//               pour vous.
//             </BenefitText>
//           </BenefitCard>

//           <BenefitCard $isDark={$isDark}>
//             <BenefitIcon $isDark={$isDark}>
//               <FaShieldAlt />
//             </BenefitIcon>
//             <BenefitTitle>Paiement sécurisé</BenefitTitle>
//             <BenefitText>
//               Vos transactions sont cryptées et protégées pour une tranquillité
//               totale.
//             </BenefitText>
//           </BenefitCard>

//           <BenefitCard $isDark={$isDark}>
//             <BenefitIcon $isDark={$isDark}>
//               <FaUndo />
//             </BenefitIcon>
//             <BenefitTitle>Retour facile</BenefitTitle>
//             <BenefitText>
//               Si un produit ne vous convient pas, retournez-le simplement et
//               rapidement.
//             </BenefitText>
//           </BenefitCard>
//         </BenefitsSection>
//       </RevealOnScroll>
//     </Wrapper>
//   );
// }


import { useState, useEffect, useMemo, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ThemeContext } from "../../Utils/Context";

// ======================================================
// REVEAL ON SCROLL
// ======================================================

function RevealOnScroll({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <RevealWrapper $visible={visible} ref={ref}>
      {children}
    </RevealWrapper>
  );
}

// ======================================================
// ANIMATIONS
// ======================================================

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slowZoom = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.08);
  }
`;

const heroTextAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(35px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255,255,255,0.15);
  }

  70% {
    box-shadow: 0 0 0 12px rgba(255,255,255,0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255,255,255,0);
  }
`;

// ======================================================
// GLOBAL
// ======================================================

const RevealWrapper = styled.div`
  width: 100%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(45px)"};
  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Wrapper = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 125px;
  padding-bottom: 130px;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(180deg, #080808 0%, #0e0e0e 48%, #080808 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #f7f7f5 48%, #ffffff 100%)"};

  color: ${({ $isDark }) => ($isDark ? "#f8f8f8" : "#111")};

  overflow: hidden;

  @media (max-width: 768px) {
    gap: 90px;
    padding-bottom: 90px;
  }
`;

// ======================================================
// SECTION HEADER
// ======================================================

const SectionHeader = styled.div`
  width: min(900px, 92%);
  margin: 0 auto 42px;
  text-align: center;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;

    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;

    opacity: 0.62;
  }

  .eyebrow::before,
  .eyebrow::after {
    content: "";
    width: 28px;
    height: 1px;
    background: currentColor;
    opacity: 0.45;
  }

  h2 {
    margin: 0 0 16px;
    font-size: clamp(2rem, 4vw, 3.7rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 800;
  }

  p {
    max-width: 720px;
    margin: 0 auto;
    font-size: 1rem;
    line-height: 1.85;
    opacity: 0.68;
  }

  @media (max-width: 768px) {
    margin-bottom: 28px;

    .eyebrow {
      font-size: 0.65rem;
      letter-spacing: 2.5px;
    }

    .eyebrow::before,
    .eyebrow::after {
      width: 18px;
    }

    h2 {
      font-size: 2rem;
    }

    p {
      font-size: 0.92rem;
      line-height: 1.7;
    }
  }
`;

// ======================================================
// HERO
// ======================================================

const Hero = styled.section`
  position: relative;
  height: 100svh;
  min-height: 680px;
  overflow: hidden;
  background: #050505;

  @media (max-width: 768px) {
    min-height: 650px;
  }
`;

const Slide = styled.div`
  position: absolute;
  inset: -1px;

  background-image: ${({ $image }) => `url(${$image})`};
  background-size: cover;
  background-position: center;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  transition:
    opacity 1.2s ease,
    transform 7s ease;

  transform: ${({ $active }) =>
    $active ? "scale(1.05)" : "scale(1)"};

  animation: ${({ $active }) => ($active ? slowZoom : "none")} 8s
    ease-in-out infinite alternate;

  filter: saturate(0.88);
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.78) 0%,
      rgba(0, 0, 0, 0.52) 38%,
      rgba(0, 0, 0, 0.12) 75%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.58) 0%,
      transparent 40%
    );

  z-index: 1;
`;

const HeroGlow = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  left: -180px;
  top: 20%;

  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  filter: blur(80px);

  pointer-events: none;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  display: flex;
  align-items: center;

  padding: 0 7%;

  @media (max-width: 768px) {
    padding: 0 7%;
    align-items: flex-end;
    padding-bottom: 100px;
  }
`;

const HeroText = styled.div`
  width: min(780px, 100%);
  color: #fff;

  animation: ${heroTextAnimation} 1s
    cubic-bezier(0.22, 1, 0.36, 1) forwards;

  .hero-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;

    margin-bottom: 22px;

    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;

    opacity: 0.85;
  }

  .hero-label::before {
    content: "";
    width: 38px;
    height: 1px;
    background: rgba(255, 255, 255, 0.7);
  }

  h1 {
    margin: 0 0 22px;

    max-width: 850px;

    font-size: clamp(3rem, 6vw, 6.2rem);
    line-height: 0.98;
    letter-spacing: -0.055em;
    font-weight: 800;
  }

  p {
    max-width: 580px;
    margin: 0;

    font-size: 1.05rem;
    line-height: 1.8;

    color: rgba(255, 255, 255, 0.82);
  }

  @media (max-width: 768px) {
    .hero-label {
      margin-bottom: 16px;
      font-size: 0.63rem;
      letter-spacing: 2px;
    }

    .hero-label::before {
      width: 24px;
    }

    h1 {
      font-size: clamp(2.65rem, 12vw, 4.2rem);
      line-height: 0.98;
      margin-bottom: 18px;
    }

    p {
      font-size: 0.92rem;
      line-height: 1.7;
    }
  }
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
`;

const HeroBtn = styled(Link)`
  position: relative;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  padding: 16px 25px;

  color: #111;
  background: #fff;

  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 800;

  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;

    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, 0.08),
      transparent
    );

    transform: translateX(-100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.25);
  }

  &:hover::before {
    animation: ${shimmer} 0.7s ease;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const HeroScroll = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 30px;
  left: 7%;

  display: flex;
  align-items: center;
  gap: 12px;

  color: rgba(255, 255, 255, 0.7);

  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    bottom: 25px;
    left: 7%;
  }
`;

const HeroScrollLine = styled.span`
  width: 45px;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
`;

// ======================================================
// FEATURE CARDS
// ======================================================

const FeatureSection = styled.section`
  width: 100%;
`;

const FeatureGrid = styled.div`
  width: min(1240px, 92%);
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  position: relative;
  min-height: 650px;

  overflow: hidden;
  background: #111;

  cursor: pointer;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.13);

  @media (max-width: 768px) {
    min-height: 520px;
  }
`;

const FeatureImg = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform 1s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.6s ease;

  filter: saturate(0.9);

  ${FeatureCard}:hover & {
    transform: scale(1.07);
    filter: saturate(1.05);
  }
`;

const FeatureOverlay = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 42px;

  color: white;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.82) 0%,
    rgba(0, 0, 0, 0.35) 45%,
    rgba(0, 0, 0, 0.03) 100%
  );

  @media (max-width: 768px) {
    padding: 28px;
  }
`;

const FeatureBadge = styled.span`
  width: fit-content;

  margin-bottom: 18px;
  padding: 8px 13px;

  border: 1px solid rgba(255, 255, 255, 0.28);

  background: rgba(255, 255, 255, 0.09);

  backdrop-filter: blur(12px);

  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const FeatureText = styled.p`
  max-width: 390px;

  margin: 0 0 20px;

  font-size: 1.2rem;
  line-height: 1.7;

  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  width: fit-content;

  padding-bottom: 6px;

  color: #fff;
  text-decoration: none;

  border-bottom: 1px solid rgba(255, 255, 255, 0.5);

  font-size: 0.9rem;
  font-weight: 800;

  transition: all 0.3s ease;

  &:hover {
    gap: 15px;
    border-color: #fff;
  }
`;

// ======================================================
// CAROUSEL DOTS
// ======================================================

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 9px;

  margin-top: 24px;
`;

const Dot = styled.button`
  position: relative;

  width: ${({ $active }) => ($active ? "42px" : "9px")};
  height: 8px;

  padding: 0;
  overflow: hidden;

  border: none;
  border-radius: 999px;

  background: ${({ $isDark }) =>
    $isDark
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.1)"};

  cursor: pointer;

  transition:
    width 0.4s ease,
    transform 0.3s ease;

  &:hover {
    transform: scaleY(1.3);
  }
`;

const DotProgress = styled.span`
  position: absolute;
  inset: 0 auto 0 0;

  width: ${({ $width }) => `${$width}%`};

  border-radius: inherit;

  background: ${({ $isDark }) =>
    $isDark ? "#fff" : "#111"};

  transition: width 0.05s linear;
`;

// ======================================================
// MINI CAROUSEL
// ======================================================

const MiniCarouselSection = styled.section`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const MiniCarouselWrapper = styled.div`
  position: relative;
`;

const MiniCarousel = styled.div`
  position: relative;

  width: 100%;
  height: 680px;

  overflow: hidden;

  background: ${({ $isDark }) =>
    $isDark ? "#111" : "#eee"};

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    height: 570px;
  }
`;

const MiniSlide = styled.div`
  position: absolute;
  inset: 0;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  pointer-events: ${({ $active }) =>
    $active ? "auto" : "none"};

  transition: opacity 0.8s ease;
`;

const MiniSlideImg = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;

  transition: transform 0.8s ease;

  ${MiniSlide}:hover & {
    transform: scale(1.025);
  }
`;

const MiniOverlay = styled.div`
  position: absolute;

  left: 24px;
  right: 24px;
  bottom: 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 22px 24px;

  color: white;

  background: rgba(0, 0, 0, 0.48);

  border: 1px solid rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(18px);

  @media (max-width: 768px) {
    left: 14px;
    right: 14px;
    bottom: 14px;

    flex-direction: column;
    align-items: flex-start;

    padding: 20px;
  }
`;

const MiniInfo = styled.div`
  h3 {
    margin: 0 0 7px;

    font-size: clamp(1.3rem, 3vw, 2rem);
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;

    font-size: 0.92rem;
    line-height: 1.6;

    opacity: 0.82;
  }
`;

const MiniCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 13px 20px;

  background: #fff;
  color: #111;

  text-decoration: none;

  font-size: 0.82rem;
  font-weight: 800;

  white-space: nowrap;

  transition:
    transform 0.3s ease,
    background 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: #f0f0f0;
  }
`;

// ======================================================
// BEST SELLERS
// ======================================================

const BestSellerSection = styled.section`
  width: min(1240px, 92%);
  margin: 0 auto;
`;

const BestCarouselWrapper = styled.div`
  position: relative;
`;

const BestCarousel = styled.div`
  position: relative;

  width: 100%;
  height: 700px;

  overflow: hidden;

  background: ${({ $isDark }) =>
    $isDark ? "#101010" : "#f2f2f0"};

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.14);

  @media (max-width: 900px) {
    height: 850px;
  }

  @media (max-width: 600px) {
    height: 780px;
  }
`;

const BestSlide = styled.div`
  position: absolute;
  inset: 0;

  opacity: ${({ $active }) => ($active ? 1 : 0)};

  pointer-events: ${({ $active }) =>
    $active ? "auto" : "none"};

  transition: opacity 0.8s ease;
`;

const BestSlideInner = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 52% 48%;
  }
`;

const BestImageWrap = styled.div`
  position: relative;

  overflow: hidden;

  background: ${({ $isDark }) =>
    $isDark ? "#090909" : "#eaeae8"};
`;

const BestImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;

  padding: 25px;

  transition: transform 0.9s ease;

  ${BestSlide}:hover & {
    transform: scale(1.025);
  }
`;

const BestImageGradient = styled.div`
  position: absolute;
  inset: 0;

  pointer-events: none;

  background: linear-gradient(
    90deg,
    transparent 70%,
    rgba(0, 0, 0, 0.05)
  );
`;

const BestBadge = styled.div`
  position: absolute;

  top: 24px;
  left: 24px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 9px 14px;

  background: rgba(0, 0, 0, 0.55);
  color: white;

  border: 1px solid rgba(255, 255, 255, 0.16);

  backdrop-filter: blur(12px);

  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 2px;

  animation: ${pulse} 2.5s infinite;
`;

const BestContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 65px;

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(135deg, #151515, #0d0d0d)"
      : "linear-gradient(135deg, #ffffff, #f2f2f0)"};

  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const BestSmall = styled.span`
  display: inline-block;

  margin-bottom: 15px;

  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;

  opacity: 0.55;
`;

const BestTitle = styled.h3`
  margin: 0 0 16px;

  font-size: clamp(2rem, 4vw, 3.7rem);
  line-height: 1.02;

  letter-spacing: -0.05em;
`;

const BestSubtitle = styled.p`
  max-width: 500px;

  margin: 0 0 22px;

  font-size: 0.98rem;
  line-height: 1.85;

  opacity: 0.7;
`;

const BestPrice = styled.div`
  margin-bottom: 28px;

  font-size: 1.35rem;
  font-weight: 800;
`;

const BestBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  width: fit-content;

  padding: 15px 23px;

  background: ${({ $isDark }) =>
    $isDark ? "#fff" : "#111"};

  color: ${({ $isDark }) =>
    $isDark ? "#111" : "#fff"};

  text-decoration: none;

  font-size: 0.85rem;
  font-weight: 800;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

// ======================================================
// ARROWS
// ======================================================

const CarouselArrow = styled.button`
  position: absolute;

  top: 50%;
  ${({ $left }) => ($left ? "left: 18px" : "right: 18px")};

  transform: translateY(-50%);

  z-index: 10;

  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);

  background: rgba(0, 0, 0, 0.42);
  color: #fff;

  backdrop-filter: blur(12px);

  cursor: pointer;

  transition:
    transform 0.3s ease,
    background 0.3s ease;

  &:hover {
    transform: translateY(-50%) scale(1.08);
    background: rgba(0, 0, 0, 0.65);
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;

    ${({ $left }) => ($left ? "left: 10px" : "right: 10px")};
  }
`;

// ======================================================
// BENEFITS
// ======================================================

const BenefitsSection = styled.section`
  width: min(1240px, 92%);
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.article`
  position: relative;

  padding: 32px;

  background: ${({ $isDark }) =>
    $isDark
      ? "rgba(255,255,255,0.035)"
      : "rgba(255,255,255,0.85)"};

  border: 1px solid
    ${({ $isDark }) =>
      $isDark
        ? "rgba(255,255,255,0.07)"
        : "rgba(0,0,0,0.055)"};

  box-shadow: ${({ $isDark }) =>
    $isDark
      ? "0 20px 50px rgba(0,0,0,0.22)"
      : "0 20px 50px rgba(0,0,0,0.055)"};

  backdrop-filter: blur(18px);

  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;

  &:hover {
    transform: translateY(-8px);

    border-color: ${({ $isDark }) =>
      $isDark
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.12)"};

    box-shadow: ${({ $isDark }) =>
      $isDark
        ? "0 30px 70px rgba(0,0,0,0.3)"
        : "0 30px 70px rgba(0,0,0,0.09)"};
  }

  @media (max-width: 768px) {
    padding: 27px;
  }
`;

const BenefitIcon = styled.div`
  width: 62px;
  height: 62px;

  margin-bottom: 21px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $isDark }) =>
    $isDark
      ? "#fff"
      : "#111"};

  color: ${({ $isDark }) =>
    $isDark ? "#111" : "#fff"};

  font-size: 21px;

  transition: transform 0.4s ease;

  ${BenefitCard}:hover & {
    transform: rotate(-4deg) scale(1.05);
  }
`;

const BenefitNumber = styled.span`
  display: block;

  margin-bottom: 10px;

  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 2px;

  opacity: 0.45;
`;

const BenefitTitle = styled.h3`
  margin: 0 0 11px;

  font-size: 1.1rem;
  font-weight: 800;
`;

const BenefitText = styled.p`
  margin: 0;

  font-size: 0.9rem;
  line-height: 1.8;

  opacity: 0.68;
`;

const Description = styled.p`
  width: min(900px, 92%);
  margin: 0 auto;

  text-align: center;

  font-size: 1rem;
  line-height: 1.9;

  opacity: 0.7;
`;

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function HomePremium() {
  const [products, setProducts] = useState([]);

  const [slide, setSlide] = useState(0);

  const [miniSlide, setMiniSlide] = useState(0);
  const [miniProgress, setMiniProgress] = useState(0);

  const [bestSlide, setBestSlide] = useState(0);
  const [bestProgress, setBestProgress] = useState(0);

  const { theme } = useContext(ThemeContext);

  // Si ton Context utilise "dark" / "light"
  const $isDark = theme === "dark";

  const miniIntervalRef = useRef(null);
  const bestIntervalRef = useRef(null);

  const duration = 4200;

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/produits`
        );

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }

        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur produits :", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // ======================================================
  // PRODUCTS
  // ======================================================

  const heroProducts = useMemo(
    () => products.filter((p) => p.hero),
    [products]
  );

  const carouselProducts = useMemo(
    () => products.slice(0, 5),
    [products]
  );

  const bestSellers = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.badge?.toLowerCase() === "new"
        )
        .slice(0, 5),
    [products]
  );

  // ======================================================
  // IMAGE
  // ======================================================

  const getImg = (product) => {
    const image = product?.images?.[0]?.url;

    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  // ======================================================
  // HERO AUTOPLAY
  // ======================================================

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const interval = setInterval(() => {
      setSlide(
        (current) =>
          (current + 1) % heroProducts.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroProducts.length]);

  // ======================================================
  // MINI CAROUSEL
  // ======================================================

  useEffect(() => {
    if (carouselProducts.length <= 1) return;

    const step = 100 / (duration / 50);

    miniIntervalRef.current = setInterval(() => {
      setMiniProgress((previous) => {
        if (previous + step >= 100) {
          setMiniSlide(
            (current) =>
              (current + 1) %
              carouselProducts.length
          );

          return 0;
        }

        return previous + step;
      });
    }, 50);

    return () => {
      if (miniIntervalRef.current) {
        clearInterval(miniIntervalRef.current);
      }
    };
  }, [carouselProducts.length]);

  // ======================================================
  // BEST SELLERS
  // ======================================================

  useEffect(() => {
    if (bestSellers.length <= 1) return;

    const step = 100 / (duration / 50);

    bestIntervalRef.current = setInterval(() => {
      setBestProgress((previous) => {
        if (previous + step >= 100) {
          setBestSlide(
            (current) =>
              (current + 1) %
              bestSellers.length
          );

          return 0;
        }

        return previous + step;
      });
    }, 50);

    return () => {
      if (bestIntervalRef.current) {
        clearInterval(bestIntervalRef.current);
      }
    };
  }, [bestSellers.length]);

  // ======================================================
  // MINI NAVIGATION
  // ======================================================

  const previousMini = () => {
    if (!carouselProducts.length) return;

    setMiniSlide(
      (current) =>
        (current - 1 + carouselProducts.length) %
        carouselProducts.length
    );

    setMiniProgress(0);
  };

  const nextMini = () => {
    if (!carouselProducts.length) return;

    setMiniSlide(
      (current) =>
        (current + 1) %
        carouselProducts.length
    );

    setMiniProgress(0);
  };

  // ======================================================
  // BEST NAVIGATION
  // ======================================================

  const previousBest = () => {
    if (!bestSellers.length) return;

    setBestSlide(
      (current) =>
        (current - 1 + bestSellers.length) %
        bestSellers.length
    );

    setBestProgress(0);
  };

  const nextBest = () => {
    if (!bestSellers.length) return;

    setBestSlide(
      (current) =>
        (current + 1) %
        bestSellers.length
    );

    setBestProgress(0);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <Wrapper $isDark={$isDark}>

      {/* ==================================================
          HERO
      ================================================== */}

      <Hero>
        {heroProducts.map((product, index) => (
          <Slide
            key={product._id}
            $active={index === slide}
            $image={getImg(product)}
          />
        ))}

        <HeroOverlay />
        <HeroGlow />

        <HeroContent>
          <HeroText>
            <div className="hero-label">
              Collection Numa
            </div>

            <h1>
              Une mode pensée pour séduire au premier regard.
            </h1>

            <p>
              Des silhouettes fortes, des détails soigneusement
              travaillés et une identité qui ne passe jamais
              inaperçue.
            </p>

            <HeroActions>
              <HeroBtn to="/collections">
                Explorer la collection
                <FaArrowRight />
              </HeroBtn>
            </HeroActions>
          </HeroText>
        </HeroContent>

        <HeroScroll>
          <HeroScrollLine />
          Découvrir
        </HeroScroll>
      </Hero>

      {/* ==================================================
          UNIVERS
      ================================================== */}

      <RevealOnScroll>
        <FeatureSection>
          <SectionHeader>
            <span className="eyebrow">
              Univers
            </span>

            <h2>
              Des silhouettes qui imposent le style
            </h2>

            <p>
              Deux univers, une seule signature :
              l'élégance, la présence et le détail
              qui fait la différence.
            </p>
          </SectionHeader>

          <FeatureGrid>
            {products
              .filter(
                (p) =>
                  p.genre?.toLowerCase() ===
                  "homme"
              )
              .slice(0, 1)
              .map((product) => (
                <FeatureCard key={product._id}>
                  <FeatureImg
                    src={getImg(product)}
                    alt={product.title}
                    loading="lazy"
                  />

                  <FeatureOverlay>
                    <FeatureBadge>
                      Univers Homme
                    </FeatureBadge>

                    <FeatureText>
                      Pour l'homme qui veut une allure
                      forte, propre et assumée.
                    </FeatureText>

                    <FeatureLink to="/homme">
                      Découvrir l'univers homme
                      <FaArrowRight />
                    </FeatureLink>
                  </FeatureOverlay>
                </FeatureCard>
              ))}

            {products
              .filter(
                (p) =>
                  p.genre?.toLowerCase() ===
                  "femme"
              )
              .slice(0, 1)
              .map((product) => (
                <FeatureCard key={product._id}>
                  <FeatureImg
                    src={getImg(product)}
                    alt={product.title}
                    loading="lazy"
                  />

                  <FeatureOverlay>
                    <FeatureBadge>
                      Univers Femme
                    </FeatureBadge>

                    <FeatureText>
                      Pour la femme qui veut captiver
                      avec confiance et élégance.
                    </FeatureText>

                    <FeatureLink to="/femme">
                      Découvrir l'univers femme
                      <FaArrowRight />
                    </FeatureLink>
                  </FeatureOverlay>
                </FeatureCard>
              ))}
          </FeatureGrid>
        </FeatureSection>
      </RevealOnScroll>

      {/* ==================================================
          FOCUS
      ================================================== */}

      <RevealOnScroll>
        <MiniCarouselSection>
          <SectionHeader>
            <span className="eyebrow">
              Focus
            </span>

            <h2>
              Des pièces qui attirent le regard
            </h2>

            <p>
              Une mise en lumière de créations pensées
              pour marquer les esprits dès le premier
              regard.
            </p>
          </SectionHeader>

          {carouselProducts.length > 0 && (
            <MiniCarouselWrapper>
              <MiniCarousel $isDark={$isDark}>
                {carouselProducts.map(
                  (product, index) => (
                    <MiniSlide
                      key={product._id}
                      $active={
                        index === miniSlide
                      }
                    >
                      <MiniSlideImg
                        src={getImg(product)}
                        alt={product.title}
                        loading={
                          index === 0
                            ? "eager"
                            : "lazy"
                        }
                      />

                      <MiniOverlay>
                        <MiniInfo>
                          <h3>
                            {product.title}
                          </h3>

                          <p>
                            {product.subtitle ||
                              "Une pièce signature à forte présence."}
                          </p>
                        </MiniInfo>

                        <MiniCTA
                          to={`/produit/${product._id}`}
                        >
                          Voir le produit
                        </MiniCTA>
                      </MiniOverlay>
                    </MiniSlide>
                  )
                )}

                {carouselProducts.length > 1 && (
                  <>
                    <CarouselArrow
                      type="button"
                      $left
                      aria-label="Produit précédent"
                      onClick={previousMini}
                    >
                      <FaChevronLeft />
                    </CarouselArrow>

                    <CarouselArrow
                      type="button"
                      aria-label="Produit suivant"
                      onClick={nextMini}
                    >
                      <FaChevronRight />
                    </CarouselArrow>
                  </>
                )}
              </MiniCarousel>

              <DotsRow>
                {carouselProducts.map(
                  (_, index) => (
                    <Dot
                      key={index}
                      type="button"
                      aria-label={`Afficher le produit ${
                        index + 1
                      }`}
                      $active={
                        index === miniSlide
                      }
                      $isDark={$isDark}
                      onClick={() => {
                        setMiniSlide(index);
                        setMiniProgress(0);
                      }}
                    >
                      {index === miniSlide && (
                        <DotProgress
                          $width={miniProgress}
                          $isDark={$isDark}
                        />
                      )}
                    </Dot>
                  )
                )}
              </DotsRow>
            </MiniCarouselWrapper>
          )}
        </MiniCarouselSection>
      </RevealOnScroll>

      {/* ==================================================
          BEST SELLERS
      ================================================== */}

      <RevealOnScroll>
        <BestSellerSection>
          <SectionHeader>
            <span className="eyebrow">
              Sélection
            </span>

            <h2>
              Les pièces les plus convoitées
            </h2>

            <p>
              Une sélection pensée pour celles et ceux
              qui veulent une allure marquante,
              élégante et immédiatement mémorable.
            </p>
          </SectionHeader>

          {bestSellers.length > 0 && (
            <BestCarouselWrapper>
              <BestCarousel $isDark={$isDark}>
                {bestSellers.map(
                  (product, index) => (
                    <BestSlide
                      key={product._id}
                      $active={
                        index === bestSlide
                      }
                    >
                      <BestSlideInner>
                        <BestImageWrap
                          $isDark={$isDark}
                        >
                          <BestImage
                            src={getImg(product)}
                            alt={product.title}
                            loading="lazy"
                          />

                          <BestImageGradient />

                          <BestBadge>
                            BEST SELLER
                          </BestBadge>
                        </BestImageWrap>

                        <BestContent
                          $isDark={$isDark}
                        >
                          <BestSmall>
                            Collection Signature
                          </BestSmall>

                          <BestTitle>
                            {product.title}
                          </BestTitle>

                          <BestSubtitle>
                            {product.subtitle ||
                              "Une pièce forte pensée pour révéler votre présence avec style, élégance et caractère."}
                          </BestSubtitle>

                          <BestPrice>
                            {product.price} FCFA
                          </BestPrice>

                          <BestBtn
                            to={`/produit/${product._id}`}
                            $isDark={$isDark}
                          >
                            Voir le produit
                            <FaArrowRight />
                          </BestBtn>
                        </BestContent>
                      </BestSlideInner>
                    </BestSlide>
                  )
                )}

                {bestSellers.length > 1 && (
                  <>
                    <CarouselArrow
                      type="button"
                      $left
                      aria-label="Produit précédent"
                      onClick={previousBest}
                    >
                      <FaChevronLeft />
                    </CarouselArrow>

                    <CarouselArrow
                      type="button"
                      aria-label="Produit suivant"
                      onClick={nextBest}
                    >
                      <FaChevronRight />
                    </CarouselArrow>
                  </>
                )}
              </BestCarousel>

              <DotsRow>
                {bestSellers.map(
                  (_, index) => (
                    <Dot
                      key={index}
                      type="button"
                      aria-label={`Afficher le produit ${
                        index + 1
                      }`}
                      $active={
                        index === bestSlide
                      }
                      $isDark={$isDark}
                      onClick={() => {
                        setBestSlide(index);
                        setBestProgress(0);
                      }}
                    >
                      {index === bestSlide && (
                        <DotProgress
                          $width={bestProgress}
                          $isDark={$isDark}
                        />
                      )}
                    </Dot>
                  )
                )}
              </DotsRow>
            </BestCarouselWrapper>
          )}
        </BestSellerSection>
      </RevealOnScroll>

      {/* ==================================================
          BENEFITS
      ================================================== */}

      <RevealOnScroll>
        <section>
          <SectionHeader>
            <span className="eyebrow">
              L'expérience Numa
            </span>

            <h2>
              Pensé pour vous accompagner
            </h2>

            <Description>
              Chaque pièce est pensée pour allier style,
              confort et durabilité. La signature Numa,
              c'est l'assurance d'un vêtement qui vous
              accompagne au quotidien.
            </Description>
          </SectionHeader>

          <BenefitsSection>
            <BenefitCard $isDark={$isDark}>
              <BenefitIcon $isDark={$isDark}>
                <FaTruck />
              </BenefitIcon>

              <BenefitNumber>
                01 — LIVRAISON
              </BenefitNumber>

              <BenefitTitle>
                Livraison rapide
              </BenefitTitle>

              <BenefitText>
                Recevez vos articles en un temps record,
                soigneusement emballés pour vous.
              </BenefitText>
            </BenefitCard>

            <BenefitCard $isDark={$isDark}>
              <BenefitIcon $isDark={$isDark}>
                <FaShieldAlt />
              </BenefitIcon>

              <BenefitNumber>
                02 — SÉCURITÉ
              </BenefitNumber>

              <BenefitTitle>
                Paiement sécurisé
              </BenefitTitle>

              <BenefitText>
                Vos transactions sont protégées pour
                vous offrir une expérience d'achat
                simple et sereine.
              </BenefitText>
            </BenefitCard>

            <BenefitCard $isDark={$isDark}>
              <BenefitIcon $isDark={$isDark}>
                <FaUndo />
              </BenefitIcon>

              <BenefitNumber>
                03 — RETOUR
              </BenefitNumber>

              <BenefitTitle>
                Retour facile
              </BenefitTitle>

              <BenefitText>
                Si un produit ne vous convient pas,
                retournez-le simplement et rapidement.
              </BenefitText>
            </BenefitCard>
          </BenefitsSection>
        </section>
      </RevealOnScroll>
    </Wrapper>
  );
}