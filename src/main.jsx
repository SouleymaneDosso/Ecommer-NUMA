import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GlobalStyle from "./GlobaleStyle";
import { ToggleTheme } from "./Utils/Context";
import { Panier } from "./Utils/Context";
import ScrollToTop from "./components/ScrollToTop";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Favorie from "./pages/favorie";
import Homme from "./pages/Homme";
import Femme from "./pages/Femme";
import Enfant from "./pages/Enfant";
import PagePanier from "./components/panier";
import Produit from "./pages/produits";
import New from "./pages/new";
import Promo from "./pages/promo";
import Apropos from "./pages/apropos";
import FAQ from "./pages/faq";
import Contact from "./pages/contact";
import ReturnPolicy from "./pages/politiqueretour";
import Delivery from "./pages/livraison";
import TermsOfUse from "./pages/conditionutilisation";
import Collection from "./pages/Collection";
import Signup from "./pages/inscription";
import Login from "./pages/connexion";
import Search from "./pages/recherche";
import CompteClient from "./pages/compteutilisateur";
import PaiementWave from "./pages/PaiementWave";
import PaiementSemiManuel from "./pages/PaiementSemiManuel";
import Merci from "./pages/Merci";
import Erreur from "./components/Erreur";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import AdminProducts from "./pages/AdminProducts";
import AdminCommandes from "./pages/AdminCommande";
import AdminPaiements from "./pages/AdminPaiements";

import "./i18n";

// --- Layout pour les pages publiques ---
const PublicLayout = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ToggleTheme>
        <Panier>
          <GlobalStyle />
          <Routes>
            {/* Pages publiques */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/homme"
              element={
                <PublicLayout>
                  <Homme />
                </PublicLayout>
              }
            />
            <Route
              path="/femme"
              element={
                <PublicLayout>
                  <Femme />
                </PublicLayout>
              }
            />
            <Route
              path="/enfant"
              element={
                <PublicLayout>
                  <Enfant />
                </PublicLayout>
              }
            />
            <Route
              path="/collections"
              element={
                <PublicLayout>
                  <Collection />
                </PublicLayout>
              }
            />
            <Route
              path="/new"
              element={
                <PublicLayout>
                  <New />
                </PublicLayout>
              }
            />
            <Route
              path="/promo"
              element={
                <PublicLayout>
                  <Promo />
                </PublicLayout>
              }
            />

            <Route
              path="/search"
              element={
                <PublicLayout>
                  <Search />
                </PublicLayout>
              }
            />

            <Route
              path="/apropo"
              element={
                <PublicLayout>
                  <Apropos />
                </PublicLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <PublicLayout>
                  <FAQ />
                </PublicLayout>
              }
            />
            <Route
              path="/politiqueretour"
              element={
                <PublicLayout>
                  <ReturnPolicy />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <Contact />
                </PublicLayout>
              }
            />
            <Route
              path="/livraison"
              element={
                <PublicLayout>
                  <Delivery />
                </PublicLayout>
              }
            />
            <Route
              path="/conditionUtilisation"
              element={
                <PublicLayout>
                  <TermsOfUse />
                </PublicLayout>
              }
            />
            <Route
              path="/favoris"
              element={
                <PublicLayout>
                  <Favorie />
                </PublicLayout>
              }
            />
            <Route
              path="/produit/:id"
              element={
                <PublicLayout>
                  <Produit />
                </PublicLayout>
              }
            />
            <Route
              path="/panier"
              element={
                <PublicLayout>
                  <PagePanier />
                </PublicLayout>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicLayout>
                  <Signup />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/compte"
              element={
                <PublicLayout>
                  <CompteClient />
                </PublicLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <PublicLayout>
                  <PaiementWave />
                </PublicLayout>
              }
            />

            <Route
              path="/paiement-semi/:id"
              element={
                <PublicLayout>
                  <PaiementSemiManuel />
                </PublicLayout>
              }
            />
            <Route
              path="/merci"
              element={
                <PublicLayout>
                  <Merci />
                </PublicLayout>
              }
            />

            <Route
              path="*"
              element={
                <PublicLayout>
                  <Erreur />
                </PublicLayout>
              }
            />

            {/* Pages admin sans Header et Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminCommandes />} />
              <Route path="paiement" element={<AdminPaiements />} />
            </Route>
          </Routes>
        </Panier>
      </ToggleTheme>
    </Router>
  </StrictMode>
);
