import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GlobalStyle from "./GlobaleStyle";
import { ToggleTheme} from "./Utils/Context";
import Footer from "./components/Footer";
import Erreur from "./components/Erreur";
import "./i18n"; 


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ToggleTheme>
          <GlobalStyle />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Erreur />} />
          </Routes>
          <Footer />
      </ToggleTheme>
    </Router>
  </StrictMode>
);
