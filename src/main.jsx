import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GlobalStyle from "./GlobaleStyle";
import { ToggleTheme} from "./Utils/Context";
import Footer from "./components/Footer";
import Homme from "./pages/Homme";
import Femme from "./pages/Femme";
import Enfant from "./pages/Enfant";
import Produit from "./pages/produits";
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
            <Route path="/homme" element={<Homme />} />
            <Route path="/femme" element={<Femme />} />
            <Route path="/enfant" element={<Enfant />} />
            <Route path="/produit/:id" element={<Produit />} />
            <Route path="*" element={<Erreur />} />
          </Routes>
          <Footer />
      </ToggleTheme>
    </Router>
  </StrictMode>
);
