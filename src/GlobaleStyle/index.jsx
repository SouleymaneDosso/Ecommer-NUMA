import { createGlobalStyle } from "styled-components";
import { ThemeContext } from "../Utils/Context";
import { useContext } from "react";

const HEADER_HEIGHT = 70;

const StyledGlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
  min-height: 100vh;
  overflow-x: hidden;

  /* padding-top seulement si ce n'est pas la page hero */
  padding-top: ${({ $hero }) => ($hero ? "0" : `${HEADER_HEIGHT}px`)};

  background: ${({ $isDark }) =>
    $isDark
      ? "linear-gradient(145deg, #111, #111 60%, #111)"
      : "linear-gradient(145deg, #ffffff, #f5f5f7 60%, #e8eaed)"};

  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#111")};

  transition: background 0.45s ease, color 0.35s ease, padding-top 0.3s ease;
}

  ::selection {
    background: ${({ $isDark }) => ($isDark ? "#3b82f6" : "#2563eb")};
    color: white;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ $isDark }) =>
      $isDark
        ? "rgba(255,255,255,0.25)"
        : "rgba(0,0,0,0.20)"};
    border-radius: 20px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ $isDark }) =>
      $isDark
        ? "rgba(255,255,255,0.4)"
        : "rgba(0,0,0,0.35)"};
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  input {
    font-size: 16px;
  }
`;

function GlobalStyle({ heroPage }) {
  const { theme } = useContext(ThemeContext);

  const isDarkMode = theme === "light";

  return <StyledGlobalStyle $isDark={isDarkMode} $hero={heroPage} />;
}

export default GlobalStyle;