import { createGlobalStyle } from "styled-components";
import { ThemeContext } from "../Utils/Context";
import { useContext } from "react";

const StyledGlobalStyle = createGlobalStyle`
  /* Reset et typographie */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  body {
    overflow-x: hidden;
    min-height: 100vh;
    background: ${({ $isDark }) =>
      $isDark
        ? "linear-gradient(145deg, #0F172A, #1E293B 60%, #334155)"
        : "linear-gradient(145deg, #ffffff, #f5f5f7 60%, #e8eaed)"};
    color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#1f2937")};
    transition: background 0.45s ease, color 0.35s ease;

    /* Effet doux de flou */
    backdrop-filter: blur(10px);

    /* Animation d'apparition */
    animation: fadeInPage 0.6s ease forwards;
  }

  @keyframes fadeInPage {
    0% {
      opacity: 0;
      transform: translateY(12px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Sélection du texte */
  ::selection {
    background: ${({ $isDark }) => ($isDark ? "#3b82f6" : "#2563eb")};
    color: white;
  }

  /* Scrollbar moderne */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)"};
    border-radius: 20px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
`;

function GlobalStyle() {
  const { theme } = useContext(ThemeContext);

  // Ici $isDark = true si le thème est 'dark'
  const isDarkMode = theme === "light";

  return <StyledGlobalStyle $isDark={isDarkMode} />;
}

export default GlobalStyle;
