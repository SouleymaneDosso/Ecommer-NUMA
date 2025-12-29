import { createGlobalStyle } from "styled-components";
import { ThemeContext } from "../Utils/Context";
import { useContext } from "react";

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

    background: ${({ $isDark }) =>
      $isDark
        ? "linear-gradient(145deg, #0F172A, #1E293B 60%, #334155)"
        : "linear-gradient(145deg, #ffffff, #f5f5f7 60%, #e8eaed)"};

    color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#1f2937")};
    transition: background 0.45s ease, color 0.35s ease;
  }

  ::selection {
    background: ${({ $isDark }) => ($isDark ? "#3b82f6" : "#2563eb")};
    color: white;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ $isDark }) =>
      $isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)"};
    border-radius: 20px;
  }
`;

function GlobalStyle() {
  const { theme } = useContext(ThemeContext);

  // Ici $isDark = true si le thème est 'dark'
  const isDarkMode = theme === "light";

  return <StyledGlobalStyle $isDark={isDarkMode} />;
}

export default GlobalStyle;
