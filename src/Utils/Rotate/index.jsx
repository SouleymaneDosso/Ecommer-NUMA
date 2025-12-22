import styled, { keyframes } from "styled-components";

/* 🔄 Animation rotation premium */
const spin = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.05);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;

/* 🌑 Wrapper plein écran */
export const LoaderWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1e293b, #020617);
`;

/* ⚡ Loader CR7 ULTRA PRO */
export const Loader = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: conic-gradient(
    #2563eb,
    #22c55e,
    #eab308,
    #ef4444,
    #a855f7,
    #2563eb
  );
  animation: ${spin} 1.2s linear infinite;
  position: relative;

  box-shadow:
    0 0 15px rgba(37, 99, 235, 0.8),
    0 0 30px rgba(168, 85, 247, 0.6),
    0 0 60px rgba(34, 197, 94, 0.4);

  /* 🔘 Cercle intérieur clean */
  &::before {
    content: "";
    position: absolute;
    inset: 7px;
    background: #020617;
    border-radius: 50%;
  }
`;
