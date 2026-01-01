import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

/* ===============================
   CONFIG API
================================ */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/* ===============================
   STYLES
================================ */
const Wrapper = styled.div`
  padding: 40px 16px;
  max-width: 1200px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: 24px;
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  select, input {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 0.9rem;
    cursor: pointer;
  }

  input[type="number"] {
    width: 100px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
`;

const Card = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 14px;
`;

const ProductTitle = styled.h3`
  font-size: 0.95rem;
  margin: 0 0 6px;
`;

const Price = styled.div`
  font-weight: 700;
`;

const Message = styled.div`
  padding: 40px 0;
  text-align: center;
  font-size: 1.05rem;
  opacity: 0.7;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 400px;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 50px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: #0077ff;
    box-shadow: 0 0 8px rgba(0, 119, 255, 0.3);
  }
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ccc;
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: 10px 14px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

/* ===============================
   HELPERS
================================ */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ===============================
   COMPONENT
================================ */
export default function Search() {
  const queryParams = useQuery();
  const initialQuery = queryParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // Rechercher produits (live + filtre)
  useEffect(() => {
    const fetchProduits = async () => {
      if (!query.trim()) {
        setProduits([]);
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        let url = `${API_URL}/api/produits?search=${encodeURIComponent(query)}`;
        if (categorieFilter) url += `&categorie=${encodeURIComponent(categorieFilter)}`;
        if (genreFilter) url += `&genre=${encodeURIComponent(genreFilter)}`;
        if (prixMin) url += `&minPrice=${prixMin}`;
        if (prixMax) url += `&maxPrice=${prixMax}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur serveur");

        const data = await res.json();
        setProduits(data);

        const cats = [...new Set(data.map(p => p.categorie))];
        setCategories(cats);

        // Suggestions
        const sugg = data.map(p => p.title).slice(0, 5);
        setSuggestions(sugg);
        setShowSuggestions(true);

      } catch (err) {
        console.error("❌ Search error:", err);
        setError("Une erreur est survenue lors de la recherche.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [query, categorieFilter, genreFilter, prixMin, prixMax]);

  const handleSuggestionClick = (title) => {
    setQuery(title);
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Wrapper>
      <Title>
        Résultats pour : <strong>“{query}”</strong>
      </Title>

      {/* ===== Recherche + suggestions ===== */}
      <SearchInputWrapper ref={inputRef}>
        <SearchInput
          type="text"
          placeholder="Rechercher un produit…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <Suggestions>
            {suggestions.map((s, i) => (
              <SuggestionItem key={i} onClick={() => handleSuggestionClick(s)}>
                {s}
              </SuggestionItem>
            ))}
          </Suggestions>
        )}
      </SearchInputWrapper>

      {/* ===== Filtres ===== */}
      <Filters>
        <select value={categorieFilter} onChange={e => setCategorieFilter(e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">Tous genres</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="unisex">Unisex</option>
        </select>

        <input
          type="number"
          placeholder="Prix min"
          value={prixMin}
          onChange={e => setPrixMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Prix max"
          value={prixMax}
          onChange={e => setPrixMax(e.target.value)}
        />
      </Filters>

      {loading && <Message>Recherche en cours…</Message>}
      {!loading && error && <Message>{error}</Message>}
      {!loading && !error && produits.length === 0 && <Message>Aucun produit trouvé.</Message>}

      {!loading && !error && produits.length > 0 && (
        <Grid>
          {produits.map(p => {
            const mainImage = p.images?.find(img => img.isMain)?.url || p.images?.[0]?.url;
            return (
              <Card key={p._id} to={`/produit/${p._id}`}>
                {mainImage && <Image src={mainImage} alt={p.title} />}
                <CardBody>
                  <ProductTitle>{p.title}</ProductTitle>
                  <Price>{p.price} €</Price>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      )}
    </Wrapper>
  );
}
