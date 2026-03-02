import styled, { keyframes } from "styled-components";

/* Rotation douce */
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/* Wrapper simple, sans flashy */
export const LoaderWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
`;

/* Loader minimal, style luxe */
export const Loader = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid #e5e5e5;
  border-top-color: #111;
  animation: ${spin} 1s linear infinite;
`;