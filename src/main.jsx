import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GlobalStyle from "./GlobaleStyle";
import { ToggleTheme} from "./Utils/Context";
import { Panier } from "./Utils/Context";
import Footer from "./components/Footer";
import Favorie from "./pages/favorie";
import Homme from "./pages/Homme";
import Femme from "./pages/Femme";
import Enfant from "./pages/Enfant";
import PagePanier from "./components/panier";
import Produit from "./pages/produits";
import Erreur from "./components/Erreur";
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminLayout from "./pages/AdminLayout";
import AdminProducts from "./pages/AdminProducts"
import Compte from "./pages/compteutilisateur"
import Collection from "./pages/Collection"
import "./i18n"; 


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ToggleTheme>
        <Panier>
          <GlobalStyle />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/homme" element={<Homme />} />
            <Route path="/femme" element={<Femme />} />
            <Route path="/enfant" element={<Enfant />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/favoris" element={<Favorie />} />
            <Route path="/produit/:id" element={<Produit />} />
            <Route path="/panier" element={<PagePanier />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            </Route>
            <Route path="*" element={<Erreur />} />
          </Routes>
          <Footer />
          </Panier>
      </ToggleTheme>
    </Router>
  </StrictMode>
);
