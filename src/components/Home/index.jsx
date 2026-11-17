
import {
  useState,
  useEffect,
  useMemo,
  useContext,
  useRef,
  Suspense,
} from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  FaWhatsapp,
  FaTruck,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";

import { ThemeContext } from "../../Utils/Context";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import * as THREE from "three";

/* =====================================================
   CONFIGURATION
===================================================== */

const API_URL = import.meta.env.VITE_API_URL || "";

const media = (url) => {
  if (!url) return "";

  return url.startsWith("http")
    ? url
    : `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const isPreorder = (p) =>
  p?.precommande === true && p?.disponible === false;

const genreOf = (g) =>
  String(g || "").trim().toLowerCase();

/* =====================================================
   ANIMATIONS CSS
===================================================== */

const imageZoom = keyframes`
  from { transform: scale(1.04); }
  to { transform: scale(1.14); }
`;

const lineReveal = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

/* =====================================================
   COMPOSANTS ANIMATION
===================================================== */

function Reveal({
  children,
  delay = 0,
  y = 65,
  className,
  once = true,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y, filter: "blur(8px)" }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.9,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function TiltCard({ children, className, style }) {
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 20,
  });

  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 20,
  });

  const handleMove = (event) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();

    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/* =====================================================
   WEBGL — DISTORSION DU HERO
===================================================== */

function HeroShader({ src }) {
  const texture = useTexture(src);

  const materialRef = useRef();

  useFrame((state) => {
    if (!materialRef.current) return;

    const material = materialRef.current;

    material.uniforms.uTime.value = state.ccdlock.elapsedTime;

    material.uniforms.uMouse.value.set(
      state.pointer.x,
      state.pointer.y
    );

    material.uniforms.uViewportAspect.value =
      state.viewport.width / state.viewport.height;

    if (texture.image) {
      material.uniforms.uImageAspect.value =
        texture.image.width / texture.image.height;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 64, 64]} />

      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uImageAspect: { value: 1 },
          uViewportAspect: { value: 1 },
        }}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position = projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform float uImageAspect;
          uniform float uViewportAspect;
          uniform vec2 uMouse;

          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            if (uImageAspect > uViewportAspect) {
              float scale = uViewportAspect / uImageAspect;
              uv.x = (uv.x - 0.5) * scale + 0.5;
            } else {
              float scale = uImageAspect / uViewportAspect;
              uv.y = (uv.y - 0.5) * scale + 0.5;
            }

            float distanceToMouse = distance(vUv, uMouse * 0.5 + 0.5);

            float influence = smoothstep(
              0.55,
              0.0,
              distanceToMouse
            );

            float wave = sin(
              vUv.y * 8.0 + uTime * 0.55
            ) * 0.0025;

            float distortion = influence * 0.012;

            uv.x += wave + distortion;
            uv.y += cos(vUv.x * 7.0 + uTime * 0.4) * 0.0015;

            vec4 color = texture2D(uTexture, uv);

            gl_FragColor = color;
          }
        `}
      />
    </mesh>
  );
}

function WebGLHero({ src }) {
  if (!src) return null;

  return (
    <div className="webgl-layer">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        fallback={null}
      >
        <Suspense fallback={null}>
          <HeroShader src={src} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* =====================================================
   DESIGN SYSTEM
===================================================== */

const Page = styled.main`
  --paper: ${({ $dark }) => ($dark ? "#191919" : "#F3F0E9")};
  --surface: ${({ $dark }) => ($dark ? "#222220" : "#FFFFFF")};
  --ink: ${({ $dark }) => ($dark ? "#F4F0E9" : "#201F1C")};
  --muted: ${({ $dark }) => ($dark ? "#A8A39A" : "#77736B")};
  --line: ${({ $dark }) => ($dark ? "#393834" : "#DEDAD1")};
  --accent: #927657;

  background: var(--paper);
  color: var(--ink);
  width: 100%;
  overflow: hidden;
  transition: background 0.35s, color 0.35s;

  * {
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const Container = styled.div`
  width: min(1440px, 91%);
  margin: auto;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 24px;
    height: 1px;
    background: currentColor;
  }
`;

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 25px;
  margin-bottom: 42px;

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(34px, 5vw, 66px);
    font-weight: 400;
    letter-spacing: -2.5px;
    line-height: 1;
    margin: 16px 0 0;
    max-width: 700px;
  }

  p {
    max-width: 330px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.9;
    margin: 0;
  }

  @media (max-width: 700px) {
    display: block;
    margin-bottom: 28px;

    p {
      margin-top: 15px;
    }
  }
`;

const Section = styled.section`
  padding: 115px 0;

  @media (max-width: 700px) {
    padding: 75px 0;
  }
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  color: var(--ink);
  text-decoration: none;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.6px;
  border-bottom: 1px solid var(--accent);
  padding-bottom: 9px;
  transition: gap 0.3s;

  &:hover {
    gap: 23px;
  }
`;

/* =====================================================
   HERO CINÉMATIQUE
===================================================== */

const Hero = styled.section`
  min-height: 760px;
  height: min(900px, 92svh);
  position: relative;
  overflow: hidden;
  background: #25231f;
  isolation: isolate;

  .hero-parallax {
    position: absolute;
    inset: -8%;
    will-change: transform;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    animation: ${imageZoom} 15s ease-in-out infinite alternate;
    will-change: transform;
  }

  .webgl-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.96;
  }

  .webgl-layer canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.63), rgba(0, 0, 0, 0.08) 80%),
      linear-gradient(0deg, rgba(0, 0, 0, 0.45), transparent 45%);
  }

  .hero-content {
    position: absolute;
    z-index: 3;
    left: 8%;
    bottom: 16%;
    max-width: 680px;
    color: white;
  }

  .hero-content small {
    display: block;
    letter-spacing: 4px;
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 25px;
  }

  .hero-content h1 {
    font-family: Georgia, serif;
    font-size: clamp(55px, 8vw, 112px);
    line-height: 0.92;
    font-weight: 400;
    letter-spacing: -5px;
    margin: 0;
  }

  .hero-content p {
    font-size: 13px;
    letter-spacing: 1px;
    line-height: 1.8;
    margin-top: 25px;
    color: rgba(255, 255, 255, 0.8);
  }

  .hero-counter {
    position: absolute;
    right: 4.5%;
    bottom: 45px;
    z-index: 4;
    color: white;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    letter-spacing: 2px;
  }

  .hero-counter span {
    display: block;
    width: 70px;
    height: 1px;
    background: rgba(255, 255, 255, 0.6);
  }

  .hero-progress {
    position: absolute;
    z-index: 4;
    left: 0;
    bottom: 0;
    height: 3px;
    background: var(--accent);
    transform-origin: left;
  }

  @media (max-width: 700px) {
    height: 78svh;
    min-height: 580px;

    .hero-content {
      left: 7%;
      right: 7%;
      bottom: 17%;
    }

    .hero-content h1 {
      letter-spacing: -2px;
    }
  }
`;

/* =====================================================
   INTRODUCTION
===================================================== */

const Intro = styled.section`
  padding: 105px 0 115px;
  text-align: center;

  .number {
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--accent);
  }

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(38px, 6vw, 78px);
    line-height: 1.12;
    font-weight: 400;
    letter-spacing: -3px;
    max-width: 970px;
    margin: 30px auto;
  }

  h2 em {
    color: var(--accent);
  }

  p {
    max-width: 510px;
    margin: auto;
    color: var(--muted);
    line-height: 2;
    font-size: 13px;
  }

  @media (max-width: 600px) {
    padding: 75px 0;

    h2 {
      letter-spacing: -1.5px;
    }
  }
`;

/* =====================================================
   UNIVERS HOMME / FEMME
===================================================== */

const UniverseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const UniverseCard = styled(Link)`
  display: block;
  position: relative;
  height: 680px;
  overflow: hidden;
  background: #292723;
  color: white;
  text-decoration: none;
  transform-style: preserve-3d;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.09);
  }

  .shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.68),
      transparent 65%
    );
  }

  .top {
    position: absolute;
    top: 24px;
    left: 25px;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .bottom {
    position: absolute;
    bottom: 35px;
    left: 35px;
    right: 35px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  h3 {
    font-family: Georgia, serif;
    font-size: clamp(55px, 7vw, 95px);
    font-weight: 400;
    letter-spacing: -4px;
    margin: 0;
    line-height: 1;
  }

  .arrow {
    width: 50px;
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    display: grid;
    place-items: center;
    transition: 0.4s;
  }

  &:hover .arrow {
    background: white;
    color: #191919;
    transform: rotate(45deg);
  }

  @media (max-width: 700px) {
    height: 540px;

    .bottom {
      left: 22px;
      right: 22px;
      bottom: 25px;
    }

    h3 {
      font-size: 65px;
    }
  }
`;

/* =====================================================
   PRODUITS — DÉFILEMENT HORIZONTAL
===================================================== */

const ProductRail = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0 25px;
  cursor: grab;
  scrollbar-width: thin;
  scrollbar-color: var(--accent) transparent;

  &:active {
    cursor: grabbing;
  }

  .product-track {
    display: flex;
    gap: 20px;
    width: max-content;
    padding-right: 5%;
  }
`;

const ProductCard = styled.article`
  width: clamp(240px, 25vw, 330px);
  flex-shrink: 0;
  min-width: 0;

  .photo {
    display: block;
    position: relative;
    width: 100%;
    height: 410px;
    overflow: hidden;
    background: #e6e1d8;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.08);
  }

  .tag {
    position: absolute;
    top: 13px;
    left: 13px;
    z-index: 2;
    background: var(--paper);
    color: var(--ink);
    padding: 8px 10px;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .details {
    padding-top: 16px;
  }

  .category {
    color: var(--accent);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  h3 {
    margin: 9px 0;
    font-family: Georgia, serif;
    font-size: 18px;
    font-weight: 400;
  }

  .price {
    color: var(--muted);
    font-size: 12px;
  }

  @media (max-width: 700px) {
    width: 72vw;

    .photo {
      height: 330px;
    }
  }

  @media (max-width: 390px) {
    .photo {
      height: 285px;
    }
  }
`;

const ProductPhotoLink = styled(Link)`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const ProductArrow = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 37px;
  height: 37px;
  border-radius: 50%;
  border: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    background: var(--ink);
    color: var(--paper);
  }
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

/* =====================================================
   CAMPAGNE
===================================================== */

const Campaign = styled.section`
  min-height: 650px;
  position: relative;
  background: #24221f;
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;

  .visual {
    position: relative;
    width: 100%;
    min-height: 650px;
    overflow: hidden;
  }

  .visual img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  &:hover .visual img {
    transform: scale(1.07);
  }

  .copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 12%;
  }

  .copy small {
    color: #c5a984;
    letter-spacing: 3px;
    font-size: 10px;
    text-transform: uppercase;
  }

  h2 {
    font-family: Georgia, serif;
    font-size: clamp(45px, 6vw, 85px);
    line-height: 0.99;
    letter-spacing: -3px;
    font-weight: 400;
    margin: 30px 0;
  }

  p {
    color: rgba(255, 255, 255, 0.65);
    line-height: 2;
    font-size: 13px;
    max-width: 400px;
  }

  a {
    margin-top: 30px;
    display: inline-flex;
    align-items: center;
    gap: 20px;
    width: fit-content;
    padding-bottom: 12px;
    border-bottom: 1px solid #c5a984;
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 10px;
    font-weight: 800;
  }

  @media (max-width: 750px) {
    grid-template-columns: 1fr;

    .visual {
      height: 500px;
      min-height: 500px;
    }

    .copy {
      padding: 60px 8%;
    }
  }
`;

/* =====================================================
   VIDÉOS
===================================================== */

const VideoSection = styled.section`
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;

  .video-shell {
    position: relative;
    width: 100%;
    height: 100svh;
    min-height: 500px;
    overflow: hidden;
    background: #171715;
  }

  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .controls {
    position: absolute;
    z-index: 2;
    left: 25px;
    right: 25px;
    bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(12px);
    color: white;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: 0.3s;
  }

  button:hover {
    background: #927657;
  }

  .video-title {
    color: var(--ink);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 25px 5%;
  }

  h3 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(27px, 4vw, 45px);
    margin: 0;
  }

  .genres {
    display: flex;
    gap: 18px;
  }

  .genres button {
    width: auto;
    height: auto;
    border: none;
    border-radius: 0;
    color: var(--muted);
    background: none;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .genres button.active {
    color: var(--accent);
    border-bottom: 1px solid var(--accent);
  }

  @media (max-width: 650px) {
    .video-shell {
      height: 100svh;
      min-height: 450px;
    }

    .video-title {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

/* =====================================================
   BEST SELLERS
===================================================== */

const BestsellerSection = styled.section`
  width: 100%;
  background: ${({ $dark }) => ($dark ? "#222220" : "#E8E3D9")};

  .best-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }

  .best-main {
    position: relative;
    display: block;
    width: 100%;
    height: 680px;
    overflow: hidden;
  }

  .best-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1s;
  }

  .best-main:hover img {
    transform: scale(1.07);
  }

  .best-copy {
    padding: 60px 8%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .best-copy h2 {
    font-family: Georgia, serif;
    font-weight: 400;
    font-size: clamp(43px, 5vw, 75px);
    line-height: 1;
    letter-spacing: -3px;
  }

  .best-copy p {
    color: var(--muted);
    line-height: 2;
    font-size: 13px;
    max-width: 400px;
  }

  .mini-list {
    display: flex;
    flex-direction: column;
    gap: 17px;
    margin-top: 45px;
  }

  .mini {
    display: flex;
    align-items: center;
    gap: 17px;
    text-decoration: none;
    color: var(--ink);
    border-bottom: 1px solid var(--line);
    padding-bottom: 15px;
  }

  .mini img {
    width: 76px;
    height: 88px;
    object-fit: cover;
  }

  .mini strong {
    font-family: Georgia, serif;
    font-size: 17px;
    font-weight: 400;
  }

  .mini small {
    display: block;
    margin-top: 8px;
    font-size: 11px;
    color: var(--muted);
  }

  @media (max-width: 800px) {
    .best-grid {
      grid-template-columns: 1fr;
    }

    .best-main {
      height: 550px;
    }

    .best-copy {
      padding: 45px 7%;
    }
  }
`;

/* =====================================================
   SERVICES
===================================================== */

const Benefits = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  article {
    padding: 40px 30px;
    border-right: 1px solid var(--line);
  }

  article:last-child {
    border: none;
  }

  .icon {
    color: var(--accent);
    font-size: 23px;
  }

  h3 {
    font-family: Georgia, serif;
    font-size: 22px;
    font-weight: 400;
    margin: 22px 0 10px;
  }

  p {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.9;
    max-width: 270px;
  }

  @media (max-width: 750px) {
    grid-template-columns: 1fr;

    article {
      border-right: none;
      border-bottom: 1px solid var(--line);
      padding: 30px 10px;
    }
  }
`;

/* =====================================================
   WHATSAPP
===================================================== */

const WhatsApp = styled.a`
  position: fixed;
  z-index: 9999;
  right: 25px;
  bottom: 25px;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  background: #20c76a;
  color: white;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  font-size: 25px;
  text-decoration: none;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px) scale(1.05);
  }
`;

/* =====================================================
   COMPOSANT PRINCIPAL
===================================================== */

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [precommandeDisponible, setPrecommandeDisponible] =
    useState(false);

  const [slide, setSlide] = useState(0);
  const [videoGenre, setVideoGenre] = useState("homme");
  const [videoIndex, setVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "light";

  const videoRef = useRef(null);
  const productRailRef = useRef(null);

  const reduceMotion = useReducedMotion();

  /* PARALLAX GLOBAL DU HERO */

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.35],
    [0, 170]
  );

  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.12, 1]
  );

  /* FETCH */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const requests = await Promise.allSettled([
        fetch(`${API_URL}/api/produits`).then((r) => {
          if (!r.ok) throw new Error("Produits");
          return r.json();
        }),

        fetch(`${API_URL}/api/videos/produits`).then((r) => {
          if (!r.ok) throw new Error("Vidéos");
          return r.json();
        }),

        fetch(`${API_URL}/api/produits/best-sellers`).then((r) => {
          if (!r.ok) throw new Error("Best sellers");
          return r.json();
        }),

        fetch(`${API_URL}/api/precommandes/modeles`).then((r) => {
          if (!r.ok) throw new Error("Précommandes");
          return r.json();
        }),
      ]);

      if (!mounted) return;

      const [p, v, b, pre] = requests;

      if (p.status === "fulfilled") {
        setProducts(Array.isArray(p.value) ? p.value : []);
      }

      if (v.status === "fulfilled") {
        setVideos(
          Array.isArray(v.value?.videos)
            ? v.value.videos.filter(
                (x) => x?.url && x?.produitId
              )
            : []
        );
      }

      if (b.status === "fulfilled") {
        setBestSellers(
          (Array.isArray(b.value) ? b.value : [])
            .filter(
              (x) =>
                x.bestSeller === true &&
                x.disponible === true &&
                !isPreorder(x) &&
                x.images?.[0]?.url
            )
            .slice(0, 5)
        );
      }

      if (pre.status === "fulfilled") {
        const data = pre.value;

        const models = Array.isArray(data)
          ? data
          : data.modeles || data.data || [];

        setPrecommandeDisponible(models.length > 0);
      }
    };

    load().catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  /* DONNÉES */

  const heroProducts = useMemo(
    () =>
      products.filter(
        (p) => p.hero && p.images?.[0]?.url
      ),
    [products]
  );

  const heroProduct =
    heroProducts[slide] || heroProducts[0];

  const heroImage = media(heroProduct?.images?.[0]?.url);

  const menProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          genreOf(p.genre) === "homme" &&
          !isPreorder(p) &&
          p.images?.[0]?.url
      ),
    [products]
  );

  const womenProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          genreOf(p.genre) === "femme" &&
          !isPreorder(p) &&
          p.images?.[0]?.url
      ),
    [products]
  );

  const focusProducts = useMemo(() => {
    const ids = new Set(
      bestSellers.map((p) => String(p._id))
    );

    return products
      .filter(
        (p) =>
          !isPreorder(p) &&
          p.images?.[0]?.url &&
          !ids.has(String(p._id))
      )
      .slice(0, 8);
  }, [products, bestSellers]);

  const videosByGenre = useMemo(() => {
    const result = { homme: [], femme: [] };

    videos.forEach((video) => {
      const id =
        typeof video.produitId === "object"
          ? String(
              video.produitId?._id ||
                video.produitId?.id ||
                ""
            )
          : String(video.produitId || "");

      const product = products.find(
        (p) => String(p._id) === id
      );

      const genre = genreOf(product?.genre);

      if (product && result[genre]) {
        result[genre].push({
          ...video,
          produit: product,
          videoUrl: media(video.url),
        });
      }
    });

    return result;
  }, [videos, products]);

  const activeVideos = videosByGenre[videoGenre] || [];
  const activeVideo = activeVideos[videoIndex];

  /* SLIDER HERO */

  useEffect(() => {
    if (heroProducts.length <= 1) return;

    const timer = setInterval(() => {
      setSlide((i) => (i + 1) % heroProducts.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [heroProducts.length]);

  /* VIDÉOS */

  useEffect(() => {
    setVideoIndex(0);
    setPlaying(true);
    setMuted(true);
  }, [videoGenre]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !activeVideo) return;

    video.load();

    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [activeVideo?._id, activeVideo?.url]);

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const nextVideo = () => {
    if (activeVideos.length > 1) {
      setVideoIndex(
        (i) => (i + 1) % activeVideos.length
      );
    }
  };

  /* RENDER */

  return (
    <Page $dark={isDark}>
      {/* HERO CINÉMATIQUE */}

      <Hero>
        <motion.div
          className="hero-parallax"
          style={{
            y: reduceMotion ? 0 : heroY,
            scale: reduceMotion ? 1 : heroScale,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroImage || "hero-default"}
              className="hero-image"
              style={{
                backgroundImage: heroImage
                  ? `url("${heroImage}")`
                  : "linear-gradient(120deg,#50483e,#171715)",
              }}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 1.2 }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, scale: 1.08 }
              }
              transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

          </AnimatePresence>

          {heroImage && !reduceMotion && (
            <WebGLHero src={heroImage} />
          )}
        </motion.div>

        <div className="hero-overlay" />

        <motion.div
          className="hero-content"
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 55 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <small>NUMA — COLLECTIONS CONTEMPORAINES</small>

          <h1>
            L'élégance
            <br />
            en mouvement.
          </h1>

          <p>
            Découvrez une autre vision du style.
          </p>
        </motion.div>

        {heroProducts.length > 1 && (
          <div className="hero-counter">
            {String(slide + 1).padStart(2, "0")}
            <span />
            {String(heroProducts.length).padStart(2, "0")}
          </div>
        )}

        <motion.div
          className="hero-progress"
          key={slide}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 6.5,
            ease: "linear",
          }}
        />
      </Hero>

      {/* INTRODUCTION */}

      <Intro>
        <Container>
          <Reveal>
            <div className="number">
              01 — NOTRE VISION
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <h2>
              Le style n'est pas une tendance.
              C'est une <em>signature.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.3}>
            <p>
              NUMA célèbre une mode contemporaine,
              expressive et intemporelle. Des pièces
              sélectionnées pour celles et ceux qui savent
              que chaque détail compte.
            </p>
          </Reveal>
        </Container>
      </Intro>

      {/* UNIVERS HOMME / FEMME */}

      <UniverseGrid>
        {[
          {
            title: "Homme",
            genre: "homme",
            items: menProducts,
            label: "01 / MENSWEAR",
          },
          {
            title: "Femme",
            genre: "femme",
            items: womenProducts,
            label: "02 / WOMENSWEAR",
          },
        ].map((item, index) => (
          <TiltCard
            key={item.genre}
            className="universe-tilt"
          >
            <UniverseCard to={`/${item.genre}`}>
              {item.items[0]?.images?.[0]?.url && (
                <motion.img
                  src={media(
                    item.items[0].images[0].url
                  )}
                  alt={`Collection ${item.title}`}
                  loading="lazy"
                  initial={{ scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.15,
                  }}
                />
              )}

              <div className="shade" />

              <div className="top">{item.label}</div>

              <div className="bottom">
                <h3>{item.title}</h3>

                <span className="arrow">
                  <ArrowUpRight size={23} />
                </span>
              </div>
            </UniverseCard>
          </TiltCard>
        ))}
      </UniverseGrid>

      {/* SÉLECTION PRODUITS */}

      <Section>
        <Container>
          <Reveal>
            <SectionHeading>
              <div>
                <Eyebrow>LA SÉLECTION NUMA</Eyebrow>

                <h2>
                  Des pièces.
                  <br />
                  Du caractère.
                </h2>
              </div>

              <p>
                Une sélection de créations qui conjuguent
                silhouette, matière et personnalité.
              </p>
            </SectionHeading>
          </Reveal>
        </Container>

        {focusProducts.length > 0 ? (
          <ProductRail ref={productRailRef}>
            <motion.div
              className="product-track"
              drag={reduceMotion ? false : "x"}
              dragConstraints={productRailRef}
              dragElastic={0.08}
              dragTransition={{
                bounceStiffness: 200,
                bounceDamping: 30,
              }}
            >
              {focusProducts.map((product, index) => (
                <Reveal
                  key={product._id}
                  delay={index * 0.07}
                  y={45}
                >
                  <TiltCard>
                    <ProductCard>
                      <div className="photo">
                        <ProductPhotoLink
                          to={`/produit/${product._id}`}
                          aria-label={`Découvrir ${product.title}`}
                        />

                        <img
                          src={media(
                            product.images?.[0]?.url
                          )}
                          alt={product.title}
                          loading="lazy"
                        />

                        {index === 0 && (
                          <span className="tag">
                            Sélection
                          </span>
                        )}
                      </div>

                      <div className="details">
                        <div className="category">
                          {genreOf(product.genre) === "femme"
                            ? "Femme"
                            : "Homme"}
                        </div>

                        <ProductMeta>
                          <div>
                            <h3>{product.title}</h3>

                            <span className="price">
                              {Number(
                                product.price || 0
                              ).toLocaleString("fr-FR")}{" "}
                              FCFA
                            </span>
                          </div>

                          <ProductArrow
                            to={`/produit/${product._id}`}
                            aria-label={`Voir ${product.title}`}
                          >
                            <ArrowUpRight size={17} />
                          </ProductArrow>
                        </ProductMeta>
                      </div>
                    </ProductCard>
                  </TiltCard>
                </Reveal>
              ))}
            </motion.div>
          </ProductRail>
        ) : (
          <Container>
            <p>Aucun produit disponible actuellement.</p>
          </Container>
        )}

        <Container>
          <div
            style={{
              textAlign: "center",
              marginTop: 35,
            }}
          >
            <TextLink to="/collections">
              Voir toute la collection{" "}
              <ArrowRight size={16} />
            </TextLink>
          </div>
        </Container>
      </Section>

      {/* CAMPAGNE */}

      <Campaign>
        <motion.div
          className="visual"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true }}
          transition={{
            duration: 1.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {focusProducts[0]?.images?.[0]?.url && (
            <motion.img
              src={media(
                focusProducts[0].images[0].url
              )}
              alt="Campagne NUMA"
              loading="lazy"
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
          )}
        </motion.div>

        <Reveal className="copy" y={45}>
          <small>03 — L'ESPRIT NUMA</small>

          <h2>Nos promotions</h2>

          <p>
            Découvrez nos offres et promotions sur une
            sélection de pièces.
          </p>

          <Link to="/promo">
            Explorer les promotions{" "}
            <ArrowRight size={17} />
          </Link>
        </Reveal>
      </Campaign>

      {/* VIDÉOS */}

      <VideoSection>
        <Container>
          <Reveal>
            <SectionHeading>
              <div>
                <Eyebrow>NUMA EN MOUVEMENT</Eyebrow>

                <h2>
                  Une autre façon
                  <br />
                  de voir la mode.
                </h2>
              </div>

              <p>
                Découvrez nos créations autrement,
                à travers nos vidéos et nos campagnes.
              </p>
            </SectionHeading>
          </Reveal>
        </Container>

        {activeVideo ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVideo._id}
              className="video-shell"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 1.04 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7 }}
            >
              <video
                ref={videoRef}
                key={activeVideo._id}
                src={activeVideo.videoUrl}
                autoPlay
                muted={muted}
                playsInline
                preload="metadata"
                onEnded={nextVideo}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />

              <div className="controls">
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <button
                    onClick={togglePlay}
                    aria-label="Lecture ou pause"
                  >
                    {playing ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    aria-label="Son"
                  >
                    {muted ? (
                      <VolumeX size={18} />
                    ) : (
                      <Volume2 size={18} />
                    )}
                  </button>
                </div>

                {activeVideos.length > 1 && (
                  <button
                    onClick={nextVideo}
                    aria-label="Vidéo suivante"
                  >
                    <ArrowRight size={19} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            style={{
              padding: 80,
              textAlign: "center",
              background: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            Les vidéos de cet univers arrivent bientôt.
          </div>
        )}

        <div className="video-title">
          <div>
            <Eyebrow>
              COLLECTION {videoGenre.toUpperCase()}
            </Eyebrow>

            <h3>
              {activeVideo?.produit?.title ||
                "L'univers NUMA"}
            </h3>
          </div>

          <div className="genres">
            {["homme", "femme"].map((genre) => (
              <button
                key={genre}
                className={
                  videoGenre === genre ? "active" : ""
                }
                onClick={() => setVideoGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </VideoSection>

      {/* BEST SELLERS */}

      {bestSellers.length > 0 && (
        <BestsellerSection $dark={isDark}>
          <div className="best-grid">
            <Link
              className="best-main"
              to={`/produit/${bestSellers[0]._id}`}
            >
              <motion.img
                src={media(
                  bestSellers[0].images?.[0]?.url
                )}
                alt={bestSellers[0].title}
                loading="lazy"
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />
            </Link>

            <Reveal className="best-copy" y={55}>
              <Eyebrow>LES PLUS APPRÉCIÉS</Eyebrow>

              <h2>Les incontournables NUMA.</h2>

              <p>
                Les pièces qui séduisent, inspirent et
                deviennent rapidement indispensables.
              </p>

              <TextLink to="/new">
                Découvrir les nouveautés{" "}
                <ArrowRight size={16} />
              </TextLink>

              <div className="mini-list">
                {bestSellers.slice(0, 4).map(
                  (product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{
                        opacity: 0,
                        x: 35,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.12,
                      }}
                    >
                      <Link
                        className="mini"
                        to={`/produit/${product._id}`}
                      >
                        <img
                          src={media(
                            product.images?.[0]?.url
                          )}
                          alt={product.title}
                          loading="lazy"
                        />

                        <div>
                          <strong>{product.title}</strong>

                          <small>
                            {Number(
                              product.price || 0
                            ).toLocaleString("fr-FR")}{" "}
                            FCFA
                          </small>
                        </div>

                        <ArrowUpRight size={18} />
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            </Reveal>
          </div>
        </BestsellerSection>
      )}

      {/* PRÉCOMMANDES */}

      {precommandeDisponible && (
        <Section>
          <Container>
            <Campaign>
              <motion.div
                className="visual"
                initial={{ opacity: 0, scale: 1.08 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              >
                {heroProduct?.images?.[0]?.url && (
                  <img
                    src={media(
                      heroProduct.images[0].url
                    )}
                    alt="Précommandes NUMA"
                  />
                )}
              </motion.div>

              <Reveal className="copy">
                <small>ÉDITIONS À VENIR</small>

                <h2>
                  Les prochaines pièces se préparent.
                </h2>

                <p>
                  Accédez à nos modèles disponibles en
                  précommande et soyez parmi les premiers
                  à les découvrir.
                </p>

                <Link to="/precommande">
                  Découvrir les précommandes{" "}
                  <ArrowRight size={17} />
                </Link>
              </Reveal>
            </Campaign>
          </Container>
        </Section>
      )}

      {/* SERVICES */}

      <Section>
        <Container>
          <Reveal>
            <SectionHeading>
              <div>
                <Eyebrow>LA SIGNATURE NUMA</Eyebrow>

                <h2>
                  Une expérience
                  <br />à la hauteur de vos attentes.
                </h2>
              </div>

              <p>
                Bien plus qu'une collection, une expérience
                pensée pour vous accompagner à chaque étape.
              </p>
            </SectionHeading>
          </Reveal>

          <Benefits>
            {[
              {
                icon: <FaTruck />,
                title: "Livraison",
                text: "Vos commandes sont préparées avec soin et expédiées dans les meilleures conditions.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Paiement sécurisé",
                text: "Profitez d'une expérience d'achat sécurisée et d'un parcours simple.",
              },
              {
                icon: <FaUndo />,
                title: "Accompagnement",
                text: "Notre équipe reste disponible pour vous guider avant et après votre commande.",
              },
            ].map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 0.12}
              >
                <motion.article
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -8 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <div className="icon">
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>
                </motion.article>
              </Reveal>
            ))}
          </Benefits>
        </Container>
      </Section>

      {/* WHATSAPP */}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 1,
          type: "spring",
          stiffness: 200,
        }}
      >
        <WhatsApp
          href="https://wa.me/2250700247693"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter NUMA sur WhatsApp"
        >
          <FaWhatsapp />
        </WhatsApp>
      </motion.div>
    </Page>
  );
}
