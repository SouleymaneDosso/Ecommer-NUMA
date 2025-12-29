import styled, { keyframes } from "styled-components";

/* 🔄 Animation rotation douce premium */
const spin = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.08);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;

/* 🌑 Wrapper plein écran luxueux */
export const LoaderWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #111827, #03040b);
`;

/* ⚡ Loader premium, style boutique mode */
export const Loader = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #2563eb 0%,
    #10b981 25%,
    #f59e0b 50%,
    #ef4444 75%,
    #a855f7 100%
  );
  animation: ${spin} 1.5s ease-in-out infinite;
  position: relative;

  box-shadow:
    0 0 12px rgba(37, 99, 235, 0.7),
    0 0 24px rgba(168, 85, 247, 0.5),
    0 0 48px rgba(34, 197, 94, 0.3);

  /* 🔘 Cercle intérieur clean pour effet “luxury” */
  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    background: #03040b;
    border-radius: 50%;
  }

  /* Option : petit halo externe subtil */
  &::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
  }
`;
